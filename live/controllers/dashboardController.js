import Analysis from '../models/Analysis.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Total scans
    const totalScans = await Analysis.countDocuments({ userId });

    // Severity distribution
    const analyses = await Analysis.find({ userId });
    
    const severityCount = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };

    let totalVulnerabilities = 0;
    let totalRiskScore = 0;

    analyses.forEach(analysis => {
      analysis.vulnerabilities.forEach(vuln => {
        severityCount[vuln.severity]++;
        totalVulnerabilities++;
      });
      totalRiskScore += analysis.overallRiskScore;
    });

    // Average risk score
    const averageRiskScore = totalScans > 0 ? Math.round(totalRiskScore / totalScans) : 0;

    // Risk trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAnalyses = await Analysis.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    const riskTrends = recentAnalyses.map(analysis => ({
      date: analysis.createdAt.toISOString().split('T')[0],
      riskScore: analysis.overallRiskScore
    }));

    // Category breakdown
    const categoryCount = {};
    analyses.forEach(analysis => {
      analysis.vulnerabilities.forEach(vuln => {
        categoryCount[vuln.category] = (categoryCount[vuln.category] || 0) + 1;
      });
    });

    res.json({
      success: true,
      metrics: {
        totalScans,
        totalVulnerabilities,
        averageRiskScore,
        severityDistribution: severityCount,
        categoryDistribution: categoryCount,
        riskTrends
      }
    });
  } catch (error) {
    next(error);
  }
};