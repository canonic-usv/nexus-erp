import React, { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  Download,
  FileText,
  Info,
  Loader2,
  Paperclip,
  Plus,
  Send,
  Shield,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { naira, projects, staffMembers, type ApprovalStep, type Company, type UserRole } from "./data";
import { type AppInvoice, type InvoiceLineItem, nairaFmt, useInvoices } from "./invoice-store";

/* ══════════════════════════════════════════════════════════
   TOAST SYSTEM
══════════════════════════════════════════════════════════ */

type ToastType = "success" | "error" | "warning" | "info";
interface ToastItem { id: string; message: string; type: ToastType }

const ToastCtx = createContext<{ show: (msg: string, type?: ToastType) => void }>({ show: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-[var(--radius)] border px-4 py-3 shadow-xl text-sm font-medium animate-in ${
              t.type === "success" ? "border-healthy/30 bg-healthy-bg text-healthy" :
              t.type === "error"   ? "border-critical/30 bg-critical-bg text-critical" :
              t.type === "warning" ? "border-attention/30 bg-attention-bg text-attention" :
              "border-primary/30 bg-primary/8 text-primary"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
            {t.type === "error"   && <AlertCircle   className="h-4 w-4 shrink-0 mt-0.5" />}
            {t.type === "warning" && <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
            {t.type === "info"    && <Info           className="h-4 w-4 shrink-0 mt-0.5" />}
            <span className="flex-1 leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL SHELL
══════════════════════════════════════════════════════════ */

export function Modal({
  open, onClose, title, size = "md", children,
}: { open: boolean; onClose: () => void; title: string; size?: "sm" | "md" | "lg" | "xl"; children: ReactNode }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, [open]);

  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-[5vh] pb-10 bg-foreground/30 backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={modalRef}
        className={`w-full ${widths[size]} bg-card rounded-[var(--radius)] border border-border shadow-2xl flex flex-col animate-in`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-display text-base font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-muted-foreground hover:bg-panel hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DIRECTIVE TAG  — shows who issued an action directive
══════════════════════════════════════════════════════════ */

export function DirectiveTag({ directedBy }: { directedBy: string }) {
  return (
    <div className="flex items-start gap-1.5 rounded-[5px] border border-primary/15 bg-primary/5 px-2.5 py-1.5 text-[11px]">
      <ArrowDownRight className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
      <span>
        <span className="font-semibold text-primary/80">Directive from: </span>
        <span className="text-muted-foreground">{directedBy}</span>
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   APPROVAL DETAIL MODAL — reusable across all dashboards
══════════════════════════════════════════════════════════ */

export interface ApprovalDetailItem {
  id: string;
  title: string;
  type: string;
  project?: string;
  company?: Company;
  amount?: number;
  submitted?: string;
  requesterName?: string;
  requesterTitle?: string;
  notes?: string;
  chain?: ApprovalStep[];
  directedBy?: string;
  status?: string;
  disbursedBy?: string;
  disbursedAt?: string;
  /** Extra context rows shown in the detail table */
  meta?: { label: string; value: string }[];
}

const stepActionLabel: Record<string, string> = {
  pending: "Awaiting",
  approved: "Approved",
  rejected: "Rejected",
  final: "Final Decision",
};
const stepActionClass: Record<string, string> = {
  pending: "border-border bg-muted text-muted-foreground",
  approved: "border-healthy/30 bg-healthy-bg text-healthy",
  rejected: "border-critical/30 bg-critical-bg text-critical",
  final: "border-primary/30 bg-primary/8 text-primary",
};

export function ApprovalDetailModal({
  item,
  onClose,
}: {
  item: ApprovalDetailItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [item, onClose]);

  if (!item) return null;

  const overallStatus = item.status ?? "pending";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-foreground/30 px-4 pt-[5vh] pb-8 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="animate-in flex w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start gap-3 border-b border-border px-5 py-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-muted-foreground">{item.id}</span>
              <span className="rounded border border-border bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {item.type}
              </span>
              {overallStatus === "disbursed" && (
                <span className="rounded-full border border-healthy/30 bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">
                  Disbursed
                </span>
              )}
              {overallStatus === "approved" && (
                <span className="rounded-full border border-healthy/30 bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">
                  Approved
                </span>
              )}
              {overallStatus === "rejected" && (
                <span className="rounded-full border border-critical/30 bg-critical-bg px-2 py-0.5 text-[10px] font-semibold text-critical">
                  Rejected
                </span>
              )}
              {(overallStatus === "pending" || overallStatus === "in-review") && (
                <span className="rounded-full border border-attention/30 bg-attention-bg px-2 py-0.5 text-[10px] font-semibold text-attention">
                  In Review
                </span>
              )}
            </div>
            <p className="font-display text-base font-bold text-foreground">{item.title}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded p-1 text-muted-foreground hover:bg-panel hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-5" style={{ maxHeight: "calc(85vh - 120px)" }}>
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
            {item.project && (
              <>
                <span className="text-muted-foreground">Project</span>
                <span className="font-medium">{item.project}</span>
              </>
            )}
            {item.company && (
              <>
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{item.company}</span>
              </>
            )}
            {item.amount != null && (
              <>
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono font-bold text-foreground">{naira(item.amount)}</span>
              </>
            )}
            {item.submitted && (
              <>
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium">{item.submitted}</span>
              </>
            )}
            {item.requesterName && (
              <>
                <span className="text-muted-foreground">Requested by</span>
                <span className="font-medium">{item.requesterName}{item.requesterTitle ? ` · ${item.requesterTitle}` : ""}</span>
              </>
            )}
            {(item.meta ?? []).map(m => (
              <React.Fragment key={m.label}>
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-medium">{m.value}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Directive source */}
          {item.directedBy && (
            <div className="rounded-[5px] border border-primary/15 bg-primary/5 px-3 py-2 text-[11px]">
              <div className="flex items-start gap-1.5">
                <ArrowDownRight className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
                <span>
                  <span className="font-semibold text-primary/80">Directive from: </span>
                  <span className="text-muted-foreground">{item.directedBy}</span>
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="rounded-[5px] bg-panel px-3 py-2.5 text-[12px] text-muted-foreground">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/60">Notes</p>
              {item.notes}
            </div>
          )}

          {/* Approval chain */}
          {item.chain && item.chain.length > 0 && (
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Approval Chain: {item.chain.filter(s => s.action === "approved" || s.action === "final").length} of {item.chain.length} completed
              </p>
              <div className="space-y-0">
                {item.chain.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Vertical connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                          step.action === "approved" || step.action === "final"
                            ? "border-healthy bg-healthy-bg text-healthy"
                            : step.action === "rejected"
                            ? "border-critical bg-critical-bg text-critical"
                            : "border-border bg-panel text-muted-foreground"
                        }`}
                      >
                        {step.action === "approved" || step.action === "final" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : step.action === "rejected" ? (
                          <X className="h-3.5 w-3.5" />
                        ) : (
                          <CircleDot className="h-3.5 w-3.5" />
                        )}
                      </div>
                      {i < item.chain!.length - 1 && (
                        <div className="my-1 w-px flex-1 bg-border" style={{ minHeight: "12px" }} />
                      )}
                    </div>
                    {/* Step content */}
                    <div className="pb-4 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-semibold text-foreground">{step.staffName}</span>
                        <span className="text-[10px] text-muted-foreground">{step.staffTitle}</span>
                        {step.isFinal && (
                          <span className="rounded bg-primary/8 px-1.5 py-[2px] font-mono text-[9px] font-bold uppercase tracking-wide text-primary">
                            Final Authority
                          </span>
                        )}
                        <span
                          className={`ml-auto rounded border px-2 py-[2px] text-[10px] font-semibold ${stepActionClass[step.action]}`}
                        >
                          {stepActionLabel[step.action]}
                        </span>
                      </div>
                      {step.note && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 italic">"{step.note}"</p>
                      )}
                      {step.timestamp && (
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                          <Clock className="h-2.5 w-2.5" /> {step.timestamp}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disbursement */}
          {item.disbursedBy && (
            <div className="rounded-[5px] border border-healthy/20 bg-healthy-bg px-3 py-2.5 text-[12px]">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-healthy">Finance Disbursement</p>
              <p className="text-foreground">
                Processed by <span className="font-semibold">{item.disbursedBy}</span>
                {item.disbursedAt && <span className="text-muted-foreground"> · {item.disbursedAt}</span>}
              </p>
            </div>
          )}

          {/* No chain fallback */}
          {(!item.chain || item.chain.length === 0) && !item.disbursedBy && (
            <div className="rounded-[5px] bg-panel px-3 py-4 text-center text-[12px] text-muted-foreground">
              <UserCheck className="mx-auto mb-2 h-5 w-5 opacity-40" />
              Approval chain details will appear once the request is submitted.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border bg-panel px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-[var(--radius)] border border-border px-4 py-2 text-[12px] font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FORM PRIMITIVES
══════════════════════════════════════════════════════════ */

function FieldHint({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground hover:bg-border"
        aria-label="Field help"
      >
        ?
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 z-50 mb-1.5 w-52 -translate-x-1/2 rounded-[6px] border border-border bg-card px-3 py-2 text-[11px] leading-snug text-foreground shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

export function FormBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4 p-5">{children}</div>;
}

export function FormFooter({ children }: { children: ReactNode }) {
  return <div className="flex justify-end gap-2 border-t border-border px-5 py-4 shrink-0 bg-panel">{children}</div>;
}

export function FormField({ label, required, hint, labelExtra, children }: { label: string; required?: boolean; hint?: string; labelExtra?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}{required && <span className="ml-0.5 text-critical">*</span>}
        </label>
        {labelExtra}
      </div>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full rounded border border-border bg-panel px-3 py-2.5 text-sm outline-none focus:border-primary transition placeholder:text-muted-foreground/50";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputCls} {...props} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputCls} resize-none`} rows={3} {...props} />;
}

export function FormSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={inputCls} {...props}>{children}</select>;
}

export function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-border-strong hover:text-foreground">
      Cancel
    </button>
  );
}

export function SubmitBtn({ loading, label = "Submit", tone = "primary" }: { loading?: boolean; label?: string; tone?: "primary" | "critical" | "attention" }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded px-5 py-2 text-sm font-semibold transition disabled:opacity-60 hover:opacity-90 ${
        tone === "critical" ? "bg-critical text-white" :
        tone === "attention" ? "bg-attention text-white" :
        "bg-primary text-primary-foreground"
      }`}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   FILE UPLOAD COMPONENT
══════════════════════════════════════════════════════════ */

export function FileUpload({
  label = "files", accept, multiple = true, onFiles,
}: { label?: string; accept?: string; multiple?: boolean; onFiles?: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const ref = useRef<HTMLInputElement>(null);

  const handle = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    setFiles(prev => {
      const next = multiple ? [...prev, ...arr] : arr;
      onFiles?.(next);
      return next;
    });
    arr.forEach((f, offset) => {
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = e => {
          const idx = files.length + offset;
          setPreviews(prev => ({ ...prev, [idx]: e.target?.result as string }));
        };
        reader.readAsDataURL(f);
      }
    });
  };

  const remove = (i: number) => {
    setFiles(prev => {
      const next = prev.filter((_, j) => j !== i);
      onFiles?.(next);
      return next;
    });
    setPreviews(prev => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => ref.current?.click()}
        onKeyDown={e => e.key === "Enter" && ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handle(e.dataTransfer.files); }}
        className="cursor-pointer rounded border-2 border-dashed border-border bg-panel p-5 text-center transition hover:border-primary/50 hover:bg-primary/5"
      >
        <Upload className="mx-auto h-5 w-5 text-muted-foreground mb-1.5" />
        <p className="text-sm font-medium text-muted-foreground">Click or drag to upload {label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{accept ? accept.replace(/\./g, "").toUpperCase().split(",").join(" · ") : "Any format"} · Max 10 MB each</p>
      </div>
      <input ref={ref} type="file" className="hidden" accept={accept} multiple={multiple} onChange={e => handle(e.target.files)} />
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2">
              {previews[i]
                ? <img src={previews[i]} alt="" className="h-8 w-8 rounded object-cover border border-border shrink-0" />
                : <FileText className="h-4 w-4 shrink-0 text-primary" />}
              <span className="flex-1 truncate text-xs font-medium">{f.name}</span>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={() => remove(i)} aria-label="Remove file" className="shrink-0 text-muted-foreground hover:text-critical">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AUDIT TRAIL COMPONENT
══════════════════════════════════════════════════════════ */

export interface AuditEntry {
  action: string;
  user: string;
  role: string;
  timestamp: string;
  note?: string;
}

export function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.map((e, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
            {i < entries.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
          </div>
          <div className="pb-3 min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[13px] font-semibold">{e.action}</span>
              <span className="text-[11px] text-muted-foreground">{e.timestamp}</span>
            </div>
            <p className="text-[12px] text-muted-foreground">{e.user} · {e.role}</p>
            {e.note && <p className="mt-0.5 text-[12px] text-foreground/70 italic">{e.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROCUREMENT STAGE GATES
══════════════════════════════════════════════════════════ */

const STAGE_GATES: Record<string, { label: string; items: string[] }> = {
  "Request": { label: "Request Stage", items: ["Purchase request approved", "Budget code confirmed", "Technical specifications attached"] },
  "Tendering": { label: "Tendering Stage", items: ["Tender documents prepared", "Minimum 3 vendors invited", "Pre-qualification completed"] },
  "Evaluation": { label: "Evaluation Stage", items: ["Technical evaluation complete", "Commercial evaluation complete", "Evaluation report signed"] },
  "Award": { label: "Award Stage", items: ["Board/MD approval obtained", "Letter of award issued", "Contract terms agreed"] },
  "Execution": { label: "Execution Stage", items: ["Advance payment processed", "Site mobilization confirmed", "Quality plan submitted"] },
};

function StageGateChecklist({ stage }: { stage: string }) {
  const gate = STAGE_GATES[stage] ?? STAGE_GATES["Request"];
  const allItems = gate.items;
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (item: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item); else next.add(item);
      return next;
    });
  };

  const progress = Math.round((checked.size / allItems.length) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-muted-foreground uppercase tracking-wide">{gate.label}</span>
        <span className={`font-mono font-bold ${progress === 100 ? "text-healthy" : "text-primary"}`}>{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${progress === 100 ? "bg-healthy" : "bg-primary"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-1.5 pt-1">
        {allItems.map(item => (
          <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked.has(item)}
              onChange={() => toggle(item)}
              className="h-3.5 w-3.5 rounded accent-primary shrink-0"
            />
            <span className={`text-[12px] ${checked.has(item) ? "line-through text-muted-foreground" : "text-foreground"}`}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ACTION MODAL — approve / return / escalate / delegate
══════════════════════════════════════════════════════════ */

export function ActionModal({
  open, onClose, title, actionLabel, tone = "primary", context, showFileUpload = false, onConfirm,
}: {
  open: boolean; onClose: () => void; title: string; actionLabel: string;
  tone?: "primary" | "critical" | "attention"; context?: string;
  showFileUpload?: boolean; onConfirm: (comment: string, files: File[]) => void;
}) {
  const { show } = useToast();
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onConfirm(comment, files);
    setComment(""); setFiles([]); setLoading(false);
    if (tone === "critical") {
      show("Item rejected and returned to requester", "info");
    } else {
      show("Approval submitted successfully", "success");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={submit}>
        <FormBody>
          {context && (
            <div className="rounded border border-border bg-panel px-3 py-2.5 text-sm text-foreground">
              {context}
            </div>
          )}
          <FormField label="Comment / Decision Reason" required>
            <Textarea
              value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Provide your comment or reason for this decision…"
              required rows={4}
            />
          </FormField>
          {showFileUpload && (
            <FormField label="Supporting Documents (Optional)">
              <FileUpload label="attachments" onFiles={setFiles} />
            </FormField>
          )}
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <button
            type="submit" disabled={loading || !comment.trim()}
            className={`inline-flex items-center gap-2 rounded px-5 py-2 text-sm font-semibold transition disabled:opacity-50 hover:opacity-90 ${
              tone === "critical" ? "bg-critical text-white" :
              tone === "attention" ? "bg-attention text-white" :
              "bg-primary text-primary-foreground"
            }`}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {actionLabel}
          </button>
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   SITE REPORT FORM
══════════════════════════════════════════════════════════ */

export function SiteReportModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false); onClose();
    show(`Site report SR-PRJ001-${83 + Math.floor(Math.random() * 10)} submitted. Routed to Project Manager for review.`);
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Submit Daily Site Report" size="lg">
      <form onSubmit={submit}>
        <FormBody>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Project" required>
              <FormSelect defaultValue="PRJ-USV-2026-0015">
                {projects.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
              </FormSelect>
            </FormField>
            <FormField label="Date" required><Input type="date" defaultValue={today} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Supervisor (Author)" required>
              <Input defaultValue="Engr. James Oyelaran" />
            </FormField>
            <FormField label="Personnel on Site" required>
              <Input type="number" placeholder="e.g. 24" min="0" required />
            </FormField>
          </div>
          <FormField label="Work Completed Today" required>
            <Textarea placeholder="Describe completed activities: areas, quantities, trade…" rows={3} required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Materials Received / Used">
              <Textarea placeholder="List materials with quantities…" rows={2} />
            </FormField>
            <FormField label="Equipment on Site">
              <Textarea placeholder="Plant and equipment deployed…" rows={2} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Overall Progress (%)">
              <Input type="number" placeholder="68" min="0" max="100" />
            </FormField>
            <FormField label="Weather Conditions">
              <FormSelect>
                <option>Clear: good working conditions</option>
                <option>Partly cloudy</option>
                <option>Overcast: work continues</option>
                <option>Rain: some delay</option>
                <option>Heavy rain: work suspended</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Issues / Problems">
            <Textarea placeholder="Any issues, delays, safety incidents, blockers…" rows={2} />
          </FormField>
          <FormField label="Required Action / Recommendations">
            <Textarea placeholder="What needs to happen next or who needs to act…" rows={2} />
          </FormField>
          <FormField label="Site Photos">
            <FileUpload label="site photos" accept="image/*" onFiles={() => {}} />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Submit Report" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   MATERIAL / SERVICE REQUEST
══════════════════════════════════════════════════════════ */

export function MaterialRequestModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const calcTotal = parseFloat(qty) * parseFloat(unitPrice);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 950));
    const ref = `PR-USV-2026-0${82 + Math.floor(Math.random() * 8)}`;
    setLoading(false); onClose();
    show("Material request submitted for approval", "success");
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Material / Service Request" size="lg">
      <form onSubmit={submit}>
        <FormBody>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Project" required>
              <FormSelect defaultValue="PRJ-USV-2026-0015">
                {projects.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
              </FormSelect>
            </FormField>
            <FormField label="Request Type" required>
              <FormSelect>
                <option>Material / Goods</option>
                <option>Service / Works</option>
                <option>Equipment Hire</option>
                <option>Fuel / Consumables</option>
                <option>Subcontract Works</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Description of Item / Service" required>
            <Input placeholder="e.g. Reinforcement steel Y16, 12 tonnes" required />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Quantity">
              <Input type="number" placeholder="12" min="1" value={qty} onChange={e => setQty(e.target.value)} />
            </FormField>
            <FormField label="Unit" labelExtra={<FieldHint text="Standard SI units: kg, tonnes, m, m², m³, No. (for counted items), L, bags." />}>
              <FormSelect>
                <option>Tonnes</option><option>Litres</option><option>Bags</option>
                <option>Units</option><option>m³</option><option>m²</option>
                <option>Metres</option><option>Lump Sum</option>
              </FormSelect>
            </FormField>
            <FormField label="Unit Price (₦)">
              <Input type="number" placeholder="0" min="0" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
            </FormField>
          </div>
          {qty && unitPrice && !isNaN(calcTotal) && (
            <div className="flex items-center justify-between rounded-[var(--radius)] bg-primary/5 border border-primary/20 px-3 py-2">
              <span className="text-[12px] text-muted-foreground">Estimated Total</span>
              <span className="font-mono font-bold text-primary">₦{calcTotal.toLocaleString()}</span>
            </div>
          )}
          <FormField label="Urgency" required>
            <FormSelect>
              <option>Standard: within 7 days</option>
              <option>Urgent: within 48 hours</option>
              <option>Critical: same day (work blocked)</option>
            </FormSelect>
          </FormField>
          <FormField label="Justification" required>
            <Textarea placeholder="Why is this needed? What work will it enable?" required rows={2} />
          </FormField>
          <FormField label="Suggested Vendor (Optional)">
            <Input placeholder="e.g. Julius Steel Ltd" />
          </FormField>
          <FormField label="Attachments (BOQ, specs, reference drawing)">
            <FileUpload label="supporting documents" accept=".pdf,.xlsx,.dwg,.jpg,.png" />
          </FormField>

          <div className="space-y-2 rounded border border-border p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Stage Gate Checklist: Request Stage</p>
            <StageGateChecklist stage="Request" />
          </div>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Submit Request" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   ISSUE LOG
══════════════════════════════════════════════════════════ */

export function IssueLogModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 850));
    setLoading(false); onClose();
    show(`Issue ISS-${100 + Math.floor(Math.random() * 50)} logged and assigned to Project Manager.`, "warning");
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Issue" size="md">
      <form onSubmit={submit}>
        <FormBody>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Project" required>
              <FormSelect>{projects.map(p => <option key={p.code}>{p.name}</option>)}</FormSelect>
            </FormField>
            <FormField label="Category" required>
              <FormSelect>
                <option>Design / Drawing</option>
                <option>Procurement / Materials</option>
                <option>Site / Construction</option>
                <option>Resources / Staffing</option>
                <option>Finance / Payment</option>
                <option>Client</option>
                <option>Safety / HSE</option>
                <option>Schedule / Programme</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Issue Description" required>
            <Textarea placeholder="Clearly describe the issue, its cause and current impact on works…" rows={4} required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Severity" required>
              <FormSelect>
                <option>Critical: works blocked</option>
                <option>High: significant impact</option>
                <option>Medium: monitoring required</option>
                <option>Low: minor</option>
              </FormSelect>
            </FormField>
            <FormField label="Resolution Deadline">
              <Input type="date" />
            </FormField>
          </div>
          <FormField label="Recommended Action">
            <Textarea placeholder="What action should resolve this issue?" rows={2} />
          </FormField>
          <FormField label="Evidence / Photos">
            <FileUpload label="evidence photos or documents" accept="image/*,.pdf" />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Log Issue" tone="critical" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   PROGRESS UPDATE
══════════════════════════════════════════════════════════ */

export function ProgressUpdateModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 750));
    setLoading(false); onClose();
    show("Progress update recorded. Project health dashboard recalculated.");
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Project Progress" size="md">
      <form onSubmit={submit}>
        <FormBody>
          <FormField label="Project" required>
            <FormSelect>{projects.map(p => <option key={p.code}>{p.name}</option>)}</FormSelect>
          </FormField>
          <FormField label="Work Package / Section" required>
            <Input placeholder="e.g. Block C, Superstructure, Level 2" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Actual Progress (%)" required>
              <Input type="number" placeholder="68" min="0" max="100" required />
            </FormField>
            <FormField label="Planned Progress (%)">
              <Input type="number" placeholder="72" min="0" max="100" />
            </FormField>
          </div>
          <FormField label="Reason for Variance (if any)">
            <Textarea placeholder="Explain any gap between planned and actual progress…" rows={2} />
          </FormField>
          <FormField label="Next Milestone">
            <Input placeholder="e.g. Superstructure complete, 22 Sep 2026" />
          </FormField>
          <FormField label="Evidence (photos / measurement sheets)">
            <FileUpload label="supporting evidence" accept="image/*,.pdf,.xlsx" onFiles={() => {}} />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Record Update" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   INSPECTION RECORD
══════════════════════════════════════════════════════════ */

export function InspectionModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [result, setResult] = useState<"pass" | "conditional" | "fail">("pass");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 950));
    setLoading(false); onClose();
    show(
      result === "pass" ? "Inspection PASSED. Record created and team notified." :
      result === "fail" ? "Inspection FAILED. Snag list created. Contractor notified to remediate." :
      "Inspection conditionally passed. Snag items logged for follow-up.",
      result === "fail" ? "error" : result === "conditional" ? "warning" : "success"
    );
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Record Inspection" size="lg">
      <form onSubmit={submit}>
        <FormBody>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Inspection Type" required>
              <FormSelect>
                <option>Foundation / Piling</option>
                <option>Reinforcement Pre-pour</option>
                <option>Concrete Pour</option>
                <option>Blockwork / Masonry</option>
                <option>Structural Frame</option>
                <option>Roofing</option>
                <option>MEP Rough-in</option>
                <option>Finishes</option>
                <option>HSE / Safety Walk</option>
                <option>Pre-handover</option>
              </FormSelect>
            </FormField>
            <FormField label="Location / Grid Ref" required>
              <Input placeholder="e.g. Block C, Ground Floor, Grid A–D" required />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Project" required>
              <FormSelect>{projects.map(p => <option key={p.code}>{p.name}</option>)}</FormSelect>
            </FormField>
            <FormField label="Inspector">
              <Input defaultValue="Engr. James Oyelaran" />
            </FormField>
          </div>
          <FormField label="Findings" required>
            <Textarea placeholder="What was inspected? Detailed observations and measurements…" rows={3} required />
          </FormField>
          <FormField label="Result" required>
            <div className="flex gap-2">
              {(["pass", "conditional", "fail"] as const).map(r => (
                <button
                  key={r} type="button" onClick={() => setResult(r)}
                  className={`flex-1 rounded border py-2.5 text-sm font-semibold transition ${
                    result === r
                      ? r === "pass" ? "border-healthy/40 bg-healthy-bg text-healthy"
                        : r === "fail" ? "border-critical/40 bg-critical-bg text-critical"
                        : "border-attention/40 bg-attention-bg text-attention"
                      : "border-border bg-panel text-muted-foreground hover:border-border-strong"
                  }`}
                >
                  {r === "pass" ? "✓ Pass" : r === "fail" ? "✗ Fail" : "~ Conditional"}
                </button>
              ))}
            </div>
          </FormField>
          {(result === "fail" || result === "conditional") && (
            <FormField label="Snag Items / Remedial Action Required">
              <Textarea placeholder="List each item requiring remedial work or correction…" rows={3} />
            </FormField>
          )}
          <FormField label="Inspection Photos">
            <FileUpload label="inspection photos" accept="image/*" onFiles={() => {}} />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Submit Inspection Record" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   PHOTO UPLOAD
══════════════════════════════════════════════════════════ */

export function PhotoUploadModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); onClose();
    show(`${fileCount || 1} site photo${fileCount !== 1 ? "s" : ""} uploaded and linked to project record.`);
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Site Photos" size="md">
      <form onSubmit={submit}>
        <FormBody>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Project" required>
              <FormSelect>{projects.map(p => <option key={p.code}>{p.name}</option>)}</FormSelect>
            </FormField>
            <FormField label="Category">
              <FormSelect>
                <option>General Progress</option>
                <option>Structural Works</option>
                <option>Foundation</option>
                <option>Blockwork / Masonry</option>
                <option>Roofing</option>
                <option>MEP / Services</option>
                <option>Finishes</option>
                <option>Material Delivery</option>
                <option>Site Safety</option>
                <option>Issues / Defects</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Photos" required>
            <FileUpload label="site photos (JPG, PNG)" accept="image/*" onFiles={f => setFileCount(f.length)} />
          </FormField>
          <FormField label="Caption / Notes">
            <Textarea placeholder="Brief description of what is shown in the photos…" rows={2} />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Upload Photos" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   LEAVE REQUEST
══════════════════════════════════════════════════════════ */

export function LeaveRequestModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false); onClose();
    show("Leave request submitted. Pending line manager approval. You will be notified within 24 hours.");
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Leave Request" size="md">
      <form onSubmit={submit}>
        <FormBody>
          <FormField label="Leave Type" required>
            <FormSelect>
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Emergency Leave</option>
              <option>Maternity Leave</option>
              <option>Paternity Leave</option>
              <option>Study Leave</option>
              <option>Compassionate Leave</option>
            </FormSelect>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date" required><Input type="date" required /></FormField>
            <FormField label="End Date" required><Input type="date" required /></FormField>
          </div>
          <FormField label="Handover To (delegate)">
            <FormSelect>
              <option value="">No handover required</option>
              {staffMembers.slice(0, 15).map(s => <option key={s.id} value={s.id}>{s.name}, {s.title}</option>)}
            </FormSelect>
          </FormField>
          <FormField label="Reason / Notes">
            <Textarea placeholder="Optional: reason or notes for record (sick leave requires medical certificate)" rows={3} />
          </FormField>
          <FormField label="Supporting Document (e.g. medical certificate)">
            <FileUpload label="document" multiple={false} accept=".pdf,.jpg,.jpeg,.png" />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Submit Leave Request" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   WELFARE REQUEST
══════════════════════════════════════════════════════════ */

export function WelfareRequestModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ref = `WEL-2026-0${24 + Math.floor(Math.random() * 5)}`;
    setLoading(false); onClose();
    show(`Welfare request ${ref} submitted. HR will review and respond within 3 working days.`);
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Welfare Request" size="md">
      <form onSubmit={submit}>
        <FormBody>
          <FormField label="Request Type" required>
            <FormSelect>
              <option>Medical Reimbursement</option>
              <option>Emergency Assistance</option>
              <option>HMO / Hospital Top-up</option>
              <option>Staff Welfare Fund</option>
              <option>Training / Development Sponsorship</option>
              <option>Other Benefit</option>
            </FormSelect>
          </FormField>
          <FormField label="Description" required>
            <Textarea placeholder="Describe your request fully: include dates, circumstances, and amounts…" rows={4} required />
          </FormField>
          <FormField label="Amount Requested (₦)">
            <Input type="number" placeholder="0" min="0" />
          </FormField>
          <FormField label="Supporting Evidence" required hint="Receipts, medical reports, prescriptions, etc.">
            <FileUpload label="supporting documents or receipts" accept=".pdf,.jpg,.jpeg,.png" />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Submit Request" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   DOCUMENT UPLOAD
══════════════════════════════════════════════════════════ */

export interface UploadedDoc {
  n: string; t: string; disc: string; ver: string; st: string; h: "healthy" | "attention" | "critical"; isNew?: boolean;
}

export function DocumentUploadModal({
  open, onClose, onSuccess,
}: { open: boolean; onClose: () => void; onSuccess: (doc: UploadedDoc) => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [disc, setDisc] = useState("General");
  const [docType, setDocType] = useState("Drawing");
  const [ver, setVer] = useState("Rev A");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1300));
    const id = `DOC-${Date.now().toString().slice(-6)}`;
    setLoading(false);
    onSuccess({ n: id, t: title || selectedFile.name, disc, ver, st: "Draft", h: "healthy", isNew: true });
    onClose();
    show(`"${title || selectedFile.name}" uploaded and registered. Pending review.`);
    setSelectedFile(null); setTitle("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Document" size="lg">
      <form onSubmit={submit}>
        <FormBody>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Document Type" required>
              <FormSelect value={docType} onChange={e => setDocType(e.target.value)}>
                <option>Drawing</option><option>Contract</option><option>Specification</option>
                <option>BOQ</option><option>Site Report</option><option>Invoice</option>
                <option>Purchase Order</option><option>Correspondence</option><option>Certificate</option>
                <option>Meeting Minutes</option><option>Other</option>
              </FormSelect>
            </FormField>
            <FormField label="Discipline">
              <FormSelect value={disc} onChange={e => setDisc(e.target.value)}>
                <option>Architecture</option><option>Structural Engineering</option>
                <option>Quantity Surveying</option><option>Site Operations</option>
                <option>Procurement</option><option>Finance</option><option>HR / Legal</option><option>General</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Document Title" required>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Ground Floor General Arrangement, Rev D" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Project">
              <FormSelect>
                <option value="">Group / General</option>
                {projects.map(p => <option key={p.code}>{p.name}</option>)}
              </FormSelect>
            </FormField>
            <FormField label="Version / Revision">
              <Input value={ver} onChange={e => setVer(e.target.value)} placeholder="e.g. Rev D, v4.2, Issue 3" />
            </FormField>
          </div>
          <FormField label="File" required>
            <FileUpload
              label="document (PDF, Word, Excel, DWG, image)"
              accept=".pdf,.doc,.docx,.xlsx,.xls,.dwg,.dxf,.jpg,.jpeg,.png"
              multiple={false}
              onFiles={fs => setSelectedFile(fs[0] ?? null)}
            />
          </FormField>
          <FormField label="Notes">
            <Textarea placeholder="Any notes about this version or superseding information…" rows={2} />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <button
            type="submit" disabled={loading || !selectedFile}
            className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Uploading…</> : "Upload Document"}
          </button>
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   NEW OPPORTUNITY / TENDER
══════════════════════════════════════════════════════════ */

export function NewOpportunityModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const ref = `OPP-2026-0${13 + Math.floor(Math.random() * 5)}`;
    setLoading(false); onClose();
    show(`Opportunity ${ref} added to pipeline. BD Officer notified.`);
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Opportunity / Tender" size="lg">
      <form onSubmit={submit}>
        <FormBody>
          <FormField label="Opportunity Name" required>
            <Input placeholder="e.g. Abuja Federal Secretariat Extension" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Client / Organisation" required>
              <Input placeholder="e.g. Federal Ministry of Works" required />
            </FormField>
            <FormField label="Company" required>
              <FormSelect>
                <option>USV Development Services</option>
                <option>Canonic Associates</option>
                <option>USV + CANONIC (Joint)</option>
              </FormSelect>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Est. Contract Value (₦)" required>
              <Input type="number" placeholder="0" min="0" required />
            </FormField>
            <FormField label="Probability (%)" required>
              <Input type="number" placeholder="50" min="0" max="100" required />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Stage" required>
              <FormSelect>
                <option>Opportunity</option>
                <option>Qualification</option>
                <option>Pursuit Decision</option>
                <option>Tender / Proposal</option>
              </FormSelect>
            </FormField>
            <FormField label="Submission Deadline">
              <Input type="date" />
            </FormField>
          </div>
          <FormField label="Responsible Officer" required>
            <FormSelect>
              <option>BD Officer</option>
              <option>Tender Officer</option>
              {staffMembers.filter(s => ["bd-officer", "tender-officer"].includes(s.role)).map(s => (
                <option key={s.id}>{s.name}</option>
              ))}
            </FormSelect>
          </FormField>
          <FormField label="Source of Lead / Notes">
            <Textarea placeholder="How was this opportunity identified? Any useful context…" rows={2} />
          </FormField>
          <FormField label="Tender / RFP Documents">
            <FileUpload label="tender documents" accept=".pdf,.doc,.docx,.xlsx" />
          </FormField>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Add to Pipeline" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   SCHEDULE MEETING
══════════════════════════════════════════════════════════ */

export function ScheduleMeetingModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  const filteredStaff = attendeeSearch.trim().length > 1
    ? staffMembers.filter(s =>
        (s.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
         s.title.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
         s.department.toLowerCase().includes(attendeeSearch.toLowerCase())) &&
        !selectedAttendees.includes(s.id)
      ).slice(0, 8)
    : [];

  const addAttendee = (id: string) => { setSelectedAttendees(p => [...p, id]); setAttendeeSearch(""); };
  const removeAttendee = (id: string) => setSelectedAttendees(p => p.filter(x => x !== id));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ref = `MTG-2026-0${43 + Math.floor(Math.random() * 5)}`;
    setLoading(false); onClose();
    setSelectedAttendees([]);
    show(`Meeting ${ref} scheduled. Calendar invites sent to ${selectedAttendees.length} attendee${selectedAttendees.length !== 1 ? "s" : ""}.`);
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Schedule Meeting" size="lg">
      <form onSubmit={submit}>
        <FormBody>
          <FormField label="Meeting Title" required>
            <Input placeholder="e.g. Abuja Housing: Weekly Progress Review" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Meeting Type">
              <FormSelect>
                <option>Project Review</option><option>Executive Review</option>
                <option>Technical Coordination</option><option>Client Meeting</option>
                <option>Procurement</option><option>HR / Staff</option>
                <option>Board Meeting</option><option>Site Meeting</option>
              </FormSelect>
            </FormField>
            <FormField label="Company Scope">
              <FormSelect>
                <option>USV + CANONIC (Group)</option>
                <option>USV Development Services</option>
                <option>Canonic Associates</option>
              </FormSelect>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date" required><Input type="date" required /></FormField>
            <FormField label="Time" required><Input type="time" required /></FormField>
          </div>
          <FormField label="Location / Platform">
            <Input placeholder="e.g. Board Room, Floor 3 · or Zoom / Teams link" />
          </FormField>
          <FormField label="Related Project (Optional)">
            <FormSelect>
              <option value="">Not project-specific</option>
              {projects.map(p => <option key={p.code}>{p.name}</option>)}
            </FormSelect>
          </FormField>
          <FormField label="Agenda" required>
            <Textarea placeholder="List agenda items, one per line…" rows={3} required />
          </FormField>

          {/* Attendees staff picker */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Expected Attendees <span className="normal-case text-[10px] font-normal text-muted-foreground">(search and select; these staff get access to meeting materials)</span>
            </label>
            {/* Selected chips */}
            {selectedAttendees.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {selectedAttendees.map(id => {
                  const s = staffMembers.find(m => m.id === id);
                  if (!s) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 pl-2.5 pr-1.5 py-1 text-[11px] font-semibold text-primary">
                      {s.name}
                      <button type="button" onClick={() => removeAttendee(id)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20">
                        <span className="text-[10px] leading-none">✕</span>
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            {/* Search input */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                value={attendeeSearch}
                onChange={e => setAttendeeSearch(e.target.value)}
                placeholder="Search by name, title, or department…"
                className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            {filteredStaff.length > 0 && (
              <div className="mt-1 max-h-44 overflow-y-auto rounded border border-border divide-y divide-border bg-card shadow-sm">
                {filteredStaff.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addAttendee(s.id)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{s.initials}</div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.title} · {s.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {selectedAttendees.length === 0 && (
              <p className="mt-1 text-[10px] text-muted-foreground">Only selected staff will have access to this meeting&apos;s minutes and decisions.</p>
            )}
          </div>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label={`Schedule Meeting${selectedAttendees.length > 0 ? ` · ${selectedAttendees.length} attendee${selectedAttendees.length !== 1 ? "s" : ""}` : ""}`} />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   NEW TASK ASSIGNMENT
══════════════════════════════════════════════════════════ */

const EXISTING_TASKS = [
  "Review structural drawings",
  "Submit monthly report",
  "Issue payment certificate",
  "Update project schedule",
  "Conduct site inspection",
];

export function NewTaskModal({
  open, onClose, onSuccess, defaultAssigneeId, defaultTitle = "",
}: { open: boolean; onClose: () => void; onSuccess: () => void; defaultAssigneeId?: string; defaultTitle?: string }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [assignee, setAssignee] = useState(defaultAssigneeId ?? staffMembers[0]?.id ?? "");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTitle(defaultTitle);
      setAssignee(defaultAssigneeId ?? staffMembers[0]?.id ?? "");
      setDueDate("");
      setErrors({});
      setDuplicateWarning(null);
    }
  }, [open, defaultTitle, defaultAssigneeId]);

  useEffect(() => {
    if (!title.trim()) { setDuplicateWarning(null); return; }
    const timer = setTimeout(() => {
      const match = EXISTING_TASKS.find(t => t.toLowerCase() === title.trim().toLowerCase());
      setDuplicateWarning(match ?? null);
    }, 300);
    return () => clearTimeout(timer);
  }, [title]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Task title is required";
    if (!assignee) errs.assignee = "Please select an assignee";
    if (!dueDate) errs.dueDate = "Due date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 750));
    const ref = `TSK-2026-0${50 + Math.floor(Math.random() * 30)}`;
    setLoading(false); onClose();
    show(`Task ${ref} created and assigned. Responsible person notified.`);
    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} title="Assign Task" size="md">
      <form onSubmit={submit}>
        <FormBody>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Task Title<span className="ml-0.5 text-critical">*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Submit revised site programme by Friday"
              className={`w-full rounded border bg-panel px-3 py-2.5 text-sm outline-none focus:ring-2 transition placeholder:text-muted-foreground/50 ${errors.title ? "border-critical focus:ring-critical/30 focus:border-critical" : "border-border focus:border-primary focus:ring-primary/20"}`}
            />
            {errors.title && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-critical">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errors.title}
              </p>
            )}
            {duplicateWarning && (
              <div className="mt-1.5 flex items-start gap-2 rounded-[var(--radius)] border border-attention/40 bg-attention-bg px-3 py-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-attention" />
                <div>
                  <p className="text-[12px] font-semibold text-attention">Potential duplicate detected</p>
                  <p className="text-[11px] text-attention/80">A task named "{duplicateWarning}" already exists. Review before creating.</p>
                </div>
              </div>
            )}
          </div>

          <FormField label="Detailed Instructions">
            <Textarea placeholder="Provide full context, steps or reference documents…" rows={3} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Assign To<span className="ml-0.5 text-critical">*</span>
              </label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className={`w-full rounded border bg-panel px-3 py-2.5 text-sm outline-none focus:ring-2 transition ${errors.assignee ? "border-critical focus:ring-critical/30 focus:border-critical" : "border-border focus:border-primary focus:ring-primary/20"}`}
              >
                {staffMembers.slice(0, 25).map(s => (
                  <option key={s.id} value={s.id}>{s.name}, {s.title}</option>
                ))}
              </select>
              {errors.assignee && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-critical">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.assignee}
                </p>
              )}
            </div>
            <FormField label="Related Project">
              <FormSelect>
                <option value="">Not project-specific</option>
                {projects.map(p => <option key={p.code}>{p.name}</option>)}
              </FormSelect>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priority" required labelExtra={<FieldHint text="Urgent = blocks other work or has a hard deadline today. High = must complete this week. Normal = standard queue." />}>
              <FormSelect>
                <option>Urgent</option><option>High</option>
                <option>Medium</option><option>Low</option>
              </FormSelect>
            </FormField>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Deadline<span className="ml-0.5 text-critical">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className={`w-full rounded border bg-panel px-3 py-2.5 text-sm outline-none focus:ring-2 transition ${errors.dueDate ? "border-critical focus:ring-critical/30 focus:border-critical" : "border-border focus:border-primary focus:ring-primary/20"}`}
              />
              {errors.dueDate && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-critical">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <SubmitBtn loading={loading} label="Assign Task" />
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   IT TICKET ACTION MODAL
══════════════════════════════════════════════════════════ */

export interface TicketRecord {
  id: string;
  issue: string;
  category: string;
  user: string;
  raised: string;
  status: "Open" | "In Progress" | "Escalated" | "Resolved";
  priority?: "Urgent" | "High" | "Normal";
  notes?: string;
}

export function TicketModal({
  open, onClose, ticket, onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  ticket: TicketRecord | null;
  onUpdate: (id: string, newStatus: TicketRecord["status"], comment: string) => void;
}) {
  const { show } = useToast();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"resolve" | "escalate" | "progress" | null>(null);

  useEffect(() => { if (!open) { setComment(""); setAction(null); } }, [open]);

  if (!ticket) return null;

  const statusColors: Record<TicketRecord["status"], string> = {
    Open: "bg-attention-bg text-attention",
    "In Progress": "bg-info-bg text-info",
    Escalated: "bg-critical-bg text-critical",
    Resolved: "bg-healthy-bg text-healthy",
  };

  const nextStatus: Record<string, TicketRecord["status"]> = {
    resolve: "Resolved",
    escalate: "Escalated",
    progress: "In Progress",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onUpdate(ticket.id, nextStatus[action], comment);
    onClose();
    const msgs: Record<string, string> = {
      resolve: `Ticket ${ticket.id} resolved and closed`,
      escalate: `Ticket ${ticket.id} escalated. Senior support notified.`,
      progress: `Ticket ${ticket.id} marked In Progress`,
    };
    show(msgs[action] ?? "Ticket updated", action === "resolve" ? "success" : "warning");
  };

  return (
    <Modal open={open} onClose={onClose} title="IT Support Ticket" size="lg">
      <div className="p-5 space-y-4">
        <div className="rounded border border-border bg-panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] text-muted-foreground">{ticket.id}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{ticket.category}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusColors[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug">{ticket.issue}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" />{ticket.user}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ticket.raised}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded bg-panel px-4 py-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Resolution Path</p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {["Ticket Received", "ICT Triage", "Technical Fix", "User Verification", "Close"].map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className={`rounded px-2 py-0.5 font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{s}</span>
                {i < 4 && <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
              </span>
            ))}
          </div>
        </div>

        {ticket.status !== "Resolved" && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Action</p>
            <div className="flex flex-wrap gap-2">
              {ticket.status !== "In Progress" && (
                <button type="button" onClick={() => setAction("progress")}
                  className={`rounded border px-3 py-1.5 text-xs font-semibold transition ${action === "progress" ? "border-info bg-info-bg text-info" : "border-border text-muted-foreground hover:border-info hover:text-info"}`}>
                  Mark In Progress
                </button>
              )}
              <button type="button" onClick={() => setAction("escalate")}
                className={`rounded border px-3 py-1.5 text-xs font-semibold transition ${action === "escalate" ? "border-attention bg-attention-bg text-attention" : "border-border text-muted-foreground hover:border-attention hover:text-attention"}`}>
                Escalate
              </button>
              <button type="button" onClick={() => setAction("resolve")}
                className={`rounded border px-3 py-1.5 text-xs font-semibold transition ${action === "resolve" ? "border-healthy bg-healthy-bg text-healthy" : "border-border text-muted-foreground hover:border-healthy hover:text-healthy"}`}>
                Mark Resolved
              </button>
            </div>
          </div>
        )}

        {action && (
          <form onSubmit={submit}>
            <FormField label="Resolution / Escalation Notes" required>
              <Textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={
                  action === "resolve" ? "Describe the fix applied and any follow-up steps…" :
                  action === "escalate" ? "Describe the issue and why escalation is required…" :
                  "Note what action is being taken and expected timeline…"
                }
                rows={3}
                required
              />
            </FormField>
            <div className="flex justify-end gap-2 mt-3">
              <CancelBtn onClick={() => setAction(null)} />
              <button type="submit" disabled={loading || !comment.trim()}
                className={`inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${action === "resolve" ? "bg-healthy text-white hover:opacity-90" : action === "escalate" ? "bg-attention text-white hover:opacity-90" : "bg-info text-white hover:opacity-90"}`}>
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {action === "resolve" ? "Resolve Ticket" : action === "escalate" ? "Escalate" : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   PROVISIONING ACTION MODAL
══════════════════════════════════════════════════════════ */

export interface ProvisionRecord {
  ref: string;
  name: string;
  action: "Provision" | "Deactivate" | "Access Review";
  reason: string;
  since: string;
  role?: string;
  department?: string;
}

export function ProvisionModal({
  open, onClose, item, onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  item: ProvisionRecord | null;
  onConfirm: (ref: string) => void;
}) {
  const { show } = useToast();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!open) setComment(""); }, [open]);

  if (!item) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onConfirm(item.ref);
    onClose();
    const msgs: Record<ProvisionRecord["action"], string> = {
      Provision: `Account provisioned for ${item.name}. NEXUS access granted.`,
      Deactivate: `Account deactivated for ${item.name}. All sessions terminated.`,
      "Access Review": `Access review completed for ${item.name}`,
    };
    show(msgs[item.action], item.action === "Deactivate" ? "warning" : "success");
  };

  const toneMap: Record<ProvisionRecord["action"], string> = {
    Provision: "bg-info text-white",
    Deactivate: "bg-critical text-white",
    "Access Review": "bg-attention text-white",
  };

  return (
    <Modal open={open} onClose={onClose} title={`${item.action}: ${item.name}`} size="md">
      <form onSubmit={submit}>
        <FormBody>
          <div className="rounded border border-border bg-panel p-4 space-y-2 text-sm">
            {[
              ["Request Ref", <span className="font-mono text-xs font-semibold">{item.ref}</span>],
              ["Action Type", <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.action === "Deactivate" ? "bg-critical-bg text-critical" : item.action === "Access Review" ? "bg-attention-bg text-attention" : "bg-info-bg text-info"}`}>{item.action}</span>],
              ...(item.role ? [["Role", item.role]] : []),
              ...(item.department ? [["Department", item.department]] : []),
              ["Reason", item.reason],
              ["Pending Since", item.since],
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between items-start gap-4">
                <span className="text-muted-foreground shrink-0">{label as string}</span>
                <span className="text-right">{value as ReactNode}</span>
              </div>
            ))}
          </div>
          <FormField label="ICT Admin Notes / Confirmation" required>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={
                item.action === "Provision" ? "Confirm modules granted, temporary password sent, user notified…" :
                item.action === "Deactivate" ? "Confirm all sessions terminated, handover completed…" :
                "Confirm current permissions are appropriate or note changes made…"
              }
              rows={3}
              required
            />
          </FormField>
          {item.action === "Provision" && (
            <FormField label="Modules to Grant Access">
              <div className="grid grid-cols-2 gap-2">
                {["Project Portfolio", "Procurement", "Finance & Accounts", "HR & People", "Documents", "Approvals"].map(m => (
                  <label key={m} className="flex items-center gap-2 text-xs">
                    <input type="checkbox" className="rounded" defaultChecked={m === "Project Portfolio"} />
                    {m}
                  </label>
                ))}
              </div>
            </FormField>
          )}
        </FormBody>
        <FormFooter>
          <CancelBtn onClick={onClose} />
          <button type="submit" disabled={loading || !comment.trim()}
            className={`inline-flex items-center gap-2 rounded px-5 py-2 text-sm font-semibold transition disabled:opacity-50 hover:opacity-90 ${toneMap[item.action]}`}>
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Confirm {item.action}
          </button>
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   NEW STAFF MODAL — onboard a new staff member
══════════════════════════════════════════════════════════ */

const ROLE_GROUPS: { label: string; roles: { value: UserRole; label: string }[] }[] = [
  {
    label: "Governance & Executive",
    roles: [
      { value: "chairman",  label: "Chairman" },
      { value: "gmd",       label: "Group Managing Director (GMD)" },
      { value: "ged",       label: "Group Executive Director (GED)" },
      { value: "ed",        label: "Executive Director (ED)" },
      { value: "ggmp",      label: "Group General Manager (GGMP)" },
    ],
  },
  {
    label: "Projects Directorate",
    roles: [
      { value: "pm",                 label: "Project Manager" },
      { value: "project-coordinator", label: "Project Coordinator" },
      { value: "site-supervisor",    label: "Site Supervisor" },
      { value: "site",               label: "Site Officer" },
      { value: "procurement-manager", label: "Procurement Manager" },
      { value: "procurement",        label: "Procurement Officer" },
      { value: "doc-controller",     label: "Document Controller" },
      { value: "planner",            label: "Project Planner" },
    ],
  },
  {
    label: "Technical Directorate",
    roles: [
      { value: "head-architect",   label: "Head of Architecture" },
      { value: "architect",        label: "Architect" },
      { value: "head-qs",          label: "Head of Quantity Surveying" },
      { value: "qs",               label: "Quantity Surveyor" },
      { value: "head-engineering", label: "Head of Engineering" },
      { value: "engineer",         label: "Structural / M&E Engineer" },
    ],
  },
  {
    label: "Corporate Services",
    roles: [
      { value: "head-ops",      label: "Head of Operations" },
      { value: "bd-officer",    label: "Business Development Officer" },
      { value: "tender-officer", label: "Tender & Proposals Officer" },
      { value: "finance",       label: "Finance Manager" },
      { value: "accountant",    label: "Accountant" },
      { value: "head-admin",    label: "Head of Administration & HR" },
      { value: "admin",         label: "Administrative Officer" },
      { value: "ict-admin",     label: "ICT & ERP Administrator" },
      { value: "auditor",       label: "Internal Auditor" },
      { value: "client-support", label: "Client Support Officer" },
    ],
  },
];

const ROLE_DEPT_MAP: Partial<Record<UserRole, string>> = {
  chairman: "Board",
  gmd: "Group Executive",
  ged: "Group Projects",
  ed: "Corporate Services",
  ggmp: "Group Operations",
  pm: "Project Management",
  "project-coordinator": "Project Management",
  "site-supervisor": "Construction & Site Management",
  site: "Construction & Site Management",
  "procurement-manager": "Procurement",
  procurement: "Procurement",
  "doc-controller": "Project Document Control",
  planner: "Project Planning",
  "head-architect": "Architecture & Design",
  architect: "Architecture & Design",
  "head-qs": "Quantity Surveying",
  qs: "Quantity Surveying",
  "head-engineering": "Engineering & Technical Services",
  engineer: "Engineering & Technical Services",
  "head-ops": "Operations",
  ops: "Operations",
  "bd-officer": "Business Development & Tenders",
  "business-dev": "Business Development & Tenders",
  "tender-officer": "Business Development & Tenders",
  finance: "Finance & Accounts",
  accountant: "Finance & Accounts",
  "head-admin": "Administration & Human Resources",
  admin: "Administration & Human Resources",
  "client-support": "Client Relations",
  "ict-admin": "ICT, ERP & Systems Administration",
  auditor: "Internal Audit & Compliance",
};

const ROLE_TIER_MAP: Partial<Record<UserRole, { label: string; badge: string }>> = {
  chairman:            { label: "T1: Board & Governance", badge: "bg-purple-100 text-purple-700" },
  gmd:                 { label: "T2: Group Executive", badge: "bg-blue-100 text-blue-700" },
  ged:                 { label: "T2: Group Executive", badge: "bg-blue-100 text-blue-700" },
  ed:                  { label: "T2: Group Executive", badge: "bg-blue-100 text-blue-700" },
  ggmp:                { label: "T2: Group Executive", badge: "bg-blue-100 text-blue-700" },
  pm:                  { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  "procurement-manager": { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  finance:             { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  "head-architect":    { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  "head-qs":           { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  "head-engineering":  { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  "head-ops":          { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  "head-admin":        { label: "T3: Management & Heads", badge: "bg-indigo-100 text-indigo-700" },
  "project-coordinator": { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  architect:           { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  qs:                  { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  engineer:            { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  "doc-controller":    { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  planner:             { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  "site-supervisor":   { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  accountant:          { label: "T4: Senior Professional", badge: "bg-teal-100 text-teal-700" },
  "bd-officer":        { label: "T5: Officer", badge: "bg-amber-100 text-amber-700" },
  "business-dev":      { label: "T5: Officer", badge: "bg-amber-100 text-amber-700" },
  "tender-officer":    { label: "T5: Officer", badge: "bg-amber-100 text-amber-700" },
  procurement:         { label: "T5: Officer", badge: "bg-amber-100 text-amber-700" },
  auditor:             { label: "T5: Officer", badge: "bg-amber-100 text-amber-700" },
  "ict-admin":         { label: "T5: Officer", badge: "bg-amber-100 text-amber-700" },
  "client-support":    { label: "T5: Officer", badge: "bg-amber-100 text-amber-700" },
  site:                { label: "T6: Operations Support", badge: "bg-gray-100 text-gray-600" },
  ops:                 { label: "T6: Operations Support", badge: "bg-gray-100 text-gray-600" },
  admin:               { label: "T6: Operations Support", badge: "bg-gray-100 text-gray-600" },
};

interface NewStaffForm {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: UserRole | "";
  company: Company | "";
  startDate: string;
  contractType: "permanent" | "contract" | "intern" | "";
  notes: string;
}

const BLANK_FORM: NewStaffForm = {
  name: "", email: "", phone: "", jobTitle: "", role: "", company: "", startDate: "", contractType: "", notes: "",
};

export function NewStaffModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<NewStaffForm>(BLANK_FORM);

  useEffect(() => { if (!open) setForm(BLANK_FORM); }, [open]);

  const dept   = form.role ? (ROLE_DEPT_MAP[form.role as UserRole] ?? "") : "";
  const tier   = form.role ? (ROLE_TIER_MAP[form.role as UserRole] ?? null) : null;

  const set = (k: keyof NewStaffForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    const grouped = ROLE_GROUPS.flatMap(g => g.roles).find(r => r.value === role);
    setForm(prev => ({
      ...prev,
      role,
      jobTitle: prev.jobTitle || (grouped?.label ?? ""),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onClose();
    show(
      `Staff account created for ${form.name}. Login credentials and NEXUS access instructions sent to ${form.email}.`,
      "success"
    );
  };

  const isValid = form.name.trim() && form.email.trim() && form.role && form.company && form.startDate && form.contractType;

  return (
    <Modal open={open} onClose={onClose} title="Add New Staff Member" size="lg">
      <form onSubmit={submit}>
        <FormBody>
          {/* Identity */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Engr. Amaka Osei"
                required
              />
            </FormField>
            <FormField label="Email Address" required>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="e.g. a.osei@usvgroup.com"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone Number">
              <Input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="e.g. +234 801 234 5678"
              />
            </FormField>
            <FormField label="Job Title" required>
              <Input
                value={form.jobTitle}
                onChange={set("jobTitle")}
                placeholder="Official designation"
                required
              />
            </FormField>
          </div>

          {/* Role & access */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="System Role" required hint="Determines navigation access and permissions in NEXUS">
              <FormSelect value={form.role} onChange={handleRoleChange} required>
                <option value="">Select a role</option>
                {ROLE_GROUPS.map(g => (
                  <optgroup key={g.label} label={g.label}>
                    {g.roles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </optgroup>
                ))}
              </FormSelect>
            </FormField>
            <FormField label="Department">
              <div className={`${inputCls} text-sm ${dept ? "text-foreground" : "text-muted-foreground/50"}`}>
                {dept || "Auto-filled from role"}
              </div>
            </FormField>
          </div>

          {/* Access tier badge */}
          {tier && (
            <div className="flex items-center gap-2 rounded border border-border bg-panel px-3 py-2">
              <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">Access level:</span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${tier.badge}`}>{tier.label}</span>
            </div>
          )}

          {/* Employment details */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Company" required>
              <FormSelect value={form.company} onChange={set("company")} required>
                <option value="">Select company</option>
                <option value="USV">USV Development Services Ltd</option>
                <option value="CANONIC">Canonic Associates Ltd</option>
                <option value="USV + CANONIC">Both Companies</option>
              </FormSelect>
            </FormField>
            <FormField label="Start Date" required>
              <Input type="date" value={form.startDate} onChange={set("startDate")} required />
            </FormField>
          </div>

          <FormField label="Contract Type" required>
            <div className="flex gap-3">
              {(["permanent", "contract", "intern"] as const).map(ct => (
                <label key={ct} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="contractType"
                    value={ct}
                    checked={form.contractType === ct}
                    onChange={set("contractType")}
                    required
                    className="accent-primary"
                  />
                  {ct.charAt(0).toUpperCase() + ct.slice(1)}
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Onboarding Notes" hint="Any specific instructions for ICT setup, equipment requirements, or project assignments">
            <Textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="e.g. Assign to Abuja Housing Phase II from day one. Laptop pre-configured with AutoCAD required."
              rows={3}
            />
          </FormField>

          <div className="rounded border border-info/25 bg-info/5 px-3 py-2.5 text-[11px] text-info flex items-start gap-2">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              NEXUS login credentials will be auto-generated and emailed to the staff member on the start date.
              ICT Admin will complete system provisioning within one business day.
            </span>
          </div>
        </FormBody>

        <FormFooter>
          <CancelBtn onClick={onClose} />
          <button
            type="submit"
            disabled={loading || !isValid}
            className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-50 hover:opacity-90"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
            {loading ? "Creating Account…" : "Create Staff Account"}
          </button>
        </FormFooter>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   INVOICE DETAIL MODAL — view + download / print
══════════════════════════════════════════════════════════ */

export interface InvoiceRecord {
  id: string;
  company: "USV" | "CANONIC";
  client: string;
  clientAddress?: string;
  project: string;
  projectCode?: string;
  amount: number;
  status: string;
  daysOverdue?: number;
  issued?: string;
  due?: string;
  items?: { description: string; qty: number; unit: string; rate: number; amount: number }[];
}

export function InvoiceDetailModal({
  open, onClose, invoice,
}: {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceRecord | null;
}) {
  const { show } = useToast();
  if (!invoice) return null;

  const isUSV = invoice.company === "USV";
  const brandColor = isUSV ? "#1A3D8F" : "#3580B5";
  const brandLabel = isUSV ? "USV Construction Ltd" : "CANONIC Architects Ltd";
  const brandTag = isUSV ? "Engineering · Construction · Project Management" : "Architecture · Interior Design · BIM";
  const brandAddress = isUSV
    ? "Plot 14, Ikate Elegushi, Lekki, Lagos. RC: 423817"
    : "3rd Floor, Badia Complex, Victoria Island, Lagos. RC: 519204";
  const brandPhone = isUSV ? "+234 (0) 801 234 5678" : "+234 (0) 802 345 6789";

  const lineItems = invoice.items ?? [
    { description: `${invoice.project}: Progress Certificate No. 3`, qty: 1, unit: "Lot", rate: Math.round(invoice.amount * 0.7), amount: Math.round(invoice.amount * 0.7) },
    { description: "Retention Release (5%)", qty: 1, unit: "Lot", rate: Math.round(invoice.amount * 0.05), amount: Math.round(invoice.amount * 0.05) },
    { description: "Variation Account VA-003 (Approved)", qty: 1, unit: "Lot", rate: Math.round(invoice.amount * 0.25), amount: Math.round(invoice.amount * 0.25) },
  ];

  const subtotal = lineItems.reduce((s, i) => s + i.amount, 0);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${invoice.id}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Helvetica Neue',Arial,sans-serif; font-size:13px; color:#1a1a1a; padding:40px; }
.header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid ${brandColor}; padding-bottom:24px; margin-bottom:24px; }
.brand-name { font-size:22px; font-weight:800; color:${brandColor}; }
.brand-tag { font-size:10px; color:#666; margin-top:3px; text-transform:uppercase; letter-spacing:0.08em; }
.brand-addr { font-size:11px; color:#555; margin-top:6px; line-height:1.5; }
.inv-title { font-size:28px; font-weight:800; color:${brandColor}; text-align:right; }
.inv-meta { text-align:right; margin-top:6px; font-size:12px; color:#555; line-height:1.8; }
.bill-section { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:28px; }
.bill-box h3 { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#888; margin-bottom:6px; }
.bill-box p { font-size:13px; line-height:1.6; }
table { width:100%; border-collapse:collapse; margin-bottom:24px; }
thead tr { background:${brandColor}; color:white; }
th { padding:10px 12px; text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; }
td { padding:10px 12px; border-bottom:1px solid #eee; font-size:12px; }
.text-right { text-align:right; }
.total-section { margin-left:auto; width:280px; }
.total-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #eee; }
.total-grand { display:flex; justify-content:space-between; padding:10px 0; font-size:16px; font-weight:800; color:${brandColor}; border-top:2px solid ${brandColor}; margin-top:4px; }
.footer { margin-top:40px; border-top:1px solid #ddd; padding-top:16px; font-size:11px; color:#888; text-align:center; line-height:1.8; }
.status-badge { display:inline-block; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:700; background:${invoice.status === "Overdue" ? "#fee2e2" : invoice.status === "Paid" ? "#dcfce7" : "#dbeafe"}; color:${invoice.status === "Overdue" ? "#dc2626" : invoice.status === "Paid" ? "#16a34a" : "#2563eb"}; }
</style></head><body>
<div class="header">
  <div>
    <div class="brand-name">${brandLabel}</div>
    <div class="brand-tag">${brandTag}</div>
    <div class="brand-addr">${brandAddress}<br/>${brandPhone}</div>
  </div>
  <div>
    <div class="inv-title">INVOICE</div>
    <div class="inv-meta"><strong>${invoice.id}</strong><br/>Issued: ${invoice.issued ?? "06 Sep 2026"}<br/>Due: ${invoice.due ?? "20 Sep 2026"}<br/>Status: <span class="status-badge">${invoice.status}</span></div>
  </div>
</div>
<div class="bill-section">
  <div class="bill-box"><h3>Bill To</h3><p><strong>${invoice.client}</strong><br/>${invoice.clientAddress ?? "As per contract agreement"}</p></div>
  <div class="bill-box"><h3>Project</h3><p><strong>${invoice.project}</strong>${invoice.projectCode ? "<br/>" + invoice.projectCode : ""}</p></div>
</div>
<table>
  <thead><tr><th style="width:50%">Description</th><th class="text-right" style="width:10%">Qty</th><th class="text-right" style="width:10%">Unit</th><th class="text-right" style="width:15%">Rate (₦)</th><th class="text-right" style="width:15%">Amount (₦)</th></tr></thead>
  <tbody>${lineItems.map(i => `<tr><td>${i.description}</td><td class="text-right">${i.qty}</td><td class="text-right">${i.unit}</td><td class="text-right">${naira(i.rate)}</td><td class="text-right">${naira(i.amount)}</td></tr>`).join("")}</tbody>
</table>
<div class="total-section">
  <div class="total-row"><span>Subtotal</span><span>${naira(subtotal)}</span></div>
  <div class="total-row"><span>VAT (7.5%)</span><span>${naira(vat)}</span></div>
  <div class="total-grand"><span>Total Due</span><span>${naira(total)}</span></div>
</div>
<div class="footer">
  Bank: ${isUSV ? "Zenith Bank" : "GTBank"} · A/C: ${isUSV ? "1012345678" : "0123456789"} · NEXUS ERP Ref: ${invoice.id}<br/>
  For queries contact finance@${isUSV ? "usvconstruction" : "canonicarchitects"}.com · ${brandLabel} · ${brandAddress}
</div>
</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
    show(`Invoice ${invoice.id} ready. Print dialog opened.`, "success");
  };

  return (
    <Modal open={open} onClose={onClose} title={`Invoice: ${invoice.id}`} size="xl">
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between pb-5" style={{ borderBottom: `3px solid ${brandColor}` }}>
          <div>
            <p className="font-display text-xl font-bold" style={{ color: brandColor }}>{brandLabel}</p>
            <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mt-0.5">{brandTag}</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{brandAddress}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-black" style={{ color: brandColor }}>INVOICE</p>
            <p className="font-mono text-sm font-semibold mt-1">{invoice.id}</p>
            <p className="text-xs text-muted-foreground mt-1">Issued: {invoice.issued ?? "06 Sep 2026"}</p>
            <p className="text-xs text-muted-foreground">Due: {invoice.due ?? "20 Sep 2026"}</p>
            <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold ${invoice.status === "Overdue" ? "bg-critical-bg text-critical" : invoice.status === "Paid" ? "bg-healthy-bg text-healthy" : "bg-info-bg text-info"}`}>{invoice.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1.5">Bill To</p>
            <p className="font-semibold text-sm">{invoice.client}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{invoice.clientAddress ?? "As per contract agreement"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1.5">Project</p>
            <p className="font-semibold text-sm">{invoice.project}</p>
            {invoice.projectCode && <p className="font-mono text-xs text-muted-foreground mt-0.5">{invoice.projectCode}</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: brandColor, color: "white" }}>
                <th className="px-3 py-2.5 text-left font-semibold uppercase tracking-wide w-[50%]">Description</th>
                <th className="px-3 py-2.5 text-right font-semibold uppercase tracking-wide">Qty</th>
                <th className="px-3 py-2.5 text-right font-semibold uppercase tracking-wide">Unit</th>
                <th className="px-3 py-2.5 text-right font-semibold uppercase tracking-wide">Rate (₦)</th>
                <th className="px-3 py-2.5 text-right font-semibold uppercase tracking-wide">Amount (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lineItems.map((item, i) => (
                <tr key={i} className="bg-card">
                  <td className="px-3 py-2.5 font-medium leading-snug">{item.description}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">{item.qty}</td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">{item.unit}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">{naira(item.rate)}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums font-semibold">{naira(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto w-72 space-y-1 border-t border-border pt-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono tabular-nums">{naira(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">VAT (7.5%)</span><span className="font-mono tabular-nums">{naira(vat)}</span></div>
          <div className="flex justify-between pt-2 font-display text-base font-bold" style={{ color: brandColor, borderTop: `2px solid ${brandColor}` }}>
            <span>Total Due</span>
            <span className="font-mono tabular-nums">{naira(total)}</span>
          </div>
        </div>

        <div className="rounded border border-border bg-panel px-4 py-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Payment Details</p>
          <p>Bank: {isUSV ? "Zenith Bank" : "GTBank"} · Account: {isUSV ? "1012345678" : "0123456789"}</p>
          <p>NEXUS ERP Ref: <span className="font-mono font-semibold">{invoice.id}</span> · Please quote reference on all remittances.</p>
        </div>

        <div className="flex gap-2 border-t border-border pt-4">
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
            <Send className="h-3.5 w-3.5" /> Download / Print
          </button>
          <button onClick={() => show(`Payment reminder sent to ${invoice.client}`, "info")}
            className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:border-border-strong hover:text-foreground transition">
            Send Reminder
          </button>
          <button onClick={() => { show(`${invoice.id} marked as paid. Records updated.`, "success"); onClose(); }}
            className="inline-flex items-center gap-1.5 rounded border border-healthy px-4 py-2 text-xs font-semibold text-healthy hover:bg-healthy-bg transition">
            Mark as Paid
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   SITE REPORT VIEWER / DOWNLOAD
══════════════════════════════════════════════════════════ */

export interface SiteReportData {
  id: string;
  project: string;
  projectCode: string;
  company: string;
  reportDate: string;
  supervisor: string;
  pm: string;
  weatherCondition: string;
  workersOnSite: number;
  activitiesCompleted: string[];
  activitiesInProgress: string[];
  issuesRaised: string[];
  materialsDelivered: string[];
  safetyObservations: string;
  progressPercent: number;
  plannedPercent: number;
  nextDayPlan: string;
}

const DEFAULT_REPORT: SiteReportData = {
  id: "SR-PRJ001-083",
  project: "Abuja Housing Development, Phase II",
  projectCode: "PRJ-USV-001",
  company: "USV Construction Ltd",
  reportDate: "Sunday, 06 September 2026",
  supervisor: "Engr. James Oyelaran",
  pm: "Engr. Musa Bello",
  weatherCondition: "Partly Cloudy, 28°C, suitable for all works",
  workersOnSite: 47,
  activitiesCompleted: [
    "Block A: Upper floor beam shuttering completed (Grid 1–6)",
    "Block B: Reinforcement bars fixed for columns C7–C12 (Y16@150)",
    "Foundation backfill: sections 3A and 3B compacted to 95% CBR",
  ],
  activitiesInProgress: [
    "Block A: Concreting of upper floor beams in progress (3 of 6 bays done)",
    "Block C: Foundation excavation ongoing, 60% complete",
    "Block D: Masonry, 4th floor blockwork, Grid A–F",
  ],
  issuesRaised: [
    "ISS-005: Reinforcement steel deficit, 12T Y16 short for Block C columns. PO approval urgent.",
    "ISS-006: Concrete mixer #2 mechanical fault, one plant unavailable, pace affected.",
  ],
  materialsDelivered: [
    "Cement (Dangote 3X): 300 bags, stored Block B store",
    "Sharp sand: 6 trips, stockpiled south yard",
  ],
  safetyObservations: "All workers wearing PPE. 1 near-miss recorded (scaffold board slip), area re-secured, incident logged. No injuries.",
  progressPercent: 48,
  plannedPercent: 62,
  nextDayPlan: "Complete Block A beam concreting, continue Block C excavation, schedule Block D window lintel casting.",
};

export function SiteReportViewerModal({
  open, onClose, report,
}: {
  open: boolean;
  onClose: () => void;
  report?: SiteReportData;
}) {
  const { show } = useToast();
  const r = report ?? DEFAULT_REPORT;

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${r.id}: Daily Site Report</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Helvetica Neue',Arial,sans-serif; font-size:12px; color:#1a1a1a; padding:36px; }
.header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #1A3D8F; padding-bottom:20px; margin-bottom:20px; }
.brand { font-size:20px; font-weight:800; color:#1A3D8F; }
.report-type { font-size:24px; font-weight:800; color:#1A3D8F; text-align:right; }
.report-id { font-family:monospace; font-size:13px; font-weight:600; text-align:right; margin-top:4px; color:#555; }
.meta-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; background:#f5f5f3; border-radius:6px; padding:16px; margin-bottom:20px; }
.meta-item label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#888; display:block; margin-bottom:3px; }
.meta-item span { font-size:12px; font-weight:600; }
.section { margin-bottom:18px; }
.section h3 { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#1A3D8F; border-bottom:1px solid #ddd; padding-bottom:4px; margin-bottom:8px; }
ul { padding-left:16px; }
ul li { margin-bottom:4px; line-height:1.5; }
.issue { background:#fee2e2; border-left:3px solid #dc2626; padding:6px 10px; border-radius:0 4px 4px 0; margin-bottom:6px; font-size:11px; }
.sig-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; margin-top:32px; }
.sig-box { border-top:1px solid #333; padding-top:6px; text-align:center; font-size:10px; color:#555; }
.footer { margin-top:24px; border-top:1px solid #ddd; padding-top:12px; font-size:10px; color:#999; text-align:center; line-height:1.8; }
</style></head><body>
<div class="header">
  <div><div class="brand">${r.company}</div><div style="font-size:10px;color:#888;margin-top:3px;text-transform:uppercase;letter-spacing:0.08em">NEXUS ERP: Site Operations</div></div>
  <div><div class="report-type">DAILY SITE REPORT</div><div class="report-id">${r.id}</div></div>
</div>
<div class="meta-grid">
  <div class="meta-item"><label>Project</label><span>${r.project}</span></div>
  <div class="meta-item"><label>Project Code</label><span>${r.projectCode}</span></div>
  <div class="meta-item"><label>Report Date</label><span>${r.reportDate}</span></div>
  <div class="meta-item"><label>Supervisor</label><span>${r.supervisor}</span></div>
  <div class="meta-item"><label>Project Manager</label><span>${r.pm}</span></div>
  <div class="meta-item"><label>Workers On Site</label><span>${r.workersOnSite}</span></div>
  <div class="meta-item"><label>Weather</label><span>${r.weatherCondition}</span></div>
  <div class="meta-item"><label>Progress (Actual)</label><span style="color:${r.progressPercent >= r.plannedPercent ? "#16a34a" : "#dc2626"}">${r.progressPercent}% (Plan: ${r.plannedPercent}%)</span></div>
  <div class="meta-item"><label>Variance</label><span style="color:${r.progressPercent >= r.plannedPercent ? "#16a34a" : "#dc2626"}">${r.progressPercent >= r.plannedPercent ? "+" : ""}${r.progressPercent - r.plannedPercent}pp</span></div>
</div>
<div class="section"><h3>Activities Completed Today</h3><ul>${r.activitiesCompleted.map(a => `<li>${a}</li>`).join("")}</ul></div>
<div class="section"><h3>Activities In Progress</h3><ul>${r.activitiesInProgress.map(a => `<li>${a}</li>`).join("")}</ul></div>
<div class="section"><h3>Issues Raised</h3>${r.issuesRaised.map(i => `<div class="issue">${i}</div>`).join("")}</div>
<div class="section"><h3>Materials Delivered</h3><ul>${r.materialsDelivered.map(m => `<li>${m}</li>`).join("")}</ul></div>
<div class="section"><h3>Health, Safety & Environment</h3><p>${r.safetyObservations}</p></div>
<div class="section"><h3>Next Day Plan</h3><p>${r.nextDayPlan}</p></div>
<div class="sig-row">
  <div class="sig-box">Prepared by<br/><strong>${r.supervisor}</strong><br/>Site Supervisor</div>
  <div class="sig-box">Reviewed by<br/><strong>${r.pm}</strong><br/>Project Manager</div>
  <div class="sig-box">Noted by<br/><strong>GED Projects</strong><br/>Date: ___________</div>
</div>
<div class="footer">Generated by NEXUS ERP · ${r.company} · Report ID: ${r.id} · ${r.reportDate}<br/>This document is confidential and intended for internal use only.</div>
</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
    show(`Site report ${r.id} ready. Print dialog opened.`, "success");
  };

  return (
    <Modal open={open} onClose={onClose} title={`Site Report: ${r.id}`} size="xl">
      <div className="p-5 space-y-5">
        <div className="flex items-start justify-between rounded border border-border bg-panel p-4">
          <div>
            <p className="font-display text-base font-bold text-primary">{r.project}</p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{r.projectCode} · {r.id}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">{r.reportDate}</p>
            <p>{r.company}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { l: "Supervisor", v: r.supervisor, color: "" },
            { l: "Project Manager", v: r.pm, color: "" },
            { l: "Workers On Site", v: String(r.workersOnSite), color: "" },
            { l: "Weather", v: r.weatherCondition, color: "" },
            { l: "Progress Actual", v: `${r.progressPercent}%`, color: r.progressPercent >= r.plannedPercent ? "text-healthy" : "text-critical" },
            { l: "Variance vs Plan", v: `${r.progressPercent >= r.plannedPercent ? "+" : ""}${r.progressPercent - r.plannedPercent}pp`, color: r.progressPercent >= r.plannedPercent ? "text-healthy" : "text-critical" },
          ].map(m => (
            <div key={m.l} className="rounded border border-border bg-card p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{m.l}</p>
              <p className={`mt-0.5 text-sm font-semibold ${m.color || "text-foreground"}`}>{m.v}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary mb-2">Completed Today</p>
              <ul className="space-y-1">
                {r.activitiesCompleted.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-healthy" />{a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary mb-2">In Progress</p>
              <ul className="space-y-1">
                {r.activitiesInProgress.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-info" />{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            {r.issuesRaised.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-critical mb-2">Issues Raised</p>
                <div className="space-y-1.5">
                  {r.issuesRaised.map((iss, i) => (
                    <div key={i} className="rounded border-l-2 border-critical bg-critical-bg/30 pl-3 py-1.5 pr-2 text-xs">{iss}</div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary mb-2">Materials Delivered</p>
              <ul className="space-y-1">
                {r.materialsDelivered.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-attention" />{m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary mb-2">HSE</p>
              <p className="text-xs">{r.safetyObservations}</p>
            </div>
          </div>
        </div>

        <div className="rounded border border-border bg-panel p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">Tomorrow's Plan</p>
          <p className="text-xs">{r.nextDayPlan}</p>
        </div>

        <div className="flex gap-2 border-t border-border pt-4">
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
            <Send className="h-3.5 w-3.5" /> Download / Print Report
          </button>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:border-border-strong hover:text-foreground transition">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   PAYSLIP DETAIL MODAL
══════════════════════════════════════════════════════════ */

export interface PayslipRecord {
  period: string;
  gross: number;
  deductions: number;
  net: number;
  status: string;
  paidOn: string;
}

export function PayslipDetailModal({ open, onClose, payslip }: { open: boolean; onClose: () => void; payslip: PayslipRecord | null }) {
  if (!payslip) return null;

  const basic = Math.round(payslip.gross * 0.722);
  const housing = Math.round(payslip.gross * 0.144);
  const transport = Math.round(payslip.gross * 0.072);
  const medical = Math.round(payslip.gross * 0.062);
  const paye = Math.round(payslip.deductions * 0.755);
  const pension = Math.round(payslip.deductions * 0.385);
  const other = payslip.deductions - paye - pension;

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Payslip: ${payslip.period}</title><style>
      body{font-family:'Segoe UI',sans-serif;max-width:720px;margin:40px auto;color:#1a1a1a;font-size:14px}
      h1{font-size:22px;margin:0}h2{font-size:14px;font-weight:600;margin:24px 0 8px;text-transform:uppercase;letter-spacing:.08em;color:#555}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#f5f5f5;padding:16px;border-radius:6px;margin:16px 0}
      .meta span{font-size:12px;color:#777} .meta strong{display:block;color:#111;font-size:14px}
      table{width:100%;border-collapse:collapse} td,th{padding:8px 12px;text-align:left}
      th{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#777;border-bottom:2px solid #eee}
      tr:nth-child(even){background:#fafafa} .mono{font-family:monospace} .total{font-weight:700;border-top:2px solid #111}
      .green{color:#1A3D8F;font-weight:700} .red{color:#b23120}
      footer{margin-top:40px;font-size:11px;color:#999;text-align:center;border-top:1px solid #eee;padding-top:16px}
    </style></head><body>
      <h1>PAYSLIP</h1>
      <div class="meta">
        <div><span>Employee</span><strong>Engr. Musa Bello</strong></div>
        <div><span>Employee ID</span><strong>USV-EMP-0047</strong></div>
        <div><span>Pay Period</span><strong>${payslip.period}</strong></div>
        <div><span>Payment Date</span><strong>${payslip.paidOn}</strong></div>
        <div><span>Department</span><strong>Projects: Senior PM</strong></div>
        <div><span>Status</span><strong>${payslip.status}</strong></div>
      </div>
      <h2>Earnings</h2>
      <table><thead><tr><th>Component</th><th class="mono" style="text-align:right">Amount (₦)</th></tr></thead><tbody>
        <tr><td>Basic Salary</td><td class="mono" style="text-align:right">${basic.toLocaleString()}</td></tr>
        <tr><td>Housing Allowance</td><td class="mono" style="text-align:right">${housing.toLocaleString()}</td></tr>
        <tr><td>Transport Allowance</td><td class="mono" style="text-align:right">${transport.toLocaleString()}</td></tr>
        <tr><td>Medical Allowance</td><td class="mono" style="text-align:right">${medical.toLocaleString()}</td></tr>
        <tr class="total"><td>Gross Pay</td><td class="mono" style="text-align:right">${payslip.gross.toLocaleString()}</td></tr>
      </tbody></table>
      <h2>Deductions</h2>
      <table><thead><tr><th>Component</th><th class="mono" style="text-align:right">Amount (₦)</th></tr></thead><tbody>
        <tr><td>PAYE Tax</td><td class="mono red" style="text-align:right">(${paye.toLocaleString()})</td></tr>
        <tr><td>Pension Contribution (8%)</td><td class="mono red" style="text-align:right">(${pension.toLocaleString()})</td></tr>
        <tr><td>Other Deductions</td><td class="mono red" style="text-align:right">(${Math.max(0,other).toLocaleString()})</td></tr>
        <tr class="total"><td>Total Deductions</td><td class="mono red" style="text-align:right">(${payslip.deductions.toLocaleString()})</td></tr>
      </tbody></table>
      <h2>Net Pay</h2>
      <table><tbody><tr class="total"><td style="font-size:18px">NET PAY</td><td class="mono green" style="text-align:right;font-size:18px">₦${payslip.net.toLocaleString()}</td></tr></tbody></table>
      <footer>This payslip is system-generated · NEXUS ERP · USV Development Services Ltd</footer>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Payslip: ${payslip.period}`} size="md">
      <div className="space-y-4 p-1">
        <div className="grid grid-cols-3 gap-3">
          {[
            { l: "Gross Pay", v: naira(payslip.gross), cls: "" },
            { l: "Deductions", v: `(${naira(payslip.deductions)})`, cls: "text-attention" },
            { l: "Net Pay", v: naira(payslip.net), cls: "text-healthy font-bold" },
          ].map((k) => (
            <div key={k.l} className="rounded bg-panel p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k.l}</p>
              <p className={`mt-1.5 font-mono text-lg font-bold tabular-nums ${k.cls}`}>{k.v}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Earnings Breakdown</p>
          <div className="space-y-1.5 rounded border border-border p-3">
            {[
              { l: "Basic Salary", v: basic },
              { l: "Housing Allowance", v: housing },
              { l: "Transport Allowance", v: transport },
              { l: "Medical Allowance", v: medical },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-mono tabular-nums">{naira(v)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-bold">
              <span>Gross Pay</span>
              <span className="font-mono tabular-nums">{naira(payslip.gross)}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Deductions</p>
          <div className="space-y-1.5 rounded border border-border p-3">
            {[
              { l: "PAYE Tax", v: paye },
              { l: "Pension (8% Employee)", v: pension },
              { l: "Other Deductions", v: Math.max(0, other) },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-mono tabular-nums text-attention">({naira(v)})</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-bold text-attention">
              <span>Total Deductions</span>
              <span className="font-mono tabular-nums">({naira(payslip.deductions)})</span>
            </div>
          </div>
        </div>

        <div className="rounded bg-healthy-bg p-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-healthy">Net Pay: {payslip.period}</p>
          <p className="mt-1 font-display text-3xl font-bold text-healthy tabular-nums">{naira(payslip.net)}</p>
          <p className="mt-1 text-xs text-healthy/70">Paid on {payslip.paidOn}</p>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
            <Send className="h-3.5 w-3.5" /> Download Payslip
          </button>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   WELFARE DETAIL MODAL
══════════════════════════════════════════════════════════ */

export interface WelfareRecord {
  id: string;
  type: string;
  amount: number;
  status: "approved" | "pending";
  submitted: string;
  desc: string;
}

export function WelfareDetailModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: WelfareRecord | null }) {
  if (!item) return null;

  const timeline = item.status === "approved"
    ? [
        { e: "Request Submitted", d: item.submitted, done: true },
        { e: "HR Review", d: "Next business day", done: true },
        { e: "Management Approval", d: "Within 3 days", done: true },
        { e: "Payment Processed", d: item.submitted, done: true },
      ]
    : [
        { e: "Request Submitted", d: item.submitted, done: true },
        { e: "HR Review", d: "Pending", done: false },
        { e: "Management Approval", d: "Pending", done: false },
        { e: "Payment", d: "Pending", done: false },
      ];

  return (
    <Modal open={open} onClose={onClose} title="Welfare Request Detail" size="sm">
      <div className="space-y-4 p-1">
        <div className="rounded border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{item.type}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">{item.id} · Submitted {item.submitted}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-bold">{naira(item.amount)}</p>
              <span className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${item.status === "approved" ? "bg-healthy-bg text-healthy" : "bg-attention-bg text-attention"}`}>
                {item.status === "approved" ? "Approved" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Approval Timeline</p>
          <div className="space-y-2">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${t.done ? "bg-healthy text-white" : "border-2 border-border bg-card"}`}>
                  {t.done && <CheckCircle2 className="h-3 w-3" />}
                </div>
                <div className="flex-1 flex justify-between">
                  <p className={`text-sm ${t.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{t.e}</p>
                  <p className="font-mono text-xs text-muted-foreground">{t.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {item.status === "approved" && (
          <div className="rounded bg-healthy-bg p-3 text-center">
            <p className="text-xs font-semibold text-healthy">Payment of {naira(item.amount)} has been processed</p>
          </div>
        )}

        <button onClick={onClose} className="w-full rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition">
          Close
        </button>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   INSTRUCTION DETAIL MODAL
══════════════════════════════════════════════════════════ */

export interface InstructionRecord {
  id: string;
  title: string;
  type: string;
  from: string;
  to: string;
  project: string;
  date: string;
  deadline: string;
  status: string;
  priority: "Urgent" | "High" | "Normal";
  reason?: string;
  expectedOutcome?: string;
  visibleTo?: string[];
}

export function InstructionDetailModal({
  open, onClose, instruction, onAction, viewerRole,
}: {
  open: boolean;
  onClose: () => void;
  instruction: InstructionRecord | null;
  onAction: (action: string) => void;
  viewerRole?: string;
}) {
  const { show } = useToast();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!instruction) return null;

  const handleAction = async (action: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onAction(action);
    show(`${action} recorded, ${instruction.id}`, "success");
    onClose();
  };

  const priorityCls = instruction.priority === "Urgent"
    ? "bg-critical-bg text-critical border-critical/30"
    : instruction.priority === "High"
    ? "bg-attention-bg text-attention border-attention/30"
    : "bg-secondary text-muted-foreground border-border";

  const statusCls = instruction.status === "Completed"
    ? "bg-healthy-bg text-healthy"
    : instruction.status === "Awaiting Response"
    ? "bg-attention-bg text-attention"
    : instruction.status === "In Progress"
    ? "bg-info-bg text-info"
    : "bg-secondary text-muted-foreground";

  const roleAbbr: Record<string, string> = {
    chairman: "Chairman", gmd: "GMD", ged: "GED", ed: "ED", ggmp: "GGMP",
    pm: "PM", finance: "Finance", qs: "QS", "head-qs": "QS",
    "head-architect": "Architect", "head-engineering": "Engineering",
    "project-coordinator": "Coordinator", "site-supervisor": "Site",
    // Officer roles — included so they correctly identify as issuer/recipient
    site: "Site", "procurement-manager": "Procurement", procurement: "Procurement",
    "doc-controller": "Document Control", architect: "Architect", engineer: "Engineering",
    "head-ops": "Operations", "head-admin": "HR",
    "ict-admin": "ICT", auditor: "Audit",
  };
  const abbr = viewerRole ? (roleAbbr[viewerRole] ?? "") : "";
  const isIssuer = abbr ? instruction.from.includes(`(${abbr})`) : false;
  const isRecipient = abbr ? instruction.to.includes(`(${abbr})`) : !isIssuer;
  const isObserver = abbr ? (!isIssuer && !isRecipient) : false;
  const isCompleted = instruction.status === "Completed";

  return (
    <Modal open={open} onClose={onClose} title="Instruction Detail" size="lg">
      <div className="space-y-0 divide-y divide-border">

        {/* Header block */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">{instruction.id}</span>
            <span className="rounded border border-border bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{instruction.type}</span>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${priorityCls}`}>{instruction.priority}</span>
            <span className={`ml-auto rounded px-2 py-0.5 text-[10px] font-semibold ${statusCls}`}>{instruction.status}</span>
          </div>
          <p className="font-display text-[16px] font-bold leading-snug text-foreground">{instruction.title}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
            <span className="text-muted-foreground">Issued by <span className="font-semibold text-foreground">{instruction.from}</span></span>
            <span className="text-muted-foreground">→ <span className="font-semibold text-foreground">{instruction.to}</span></span>
          </div>
        </div>

        {/* Why it was issued */}
        {instruction.reason && (
          <div className="px-5 py-4 space-y-1.5 bg-primary/[0.03]">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary/70">Why This Instruction Was Issued</p>
            <p className="text-[13px] leading-relaxed text-foreground/80">{instruction.reason}</p>
          </div>
        )}

        {/* Expected outcome */}
        {instruction.expectedOutcome && (
          <div className="px-5 py-4 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Expected Outcome / Deliverable</p>
            <p className="text-[13px] leading-relaxed text-foreground/80">{instruction.expectedOutcome}</p>
          </div>
        )}

        {/* Meta grid */}
        <div className="px-5 py-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Instruction Details</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[12px]">
            {[
              { l: "Linked Project", v: instruction.project },
              { l: "Issue Date", v: instruction.date },
              { l: "Deadline", v: instruction.deadline },
              { l: "Current Status", v: instruction.status },
            ].map(({ l, v }) => (
              <div key={l}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{l}</p>
                <p className={`mt-0.5 font-medium ${l === "Deadline" && instruction.priority === "Urgent" ? "text-critical font-bold" : "text-foreground"}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Observer view — can see but did not issue or receive */}
        {!isCompleted && isObserver && (
          <div className="px-5 py-4">
            <div className="rounded border border-border bg-panel px-4 py-3 text-[12px] text-muted-foreground">
              <p className="font-semibold mb-0.5 text-foreground">Read-only view</p>
              <p>You have visibility into this instruction for coordination purposes. Action is required from the designated recipient only.</p>
            </div>
          </div>
        )}

        {/* Response section — only for recipients, not issuers, observers, or completed */}
        {!isCompleted && isRecipient && !isIssuer && (
          <div className="px-5 py-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Your Response</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Add a compliance note, query or progress update…"
              className="w-full rounded border border-border bg-panel px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAction("Acknowledged")}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60 transition hover:opacity-90"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Acknowledge
              </button>
              <button
                onClick={() => handleAction("Compliance Noted")}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded border border-healthy/40 bg-healthy-bg px-4 py-2 text-xs font-semibold text-healthy disabled:opacity-60 transition hover:bg-healthy/10"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Comply & Record
              </button>
              <button
                onClick={() => handleAction("Query Raised")}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground disabled:opacity-60 transition hover:border-foreground hover:text-foreground"
              >
                <AlertCircle className="h-3.5 w-3.5" /> Raise Query
              </button>
            </div>
          </div>
        )}

        {/* Issuer view — read-only monitoring */}
        {!isCompleted && isIssuer && (
          <div className="px-5 py-4">
            <div className="rounded border border-info/30 bg-info-bg px-4 py-3 text-[12px] text-info">
              <p className="font-semibold mb-0.5">Monitoring mode</p>
              <p className="text-info/80">You issued this instruction. You will be notified when the recipient acknowledges or complies. Use the status filter to track progress.</p>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="px-5 py-4">
            <div className="rounded bg-healthy-bg px-4 py-3 text-[12px] font-semibold text-healthy flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Instruction completed. No further action required.
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   OPPORTUNITY DETAIL / UPDATE MODAL (BD)
══════════════════════════════════════════════════════════ */

export interface OppRecord {
  id: string;
  name: string;
  client: string;
  company: string;
  stage: string;
  value: number;
  probability: number;
  officer: string;
  deadline: string;
  h: string;
}

export function OppDetailModal({
  open, onClose, opp, onUpdate, bdStages,
}: {
  open: boolean;
  onClose: () => void;
  opp: OppRecord | null;
  onUpdate: (id: string, updates: Partial<OppRecord>) => void;
  bdStages: string[];
}) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(opp?.stage ?? "");
  const [prob, setProb] = useState(opp?.probability?.toString() ?? "");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    if (opp) { setStage(opp.stage); setProb(opp.probability.toString()); setNotes(""); setMode("view"); }
  }, [opp]);

  if (!opp) return null;

  const handleUpdate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    onUpdate(opp.id, { stage, probability: parseInt(prob, 10) });
    show(`${opp.id} updated. Pipeline refreshed.`, "success");
    onClose();
  };

  const stageIdx = bdStages.indexOf(opp.stage);

  return (
    <Modal open={open} onClose={onClose} title="Opportunity Detail" size="lg">
      <div className="space-y-4 p-1">
        {/* Header */}
        <div className="rounded border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-muted-foreground">{opp.id}</span>
                <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white ${opp.company === "USV" ? "bg-[#1A3D8F]" : opp.company === "CANONIC" ? "bg-[#3580B5]" : "bg-[#1A3D8F]"}`}>
                  {opp.company}
                </span>
              </div>
              <p className="font-display text-base font-bold">{opp.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{opp.client}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-bold tabular-nums">{naira(opp.value)}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{opp.probability}% probability</p>
            </div>
          </div>
        </div>

        {/* Stage progress */}
        <div className="rounded bg-panel p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pipeline Stage</p>
          <div className="flex flex-wrap gap-1.5">
            {bdStages.map((s, i) => (
              <span key={s} className={`rounded px-2 py-0.5 text-[10px] font-semibold ${i < stageIdx ? "bg-primary/15 text-primary" : i === stageIdx ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                {s}
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
            <span>Current: <strong className="text-foreground">{opp.stage}</strong></span>
            <span>Officer: <strong className="text-foreground">{opp.officer}</strong></span>
            <span>Deadline: <strong className={opp.h === "attention" ? "text-attention" : "text-foreground"}>{opp.deadline}</strong></span>
          </div>
        </div>

        {/* Tab strip */}
        <div className="flex gap-1 border-b border-border">
          {(["view", "edit"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${mode === m ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {m === "view" ? "Details" : "Update Stage / Status"}
            </button>
          ))}
        </div>

        {mode === "view" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Tender Value", v: naira(opp.value) },
              { l: "Win Probability", v: `${opp.probability}%` },
              { l: "Current Stage", v: opp.stage },
              { l: "Responsible Officer", v: opp.officer },
              { l: "Company", v: opp.company },
              { l: "Submission Deadline", v: opp.deadline },
              { l: "Client / Employer", v: opp.client },
              { l: "Weighted Value", v: naira(Math.round(opp.value * opp.probability / 100)) },
            ].map(({ l, v }) => (
              <div key={l}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{l}</p>
                <p className="mt-0.5 text-sm font-medium">{v}</p>
              </div>
            ))}
          </div>
        )}

        {mode === "edit" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Update Stage <span className="text-critical">*</span>
                </label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="mt-1.5 w-full rounded border border-border bg-panel px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {bdStages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Win Probability (%) <span className="text-critical">*</span>
                  </label>
                  <FieldHint text="Estimated likelihood of winning this contract (0–100%). 70%+ = strong position, pursue actively." />
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={prob}
                  onChange={e => setProb(e.target.value)}
                  className="mt-1.5 w-full rounded border border-border bg-panel px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Update Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Describe what changed, any intelligence from client meeting, competitor info…"
                className="mt-1.5 w-full rounded border border-border bg-panel px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
              />
            </div>
            <p className="text-[11px] text-muted-foreground"><span className="text-critical">*</span> Required fields</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60 transition hover:opacity-90"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Save Update
              </button>
              <button onClick={() => setMode("view")} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   DOCUMENT VIEWER MODAL (generates dummy content by type)
══════════════════════════════════════════════════════════ */

export interface DocViewRecord {
  n: string;
  t: string;
  disc: string;
  ver: string;
  st: string;
}

function generateDocHTML(doc: DocViewRecord): string {
  const prefix = doc.n.split("-")[0];
  const color = prefix === "CON" ? "#1A3D8F" : prefix === "PO" ? "#3580B5" : prefix === "SR" ? "#16a34a" : "#1a1a1a";

  if (prefix === "DRW") {
    return `<body>
      <h1 style="color:${color}">Drawing: ${doc.n}</h1>
      <h2>${doc.t}</h2>
      <div class="meta"><span>Discipline</span><strong>${doc.disc}</strong><span>Revision</span><strong>${doc.ver}</strong><span>Status</span><strong>${doc.st}</strong></div>
      <div style="border:2px solid #ccc;min-height:400px;display:flex;align-items:center;justify-content:center;background:#f9f9f9;margin:24px 0;border-radius:4px">
        <div style="text-align:center;color:#999">
          <p style="font-size:48px;margin:0">⬛</p>
          <p style="margin-top:8px;font-size:14px">Architectural Drawing Placeholder</p>
          <p style="font-size:12px">Scale 1:100 · A1 Format · ${doc.n}</p>
        </div>
      </div>
      <table><thead><tr><th>Revision</th><th>Description</th><th>Date</th><th>By</th><th>Approved</th></tr></thead><tbody>
        <tr><td>Rev C</td><td>Updated after structural engineer comments, column relocations</td><td>04 Sep 2026</td><td>Arc. Tunde</td><td>Pending</td></tr>
        <tr><td>Rev B</td><td>Client comment incorporation, external facade revision</td><td>28 Aug 2026</td><td>Arc. Tunde</td><td>Superseded</td></tr>
        <tr><td>Rev A</td><td>First issue for approval</td><td>10 Aug 2026</td><td>Arc. Tunde</td><td>Superseded</td></tr>
      </tbody></table>`;
  }
  if (prefix === "BOQ") {
    return `<body>
      <h1 style="color:${color}">Bill of Quantities: ${doc.n}</h1>
      <h2>${doc.t}</h2>
      <div class="meta"><span>Discipline</span><strong>${doc.disc}</strong><span>Revision</span><strong>${doc.ver}</strong><span>Status</span><strong>${doc.st}</strong></div>
      <table><thead><tr><th>Item</th><th>Description</th><th>Unit</th><th>Qty</th><th style="text-align:right">Rate (₦)</th><th style="text-align:right">Amount (₦)</th></tr></thead><tbody>
        <tr><td>1.1</td><td>Excavation to formation level</td><td>m³</td><td>840</td><td style="text-align:right">12,500</td><td style="text-align:right">10,500,000</td></tr>
        <tr><td>1.2</td><td>Concrete blinding 50mm thick</td><td>m²</td><td>450</td><td style="text-align:right">8,200</td><td style="text-align:right">3,690,000</td></tr>
        <tr><td>1.3</td><td>Reinforcement: Y16 bars</td><td>tonne</td><td>28</td><td style="text-align:right">520,000</td><td style="text-align:right">14,560,000</td></tr>
        <tr><td>1.4</td><td>Reinforcement: Y12 bars</td><td>tonne</td><td>14</td><td style="text-align:right">490,000</td><td style="text-align:right">6,860,000</td></tr>
        <tr><td>1.5</td><td>Formwork to foundations</td><td>m²</td><td>320</td><td style="text-align:right">9,500</td><td style="text-align:right">3,040,000</td></tr>
        <tr><td>1.6</td><td>Concrete to foundations C30/37</td><td>m³</td><td>210</td><td style="text-align:right">95,000</td><td style="text-align:right">19,950,000</td></tr>
        <tr style="font-weight:700;border-top:2px solid #111"><td colspan="5">Sub-total: MEP Re-measure</td><td style="text-align:right">58,600,000</td></tr>
      </tbody></table>`;
  }
  if (prefix === "CON") {
    return `<body>
      <h1 style="color:${color}">CONTRACT AGREEMENT</h1>
      <h2>${doc.t}</h2>
      <div class="meta"><span>Reference</span><strong>${doc.n}</strong><span>Status</span><strong>${doc.st}</strong></div>
      <p><strong>This Agreement</strong> is made on the 15th day of January 2026 between:</p>
      <p><strong>Employer:</strong> Kaduna State Government (Ministry of Infrastructure), hereinafter "the Employer"</p>
      <p><strong>Contractor:</strong> USV Development Services Ltd, hereinafter "the Contractor"</p>
      <h2>Recitals</h2>
      <p>1. The Employer wishes to develop the Kaduna Office Complex as described in the Works Brief dated 01 December 2025.</p>
      <p>2. The Contractor has submitted a tender dated 10 January 2026 and the Employer has accepted the same.</p>
      <h2>Contract Sum</h2>
      <p>The Contract Sum is <strong>₦980,000,000 (Nine Hundred and Eighty Million Naira)</strong> subject to adjustments as provided for in this Contract.</p>
      <h2>Contract Period</h2>
      <p>The Works shall be completed within <strong>18 months</strong> from the commencement date of 01 February 2026.</p>
      <h2>Governing Law</h2>
      <p>This Contract shall be governed by the laws of the Federal Republic of Nigeria.</p>`;
  }
  if (prefix === "SR") {
    return `<body>
      <h1 style="color:${color}">DAILY SITE REPORT</h1>
      <h2>${doc.t}</h2>
      <div class="meta"><span>Reference</span><strong>${doc.n}</strong><span>Date</span><strong>04 Sep 2026</strong><span>PM</span><strong>Engr. Musa Bello</strong><span>Status</span><strong>${doc.st}</strong></div>
      <h2>Work Progress</h2>
      <table><thead><tr><th>Activity</th><th>Planned</th><th>Achieved</th><th>Variance</th><th>Remarks</th></tr></thead><tbody>
        <tr><td>Foundation pour Block C</td><td>100%</td><td>100%</td><td>0%</td><td>Completed as planned</td></tr>
        <tr><td>Reinforcement fix Block D</td><td>60%</td><td>45%</td><td>-15%</td><td>Steel delivery delayed</td></tr>
        <tr><td>Blockwork Level 2</td><td>40%</td><td>40%</td><td>0%</td><td>On track</td></tr>
      </tbody></table>
      <h2>Issues</h2>
      <p>1. Reinforcement shortage, 42T Y16/Y12 PO raised, awaiting approval. Foundation works for Block D at risk.</p>
      <p>2. Temporary dewatering pump operational. Block C site cleared.</p>`;
  }
  if (prefix === "PO") {
    return `<body>
      <h1 style="color:${color}">PURCHASE ORDER</h1>
      <h2>${doc.t}</h2>
      <div class="meta"><span>PO Number</span><strong>${doc.n}</strong><span>Status</span><strong>${doc.st}</strong><span>Date</span><strong>05 Sep 2026</strong></div>
      <p><strong>To:</strong> Julius Steel Ltd, 14 Industrial Avenue, Ojo, Lagos</p>
      <p><strong>From:</strong> USV Development Services Ltd (Procurement)</p>
      <table><thead><tr><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th style="text-align:right">Unit Price (₦)</th><th style="text-align:right">Total (₦)</th></tr></thead><tbody>
        <tr><td>1</td><td>Reinforcement Bar Y16 (High Yield)</td><td>28</td><td>Tonne</td><td style="text-align:right">520,000</td><td style="text-align:right">14,560,000</td></tr>
        <tr><td>2</td><td>Reinforcement Bar Y12 (High Yield)</td><td>14</td><td>Tonne</td><td style="text-align:right">490,000</td><td style="text-align:right">6,860,000</td></tr>
        <tr style="font-weight:700;border-top:2px solid #111"><td colspan="5">Total</td><td style="text-align:right">63,400,000</td></tr>
      </tbody></table>
      <p><strong>Delivery:</strong> Abuja Housing Ph II Site, Lugbe FCT, within 5 working days</p>
      <p><strong>Payment Terms:</strong> 30 days net on delivery and verification</p>`;
  }
  return `<body><h1>${doc.n}</h1><h2>${doc.t}</h2><p>Document type: ${doc.disc} · Status: ${doc.st} · Version: ${doc.ver}</p>`;
}

export function DocumentViewerModal({ open, onClose, doc }: { open: boolean; onClose: () => void; doc: DocViewRecord | null }) {
  if (!doc) return null;

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) return;
    const body = generateDocHTML(doc);
    win.document.write(`<!DOCTYPE html><html><head><title>${doc.n}</title><style>
      body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:40px auto;color:#1a1a1a;font-size:14px;line-height:1.6}
      h1{font-size:24px;margin:0 0 4px} h2{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#555;margin:20px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px}
      .meta{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:#f5f5f5;padding:12px;border-radius:4px;margin:12px 0}
      .meta span{font-size:11px;color:#777} .meta strong{display:block;color:#111}
      table{width:100%;border-collapse:collapse;margin:12px 0} td,th{padding:8px 10px;text-align:left;font-size:13px}
      th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#777;border-bottom:2px solid #ddd}
      tr:nth-child(even){background:#fafafa} tr:hover{background:#f5f5f5}
      footer{margin-top:40px;font-size:11px;color:#999;text-align:center;border-top:1px solid #eee;padding-top:16px}
      @media print{body{margin:20mm}}
    </style></head><html>${body}
      <footer>NEXUS ERP · USV Development Services Ltd / Canonic Associates Ltd · ${doc.n} · ${doc.ver}</footer>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const prefix = doc.n.split("-")[0];
  const typeLabel: Record<string, string> = {
    DRW: "Architectural Drawing", BOQ: "Bill of Quantities", CON: "Contract Document",
    SR: "Site Report", PO: "Purchase Order", INV: "Invoice", INS: "Instruction",
  };

  return (
    <Modal open={open} onClose={onClose} title="Document Viewer" size="md">
      <div className="space-y-4 p-1">
        <div className="rounded border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground">{doc.n}</p>
              <p className="mt-0.5 font-display text-sm font-bold">{doc.t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{typeLabel[prefix] ?? doc.disc} · {doc.ver}</p>
            </div>
            <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${doc.st === "Executed" || doc.st === "Approved" || doc.st === "Issued" || doc.st === "Reviewed" ? "bg-healthy-bg text-healthy" : doc.st === "Archived" || doc.st === "Superseded" ? "bg-critical-bg text-critical" : "bg-attention-bg text-attention"}`}>
              {doc.st}
            </span>
          </div>
        </div>

        <div className="rounded bg-panel p-6 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-semibold text-foreground">{typeLabel[prefix] ?? "Document"}</p>
          <p className="mt-1 text-xs text-muted-foreground">{doc.n} · {doc.ver} · {doc.disc}</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Click Download to open the document in a printable view</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
            <Send className="h-3.5 w-3.5" /> View / Download
          </button>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   EXPRESS APPROVAL MODAL (GMD / CHAIRMAN OVERRIDE)
══════════════════════════════════════════════════════════ */

export function ExpressApprovalModal({
  open, onClose, item, onApprove,
}: {
  open: boolean;
  onClose: () => void;
  item: { id: string; title: string; amount?: number } | null;
  onApprove: (id: string) => void;
}) {
  const { show } = useToast();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  if (!item) return null;

  const approvalHistory: AuditEntry[] = [
    { action: "Submitted", user: "Engr. Adaeze Okafor", role: "GED Projects", timestamp: "2026-09-05 09:14" },
    { action: "First Review", user: "Arc. Biodun Fashola", role: "GGMP", timestamp: "2026-09-05 11:32", note: "Technical specs reviewed and confirmed" },
    { action: "Pending GMD/Chairman", user: "System", role: "Workflow Engine", timestamp: "2026-09-05 11:33" },
  ];

  const handleApprove = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onApprove(item.id);
    show(`Express approval granted for ${item.id}. All intermediate approvers notified.`, "success");
    onClose();
    setReason("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Express Approval: Executive Override" size="sm">
      <div className="space-y-4 p-1">
        <div className="flex items-start gap-3 rounded border border-attention/30 bg-attention-bg p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-attention" />
          <div>
            <p className="text-sm font-semibold text-attention">This bypasses the standard approval chain</p>
            <p className="mt-0.5 text-xs text-attention/80">All intermediate approvers will be notified. This action is logged and auditable.</p>
          </div>
        </div>

        <div className="rounded border border-border p-3">
          <p className="font-mono text-[10px] text-muted-foreground">{item.id}</p>
          <p className="mt-0.5 font-semibold">{item.title}</p>
          {item.amount !== undefined && (
            <p className="mt-1 font-mono text-sm font-bold tabular-nums">{naira(item.amount)}</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Reason for Express Approval <span className="text-critical">*</span></label>
            <FieldHint text="Your written justification is recorded in the audit trail and must satisfy board governance requirements." />
          </div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="State the business justification for bypassing standard chain (e.g. site stoppage, time-critical, client deadline)…"
            className="mt-1.5 w-full rounded border border-border bg-panel px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          />
        </div>

        <div className="rounded border border-border">
          <button
            type="button"
            onClick={() => setHistoryOpen(v => !v)}
            className="flex w-full items-center justify-between px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition"
          >
            <span>Approval History</span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${historyOpen ? "rotate-90" : ""}`} />
          </button>
          {historyOpen && (
            <div className="border-t border-border px-3 py-3">
              <AuditTrail entries={approvalHistory} />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading || !reason.trim()}
            className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50 transition hover:opacity-90"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" />}
            Grant Express Approval
          </button>
          <button onClick={onClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   CONFIRM DIALOG — reusable confirmation prompt
══════════════════════════════════════════════════════════ */

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "critical" | "attention";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  const btnClass = tone === "critical"
    ? "bg-critical text-white hover:bg-critical/90"
    : tone === "attention"
    ? "bg-attention text-white hover:bg-attention/90"
    : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
      onClick={onCancel}
    >
      <div
        className="animate-in w-full max-w-sm rounded-[var(--radius)] border border-border bg-card p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h3 id="confirm-title" className="font-display text-[15px] font-bold">{title}</h3>
        <p className="mt-2 text-[13px] text-muted-foreground">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-[var(--radius)] border border-border px-4 py-2 text-[13px] font-medium hover:bg-muted"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-[var(--radius)] px-4 py-2 text-[13px] font-semibold transition active:scale-[0.98] ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INVOICE TEMPLATE
══════════════════════════════════════════════════════════ */

const USV_BANK = { bank: "Access Bank Nigeria Plc", account: "0812 3456 789", name: "USV Development Services Ltd", sort: "044" };
const CAN_BANK = { bank: "Guaranty Trust Bank (GTB)", account: "0332 9876 543", name: "Canonic Associates Ltd", sort: "058" };
const COMPANY_ADDR = "Plot 254, Cadastral Zone B09, Jabi, Abuja FCT, Nigeria";
const COMPANY_TEL  = "+234 (0) 803 000 0000";
const COMPANY_EMAIL_USV = "finance@usvdevelopment.com.ng";
const COMPANY_EMAIL_CAN = "finance@canonicassociates.com.ng";

export function InvoiceTemplate({ inv }: { inv: AppInvoice }) {
  const bank = inv.company === "USV" ? USV_BANK : CAN_BANK;
  const email = inv.company === "USV" ? COMPANY_EMAIL_USV : COMPANY_EMAIL_CAN;
  const subtotal = inv.lineItems.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;

  return (
    <div className="bg-white text-[#1a1a1a] rounded-lg overflow-hidden border border-[#ddd] shadow-sm text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Letterhead */}
      <div style={{ background: inv.company === "USV" ? "#0B2551" : "#0D3E72" }} className="px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[22px] font-black tracking-tight text-white leading-none">
              {inv.company === "USV" ? "USV DEVELOPMENT SERVICES LTD" : "CANONIC ASSOCIATES LTD"}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-white/60">{COMPANY_ADDR}</p>
            <p className="text-[11px] text-white/60">{COMPANY_TEL} · {email}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white/40 text-[18px] font-black text-white">
            {inv.company === "USV" ? "USV" : "CAN"}
          </div>
        </div>
      </div>

      {/* Invoice title strip */}
      <div className="flex items-center justify-between border-b-2 px-8 py-3" style={{ borderColor: inv.company === "USV" ? "#0B2551" : "#0D3E72", background: "#f7f9fc" }}>
        <p className="text-[18px] font-black uppercase tracking-widest" style={{ color: inv.company === "USV" ? "#0B2551" : "#0D3E72" }}>Tax Invoice</p>
        <div className="text-right">
          <p className="font-mono text-[13px] font-bold text-[#333]">{inv.id}</p>
          <p className="text-[11px] text-[#888]">{inv.createdAt}</p>
          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${inv.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {inv.status === "paid" ? "PAID" : "AWAITING PAYMENT"}
          </span>
        </div>
      </div>

      {/* Bill from / Bill to */}
      <div className="grid grid-cols-2 gap-6 px-8 py-5 border-b border-[#eee]">
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#999]">From (Vendor)</p>
          <p className="font-bold text-[14px]">{inv.vendorName}</p>
          <p className="text-[12px] text-[#555]">{inv.vendorAddress}</p>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#999]">Bill To</p>
          <p className="font-bold text-[14px]">{inv.billTo}</p>
          <p className="text-[12px] text-[#555]">{COMPANY_ADDR}</p>
          <p className="mt-1 text-[11px] font-medium text-[#555]">Project: <span className="font-bold text-[#222]">{inv.project}</span></p>
        </div>
      </div>

      {/* Line items */}
      <div className="px-8 py-4">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: inv.company === "USV" ? "#0B2551" : "#0D3E72" }}>
              {["#", "Description", "Qty", "Unit Price", "Amount"].map((h, i) => (
                <th key={h} className={`py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white ${i === 1 ? "text-left px-3" : "text-right px-3"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inv.lineItems.map((item, i) => (
              <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f7f9fc]"}>
                <td className="px-3 py-2.5 text-right font-mono text-[11px] text-[#999]">{i + 1}</td>
                <td className="px-3 py-2.5 font-medium">{item.description}</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">{item.qty.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">{nairaFmt(item.unitPrice)}</td>
                <td className="px-3 py-2.5 text-right font-mono font-bold tabular-nums">{nairaFmt(item.qty * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-3 border-t border-[#ddd] pt-3 flex justify-end">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-[#666]">Subtotal</span>
              <span className="font-mono tabular-nums">{nairaFmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#666]">VAT (7.5%)</span>
              <span className="font-mono tabular-nums">{nairaFmt(vat)}</span>
            </div>
            <div className="flex justify-between border-t-2 pt-1.5 text-[14px] font-bold" style={{ borderColor: inv.company === "USV" ? "#0B2551" : "#0D3E72" }}>
              <span>Total Due</span>
              <span className="font-mono tabular-nums" style={{ color: inv.company === "USV" ? "#0B2551" : "#0D3E72" }}>{nairaFmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank details + payment status */}
      <div className="border-t border-[#eee] px-8 py-5" style={{ background: "#f7f9fc" }}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#999]">Payment Instructions</p>
            <div className="space-y-0.5 text-[12px]">
              <p><span className="text-[#888]">Bank: </span><span className="font-semibold">{bank.bank}</span></p>
              <p><span className="text-[#888]">Account Name: </span><span className="font-semibold">{bank.name}</span></p>
              <p><span className="text-[#888]">Account No: </span><span className="font-mono font-bold">{bank.account}</span></p>
              <p><span className="text-[#888]">Sort Code: </span><span className="font-mono">{bank.sort}</span></p>
            </div>
          </div>
          {inv.status === "paid" && inv.paymentReceipt && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-green-700">Payment Confirmed</p>
              <p className="text-[12px] font-semibold text-green-700">✓ PAID: {inv.paidAt}</p>
              <p className="text-[11px] text-[#555]">Authorised by: {inv.paidBy}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-[#555]">
                <Paperclip className="h-3 w-3" /> {inv.paymentReceipt}
              </p>
              {inv.paymentNote && <p className="mt-1 text-[11px] italic text-[#777]">{inv.paymentNote}</p>}
            </div>
          )}
        </div>
        <p className="mt-4 text-[10px] text-[#aaa] italic">This invoice is computer-generated and is valid without signature. Any disputes must be raised within 7 days of receipt.</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CREATE INVOICE MODAL (Procurement)
══════════════════════════════════════════════════════════ */

export function CreateInvoiceModal({
  open, onClose, createdBy,
}: {
  open: boolean;
  onClose: () => void;
  createdBy: string;
}) {
  const { show } = useToast();
  const { addInvoice } = useInvoices();
  const [step, setStep] = useState<"form" | "preview">("form");
  const [company, setCompany] = useState<"USV" | "CANONIC">("USV");
  const [project, setProject] = useState(projects[0]?.name ?? "");
  const [vendorName, setVendorName] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [lines, setLines] = useState<InvoiceLineItem[]>([{ id: "l1", description: "", qty: 1, unitPrice: 0 }]);
  const [preview, setPreview] = useState<AppInvoice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addLine = () => setLines(p => [...p, { id: `l${Date.now()}`, description: "", qty: 1, unitPrice: 0 }]);
  const removeLine = (id: string) => setLines(p => p.filter(l => l.id !== id));
  const updateLine = (id: string, field: keyof InvoiceLineItem, val: string | number) =>
    setLines(p => p.map(l => l.id === id ? { ...l, [field]: val } : l));

  const subtotal = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;

  const buildInvoice = (): AppInvoice => ({
    id: `INV-${company}-2026-${String(50 + Math.floor(Math.random() * 40)).padStart(4, "0")}`,
    company,
    project,
    vendorName,
    vendorAddress,
    billTo: company === "USV" ? "USV Development Services Ltd" : "Canonic Associates Ltd",
    lineItems: lines,
    createdBy,
    createdAt: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    status: "submitted",
    total,
  });

  const handlePreview = () => { setPreview(buildInvoice()); setStep("preview"); };

  const handleSubmit = async () => {
    if (!preview) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    addInvoice(preview);
    setSubmitting(false);
    show(`Invoice ${preview.id} raised and submitted to Finance`, "success");
    onClose();
    setStep("form");
    setLines([{ id: "l1", description: "", qty: 1, unitPrice: 0 }]);
    setVendorName(""); setVendorAddress(""); setPreview(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[4vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl rounded-[var(--radius)] border border-border bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="font-display text-[15px] font-bold">Raise Invoice</p>
            <p className="text-[11px] text-muted-foreground">Enter materials and the system generates a formatted invoice</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={`rounded-full px-2.5 py-0.5 font-semibold ${step === "form" ? "bg-primary text-primary-foreground" : "bg-panel text-muted-foreground"}`}>1 Enter Details</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className={`rounded-full px-2.5 py-0.5 font-semibold ${step === "preview" ? "bg-primary text-primary-foreground" : "bg-panel text-muted-foreground"}`}>2 Preview & Submit</span>
            </div>
            <button onClick={onClose} className="rounded p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="p-6">
          {step === "form" ? (
            <div className="space-y-5">
              {/* Company + Project */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Issuing Company <span className="text-critical">*</span></label>
                  <div className="flex gap-2">
                    {(["USV", "CANONIC"] as const).map(c => (
                      <button key={c} onClick={() => setCompany(c)}
                        className={`flex-1 rounded border py-2 text-xs font-bold transition ${company === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Project <span className="text-critical">*</span></label>
                  <select value={project} onChange={e => setProject(e.target.value)}
                    className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                    {projects.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Vendor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Vendor / Supplier Name <span className="text-critical">*</span></label>
                  <input value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="e.g. Julius Steel Ltd"
                    className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Vendor Address</label>
                  <input value={vendorAddress} onChange={e => setVendorAddress(e.target.value)} placeholder="e.g. 14 Industrial Ave, Abuja"
                    className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
              </div>

              {/* Line items */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Line Items <span className="text-critical">*</span></label>
                  <button onClick={addLine} className="flex items-center gap-1 rounded border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                    <Plus className="h-3 w-3" /> Add line
                  </button>
                </div>
                <div className="overflow-x-auto rounded border border-border">
                  <table className="w-full min-w-[580px]">
                    <thead className="bg-panel">
                      <tr className="border-b border-border">
                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Description / Material</th>
                        <th className="w-20 px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Qty</th>
                        <th className="w-36 px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Unit Price (₦)</th>
                        <th className="w-32 px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Amount (₦)</th>
                        <th className="w-8 px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {lines.map((l) => (
                        <tr key={l.id}>
                          <td className="px-2 py-1.5">
                            <input value={l.description} onChange={e => updateLine(l.id, "description", e.target.value)}
                              placeholder="e.g. Reinforcement Steel Y16, 10T"
                              className="w-full rounded border border-transparent bg-transparent px-1 py-1 text-sm focus:border-border focus:bg-panel focus:outline-none" />
                          </td>
                          <td className="px-2 py-1.5">
                            <input type="number" min={1} value={l.qty} onChange={e => updateLine(l.id, "qty", Number(e.target.value))}
                              className="w-full rounded border border-transparent bg-transparent px-1 py-1 text-right text-sm font-mono focus:border-border focus:bg-panel focus:outline-none" />
                          </td>
                          <td className="px-2 py-1.5">
                            <input type="number" min={0} value={l.unitPrice} onChange={e => updateLine(l.id, "unitPrice", Number(e.target.value))}
                              className="w-full rounded border border-transparent bg-transparent px-1 py-1 text-right text-sm font-mono focus:border-border focus:bg-panel focus:outline-none" />
                          </td>
                          <td className="px-3 py-1.5 text-right text-sm font-mono font-bold tabular-nums text-foreground">
                            {nairaFmt((Number(l.qty) || 0) * (Number(l.unitPrice) || 0))}
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            {lines.length > 1 && (
                              <button onClick={() => removeLine(l.id)} className="rounded p-0.5 text-muted-foreground hover:text-critical">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-border bg-panel">
                      <tr>
                        <td colSpan={3} className="px-3 py-2.5 text-right text-[12px] font-semibold text-muted-foreground">Subtotal</td>
                        <td className="px-3 py-2.5 text-right text-sm font-mono font-bold tabular-nums">{nairaFmt(subtotal)}</td>
                        <td />
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-3 py-1 text-right text-[12px] text-muted-foreground">VAT (7.5%)</td>
                        <td className="px-3 py-1 text-right text-sm font-mono tabular-nums text-muted-foreground">{nairaFmt(vat)}</td>
                        <td />
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right text-[13px] font-bold">Total Due</td>
                        <td className="px-3 py-2 text-right text-[15px] font-mono font-black tabular-nums text-primary">{nairaFmt(total)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button onClick={onClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button
                  onClick={handlePreview}
                  disabled={!vendorName.trim() || lines.some(l => !l.description.trim()) || total === 0}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
                >
                  Preview Invoice <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[60vh] overflow-y-auto rounded border border-border">
                {preview && <InvoiceTemplate inv={preview} />}
              </div>
              <div className="flex justify-between gap-2 border-t border-border pt-4">
                <button onClick={() => setStep("form")} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">← Edit Details</button>
                <div className="flex gap-2">
                  <button onClick={onClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    {submitting ? "Submitting…" : "Submit to Finance"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAY INVOICE MODAL (Finance)
══════════════════════════════════════════════════════════ */

export function PayInvoiceModal({
  inv, onClose, paidBy,
}: {
  inv: AppInvoice | null;
  onClose: () => void;
  paidBy: string;
}) {
  const { show } = useToast();
  const { markPaid } = useInvoices();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!inv) return null;

  const subtotal = inv.lineItems.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + vat;

  const handlePay = async () => {
    if (!receiptFile) { show("Please upload the payment receipt before confirming.", "warning"); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    markPaid(inv.id, receiptFile.name, note, paidBy);
    setSubmitting(false);
    show(`${inv.id} marked as paid. Receipt evidence recorded.`, "success");
    onClose();
    setReceiptFile(null);
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[5vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl rounded-[var(--radius)] border border-border bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="font-display text-[15px] font-bold">Mark Invoice as Paid</p>
            <p className="font-mono text-[11px] text-muted-foreground">{inv.id} · {inv.vendorName}</p>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Invoice summary */}
          <div className="rounded-lg border border-border bg-panel p-4">
            <div className="mb-3 max-h-[30vh] overflow-y-auto rounded border border-border">
              <InvoiceTemplate inv={inv} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <p className="text-sm text-muted-foreground">Total Amount Due (incl. 7.5% VAT)</p>
              <p className="font-mono text-xl font-black tabular-nums text-primary">{nairaFmt(total)}</p>
            </div>
          </div>

          {/* Receipt upload — required */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Payment Receipt <span className="text-critical">*</span>
              <span className="ml-1 normal-case font-normal text-muted-foreground">(PDF, image, or bank advice; required before submission)</span>
            </label>
            <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => setReceiptFile(e.target.files?.[0] ?? null)} />
            {receiptFile ? (
              <div className="flex items-center gap-3 rounded border border-healthy/40 bg-healthy-bg px-4 py-3">
                <Paperclip className="h-4 w-4 shrink-0 text-healthy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{receiptFile.name}</p>
                  <p className="text-[11px] text-muted-foreground">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => setReceiptFile(null)} className="rounded p-1 text-muted-foreground hover:text-critical"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-border bg-panel px-4 py-6 text-center transition hover:border-primary/40 hover:bg-primary/5"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Click to upload receipt</p>
                <p className="text-[11px] text-muted-foreground">Bank transfer advice, NIBSS confirmation, or payment screenshot</p>
              </button>
            )}
          </div>

          {/* Payment reference / note */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Payment Reference / Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              placeholder="e.g. Bank transfer via Access Bank. NIBSS ref: NBS20260909142200. Approved per payment cert CERT-FIN-2026-012."
              className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none" />
          </div>

          <div className="flex items-center gap-3 rounded border border-info/30 bg-info-bg px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-info" />
            <p className="text-[12px] text-info">The receipt will be permanently attached to this invoice record and visible to Procurement and Finance audit trails.</p>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button onClick={onClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
            <button
              onClick={handlePay}
              disabled={submitting || !receiptFile}
              className="inline-flex items-center gap-1.5 rounded bg-healthy px-5 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              {submitting ? "Processing…" : "Confirm Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
