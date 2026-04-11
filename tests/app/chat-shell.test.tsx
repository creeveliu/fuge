import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ChatShell from "@/components/chat-shell";
import TypewriterLoading from "@/components/typewriter-loading";

describe("ChatShell", () => {
  it("shows persona links and disclaimer", () => {
    render(
      <ChatShell
        personaId="fengge"
        personaName="峰哥"
        personaDescription="测试描述"
        personaPlaceholder="兄弟，说吧，啥事儿？"
        exampleQuestions={["问题一", "问题二", "问题三"]}
        readmeUrl="https://github.com/example"
        wikiUrl="https://baike.baidu.com"
      />
    );

    expect(screen.getAllByText("峰哥").length).toBeGreaterThan(0);
    expect(screen.getByText("人格来源")).toBeInTheDocument();
    expect(screen.getByText("基于公开资料提炼的人格视角，不代表本人。")).toBeInTheDocument();
  });

  it("submits on Enter and allows newline on Shift+Enter", async () => {
    render(
      <ChatShell
        personaId="fengge"
        personaName="峰哥"
        personaDescription="测试描述"
        personaPlaceholder="兄弟，说吧，啥事儿？"
        exampleQuestions={["问题一", "问题二", "问题三"]}
        readmeUrl="https://github.com/example"
        wikiUrl="https://baike.baidu.com"
      />
    );

    const textarea = screen.getByPlaceholderText("兄弟，说吧，啥事儿？");

    fireEvent.change(textarea, { target: { value: "第一行" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(screen.getByDisplayValue("第一行")).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(textarea, { key: "Enter" });
      await Promise.resolve();
    });

    expect((textarea as HTMLTextAreaElement).value).toBe("");
  });

  it("does not submit while IME composition is active", async () => {
    render(
      <ChatShell
        personaId="fengge"
        personaName="峰哥"
        personaDescription="测试描述"
        personaPlaceholder="兄弟，说吧，啥事儿？"
        exampleQuestions={["问题一", "问题二", "问题三"]}
        readmeUrl="https://github.com/example"
        wikiUrl="https://baike.baidu.com"
      />
    );

    const textarea = screen.getByPlaceholderText("兄弟，说吧，啥事儿？");

    fireEvent.change(textarea, { target: { value: "ni" } });
    fireEvent.compositionStart(textarea);

    await act(async () => {
      fireEvent.keyDown(textarea, { key: "Enter", isComposing: true });
      await Promise.resolve();
    });

    expect((textarea as HTMLTextAreaElement).value).toBe("ni");
  });
});

describe("TypewriterLoading", () => {
  it("renders a cursor-only loading state", () => {
    render(<TypewriterLoading />);

    expect(screen.queryByText("正在输入")).not.toBeInTheDocument();
    expect(screen.getByLabelText("助手正在输入")).toBeInTheDocument();
  });
});