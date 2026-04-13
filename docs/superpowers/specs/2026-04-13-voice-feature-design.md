# 语音输出功能设计文档

日期：2026-04-13

## 概述

为 Fuge（人格模拟器）添加语音输出功能：
- 用户输入：手动文字输入（不变）
- AI 输出：LLM 文字回复 → 百炼 TTS → 语音播放
- 默认开启，用户可手动关闭
- 先支持峰哥亡命天涯（有专属音色），其他 persona 暂不支持

---

## 架构方案

采用**后端代理 API**方案：

```
用户输入 → /api/chat → LLM 文字回复 → 前端收到完整文字 → /api/tts → 百炼 TTS → 返回音频 → 播放
```

**理由**：
1. API Key 安全存储在后端环境变量
2. 与现有 `/api/chat` 架构风格一致
3. 前端可以选择是否调用（用户关闭语音时跳过）
4. 可扩展：未来可添加缓存、播放历史等

---

## 后端 API

### 新增 `/api/tts/route.ts`

**Request**：
```typescript
POST /api/tts
{
  text: string;           // AI 回复的完整文字
  personaId: string;      // 用于获取该 persona 的语音角色配置
}
```

**Response**：
```typescript
{
  audioUrl: string;       // Blob URL 或直接返回 audio buffer
}
```

**实现逻辑**：
1. 接收 text 和 personaId
2. 从 `lib/personas.ts` 获取该 persona 的 voice 配置
3. 若无 voice 配置，返回 400 错误
4. 调用百炼 TTS API（使用 `BAILIAN_TTS_API_KEY` 环境变量）
5. 返回音频数据

**环境变量**：
```env
# .env.example 新增
BAILIAN_TTS_API_KEY=      # 百炼语音合成 API Key
```

**API 调用示例**（百炼 TTS）：
```typescript
// 参考百炼 TTS API 文档
const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/tts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.BAILIAN_TTS_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'cosyvoice-v3.5-plus',
    input: text,
    voice: voiceId,  // 从 persona.voice.voiceId 获取
  }),
});
```

---

## Persona 语音配置

### `lib/personas.ts` 新增 `voice` 字段

```typescript
type Persona = {
  id: string;
  name: string;
  description: string;
  placeholder: string;
  repoUrl: string;
  readmeUrl: string;
  wikiUrl: string;
  mode: "skill-native";
  retrieval: "none" | "vector";
  exampleQuestions?: string[];
  
  // 新增：语音配置（可选）
  voice?: {
    voiceId: string;      // 百炼 TTS 音色 ID
    speed?: number;       // 语速，默认 1.0
  };
};
```

### 峰哥配置

```typescript
{
  id: "fengge",
  name: "峰哥亡命天涯",
  // ... 其他现有字段
  voice: {
    voiceId: "cosyvoice-v3.5-plus-bailian-812a621be1304cea9ef7460f772b393b",
    speed: 1.0,
  },
}
```

---

## 首页语音标识

### `app/page.tsx` 人物卡片

当 `persona.voice` 存在时，卡片标题旁显示语音图标：

```tsx
<div className="flex items-center gap-2">
  <h3>{persona.name}</h3>
  {persona.voice && (
    <span title="支持语音播放" className="text-sm">
      🔊
    </span>
  )}
</div>
```

**表现**：
- 有语音：显示 🔊 图标 + tooltip "支持语音播放"
- 无语音：不显示图标

---

## 前端组件

### 新增 `components/voice-player.tsx`

```typescript
type VoicePlayerProps = {
  text: string;           // AI 回复文字
  personaId: string;      // 用于获取语音配置
  autoPlay?: boolean;     // 是否自动播放
};

// 内部状态
const [isPlaying, setIsPlaying] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [audioUrl, setAudioUrl] = useState<string | null>(null);
```

**功能**：
1. 播放按钮：点击调用 `/api/tts` → 获取音频 → 播放
2. 播放状态：播放中显示暂停图标
3. 音频缓存：已获取的 audioUrl 缓存，避免重复请求

### 全局语音开关

在 `components/chat-shell.tsx` 中添加：

```typescript
// localStorage 持久化
const [voiceEnabled, setVoiceEnabled] = useLocalStorage('voiceEnabled', true);

// 开关按钮
<button 
  onClick={() => setVoiceEnabled(!voiceEnabled)}
  title={voiceEnabled ? "关闭语音" : "开启语音"}
>
  {voiceEnabled ? "🔊" : "🔇"}
</button>
```

**行为**：
- 开启：AI 回复完成后，若 persona 有 voice 配置，自动播放
- 关闭：不自动播放，仍显示播放按钮供手动操作
- 无 voice 配置的 persona：开关不影响，不显示播放按钮

---

## 完整交互流程

### 流程图

```
用户输入文字
    ↓
/api/chat 流式返回文字
    ↓
前端完整接收文字回复
    ↓
检查 persona.voice 是否存在
    ↓
[无 voice] → 仅显示文字
    ↓
[有 voice] → 显示播放按钮
    ↓
检查 voiceEnabled 开关
    ↓
[开启] → 自动调用 /api/tts → 播放
[关闭] → 等待用户点击播放按钮
```

---

## 错误处理

1. **TTS API 失败**：显示错误提示，播放按钮变为重试按钮
2. **无 voice 配置**：不显示播放相关 UI
3. **音频播放失败**：显示错误提示，允许重试
4. **网络超时**：TTS 请求设置 timeout（如 30s），超时后提示用户

---

## 未来扩展（不在本次范围）

- 更多 persona 的专属语音配置
- 语音缓存（相同文字不重复请求 TTS）
- 播放历史记录
- 用户可选语音角色（偏好设置）
- 边输出边播放（流式 TTS）

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/api/tts/route.ts` | 新增 | TTS API 代理 |
| `lib/personas.ts` | 修改 | 添加 voice 字段类型和峰哥配置 |
| `components/voice-player.tsx` | 新增 | 语音播放组件 |
| `components/chat-shell.tsx` | 修改 | 添加语音开关和播放按钮集成 |
| `app/page.tsx` | 修改 | 人物卡片添加语音图标 |
| `.env.example` | 修改 | 添加 BAILIAN_TTS_API_KEY |