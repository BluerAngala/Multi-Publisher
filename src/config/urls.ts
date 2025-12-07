/**
 * 网站相关 URL 配置
 * 统一管理所有外部链接，方便后续修改
 */

// 主域名
export const DOMAIN = 'multipost.app';

// 基础 URL（根据环境切换）
export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://${DOMAIN}`;

// 文档站点
export const DOCS_URL = `https://docs.${DOMAIN}`;

// Markdown 编辑器
export const MD_EDITOR_URL = `https://md.${DOMAIN}`;

// 页面链接
export const URLS = {
  // 首页
  home: `https://${DOMAIN}`,
  // 关于页面
  about: `https://${DOMAIN}/about`,
  // 控制台
  dashboard: `https://${DOMAIN}/dashboard`,
  // 发布页面
  publish: `https://${DOMAIN}/dashboard/publish`,
  // 初次安装页面
  onInstall: 'https://newai-tools-docs.netlify.app/',
  // favicon
  favicon: `https://${DOMAIN}/favicon.ico`,
};

// 文档链接
export const DOC_URLS = {
  // 用户指南
  userGuide: DOCS_URL,
  // API 文档
  apiReference: `${DOCS_URL}/docs/api-reference`,
  // 联系我们
  contactUs: `${DOCS_URL}/docs/user-guide/contact-us`,
};

// 默认信任域名列表
export const DEFAULT_TRUSTED_DOMAINS = [DOMAIN];
