import { Button, Image, Popover, PopoverContent, PopoverTrigger, Switch } from '@heroui/react';
import { BookOpenText, BotIcon, SendIcon, LayoutGridIcon, LayoutListIcon } from 'lucide-react';
import { Icon } from '@iconify/react';
import React from 'react';
import { DOC_URLS, URLS } from '~config/urls';

export type LayoutMode = 'three-column' | 'tabs';

interface HeaderProps {
  /** 布局模式 */
  layoutMode?: LayoutMode;
  /** 布局模式变更回调 */
  onLayoutModeChange?: (mode: LayoutMode) => void;
}

const Header: React.FC<HeaderProps> = ({ layoutMode, onLayoutModeChange }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <Image
            src={chrome.runtime.getURL('assets/icon.png')}
            alt="logo"
            className="mr-2 w-8 h-8 rounded-full"
          />
          <a
            href={URLS.home}
            target="_blank"
            className="hover:text-blue-600">
            <h1 className="text-lg font-semibold">{chrome.i18n.getMessage('optionsTitle')}</h1>
          </a>
        </div>
        <div className="flex gap-2 items-center">
          {/* 布局模式切换 */}
          {layoutMode && onLayoutModeChange && (
            <Switch
              isSelected={layoutMode === 'three-column'}
              onValueChange={(checked) => onLayoutModeChange(checked ? 'three-column' : 'tabs')}
              size="sm"
              startContent={<LayoutGridIcon className="size-3" />}
              endContent={<LayoutListIcon className="size-3" />}>
              <span className="text-sm">{layoutMode === 'three-column' ? 'AI 创作' : '经典模式'}</span>
            </Switch>
          )}
          {/* 去网页发布 */}
          <Button
            size="sm"
            variant="flat"
            color="primary"
            as="a"
            target="_blank"
            href={URLS.publish}
            startContent={<SendIcon size={16} />}>
            <span className="text-sm">{chrome.i18n.getMessage('optionViewHomePagePublish')}</span>
          </Button>
          {/* 文档 */}
          <Popover>
            <PopoverTrigger>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<BookOpenText size={16} />}>
                <span className="text-sm">{chrome.i18n.getMessage('optionsViewDocs')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2 p-2">
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  as="a"
                  target="_blank"
                  href={DOC_URLS.userGuide}
                  startContent={<BookOpenText size={16} />}>
                  <span className="text-sm">User Guide</span>
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  as="a"
                  target="_blank"
                  href={DOC_URLS.apiReference}
                  startContent={<BotIcon size={16} />}>
                  <span className="text-sm">{chrome.i18n.getMessage('optionsViewAutomation')}</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {/* GitHub */}
          <Button
            as="a"
            href="https://github.com/BluerAngala/Multi-Publisher"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            isIconOnly
            className="text-white bg-[#24292F] hover:bg-[#24292F]/90">
            <Icon
              icon="mdi:github"
              className="size-5"
            />
          </Button>
          {/* 邮箱 */}
          <Button
            as="a"
            href="mailto:new-ai@foxmail.com"
            size="sm"
            isIconOnly
            variant="flat">
            <Icon
              icon="material-symbols:mail"
              className="size-5"
            />
          </Button>
          {/* QQ */}
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                size="sm"
                isIconOnly
                variant="flat">
                <Icon
                  icon="icon-park:tencent-qq"
                  className="size-5"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="gap-2 px-4 py-3">
                <div className="text-sm font-medium">{chrome.i18n.getMessage('optionsQQGroupTitle')}</div>
                <div className="flex gap-4 items-center">
                  <span className="text-sm">2128484413</span>
                  <Button
                    isIconOnly
                    size="sm"
                    onPress={() => navigator.clipboard.writeText('2128484413')}>
                    <Icon
                      icon="material-symbols:content-copy"
                      className="size-4"
                    />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
