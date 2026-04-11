import Link from "next/link";
import { personas } from "@/lib/personas";

// 提取简介中的关键词作为标签
function extractTag(description: string): string {
  // 从简介中提取核心关键词
  const keywords = description.match(/。([^，。]+)/);
  if (keywords) return keywords[1].slice(0, 12);
  return description.slice(0, 15);
}

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--panel)]/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-8">
        {/* Header */}
        <header className="border-b border-[color:var(--line)] pb-6">
          <p className="font-display text-sm uppercase tracking-[0.38em] text-[color:var(--muted)]">
            Fuge
          </p>
          <h1 className="font-display mt-3 text-3xl leading-tight tracking-[-0.04em] md:text-5xl">
            人格模拟器
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)] md:mt-4 md:text-base">
            与提炼人格对话。选一个人物，直接提问。
          </p>
        </header>

        {/* Personas Grid - Compact Tag Style */}
        <section className="pt-6 md:pt-8">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            {Object.values(personas).map((persona) => (
              <Link
                key={persona.id}
                href={`/chat/${persona.id}`}
                className="group flex flex-col rounded-lg border border-[color:var(--line)] bg-white/90 px-4 py-3 transition-all duration-150 hover:border-[color:var(--accent)] hover:bg-white md:rounded-lg md:px-5 md:py-4"
              >
                {/* Name */}
                <h2 className="font-display text-base font-medium tracking-[-0.01em] md:text-lg">
                  {persona.name}
                </h2>

                {/* Tag - subtle keyword */}
                <p className="mt-1.5 text-xs text-[color:var(--muted)] md:mt-2 md:text-sm">
                  {extractTag(persona.description)}
                </p>
              </Link>
            ))}

            {/* Coming soon */}
            <div className="flex flex-col rounded-lg border border-[color:var(--line)] bg-white/40 px-4 py-3 opacity-50 md:px-5 md:py-4">
              <h2 className="font-display text-base font-medium tracking-[-0.01em] text-[color:var(--muted)] md:text-lg">
                更多人物
              </h2>
              <p className="mt-1.5 text-xs text-[color:var(--muted)] md:mt-2 md:text-sm">
                敬请期待
              </p>
            </div>
          </div>
        </section>

        {/* Footer features */}
        <footer className="mt-6 border-t border-[color:var(--line)] pt-5 md:mt-8 md:pt-6">
          <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)] md:gap-3 md:text-sm">
            <span className="rounded-full border border-[color:var(--line)] bg-white/60 px-3 py-1.5 md:px-4 md:py-2">
              原味风格保留
            </span>
            <span className="rounded-full border border-[color:var(--line)] bg-white/60 px-3 py-1.5 md:px-4 md:py-2">
              流式回复
            </span>
            <span className="rounded-full border border-[color:var(--line)] bg-white/60 px-3 py-1.5 md:px-4 md:py-2">
              网页即开即用
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}