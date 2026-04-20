import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import type { ToastMessage } from '../../types';

const TOAST_CONFIGS = {
  success: {
    icon: <CheckCircle className="w-4 h-4" style={{ color: '#34d399' }} />,
    style: {
      background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,5,9,0.9) 100%)',
      border: '1px solid rgba(16,185,129,0.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.12)',
    },
    barColor: '#10b981',
    labelColor: '#34d399',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" style={{ color: '#fbbf24' }} />,
    style: {
      background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(5,5,9,0.9) 100%)',
      border: '1px solid rgba(245,158,11,0.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(245,158,11,0.12)',
    },
    barColor: '#f59e0b',
    labelColor: '#fbbf24',
  },
  error: {
    icon: <AlertTriangle className="w-4 h-4" style={{ color: '#f87171' }} />,
    style: {
      background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(5,5,9,0.9) 100%)',
      border: '1px solid rgba(239,68,68,0.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(239,68,68,0.12)',
    },
    barColor: '#ef4444',
    labelColor: '#f87171',
  },
  info: {
    icon: <Shield className="w-4 h-4" style={{ color: '#22d3ee' }} />,
    style: {
      background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(5,5,9,0.9) 100%)',
      border: '1px solid rgba(6,182,212,0.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(6,182,212,0.12)',
    },
    barColor: '#06b6d4',
    labelColor: '#22d3ee',
  },
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const removeToast = useAppStore((s) => s.removeToast);
  const duration = toast.duration ?? 4000;
  const config = TOAST_CONFIGS[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="relative flex items-start gap-3 p-4 rounded-xl min-w-[300px] max-w-[380px] overflow-hidden"
      style={{ ...config.style, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${config.barColor}60, transparent)` }} />
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        style={{ background: config.barColor, opacity: 0.4 }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
      <div className="mt-0.5 shrink-0 p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white leading-tight">{toast.title}</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(148,163,184,0.8)' }}>{toast.message}</p>
      </div>
      <motion.button
        onClick={() => removeToast(toast.id)}
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <X className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
