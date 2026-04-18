import { useState } from 'react';

const KEY = 'karaoke_admin_token';

export function useAdmin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(KEY));

  function login(t: string) {
    localStorage.setItem(KEY, t);
    setToken(t);
  }

  function logout() {
    localStorage.removeItem(KEY);
    setToken(null);
  }

  return { token, isAdmin: !!token, login, logout };
}
