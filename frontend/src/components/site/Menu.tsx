"use client";

import { useMemo, useState } from "react";
import { formatPrice, type MenuCategory, type MenuDish } from "@/lib/api";
import { MenuShowcase } from "./MenuShowcase";

/** Меню: витрина с карточками выбранной вкладки + список блюд с ценами. */
export function Menu({ categories, lead, note }: { categories: MenuCategory[]; lead: string; note: string }) {
  const [active, setActive] = useState(0);
  const cats = useMemo(() => categories.filter((c) => c.dishes.length), [categories]);
  const allWithPhoto = useMemo(() => cats.flatMap((c) => c.dishes).filter((d) => d.photoUrl), [cats]);
  const current = cats[active];

  // витрина показывает блюда с фото из выбранной вкладки (если в ней нет фото — все блюда с фото);
  // новый массив только при смене вкладки, иначе витрина перезапустила бы анимацию
  const showcaseDishes = useMemo(() => {
    const own = current?.dishes.filter((d) => d.photoUrl) ?? [];
    return own.length ? own : allWithPhoto;
  }, [current, allWithPhoto]);

  if (!cats.length) {
    return (
      <section className="menu" id="menu">
        <div className="wrap menu-empty">
          <h2 className="h2">Меню</h2>
          <p className="lead" style={{ margin: "22px auto 0" }}>Меню скоро появится. Позвоните нам, и мы расскажем, что сегодня готовим.</p>
        </div>
      </section>
    );
  }

  const half = Math.ceil(current.dishes.length / 2);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : cats.length - 1)) % cats.length;
    setActive(n);
    document.getElementById(`tab-${cats[n].id}`)?.focus();
  };

  return (
    <section className="menu" id="menu">
      {allWithPhoto.length >= 3 ? (
        <MenuShowcase dishes={showcaseDishes} lead={lead} />
      ) : (
        <div className="wrap" style={{ paddingTop: 130, marginBottom: 56 }}>
          <h2 className="h2">Меню</h2>
          <p className="lead">{lead}</p>
        </div>
      )}

      <div className="wrap">
        {cats.length > 1 && (
          <div className="tabs" role="tablist" aria-label="Разделы меню">
            {cats.map((c, i) => (
              <button
                key={c.id}
                id={`tab-${c.id}`}
                className="tab"
                role="tab"
                aria-selected={i === active}
                aria-controls="menu-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
        <div className="panel" role="tabpanel" id="menu-panel" key={current.id} aria-labelledby={`tab-${current.id}`}>
          <div>{current.dishes.slice(0, half).map((d) => <DishRow key={d.id} d={d} />)}</div>
          <div>{current.dishes.slice(half).map((d) => <DishRow key={d.id} d={d} />)}</div>
        </div>
        <p className="note">{note}</p>
      </div>
    </section>
  );
}

function DishRow({ d }: { d: MenuDish }) {
  return (
    <div className="dish">
      <h3>{d.name}</h3>
      <span className="price">{formatPrice(d.price)}</span>
      {d.description && <p>{d.description}</p>}
    </div>
  );
}
