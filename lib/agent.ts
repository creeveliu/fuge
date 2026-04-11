import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { Tool } from 'ai';
import { stepCountIs } from 'ai';

// 创建 GLM provider（OpenAI-compatible）
// 使用 .chat() 方法强制使用 chat/completions 端点（MaaS 不支持 Responses API）
// trim() 处理环境变量可能的换行符问题
const glm = createOpenAI({
  baseURL: process.env.MODEL_BASE_URL?.trim()!,
  apiKey: process.env.MODEL_API_KEY?.trim()!,
});

/**
 * 使用 Vercel AI SDK 流式生成响应，支持 tool calling
 * 自定义 SSE 格式，发送工具调用状态事件
 */
export async function streamAgentResponse(args: {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  tools?: Record<string, Tool>;
}) {
  console.log('[agent] Starting stream with:', {
    model: process.env.MODEL_NAME,
    baseURL: process.env.MODEL_BASE_URL,
    messagesCount: args.messages.length,
    hasTools: !!args.tools,
    toolNames: args.tools ? Object.keys(args.tools) : [],
  });

  try {
    const result = streamText({
      model: glm.chat(process.env.MODEL_NAME?.trim()!),
      system: args.systemPrompt,
      messages: args.messages,
      tools: args.tools,
      stopWhen: stepCountIs(5),
    });

    // 创建自定义 SSE 流
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // 遍历流的部分
        for await (const part of result.fullStream) {
          if (part.type === 'tool-call') {
            // 发送工具调用事件
            const event = `event: tool_call\ndata: ${JSON.stringify({
              name: part.toolName,
              args: part.input,
            })}\n\n`;
            controller.enqueue(encoder.encode(event));
          } else if (part.type === 'tool-result') {
            // 发送工具结果事件
            const resultData = part.output;
            const event = `event: tool_result\ndata: ${JSON.stringify({
              name: part.toolName,
              result: typeof resultData === 'string'
                ? resultData.slice(0, 200)
                : resultData,
            })}\n\n`;
            controller.enqueue(encoder.encode(event));
          } else if (part.type === 'text-delta') {
            // 发送文本内容
            const event = `event: content\ndata: ${JSON.stringify({
              text: part.text,
            })}\n\n`;
            controller.enqueue(encoder.encode(event));
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[agent] Failed:', error);
    throw error;
  }
}