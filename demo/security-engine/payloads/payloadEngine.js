/**
 * ETHICAL PAYLOAD GENERATOR
 * ------------------------
 * Generates NON-EXECUTABLE, SIMULATED payloads
 * Used only to explain exploitability (education + awareness)
 */

export function generateSimulatedPayloads(vulnerabilities = []) {
  return vulnerabilities.map((vuln) => {
    switch (vuln.type) {
      case "SQL Injection":
        return {
          type: vuln.type,
          payloads: [
            "' OR '1'='1",
            "' UNION SELECT null--",
            "'; DROP TABLE users--",
          ],
          note: "Payloads are simulated examples only. Never executed against live systems.",
        };

      case "Reflected XSS":
        return {
          type: vuln.type,
          payloads: [
            "<script>alert(1)</script>",
            "<img src=x onerror=alert(1)>",
            '"><svg/onload=alert(1)>',
          ],
          note: "Payloads demonstrate how unescaped input could be abused.",
        };

      case "Hardcoded Secret":
        return {
          type: vuln.type,
          payloads: [
            "Credential reuse",
            "Secret leakage via repo history",
            "CI/CD exposure",
          ],
          note: "No payload execution possible. Impact is credential compromise.",
        };

      default:
        return {
          type: vuln.type,
          payloads: [],
          note: "No payloads available for this vulnerability type.",
        };
    }
  });
}
