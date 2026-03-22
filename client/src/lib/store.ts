import { create } from 'zustand';
import { User, Property, Issue, Tenant, DashboardStats } from './types';

interface AppState {
  user: User | null;
  token: string | null;
  properties: Property[];
  issues: Issue[];
  tenants: Tenant[];
  stats: DashboardStats;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setProperties: (properties: Property[]) => void;
  setIssues: (issues: Issue[]) => void;
  setTenants: (tenants: Tenant[]) => void;
  setStats: (stats: DashboardStats) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  properties: [],
  issues: [],
  tenants: [],
  stats: { totalProperties: 0, totalTenants: 0, openIssues: 0, resolvedIssues: 0 },
  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('tenaco_user', JSON.stringify(user));
      else localStorage.removeItem('tenaco_user');
    }
  },
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('tenaco_token', token);
      else localStorage.removeItem('tenaco_token');
    }
  },
  setProperties: (properties) => set({ properties }),
  setIssues: (issues) => set({ issues }),
  setTenants: (tenants) => set({ tenants }),
  setStats: (stats) => set({ stats }),
  logout: () => {
    set({ user: null, token: null, properties: [], issues: [], tenants: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tenaco_token');
      localStorage.removeItem('tenaco_user');
    }
  },
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tenaco_token');
      const userStr = localStorage.getItem('tenaco_user');
      if (token && userStr) {
        try {
          set({ token, user: JSON.parse(userStr) });
        } catch {}
      }
    }
  },
}));
