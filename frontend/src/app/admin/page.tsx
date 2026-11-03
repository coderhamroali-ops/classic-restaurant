"use client";

import { useState } from "react";
import { Badge, Button, Card, ErrorText, PageTitle } from "@/components/admin/ui";
import { api, type Booking, type BookingStatus } from "@/lib/api";
import { useAdminData, useAuth } from "@/lib/auth";

const filters: { value: BookingStatus | ""; label: string }[] = [
  { value: "new", label: "Новые" },
  { value: "confirmed", label: "Подтверждённые" },
  { value: "cancelled", label: "Отменённые" },
  { value: "", label: "Все" },
];
const statusBadge = {
  new: <Badge tone="new">Новая</Badge>,
  confirmed: <Badge tone="ok">Подтверждена</Badge>,
  cancelled: <Badge tone="off">Отменена</Badge>,
};

const fmtDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" });

/** Брони с сайта: администратор звонит гостю и подтверждает или отменяет. */
export default function BookingsPage() {
  const { token } = useAuth();
  const [filter, setFilter] = useState<BookingStatus | "">("new");
  const { data, error, loading, reload } = useAdminData<Booking[]>(`/bookings${filter ? `?status=${filter}` : ""}`, 30_000);
  const [actionError, setActionError] = useState("");

  async function setStatus(id: number, status: BookingStatus) {
    setActionError("");
    try {
      await api(`/bookings/${id}/status`, { method: "PATCH", token, body: JSON.stringify({ status }) });
      reload();
    } catch (e) {
      setActionError((e as Error).message);
    }
  }

  return (
    <>
      <PageTitle>Брони</PageTitle>
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm ${filter === f.value ? "bg-brass text-ink" : "border border-white/10 text-smoke hover:text-ivory"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ErrorText>{error || actionError}</ErrorText>
      {loading && <p className="text-smoke">Загрузка…</p>}
      {data?.length === 0 && <Card><p className="text-smoke">Здесь пока пусто. Новые заявки с сайта появятся автоматически.</p></Card>}

      <div className="grid gap-3">
        {data?.map((b) => (
          <Card key={b.id} className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-serif text-2xl text-ivory">{fmtDate(b.date)}, {b.time}</span>
                {statusBadge[b.status]}
              </div>
              <p className="text-ivory">
                {b.name} · <a className="text-brass-soft hover:underline" href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}>{b.phone}</a>
              </p>
              <p className="text-sm text-smoke">{b.guests} гост. · {b.occasion}{b.comment && ` · «${b.comment}»`}</p>
              <p className="text-xs text-smoke/70">Заявка от {new Date(b.createdAt).toLocaleString("ru-RU")}</p>
            </div>
            <div className="flex gap-2">
              {b.status !== "confirmed" && <Button onClick={() => setStatus(b.id, "confirmed")}>Подтвердить</Button>}
              {b.status !== "cancelled" && <Button variant="danger" onClick={() => setStatus(b.id, "cancelled")}>Отменить</Button>}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
