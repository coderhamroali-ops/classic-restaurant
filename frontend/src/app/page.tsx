import { Suspense } from "react";
import { BookingForm } from "@/components/site/BookingForm";
import { Menu } from "@/components/site/Menu";
import { SiteHeader } from "@/components/site/SiteHeader";
import { site } from "@/config/site";
import { api, type MenuCategory } from "@/lib/api";

const bg = (url: string) => ({ backgroundImage: `url('${url}')` });

/** Меню берётся из API при каждом запросе, остальная страница — статическая оболочка. */
async function MenuFromApi() {
  let categories: MenuCategory[] = [];
  try {
    categories = await api<MenuCategory[]>("/menu", { cache: "no-store" });
  } catch {
    // API недоступен — сайт всё равно открывается, вместо меню будет заглушка
  }
  return <Menu categories={categories} lead={site.menuLead} note={site.menuNote} />;
}

export default function Home() {
  const phone = site.phones[0];
  const route = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.map)}`;
  const [first, ...rest] = site.spaces.items;

  return (
    <div className="site">
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="hero-inner">
            <p className="hero-side"><strong>{site.hero.left.title}</strong>{site.hero.left.text}</p>
            <div className="arch-wrap">
              <div className="arch" role="img" aria-label={site.name} style={bg(site.hero.photo)} />
              <h1 className="arch-title">{site.name}</h1>
            </div>
            <p className="hero-side right">
              <strong>{site.hero.right.title}</strong>
              {site.hero.right.lines.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}
            </p>
            <div className="hero-cta">
              <a className="btn fill" href="#book">Забронировать стол</a>
              <a className="btn ghost" href="#menu">Смотреть меню</a>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="wrap">
            <div className="about-photos" aria-hidden="true">
              <div className="ph a" style={bg(site.about.photos[0])} />
              <div className="ph b" style={bg(site.about.photos[1])} />
            </div>
            <div>
              <svg className="ornament" viewBox="0 0 120 14" fill="none" stroke="currentColor" strokeWidth=".8" aria-hidden="true"><path d="M0 7h46M74 7h46" /><path d="M60 1l6 6-6 6-6-6z" /><circle cx="50" cy="7" r="1.4" fill="currentColor" /><circle cx="70" cy="7" r="1.4" fill="currentColor" /></svg>
              <h2 className="h2">{site.about.title}</h2>
              {site.about.text.map((t) => <p key={t} className="lead">{t}</p>)}
              <div className="facts">
                {site.about.facts.map(([n, t]) => <div key={t}><b>{n}</b><span>{t}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<section className="menu" id="menu"><div className="wrap menu-empty">Загружаем меню…</div></section>}>
          <MenuFromApi />
        </Suspense>

        <section className="spaces" id="spaces">
          <div className="wrap">
            <h2 className="h2">{site.spaces.title}</h2>
            <p className="lead">{site.spaces.lead}</p>
            <div className="spaces-grid">
              <article className="space big" style={bg(first.photo)}><div><h3>{first.title}</h3><p>{first.text}</p></div></article>
              {rest.map((s, i) => (
                <article key={s.title} className={`space${rest.length % 2 && i === rest.length - 1 ? " wide" : ""}`} style={bg(s.photo)}>
                  <div><h3>{s.title}</h3><p>{s.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="book" id="book">
          <div className="wrap">
            <div>
              <h2 className="h2">Забронировать стол</h2>
              <p className="lead">{site.booking.lead}</p>
              <a className="phone-big" href={`tel:${phone.tel}`}>{phone.show}</a>
              <p className="hours">{site.booking.hoursNote}</p>
            </div>
            <BookingForm />
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap">
            <h2 className="h2">Как нас найти</h2>
            <div className="contact-grid">
              <div className="contact-info">
                <div><h4>Адрес</h4><p>{site.address}</p></div>
                <div><h4>Часы работы</h4><p>{site.hours.map((h, i) => <span key={h.label}>{i > 0 && <br />}{h.label}: {h.text}</span>)}</p></div>
                <div><h4>Телефон</h4><p>{site.phones.map((p, i) => <span key={p.tel}>{i > 0 && <br />}{p.label}: <a href={`tel:${p.tel}`}>{p.show}</a></span>)}</p></div>
                <div className="links">
                  <a className="btn ghost" href={site.instagram} target="_blank" rel="noopener">Instagram</a>
                  <a className="btn ghost" href={route} target="_blank" rel="noopener">Проложить маршрут</a>
                </div>
              </div>
              <div className="map">
                <iframe title="Мы на карте" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(site.map)}&z=16&hl=ru&output=embed`} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span className="logo">{site.name}</span>
        {site.kind} · {site.city}
        <br />
        <a className="staff" href="/admin">Вход для сотрудников</a>
      </footer>
    </div>
  );
}
