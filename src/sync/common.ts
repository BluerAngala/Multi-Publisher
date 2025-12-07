import { getAccountInfoFromPlatformInfo, getAccountInfoFromPlatformInfos } from './account';
import { ArticleInfoMap } from './article';
import { DynamicInfoMap } from './dynamic';
import { getExtraConfigFromPlatformInfo, getExtraConfigFromPlatformInfos } from './extraconfig';
import { PodcastInfoMap } from './podcast';
import { VideoInfoMap } from './video';

export interface SyncDataPlatform {
  name: string;
  injectUrl?: string;
  extraConfig?:
    | {
        customInjectUrls?: string[]; // Beta 功能，用于自定义注入 URL
      }
    | unknown;
}

export interface SyncData {
  platforms: SyncDataPlatform[];
  isAutoPublish: boolean;
  data: DynamicData | ArticleData | VideoData | PodcastData;
  origin?: DynamicData | ArticleData | VideoData | PodcastData; // Beta 功能，用于临时存储，发布时不需要提供该字段
}

export interface DynamicData {
  title: string;
  content: string;
  images: FileData[];
  videos: FileData[];
}

export interface PodcastData {
  title: string;
  description: string;
  audio: FileData;
}

export interface FileData {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

export interface ArticleData {
  title: string;
  digest: string;
  cover: FileData;
  htmlContent: string;
  markdownContent: string;
  images?: FileData[]; // 发布时可不提供该字段
  // 微信公众号特有配置
  weixinOptions?: WeixinArticleOptions;
}

// 微信公众号文章配置选项
export interface WeixinArticleOptions {
  // 是否声明原创（默认 true）
  isOriginal?: boolean;
  // 创作来源类型：1=原创, 4=个人观点（默认 4）
  claimSourceType?: 1 | 4;
  // 创作来源说明（默认"个人观点，仅供参考"）
  claimSourceText?: string;
  // 是否开启赞赏（默认 true）
  enableReward?: boolean;
  // 赞赏自动回复 ID（默认 1）
  rewardReplyId?: number;
  // 是否开启广告（默认 true）
  enableAd?: boolean;
  // 原文链接
  sourceUrl?: string;
  // 是否允许转载（默认 false）
  allowReprint?: boolean;
  // 合集 ID 列表（可选，通过标题匹配或直接指定 ID）
  albumIds?: string[];
  // 合集标题列表（可选，通过标题匹配合集）
  albumTitles?: string[];
  // 付费设置
  paySettings?: WeixinPaySettings;
}

// 微信付费设置
export interface WeixinPaySettings {
  // 是否开启付费（默认 false）
  enabled: boolean;
  // 付费金额（单位：分，如 1000 = 10元）
  fee: number;
  // 免费预览比例（0-100，如 91 表示 91% 免费）
  previewPercent: number;
  // 付费说明文字
  description?: string;
}

// 微信合集信息
export interface WeixinAlbumInfo {
  id: string;
  title: string;
  total: number;
  url: string;
  continous_read_on?: number;
  cover_url?: string;
  create_time?: number;
  update_time?: number;
}

export interface VideoData {
  title: string;
  content: string;
  video: FileData;
  tags?: string[];
  cover?: FileData;
  verticalCover?: FileData;
  videoFile?: File; // 原始 File 对象，用于避免 blob URL 问题
  scheduledPublishTime?: number;
}

export interface PlatformInfo {
  type: 'DYNAMIC' | 'VIDEO' | 'ARTICLE' | 'PODCAST';
  name: string;
  homeUrl: string;
  faviconUrl?: string;
  iconifyIcon?: string;
  platformName: string;
  injectUrl: string;
  injectFunction: (data: SyncData, file?: File) => Promise<boolean>;
  tags?: string[];
  accountKey: string;
  accountInfo?: AccountInfo;
  extraConfig?: unknown;
}

export interface AccountInfo {
  provider: string;
  accountId: string;
  username: string;
  description?: string;
  profileUrl?: string;
  avatarUrl?: string;
  extraData: unknown;
}

export const infoMap: Record<string, PlatformInfo> = {
  ...DynamicInfoMap,
  ...ArticleInfoMap,
  ...VideoInfoMap,
  ...PodcastInfoMap,
};

export async function getPlatformInfo(platform: string): Promise<PlatformInfo | null> {
  const platformInfo = infoMap[platform];
  if (platformInfo) {
    return await getExtraConfigFromPlatformInfo(await getAccountInfoFromPlatformInfo(platformInfo));
  }
  return null;
}

export function getRawPlatformInfo(platform: string): PlatformInfo | null {
  return infoMap[platform];
}

export async function getPlatformInfos(type?: 'DYNAMIC' | 'VIDEO' | 'ARTICLE' | 'PODCAST'): Promise<PlatformInfo[]> {
  const platformInfos: PlatformInfo[] = [];
  for (const info of Object.values(infoMap)) {
    if (type && info.type !== type) continue;
    platformInfos.push(info);
  }

  return await getExtraConfigFromPlatformInfos(await getAccountInfoFromPlatformInfos(platformInfos));
}

// Inject || 注入 || START
export async function createTabsForPlatforms(data: SyncData) {
  const tabs: { tab: chrome.tabs.Tab; platformInfo: SyncDataPlatform }[] = [];
  let groupId: number | undefined;

  for (const info of data.platforms) {
    let tab: chrome.tabs.Tab | null = null;
    if (info) {
      const extraConfig = info.extraConfig as { customInjectUrls?: string[] };
      if (extraConfig?.customInjectUrls && extraConfig.customInjectUrls.length > 0) {
        for (const url of extraConfig.customInjectUrls) {
          tab = await chrome.tabs.create({ url });
          info.injectUrl = url;
          // 等待标签页加载完成
          await new Promise<void>((resolve) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === tab!.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
              }
            });
          });
        }
      } else {
        if (info.injectUrl) {
          tab = await chrome.tabs.create({ url: info.injectUrl });
        } else {
          const platformInfo = infoMap[info.name];
          if (platformInfo) {
            tab = await chrome.tabs.create({ url: platformInfo.injectUrl });
          }
        }
        // 等待标签页加载完成
        if (tab) {
          await injectScriptsToTabs([{ tab, platformInfo: info }], data);
          await chrome.tabs.update(tab.id!, { active: true });
          tabs.push({
            tab,
            platformInfo: info,
          });

          // 如果是第一个标签页，创建一个新组
          if (!groupId) {
            groupId = await chrome.tabs.group({ tabIds: [tab.id!] });
            await chrome.tabGroups.update(groupId, {
              color: 'blue',
              title: `MultiPost-${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`,
            });
          } else {
            // 将新标签页添加到现有组中
            await chrome.tabs.group({ tabIds: [tab.id!], groupId });
          }
          // 等待3秒再继续
          await new Promise<void>((resolve) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === tab!.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
              }
            });
          });
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }
  }

  return tabs;
}

export async function injectScriptsToTabs(
  tabs: { tab: chrome.tabs.Tab; platformInfo: SyncDataPlatform }[],
  data: SyncData,
) {
  for (const t of tabs) {
    const tab = t.tab;
    const platform = t.platformInfo;
    if (tab.id) {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          getPlatformInfo(platform.name).then((info) => {
            if (info) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: info.injectFunction,
                args: [data],
              });
            }
          });
        }
      });
    }
  }
}
// Inject || 注入 || END
