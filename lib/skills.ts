import { readFile } from "fs/promises";
import { join } from "path";
import { type PersonaId } from "@/lib/personas";

/**
 * 从 SKILL.md 提取 references 路径
 * 匹配格式：references/xxx.md
 * 支持多种格式：markdown link、反引号、纯文本
 */
function extractReferencePaths(skillText: string): string[] {
  const regex = /references\/[\w\-\/]+\.md/g;
  const matches = skillText.match(regex);
  return matches ? [...new Set(matches)] : [];
}

/**
 * 从本地文件加载 persona 的 Skill 内容
 * 如果 SKILL.md 中引用了 references 文件，一并加载
 */
export async function loadSkill(personaId: PersonaId): Promise<string> {
  const basePath = join(process.cwd(), "data", "skills", personaId);
  const skillPath = join(basePath, "SKILL.md");
  const skillText = await readFile(skillPath, "utf-8");

  const refPaths = extractReferencePaths(skillText);
  if (refPaths.length === 0) {
    return skillText;
  }

  const refParts: string[] = [];
  for (const refPath of refPaths) {
    try {
      const fullPath = join(basePath, refPath);
      const content = await readFile(fullPath, "utf-8");
      refParts.push(`\n\n---\n## ${refPath}\n${content}`);
    } catch {
      // 文件不存在，跳过
    }
  }

  return skillText + refParts.join("");
}