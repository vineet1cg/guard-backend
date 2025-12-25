import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * Analysis Controller
 * EDUCATIONAL SIMULATION ONLY
 * Hardened for production safety
 */

/* ------------------------------------------------------------------ */
/* Utils */
/* ------------------------------------------------------------------ */

const ALLOWxD_INPUT_TYPES = new Set(["code", "api", "sql", "config"]);
const MAX_CONTENT_LENGTH = 100_000;

const safeInt = (value, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

/* ------------------------------------------------------------------ */
/* Simulated AI Engine (safe + deterministic bounds) */
/* ------------------------------------------------------------------ */

const simulateAnalysis = (inputType, content) => {
  const processingTime = Math.floor(Math.random() * 300) + 200;

  const baseRisk = Math.floor(Math.random() * 40) + 30;
  const contentRisk = content.length > 500 ? 15 : content.length > 200 ? 10 : 5;

  const overallRiskScore = Math.min(95, baseRisk + contentRisk);

  return {
    overallRiskScore,
    vulnerabilities: generateVulnerabilities(inputType, overallRiskScore),
    processingTime,
  };
};

const generateVulnerabilities = (inputType, riskScore) => {
  const templates = {
    code: [
      {
        name: "Hardcoded Credentials",
        severity: "Critical",
        description: "Sensitive credentials appear hardcoded",
        secureCodeFix: "const apiKey = process.env.API_KEY;",
      },
      {
        name: "SQL Injection",
        severity: "Critical",
        description: "Dynamic SQL without parameterization",
        secureCodeFix: 'db.query("SELECT * FROM users WHERE id = ?", [id]);',
      },
      {
        name: "XSS",
        severity: "High",
        description: "Unsanitized user input rendered to DOM",
        secureCodeFix: "element.textContent = userInput;",
      },
    ],
    api: [
      {
        name: "Missing Authentication",
        severity: "Critical",
        description: "Endpoint lacks authentication",
        secureCodeFix: "router.use(authenticateToken);",
      },
      {
        name: "Broken Access Control",
        severity: "High",
        description: "Authorization checks missing",
        secureCodeFix:
          "if (resource.userId !== req.user.id) return res.sendStatus(403);",
      },
    ],
    sql: [
      {
        name: "SQL Injection",
        severity: "Critical",
        description: "Unsafe SQL construction",
        secureCodeFix:
          'cursor.execute("SELECT * FROM users WHERE email = %s", [email]);',
      },
    ],
    config: [
      {
        name: "Exposed Secrets",
        severity: "Critical",
        description: "Secrets found in config",
        secureCodeFix: "API_KEY=${API_KEY}",
      },
    ],
  };

  const selected = templates[inputType] || templates.code;
  const count = riskScore > 70 ? 3 : riskScore > 50 ? 2 : 1;

  return selected.slice(0, count).map((v, i) => ({
    id: `vuln-${Date.now()}-${i}`,
    ...v,
  }));
};

/* ------------------------------------------------------------------ */
/* Controllers */
/* ------------------------------------------------------------------ */

export const analyzeCode = async (req, res) => {
  try {
    const { inputType, content } = req.body;
    const userId = req.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

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

    const analysisResult = simulateAnalysis(inputType, content);

    const analysis = await Analysis.create({
      userId,
      inputType,
      overallRiskScore: analysisResult.overallRiskScore,
      vulnerabilities: analysisResult.vulnerabilities,
      processingTime: analysisResult.processingTime,
      analysisDate: new Date(),
    });

    await User.updateOne({ _id: userId }, { $inc: { analysisCount: 1 } });

    res.json({
      success: true,
      analysis: {
        id: analysis._id,
        inputType,
        overallRiskScore: analysis.overallRiskScore,
        vulnerabilities: analysis.vulnerabilities,
        analysisDate: analysis.analysisDate,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.sendStatus(401);
    }

    const limit = safeInt(req.query.limit, 10);
    const page = safeInt(req.query.page, 1);
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      Analysis.find({ userId })
        .sort({ analysisDate: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean(),
      Analysis.countDocuments({ userId }),
    ]);

    res.json({
      success: true,
      analyses: analyses.map((a) => ({
        id: a._id,
        inputType: a.inputType,
        overallRiskScore: a.overallRiskScore,
        vulnerabilityCount: a.vulnerabilities?.length || 0,
        analysisDate: a.analysisDate,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const analysis = await Analysis.findOne({ _id: id, userId }).lean();

    if (!analysis) {
      return res.sendStatus(404);
    }

    res.json({
      success: true,
      analysis: {
        id: analysis._id,
        inputType: analysis.inputType,
        overallRiskScore: analysis.overallRiskScore,
        vulnerabilities: analysis.vulnerabilities,
        analysisDate: analysis.analysisDate,
        processingTime: analysis.processingTime,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis",
    });
  }
};
