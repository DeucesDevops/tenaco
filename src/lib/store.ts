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
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  properties: [],
  issues: [],
  tenants: [],
  stats: { totalProperties: 0, totalTenants: 0, openIssues: 0, resolvedIssues: 0 },
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setProperties: (properties) => set({ properties }),
  setIssues: (issues) => set({ issues }),
  setTenants: (tenants) => set({ tenants }),
  setStats: (stats) => set({ stats }),
  logout: () => set({ user: null, token: null, properties: [], issues: [], tenants: [] }),
}));
