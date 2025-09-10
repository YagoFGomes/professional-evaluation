'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // escuta login, logout, refresh de token
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh(); // força server a revalidar a sessão
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
