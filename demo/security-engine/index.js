/**
 * ETHICAL GUARD SECURITY ENGINE
 * =============================
 * Entry point for all static analysis
 */

import { validateInput } from "./utils/inputValidator.js";
import { measureTime } from "./utils/timers.js";

import { routeInput } from "./inputRouter.js";
import { runOWASPDetections } from "./owaspEngine.js";
import { calculateImpact } from "./impactEngine.js";
import { calculateRiskScore } from "./riskEngine.js";
import { buildSummary } from "./summaryEngine.js";
import { generateSimulatedPayloads } from "./payloads/payloadEngine.js";

export function analyzeInput({ code, inputType = "code" }) {
  const validation = validateInput({ inputType, content: code });
  if (!validation.valid) {
    return { error: validation.message };
  }

  const stopTimer = measureTime();

  let vulnerabilities = routeInput(code);
  vulnerabilities = runOWASPDetections(vulnerabilities);
  vulnerabilities = calculateImpact(vulnerabilities);

  const riskScore = calculateRiskScore(vulnerabilities);
  const summary = buildSummary(vulnerabilities);
  const payloads = generateSimulatedPayloads(vulnerabilities);

  const executionTime = stopTimer();

  return {
    executionTime,
    riskScore,
    summary,
    vulnerabilities,
    payloads,
  };
}
