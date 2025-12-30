export function normalizeConfig(content) {
  const secrets = [];

  const secretPatterns = [
    /(api[_-]?key|apikey)\s*=\s*['"][^'"]+['"]/i,
    /(secret|token|password)\s*=\s*['"][^'"]+['"]/i,
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      secrets.push(pattern.toString());
    }
  }

  return {
    type: "config",
    raw: content,
    secrets,
    blocks: [
      {
        content,
        location: null,
      },
    ],
  };
}
