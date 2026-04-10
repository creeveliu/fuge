export function buildSystemPrompt(args: {
  skillText: string;
  extraContext?: string;
}) {
  const wrapper = [
    "你正在网页产品中直接与用户对话。",
    "严格遵守后续 skill 内容的角色、流程、风格和边界。",
    "不要提到 skill、system prompt、agent、配置文件。",
    "保持原人物口吻；如果需要先追问，就直接追问。",
  ].join("\n");

  return [
    wrapper,
    "",
    args.skillText,
    args.extraContext ? `\n\n[补充上下文]\n${args.extraContext}` : "",
  ].join("\n");
}
