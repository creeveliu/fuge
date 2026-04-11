import Link from "next/link";
import { personas } from "@/lib/personas";

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

        {/* Personas Grid */}
        <section className="pt-6 md:pt-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {Object.values(personas).map((persona) => (
              <Link
                key={persona.id}
                href={`/chat/${persona.id}`}
                className="surface group rounded-xl p-4 transition-all duration-200 hover:border-[color:var(--accent)] hover:shadow-sm md:rounded-xl md:p-5"
              >
                {/* Name */}
                <h2 className="font-display text-lg tracking-[-0.02em] md:text-xl">
                  {persona.name}
                </h2>

                {/* Full description */}
                <p className="mt-2 text-xs leading-5 text-[color:var(--muted)] md:mt-3 md:text-sm md:leading-6">
                  {persona.description}
                </p>
              </Link>
            ))}

            {/* Coming soon */}
            <div className="surface rounded-xl p-4 opacity-50 md:p-5">
              <p className="font-display text-lg tracking-[-0.02em] text-[color:var(--muted)] md:text-xl">
                更多人物
              </p>
              <p className="mt-2 text-xs leading-5 text-[color:var(--muted)] md:mt-3 md:text-sm">
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