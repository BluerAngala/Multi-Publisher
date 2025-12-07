/**
 * 微信公众号文章发布完整测试脚本
 *
 * 使用方法：
 * 1. 登录微信公众号后台 https://mp.weixin.qq.com/
 * 2. 打开浏览器开发者工具（F12）
 * 3. 在 Console 中粘贴并执行此脚本
 * 4. 文章会创建为草稿，并自动跳转到编辑页
 */

(async function () {
  // 测试数据
  const testArticleData = {
    title: '测试文章标题 - ' + new Date().toLocaleString(),
    digest: '这是一篇测试文章的摘要，用于验证 MultiPost 扩展的微信公众号发布功能是否正常工作。',
    htmlContent: `
      <p style="font-size: 0px;line-height: 0;margin: 0px;" data-pm-slice="0 0 []"><span leaf="">&nbsp;</span></p><section style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 17px;"><h1 data-heading="true" style="text-align: center;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 1.5em;display: table;padding: 0.5em 1em;border-bottom: none;margin: 2em auto 1em;color: #000;font-weight: bold;text-shadow: 2px 2px 4px rgba(0,0,0,0.1);margin-top: 0;" id="0"><span leaf="">251207测试</span></h1><p style="text-align: justify;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 15px;margin: 1.75em 8px;letter-spacing: 0.1em;color: #3f3f3f;word-break: break-all;"><span leaf="">大家好，我是喜欢&nbsp;</span><strong style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: inherit;color: #3016E1FF;font-weight: bold;"><span leaf="">vibe coding</span></strong><span leaf="">&nbsp;的陈恒律师。</span></p><h2 data-heading="true" style="text-align: center;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 1.3em;display: table;padding: 0;margin: 1.5em auto;color: #3016E1FF;background: none;font-weight: bold;border-radius: 8px;box-shadow: none;text-shadow: 5px 5px 8px rgba(0,0,0,0.1);" id="1"><span leaf="">功能展示</span></h2><p style="text-align: justify;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 15px;margin: 1.75em 8px;letter-spacing: 0.1em;color: #3f3f3f;word-break: break-all;"><strong style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: inherit;color: #3016E1FF;font-weight: bold;"><span leaf="">注意：</span></strong><br><strong style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: inherit;color: #3016E1FF;font-weight: bold;"><span leaf="">本工具所有功能均在浏览器本地处理！！！</span></strong><br><strong style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: inherit;color: #3016E1FF;font-weight: bold;"><span leaf="">🔒 使用本地资源识别</span></strong><br><strong style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: inherit;color: #3016E1FF;font-weight: bold;"><span leaf="">🛡️ 数据隐私保密，不作任何采集</span></strong></p><h3 data-heading="true" style="text-align: left;line-height: 1.2;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 20.4px;padding-left: 12px;border-left: 4px solid #3016E1FF;margin: 2em 8px 0.75em 0;color: #3f3f3f;font-weight: bold;border-bottom: 1px dashed #3016E1FF;" id="2"><span leaf="">1.首页功能一览表</span></h3><figure style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 17px;margin: 1.5em 8px;color: #3f3f3f;"><span leaf=""><img alt="未经授权，请勿转载" class="rich_pages wxw-img" data-type="png" style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 17px;display: block;max-width: 100%;margin: 0.1em auto 0.5em;border-radius: 8px;box-shadow: 0 4px 8px rgba(0,0,0,0.1);" title="null" data-imgfileid="100007206" data-imgqrcoded="1" data-src="https://mmbiz.qlogo.cn/sz_mmbiz_png/WRA0SN8Liary3uBiceVVDwKjU66yUXgMgktDh7dJG7x4joTv5EN3Gs7ktqsw24EVGplDTBOziaOVyPKR2sQcAEk1A/0?wx_fmt=png&amp;from=appmsg"></span><figcaption style="text-align: center;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 0.8em;color: #888;"><span leaf="">未经授权，请勿转载</span></figcaption></figure></section><p style="font-size: 0px;line-height: 0;margin: 0px;"><span leaf="">&nbsp;</span></p><section><span leaf=""><br></span></section><p style="display: none;"><mp-style-type data-value="3"></mp-style-type></p>

    `,
    cover: {
      url: 'https://picsum.photos/1200/800',
    },
    // 微信公众号配置选项
    weixinOptions: {
      isOriginal: true, // 是否声明原创（默认 true）
      claimSourceType: 4, // 创作来源类型：1=原创, 4=个人观点（默认 4）
      claimSourceText: '个人观点，仅供参考', // 创作来源说明
      enableReward: true, // 是否开启赞赏（默认 true）
      rewardReplyId: 1, // 赞赏自动回复 ID（默认 1）
      enableAd: true, // 是否开启广告（默认 true）
      sourceUrl: '', // 原文链接
      allowReprint: false, // 是否允许转载（默认 false）
      // 合集配置（二选一或同时使用）
      albumIds: [], // 通过合集 ID 指定，如 ['3835409544988999680']
      albumTitles: ['法律与AI'], // 通过标题关键词匹配
      // 付费设置（可选）
      paySettings: {
        enabled: true, // 是否开启付费（默认 false）
        fee: 1000, // 付费金额（单位：分，1000=10元）
        previewPercent: 91, // 免费预览比例（0-100）
        description: '付费阅读全文', // 付费说true明
      },
    },
  };

  console.log('=== 微信公众号发布完整测试 ===');
  console.log('测试数据:', testArticleData);

  // 获取认证信息
  async function readInfo() {
    console.log('\n[步骤1] 获取认证信息...');
    const response = await fetch('https://mp.weixin.qq.com/');
    const html = await response.text();

    const dataMatch = html.match(/window\.wx\.commonData\s*=\s*\{([\s\S]*?)\};/);
    if (!dataMatch) throw new Error('无法获取微信公众号信息，请确认已登录');

    const tokenMatch = dataMatch[1].match(/t:\s*["'](\d+)["']/);
    const nicknameMatch = dataMatch[1].match(/nick_name:\s*["']([^"']+)["']/);
    const ticketMatch = dataMatch[1].match(/ticket:\s*["']([^"']+)["']/);
    const userNameMatch = dataMatch[1].match(/user_name:\s*["']([^"']+)["']/);

    if (!tokenMatch) throw new Error('无法获取 token，请重新登录');

    const info = {
      token: tokenMatch[1],
      nickname: nicknameMatch ? nicknameMatch[1] : '',
      ticket: ticketMatch ? ticketMatch[1] : '',
      userName: userNameMatch ? userNameMatch[1] : '',
    };
    console.log('✅ 认证信息:', info);
    return info;
  }

  // 获取合集列表
  async function getAlbumList(token) {
    console.log('\n[步骤1.1] 获取合集列表...');
    const url = new URL('https://mp.weixin.qq.com/cgi-bin/appmsgalbummgr');
    url.searchParams.set('action', 'list');
    url.searchParams.set('begin', '0');
    url.searchParams.set('count', '50');
    url.searchParams.set('type', '0');
    url.searchParams.set('latest', '1');
    url.searchParams.set('need_pay', '0');
    url.searchParams.set('token', token);
    url.searchParams.set('lang', 'zh_CN');
    url.searchParams.set('f', 'json');
    url.searchParams.set('ajax', '1');

    const response = await fetch(url.toString(), {
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    });
    const result = await response.json();

    if (result.base_resp?.ret !== 0) {
      console.log('⚠️ 获取合集列表失败');
      return [];
    }

    const albums = result.list_resp?.items || [];
    console.log('✅ 获取到', albums.length, '个合集');
    return albums;
  }

  // 获取赞赏作者信息
  async function getRewardAuthor(token) {
    console.log('\n[步骤1.1] 获取赞赏作者信息...');
    const url = new URL('https://mp.weixin.qq.com/cgi-bin/mmbizfrontendcommstore');
    url.searchParams.set('operate_type', 'GetServiceData');
    url.searchParams.set('service_name', 'mp-history-reward-user');
    url.searchParams.set('service_option', '1');
    url.searchParams.set('token', token);
    url.searchParams.set('lang', 'zh_CN');
    url.searchParams.set('f', 'json');
    url.searchParams.set('ajax', '1');

    const response = await fetch(url.toString());
    const result = await response.json();

    if (result.base_resp?.ret !== 0) {
      console.log('⚠️ 获取赞赏作者失败，使用默认值');
      return { writerid: '0', authorNickname: '' };
    }

    const serviceData = JSON.parse(result.service_data || '[]');
    if (serviceData.length > 0 && serviceData[0].can_reward === 1) {
      const author = serviceData[0];
      console.log('✅ 赞赏作者:', author.nickname, 'writerid:', author.writerid);
      return { writerid: author.writerid, authorNickname: author.nickname };
    }

    console.log('⚠️ 未找到可用的赞赏作者');
    return { writerid: '0', authorNickname: '' };
  }

  // 获取图片尺寸
  async function getImageInfo(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(blob);
      img.onload = () => {
        resolve({ width: img.width, height: img.height, blob });
        URL.revokeObjectURL(objectUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('获取图片尺寸失败'));
      };
      img.src = objectUrl;
    });
  }

  // 上传图片
  async function uploadImage(token, ticket, userName, imageUrl, scene = 8) {
    console.log('\n[步骤2] 上传封面图片...');
    const blob = await (await fetch(imageUrl)).blob();
    console.log('图片大小:', blob.size, 'bytes');

    const formData = new FormData();
    formData.append('type', blob.type);
    formData.append('id', Date.now().toString());
    formData.append('name', `${Date.now()}.jpg`);
    formData.append('lastModifiedDate', new Date().toString());
    formData.append('size', blob.size.toString());
    formData.append('file', blob, `${Date.now()}.jpg`);

    const url = new URL('https://mp.weixin.qq.com/cgi-bin/filetransfer');
    url.searchParams.append('action', 'upload_material');
    url.searchParams.append('f', 'json');
    url.searchParams.append('scene', scene.toString());
    url.searchParams.append('writetype', 'doublewrite');
    url.searchParams.append('groupid', '1');
    url.searchParams.append('ticket_id', userName);
    url.searchParams.append('ticket', ticket);
    url.searchParams.append('svr_time', Math.floor(Date.now() / 1000).toString());
    url.searchParams.append('token', token);
    url.searchParams.append('lang', 'zh_CN');
    url.searchParams.append('seq', Date.now().toString());

    const response = await fetch(url.toString(), { method: 'POST', body: formData });
    const result = await response.json();
    console.log('上传响应:', result);

    if (result.base_resp?.err_msg !== 'ok') {
      throw new Error('图片上传失败: ' + JSON.stringify(result));
    }

    const uploadResult = { fileId: parseInt(result.content, 10), url: result.cdn_url };
    console.log('✅ 图片上传成功:', uploadResult);
    return uploadResult;
  }

  // 计算裁剪配置
  function calculateCropConfig(ratio, width, height) {
    let x1, y1, x2, y2;
    if (width / height > ratio) {
      const targetWidth = height * ratio;
      const cropPercent = (width - targetWidth) / 2 / width;
      x1 = cropPercent;
      y1 = 0;
      x2 = 1 - cropPercent;
      y2 = 1;
    } else {
      const targetHeight = width / ratio;
      const cropPercent = (height - targetHeight) / 2 / height;
      x1 = 0;
      y1 = cropPercent;
      x2 = 1;
      y2 = 1 - cropPercent;
    }
    return { x1, y1, x2, y2 };
  }

  // 裁剪图片
  async function cropImage(token, image, cropConfigs) {
    console.log('\n[步骤3] 裁剪封面图片...');
    const formData = new FormData();
    formData.append('imgurl', image.url);
    formData.append('size_count', cropConfigs.length.toString());

    cropConfigs.forEach((config, index) => {
      formData.append(`size${index}_x1`, config.x1.toString());
      formData.append(`size${index}_y1`, config.y1.toString());
      formData.append(`size${index}_x2`, config.x2.toString());
      formData.append(`size${index}_y2`, config.y2.toString());
    });

    formData.append('token', token);
    formData.append('lang', 'zh_CN');
    formData.append('f', 'json');
    formData.append('ajax', '1');

    const response = await fetch('https://mp.weixin.qq.com/cgi-bin/cropimage?action=crop_multi', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('裁剪响应:', result);

    if (result.base_resp?.err_msg !== 'ok') {
      throw new Error('图片裁剪失败: ' + JSON.stringify(result));
    }

    const cropedImages = result.result.map((item) => ({
      url: item.cdnurl,
      fileId: item.file_id,
      height: item.height,
      width: item.width,
    }));
    console.log('✅ 图片裁剪成功:', cropedImages);
    return cropedImages;
  }

  // 创建文章
  async function createArticle(token, nickname, content, cropedImages, writerid) {
    console.log('\n[步骤4] 创建文章...');
    const formData = new FormData();

    // 获取微信配置选项
    const wxOpts = testArticleData.weixinOptions || {};
    const isOriginal = wxOpts.isOriginal !== false;
    const claimSourceType = wxOpts.claimSourceType || 4;
    const claimSourceText = wxOpts.claimSourceText || '个人观点，仅供参考';
    const enableReward = wxOpts.enableReward !== false;
    const rewardReplyId = wxOpts.rewardReplyId ?? 1;
    const enableAd = wxOpts.enableAd !== false;
    const sourceUrl = wxOpts.sourceUrl || '';
    const allowReprint = wxOpts.allowReprint || false;
    // 付费设置
    const paySettings = wxOpts.paySettings || {};
    const enablePay = paySettings.enabled || false;
    const payFee = paySettings.fee || 0;
    const payPreviewPercent = paySettings.previewPercent || 0;
    const payDesc = paySettings.description || '';

    console.log('微信配置:', {
      isOriginal,
      claimSourceType,
      enableReward,
      rewardReplyId,
      enableAd,
      sourceUrl,
      allowReprint,
    });
    console.log('付费配置:', { enablePay, payFee, payPreviewPercent, payDesc });

    // 基础参数
    formData.append('token', token);
    formData.append('lang', 'zh_CN');
    formData.append('f', 'json');
    formData.append('ajax', '1');
    formData.append('random', Math.random().toString());
    formData.append('AppMsgId', '');
    formData.append('count', '1');
    formData.append('data_seq', '0');
    formData.append('operate_from', 'Chrome');
    formData.append('isnew', '0');
    formData.append('articlenum', '1');
    formData.append('pre_timesend_set', '0');

    // 文章基本信息
    formData.append('title0', testArticleData.title);
    formData.append('author0', nickname);
    formData.append('writerid0', writerid); // 作者ID，开启赞赏需要
    formData.append('fileid0', '');
    formData.append('digest0', testArticleData.digest.slice(0, 120));
    formData.append('auto_gen_digest0', '1');

    // 如果开启付费，在内容中插入付费分割标记
    let finalContent = content;
    if (enablePay && payPreviewPercent > 0 && payPreviewPercent < 100) {
      // 计算分割位置（按字符数百分比）
      const splitIndex = Math.floor(content.length * (payPreviewPercent / 100));
      // 找到最近的标签结束位置，避免截断 HTML 标签
      let insertPos = content.lastIndexOf('>', splitIndex);
      if (insertPos === -1) insertPos = splitIndex;
      else insertPos += 1;
      // 插入付费分割标记
      const payMarker =
        '<p class="js_pay_preview_filter"><mp-pay-preview-filter data-offset="' +
        insertPos +
        '"></mp-pay-preview-filter></p>';
      finalContent = content.slice(0, insertPos) + payMarker + content.slice(insertPos);
      console.log('插入付费分割标记，位置:', insertPos);
    }
    formData.append('content0', finalContent);
    formData.append('is_user_title0', '');

    // 原文链接
    formData.append('sourceurl0', sourceUrl);

    // 评论设置
    formData.append('need_open_comment0', '1');
    formData.append('only_fans_can_comment0', '0');
    formData.append('only_fans_days_can_comment0', '0');
    formData.append('reply_flag0', '3');
    formData.append('not_pay_can_comment0', '0');
    formData.append('auto_elect_comment0', '1');
    formData.append('auto_elect_reply0', '1');
    formData.append('option_version0', '5');
    formData.append('open_fansmsg0', '0');

    // 封面图片
    const defaultImage = cropedImages[1]?.url || cropedImages[0]?.url || '';
    formData.append('cdn_url0', defaultImage);
    formData.append('cdn_235_1_url0', defaultImage);
    formData.append('cdn_16_9_url0', cropedImages[0]?.url || '');
    formData.append('cdn_3_4_url0', cropedImages[2]?.url || '');
    formData.append('cdn_1_1_url0', cropedImages[1]?.url || '');
    formData.append('cdn_finder_url0', '');
    formData.append('cdn_video_url0', '');
    formData.append('cdn_url_back0', cropedImages[1]?.url || '');
    formData.append('last_choose_cover_from0', '0');
    formData.append('app_cover_auto0', '0');

    // 裁剪配置
    formData.append(
      'crop_list0',
      JSON.stringify({
        crop_list: [
          { ratio: '2.35_1', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: '1_1', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: '3_4', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: '16_9', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: 'video', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: 'finder', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
        ],
        crop_list_percent: [
          { ratio: '2.35_1', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: '1_1', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: '3_4', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: '16_9', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: 'video', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
          { ratio: 'finder', x1: 0, y1: 0, x2: 0, y2: 0, file_id: 0 },
        ],
      }),
    );

    // 视频相关
    formData.append('is_finder_video0', '0');
    formData.append('finder_draft_id0', '0');
    formData.append('ad_video_transition0', '');
    formData.append('related_video0', '');
    formData.append('is_video_recommend0', '0');
    formData.append('music_id0', '');
    formData.append('video_id0', '');
    formData.append('vid_type0', '');
    formData.append('show_cover_pic0', '0');

    // 投票相关
    formData.append('voteid0', '');
    formData.append('voteismlt0', '');
    formData.append('supervoteid0', '');
    formData.append('super_vote_id0', '');

    // 原创声明相关
    formData.append('copyright_type0', isOriginal ? '1' : '0'); // 1=声明原创
    formData.append('is_cartoon_copyright0', '0');
    formData.append('copyright_img_list0', JSON.stringify({ max_width: 586, img_list: [] }));
    formData.append('platform0', '');
    formData.append('allow_fast_reprint0', '0');
    formData.append('allow_reprint0', allowReprint ? '1' : '0'); // 是否允许转载
    formData.append('allow_reprint_modify0', '0');
    formData.append('original_article_type0', '');
    formData.append('ori_white_list0', JSON.stringify({ white_list: [] }));
    formData.append('video_ori_status0', '');
    formData.append('hit_nickname0', '');

    // 付费相关
    formData.append('free_content0', '');
    formData.append('fee0', '0');
    formData.append('is_pay_subscribe0', enablePay ? '1' : '0');
    formData.append('pay_fee0', enablePay ? payFee.toString() : '');
    formData.append('pay_preview_percent0', enablePay ? payPreviewPercent.toString() : '');
    formData.append('pay_desc0', enablePay ? payDesc : '');
    formData.append(
      'pay_album_info0',
      JSON.stringify({ id: '', title: '', is_updating: 1, is_ban: 0, total: 0, pay_max_count: 0 }),
    );

    // 广告相关
    formData.append('ad_id0', '');
    formData.append('guide_words0', '');
    formData.append('can_insert_ad0', enableAd ? '1' : '0');
    formData.append('open_keyword_ad0', enableAd ? '1' : '0'); // 开启关键词广告
    formData.append('open_comment_ad0', enableAd ? '1' : '0'); // 开启评论区广告
    formData.append('insert_ad_mode0', enableAd ? '2' : '0'); // 文中广告模式

    // 分享相关
    formData.append('is_share_copyright0', '0');
    formData.append('share_copyright_url0', '');
    formData.append('source_article_type0', '');
    formData.append('reprint_recommend_title0', '');
    formData.append('reprint_recommend_content0', '');
    formData.append('share_page_type0', '0');
    formData.append('share_imageinfo0', JSON.stringify({ list: [] }));
    formData.append('share_video_id0', '');
    formData.append('dot0', '{}');
    formData.append('share_voice_id0', '');
    formData.append('share_finder_audio_username0', '');
    formData.append('share_finder_audio_exportid0', '');
    formData.append('mmlistenitem_json_buf0', '');

    // 赞赏设置
    formData.append('can_reward0', enableReward ? '1' : '0'); // 是否开启赞赏
    formData.append('pay_gifts_count0', '0');
    formData.append('reward_reply_id0', enableReward ? rewardReplyId.toString() : '0'); // 赞赏自动回复ID

    // 创作来源声明
    formData.append('applyori0', '0');
    formData.append('claim_source_type0', claimSourceType.toString()); // 1=原创, 4=个人观点
    formData.append('is_user_no_claim_source0', '0');

    // 合集设置（动态获取）
    const albumIds = wxOpts.albumIds || [];
    const albumTitles = wxOpts.albumTitles || [];
    let selectedAlbums = [];

    if (albumIds.length > 0 || albumTitles.length > 0) {
      const allAlbums = await getAlbumList(token);
      selectedAlbums = allAlbums.filter(
        (album) => albumIds.includes(album.id) || albumTitles.some((title) => album.title.includes(title)),
      );
      console.log(
        '匹配到的合集:',
        selectedAlbums.map((a) => a.title),
      );
    }

    const albumInfos = selectedAlbums.map((album) => ({
      id: album.id,
      title: album.title,
      album_id: album.id,
      appmsg_album_infos: [],
      tagSource: 0,
    }));
    formData.append('appmsg_album_info0', JSON.stringify({ appmsg_album_infos: albumInfos }));

    // 分类
    formData.append('categories_list0', '[]');

    // 音频相关
    formData.append('audio_info0', JSON.stringify({ audio_infos: [] }));
    formData.append('danmu_pub_type0', '0');
    formData.append('mp_video_info0', JSON.stringify({ list: [] }));
    formData.append('appmsg_danmu_pub_type0', '');

    // 视频号同步
    formData.append('is_set_sync_to_finder0', '0');
    formData.append('sync_to_finder_cover0', '');
    formData.append('sync_to_finder_cover_source0', '');
    formData.append('import_to_finder0', '0');
    formData.append('import_from_finder_export_id0', '');

    // 样式和贴纸
    formData.append('style_type0', '10000');
    formData.append(
      'sticker_info0',
      JSON.stringify({
        is_stickers: 0,
        common_stickers_num: 0,
        union_stickers_num: 0,
        sticker_id_list: [],
        has_invalid_sticker: 0,
      }),
    );
    formData.append('new_pic_process0', '0');
    formData.append('disable_recommend0', '0');

    // 其他
    formData.append('cardid0', '');
    formData.append('cardquantity0', '');
    formData.append('cardlimit0', '');
    formData.append('msg_index_id0', '');
    formData.append('convert_to_image_share_page0', '');
    formData.append('convert_from_image_share_page0', '');
    formData.append('multi_picture_cover0', '0');
    formData.append('title_gen_type0', '0');
    formData.append('compose_info0', '{"list":""}');

    // req 参数（包含原创声明详细信息）
    formData.append(
      'req',
      JSON.stringify({
        idx_infos: [
          {
            save_old: 0,
            cps_info: { cps_import: 0 },
            red_packet_cover_list: { list: [] },
            claim_source: {
              claim_source_type: claimSourceType,
              claim_source: claimSourceText,
            },
            line_info: { scene: 2 },
            window_product: {},
            link_info: {},
            appmsg_link: {},
            weapp_link: {},
            yqj_info: {},
            ai_pic_info: { cover_source: 0, ai_pic_id: [], cover_pic_id: '' },
            single_video_snap_card: {},
            product_activity: {},
            footer_gift_activity: {},
            footer_common_shops: [],
            footer_product_card: {},
            location: {},
          },
        ],
        is_use_flag: 0,
        template_version: '31171848',
      }),
    );

    formData.append('is_auto_type_setting', '0');
    formData.append('save_type', '1');
    formData.append('isneedsave', '0');

    const url = new URL('https://mp.weixin.qq.com/cgi-bin/operate_appmsg');
    url.searchParams.set('t', 'ajax-response');
    url.searchParams.set('sub', 'create');
    url.searchParams.set('type', '77');
    url.searchParams.set('token', token);
    url.searchParams.set('lang', 'zh_CN');

    const response = await fetch(url.toString(), { method: 'POST', body: formData });
    const result = await response.json();
    console.log('创建响应:', result);

    if (!result?.appMsgId) {
      throw new Error('创建文章失败: ' + (result?.base_resp?.err_msg || JSON.stringify(result)));
    }

    console.log('✅ 文章创建成功，appMsgId:', result.appMsgId);
    return result.appMsgId;
  }

  // 主流程
  try {
    const { token, nickname, ticket, userName } = await readInfo();
    const { writerid } = await getRewardAuthor(token);
    const { width, height } = await getImageInfo(testArticleData.cover.url);
    console.log('封面图片尺寸:', width, 'x', height);

    const uploadResult = await uploadImage(token, ticket, userName, testArticleData.cover.url);

    const ratios = [16 / 9, 1, 3 / 4];
    const cropConfigs = ratios.map((ratio) => calculateCropConfig(ratio, width, height));
    const cropedImages = await cropImage(token, uploadResult, cropConfigs);

    cropedImages.forEach((img, index) => {
      img.ratio = ['16:9', '1:1', '3:4'][index];
    });

    const appMsgId = await createArticle(token, nickname, testArticleData.htmlContent, cropedImages, writerid);

    // 跳转到编辑页
    const editUrl = new URL('https://mp.weixin.qq.com/cgi-bin/appmsg');
    editUrl.searchParams.set('t', 'media/appmsg_edit');
    editUrl.searchParams.set('action', 'edit');
    editUrl.searchParams.set('type', '77');
    editUrl.searchParams.set('appmsgid', appMsgId);
    editUrl.searchParams.set('token', token);
    editUrl.searchParams.set('lang', 'zh_CN');

    console.log('\n=== 测试完成 ===');
    console.log('即将跳转到编辑页...');
    window.location.href = editUrl.toString();
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
})();
