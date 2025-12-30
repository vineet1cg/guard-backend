import { validateInput } from "../utils/inputValidator.js";
import { normalizeInput } from "../normalizers/index.js";
import { runOWASPDetections } from "../owaspEngine.js";
import { calculateRiskScore } from "../riskEngine.js";
import { generateAttackerView } from "../attackerView/attackerView.js";
import { generateDefenderFixes } from "../defenderView/defenderEngine.js";
import { generateImpactAnalysis } from "../impactEngine.js";
import { generateSummary } from "../summaryEngine.js";
import { generateSimulatedPayloads } from "../payloads/payloadEngine.js";
import { measureTime } from "../utils/timers.js";

/**
 * ETHICAL SECURITY GATE
 * --------------------
 * Enforces static-only, read-only analysis
 * No execution, no attacks, no mutations
 */
export function runEthicalSecurityAnalysis({ inputType, content, language }) {
  const stopTimer = measureTime();

  // 1️⃣ Validate input
  const validation = validateInput({ inputType, content });
  if (!validation.valid) {
    return {
      success: false,
      error: validation.message,
      processingTime: stopTimer(),
    };
  }

  // 2️⃣ Normalize input
  const normalizedInput = normalizeInput(inputType, content, language);

  // 3️⃣ Detect vulnerabilities
  const vulnerabilities = runOWASPDetections(normalizedInput);

  // 4️⃣ Risk scoring
  const overallRiskScore = calculateRiskScore(vulnerabilities);

  // 5️⃣ Views
  const attackerView = generateAttackerView(vulnerabilities, normalizedInput);
  const defenderFixes = generateDefenderFixes(vulnerabilities, normalizedInput);

  // 6️⃣ Ethical payloads
  const simulatedPayloads = generateSimulatedPayloads(vulnerabilities);

  // 7️⃣ Impact & summary
  const impactAnalysis = generateImpactAnalysis(
    vulnerabilities,
    normalizedInput
  );

  const summary = generateSummary({
    vulnerabilities,
    overallRiskScore,
    attackerView,
    defenderFixes,
    impactAnalysis,
  });

  return {
    success: true,
    normalizedInput,
    vulnerabilities,
    attackerView,
    defenderFixes,
    simulatedPayloads,
    impactAnalysis,
    summary,
    overallRiskScore,
    processingTime: stopTimer(),
    ethics: {
      staticAnalysisOnly: true,
      noExecution: true,
      noLiveAttacks: true,
    },
  };
}
