"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminData, useAuth } from "@/lib/auth";

const roleName = { admin: "Администратор", manager: "Менеджер" } as const;

/** Каркас админки: проверка входа, боковое меню, ограничение разделов по роли. */
export function AdminShell({ children }: { children: ReactNode }) {
  const { ready, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!ready) return;
    if (!user && !isLogin) router.replace("/admin/login");
    if (user && isLogin) router.replace("/admin");
  }, [ready, user, isLogin, router]);

  if (isLogin) return <div className="min-h-screen bg-ink">{children}</div>;
  if (!ready || !user) return <div className="grid min-h-screen place-items-center bg-ink text-smoke">Загрузка…</div>;

  const nav = [
    { href: "/admin", label: "Брони" },
    { href: "/admin/menu", label: "Меню" },
    ...(user.role === "admin" ? [{ href: "/admin/staff", label: "Сотрудники" }] : []),
  ];

  return (
    <div className="min-h-screen bg-ink text-ivory md:flex">
      <aside className="border-b border-white/10 bg-velvet/40 md:sticky md:top-0 md:flex md:h-screen md:w-60 md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
          <Link href="/" className="font-serif text-3xl text-brass-soft">Classic</Link>
          <p className="text-xs tracking-[.2em] text-smoke uppercase">админка</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {nav.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm whitespace-nowrap ${active ? "bg-brass/15 text-brass-soft" : "text-smoke hover:bg-white/5 hover:text-ivory"}`}
              >
                {n.label}
                {n.href === "/admin" && <NewBookingsBadge />}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-5 text-sm md:mt-auto md:block">
          <p className="text-ivory">{user.name}</p>
          <p className="text-xs text-smoke">{roleName[user.role]} · {user.email}</p>
          <button onClick={logout} className="mt-3 text-xs text-brass-soft hover:underline">Выйти</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10">
        {children}
        <button onClick={logout} className="mt-10 text-sm text-brass-soft md:hidden">Выйти ({user.name})</button>
      </main>
    </div>
  );
}

/** Сколько новых броней ждут ответа; обновляется раз в 30 секунд. */
function NewBookingsBadge() {
  const { data } = useAdminData<{ count: number }>("/bookings/new-count", 30_000);
  return data?.count ? <span className="ml-2 rounded-full bg-brass px-2 text-xs font-semibold text-ink">{data.count}</span> : null;
}
