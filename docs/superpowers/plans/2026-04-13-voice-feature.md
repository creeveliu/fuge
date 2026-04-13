# Voice Output Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add TTS voice output feature for AI responses, starting with Fengge persona, with global voice toggle.

**Architecture:** Backend TTS proxy API at `/api/tts`, frontend voice player component, persona voice configuration, localStorage-persisted voice toggle.

**Tech Stack:** Next.js 15 API Routes, DashScope CosyVoice TTS API, React hooks, Audio API, localStorage.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/api/tts/route.ts` | Backend TTS proxy - calls DashScope API, returns audio URL |
| `lib/personas.ts` | Persona type with optional `voice` field + Fengge voice config |
| `components/voice-player.tsx` | Voice player component - fetch/play/pause audio |
| `components/chat-shell.tsx` | Voice toggle button + VoicePlayer integration |
| `app/page.tsx` | Voice indicator icon on persona cards |
| `.env.example` | BAILIAN_TTS_API_KEY documentation |

---

### Task 1: Add Voice Config to Persona Type

**Files:**
- Modify: `lib/personas.ts:24-37` (Persona type)
- Modify: `lib/personas.ts:40-55` (fengge persona config)
- Test: `tests/lib/personas.test.ts`

- [ ] **Step 1: Update Persona type with voice field**

Add optional `voice` field to Persona type in `lib/personas.ts`:

```typescript
export type Persona = {
  id: PersonaId;
  name: string;
  description: string;
  placeholder: string;
  repoUrl: string;
  rawSkillUrl: string;
  readmeUrl: string;
  wikiUrl: string;
  mode: "skill-native";
  retrieval: "none" | "vector";
  exampleQuestions: string[];
  // 新增：语音配置（可选）
  voice?: {
    voiceId: string;      // 百炼 TTS 音色 ID
    speed?: number;       // 语速，默认 1.0
  };
};
```

- [ ] **Step 2: Add Fengge voice configuration**

Add voice config to fengge persona in `lib/personas.ts`:

```typescript
fengge: {
  id: "fengge",
  name: "峰哥亡命天涯",
  description: "漂泊江湖的现实主义者，用黑色幽默点评世事。不装、不绕弯，看问题带着底层视角。",
  placeholder: "兄弟，说吧，啥事儿？",
  repoUrl: "https://github.com/rottenpen/fengge-wangmingtianya-perspective",
  rawSkillUrl: "https://raw.githubusercontent.com/rottenpen/fengge-wangmingtianya-perspective/main/SKILL.md",
  readmeUrl: "https://github.com/rottenpen/fengge-wangmingtianya-perspective",
  wikiUrl: "https://baike.baidu.com/search/word?word=%E5%B3%B0%E5%93%A5%E4%BA%A1%E5%91%BD%E5%A4%A9%E6%B6%AF",
  mode: "skill-native",
  retrieval: "none",
  exampleQuestions: ['年轻人该怎么闯？', '工资三千房租两千，怎么活？', '该不该回老家？'],
  voice: {
    voiceId: "cosyvoice-v3.5-plus-bailian-812a621be1304cea9ef7460f772b393b",
    speed: 1.0,
  },
},
```

- [ ] **Step 3: Write test for voice config**

Add test in `tests/lib/personas.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { personas } from "@/lib/personas";

describe("personas", () => {
  it("registers all personas", () => {
    // ... existing test
  });

  it("fengge has voice configuration", () => {
    expect(personas.fengge.voice).toBeDefined();
    expect(personas.fengge.voice?.voiceId).toBe(
      "cosyvoice-v3.5-plus-bailian-812a621be1304cea9ef7460f772b393b"
    );
  });

  it("other personas do not have voice configuration", () => {
    const personaIdsWithoutVoice = [
      "huchenfeng", "zhangxuefeng", "guodegang", "tongjincheng",
      "buffett", "changshuanuo", "musk", "feynman", "marx",
      "karpathy", "mises", "mrbeast", "munger", "naval",
      "graham", "jobs", "taleb", "trump", "zhangyiming", "zizek"
    ];
    for (const id of personaIdsWithoutVoice) {
      expect(personas[id].voice).toBeUndefined();
    }
  });
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: All tests pass, including new voice tests.

- [ ] **Step 5: Commit**

```bash
git add lib/personas.ts tests/lib/personas.test.ts
git commit -m "feat: add voice config to Persona type and Fengge persona

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Create TTS API Route

**Files:**
- Create: `app/api/tts/route.ts`
- Modify: `.env.example`

- [ ] **Step 1: Create TTS API route**

Create `app/api/tts/route.ts`:

```typescript
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

    const apiKey = process.env.BAILIAN_TTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TTS API key not configured" },
        { status: 500 }
      );
    }

    // Call DashScope TTS API
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "cosyvoice-v3.5-plus",
          input: {
            text: text,
            voice: persona.voice.voiceId,
            format: "mp3",
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

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Update .env.example**

Add to `.env.example`:

```env
BAILIAN_TTS_API_KEY=    # 百炼语音合成 API Key
```

- [ ] **Step 3: Verify API route compiles**

Run: `pnpm build`
Expected: Build succeeds without errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/tts/route.ts .env.example
git commit -m "feat: add TTS API proxy route

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Create Voice Player Component

**Files:**
- Create: `components/voice-player.tsx`

- [ ] **Step 1: Create VoicePlayer component**

Create `components/voice-player.tsx`:

```typescript
"use client";

import { useState, useRef, useCallback } from "react";

type VoicePlayerProps = {
  text: string;
  personaId: string;
  autoPlay?: boolean;
};

export default function VoicePlayer({
  text,
  personaId,
  autoPlay = false,
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const fetchAndPlay = useCallback(async () => {
    if (isLoading || isPlaying) return;

    setIsLoading(true);
    setError(null);

    try {
      // If we already have the audio URL, use it
      if (audioUrlRef.current && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, personaId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate audio");
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      // Create audio element and play
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setError("Audio playback failed");
        setIsPlaying(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [text, personaId, isLoading, isPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Auto-play on mount if enabled
  // Note: We don't auto-play here because we need to wait for
  // the complete response. This is handled in ChatShell.

  if (error) {
    return (
      <button
        onClick={fetchAndPlay}
        className="text-xs text-red-500 hover:text-red-600"
        title={error}
      >
        重试
      </button>
    );
  }

  if (isLoading) {
    return (
      <span className="text-xs text-[color:var(--muted)]">
        加载中...
      </span>
    );
  }

  if (isPlaying) {
    return (
      <button
        onClick={stop}
        className="text-xs hover:text-[color:var(--accent)]"
        title="停止播放"
      >
        ⏹ 停止
      </button>
    );
  }

  return (
    <button
      onClick={fetchAndPlay}
      className="text-xs hover:text-[color:var(--accent)]"
      title="播放语音"
    >
      🔊 播放
    </button>
  );
}
```

- [ ] **Step 2: Verify component compiles**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/voice-player.tsx
git commit -m "feat: add VoicePlayer component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Add Voice Toggle to ChatShell

**Files:**
- Modify: `components/chat-shell.tsx`
- Test: `tests/app/chat-shell.test.tsx`

- [ ] **Step 1: Add voice toggle state with localStorage**

Add at the top of ChatShell function (after existing useState hooks):

```typescript
// Voice toggle with localStorage persistence
const [voiceEnabled, setVoiceEnabled] = useState(() => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("voiceEnabled");
  return stored === null ? true : stored === "true";
});

// Save to localStorage when changed
useEffect(() => {
  localStorage.setItem("voiceEnabled", String(voiceEnabled));
}, [voiceEnabled]);
```

- [ ] **Step 2: Add voice toggle button in header**

Find the header section with persona name and add voice toggle button. Add after the persona links:

```typescript
{/* Voice toggle - only show if persona has voice */}
{personas[personaId as keyof typeof personas]?.voice && (
  <button
    onClick={() => setVoiceEnabled(!voiceEnabled)}
    className="text-xs px-2 py-1 rounded border border-[color:var(--line)] hover:border-[color:var(--accent)]"
    title={voiceEnabled ? "关闭语音自动播放" : "开启语音自动播放"}
  >
    {voiceEnabled ? "🔊 自动播放" : "🔇 已关闭"}
  </button>
)}
```

Import personas at the top:

```typescript
import { personas } from "@/lib/personas";
```

- [ ] **Step 3: Add VoicePlayer after each assistant message**

Add VoicePlayer component import:

```typescript
import VoicePlayer from "@/components/voice-player";
```

In the messages rendering section, after each assistant message content, add:

```typescript
{/* Voice player for assistant messages */}
{voiceEnabled && personas[personaId as keyof typeof personas]?.voice && (
  <VoicePlayer
    text={msg.content}
    personaId={personaId}
  />
)}
```

- [ ] **Step 4: Update tests**

Add test in `tests/app/chat-shell.test.tsx`:

```typescript
describe("ChatShell voice toggle", () => {
  it("shows voice toggle for Fengge persona", () => {
    render(
      <ChatShell
        personaId="fengge"
        personaName="峰哥亡命天涯"
        personaDescription="测试描述"
        personaPlaceholder="兄弟，说吧，啥事儿？"
        exampleQuestions={["问题一"]}
        readmeUrl="https://github.com/example"
        wikiUrl="https://baike.baidu.com"
      />
    );

    expect(screen.getByTitle("关闭语音自动播放")).toBeInTheDocument();
  });

  it("does not show voice toggle for persona without voice", () => {
    render(
      <ChatShell
        personaId="huchenfeng"
        personaName="户晨风"
        personaDescription="测试描述"
        personaPlaceholder="多大岁数？"
        exampleQuestions={["问题一"]}
        readmeUrl="https://github.com/example"
        wikiUrl="https://baike.baidu.com"
      />
    );

    expect(screen.queryByTitle("关闭语音自动播放")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run tests**

Run: `pnpm test`
Expected: Tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/chat-shell.tsx tests/app/chat-shell.test.tsx
git commit -m "feat: add voice toggle to ChatShell

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Add Voice Indicator to Homepage Cards

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import personas type for voice check**

Already imported: `import { personas, PersonaId } from "@/lib/personas";`

- [ ] **Step 2: Add voice indicator to persona card**

Find the persona card rendering in the grid. Modify the card content:

```typescript
<Link
  key={persona.id}
  href={`/chat/${persona.id}`}
  className="surface group rounded-xl p-4 transition-all duration-200 hover:border-[color:var(--accent)] hover:shadow-sm md:p-5"
>
  {/* Name with voice indicator */}
  <div className="flex items-center gap-2">
    <h3 className="font-display text-base tracking-[-0.02em] md:text-lg">
      {persona.name}
    </h3>
    {persona.voice && (
      <span
        className="text-sm"
        title="支持语音播放"
      >
        🔊
      </span>
    )}
  </div>

  {/* Description */}
  <p className="mt-2 text-xs leading-5 text-[color:var(--muted)] md:mt-3 md:text-sm md:leading-6">
    {persona.description}
  </p>
</Link>
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add voice indicator to persona cards on homepage

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Integration Test & Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: All tests pass.

- [ ] **Step 2: Build and verify no errors**

Run: `pnpm build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Manual smoke test**

1. Start dev server: `pnpm dev`
2. Open http://localhost:3000
3. Verify Fengge card shows 🔊 icon
4. Navigate to Fengge chat
5. Verify voice toggle button appears
6. Send a message
7. Verify "播放" button appears after response
8. Click "播放" - verify audio plays
9. Toggle voice off - verify button shows "已关闭"
10. Send another message - verify no auto-play, but manual play button still works

- [ ] **Step 4: Final commit (if any fixes needed)**

If any fixes were made:

```bash
git add -A
git commit -m "fix: voice feature integration fixes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Spec Coverage Checklist

| Spec Requirement | Task |
|------------------|------|
| Persona voice field + Fengge config | Task 1 |
| TTS API proxy route | Task 2 |
| Voice player component | Task 3 |
| Global voice toggle (localStorage) | Task 4 |
| VoicePlayer integration in ChatShell | Task 4 |
| Voice indicator on homepage cards | Task 5 |
| Error handling (TTS API fails) | Task 2, 3 |
| .env.example update | Task 2 |

---

## Notes for Implementer

- **API Key**: User has provided `sk-666a0937a7594ed1a8fbe3c132745cac` - configure in `.env.local` or Vercel Dashboard, NOT in code
- **Audio URL expiration**: DashScope returns OSS URL with expiration - we download and return blob to avoid expiration issues
- **Auto-play timing**: VoicePlayer does not auto-play on mount - ChatShell controls when to trigger based on voiceEnabled and message completion
- **Only Fengge**: Voice only works for Fengge persona currently - other personas show no voice UI

---

## 踩坑记录（实现过程中遇到的问题）

### 2026-04-13：qwen3-tts-vc 模型迁移

从 cosyvoice 迁移到 qwen3-tts-vc 自定义音色时遇到的问题：

| 问题 | cosyvoice | qwen3-tts-vc | 解决方案 |
|------|-----------|--------------|----------|
| Endpoint | `/api/v1/services/audio/tts/SpeechSynthesizer` | `/api/v1/services/aigc/multimodal-generation/generation` | 更改 endpoint URL |
| 请求格式 | `input: { text, voice, format }` | `input: { text, voice, language_type }` | 更改请求结构 |
| 音频格式 | MP3 | WAV | 动态判断 Content-Type |
| Voice ID | `cosyvoice-v3.5-plus-bailian-xxx` | `qwen-tts-vc-bailian-voice-yyy` | 更新 personas.ts 配置 |

**关键修复**：Content-Type 必须根据实际音频格式设置

```typescript
// 错误：导致浏览器无法解析，首次播放失败
"Content-Type": "audio/mpeg"  // WAV 文件错误地标记为 MP3

// 正确：动态判断
const contentType = audioUrl.includes(".wav") ? "audio/wav" : "audio/mpeg";
```

### Vercel 环境变量配置

首次部署线上失败：`TTS API key not configured`

**解决**：
```bash
vercel env add BAILIAN_TTS_API_KEY production --value "sk-xxx" --yes
vercel --prod --yes  # 重新部署
```