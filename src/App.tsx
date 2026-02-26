import { useEffect, useState } from 'react';
import { CheckCircle2, Database } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

function App() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');

  useEffect(() => {
    setStatus('checking');
    supabase.auth.getSession().then(({ error }) => {
      setStatus(error ? 'error' : 'ok');
    });
  }, []);

  return (
    <main className="container flex min-h-screen items-center justify-center py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Base React + Tailwind + shadcn/ui</CardTitle>
          <CardDescription>
            Projet initialisé pour une PWA avec Supabase en backend. Nous pourrons ajouter les fonctionnalités métier ensuite.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3 rounded-md border p-4">
            <Database className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium">Supabase configuré</p>
              <p className="text-sm text-muted-foreground">Client prêt avec votre clé publique et starter API.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium">État de connexion</p>
              <p className="text-sm text-muted-foreground">
                {status === 'checking' && 'Vérification en cours...'}
                {status === 'ok' && 'Supabase répond correctement.'}
                {status === 'error' && 'Erreur de configuration Supabase (URL du projet à compléter).'}
                {status === 'idle' && 'En attente...'}
              </p>
            </div>
          </div>

          <Button className="w-full" onClick={() => window.location.reload()}>
            Rafraîchir le check
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
