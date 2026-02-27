import { FormEvent, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

type AuthMode = 'signup' | 'signin' | 'reset';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const resetFeedback = () => {
    setError('');
    setMessage('');
  };

  const handleEmailAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);

    if (authMode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage('Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse.');
      }
    }

    if (authMode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        setMessage('Connexion réussie.');
      }
    }

    if (authMode === 'reset') {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage('Lien de réinitialisation envoyé par e-mail.');
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    resetFeedback();
    setLoading(true);

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (googleError) {
      setError(googleError.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    resetFeedback();
    setLoading(true);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
    } else {
      setMessage('Déconnexion réussie.');
    }

    setLoading(false);
  };

  if (session) {
    return (
      <main className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0">
              <div className="card-body p-4 p-md-5">
                <h1 className="h3 mb-3">Bienvenue sur Since</h1>
                <p className="text-muted mb-4">
                  Vous êtes connecté en tant que <strong>{session.user.email}</strong>. Commencez à suivre le temps depuis votre dernière action.
                </p>
                {message ? <div className="alert alert-success">{message}</div> : null}
                {error ? <div className="alert alert-danger">{error}</div> : null}
                <button className="btn btn-outline-dark w-100 w-md-auto" onClick={handleSignOut} disabled={loading}>
                  {loading ? 'Déconnexion...' : 'Se déconnecter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4 py-md-5">
      <div className="row justify-content-center align-items-center g-4">
        <section className="col-12 col-lg-6">
          <div className="pe-lg-4">
            <span className="badge badge-light text-dark mb-3">Since</span>
            <h1 className="display-5 mb-3">Suivez la dernière fois que vous avez fait quelque chose.</h1>
            <p className="lead text-muted mb-4">
              Since vous aide à ne jamais perdre le fil: sport, ménage, tâches administratives, habitudes, et plus encore.
            </p>
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item px-0">Simple et rapide: un suivi en quelques secondes.</li>
              <li className="list-group-item px-0">Accessible partout: mobile, tablette et ordinateur.</li>
              <li className="list-group-item px-0">Pensé pour les routines du quotidien.</li>
            </ul>
            <p className="mb-0 text-muted">Inscrivez-vous ou connectez-vous pour commencer.</p>
          </div>
        </section>

        <section className="col-12 col-md-10 col-lg-6">
          <div className="card border-0">
            <div className="card-body p-4">
              <div className="btn-group btn-group-sm w-100 mb-3" role="group" aria-label="Choix authentification">
                <button
                  type="button"
                  className={`btn ${authMode === 'signin' ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => {
                    setAuthMode('signin');
                    resetFeedback();
                  }}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  className={`btn ${authMode === 'signup' ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => {
                    setAuthMode('signup');
                    resetFeedback();
                  }}
                >
                  S'inscrire
                </button>
                <button
                  type="button"
                  className={`btn ${authMode === 'reset' ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => {
                    setAuthMode('reset');
                    resetFeedback();
                  }}
                >
                  Mot de passe oublié
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="mb-3">
                <div className="form-group mb-3">
                  <label htmlFor="email" className="mb-1">
                    Adresse e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="vous@exemple.com"
                  />
                </div>

                {authMode !== 'reset' ? (
                  <div className="form-group mb-3">
                    <label htmlFor="password" className="mb-1">
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      placeholder="Minimum 6 caractères"
                    />
                  </div>
                ) : null}

                <button type="submit" className="btn btn-dark btn-block" disabled={loading}>
                  {loading && authMode !== 'reset' ? 'En cours...' : null}
                  {!loading && authMode === 'signin' ? 'Se connecter avec e-mail' : null}
                  {!loading && authMode === 'signup' ? "S'inscrire avec e-mail" : null}
                  {!loading && authMode === 'reset' ? 'Envoyer le lien de réinitialisation' : null}
                  {loading && authMode === 'reset' ? 'Envoi...' : null}
                </button>
              </form>

              <div className="d-flex align-items-center mb-3">
                <hr className="flex-fill" />
                <span className="px-2 text-muted small">ou</span>
                <hr className="flex-fill" />
              </div>

              <button type="button" className="btn btn-outline-secondary btn-block" onClick={handleGoogleSignIn} disabled={loading}>
                Continuer avec Google
              </button>

              {message ? <div className="alert alert-success mt-3 mb-0">{message}</div> : null}
              {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
