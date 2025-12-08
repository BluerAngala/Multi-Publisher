import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardBody, Input, Select, SelectItem, Switch, Button, Chip } from '@heroui/react';
import { KeyIcon, CheckCircleIcon, AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import type { AIConfig, SiliconFlowModel } from '~types/ai';
import { DEFAULT_AI_CONFIG, SILICONFLOW_MODEL_OPTIONS } from '~types/ai';
import { getAIConfig, saveAIConfig } from '~services/aiConfig';

/**
 * AI 配置面板组件
 * 用于配置 SiliconFlow API Key 和模型选择
 */
const AIConfigPanel: React.FC = () => {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_AI_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await getAIConfig();
        setConfig(savedConfig);
      } catch (error) {
        console.error('加载 AI 配置失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  // 保存配置
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await saveAIConfig(config);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('保存 AI 配置失败:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  // 更新配置字段
  const updateConfig = useCallback((field: keyof AIConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 切换 AI 服务启用状态
  const handleProviderToggle = useCallback(
    (enabled: boolean) => {
      updateConfig('provider', enabled ? 'siliconflow' : 'mock');
    },
    [updateConfig],
  );

  if (isLoading) {
    return (
      <Card className="shadow-none bg-default-50">
        <CardBody className="py-8 text-center text-default-400">加载中...</CardBody>
      </Card>
    );
  }

  const isEnabled = config.provider === 'siliconflow';
  const hasApiKey = !!config.siliconflowApiKey;

  return (
    <Card className="shadow-none bg-default-50">
      <CardHeader className="flex-col items-start gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <KeyIcon className="size-5 text-primary" />
            <h3 className="text-lg font-semibold">AI 内容生成</h3>
          </div>
          <Chip
            size="sm"
            variant="flat"
            color={isEnabled && hasApiKey ? 'success' : 'default'}>
            {isEnabled && hasApiKey ? '已启用' : '未启用'}
          </Chip>
        </div>
        <p className="text-sm text-default-500">配置 SiliconFlow AI 服务，自动生成发布内容</p>
      </CardHeader>

      <CardBody className="gap-4">
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
        <Select
          label="AI 模型"
          placeholder="选择模型"
          selectedKeys={[config.siliconflowModel]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as SiliconFlowModel;
            if (selected) updateConfig('siliconflowModel', selected);
          }}
          variant="bordered"
          isDisabled={!isEnabled}
          description="带「免费」标记的模型无需付费">
          {SILICONFLOW_MODEL_OPTIONS.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>

        {/* 保存按钮 */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {saveStatus === 'success' && (
            <span className="flex items-center gap-1 text-sm text-success">
              <CheckCircleIcon className="size-4" />
              保存成功
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1 text-sm text-danger">
              <AlertCircleIcon className="size-4" />
              保存失败
            </span>
          )}
          <Button
            color="primary"
            size="sm"
            onPress={handleSave}
            isLoading={isSaving}>
            保存配置
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default AIConfigPanel;
