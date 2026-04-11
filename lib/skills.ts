import { readFile } from "fs/promises";
import { join } from "path";
import { type PersonaId } from "@/lib/personas";

/**
 * 从本地文件按需加载 persona 的 Skill 内容
 * @param personaId - Persona ID (fengge, huchenfeng, zhangxuefeng)
 * @returns Skill 文本的完整内容
 */
export async function loadSkill(personaId: PersonaId): Promise<string> {
  const filePath = join(process.cwd(), "data", "skills", `${personaId}.md`);
  return readFile(filePath, "utf-8");
}