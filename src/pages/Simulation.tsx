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

const ACTION_BUTTONS = [
  {
    type: 'product' as TransactionType,
    label: 'Buy Product',
    icon: ShoppingBag,
    description: 'Trigger purchase protection',
    gradient: 'from-cyan-500/20 via-cyan-600/10 to-transparent',
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-400/60',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15',
    glow: 'shadow-cyan-500/15',
    hoverGlow: 'hover:shadow-cyan-500/25',
    badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
  },
  {
    type: 'cab' as TransactionType,
    label: 'Book Cab',
    icon: Car,
    description: 'Trigger ride insurance',
    gradient: 'from-blue-500/20 via-blue-600/10 to-transparent',
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-400/60',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
    glow: 'shadow-blue-500/15',
    hoverGlow: 'hover:shadow-blue-500/25',
    badgeColor: 'text-blue-300 bg-blue-500/10 border-blue-500/25',
  },
  {
    type: 'travel' as TransactionType,
    label: 'Start Travel',
    icon: Plane,
    description: 'Trigger travel insurance',
    gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
    border: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-400/60',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    glow: 'shadow-emerald-500/15',
    hoverGlow: 'hover:shadow-emerald-500/25',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
  },
];

function InsuranceActivatedCard({ result }: { result: LastResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="p-5 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-lg shadow-cyan-500/10"
      style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 100%)' }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/15"
        >
          <Shield className="w-6 h-6 text-cyan-400" />
        </motion.div>
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-cyan-300">Insurance Activated</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
            <h4 className="text-white font-semibold text-lg">{result.insurance.type}</h4>
          </motion.div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { label: 'Premium', value: `$${result.insurance.premium}`, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
              { label: 'Coverage', value: `$${result.insurance.coverage}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Risk Level', value: result.riskAnalysis.level, color: result.riskAnalysis.level === 'Low' ? 'text-emerald-400' : result.riskAnalysis.level === 'Medium' ? 'text-amber-400' : 'text-red-400', bg: 'bg-white/[0.04] border-white/[0.08]' },
              { label: 'AI Confidence', value: `${Math.round(result.insurance.ai_confidence * 100)}%`, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            ].map(({ label, value, color, bg }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2.5 rounded-xl border ${bg}`}
              >
                <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                <div className={`text-sm font-bold ${color}`}>{value}</div>
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
  const configs: Record<string, { title: string; subtitle: string; color: string; textColor: string; icon: React.FC<{ className?: string }> }> = {
    approved: {
      icon: TrendingUp,
      title: 'Claim Approved',
      subtitle: `$${claimAmount.toFixed(2)} Credited`,
      color: 'border-emerald-500/30 from-emerald-500/12 to-emerald-600/4',
      textColor: 'text-emerald-400',
    },
    under_review: {
      icon: Clock,
      title: 'Under Review',
      subtitle: 'Verifying incident',
      color: 'border-amber-500/30 from-amber-500/12 to-amber-600/4',
      textColor: 'text-amber-400',
    },
    pending_admin_review: {
      icon: ShieldCheck,
      title: 'Admin Approval Required',
      subtitle: `$${claimAmount.toFixed(2)} pending admin`,
      color: 'border-orange-500/30 from-orange-500/12 to-orange-600/4',
      textColor: 'text-orange-400',
    },
    flagged: {
      icon: AlertCircle,
      title: 'Fraud Alert',
      subtitle: 'Claim Flagged',
      color: 'border-red-500/30 from-red-500/12 to-red-600/4',
      textColor: 'text-red-400',
    },
  };

  const config = configs[claimStatus] ?? {
    icon: Clock,
    title: 'Processing',
    subtitle: 'Please wait',
    color: 'border-slate-700/50 from-slate-800/50 to-slate-900/50',
    textColor: 'text-slate-400',
  };
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className={`p-5 rounded-2xl border bg-gradient-to-br ${config.color} backdrop-blur-xl`}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          className={`p-2.5 rounded-xl ${config.color.split(' ')[1]} border ${config.color.split(' ')[0]}`}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Icon className={`w-5 h-5 ${config.textColor}`} />
        </motion.div>
        <div>
          <div className={`font-bold text-base ${config.textColor}`}>{config.title}</div>
          <div className="text-sm text-slate-400">{config.subtitle}</div>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{reason}</p>
      {claimStatus === 'approved' && (
        <motion.div
          className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Settlement processing complete</span>
        </motion.div>
      )}
      {claimStatus === 'pending_admin_review' && (
        <motion.div
          className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-orange-300 font-medium">Sent to Admin Panel for review — check Admin section</span>
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/25">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-base font-bold text-white">Action Center</h2>
            <span className="ml-auto px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
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
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative p-5 rounded-2xl border bg-gradient-to-br ${btn.gradient} ${btn.border} ${btn.hoverBorder} shadow-xl ${btn.glow} ${btn.hoverGlow} transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group`}
                >
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-white/[0.04]"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  )}
                  <div className="flex flex-col items-center gap-3">
                    {isLoading ? (
                      <motion.div
                        className={`w-10 h-10 rounded-xl border-2 border-dashed ${btn.iconColor}`}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                      />
                    ) : (
                      <motion.div
                        className={`w-10 h-10 rounded-xl ${btn.iconBg} border ${btn.border} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        whileHover={{ boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
                      >
                        <Icon className={`w-5 h-5 ${btn.iconColor}`} />
                      </motion.div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white">{btn.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{isLoading ? 'Analyzing risk...' : btn.description}</div>
                    </div>
                  </div>
                  <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent ${btn.iconColor.replace('text-', 'via-')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {lastResult && (
              <InsuranceActivatedCard key={lastResult.transaction.id} result={lastResult} />
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white">Incident Simulator</h2>
          </div>

          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Simulate an incident on your most recent insurance policy. The AI evaluates your claim based on trust score, claim history, fraud indicators, and claim value thresholds.
          </p>

          {insurances.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Active policy: <span className="text-cyan-300 font-medium">{insurances[0]?.type}</span>
                <span className="ml-auto text-slate-600">Coverage: <span className="text-white">${insurances[0]?.coverage.toFixed(0)}</span></span>
              </div>
            </div>
          )}

          <motion.button
            onClick={handleIncident}
            disabled={isIncidentLoading || insurances.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            style={{
              background: isIncidentLoading ? 'rgba(245,158,11,0.1)' : 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08))',
              border: '1px solid rgba(245,158,11,0.35)',
              color: '#fcd34d',
              boxShadow: '0 0 20px rgba(245,158,11,0.12), inset 0 1px 0 rgba(245,158,11,0.15)',
            }}
          >
            {isIncidentLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-amber-400/60 border-t-amber-400 rounded-full"
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            Live Risk Monitor
          </h3>
          <div className="flex justify-center mb-4">
            {lastResult ? (
              <RiskGauge score={lastResult.riskAnalysis.score} level={lastResult.riskAnalysis.level} size={160} />
            ) : (
              <div className="text-center py-8 text-slate-600">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/30 flex items-center justify-center mx-auto mb-3">
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
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                >
                  <span className="text-xs text-slate-400">{factor.name}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                    factor.impact === 'positive' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                    factor.impact === 'negative' ? 'text-red-400 bg-red-500/10 border border-red-500/20' :
                    'text-slate-400 bg-slate-700/30 border border-slate-700/40'
                  }`}>
                    {factor.impact}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            Trust Score
          </h3>
          <div className="flex justify-center">
            <TrustScore score={profile?.trust_score ?? 85} size={100} showLabel />
          </div>
          <p className="text-xs text-slate-600 text-center mt-2">
            Updated after each claim decision
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
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
                  className="flex items-center gap-2 py-2 border-b border-slate-800/50 last:border-0"
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
    </div>
  );
}
