import type { NewsItem, NewsSource } from '~types/news';

/**
 * 法律资讯 API 响应类型
 */
interface LawNewsApiResponse {
  code: number;
  msg: string;
  data: Array<{
    id: string;
    title: string;
    focus_date: string;
    url: string;
    image: string;
    brief: string;
    keywords: string;
  }>;
}

/**
 * 获取法律资讯
 */
async function fetchLawNews(): Promise<NewsItem[]> {
  const response = await fetch('https://env-00jxtnydr3fv.dev-hz.cloudbasefunction.cn/get_lawNews');
  const result: LawNewsApiResponse = await response.json();

  if (result.code !== 200) {
    throw new Error(result.msg || '获取法律资讯失败');
  }

  return result.data.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.brief,
    author: '央视网',
    source: 'law' as NewsSource,
    publishTime: new Date(item.focus_date).toISOString(),
    recommendScore: 85,
    coverImage: item.image || undefined,
    originalUrl: item.url,
    tags: item.keywords ? item.keywords.split(' ').slice(0, 3) : ['法治', '新闻'],
  }));
}

/**
 * 获取资讯列表
 * @param source 资讯来源
 * @returns 资讯列表
 */
export async function fetchNewsList(source: NewsSource): Promise<NewsItem[]> {
  switch (source) {
    case 'law':
      return fetchLawNews();
    default:
      return [];
  }
}

/**
 * 获取资讯详情
 * @param id 资讯 ID
 * @returns 资讯详情
 */
export async function fetchNewsDetail(id: string): Promise<NewsItem | null> {
  // 暂时返回 null，后续可根据需要实现
  console.log('fetchNewsDetail:', id);
  return null;
}
