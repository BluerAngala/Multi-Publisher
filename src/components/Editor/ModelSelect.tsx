import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Autocomplete, AutocompleteItem, Chip } from '@heroui/react';
import { SearchIcon, SparklesIcon } from 'lucide-react';
import type { ModelInfo, ModelType } from '~services/siliconflowModels';
import { fetchModels } from '~services/siliconflowModels';

interface ModelSelectProps {
  /** 模型类型 */
  type: ModelType;
  /** 当前选中的模型 */
  value: string;
  /** 选择变更回调 */
  onChange: (value: string) => void;
  /** 标签 */
  label: string;
  /** 描述 */
  description?: string;
  /** 是否禁用 */
  isDisabled?: boolean;
  /** API Key（用于触发重新获取） */
  apiKey?: string;
}

/** 推荐模型配置 */
const RECOMMENDED_MODELS: Record<ModelType, string[]> = {
  text: ['Qwen/Qwen2.5-7B-Instruct', 'Qwen/Qwen2.5-72B-Instruct', 'deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-R1'],
  image: ['Kwai-Kolors/Kolors', 'stabilityai/stable-diffusion-3-5-large', 'black-forest-labs/FLUX.1-schnell'],
  video: [],
};

/** 免费模型列表 */
const FREE_MODELS = [
  'Qwen/Qwen2.5-7B-Instruct',
  'Qwen/Qwen2-7B-Instruct',
  'THUDM/glm-4-9b-chat',
  'internlm/internlm2_5-7b-chat',
  'Kwai-Kolors/Kolors',
  'black-forest-labs/FLUX.1-schnell',
];

/**
 * 模型选择组件
 * 支持搜索、自定义输入、显示推荐和免费标记
 */
const ModelSelect: React.FC<ModelSelectProps> = ({
  type,
  value,
  onChange,
  label,
  description,
  isDisabled = false,
  apiKey,
}) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // 加载模型列表
  useEffect(() => {
    if (!apiKey || isDisabled) {
      setModels([]);
      return;
    }

    const loadModels = async () => {
      setIsLoading(true);
      try {
        const result = await fetchModels(type);
        setModels(result);
      } catch (error) {
        console.error('加载模型列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, [type, apiKey, isDisabled]);

  // 同步外部 value 到 inputValue
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 处理模型列表，添加推荐和免费标记
  const processedModels = useMemo(() => {
    const recommended = RECOMMENDED_MODELS[type] || [];

    return models
      .map((model) => ({
        ...model,
        isRecommended: recommended.includes(model.id),
        isFree: FREE_MODELS.includes(model.id),
      }))
      .sort((a, b) => {
        // 推荐的排前面
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        // 免费的排前面
        if (a.isFree && !b.isFree) return -1;
        if (!a.isFree && b.isFree) return 1;
        return 0;
      });
  }, [models, type]);

  // 处理选择
  const handleSelectionChange = useCallback(
    (key: React.Key | null) => {
      if (key) {
        onChange(key.toString());
      }
    },
    [onChange],
  );

  // 处理输入变化（支持自定义输入）
  const handleInputChange = useCallback((val: string) => {
    setInputValue(val);
  }, []);

  // 失去焦点时，如果有自定义输入则使用
  const handleBlur = useCallback(() => {
    if (inputValue && inputValue !== value) {
      onChange(inputValue);
    }
  }, [inputValue, value, onChange]);

  // 生成显示标签
  const getModelLabel = useCallback(
    (modelId: string) => {
      const model = processedModels.find((m) => m.id === modelId);
      if (!model) return modelId;

      const parts = [modelId.split('/').pop() || modelId];
      if (model.isFree) parts.push('（免费）');
      if (model.isRecommended) parts.push('（推荐）');
      return parts.join(' ');
    },
    [processedModels],
  );

  return (
    <Autocomplete
      label={label}
      placeholder="搜索或输入模型名称"
      description={description}
      selectedKey={value}
      inputValue={inputValue}
      onSelectionChange={handleSelectionChange}
      onInputChange={handleInputChange}
      onBlur={handleBlur}
      isLoading={isLoading}
      isDisabled={isDisabled}
      variant="bordered"
      allowsCustomValue
      startContent={<SearchIcon className="size-4 text-default-400" />}
      listboxProps={{
        emptyContent: apiKey ? '无匹配模型，可直接输入自定义模型' : '请先配置 API Key',
      }}>
      {processedModels.map((model) => (
        <AutocompleteItem
          key={model.id}
          textValue={model.id}>
          <div className="flex items-center justify-between w-full gap-2">
            <span className="truncate">{model.id.split('/').pop()}</span>
            <div className="flex gap-1 shrink-0">
              {model.isFree && (
                <Chip
                  size="sm"
                  color="success"
                  variant="flat">
                  免费
                </Chip>
              )}
              {model.isRecommended && (
                <Chip
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<SparklesIcon className="size-3" />}>
                  推荐
                </Chip>
              )}
            </div>
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default ModelSelect;
