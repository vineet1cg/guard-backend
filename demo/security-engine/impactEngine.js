/**
 * IMPACT ENGINE
 * -------------
 * Translates vulnerabilities into real-world impact
 */

export function calculateImpact(vulnerabilities = []) {
  return vulnerabilities.map((vuln) => {
    let impact = "";

    switch (vuln.type) {
      case "SQL Injection":
        impact =
          "Attacker may read, modify, or delete database records. In worst cases, full database compromise.";
        break;

      case "Reflected XSS":
        impact =
          "Attacker may execute arbitrary JavaScript in victim browsers, steal sessions, or deface pages.";
        break;

      case "Hardcoded Secret":
        impact =
          "Credential leakage may lead to unauthorized API access, cloud abuse, or service takeover.";
        break;

      default:
        impact = "Security weakness may degrade application trust and safety.";
    }

    return {
      ...vuln,
      impact,
    };
  });
}
