'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Users, AlertCircle, CheckCircle, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { DashboardStats, Issue } from '@/lib/types';
import Link from 'next/link';

const statCards = [
  { key: 'totalProperties' as const, label: 'Total Properties', icon: Building2, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  { key: 'totalTenants' as const, label: 'Active Tenants', icon: Users, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  { key: 'openIssues' as const, label: 'Open Issues', icon: AlertCircle, color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  { key: 'resolvedIssues' as const, label: 'Resolved', icon: CheckCircle, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ totalProperties: 0, totalTenants: 0, openIssues: 0, resolvedIssues: 0 });
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, issues] = await Promise.all([api.dashboard.getStats(), api.issues.list()]);
        setStats(s);
        setRecentIssues(issues.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your property management activity"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key} className="relative overflow-hidden">
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats[card.key]}</p>
                  </div>
                  <div className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Issues */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
              <p className="text-sm text-gray-500 mt-0.5">Latest maintenance requests</p>
            </div>
            <Link href="/issues" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <div className="divide-y divide-gray-100">
            {recentIssues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`} className="block px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{issue.property?.address}</p>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(issue.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500 mt-0.5">Common tasks</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/properties" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Add Property</p>
                <p className="text-xs text-gray-500">Register a new property</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto" />
            </Link>
            <Link href="/issues/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Report Issue</p>
                <p className="text-xs text-gray-500">Submit a maintenance request</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto" />
            </Link>
            <Link href="/tenants" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Manage Tenants</p>
                <p className="text-xs text-gray-500">View and assign tenants</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
