import { motion } from 'framer-motion';

interface RiskDistributionProps {
  low?: number;
  medium?: number;
  high?: number;
}

export function RiskDistribution({ low = 58, medium = 30, high = 12 }: RiskDistributionProps) {
  const total = low + medium + high || 1;
  const bars = [
    { label: 'Low Risk', value: low, pct: (low / total) * 100, color: '#10b981', rgb: '16,185,129' },
    { label: 'Medium Risk', value: medium, pct: (medium / total) * 100, color: '#f59e0b', rgb: '245,158,11' },
    { label: 'High Risk', value: high, pct: (high / total) * 100, color: '#ef4444', rgb: '239,68,68' },
  ];

  return (
    <div className="space-y-4">
      {bars.map((bar, i) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: bar.color,
                  boxShadow: `0 0 6px rgba(${bar.rgb},0.6)`,
                }}
              />
              <span className="text-xs text-slate-400 font-medium">{bar.label}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.value}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            {/* Track glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: `rgba(${bar.rgb},0.04)` }}
            />
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: `linear-gradient(90deg, rgba(${bar.rgb},0.7) 0%, ${bar.color} 100%)`,
                boxShadow: `0 0 10px rgba(${bar.rgb},0.4), 0 0 4px rgba(${bar.rgb},0.6)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{ delay: i * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
