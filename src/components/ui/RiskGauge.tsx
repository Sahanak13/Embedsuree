import { motion } from 'framer-motion';
import type { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export function RiskGauge({ score, level, size = 160 }: RiskGaugeProps) {
  const radius = (size / 2) - 16;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  const colors: Record<RiskLevel, { stroke: string; glow: string; text: string }> = {
    Low: { stroke: '#10b981', glow: '#10b981', text: 'text-emerald-400' },
    Medium: { stroke: '#f59e0b', glow: '#f59e0b', text: 'text-amber-400' },
    High: { stroke: '#ef4444', glow: '#ef4444', text: 'text-red-400' },
  };

  const color = colors[level];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={`M ${16} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 16} ${size / 2}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d={`M ${16} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 16} ${size / 2}`}
            fill="none"
            stroke={color.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            filter="url(#glow)"
          />
          {[0, 33, 66, 100].map((tick) => {
            const angle = Math.PI - (tick / 100) * Math.PI;
            const x = size / 2 + (radius + 4) * Math.cos(angle);
            const y = size / 2 + (radius + 4) * Math.sin(angle);
            return (
              <circle key={tick} cx={x} cy={y} r="2" fill="#334155" />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.span
            className={`text-3xl font-bold ${color.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500 font-medium">/ 100</span>
        </div>
      </div>
      <motion.div
        className={`px-3 py-1 rounded-full text-xs font-bold border ${
          level === 'Low' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' :
          level === 'Medium' ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' :
          'border-red-500/40 bg-red-500/10 text-red-400'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        {level} Risk
      </motion.div>
    </div>
  );
}
