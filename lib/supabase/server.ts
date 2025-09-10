/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// ✅ async + await cookies()
// ✅ API nova: getAll / setAll
export async function createServerClientSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // 'set' tem duas assinaturas dependendo da versão do Next:
            //  - set({ name, value, ...options })
            //  - set(name, value, options)
            // Abaixo suportamos as duas de forma segura.
            cookiesToSet.forEach(({ name, value, options }) => {
              const anyStore = cookieStore as any;
              if (typeof anyStore.set === 'function') {
                // tenta objeto (Next 14+)
                try {
                  anyStore.set({ name, value, ...options });
                } catch {
                  // fallback posicional (Next 13.x)
                  anyStore.set(name, value, options);
                }
              }
            });
          } catch {
            // Se for chamado dentro de um Server Component puro,
            // setAll pode falhar — tudo bem se você usa middleware/redirects.
          }
        },
      },
    }
  );
}
