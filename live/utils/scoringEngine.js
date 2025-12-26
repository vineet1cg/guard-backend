export const calculateRiskScore = (severity, confidence) => {
  const severityScores = {
    CRITICAL: 90,
    HIGH: 70,
    MEDIUM: 45,
    LOW: 20
  };

  const baseScore = severityScores[severity] || 50;
  const adjustedScore = Math.round(baseScore * confidence);
  
  return Math.min(100, Math.max(0, adjustedScore));
};

export const calculateOverallRisk = (vulnerabilities) => {
  if (vulnerabilities.length === 0) {
    return 0;
  }

  // Weight by severity
  const weights = {
    CRITICAL: 1.0,
    HIGH: 0.7,
    MEDIUM: 0.4,
    LOW: 0.2
  };

  let weightedSum = 0;
  let totalWeight = 0;

  vulnerabilities.forEach(vuln => {
    const weight = weights[vuln.severity] || 0.5;
    weightedSum += vuln.riskScore * weight;
    totalWeight += weight;
  });

  const averageScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  // Increase score if multiple critical issues
  const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
  const multiplier = Math.min(1.5, 1 + (criticalCount * 0.1));
  
  return Math.min(100, Math.round(averageScore * multiplier));
};
