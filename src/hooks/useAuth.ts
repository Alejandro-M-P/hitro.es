interface AuthModel {
  isDevAuthenticated(): boolean;
  login(password: string, expectedPassword: string): { ok: boolean; message?: string };
  logout(): void;
}

const SESSION_KEY = 'admin_session';

class AuthState implements AuthModel {
  isDevAuthenticated(): boolean {
    return window.localStorage.getItem(SESSION_KEY) === 'admin';
  }

  login(password: string, expectedPassword: string): { ok: boolean; message?: string } {
    if (!expectedPassword) {
      return { ok: false, message: 'ADMIN no configurado.' };
    }

    if (password.trim() !== expectedPassword.trim()) {
      return { ok: false, message: 'Contrasena incorrecta.' };
    }

    window.localStorage.setItem(SESSION_KEY, 'admin');
    return { ok: true };
  }

  logout(): void {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export function useAuth(): AuthModel {
  return new AuthState();
}
