"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";

const links = [
  ["#about", "О нас"],
  ["#menu", "Меню"],
  ["#spaces", "Залы и отель"],
  ["#book", "Бронь"],
  ["#contact", "Контакты"],
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const phone = site.phones[0];
  return (
    <header className={`top${solid ? " solid" : ""}${open ? " open" : ""}`}>
      <div className="wrap">
        <a href="#" className="logo" aria-label={`${site.name} — на главную`}>
          {site.name}
          <small>{site.city}</small>
        </a>
        <nav className="nav" onClick={() => setOpen(false)}>
          {links.map(([href, text]) => <a key={href} href={href}>{text}</a>)}
        </nav>
        <a className="call" href={`tel:${phone.tel}`}>{phone.show}</a>
        <button className="burger" aria-label="Открыть меню" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
