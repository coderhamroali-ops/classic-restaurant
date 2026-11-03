"use client";

import { useState } from "react";
import { Badge, Button, Card, ErrorText, Field, Input, PageTitle, Select } from "@/components/admin/ui";
import { api, type Role, type Staff } from "@/lib/api";
import { useAdminData, useAuth } from "@/lib/auth";

const roles: { value: Role; label: string; hint: string }[] = [
  { value: "manager", label: "Менеджер", hint: "меню и брони" },
  { value: "admin", label: "Администратор", hint: "всё, включая сотрудников" },
];

/** Сотрудники и роли. Доступно только администратору (проверяется и на API). */
export default function StaffPage() {
  const { token, user } = useAuth();
  const staff = useAdminData<Staff[]>(user?.role === "admin" ? "/users" : null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  if (user?.role !== "admin") return <ErrorText>Этот раздел доступен только администратору.</ErrorText>;

  async function run(fn: () => Promise<unknown>) {
    setError("");
    try {
      await fn();
      staff.reload();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    if (await run(() => api("/users", { method: "POST", token, body: JSON.stringify(body) }))) {
      form.reset();
      setAdding(false);
    }
  }

  const changeRole = (s: Staff, role: Role) => run(() => api(`/users/${s.id}`, { method: "PATCH", token, body: JSON.stringify({ role }) }));
  const resetPassword = (s: Staff) => {
    const password = prompt(`Новый пароль для ${s.name} (не меньше 8 символов)`);
    if (password) run(() => api(`/users/${s.id}`, { method: "PATCH", token, body: JSON.stringify({ password }) }));
  };
  const remove = (s: Staff) => {
    if (confirm(`Удалить сотрудника ${s.name}? Он больше не сможет войти.`)) run(() => api(`/users/${s.id}`, { method: "DELETE", token }));
  };

  return (
    <>
      <PageTitle action={!adding && <Button onClick={() => setAdding(true)}>+ Сотрудник</Button>}>Сотрудники</PageTitle>
      <div className="mb-4"><ErrorText>{error || staff.error}</ErrorText></div>

      {adding && (
        <Card className="mb-6">
          <form onSubmit={add} className="grid gap-4 md:grid-cols-2">
            <Field label="Имя"><Input name="name" required minLength={2} /></Field>
            <Field label="Email (логин)"><Input name="email" type="email" required /></Field>
            <Field label="Пароль (не меньше 8 символов)"><Input name="password" type="text" required minLength={8} autoComplete="new-password" /></Field>
            <Field label="Роль">
              <Select name="role" defaultValue="manager">
                {roles.map((r) => <option key={r.value} value={r.value}>{r.label} — {r.hint}</option>)}
              </Select>
            </Field>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit">Добавить</Button>
              <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Отмена</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-3">
        {staff.data?.map((s) => (
          <Card key={s.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-ivory">
                {s.name} {s.id === user.id && <Badge tone="muted">это вы</Badge>}
              </p>
              <p className="text-sm text-smoke">{s.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={s.role} onChange={(e) => changeRole(s, e.target.value as Role)} disabled={s.id === user.id} className="w-auto">
                {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </Select>
              <Button variant="ghost" onClick={() => resetPassword(s)}>Сменить пароль</Button>
              {s.id !== user.id && <Button variant="danger" onClick={() => remove(s)}>Удалить</Button>}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
