/**
 * SUMMARY ENGINE
 * --------------
 * Aggregates vulnerability statistics
 */

export function buildSummary(vulnerabilities = []) {
  const summary = {
    total: vulnerabilities.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  vulnerabilities.forEach((v) => {
    if (v.severity === "Critical") summary.critical++;
    if (v.severity === "High") summary.high++;
    if (v.severity === "Medium") summary.medium++;
    if (v.severity === "Low") summary.low++;
  });

  return summary;
}
