export function normalizeCode(content, language = "javascript") {
  const lines = content.split("\n");

  const blocks = lines.map((line, index) => ({
    content: line,
    line: index + 1,
    location: {
      line: index + 1,
      column: 1,
    },
  }));

  return {
    type: "code",
    language,
    raw: content,
    blocks,
  };
}
