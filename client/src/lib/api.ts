const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tenaco_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return res.json();
}

export const api = {
  auth: {
    async login(email: string, password: string) {
      const data = await request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('tenaco_token', data.token);
      return data;
    },
    async register(name: string, email: string, password: string, role: string) {
      const data = await request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: role.toUpperCase() }),
      });
      localStorage.setItem('tenaco_token', data.token);
      return data;
    },
  },
  properties: {
    async list() {
      return request<any[]>('/properties');
    },
    async get(id: string) {
      return request<any>(`/properties/${id}`);
    },
    async create(data: { name: string; address: string; type: string; units: number }) {
      return request<any>('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
  issues: {
    async list() {
      return request<any[]>('/issues');
    },
    async get(id: string) {
      return request<any>(`/issues/${id}`);
    },
    async create(data: { propertyId: string; title: string; description: string; priority: string; images?: string[] }) {
      return request<any>('/issues', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async updateStatus(id: string, status: string) {
      return request<any>(`/issues/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status.toUpperCase() }),
      });
    },
  },
  tenants: {
    async list() {
      return request<any[]>('/tenants');
    },
    async assign(userId: string, propertyId: string) {
      return request<any>('/tenants/assign', {
        method: 'POST',
        body: JSON.stringify({ userId, propertyId }),
      });
    },
  },
  dashboard: {
    async getStats() {
      return request<any>('/dashboard/stats');
    },
  },
  users: {
    async me() {
      return request<any>('/users/me');
    },
    async updateProfile(data: { name?: string; email?: string }) {
      return request<any>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    async changePassword(currentPassword: string, newPassword: string) {
      return request<any>('/users/me/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },
  },
  upload: {
    async uploadFile(file: File) {
      const token = localStorage.getItem('tenaco_token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
  },
};
