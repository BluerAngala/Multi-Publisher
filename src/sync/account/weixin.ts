import type { AccountInfo } from '~sync/common';

/**
 * 获取微信公众号账号信息
 * 通过访问 mp.weixin.qq.com 页面解析 window.wx.commonData 获取登录状态
 */
export async function getWeixinAccountInfo(): Promise<AccountInfo | null> {
  try {
    const response = await fetch('https://mp.weixin.qq.com/', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // 尝试多种匹配模式提取 token 和 nickname
    let token = '';
    let nickname = '';
    let uid = '';

    // 模式1: window.wx.commonData = {...};
    const dataMatch = html.match(/window\.wx\.commonData\s*=\s*\{([\s\S]*?)\};/);

    if (dataMatch) {
      const tokenMatch = dataMatch[1].match(/t\s*:\s*["'](\d+)["']/);
      const nicknameMatch = dataMatch[1].match(/nick_name\s*:\s*["']([^"']+)["']/);
      const uidMatch = dataMatch[1].match(/user_name\s*:\s*["']([^"']+)["']/);

      token = tokenMatch ? tokenMatch[1] : '';
      nickname = nicknameMatch ? nicknameMatch[1] : '';
      uid = uidMatch ? uidMatch[1] : '';
    }

    // 模式2: 直接从页面提取（备用方案）
    if (!token || !nickname) {
      const tokenPatterns = [
        /["']t["']\s*:\s*["'](\d+)["']/,
        /\bt\s*:\s*["'](\d+)["']/,
        /token\s*[=:]\s*["']?(\d+)["']?/,
      ];

      for (const pattern of tokenPatterns) {
        const match = html.match(pattern);
        if (match && !token) {
          token = match[1];
          break;
        }
      }

      const nicknamePatterns = [
        /["']nick_name["']\s*:\s*["']([^"']+)["']/,
        /nick_name\s*:\s*["']([^"']+)["']/,
        /nickName\s*[=:]\s*["']([^"']+)["']/,
      ];

      for (const pattern of nicknamePatterns) {
        const match = html.match(pattern);
        if (match && !nickname) {
          nickname = match[1];
          break;
        }
      }

      if (!uid) {
        const uidPatterns = [/["']user_name["']\s*:\s*["']([^"']+)["']/, /user_name\s*:\s*["']([^"']+)["']/];

        for (const pattern of uidPatterns) {
          const match = html.match(pattern);
          if (match) {
            uid = match[1];
            break;
          }
        }
      }
    }

    // 没有 token 说明未登录
    if (!token) {
      return null;
    }

    // 如果没有 nickname，尝试使用 uid 或 token 作为显示名
    const displayName = nickname || uid || `公众号${token.substring(0, 4)}`;

    return {
      provider: 'weixin',
      accountId: uid || token,
      username: displayName,
      description: '微信公众号',
      profileUrl: 'https://mp.weixin.qq.com/',
      avatarUrl: 'https://mp.weixin.qq.com/favicon.ico',
      extraData: { token, nickname, uid },
    };
  } catch {
    return null;
  }
}
