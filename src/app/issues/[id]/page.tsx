'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, User, AlertCircle, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Issue, IssueStatus } from '@/lib/types';

const priorityColors = {
  low: 'default' as const,
  medium: 'warning' as const,
  high: 'danger' as const,
  urgent: 'danger' as const,
};

const allStatuses: { value: IssueStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export default function IssueDetailPage() {
  const params = useParams();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    api.issues.get(params.id as string).then(setIssue).finally(() => setLoading(false));
  }, [params.id]);

  const updateStatus = async (status: IssueStatus) => {
    if (!issue) return;
    setUpdating(true);
    try {
      const updated = await api.issues.updateStatus(issue.id, status);
      setIssue(updated);
      setShowStatusMenu(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !issue) {
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
      <div className="mb-6">
        <Link href="/issues" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Issues
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl font-bold text-gray-900">{issue.title}</h1>
                <StatusBadge status={issue.status} />
              </div>
              <p className="text-gray-600 leading-relaxed">{issue.description}</p>
              {issue.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {issue.images.map((img, i) => (
                    <div key={i} className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline placeholder */}
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-gray-900">Activity Timeline</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Issue reported</p>
                    <p className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {issue.status !== 'open' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Status updated to {issue.status.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500">Updated by landlord</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-gray-900">Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    disabled={updating}
                  >
                    <StatusBadge status={issue.status} />
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {showStatusMenu && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-lg z-10 py-1">
                      {allStatuses.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => updateStatus(s.value)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <StatusBadge status={s.value} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Priority</p>
                <Badge variant={priorityColors[issue.priority]}>
                  {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Property</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {issue.property?.address || 'Unknown'}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reported by</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  {issue.tenant?.name || 'Unknown'}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
