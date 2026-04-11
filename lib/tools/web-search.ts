import { tool } from 'ai';
import { z } from 'zod';

/**
 * Tavily Search API
 * 文档：https://docs.tavily.com/api-reference/search
 * 免费额度：1000次/月
 */
export const webSearchTool = tool({
  description: '搜索网络获取最新信息。当用户问时效性问题、最新新闻、实时数据时必须使用。',
  inputSchema: z.object({
    query: z.string().describe('搜索关键词'),
  }),
  execute: async ({ query }: { query: string }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return { error: 'TAVILY_API_KEY 未配置' };
    }

    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.slice(0, 200), // Tavily 支持更长的 query
          search_depth: 'basic', // basic 或 advanced
          include_answer: true, // 包含 AI 生成的答案摘要
          include_raw_content: false, // 不包含原始网页内容（节省 token）
          max_results: 5, // 返回 5 条结果
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { error: `搜索失败: ${res.status} ${errorText.slice(0, 100)}` };
      }

      const data = await res.json();

      // 提取搜索结果
      const results = data.results?.map((r: any) => ({
        title: r.title || '',
        content: r.content || '',
        url: r.url || '',
        score: r.score || 0,
      })) || [];

      // 包含 AI 生成的答案摘要
      const answer = data.answer || '';

      if (results.length === 0 && !answer) {
        return { error: '未找到相关结果' };
      }

      return {
        answer,
        results,
        query: data.query || query,
      };
    } catch (err) {
      return { error: `搜索请求失败: ${err instanceof Error ? err.message : '未知错误'}` };
    }
  },
});