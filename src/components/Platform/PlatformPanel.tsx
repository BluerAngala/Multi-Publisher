import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Switch, Accordion, AccordionItem, Chip } from '@heroui/react';
import { SendIcon, HandIcon, BotIcon, Eraser } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';
import type { PublishType } from '~types/news';
import { PUBLISH_TYPE_CONFIGS } from '~types/news';
import type { EditorContent } from '~types/editor';
import { getPlatformInfos, type PlatformInfo, type SyncData } from '~sync/common';
import { ACCOUNT_INFO_STORAGE_KEY } from '~sync/account';
import { EXTRA_CONFIG_STORAGE_KEY } from '~sync/extraconfig';
import PlatformCheckbox from '~components/Sync/PlatformCheckbox';

/** 发布类型到平台类型的映射 */
const PUBLISH_TYPE_MAP: Record<PublishType, 'DYNAMIC' | 'ARTICLE' | 'VIDEO'> = {
  dynamic: 'DYNAMIC',
  article: 'ARTICLE',
  video: 'VIDEO',
};

/** 存储键前缀 */
const STORAGE_KEY_PREFIX = 'platforms_';

interface PlatformPanelProps {
  /** 发布类型 */
  publishType: PublishType;
  /** 编辑器内容 */
  content: EditorContent;
  /** 发布回调 */
  onPublish: (data: SyncData) => void;
  /** 选中的平台列表 */
  selectedPlatforms: string[];
  /** 平台选择变更回调 */
  onPlatformChange: (platforms: string[]) => void;
}

/**
 * 平台选择面板组件
 * 从现有 DynamicTab/ArticleTab 提取平台选择逻辑
 */
const PlatformPanel: React.FC<PlatformPanelProps> = ({
  publishType,
  content,
  onPublish,
  selectedPlatforms,
  onPlatformChange,
}) => {
  const [platforms, setPlatforms] = useState<PlatformInfo[]>([]);
  const [autoPublish, setAutoPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const storage = useMemo(() => new Storage({ area: 'local' }), []);
  const storageKey = `${STORAGE_KEY_PREFIX}${publishType}`;

  const [accountInfos] = useStorage({
    key: ACCOUNT_INFO_STORAGE_KEY,
    instance: storage,
  });
  const [extraConfigMap] = useStorage({
    key: EXTRA_CONFIG_STORAGE_KEY,
    instance: storage,
  });

  // 加载平台信息
  useEffect(() => {
    const loadPlatformInfos = async () => {
      try {
        const infos = await getPlatformInfos(PUBLISH_TYPE_MAP[publishType]);
        setPlatforms(infos);
      } catch (error) {
        console.error('加载平台信息失败:', error);
      }
    };

    loadPlatformInfos();
  }, [publishType, accountInfos, extraConfigMap]);

  // 加载已保存的平台选择
  useEffect(() => {
    const loadSavedPlatforms = async () => {
      try {
        const saved = await storage.get<string[]>(storageKey);
        if (saved) {
          onPlatformChange(saved);
        }
      } catch (error) {
        console.error('加载平台选择失败:', error);
      }
    };

    loadSavedPlatforms();
  }, [storage, storageKey, onPlatformChange]);

  // 处理平台选择变更
  const handlePlatformChange = useCallback(
    async (platform: string, isSelected: boolean) => {
      const newPlatforms = isSelected
        ? [...selectedPlatforms, platform]
        : selectedPlatforms.filter((p) => p !== platform);

      onPlatformChange(newPlatforms);
      await storage.set(storageKey, newPlatforms);
    },
    [selectedPlatforms, onPlatformChange, storage, storageKey],
  );

  // 清空平台选择
  const clearSelectedPlatforms = useCallback(async () => {
    onPlatformChange([]);
    await storage.set(storageKey, []);
  }, [onPlatformChange, storage, storageKey]);

  // 构建 SyncData
  const getSyncData = useCallback((): SyncData => {
    const platformData = selectedPlatforms.map((platform) => ({
      name: platform,
      injectUrl: platforms.find((p) => p.name === platform)?.injectUrl || '',
      extraConfig: platforms.find((p) => p.name === platform)?.extraConfig || {},
    }));

    // 根据发布类型构建不同的数据结构
    if (publishType === 'article') {
      return {
        platforms: platformData,
        isAutoPublish: autoPublish,
        data: {
          title: content.title,
          digest: content.digest,
          cover: content.coverImage || { name: '', url: '' },
          htmlContent: content.content,
          markdownContent: content.content,
          images: content.images,
        },
      };
    } else if (publishType === 'video') {
      return {
        platforms: platformData,
        isAutoPublish: autoPublish,
        data: {
          title: content.title,
          content: content.content,
          video: content.videos[0] || { name: '', url: '' },
        },
      };
    } else {
      return {
        platforms: platformData,
        isAutoPublish: autoPublish,
        data: {
          title: content.title,
          content: content.content,
          images: content.images,
          videos: content.videos,
        },
      };
    }
  }, [selectedPlatforms, platforms, autoPublish, content, publishType]);

  // 处理发布
  const handlePublish = useCallback(async () => {
    // 校验标题
    if (!content.title) {
      alert('请输入标题');
      return;
    }
    // 校验内容
    if (!content.content) {
      alert('请输入正文内容');
      return;
    }
    // 校验封面图（文章类型必须）
    if (publishType === 'article' && !content.coverImage) {
      alert('请上传或生成封面图');
      return;
    }
    // 校验平台
    if (selectedPlatforms.length === 0) {
      alert('请选择发布平台');
      return;
    }

    setIsLoading(true);
    try {
      const data = getSyncData();
      const window = await chrome.windows.getCurrent({ populate: true });
      await chrome.sidePanel.open({ windowId: window.id });
      onPublish(data);
    } catch (error) {
      console.error('发布时出错:', error);
      onPublish(getSyncData());
    } finally {
      setIsLoading(false);
    }
  }, [content, selectedPlatforms, getSyncData, onPublish]);

  // 按标签分组平台
  const cnPlatforms = platforms.filter((p) => p.tags?.includes('CN'));
  const internationalPlatforms = platforms.filter((p) => p.tags?.includes('International'));

  // 计算选中数量
  const selectedCnCount = selectedPlatforms.filter((p) => cnPlatforms.some((cp) => cp.name === p)).length;
  const selectedIntlCount = selectedPlatforms.filter((p) => internationalPlatforms.some((ip) => ip.name === p)).length;

  // 发布按钮是否可用
  const canPublish =
    content.title &&
    content.content &&
    selectedPlatforms.length > 0 &&
    (publishType !== 'article' || content.coverImage);

  return (
    <Card className="h-full shadow-none bg-default-50">
      <CardHeader className="flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">发布平台</h2>
          <Chip
            size="sm"
            variant="flat"
            color="primary">
            {PUBLISH_TYPE_CONFIGS.find((c) => c.key === publishType)?.label || publishType}
          </Chip>
        </div>
        <div className="flex items-center justify-between w-full">
          <Switch
            isSelected={autoPublish}
            onValueChange={setAutoPublish}
            size="sm"
            startContent={<BotIcon className="size-3" />}
            endContent={<HandIcon className="size-3" />}>
            <span className="text-sm">自动发布</span>
          </Switch>

          {selectedPlatforms.length > 0 && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={clearSelectedPlatforms}
              title="清空选择">
              <Eraser className="size-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className="overflow-y-auto">
        <Accordion
          isCompact
          variant="light"
          selectionMode="multiple"
          defaultExpandedKeys={['CN']}>
          <AccordionItem
            key="CN"
            title="国内平台"
            subtitle={`${selectedCnCount}/${cnPlatforms.length}`}
            startContent={
              <div className="w-6">
                <Icon
                  icon="openmoji:flag-china"
                  className="w-full h-max"
                />
              </div>
            }>
            <div className="flex flex-col gap-1">
              {cnPlatforms.map((platform) => (
                <PlatformCheckbox
                  key={platform.name}
                  platformInfo={platform}
                  isSelected={selectedPlatforms.includes(platform.name)}
                  onChange={(_, isSelected) => handlePlatformChange(platform.name, isSelected)}
                  isDisabled={false}
                  syncData={getSyncData()}
                />
              ))}
            </div>
          </AccordionItem>

          <AccordionItem
            key="International"
            title="国际平台"
            subtitle={`${selectedIntlCount}/${internationalPlatforms.length}`}
            startContent={
              <div className="w-6">
                <Icon
                  icon="openmoji:globe-with-meridians"
                  className="w-full h-max"
                />
              </div>
            }>
            <div className="flex flex-col gap-1">
              {internationalPlatforms.map((platform) => (
                <PlatformCheckbox
                  key={platform.name}
                  platformInfo={platform}
                  isSelected={selectedPlatforms.includes(platform.name)}
                  onChange={(_, isSelected) => handlePlatformChange(platform.name, isSelected)}
                  isDisabled={false}
                  syncData={getSyncData()}
                />
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </CardBody>

      <CardFooter>
        <Button
          onPress={handlePublish}
          color="primary"
          variant="flat"
          isDisabled={!canPublish}
          isLoading={isLoading}
          className="w-full font-medium"
          startContent={<SendIcon className="size-4" />}>
          发布到 {selectedPlatforms.length} 个平台
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlatformPanel;
