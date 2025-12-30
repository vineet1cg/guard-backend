export function detectSQLInjection(normalizedInput) {
  if (normalizedInput.type !== "code") return [];

  const issues = [];
  const blocks = normalizedInput.blocks || [];

  const sqlKeywords = /(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/i;
  const userInput = /req\.(query|body|params|headers|cookies)/;
  const concat = /(\+)|(`.*\$\{.*\}`)/;

  for (const block of blocks) {
    const code = block.content;

    if (sqlKeywords.test(code) && userInput.test(code) && concat.test(code)) {
      issues.push({
        type: "SQL Injection",
        severity: "Critical",
        owasp: "A03:2021 - Injection",
        description:
          "SQL query is constructed using string concatenation with user-controlled input, allowing attackers to manipulate query logic.",
        recommendation:
          "Use parameterized queries or prepared statements instead of string concatenation.",
        location: block.location || null,
      });
    }
  }

  return issues;
}
