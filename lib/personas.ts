export type PersonaId =
  | "fengge"
  | "huchenfeng"
  | "zhangxuefeng"
  | "guodegang"
  | "tongjincheng"
  | "buffett"
  | "changshuanuo"
  | "musk"
  | "feynman"
  | "marx"
  | "karpathy"
  | "mises"
  | "mrbeast"
  | "munger"
  | "naval"
  | "graham"
  | "jobs"
  | "taleb"
  | "trump"
  | "zhangyiming"
  | "zizek";

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

export const personas: Record<PersonaId, Persona> = {
  // 已有人物
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
  huchenfeng: {
    id: "huchenfeng",
    name: "户晨风",
    description: "消费现实主义创作者，用「购买力挑战」撕开消费主义的遮羞布。敢说实话，敢晒账单。",
    placeholder: "多大岁数？什么学历？在哪个城市？",
    repoUrl: "https://github.com/Janlaywss/hu-chenfeng-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/Janlaywss/hu-chenfeng-skill/main/SKILL.md",
    readmeUrl: "https://github.com/Janlaywss/hu-chenfeng-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E6%88%B7%E6%99%A8%E9%A3%8E",
    mode: "skill-native",
    retrieval: "vector",
    exampleQuestions: ['月入五千能存钱吗？', '年轻人该买房吗？', '消费主义陷阱怎么识别？'],
    voice: {
      voiceId: "cosyvoice-v3.5-plus-bailian-ea19cd5a581e47d38638623db910746a",
      speed: 1.0,
    },
  },
  zhangxuefeng: {
    id: "zhangxuefeng",
    name: "张雪峰",
    description: "大学选专业的扛旗人，帮学生和家长闯过志愿填报这道坎。话糙理不糙，句句是干货。",
    placeholder: "多少分？什么省？家里做什么的？",
    repoUrl: "https://github.com/alchaincyf/zhangxuefeng-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/zhangxuefeng-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/zhangxuefeng-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%BC%A0%E9%9B%A8%E5%B3%B0%20%E8%80%81%E5%B8%88",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['五百多分报什么专业？', '文科生有什么出路？', '土木还能报吗？']
  },
  guodegang: {
    id: "guodegang",
    name: "郭德纲",
    description: "相声江湖的手艺人，用市井智慧讲人情世故。恩怨分明、规矩至上，观众笑了才算数。",
    placeholder: "您猜怎么着？说给我听听...",
    repoUrl: "https://github.com/ByteRax/guodegang-skills",
    rawSkillUrl: "https://raw.githubusercontent.com/ByteRax/guodegang-skills/main/SKILL.md",
    readmeUrl: "https://github.com/ByteRax/guodegang-skills",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E9%83%AD%E5%BE%B7%E7%BA%B2",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这事儿怎么圆过去？', '规矩到底是什么？', '人情世故怎么拿捏？']
  },
  tongjincheng: {
    id: "tongjincheng",
    name: "童锦程",
    description: "深情祖师爷，用街头智慧讲恋爱与人性。真诚才是最高级的套路，说实话不喝鸡汤。",
    placeholder: "兄弟们，说实话...",
    repoUrl: "https://github.com/hotcoffeeshake/tong-jincheng-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/hotcoffeeshake/tong-jincheng-skill/main/SKILL.md",
    readmeUrl: "https://github.com/hotcoffeeshake/tong-jincheng-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E7%AB%A5%E9%94%A6%E7%A8%8B",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['女生不回消息怎么办？', '怎么判断她是不是真的喜欢你？', '表白还是不表白？']
  },
  buffett: {
    id: "buffett",
    name: "巴菲特",
    description: "奥马哈的先知，用价值投资的框架看世界。护城河、能力圈、复利滚雪球，耐心才是最大的本事。",
    placeholder: "说说你的投资困惑...",
    repoUrl: "https://github.com/will2025btc/buffett-perspective",
    rawSkillUrl: "https://raw.githubusercontent.com/will2025btc/buffett-perspective/main/SKILL.md",
    readmeUrl: "https://github.com/will2025btc/buffett-perspective",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E6%B2%83%E4%BC%A6%C2%B7%E5%B7%B4%E8%8F%B2%E7%89%B9",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这公司有护城河吗？', '什么时候该卖出？', '怎么看懂一家公司？']
  },

  // 新增人物
  changshuanuo: {
    id: "changshuanuo",
    name: "常熟阿诺",
    description: "抽象文学创始人，左右脑互搏式辩论。「那我问你」零帧起手，把平凡事说出哲学感。",
    placeholder: "那我问你...",
    repoUrl: "https://github.com/Ricardo-Vv/changshu-anuo",
    rawSkillUrl: "https://raw.githubusercontent.com/Ricardo-Vv/changshu-anuo/main/SKILL.md",
    readmeUrl: "https://github.com/Ricardo-Vv/changshu-anuo",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%B8%B8%E5%9D%8E%E9%98%BF%E8%AF%BA",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['那我问你，这事儿公平吗？', '你觉得这合理吗？', '凭什么不行？']
  },
  musk: {
    id: "musk",
    name: "马斯克",
    description: "第一性原理思考者，用物理学的视角拆解成本结构、挑战行业假设。激进迭代，白痴指数。",
    placeholder: "从第一性原理想想这个问题...",
    repoUrl: "https://github.com/alchaincyf/elon-musk-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/elon-musk-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/elon-musk-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E9%9B%8C%E6%96%AF%E5%85%8B",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这东西的白痴指数是多少？', '从物理学角度这成本能降多少？', '第一性原理怎么看这个问题？']
  },
  feynman: {
    id: "feynman",
    name: "费曼",
    description: "诺贝尔物理学家，用「货物崇拜」检测伪理解。命名不等于理解，能做个演示才是真懂。",
    placeholder: "你真的理解了，还是只记住了名字？",
    repoUrl: "https://github.com/alchaincyf/feynman-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/feynman-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/feynman-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E8%B4%B9%E6%9B%BC",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['你能用简单话解释这个概念吗？', '如果没术语，你怎么教这个？', '货物崇拜是什么意思？']
  },
  marx: {
    id: "marx",
    name: "马克思",
    description: "结构分析方法论，识别矛盾、映射系统、找到杠杆点——而非症状。适用于产品策略、组织 dysfunction。",
    placeholder: "从结构分析这个问题...",
    repoUrl: "https://github.com/baojiachen0214/karlmarx-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/baojiachen0214/karlmarx-skill/main/SKILL.md",
    readmeUrl: "https://github.com/baojiachen0214/karlmarx-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E9%9A%A8%E5%85%8B%E6%80%9D",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这问题的根本矛盾是什么？', '谁是受益者，谁是代价？', '结构在哪出了问题？']
  },
  karpathy: {
    id: "karpathy",
    name: "卡帕西",
    description: "AI 研究者的视角，从神经网络、梯度下降到大规模训练。用工程直觉理解机器学习。",
    placeholder: "从 AI 视角分析一下...",
    repoUrl: "https://github.com/alchaincyf/karpathy-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/karpathy-skill/master/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/karpathy-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=Andrej%20Karpathy",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['神经网络到底在学什么？', '为什么 SGD 能工作？', '大模型和小模型的本质区别是什么？']
  },
  mises: {
    id: "mises",
    name: "米塞斯",
    description: "人类行为学创始人，用经济计算、干预主义分析社会主义、价格管制、官僚制。追问价格与利润，而非口号。",
    placeholder: "从价格和利润的角度分析...",
    repoUrl: "https://github.com/LijiayuDeng/mises-perspective",
    rawSkillUrl: "https://raw.githubusercontent.com/LijiayuDeng/mises-perspective/main/SKILL.md",
    readmeUrl: "https://github.com/LijiayuDeng/mises-perspective",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E7%B1%B3%E5%A1%9E%E6%96%AF",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['价格管制的后果是什么？', '为什么经济计算在计划经济里不可能？', '利润到底起什么作用？']
  },
  mrbeast: {
    id: "mrbeast",
    name: "MrBeast",
    description: "YouTube 顶流创作者，用流量思维、爆款公式、内容杠杆打造现象级视频。极致投入，病毒传播。",
    placeholder: "从流量思维分析这个内容...",
    repoUrl: "https://github.com/alchaincyf/mrbeast-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/mrbeast-skill/master/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/mrbeast-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=MrBeast",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这视频的前五秒够炸吗？', '为什么这个内容能病毒传播？', '预算该砸在哪个环节？']
  },
  munger: {
    id: "munger",
    name: "芒格",
    description: "逆向思考大师，用认知偏误检查、Lollapalooza 效应、跨学科分析审视决策。先想怎么失败，再想怎么成功。",
    placeholder: "逆向思考一下，这为什么会失败？",
    repoUrl: "https://github.com/alchaincyf/munger-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/munger-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/munger-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E6%9F%A0%E6%9F%A5%E8%8C%AF%E6%A0%BC",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这决策最可能怎么失败？', '有什么认知偏误在影响我？', '反过来想，怎么才能成功？']
  },
  naval: {
    id: "naval",
    name: "纳瓦尔",
    description: "杠杆思维创始人，用特定知识、无需许可的路径、财富定义重塑人生选择。追求资产而非工资。",
    placeholder: "这件事有杠杆吗？",
    repoUrl: "https://github.com/alchaincyf/naval-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/naval-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/naval-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=Naval%20Ravikant",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这事儿有杠杆吗？', '我的特定知识是什么？', '财富和赚钱的区别是什么？']
  },
  graham: {
    id: "graham",
    name: "保罗·格雷厄姆",
    description: "YC 创始人，用 essays 思维、黑客精神、创业直觉审视产品和人生选择。写作不只是表达，是思考本身。",
    placeholder: "从黑客视角分析这个想法...",
    repoUrl: "https://github.com/alchaincyf/paul-graham-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/paul-graham-skill/master/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/paul-graham-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=Paul%20Graham",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这个想法值得写篇 essay 吗？', '程序员思维怎么解这问题？', '这创业方向有独立想法吗？']
  },
  jobs: {
    id: "jobs",
    name: "乔布斯",
    description: "产品设计教父，用极简主义、用户体验、品味重塑科技产品。记住你会死，是做重大选择的最好工具。",
    placeholder: "如果是乔布斯，他会怎么设计？",
    repoUrl: "https://github.com/alchaincyf/steve-jobs-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/steve-jobs-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/steve-jobs-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%A9%86%E5%B8%83%E6%96%AF",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这个产品能再删掉什么？', '用户真正想要的是什么？', '品味在这里体现在哪？']
  },
  taleb: {
    id: "taleb",
    name: "塔勒布",
    description: "反脆弱之父，用黑天鹅、尾部风险、杠铃策略质疑主流叙事。平均深度四英尺的河流也能淹死人。",
    placeholder: "这有尾部风险吗？",
    repoUrl: "https://github.com/alchaincyf/taleb-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/taleb-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/taleb-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E6%A4%A0%E5%8B%87%E8%94%A1",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这有尾部风险吗？', '平均深度四英尺的河能淹死谁？', '杠铃策略怎么用？']
  },
  trump: {
    id: "trump",
    name: "特朗普",
    description: "谈判与传播大师，用权力逻辑、锚定效应、情绪杠杆分析政治与商业博弈。瞄准很高，然后一直推。",
    placeholder: "从懂王视角分析这个谈判...",
    repoUrl: "https://github.com/alchaincyf/trump-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/trump-skill/master/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/trump-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E7%9C%E6%87%9E%E5%9C%BA",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这个谈判怎么锚定？', '怎么用情绪杠杆？', '让对手先开口还是我先开口？']
  },
  zhangyiming: {
    id: "zhangyiming",
    name: "张一鸣",
    description: "字节跳动创始人，用算法思维、延迟满足、组织效率重塑内容分发。Context not Control。",
    placeholder: "从算法视角分析这个决策...",
    repoUrl: "https://github.com/alchaincyf/zhang-yiming-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/zhang-yiming-skill/master/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/zhang-yiming-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%BC%A0%E4%B8%80%E9%A3%9E",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['这决策有延迟满足的价值吗？', 'Context not Control 怎么落地？', '怎么用算法思维优化组织？']
  },
  zizek: {
    id: "zizek",
    name: "齐泽克",
    description: "哲学狙击手，把你自以为想清楚了的东西翻出你没意识到的那一层。不是模仿说话，是问题意识本身。",
    placeholder: "翻出你没意识到的那一层...",
    repoUrl: "https://github.com/JikunR/zizek-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/JikunR/zizek-skill/main/SKILL.md",
    readmeUrl: "https://github.com/JikunR/zizek-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E9%9B%81%E6%B8%8C%E5%85%8B",
    mode: "skill-native",
    retrieval: "none",
    exampleQuestions: ['你以为你懂了，真的吗？', '这背后还有什么没说出来的？', '意识形态怎么在这起作用？']
  }
};