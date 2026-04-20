import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Car, Plane, Zap, AlertCircle, Shield,
  TrendingUp, MapPin, Clock, ChevronRight, Activity,
  ShieldCheck, Sparkles
} from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import { useAppStore } from '../lib/store';
import { RiskGauge } from '../components/ui/RiskGauge';
import { TrustScore } from '../components/ui/TrustScore';
import type { TransactionType, RiskAnalysis, Insurance, Transaction } from '../types';

interface LastResult {
  transaction: Transaction;
  insurance: Insurance;
  riskAnalysis: RiskAnalysis;
}

const PANEL = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
  border: '1px solid rgba(139,92,246,0.15)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.025) inset',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const ACTION_BUTTONS = [
  {
    type: 'product' as TransactionType,
    label: 'Buy Product',
    icon: ShoppingBag,
    description: 'Trigger purchase protection',
    accentColor: '#22d3ee',
    accentRgb: '6,182,212',
  },
  {
    type: 'cab' as TransactionType,
    label: 'Book Cab',
    icon: Car,
    description: 'Trigger ride insurance',
    accentColor: '#60a5fa',
    accentRgb: '59,130,246',
  },
  {
    type: 'travel' as TransactionType,
    label: 'Start Travel',
    icon: Plane,
    description: 'Trigger travel insurance',
    accentColor: '#34d399',
    accentRgb: '16,185,129',
  },
];

function InsuranceActivatedCard({ result }: { result: LastResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="p-5 rounded-2xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.05) 100%)',
        border: '1px solid rgba(6,182,212,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(6,182,212,0.08)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)', boxShadow: '0 0 16px rgba(6,182,212,0.2)' }}
        >
          <Shield className="w-6 h-6" style={{ color: '#22d3ee' }} />
        </motion.div>
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ color: '#22d3ee' }}>Insurance Activated</span>
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: '#22d3ee' }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
            <h4 className="text-white font-semibold text-lg">{result.insurance.type}</h4>
          </motion.div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { label: 'Premium', value: `$${result.insurance.premium}`, color: '#22d3ee', border: 'rgba(6,182,212,0.2)' },
              { label: 'Coverage', value: `$${result.insurance.coverage}`, color: '#34d399', border: 'rgba(16,185,129,0.2)' },
              { label: 'Risk Level', value: result.riskAnalysis.level, color: result.riskAnalysis.level === 'Low' ? '#34d399' : result.riskAnalysis.level === 'Medium' ? '#fbbf24' : '#f87171', border: 'rgba(255,255,255,0.08)' },
              { label: 'AI Confidence', value: `${Math.round(result.insurance.ai_confidence * 100)}%`, color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
            ].map(({ label, value, color, border }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}` }}
              >
                <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                <div className="text-sm font-bold" style={{ color }}>{value}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-2.5 text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            ${result.transaction.amount.toFixed(2)} at {result.transaction.location}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ClaimResultCard({ claimStatus, claimAmount, reason }: { claimStatus: string; claimAmount: number; reason: string }) {
  const configs: Record<string, { title: string; subtitle: string; accentColor: string; accentRgb: string; icon: React.FC<{ className?: string }> }> = {
    approved: { icon: TrendingUp, title: 'Claim Approved', subtitle: `$${claimAmount.toFixed(2)} Credited`, accentColor: '#34d399', accentRgb: '16,185,129' },
    under_review: { icon: Clock, title: 'Under Review', subtitle: 'Verifying incident', accentColor: '#fbbf24', accentRgb: '245,158,11' },
    pending_admin_review: { icon: ShieldCheck, title: 'Admin Approval Required', subtitle: `$${claimAmount.toFixed(2)} pending admin`, accentColor: '#fb923c', accentRgb: '249,115,22' },
    flagged: { icon: AlertCircle, title: 'Fraud Alert', subtitle: 'Claim Flagged', accentColor: '#f87171', accentRgb: '239,68,68' },
  };

  const config = configs[claimStatus] ?? { icon: Clock, title: 'Processing', subtitle: 'Please wait', accentColor: '#94a3b8', accentRgb: '148,163,184' };
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 rounded-2xl relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${config.accentRgb},0.1) 0%, rgba(${config.accentRgb},0.03) 100%)`,
        border: `1px solid rgba(${config.accentRgb},0.25)`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${config.accentRgb},0.5), transparent)` }} />
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          className="p-2.5 rounded-xl"
          style={{ background: `rgba(${config.accentRgb},0.12)`, border: `1px solid rgba(${config.accentRgb},0.25)` }}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Icon className="w-5 h-5" style={{ color: config.accentColor }} />
        </motion.div>
        <div>
          <div className="font-bold text-base" style={{ color: config.accentColor }}>{config.title}</div>
          <div className="text-sm text-slate-400">{config.subtitle}</div>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{reason}</p>
      {claimStatus === 'approved' && (
        <motion.div
          className="mt-3 flex items-center gap-2 p-2.5 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TrendingUp className="w-4 h-4" style={{ color: '#34d399' }} />
          <span className="text-xs font-medium" style={{ color: '#34d399' }}>Settlement processing complete</span>
        </motion.div>
      )}
      {claimStatus === 'pending_admin_review' && (
        <motion.div
          className="mt-3 flex items-center gap-2 p-2.5 rounded-xl"
          style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkles className="w-4 h-4" style={{ color: '#fb923c' }} />
          <span className="text-xs font-medium" style={{ color: '#fdba74' }}>Sent to Admin Panel for review — check Admin section</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export function Simulation() {
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [loadingType, setLoadingType] = useState<TransactionType | null>(null);
  const [isIncidentLoading, setIsIncidentLoading] = useState(false);
  const [lastClaimResult, setLastClaimResult] = useState<{ status: string; amount: number; reason: string } | null>(null);
  const { runTransaction, simulateIncident } = useSimulation();
  const { profile, transactions, insurances } = useAppStore();

  const handleTransaction = async (type: TransactionType) => {
    setLoadingType(type);
    setLastResult(null);
    setLastClaimResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const result = await runTransaction(type);
    if (result) setLastResult(result);
    setLoadingType(null);
  };

  const handleIncident = async () => {
    setIsIncidentLoading(true);
    setLastClaimResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    const claim = await simulateIncident();
    if (claim) {
      setLastClaimResult({ status: claim.status, amount: claim.amount, reason: claim.ai_reason ?? '' });
    }
    setIsIncidentLoading(false);
  };

  const recentTxs = [...transactions].slice(0, 4);

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="lg:col-span-3 space-y-5">
        <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300" style={PANEL}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
              <Zap className="w-4 h-4" style={{ color: '#22d3ee' }} />
            </div>
            <h2 className="text-base font-bold text-white">Action Center</h2>
            <span
              className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#34d399' }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              AI Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {ACTION_BUTTONS.map((btn) => {
              const Icon = btn.icon;
              const isLoading = loadingType === btn.type;
              return (
                <motion.button
                  key={btn.type}
                  onClick={() => handleTransaction(btn.type)}
                  disabled={loadingType !== null}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative p-5 rounded-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                  style={{
                    background: `linear-gradient(145deg, rgba(${btn.accentRgb},0.12) 0%, rgba(${btn.accentRgb},0.04) 100%)`,
                    border: `1px solid rgba(${btn.accentRgb},0.25)`,
                    boxShadow: `0 4px 20px rgba(${btn.accentRgb},0.1)`,
                  }}
                >
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  )}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, rgba(${btn.accentRgb},0.5), transparent)` }} />
                  <div className="flex flex-col items-center gap-3">
                    {isLoading ? (
                      <motion.div
                        className="w-10 h-10 rounded-xl border-2 border-dashed"
                        style={{ borderColor: btn.accentColor }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: `rgba(${btn.accentRgb},0.12)`, border: `1px solid rgba(${btn.accentRgb},0.25)` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: btn.accentColor }} />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white">{btn.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{isLoading ? 'Analyzing risk...' : btn.description}</div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {lastResult && <InsuranceActivatedCard key={lastResult.transaction.id} result={lastResult} />}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300" style={PANEL}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#fbbf24' }} />
            </div>
            <h2 className="text-base font-bold text-white">Incident Simulator</h2>
          </div>

          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Simulate an incident on your most recent insurance policy. The AI evaluates your claim based on trust score, claim history, fraud indicators, and claim value thresholds.
          </p>

          {insurances.length > 0 && (
            <div
              className="mb-4 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
                Active policy: <span className="font-medium" style={{ color: '#67e8f9' }}>{insurances[0]?.type}</span>
                <span className="ml-auto text-slate-600">Coverage: <span className="text-white">${insurances[0]?.coverage.toFixed(0)}</span></span>
              </div>
            </div>
          )}

          <motion.button
            onClick={handleIncident}
            disabled={isIncidentLoading || insurances.length === 0}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: isIncidentLoading ? 'rgba(245,158,11,0.08)' : 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.06))',
              border: '1px solid rgba(245,158,11,0.35)',
              color: '#fcd34d',
              boxShadow: '0 0 20px rgba(245,158,11,0.1), inset 0 1px 0 rgba(245,158,11,0.12)',
            }}
          >
            {isIncidentLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-t-amber-400 rounded-full"
                  style={{ borderColor: 'rgba(251,191,36,0.4)', borderTopColor: '#fbbf24' }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                />
                AI Evaluating Claim...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Simulate Incident
              </>
            )}
          </motion.button>

          {insurances.length === 0 && (
            <p className="text-xs text-slate-600 text-center mt-2">Create a transaction first to simulate an incident</p>
          )}

          <AnimatePresence mode="wait">
            {lastClaimResult && (
              <div className="mt-4">
                <ClaimResultCard
                  key={lastClaimResult.status + lastClaimResult.amount}
                  claimStatus={lastClaimResult.status}
                  claimAmount={lastClaimResult.amount}
                  reason={lastClaimResult.reason}
                />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300" style={PANEL}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <Activity className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
            </div>
            Live Risk Monitor
          </h3>
          <div className="flex justify-center mb-4">
            {lastResult ? (
              <RiskGauge score={lastResult.riskAnalysis.score} level={lastResult.riskAnalysis.level} size={160} />
            ) : (
              <div className="text-center py-8 text-slate-600">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Activity className="w-6 h-6 opacity-30" />
                </div>
                <p className="text-sm">No active analysis</p>
                <p className="text-xs mt-1">Trigger an action to see live risk</p>
              </div>
            )}
          </div>
          {lastResult && (
            <div className="space-y-1.5">
              {lastResult.riskAnalysis.factors.map((factor) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span className="text-xs text-slate-400">{factor.name}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-lg"
                    style={
                      factor.impact === 'positive'
                        ? { color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }
                        : factor.impact === 'negative'
                        ? { color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }
                        : { color: '#94a3b8', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)' }
                    }
                  >
                    {factor.impact}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="p-5 rounded-2xl relative overflow-hidden transition-all duration-300" style={PANEL}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
            </div>
            Trust Score
          </h3>
          <div className="flex justify-center">
            <TrustScore score={profile?.trust_score ?? 85} size={100} showLabel />
          </div>
          <p className="text-xs text-slate-600 text-center mt-2">Updated after each claim decision</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="p-5 rounded-2xl relative overflow-hidden transition-all duration-300" style={PANEL}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
            </div>
            Activity Log
          </h3>
          {recentTxs.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">No activity yet</p>
          ) : (
            <div className="space-y-1.5">
              {recentTxs.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 py-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 truncate capitalize">{tx.type} — {tx.location}</div>
                    <div className="text-xs text-slate-600">${tx.amount.toFixed(2)}</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
