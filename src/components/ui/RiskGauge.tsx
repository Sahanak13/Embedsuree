import { motion } from 'framer-motion';
import type { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

const LEVEL_CONFIG: Record<RiskLevel, { stroke: string; glow: string; rgb: string; textColor: string; labelBg: string; labelBorder: string }> = {
  Low: { stroke: '#10b981', glow: 'rgba(16,185,129,0.6)', rgb: '16,185,129', textColor: '#34d399', labelBg: 'rgba(16,185,129,0.1)', labelBorder: 'rgba(16,185,129,0.3)' },
  Medium: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.6)', rgb: '245,158,11', textColor: '#fbbf24', labelBg: 'rgba(245,158,11,0.1)', labelBorder: 'rgba(245,158,11,0.3)' },
  High: { stroke: '#ef4444', glow: 'rgba(239,68,68,0.6)', rgb: '239,68,68', textColor: '#f87171', labelBg: 'rgba(239,68,68,0.1)', labelBorder: 'rgba(239,68,68,0.3)' },
};

export function RiskGauge({ score, level, size = 160 }: RiskGaugeProps) {
  const radius = (size / 2) - 18;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const cfg = LEVEL_CONFIG[level];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size / 2 + 28 }}>
        <svg width={size} height={size / 2 + 24} viewBox={`0 0 ${size} ${size / 2 + 24}`} overflow="visible">
          <defs>
            <filter id={`gauge-glow-${level}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`gauge-outer-glow-${level}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feColorMatrix in="blur" type="matrix" values={`0 0 0 0 ${parseInt(cfg.stroke.slice(1,3),16)/255} 0 0 0 0 ${parseInt(cfg.stroke.slice(3,5),16)/255} 0 0 0 0 ${parseInt(cfg.stroke.slice(5,7),16)/255} 0 0 0 0.5 0`} result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={`gauge-grad-${level}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={cfg.stroke} stopOpacity="0.5" />
              <stop offset="100%" stopColor={cfg.stroke} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d={`M ${18} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 18} ${size / 2}`}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Inner track glow */}
          <path
            d={`M ${18} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 18} ${size / 2}`}
            fill="none"
            stroke="rgba(255,255,255,0.025)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active arc */}
          <motion.path
            d={`M ${18} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 18} ${size / 2}`}
            fill="none"
            stroke={`url(#gauge-grad-${level})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            filter={`url(#gauge-glow-${level})`}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI - (tick / 100) * Math.PI;
            const x = size / 2 + (radius + 7) * Math.cos(angle);
            const y = size / 2 + (radius + 7) * Math.sin(angle);
            return (
              <circle key={tick} cx={x} cy={y} r="2" fill="rgba(255,255,255,0.12)" />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
          <motion.span
            className="text-3xl font-bold tracking-tight"
            style={{ color: cfg.textColor, textShadow: `0 0 20px ${cfg.glow}` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            {score}
          </motion.span>
          <span className="text-xs font-medium" style={{ color: 'rgba(148,163,184,0.6)' }}>/ 100</span>
        </div>
      </div>

      <motion.div
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{
          background: cfg.labelBg,
          border: `1px solid ${cfg.labelBorder}`,
          color: cfg.textColor,
          boxShadow: `0 0 12px rgba(${cfg.rgb},0.15)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 280 }}
      >
        {level} Risk
      </motion.div>
    </div>
  );
}
