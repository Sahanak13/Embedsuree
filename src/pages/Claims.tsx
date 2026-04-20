import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle, Clock, AlertTriangle, XCircle,
  DollarSign, Filter, ChevronDown, ShieldCheck, Sparkles
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { ClaimStatus } from '../types';

const STATUS_CONFIG: Record<ClaimStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  icon: React.FC<{ className?: string }>;
}> = {
  approved: {
    label: 'Approved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/10',
    icon: CheckCircle,
  },
  under_review: {
    label: 'Under Review',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/10',
    icon: Clock,
  },
  flagged: {
    label: 'Fraud Flagged',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/10',
    icon: AlertTriangle,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-slate-400',
    bg: 'bg-slate-700/20',
    border: 'border-slate-700/50',
    glow: '',
    icon: XCircle,
  },
  pending: {
    label: 'Pending',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/10',
    icon: Clock,
  },
  pending_admin_review: {
    label: 'Admin Review',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/40',
    glow: 'shadow-orange-500/15',
    icon: ShieldCheck,
  },
};

type FilterType = 'all' | ClaimStatus;

export function Claims() {
  const { claims, insurances, transactions } = useAppStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all' ? claims : claims.filter((c) => c.status === filter);

  const totalAmount = claims.filter((c) => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
  const pendingCount = claims.filter((c) => c.status === 'under_review' || c.status === 'pending').length;
  const flaggedCount = claims.filter((c) => c.status === 'flagged').length;
  const adminReviewCount = claims.filter((c) => c.status === 'pending_admin_review').length;

  const getInsurance = (insuranceId: string) => insurances.find((i) => i.id === insuranceId);
  const getTransaction = (insuranceId: string) => {
    const ins = getInsurance(insuranceId);
    return ins ? transactions.find((t) => t.id === ins.transaction_id) : undefined;
  };

  const FILTER_TABS: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: 'All', count: claims.length },
    { value: 'approved', label: 'Approved' },
    { value: 'under_review', label: 'Under Review', count: pendingCount || undefined },
    { value: 'pending_admin_review', label: 'Admin Review', count: adminReviewCount || undefined },
    { value: 'flagged', label: 'Flagged', count: flaggedCount || undefined },
    { value: 'pending', label: 'Pending' },
  ];

  const STAT_CARDS = [
    { label: 'Total Claims', value: claims.length, icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/[0.08]', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/10' },
    { label: 'Settled Amount', value: `$${totalAmount.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
    { label: 'Under Review', value: pendingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/20', glow: 'shadow-amber-500/10' },
    { label: 'Fraud Flagged', value: flaggedCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/[0.08]', border: 'border-red-500/20', glow: 'shadow-red-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`p-4 rounded-2xl border ${stat.bg} ${stat.border} backdrop-blur-xl shadow-lg ${stat.glow} transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bg} border ${stat.border}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-slate-700/40 backdrop-blur-xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
      >
        <div className="p-6 border-b border-slate-700/40">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/25">
                <FileText className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-base font-bold text-white">Claims History</h2>
              {claims.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  {claims.length} total
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex gap-1 flex-wrap">
                {FILTER_TABS.map((tab) => (
                  <motion.button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      filter === tab.value
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`px-1 rounded-full text-[10px] font-bold ${
                        filter === tab.value ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-700/60 text-slate-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-slate-600"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/30 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-30" />
              </div>
              <p className="text-sm font-medium text-slate-500">No claims found</p>
              <p className="text-xs mt-1 text-slate-600">
                {filter === 'all' ? 'Simulate an incident from the Simulation page' : `No ${filter.replace('_', ' ')} claims yet`}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((claim, i) => {
                  const config = STATUS_CONFIG[claim.status];
                  const StatusIcon = config.icon;
                  const insurance = getInsurance(claim.insurance_id);
                  const tx = getTransaction(claim.insurance_id);
                  const isExpanded = expanded === claim.id;

                  return (
                    <motion.div
                      key={claim.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
                      className={`rounded-xl border ${config.border} backdrop-blur-xl overflow-hidden shadow-sm ${config.glow} transition-all duration-200`}
                      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)` }}
                    >
                      <motion.button
                        className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpanded(isExpanded ? null : claim.id)}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      >
                        <motion.div
                          className={`p-2.5 rounded-xl ${config.bg} border ${config.border} flex-shrink-0`}
                          whileHover={{ scale: 1.1 }}
                        >
                          <StatusIcon className={`w-4 h-4 ${config.color}`} />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">{claim.incident_type}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.bg} ${config.border} ${config.color}`}>
                              {config.label}
                            </span>
                            {claim.status === 'pending_admin_review' && (
                              <motion.span
                                className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-medium flex items-center gap-1"
                                animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                Awaiting Admin
                              </motion.span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {insurance?.type ?? 'Insurance'} • {new Date(claim.created_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className={`text-base font-bold ${config.color}`}>${claim.amount.toFixed(2)}</div>
                          <div className={`text-xs mt-0.5 ${
                            claim.fraud_score > 60 ? 'text-red-500' :
                            claim.fraud_score > 35 ? 'text-amber-500' : 'text-slate-600'
                          }`}>Fraud: {claim.fraud_score}/100</div>
                        </div>

                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className={`px-4 pb-4 border-t ${config.border} border-opacity-50 pt-3`}>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {[
                                  { label: 'AI Decision', value: config.label, color: config.color },
                                  { label: 'Coverage Limit', value: `$${insurance?.coverage?.toFixed(2) ?? 'N/A'}`, color: 'text-white' },
                                  ...(tx ? [
                                    { label: 'Transaction Type', value: tx.type.charAt(0).toUpperCase() + tx.type.slice(1), color: 'text-white' },
                                    { label: 'Location', value: tx.location, color: 'text-slate-300' },
                                  ] : []),
                                  { label: 'Fraud Score', value: `${claim.fraud_score}/100`, color: claim.fraud_score > 60 ? 'text-red-400' : claim.fraud_score > 35 ? 'text-amber-400' : 'text-emerald-400' },
                                ].map((item) => (
                                  <div key={item.label} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                                    <div className={`text-sm font-semibold ${item.color}`}>{item.value}</div>
                                  </div>
                                ))}
                              </div>

                              {claim.ai_reason && (
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-3">
                                  <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-cyan-400" />
                                    AI Reasoning
                                  </div>
                                  <p className="text-xs text-slate-300 leading-relaxed">{claim.ai_reason}</p>
                                </div>
                              )}

                              {claim.status === 'approved' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 shadow-sm shadow-emerald-500/10"
                                >
                                  <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  <span className="text-xs text-emerald-400 font-medium">
                                    ${claim.amount.toFixed(2)} settled — {claim.settled_at ? new Date(claim.settled_at).toLocaleString() : 'Processed'}
                                  </span>
                                </motion.div>
                              )}

                              {claim.status === 'pending_admin_review' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-2 shadow-sm shadow-orange-500/10"
                                >
                                  <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                  <span className="text-xs text-orange-300 font-medium">
                                    Awaiting admin approval in the Admin Panel. High-value claim requires manual authorization.
                                  </span>
                                </motion.div>
                              )}

                              {claim.status === 'flagged' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-2 shadow-sm shadow-red-500/10"
                                >
                                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                  <span className="text-xs text-red-300 font-medium">
                                    Fraud detected — This claim has been blocked and reported. Check Admin Panel for details.
                                  </span>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
