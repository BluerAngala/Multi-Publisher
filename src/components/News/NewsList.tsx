import React from 'react';
import { Spinner } from '@heroui/react';
import type { NewsItem, PublishType } from '~types/news';
import NewsCard from './NewsCard';

interface NewsListProps {
  /** 资讯列表 */
  newsList: NewsItem[];
  /** 是否加载中 */
  isLoading: boolean;
  /** 选中的资讯 ID */
  selectedNewsId: string | null;
  /** 资讯选中回调 */
  onNewsSelect: (news: NewsItem) => void;
  /** 发布类型选择回调 */
  onPublishTypeSelect: (news: NewsItem, type: PublishType) => void;
}

/**
 * 资讯列表组件
 * 实现资讯列表渲染和滚动加载
 */
const NewsList: React.FC<NewsListProps> = ({
  newsList,
  isLoading,
  selectedNewsId,
  onNewsSelect,
  onPublishTypeSelect,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner
          size="lg"
          label="加载中..."
        />
      </div>
    );
  }

  if (newsList.length === 0) {
    return <div className="py-8 text-center text-default-400">暂无资讯数据</div>;
  }

  return (
    <div className="flex flex-col gap-4 px-2 pt-2 pb-4 overflow-y-auto flex-1">
      {newsList.map((news) => (
        <NewsCard
          key={news.id}
          news={news}
          isSelected={selectedNewsId === news.id}
          onSelect={onNewsSelect}
          onPublishTypeSelect={onPublishTypeSelect}
        />
      ))}
    </div>
  );
};

export default NewsList;
