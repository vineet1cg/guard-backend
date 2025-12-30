export function normalizeAPI(content) {
  return {
    type: "api",
    raw: content,
    blocks: [
      {
        content,
        location: null,
      },
    ],
  };
}
