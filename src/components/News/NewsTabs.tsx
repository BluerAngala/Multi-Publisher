import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import type { NewsSource } from '~types/news';
import { NEWS_SOURCE_CONFIGS } from '~types/news';

interface NewsTabsProps {
  /** 当前选中的来源 */
  selectedSource: NewsSource;
  /** 来源切换回调 */
  onSourceChange: (source: NewsSource) => void;
}

/**
 * 资讯来源标签组件
 * 实现微信爆文、小红书爆文、知乎爆款、抖音爆款标签切换
 */
const NewsTabs: React.FC<NewsTabsProps> = ({ selectedSource, onSourceChange }) => {
  return (
    <Tabs
      aria-label="资讯来源"
      selectedKey={selectedSource}
      onSelectionChange={(key) => onSourceChange(key as NewsSource)}
      variant="underlined"
      classNames={{
        tabList: 'gap-2 w-full relative rounded-none p-0 border-b border-divider',
        cursor: 'w-full bg-primary',
        tab: 'max-w-fit px-2 h-10',
        tabContent: 'group-data-[selected=true]:text-primary',
      }}>
      {NEWS_SOURCE_CONFIGS.map((config) => (
        <Tab
          key={config.key}
          title={config.label}
        />
      ))}
    </Tabs>
  );
};

export default NewsTabs;
