import { motion } from 'framer-motion';
import { getRevenueTrend } from '../../lib/aiEngine';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function RevenueChart() {
  const data = getRevenueTrend();
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const width = 580;
  const height = 160;
  const padding = { top: 10, right: 10, bottom: 30, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((val, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((val - min) / range) * chartHeight,
    val,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + chartHeight * (1 - pct);
          const val = min + range * pct;
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1e293b" strokeWidth="1" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#475569" fontSize="10">
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        <motion.path
          d={areaD}
          fill="url(#revenueGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.path
          d={pathD}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="#06b6d4"
            stroke="#080c14"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5 + i * 0.05, type: 'spring' }}
          />
        ))}

        {MONTHS.map((month, i) => (
          <text
            key={month}
            x={points[i].x}
            y={height - 5}
            textAnchor="middle"
            fill="#475569"
            fontSize="10"
          >
            {month}
          </text>
        ))}
      </svg>
    </div>
  );
}
