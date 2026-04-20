import { motion } from 'framer-motion';
import { Brain, CheckCircle, AlertTriangle, Clock, TrendingUp, Minus } from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { AIFactor } from '../types';

function FactorBadge({ factor }: { factor: AIFactor }) {
  const config = {
    positive: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle className="w-3 h-3" /> },
    negative: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: <AlertTriangle className="w-3 h-3" /> },
    neutral: { color: 'text-slate-400', bg: 'bg-slate-700/30 border-slate-700/50', icon: <Minus className="w-3 h-3" /> },
  }[factor.impact];

  return (
    <div className={`p-3 rounded-xl border ${config.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white">{factor.name}</span>
        <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
          {config.icon}
          {factor.impact}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
      <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            factor.impact === 'positive' ? 'bg-emerald-500' :
            factor.impact === 'negative' ? 'bg-red-500' : 'bg-slate-500'
          }`}
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
  const config = {
    insurance: { color: 'text-cyan-400', bg: 'border-cyan-500/20 bg-cyan-500/5', icon: '🛡' },
    claim: {
      color: log.decision === 'APPROVED' ? 'text-emerald-400' : log.decision === 'FLAGGED' ? 'text-red-400' : 'text-amber-400',
      bg: log.decision === 'APPROVED' ? 'border-emerald-500/20 bg-emerald-500/5' : log.decision === 'FLAGGED' ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/20 bg-amber-500/5',
      icon: log.decision === 'APPROVED' ? '✅' : log.decision === 'FLAGGED' ? '🚩' : '⏳',
    },
    fraud: { color: 'text-red-400', bg: 'border-red-500/20 bg-red-500/5', icon: '🔴' },
  }[log.entity_type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-2xl border backdrop-blur-xl ${config.bg}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${config.color}`}>{log.decision}</span>
              <span className="text-xs text-slate-600 capitalize bg-white/5 px-2 py-0.5 rounded-full">{log.entity_type}</span>
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

      <p className="text-xs text-slate-300 leading-relaxed mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AI Decisions Made', value: aiLogs.length, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
          { label: 'Avg Confidence', value: `${avgConfidence}%`, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Approval Rate', value: `${approvedRate}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Fraud Caught', value: fraudCaught, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-2xl border ${stat.bg} backdrop-blur-xl`}
          >
            <Brain className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            AI Model Stats
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Model Version', value: 'EmbedAI v3.2', color: 'text-cyan-400' },
              { label: 'Policies Analyzed', value: insurances.length.toString(), color: 'text-white' },
              { label: 'Claims Evaluated', value: claims.length.toString(), color: 'text-white' },
              { label: 'Transactions Processed', value: transactions.length.toString(), color: 'text-white' },
              { label: 'Fraud Detection Rate', value: '99.1%', color: 'text-emerald-400' },
              { label: 'False Positive Rate', value: '0.3%', color: 'text-emerald-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className={`text-xs font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Decision Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Insurance Activated', count: aiLogs.filter(l => l.entity_type === 'insurance').length, color: 'bg-cyan-500', textColor: 'text-cyan-400' },
              { label: 'Claims Approved', count: claims.filter(c => c.status === 'approved').length, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
              { label: 'Under Review', count: claims.filter(c => c.status === 'under_review').length, color: 'bg-amber-500', textColor: 'text-amber-400' },
              { label: 'Flagged/Fraud', count: claims.filter(c => c.status === 'flagged').length, color: 'bg-red-500', textColor: 'text-red-400' },
            ].map((item) => {
              const total = aiLogs.length || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className={`text-xs font-bold ${item.textColor}`}>{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
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
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Key Insights
          </h3>
          <div className="space-y-3">
            {[
              { text: 'AI activates insurance in under 50ms — zero user effort required', color: 'border-cyan-500/20 bg-cyan-500/5' },
              { text: 'Trust score dynamically adjusts after every claim event', color: 'border-blue-500/20 bg-blue-500/5' },
              { text: 'Fraud patterns detected across time, frequency, and value dimensions', color: 'border-amber-500/20 bg-amber-500/5' },
              { text: 'Every decision is explainable — full audit trail maintained', color: 'border-emerald-500/20 bg-emerald-500/5' },
              { text: '60-70% of transactions globally lack any form of insurance coverage', color: 'border-red-500/20 bg-red-500/5' },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`p-2.5 rounded-xl border text-xs text-slate-300 leading-relaxed ${insight.color}`}
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
        className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
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
