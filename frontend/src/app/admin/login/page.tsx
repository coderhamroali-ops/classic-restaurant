"use client";

import { useState } from "react";
import { Button, ErrorText, Field, Input } from "@/components/admin/ui";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await login(String(f.get("email")), String(f.get("password")));
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-brass/25 bg-velvet/60 p-8">
        <p className="font-serif text-4xl text-brass-soft">Classic</p>
        <p className="mb-8 text-sm text-smoke">Вход для сотрудников</p>
        <div className="space-y-4">
          <Field label="Email"><Input name="email" type="email" autoComplete="username" required autoFocus /></Field>
          <Field label="Пароль"><Input name="password" type="password" autoComplete="current-password" required /></Field>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Входим…" : "Войти"}</Button>
        </div>
      </form>
    </div>
  );
}
