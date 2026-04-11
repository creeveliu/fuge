# AGENTS.md

本文档定义 Personai 项目的 Agent 协作规则。

## 项目定位

Personai 是一个「人格模拟器」。核心是让用户与虚拟人物进行真实、原味的对话体验。

## 人物分类

首页按分类展示 21 位人格：

| 分类 | 人物 |
|------|------|
| **网红自媒体** | 峰哥亡命天涯、户晨风、童锦程、常熟阿诺、MrBeast |
| **企业家投资人** | 巴菲特、马斯克、芒格、纳瓦尔、保罗·格雷厄姆、乔布斯、张一鸣、特朗普 |
| **思想家学者** | 马克思、米塞斯、塔勒布、齐泽克、费曼、卡帕西 |
| **教育艺人** | 张雪峰、郭德纲 |

## 人物 Skill 存储

人物 Skill 存放在 `data/skills/` 目录，每个 persona 独立一个文件夹，与原仓库结构保持一致：

```
data/skills/
  fengge/
    SKILL.md                    # 主 Skill 文件
    references/
      research/
        01-public-research.md   # 人设与公开信息汇总
        02-dialogue-templates.md # 风格模板与 few-shot
        03-safety-and-boundaries.md # 合规与安全边界
        04-live-clip-quotes.md  # 历史语录库
  huchenfeng/
    SKILL.md
  ...
```

**References 加载机制：**

系统会自动从 SKILL.md 中提取 `references/*.md` 路径并加载。支持的引用格式：
- Markdown link：`[references/persona-profile.md](references/persona-profile.md)`
- 反引号：`完整速查表见 `references/25-biases.md``
- 纯文本：`references/research/03-safety-and-boundaries.md`

只有 SKILL.md 中明确引用的文件才会被加载，未引用的文件不会包含在 prompt 中。

更新 Skill 时：
1. 从对应 GitHub 仓库获取最新内容
2. 更新 `data/skills/{personaId}/SKILL.md` 文件
3. 如有 references 目录，一并下载
4. 运行测试确保无误

## 人物注册

`lib/personas.ts` 定义所有可用人物：

```ts
type Persona = {
  id: string;           // URL slug
  name: string;         // 显示名称
  description: string;  // 首页展示描述
  placeholder: string;  // 输入框个性化提示语
  repoUrl: string;      // Skill 仓库地址
  readmeUrl: string;    // 来源链接
  wikiUrl: string;      // 百科链接
  mode: "skill-native"; // 运行模式
  retrieval: "none" | "vector"; // 是否启用向量检索
};
```

添加新人物：
1. 在 `lib/personas.ts` 添加 Persona 配置
2. 在 `data/skills/` 添加 Skill 文件
3. 在 `app/page.tsx` 的 categories 中添加到对应分类
4. 如需向量检索，在 `data/retrieval/` 添加 JSON 文件
5. 更新测试

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
- Skill 文件打包在项目中，按需加载