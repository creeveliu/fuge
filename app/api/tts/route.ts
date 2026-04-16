import { NextRequest, NextResponse } from "next/server";
import { personas } from "@/lib/personas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, personaId } = body as { text: string; personaId: string };

    if (!text || !personaId) {
      return NextResponse.json(
        { error: "Missing text or personaId" },
        { status: 400 }
      );
    }

    const persona = personas[personaId as keyof typeof personas];
    if (!persona) {
      return NextResponse.json(
        { error: "Persona not found" },
        { status: 400 }
      );
    }

    if (!persona.voice) {
      return NextResponse.json(
        { error: "This persona does not have voice support" },
        { status: 400 }
      );
    }

    // Voice feature toggle
    if (process.env.ENABLE_VOICE !== "true") {
      return NextResponse.json(
        { error: "Voice feature is disabled" },
        { status: 503 }
      );
    }

    const apiKey = process.env.BAILIAN_TTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TTS API key not configured" },
        { status: 500 }
      );
    }

    // Call DashScope TTS API (qwen3-tts-vc uses multimodal-generation endpoint)
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen3-tts-vc-2026-01-22",
          input: {
            text: text,
            voice: persona.voice.voiceId,
            language_type: "Chinese",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "TTS API failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const audioUrl = data.output?.audio?.url;

    if (!audioUrl) {
      return NextResponse.json(
        { error: "No audio URL returned" },
        { status: 500 }
      );
    }

    // Download audio from OSS and return as blob
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.arrayBuffer();

    // qwen3-tts-vc returns WAV format
    const contentType = audioUrl.includes(".wav") ? "audio/wav" : "audio/mpeg";

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}