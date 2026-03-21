'use client';

import React from 'react';
import { Users, Mail, Building2, UserPlus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockTenants = [
  { id: '1', name: 'Jane Tenant', email: 'tenant@tenaco.com', property: 'Baker Street Apartments', unit: 'Unit 2A', status: 'active' },
];

export default function TenantsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Tenants"
        description="Manage your tenants and property assignments"
        action={
          <Button>
            <UserPlus className="w-4 h-4" />
            Invite Tenant
          </Button>
        }
      />

      <div className="space-y-3">
        {mockTenants.map((tenant) => (
          <Card key={tenant.id} hover>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {tenant.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{tenant.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {tenant.email}
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Building2 className="w-3 h-3" />
                      {tenant.property}
                    </span>
                    <span className="text-xs text-gray-400">{tenant.unit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
