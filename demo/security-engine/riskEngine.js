import { SEVERITY_WEIGHTS } from "./utils/constants.js";

/**
 * RISK ENGINE
 * -----------
 * Produces a normalized risk score (0–100)
 */

export function calculateRiskScore(vulnerabilities = []) {
  const rawScore = vulnerabilities.reduce((sum, vuln) => {
    return sum + (SEVERITY_WEIGHTS[vuln.severity] || 0);
  }, 0);

  return Math.min(rawScore, 100);
}
