export function consumeTypewriterFrame(buffer: string, step = 1) {
  if (!buffer) {
    return { chunk: "", rest: "" };
  }

  const size = Math.max(1, step);

  return {
    chunk: buffer.slice(0, size),
    rest: buffer.slice(size),
  };
}
