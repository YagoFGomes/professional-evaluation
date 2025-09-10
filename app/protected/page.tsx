import { redirect } from "next/navigation";
import { createServerClientSupabase } from "@/lib/supabase/server"; // seu helper server
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

export default async function ProtectedPage() {
  const supabase = await createServerClientSupabase();

  // ✅ aqui usamos getSession, não getClaims
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Esta é uma página protegida. Apenas usuários autenticados conseguem ver.
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Detalhes da sessão</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-64 overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-4">Próximos passos</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
