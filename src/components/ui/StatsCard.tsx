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

const ACCENT_STYLES: Record<string, { border: string; bg: string; glow: string; value: string }> = {
  cyan: {
    border: 'rgba(6,182,212,0.25)',
    bg: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 100%)',
    glow: 'rgba(6,182,212,0.08)',
    value: '#22d3ee',
  },
  blue: {
    border: 'rgba(59,130,246,0.25)',
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(124,58,237,0.06) 100%)',
    glow: 'rgba(59,130,246,0.08)',
    value: '#60a5fa',
  },
  emerald: {
    border: 'rgba(16,185,129,0.25)',
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 100%)',
    glow: 'rgba(16,185,129,0.08)',
    value: '#34d399',
  },
  amber: {
    border: 'rgba(245,158,11,0.25)',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.06) 100%)',
    glow: 'rgba(245,158,11,0.08)',
    value: '#fbbf24',
  },
  red: {
    border: 'rgba(239,68,68,0.25)',
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(124,58,237,0.06) 100%)',
    glow: 'rgba(239,68,68,0.08)',
    value: '#f87171',
  },
  violet: {
    border: 'rgba(139,92,246,0.25)',
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.06) 100%)',
    glow: 'rgba(139,92,246,0.08)',
    value: '#a78bfa',
  },
};

export function StatsCard({ title, value, subtitle, icon, trend, accentColor = 'cyan', delay = 0 }: StatsCardProps) {
  const accent = ACCENT_STYLES[accentColor] ?? ACCENT_STYLES.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative p-5 rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: accent.bg,
        border: `1px solid ${accent.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: `0 4px 24px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.025)' }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2.5 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {icon}
        </div>
        {trend && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.15 }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
            style={trend.value >= 0 ? {
              background: 'rgba(16,185,129,0.12)',
              color: '#34d399',
              border: '1px solid rgba(16,185,129,0.2)',
            } : {
              background: 'rgba(239,68,68,0.12)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <span>{trend.value >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </motion.div>
        )}
      </div>
      <motion.div
        className="text-2xl font-bold mb-1"
        style={{ color: accent.value }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-slate-300 font-medium">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
      {trend && <div className="text-xs text-slate-500 mt-1">{trend.label}</div>}
    </motion.div>
  );
}
