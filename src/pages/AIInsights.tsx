import { motion } from 'framer-motion';
import { Brain, CheckCircle, AlertTriangle, Clock, TrendingUp, Minus, Shield } from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { AIFactor } from '../types';

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

const STAT_CONFIGS = [
  { label: 'AI Decisions Made', accentColor: '#22d3ee', accentRgb: '6,182,212' },
  { label: 'Avg Confidence', accentColor: '#a78bfa', accentRgb: '139,92,246' },
  { label: 'Approval Rate', accentColor: '#34d399', accentRgb: '16,185,129' },
  { label: 'Fraud Caught', accentColor: '#f87171', accentRgb: '239,68,68' },
];

function FactorBadge({ factor }: { factor: AIFactor }) {
  const cfg = {
    positive: {
      color: '#34d399', rgb: '16,185,129', barColor: '#10b981',
      icon: <CheckCircle className="w-3 h-3" />,
    },
    negative: {
      color: '#f87171', rgb: '239,68,68', barColor: '#ef4444',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    neutral: {
      color: '#94a3b8', rgb: '148,163,184', barColor: '#64748b',
      icon: <Minus className="w-3 h-3" />,
    },
  }[factor.impact];

  return (
    <div
      className="p-3 rounded-xl"
      style={{
        background: `rgba(${cfg.rgb},0.06)`,
        border: `1px solid rgba(${cfg.rgb},0.18)`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white">{factor.name}</span>
        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: cfg.color }}>
          {cfg.icon}
          {factor.impact}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: cfg.barColor, boxShadow: `0 0 6px rgba(${cfg.rgb},0.4)` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(factor.weight * 100)}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="text-xs mt-1" style={{ color: cfg.color }}>Weight: {Math.round(factor.weight * 100)}%</div>
    </div>
  );
}

function DecisionLog({ log, index }: { log: ReturnType<typeof useAppStore.getState>['aiLogs'][0]; index: number }) {
  const isInsurance = log.entity_type === 'insurance';
  const isApproved = log.decision === 'APPROVED';
  const isFlagged = log.decision === 'FLAGGED';

  const cfg = isInsurance
    ? { rgb: '6,182,212', color: '#22d3ee', icon: <Shield className="w-4 h-4" style={{ color: '#22d3ee' }} />, label: 'INSURED' }
    : isApproved
    ? { rgb: '16,185,129', color: '#34d399', icon: <CheckCircle className="w-4 h-4" style={{ color: '#34d399' }} />, label: log.decision }
    : isFlagged
    ? { rgb: '239,68,68', color: '#f87171', icon: <AlertTriangle className="w-4 h-4" style={{ color: '#f87171' }} />, label: log.decision }
    : { rgb: '245,158,11', color: '#fbbf24', icon: <Clock className="w-4 h-4" style={{ color: '#fbbf24' }} />, label: log.decision };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="p-5 rounded-2xl relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${cfg.rgb},0.06) 0%, rgba(255,255,255,0.015) 100%)`,
        border: `1px solid rgba(${cfg.rgb},0.18)`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.35)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${cfg.rgb},0.4), transparent)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ background: `rgba(${cfg.rgb},0.1)`, border: `1px solid rgba(${cfg.rgb},0.2)` }}
          >
            {cfg.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
              <span
                className="text-xs capitalize px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
              >
                {log.entity_type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {new Date(log.created_at).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold" style={{ color: cfg.color }}>{Math.round(log.confidence * 100)}%</div>
          <div className="text-xs text-slate-600">confidence</div>
        </div>
      </div>

      <p
        className="text-xs text-slate-300 leading-relaxed mb-3 p-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {log.reasoning}
      </p>

      {log.factors && log.factors.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            Decision Factors
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(log.factors as AIFactor[]).map((factor) => (
              <FactorBadge key={factor.name} factor={factor} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function AIInsights() {
  const { aiLogs, claims, insurances, transactions } = useAppStore();

  const approvedRate = claims.length > 0
    ? Math.round((claims.filter((c) => c.status === 'approved').length / claims.length) * 100)
    : 0;
  const avgConfidence = aiLogs.length > 0
    ? Math.round((aiLogs.reduce((s, l) => s + l.confidence, 0) / aiLogs.length) * 100)
    : 0;
  const fraudCaught = claims.filter((c) => c.status === 'flagged').length;

  const statValues = [aiLogs.length, `${avgConfidence}%`, `${approvedRate}%`, fraudCaught];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CONFIGS.map((cfg, i) => (
          <motion.div
            key={cfg.label}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl relative overflow-hidden cursor-default transition-all duration-200"
            style={{
              background: `linear-gradient(145deg, rgba(${cfg.accentRgb},0.1) 0%, rgba(${cfg.accentRgb},0.03) 100%)`,
              border: `1px solid rgba(${cfg.accentRgb},0.2)`,
              boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02) inset`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${cfg.accentRgb},0.4), transparent)` }} />
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2 rounded-xl"
                style={{ background: `rgba(${cfg.accentRgb},0.12)`, border: `1px solid rgba(${cfg.accentRgb},0.2)` }}
              >
                <Brain className="w-4 h-4" style={{ color: cfg.accentColor }} />
              </div>
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cfg.accentColor }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
              />
            </div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: cfg.accentColor }}>{statValues[i]}</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">{cfg.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={PANEL}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }} />
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <Brain className="w-4 h-4" style={{ color: '#22d3ee' }} />
            </div>
            AI Model Stats
          </h3>
          <div className="space-y-2.5">
            {[
              { label: 'Model Version', value: 'EmbedAI v3.2', color: '#22d3ee' },
              { label: 'Policies Analyzed', value: insurances.length.toString(), color: '#e2e8f0' },
              { label: 'Claims Evaluated', value: claims.length.toString(), color: '#e2e8f0' },
              { label: 'Transactions Processed', value: transactions.length.toString(), color: '#e2e8f0' },
              { label: 'Fraud Detection Rate', value: '99.1%', color: '#34d399' },
              { label: 'False Positive Rate', value: '0.3%', color: '#34d399' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-xs font-semibold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={PANEL}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)' }} />
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#34d399' }} />
            </div>
            Decision Breakdown
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Insurance Activated', count: aiLogs.filter(l => l.entity_type === 'insurance').length, barColor: '#06b6d4', rgb: '6,182,212', textColor: '#22d3ee' },
              { label: 'Claims Approved', count: claims.filter(c => c.status === 'approved').length, barColor: '#10b981', rgb: '16,185,129', textColor: '#34d399' },
              { label: 'Under Review', count: claims.filter(c => c.status === 'under_review').length, barColor: '#f59e0b', rgb: '245,158,11', textColor: '#fbbf24' },
              { label: 'Flagged/Fraud', count: claims.filter(c => c.status === 'flagged').length, barColor: '#ef4444', rgb: '239,68,68', textColor: '#f87171' },
            ].map((item) => {
              const total = aiLogs.length || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className="text-xs font-bold" style={{ color: item.textColor }}>{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, rgba(${item.rgb},0.7), ${item.barColor})`, boxShadow: `0 0 8px rgba(${item.rgb},0.4)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={PANEL}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Clock className="w-4 h-4" style={{ color: '#fbbf24' }} />
            </div>
            Key Insights
          </h3>
          <div className="space-y-2.5">
            {[
              { text: 'AI activates insurance in under 50ms — zero user effort required', rgb: '6,182,212' },
              { text: 'Trust score dynamically adjusts after every claim event', rgb: '139,92,246' },
              { text: 'Fraud patterns detected across time, frequency, and value dimensions', rgb: '245,158,11' },
              { text: 'Every decision is explainable — full audit trail maintained', rgb: '16,185,129' },
              { text: '60-70% of transactions globally lack any form of insurance coverage', rgb: '239,68,68' },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="p-2.5 rounded-xl text-xs text-slate-300 leading-relaxed"
                style={{ background: `rgba(${insight.rgb},0.04)`, border: `1px solid rgba(${insight.rgb},0.14)` }}
              >
                {insight.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300"
        style={PANEL}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <Brain className="w-5 h-5" style={{ color: '#a78bfa' }} />
            </div>
            AI Decision Log
          </h2>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#c4b5fd' }}
          >
            {aiLogs.length} total decisions
          </span>
        </div>

        {aiLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-slate-600">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.14)' }}
            >
              <Brain className="w-8 h-8 opacity-25" style={{ color: '#a78bfa' }} />
            </div>
            <p className="text-sm font-medium text-slate-500">No AI decisions yet</p>
            <p className="text-xs mt-1">Trigger actions from the Simulation page</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...aiLogs].slice(0, 10).map((log, i) => (
              <DecisionLog key={log.id} log={log} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
