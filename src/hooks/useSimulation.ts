import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  analyzeRisk, getRandomLocation, getInsuranceType,
  generateTransactionAmount, getRandomIncidentType,
  calculateFraudScore, evaluateClaim, updateTrustScore,
  getTransactionLabel,
} from '../lib/aiEngine';
import { useAppStore } from '../lib/store';
import type { TransactionType } from '../types';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
const MAX_CLAIMS_PER_INSURANCE = 1;
const MAX_TOTAL_CLAIMS_PER_DAY = 5;

export function useSimulation() {
  const {
    profile, addTransaction, addInsurance, addAILog, addToast,
    setProfile, claims, addClaim, updateClaim, addFraudAlert,
  } = useAppStore();

  const trustScore = profile?.trust_score ?? 85;

  const runTransaction = useCallback(async (type: TransactionType) => {
    const location = getRandomLocation();
    const amount = generateTransactionAmount(type);
    const riskAnalysis = analyzeRisk(type, trustScore);

    const txId = crypto.randomUUID();
    const insId = crypto.randomUUID();
    const logId = crypto.randomUUID();
    const now = new Date().toISOString();

    const transaction = {
      id: txId,
      user_id: DEMO_USER_ID,
      type,
      amount,
      location,
      risk_level: riskAnalysis.level,
      risk_score: riskAnalysis.score,
      status: 'active' as const,
      metadata: { weather: 'Clear', session_id: crypto.randomUUID().slice(0, 8) },
      created_at: now,
    };

    const insurance = {
      id: insId,
      transaction_id: txId,
      user_id: DEMO_USER_ID,
      premium: riskAnalysis.premium,
      coverage: riskAnalysis.coverage,
      type: getInsuranceType(type),
      status: 'active' as const,
      ai_confidence: riskAnalysis.confidence,
      created_at: now,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const aiLog = {
      id: logId,
      entity_type: 'insurance' as const,
      entity_id: insId,
      user_id: DEMO_USER_ID,
      decision: `${getInsuranceType(type)} activated`,
      reasoning: `AI automatically applied ${riskAnalysis.level} risk coverage. ${
        riskAnalysis.level === 'Low' ? 'Low risk profile — standard premium applied.' :
        riskAnalysis.level === 'Medium' ? 'Elevated risk factors detected — adjusted premium.' :
        'High risk conditions — maximum coverage applied at premium rate.'
      }`,
      confidence: riskAnalysis.confidence,
      factors: riskAnalysis.factors,
      created_at: now,
    };

    addTransaction(transaction);
    addInsurance(insurance);
    addAILog(aiLog);

    if (profile) {
      setProfile({ ...profile, total_transactions: (profile.total_transactions ?? 0) + 1 });
    }

    addToast({
      type: 'info',
      title: 'Insurance Activated',
      message: `${getInsuranceType(type)} added for ${getTransactionLabel(type)}. Premium: $${riskAnalysis.premium} | Coverage: $${riskAnalysis.coverage}`,
      duration: 5000,
    });

    try {
      await supabase.from('transactions').insert([{ ...transaction, user_id: DEMO_USER_ID }]);
      await supabase.from('insurances').insert([{ ...insurance, user_id: DEMO_USER_ID }]);
    } catch {
    }

    return { transaction, insurance, riskAnalysis };
  }, [profile, trustScore, addTransaction, addInsurance, addAILog, addToast, setProfile]);

  const simulateIncident = useCallback(async (insuranceId?: string) => {
    const insurances = useAppStore.getState().insurances;
    const targetIns = insuranceId
      ? insurances.find((i) => i.id === insuranceId)
      : insurances[0];

    if (!targetIns) {
      addToast({ type: 'warning', title: 'No Insurance Found', message: 'Create a transaction first to generate an insurance policy.' });
      return null;
    }

    const currentClaims = useAppStore.getState().claims;

    const claimsOnThisInsurance = currentClaims.filter(
      (c) => c.insurance_id === targetIns.id
    );
    if (claimsOnThisInsurance.length >= MAX_CLAIMS_PER_INSURANCE) {
      addToast({
        type: 'error',
        title: 'Claim Limit Reached',
        message: `This insurance policy has already been claimed. Each policy allows only ${MAX_CLAIMS_PER_INSURANCE} claim.`,
        duration: 6000,
      });
      return null;
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const claimsToday = currentClaims.filter(
      (c) => new Date(c.created_at) > oneDayAgo
    );
    if (claimsToday.length >= MAX_TOTAL_CLAIMS_PER_DAY) {
      addToast({
        type: 'error',
        title: 'Daily Claim Limit Reached',
        message: `You have reached the daily limit of ${MAX_TOTAL_CLAIMS_PER_DAY} claims. Please try again tomorrow.`,
        duration: 6000,
      });
      return null;
    }

    const txs = useAppStore.getState().transactions;
    const tx = txs.find((t) => t.id === targetIns.transaction_id);
    const txType = (tx?.type ?? 'product') as TransactionType;
    const incidentType = getRandomIncidentType(txType);

    const recentClaims = currentClaims.filter(
      (c) => new Date(c.created_at) > new Date(Date.now() - 60 * 60 * 1000)
    );

    const fraudScore = calculateFraudScore(
      trustScore,
      currentClaims.length,
      recentClaims.length,
      tx?.risk_level ?? 'Low',
    );

    const claimAmount = parseFloat((targetIns.coverage * (0.3 + Math.random() * 0.5)).toFixed(2));
    const decision = evaluateClaim(
      trustScore,
      tx?.risk_level ?? 'Low',
      currentClaims.length,
      fraudScore,
      claimAmount,
      targetIns.coverage,
    );

    const claimId = crypto.randomUUID();
    const now = new Date().toISOString();

    const claim = {
      id: claimId,
      insurance_id: targetIns.id,
      user_id: DEMO_USER_ID,
      amount: claimAmount,
      status: decision.status,
      incident_type: incidentType,
      ai_decision: decision.status,
      ai_reason: decision.reason,
      fraud_score: fraudScore,
      settled_at: decision.status === 'approved' ? now : null,
      created_at: now,
    };

    addClaim(claim);

    const newTrustScore = updateTrustScore(trustScore, decision.status);
    if (profile) {
      setProfile({
        ...profile,
        trust_score: newTrustScore,
        total_claims: (profile.total_claims ?? 0) + 1,
        approved_claims: decision.status === 'approved' ? (profile.approved_claims ?? 0) + 1 : (profile.approved_claims ?? 0),
        flagged_claims: decision.status === 'flagged' ? (profile.flagged_claims ?? 0) + 1 : (profile.flagged_claims ?? 0),
      });
    }

    const aiLog = {
      id: crypto.randomUUID(),
      entity_type: 'claim' as const,
      entity_id: claimId,
      user_id: DEMO_USER_ID,
      decision: decision.status.toUpperCase(),
      reasoning: decision.reason,
      confidence: 0.7 + Math.random() * 0.25,
      factors: decision.factors,
      created_at: now,
    };
    addAILog(aiLog);

    if (decision.status === 'flagged') {
      const alert = {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        claim_id: claimId,
        alert_type: 'Suspicious Claim Pattern',
        severity: fraudScore > 80 ? 'critical' as const : 'high' as const,
        description: `Fraud score ${fraudScore}/100 — ${decision.reason}`,
        resolved: false,
        created_at: now,
      };
      addFraudAlert(alert);

      addToast({
        type: 'error',
        title: 'Fraud Alert Triggered',
        message: `Claim flagged — Fraud score: ${fraudScore}/100. Manual review required.`,
        duration: 6000,
      });
    } else if (decision.status === 'pending_admin_review') {
      addToast({
        type: 'warning',
        title: 'Admin Approval Required',
        message: `High-value claim of $${claimAmount.toFixed(2)} sent to Admin Panel for review before payout.`,
        duration: 6000,
      });
    } else if (decision.status === 'approved') {
      addToast({
        type: 'success',
        title: 'Claim Approved',
        message: `$${claimAmount.toFixed(2)} credited to your account. ${decision.reason}`,
        duration: 5000,
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Claim Under Review',
        message: decision.reason,
        duration: 5000,
      });
    }

    try {
      await supabase.from('claims').insert([{ ...claim, user_id: DEMO_USER_ID }]);
    } catch {
    }

    return claim;
  }, [trustScore, claims, profile, addClaim, addAILog, addToast, addFraudAlert, setProfile]);

  return { runTransaction, simulateIncident };
}
