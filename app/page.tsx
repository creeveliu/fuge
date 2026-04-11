import Link from "next/link";
import { personas, PersonaId } from "@/lib/personas";

// 人物分类
const categories: Array<{
  id: string;
  name: string;
  personas: PersonaId[];
}> = [
  {
    id: "creator",
    name: "网红自媒体",
    personas: [
      "fengge",
      "huchenfeng",
      "tongjincheng",
      "changshuanuo",
      "mrbeast",
    ],
  },
  {
    id: "entrepreneur",
    name: "企业家投资人",
    personas: [
      "buffett",
      "musk",
      "munger",
      "naval",
      "graham",
      "jobs",
      "zhangyiming",
      "trump",
    ],
  },
  {
    id: "thinker",
    name: "思想家学者",
    personas: ["marx", "mises", "taleb", "zizek", "feynman", "karpathy"],
  },
  {
    id: "educator",
    name: "教育艺人",
    personas: ["zhangxuefeng", "guodegang"],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen mx-auto max-w-6xl px-5 py-5 md:px-8 md:py-8">
      {/* Header */}
        <header className="border-b border-[color:var(--line)] pb-6">
          <p className="font-display text-sm uppercase tracking-[0.38em] text-[color:var(--muted)]">
            Personai
          </p>
          <h1 className="font-display mt-3 text-3xl leading-tight tracking-[-0.04em] md:text-5xl">
            人格模拟器
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)] md:mt-4 md:text-base">
            与提炼人格对话。选一个人物，直接提问。
          </p>
        </header>

        {/* Personas by Category */}
        <section className="space-y-8 pt-6 md:space-y-10 md:pt-8">
          {categories.map((category) => (
            <div key={category.id}>
              {/* Category Title */}
              <h2 className="font-display mb-4 text-lg tracking-[-0.02em] text-[color:var(--muted)] md:mb-5 md:text-xl">
                {category.name}
              </h2>

              {/* Personas Grid */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {category.personas.map((personaId) => {
                  const persona = personas[personaId];
                  return (
                    <Link
                      key={persona.id}
                      href={`/chat/${persona.id}`}
                      className="surface group rounded-xl p-4 transition-all duration-200 hover:border-[color:var(--accent)] hover:shadow-sm md:p-5"
                    >
                      {/* Name */}
                      <h3 className="font-display text-base tracking-[-0.02em] md:text-lg">
                        {persona.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-xs leading-5 text-[color:var(--muted)] md:mt-3 md:text-sm md:leading-6">
                        {persona.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-6 border-t border-[color:var(--line)] pt-5 md:mt-8 md:pt-6">
          <p className="text-xs text-[color:var(--muted)] md:text-sm">
            更多人格，敬请期待
          </p>
        </footer>
    </main>
  );
}
