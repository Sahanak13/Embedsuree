import { motion } from 'framer-motion';
import { Brain, CheckCircle, AlertTriangle, Clock, TrendingUp, Minus } from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { AIFactor } from '../types';

const CARD_STYLE = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  border: '1px solid rgba(139,92,246,0.15)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
};

function FactorBadge({ factor }: { factor: AIFactor }) {
  const config = {
    positive: {
      color: 'text-emerald-400',
      style: { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' },
      barColor: '#10b981',
      icon: <CheckCircle className="w-3 h-3" />,
    },
    negative: {
      color: 'text-red-400',
      style: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' },
      barColor: '#ef4444',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    neutral: {
      color: 'text-slate-400',
      style: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' },
      barColor: '#64748b',
      icon: <Minus className="w-3 h-3" />,
    },
  }[factor.impact];

  return (
    <div className="p-3 rounded-xl" style={config.style}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white">{factor.name}</span>
        <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
          {config.icon}
          {factor.impact}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: config.barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(factor.weight * 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className={`text-xs mt-1 ${config.color}`}>Weight: {Math.round(factor.weight * 100)}%</div>
    </div>
  );
}

function DecisionLog({ log, index }: { log: ReturnType<typeof useAppStore.getState>['aiLogs'][0]; index: number }) {
  const isInsurance = log.entity_type === 'insurance';
  const isApproved = log.decision === 'APPROVED';
  const isFlagged = log.decision === 'FLAGGED';

  const config = isInsurance
    ? {
        style: { background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' },
        color: 'text-cyan-400',
        icon: '🛡',
      }
    : isApproved
    ? {
        style: { background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' },
        color: 'text-emerald-400',
        icon: '✅',
      }
    : isFlagged
    ? {
        style: { background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' },
        color: 'text-red-400',
        icon: '🚩',
      }
    : {
        style: { background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' },
        color: 'text-amber-400',
        icon: '⏳',
      };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-2xl"
      style={config.style}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${config.color}`}>{log.decision}</span>
              <span className="text-xs text-slate-500 capitalize px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {log.entity_type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {new Date(log.created_at).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${config.color}`}>{Math.round(log.confidence * 100)}%</div>
          <div className="text-xs text-slate-600">confidence</div>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
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

  const statCards = [
    {
      label: 'AI Decisions Made',
      value: aiLogs.length,
      style: { background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 100%)', border: '1px solid rgba(6,182,212,0.2)' },
      color: '#22d3ee',
    },
    {
      label: 'Avg Confidence',
      value: `${avgConfidence}%`,
      style: { background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.06) 100%)', border: '1px solid rgba(139,92,246,0.2)' },
      color: '#a78bfa',
    },
    {
      label: 'Approval Rate',
      value: `${approvedRate}%`,
      style: { background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 100%)', border: '1px solid rgba(16,185,129,0.2)' },
      color: '#34d399',
    },
    {
      label: 'Fraud Caught',
      value: fraudCaught,
      style: { background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(245,158,11,0.06) 100%)', border: '1px solid rgba(239,68,68,0.2)' },
      color: '#f87171',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl cursor-default"
            style={{ ...stat.style, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            <Brain className="w-5 h-5 mb-2" style={{ color: stat.color }} />
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl"
          style={CARD_STYLE}
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            AI Model Stats
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Model Version', value: 'EmbedAI v3.2', color: '#22d3ee' },
              { label: 'Policies Analyzed', value: insurances.length.toString(), color: 'white' },
              { label: 'Claims Evaluated', value: claims.length.toString(), color: 'white' },
              { label: 'Transactions Processed', value: transactions.length.toString(), color: 'white' },
              { label: 'Fraud Detection Rate', value: '99.1%', color: '#34d399' },
              { label: 'False Positive Rate', value: '0.3%', color: '#34d399' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-xs font-semibold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl"
          style={CARD_STYLE}
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Decision Breakdown
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Insurance Activated', count: aiLogs.filter(l => l.entity_type === 'insurance').length, barColor: '#06b6d4', textColor: '#22d3ee' },
              { label: 'Claims Approved', count: claims.filter(c => c.status === 'approved').length, barColor: '#10b981', textColor: '#34d399' },
              { label: 'Under Review', count: claims.filter(c => c.status === 'under_review').length, barColor: '#f59e0b', textColor: '#fbbf24' },
              { label: 'Flagged/Fraud', count: claims.filter(c => c.status === 'flagged').length, barColor: '#ef4444', textColor: '#f87171' },
            ].map((item) => {
              const total = aiLogs.length || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className="text-xs font-bold" style={{ color: item.textColor }}>{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.barColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl"
          style={CARD_STYLE}
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Key Insights
          </h3>
          <div className="space-y-2.5">
            {[
              { text: 'AI activates insurance in under 50ms — zero user effort required', style: { background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' } },
              { text: 'Trust score dynamically adjusts after every claim event', style: { background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' } },
              { text: 'Fraud patterns detected across time, frequency, and value dimensions', style: { background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' } },
              { text: 'Every decision is explainable — full audit trail maintained', style: { background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' } },
              { text: '60-70% of transactions globally lack any form of insurance coverage', style: { background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' } },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="p-2.5 rounded-xl text-xs text-slate-300 leading-relaxed"
                style={insight.style}
              >
                {insight.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-6 rounded-2xl"
        style={CARD_STYLE}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: '#a78bfa' }} />
            AI Decision Log
          </h2>
          <span className="text-xs text-slate-500">{aiLogs.length} total decisions</span>
        </div>

        {aiLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600">
            <Brain className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">No AI decisions yet</p>
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
    </div>
  );
}
