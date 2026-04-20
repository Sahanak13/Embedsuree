import { motion } from 'framer-motion';
import {
  LayoutDashboard, Zap, FileText, Brain, ShieldAlert, Shield, TrendingUp
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'simulation', label: 'Simulation', icon: Zap },
  { id: 'claims', label: 'Claims', icon: FileText },
  { id: 'insights', label: 'AI Insights', icon: Brain },
  { id: 'admin', label: 'Admin Panel', icon: ShieldAlert },
];

export function Sidebar() {
  const { activePage, setActivePage } = useAppStore();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r"
      style={{
        background: 'linear-gradient(180deg, rgba(7,5,18,0.98) 0%, rgba(5,7,18,0.96) 100%)',
        borderColor: 'rgba(139,92,246,0.15)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(139,92,246,0.12)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                boxShadow: '0 0 20px rgba(124,58,237,0.4)',
              }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">EMBEDSURE</h1>
            <p className="text-xs font-medium" style={{ color: 'rgba(167,139,250,0.85)' }}>AI Insurance Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.1) 100%)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#c4b5fd',
                boxShadow: '0 0 12px rgba(124,58,237,0.1)',
              } : {
                color: 'rgba(148,163,184,0.8)',
                border: '1px solid transparent',
              }}
            >
              <Icon
                style={{ width: 18, height: 18, color: isActive ? '#a78bfa' : undefined }}
                className={!isActive ? 'text-slate-500 group-hover:text-slate-300 transition-colors' : ''}
              />
              <span className={!isActive ? 'group-hover:text-slate-200 transition-colors' : ''}>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)' }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(139,92,246,0.12)' }}>
        <div
          className="p-3 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(59,130,246,0.08) 100%)',
            border: '1px solid rgba(139,92,246,0.22)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#a78bfa' }} />
            <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>Platform Stats</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Coverage Rate</span>
              <span className="text-emerald-400 font-medium">94.2%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Fraud Blocked</span>
              <span className="font-medium" style={{ color: '#a78bfa' }}>$2.4M</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
