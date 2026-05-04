// components/ProtectedRoute.tsx
'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else if (adminOnly) {
        // Simple admin check
        if (user.email === 'admin@gmail.com') {
          setAuthorized(true);
        } else {
          router.push('/');
        }
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, adminOnly]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!authorized) return null;

  return <>{children}</>;
}