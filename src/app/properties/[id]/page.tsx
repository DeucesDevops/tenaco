'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Building2, MapPin, Calendar, ArrowLeft, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { Property, Issue } from '@/lib/types';

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prop, allIssues] = await Promise.all([
          api.properties.get(params.id as string),
          api.issues.list(),
        ]);
        setProperty(prop);
        setIssues(allIssues.filter(i => i.propertyId === params.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading || !property) {
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
        <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                  <div className="flex items-center gap-1 text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    {property.address}
                  </div>
                </div>
                <Badge variant="info">{property.type}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>{property.units} units</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Added {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Issues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Issues</h3>
            <p className="text-sm text-gray-500">{issues.length} issues for this property</p>
          </div>
          <Link href="/issues/new">
            <Button size="sm">
              <AlertCircle className="w-4 h-4" />
              Report Issue
            </Button>
          </Link>
        </CardHeader>
        <div className="divide-y divide-gray-100">
          {issues.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No issues reported for this property</p>
            </div>
          ) : (
            issues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`} className="block px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{issue.description}</p>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}
