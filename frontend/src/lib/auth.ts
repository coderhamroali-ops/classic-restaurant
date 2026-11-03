"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { api, ApiError, type Role } from "./api";

// Сессия сотрудника хранится в localStorage. Для боевого проекта лучше httpOnly-cookie —
// здесь localStorage, чтобы фронтенд и API можно было держать на разных доменах без настройки.
const KEY = "classic_admin_session";

export interface Session {
  accessToken: string;
  user: { id: string; name: string; email: string; role: Role };
}

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    removeEventListener("storage", onStorage);
  };
};

function save(s: Session | null) {
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

/** ready=false — ещё не прочитали localStorage (первый рендер). */
export function useAuth() {
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem(KEY), () => undefined);
  const session = useMemo<Session | null>(() => (raw ? JSON.parse(raw) : null), [raw]);

  const login = useCallback(async (email: string, password: string) => {
    save(await api<Session>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }));
  }, []);
  const logout = useCallback(() => save(null), []);

  return { ready: raw !== undefined, session, token: session?.accessToken ?? null, user: session?.user ?? null, login, logout };
}

/** Загрузка данных для админки; при истёкшем токене выходит из аккаунта. */
export function useAdminData<T>(path: string | null, refreshMs?: number) {
  const { token, logout } = useAuth();
  const [state, setState] = useState<{ data?: T; error?: string }>({});
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path || !token) return;
    let alive = true;
    api<T>(path, { token })
      .then((data) => alive && setState({ data }))
      .catch((e: ApiError) => {
        if (!alive) return;
        if (e.status === 401) logout();
        else setState((s) => ({ ...s, error: e.message }));
      });
    const timer = refreshMs ? setInterval(() => setVersion((v) => v + 1), refreshMs) : undefined;
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [path, token, version, refreshMs, logout]);

  return { ...state, loading: !state.data && !state.error, reload: useCallback(() => setVersion((v) => v + 1), []) };
}
