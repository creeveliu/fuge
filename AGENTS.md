# AGENTS.md

本文档定义 Fuge 项目的 Agent 协作规则。

## 项目定位

Fuge 是一个「人格模拟器」。核心是让用户与虚拟人物进行真实、原味的对话体验。

## 人物 Skill 存储

人物 Skill 存放在 `data/skills/` 目录，每个 persona 独立一个 `.md` 文件：

```
data/skills/
  fengge.md          # 峰哥 SKILL.md
  huchenfeng.md      # 户晨风 SKILL.md
  zhangxuefeng.md    # 张雪峰 SKILL.md
```

更新 Skill 时：
1. 从对应 GitHub 仓库获取最新 SKILL.md
2. 更新 `data/skills/{personaId}.md` 文件
3. 运行测试确保无误

## 人物注册

`lib/personas.ts` 定义所有可用人物：

```ts
type Persona = {
  id: string;           // URL slug
  name: string;         // 显示名称
  description: string;  // 首页展示描述
  repoUrl: string;      // Skill 仓库地址
  readmeUrl: string;    // 来源链接
  wikiUrl: string;      // 百科链接
  mode: "skill-native"; // 运行模式
  retrieval: "none" | "vector"; // 是否启用向量检索
};
```

添加新人物：
1. 在 `lib/personas.ts` 添加 Persona 配置
2. 在 `lib/skills.ts` 添加 Skill 内容
3. 如需向量检索，在 `data/retrieval/` 添加 JSON 文件
4. 更新测试

## 代码风格

- TypeScript strict mode
- 函数式 React（hooks，无 class）
- Tailwind CSS，避免自定义样式
- 测试覆盖核心逻辑

## API 规范

`/api/chat` 接口：

```ts
// Request
{
  personaId: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

// Response
Stream of text chunks (text/plain; charset=utf-8)
```

## 部署

- Vercel 部署
- 环境变量通过 Vercel Dashboard 配置
- 无文件系统缓存（Skills 已内联）