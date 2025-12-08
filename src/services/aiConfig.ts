/**
 * AI 配置存储服务
 * 使用 chrome.storage.local 存储 AI 配置
 */

import type { AIConfig } from '~types/ai';
import { DEFAULT_AI_CONFIG } from '~types/ai';

const AI_CONFIG_KEY = 'ai_config';

/**
 * 获取 AI 配置
 */
export async function getAIConfig(): Promise<AIConfig> {
  try {
    const result = await chrome.storage.local.get(AI_CONFIG_KEY);
    if (result[AI_CONFIG_KEY]) {
      return { ...DEFAULT_AI_CONFIG, ...result[AI_CONFIG_KEY] };
    }
    return DEFAULT_AI_CONFIG;
  } catch (error) {
    console.error('获取 AI 配置失败:', error);
    return DEFAULT_AI_CONFIG;
  }
}

/**
 * 保存 AI 配置
 */
export async function saveAIConfig(config: Partial<AIConfig>): Promise<void> {
  try {
    const currentConfig = await getAIConfig();
    const newConfig = { ...currentConfig, ...config };
    await chrome.storage.local.set({ [AI_CONFIG_KEY]: newConfig });
  } catch (error) {
    console.error('保存 AI 配置失败:', error);
    throw error;
  }
}

/**
 * 检查 SiliconFlow API Key 是否已配置
 */
export async function hasSiliconFlowApiKey(): Promise<boolean> {
  const config = await getAIConfig();
  return !!config.siliconflowApiKey;
}
