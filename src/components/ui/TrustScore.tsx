import { motion } from 'framer-motion';

interface TrustScoreProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export function TrustScore({ score, size = 120, showLabel = true }: TrustScoreProps) {
  const radius = (size / 2) - 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return { stroke: '#10b981', glow: 'drop-shadow(0 0 8px #10b981)', text: 'text-emerald-400', label: 'Trusted' };
    if (s >= 40) return { stroke: '#f59e0b', glow: 'drop-shadow(0 0 8px #f59e0b)', text: 'text-amber-400', label: 'Average' };
    return { stroke: '#ef4444', glow: 'drop-shadow(0 0 8px #ef4444)', text: 'text-red-400', label: 'Risky' };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: color.glow }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold ${color.text}`}
            style={{ fontSize: size * 0.22 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            {score}
          </motion.span>
          {showLabel && (
            <span className="text-slate-500" style={{ fontSize: size * 0.1 }}>
              /100
            </span>
          )}
        </div>
      </div>
      {showLabel && (
        <motion.div
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            score >= 70 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' :
            score >= 40 ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' :
            'border-red-500/40 bg-red-500/10 text-red-400'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
        >
          {color.label}
        </motion.div>
      )}
    </div>
  );
}
