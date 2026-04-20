import { motion } from 'framer-motion';
import {
  ShieldAlert, AlertTriangle, TrendingUp, Users,
  DollarSign, Activity, CheckCircle, XCircle
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { detectFraudPatterns, getFraudSeverityColor, getFraudSeverityBg } from '../lib/fraudDetection';
import { RevenueChart } from '../components/charts/RevenueChart';
import { RiskDistribution } from '../components/charts/RiskDistribution';

function LiveCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {prefix}{value.toLocaleString()}{suffix}
    </motion.span>
  );
}

export function AdminPanel() {
  const { fraudAlerts, claims, transactions, insurances, profile } = useAppStore();
  const trustScore = profile?.trust_score ?? 85;

  const fraudPatterns = detectFraudPatterns(claims, trustScore);
  const triggeredPatterns = fraudPatterns.filter((p) => p.triggered);
  const activeAlerts = fraudAlerts.filter((a) => !a.resolved);
  const totalRevenue = insurances.reduce((s, i) => s + i.premium, 0) * 100;
  const approvedClaimsAmount = claims.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
  const riskBreakdown = {
    low: transactions.filter(t => t.risk_level === 'Low').length,
    medium: transactions.filter(t => t.risk_level === 'Medium').length,
    high: transactions.filter(t => t.risk_level === 'High').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', trend: '+18%' },
          { label: 'Active Policies', value: insurances.filter(i => i.status === 'active').length, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', trend: '+12%' },
          { label: 'Active Alerts', value: activeAlerts.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', trend: null },
          { label: 'Claims Settled', value: `$${approvedClaimsAmount.toFixed(2)}`, icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', trend: null },
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
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                {stat.trend && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-lg">{stat.trend}</span>
                )}
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                <LiveCounter value={typeof stat.value === 'number' ? stat.value : 0} prefix={typeof stat.value === 'string' ? stat.value : ''} />
                {typeof stat.value === 'string' ? '' : ''}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Platform Revenue
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">+24% YTD</span>
          </div>
          <RevenueChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-cyan-400" />
            Risk Distribution
          </h3>
          <RiskDistribution low={riskBreakdown.low || 58} medium={riskBreakdown.medium || 30} high={riskBreakdown.high || 12} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Low', count: riskBreakdown.low, color: 'text-emerald-400' },
              { label: 'Med', count: riskBreakdown.medium, color: 'text-amber-400' },
              { label: 'High', count: riskBreakdown.high, color: 'text-red-400' },
            ].map((item) => (
              <div key={item.label} className="p-2 rounded-xl bg-white/[0.03]">
                <div className={`text-base font-bold ${item.color}`}>{item.count}</div>
                <div className="text-xs text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Fraud Pattern Detection
          </h3>
          <div className="space-y-3">
            {fraudPatterns.map((pattern, i) => (
              <motion.div
                key={pattern.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={`p-4 rounded-xl border ${getFraudSeverityBg(pattern.severity)} transition-all`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {pattern.triggered ? (
                      <AlertTriangle className={`w-4 h-4 ${getFraudSeverityColor(pattern.severity)}`} />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-sm font-semibold text-white">{pattern.type}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${getFraudSeverityColor(pattern.severity)} ${getFraudSeverityBg(pattern.severity)}`}>
                    {pattern.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-500 ml-6">{pattern.description}</p>
                {!pattern.triggered && (
                  <div className="ml-6 mt-1 text-xs text-emerald-400">No threat detected</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Live Fraud Alerts
          </h3>
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
              <CheckCircle className="w-10 h-10 mb-3 opacity-30 text-emerald-600" />
              <p className="text-sm font-medium text-slate-500">All Clear</p>
              <p className="text-xs mt-1">No active fraud alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl border ${getFraudSeverityBg(alert.severity)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${getFraudSeverityColor(alert.severity)}`}>{alert.alert_type}</span>
                    <span className={`text-xs font-bold capitalize ${getFraudSeverityColor(alert.severity)}`}>{alert.severity}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                  <div className="text-xs text-slate-600 mt-1">{new Date(alert.created_at).toLocaleString()}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl"
      >
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-cyan-400" />
          Platform Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Transactions', value: transactions.length, color: 'text-white' },
            { label: 'Policies Issued', value: insurances.length, color: 'text-cyan-400' },
            { label: 'Total Claims', value: claims.length, color: 'text-blue-400' },
            { label: 'Fraud Flagged', value: claims.filter(c => c.status === 'flagged').length, color: 'text-red-400' },
            { label: 'Approval Rate', value: `${claims.length > 0 ? Math.round((claims.filter(c => c.status === 'approved').length / claims.length) * 100) : 0}%`, color: 'text-emerald-400' },
            { label: 'Coverage Ratio', value: '94.2%', color: 'text-amber-400' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-slate-700/30 text-center">
              <div className={`text-xl font-bold ${item.color} mb-1`}>{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-cyan-300 mb-1">Market Opportunity</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Currently, <strong className="text-white">60-70% of all digital transactions</strong> occur without any insurance coverage.
                EMBEDSURE's embedded model addresses a <strong className="text-white">$300M+ user opportunity</strong> by making insurance
                completely invisible and automatic — no forms, no friction, no extra steps.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            icon: XCircle,
            iconColor: 'text-red-400',
            label: 'Fraud Blocked',
            value: '$2.4M',
            sub: 'Lifetime prevented',
            color: 'border-red-500/20 bg-red-500/5',
          },
          {
            icon: Activity,
            iconColor: 'text-cyan-400',
            label: 'Avg Decision Time',
            value: '48ms',
            sub: 'Real-time AI processing',
            color: 'border-cyan-500/20 bg-cyan-500/5',
          },
          {
            icon: CheckCircle,
            iconColor: 'text-emerald-400',
            label: 'Auto-Settlement Rate',
            value: '98.2%',
            sub: 'Claims resolved automatically',
            color: 'border-emerald-500/20 bg-emerald-500/5',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className={`p-5 rounded-2xl border ${item.color} backdrop-blur-xl`}
            >
              <Icon className={`w-6 h-6 ${item.iconColor} mb-3`} />
              <div className={`text-2xl font-bold ${item.iconColor}`}>{item.value}</div>
              <div className="text-sm text-white font-medium mt-1">{item.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
