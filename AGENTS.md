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

人物 Skill 存放在 `data/skills/` 目录，每个 persona 独立一个 `.md` 文件：

```
data/skills/
  fengge.md          # 峰哥亡命天涯
  huchenfeng.md      # 户晨风
  zhangxuefeng.md    # 张雪峰
  guodegang.md       # 郭德纲
  tongjincheng.md    # 童锦程
  buffett.md         # 巴菲特
  changshuanuo.md    # 常熟阿诺
  musk.md            # 马斯克
  feynman.md         # 费曼
  marx.md            # 马克思
  karpathy.md        # 卡帕西
  mises.md           # 米塞斯
  mrbeast.md         # MrBeast
  munger.md          # 芒格
  naval.md           # 纳瓦尔
  graham.md          # 保罗·格雷厄姆
  jobs.md            # 乔布斯
  taleb.md           # 塔勒布
  trump.md           # 特朗普
  zhangyiming.md     # 张一鸣
  zizek.md           # 齐泽克
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