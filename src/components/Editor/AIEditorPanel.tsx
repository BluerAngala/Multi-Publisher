import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Button,
  Image,
  Spinner,
  Chip,
  useDisclosure,
} from '@heroui/react';
import { XIcon, FileImageIcon, FileVideo2Icon, SparklesIcon, TrashIcon, ImagePlusIcon } from 'lucide-react';
import type { NewsItem, PublishType } from '~types/news';
import type { EditorContent, FileData } from '~types/editor';
import { createEmptyEditorContent } from '~types/editor';
import { generateContent, generateCoverImage, fetchCoverFromUrl } from '~services/ai';
import { getAIConfig } from '~services/aiConfig';
import { PUBLISH_TYPE_CONFIGS } from '~types/news';
import AIConfigModal from './AIConfigModal';

interface AIEditorPanelProps {
  /** 选中的资讯 */
  selectedNews: NewsItem | null;
  /** 发布类型 */
  publishType: PublishType;
  /** 内容变更回调 */
  onContentChange: (content: EditorContent) => void;
  /** 初始内容 */
  initialContent?: EditorContent;
  /** 内容覆盖确认回调 */
  onOverwriteConfirm?: (confirm: boolean) => void;
}

/**
 * AI 编辑面板组件
 * 根据 publishType 显示对应编辑表单，集成 AI 生成功能
 */
const AIEditorPanel: React.FC<AIEditorPanelProps> = ({
  selectedNews,
  publishType,
  onContentChange,
  initialContent,
}) => {
  const [content, setContent] = useState<EditorContent>(initialContent || createEmptyEditorContent());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { isOpen: isAIConfigOpen, onOpen: onAIConfigOpen, onClose: onAIConfigClose } = useDisclosure();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const publishTypeLabel = PUBLISH_TYPE_CONFIGS.find((c) => c.key === publishType)?.label || publishType;

  // 内容变更时通知父组件
  useEffect(() => {
    onContentChange(content);
  }, [content, onContentChange]);

  // 处理文件上传
  const handleFileProcess = useCallback(
    (file: File): FileData => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }),
    [],
  );

  // 处理图片上传
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const newImages = Array.from(files)
        .filter((file) => file.type.startsWith('image/'))
        .map(handleFileProcess);

      setContent((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    },
    [handleFileProcess],
  );

  // 处理视频上传
  const handleVideoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (file.type.startsWith('video/')) {
        setContent((prev) => ({
          ...prev,
          videos: [handleFileProcess(file)],
        }));
      }
    },
    [handleFileProcess],
  );

  // 删除图片
  const handleDeleteImage = useCallback((index: number) => {
    setContent((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  // 删除视频
  const handleDeleteVideo = useCallback(() => {
    setContent((prev) => ({
      ...prev,
      videos: [],
    }));
  }, []);

  // 处理封面图上传
  const handleCoverChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      setContent((prev) => ({
        ...prev,
        coverImage: handleFileProcess(file),
      }));
    },
    [handleFileProcess],
  );

  // 删除封面图
  const handleDeleteCover = useCallback(() => {
    setContent((prev) => ({
      ...prev,
      coverImage: null,
    }));
  }, []);

  // AI 生成封面图
  const handleGenerateCover = useCallback(async () => {
    if (!content.title) {
      setAiError('请先输入标题');
      return;
    }

    setIsGeneratingCover(true);
    setAiError(null);

    try {
      const coverImage = await generateCoverImage(content.title, content.digest);
      setContent((prev) => ({
        ...prev,
        coverImage,
      }));
    } catch (error) {
      console.error('生成封面图失败:', error);
      setAiError(error instanceof Error ? error.message : '生成封面图失败');
    } finally {
      setIsGeneratingCover(false);
    }
  }, [content.title, content.digest]);

  // AI 生成内容
  const handleAIGenerate = useCallback(async () => {
    if (!selectedNews) return;

    setIsGenerating(true);
    setAiError(null);

    try {
      // 获取 AI 配置
      const aiConfig = await getAIConfig();

      const response = await generateContent({
        newsItem: selectedNews,
        publishType,
      });

      // 尝试从资讯获取封面图
      let coverImage: FileData | null = null;
      if (selectedNews.coverImage) {
        try {
          coverImage = await fetchCoverFromUrl(selectedNews.coverImage);
        } catch (error) {
          console.warn('获取资讯封面图失败:', error);
        }
      }

      setContent((prev) => ({
        ...prev,
        title: response.title,
        content: response.content,
        digest: response.digest,
        coverImage: coverImage || prev.coverImage,
      }));

      // 如果开启了自动生成配图，且没有从资讯获取到封面图，则自动生成
      if (aiConfig.autoGenerateImage && aiConfig.provider === 'siliconflow' && !coverImage) {
        setIsGeneratingCover(true);
        try {
          const generatedCover = await generateCoverImage(response.title, response.digest);
          setContent((prev) => ({
            ...prev,
            coverImage: generatedCover,
          }));
        } catch (error) {
          console.warn('自动生成配图失败:', error);
        } finally {
          setIsGeneratingCover(false);
        }
      }
    } catch (error) {
      console.error('AI 生成失败:', error);
      setAiError('AI 生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedNews, publishType]);

  // 选中资讯变化时自动生成
  useEffect(() => {
    if (selectedNews) {
      handleAIGenerate();
    }
  }, [selectedNews, handleAIGenerate]);

  // 清空所有内容
  const handleClearAll = useCallback(() => {
    setContent(createEmptyEditorContent());
  }, []);

  // 更新字段
  const updateField = useCallback((field: keyof EditorContent, value: string) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return (
    <Card className="h-full shadow-none bg-default-50">
      <CardHeader className="flex-col items-start gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">内容编辑</h2>
            <Chip
              size="sm"
              variant="flat"
              color="primary">
              {publishTypeLabel}
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              startContent={<SparklesIcon className="size-4" />}
              onPress={onAIConfigOpen}
              title="AI 配置">
              AI 配置
            </Button>
            {selectedNews && (
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                startContent={<SparklesIcon className="size-4" />}
                onPress={handleAIGenerate}
                isLoading={isGenerating}>
                重新生成
              </Button>
            )}
          </div>
        </div>
        {selectedNews && (
          <p className="text-xs text-default-400">
            基于资讯：{selectedNews.title.slice(0, 30)}
            {selectedNews.title.length > 30 ? '...' : ''}
          </p>
        )}
      </CardHeader>

      <CardBody className="gap-4 overflow-y-auto">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Spinner
              size="lg"
              color="primary"
            />
            <p className="text-default-500">AI 正在生成内容...</p>
          </div>
        ) : (
          <>
            {aiError && <div className="p-3 text-sm text-danger bg-danger-50 rounded-lg">{aiError}</div>}

            {/* 标题 */}
            <Input
              label="标题"
              placeholder="请输入标题"
              value={content.title}
              onChange={(e) => updateField('title', e.target.value)}
              variant="underlined"
              isClearable
              onClear={() => updateField('title', '')}
            />

            {/* 摘要 - 文章类型显示 */}
            {publishType === 'article' && (
              <Textarea
                label="摘要"
                placeholder="请输入摘要"
                value={content.digest}
                onChange={(e) => updateField('digest', e.target.value)}
                variant="underlined"
                minRows={2}
              />
            )}

            {/* 正文内容 */}
            <Textarea
              label="正文内容"
              placeholder="请输入正文内容"
              value={content.content}
              onChange={(e) => updateField('content', e.target.value)}
              variant="underlined"
              minRows={publishType === 'video' ? 8 : 10}
            />

            {/* 封面图 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">封面图</span>
                <div className="flex gap-1">
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => coverInputRef.current?.click()}
                    isDisabled={isGeneratingCover}>
                    上传
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    startContent={isGeneratingCover ? null : <ImagePlusIcon className="size-3" />}
                    onPress={handleGenerateCover}
                    isLoading={isGeneratingCover}
                    isDisabled={!content.title}>
                    AI 生成
                  </Button>
                </div>
              </div>
              {content.coverImage ? (
                <div className="relative group">
                  <Image
                    src={content.coverImage.url}
                    alt={content.coverImage.name}
                    className="object-cover w-full rounded-lg max-h-40"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    className="absolute z-10 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100"
                    onPress={handleDeleteCover}>
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg border-default-200 text-default-400">
                  <span className="text-sm">暂无封面图</span>
                </div>
              )}
            </div>

            {/* 图片列表 */}
            {content.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group">
                    <Image
                      src={img.url}
                      alt={img.name}
                      width={100}
                      height={100}
                      className="object-cover rounded-lg"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      className="absolute z-10 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100"
                      onPress={() => handleDeleteImage(index)}>
                      <XIcon className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* 视频 */}
            {content.videos.length > 0 && (
              <div className="relative group">
                <video
                  src={content.videos[0].url}
                  controls
                  className="w-full rounded-lg max-h-48"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="light"
                  className="absolute z-10 transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100"
                  onPress={handleDeleteVideo}>
                  <XIcon className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardBody>

      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
            <Button
              isIconOnly
              variant="light"
              onPress={() => imageInputRef.current?.click()}>
              <FileImageIcon className="size-5" />
            </Button>

            {publishType === 'video' && (
              <>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => videoInputRef.current?.click()}>
                  <FileVideo2Icon className="size-5" />
                </Button>
              </>
            )}
          </div>

          {(content.title || content.content || content.images.length > 0 || content.videos.length > 0) && (
            <Button
              isIconOnly
              variant="light"
              color="danger"
              onPress={handleClearAll}
              title="清空所有内容">
              <TrashIcon className="size-5" />
            </Button>
          )}
        </div>
      </CardFooter>

      {/* AI 配置弹窗 */}
      <AIConfigModal
        isOpen={isAIConfigOpen}
        onClose={onAIConfigClose}
        currentType={publishType}
      />
    </Card>
  );
};

export default AIEditorPanel;
