"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { site } from "@/config/site";

/** Сегодняшняя дата ставится уже в браузере: на сервере часовой пояс может быть другим. */
function setToday(input: HTMLInputElement | null) {
  if (!input) return;
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  input.min = today;
  input.value = today;
}

/** Заявка на бронь: сохраняется в базе, администратор видит её в админке. */
export function BookingForm() {
  const [status, setStatus] = useState<{ text: string; error?: boolean } | null>(null);
  const [sending, setSending] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  useEffect(() => setToday(dateRef.current), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const empty = (["name", "phone", "date", "time"] as const).find((k) => !f[k]?.trim());
    if (empty) {
      setStatus({ text: "Заполните имя, телефон, дату и время.", error: true });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({ ...f, guests: Number(f.guests) }),
      });
      form.reset();
      setToday(dateRef.current);
      setStatus({ text: "Спасибо! Заявка принята — администратор скоро перезвонит." });
    } catch (err) {
      setStatus({ text: (err as Error).message || "Не удалось отправить. Позвоните нам, пожалуйста.", error: true });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="row">
        <label>Ваше имя<input name="name" required autoComplete="name" /></label>
        <label>Телефон<input name="phone" type="tel" required autoComplete="tel" placeholder="+996" /></label>
      </div>
      <div className="row">
        <label>Дата<input ref={dateRef} name="date" type="date" required /></label>
        <label>Время<input name="time" type="time" required defaultValue="19:00" /></label>
      </div>
      <div className="row">
        <label>Гостей<input name="guests" type="number" min={1} max={500} defaultValue={2} required /></label>
        <label>Повод
          <select name="occasion">{site.booking.occasions.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
      </div>
      <label>Пожелания<textarea name="comment" placeholder="Например: стол у окна, детский стул" /></label>
      <div className="form-foot">
        <button className="btn fill" type="submit" disabled={sending}>{sending ? "Отправляем…" : "Отправить заявку"}</button>
        <small>{site.booking.replyNote}</small>
      </div>
      <p className={`status${status?.error ? " error" : ""}`} role="status">{status?.text}</p>
    </form>
  );
}
