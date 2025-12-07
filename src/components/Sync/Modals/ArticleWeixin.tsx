import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  Input,
  Select,
  SelectItem,
  Divider,
} from '@heroui/react';
import { Settings } from 'lucide-react';
import { saveExtraConfig, getExtraConfig } from '~sync/extraconfig';

/**
 * 微信公众号文章配置接口
 */
interface WeixinConfig {
  // 是否声明原创
  isOriginal: boolean;
  // 创作来源类型：1=原创, 4=个人观点
  claimSourceType: 1 | 4;
  // 创作来源说明
  claimSourceText: string;
  // 是否开启赞赏
  enableReward: boolean;
  // 是否开启广告
  enableAd: boolean;
  // 是否允许转载
  allowReprint: boolean;
  // 合集标题列表（通过标题匹配合集）
  albumTitles: string[];
  // 付费设置
  paySettings: {
    enabled: boolean;
    fee: number;
    previewPercent: number;
    description: string;
  };
}

interface ArticleWeixinProps {
  platformKey: string;
}

// 默认配置
const defaultConfig: WeixinConfig = {
  isOriginal: true,
  claimSourceType: 4,
  claimSourceText: '个人观点，仅供参考',
  enableReward: true,
  enableAd: true,
  allowReprint: false,
  albumTitles: [],
  paySettings: {
    enabled: false,
    fee: 0,
    previewPercent: 0,
    description: '',
  },
};

export default function ArticleWeixin({ platformKey }: ArticleWeixinProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<WeixinConfig>(defaultConfig);
  const [albumInput, setAlbumInput] = useState('');

  useEffect(() => {
    const loadConfig = async () => {
      const savedConfig = await getExtraConfig<WeixinConfig>(platformKey);
      if (savedConfig) {
        setConfig({ ...defaultConfig, ...savedConfig });
      }
    };
    if (isOpen) {
      loadConfig();
    }
  }, [platformKey, isOpen]);

  const handleSave = async () => {
    await saveExtraConfig<WeixinConfig>(platformKey, config);
    setIsOpen(false);
  };

  const addAlbumTitle = () => {
    if (albumInput.trim() && !config.albumTitles.includes(albumInput.trim())) {
      setConfig({
        ...config,
        albumTitles: [...config.albumTitles, albumInput.trim()],
      });
      setAlbumInput('');
    }
  };

  const removeAlbumTitle = (title: string) => {
    setConfig({
      ...config,
      albumTitles: config.albumTitles.filter((t) => t !== title),
    });
  };

  return (
    <>
      <Button
        variant="light"
        size="sm"
        onPress={() => setIsOpen(true)}
        className="flex items-center gap-1">
        <Settings className="w-4 h-4" />
        {chrome.i18n.getMessage('extraConfigWeixinConfigure')}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="3xl"
        placement="center"
        backdrop="blur"
        scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>{chrome.i18n.getMessage('extraConfigWeixinTitle')}</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 左栏 */}
              <div className="flex flex-col gap-5">
                {/* 原创与声明 */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-medium text-default-700">
                    {chrome.i18n.getMessage('extraConfigWeixinBasicSettings')}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{chrome.i18n.getMessage('extraConfigWeixinIsOriginal')}</span>
                    <Switch
                      isSelected={config.isOriginal}
                      onValueChange={(v) => setConfig({ ...config, isOriginal: v })}
                      size="sm"
                    />
                  </div>
                  <Select
                    label={chrome.i18n.getMessage('extraConfigWeixinClaimSourceType')}
                    selectedKeys={[config.claimSourceType.toString()]}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      setConfig({ ...config, claimSourceType: parseInt(value) as 1 | 4 });
                    }}
                    size="sm">
                    <SelectItem key="1">{chrome.i18n.getMessage('extraConfigWeixinClaimOriginal')}</SelectItem>
                    <SelectItem key="4">{chrome.i18n.getMessage('extraConfigWeixinClaimPersonal')}</SelectItem>
                  </Select>
                  <Input
                    label={chrome.i18n.getMessage('extraConfigWeixinClaimSourceText')}
                    value={config.claimSourceText}
                    onChange={(e) => setConfig({ ...config, claimSourceText: e.target.value })}
                    size="sm"
                  />
                </div>

                <Divider />

                {/* 发布开关 */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-medium text-default-700">
                    {chrome.i18n.getMessage('extraConfigWeixinPublishSettings')}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{chrome.i18n.getMessage('extraConfigWeixinEnableReward')}</span>
                    <Switch
                      isSelected={config.enableReward}
                      onValueChange={(v) => setConfig({ ...config, enableReward: v })}
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{chrome.i18n.getMessage('extraConfigWeixinEnableAd')}</span>
                    <Switch
                      isSelected={config.enableAd}
                      onValueChange={(v) => setConfig({ ...config, enableAd: v })}
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{chrome.i18n.getMessage('extraConfigWeixinAllowReprint')}</span>
                    <Switch
                      isSelected={config.allowReprint}
                      onValueChange={(v) => setConfig({ ...config, allowReprint: v })}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* 右栏 */}
              <div className="flex flex-col gap-5">
                {/* 合集设置 */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-medium text-default-700">
                    {chrome.i18n.getMessage('extraConfigWeixinAlbumSettings')}
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder={chrome.i18n.getMessage('extraConfigWeixinAlbumPlaceholder')}
                      value={albumInput}
                      onChange={(e) => setAlbumInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addAlbumTitle()}
                      size="sm"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onPress={addAlbumTitle}>
                      {chrome.i18n.getMessage('extraConfigWeixinAdd')}
                    </Button>
                  </div>
                  <p className="text-xs text-default-400">{chrome.i18n.getMessage('extraConfigWeixinAlbumTip')}</p>
                  {config.albumTitles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {config.albumTitles.map((title) => (
                        <div
                          key={title}
                          className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-default-100">
                          <span>{title}</span>
                          <button
                            onClick={() => removeAlbumTitle(title)}
                            className="text-default-400 hover:text-danger">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Divider />

                {/* 付费设置 */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-medium text-default-700">
                    {chrome.i18n.getMessage('extraConfigWeixinPaySettings')}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{chrome.i18n.getMessage('extraConfigWeixinEnablePay')}</span>
                    <Switch
                      isSelected={config.paySettings.enabled}
                      onValueChange={(v) =>
                        setConfig({
                          ...config,
                          paySettings: { ...config.paySettings, enabled: v },
                        })
                      }
                      size="sm"
                    />
                  </div>
                  {config.paySettings.enabled && (
                    <>
                      <Input
                        type="number"
                        label={chrome.i18n.getMessage('extraConfigWeixinPayFee')}
                        placeholder="10"
                        value={config.paySettings.fee > 0 ? (config.paySettings.fee / 100).toString() : ''}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            paySettings: {
                              ...config.paySettings,
                              fee: Math.round(parseFloat(e.target.value || '0') * 100),
                            },
                          })
                        }
                        endContent={<span className="text-default-400">元</span>}
                        size="sm"
                      />
                      <Input
                        type="number"
                        label={chrome.i18n.getMessage('extraConfigWeixinPayPreview')}
                        placeholder="30"
                        value={
                          config.paySettings.previewPercent > 0 ? config.paySettings.previewPercent.toString() : ''
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            paySettings: {
                              ...config.paySettings,
                              previewPercent: parseInt(e.target.value || '0'),
                            },
                          })
                        }
                        endContent={<span className="text-default-400">%</span>}
                        size="sm"
                      />
                      <Input
                        label={chrome.i18n.getMessage('extraConfigWeixinPayDesc')}
                        placeholder={chrome.i18n.getMessage('extraConfigWeixinPayDescPlaceholder')}
                        value={config.paySettings.description}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            paySettings: { ...config.paySettings, description: e.target.value },
                          })
                        }
                        size="sm"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setIsOpen(false)}>
              {chrome.i18n.getMessage('extraConfigWeixinCancel')}
            </Button>
            <Button
              color="primary"
              onPress={handleSave}>
              {chrome.i18n.getMessage('extraConfigWeixinSave')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
