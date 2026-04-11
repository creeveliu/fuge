export type PersonaId = "fengge" | "huchenfeng" | "zhangxuefeng" | "guodegang";

export type Persona = {
  id: PersonaId;
  name: string;
  description: string;
  repoUrl: string;
  rawSkillUrl: string;
  readmeUrl: string;
  wikiUrl: string;
  mode: "skill-native";
  retrieval: "none" | "vector";
};

export const personas: Record<PersonaId, Persona> = {
  fengge: {
    id: "fengge",
    name: "峰哥",
    description: "漂泊江湖的现实主义者，用黑色幽默点评世事。不装、不绕弯，看问题带着底层视角。",
    repoUrl: "https://github.com/rottenpen/fengge-wangmingtianya-perspective",
    rawSkillUrl: "https://raw.githubusercontent.com/rottenpen/fengge-wangmingtianya-perspective/main/SKILL.md",
    readmeUrl: "https://github.com/rottenpen/fengge-wangmingtianya-perspective",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%B3%B0%E5%93%A5%E4%BA%A1%E5%91%BD%E5%A4%A9%E6%B6%AF",
    mode: "skill-native",
    retrieval: "none"
  },
  huchenfeng: {
    id: "huchenfeng",
    name: "户晨风",
    description: "消费现实主义创作者，用「购买力挑战」撕开消费主义的遮羞布。敢说实话，敢晒账单。",
    repoUrl: "https://github.com/Janlaywss/hu-chenfeng-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/Janlaywss/hu-chenfeng-skill/main/SKILL.md",
    readmeUrl: "https://github.com/Janlaywss/hu-chenfeng-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E6%88%B7%E6%99%A8%E9%A3%8E",
    mode: "skill-native",
    retrieval: "vector"
  },
  zhangxuefeng: {
    id: "zhangxuefeng",
    name: "张雪峰",
    description: "大学选专业的扛旗人，帮学生和家长闯过志愿填报这道坎。话糙理不糙，句句是干货。",
    repoUrl: "https://github.com/alchaincyf/zhangxuefeng-skill",
    rawSkillUrl: "https://raw.githubusercontent.com/alchaincyf/zhangxuefeng-skill/main/SKILL.md",
    readmeUrl: "https://github.com/alchaincyf/zhangxuefeng-skill",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E5%BC%A0%E9%9B%AA%E5%B3%B0%20%E8%80%81%E5%B8%88",
    mode: "skill-native",
    retrieval: "none"
  },
  guodegang: {
    id: "guodegang",
    name: "郭德纲",
    description: "相声江湖的手艺人，用市井智慧讲人情世故。恩怨分明、规矩至上，观众笑了才算数。",
    repoUrl: "https://github.com/ByteRax/guodegang-skills",
    rawSkillUrl: "https://raw.githubusercontent.com/ByteRax/guodegang-skills/main/SKILL.md",
    readmeUrl: "https://github.com/ByteRax/guodegang-skills",
    wikiUrl: "https://baike.baidu.com/search/word?word=%E9%83%AD%E5%BE%B7%E7%BA%B2",
    mode: "skill-native",
    retrieval: "none"
  }
};
