import { motion } from 'framer-motion';

interface TrustScoreProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

function getConfig(s: number) {
  if (s >= 70) return { stroke: '#10b981', rgb: '16,185,129', textColor: '#34d399', glow: 'rgba(16,185,129,0.5)', label: 'Trusted', labelBg: 'rgba(16,185,129,0.1)', labelBorder: 'rgba(16,185,129,0.3)' };
  if (s >= 40) return { stroke: '#f59e0b', rgb: '245,158,11', textColor: '#fbbf24', glow: 'rgba(245,158,11,0.5)', label: 'Average', labelBg: 'rgba(245,158,11,0.1)', labelBorder: 'rgba(245,158,11,0.3)' };
  return { stroke: '#ef4444', rgb: '239,68,68', textColor: '#f87171', glow: 'rgba(239,68,68,0.5)', label: 'Risky', labelBg: 'rgba(239,68,68,0.1)', labelBorder: 'rgba(239,68,68,0.3)' };
}

export function TrustScore({ score, size = 120, showLabel = true }: TrustScoreProps) {
  const radius = (size / 2) - 14;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const cfg = getConfig(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer ambient glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center, rgba(${cfg.rgb},0.08) 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
        />

        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
          <defs>
            <filter id={`trust-glow-${score}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={`trust-grad-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={cfg.stroke} stopOpacity="0.6" />
              <stop offset="100%" stopColor={cfg.stroke} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Outer track glow ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius + 2}
            fill="none"
            stroke="rgba(255,255,255,0.025)"
            strokeWidth="14"
          />
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="9"
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#trust-grad-${score})`}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            filter={`url(#trust-glow-${score})`}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 2 }}>
          <motion.span
            className="font-bold tracking-tight"
            style={{
              fontSize: size * 0.24,
              color: cfg.textColor,
              textShadow: `0 0 16px ${cfg.glow}`,
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 240 }}
          >
            {score}
          </motion.span>
          {showLabel && (
            <span style={{ fontSize: size * 0.1, color: 'rgba(148,163,184,0.55)' }}>
              /100
            </span>
          )}
        </div>
      </div>

      {showLabel && (
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
          transition={{ delay: 1.1, type: 'spring', stiffness: 260 }}
        >
          {cfg.label}
        </motion.div>
      )}
    </div>
  );
}
