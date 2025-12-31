import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analysisApi } from "../api/analysis";
import type { AnalysisResult } from "../types/analysis";
import { EthicalBanner } from "../components/EthicalBanner";
import { RiskMeter } from "../components/RiskMeter";
import { VulnerabilityCard } from "../components/VulnerabilityCard";

/* ---------------- Types ---------------- */

interface HistoryItem {
  id: string;
  inputType: string;
  overallRiskScore: number;
  vulnerabilityCount: number;
  analysisDate: string;
}

export const HistoryPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Fetch History ---------------- */


  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const res = await analysisApi.getHistory();
      setHistory(res); // ✅ FIXED
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load analysis history"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, []);



  /* ---------------- Fetch Full Analysis ---------------- */

  const loadAnalysisById = async (id: string) => {
    try {
      const res = await analysisApi.getAnalysisById(id);
      setSelectedAnalysis(res.analysis);
    } catch (err: any) {
      setError("Failed to load analysis details");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analysis History</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/analyze")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              New Analysis
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <EthicalBanner />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History List */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Past Analyses ({history.length})
            </h2>

            {history.length === 0 ? (
              <p className="text-gray-500">No history available</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadAnalysisById(item.id)}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {item.inputType.toUpperCase()}
                      </span>
                      <span className="text-gray-500">
                        {new Date(item.analysisDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Risk: {item.overallRiskScore}/100 • Vulns:{" "}
                      {item.vulnerabilityCount}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Analysis Detail */}
          <div className="lg:col-span-2">
            {selectedAnalysis ? (
              <div className="bg-white rounded shadow p-6">
                <RiskMeter riskScore={selectedAnalysis.riskScore} />

                <h3 className="text-lg font-semibold mt-6 mb-4">
                  Vulnerabilities (
                  {selectedAnalysis.vulnerabilities.length})
                </h3>

                {selectedAnalysis.vulnerabilities.length === 0 ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    No vulnerabilities found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedAnalysis.vulnerabilities.map((v) => (
                      <VulnerabilityCard
                        key={v.id}
                        vulnerability={v}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded shadow p-12 text-center text-gray-500">
                Select an analysis to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
