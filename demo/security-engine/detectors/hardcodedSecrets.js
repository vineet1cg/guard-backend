export function detectHardcodedSecrets(normalizedInput) {
  if (!["code", "config"].includes(normalizedInput.type)) return [];

  const issues = [];
  const content = normalizedInput.raw || "";

  const patterns = [
    /(api[_-]?key|apikey)\s*=\s*['"][^'"]{10,}['"]/i,
    /(secret|token|password|passwd|pwd)\s*=\s*['"][^'"]{6,}['"]/i,
    /(aws|amazon)[_-]?(secret|access)[_-]?key\s*=\s*['"][^'"]+['"]/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(content)) {
      issues.push({
        type: "Hardcoded Secret",
        severity: "High",
        owasp: "A02:2021 - Cryptographic Failures",
        description:
          "Sensitive credentials are hardcoded in source code or configuration files.",
        recommendation:
          "Move secrets to environment variables or a secure secrets manager.",
      });
      break;
    }
  }

  return issues;
}
