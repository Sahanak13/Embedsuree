export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ClaimStatus = 'pending' | 'approved' | 'under_review' | 'flagged' | 'rejected';
export type TransactionType = 'product' | 'cab' | 'travel';

export interface UserProfile {
  id: string;
  user_id: string;
  trust_score: number;
  total_claims: number;
  approved_claims: number;
  flagged_claims: number;
  total_transactions: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  location: string;
  risk_level: RiskLevel;
  risk_score: number;
  status: 'active' | 'completed' | 'cancelled';
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Insurance {
  id: string;
  transaction_id: string;
  user_id: string;
  premium: number;
  coverage: number;
  type: string;
  status: 'active' | 'expired' | 'claimed';
  ai_confidence: number;
  created_at: string;
  expires_at: string;
}

export interface Claim {
  id: string;
  insurance_id: string;
  user_id: string;
  amount: number;
  status: ClaimStatus;
  incident_type: string;
  ai_decision: string | null;
  ai_reason: string | null;
  fraud_score: number;
  settled_at: string | null;
  created_at: string;
}

export interface FraudAlert {
  id: string;
  user_id: string;
  claim_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  created_at: string;
}

export interface AIDecisionLog {
  id: string;
  entity_type: 'insurance' | 'claim' | 'fraud';
  entity_id: string;
  user_id: string;
  decision: string;
  reasoning: string;
  confidence: number;
  factors: AIFactor[];
  created_at: string;
}

export interface AIFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface SimulationResult {
  transaction: Transaction;
  insurance: Insurance;
  aiLog: AIDecisionLog;
  riskAnalysis: RiskAnalysis;
}

export interface RiskAnalysis {
  score: number;
  level: RiskLevel;
  factors: AIFactor[];
  premium: number;
  coverage: number;
  confidence: number;
}

export interface ClaimDecision {
  status: ClaimStatus;
  reason: string;
  amount: number;
  fraudScore: number;
  factors: AIFactor[];
}
