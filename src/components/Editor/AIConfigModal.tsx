import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Input,
  Switch,
  Chip,
} from '@heroui/react';
import {
  RotateCcwIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SparklesIcon,
  FileTextIcon,
  VideoIcon,
  ImageIcon,
  SettingsIcon,
  ExternalLinkIcon,
} from 'lucide-react';
import type { AIConfig, CustomPrompts, ImageSize, ImageBatchSize } from '~types/ai';
import type { PublishType } from '~types/news';
import { DEFAULT_AI_CONFIG, DEFAULT_PROMPTS, IMAGE_SIZE_OPTIONS, IMAGE_BATCH_SIZE_OPTIONS } from '~types/ai';
import { getAIConfig, saveAIConfig } from '~services/aiConfig';
import ModelSelect from './ModelSelect';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 当前发布类型，用于默认选中提示词标签 */
  currentType?: PublishType;
}

type TabKey = 'basic' | 'dynamic' | 'article' | 'video' | 'image';

/**
 * AI 配置弹窗（整合版）
 * 包含：基本配置、动态提示词、文章提示词、视频提示词、生成图片配置
 */
const AIConfigModal: React.FC<AIConfigModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_AI_CONFIG);
  const [prompts, setPrompts] = useState<CustomPrompts>(DEFAULT_PROMPTS);
  const [selectedTab, setSelectedTab] = useState<TabKey>('basic');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 加载配置
  useEffect(() => {
    if (isOpen) {
      const loadConfig = async () => {
        setIsLoading(true);
        try {
          const savedConfig = await getAIConfig();
          setConfig(savedConfig);
          setPrompts(savedConfig.customPrompts || DEFAULT_PROMPTS);
        } catch (error) {
          console.error('加载配置失败:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadConfig();
    }
  }, [isOpen]);

  // 更新配置字段
  const updateConfig = useCallback((field: keyof AIConfig, value: string | boolean | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 切换 AI 服务启用状态
  const handleProviderToggle = useCallback(
    (enabled: boolean) => {
      updateConfig('provider', enabled ? 'siliconflow' : 'mock');
    },
    [updateConfig],
  );

  // 更新提示词
  const handlePromptChange = useCallback((type: PublishType, value: string) => {
    setPrompts((prev) => ({ ...prev, [type]: value }));
  }, []);

  // 重置当前类型提示词
  const handleResetPrompt = useCallback((type: PublishType) => {
    setPrompts((prev) => ({ ...prev, [type]: DEFAULT_PROMPTS[type] }));
  }, []);

  // 保存配置
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await saveAIConfig({
        ...config,
        customPrompts: prompts,
      });
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        onClose();
      }, 1000);
    } catch (error) {
      console.error('保存配置失败:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [config, prompts, onClose]);

  const isEnabled = config.provider === 'siliconflow';
  const hasApiKey = !!config.siliconflowApiKey;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <SparklesIcon className="size-5 text-primary" />
          <span>AI 配置</span>
          <Chip
            size="sm"
            variant="flat"
            color={isEnabled && hasApiKey ? 'success' : 'default'}>
            {isEnabled && hasApiKey ? '已启用' : '未启用'}
          </Chip>
          <Button
            as="a"
            href="https://cloud.siliconflow.cn/i/WFoChvZf"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="flat"
            color="primary"
            endContent={<ExternalLinkIcon className="size-3" />}>
            获取 API 密钥
          </Button>
        </ModalHeader>
        <ModalBody className="py-0">
          {isLoading ? (
            <div className="py-8 text-center text-default-400">加载中...</div>
          ) : (
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as TabKey)}
              variant="underlined"
              classNames={{
                tabList: 'gap-4',
                tab: 'px-2',
              }}>
              {/* 基本配置 */}
              <Tab
                key="basic"
                title={
                  <div className="flex items-center gap-1">
                    <SettingsIcon className="size-4" />
                    <span>基本配置</span>
                  </div>
                }>
                <div className="py-4 space-y-4">
                  {/* 启用开关 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">启用 AI 生成</p>
                      <p className="text-xs text-default-400">关闭后将使用模板生成内容</p>
                    </div>
                    <Switch
                      isSelected={isEnabled}
                      onValueChange={handleProviderToggle}
                      size="sm"
                    />
                  </div>

                  {/* API Key 输入 */}
                  <Input
                    label="SiliconFlow API Key"
                    placeholder="请输入 API Key"
                    value={config.siliconflowApiKey}
                    onChange={(e) => updateConfig('siliconflowApiKey', e.target.value)}
                    type={showApiKey ? 'text' : 'password'}
                    variant="bordered"
                    isDisabled={!isEnabled}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-default-400 hover:text-default-600">
                        {showApiKey ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                      </button>
                    }
                    description={
                      <span>
                        前往{' '}
                        <a
                          href="https://cloud.siliconflow.cn/account/ak"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline">
                          SiliconFlow 控制台
                        </a>{' '}
                        获取 API Key
                      </span>
                    }
                  />

                  {/* 模型选择 */}
                  <ModelSelect
                    type="text"
                    label="AI 文本模型"
                    value={config.siliconflowModel}
                    onChange={(value) => updateConfig('siliconflowModel', value)}
                    isDisabled={!isEnabled}
                    apiKey={config.siliconflowApiKey}
                    description="搜索或输入自定义模型，带「免费」标记的模型无需付费"
                  />
                </div>
              </Tab>

              {/* 动态提示词 */}
              <Tab
                key="dynamic"
                title={
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="size-4" />
                    <span>动态提示词</span>
                  </div>
                }>
                <div className="py-4">
                  <Textarea
                    label="动态生成提示词"
                    placeholder="请输入提示词..."
                    value={prompts.dynamic}
                    onChange={(e) => handlePromptChange('dynamic', e.target.value)}
                    variant="bordered"
                    minRows={10}
                    maxRows={14}
                    description="提示词将指导 AI 生成动态内容"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="light"
                      startContent={<RotateCcwIcon className="size-3" />}
                      onPress={() => handleResetPrompt('dynamic')}>
                      重置默认
                    </Button>
                  </div>
                </div>
              </Tab>

              {/* 文章提示词 */}
              <Tab
                key="article"
                title={
                  <div className="flex items-center gap-1">
                    <FileTextIcon className="size-4" />
                    <span>文章提示词</span>
                  </div>
                }>
                <div className="py-4">
                  <Textarea
                    label="文章生成提示词"
                    placeholder="请输入提示词..."
                    value={prompts.article}
                    onChange={(e) => handlePromptChange('article', e.target.value)}
                    variant="bordered"
                    minRows={10}
                    maxRows={14}
                    description="提示词将指导 AI 生成文章内容"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="light"
                      startContent={<RotateCcwIcon className="size-3" />}
                      onPress={() => handleResetPrompt('article')}>
                      重置默认
                    </Button>
                  </div>
                </div>
              </Tab>

              {/* 视频提示词 */}
              <Tab
                key="video"
                title={
                  <div className="flex items-center gap-1">
                    <VideoIcon className="size-4" />
                    <span>视频提示词</span>
                  </div>
                }>
                <div className="py-4">
                  <Textarea
                    label="视频生成提示词"
                    placeholder="请输入提示词..."
                    value={prompts.video}
                    onChange={(e) => handlePromptChange('video', e.target.value)}
                    variant="bordered"
                    minRows={10}
                    maxRows={14}
                    description="提示词将指导 AI 生成视频描述内容"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="light"
                      startContent={<RotateCcwIcon className="size-3" />}
                      onPress={() => handleResetPrompt('video')}>
                      重置默认
                    </Button>
                  </div>
                </div>
              </Tab>

              {/* 生成图片配置 */}
              <Tab
                key="image"
                title={
                  <div className="flex items-center gap-1">
                    <ImageIcon className="size-4" />
                    <span>生成配图</span>
                  </div>
                }>
                <div className="py-4 space-y-4">
                  {/* 自动生成配图开关 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">自动生成配图</p>
                      <p className="text-xs text-default-400">开启后，生成内容时会同时生成配图</p>
                    </div>
                    <Switch
                      isSelected={config.autoGenerateImage ?? false}
                      onValueChange={(value) => updateConfig('autoGenerateImage', value)}
                      size="sm"
                      isDisabled={!isEnabled}
                    />
                  </div>

                  <ModelSelect
                    type="image"
                    label="图片生成模型"
                    value={config.imageModel || 'Kwai-Kolors/Kolors'}
                    onChange={(value) => updateConfig('imageModel', value)}
                    isDisabled={!isEnabled}
                    apiKey={config.siliconflowApiKey}
                    description="搜索或输入自定义模型"
                  />
                  <Select
                    label="图片尺寸"
                    selectedKeys={[config.imageSize || '1024x576']}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as ImageSize;
                      if (selected) updateConfig('imageSize', selected);
                    }}
                    variant="bordered"
                    isDisabled={!isEnabled}
                    description="选择生成图片的尺寸">
                    {IMAGE_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="生成数量"
                    selectedKeys={[String(config.imageBatchSize || 1)]}
                    onSelectionChange={(keys) => {
                      const selected = Number(Array.from(keys)[0]) as ImageBatchSize;
                      if (selected) updateConfig('imageBatchSize', selected);
                    }}
                    variant="bordered"
                    isDisabled={!isEnabled}
                    description="每次生成的图片数量">
                    {IMAGE_BATCH_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={String(option.key)}>{option.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </Tab>
            </Tabs>
          )}
        </ModalBody>
        <ModalFooter>
          {saveStatus === 'success' && (
            <span className="flex items-center gap-1 mr-2 text-sm text-success">
              <CheckCircleIcon className="size-4" />
              保存成功
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1 mr-2 text-sm text-danger">
              <AlertCircleIcon className="size-4" />
              保存失败
            </span>
          )}
          <Button
            variant="light"
            onPress={onClose}>
            取消
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={isSaving}>
            保存配置
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AIConfigModal;
