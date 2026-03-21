'use client';

import React from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Profile</h3>
              <p className="text-sm text-gray-500">Update your personal information</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue="John Landlord" />
              <Input label="Email" type="email" defaultValue="landlord@tenaco.com" />
            </div>
            <div className="flex justify-end">
              <Button size="sm">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Configure email alerts</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'New issue reported', description: 'Get notified when a tenant reports an issue', checked: true },
              { label: 'Issue status updates', description: 'Get notified when an issue status changes', checked: true },
              { label: 'Weekly summary', description: 'Receive a weekly digest of activity', checked: false },
            ].map((item) => (
              <label key={item.label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked={item.checked} className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Security</h3>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <div className="flex justify-end">
              <Button size="sm">Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
