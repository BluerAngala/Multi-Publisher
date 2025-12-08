import type { NewsItem, NewsSource, PublishType } from './news';

/**
 * 文件数据结构
 */
export interface FileData {
  /** 文件名 */
  name: string;
  /** 文件类型 */
  type: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件 URL 或 Base64 */
  url: string;
}

/**
 * 编辑器内容数据结构
 */
export interface EditorContent {
  /** 标题 */
  title: string;
  /** 正文内容（Markdown 或 HTML） */
  content: string;
  /** 摘要 */
  digest: string;
  /** 封面图 */
  coverImage: FileData | null;
  /** 图片列表 */
  images: FileData[];
  /** 视频列表 */
  videos: FileData[];
}

/**
 * AI 内容生成请求
 */
export interface AIGenerationRequest {
  /** 资讯数据 */
  newsItem: NewsItem;
  /** 发布类型 */
  publishType: PublishType;
  /** 目标平台列表 */
  targetPlatforms?: string[];
}

/**
 * AI 内容生成响应
 */
export interface AIGenerationResponse {
  /** 生成的标题 */
  title: string;
  /** 生成的正文内容 */
  content: string;
  /** 生成的摘要 */
  digest: string;
  /** 建议的标签 */
  suggestedTags?: string[];
}

/**
 * 布局状态
 */
export interface LayoutState {
  /** 选中的资讯 */
  selectedNews: NewsItem | null;
  /** 当前资讯来源 */
  newsSource: NewsSource;
  /** 资讯列表 */
  newsList: NewsItem[];
  /** 是否正在加载资讯 */
  isLoadingNews: boolean;
  /** 发布类型 */
  publishType: PublishType;
  /** 编辑器内容 */
  editorContent: EditorContent;
  /** 是否正在 AI 生成 */
  isAIGenerating: boolean;
  /** AI 错误信息 */
  aiError: string | null;
  /** 选中的平台列表 */
  selectedPlatforms: string[];
  /** 是否正在发布 */
  isPublishing: boolean;
}

/**
 * 创建空的编辑器内容
 */
export function createEmptyEditorContent(): EditorContent {
  return {
    title: '',
    content: '',
    digest: '',
    coverImage: null,
    images: [],
    videos: [],
  };
}

/**
 * 创建初始布局状态
 */
export function createInitialLayoutState(): LayoutState {
  return {
    selectedNews: null,
    newsSource: 'weixin',
    newsList: [],
    isLoadingNews: false,
    publishType: 'dynamic',
    editorContent: createEmptyEditorContent(),
    isAIGenerating: false,
    aiError: null,
    selectedPlatforms: [],
    isPublishing: false,
  };
}
