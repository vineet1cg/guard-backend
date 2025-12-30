export function detectXSS(normalizedInput) {
  if (normalizedInput.type !== "code") return [];

  const issues = [];
  const blocks = normalizedInput.blocks || [];

  const userInput = /req\.(query|body|params|headers|cookies)/;
  const htmlSink = /(res\.send|res\.write|res\.end|innerHTML|document\.write)/i;
  const concat = /(\+)|(`.*\$\{.*\}`)/;

  for (const block of blocks) {
    const code = block.content;

    if (htmlSink.test(code) && userInput.test(code) && concat.test(code)) {
      issues.push({
        type: "Cross-Site Scripting (XSS)",
        severity: "High",
        owasp: "A03:2021 - Injection",
        description:
          "User-controlled input is reflected into HTML output without sanitization, enabling script injection.",
        recommendation:
          "Sanitize or encode output before rendering. Avoid direct HTML construction with user input.",
        location: block.location || null,
      });
    }
  }

  return issues;
}
