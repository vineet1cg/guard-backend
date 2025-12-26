export const detectXSS = (content, inputType) => {
  const vulnerabilities = [];

  const patterns = [
    {
      regex: /(innerHTML|outerHTML|document\.write)\s*=\s*[^;]+/gis,
      description: 'Direct DOM manipulation with potentially unsanitized input',
      confidence: 0.85
    },
    {
      regex: /dangerouslySetInnerHTML\s*=\s*\{\{?\s*__html:/gis,
      description: 'React dangerouslySetInnerHTML usage detected',
      confidence: 0.9
    },
    {
      regex: /<script[^>]*>.*?<\/script>/gis,
      description: 'Script tag in content or template',
      confidence: 0.8
    },
    {
      regex: /eval\s*\([^)]*\)/gis,
      description: 'eval() function usage with potential user input',
      confidence: 0.95
    },
    {
      regex: /on(click|load|error|mouseover)\s*=\s*['"][^'"]*['"]/gis,
      description: 'Inline event handler detected',
      confidence: 0.75
    }
  ];

  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches) {
      matches.forEach(match => {
        vulnerabilities.push({
          title: 'Cross-Site Scripting (XSS) Vulnerability',
          severity: pattern.confidence >= 0.85 ? 'HIGH' : 'MEDIUM',
          category: 'XSS',
          description: pattern.description,
          attackerLogic: `An attacker can inject malicious JavaScript code that executes in victims' browsers. This allows stealing session cookies, capturing keystrokes, redirecting users to phishing sites, or defacing the web application. The vulnerability exists because user-controlled data is rendered in the DOM without proper sanitization or encoding.`,
          defenderLogic: `Sanitize all user input before rendering in the DOM. Use Content Security Policy (CSP) headers to restrict script execution. Encode output based on context (HTML, JavaScript, URL). Utilize framework-provided safe rendering methods. Avoid innerHTML and eval(). Implement HTTP-only flags on sensitive cookies.`,
          secureCodeFix: `// Use textContent instead of innerHTML:\nelement.textContent = userInput;\n\n// Or sanitize with DOMPurify:\nimport DOMPurify from 'dompurify';\nelement.innerHTML = DOMPurify.sanitize(userInput);\n\n// In React, default escaping is safe:\n<div>{userInput}</div>`,
          vulnerableCodeSnippet: match.substring(0, 200),
          killChainStage: 'Exploitation / Delivery',
          confidence: pattern.confidence,
          context: match
        });
      });
    }
  });

  return vulnerabilities;
};