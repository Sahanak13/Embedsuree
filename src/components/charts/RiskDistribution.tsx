import { motion } from 'framer-motion';

interface RiskDistributionProps {
  low?: number;
  medium?: number;
  high?: number;
}

export function RiskDistribution({ low = 58, medium = 30, high = 12 }: RiskDistributionProps) {
  const total = low + medium + high;
  const bars = [
    { label: 'Low Risk', value: low, pct: (low / total) * 100, color: '#10b981', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/30' },
    { label: 'Medium Risk', value: medium, pct: (medium / total) * 100, color: '#f59e0b', bg: 'bg-amber-500', glow: 'shadow-amber-500/30' },
    { label: 'High Risk', value: high, pct: (high / total) * 100, color: '#ef4444', bg: 'bg-red-500', glow: 'shadow-red-500/30' },
  ];

  return (
    <div className="space-y-4">
      {bars.map((bar, i) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-slate-400">{bar.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{bar.value}%</span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bar.color }} />
            </div>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${bar.bg} shadow-lg ${bar.glow}`}
              initial={{ width: 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{ delay: i * 0.2, duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
