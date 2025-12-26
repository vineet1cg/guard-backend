export const detectSecrets = (content, inputType) => {
  const vulnerabilities = [];

  const patterns = [
    {
      regex: /(['"])(AKIA[0-9A-Z]{16})\1/g,
      type: 'AWS Access Key',
      confidence: 0.95
    },
    {
      regex: /(['"])([a-zA-Z0-9+/]{40})\1/g,
      type: 'AWS Secret Key',
      confidence: 0.8
    },
    {
      regex: /(['"])(ghp_[a-zA-Z0-9]{36})\1/g,
      type: 'GitHub Token',
      confidence: 0.95
    },
    {
      regex: /(['"])(sk-[a-zA-Z0-9]{48})\1/g,
      type: 'OpenAI API Key',
      confidence: 0.9
    },
    {
      regex: /(password|passwd|pwd|secret|token|api[_-]?key)\s*[=:]\s*['"]([^'"]{8,})['"]>/gis,
      type: 'Hardcoded Secret',
      confidence: 0.85
    },
    {
      regex: /(['"])([0-9a-f]{32})\1/g,
      type: 'Generic Secret/Hash',
      confidence: 0.7
    }
  ];

  patterns.forEach(pattern => {
    const matches = [...content.matchAll(pattern.regex)];
    matches.forEach(match => {
      const secretValue = match[2] || match[0];
      
      // Skip common false positives
      if (secretValue.match(/^(test|example|demo|placeholder|your|my)/i)) {
        return;
      }

      vulnerabilities.push({
        title: `Hardcoded Secret: ${pattern.type}`,
        severity: pattern.confidence >= 0.9 ? 'CRITICAL' : 'HIGH',
        category: 'HARDCODED_SECRETS',
        description: `${pattern.type} found hardcoded in source code or configuration`,
        attackerLogic: `An attacker who gains access to the codebase (via repository leak, insider threat, or supply chain attack) can extract hardcoded secrets and use them to authenticate to external services. This grants unauthorized access to cloud resources, APIs, databases, or other sensitive systems. Hardcoded secrets are especially dangerous because they're difficult to rotate and often have excessive permissions.`,
        defenderLogic: `Never hardcode secrets in source code. Use environment variables, secret management services (AWS Secrets Manager, HashiCorp Vault), or encrypted configuration files. Implement secret rotation policies. Use IAM roles and service accounts where possible. Scan repositories for leaked secrets. Add secrets to .gitignore and use pre-commit hooks to prevent accidental commits.`,
        secureCodeFix: `// Use environment variables:\nconst apiKey = process.env.API_KEY;\n\n// Or secret manager:\nimport { SecretsManager } from 'aws-sdk';\nconst secret = await secretsManager.getSecretValue({ SecretId: 'myApiKey' }).promise();\n\n// Never:\nconst apiKey = 'sk-hardcoded123...'; // ❌`,
        vulnerableCodeSnippet: match[0].substring(0, 50) + '...[REDACTED]',
        killChainStage: 'Credential Access / Privilege Escalation',
        confidence: pattern.confidence,
        context: pattern.type
      });
    });
  });

  return vulnerabilities;
};