# Fuge Agent Tool Calling 实现计划

## Context

**目标**：让 persona 能联网搜索，获取实时信息。

**核心需求**：
- Skills 无法实时更新，需要 web_search 工具让 persona 查最新资料
- 用户问"巴菲特最近投资了什么"、"马斯克最近说了什么"等时效性问题

**现状**：
- OpenAI-compatible API（智谱 GLM-5 via MaaS）
- 单次 Chat Completion，无 tool calling
- SSE 流式返回，前端 typewriter 动画
- 21 个 persona，每个有独立 SKILL.md

**技术方案**：
- Vercel AI SDK (`ai` + `@ai-sdk/openai`) 作为 agent framework
- GLM-5 作为模型（支持 function calling，返回 tool_calls）
- GLM Web Search API 作为搜索工具（独立 API，需手动调用）

---

## Phase 1: 安装依赖 & 基础改造

### 1.1 安装

```bash
pnpm add ai @ai-sdk/openai zod
```

### 1.2 新建 `lib/agent.ts`

```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { tool } from 'ai';

// 创建 GLM provider
const glm = createOpenAI({
  baseURL: process.env.MODEL_BASE_URL!,
  apiKey: process.env.MODEL_API_KEY!,
});

export async function streamAgentResponse(args: {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  tools?: Record<string, ReturnType<typeof tool>>;
}) {
  const result = streamText({
    model: glm(process.env.MODEL_NAME!),
    system: args.systemPrompt,
    messages: args.messages,
    tools: args.tools,
    stopWhen: { stepCountIs: 3 },
  });

  return result.toTextStreamResponse();
}
```

---

## Phase 2: GLM Web Search Tool

### 2.1 GLM Web Search API

```typescript
// POST https://open.bigmodel.cn/api/paas/v4/web_search
{
  search_query: "搜索内容",
  search_engine: "search_pro",      // search_std | search_pro | search_pro_sogou | search_pro_quark
  search_intent: true,              // 意图识别
  count: 10,                        // 结果数量 (1-50)
  search_recency_filter: "oneWeek"  // oneDay | oneWeek | oneMonth | oneYear | noLimit
}
```

### 2.2 工具实现 `lib/tools/web-search.ts`

```typescript
import { tool } from 'ai';
import { z } from 'zod';

export const webSearchTool = tool({
  description: '搜索网络获取最新信息。当用户问时效性问题、最新新闻、实时数据时必须使用。',
  parameters: z.object({
    query: z.string().describe('搜索关键词'),
  }),
  execute: async ({ query }) => {
    const res = await fetch('https://open.bigmodel.cn/api/paas/v4/web_search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MODEL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_query: query.slice(0, 70),
        search_engine: 'search_pro',
        search_intent: true,
        count: 5,
        search_recency_filter: 'oneWeek',
      }),
    });

    if (!res.ok) return { error: `搜索失败: ${res.status}` };

    const data = await res.json();
    return data.search_result?.map((r: any) => ({
      title: r.title, content: r.content, link: r.link, media: r.media,
    })) || [];
  },
});
```

### 2.3 网页阅读工具 `lib/tools/web-fetch.ts`

```typescript
import { tool } from 'ai';
import { z } from 'zod';

export const webFetchTool = tool({
  description: '读取指定网页的完整内容。当搜索结果不够详细，需要深入了解某篇文章时使用。',
  parameters: z.object({
    url: z.string().describe('网页 URL'),
  }),
  execute: async ({ url }) => {
    const res = await fetch('https://open.bigmodel.cn/api/paas/v4/reader', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MODEL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        return_format: 'markdown',
        retain_images: false, // 不保留图片，节省 token
      }),
    });

    if (!res.ok) return { error: `读取失败: ${res.status}` };

    const data = await res.json();
    return {
      title: data.reader_result?.title,
      content: data.reader_result?.content,
      url: data.reader_result?.url,
    };
  },
});
```

### 2.4 工具导出 `lib/tools/index.ts`

```typescript
export { webSearchTool } from './web-search';
export { webFetchTool } from './web-fetch';
```

---

## Phase 3: API Route 改造

### 修改 `app/api/chat/route.ts`

```typescript
import { streamAgentResponse } from '@/lib/agent';
import { webSearchTool, webFetchTool } from '@/lib/tools';
import { loadSkill } from '@/lib/skills';
import { buildSystemPrompt } from '@/lib/chat';

export async function POST(request: Request) {
  const { personaId, messages } = await request.json();

  const skillText = await loadSkill(personaId);
  const systemPrompt = buildSystemPrompt({ skillText });

  // 定义工具
  const tools = {
    web_search: webSearchTool,
    web_fetch: webFetchTool,
  };

  return streamAgentResponse({
    systemPrompt,
    messages,
    tools,
  });
}
```

---

## Phase 4: 前端适配

### 4.1 检查现有 SSE 格式

Vercel AI SDK 的 `toTextStreamResponse()` 返回格式：
```
0:"Hello"
1:" world"
2:"!"
```

需要确认现有前端能否兼容，或需要改用 `toDataStreamResponse()`。

### 4.2 可能需要的改动

如果格式不兼容，有两个选择：
1. 前端改用 AI SDK UI 的 `useChat` hook
2. 后端用 `pipeTextStreamToResponse()` 自定义格式

---

## 文件改动清单

### 新建
- `lib/agent.ts` - Vercel AI SDK 集成
- `lib/tools/web-search.ts` - web_search 工具实现
- `lib/tools/index.ts` - 工具导出

### 修改
- `app/api/chat/route.ts` - 使用新 agent 模块
- `lib/model.ts` - 可能废弃或保留备用

### 删除（可选）
- `lib/typewriter.ts` - 如果改用 AI SDK UI

---

## 搜索 API 待定

需要你确认：
1. 你现有的搜索 API 是什么？（火山引擎？）
2. 是否有现成的搜索 skill 或 MCP？
3. 需要搜索中文还是中英文都支持？

---

## 时间估算（简化版）

- Phase 1: 0.5 天（安装 + agent.ts）
- Phase 2: 1 天（web_search 工具 + 搜索 API 接入）
- Phase 3: 0.5 天（API route）
- Phase 4: 0.5 天（前端适配）
- **总计：2-3 天**

---

## 下一步

1. 确认搜索 API 方案
2. 开 worktree 开始实现
3. 先验证 GLM-5 + Vercel AI SDK 基础功能