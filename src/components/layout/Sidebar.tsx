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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#080c14]/95 border-r border-slate-800/50 backdrop-blur-xl flex flex-col z-40">
      <div className="px-6 py-5 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-cyan-500/30 blur-md -z-10" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">EMBEDSURE</h1>
            <p className="text-xs text-cyan-400/70 font-medium">AI Insurance Platform</p>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} style={{ width: 18, height: 18 }} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800/50">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400">Platform Stats</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Coverage Rate</span>
              <span className="text-emerald-400 font-medium">94.2%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Fraud Blocked</span>
              <span className="text-cyan-400 font-medium">$2.4M</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
