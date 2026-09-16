import type { ReactNode } from "react";
import type { Company, Health } from "./data";

export const healthLabel: Record<Health, string> = {
  healthy: "Healthy",
  attention: "Attention",
  critical: "Critical",
};

const healthClasses: Record<Health, string> = {
  healthy: "bg-healthy-bg text-healthy",
  attention: "bg-attention-bg text-attention",
  critical: "bg-critical-bg text-critical",
};

const healthDot: Record<Health, string> = {
  healthy: "bg-healthy",
  attention: "bg-attention",
  critical: "bg-critical",
};

/* ── Health indicators ──────────────────────────────────────────── */

export function HealthDot({ h, className = "" }: { h: Health; className?: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${healthDot[h]} ${className}`}
    />
  );
}

export function StatusBadge({ h, children }: { h: Health; children?: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-semibold leading-none ${healthClasses[h]}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${healthDot[h]}`} />
      {children ?? healthLabel[h]}
    </span>
  );
}

/* ── Chip / tag ─────────────────────────────────────────────────── */

export function Chip({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "info" | "accent" | "primary";
}) {
  const tones = {
    muted: "bg-secondary text-secondary-foreground",
    info: "bg-info-bg text-info",
    accent: "bg-accent/10 text-accent",
    primary: "bg-primary/8 text-primary",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-medium leading-none ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ── Company tag ────────────────────────────────────────────────── */

const companyTone: Record<string, string> = {
  USV: "border-[#1A3D8F]/30 text-[#1A3D8F] bg-[#1A3D8F]/6",
  CANONIC: "border-[#3580B5]/30 text-[#3580B5] bg-[#3580B5]/6",
  "USV + CANONIC": "border-info/30 text-info bg-info-bg",
};

export function CompanyTag({ company }: { company: Company }) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border px-1.5 py-[2px] font-mono text-[9px] font-bold uppercase tracking-[0.1em] ${companyTone[company]}`}
    >
      {company}
    </span>
  );
}

/* ── Card ───────────────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-[var(--radius)] border border-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ── Section header ─────────────────────────────────────────────── */

export function SectionHead({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">
          {title}
        </h3>
        {hint && (
          <span className="truncate text-[11px] text-muted-foreground/60">
            · {hint}
          </span>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Progress bar ───────────────────────────────────────────────── */

export function Progress({
  planned,
  actual,
}: {
  planned: number;
  actual: number;
}) {
  const variance = actual - planned;
  const behind = variance < 0;
  return (
    <div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {/* Planned track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-border-strong/60"
          style={{ width: `${Math.min(planned, 100)}%` }}
        />
        {/* Actual */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all ${
            behind ? "bg-critical" : "bg-healthy"
          }`}
          style={{ width: `${Math.min(actual, 100)}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>Plan {planned}%</span>
        <span className={`font-semibold ${behind ? "text-critical" : "text-healthy"}`}>
          Actual {actual}%{" "}
          <span className="font-normal opacity-70">
            ({variance > 0 ? "+" : ""}
            {variance}pp)
          </span>
        </span>
      </div>
    </div>
  );
}

/* ── Priority dot ───────────────────────────────────────────────── */

export function PriorityDot({ p }: { p: "Urgent" | "High" | "Normal" }) {
  const c =
    p === "Urgent"
      ? "bg-critical shadow-[0_0_0_2px_rgba(220,38,38,0.2)]"
      : p === "High"
        ? "bg-attention shadow-[0_0_0_2px_rgba(217,119,6,0.15)]"
        : "bg-border-strong";
  return <span className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${c}`} title={p} />;
}

/* ── Skeleton loaders ───────────────────────────────────────────── */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-[4px] bg-muted ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-0 divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-48 flex-1" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/* ── Pagination ─────────────────────────────────────────────────── */

export function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-[11px] text-muted-foreground">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex h-7 w-7 items-center justify-center rounded border border-border text-[11px] text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        {visiblePages.map((p, i) => {
          const prev = visiblePages[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-[11px] text-muted-foreground">…</span>}
              <button
                onClick={() => onChange(p)}
                className={`flex h-7 w-7 items-center justify-center rounded border text-[11px] font-medium transition-colors ${
                  p === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-7 w-7 items-center justify-center rounded border border-border text-[11px] text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon?: any;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground/50" strokeWidth={1.5} />
        </div>
      )}
      <p className="font-display text-[15px] font-bold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-[12px] leading-relaxed text-muted-foreground">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ── CSV export ─────────────────────────────────────────────────── */

export function exportCSV(filename: string, rows: Record<string, string | number | undefined>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => {
        const v = r[h] ?? "";
        return typeof v === "string" && (v.includes(",") || v.includes('"'))
          ? `"${v.replace(/"/g, '""')}"`
          : String(v);
      }).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
