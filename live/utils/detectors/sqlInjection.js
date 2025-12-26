export const detectSQLInjection = (content, inputType) => {
  const vulnerabilities = [];

  // SQL Injection patterns
  const patterns = [
    {
      regex: /(\bSELECT\b.*?\bFROM\b.*?\bWHERE\b.*?['"].*?\+.*?['"])/gis,
      description: 'SQL query with string concatenation detected',
      confidence: 0.9
    },
    {
      regex: /(\bexecute\s*\(|executeQuery\s*\(|query\s*\().*?['"].*?\+.*?['"].*?\)/gis,
      description: 'Dynamic SQL query execution with concatenation',
      confidence: 0.85
    },
    {
      regex: /['"].*?\s+(OR|AND)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/gis,
      description: 'SQL injection tautology pattern detected',
      confidence: 0.95
    },
    {
      regex: /(['"]).*?\1\s*\+\s*.*?\+\s*\1.*?\1/g,
      description: 'String concatenation in potential SQL context',
      confidence: 0.7
    }
  ];

  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches) {
      matches.forEach(match => {
        vulnerabilities.push({
          title: 'SQL Injection Vulnerability',
          severity: pattern.confidence >= 0.85 ? 'CRITICAL' : 'HIGH',
          category: 'SQL_INJECTION',
          description: pattern.description,
          attackerLogic: `An attacker can inject malicious SQL code through unsanitized user input. By manipulating the query structure, they can bypass authentication, extract sensitive data, or modify database records. The vulnerability exists because user input is directly concatenated into SQL queries without proper parameterization or escaping.`,
          defenderLogic: `Implement parameterized queries (prepared statements) to separate SQL logic from data. Use ORM frameworks with built-in SQL injection protection. Apply strict input validation and whitelist allowed characters. Never trust user input and always sanitize data before database operations.`,
          secureCodeFix: `// Use parameterized queries:\nconst query = 'SELECT * FROM users WHERE username = ? AND password = ?';\ndb.execute(query, [username, password]);\n\n// Or use ORM:\nconst user = await User.findOne({ where: { username, password } });`,
          vulnerableCodeSnippet: match.substring(0, 200),
          killChainStage: 'Initial Access / Exploitation',
          confidence: pattern.confidence,
          context: match
        });
      });
    }
  });

  return vulnerabilities;
};