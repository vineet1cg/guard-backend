import mongoose from "mongoose";
import Analysis from "../models/analysis.model.js";
import User from "../models/user.model.js";

// 🧠 REAL SECURITY ENGINE
import { analyzeInput } from "../../demo/security-engine/index.js";
import { runOWASPDetections } from "../../demo/security-engine/owaspEngine.js";
import { calculateRiskScore } from "../../demo/security-engine/riskEngine.js";
import { generateAttackerView } from "../../demo/security-engine/attackerView/attackerView.js";
import { generateDefenderFixes } from "../../demo/security-engine/defenderView/defenderEngine.js";
import { generateSimulatedPayloads } from "../../demo/security-engine/payloads/payloadEngine.js";
import { generateImpactAnalysis } from "../../demo/security-engine/impactEngine.js";
import { generateSummary } from "../../demo/security-engine/summaryEngine.js";
import { enforceEthicalRules } from "../../demo/security-engine/guardrails/ethicalGuard.js";
// --------------------------------------------------
// Constants
// --------------------------------------------------
const ALLOWED_INPUT_TYPES = new Set(["code", "api", "sql", "config"]);
const MAX_CONTENT_LENGTH = 50_000; // 50 KB

// --------------------------------------------------
// MAIN ANALYSIS CONTROLLER
// --------------------------------------------------
export const analyzeCode = async (req, res) => {
  try {
    const { inputType, content, language } = req.body;
    const userId = req.userId;

    /* -------------------------------------------------- */
    /* 1️⃣ AUTH VALIDATION */
    /* -------------------------------------------------- */
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* -------------------------------------------------- */
    /* 2️⃣ INPUT VALIDATION */
    /* -------------------------------------------------- */
    if (!inputType || !content) {
      return res.status(400).json({
        success: false,
        message: "inputType and content are required",
      });
    }

    if (!ALLOWED_INPUT_TYPES.has(inputType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputType",
      });
    }

    if (typeof content !== "string" || content.length > MAX_CONTENT_LENGTH) {
      return res.status(413).json({
        success: false,
        message: "Content too large or invalid",
      });
    }

    /* -------------------------------------------------- */
    /* 3️⃣ MULTI-INPUT SECURITY ENGINE (FEATURE 1) */
    /* -------------------------------------------------- */
    const engineOutput = analyzeInput({
      inputType,
      content,
      language,
    });

    /* -------------------------------------------------- */
    /* 4️⃣ OWASP VULNERABILITY DETECTION (FEATURE 2 + 3) */
    /* -------------------------------------------------- */


    // Feature 2 → find vulnerabilities
    const vulnerabilities = runOWASPDetections(engineOutput.normalizedInput);

    // Feature 3 → Risk score
    const overallRiskScore = calculateRiskScore(vulnerabilities);

    // Feature 4 → Attacker View
    const attackerView = generateAttackerView(
      vulnerabilities,
      engineOutput.normalizedInput
    );

    // Feature 5 → Defender Fixes
    const defenderFixes = generateDefenderFixes(
      vulnerabilities,
      engineOutput.normalizedInput
    );

    // feature 6 -> simulated payload genration
    const simulatedPayloads = generateSimulatedPayloads(vulnerabilities);

    // feature 7 -> impact analysis
    const impactAnalysis = generateImpactAnalysis(
      vulnerabilities,
      engineOutput.normalizedInput
    );

    // feature 8 summary
    const summary = generateSummary({
      vulnerabilities,
      overallRiskScore,
      attackerView,
      defenderFixes,
      simulatedPayloads,
      impactAnalysis,
    });
  // feature 9 read only enforcement
  const { safeVulns, disclaimer } = enforceEthicalRules(
    engineOutput.normalizedInput,
    vulnerabilities
  );
    const analysisResult = {
      overallRiskScore,
      vulnerabilities,
      attackerView,
      defenderFixes,
      simulatedPayloads,
      impactAnalysis,
      summary,
      vulnerabilities: safeVulns,
      processingTime: Date.now(),
    };

    /* -------------------------------------------------- */
    /* 5️⃣ STORE ANALYSIS */
    /* -------------------------------------------------- */
    const analysis = await Analysis.create({
      userId,
      inputType,
      normalizedInput: engineOutput.normalizedInput,
      overallRiskScore: analysisResult.overallRiskScore,
      vulnerabilities: analysisResult.vulnerabilities,
      processingTime: analysisResult.processingTime,
      analysisDate: new Date(),
    });

    await User.updateOne({ _id: userId }, { $inc: { analysisCount: 1 } });

    /* -------------------------------------------------- */
    /* 6️⃣ RESPONSE */
    /* -------------------------------------------------- */
    res.status(200).json({
      success: true,
      analysis: {
        id: analysis._id,
        inputType,
        overallRiskScore: analysis.overallRiskScore,
        vulnerabilities: analysis.vulnerabilities,
        analysisDate: analysis.analysisDate,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
};


// --------------------------------------------------
// READ-ONLY ENDPOINTS (UNCHANGED)
// --------------------------------------------------
export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const history = await Analysis.find({ userId })
      .sort({ analysisDate: -1 })
      .limit(20);

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis history",
    });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    const analysis = await Analysis.findOne({ _id: id, userId });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis",
    });
  }
};
