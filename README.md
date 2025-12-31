🛡️ SentinAI — Ethical AI Security Analysis Platform

SentinAI is a full-stack, enterprise-grade, ethical static application security testing (SAST) platform that analyzes source code, APIs, SQL queries, and configuration files to detect real-world security vulnerabilities — without executing code or performing live attacks.

It is designed to feel like a real cybersecurity product, not a demo.

🚀 Key Highlights

🔍 Static Security Analysis (SAST) — no runtime execution

🧠 AI-assisted vulnerability reasoning

📚 OWASP Top 10 aligned detection

🎯 Risk scoring (0–100)

🔗 Kill Chain & Impact Analysis

🧑‍💻 Attacker mindset (read-only, ethical)

🛠️ Defender secure fixes

📊 Security dashboard with trends

🔐 JWT + Google OAuth authentication

🧾 Analysis history & metrics

⚖️ Strict ethical guardrails

🏗️ System Architecture
Frontend

React + TypeScript

Vite

Axios (with interceptors)

Protected routes

Dashboard (charts, trends, severity distribution)

Backend

Node.js (ES Modules)

Express

MongoDB + Mongoose

JWT authentication

Google OAuth (ID token verification)

Modular security engine

🔐 Ethical Security Model (IMPORTANT)

SentinAI DOES NOT:

Execute user code

Perform real attacks

Send payloads to targets

Perform network exploitation

Modify user systems

SentinAI ONLY:

Performs static pattern analysis

Generates simulated, educational payloads

Explains vulnerabilities safely

This platform is designed for education, awareness, and secure development, not hacking.

🧠 Security Engine Pipeline
Input
 ↓
Validation
 ↓
Normalization (code / api / sql / config)
 ↓
Vulnerability Detectors
 ↓
Risk Scoring
 ↓
Attacker View (ethical)
 ↓
Defender Fixes
 ↓
Impact & Kill Chain Analysis
 ↓
Summary & Metrics

🔍 Supported Vulnerabilities
Vulnerability	Severity	OWASP
SQL Injection	CRITICAL	A03:2021
Cross-Site Scripting (XSS)	HIGH	A03:2021
Hardcoded Secrets	HIGH	A02:2021
🧩 Kill Chain Mapping
Vulnerability	Kill Chain Stage
SQL Injection	Exploitation
XSS	Execution
Hardcoded Secret	Credential Access
📊 Dashboard Metrics

Total scans

Total vulnerabilities

Average risk score

Severity distribution

Risk trend (last 30 days)

Risk trend appears automatically after multiple analyses.

📁 Project Structure (Simplified)
MAIN_PROJECT/
|
├─────────backend/
│          |   ├── controllers/
│          |   ├── models/
│          |   ├── routes/
│          |   ├── security-engine/
│          │   ├── detectors/
│          │   ├── normalizers/
│          │   ├── impactEngine.js
│          │   ├── riskEngine.js
│          │   └── index.js
│          └── server.js
│
├─────────frontend/
│            ├── src/
│            │   ├── api/
│            │   ├── components/
│            │   ├── pages/
│            │   ├── context/
│            │   └── types/
│            └── vite.config.ts
│
└── README.md

🔑 Authentication Flow

Google OAuth login (frontend)

Google ID token sent to backend

Token verified

JWT issued

JWT stored securely

Protected routes unlocked

🧪 Sample Test Input

Use this code in Analyze Security to test all engines:

app.get("/user", (req, res) => {
  const id = req.query.id;
  db.query("SELECT * FROM users WHERE id = " + id, (err, result) => {
    res.send(result);
  });
});

app.get("/search", (req, res) => {
  res.send("<h1>" + req.query.q + "</h1>");
});

const API_KEY = "sk_test_1234567890";

Expected Output

3 vulnerabilities detected

Risk score > 70

Kill chain stages visible

Impact analysis populated

Dashboard metrics updated

🧠 Risk Scoring Model

Severity weights:

CRITICAL → 40
HIGH     → 25
MEDIUM   → 15
LOW      → 5


Maximum risk score capped at 100.

⚙️ Environment Variables
Backend .env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173

Frontend .env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

▶️ Running the Project
Backend
cd backend
npm install
node server.js

Frontend
cd frontend
npm install
npm run dev

🧪 Verification Checklist

✅ Google login works

✅ JWT stored correctly

✅ Protected routes enforced

✅ Analysis runs without errors

✅ Kill chain stage visible

✅ Risk trend appears after multiple scans

✅ No runtime crashes

🏆 Why SentinAI Is Different

Not a scanner toy

Not a demo project

Not unsafe AI hacking

SentinAI is a responsible, ethical, enterprise-style security platform that demonstrates:

Secure coding

Security architecture

AI-assisted reasoning

Product-level engineering

📌 Future Enhancements

CVSS scoring

MITRE ATT&CK mapping

PDF security reports

Multi-language analyzers

Policy-based risk thresholds

Team dashboards

📜 License

This project is for educational and demonstration purposes.
No warranty. No misuse permitted.

🙌 Author

Built and engineered by Rachit Kakkad & Team InnovateX
Full-Stack Engineer | Security-Focused Developer | AI Systems Builde