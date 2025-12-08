/**
 * SiliconFlow 模型列表服务
 * 动态获取官方模型列表，支持缓存
 */

import { getAIConfig } from './aiConfig';

/** 模型类型 */
export type ModelType = 'text' | 'image' | 'video';

/** 模型信息 */
export interface ModelInfo {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

/** API 响应 */
interface ModelsResponse {
  object: string;
  data: ModelInfo[];
}

/** 缓存数据 */
interface CacheData {
  models: ModelInfo[];
  timestamp: number;
}

/** 缓存有效期：5 分钟 */
const CACHE_DURATION = 5 * 60 * 1000;

/** 内存缓存 */
const modelCache: Record<ModelType, CacheData | null> = {
  text: null,
  image: null,
  video: null,
};

/**
 * 获取 SiliconFlow 模型列表
 * @param type 模型类型
 * @returns 模型列表
 */
export async function fetchModels(type: ModelType): Promise<ModelInfo[]> {
  // 检查缓存
  const cached = modelCache[type];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.models;
  }

  // 获取 API Key
  const config = await getAIConfig();
  if (!config.siliconflowApiKey) {
    return [];
  }

  try {
    const response = await fetch(`https://api.siliconflow.cn/v1/models?type=${type}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.siliconflowApiKey}`,
      },
    });

    if (!response.ok) {
      console.error('获取模型列表失败:', response.status);
      return [];
    }

    const data: ModelsResponse = await response.json();
    const models = data.data || [];

    // 更新缓存
    modelCache[type] = {
      models,
      timestamp: Date.now(),
    };

    return models;
  } catch (error) {
    console.error('获取模型列表出错:', error);
    return [];
  }
}

/**
 * 清除模型缓存
 */
export function clearModelCache(type?: ModelType): void {
  if (type) {
    modelCache[type] = null;
  } else {
    modelCache.text = null;
    modelCache.image = null;
    modelCache.video = null;
  }
}

/**
 * 获取文本模型列表
 */
export async function fetchTextModels(): Promise<ModelInfo[]> {
  return fetchModels('text');
}

/**
 * 获取图片生成模型列表
 */
export async function fetchImageModels(): Promise<ModelInfo[]> {
  return fetchModels('image');
}

/**
 * 获取视频生成模型列表
 */
export async function fetchVideoModels(): Promise<ModelInfo[]> {
  return fetchModels('video');
}
