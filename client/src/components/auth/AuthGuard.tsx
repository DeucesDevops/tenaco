'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

const PUBLIC_PATHS = ['/', '/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrate } = useAppStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    hydrate();
    setChecked(true);
  }, [hydrate]);

  useEffect(() => {
    if (!checked) return;

    const isPublic = PUBLIC_PATHS.includes(pathname);
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('tenaco_token') : null;
    const isAuthenticated = !!token || !!storedToken;

    if (!isPublic && !isAuthenticated) {
      router.replace('/login');
    }
  }, [checked, token, pathname, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('tenaco_token') : null;
  const isAuthenticated = !!token || !!storedToken;

  if (!isPublic && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
