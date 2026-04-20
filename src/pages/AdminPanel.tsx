import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, AlertTriangle, TrendingUp, Users,
  DollarSign, Activity, CheckCircle, XCircle, ShieldCheck, Clock
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { detectFraudPatterns, getFraudSeverityColor, getFraudSeverityBg } from '../lib/fraudDetection';
import { RevenueChart } from '../components/charts/RevenueChart';
import { RiskDistribution } from '../components/charts/RiskDistribution';

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

  const STAT_CARDS = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, accentColor: '#34d399', accentRgb: '16,185,129', trend: '+18%' },
    { label: 'Active Policies', value: insurances.filter(i => i.status === 'active').length, icon: Activity, accentColor: '#22d3ee', accentRgb: '6,182,212', trend: '+12%' },
    { label: 'Active Alerts', value: activeAlerts.length, icon: AlertTriangle, accentColor: '#f87171', accentRgb: '239,68,68', trend: null },
    { label: 'Pending Approval', value: pendingAdminClaims.length, icon: ShieldCheck, accentColor: '#fb923c', accentRgb: '249,115,22', trend: null },
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
                {stat.trend ? (
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-lg"
                    style={{ color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    {stat.trend}
                  </span>
                ) : (
                  (typeof stat.value === 'number' ? stat.value : 0) > 0 && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: stat.accentColor }}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    />
                  )
                )}
              </div>
              <div className="text-2xl font-bold tracking-tight" style={{ color: stat.accentColor }}>
                {typeof stat.value === 'string' ? stat.value : <LiveCounter value={stat.value} />}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {pendingAdminClaims.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            className="rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(249,115,22,0.08) 0%, rgba(255,255,255,0.015) 100%)',
              border: '1px solid rgba(249,115,22,0.25)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 20px rgba(249,115,22,0.05)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }} />
            <div className="p-5" style={{ borderBottom: '1px solid rgba(249,115,22,0.15)' }}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
                  <ShieldCheck className="w-4 h-4" style={{ color: '#fb923c' }} />
                </div>
                <h3 className="text-sm font-bold text-white">Admin Approval Queue</h3>
                <motion.span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#fb923c' }}
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
                  transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-white">{claim.incident_type}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}
                        >
                          High Value
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        Submitted {new Date(claim.created_at).toLocaleString()} • Fraud Score:{' '}
                        <span style={{ color: claim.fraud_score > 50 ? '#f87171' : '#fbbf24' }}>
                          {claim.fraud_score}/100
                        </span>
                      </div>
                      {claim.ai_reason && (
                        <p className="text-xs text-slate-500 leading-relaxed">{claim.ai_reason}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xl font-bold mb-2" style={{ color: '#fb923c' }}>${claim.amount.toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleReject(claim.id, claim.amount)}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                          style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </motion.button>
                        <motion.button
                          onClick={() => handleApprove(claim.id, claim.amount)}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                          style={{ color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
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
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="lg:col-span-2 p-6 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={PANEL}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
              </div>
              Platform Revenue
            </h3>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-lg"
              style={{ color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              +24% YTD
            </span>
          </div>
          <RevenueChart />
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={PANEL}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <Activity className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
            </div>
            Risk Distribution
          </h3>
          <RiskDistribution low={riskBreakdown.low || 58} medium={riskBreakdown.medium || 30} high={riskBreakdown.high || 12} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Low', count: riskBreakdown.low, accentColor: '#34d399', accentRgb: '16,185,129' },
              { label: 'Med', count: riskBreakdown.medium, accentColor: '#fbbf24', accentRgb: '245,158,11' },
              { label: 'High', count: riskBreakdown.high, accentColor: '#f87171', accentRgb: '239,68,68' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-2 rounded-xl"
                style={{ background: `rgba(${item.accentRgb},0.07)`, border: `1px solid rgba(${item.accentRgb},0.18)` }}
              >
                <div className="text-base font-bold" style={{ color: item.accentColor }}>{item.count}</div>
                <div className="text-xs text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={PANEL}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.35), transparent)' }} />
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <ShieldAlert className="w-3.5 h-3.5" style={{ color: '#f87171' }} />
            </div>
            Fraud Pattern Detection
          </h3>
          <div className="space-y-2.5">
            {fraudPatterns.map((pattern, i) => (
              <motion.div
                key={pattern.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={`p-3.5 rounded-xl border ${getFraudSeverityBg(pattern.severity)} transition-all`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {pattern.triggered ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
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
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300"
          style={PANEL}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)' }} />
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
            </div>
            Live Fraud Alerts
          </h3>
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: 'rgba(52,211,153,0.5)' }} />
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
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300"
        style={PANEL}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <Users className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
          </div>
          Platform Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Transactions', value: transactions.length, accentColor: '#e2e8f0', accentRgb: '226,232,240' },
            { label: 'Policies Issued', value: insurances.length, accentColor: '#22d3ee', accentRgb: '6,182,212' },
            { label: 'Total Claims', value: claims.length, accentColor: '#60a5fa', accentRgb: '59,130,246' },
            { label: 'Fraud Flagged', value: claims.filter(c => c.status === 'flagged').length, accentColor: '#f87171', accentRgb: '239,68,68' },
            { label: 'Approval Rate', value: `${claims.length > 0 ? Math.round((claims.filter(c => c.status === 'approved').length / claims.length) * 100) : 0}%`, accentColor: '#34d399', accentRgb: '16,185,129' },
            { label: 'Coverage Ratio', value: '94.2%', accentColor: '#fbbf24', accentRgb: '245,158,11' },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.04, y: -3 }}
              className="p-3.5 rounded-xl text-center transition-all duration-200"
              style={{ background: `rgba(${item.accentRgb},0.05)`, border: `1px solid rgba(${item.accentRgb},0.14)` }}
            >
              <div className="text-xl font-bold mb-1" style={{ color: item.accentColor }}>{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <div
          className="mt-5 p-4 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.05) 100%)', border: '1px solid rgba(6,182,212,0.15)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="p-1.5 rounded-lg flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}
            >
              <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#67e8f9' }}>Market Opportunity</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Currently, <strong className="text-white">60-70% of all digital transactions</strong> occur without any insurance coverage.
                EMBEDSURE's embedded model addresses a <strong className="text-white">$300M+ user opportunity</strong> by making insurance
                completely invisible and automatic — no forms, no friction, no extra steps.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { icon: XCircle, accentColor: '#f87171', accentRgb: '239,68,68', label: 'Fraud Blocked', value: '$2.4M', sub: 'Lifetime prevented' },
          { icon: Activity, accentColor: '#22d3ee', accentRgb: '6,182,212', label: 'Avg Decision Time', value: '48ms', sub: 'Real-time AI processing' },
          { icon: CheckCircle, accentColor: '#34d399', accentRgb: '16,185,129', label: 'Auto-Settlement Rate', value: '98.2%', sub: 'Claims resolved automatically' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-5 rounded-2xl relative overflow-hidden cursor-default transition-all duration-200"
              style={{
                background: `linear-gradient(145deg, rgba(${item.accentRgb},0.1) 0%, rgba(${item.accentRgb},0.03) 100%)`,
                border: `1px solid rgba(${item.accentRgb},0.2)`,
                boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${item.accentRgb},0.4), transparent)` }} />
              <div
                className="p-2 rounded-xl w-fit mb-3"
                style={{ background: `rgba(${item.accentRgb},0.1)`, border: `1px solid rgba(${item.accentRgb},0.2)` }}
              >
                <Icon className="w-5 h-5" style={{ color: item.accentColor }} />
              </div>
              <div className="text-2xl font-bold tracking-tight" style={{ color: item.accentColor }}>{item.value}</div>
              <div className="text-sm text-white font-medium mt-1">{item.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
