// src/hooks/useAuth.ts
const SESSION_KEY = 'admin_session';

export function useAuth() {
  return {
    isDevAuthenticated: () => {
      // En producción, esto debería verificar la cookie, 
      // pero para tus pruebas mantenemos el localStorage
      return typeof window !== 'undefined' && window.localStorage.getItem(SESSION_KEY) === 'admin';
    },

    login: async (password: string) => {
      // LLAMADA REAL A TU API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        window.localStorage.setItem(SESSION_KEY, 'admin');
        return { ok: true };
      }
      
      return { ok: false, message: 'Credenciales inválidas' };
    },

    logout: () => {
      window.localStorage.removeItem(SESSION_KEY);
      fetch('/api/logout', { method: 'POST' }); // Avisa al servidor
    }
  };
}