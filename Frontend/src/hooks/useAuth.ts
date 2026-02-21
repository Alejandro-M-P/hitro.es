// src/hooks/useAuth.ts
const SESSION_KEY = 'user_session';

interface UserSession {
  email: string;
  isLoggedIn: boolean;
}

export function useAuth() {
  const getSession = (): UserSession | null => {
    if (typeof window === 'undefined') return null;
    const sessionData = window.localStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  };

  const isAuthenticated = () => {
    const session = getSession();
    return session?.isLoggedIn ?? false;
  };

  return {
    isAuthenticated,
    getSession,
    login: async (email, password) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const session: UserSession = { email, isLoggedIn: true };
          window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          return { ok: true };
        }
        
        const errorData = await response.json().catch(() => ({ message: 'Credenciales inválidas' }));
        return { ok: false, message: errorData.message || 'Credenciales inválidas' };
      } catch (error) {
        console.error('Login error:', error);
        return { ok: false, message: 'No se pudo conectar con el servidor.' };
      }
    },
    logout: () => {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(SESSION_KEY);
      // Though the backend is stateless, we could have an endpoint to invalidate refresh tokens if they were used.
      // For now, this is just a client-side logout.
      // fetch('/api/auth/logout', { method: 'POST' });
    }
  };
}