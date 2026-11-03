// Небольшие общие элементы админки на Tailwind
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function Button({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      {...p}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-brass text-ink hover:bg-brass-soft",
        variant === "ghost" && "border border-brass/40 text-brass-soft hover:bg-brass/10",
        variant === "danger" && "border border-red-400/40 text-red-300 hover:bg-red-500/10",
        className,
      )}
    />
  );
}

const field = "w-full rounded-md border border-white/10 bg-ink/60 px-3 py-2 text-sm text-ivory placeholder:text-smoke/60 outline-none focus:border-brass";

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx(field, p.className)} />;
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cx(field, p.className)} />;
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cx(field, "min-h-20", p.className)} />;

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1 block text-xs tracking-wide text-smoke">{label}</span>
      {children}
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-xl border border-white/10 bg-velvet/60 p-5", className)}>{children}</div>;
}

export function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-serif text-4xl text-ivory">{children}</h1>
      {action}
    </div>
  );
}

export function ErrorText({ children }: { children?: ReactNode }) {
  return children ? <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{children}</p> : null;
}

export function Badge({ tone, children }: { tone: "new" | "ok" | "off" | "muted"; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "new" && "bg-brass/20 text-brass-soft",
        tone === "ok" && "bg-emerald-500/15 text-emerald-300",
        tone === "off" && "bg-red-500/15 text-red-300",
        tone === "muted" && "bg-white/10 text-smoke",
      )}
    >
      {children}
    </span>
  );
}
