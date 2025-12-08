/**
 * 资讯来源平台类型
 */
export type NewsSource = 'weixin' | 'xiaohongshu' | 'zhihu' | 'douyin';

/**
 * 发布类型
 */
export type PublishType = 'dynamic' | 'article' | 'video';

/**
 * 资讯数据结构
 */
export interface NewsItem {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  title: string;
  /** 内容摘要 */
  summary: string;
  /** 作者 */
  author: string;
  /** 来源平台 */
  source: NewsSource;
  /** 发布时间（ISO 格式） */
  publishTime: string;
  /** 推荐指数（0-100） */
  recommendScore: number;
  /** 封面图 URL */
  coverImage?: string;
  /** 原文链接 */
  originalUrl: string;
  /** 标签 */
  tags?: string[];
}

/**
 * 资讯来源配置
 */
export interface NewsSourceConfig {
  /** 来源标识 */
  key: NewsSource;
  /** 显示名称 */
  label: string;
  /** 图标 */
  icon?: string;
}

/**
 * 资讯来源配置列表
 */
export const NEWS_SOURCE_CONFIGS: NewsSourceConfig[] = [
  { key: 'weixin', label: '微信爆文' },
  { key: 'xiaohongshu', label: '小红书爆文' },
  { key: 'zhihu', label: '知乎爆款' },
  { key: 'douyin', label: '抖音爆款' },
];

/**
 * 发布类型配置
 */
export interface PublishTypeConfig {
  /** 类型标识 */
  key: PublishType;
  /** 显示名称 */
  label: string;
}

/**
 * 发布类型配置列表
 */
export const PUBLISH_TYPE_CONFIGS: PublishTypeConfig[] = [
  { key: 'dynamic', label: '发布动态' },
  { key: 'article', label: '发布文章' },
  { key: 'video', label: '发布视频' },
];
