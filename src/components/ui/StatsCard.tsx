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

const ACCENT_STYLES: Record<string, {
  border: string;
  borderHover: string;
  bg: string;
  glow: string;
  glowHover: string;
  value: string;
  iconBg: string;
}> = {
  cyan: {
    border: 'rgba(6,182,212,0.2)',
    borderHover: 'rgba(6,182,212,0.4)',
    bg: 'linear-gradient(145deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.05) 60%, rgba(0,0,0,0) 100%)',
    glow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.08) inset',
    glowHover: '0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(6,182,212,0.12), 0 0 0 1px rgba(6,182,212,0.12) inset',
    value: '#22d3ee',
    iconBg: 'rgba(6,182,212,0.12)',
  },
  blue: {
    border: 'rgba(59,130,246,0.2)',
    borderHover: 'rgba(59,130,246,0.4)',
    bg: 'linear-gradient(145deg, rgba(59,130,246,0.1) 0%, rgba(124,58,237,0.05) 60%, rgba(0,0,0,0) 100%)',
    glow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.08) inset',
    glowHover: '0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.12) inset',
    value: '#60a5fa',
    iconBg: 'rgba(59,130,246,0.12)',
  },
  emerald: {
    border: 'rgba(16,185,129,0.2)',
    borderHover: 'rgba(16,185,129,0.4)',
    bg: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.05) 60%, rgba(0,0,0,0) 100%)',
    glow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.08) inset',
    glowHover: '0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(16,185,129,0.12), 0 0 0 1px rgba(16,185,129,0.12) inset',
    value: '#34d399',
    iconBg: 'rgba(16,185,129,0.12)',
  },
  amber: {
    border: 'rgba(245,158,11,0.2)',
    borderHover: 'rgba(245,158,11,0.4)',
    bg: 'linear-gradient(145deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.04) 60%, rgba(0,0,0,0) 100%)',
    glow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.08) inset',
    glowHover: '0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(245,158,11,0.12), 0 0 0 1px rgba(245,158,11,0.12) inset',
    value: '#fbbf24',
    iconBg: 'rgba(245,158,11,0.12)',
  },
  red: {
    border: 'rgba(239,68,68,0.2)',
    borderHover: 'rgba(239,68,68,0.4)',
    bg: 'linear-gradient(145deg, rgba(239,68,68,0.1) 0%, rgba(124,58,237,0.04) 60%, rgba(0,0,0,0) 100%)',
    glow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,68,68,0.08) inset',
    glowHover: '0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(239,68,68,0.12), 0 0 0 1px rgba(239,68,68,0.12) inset',
    value: '#f87171',
    iconBg: 'rgba(239,68,68,0.12)',
  },
  violet: {
    border: 'rgba(139,92,246,0.2)',
    borderHover: 'rgba(139,92,246,0.4)',
    bg: 'linear-gradient(145deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 60%, rgba(0,0,0,0) 100%)',
    glow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08) inset',
    glowHover: '0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(139,92,246,0.15), 0 0 0 1px rgba(139,92,246,0.12) inset',
    value: '#a78bfa',
    iconBg: 'rgba(139,92,246,0.12)',
  },
};

export function StatsCard({ title, value, subtitle, icon, trend, accentColor = 'cyan', delay = 0 }: StatsCardProps) {
  const accent = ACCENT_STYLES[accentColor] ?? ACCENT_STYLES.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative p-5 rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: accent.bg,
        border: `1px solid ${accent.border}`,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        boxShadow: accent.glow,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onHoverStart={(e) => {
        const el = e.target as HTMLElement;
        const card = el.closest('[data-stats-card]') as HTMLElement;
        if (card) {
          card.style.boxShadow = accent.glowHover;
          card.style.borderColor = accent.borderHover;
        }
      }}
      data-stats-card
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)' }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${accent.value}40, transparent)` }}
      />

      <div className="flex items-start justify-between mb-5">
        <div
          className="p-2.5 rounded-xl"
          style={{
            background: accent.iconBg,
            border: `1px solid ${accent.border}`,
            boxShadow: `0 0 12px ${accent.iconBg}`,
          }}
        >
          {icon}
        </div>
        {trend && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
            style={trend.value >= 0 ? {
              background: 'rgba(16,185,129,0.1)',
              color: '#34d399',
              border: '1px solid rgba(16,185,129,0.2)',
            } : {
              background: 'rgba(239,68,68,0.1)',
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
        className="text-3xl font-bold mb-1.5 tracking-tight"
        style={{ color: accent.value }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.15 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-slate-300 font-semibold tracking-tight">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
      {trend && <div className="text-xs text-slate-600 mt-1">{trend.label}</div>}
    </motion.div>
  );
}
