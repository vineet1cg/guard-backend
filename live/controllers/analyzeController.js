import Analysis from '../models/Analysis.js';
import { detectSQLInjection } from '../utils/detectors/sqlInjection.js';
import { detectXSS } from '../utils/detectors/xss.js';
import { detectSecrets } from '../utils/detectors/secrets.js';
import { calculateRiskScore, calculateOverallRisk } from '../utils/scoringEngine.js';
import { generateSimulatedPayload } from '../utils/payloadGenerator.js';
import { analyzeImpact } from '../utils/impactAnalyzer.js';

export const analyzeInput = async (req, res, next) => {
  try {
    const { inputType, content } = req.body;

    // Validation
    if (!inputType || !content) {
      return res.status(400).json({
        success: false,
        error: 'inputType and content are required'
      });
    }

    if (!['code', 'api', 'sql', 'config'].includes(inputType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid inputType'
      });
    }

    if (content.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Content too large (max 50KB)'
      });
    }

    // Run all detectors
    const detectedVulnerabilities = [];

    // SQL Injection detection
    const sqlVulns = detectSQLInjection(content, inputType);
    detectedVulnerabilities.push(...sqlVulns);

    // XSS detection
    const xssVulns = detectXSS(content, inputType);
    detectedVulnerabilities.push(...xssVulns);

    // Secrets detection
    const secretVulns = detectSecrets(content, inputType);
    detectedVulnerabilities.push(...secretVulns);

    // Enrich vulnerabilities with additional data
    const enrichedVulnerabilities = detectedVulnerabilities.map((vuln, index) => {
      const riskScore = calculateRiskScore(vuln.severity, vuln.confidence);
      const simulatedPayload = generateSimulatedPayload(vuln.category, vuln.context);
      const impact = analyzeImpact(vuln.category, vuln.severity);

      return {
        id: `vuln_${Date.now()}_${index}`,
        title: vuln.title,
        severity: vuln.severity,
        category: vuln.category,
        description: vuln.description,
        attackerLogic: vuln.attackerLogic,
        defenderLogic: vuln.defenderLogic,
        simulatedPayload,
        impact,
        riskScore,
        confidence: vuln.confidence,
        secureCodeFix: vuln.secureCodeFix,
        vulnerableCodeSnippet: vuln.vulnerableCodeSnippet,
        killChainStage: vuln.killChainStage
      };
    });

    // Calculate overall risk
    const overallRiskScore = calculateOverallRisk(enrichedVulnerabilities);

    // Ethical notice
    const ethicalNotice = '⚠️ EDUCATIONAL USE ONLY - All payloads are simulated and non-executable. No real exploits are performed. This analysis is for security awareness and training purposes only.';

    // Save to database
    const analysis = await Analysis.create({
      userId: req.user.userId,
      inputType,
      content,
      overallRiskScore,
      vulnerabilities: enrichedVulnerabilities,
      ethicalNotice
    });

    // Return response
    res.json({
      success: true,
      analysis: {
        id: analysis._id,
        inputType: analysis.inputType,
        overallRiskScore: analysis.overallRiskScore,
        vulnerabilities: analysis.vulnerabilities,
        ethicalNotice: analysis.ethicalNotice,
        createdAt: analysis.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const analyses = await Analysis.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-content');

    const total = await Analysis.countDocuments({ userId: req.user.userId });

    res.json({
      success: true,
      analyses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

