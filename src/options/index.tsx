// You can rename this file to index.tsx to use this file as the entry point
// Then you can develop the extension option page as UI

import '~style.css';
import React, { useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { Tabs, Tab } from '@heroui/react';
import cssText from 'data-text:~style.css';
import Header, { type LayoutMode } from '~/components/Header';
import DynamicTab from '~/components/Sync/DynamicTab';
import VideoTab from '~/components/Sync/VideoTab';
import { type SyncData, createTabsForPlatforms, injectScriptsToTabs } from '~sync/common';
import ArticleTab from '~components/Sync/ArticleTab';
import { refreshAllAccountInfo } from '~sync/account';
import ThreeColumnLayout from '~components/Layout/ThreeColumnLayout';

/**
 * Get the shadow container element for styling
 * @returns {Element} The shadow container element
 */
export function getShadowContainer() {
  return document.querySelector('#test-shadow').shadowRoot.querySelector('#plasmo-shadow-container');
}

/**
 * Get the shadow host ID
 * @returns {string} The shadow host ID
 */
export const getShadowHostId = () => 'test-shadow';

/**
 * Get the style element with injected CSS
 * @returns {HTMLStyleElement} The style element
 */
export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

/**
 * Options component for the extension settings page
 * @description Main component that handles the extension's options/settings interface
 * Manages tabs for different functionalities like dynamic posts, videos, articles, etc.
 */
const Options = () => {
  const [isReady, setIsReady] = useState(false);
  const [hashParams, setHashParams] = useState<Record<string, string>>({});
  // 布局模式：'three-column' 三栏布局（新），'tabs' 标签页布局（旧）
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('three-column');

  /**
   * Initialize the options page
   * Sets the page title and processes URL hash parameters
   */
  React.useEffect(() => {
    document.title = chrome.i18n.getMessage('extensionDisplayName');

    const hash = window.location.hash.slice(1);

    // Parse hash parameters from URL
    const params = {};
    hash.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
    setHashParams(params);
    setIsReady(true);

    refreshAllAccountInfo();
  }, []);

  /**
   * Handle content publishing across multiple platforms
   * @param {SyncData} data - The data to be published including content and target platforms
   */
  const funcPublish = async (data: SyncData) => {
    console.log('funcPublish', data);
    if (Array.isArray(data.platforms) && data.platforms.length > 0) {
      createTabsForPlatforms(data)
        .then(async (tabs) => {
          injectScriptsToTabs(tabs, data);

          // Notify tabs manager about new tabs
          chrome.runtime.sendMessage({
            type: 'MULTIPOST_EXTENSION_TABS_MANAGER_REQUEST_ADD_TABS',
            data: data,
            tabs: tabs,
          });

          // Activate tabs sequentially with delay
          for (const { tab } of tabs) {
            if (tab.id) {
              await chrome.tabs.update(tab.id, { active: true });
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          }
        })
        .catch((error) => {
          console.error('Error creating tabs or groups:', error);
        });
    } else {
      console.error('No valid platforms specified');
    }
  };

  /**
   * Scrape content from a given URL
   * @param {string} url - The URL to scrape content from
   * @returns {Promise<any>} The scraped content
   * @throws {Error} When URL is invalid or scraping fails
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const funcScraper = async (url: string): Promise<any> => {
    if (!url) {
      throw new Error('No valid URL provided');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const newTab = await chrome.tabs.create({ url, active: false });

        if (!newTab.id) {
          throw new Error('Failed to create new tab');
        }

        await chrome.tabs.update(newTab.id, { active: true });

        // Listen for tab load completion to start scraping
        const listener = (tabId: number, info: chrome.tabs.TabChangeInfo) => {
          if (tabId === newTab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.tabs
              .sendMessage(newTab.id!, { type: 'MULTIPOST_EXTENSION_REQUEST_SCRAPER_START' })
              .then(async (scraperResult) => {
                if (currentTab?.id) {
                  await chrome.tabs.update(currentTab.id, { active: true });
                  await chrome.tabs.remove(newTab.id);
                }
                resolve(scraperResult);
              })
              .catch(reject);
          }
        };

        chrome.tabs.onUpdated.addListener(listener);
      } catch (error) {
        console.error('Scraper operation error:', error);
        reject(new Error('Scraper operation failed'));
      }
    });
  };

  if (!isReady) {
    return null;
  }

  return (
    <HeroUIProvider>
      <Header
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
      />

      {layoutMode === 'three-column' ? (
        // 三栏布局模式
        <ThreeColumnLayout funcPublish={funcPublish} />
      ) : (
        // 经典标签页模式
        <main className="p-4 mx-auto w-full max-w-3xl md:max-w-screen-xl sm:max-w-7xl">
          <Tabs
            aria-label="sync publish"
            defaultSelectedKey={hashParams.tab || 'dynamic'}
            variant="underlined"
            size="md"
            color="primary"
            classNames={{
              base: 'flex justify-center',
              tabList: 'gap-4',
              tab: 'px-4 py-2 text-gray-500',
              cursor: 'bg-primary',
            }}>
            <Tab
              key="dynamic"
              title={chrome.i18n.getMessage('gDynamic')}>
              <DynamicTab funcPublish={funcPublish} />
            </Tab>
            <Tab
              key="article"
              title={chrome.i18n.getMessage('gArticle')}>
              <ArticleTab
                funcPublish={funcPublish}
                funcScraper={funcScraper}
              />
            </Tab>
            <Tab
              key="video"
              title={chrome.i18n.getMessage('gVideo')}>
              <VideoTab funcPublish={funcPublish} />
            </Tab>
          </Tabs>
        </main>
      )}
    </HeroUIProvider>
  );
};

export default Options;
