import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Tabs, Tab } from '@heroui/react';
import { RotateCcwIcon } from 'lucide-react';
import type { CustomPrompts } from '~types/ai';
import type { PublishType } from '~types/news';
import { DEFAULT_PROMPTS } from '~types/ai';
import { getAIConfig, saveAIConfig } from '~services/aiConfig';

interface PromptConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 当前发布类型，用于默认选中 */
  currentType?: PublishType;
}

/**
 * 提示词配置弹窗
 */
const PromptConfigModal: React.FC<PromptConfigModalProps> = ({ isOpen, onClose, currentType = 'dynamic' }) => {
  const [prompts, setPrompts] = useState<CustomPrompts>(DEFAULT_PROMPTS);
  const [selectedType, setSelectedType] = useState<PublishType>(currentType);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 加载配置
  useEffect(() => {
    if (isOpen) {
      setSelectedType(currentType);
      const loadPrompts = async () => {
        setIsLoading(true);
        try {
          const config = await getAIConfig();
          setPrompts(config.customPrompts || DEFAULT_PROMPTS);
        } catch (error) {
          console.error('加载提示词配置失败:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadPrompts();
    }
  }, [isOpen, currentType]);

  // 更新提示词
  const handlePromptChange = useCallback((type: PublishType, value: string) => {
    setPrompts((prev) => ({ ...prev, [type]: value }));
  }, []);

  // 重置当前类型提示词
  const handleReset = useCallback(() => {
    setPrompts((prev) => ({ ...prev, [selectedType]: DEFAULT_PROMPTS[selectedType] }));
  }, [selectedType]);

  // 保存配置
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveAIConfig({ customPrompts: prompts });
      onClose();
    } catch (error) {
      console.error('保存提示词配置失败:', error);
    } finally {
      setIsSaving(false);
    }
  }, [prompts, onClose]);

  const typeLabels: Record<PublishType, string> = {
    dynamic: '动态',
    article: '文章',
    video: '视频',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl">
      <ModalContent>
        <ModalHeader>AI 提示词配置</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="py-8 text-center text-default-400">加载中...</div>
          ) : (
            <Tabs
              selectedKey={selectedType}
              onSelectionChange={(key) => setSelectedType(key as PublishType)}
              variant="underlined">
              {(['dynamic', 'article', 'video'] as PublishType[]).map((type) => (
                <Tab
                  key={type}
                  title={typeLabels[type]}>
                  <div className="pt-4">
                    <Textarea
                      label={`${typeLabels[type]}生成提示词`}
                      placeholder="请输入提示词..."
                      value={prompts[type]}
                      onChange={(e) => handlePromptChange(type, e.target.value)}
                      variant="bordered"
                      minRows={8}
                      maxRows={12}
                      description="提示词将指导 AI 生成对应类型的内容"
                    />
                  </div>
                </Tab>
              ))}
            </Tabs>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            startContent={<RotateCcwIcon className="size-4" />}
            onPress={handleReset}>
            重置当前
          </Button>
          <div className="flex-1" />
          <Button
            variant="light"
            onPress={onClose}>
            取消
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={isSaving}>
            保存
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PromptConfigModal;
