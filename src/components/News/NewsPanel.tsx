import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import type { NewsItem, NewsSource, PublishType } from '~types/news';
import NewsTabs from './NewsTabs';
import NewsList from './NewsList';
import { fetchNewsList } from '~services/news';

interface NewsPanelProps {
  /** 资讯选择回调（包含发布类型） */
  onNewsSelect: (news: NewsItem, publishType: PublishType) => void;
  /** 当前选中的资讯 ID */
  selectedNewsId: string | null;
}

/**
 * 资讯面板主组件
 * 整合 NewsTabs、NewsList 组件，管理资讯选择状态
 */
const NewsPanel: React.FC<NewsPanelProps> = ({ onNewsSelect, selectedNewsId }) => {
  const [newsSource, setNewsSource] = useState<NewsSource>('law');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // 加载资讯列表
  const loadNews = useCallback(async (source: NewsSource) => {
    setIsLoading(true);
    try {
      const list = await fetchNewsList(source);
      setNewsList(list);
    } catch (error) {
      console.error('加载资讯失败:', error);
      setNewsList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 切换来源时加载数据
  useEffect(() => {
    loadNews(newsSource);
  }, [newsSource, loadNews]);

  // 处理来源切换
  const handleSourceChange = useCallback((source: NewsSource) => {
    setNewsSource(source);
    setSelectedNews(null);
  }, []);

  // 处理资讯选中
  const handleNewsSelect = useCallback((news: NewsItem) => {
    setSelectedNews(news);
  }, []);

  // 处理发布类型选择
  const handlePublishTypeSelect = useCallback(
    (news: NewsItem, type: PublishType) => {
      onNewsSelect(news, type);
    },
    [onNewsSelect],
  );

  return (
    <Card className="flex flex-col h-full shadow-none bg-default-50">
      <CardHeader className="flex-col items-start gap-2 px-4 pb-0 shrink-0">
        <h2 className="text-lg font-semibold">热门资讯</h2>
        <NewsTabs
          selectedSource={newsSource}
          onSourceChange={handleSourceChange}
        />
      </CardHeader>
      <CardBody className="flex flex-col flex-1 px-2 pt-4 overflow-hidden">
        <NewsList
          newsList={newsList}
          isLoading={isLoading}
          selectedNewsId={selectedNews?.id || selectedNewsId}
          onNewsSelect={handleNewsSelect}
          onPublishTypeSelect={handlePublishTypeSelect}
        />
      </CardBody>
    </Card>
  );
};

export default NewsPanel;
