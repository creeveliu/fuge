import { tool } from 'ai';
import { z } from 'zod';

/**
 * 网页内容读取工具
 * 使用简单的 HTTP fetch 获取网页内容
 * 注意：部分网站可能有反爬机制，可能无法获取内容
 */
export const webFetchTool = tool({
  description: '读取指定网页的完整内容。当搜索结果的摘要不够详细，需要深入了解某篇文章时使用。',
  inputSchema: z.object({
    url: z.string().describe('网页 URL'),
  }),
  execute: async ({ url }: { url: string }) => {
    // 验证 URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return { error: 'URL 格式无效，需要 http:// 或 https://' };
    }

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FugeBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,text/plain',
        },
      });

      if (!res.ok) {
        return { error: `读取失败: ${res.status} ${res.statusText}` };
      }

      const contentType = res.headers.get('content-type') || '';

      // 如果是 HTML，提取文本内容
      if (contentType.includes('text/html')) {
        const html = await res.text();
        // 简单的 HTML to text 转换
        const text = html
          // 移除 script 和 style 标签
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          // 移除 HTML 标签
          .replace(/<[^>]+>/g, ' ')
          // 移除多余空白
          .replace(/\s+/g, ' ')
          .trim();

        return {
          content: text.slice(0, 5000), // 限制长度
          url,
          contentType: 'html',
        };
      }

      // 如果是纯文本，直接返回
      const text = await res.text();
      return {
        content: text.slice(0, 5000),
        url,
        contentType,
      };
    } catch (err) {
      return { error: `读取请求失败: ${err instanceof Error ? err.message : '未知错误'}` };
    }
  },
});