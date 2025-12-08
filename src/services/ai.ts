import type { AIGenerationRequest, AIGenerationResponse } from '~types/editor';
import type { SiliconFlowRequest, SiliconFlowResponse } from '~types/ai';
import { getAIConfig } from './aiConfig';

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

/**
 * AI 内容生成服务
 */
export interface AIService {
  /** 生成内容 */
  generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse>;
  /** 检查服务是否可用 */
  isAvailable(): Promise<boolean>;
}

import type { CustomPrompts } from '~types/ai';
import { DEFAULT_PROMPTS } from '~types/ai';

/**
 * 根据发布类型和自定义提示词生成系统提示词
 */
function getSystemPrompt(publishType: string, customPrompts?: CustomPrompts): string {
  const basePrompt = `你是一位专业的内容创作者。请严格按照指定的格式返回内容，使用 ===TITLE===、===CONTENT===、===DIGEST=== 作为分隔标记。`;

  const prompts = customPrompts || DEFAULT_PROMPTS;
  const typePrompt = prompts[publishType as keyof CustomPrompts] || prompts.dynamic;

  return `${basePrompt}

创作要求：
${typePrompt}`;
}

/**
 * 构建用户提示词
 */
function buildUserPrompt(request: AIGenerationRequest): string {
  const { newsItem, publishType } = request;

  return `请根据以下资讯创作内容：

【标题】${newsItem.title}
【摘要】${newsItem.summary}
【来源】${newsItem.source}
【作者】${newsItem.author}

请严格按照以下格式返回（直接输出，不要用代码块包裹）：

===TITLE===
创作的标题
===CONTENT===
创作的正文内容
===DIGEST===
一句话摘要（${publishType === 'article' ? '用于文章摘要' : '用于分享描述'}）`;
}

/**
 * 解析 AI 响应内容
 */
function parseAIResponse(content: string, originalTitle: string): AIGenerationResponse {
  // 使用分隔标记解析
  const titleMatch = content.match(/===TITLE===\s*([\s\S]*?)(?====CONTENT===|$)/);
  const contentMatch = content.match(/===CONTENT===\s*([\s\S]*?)(?====DIGEST===|$)/);
  const digestMatch = content.match(/===DIGEST===\s*([\s\S]*?)$/);

  if (titleMatch && contentMatch) {
    return {
      title: titleMatch[1].trim() || originalTitle,
      content: contentMatch[1].trim(),
      digest: digestMatch ? digestMatch[1].trim() : '',
      suggestedTags: [],
    };
  }

  // 尝试 JSON 解析作为备选
  try {
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    const parsed = JSON.parse(jsonStr);
    return {
      title: parsed.title || originalTitle,
      content: parsed.content || '',
      digest: parsed.digest || '',
      suggestedTags: parsed.suggestedTags || [],
    };
  } catch {
    // 都失败时，将整个内容作为正文返回
    console.warn('AI 响应解析失败，使用原始内容');
    return {
      title: originalTitle,
      content: content,
      digest: '',
      suggestedTags: [],
    };
  }
}

/**
 * 调用 SiliconFlow API 生成内容
 */
async function siliconflowGenerateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const config = await getAIConfig();

  if (!config.siliconflowApiKey) {
    throw new Error('请先配置 SiliconFlow API Key');
  }

  const systemPrompt = getSystemPrompt(request.publishType, config.customPrompts);
  const userPrompt = buildUserPrompt(request);

  const requestBody: SiliconFlowRequest = {
    model: config.siliconflowModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2048,
    stream: false,
  };

  const response = await fetch(SILICONFLOW_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.siliconflowApiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('SiliconFlow API 错误:', errorText);
    throw new Error(`AI 服务请求失败: ${response.status}`);
  }

  const data: SiliconFlowResponse = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('AI 服务返回空响应');
  }

  const content = data.choices[0].message.content;
  return parseAIResponse(content, request.newsItem.title);
}

/**
 * Mock AI 内容生成（备用）
 */
async function mockGenerateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const { newsItem, publishType } = request;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const contentTemplates = {
    dynamic: `📢 ${newsItem.title}

${newsItem.summary}

💡 核心观点：
这篇内容深入分析了当前热门话题，为我们提供了全新的视角和思考方式。

🔗 原文来源：${newsItem.author}
#热门话题 #精选内容`,

    article: `# ${newsItem.title}

## 引言

${newsItem.summary}

## 正文

在当今快速发展的时代，${newsItem.title.slice(0, 20)}这个话题引起了广泛关注。

### 核心观点

1. **观点一**：深入理解问题的本质
2. **观点二**：从实践中总结经验
3. **观点三**：展望未来发展趋势

### 总结

通过以上分析，我们可以看到这一话题的重要性和深远影响。

---
*本文基于 ${newsItem.author} 的原创内容进行二次创作*`,

    video: `【视频脚本】${newsItem.title}

🎬 开场（0-10秒）
大家好，今天我们来聊聊${newsItem.title.slice(0, 15)}这个话题。

📝 内容概述（10-30秒）
${newsItem.summary}

🎯 核心内容（30秒-2分钟）
- 要点1：问题的背景和现状
- 要点2：深入分析和解读
- 要点3：实用建议和方法

🔚 结尾（最后10秒）
如果觉得有帮助，记得点赞关注！`,
  };

  const digestTemplates = {
    dynamic: `分享一篇来自${newsItem.author}的精彩内容`,
    article: `深度解读：${newsItem.title.slice(0, 30)}`,
    video: `3分钟带你了解${newsItem.title.slice(0, 20)}`,
  };

  return {
    title: newsItem.title,
    content: contentTemplates[publishType],
    digest: digestTemplates[publishType],
    suggestedTags: ['热门', '推荐', newsItem.source],
  };
}

/**
 * 生成 AI 内容
 * 根据配置选择使用 SiliconFlow 或 Mock 服务
 */
export async function generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const config = await getAIConfig();

  if (config.provider === 'siliconflow' && config.siliconflowApiKey) {
    return siliconflowGenerateContent(request);
  }

  return mockGenerateContent(request);
}

/**
 * 检查 AI 服务是否可用
 */
export async function isAIServiceAvailable(): Promise<boolean> {
  const config = await getAIConfig();

  if (config.provider === 'siliconflow') {
    return !!config.siliconflowApiKey;
  }

  return true;
}

/**
 * 创建 AI 服务实例
 */
export function createAIService(): AIService {
  return {
    generateContent,
    isAvailable: isAIServiceAvailable,
  };
}
