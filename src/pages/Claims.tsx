import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle, Clock, AlertTriangle, XCircle,
  DollarSign, Filter, ChevronDown, ShieldCheck, Sparkles
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { ClaimStatus } from '../types';

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

const STATUS_CONFIG: Record<ClaimStatus, {
  label: string;
  accentColor: string;
  accentRgb: string;
  icon: React.FC<{ className?: string }>;
}> = {
  approved: { label: 'Approved', accentColor: '#34d399', accentRgb: '16,185,129', icon: CheckCircle },
  under_review: { label: 'Under Review', accentColor: '#fbbf24', accentRgb: '245,158,11', icon: Clock },
  flagged: { label: 'Fraud Flagged', accentColor: '#f87171', accentRgb: '239,68,68', icon: AlertTriangle },
  rejected: { label: 'Rejected', accentColor: '#94a3b8', accentRgb: '148,163,184', icon: XCircle },
  pending: { label: 'Pending', accentColor: '#60a5fa', accentRgb: '59,130,246', icon: Clock },
  pending_admin_review: { label: 'Admin Review', accentColor: '#fb923c', accentRgb: '249,115,22', icon: ShieldCheck },
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
    { label: 'Total Claims', value: claims.length, icon: FileText, accentColor: '#22d3ee', accentRgb: '6,182,212' },
    { label: 'Settled Amount', value: `$${totalAmount.toFixed(2)}`, icon: DollarSign, accentColor: '#34d399', accentRgb: '16,185,129' },
    { label: 'Under Review', value: pendingCount, icon: Clock, accentColor: '#fbbf24', accentRgb: '245,158,11' },
    { label: 'Fraud Flagged', value: flaggedCount, icon: AlertTriangle, accentColor: '#f87171', accentRgb: '239,68,68' },
  ];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-5 rounded-2xl relative overflow-hidden cursor-default transition-all duration-200"
              style={{
                background: `linear-gradient(145deg, rgba(${stat.accentRgb},0.1) 0%, rgba(${stat.accentRgb},0.03) 100%)`,
                border: `1px solid rgba(${stat.accentRgb},0.2)`,
                boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02) inset`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${stat.accentRgb},0.4), transparent)` }} />
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl" style={{ background: `rgba(${stat.accentRgb},0.12)`, border: `1px solid rgba(${stat.accentRgb},0.2)` }}>
                  <Icon className="w-4 h-4" style={{ color: stat.accentColor }} />
                </div>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: stat.accentColor }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                />
              </div>
              <div className="text-2xl font-bold tracking-tight" style={{ color: stat.accentColor }}>{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl relative overflow-hidden"
        style={PANEL}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
        <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
                <FileText className="w-4 h-4" style={{ color: '#22d3ee' }} />
              </div>
              <h2 className="text-base font-bold text-white">Claims History</h2>
              {claims.length > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee' }}
                >
                  {claims.length} total
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <div className="flex gap-1 flex-wrap">
                {FILTER_TABS.map((tab) => (
                  <motion.button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                    style={
                      filter === tab.value
                        ? { background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 12px rgba(139,92,246,0.1)' }
                        : { background: 'transparent', color: '#64748b', border: '1px solid transparent' }
                    }
                  >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className="px-1 rounded-full text-[10px] font-bold"
                        style={
                          filter === tab.value
                            ? { background: 'rgba(139,92,246,0.2)', color: '#c4b5fd' }
                            : { background: 'rgba(255,255,255,0.06)', color: '#64748b' }
                        }
                      >
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
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.14)' }}
              >
                <FileText className="w-8 h-8 opacity-30" style={{ color: '#a78bfa' }} />
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
                      transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, rgba(${config.accentRgb},0.04) 0%, rgba(255,255,255,0.015) 100%)`,
                        border: `1px solid rgba(${config.accentRgb},0.18)`,
                        boxShadow: `0 2px 12px rgba(0,0,0,0.3)`,
                      }}
                    >
                      <motion.button
                        className="w-full p-4 flex items-center gap-3 text-left transition-colors"
                        onClick={() => setExpanded(isExpanded ? null : claim.id)}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      >
                        <div
                          className="p-2.5 rounded-xl flex-shrink-0"
                          style={{ background: `rgba(${config.accentRgb},0.1)`, border: `1px solid rgba(${config.accentRgb},0.2)` }}
                        >
                          <StatusIcon className="w-4 h-4" style={{ color: config.accentColor }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">{claim.incident_type}</span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: `rgba(${config.accentRgb},0.1)`, border: `1px solid rgba(${config.accentRgb},0.2)`, color: config.accentColor }}
                            >
                              {config.label}
                            </span>
                            {claim.status === 'pending_admin_review' && (
                              <motion.span
                                className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}
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
                          <div className="text-base font-bold" style={{ color: config.accentColor }}>${claim.amount.toFixed(2)}</div>
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: claim.fraud_score > 60 ? '#f87171' : claim.fraud_score > 35 ? '#fbbf24' : '#475569' }}
                          >
                            Fraud: {claim.fraud_score}/100
                          </div>
                        </div>

                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
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
                            <div
                              className="px-4 pb-4 pt-3"
                              style={{ borderTop: `1px solid rgba(${config.accentRgb},0.12)` }}
                            >
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {[
                                  { label: 'AI Decision', value: config.label, color: config.accentColor },
                                  { label: 'Coverage Limit', value: `$${insurance?.coverage?.toFixed(2) ?? 'N/A'}`, color: '#e2e8f0' },
                                  ...(tx ? [
                                    { label: 'Transaction Type', value: tx.type.charAt(0).toUpperCase() + tx.type.slice(1), color: '#e2e8f0' },
                                    { label: 'Location', value: tx.location, color: '#cbd5e1' },
                                  ] : []),
                                  { label: 'Fraud Score', value: `${claim.fraud_score}/100`, color: claim.fraud_score > 60 ? '#f87171' : claim.fraud_score > 35 ? '#fbbf24' : '#34d399' },
                                ].map((item) => (
                                  <div
                                    key={item.label}
                                    className="p-2.5 rounded-xl"
                                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
                                  >
                                    <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                                    <div className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</div>
                                  </div>
                                ))}
                              </div>

                              {claim.ai_reason && (
                                <div
                                  className="p-3 rounded-xl mb-3"
                                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                  <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" style={{ color: '#22d3ee' }} />
                                    AI Reasoning
                                  </div>
                                  <p className="text-xs text-slate-300 leading-relaxed">{claim.ai_reason}</p>
                                </div>
                              )}

                              {claim.status === 'approved' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 rounded-xl flex items-center gap-2"
                                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                                >
                                  <DollarSign className="w-4 h-4 flex-shrink-0" style={{ color: '#34d399' }} />
                                  <span className="text-xs font-medium" style={{ color: '#34d399' }}>
                                    ${claim.amount.toFixed(2)} settled — {claim.settled_at ? new Date(claim.settled_at).toLocaleString() : 'Processed'}
                                  </span>
                                </motion.div>
                              )}

                              {claim.status === 'pending_admin_review' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 rounded-xl flex items-center gap-2"
                                  style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}
                                >
                                  <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#fb923c' }} />
                                  <span className="text-xs font-medium" style={{ color: '#fdba74' }}>
                                    Awaiting admin approval in the Admin Panel. High-value claim requires manual authorization.
                                  </span>
                                </motion.div>
                              )}

                              {claim.status === 'flagged' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 rounded-xl flex items-center gap-2"
                                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                                >
                                  <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#f87171' }} />
                                  <span className="text-xs font-medium" style={{ color: '#fca5a5' }}>
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
    </motion.div>
  );
}
