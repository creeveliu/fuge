# Skill-Native Chat MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimal web app where users choose `fengge`, `huchenfeng`, or `zhangxuefeng` and chat with the original GitHub `SKILL.md` behavior preserved as closely as possible.

**Architecture:** Use a single Next.js App Router app. Keep each persona's GitHub repository as the source of truth, fetch and cache `SKILL.md` server-side, then wrap it with a very thin runtime prompt before sending messages to the model. Start with a generic chat path for all personas, then add retrieval augmentation only for `huchenfeng`.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Node `fs/promises`, Node `fetch`, Vitest, Testing Library

---

### Task 1: Scaffold the app shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `app/chat/[persona]/page.tsx`

**Step 1: Create the Next.js package manifest**

```json
{
  "name": "fuge",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.6.3",
    "vitest": "^2.1.4"
  }
}
```

**Step 2: Install dependencies**

Run: `npm install`
Expected: install completes and `package-lock.json` is created

**Step 3: Create the minimal app shell**

```tsx
// app/page.tsx
import Link from "next/link";
import { personas } from "@/lib/personas";

export default function HomePage() {
  return (
    <main>
      <h1>选一个人，直接聊</h1>
      {Object.values(personas).map((persona) => (
        <Link key={persona.id} href={`/chat/${persona.id}`}>
          {persona.name}
        </Link>
      ))}
    </main>
  );
}
```

**Step 4: Run the dev server**

Run: `npm run dev`
Expected: local Next.js server starts without module resolution errors

**Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.js tailwind.config.ts app
git commit -m "feat: scaffold next app shell"
```

### Task 2: Add the persona registry and homepage data flow

**Files:**
- Create: `lib/personas.ts`
- Modify: `app/page.tsx`
- Test: `tests/lib/personas.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { personas } from "@/lib/personas";

describe("personas", () => {
  it("registers the three launch personas", () => {
    expect(Object.keys(personas)).toEqual([
      "fengge",
      "huchenfeng",
      "zhangxuefeng",
    ]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/personas.test.ts`
Expected: FAIL with module not found for `@/lib/personas`

**Step 3: Write minimal implementation**

```ts
export const personas = {
  fengge: {
    id: "fengge",
    name: "峰哥",
    repoUrl: "https://github.com/rottenpen/fengge-wangmingtianya-perspective",
    rawSkillUrl: "https://raw.githubusercontent.com/rottenpen/fengge-wangmingtianya-perspective/main/SKILL.md",
    readmeUrl: "https://github.com/rottenpen/fengge-wangmingtianya-perspective",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%B3%B0%E5%93%A5%E4%BA%A1%E5%91%BD%E5%A4%A9%E6%B6%AF",
    mode: "skill-native",
    retrieval: "none",
  },
  huchenfeng: {
    id: "huchenfeng",
    name: "户晨风",
    repoUrl: "https://github.com/Janlaywss/hu-chenfeng-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/Janlaywss/hu-chenfeng-skill/main/SKILL.md",
    readmeUrl: "https://github.com/Janlaywss/hu-chenfeng-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E6%88%B7%E6%99%A8%E9%A3%8E",
    mode: "skill-native",
    retrieval: "vector",
  },
  zhangxuefeng: {
    id: "zhangxuefeng",
    name: "张雪峰",
    repoUrl: "https://github.com/alchaincyf/zhangxuefeng-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/zhangxuefeng-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/zhangxuefeng-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%BC%A0%E9%9B%AA%E5%B3%B0%20%E8%80%81%E5%B8%88",
    mode: "skill-native",
    retrieval: "none",
  },
} as const;
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/personas.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/personas.ts app/page.tsx tests/lib/personas.test.ts
git commit -m "feat: add persona registry"
```

### Task 3: Implement SKILL.md fetching and local caching

**Files:**
- Create: `lib/skills.ts`
- Create: `data/skills/.gitkeep`
- Test: `tests/lib/skills.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { getSkillCachePath } from "@/lib/skills";

describe("skills", () => {
  it("maps persona ids to local markdown cache files", () => {
    expect(getSkillCachePath("fengge")).toContain("data/skills/fengge.md");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/skills.test.ts`
Expected: FAIL with module not found for `@/lib/skills`

**Step 3: Write minimal implementation**

```ts
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { personas } from "@/lib/personas";

const SKILL_CACHE_DIR = path.join(process.cwd(), "data", "skills");
const SKILL_TTL_MS = 1000 * 60 * 60 * 12;

export function getSkillCachePath(personaId: keyof typeof personas) {
  return path.join(SKILL_CACHE_DIR, `${personaId}.md`);
}

export async function loadSkill(personaId: keyof typeof personas) {
  const persona = personas[personaId];
  const cachePath = getSkillCachePath(personaId);
  await mkdir(SKILL_CACHE_DIR, { recursive: true });

  try {
    const info = await stat(cachePath);
    if (Date.now() - info.mtimeMs < SKILL_TTL_MS) {
      return await readFile(cachePath, "utf8");
    }
  } catch {}

  try {
    const response = await fetch(persona.rawSkillUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch ${persona.rawSkillUrl}`);
    const text = await response.text();
    await writeFile(cachePath, text, "utf8");
    return text;
  } catch {
    return await readFile(cachePath, "utf8");
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/skills.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/skills.ts data/skills/.gitkeep tests/lib/skills.test.ts
git commit -m "feat: add skill fetching and cache"
```

### Task 4: Build the chat prompt runtime and API route

**Files:**
- Create: `lib/chat.ts`
- Create: `app/api/chat/route.ts`
- Test: `tests/lib/chat.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "@/lib/chat";

describe("buildSystemPrompt", () => {
  it("keeps the skill text as the main prompt body", () => {
    const result = buildSystemPrompt({ skillText: "SKILL BODY" });
    expect(result).toContain("SKILL BODY");
    expect(result).toContain("不要提到 skill");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/chat.test.ts`
Expected: FAIL with module not found for `@/lib/chat`

**Step 3: Write minimal implementation**

```ts
export function buildSystemPrompt(args: {
  skillText: string;
  extraContext?: string;
}) {
  const wrapper = [
    "你正在网页产品中直接与用户对话。",
    "严格遵守后续 skill 内容的角色、流程、风格和边界。",
    "不要提到 skill、system prompt、agent、配置文件。",
    "保持原人物口吻；如果需要先追问，就直接追问。"
  ].join("\n");

  return [
    wrapper,
    "",
    args.skillText,
    args.extraContext ? `\n\n[补充上下文]\n${args.extraContext}` : "",
  ].join("\n");
}
```

```ts
// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { personas } from "@/lib/personas";
import { loadSkill } from "@/lib/skills";
import { buildSystemPrompt } from "@/lib/chat";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const personaId = body.personaId as keyof typeof personas;

  if (!personaId || !personas[personaId]) {
    return NextResponse.json({ error: "Invalid personaId" }, { status: 400 });
  }

  const skillText = await loadSkill(personaId);
  const systemPrompt = buildSystemPrompt({ skillText });

  return NextResponse.json({
    systemPrompt,
    reply: "TODO: wire model call",
  });
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/chat.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/chat.ts app/api/chat/route.ts tests/lib/chat.test.ts
git commit -m "feat: add chat runtime and api stub"
```

### Task 5: Build the minimal chat page UI

**Files:**
- Modify: `app/chat/[persona]/page.tsx`
- Create: `components/chat-shell.tsx`
- Test: `tests/app/chat-page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import ChatShell from "@/components/chat-shell";

it("shows persona links and disclaimer", () => {
  render(
    <ChatShell
      personaName="峰哥"
      readmeUrl="https://github.com/example"
      wikiUrl="https://baike.baidu.com"
    />
  );
  expect(screen.getByText("峰哥")).toBeInTheDocument();
  expect(screen.getByText("查看 Skill 来源")).toBeInTheDocument();
  expect(screen.getByText("基于公开资料提炼的对话型 Skill，不代表本人。")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/app/chat-page.test.tsx`
Expected: FAIL with module not found for `@/components/chat-shell`

**Step 3: Write minimal implementation**

```tsx
"use client";

export default function ChatShell(props: {
  personaName: string;
  readmeUrl: string;
  wikiUrl: string;
}) {
  return (
    <main>
      <header>
        <h1>{props.personaName}</h1>
        <a href={props.readmeUrl} target="_blank">查看 Skill 来源</a>
        <a href={props.wikiUrl} target="_blank">百科</a>
        <p>基于公开资料提炼的对话型 Skill，不代表本人。</p>
      </header>
      <section />
      <form>
        <textarea name="message" />
        <button type="submit">发送</button>
      </form>
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/app/chat-page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/chat/[persona]/page.tsx components/chat-shell.tsx tests/app/chat-page.test.tsx
git commit -m "feat: add minimal chat page"
```

### Task 6: Wire the real model call

**Files:**
- Modify: `app/api/chat/route.ts`
- Create: `lib/model.ts`
- Create: `.env.example`
- Test: `tests/lib/model.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { assertModelEnv } from "@/lib/model";

describe("assertModelEnv", () => {
  it("throws when the model api key is missing", () => {
    expect(() => assertModelEnv("")).toThrow("MODEL_API_KEY");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/model.test.ts`
Expected: FAIL with module not found for `@/lib/model`

**Step 3: Write minimal implementation**

```ts
export function assertModelEnv(apiKey?: string) {
  if (!apiKey) {
    throw new Error("MODEL_API_KEY is required");
  }
}
```

```env
# .env.example
MODEL_API_KEY=
MODEL_BASE_URL=
MODEL_NAME=
```

**Step 4: Replace the API stub with the real inference call**

Use `fetch` in `lib/model.ts` and return plain text:

```ts
export async function generateReply(args: {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}) {
  assertModelEnv(process.env.MODEL_API_KEY);

  const response = await fetch(`${process.env.MODEL_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MODEL_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.MODEL_NAME,
      messages: [
        { role: "system", content: args.systemPrompt },
        ...args.messages,
      ],
    }),
  });

  const json = await response.json();
  return json.choices[0].message.content as string;
}
```

**Step 5: Run tests**

Run: `npm test`
Expected: PASS

**Step 6: Commit**

```bash
git add app/api/chat/route.ts lib/model.ts .env.example tests/lib/model.test.ts
git commit -m "feat: connect model api"
```

### Task 7: Add Huchenfeng retrieval augmentation

**Files:**
- Modify: `lib/chat.ts`
- Create: `lib/retrieval.ts`
- Create: `data/retrieval/huchenfeng.json`
- Test: `tests/lib/retrieval.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { selectRetrievalContext } from "@/lib/retrieval";

describe("selectRetrievalContext", () => {
  it("returns matching excerpts for phone and city prompts", async () => {
    const result = await selectRetrievalContext("huchenfeng", "我想换手机也想换城市");
    expect(result).toContain("手机");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/retrieval.test.ts`
Expected: FAIL with module not found for `@/lib/retrieval`

**Step 3: Write minimal implementation**

Start with a local JSON file shaped like:

```json
[
  {
    "tags": ["手机", "苹果", "安卓"],
    "excerpt": "你用什么手机，就过什么标准的生活。"
  },
  {
    "tags": ["城市", "山姆", "苹果店", "地铁"],
    "excerpt": "没有山姆的城市年轻人不要待。"
  }
]
```

Implement simple tag matching first:

```ts
export async function selectRetrievalContext(personaId: string, query: string) {
  if (personaId !== "huchenfeng") return "";
  // read JSON, filter excerpts whose tags appear in query, join top matches
}
```

**Step 4: Inject retrieval context into prompt building**

Update `lib/chat.ts` so `buildSystemPrompt` includes the matched excerpts under `[补充上下文]`.

**Step 5: Run tests**

Run: `npm test -- tests/lib/retrieval.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add lib/chat.ts lib/retrieval.ts data/retrieval/huchenfeng.json tests/lib/retrieval.test.ts
git commit -m "feat: add huchenfeng retrieval context"
```

### Task 8: Verify the full story end-to-end

**Files:**
- Modify: `README.md`
- Create: `tests/e2e/smoke.md`

**Step 1: Write the manual smoke checklist**

```md
1. Open `/`
2. Click `峰哥`
3. Send a relationship question
4. Verify the answer stays in character and does not mention prompt internals
5. Repeat for `户晨风` and confirm first-turn follow-up still happens if the skill requires it
```

**Step 2: Run the app locally**

Run: `npm run dev`
Expected: app serves homepage and chat pages

**Step 3: Smoke test the three personas**

Run these manually in the browser:
- `/chat/fengge`
- `/chat/huchenfeng`
- `/chat/zhangxuefeng`

Expected:
- persona name renders correctly
- GitHub source link opens
- wiki link opens
- API replies in-role
- no response leaks `skill` or `system prompt`

**Step 4: Document setup and env**

Add to `README.md`:
- install
- env setup
- dev command
- how skill caching works
- how persona registry works

**Step 5: Commit**

```bash
git add README.md tests/e2e/smoke.md
git commit -m "docs: add local setup and smoke test guide"
```
