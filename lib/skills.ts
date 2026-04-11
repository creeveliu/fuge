import { readFile } from "fs/promises";
import { join } from "path";
import { type PersonaId } from "@/lib/personas";

/**
 * 从本地文件按需加载 persona 的 Skill 内容
 */
export async function loadSkill(personaId: PersonaId): Promise<string> {
  const filePath = join(process.cwd(), "data", "skills", personaId, "SKILL.md");
  return readFile(filePath, "utf-8");
}

/**
 * 检查 persona 是否有 references 目录
 */
async function hasReferences(personaId: PersonaId): Promise<boolean> {
  const dirPath = join(process.cwd(), "data", "skills", personaId, "references");
  const knownFiles = [
    "research/01-public-research.md",
    "research/03-safety-and-boundaries.md",
    "methods/general_problem_router.md",
    "persona-profile.md",
    "25-biases.md",
    "concepts.md",
  ];

  for (const file of knownFiles) {
    try {
      await readFile(join(dirPath, file), "utf-8");
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * 加载安全边界相关的 reference（必须遵守）
 */
async function loadSafetyReferences(personaId: PersonaId): Promise<string> {
  const basePath = join(process.cwd(), "data", "skills", personaId, "references");
  const safetyFiles = [
    "research/03-safety-and-boundaries.md",
    "03-safety-and-boundaries.md",
  ];

  for (const file of safetyFiles) {
    try {
      const content = await readFile(join(basePath, file), "utf-8");
      return `\n\n---\n## 安全边界补充\n${content}`;
    } catch {
      continue;
    }
  }
  return "";
}

/**
 * 根据问题类型按需加载 references
 */
export async function loadReferencesByNeed(
  personaId: PersonaId,
  question: string
): Promise<{ skillText: string; referencesText: string }> {
  const skillText = await loadSkill(personaId);

  // 检查是否有 references
  const hasRefs = await hasReferences(personaId);
  if (!hasRefs) {
    return { skillText, referencesText: "" };
  }

  const basePath = join(process.cwd(), "data", "skills", personaId, "references");
  const referencesParts: string[] = [];

  // 1. 安全边界 - 必须加载
  const safety = await loadSafetyReferences(personaId);
  if (safety) {
    referencesParts.push(safety);
  }

  // 2. 根据问题关键词判断是否需要加载其他 references
  const lowerQuestion = question.toLowerCase();

  // 不同 persona 的 references 加载规则
  if (personaId === "mises") {
    // 米塞斯：涉及具体主题或原著语境时加载 source-map
    if (lowerQuestion.includes("经济") || lowerQuestion.includes("市场") ||
        lowerQuestion.includes("价格") || lowerQuestion.includes("干预") ||
        lowerQuestion.includes("社会主义") || lowerQuestion.includes("官僚")) {
      try {
        const sourceMap = await readFile(join(basePath, "source-map.md"), "utf-8");
        referencesParts.push(`\n\n---\n## 主题索引\n${sourceMap}`);
      } catch {}
    }
    // 需要稳定输出风格时加载 few-shot
    if (lowerQuestion.includes("怎么") || lowerQuestion.includes("如何") ||
        lowerQuestion.includes("为什么") || lowerQuestion.length > 100) {
      try {
        const fewShot = await readFile(join(basePath, "few-shot-examples.md"), "utf-8");
        referencesParts.push(`\n\n---\n## 输出风格参考\n${fewShot}`);
      } catch {}
    }
  }

  if (personaId === "zizek") {
    // 齐泽克：涉及具体概念时加载 concepts，需要语感时加载 quotes
    const conceptKeywords = ["意识形态", "拉康", "无意识", "主体", "客体", "剩余", "崇高", "事件"];
    if (conceptKeywords.some(kw => lowerQuestion.includes(kw))) {
      try {
        const concepts = await readFile(join(basePath, "concepts.md"), "utf-8");
        referencesParts.push(`\n\n---\n## 核心概念指南\n${concepts}`);
      } catch {}
    }
    // 需要参照原文语感时加载 quotes
    try {
      const quotes = await readFile(join(basePath, "quotes.md"), "utf-8");
      // 只加载前 5000 字符，避免过长
      referencesParts.push(`\n\n---\n## 语感参照（节选）\n${quotes.slice(0, 5000)}`);
    } catch {}
  }

  if (personaId === "munger") {
    // 芒格：涉及偏误/决策时加载 biases
    if (lowerQuestion.includes("偏") || lowerQuestion.includes("误") ||
        lowerQuestion.includes("决策") || lowerQuestion.includes("判断") ||
        lowerQuestion.includes("陷阱") || lowerQuestion.includes("错误")) {
      try {
        const biases = await readFile(join(basePath, "25-biases.md"), "utf-8");
        referencesParts.push(`\n\n---\n## 认知偏误速查\n${biases}`);
      } catch {}
    }
  }

  if (personaId === "fengge" || personaId === "changshuanuo") {
    // 峰哥/常熟阿诺：涉及风格模板时加载 dialogue-templates
    if (lowerQuestion.length > 50) {
      try {
        const templates = await readFile(join(basePath, "research", "02-dialogue-templates.md"), "utf-8");
        // 只加载前 3000 字符
        referencesParts.push(`\n\n---\n## 应答模板参考\n${templates.slice(0, 3000)}`);
      } catch {}
    }
  }

  if (personaId === "marx") {
    // 马克思：根据问题类型加载对应方法
    const methodsDir = join(basePath, "methods");
    if (lowerQuestion.includes("矛盾") || lowerQuestion.includes("对立")) {
      try {
        const content = await readFile(join(methodsDir, "contradiction_analysis.md"), "utf-8");
        referencesParts.push(`\n\n---\n## 矛盾分析方法\n${content}`);
      } catch {}
    }
    if (lowerQuestion.includes("总体") || lowerQuestion.includes("整体") || lowerQuestion.includes("系统")) {
      try {
        const content = await readFile(join(methodsDir, "totality_analysis.md"), "utf-8");
        referencesParts.push(`\n\n---\n## 总体性分析方法\n${content}`);
      } catch {}
    }
  }

  return { skillText, referencesText: referencesParts.join("") };
}