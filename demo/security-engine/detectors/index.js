import { detectSQLInjection } from "./sqlInjection.js";
import { detectXSS } from "./xss.js";
import { detectHardcodedSecrets } from "./hardcodedSecrets.js";

/**
 * Runs all vulnerability detectors against normalized input.
 * Each detector is isolated to prevent a single failure
 * from crashing the entire analysis.
 */
export function runAllDetectors(normalizedInput) {
  if (!normalizedInput || typeof normalizedInput !== "object") {
    return [];
  }

  const findings = [];

  try {
    findings.push(...detectSQLInjection(normalizedInput));
  } catch (error) {
    console.error("SQL Injection detector failed:", error.message);
  }

  try {
    findings.push(...detectXSS(normalizedInput));
  } catch (error) {
    console.error("XSS detector failed:", error.message);
  }

  try {
    findings.push(...detectHardcodedSecrets(normalizedInput));
  } catch (error) {
    console.error("Hardcoded Secrets detector failed:", error.message);
  }

  return findings;
}
