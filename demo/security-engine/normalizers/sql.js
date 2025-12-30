export function normalizeSQL(content) {
  return {
    type: "sql",
    raw: content,
    blocks: [
      {
        content,
        location: null,
      },
    ],
  };
}
