'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Plus, MapPin, Users, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { api } from '@/lib/api';
import { Property } from '@/lib/types';
import Link from 'next/link';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProp, setNewProp] = useState({ name: '', address: '', type: 'Apartment', units: 1, landlordId: '1' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.properties.list().then(setProperties).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const prop = await api.properties.create(newProp);
      setProperties([...properties, prop]);
      setShowAdd(false);
      setNewProp({ name: '', address: '', type: 'Apartment', units: 1, landlordId: '1' });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
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
        title="Properties"
        description={`${properties.length} properties under management`}
        action={
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4" />
            Add Property
          </Button>
        }
      />

      {/* Add Property Form */}
      {showAdd && (
        <Card className="mb-6">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Property</h3>
            <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Property Name"
                placeholder="e.g. Sunset Apartments"
                value={newProp.name}
                onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                required
              />
              <Input
                label="Address"
                placeholder="123 Main Street, London"
                value={newProp.address}
                onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                required
              />
              <Select
                label="Property Type"
                value={newProp.type}
                onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                options={[
                  { value: 'Apartment', label: 'Apartment' },
                  { value: 'House', label: 'House' },
                  { value: 'Terraced House', label: 'Terraced House' },
                  { value: 'Flat', label: 'Flat' },
                  { value: 'Studio', label: 'Studio' },
                  { value: 'Commercial', label: 'Commercial' },
                ]}
              />
              <Input
                label="Number of Units"
                type="number"
                min={1}
                value={newProp.units}
                onChange={(e) => setNewProp({ ...newProp, units: parseInt(e.target.value) || 1 })}
              />
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button type="submit" loading={saving}>Add Property</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="No properties yet"
          description="Add your first property to start managing tenants and issues."
          action={{ label: 'Add Property', onClick: () => setShowAdd(true) }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <Card hover className="h-full">
                <CardContent className="py-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <Badge variant="info">{property.type}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{property.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    {property.address}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3.5 h-3.5" />
                      {property.units} units
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
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
