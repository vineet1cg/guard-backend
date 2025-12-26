import mongoose from 'mongoose';

const vulnerabilitySchema = new mongoose.Schema({
  id: String,
  title: String,
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  },
  category: String,
  description: String,
  attackerLogic: String,
  defenderLogic: String,
  simulatedPayload: String,
  impact: String,
  riskScore: Number,
  confidence: Number,
  secureCodeFix: String,
  vulnerableCodeSnippet: String,
  killChainStage: String
});

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  inputType: {
    type: String,
    required: true,
    enum: ['code', 'api', 'sql', 'config']
  },
  content: {
    type: String,
    required: true
  },
  overallRiskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  vulnerabilities: [vulnerabilitySchema],
  ethicalNotice: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('Analysis', analysisSchema);
