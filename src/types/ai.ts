/**
 * AI 服务配置类型定义
 */

/**
 * AI 服务提供商
 */
export type AIProvider = 'siliconflow' | 'mock';

/**
 * SiliconFlow 模型（动态获取，支持自定义）
 */
export type SiliconFlowModel = string;

/**
 * 自定义提示词配置
 */
export interface CustomPrompts {
  /** 动态提示词 */
  dynamic: string;
  /** 文章提示词 */
  article: string;
  /** 视频提示词 */
  video: string;
}

/**
 * 图片尺寸选项
 */
export type ImageSize = '1024x576' | '1024x1024' | '768x1024' | '576x1024';

/**
 * AI 配置
 */
export interface AIConfig {
  /** 服务提供商 */
  provider: AIProvider;
  /** SiliconFlow API Key */
  siliconflowApiKey: string;
  /** SiliconFlow 模型 */
  siliconflowModel: SiliconFlowModel;
  /** 自定义提示词 */
  customPrompts: CustomPrompts;
  /** 图片生成模型 */
  imageModel: SiliconFlowImageModel;
  /** 图片尺寸 */
  imageSize: ImageSize;
  /** 是否自动生成配图 */
  autoGenerateImage: boolean;
}

/**
 * SiliconFlow API 请求消息
 */
export interface SiliconFlowMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * SiliconFlow API 请求体
 */
export interface SiliconFlowRequest {
  model: string;
  messages: SiliconFlowMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * SiliconFlow API 响应
 */
export interface SiliconFlowResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 默认提示词
 */
export const DEFAULT_PROMPTS: CustomPrompts = {
  dynamic: `创作一条适合发布到社交平台的动态。
要求：
- 内容简洁有力，控制在 300 字以内
- 使用适当的 emoji 增加可读性
- 提炼核心观点，引发读者共鸣
- 结尾可以加上相关话题标签`,
  article: `创作一篇深度文章。
要求：
- 使用 Markdown 格式
- 包含引言、正文、总结等结构
- 内容详实，有深度分析
- 字数控制在 800-1500 字
- 观点清晰，逻辑严谨`,
  video: `创作一个短视频脚本。
要求：
- 适合 1-3 分钟的短视频
- 包含开场、内容、结尾三个部分
- 标注每个部分的时长建议
- 语言口语化，适合口播
- 内容有吸引力，节奏紧凑`,
};

/**
 * 默认 AI 配置
 */
export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'mock',
  siliconflowApiKey: '',
  siliconflowModel: 'Qwen/Qwen2.5-7B-Instruct',
  customPrompts: DEFAULT_PROMPTS,
  imageModel: 'Kwai-Kolors/Kolors',
  imageSize: '1024x576',
  autoGenerateImage: false,
};

/**
 * SiliconFlow 图片生成模型（动态获取，支持自定义）
 */
export type SiliconFlowImageModel = string;

/**
 * 图片尺寸选项
 */
export const IMAGE_SIZE_OPTIONS: { key: ImageSize; label: string }[] = [
  { key: '1024x576', label: '1024×576（16:9 横版）' },
  { key: '1024x1024', label: '1024×1024（1:1 方形）' },
  { key: '768x1024', label: '768×1024（3:4 竖版）' },
  { key: '576x1024', label: '576×1024（9:16 竖版）' },
];

/**
 * SiliconFlow 图片生成请求
 */
export interface SiliconFlowImageRequest {
  model: string;
  prompt: string;
  negative_prompt?: string;
  image_size?: string;
  batch_size?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
}

/**
 * SiliconFlow 图片生成响应
 */
export interface SiliconFlowImageResponse {
  images: {
    url: string;
  }[];
}
