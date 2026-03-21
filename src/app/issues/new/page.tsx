'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { api } from '@/lib/api';
import { Property } from '@/lib/types';

export default function NewIssuePage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    propertyId: '',
    title: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    api.properties.list().then((props) => {
      setProperties(props);
      if (props.length > 0) setForm(f => ({ ...f, propertyId: props[0].id }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.issues.create({
        ...form,
        tenantId: '2',
      });
      router.push('/issues');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/issues" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Issues
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-sm text-gray-500 mt-1">Submit a maintenance request for your property</p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Property"
              value={form.propertyId}
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              options={properties.map(p => ({ value: p.id, label: `${p.name} — ${p.address}` }))}
              required
            />
            <Input
              label="Issue Title"
              placeholder="e.g. Leaking kitchen tap"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={5}
                className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                required
              />
            </div>
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low — Not urgent' },
                { value: 'medium', label: 'Medium — Needs attention' },
                { value: 'high', label: 'High — Urgent' },
                { value: 'urgent', label: 'Urgent — Emergency' },
              ]}
            />

            {/* Image upload area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Photos (optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" loading={loading}>Submit Issue</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
