"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice, type MenuDish } from "@/lib/api";
import { useMedia } from "@/lib/useMedia";

type Pos = { x: number; y: number; r: number; s: number; o: number };
type Phase = "scatter" | "line" | "circle";

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = () => Math.random() - 0.5;
const scatterPos = (): Pos => ({ x: rnd() * 1500, y: rnd() * 1000, r: rnd() * 180, s: 0.6, o: 0 });

/**
 * Витрина меню: карточки блюд разлетаются, собираются в линию и круг,
 * а прокрутка страницы превращает круг в арку внизу экрана и ведёт её.
 * Смена вкладки меняет `dishes` — новые карточки прилетают на свои места.
 */
export function MenuShowcase({ dishes, lead }: { dishes: MenuDish[]; lead: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  // состояние анимации живёт вне React, чтобы не перерисовывать компонент 60 раз в секунду
  const anim = useRef({ cards: [] as HTMLElement[], scatter: [] as Pos[], cur: [] as Pos[] });

  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const isStatic = useMedia("(prefers-reduced-motion: reduce)");
  const canHover = useMedia("(hover: hover)");

  // новые блюда → новые карточки стартуют из разлёта
  useEffect(() => {
    const cards = [...(cardsRef.current?.children ?? [])] as HTMLElement[];
    const scatter = cards.map(scatterPos);
    anim.current = { cards, scatter, cur: scatter.map((p) => ({ ...p })) };
  }, [dishes]);

  useEffect(() => {
    if (isStatic) return;
    const sc = sectionRef.current!, stage = stageRef.current!;

    let phase: Phase = "scatter", started = false, running = false, raf = 0;
    let morph = 0, turn = 0, par = 0, mouse = 0, last = 0;
    const timers: number[] = [];

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      mouse = ((e.clientX - r.left) / r.width * 2 - 1) * 100;
    };
    stage.addEventListener("mousemove", onMove);

    function targets(W: number, H: number): Pos[] {
      const { cards, scatter } = anim.current;
      const N = cards.length;
      if (phase === "scatter" || !N) return scatter;
      if (phase === "line") {
        const gap = cards[0].offsetWidth + 10;
        return cards.map((_, i) => ({ x: (i - (N - 1) / 2) * gap, y: 0, r: 0, s: 1, o: 1 }));
      }
      const mobile = W < 768, big = mobile ? 1.6 : 1.7;
      const circleR = Math.min(Math.min(W, H) * 0.35, 350);
      const arcR = Math.min(W, H * 1.5) * (mobile ? 1.4 : 1.1);
      const arcCenterY = H * (mobile ? 0.18 : 0.25) + arcR;
      // мало блюд — арка уже, карточки не разбегаются по краям
      const spread = Math.min(mobile ? 100 : 130, (N - 1) * (mobile ? 8 : 10));
      const step = spread / Math.max(N - 1, 1);
      // если арка шире экрана, прокрутка ведёт её от первого блюда у левого края до последнего у правого
      const visible = Math.asin(clamp((W / 2 - cards[0].offsetWidth * big) / arcR)) * 180 / Math.PI;
      const over = Math.max(0, spread / 2 - visible);
      const shift = lerp(over, -over, turn);
      return cards.map((_, i) => {
        const ca = (i / N) * 360, cr = (ca * Math.PI) / 180;
        const aa = -90 - spread / 2 + i * step + shift, ar = (aa * Math.PI) / 180;
        return {
          x: lerp(Math.cos(cr) * circleR, Math.cos(ar) * arcR + par, morph),
          y: lerp(Math.sin(cr) * circleR, Math.sin(ar) * arcR + arcCenterY, morph),
          r: lerp(ca + 90, aa + 90, morph),
          s: lerp(1, big, morph),
          o: 1,
        };
      });
    }

    function frame(t: number) {
      const dt = Math.min((t - last) / 16.7, 3) || 1;
      last = t;
      const ease = (k: number) => 1 - Math.pow(1 - k, dt); // плавность не зависит от частоты кадров
      const H = stage.clientHeight;
      const p = clamp(-sc.getBoundingClientRect().top / (sc.offsetHeight - H));
      if (phase === "circle") {
        morph = lerp(morph, clamp(p / 0.25), ease(0.08));
        turn = lerp(turn, clamp((p - 0.25) / 0.75), ease(0.08));
      }
      par = lerp(par, mouse, ease(0.05));

      const { cards, cur } = anim.current;
      const tg = targets(stage.clientWidth, H), k = ease(0.07);
      cards.forEach((c, i) => {
        const a = cur[i], b = tg[i];
        if (!a || !b) return;
        a.x = lerp(a.x, b.x, k); a.y = lerp(a.y, b.y, k); a.r = lerp(a.r, b.r, k); a.s = lerp(a.s, b.s, k); a.o = lerp(a.o, b.o, k);
        c.style.transform = `translate(${a.x}px,${a.y}px) rotate(${a.r}deg) scale(${a.s})`;
        c.style.opacity = String(a.o);
      });

      introRef.current!.style.opacity = phase === "circle" ? String(Math.max(0, 1 - morph * 2)) : "0";
      const h = clamp((morph - 0.8) / 0.2);
      headRef.current!.style.opacity = String(h);
      headRef.current!.style.transform = `translateY(${(1 - h) * 20}px)`;
      if (running) raf = requestAnimationFrame(frame);
    }

    // анимация работает, только пока витрина на экране; вступление — один раз
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
      if (!e.isIntersecting) running = false;
      if (e.intersectionRatio >= 0.5 && !started) {
        started = true;
        timers.push(window.setTimeout(() => (phase = "line"), 500));
        timers.push(window.setTimeout(() => (phase = "circle"), 2500));
      }
    }, { threshold: [0, 0.5] });
    io.observe(stage);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      io.disconnect();
      stage.removeEventListener("mousemove", onMove);
    };
  }, [isStatic]);

  const toggle = (id: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <div ref={sectionRef} className={`showcase${isStatic ? " static" : ""}`}>
      <div ref={stageRef} className="showcase-stage">
        <div ref={introRef} className="showcase-intro" aria-hidden="true">
          <p className="h2">Меню</p>
          <small>Листайте вниз</small>
        </div>
        <div ref={headRef} className="showcase-head">
          <h2 className="h2">Меню</h2>
          <p className="lead">{lead}</p>
          <small>{canHover ? "Наведите на блюдо — увидите цену" : "Нажмите на блюдо, чтобы увидеть цену"}</small>
        </div>
        <div ref={cardsRef} className="cards" aria-hidden="true">
          {dishes.map((d) => (
            <div key={d.id} className={`card${flipped.has(d.id) ? " flipped" : ""}`} onClick={() => toggle(d.id)}>
              <div className="card-inner">
                <div className="face"><img src={d.photoUrl!} alt="" loading="lazy" /></div>
                <div className="face back"><b>{d.name}</b><span>{formatPrice(d.price)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
