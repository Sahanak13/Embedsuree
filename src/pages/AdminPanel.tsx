import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, AlertTriangle, TrendingUp, Users,
  DollarSign, Activity, CheckCircle, XCircle, ShieldCheck, Clock
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
  const { fraudAlerts, claims, transactions, insurances, profile, approveClaim, rejectClaim, addToast } = useAppStore();
  const trustScore = profile?.trust_score ?? 85;

  const fraudPatterns = detectFraudPatterns(claims, trustScore);
  const activeAlerts = fraudAlerts.filter((a) => !a.resolved);
  const totalRevenue = insurances.reduce((s, i) => s + i.premium, 0) * 100;
  const pendingAdminClaims = claims.filter(c => c.status === 'pending_admin_review');
  const riskBreakdown = {
    low: transactions.filter(t => t.risk_level === 'Low').length,
    medium: transactions.filter(t => t.risk_level === 'Medium').length,
    high: transactions.filter(t => t.risk_level === 'High').length,
  };

  const handleApprove = (claimId: string, amount: number) => {
    approveClaim(claimId);
    addToast({
      type: 'success',
      title: 'Claim Approved by Admin',
      message: `$${amount.toFixed(2)} payout authorized and settlement initiated.`,
      duration: 5000,
    });
  };

  const handleReject = (claimId: string, amount: number) => {
    rejectClaim(claimId);
    addToast({
      type: 'error',
      title: 'Claim Rejected by Admin',
      message: `$${amount.toFixed(2)} claim has been rejected after manual review.`,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', trend: '+18%' },
          { label: 'Active Policies', value: insurances.filter(i => i.status === 'active').length, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/[0.08]', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/10', trend: '+12%' },
          { label: 'Active Alerts', value: activeAlerts.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/[0.08]', border: 'border-red-500/20', glow: 'shadow-red-500/10', trend: null },
          { label: 'Pending Approval', value: pendingAdminClaims.length, icon: ShieldCheck, color: 'text-orange-400', bg: 'bg-orange-500/[0.08]', border: 'border-orange-500/20', glow: 'shadow-orange-500/10', trend: null },
        ].map((stat, i) => {
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
                {stat.trend && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-lg border border-emerald-500/20">{stat.trend}</span>
                )}
                {!stat.trend && stat.value !== 0 && (
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  />
                )}
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {typeof stat.value === 'string' ? stat.value : <LiveCounter value={stat.value} />}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {pendingAdminClaims.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-orange-500/30 backdrop-blur-xl overflow-hidden shadow-lg shadow-orange-500/5"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <div className="p-5 border-b border-orange-500/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Admin Approval Queue</h3>
                <motion.span
                  className="px-2 py-0.5 rounded-full text-xs bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {pendingAdminClaims.length} pending
                </motion.span>
                <span className="ml-auto text-xs text-slate-500">High-value claims awaiting manual authorization</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {pendingAdminClaims.map((claim, i) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/[0.05] backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-white">{claim.incident_type}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 font-medium">
                          High Value
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        Submitted {new Date(claim.created_at).toLocaleString()} • Fraud Score: {' '}
                        <span className={claim.fraud_score > 50 ? 'text-red-400' : 'text-amber-400'}>
                          {claim.fraud_score}/100
                        </span>
                      </div>
                      {claim.ai_reason && (
                        <p className="text-xs text-slate-500 leading-relaxed">{claim.ai_reason}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xl font-bold text-orange-400 mb-2">${claim.amount.toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleReject(claim.id, claim.amount)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 hover:border-red-500/40 transition-all shadow-sm shadow-red-500/10 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </motion.button>
                        <motion.button
                          onClick={() => handleApprove(claim.id, claim.amount)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-sm shadow-emerald-500/10 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              Platform Revenue
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">+24% YTD</span>
          </div>
          <RevenueChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            Risk Distribution
          </h3>
          <RiskDistribution low={riskBreakdown.low || 58} medium={riskBreakdown.medium || 30} high={riskBreakdown.high || 12} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Low', count: riskBreakdown.low, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Med', count: riskBreakdown.medium, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'High', count: riskBreakdown.high, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            ].map((item) => (
              <div key={item.label} className={`p-2 rounded-xl border ${item.bg}`}>
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
          className="p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            </div>
            Fraud Pattern Detection
          </h3>
          <div className="space-y-2.5">
            {fraudPatterns.map((pattern, i) => (
              <motion.div
                key={pattern.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={`p-3.5 rounded-xl border ${getFraudSeverityBg(pattern.severity)} transition-all`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {pattern.triggered ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <AlertTriangle className={`w-3.5 h-3.5 ${getFraudSeverityColor(pattern.severity)}`} />
                      </motion.div>
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span className="text-sm font-semibold text-white">{pattern.type}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${getFraudSeverityColor(pattern.severity)} ${getFraudSeverityBg(pattern.severity)} border ${getFraudSeverityBg(pattern.severity).split(' ')[1]}`}>
                    {pattern.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-500 ml-5.5">{pattern.description}</p>
                {!pattern.triggered && (
                  <div className="mt-1 text-xs text-emerald-400 ml-5.5 flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> No threat detected
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            Live Fraud Alerts
          </h3>
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-500/60" />
              </div>
              <p className="text-sm font-medium text-slate-500">All Clear</p>
              <p className="text-xs mt-1">No active fraud alerts</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {activeAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-3.5 rounded-xl border ${getFraudSeverityBg(alert.severity)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${getFraudSeverityColor(alert.severity)}`}>{alert.alert_type}</span>
                      <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full ${getFraudSeverityColor(alert.severity)} ${getFraudSeverityBg(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                    <div className="text-xs text-slate-600 mt-1.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-slate-700/40 backdrop-blur-xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
      >
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          Platform Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Transactions', value: transactions.length, color: 'text-white', bg: 'bg-white/[0.03] border-white/[0.06]' },
            { label: 'Policies Issued', value: insurances.length, color: 'text-cyan-400', bg: 'bg-cyan-500/[0.06] border-cyan-500/15' },
            { label: 'Total Claims', value: claims.length, color: 'text-blue-400', bg: 'bg-blue-500/[0.06] border-blue-500/15' },
            { label: 'Fraud Flagged', value: claims.filter(c => c.status === 'flagged').length, color: 'text-red-400', bg: 'bg-red-500/[0.06] border-red-500/15' },
            { label: 'Approval Rate', value: `${claims.length > 0 ? Math.round((claims.filter(c => c.status === 'approved').length / claims.length) * 100) : 0}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.06] border-emerald-500/15' },
            { label: 'Coverage Ratio', value: '94.2%', color: 'text-amber-400', bg: 'bg-amber-500/[0.06] border-amber-500/15' },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.04, y: -2 }}
              className={`p-3.5 rounded-xl border ${item.bg} text-center transition-all duration-200`}
            >
              <div className={`text-xl font-bold ${item.color} mb-1`}>{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-600/10">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex-shrink-0 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            </div>
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
            bg: 'bg-red-500/[0.06]',
            border: 'border-red-500/20',
          },
          {
            icon: Activity,
            iconColor: 'text-cyan-400',
            label: 'Avg Decision Time',
            value: '48ms',
            sub: 'Real-time AI processing',
            bg: 'bg-cyan-500/[0.06]',
            border: 'border-cyan-500/20',
          },
          {
            icon: CheckCircle,
            iconColor: 'text-emerald-400',
            label: 'Auto-Settlement Rate',
            value: '98.2%',
            sub: 'Claims resolved automatically',
            bg: 'bg-emerald-500/[0.06]',
            border: 'border-emerald-500/20',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`p-5 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-xl transition-all duration-200`}
            >
              <div className={`p-2 rounded-xl ${item.bg} border ${item.border} w-fit mb-3`}>
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
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
