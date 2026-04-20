import type { Claim, FraudAlert } from '../types';

export interface FraudPattern {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  triggered: boolean;
}

export function detectFraudPatterns(
  claims: Claim[],
  trustScore: number,
): FraudPattern[] {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentClaims = claims.filter(c => new Date(c.created_at) > oneHourAgo);
  const dailyClaims = claims.filter(c => new Date(c.created_at) > oneDayAgo);
  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);
  const flaggedCount = claims.filter(c => c.status === 'flagged').length;

  return [
    {
      type: 'Rapid Claim Submission',
      severity: recentClaims.length >= 3 ? 'critical' : recentClaims.length >= 2 ? 'high' : 'low',
      description: `${recentClaims.length} claims submitted within the last hour`,
      triggered: recentClaims.length >= 2,
    },
    {
      type: 'High Daily Volume',
      severity: dailyClaims.length >= 5 ? 'high' : dailyClaims.length >= 3 ? 'medium' : 'low',
      description: `${dailyClaims.length} claims filed today`,
      triggered: dailyClaims.length >= 3,
    },
    {
      type: 'Low Trust Score',
      severity: trustScore < 20 ? 'critical' : trustScore < 40 ? 'high' : trustScore < 60 ? 'medium' : 'low',
      description: `Trust score ${trustScore}/100 indicates risky behavior`,
      triggered: trustScore < 60,
    },
    {
      type: 'Excessive Claim Amount',
      severity: totalAmount > 5000 ? 'high' : totalAmount > 2000 ? 'medium' : 'low',
      description: `Total claims value: $${totalAmount.toFixed(2)}`,
      triggered: totalAmount > 1500,
    },
    {
      type: 'Repeated Flagging',
      severity: flaggedCount >= 3 ? 'critical' : flaggedCount >= 2 ? 'high' : flaggedCount >= 1 ? 'medium' : 'low',
      description: `${flaggedCount} previously flagged claims on record`,
      triggered: flaggedCount >= 1,
    },
  ];
}

export function getFraudSeverityColor(severity: FraudAlert['severity']): string {
  const colors: Record<FraudAlert['severity'], string> = {
    low: 'text-emerald-400',
    medium: 'text-amber-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  };
  return colors[severity];
}

export function getFraudSeverityBg(severity: FraudAlert['severity']): string {
  const colors: Record<FraudAlert['severity'], string> = {
    low: 'bg-emerald-500/10 border-emerald-500/30',
    medium: 'bg-amber-500/10 border-amber-500/30',
    high: 'bg-orange-500/10 border-orange-500/30',
    critical: 'bg-red-500/10 border-red-500/30',
  };
  return colors[severity];
}
