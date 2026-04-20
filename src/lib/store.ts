import { create } from 'zustand';
import type { Transaction, Insurance, Claim, FraudAlert, AIDecisionLog, UserProfile, ToastMessage } from '../types';

interface AppState {
  profile: UserProfile | null;
  transactions: Transaction[];
  insurances: Insurance[];
  claims: Claim[];
  fraudAlerts: FraudAlert[];
  aiLogs: AIDecisionLog[];
  toasts: ToastMessage[];
  activePage: string;
  isLoading: boolean;

  setProfile: (profile: UserProfile) => void;
  updateTrustScore: (score: number) => void;
  addTransaction: (tx: Transaction) => void;
  addInsurance: (ins: Insurance) => void;
  addClaim: (claim: Claim) => void;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  approveClaim: (id: string) => void;
  rejectClaim: (id: string) => void;
  addFraudAlert: (alert: FraudAlert) => void;
  addAILog: (log: AIDecisionLog) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  setActivePage: (page: string) => void;
  setLoading: (loading: boolean) => void;
  setTransactions: (txs: Transaction[]) => void;
  setInsurances: (ins: Insurance[]) => void;
  setClaims: (claims: Claim[]) => void;
  setFraudAlerts: (alerts: FraudAlert[]) => void;
  setAILogs: (logs: AIDecisionLog[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  transactions: [],
  insurances: [],
  claims: [],
  fraudAlerts: [],
  aiLogs: [],
  toasts: [],
  activePage: 'dashboard',
  isLoading: false,

  setProfile: (profile) => set({ profile }),
  updateTrustScore: (score) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, trust_score: score } : null,
    })),
  addTransaction: (tx) =>
    set((state) => ({ transactions: [tx, ...state.transactions] })),
  addInsurance: (ins) =>
    set((state) => ({ insurances: [ins, ...state.insurances] })),
  addClaim: (claim) =>
    set((state) => ({ claims: [claim, ...state.claims] })),
  updateClaim: (id, updates) =>
    set((state) => ({
      claims: state.claims.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  approveClaim: (id) =>
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === id ? { ...c, status: 'approved' as const, settled_at: new Date().toISOString() } : c
      ),
      profile: state.profile
        ? {
            ...state.profile,
            approved_claims: state.profile.approved_claims + 1,
            trust_score: Math.max(0, state.profile.trust_score - 2),
          }
        : null,
    })),
  rejectClaim: (id) =>
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === id ? { ...c, status: 'rejected' as const } : c
      ),
    })),
  addFraudAlert: (alert) =>
    set((state) => ({ fraudAlerts: [alert, ...state.fraudAlerts] })),
  addAILog: (log) =>
    set((state) => ({ aiLogs: [log, ...state.aiLogs] })),
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  setActivePage: (page) => set({ activePage: page }),
  setLoading: (loading) => set({ isLoading: loading }),
  setTransactions: (txs) => set({ transactions: txs }),
  setInsurances: (ins) => set({ insurances: ins }),
  setClaims: (claims) => set({ claims }),
  setFraudAlerts: (alerts) => set({ fraudAlerts: alerts }),
  setAILogs: (logs) => set({ aiLogs: logs }),
}));
