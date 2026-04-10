import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat";
import { personas, type PersonaId } from "@/lib/personas";
import { generateReplyStream } from "@/lib/model";
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

  try {
    const stream = await generateReplyStream({
      systemPrompt,
      messages: body.messages ?? [],
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Model request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
