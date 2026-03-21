export type UserRole = 'landlord' | 'tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Property {
  id: string;
  landlordId: string;
  address: string;
  name: string;
  type: string;
  units: number;
  createdAt: string;
}

export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  user?: User;
  property?: Property;
}

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Issue {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  images: string[];
  createdAt: string;
  property?: Property;
  tenant?: User;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalProperties: number;
  totalTenants: number;
  openIssues: number;
  resolvedIssues: number;
}
