import api from "./axios";
import type {
  AnalysisRequest,
  AnalysisResult,
  DashboardMetrics,
  AnalysisHistoryItem,
} from "../types/analysis";

export const analysisApi = {
  // ---------------------------------
  // POST /api/analyze
  // ---------------------------------
  analyze: async (
    payload: AnalysisRequest
  ): Promise<AnalysisResult> => {
    const response = await api.post("/api/analyze", payload);
    const analysis = response.data.analysis;

    return {
      riskScore: analysis.overallRiskScore,
      vulnerabilities: analysis.vulnerabilities ?? [],
    };
  },

  // ---------------------------------
  // GET /api/analyze/history
  // ---------------------------------
  getHistory: async (): Promise<AnalysisHistoryItem[]> => {
    const response = await api.get("/api/analyze/history");
    return response.data.analyses;
  },

  // ---------------------------------
  // GET /api/analyze/:id
  // ---------------------------------
  getAnalysisById: async (id: string) => {
    const response = await api.get(`/api/analyze/${id}`);
    return response.data;
  },

  // ---------------------------------
  // GET /api/dashboard/metrics
  // ---------------------------------
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get("/api/dashboard/metrics");
    return response.data.metrics;
  },
};
