"use client";

import { useState } from "react";
import { Badge, Button, Card, ErrorText, Field, Input, PageTitle, Select, Textarea } from "@/components/admin/ui";
import { api, formatPrice, type Category, type Dish } from "@/lib/api";
import { useAdminData, useAuth } from "@/lib/auth";

type DishDraft = Partial<Dish> & { categoryId: number };

/** Меню: вкладки слева, блюда выбранной вкладки справа. */
export default function MenuAdminPage() {
  const { token } = useAuth();
  const cats = useAdminData<Category[]>("/categories");
  const [selected, setSelected] = useState<number | null>(null);
  const catId = selected ?? cats.data?.[0]?.id ?? null;
  const dishes = useAdminData<Dish[]>(catId ? `/dishes?categoryId=${catId}` : null);
  const [editing, setEditing] = useState<DishDraft | null>(null);
  const [error, setError] = useState("");

  async function run(fn: () => Promise<unknown>) {
    setError("");
    try {
      await fn();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }

  const addCategory = () => {
    const name = prompt("Название новой вкладки, например «Завтраки»")?.trim();
    if (name) run(() => api("/categories", { method: "POST", token, body: JSON.stringify({ name, sortOrder: cats.data?.length ?? 0 }) })).then(cats.reload);
  };
  const renameCategory = (c: Category) => {
    const name = prompt("Новое название вкладки", c.name)?.trim();
    if (name && name !== c.name) run(() => api(`/categories/${c.id}`, { method: "PATCH", token, body: JSON.stringify({ name }) })).then(cats.reload);
  };
  const deleteCategory = (c: Category) => {
    if (!confirm(`Удалить вкладку «${c.name}» вместе со всеми её блюдами?`)) return;
    run(() => api(`/categories/${c.id}`, { method: "DELETE", token })).then(() => {
      setSelected(null);
      cats.reload();
    });
  };

  const toggleDish = (d: Dish) =>
    run(() => api(`/dishes/${d.id}`, { method: "PATCH", token, body: JSON.stringify({ isAvailable: !d.isAvailable }) })).then(dishes.reload);
  const deleteDish = (d: Dish) => {
    if (confirm(`Удалить «${d.name}»?`)) run(() => api(`/dishes/${d.id}`, { method: "DELETE", token })).then(dishes.reload);
  };

  return (
    <>
      <PageTitle action={catId && <Button onClick={() => setEditing({ categoryId: catId, isAvailable: true })}>+ Блюдо</Button>}>Меню</PageTitle>
      <div className="mb-4"><ErrorText>{error || cats.error || dishes.error}</ErrorText></div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit p-3">
          <p className="px-2 pb-2 text-xs tracking-wide text-smoke uppercase">Вкладки</p>
          {cats.data?.map((c) => (
            <div key={c.id} className={`group flex items-center justify-between rounded-md px-2 py-1.5 ${c.id === catId ? "bg-brass/15 text-brass-soft" : "text-ivory hover:bg-white/5"}`}>
              <button className="flex-1 text-left" onClick={() => setSelected(c.id)}>{c.name}</button>
              <span className="flex gap-2 text-xs text-smoke opacity-60 group-hover:opacity-100">
                <button onClick={() => renameCategory(c)} title="Переименовать">✎</button>
                <button onClick={() => deleteCategory(c)} title="Удалить" className="hover:text-red-300">✕</button>
              </span>
            </div>
          ))}
          <button onClick={addCategory} className="mt-2 w-full rounded-md border border-dashed border-white/15 px-2 py-1.5 text-sm text-smoke hover:text-ivory">+ Вкладка</button>
        </Card>

        <div className="grid content-start gap-3">
          {dishes.loading && catId && <p className="text-smoke">Загрузка…</p>}
          {dishes.data?.length === 0 && <Card><p className="text-smoke">В этой вкладке пока нет блюд.</p></Card>}
          {dishes.data?.map((d) => (
            <Card key={d.id} className={`flex items-center gap-4 p-3 ${d.isAvailable ? "" : "opacity-60"}`}>
              <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-wine">
                {d.photoUrl && <img src={d.photoUrl} alt="" className="size-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-xl text-ivory">{d.name}</span>
                  {!d.isAvailable && <Badge tone="muted">скрыто</Badge>}
                  {!d.photoUrl && <Badge tone="muted">без фото</Badge>}
                </div>
                <p className="truncate text-sm text-smoke">{d.description}</p>
              </div>
              <span className="font-serif text-xl whitespace-nowrap text-brass-soft">{formatPrice(d.price)}</span>
              <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                <Button variant="ghost" onClick={() => setEditing(d)}>Изменить</Button>
                <Button variant="ghost" onClick={() => toggleDish(d)}>{d.isAvailable ? "Скрыть" : "Показать"}</Button>
                <Button variant="danger" onClick={() => deleteDish(d)}>Удалить</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {editing && (
        <DishForm
          draft={editing}
          categories={cats.data ?? []}
          onClose={() => setEditing(null)}
          onSave={async (body) => {
            const ok = await run(() =>
              editing.id
                ? api(`/dishes/${editing.id}`, { method: "PATCH", token, body: JSON.stringify(body) })
                : api("/dishes", { method: "POST", token, body: JSON.stringify({ ...body, sortOrder: dishes.data?.length ?? 0 }) }),
            );
            if (ok) {
              setEditing(null);
              dishes.reload();
            }
          }}
        />
      )}
    </>
  );
}

function DishForm({ draft, categories, onClose, onSave }: {
  draft: DishDraft;
  categories: Category[];
  onClose: () => void;
  onSave: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [photo, setPhoto] = useState(draft.photoUrl ?? "");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    await onSave({
      name: String(f.get("name")).trim(),
      price: Number(f.get("price")),
      description: String(f.get("description")).trim(),
      photoUrl: photo.trim() || null,
      categoryId: Number(f.get("categoryId")),
      isAvailable: f.get("isAvailable") === "on",
    });
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg space-y-4 rounded-2xl border border-brass/25 bg-velvet p-6">
        <h2 className="font-serif text-3xl">{draft.id ? "Изменить блюдо" : "Новое блюдо"}</h2>
        <Field label="Название"><Input name="name" defaultValue={draft.name} required maxLength={100} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Цена, сом"><Input name="price" type="number" min={0} defaultValue={draft.price} required /></Field>
          <Field label="Вкладка">
            <Select name="categoryId" defaultValue={draft.categoryId}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Описание"><Textarea name="description" defaultValue={draft.description} maxLength={300} /></Field>
        <Field label="Ссылка на фото (блюда с фото попадают в анимацию меню)">
          <div className="flex gap-3">
            <Input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://…" type="url" />
            <div className="size-10 shrink-0 overflow-hidden rounded bg-wine">{photo && <img src={photo} alt="" className="size-full object-cover" />}</div>
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-smoke">
          <input type="checkbox" name="isAvailable" defaultChecked={draft.isAvailable ?? true} className="accent-brass" /> Показывать гостям
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Отмена</Button>
          <Button type="submit" disabled={busy}>{busy ? "Сохраняем…" : "Сохранить"}</Button>
        </div>
      </form>
    </div>
  );
}
