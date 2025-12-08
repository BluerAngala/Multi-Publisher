import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { NewsItem, PublishType } from '~types/news';
import type { EditorContent } from '~types/editor';
import { createEmptyEditorContent } from '~types/editor';
import type { SyncData } from '~sync/common';
import NewsPanel from '~components/News/NewsPanel';
import AIEditorPanel from '~components/Editor/AIEditorPanel';
import OverwriteConfirmModal from '~components/Editor/OverwriteConfirmModal';
import PlatformPanel from '~components/Platform/PlatformPanel';

interface ThreeColumnLayoutProps {
  /** 发布回调 */
  funcPublish: (data: SyncData) => void;
}

/** 默认列宽比例 3:4:3 */
const DEFAULT_WIDTHS = [30, 40, 30]; // 左、中、右
const MIN_WIDTH_PERCENT = 20; // 最小宽度百分比
const MAX_WIDTH_PERCENT = 60; // 最大宽度百分比

/**
 * 检查内容是否有手动输入
 */
const hasManualContent = (content: EditorContent): boolean => {
  return !!(
    content.title ||
    content.content ||
    content.digest ||
    content.images.length > 0 ||
    content.videos.length > 0
  );
};

/**
 * 三栏布局组件
 * 管理左中右三栏之间的数据流和状态
 */
const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ funcPublish }) => {
  // 资讯相关状态
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // 编辑器相关状态
  const [publishType, setPublishType] = useState<PublishType>('dynamic');
  const [editorContent, setEditorContent] = useState<EditorContent>(createEmptyEditorContent());

  // 平台相关状态
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // 覆盖确认对话框状态
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [pendingNews, setPendingNews] = useState<{ news: NewsItem; type: PublishType } | null>(null);

  // 列宽状态（百分比）
  const [columnWidths, setColumnWidths] = useState<number[]>(DEFAULT_WIDTHS);

  // 拖拽状态
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理拖拽开始
  const handleDragStart = useCallback((dividerIndex: number) => {
    setIsDragging(dividerIndex);
  }, []);

  // 处理拖拽移动
  useEffect(() => {
    if (isDragging === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const mousePercent = (mouseX / containerWidth) * 100;

      setColumnWidths((prev) => {
        const newWidths = [...prev];

        if (isDragging === 0) {
          // 拖拽第一个分隔条（左栏和中栏之间）
          const leftWidth = Math.max(MIN_WIDTH_PERCENT, Math.min(MAX_WIDTH_PERCENT, mousePercent));
          const diff = leftWidth - prev[0];
          newWidths[0] = leftWidth;
          newWidths[1] = Math.max(MIN_WIDTH_PERCENT, prev[1] - diff);
        } else if (isDragging === 1) {
          // 拖拽第二个分隔条（中栏和右栏之间）
          const leftAndCenter = prev[0] + prev[1];
          const newLeftAndCenter = Math.max(
            prev[0] + MIN_WIDTH_PERCENT,
            Math.min(100 - MIN_WIDTH_PERCENT, mousePercent),
          );
          const centerWidth = newLeftAndCenter - prev[0];
          newWidths[1] = Math.max(MIN_WIDTH_PERCENT, Math.min(MAX_WIDTH_PERCENT, centerWidth));
          newWidths[2] = 100 - prev[0] - newWidths[1];
        }

        // 确保总和为 100
        const total = newWidths.reduce((a, b) => a + b, 0);
        if (Math.abs(total - 100) > 0.1) {
          newWidths[2] = 100 - newWidths[0] - newWidths[1];
        }

        return newWidths;
      });
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 处理资讯选择
  const handleNewsSelect = useCallback(
    (news: NewsItem, type: PublishType) => {
      // 检查是否有手动输入的内容
      if (hasManualContent(editorContent)) {
        // 显示覆盖确认对话框
        setPendingNews({ news, type });
        setShowOverwriteModal(true);
      } else {
        // 直接选择资讯
        setSelectedNews(news);
        setSelectedNewsId(news.id);
        // 如果发布类型变化，清空已选平台
        if (type !== publishType) {
          setSelectedPlatforms([]);
        }
        setPublishType(type);
      }
    },
    [editorContent, publishType],
  );

  // 确认覆盖内容
  const handleOverwriteConfirm = useCallback(() => {
    if (pendingNews) {
      setSelectedNews(pendingNews.news);
      setSelectedNewsId(pendingNews.news.id);
      // 如果发布类型变化，清空已选平台
      if (pendingNews.type !== publishType) {
        setSelectedPlatforms([]);
      }
      setPublishType(pendingNews.type);
      setEditorContent(createEmptyEditorContent());
      setPendingNews(null);
    }
  }, [pendingNews, publishType]);

  // 取消覆盖
  const handleOverwriteCancel = useCallback(() => {
    setPendingNews(null);
  }, []);

  // 处理内容变更
  const handleContentChange = useCallback((content: EditorContent) => {
    setEditorContent(content);
  }, []);

  // 处理平台选择变更
  const handlePlatformChange = useCallback((platforms: string[]) => {
    setSelectedPlatforms(platforms);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col p-3 lg:flex-row lg:h-[calc(100vh-80px)] ${isDragging !== null ? 'select-none' : ''}`}>
      {/* 左栏 - 资讯选择 */}
      <div
        className="h-full"
        style={{ width: `${columnWidths[0]}%` }}>
        <NewsPanel
          onNewsSelect={handleNewsSelect}
          selectedNewsId={selectedNewsId}
        />
      </div>

      {/* 第一个拖拽分隔条 */}
      <div
        className="hidden lg:flex items-center justify-center w-2 cursor-col-resize group hover:bg-primary/10"
        onMouseDown={() => handleDragStart(0)}>
        <div className="w-0.5 h-16 bg-default-300 group-hover:bg-primary rounded-full transition-colors" />
      </div>

      {/* 中栏 - AI 编辑 */}
      <div
        className="h-full"
        style={{ width: `${columnWidths[1]}%` }}>
        <AIEditorPanel
          selectedNews={selectedNews}
          publishType={publishType}
          onContentChange={handleContentChange}
          initialContent={editorContent}
        />
      </div>

      {/* 第二个拖拽分隔条 */}
      <div
        className="hidden lg:flex items-center justify-center w-2 cursor-col-resize group hover:bg-primary/10"
        onMouseDown={() => handleDragStart(1)}>
        <div className="w-0.5 h-16 bg-default-300 group-hover:bg-primary rounded-full transition-colors" />
      </div>

      {/* 右栏 - 平台选择 */}
      <div
        className="h-full"
        style={{ width: `${columnWidths[2]}%` }}>
        <PlatformPanel
          publishType={publishType}
          content={editorContent}
          onPublish={funcPublish}
          selectedPlatforms={selectedPlatforms}
          onPlatformChange={handlePlatformChange}
        />
      </div>

      {/* 覆盖确认对话框 */}
      <OverwriteConfirmModal
        isOpen={showOverwriteModal}
        onClose={() => setShowOverwriteModal(false)}
        onConfirm={handleOverwriteConfirm}
        onCancel={handleOverwriteCancel}
      />
    </div>
  );
};

export default ThreeColumnLayout;
