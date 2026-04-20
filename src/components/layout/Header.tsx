import { motion } from 'framer-motion';
import { Bell, User, Wifi, ChevronRight } from 'lucide-react';
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
  const totalNotifs = pendingAlerts + pendingClaims;

  return (
    <header
      className="fixed top-0 left-64 right-0 h-16 z-30 flex items-center px-7 border-b"
      style={{
        background: 'rgba(5,5,9,0.85)',
        borderColor: 'rgba(139,92,246,0.1)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      <div className="flex items-center gap-2 mr-auto">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-slate-500">EMBEDSURE</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-white">{page.title}</span>
          </div>
        </motion.div>
        <div className="w-px h-4 mx-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <motion.p
          key={`${activePage}-sub`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xs"
          style={{ color: 'rgba(100,116,139,0.8)' }}
        >
          {page.subtitle}
        </motion.p>
      </div>

      <div className="flex items-center gap-2.5">
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.18)',
          }}
          animate={{ borderColor: ['rgba(16,185,129,0.18)', 'rgba(16,185,129,0.3)', 'rgba(16,185,129,0.18)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-semibold tracking-wide">AI Online</span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          className="relative p-2.5 rounded-xl text-slate-400 hover:text-white transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Bell className="w-4 h-4" />
          {totalNotifs > 0 && (
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}
            >
              {Math.min(totalNotifs, 9)}
            </motion.span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-200 group"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,92,246,0.18)',
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              boxShadow: '0 0 12px rgba(124,58,237,0.35)',
            }}
          >
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white leading-none">Demo User</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Administrator</div>
          </div>
        </motion.button>
      </div>
    </header>
  );
}
