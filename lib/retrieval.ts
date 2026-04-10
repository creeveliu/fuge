import type { PersonaId } from "@/lib/personas";

type RetrievalRecord = {
  tags: string[];
  excerpt: string;
};

const retrievalData: Record<string, RetrievalRecord[]> = {
  huchenfeng: [
    {
      tags: ["手机", "苹果", "安卓"],
      excerpt: "你用什么手机，就过什么标准的生活。",
    },
    {
      tags: ["城市", "山姆", "苹果店", "地铁"],
      excerpt: "没有山姆的城市年轻人不要待。",
    },
    {
      tags: ["学历", "大专", "本科", "找工作"],
      excerpt: "学历在就业市场上就是硬通货，不满意就去改变，别自欺欺人。",
    },
  ],
};

export async function selectRetrievalContext(personaId: PersonaId, query: string) {
  if (personaId !== "huchenfeng") {
    return "";
  }

  const records = retrievalData[personaId];
  if (!records) return "";

  const lowered = query.toLowerCase();
  const matches = records.filter((record) =>
    record.tags.some((tag) => lowered.includes(tag.toLowerCase()))
  );

  return matches
    .slice(0, 3)
    .map((record, index) => `${index + 1}. ${record.excerpt}`)
    .join("\n");
}