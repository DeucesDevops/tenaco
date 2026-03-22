'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
