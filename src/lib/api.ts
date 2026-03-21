import { User, Property, Issue, AuthResponse, DashboardStats, IssueStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock data store (will be replaced with real API calls)
let mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Landlord',
    email: 'landlord@tenaco.com',
    password: 'password123',
    role: 'landlord',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Tenant',
    email: 'tenant@tenaco.com',
    password: 'password123',
    role: 'tenant',
    createdAt: new Date().toISOString(),
  },
];

let mockProperties: Property[] = [
  {
    id: '1',
    landlordId: '1',
    address: '123 Baker Street, London',
    name: 'Baker Street Apartments',
    type: 'Apartment',
    units: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    landlordId: '1',
    address: '45 Oxford Road, Manchester',
    name: 'Oxford Terrace',
    type: 'Terraced House',
    units: 1,
    createdAt: new Date().toISOString(),
  },
];

let mockIssues: Issue[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '2',
    title: 'Leaking kitchen tap',
    description: 'The kitchen tap has been dripping constantly for the past week. Water is pooling under the sink.',
    status: 'open',
    priority: 'high',
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    property: mockProperties[0],
    tenant: mockUsers[1],
  },
  {
    id: '2',
    propertyId: '1',
    tenantId: '2',
    title: 'Broken window latch',
    description: 'The latch on the bedroom window is broken and the window won\'t close properly.',
    status: 'in_progress',
    priority: 'medium',
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    property: mockProperties[0],
    tenant: mockUsers[1],
  },
  {
    id: '3',
    propertyId: '2',
    tenantId: '2',
    title: 'Heating not working',
    description: 'The central heating system has stopped working. No hot water either.',
    status: 'open',
    priority: 'urgent',
    images: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    property: mockProperties[1],
    tenant: mockUsers[1],
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      await delay(500);
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid email or password');
      const { password: _, ...safeUser } = user;
      return { token: 'mock-jwt-token-' + user.id, user: safeUser };
    },
    async register(name: string, email: string, password: string, role: 'landlord' | 'tenant'): Promise<AuthResponse> {
      await delay(500);
      if (mockUsers.find(u => u.email === email)) throw new Error('Email already exists');
      const newUser = { id: uuidv4(), name, email, password, role, createdAt: new Date().toISOString() };
      mockUsers.push(newUser);
      const { password: _, ...safeUser } = newUser;
      return { token: 'mock-jwt-token-' + newUser.id, user: safeUser };
    },
  },
  properties: {
    async list(): Promise<Property[]> {
      await delay(300);
      return mockProperties;
    },
    async get(id: string): Promise<Property> {
      await delay(200);
      const prop = mockProperties.find(p => p.id === id);
      if (!prop) throw new Error('Property not found');
      return prop;
    },
    async create(data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
      await delay(400);
      const prop: Property = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
      mockProperties.push(prop);
      return prop;
    },
  },
  issues: {
    async list(): Promise<Issue[]> {
      await delay(300);
      return mockIssues;
    },
    async get(id: string): Promise<Issue> {
      await delay(200);
      const issue = mockIssues.find(i => i.id === id);
      if (!issue) throw new Error('Issue not found');
      return issue;
    },
    async create(data: { propertyId: string; tenantId: string; title: string; description: string; priority: string }): Promise<Issue> {
      await delay(400);
      const issue: Issue = {
        id: uuidv4(),
        propertyId: data.propertyId,
        tenantId: data.tenantId,
        title: data.title,
        description: data.description,
        status: 'open',
        priority: data.priority as Issue['priority'],
        images: [],
        createdAt: new Date().toISOString(),
        property: mockProperties.find(p => p.id === data.propertyId),
        tenant: mockUsers.find(u => u.id === data.tenantId),
      };
      mockIssues.push(issue);
      return issue;
    },
    async updateStatus(id: string, status: IssueStatus): Promise<Issue> {
      await delay(300);
      const issue = mockIssues.find(i => i.id === id);
      if (!issue) throw new Error('Issue not found');
      issue.status = status;
      return issue;
    },
  },
  dashboard: {
    async getStats(): Promise<DashboardStats> {
      await delay(200);
      return {
        totalProperties: mockProperties.length,
        totalTenants: 1,
        openIssues: mockIssues.filter(i => i.status === 'open').length,
        resolvedIssues: mockIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
      };
    },
  },
};
