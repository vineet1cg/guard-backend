// -----------------------------
// Shared enums & types
// -----------------------------
export type InputType = "code" | "api" | "sql" | "config";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// -----------------------------
// Vulnerability
// -----------------------------
export interface Vulnerability {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  attackerLogic?: string;
  defenderLogic?: string;
  secureCodeFix?: string;
}

// -----------------------------
// Analyze request
// -----------------------------
export interface AnalysisRequest {
  inputType: InputType;
  content: string;
}

// -----------------------------
// Analyze response (frontend-normalized)
// -----------------------------
export interface AnalysisResult {
  riskScore: number;
  vulnerabilities: Vulnerability[];
}

// -----------------------------
// History
// -----------------------------
export interface AnalysisHistoryItem {
  id: string;
  inputType: InputType;
  overallRiskScore: number;
  vulnerabilityCount: number;
  analysisDate: string;
}

// -----------------------------
// Dashboard
// -----------------------------
export interface DashboardMetrics {
  totalScans: number;
  totalVulnerabilities: number;
  severityDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  riskTrend: {
    date: string;
    averageRisk: number;
  }[];
  recentScans: {
    _id: string;
    inputType: InputType;
    riskScore: number;
    vulnerabilities: Vulnerability[];
    createdAt: string;
  }[];
}
