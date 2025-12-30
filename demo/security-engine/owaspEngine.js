/**
 * OWASP CLASSIFIER
 * ----------------
 * Maps findings to OWASP Top 10
 */

export function runOWASPDetections(vulnerabilities = []) {
  return vulnerabilities.map((vuln) => {
    let category = "A05:2021 - Security Misconfiguration";

    if (vuln.type === "SQL Injection" || vuln.type.includes("XSS")) {
      category = "A03:2021 - Injection";
    }

    if (vuln.type === "Hardcoded Secret") {
      category = "A07:2021 - Identification and Authentication Failures";
    }

    return {
      ...vuln,
      owasp: category,
    };
  });
}
