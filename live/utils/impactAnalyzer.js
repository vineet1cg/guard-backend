export const analyzeImpact = (category, severity) => {
  const impacts = {
    SQL_INJECTION: {
      CRITICAL: `**Data Breach Risk: CRITICAL**

Business Impact:
• Complete database compromise possible
• Customer PII, financial records, trade secrets exposed
• Regulatory violations (GDPR, CCPA, HIPAA)
• Potential fines: millions of dollars
• Reputational damage and customer trust loss

Technical Impact:
• Unauthorized data access and exfiltration
• Data modification or deletion
• Authentication bypass
• Privilege escalation to admin level
• Backend system compromise`,
      HIGH: `**Data Breach Risk: HIGH**

Business Impact:
• Partial database access possible
• Sensitive user data at risk
• Compliance violations likely
• Financial and reputational damage

Technical Impact:
• Limited unauthorized data access
• Potential for lateral movement
• Query manipulation possible`,
      MEDIUM: `**Data Breach Risk: MODERATE**

Business Impact:
• Limited data exposure possible
• Minor compliance concerns
• Moderate remediation costs

Technical Impact:
• Restricted data access
• Query behavior manipulation
• Information disclosure`,
      LOW: `**Data Breach Risk: LOW**

Business Impact:
• Minimal direct impact
• Best practice violation

Technical Impact:
• Minor information leakage possible
• Limited exploit potential`
    },
    XSS: {
      CRITICAL: `**Client-Side Attack Risk: CRITICAL**

Business Impact:
• Mass user account compromise
• Brand impersonation and phishing
• Customer data theft
• Trust and reputation damage
• Legal liability for user harm

Technical Impact:
• Session hijacking (cookie theft)
• Credential harvesting via fake forms
• Malware distribution to users
• Website defacement
• Keylogging and user surveillance
• Propagation to other users (stored XSS)`,
      HIGH: `**Client-Side Attack Risk: HIGH**

Business Impact:
• User account compromise
• Phishing attacks
• Reputation damage

Technical Impact:
• Session token theft
• User action hijacking
• Sensitive data exposure
• Malicious redirects`,
      MEDIUM: `**Client-Side Attack Risk: MODERATE**

Business Impact:
• Individual user impact
• Minor reputation risk

Technical Impact:
• Limited script execution
• User-specific attacks
• Information disclosure`,
      LOW: `**Client-Side Attack Risk: LOW**

Business Impact:
• Minimal user impact

Technical Impact:
• Minor DOM manipulation
• Limited exploit surface`
    },
    HARDCODED_SECRETS: {
      CRITICAL: `**Secret Exposure Risk: CRITICAL**

Business Impact:
• Complete infrastructure compromise
• Unauthorized cloud resource access ($$)
• Data breach across all connected systems
• Supply chain attack vector
• Regulatory violations and fines
• Emergency incident response required

Technical Impact:
• Full AWS/cloud account access
• Database credentials exposed
• API keys grant system-wide access
• Third-party service compromise
• Difficult secret rotation required
• Historical git exposure`,
      HIGH: `**Secret Exposure Risk: HIGH**

Business Impact:
• Service-level compromise
• Unauthorized access costs
• Incident response needed

Technical Impact:
• API access to sensitive services
• Limited infrastructure access
• Third-party integration compromise`,
      MEDIUM: `**Secret Exposure Risk: MODERATE**

Business Impact:
• Limited service exposure
• Rotation required

Technical Impact:
• Restricted API access
• Single service impact`,
      LOW: `**Secret Exposure Risk: LOW**

Business Impact:
• Minimal exposure

Technical Impact:
• Low-privilege access only`
    }
  };

  const categoryImpacts = impacts[category];
  if (!categoryImpacts) {
    return `**Impact Analysis**\n\nCategory: ${category}\nSeverity: ${severity}\n\nThis vulnerability requires assessment based on specific context and exploitation potential.`;
  }

  return categoryImpacts[severity] || categoryImpacts.MEDIUM;
};