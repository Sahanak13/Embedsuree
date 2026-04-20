import { motion } from 'framer-motion';
import { getRevenueTrend } from '../../lib/aiEngine';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function RevenueChart() {
  const data = getRevenueTrend();
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const width = 580;
  const height = 170;
  const padding = { top: 14, right: 14, bottom: 32, left: 52 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((val, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((val - min) / range) * chartHeight,
    val,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="revenueLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
          </linearGradient>
          <filter id="lineGlowPremium" x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + chartHeight * (1 - pct);
          const val = min + range * pct;
          return (
            <g key={pct}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
                strokeDasharray={pct === 0 ? 'none' : '4 6'}
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="rgba(100,116,139,0.8)" fontSize="10" fontFamily="Inter, sans-serif">
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#revenueAreaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />

        {/* Glow line (wider, behind) */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="rgba(6,182,212,0.12)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Main line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#revenueLineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlowPremium)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Outer glow ring */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="7"
              fill="rgba(6,182,212,0.06)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.8 + i * 0.06, type: 'spring', stiffness: 200 }}
            />
            {/* Dot */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#06b6d4"
              stroke="rgba(5,5,9,0.9)"
              strokeWidth="2"
              filter="url(#dotGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.8 + i * 0.06, type: 'spring', stiffness: 300 }}
            />
          </g>
        ))}

        {/* Month labels */}
        {MONTHS.map((month, i) => (
          <text
            key={month}
            x={points[i].x}
            y={height - 4}
            textAnchor="middle"
            fill="rgba(100,116,139,0.7)"
            fontSize="10"
            fontFamily="Inter, sans-serif"
          >
            {month}
          </text>
        ))}
      </svg>
    </div>
  );
}
