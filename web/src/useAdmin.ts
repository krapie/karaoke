import { useCallback, useEffect, useState } from 'react';

// Admin mode signs in through auth.kevinprk.com (client "karaoke", admins only).
// The auth session cookie is exchanged for a short-lived access token that
// lives only in memory; the remembered flag just restores admin mode on reload.
const AUTH_URL = 'https://auth.kevinprk.com';
const MODE_KEY = 'karaoke_admin_mode';

type TokenResult = { token: string; expiresAt: number } | { loginURL?: string };

async function fetchToken(): Promise<TokenResult> {
  const url = `${AUTH_URL}/api/token?aud=karaoke&return=${encodeURIComponent(location.href)}`;
  try {
    const res = await fetch(url, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { loginURL: data.login_url };
    return { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  } catch {
    return {};
  }
}

function remembered(): boolean {
  try {
    return localStorage.getItem(MODE_KEY) === '1';
  } catch {
    return false;
  }
}

function remember(on: boolean) {
  try {
    if (on) localStorage.setItem(MODE_KEY, '1');
    else localStorage.removeItem(MODE_KEY);
  } catch {
    /* private mode */
  }
}

export function useAdmin() {
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState(0);

  const refresh = useCallback(async (interactive: boolean) => {
    const r = await fetchToken();
    if ('token' in r) {
      setToken(r.token);
      setExpiresAt(r.expiresAt);
      remember(true);
      return;
    }
    setToken(null);
    if (interactive && r.loginURL) {
      remember(true); // come back in admin mode after signing in
      location.assign(r.loginURL);
    } else {
      remember(false);
    }
  }, []);

  // Restore admin mode silently (no redirect) if it was on and the SSO session is live.
  useEffect(() => {
    if (remembered()) void refresh(false);
  }, [refresh]);

  // Keep the token fresh while in admin mode.
  useEffect(() => {
    if (!token) return;
    const id = window.setInterval(() => {
      if (expiresAt - Date.now() < 60_000) void refresh(false);
    }, 30_000);
    return () => window.clearInterval(id);
  }, [token, expiresAt, refresh]);

  function login() {
    void refresh(true);
  }

  function logout() {
    remember(false);
    setToken(null);
  }

  return { token, isAdmin: !!token, login, logout };
}
