import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/ui/Toast';
import { Dashboard } from './pages/Dashboard';
import { Simulation } from './pages/Simulation';
import { Claims } from './pages/Claims';
import { AIInsights } from './pages/AIInsights';
import { AdminPanel } from './pages/AdminPanel';
import { useAppStore } from './lib/store';
import type { UserProfile } from './types';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

const DEMO_PROFILE: UserProfile = {
  id: crypto.randomUUID(),
  user_id: DEMO_USER_ID,
  trust_score: 85,
  total_claims: 0,
  approved_claims: 0,
  flagged_claims: 0,
  total_transactions: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function PageContent({ page }: { page: string }) {
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'simulation': return <Simulation />;
    case 'claims': return <Claims />;
    case 'insights': return <AIInsights />;
    case 'admin': return <AdminPanel />;
    default: return <Dashboard />;
  }
}

export default function App() {
  const { activePage, setProfile } = useAppStore();

  useEffect(() => {
    setProfile(DEMO_PROFILE);
  }, [setProfile]);

  return (
    <div className="min-h-screen text-white" style={{ background: '#050509' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 900,
            height: 700,
            top: -200,
            left: '15%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ y: [0, -30, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: '40%',
            left: -200,
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ y: [0, 25, 0], scale: [1, 0.95, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 500,
            bottom: 0,
            right: '15%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, rgba(88,28,235,0.06) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ y: [0, -20, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            top: '20%',
            right: 0,
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            bottom: '25%',
            left: '40%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />
      </div>

      <Sidebar />
      <Header />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-7 max-w-[1400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <PageContent page={activePage} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
