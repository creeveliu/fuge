import { readFile } from "fs/promises";
import { join } from "path";
import { type PersonaId } from "@/lib/personas";

/**
 * 从本地文件加载 persona 的 Skill 内容
 */
export async function loadSkill(personaId: PersonaId): Promise<string> {
  const filePath = join(process.cwd(), "data", "skills", personaId, "SKILL.md");
  return readFile(filePath, "utf-8");
}

/**
 * Reference 加载规则
 * - always: 始终加载（安全边界等）
 * - keyword: 包含关键词时加载
 * - length: 问题长度超过阈值时加载
 */
type LoadRule = {
  file: string;
  when: "always" | "keyword" | "length";
  condition: string; // keywords 用逗号分隔，或数字阈值
  limit?: number; // 内容截断长度
};

/**
 * 从 SKILL.md 解析加载规则
 * 格式：<!-- load:when:condition:limit? --> 描述：文件路径
 */
function parseLoadRules(skillText: string): LoadRule[] {
  const rules: LoadRule[] = [];
  const regex = /<!--\s*load:(always|keyword|length):([^:]+):?(\d+)?\s*-->\s*.+?:\s*(references\/[^\s]+)/g;

  let match;
  while ((match = regex.exec(skillText)) !== null) {
    rules.push({
      when: match[1] as LoadRule["when"],
      condition: match[2],
      limit: match[3] ? parseInt(match[3], 10) : undefined,
      file: match[4],
    });
  }

  return rules;
}

/**
 * 检查规则是否匹配当前问题
 */
function ruleMatches(rule: LoadRule, question: string): boolean {
  if (rule.when === "always") return true;

  if (rule.when === "keyword") {
    const keywords = rule.condition.split(",");
    return keywords.some((kw) =>
      question.toLowerCase().includes(kw.trim().toLowerCase())
    );
  }

  if (rule.when === "length") {
    const threshold = parseInt(rule.condition, 10);
    return question.length > threshold;
  }

  return false;
}

/**
 * 按需加载 references
 */
export async function loadReferencesByNeed(
  personaId: PersonaId,
  question: string
): Promise<{ skillText: string; referencesText: string }> {
  const skillText = await loadSkill(personaId);
  const rules = parseLoadRules(skillText);

  if (rules.length === 0) {
    return { skillText, referencesText: "" };
  }

  const basePath = join(process.cwd(), "data", "skills", personaId);
  const loadedParts: string[] = [];

  for (const rule of rules) {
    if (!ruleMatches(rule, question)) continue;

    try {
      const filePath = join(basePath, rule.file);
      let content = await readFile(filePath, "utf-8");

      // 按限制截断
      if (rule.limit && content.length > rule.limit) {
        content = content.slice(0, rule.limit) + "\n...(内容截断)";
      }

      loadedParts.push(`\n\n---\n## 补充资料 (${rule.file})\n${content}`);
    } catch {
      // 文件不存在，跳过
    }
  }

  return { skillText, referencesText: loadedParts.join("") };
}