import { motion } from 'framer-motion';
import {
  Shield, TrendingUp, FileCheck, AlertTriangle, Users,
  Activity, DollarSign, Clock
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { StatsCard } from '../components/ui/StatsCard';
import { TrustScore } from '../components/ui/TrustScore';
import { RiskGauge } from '../components/ui/RiskGauge';
import { RevenueChart } from '../components/charts/RevenueChart';
import { RiskDistribution } from '../components/charts/RiskDistribution';

const CARD_STYLE = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  border: '1px solid rgba(139,92,246,0.15)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
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
    product: 'text-cyan-400',
    cab: 'text-blue-400',
    travel: 'text-emerald-400',
  };
  const typeIcons: Record<string, string> = {
    product: '🛍',
    cab: '🚕',
    travel: '✈',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          delay={0.05}
        />
        <StatsCard
          title="Claims Approved"
          value={approvedClaims}
          icon={<FileCheck className="w-5 h-5 text-emerald-400" />}
          trend={{ value: 5, label: 'vs last week' }}
          accentColor="emerald"
          delay={0.1}
        />
        <StatsCard
          title="Fraud Alerts"
          value={pendingAlerts}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          trend={{ value: pendingAlerts > 0 ? -3 : 0, label: 'active alerts' }}
          accentColor="red"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200"
          style={CARD_STYLE}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Trust Score</h3>
          <TrustScore score={trustScore} size={140} />
          <div className="w-full mt-2 space-y-2">
            {[
              { label: 'Total Claims', value: profile?.total_claims ?? 0, color: 'text-white' },
              { label: 'Flagged', value: profile?.flagged_claims ?? 0, color: 'text-red-400' },
              { label: 'Approved', value: profile?.approved_claims ?? 0, color: 'text-emerald-400' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-xs">
                <span className="text-slate-500">{item.label}</span>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200"
          style={CARD_STYLE}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Avg Risk Level</h3>
          <RiskGauge score={avgRiskScore} level={avgRiskLevel} size={160} />
          <div className="w-full mt-2 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Active Policies</span>
              <span className="text-white font-semibold">{activeInsurances}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Premium</span>
              <span className="text-cyan-400 font-semibold">${totalPremiums.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl transition-all duration-200"
          style={CARD_STYLE}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Risk Distribution</h3>
          <RiskDistribution />
          <div
            className="mt-4 p-3 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.06) 100%)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
              <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>Market Opportunity</span>
            </div>
            <p className="text-xs text-slate-500">60-70% of transactions globally remain uninsured — 300M+ user opportunity</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl transition-all duration-200"
          style={CARD_STYLE}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Revenue Trend</h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-lg"
                style={{ color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                +24% YTD
              </span>
            </div>
          </div>
          <RevenueChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl transition-all duration-200"
          style={CARD_STYLE}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-lg font-medium"
              style={{ color: 'rgba(167,139,250,0.9)', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              {transactions.length} total
            </span>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                <Clock className="w-6 h-6 opacity-40" style={{ color: '#a78bfa' }} />
              </div>
              <p className="text-sm text-slate-500">No transactions yet</p>
              <p className="text-xs mt-1 text-slate-600">Use the Simulation page to create transactions</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(139,92,246,0.1)',
                  }}
                >
                  <div className="text-lg">{typeIcons[tx.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium capitalize ${typeColors[tx.type]}`}>
                        {tx.type === 'product' ? 'Product Purchase' : tx.type === 'cab' ? 'Cab Booking' : 'Travel Booking'}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                        tx.risk_level === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{tx.risk_level}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{tx.location}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-white">${tx.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Revenue This Month', value: '$142,380', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(6,182,212,0.06) 100%)', border: 'rgba(16,185,129,0.22)', color: '#34d399' },
          { icon: Shield, label: 'Policies Issued', value: '12,847', gradient: 'linear-gradient(135deg, rgba(6,182,212,0.14) 0%, rgba(124,58,237,0.06) 100%)', border: 'rgba(6,182,212,0.22)', color: '#22d3ee' },
          { icon: FileCheck, label: 'Claims Settled', value: '98.2%', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(139,92,246,0.06) 100%)', border: 'rgba(59,130,246,0.22)', color: '#60a5fa' },
          { icon: AlertTriangle, label: 'Fraud Prevented', value: '$2.4M', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.14) 0%, rgba(239,68,68,0.06) 100%)', border: 'rgba(245,158,11,0.22)', color: '#fbbf24' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-4 rounded-2xl transition-all duration-200 cursor-default"
              style={{
                background: item.gradient,
                border: `1px solid ${item.border}`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <Icon className="w-5 h-5 mb-2" style={{ color: item.color }} />
              <div className="text-xl font-bold mb-0.5" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
