import Link from "next/link";
import { personas } from "@/lib/personas";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--panel)]/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-8">
        <div className="flex items-start justify-between gap-6 border-b border-[color:var(--line)] pb-6">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.38em] text-[color:var(--muted)]">
              Fuge
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
              与提炼人格对话。
            </h1>
          </div>
          <div className="hidden max-w-xs text-sm leading-6 text-[color:var(--muted)] md:block">
            选一个人物，直接提问。没有安装、没有工作流，只有对话。
          </div>
        </div>

        <div className="grid flex-1 gap-5 pt-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="surface subtle-grid relative overflow-hidden rounded-[1.75rem] p-8 md:p-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Chat With Distilled Personas
              </p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[color:var(--muted)]">
                不是工具市场，也不是 prompt 展示页。就是一个干净的入口，让普通人直接开始聊。
              </p>
              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
                <span className="rounded-full border border-[color:var(--line)] bg-white/80 px-4 py-2">
                  原味风格保留
                </span>
                <span className="rounded-full border border-[color:var(--line)] bg-white/80 px-4 py-2">
                  流式回复
                </span>
                <span className="rounded-full border border-[color:var(--line)] bg-white/80 px-4 py-2">
                  网页即开即用
                </span>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-[color:var(--accent-soft)] blur-3xl" />
          </div>

          <div className="grid gap-4">
          {Object.values(personas).map((persona) => (
            <Link
              key={persona.id}
              href={`/chat/${persona.id}`}
              className="surface group rounded-[1.5rem] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl tracking-[-0.03em]">{persona.name}</p>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                    点进去，直接开始问。回答保留人物自己的锋利和节奏。
                  </p>
                </div>
                <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)] transition group-hover:border-[color:var(--accent)] group-hover:text-[color:var(--accent)]">
                  Enter
                </span>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </main>
  );
}
