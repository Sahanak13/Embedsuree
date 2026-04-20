import { motion } from 'framer-motion';
import {
  LayoutDashboard, Zap, FileText, Brain, ShieldAlert, Shield, TrendingUp, Sparkles
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview' },
  { id: 'simulation', label: 'Simulation', icon: Zap, desc: 'Test events' },
  { id: 'claims', label: 'Claims', icon: FileText, desc: 'Manage claims' },
  { id: 'insights', label: 'AI Insights', icon: Brain, desc: 'Decision logs' },
  { id: 'admin', label: 'Admin Panel', icon: ShieldAlert, desc: 'Fraud & analytics' },
];

export function Sidebar() {
  const { activePage, setActivePage } = useAppStore();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r"
      style={{
        background: 'linear-gradient(180deg, rgba(5,5,9,0.97) 0%, rgba(7,5,16,0.96) 100%)',
        borderColor: 'rgba(139,92,246,0.12)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
      }}
    >
      <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                boxShadow: '0 0 24px rgba(124,58,237,0.45), 0 0 48px rgba(124,58,237,0.15)',
              }}
              animate={{ boxShadow: ['0 0 24px rgba(124,58,237,0.45)', '0 0 32px rgba(124,58,237,0.6)', '0 0 24px rgba(124,58,237,0.45)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <motion.div
              className="absolute -inset-1 rounded-xl opacity-30"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(59,130,246,0.4))', filter: 'blur(6px)' }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-base font-800 text-white tracking-tight leading-none" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>EMBEDSURE</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="w-2.5 h-2.5" style={{ color: '#a78bfa' }} />
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.7)' }}>AI Insurance Platform</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: 'rgba(100,116,139,0.6)' }}>Navigation</p>
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden"
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(59,130,246,0.12) 100%)',
                border: '1px solid rgba(139,92,246,0.35)',
                color: '#c4b5fd',
                boxShadow: '0 0 16px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
              } : {
                color: 'rgba(148,163,184,0.7)',
                border: '1px solid transparent',
              }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 opacity-100"
                  style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}
                />
              )}
              <div
                className="relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200"
                style={isActive ? {
                  background: 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.3)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Icon
                  style={{ width: 14, height: 14, color: isActive ? '#a78bfa' : undefined }}
                  className={!isActive ? 'text-slate-600 group-hover:text-slate-400 transition-colors' : ''}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold leading-none mb-0.5">{item.label}</div>
                <div className="text-[10px] opacity-50 font-normal">{item.desc}</div>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', boxShadow: '0 0 6px rgba(167,139,250,0.8)' }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
        <div
          className="p-4 rounded-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.06) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
            boxShadow: '0 0 16px rgba(124,58,237,0.08)',
          }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 60%)' }} />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
              <TrendingUp className="w-3 h-3" style={{ color: '#a78bfa' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#c4b5fd' }}>Platform Stats</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Coverage Rate</span>
              <span className="text-emerald-400 font-semibold">94.2%</span>
            </div>
            <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
                initial={{ width: 0 }}
                animate={{ width: '94.2%' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-slate-500">Fraud Blocked</span>
              <span className="font-semibold" style={{ color: '#a78bfa' }}>$2.4M</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
