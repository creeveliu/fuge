import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat";
import { personas, type PersonaId } from "@/lib/personas";
import { streamAgentResponse } from "@/lib/agent";
import { webSearchTool, webFetchTool } from "@/lib/tools";
import { selectRetrievalContext } from "@/lib/retrieval";
import { loadSkill } from "@/lib/skills";

type ChatRequest = {
  personaId?: string;
  messages?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const personaId = body.personaId as PersonaId | undefined;

  if (!personaId || !(personaId in personas)) {
    return NextResponse.json({ error: "Invalid personaId" }, { status: 400 });
  }

  const skillText = await loadSkill(personaId);

  const lastUserMessage = [...(body.messages ?? [])]
    .reverse()
    .find((message) => message.role === "user");
  const extraContext = lastUserMessage
    ? await selectRetrievalContext(personaId, lastUserMessage.content)
    : "";
  const systemPrompt = buildSystemPrompt({ skillText, extraContext });

  const enableWebSearch = process.env.ENABLE_WEB_SEARCH === "true";
  const tools = enableWebSearch
    ? {
        web_search: webSearchTool,
        web_fetch: webFetchTool,
      }
    : undefined;

  try {
    const response = await streamAgentResponse({
      systemPrompt,
      messages: body.messages ?? [],
      tools,
    });
    return response;
  } catch (error) {
    console.error("[route] Error:", error);
    const message = error instanceof Error ? error.message : "Agent request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}