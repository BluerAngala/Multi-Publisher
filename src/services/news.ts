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
 * Mock 资讯数据生成
 */
const generateMockNews = (source: NewsSource, count: number = 10): NewsItem[] => {
  const sourceNames: Record<NewsSource, string> = {
    weixin: '微信公众号',
    xiaohongshu: '小红书',
    zhihu: '知乎',
    douyin: '抖音',
    law: '法律资讯',
  };

  const mockTitles: Record<NewsSource, string[]> = {
    weixin: [
      '深度解析：2024年AI技术发展趋势',
      '职场人必看：高效工作的10个秘诀',
      '健康生活：每天坚持这5件事',
      '理财入门：年轻人如何开始投资',
      '心理学：如何建立良好的人际关系',
    ],
    xiaohongshu: [
      '超好用的护肤品推荐！亲测有效',
      '今日穿搭分享｜简约风格',
      '美食探店｜这家店太好吃了',
      '旅行攻略｜三天两夜完美行程',
      '家居好物｜提升幸福感的小物件',
    ],
    zhihu: [
      '如何看待当前的经济形势？',
      '有哪些让你相见恨晚的学习方法？',
      '程序员如何提升自己的技术能力？',
      '读书真的能改变一个人吗？',
      '如何培养批判性思维？',
    ],
    douyin: [
      '爆款视频创作技巧分享',
      '3分钟学会一道家常菜',
      '健身打卡第100天的变化',
      '宠物日常｜太可爱了',
      '生活小妙招｜超实用',
    ],
    law: ['最新法律法规解读', '民法典实施要点', '劳动法权益保护', '消费者维权指南', '知识产权保护'],
  };

  return Array.from({ length: count }, (_, index) => {
    const titles = mockTitles[source];
    const title = titles[index % titles.length];
    const now = new Date();
    const publishTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    return {
      id: `${source}-${index}-${Date.now()}`,
      title: `${title}${index > 0 ? ` (${index + 1})` : ''}`,
      summary: `这是一篇来自${sourceNames[source]}的热门内容，讲述了关于${title.slice(0, 10)}的精彩内容...`,
      author: `${sourceNames[source]}作者${index + 1}`,
      source,
      publishTime: publishTime.toISOString(),
      recommendScore: Math.floor(Math.random() * 30) + 70,
      originalUrl: `https://example.com/${source}/${index}`,
      tags: ['热门', '推荐'],
    };
  });
};

/**
 * 获取资讯列表
 * @param source 资讯来源
 * @returns 资讯列表
 */
export async function fetchNewsList(source: NewsSource): Promise<NewsItem[]> {
  // 法律资讯使用真实 API
  if (source === 'law') {
    return fetchLawNews();
  }

  // 其他来源使用 mock 数据
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateMockNews(source, 10);
}

/**
 * 获取资讯详情
 * @param id 资讯 ID
 * @returns 资讯详情
 */
export async function fetchNewsDetail(id: string): Promise<NewsItem | null> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 从 ID 中解析来源
  const source = id.split('-')[0] as NewsSource;
  const mockList = generateMockNews(source, 10);

  return mockList.find((item) => item.id === id) || null;
}
