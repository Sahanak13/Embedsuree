import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import type { ToastMessage } from '../../types';

function ToastItem({ toast }: { toast: ToastMessage }) {
  const removeToast = useAppStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-500/10',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/20',
      bg: 'bg-amber-500/10',
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      border: 'border-red-500/40',
      glow: 'shadow-red-500/20',
      bg: 'bg-red-500/10',
    },
    info: {
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      border: 'border-cyan-500/40',
      glow: 'shadow-cyan-500/20',
      bg: 'bg-cyan-500/10',
    },
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl ${config.border} ${config.bg} shadow-2xl ${config.glow} min-w-[300px] max-w-[380px]`}
    >
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
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
