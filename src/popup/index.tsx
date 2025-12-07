import '~style.css';
import cssText from 'data-text:~style.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect } from 'react';

export const config: PlasmoCSConfig = {
  // matches: ["https://www.plasmo.com/*"]
};

export function getShadowContainer() {
  return document.querySelector('#test-shadow').shadowRoot.querySelector('#plasmo-shadow-container');
}

export const getShadowHostId = () => 'test-shadow';

export const getStyle = () => {
  const style = document.createElement('style');

  style.textContent = cssText;
  return style;
};

const IndexPopup = () => {
  useEffect(() => {
    // 打开插件内置的 options 页面，不依赖外部网站
    chrome.runtime.openOptionsPage();
  }, []);

  return <div></div>;
};

export default IndexPopup;
