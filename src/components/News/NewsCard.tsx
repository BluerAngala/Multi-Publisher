import React from 'react';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import { FileTextIcon, VideoIcon, MessageSquareIcon, StarIcon } from 'lucide-react';
import type { NewsItem, PublishType } from '~types/news';
import { PUBLISH_TYPE_CONFIGS, NEWS_SOURCE_CONFIGS } from '~types/news';

interface NewsCardProps {
  /** 资讯数据 */
  news: NewsItem;
  /** 是否选中 */
  isSelected: boolean;
  /** 选中回调 */
  onSelect: (news: NewsItem) => void;
  /** 发布类型选择回调 */
  onPublishTypeSelect: (news: NewsItem, type: PublishType) => void;
}

/**
 * 获取发布类型图标
 */
const getPublishTypeIcon = (type: PublishType) => {
  switch (type) {
    case 'dynamic':
      return <MessageSquareIcon className="size-3" />;
    case 'article':
      return <FileTextIcon className="size-3" />;
    case 'video':
      return <VideoIcon className="size-3" />;
  }
};

/**
 * 格式化发布时间
 */
const formatPublishTime = (time: string): string => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  }
  if (days < 7) {
    return `${days}天前`;
  }
  return date.toLocaleDateString('zh-CN');
};

/**
 * 资讯卡片组件
 * 展示标题、推荐指数、摘要、作者、来源、发布时间
 */
const NewsCard: React.FC<NewsCardProps> = ({ news, isSelected, onSelect, onPublishTypeSelect }) => {
  const sourceLabel = NEWS_SOURCE_CONFIGS.find((c) => c.key === news.source)?.label || news.source;

  return (
    <Card
      isPressable
      onPress={() => onSelect(news)}
      radius="sm"
      className={`w-full transition-all shrink-0 ${
        isSelected ? 'ring-2 ring-primary bg-primary-50' : 'hover:bg-default-100'
      }`}>
      <CardBody className="gap-4 p-5">
        {/* 标题和推荐指数 */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 text-base font-medium leading-relaxed">{news.title}</h3>
          <Chip
            size="md"
            variant="flat"
            color="warning"
            startContent={<StarIcon className="size-4" />}
            className="shrink-0">
            {news.recommendScore}
          </Chip>
        </div>

        {/* 摘要 - 显示完整内容 */}
        <p className="text-sm leading-loose text-default-600">{news.summary}</p>

        {/* 作者、来源、时间 */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-default-400">
          <span>{news.author}</span>
          <span>·</span>
          <span>{sourceLabel}</span>
          <span>·</span>
          <span>{formatPublishTime(news.publishTime)}</span>
        </div>

        {/* 发布类型按钮 - 仅在选中时显示，自适应宽度 */}
        {isSelected && (
          <div className="flex gap-2 pt-4 mt-2 border-t border-divider">
            {PUBLISH_TYPE_CONFIGS.map((config) => (
              <Button
                key={config.key}
                size="sm"
                variant="flat"
                color="primary"
                className="flex-1 min-w-0"
                startContent={getPublishTypeIcon(config.key)}
                onPress={() => onPublishTypeSelect(news, config.key)}>
                {config.label}
              </Button>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default NewsCard;
