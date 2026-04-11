type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function assertModelEnv(apiKey?: string) {
  if (!apiKey) {
    throw new Error("MODEL_API_KEY is required");
  }
}

function createPayload(args: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  stream?: boolean;
}) {
  const model = (process.env.MODEL_NAME ?? "gpt-4o-mini").trim();

  return {
    model,
    stream: args.stream ?? false,
    enable_thinking: false,
    messages: [
      { role: "system", content: args.systemPrompt },
      ...args.messages,
    ] satisfies ChatMessage[],
  };
}

async function requestModel(args: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  stream?: boolean;
}) {
  const apiKey = process.env.MODEL_API_KEY?.trim();
  const baseUrl = (process.env.MODEL_BASE_URL ?? "https://api.openai.com/v1").trim();

  assertModelEnv(apiKey);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(createPayload(args)),
  });

  if (!response.ok) {
    throw new Error(`Model request failed with status ${response.status}`);
  }

  return response;
}

export function extractDeltaFromLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return "";

  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") return "";

  const json = JSON.parse(payload) as {
    choices?: Array<{
      delta?: { content?: string | Array<{ type?: string; text?: string }> };
    }>;
  };

  const content = json.choices?.[0]?.delta?.content;
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => ("text" in part ? part.text ?? "" : ""))
      .join("");
  }

  return "";
}

export async function generateReply(args: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const response = await requestModel(args);
  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  };

  const content = json.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => ("text" in part ? part.text ?? "" : ""))
      .join("")
      .trim();
  }

  throw new Error("Model response missing assistant content");
}

export async function generateReplyStream(args: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const response = await requestModel({ ...args, stream: true });

  if (!response.body) {
    throw new Error("Model response missing stream body");
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = response.body.getReader();

  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();

      if (done) {
        if (buffer.trim()) {
          for (const line of buffer.split("\n")) {
            const chunk = extractDeltaFromLine(line);
            if (chunk) controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const chunk = extractDeltaFromLine(line);
        if (chunk) {
          controller.enqueue(encoder.encode(chunk));
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
