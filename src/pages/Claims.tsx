import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle, Clock, AlertTriangle, XCircle,
  DollarSign, Filter, ChevronDown
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { ClaimStatus } from '../types';

const STATUS_CONFIG: Record<ClaimStatus, { label: string; color: string; bg: string; icon: React.FC<{ className?: string }> }> = {
  approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle },
  under_review: { label: 'Under Review', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: Clock },
  flagged: { label: 'Flagged', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertTriangle },
  rejected: { label: 'Rejected', color: 'text-slate-400', bg: 'bg-slate-700/20 border-slate-700/50', icon: XCircle },
  pending: { label: 'Pending', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Clock },
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

  const getInsurance = (insuranceId: string) => insurances.find((i) => i.id === insuranceId);
  const getTransaction = (insuranceId: string) => {
    const ins = getInsurance(insuranceId);
    return ins ? transactions.find((t) => t.id === ins.transaction_id) : undefined;
  };

  const FILTER_TABS: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'approved', label: 'Approved' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'pending', label: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Claims', value: claims.length, icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
          { label: 'Settled Amount', value: `$${totalAmount.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Under Review', value: pendingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Flagged', value: flaggedCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-2xl border ${stat.bg} backdrop-blur-xl`}
            >
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Claims History</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <div className="flex gap-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === tab.value
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <FileText className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">No claims found</p>
            <p className="text-xs mt-1">
              {filter === 'all' ? 'Simulate an incident from the Simulation page' : `No ${filter} claims yet`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${config.bg}`}
                  >
                    <button
                      className="w-full p-4 flex items-center gap-4 text-left"
                      onClick={() => setExpanded(isExpanded ? null : claim.id)}
                    >
                      <div className={`p-2 rounded-xl bg-white/5 ${config.color}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{claim.incident_type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {insurance?.type ?? 'Insurance'} • {new Date(claim.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-base font-bold ${config.color}`}>${claim.amount.toFixed(2)}</div>
                        <div className="text-xs text-slate-600">Fraud: {claim.fraud_score}/100</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-white/5 pt-3">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="p-3 rounded-xl bg-white/[0.03]">
                                <div className="text-xs text-slate-500 mb-1">AI Decision</div>
                                <div className={`text-sm font-semibold ${config.color}`}>{config.label}</div>
                              </div>
                              <div className="p-3 rounded-xl bg-white/[0.03]">
                                <div className="text-xs text-slate-500 mb-1">Coverage Limit</div>
                                <div className="text-sm font-semibold text-white">${insurance?.coverage?.toFixed(2) ?? 'N/A'}</div>
                              </div>
                              {tx && (
                                <>
                                  <div className="p-3 rounded-xl bg-white/[0.03]">
                                    <div className="text-xs text-slate-500 mb-1">Transaction Type</div>
                                    <div className="text-sm font-semibold text-white capitalize">{tx.type}</div>
                                  </div>
                                  <div className="p-3 rounded-xl bg-white/[0.03]">
                                    <div className="text-xs text-slate-500 mb-1">Location</div>
                                    <div className="text-sm font-semibold text-white">{tx.location}</div>
                                  </div>
                                </>
                              )}
                            </div>
                            {claim.ai_reason && (
                              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
                                  AI Reasoning
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{claim.ai_reason}</p>
                              </div>
                            )}
                            {claim.status === 'approved' && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2"
                              >
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-emerald-400 font-medium">
                                  ${claim.amount.toFixed(2)} settled — {claim.settled_at ? new Date(claim.settled_at).toLocaleString() : 'Processed'}
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
      </motion.div>
    </div>
  );
}
