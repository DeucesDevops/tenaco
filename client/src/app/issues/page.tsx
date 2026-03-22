'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Plus, Search, Filter, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import { Issue, IssueStatus } from '@/lib/types';
import Link from 'next/link';

const priorityColors = {
  low: 'default' as const,
  medium: 'warning' as const,
  high: 'danger' as const,
  urgent: 'danger' as const,
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<IssueStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.issues.list().then(setIssues).finally(() => setLoading(false));
  }, []);

  const filtered = issues.filter(issue => {
    if (filter !== 'all' && issue.status !== filter) return false;
    if (search && !issue.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCounts = {
    all: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    closed: issues.filter(i => i.status === 'closed').length,
  };

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
        title="Issues"
        description="Track and manage maintenance requests"
        action={
          <Link href="/issues/new">
            <Button>
              <Plus className="w-4 h-4" />
              Report Issue
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === status ? 'bg-white/20' : 'bg-gray-100'}`}>
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Issues List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<AlertCircle className="w-8 h-8" />}
          title="No issues found"
          description={search ? 'Try adjusting your search or filters.' : 'No maintenance issues have been reported yet.'}
          action={!search ? { label: 'Report Issue', onClick: () => window.location.href = '/issues/new' } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => (
            <Link key={issue.id} href={`/issues/${issue.id}`}>
              <Card hover className="mb-3">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      issue.priority === 'urgent' ? 'bg-red-100' : issue.priority === 'high' ? 'bg-orange-100' : 'bg-blue-50'
                    }`}>
                      <AlertCircle className={`w-5 h-5 ${
                        issue.priority === 'urgent' ? 'text-red-600' : issue.priority === 'high' ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{issue.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{issue.description}</p>
                        </div>
                        <StatusBadge status={issue.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant={priorityColors[issue.priority]}>
                          {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                        </Badge>
                        <span className="text-xs text-gray-400">{issue.property?.address}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                          <Clock className="w-3 h-3" />
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
