"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import TypewriterLoading from "@/components/typewriter-loading";
import { consumeTypewriterFrame } from "@/lib/typewriter";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatShell(props: {
  personaId: string;
  personaName: string;
  personaDescription: string;
  personaPlaceholder: string;
  exampleQuestions: string[];
  readmeUrl: string;
  wikiUrl: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAwaitingFirstChunk, setIsAwaitingFirstChunk] = useState(false);
  const isComposingRef = useRef(false);
  const queueRef = useRef("");
  const flushTimerRef = useRef<number | null>(null);
  const streamDoneRef = useRef(false);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const [isAnimatingText, setIsAnimatingText] = useState(false);
  const shouldAutoScrollRef = useRef(true);

  function stopTypewriter() {
    if (flushTimerRef.current !== null) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    setIsAnimatingText(false);
  }

  function flushTypewriterQueue() {
    if (flushTimerRef.current !== null) return;
    setIsAnimatingText(true);

    flushTimerRef.current = window.setInterval(() => {
      const next = consumeTypewriterFrame(queueRef.current);
      if (!next.chunk) {
        stopTypewriter();
        return;
      }

      queueRef.current = next.rest;

      setMessages((current) => {
        if (current.length === 0) return current;
        const updated = [...current];
        const last = updated[updated.length - 1];

        if (last?.role !== "assistant") {
          return current;
        }

        updated[updated.length - 1] = {
          role: "assistant",
          content: `${last.content}${next.chunk}`,
        };

        return updated;
      });

      if (!queueRef.current) {
        stopTypewriter();
      }
    }, 18);
  }

  useEffect(() => {
    return () => {
      stopTypewriter();
    };
  }, []);

  useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport) return;
    if (shouldAutoScrollRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isAnimatingText, isAwaitingFirstChunk]);

  function handleViewportScroll() {
    const viewport = messagesViewportRef.current;
    if (!viewport) return;
    const isAtBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 50;
    shouldAutoScrollRef.current = isAtBottom;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isAwaitingFirstChunk || isAnimatingText) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    queueRef.current = "";
    streamDoneRef.current = false;
    stopTypewriter();
    shouldAutoScrollRef.current = true;
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsAwaitingFirstChunk(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personaId: props.personaId,
          messages: nextMessages,
        }),
      });

      if (!response.ok || !response.body) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "出错了。");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantText += decoder.decode(value, { stream: true });
        queueRef.current += assistantText;
        assistantText = "";
        flushTypewriterQueue();
      }

      queueRef.current += decoder.decode();
      streamDoneRef.current = true;
      setIsAwaitingFirstChunk(false);
    } catch {
      queueRef.current = "";
      streamDoneRef.current = true;
      stopTypewriter();
      setIsAwaitingFirstChunk(false);
      setMessages((current) => [
        ...current.slice(0, -1),
        { role: "assistant", content: "出错了。" },
      ]);
    }
  }

  function onComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (isComposingRef.current || event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const isSending = isAwaitingFirstChunk || isAnimatingText;

  return (
    <main className="h-screen overflow-hidden px-4 py-4 md:px-5 md:py-5">
      <div className="mx-auto flex h-full max-w-6xl gap-4">
        <aside className="surface hidden w-[280px] shrink-0 rounded-[1.75rem] p-6 md:flex md:flex-col">
          <p className="font-display text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">
            Personai
          </p>
          <h1 className="font-display mt-6 text-4xl tracking-[-0.05em]">
            {props.personaName}
          </h1>
          <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
            {props.personaDescription}
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <a
              className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-white/70 px-4 py-3 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              href={props.readmeUrl}
              target="_blank"
              rel="noreferrer"
            >
              人格来源
              <span aria-hidden>↗</span>
            </a>
            <a
              className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-white/70 px-4 py-3 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              href={props.wikiUrl}
              target="_blank"
              rel="noreferrer"
            >
              百科
              <span aria-hidden>↗</span>
            </a>
          </div>
          <p className="mt-auto rounded-2xl bg-[color:var(--accent-soft)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
            基于公开资料提炼的人格视角，不代表本人。
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="surface flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] px-5 py-4 md:hidden">
            <div>
              <p className="font-display text-2xl tracking-[-0.04em]">{props.personaName}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Personai
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
              <a href={props.readmeUrl} target="_blank" rel="noreferrer">
                来源
              </a>
              <a href={props.wikiUrl} target="_blank" rel="noreferrer">
                百科
              </a>
            </div>
          </header>

        <section className="surface min-h-0 flex-1 overflow-hidden rounded-[1.75rem]">
          <div
            ref={messagesViewportRef}
            onScroll={handleViewportScroll}
            className="flex h-full flex-col gap-4 overflow-y-auto px-5 py-5 md:px-8 md:py-8"
          >
            {messages.length === 0 ? (
              <div className="my-auto max-w-xl">
                <p className="font-display text-2xl tracking-[-0.05em]">
                  提问示例
                </p>
                <p className="mt-3 text-base leading-7 text-[color:var(--muted)]">
                  {props.exampleQuestions.join("、")}
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-[1.5rem] bg-[color:var(--text)] px-4 py-3 text-[color:var(--panel)] md:max-w-[70%]"
                      : "max-w-[85%] rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 py-3 text-[color:var(--text)] md:max-w-[72%]"
                  }
                >
                  {message.role === "user" ? (
                    <span>{message.content}</span>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:inline prose-p:leading-relaxed prose-p:after:content-['\A'] prose-p:after:whitespace-pre prose-strong:font-semibold prose-strong:text-[color:var(--text)] prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-headings:font-semibold">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <span className="inline leading-relaxed">{children}</span>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      {index === messages.length - 1 && (isAwaitingFirstChunk || isAnimatingText) && (
                        <TypewriterLoading inline />
                      )}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>

        <form className="surface rounded-[1.5rem] p-3 md:p-4" onSubmit={onSubmit}>
          <div className="flex items-end gap-3">
            <textarea
              className="min-h-20 flex-1 resize-none rounded-[1.25rem] border border-[color:var(--line)] bg-white/70 px-4 py-3 text-[15px] outline-none transition focus:border-[color:var(--accent)]"
              name="message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onCompositionStart={() => {
                isComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                isComposingRef.current = false;
              }}
              onKeyDown={onComposerKeyDown}
              placeholder={props.personaPlaceholder}
            />
            <button
              className="rounded-[1.25rem] bg-[color:var(--text)] px-5 py-3 text-sm text-[color:var(--panel)] transition disabled:cursor-not-allowed disabled:opacity-45"
              type="submit"
              disabled={isSending}
            >
              {isSending ? "发送中" : "发送"}
            </button>
          </div>
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            回车发送，Shift+回车换行
          </p>
        </form>
        </div>
      </div>
    </main>
  );
}
