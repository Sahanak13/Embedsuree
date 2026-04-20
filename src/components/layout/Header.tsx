import { motion } from 'framer-motion';
import { Bell, User, Wifi } from 'lucide-react';
import { useAppStore } from '../../lib/store';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Real-time insurance overview' },
  simulation: { title: 'Simulation Engine', subtitle: 'Trigger AI-powered insurance events' },
  claims: { title: 'Claims Center', subtitle: 'Automated claim processing & settlement' },
  insights: { title: 'AI Insights', subtitle: 'Explainable AI decision logs' },
  admin: { title: 'Admin Panel', subtitle: 'Fraud detection & platform analytics' },
};

export function Header() {
  const { activePage, fraudAlerts, claims } = useAppStore();
  const page = pageTitles[activePage] ?? pageTitles.dashboard;
  const pendingAlerts = fraudAlerts.filter((a) => !a.resolved).length;
  const pendingClaims = claims.filter((c) => c.status === 'pending' || c.status === 'under_review').length;

  return (
    <header
      className="fixed top-0 left-64 right-0 h-16 z-30 flex items-center px-6 border-b"
      style={{
        background: 'rgba(7,5,18,0.88)',
        borderColor: 'rgba(139,92,246,0.12)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex-1">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-base font-bold text-white">{page.title}</h2>
          <p className="text-xs text-slate-500">{page.subtitle}</p>
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}
        >
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">AI Online</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl text-slate-400 hover:text-white transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          <Bell className="w-4 h-4" />
          {(pendingAlerts + pendingClaims) > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {Math.min(pendingAlerts + pendingClaims, 9)}
            </motion.span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all group"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,92,246,0.18)',
          }}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
          >
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Demo User</span>
        </motion.button>
      </div>
    </header>
  );
}
