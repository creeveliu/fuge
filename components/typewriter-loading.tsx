import React from "react";

export default function TypewriterLoading({ inline = false }: { inline?: boolean }) {
  return (
    <span
      aria-label="助手正在输入"
      className={inline ? "ml-0.5 inline-flex items-center align-middle" : "inline-flex min-h-6 items-center"}
      role="status"
    >
      <span className="inline-block h-5 w-[2px] rounded-full bg-neutral-900 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] animate-[pulse_0.9s_ease-in-out_infinite]" />
    </span>
  );
}
