import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  accentColor?: string;
  delay?: number;
}

export function StatsCard({ title, value, subtitle, icon, trend, accentColor = 'cyan', delay = 0 }: StatsCardProps) {
  const accent = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/20 text-red-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
  }[accentColor] ?? 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-5 rounded-2xl border backdrop-blur-xl bg-gradient-to-br overflow-hidden group cursor-default ${accent}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.02]" />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
            trend.value >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            <span>{trend.value >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <motion.div
        className="text-2xl font-bold text-white mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-slate-400 font-medium">{title}</div>
      {subtitle && <div className="text-xs text-slate-600 mt-1">{subtitle}</div>}
      {trend && <div className="text-xs text-slate-500 mt-1">{trend.label}</div>}
    </motion.div>
  );
}
