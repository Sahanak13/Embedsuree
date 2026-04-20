import type { RiskLevel, RiskAnalysis, ClaimDecision, AIFactor, TransactionType, ClaimStatus } from '../types';

const LOCATIONS = [
  'New York, US', 'San Francisco, US', 'Chicago, US', 'Miami, US',
  'London, UK', 'Tokyo, JP', 'Dubai, UAE', 'Sydney, AU',
  'Mumbai, IN', 'Toronto, CA'
];

const WEATHER_CONDITIONS = ['Clear', 'Rainy', 'Foggy', 'Stormy', 'Snowy', 'Cloudy'];

const INCIDENT_TYPES: Record<TransactionType, string[]> = {
  product: ['Product Damage', 'Theft', 'Non-Delivery', 'Defective Item'],
  cab: ['Accident', 'Vehicle Breakdown', 'Driver Misconduct', 'Route Deviation'],
  travel: ['Flight Delay', 'Baggage Loss', 'Medical Emergency', 'Trip Cancellation'],
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getRandomLocation(): string {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

export function getRandomIncidentType(txType: TransactionType): string {
  const types = INCIDENT_TYPES[txType];
  return types[Math.floor(Math.random() * types.length)];
}

export function analyzeRisk(type: TransactionType, trustScore: number): RiskAnalysis {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const weather = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];

  const timeRisk = (hour >= 22 || hour <= 5) ? 25 : (hour >= 17 && hour <= 20) ? 15 : 5;
  const weatherRisk = ['Rainy', 'Foggy', 'Stormy', 'Snowy'].includes(weather) ? 20 : 5;
  const typeBaseRisk = type === 'travel' ? 20 : type === 'cab' ? 15 : 10;
  const trustPenalty = Math.max(0, (80 - trustScore) * 0.5);
  const weekendBonus = (dayOfWeek === 0 || dayOfWeek === 6) ? 8 : 0;
  const randomVariance = Math.random() * 15;

  const rawScore = timeRisk + weatherRisk + typeBaseRisk + trustPenalty + weekendBonus + randomVariance;
  const score = Math.min(100, Math.round(rawScore));

  const level: RiskLevel = score < 33 ? 'Low' : score < 66 ? 'Medium' : 'High';

  const basePremiums: Record<TransactionType, number> = {
    product: 2.99,
    cab: 1.49,
    travel: 8.99,
  };

  const multiplier = level === 'Low' ? 1 : level === 'Medium' ? 1.6 : 2.4;
  const premium = parseFloat((basePremiums[type] * multiplier).toFixed(2));

  const coverageMultipliers: Record<TransactionType, number> = {
    product: 150,
    cab: 80,
    travel: 500,
  };
  const coverage = parseFloat((premium * coverageMultipliers[type]).toFixed(2));
  const confidence = parseFloat((0.7 + Math.random() * 0.29).toFixed(2));

  const factors: AIFactor[] = [
    {
      name: 'Time of Day',
      impact: timeRisk > 15 ? 'negative' : 'positive',
      weight: timeRisk / 100,
      description: `${hour >= 22 || hour <= 5 ? 'Late night' : hour >= 17 ? 'Rush hour' : 'Business hours'} detected at ${hour}:00`,
    },
    {
      name: 'Weather Conditions',
      impact: weatherRisk > 10 ? 'negative' : 'positive',
      weight: weatherRisk / 100,
      description: `Current weather: ${weather}`,
    },
    {
      name: 'Activity Type',
      impact: 'neutral',
      weight: typeBaseRisk / 100,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} carries inherent risk profile`,
    },
    {
      name: 'Trust Score',
      impact: trustScore >= 70 ? 'positive' : trustScore >= 40 ? 'neutral' : 'negative',
      weight: (100 - trustScore) / 200,
      description: `User trust score: ${trustScore}/100 — ${trustScore >= 70 ? 'Excellent' : trustScore >= 40 ? 'Average' : 'Below average'}`,
    },
    {
      name: 'Day Pattern',
      impact: weekendBonus > 0 ? 'negative' : 'positive',
      weight: weekendBonus / 100,
      description: dayOfWeek === 0 || dayOfWeek === 6 ? 'Weekend activity shows elevated risk' : 'Weekday pattern is normal',
    },
  ];

  return { score, level, factors, premium, coverage, confidence };
}

export function evaluateClaim(
  trustScore: number,
  riskLevel: RiskLevel,
  totalClaims: number,
  fraudScore: number,
  claimAmount: number,
  coverageAmount: number,
): ClaimDecision {
  const claimRatio = claimAmount / coverageAmount;
  const isHighFrequency = totalClaims > 5;
  const isHighValue = claimRatio > 0.8;
  const isLowTrust = trustScore < 40;
  const isHighFraud = fraudScore > 65;

  const factors: AIFactor[] = [
    {
      name: 'Trust Score',
      impact: trustScore >= 70 ? 'positive' : trustScore >= 40 ? 'neutral' : 'negative',
      weight: trustScore / 100,
      description: `Trust score ${trustScore}/100`,
    },
    {
      name: 'Claim Frequency',
      impact: isHighFrequency ? 'negative' : 'positive',
      weight: Math.min(totalClaims / 10, 1),
      description: `${totalClaims} total claims on record`,
    },
    {
      name: 'Claim Value Ratio',
      impact: isHighValue ? 'negative' : 'positive',
      weight: claimRatio,
      description: `Claim is ${Math.round(claimRatio * 100)}% of coverage limit`,
    },
    {
      name: 'Fraud Risk Score',
      impact: isHighFraud ? 'negative' : 'positive',
      weight: fraudScore / 100,
      description: `AI fraud probability: ${fraudScore}%`,
    },
    {
      name: 'Risk Profile',
      impact: riskLevel === 'Low' ? 'positive' : riskLevel === 'Medium' ? 'neutral' : 'negative',
      weight: riskLevel === 'Low' ? 0.1 : riskLevel === 'Medium' ? 0.4 : 0.7,
      description: `Original transaction risk: ${riskLevel}`,
    },
  ];

  let status: ClaimStatus;
  let reason: string;

  if (isHighFraud && isHighFrequency) {
    status = 'flagged';
    reason = 'Flagged due to high fraud score combined with unusual claim frequency. Manual review required.';
  } else if (isLowTrust && isHighValue) {
    status = 'flagged';
    reason = 'Flagged due to low trust score and high claim value. Fraud indicators detected.';
  } else if (isHighFrequency && riskLevel === 'High') {
    status = 'under_review';
    reason = 'Under review: Multiple claims detected with high-risk profile. Verifying incident authenticity.';
  } else if (trustScore >= 70 && !isHighFraud && !isHighFrequency) {
    status = 'approved';
    reason = `Approved due to high trust score (${trustScore}/100), normal claim behavior, and low fraud indicators.`;
  } else if (trustScore >= 50 && fraudScore < 40) {
    status = 'approved';
    reason = `Approved based on acceptable trust score and clean fraud profile. Standard processing applied.`;
  } else {
    status = 'under_review';
    reason = 'Under review: Mixed signals in behavioral profile. Additional verification in progress.';
  }

  return { status, reason, amount: claimAmount, fraudScore, factors };
}

export function calculateFraudScore(
  trustScore: number,
  totalClaims: number,
  recentClaimsInHour: number,
  riskLevel: RiskLevel,
): number {
  let score = 0;
  score += Math.max(0, (60 - trustScore) * 0.8);
  score += Math.min(30, totalClaims * 4);
  score += recentClaimsInHour * 20;
  score += riskLevel === 'High' ? 15 : riskLevel === 'Medium' ? 7 : 0;
  score += (Math.random() * 10);
  return Math.min(100, Math.round(score));
}

export function getTransactionLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    product: 'Product Purchase',
    cab: 'Cab Booking',
    travel: 'Travel Booking',
  };
  return labels[type];
}

export function getInsuranceType(type: TransactionType): string {
  const types: Record<TransactionType, string> = {
    product: 'Purchase Protection',
    cab: 'Ride Insurance',
    travel: 'Travel Insurance',
  };
  return types[type];
}

export function generateTransactionAmount(type: TransactionType): number {
  const ranges: Record<TransactionType, [number, number]> = {
    product: [29, 499],
    cab: [8, 65],
    travel: [199, 1499],
  };
  const [min, max] = ranges[type];
  return parseFloat((min + Math.random() * (max - min)).toFixed(2));
}

export function updateTrustScore(
  currentScore: number,
  claimStatus: ClaimStatus,
): number {
  const deltas: Record<ClaimStatus, number> = {
    approved: -2,
    under_review: -5,
    flagged: -15,
    rejected: -8,
    pending: 0,
  };
  const delta = deltas[claimStatus] ?? 0;
  return Math.max(0, Math.min(100, currentScore + delta));
}

export function getRevenueTrend(): number[] {
  return Array.from({ length: 12 }, (_, i) => {
    const base = 45000 + i * 8000;
    return Math.round(base + (seededRandom(i + 1) * 15000));
  });
}

export function getRiskDistribution(): { low: number; medium: number; high: number } {
  return { low: 58, medium: 30, high: 12 };
}
