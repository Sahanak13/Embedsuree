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
    <div className="min-h-screen bg-[#060a10] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/4 w-[800px] h-[600px] rounded-full blur-[140px]" style={{ background: 'radial-gradient(ellipse, rgba(88,28,235,0.12) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)' }} />
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, rgba(88,28,235,0.06) 50%, transparent 70%)' }} />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />
      </div>

      <Sidebar />
      <Header />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-6 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
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
