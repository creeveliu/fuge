# Fuge

与提炼人格对话。选一个人物，直接提问。没有安装、没有工作流，只有对话。

## 功能

- **三位人物**：峰哥、户晨风、张雪峰
- **原味风格保留**：每个回复都带着人物的语气和锋利
- **流式回复**：打字机效果，实时呈现
- **Markdown 支持**：加粗、列表、标题等格式完整渲染
- **网页即开即用**：零门槛，打开即聊

## 人物

| 人物 | 简介 |
|------|------|
| **峰哥** | 漂泊江湖的现实主义者，用黑色幽默点评世事。不装、不绕弯，看问题带着底层视角。 |
| **户晨风** | 消费现实主义创作者，用「购买力挑战」撕开消费主义的遮羞布。敢说实话，敢晒账单。 |
| **张雪峰** | 大学选专业的扛旗人，帮学生和家长闯过志愿填报这道坎。话糙理不糙，句句是干货。 |

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS + Typography Plugin
- react-markdown
- Vitest + Testing Library

## 本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 MODEL_API_KEY、MODEL_BASE_URL、MODEL_NAME

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `MODEL_API_KEY` | 模型 API 密钥 |
| `MODEL_BASE_URL` | 模型 API 地址（默认 OpenAI） |
| `MODEL_NAME` | 模型名称 |

## 架构

```
app/
  page.tsx          # 首页：人物选择
  chat/[persona]/   # 聊天页面
  api/chat/         # 流式聊天 API
lib/
  personas.ts       # 人物注册表
  skills.ts         # Skill 加载函数
  chat.ts           # 系统提示构建
  model.ts          # 模型调用
  retrieval.ts      # 户晨风向量检索
  typewriter.ts     # 打字机效果
data/
  skills/           # Skill 文件（每个 persona 独立）
    fengge.md
    huchenfeng.md
    zhangxuefeng.md
  retrieval/        # 向量检索数据
components/
  chat-shell.tsx    # 聊天界面
  typewriter-loading.tsx  # 加载动画
```

## Skill 来源

人物 Skill 来自 GitHub 仓库：

- 峰哥：[rottenpen/fengge-wangmingtianya-perspective](https://github.com/rottenpen/fengge-wangmingtianya-perspective)
- 户晨风：[Janlaywss/hu-chenfeng-skill](https://github.com/Janlaywss/hu-chenfeng-skill)
- 张雪峰：[alchaincyf/zhangxuefeng-skill](https://github.com/alchaincyf/zhangxuefeng-skill)

## License

MIT