import { motion } from 'framer-motion';
import {
  Shield, TrendingUp, FileCheck, AlertTriangle, Users,
  Activity, DollarSign, Clock, ArrowUpRight
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { StatsCard } from '../components/ui/StatsCard';
import { TrustScore } from '../components/ui/TrustScore';
import { RiskGauge } from '../components/ui/RiskGauge';
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
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function Dashboard() {
  const { profile, transactions, insurances, claims, fraudAlerts } = useAppStore();

  const trustScore = profile?.trust_score ?? 85;
  const activeInsurances = insurances.filter((i) => i.status === 'active').length;
  const approvedClaims = claims.filter((c) => c.status === 'approved').length;
  const pendingAlerts = fraudAlerts.filter((a) => !a.resolved).length;
  const totalPremiums = insurances.reduce((s, i) => s + i.premium, 0);
  const avgRiskScore = transactions.length > 0
    ? Math.round(transactions.reduce((s, t) => s + t.risk_score, 0) / transactions.length)
    : 42;
  const avgRiskLevel = avgRiskScore < 33 ? 'Low' : avgRiskScore < 66 ? 'Medium' : 'High';

  const recentTransactions = [...transactions].slice(0, 6);

  const typeColors: Record<string, string> = {
    product: '#22d3ee',
    cab: '#60a5fa',
    travel: '#34d399',
  };
  const typeIcons: Record<string, string> = {
    product: '🛍',
    cab: '🚕',
    travel: '✈',
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Insurances"
          value={activeInsurances}
          icon={<Shield className="w-5 h-5 text-cyan-400" />}
          trend={{ value: 12, label: 'vs last week' }}
          accentColor="cyan"
          delay={0}
        />
        <StatsCard
          title="Total Transactions"
          value={transactions.length}
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          trend={{ value: 8, label: 'vs last week' }}
          accentColor="blue"
          delay={0.06}
        />
        <StatsCard
          title="Claims Approved"
          value={approvedClaims}
          icon={<FileCheck className="w-5 h-5 text-emerald-400" />}
          trend={{ value: 5, label: 'vs last week' }}
          accentColor="emerald"
          delay={0.12}
        />
        <StatsCard
          title="Fraud Alerts"
          value={pendingAlerts}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          trend={{ value: pendingAlerts > 0 ? -3 : 0, label: 'active alerts' }}
          accentColor="red"
          delay={0.18}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300"
          style={PANEL}
        >
          <div className="w-full flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-white">Trust Score</h3>
            <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>Profile</span>
          </div>
          <TrustScore score={trustScore} size={140} />
          <div className="w-full mt-2 space-y-0">
            {[
              { label: 'Total Claims', value: profile?.total_claims ?? 0, color: '#e2e8f0' },
              { label: 'Flagged', value: profile?.flagged_claims ?? 0, color: '#f87171' },
              { label: 'Approved', value: profile?.approved_claims ?? 0, color: '#34d399' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300"
          style={PANEL}
        >
          <div className="w-full flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-white">Avg Risk Level</h3>
            <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>Live</span>
          </div>
          <RiskGauge score={avgRiskScore} level={avgRiskLevel} size={160} />
          <div className="w-full mt-2 space-y-0">
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-xs text-slate-500">Active Policies</span>
              <span className="text-xs font-bold text-white">{activeInsurances}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-slate-500">Total Premium</span>
              <span className="text-xs font-bold" style={{ color: '#22d3ee' }}>${totalPremiums.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl transition-all duration-300"
          style={PANEL}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Risk Distribution</h3>
          </div>
          <RiskDistribution />
          <div
            className="mt-5 p-4 rounded-xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.06) 100%)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
              <span className="text-xs font-bold" style={{ color: '#c4b5fd' }}>Market Opportunity</span>
              <ArrowUpRight className="w-3 h-3 ml-auto" style={{ color: '#a78bfa' }} />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>
              60-70% of transactions globally remain uninsured — 300M+ user opportunity
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl transition-all duration-300"
          style={PANEL}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">Revenue Trend</h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                +24% YTD
              </span>
            </div>
          </div>
          <RevenueChart />
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl transition-all duration-300"
          style={PANEL}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <span
              className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              {transactions.length} total
            </span>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-600">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.14)' }}
              >
                <Clock className="w-7 h-7 opacity-30" style={{ color: '#a78bfa' }} />
              </div>
              <p className="text-sm font-semibold text-slate-500">No transactions yet</p>
              <p className="text-xs mt-1 text-slate-600 text-center">Use the Simulation page to create transactions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-default transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {typeIcons[tx.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: typeColors[tx.type] }}>
                        {tx.type === 'product' ? 'Product Purchase' : tx.type === 'cab' ? 'Cab Booking' : 'Travel Booking'}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                        tx.risk_level === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{tx.risk_level}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{tx.location}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white">${tx.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-600">
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Revenue This Month', value: '$142,380', gradient: 'linear-gradient(145deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 100%)', border: 'rgba(16,185,129,0.2)', color: '#34d399' },
          { icon: Shield, label: 'Policies Issued', value: '12,847', gradient: 'linear-gradient(145deg, rgba(6,182,212,0.12) 0%, rgba(124,58,237,0.06) 100%)', border: 'rgba(6,182,212,0.2)', color: '#22d3ee' },
          { icon: FileCheck, label: 'Claims Settled', value: '98.2%', gradient: 'linear-gradient(145deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 100%)', border: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
          { icon: AlertTriangle, label: 'Fraud Prevented', value: '$2.4M', gradient: 'linear-gradient(145deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.06) 100%)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="p-5 rounded-2xl cursor-default relative overflow-hidden group"
              style={{
                background: item.gradient,
                border: `1px solid ${item.border}`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${item.color}50, transparent)` }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent)' }} />
              <div className="p-2 rounded-xl mb-3 w-fit" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${item.border}` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs text-slate-500 font-medium">{item.label}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
