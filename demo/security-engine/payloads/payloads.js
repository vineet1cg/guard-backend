/**
 * PAYLOAD ENGINE (SIMULATED)
 * --------------------------
 * Generates educational, NON-EXPLOIT payload examples
 * These are explanations, NOT real attack payloads.
 */

export function generateSimulatedPayloads(vulnerabilities = []) {
  return vulnerabilities.map((vuln) => {
    let payload = "";

    switch (vuln.type) {
      case "SQL Injection":
        payload =
          "An attacker may attempt to manipulate query parameters to alter database logic (example: changing query behavior via crafted input).";
        break;

      case "Reflected XSS":
        payload =
          "An attacker may inject script-like content into user input fields that reflect directly in the response.";
        break;

      case "Hardcoded Secret":
        payload =
          "An attacker who gains access to source code repositories may reuse exposed credentials to access services.";
        break;

      default:
        payload =
          "This issue could be abused depending on application context.";
    }

    return {
      type: vuln.type,
      simulatedPayload: payload,
    };
  });
}
