import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Clock,
  Download,
  FileText,
  FileBadge,
  GitBranch,
  Globe,
  Inbox,
  KeyRound,
  Laptop,
  Mail,
  Package,
  Plus,
  Paperclip,
  Receipt,
  RotateCcw,
  Search,
  Send,
  Shield,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  actions,
  approvalRequests,
  approvals,
  cashFlowData,
  contracts,
  currentUser,
  ictAssets,
  ictTickets,
  naira,
  payables,
  procRequests,
  projects,
  staffDirectory,
  staffMembers,
  tenders,
  timeline,
  userPersonas,
  departmentHeadMap,
  headDisplayMap,
  type ApprovalRequest,
  type ApprovalRequestStatus,
  type Health,
  type UserPersona,
} from "./data";
import { Card, Chip, CompanyTag, exportCSV, HealthDot, Pagination, PriorityDot, Progress, SectionHead, StatusBadge, healthLabel } from "./ui";
import {
  useToast,
  ActionModal,
  ApprovalDetailModal,
  DirectiveTag,
  DocumentUploadModal,
  SiteReportViewerModal,
  InvoiceDetailModal,
  InstructionDetailModal,
  DocumentViewerModal,
  ExpressApprovalModal,
  CreateInvoiceModal,
  PayInvoiceModal,
  InvoiceTemplate,
  type ApprovalDetailItem,
  type UploadedDoc,
  type InvoiceRecord,
  type InstructionRecord,
  type DocViewRecord,
} from "./overlays";
import { useInvoices, nairaFmt, type AppInvoice } from "./invoice-store";

type Nav = (screen: string, projectCode?: string) => void;

const chartColors = { primary: "#1A3D8F", accent: "#3580B5", grid: "#C8D5EC" };

function KpiTile({
  label,
  value,
  sub,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: Health;
  icon: any;
}) {
  const toneText =
    tone === "critical" ? "text-critical" : tone === "attention" ? "text-attention" : "text-foreground";
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
      </div>
      <p className={`mt-2 font-display text-xl sm:text-2xl font-bold tabular-nums ${toneText}`}>{value}</p>
      <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">{sub}</p>
    </Card>
  );
}

function ScreenHeader({ title, desc, children }: { title: string; desc: string; children?: any }) {
  return (
    <div className="mb-4 sm:mb-5 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────── EXECUTIVE COMMAND CENTRE ─────────────────────────── */

const cashflow = [
  { m: "Apr", invoiced: 340, received: 300 },
  { m: "May", invoiced: 420, received: 360 },
  { m: "Jun", invoiced: 510, received: 390 },
  { m: "Jul", invoiced: 480, received: 410 },
  { m: "Aug", invoiced: 560, received: 430 },
  { m: "Sep", invoiced: 610, received: 470 },
];

const pipeline = [
  { stage: "Opportunity", v: 8200 },
  { stage: "Tender", v: 9900 },
  { stage: "Proposal", v: 5400 },
  { stage: "Awarded", v: 3400 },
];

export function CommandCentre({ nav }: { nav: Nav }) {
  const [period, setPeriod] = useState("6M");
  const atRisk = projects.filter((p) => p.health !== "healthy");
  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const totalOverdue = projects.reduce((s, p) => s + p.receivablesOverdue, 0);

  // Company split computations
  const usvProjects = projects.filter((p) => p.company === "USV" || p.company === "USV + CANONIC");
  const canonicProjects = projects.filter((p) => p.company === "CANONIC" || p.company === "USV + CANONIC");
  const usvValue = usvProjects.reduce((s, p) => s + p.contractValue, 0);
  const canonicValue = canonicProjects.reduce((s, p) => s + p.contractValue, 0);
  const usvOverdue = usvProjects.reduce((s, p) => s + p.receivablesOverdue, 0);
  const canonicOverdue = canonicProjects.reduce((s, p) => s + p.receivablesOverdue, 0);
  const usvAvgProg = Math.round(usvProjects.reduce((s, p) => s + p.progressActual, 0) / usvProjects.length);
  const canonicAvgProg = Math.round(canonicProjects.reduce((s, p) => s + p.progressActual, 0) / canonicProjects.length);

  // Staff by directorate
  const staffByDir = (dir: string) => staffMembers.filter((s) => s.directorate === dir);
  const dirStats = [
    { label: "Governance", dir: "governance" },
    { label: "Projects", dir: "projects" },
    { label: "Technical", dir: "technical" },
    { label: "Corporate", dir: "corporate" },
  ].map(({ label, dir }) => {
    const group = staffByDir(dir);
    const avgWl = group.length
      ? Math.round(group.reduce((s, m) => s + m.workload, 0) / group.length)
      : 0;
    return { label, count: group.length, avgWl };
  });

  const healthDims: { key: keyof typeof projects[0]; label: string }[] = [
    { key: "schedule", label: "Sched" },
    { key: "cost", label: "Cost" },
    { key: "procurement", label: "Proc" },
    { key: "payment", label: "Pay" },
    { key: "quality", label: "Qual" },
    { key: "client_state", label: "Client" },
  ];

  type ExcTone = "critical" | "attention";
  const exceptions: { tone: ExcTone; msg: string; action: string; navTarget: string; code?: string }[] = [];
  projects.forEach((p) => {
    const variance = p.progressActual - p.progressPlanned;
    if (variance < -10)
      exceptions.push({ tone: "critical", msg: `${p.name}: schedule ${Math.abs(variance)}% behind plan`, action: "Open", navTarget: "project", code: p.code });
    if (p.receivablesOverdue > 50_000_000)
      exceptions.push({ tone: "critical", msg: `${naira(p.receivablesOverdue)} overdue receivable, ${p.name}`, action: "Escalate", navTarget: "approvals" });
    if (p.procurement === "critical")
      exceptions.push({ tone: "critical", msg: `Procurement blocked, ${p.name}`, action: "Review", navTarget: "procurement" });
  });
  const overloadedDirs = dirStats.filter((d) => d.avgWl >= 85);
  overloadedDirs.forEach((d) => exceptions.push({ tone: "critical", msg: `${d.label} directorate overloaded, avg workload ${d.avgWl}%`, action: "View", navTarget: "people" }));
  exceptions.push({ tone: "critical", msg: "4 approvals breaching SLA, oldest 3 days overdue", action: "Review", navTarget: "approvals" });
  exceptions.push({ tone: "attention", msg: "Site report missing for Abuja Housing, last submitted 2 days ago", action: "Follow up", navTarget: "action" });

  return (
    <div className="animate-in">
      <ScreenHeader
        title="Executive Command Centre"
        desc="Group control room: what requires decision, what is at risk, and where the money is. USV + CANONIC consolidated."
      >
        <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-healthy" /> Live · updated 14:32 WAT
        </div>
      </ScreenHeader>

      {/* ── Group KPIs ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiTile label="Active Projects" value="6" sub={`${naira(totalValue)} contract value`} icon={ClipboardList} />
        <KpiTile label="Projects at Risk" value={String(atRisk.length)} sub="2 critical · 3 attention" tone="critical" icon={AlertTriangle} />
        <KpiTile label="Pending Approvals" value="14" sub="4 breaching SLA" tone="attention" icon={Inbox} />
        <KpiTile label="Outstanding Receivables" value={naira(totalOverdue)} sub="₦85m > 30 days" tone="critical" icon={TrendingDown} />
        <KpiTile label="Tender Pipeline" value={naira(9_890_000_000)} sub="3 live · 1 closes in 5 days" icon={FileText} />
      </div>

      {/* ── Company Performance Split ── */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {[
          {
            tag: "USV",
            name: "USV Development Services Ltd",
            color: "#1A3D8F",
            ps: usvProjects,
            value: usvValue,
            overdue: usvOverdue,
            avgProg: usvAvgProg,
          },
          {
            tag: "CANONIC",
            name: "Canonic Associates Ltd",
            color: "#3580B5",
            ps: canonicProjects,
            value: canonicValue,
            overdue: canonicOverdue,
            avgProg: canonicAvgProg,
          },
        ].map((co) => (
          <Card key={co.tag} className="p-4">
            <div className="mb-3 flex items-center gap-2.5">
              <span
                className="rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ background: co.color }}
              >
                {co.tag}
              </span>
              <span className="text-xs font-semibold text-foreground">{co.name}</span>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 border-b border-border pb-3 sm:grid-cols-4">
              <div>
                <p className="font-display text-xl font-bold tabular-nums">{co.ps.length}</p>
                <p className="text-[10px] text-muted-foreground">Projects</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold tabular-nums">{naira(co.value)}</p>
                <p className="text-[10px] text-muted-foreground">Contract</p>
              </div>
              <div>
                <p className={`font-display text-xl font-bold tabular-nums ${co.overdue > 0 ? "text-critical" : "text-healthy"}`}>
                  {co.overdue > 0 ? naira(co.overdue) : "—"}
                </p>
                <p className="text-[10px] text-muted-foreground">Overdue</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold tabular-nums">{co.avgProg}%</p>
                <p className="text-[10px] text-muted-foreground">Avg Progress</p>
              </div>
            </div>
            <div className="space-y-2">
              {co.ps.slice(0, 3).map((p) => (
                <button
                  key={p.code}
                  onClick={() => nav("project", p.code)}
                  className="group flex w-full items-center gap-2.5 text-left"
                >
                  <HealthDot h={p.health} />
                  <span className="w-36 truncate text-[11px] text-muted-foreground group-hover:text-foreground">
                    {p.name}
                  </span>
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${p.progressActual}%`,
                        background:
                          p.health === "critical"
                            ? "#b23120"
                            : p.health === "attention"
                              ? "#b5820e"
                              : co.color,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
                    {p.progressActual}%
                  </span>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Portfolio Health Matrix + Decisions + Staff ── */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Health Matrix */}
        <Card className="lg:col-span-2">
          <SectionHead
            title="Portfolio Health Matrix"
            hint="All projects × all dimensions; click any row to open control room"
            action={<Chip tone="accent">{atRisk.length} at risk</Chip>}
          />
          {/* Progress bar legend */}
          <div className="flex flex-wrap items-center gap-4 border-b border-border/60 px-4 pb-2.5 pt-0 text-[10px] text-muted-foreground">
            <span className="font-semibold uppercase tracking-[0.1em]">Progress key:</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-6 rounded-full bg-border-strong/60" />
              Planned target
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-6 rounded-full bg-healthy" />
              Actual: on / ahead
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-6 rounded-full bg-critical" />
              Actual: behind plan
            </span>
            <span className="ml-auto text-[9px] italic opacity-60">Hover any bar for detail</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-panel">
                  <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Project
                  </th>
                  {healthDims.map((d) => (
                    <th
                      key={d.key}
                      className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {d.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr
                    key={p.code}
                    className="cursor-pointer border-b border-border transition hover:bg-panel"
                    onClick={() => nav("project", p.code)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <HealthDot h={p.health} />
                        <div>
                          <p className="max-w-[160px] truncate text-xs font-semibold">
                            {p.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <CompanyTag company={p.company} />
                            <span className="text-[10px] text-muted-foreground">{p.pm}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {healthDims.map((d) => (
                      <td key={d.key} className="px-2 py-2.5 text-center">
                        <HealthDot h={p[d.key] as Health} />
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <div
                        className="w-20"
                        title={`Target: ${p.progressPlanned}% · Actual: ${p.progressActual}% · Variance: ${p.progressActual >= p.progressPlanned ? "+" : ""}${p.progressActual - p.progressPlanned}pp`}
                      >
                        <Progress planned={p.progressPlanned} actual={p.progressActual} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right column: decisions + staff */}
        <div className="space-y-3">
          <Card>
            <SectionHead title="Awaiting Your Decision" hint="Executive authorisations" />
            <ul className="divide-y divide-border">
              {actions.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <button
                    onClick={() => nav("action")}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-panel"
                  >
                    <PriorityDot p={a.priority} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">{a.title}</p>
                      <p className={`mt-0.5 text-[11px] ${a.overdue ? "text-critical" : "text-muted-foreground"}`}>
                        {a.due} · {a.company}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => nav("action")}
              className="w-full border-t border-border px-4 py-2.5 text-xs font-semibold text-primary hover:bg-panel"
            >
              Open Action Centre →
            </button>
          </Card>

          <Card>
            <SectionHead title="Staff Utilisation" hint="Avg workload by directorate" />
            <div className="space-y-3 px-4 py-3">
              {dirStats.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="w-20 text-[11px] text-muted-foreground">{d.label}</span>
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${d.avgWl}%`,
                        background:
                          d.avgWl >= 85 ? "#b23120" : d.avgWl >= 70 ? "#b5820e" : "#1A3D8F",
                      }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {d.count} · {d.avgWl}%
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => nav("people")}
              className="w-full border-t border-border px-4 py-2.5 text-xs font-semibold text-primary hover:bg-panel"
            >
              People & Teams →
            </button>
          </Card>
        </div>
      </div>

      {/* ── Cashflow + Pipeline ── */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHead title="Invoiced vs Received" hint="Group cashflow, ₦m" action={
            <div className="flex items-center gap-0.5 rounded border border-border bg-panel px-1 py-0.5">
              {["7D","30D","90D","6M","YTD","1Y"].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold transition ${period === p ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>
              ))}
            </div>
          } />
          <div className="p-4 pt-2">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cashflow} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #d9d9d3", fontSize: 12 }} />
                <Area type="monotone" dataKey="invoiced" stroke={chartColors.primary} strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="received" stroke={chartColors.accent} strokeWidth={2} fill="url(#g2)" strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Invoiced
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> Received
              </span>
              <span className="ml-auto font-mono text-critical">Gap widening: ₦{(610 - 470)}m Sep shortfall</span>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHead title="Business Pipeline" hint="₦m by stage" />
          <div className="p-4 pt-2">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipeline} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#6b6f77" }} interval={0} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #d9d9d3", fontSize: 12 }} cursor={{ fill: "#f1f1ee" }} />
                <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                  {pipeline.map((_, i) => (
                    <Cell key={i} fill={i === 3 ? chartColors.accent : chartColors.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Total pipeline{" "}
              <span className="font-mono font-semibold text-foreground">
                {naira(pipeline.reduce((s, p) => s + p.v, 0) * 1_000_000)}
              </span>{" "}
              · win rate target 35%
            </p>
          </div>
        </Card>
      </div>

      {/* ── Tender Deadlines ── */}
      <div className="mt-3">
        <Card>
          <SectionHead
            title="Tender Deadlines"
            hint="Live opportunities requiring action"
            action={
              <button onClick={() => nav("portfolio")} className="text-xs font-semibold text-primary">
                View pipeline →
              </button>
            }
          />
          <Table
            head={["Ref", "Opportunity", "Client", "Company", "Value", "Stage", "Win %", "Closes"]}
            rows={tenders.map((t) => [
              <span className="font-mono text-xs text-muted-foreground">{t.id}</span>,
              <span className="font-medium">{t.name}</span>,
              t.client,
              <CompanyTag company={t.company} />,
              <span className="font-mono tabular-nums">{naira(t.value)}</span>,
              <Chip tone="info">{t.stage}</Chip>,
              <span className="font-mono">{t.probability}%</span>,
              <span className={t.daysLeft <= 7 ? "font-semibold text-critical" : ""}>
                {t.deadline} · {t.daysLeft}d
              </span>,
            ])}
          />
        </Card>
      </div>

      {/* ── Management by Exception ── */}
      <div className="mt-3">
        <Card>
          <SectionHead
            title="Management by Exception"
            hint={`${exceptions.filter((e) => e.tone === "critical").length} critical · ${exceptions.filter((e) => e.tone === "attention").length} attention, items requiring executive decision`}
            action={<span className="rounded bg-critical/10 px-2 py-0.5 font-mono text-[10px] font-bold text-critical">{exceptions.length} EXCEPTIONS</span>}
          />
          <ul className="divide-y divide-border">
            {exceptions.map((exc, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 px-4 py-3.5 transition ${
                  exc.tone === "critical"
                    ? "bg-critical/[0.025] hover:bg-critical/[0.04]"
                    : "hover:bg-panel"
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${exc.tone === "critical" ? "bg-critical/10" : "bg-attention/10"}`}>
                  <AlertTriangle className={`h-3.5 w-3.5 ${exc.tone === "critical" ? "text-critical" : "text-attention"}`} strokeWidth={2.5} />
                </div>
                <p className="flex-1 text-sm font-medium text-foreground">{exc.msg}</p>
                <button
                  onClick={() => nav(exc.navTarget, exc.code)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-80 ${exc.tone === "critical" ? "border-critical/30 bg-critical/5 text-critical" : "border-attention/30 bg-attention/5 text-attention"}`}
                >
                  {exc.action} <ArrowRight className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── Reporting Line ── */}
      <div className="mt-3">
        <Card className="p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Group Reporting Hierarchy</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { role: "Chairman", name: "Alhaji Mustapha Sule Dankaka", dept: "Board" },
              { role: "GMD", name: "Dr. Ibrahim Umar Garba", dept: "Group Management" },
              { role: "GED", name: "Engr. Fatima Aliyu Dantata", dept: "Projects & Technical" },
              { role: "ED", name: "Arc. Hamza Ibrahim Danladi", dept: "Technical" },
              { role: "GGMP", name: "Engr. Danladi Shehu", dept: "Operations" },
              { role: "GGM", name: "Mr. Aminu Bala Usman", dept: "Corporate" },
            ].map((r, i, arr) => (
              <span key={r.role} className="flex items-center gap-2">
                <span className="rounded bg-panel px-2.5 py-1.5 text-center">
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-primary">{r.role}</span>
                  <span className="block text-[10px] font-semibold text-foreground">{r.name}</span>
                  <span className="block text-[9px] text-muted-foreground">{r.dept}</span>
                </span>
                {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-border-strong" />}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Approval routing: GGMP → ED → GED → GMD → Chairman. For express approvals, GMD or Chairman can override the chain at any stage.</p>
        </Card>
      </div>

      {/* ── Decision Intelligence ── */}
      <div className="mt-3">
        <Card>
          <SectionHead
            title="Decision Intelligence"
            hint="AI-assisted smart recommendations based on live project and financial data"
            action={<span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">NEXUS AI</span>}
          />
          <ul className="divide-y divide-border">
            {[
              { priority: "critical", text: "PRJ-USV-2026-0015 is 18 days behind schedule. Consider accelerating Zone C earthworks or revising milestone dates.", action: "Open Project", navTarget: "project", code: projects[0]?.code },
              { priority: "attention", text: "Procurement spend is 34% above Q3 forecast. 3 POs totalling ₦127M are uncommitted; review before month-end.", action: "View Procurement", navTarget: "procurement" },
              { priority: "attention", text: "Payment certificate PC-2026-04 has been pending for 4 days. Finance SLA is 5 days; action required.", action: "View Certs", navTarget: "payment-certs" },
              { priority: "info", text: "BD win probability on Abuja Stadium Phase 2 has increased to 72% following client meeting. Recommend deploying proposal team.", action: "View Pipeline", navTarget: "portfolio" },
            ].map((rec, i) => (
              <li key={i} className={`flex items-start gap-3 px-4 py-3.5 transition ${rec.priority === "critical" ? "bg-critical/[0.02] hover:bg-critical/[0.04]" : rec.priority === "attention" ? "hover:bg-panel" : "hover:bg-panel"}`}>
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${rec.priority === "critical" ? "bg-critical/10" : rec.priority === "attention" ? "bg-attention/10" : "bg-primary/10"}`}>
                  {rec.priority === "critical" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-critical" strokeWidth={2.5} />
                  ) : rec.priority === "attention" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-attention" strokeWidth={2.5} />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                  )}
                </div>
                <p className="flex-1 text-sm text-foreground leading-snug">{rec.text}</p>
                <button
                  onClick={() => nav(rec.navTarget, rec.code)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-80 ${rec.priority === "critical" ? "border-critical/30 bg-critical/5 text-critical" : rec.priority === "attention" ? "border-attention/30 bg-attention/5 text-attention" : "border-primary/30 bg-primary/5 text-primary"}`}
                >
                  {rec.action} <ArrowRight className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── Financial Forecast ── */}
      <div className="mt-3">
        <Card>
          <SectionHead title="Financial Forecast: FY 2026/27" hint="Forecast vs actual spend · ₦m" />
          <div className="p-4 pt-2">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={[
                  { m: "Jan", forecast: 280, actual: 260 },
                  { m: "Feb", forecast: 310, actual: 295 },
                  { m: "Mar", forecast: 340, actual: 328 },
                  { m: "Apr", forecast: 380, actual: 362 },
                  { m: "May", forecast: 420, actual: 405 },
                  { m: "Jun", forecast: 460, actual: 441 },
                  { m: "Jul", forecast: 490, actual: 480 },
                  { m: "Aug", forecast: 530, actual: 512 },
                  { m: "Sep", forecast: 570, actual: 548 },
                  { m: "Oct", forecast: 610, actual: null },
                  { m: "Nov", forecast: 650, actual: null },
                  { m: "Dec", forecast: 690, actual: null },
                ]}
                margin={{ left: -18, right: 8, top: 8 }}
              >
                <defs>
                  <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #d9d9d3", fontSize: 12 }} />
                <Area type="monotone" dataKey="forecast" stroke={chartColors.primary} strokeWidth={2} fill="url(#gForecast)" strokeDasharray="4 3" />
                <Area type="monotone" dataKey="actual" stroke={chartColors.accent} strokeWidth={2.5} fill="url(#gActual)" connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Forecast</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Actual</span>
              <span className="ml-auto font-mono text-foreground">Budget burn rate: <span className="font-bold text-attention">96%</span> of forecast YTD</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────── SHARED TABLE ─────────────────────────── */

export function Table({ head, rows }: { head: string[]; rows: any[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-panel">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-0 transition hover:bg-panel">
              {r.map((c, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-2.5 align-middle">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────── SKELETON / EMPTY STATE ─────────────────────────── */

function SkeletonRow() {
  return (
    <div className="space-y-2 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-8 animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      {subtitle && <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

/* ─────────────────────────── MY WORK ─────────────────────────── */

const myDeadlines = [
  { label: "Variation authorisation overdue", due: "Today", h: "critical" as Health, id: "VAR-PRJ001-003" },
  { label: "Procurement steel approval", due: "Today 16:00", h: "critical" as Health, id: "APR-2026-0231" },
  { label: "Ground Floor GA drawing review", due: "Tomorrow", h: "attention" as Health, id: "DRW-CAN-0442" },
  { label: "BOQ Revision 04 confirmation", due: "08 Sep", h: "attention" as Health, id: "BOQ-PRJ021-04" },
  { label: "GMD instruction verification", due: "12 Sep", h: "healthy" as Health, id: "INS-2026-0087" },
];

/* ─────────────────────────── PROCUREMENT DATA ─────────────────────────── */

const PROC_FLOW = ["Need", "Purchase Request", "Review", "Approval", "Quotation", "Comparison", "Vendor Selection", "PO", "Delivery", "Verification", "Finance Disbursement", "Cost Update"];


const EXEC_ROLES: string[] = ["chairman", "gmd", "ged", "ed", "ggmp"];

function filterByRole(list: typeof actions, role?: string): typeof actions {
  if (!role || EXEC_ROLES.includes(role)) return list;
  return list.filter((a) => !a.allowedRoles || a.allowedRoles.includes(role as never));
}

export function MyWork({ nav, userRole }: { nav: Nav; userRole?: string }) {
  const persona = userPersonas.find((p) => p.role === userRole) ?? currentUser;
  const visibleActions = filterByRole(actions, userRole);
  const needs = visibleActions.filter((a) => a.responsibleRole ? a.responsibleRole.includes(userRole ?? "") : a.responsible.toLowerCase().includes("you"));
  const overdue = visibleActions.filter((a) => a.overdue);
  const isExec = userRole ? EXEC_ROLES.includes(userRole) : false;
  const waitingFiltered = ALL_WAITING.filter((w) => !w.allowedRoles || isExec || w.allowedRoles.includes(userRole ?? ""));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
            {greeting}, {persona.name.split(" ").slice(-1)[0]}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Your operational home, everything that requires you, brought to you.
          </p>
        </div>
        <div className="rounded border border-border bg-card px-4 py-2 text-right text-xs text-muted-foreground">
          <p className="font-mono font-semibold text-foreground">{persona.authority}</p>
          <p>{persona.title}</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Needs My Action", v: needs.length + 2, t: "critical" as Health, fn: () => nav("action") },
          { l: "Overdue", v: overdue.length, t: "critical" as Health, fn: () => nav("action") },
          { l: "My Approvals", v: visibleActions.length, t: "attention" as Health, fn: () => nav("approvals") },
          { l: "Waiting on Others", v: waitingFiltered.length, t: "healthy" as Health, fn: () => nav("action") },
        ].map((s) => (
          <button key={s.l} onClick={s.fn} className="group text-left">
            <Card className="p-4 transition group-hover:border-primary/30">
              <div className="flex items-center gap-2">
                <HealthDot h={s.t} />
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</p>
              </div>
              <p className={`mt-2 font-display text-2xl sm:text-3xl font-bold tabular-nums ${
                s.t === "critical" && s.v > 0 ? "text-critical" : s.t === "attention" ? "text-attention" : ""
              }`}>{s.v}</p>
            </Card>
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Needs My Action — with "what happens next" */}
        <Card className="lg:col-span-2">
          <SectionHead
            title="Needs My Action"
            hint="Priority-ordered · click any item to act"
            action={<Chip tone="accent">{needs.length + 2} items</Chip>}
          />
          <ul className="divide-y divide-border">
            {visibleActions.map((a) => {
              const nextSteps = WORKFLOW_NEXT[a.type] ?? [];
              return (
                <li key={a.id}>
                  <button
                    onClick={() => nav("action")}
                    className="group flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-panel"
                  >
                    <PriorityDot p={a.priority} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{a.title}</p>
                        {a.overdue && (
                          <span className="rounded bg-critical-bg px-1.5 py-0.5 text-[10px] font-bold text-critical">
                            OVERDUE
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{a.why}</p>
                      {/* What happens next — compact inline */}
                      {nextSteps.length > 0 && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span className="font-semibold text-primary">{nextSteps[0]}</span>
                          {nextSteps.slice(1, 3).map((s, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              {s}
                            </span>
                          ))}
                          {nextSteps.length > 3 && <span className="text-muted-foreground">…</span>}
                        </div>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-mono">{a.id}</span>
                        <CompanyTag company={a.company} />
                        <span>· {a.project}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-xs font-semibold ${a.overdue ? "text-critical" : "text-foreground"}`}>
                        {a.due}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground opacity-0 transition group-hover:opacity-100">
                        {a.action} <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => nav("action")}
            className="w-full border-t border-border px-4 py-2.5 text-xs font-semibold text-primary hover:bg-panel"
          >
            Open full Action Centre →
          </button>
        </Card>

        {/* Right column */}
        <div className="space-y-3">
          {/* Upcoming Deadlines */}
          <Card>
            <SectionHead title="My Deadlines" hint="This week" />
            <ul className="divide-y divide-border">
              {myDeadlines.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                  <HealthDot h={d.h} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{d.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{d.id}</p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-semibold ${
                    d.h === "critical" ? "text-critical" : d.h === "attention" ? "text-attention" : "text-muted-foreground"
                  }`}>{d.due}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* My Projects */}
          <Card>
            <SectionHead title="My Projects" />
            <ul className="divide-y divide-border">
              {projects.slice(0, 4).map((p) => (
                <li key={p.code}>
                  <button
                    onClick={() => nav("project", p.code)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-panel"
                  >
                    <HealthDot h={p.health} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{p.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{p.code}</p>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">{p.progressActual}%</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* My Procurement Requests */}
          {(() => {
            const myReqs = procRequests.filter((r) => r.requestedBy.includes(currentUser.name) || r.requestedBy.includes(currentUser.initials));
            if (myReqs.length === 0) return null;
            return (
              <Card>
                <SectionHead
                  title="My Procurement Requests"
                  hint="Track your submitted requests"
                  action={<Chip tone="muted">{myReqs.length} requests</Chip>}
                />
                <div className="divide-y divide-border">
                  {myReqs.map((req) => (
                    <div key={req.id} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[10px] text-muted-foreground">{req.id}</p>
                          <p className="mt-0.5 text-sm font-semibold leading-snug">{req.item}</p>
                          <p className="text-xs text-muted-foreground">{req.project} · {req.location}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono text-sm font-bold tabular-nums">₦{(req.amount / 1_000_000).toFixed(1)}M</p>
                          <span className={`mt-0.5 inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                            req.disbursedAt ? "bg-healthy-bg text-healthy" :
                            req.sla === "critical" ? "bg-critical-bg text-critical" :
                            req.sla === "attention" ? "bg-attention-bg text-attention" :
                            "bg-healthy-bg text-healthy"
                          }`}>
                            {req.disbursedAt ? "Disbursed" : PROC_FLOW[req.currentStage] ?? "In Progress"}
                          </span>
                        </div>
                      </div>
                      {/* Mini progress bar */}
                      <div className="mt-2">
                        <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                          <span>Stage {req.currentStage + 1} of {PROC_FLOW.length}</span>
                          <span>{PROC_FLOW[req.currentStage]}</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${((req.currentStage + 1) / PROC_FLOW.length) * 100}%` }}
                          />
                        </div>
                      </div>
                      {req.disbursedAt && (
                        <p className="mt-1.5 text-[10px] text-healthy font-medium">
                          ✓ Disbursed by Finance: {req.disbursedAt}
                        </p>
                      )}
                      {req.blocker && !req.disbursedAt && (
                        <p className="mt-1 text-[10px] text-attention">{req.blocker}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}

          {/* Recent Activity */}
          <Card>
            <SectionHead title="Recent Activity" />
            <ul className="max-h-48 space-y-2.5 overflow-y-auto p-4">
              {timeline.slice(0, 5).map((e, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <span className="w-10 shrink-0 font-mono text-muted-foreground">{e.time}</span>
                  <p className="text-foreground">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-muted-foreground">{e.text}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ACTION CENTRE ─────────────────────────── */

const WORKFLOW_NEXT: Record<string, string[]> = {
  "Procurement Approval": ["Your Approval", "PO Generation", "Vendor Notification", "Delivery", "Cost Update"],
  "Variation Approval": ["Your Authorisation", "Client Submission", "Variation Account", "Contract Update"],
  "Receivable Escalation": ["Escalation Recorded", "Finance Follow-up", "Client Contact", "Payment"],
  "Design Approval": ["Your Review", "Head Approval", "Issue for Construction"],
  "BOQ Review": ["Your Confirmation", "Commercial Summary", "Client Submission"],
  "Instruction Verification": ["Your Verification", "Record Created", "Instruction Closed"],
};

type WaitingItem = { id: string; title: string; project: string; stage: string; waitingOn: string; nextApprover: string; submitted: string; allowedRoles?: string[] };
type CompletedItem = { id: string; title: string; action: string; when: string; next: string; allowedRoles?: string[] };

const ALL_WAITING: WaitingItem[] = [
  { id: "PR-USV-2026-0079", title: "Diesel: 12,000L site power", project: "Abuja Housing Ph II", stage: "Under Review", waitingOn: "Ops Officer", nextApprover: "Head of Operations", submitted: "6 hrs ago", allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "ggm", "pm", "project-coordinator"] },
  { id: "EXP-CAN-2026-0203", title: "Site survey: Enugu (2nd visit)", project: "Enugu Medical Centre", stage: "Recommendation", waitingOn: "Head of Architecture", nextApprover: "GED", submitted: "1 day ago", allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "ggm", "head-architect", "architect"] },
  { id: "DRW-CAN-0441", title: "Ground Floor GA Rev B: client decision", project: "Lagos Commercial Dev.", stage: "Client Review", waitingOn: "Client (Landmark Properties)", nextApprover: "—", submitted: "4 days ago", allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "ggm", "head-architect", "architect", "pm"] },
  { id: "VAL-PRJ001-002", title: "Subcontractor valuation 2: awaiting QS cert", project: "Abuja Housing Ph II", stage: "QS Certification", waitingOn: "QS (You submitted to PM)", nextApprover: "Finance Manager", submitted: "2 days ago", allowedRoles: ["qs", "head-qs", "pm"] },
  { id: "FIN-CERT-WAIT-001", title: "Payment cert Val. 2: QS certifying, then comes to you", project: "Port Harcourt Logistics Warehouse", stage: "QS Certification", waitingOn: "Head of QS (certifying valuation)", nextApprover: "Finance Manager (you)", submitted: "2 days ago", allowedRoles: ["finance", "accountant"] },
  { id: "FIN-REC-WAIT-002", title: "August budget vs actual variance report: awaiting PM inputs", project: "Finance: Group Accounts", stage: "Data Collection", waitingOn: "Project Managers (cost data)", nextApprover: "Finance Manager", submitted: "05 Sep 2026", allowedRoles: ["finance", "accountant"] },
  { id: "PO-USV-2026-0082", title: "Diesel PO: waiting vendor confirmation", project: "Abuja Housing Ph II", stage: "Vendor Acceptance", waitingOn: "Sunrise Petroleum Ltd", nextApprover: "—", submitted: "Yesterday", allowedRoles: ["procurement", "procurement-manager"] },
  { id: "PROC-WAIT-002", title: "Cladtech curtain wall: awaiting vendor signed PO acknowledgement", project: "Government Office Complex", stage: "Vendor Acknowledgement", waitingOn: "Cladtech Nigeria Ltd", nextApprover: "—", submitted: "Today", allowedRoles: ["procurement", "procurement-manager"] },
  { id: "LVE-2026-0041", title: "Annual leave: Mrs. Maimuna Sule Gombe (awaiting HR approval)", project: "Group Administration", stage: "HR Approval", waitingOn: "Head of Admin & HR", nextApprover: "—", submitted: "01 Sep 2026", allowedRoles: ["head-admin", "admin"] },
  { id: "IT-ACC-002", title: "VPN access: Kaduna site officer (provisioning in progress)", project: "ICT & Systems", stage: "In Provisioning", waitingOn: "IT to configure VPN profile", nextApprover: "—", submitted: "06 Sep 2026", allowedRoles: ["ict-admin", "head-admin"] },
  { id: "BD-PROP-0031", title: "Landmark Properties: proposal awaiting client response", project: "Lagos Commercial Dev.", stage: "Client Review", waitingOn: "Landmark Properties CEO", nextApprover: "—", submitted: "22 Aug 2026", allowedRoles: ["business-dev"] },
  { id: "AUDIT-REQ-018", title: "Q3 audit data: waiting Finance sign-off", project: "Internal Audit", stage: "Finance Review", waitingOn: "Finance Manager", nextApprover: "Chairman", submitted: "04 Sep 2026", allowedRoles: ["auditor"] },
  { id: "SR-FIELD-082", title: "Material GRN signed: awaiting PM acknowledgment", project: "Abuja Housing Ph II", stage: "PM Review", waitingOn: "Project Manager", nextApprover: "—", submitted: "Today 11:00", allowedRoles: ["site", "site-supervisor"] },
  { id: "OPS-WAIT-001", title: "Block C resource deployment: awaiting GGMP budget clearance", project: "Abuja Housing Ph II", stage: "Budget Clearance", waitingOn: "GGMP, Operations", nextApprover: "GMD", submitted: "Yesterday", allowedRoles: ["head-ops"] },
  { id: "ENG-WAIT-001", title: "TQ-031 response sent: awaiting site acknowledgement", project: "Abuja Housing Ph II", stage: "Site Review", waitingOn: "Site Supervisor (Oyelaran)", nextApprover: "—", submitted: "Today", allowedRoles: ["head-engineering", "engineer"] },
  { id: "ENG-WAIT-002", title: "MEP coordination drawings: awaiting architect clash response", project: "Lagos Commercial Dev.", stage: "Architect Review", waitingOn: "Head of Architecture", nextApprover: "—", submitted: "03 Sep 2026", allowedRoles: ["head-engineering"] },
  { id: "TENDER-WAIT-001", title: "Federal Secretariat Annexe pricing: awaiting GED sign-off", project: "Business Dev Pipeline", stage: "Management Review", waitingOn: "GED, Projects", nextApprover: "GMD", submitted: "Today", allowedRoles: ["tender-officer", "business-dev"] },
  { id: "BD-WAIT-001", title: "Landmark Properties proposal: awaiting client response (22 Aug sent)", project: "Lagos Commercial Dev.", stage: "Client Review", waitingOn: "Landmark Properties CEO", nextApprover: "—", submitted: "22 Aug 2026", allowedRoles: ["bd-officer"] },
  { id: "DOC-WAIT-001", title: "Rev E structural drawings: awaiting engineering final approval before site issue", project: "Abuja Housing Ph II", stage: "Engineering Sign-off", waitingOn: "Head of Engineering", nextApprover: "Doc Controller (you)", submitted: "Today", allowedRoles: ["doc-controller"] },
];

const ALL_COMPLETED: CompletedItem[] = [
  { id: "PR-USV-2026-0067", title: "Reinforcement Steel PO: Julius Steel Ltd", action: "Approved", when: "Yesterday 14:30", next: "PO Generation in progress", allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "ggm"] },
  { id: "VAR-PRJ001-002", title: "Variation VO-028: client GA comment resolved", action: "Approved & forwarded", when: "03 Sep", next: "Submitted to client for sign-off", allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "ggm", "pm", "project-coordinator"] },
  { id: "BOQ-PRJ021-03", title: "BOQ Revision 03: confirmed", action: "Approved", when: "03 Sep", next: "Submitted to client", allowedRoles: ["qs", "head-qs", "pm", "chairman", "gmd", "ged", "ed", "ggmp", "ggm"] },
  { id: "SR-PRJ001-082", title: "Site Report SR-PRJ001-082 reviewed", action: "Reviewed & noted", when: "Today 10:15", next: "PM flagged reinforcement shortage", allowedRoles: ["site", "pm", "project-coordinator"] },
  { id: "LVE-2026-0039", title: "Leave approved: Engr. Zainab Abubakar Waziri (10 days)", action: "Approved", when: "02 Sep", next: "Staff notified; cover assigned", allowedRoles: ["head-admin", "admin"] },
  { id: "ICT-USER-047", title: "New user account: Mr. Wale Okonjo", action: "Provisioned", when: "15 Jun 2026", next: "Welcome email sent; NEXUS access active", allowedRoles: ["ict-admin", "head-admin"] },
  { id: "PO-USV-2026-0085", title: "PO issued: Sunrise Petroleum (12,000L diesel)", action: "PO Issued", when: "Yesterday", next: "Awaiting vendor delivery confirmation", allowedRoles: ["procurement"] },
  { id: "PAY-FIN-0058", title: "Payment processed: Cladtech Nigeria (₦42m milestone)", action: "Disbursed", when: "05 Sep", next: "Evidence uploaded to approval record", allowedRoles: ["finance", "accountant"] },
  { id: "VAT-2026-008", title: "July VAT return filed: FIRS e-filing portal", action: "Filed", when: "21 Aug", next: "Confirmation receipt saved to compliance folder", allowedRoles: ["finance", "accountant"] },
  { id: "REC-2026-018", title: "August bank reconciliation: GTB account cleared", action: "Reconciled", when: "04 Sep", next: "Unreconciled difference of ₦0. Closed.", allowedRoles: ["finance", "accountant"] },
  { id: "BD-PQ-028", title: "PQ submitted: FCTA Ministerial Housing (phase 2)", action: "Submitted", when: "28 Aug", next: "Awaiting client shortlist", allowedRoles: ["business-dev"] },
  { id: "AUD-REC-017", title: "Q2 audit findings: management responses received", action: "Closed", when: "30 Aug", next: "Board summary submitted", allowedRoles: ["auditor"] },
  { id: "AUD-RISK-016", title: "Q2 risk register updated: 5 risks reassessed", action: "Completed", when: "15 Jun", next: "Submitted to board risk committee", allowedRoles: ["auditor"] },
  { id: "PROC-COMP-001", title: "Vendor assessment completed: Julius Steel Ltd prequalification", action: "Approved", when: "01 Aug", next: "Added to approved vendor list", allowedRoles: ["procurement", "procurement-manager"] },
  { id: "DRW-CAN-0440", title: "Ground Floor GA Rev C: issued to client", action: "Issued", when: "01 Sep", next: "Awaiting client approval", allowedRoles: ["head-architect", "architect"] },
  { id: "SR-FIELD-081", title: "Site report SR-PRJ001-081 submitted", action: "Submitted", when: "Yesterday 17:00", next: "PM acknowledged. Report archived.", allowedRoles: ["site", "site-supervisor"] },
  { id: "OPS-COMP-001", title: "PH Logistics Warehouse site demobilisation: completed", action: "Approved", when: "01 Sep", next: "Final site handover report submitted to client", allowedRoles: ["head-ops"] },
  { id: "ENG-COMP-001", title: "Structural calculations approved: Abuja Housing Phase II (Block B)", action: "Signed Off", when: "02 Sep", next: "Site notified; reinforcement commenced", allowedRoles: ["head-engineering", "engineer"] },
  { id: "TENDER-COMP-001", title: "PQ submitted: FCTA Ministerial Housing Phase 2", action: "Submitted", when: "28 Aug", next: "Awaiting client shortlist decision", allowedRoles: ["tender-officer", "business-dev"] },
  { id: "BD-COMP-001", title: "Capability statement sent: Kaduna State Government", action: "Sent", when: "05 Sep", next: "Client acknowledged receipt; follow-up due 15 Sep", allowedRoles: ["bd-officer"] },
  { id: "DOC-COMP-001", title: "DT-PRJ001-087 issued: Abuja Housing structural Rev D", action: "Transmitted", when: "04 Sep", next: "Site receipted; Rev C archived", allowedRoles: ["doc-controller"] },
];

type ActionFilter = "all" | "action" | "approval" | "overdue" | "waiting" | "done";

const EXEC_OVERRIDE_ROLES: string[] = ["chairman", "gmd"];
const OFFICER_ROLES: string[] = ["architect", "engineer", "qs", "procurement", "project-coordinator", "accountant", "site", "bd-officer", "tender-officer", "ict-admin", "ops", "admin", "auditor"];

export function ActionCentre({ userRole }: { userRole?: string }) {
  const { show } = useToast();
  const [filter, setFilter] = useState<ActionFilter>("all");
  const [actedIds, setActedIds] = useState<string[]>([]);
  const [modal, setModal] = useState<{ open: boolean; id: string; title: string; kind: "approve" | "return" | "delegate" | "escalate" }>({ open: false, id: "", title: "", kind: "approve" });
  const [reviewItem, setReviewItem] = useState<typeof actions[0] | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"approve" | "return" | "escalate">("approve");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewEscTo, setReviewEscTo] = useState("");
  const [reviewEscSearch, setReviewEscSearch] = useState("");
  const [expressItem, setExpressItem] = useState<{ id: string; title: string; amount?: number } | null>(null);
  const [escalateTo, setEscalateTo] = useState("");
  const [escalateSearch, setEscalateSearch] = useState("");
  const isExecOverride = userRole ? EXEC_OVERRIDE_ROLES.includes(userRole) : false;

  const isExecRole = userRole ? EXEC_ROLES.includes(userRole) : false;
  const isOfficer = userRole ? OFFICER_ROLES.includes(userRole) : false;

  const roleActions = filterByRole(actions, userRole);
  const urgentCount = roleActions.filter((a) => a.priority === "Urgent").length;
  const overdueCount = roleActions.filter((a) => a.overdue).length;

  const waitingItems = ALL_WAITING.filter((w) => !w.allowedRoles || isExecRole || w.allowedRoles.includes(userRole ?? ""));
  const completedItems = ALL_COMPLETED.filter((c) => !c.allowedRoles || isExecRole || c.allowedRoles.includes(userRole ?? ""));

  const filteredActions = (() => {
    const base = roleActions.filter((a) => !actedIds.includes(a.id));
    if (filter === "action") return base.filter((a) => (a.responsibleRole ? a.responsibleRole.includes(userRole ?? "") : a.responsible.toLowerCase().includes("you")));
    if (filter === "approval") return base.filter((a) => a.type.includes("Approval"));
    if (filter === "overdue") return base.filter((a) => a.overdue);
    return base;
  })();

  const escalateStaffResults = staffMembers.filter((s) =>
    escalateSearch.trim().length > 0 &&
      (s.name.toLowerCase().includes(escalateSearch.toLowerCase()) ||
       s.title.toLowerCase().includes(escalateSearch.toLowerCase()))
  );

  const tabs: { id: ActionFilter; label: string; count?: number; tone?: string }[] = [
    { id: "all", label: "All", count: roleActions.length },
    { id: "action", label: "Needs My Action", count: urgentCount + 1, tone: "critical" },
    { id: "approval", label: "Approvals", count: roleActions.filter(a => a.type.includes("Approval")).length },
    { id: "overdue", label: "Overdue", count: overdueCount, tone: "critical" },
    { id: "waiting", label: "Waiting on Others", count: waitingItems.length },
    { id: "done", label: "Recently Completed", count: completedItems.length },
  ];

  return (
    <div className="animate-in">
      <ScreenHeader
        title="Action Centre"
        desc="Every approval, review, task and escalation in one queue, with all the context needed to decide. Anything that needs you is here."
      >
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-[var(--radius)] border border-critical/30 bg-critical-bg px-3 py-1.5 text-xs font-semibold text-critical">
              <AlertCircle className="h-3.5 w-3.5" />
              {urgentCount} urgent
            </div>
          )}
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-[var(--radius)] border border-critical/20 bg-critical-bg/50 px-3 py-1.5 text-xs font-semibold text-critical">
              <Clock className="h-3.5 w-3.5" />
              {overdueCount} overdue
            </div>
          )}
        </div>
      </ScreenHeader>

      {/* Officer restriction notice */}
      {isOfficer && (
        <div className="mb-4 flex items-start gap-3 rounded-[var(--radius)] border border-attention/30 bg-attention-bg/50 px-4 py-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-attention" />
          <div>
            <p className="text-xs font-semibold text-attention">Officer View — Read-Only Actions</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              As an officer, you cannot approve or reject company decisions. You may review items, add notes, and escalate to your Head of Department who will make the final call.
            </p>
          </div>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === t.id
                ? t.tone === "critical"
                  ? "border-critical/30 bg-critical-bg text-critical"
                  : "border-primary/30 bg-primary/8 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  filter === t.id
                    ? t.tone === "critical"
                      ? "bg-critical/15 text-critical"
                      : "bg-primary/12 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Action items */}
      {filter !== "waiting" && filter !== "done" && (
        <div className="space-y-3">
          {filteredActions.map((a) => {
            const nextSteps = WORKFLOW_NEXT[a.type] ?? [];
            return (
              <Card key={a.id}>
                <div className="p-4">
                  {/* Header row */}
                  <div className="mb-2 flex flex-wrap items-start gap-3">
                    <PriorityDot p={a.priority} />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-sm font-bold text-foreground">{a.title}</p>
                        <span className="rounded border border-border bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {a.type}
                        </span>
                        {a.overdue && (
                          <span className="rounded bg-critical-bg px-2 py-0.5 text-[10px] font-bold text-critical">
                            OVERDUE
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground/60">Why: </span>
                        {a.why}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`font-mono text-xs font-semibold ${a.overdue ? "text-critical" : "text-foreground"}`}>
                        {a.due}
                      </p>
                    </div>
                  </div>

                  {/* Directive source */}
                  {a.directedBy && (
                    <div className="mb-2.5">
                      <DirectiveTag directedBy={a.directedBy} />
                    </div>
                  )}

                  {/* Meta */}
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="font-mono">{a.id}</span>
                    <span className="flex items-center gap-1">
                      <CompanyTag company={a.company} />
                      {a.project}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {a.responsibleRole?.includes(userRole ?? "") ? (
                        <span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">You</span>
                          {" · "}{a.responsible}
                        </span>
                      ) : a.responsible}
                    </span>
                    {a.requester && (
                      <span className="flex items-center gap-1">
                        <Send className="h-3 w-3" /> {a.requester}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {a.status}
                    </span>
                  </div>

                  {/* What happens next */}
                  {nextSteps.length > 0 && (
                    <div className="mb-3 rounded bg-panel px-3 py-2">
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        What happens next
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {nextSteps.map((step, i) => (
                          <span key={i} className="flex items-center gap-1.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                                i === 0
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {step}
                            </span>
                            {i < nextSteps.length - 1 && (
                              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setReviewItem(a); setReviewDecision(isOfficer ? "escalate" : "approve"); setReviewComment(""); setReviewEscTo(""); setReviewEscSearch(""); }}
                      className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      {isOfficer ? "View & Escalate" : a.action} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    {isExecOverride && (
                      <button
                        onClick={() => setExpressItem({ id: a.id, title: a.title })}
                        className="inline-flex items-center gap-1.5 rounded border border-primary/30 bg-primary/8 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/12"
                      >
                        <Shield className="h-3.5 w-3.5" /> Express Approval
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredActions.length === 0 && (
            <Card className="p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-healthy" />
              <p className="font-semibold text-foreground">All clear</p>
              <p className="mt-1 text-sm text-muted-foreground">No items in this category right now.</p>
            </Card>
          )}
        </div>
      )}

      {/* Waiting on Others */}
      {filter === "waiting" && (
        <div className="space-y-3">
          {waitingItems.map((w) => (
            <Card key={w.id}>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-sm font-bold">{w.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <span className="font-mono">{w.id}</span> · {w.project} · Submitted {w.submitted}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-info-bg px-2 py-0.5 text-[10px] font-semibold text-info">
                    {w.stage}
                  </span>
                </div>
                <div className="mb-3 rounded bg-panel px-3 py-2">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Waiting on
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-attention" />
                    <span className="font-semibold">{w.waitingOn}</span>
                    {w.nextApprover !== "—" && (
                      <>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{w.nextApprover}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => show(`Notification sent to ${w.waitingOn}`, "info")}
                    className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-border-strong hover:text-foreground"
                  >
                    <Send className="h-3 w-3" /> Notify Responsible
                  </button>
                  <button
                    onClick={() => { setEscalateTo(""); setEscalateSearch(""); setModal({ open: true, id: w.id, title: w.title, kind: "escalate" }); }}
                    className="inline-flex items-center gap-1.5 rounded border border-attention/30 bg-attention-bg px-3 py-1.5 text-xs font-medium text-attention hover:bg-attention/15"
                  >
                    <AlertTriangle className="h-3 w-3" /> Escalate
                  </button>
                  <button
                    onClick={() => show(`Opening record ${w.id}`, "info")}
                    className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-border-strong hover:text-foreground"
                  >
                    View Record <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recently Completed */}
      {filter === "done" && (
        <div className="space-y-2">
          {completedItems.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-healthy" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <span className="font-mono">{c.id}</span> · {c.action} · {c.when}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-primary">{c.next}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Review Detail Modal ── */}
      {reviewItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={() => setReviewItem(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl rounded-[var(--radius)] border border-border bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${reviewItem.priority === "Urgent" ? "bg-critical-bg text-critical" : reviewItem.priority === "High" ? "bg-attention-bg text-attention" : "bg-info-bg text-info"}`}>
                    {reviewItem.priority}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">{reviewItem.id}</span>
                  {reviewItem.overdue && <span className="rounded bg-critical-bg px-1.5 py-0.5 text-[10px] font-bold text-critical">OVERDUE</span>}
                </div>
                <h2 className="font-display text-[16px] font-bold leading-snug">{reviewItem.title}</h2>
              </div>
              <button onClick={() => setReviewItem(null)} className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Context / Why */}
              <div className="rounded-lg border border-border bg-panel px-4 py-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Why This Requires Action</p>
                <p className="text-sm leading-relaxed">{reviewItem.why}</p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {[
                  { label: "Type", value: reviewItem.type },
                  { label: "Project", value: reviewItem.project },
                  { label: "Company", value: reviewItem.company },
                  { label: "Due", value: reviewItem.due },
                  { label: "Current Status", value: reviewItem.status },
                  ...(reviewItem.submittedDate ? [{ label: "Submitted", value: reviewItem.submittedDate }] : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-sm font-medium">{value}</p>
                  </div>
                ))}
                {/* Responsible — dynamic "(You)" badge */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Responsible</p>
                  <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                    {reviewItem.responsibleRole?.includes(userRole ?? "") && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">You</span>
                    )}
                    <p className="text-sm font-medium">{reviewItem.responsible}</p>
                  </div>
                </div>
                {/* Requester */}
                {reviewItem.requester && (
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Requested By</p>
                    <p className="mt-0.5 text-sm font-medium">{reviewItem.requester}</p>
                  </div>
                )}
              </div>

              {/* Approval chain timeline */}
              {reviewItem.approvalChain && reviewItem.approvalChain.length > 0 && (
                <div className="rounded-lg border border-border bg-panel px-4 py-3">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Approval Workflow</p>
                  <div className="space-y-0">
                    {reviewItem.approvalChain.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {/* connector */}
                        <div className="flex flex-col items-center">
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-bold ${
                            step.status === "done" ? "border-healthy bg-healthy text-white" :
                            step.status === "current" ? "border-primary bg-primary text-primary-foreground" :
                            "border-border bg-panel text-muted-foreground"
                          }`}>
                            {step.status === "done" ? "✓" : step.status === "current" ? i + 1 : i + 1}
                          </div>
                          {i < reviewItem.approvalChain!.length - 1 && (
                            <div className={`mt-0.5 w-px flex-1 ${step.status === "done" ? "bg-healthy/40" : "bg-border"}`} style={{ minHeight: 16 }} />
                          )}
                        </div>
                        <div className="pb-3 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-[12px] font-semibold ${
                              step.status === "done" ? "text-healthy" :
                              step.status === "current" ? "text-primary" :
                              "text-muted-foreground"
                            }`}>{step.step}</p>
                            {step.status === "current" && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">Current</span>
                            )}
                            {step.date && (
                              <span className="text-[10px] text-muted-foreground font-mono">{step.date}</span>
                            )}
                          </div>
                          {step.person && (
                            <p className="mt-0.5 text-[11px] text-muted-foreground">{step.person}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What happens next */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-primary/70">What Happens After Your Decision</p>
                <p className="text-sm text-foreground">
                  {reviewItem.action.toLowerCase().includes("approve") || reviewItem.action.toLowerCase().includes("review")
                    ? "Approving will advance this item to the next stage in the workflow. The requesting team will be notified and processing will continue."
                    : "Completing this action will update the workflow status and notify the relevant team members."}
                </p>
              </div>

              {/* Decision section */}
              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {isOfficer ? "Escalate to Your Head" : "Your Decision"}
                </p>
                {isOfficer ? (
                  <div className="flex items-start gap-2 rounded border border-attention/30 bg-attention-bg/50 px-3 py-2">
                    <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-attention" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-attention">Officer restriction:</span> You cannot approve or reject company decisions. Escalate this item to your Head of Department with your observations and recommendation.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(["approve", "return", "escalate"] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setReviewDecision(opt)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                          reviewDecision === opt
                            ? opt === "approve" ? "bg-healthy text-white" : opt === "return" ? "bg-attention text-white" : "bg-critical text-white"
                            : "border border-border bg-panel text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt === "approve" ? `✓ ${reviewItem.action}` : opt === "return" ? "↩ Return for Revision" : "⬆ Escalate"}
                      </button>
                    ))}
                  </div>
                )}

                {/* Escalate target — fixed head for officers, searchable for others */}
                {(reviewDecision === "escalate" || isOfficer) && (() => {
                  if (isOfficer) {
                    const headRole = userRole ? departmentHeadMap[userRole as keyof typeof departmentHeadMap] : undefined;
                    const head = headRole ? headDisplayMap[headRole] : undefined;
                    const headLabel = head ? `${head.name} — ${head.title}` : "Your Head of Department";
                    return (
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Escalating To</label>
                        <div className="flex items-center gap-3 rounded border border-primary/30 bg-primary/5 px-4 py-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {head?.name.split(" ").map(w => w[0]).slice(0, 2).join("") ?? "HD"}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{headLabel}</p>
                            <p className="text-[10px] text-healthy font-medium">✓ Automatically routed to your Head of Department</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Escalate To <span className="text-critical">*</span></label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={reviewEscSearch}
                          onChange={e => { setReviewEscSearch(e.target.value); if (reviewEscTo) setReviewEscTo(""); }}
                          placeholder="Search by name or title…"
                          className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                      {reviewEscSearch.trim().length > 0 && !reviewEscTo && (
                        <div className="mt-1 max-h-36 overflow-y-auto rounded border border-border divide-y divide-border">
                          {staffMembers
                            .filter(s => s.name.toLowerCase().includes(reviewEscSearch.toLowerCase()) || s.title.toLowerCase().includes(reviewEscSearch.toLowerCase()))
                            .slice(0, 8)
                            .map(s => (
                              <button key={s.id} onClick={() => { setReviewEscTo(s.name); setReviewEscSearch(s.name); }} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/50">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold">{s.initials}</div>
                                <div>
                                  <p className="text-xs font-semibold">{s.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{s.title}</p>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                      {reviewEscTo && <p className="mt-1 text-[11px] font-semibold text-healthy">✓ Escalating to: {reviewEscTo}</p>}
                    </div>
                  );
                })()}

                {/* Comment */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {isOfficer ? "Your Observations & Recommendation" : reviewDecision === "return" ? "Reason for Return" : reviewDecision === "escalate" ? "Reason for Escalation" : "Comment (Optional)"}
                    {(isOfficer || reviewDecision !== "approve") && <span className="text-critical"> *</span>}
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder={isOfficer ? "Describe your observations, findings, and recommended action for your Head…" : reviewDecision === "approve" ? "Add a note if needed…" : "Explain your decision…"}
                    className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-3">
                  <button onClick={() => setReviewItem(null)} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                  <button
                    onClick={() => {
                      if ((isOfficer || reviewDecision !== "approve") && !reviewComment.trim()) { show("Please provide a reason before submitting.", "warning"); return; }
                      if (!isOfficer && reviewDecision === "escalate" && !reviewEscTo) { show("Please select who to escalate to.", "warning"); return; }
                      const officerHeadRole = userRole ? departmentHeadMap[userRole as keyof typeof departmentHeadMap] : undefined;
                      const officerHead = officerHeadRole ? headDisplayMap[officerHeadRole] : undefined;
                      setActedIds(p => [...p, reviewItem.id]);
                      const msg = isOfficer
                        ? `Escalated to ${officerHead?.name ?? "your Head"} with your observations. They will review and decide.`
                        : reviewDecision === "approve"
                        ? `${reviewItem.action} recorded. ${reviewItem.id} advanced.`
                        : reviewDecision === "return"
                        ? `${reviewItem.id} returned for revision`
                        : `${reviewItem.id} escalated to ${reviewEscTo}`;
                      show(msg, isOfficer ? "info" : reviewDecision === "approve" ? "success" : "warning");
                      setReviewItem(null);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90 ${
                      isOfficer ? "bg-attention" : reviewDecision === "approve" ? "bg-healthy" : reviewDecision === "return" ? "bg-attention" : "bg-critical"
                    }`}
                  >
                    {isOfficer ? <AlertTriangle className="h-3.5 w-3.5" /> : reviewDecision === "approve" ? <CheckCircle2 className="h-3.5 w-3.5" /> : reviewDecision === "return" ? <RotateCcw className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    {isOfficer ? "Escalate to Head" : reviewDecision === "approve" ? `Confirm ${reviewItem.action}` : reviewDecision === "return" ? "Return for Revision" : "Confirm Escalation"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Escalate modal (inline — needs staff picker) ── */}
      {modal.open && modal.kind === "escalate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModal(m => ({ ...m, open: false }))}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl animate-scalein" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-attention-bg">
                  <AlertTriangle className="h-3.5 w-3.5 text-attention" />
                </div>
                <p className="font-display text-[15px] font-bold">Escalate Item</p>
              </div>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded border border-attention/20 bg-attention-bg/50 px-3 py-2 text-[11px] text-attention font-medium">
                Escalating: <span className="font-bold">{modal.title}</span> ({modal.id})
              </div>
              {/* Staff picker */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Escalate To (Search by name or title)</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={escalateSearch}
                    onChange={e => { setEscalateSearch(e.target.value); if (escalateTo) setEscalateTo(""); }}
                    placeholder="e.g. GMD, Finance Manager, GED…"
                    className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none"
                    autoFocus
                  />
                </div>
                {escalateStaffResults.length > 0 && !escalateTo && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded border border-border divide-y divide-border">
                    {escalateStaffResults.map(s => (
                      <button key={s.id} onClick={() => { setEscalateTo(s.name); setEscalateSearch(s.name); }} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">{s.initials}</div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.title} · {s.department}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {escalateTo && (
                  <p className="mt-1 text-[11px] font-semibold text-healthy">✓ Escalating to: {escalateTo}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Reason for Escalation <span className="text-critical">*</span></label>
                <textarea
                  id="esc-reason"
                  placeholder="Explain why this is being escalated and what decision or action is required…"
                  rows={3}
                  className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button onClick={() => setModal(m => ({ ...m, open: false }))} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button
                  onClick={() => {
                    const reason = (document.getElementById("esc-reason") as HTMLTextAreaElement)?.value ?? "";
                    if (!escalateTo || !reason.trim()) { show("Please select a person and provide a reason.", "warning"); return; }
                    setActedIds(p => [...p, modal.id]);
                    setModal(m => ({ ...m, open: false }));
                    show(`${modal.id} escalated to ${escalateTo}`, "warning");
                  }}
                  className="inline-flex items-center gap-1.5 rounded bg-attention px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Confirm Escalation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ActionModal
        open={modal.open && modal.kind !== "escalate"}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        title={modal.kind === "approve" ? "Confirm Action" : modal.kind === "return" ? "Return for Revision" : "Delegate Item"}
        actionLabel={modal.kind === "approve" ? "Confirm & Submit" : modal.kind === "return" ? "Return for Revision" : "Delegate"}
        tone={modal.kind === "return" ? "attention" : "primary"}
        context={modal.title}
        showFileUpload={modal.kind === "approve"}
        onConfirm={(comment) => {
          setActedIds(p => [...p, modal.id]);
          setModal(m => ({ ...m, open: false }));
          const msg = modal.kind === "approve" ? `Action recorded. ${modal.id} processed.` : modal.kind === "return" ? `${modal.id} returned for revision` : `${modal.id} delegated`;
          show(msg, modal.kind === "return" ? "warning" : "success");
        }}
      />
      <ExpressApprovalModal
        open={!!expressItem}
        onClose={() => setExpressItem(null)}
        item={expressItem}
        onApprove={(id) => setActedIds(p => [...p, id])}
      />
    </div>
  );
}

/* ─────────────────────────── PORTFOLIO ─────────────────────────── */

function GanttView({ projects: ps }: { projects: typeof projects }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-[12px]">
        <thead>
          <tr className="border-b border-border">
            <th className="w-48 py-2 text-left font-medium text-muted-foreground px-3">Project</th>
            {months.map((m) => (
              <th key={m} className="py-2 text-center font-mono text-[10px] text-muted-foreground">{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ps.map((p, i) => (
            <tr key={p.code} className="border-b border-border/40">
              <td className="py-2 px-3 font-medium truncate max-w-[192px]">{p.name}</td>
              {months.map((m, mi) => {
                const startMonth = (i * 2) % 12;
                const endMonth = Math.min(startMonth + 4 + (i % 4), 11);
                const inRange = mi >= startMonth && mi <= endMonth;
                return (
                  <td key={m} className="py-1.5">
                    {inRange && (
                      <div
                        className="h-5 rounded-sm mx-0.5"
                        style={{
                          background:
                            p.health === "critical"
                              ? "rgba(220,38,38,0.3)"
                              : p.health === "attention"
                              ? "rgba(217,119,6,0.3)"
                              : "rgba(15,118,110,0.3)",
                          borderLeft: mi === startMonth ? "2px solid currentColor" : "none",
                        }}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Portfolio({ nav }: { nav: Nav }) {
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  return (
    <div className="animate-in">
      <ScreenHeader title="Project Portfolio" desc="All active projects across USV and CANONIC. Company separation preserved; joint projects clearly marked." />
      <Card>
        <SectionHead
          title="Projects"
          hint={`${projects.length} active · ${naira(projects.reduce((s, p) => s + p.contractValue, 0))} total contract value`}
          action={
            <div className="flex items-center gap-0.5 rounded border border-border bg-panel px-1 py-0.5">
              {(["list", "timeline"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold capitalize transition ${viewMode === mode ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {mode === "list" ? "List" : "Timeline"}
                </button>
              ))}
            </div>
          }
        />
        {viewMode === "list" ? (
          <Table
            head={["Code", "Project", "Company", "Client", "PM", "Phase", "Value", "Progress", "Health"]}
            rows={projects.map((p) => [
              <button onClick={() => nav("project", p.code)} className="font-mono text-xs text-primary hover:underline">{p.code}</button>,
              <button onClick={() => nav("project", p.code)} className="max-w-[220px] truncate text-left font-medium hover:text-primary">{p.name}</button>,
              <CompanyTag company={p.company} />,
              <span className="text-muted-foreground">{p.client}</span>,
              p.pm,
              <Chip tone="info">{p.phase}</Chip>,
              <span className="font-mono tabular-nums">{naira(p.contractValue)}</span>,
              <div className="w-28"><Progress planned={p.progressPlanned} actual={p.progressActual} /></div>,
              <StatusBadge h={p.health} />,
            ])}
          />
        ) : (
          <div className="p-4">
            <GanttView projects={projects} />
            <p className="mt-2 text-[11px] text-muted-foreground">Timeline bars show indicative project duration. Colour reflects health status: red for critical, amber for attention, teal for healthy.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ─────────────────────────── PROJECT CONTROL ROOM ─────────────────────────── */

const dims: { key: keyof import("./data").Project; label: string; detail: string }[] = [
  { key: "schedule", label: "Schedule", detail: "48% actual vs 62% planned, 14% behind" },
  { key: "cost", label: "Cost", detail: "72% budget consumed at 48% progress" },
  { key: "procurement", label: "Procurement", detail: "3 requests pending, reinforcement blocked" },
  { key: "payment", label: "Payment", detail: "₦85m invoice overdue 34 days" },
  { key: "quality", label: "Quality", detail: "No open non-conformances" },
  { key: "client_state", label: "Client", detail: "GA approval pending 12 days" },
  { key: "resources", label: "Resources", detail: "PM overloaded, 3 active projects" },
];

const sCurve = [
  { w: "W1", plan: 8, act: 8 },
  { w: "W4", plan: 22, act: 20 },
  { w: "W8", plan: 38, act: 33 },
  { w: "W12", plan: 50, act: 41 },
  { w: "W16", plan: 62, act: 48 },
];

const projResponsibilities = [
  { fn: "Project Management", owner: "Engr. Musa Usman Lawan", backup: "Engr. Jamilu Umar Sani", status: "healthy" as Health },
  { fn: "Site Supervision", owner: "Engr. Jamilu Umar Sani", backup: null, status: "critical" as Health },
  { fn: "QS / Cost Control", owner: "QS Officer (Fatima)", backup: "Head of QS", status: "healthy" as Health },
  { fn: "Procurement", owner: "Procurement Officer", backup: null, status: "critical" as Health },
  { fn: "HSE Compliance", owner: "HSE Officer (David)", backup: "Site Supervisor", status: "healthy" as Health },
  { fn: "Client Liaison", owner: "Engr. Musa Usman Lawan (PM)", backup: null, status: "attention" as Health },
  { fn: "Design Coordination", owner: "Arc. Safiya Garba Aliyu", backup: "Architecture Head", status: "healthy" as Health },
  { fn: "Finance / Invoicing", owner: "Finance Officer", backup: "Finance Manager", status: "healthy" as Health },
];

const projIssues = [
  { id: "ISS-001", desc: "Reinforcement steel delivery blocked. PO not yet approved.", cat: "Procurement", severity: "critical" as Health, owner: "GED Projects", deadline: "Today", status: "Open" },
  { id: "ISS-002", desc: "Client has not approved Ground Floor GA; design hold on affected works", cat: "Design", severity: "critical" as Health, owner: "Arc. Safiya Garba Aliyu", deadline: "Overdue 12d", status: "Escalated" },
  { id: "ISS-003", desc: "₦85m Milestone-3 invoice outstanding, 34 days unpaid", cat: "Finance", severity: "critical" as Health, owner: "Finance Manager", deadline: "Overdue 34d", status: "Escalated" },
  { id: "ISS-004", desc: "PM workload at 120%, allocated to 3 concurrent projects", cat: "Resources", severity: "attention" as Health, owner: "GED Projects", deadline: "Review Sep 15", status: "Monitoring" },
  { id: "ISS-005", desc: "Block C foundation reinforcement shortage: 12T Y16 deficit", cat: "Materials", severity: "attention" as Health, owner: "Site Supervisor", deadline: "10 Sep", status: "Open" },
];

const projRisks = [
  { id: "RSK-001", desc: "Rainy season: extended rains may delay concrete work by 2–3 weeks", prob: "High", impact: "High", owner: "PM", mitigation: "Accelerated schedule on non-concrete works; roof shelter planned", status: "Open" },
  { id: "RSK-002", desc: "Steel price volatility, USD-indexed; 8% rise possible before PO lock-in", prob: "Medium", impact: "High", owner: "QS / Procurement", mitigation: "Fast-track PO approval; lock price now", status: "Active" },
  { id: "RSK-003", desc: "Key client contact on leave; approvals may slow", prob: "Medium", impact: "Medium", owner: "PM", mitigation: "Escalate to client MD; identify alternate contact", status: "Monitoring" },
  { id: "RSK-004", desc: "Subcontractor capacity: blockwork sub working on 2 other projects", prob: "Low", impact: "Medium", owner: "Site Supervisor", mitigation: "Mobilise backup subcontractor list now", status: "Monitoring" },
];

const projContract = {
  ref: "CON-USV-2026-001",
  type: "Lump Sum",
  value: 2_850_000_000,
  retention: "5% (max ₦142.5M)",
  defectsLiability: "12 months from practical completion",
  signDate: "2026-03-15",
  commenceDate: "2026-03-22",
  originalCompletion: "2027-09-30",
  revisedCompletion: "2027-11-28",
  extensionsGranted: "59 days",
  contractor: "Zenith Builders Ltd",
  client: "Lekki Development Authority",
  engineer: "Arc. Safiya Garba Aliyu (Lead Designer)",
  pm: "Engr. Musa Usman Lawan",
  govLaw: "Laws of the Federation of Nigeria",
  disputeResolution: "Arbitration, NICN",
  specialConditions: ["Contractor must maintain 5% local content", "Night works require 72-hour notice", "All materials require QS sign-off before use"],
};

const projWorkPackages = [
  { id: "WP-01", name: "Site Clearance & Mobilisation", planned: 100, actual: 100, start: "Mar 22", end: "Apr 10", status: "Complete" },
  { id: "WP-02", name: "Piling & Foundation Works", planned: 100, actual: 92, start: "Apr 11", end: "Jun 20", status: "Complete" },
  { id: "WP-03", name: "Substructure (B1 to GF)", planned: 100, actual: 88, start: "Jun 21", end: "Aug 15", status: "In Progress" },
  { id: "WP-04", name: "Superstructure: Block A & B", planned: 60, actual: 38, start: "Aug 1", end: "Nov 30", status: "In Progress" },
  { id: "WP-05", name: "Superstructure: Block C & D", planned: 20, actual: 0, start: "Sep 15", end: "Jan 15 '27", status: "Not Started" },
  { id: "WP-06", name: "MEP Rough-in Works", planned: 15, actual: 5, start: "Oct 1", end: "Feb 28 '27", status: "Not Started" },
  { id: "WP-07", name: "Finishes & Fit-out", planned: 0, actual: 0, start: "Jan 15 '27", end: "Jul 31 '27", status: "Not Started" },
  { id: "WP-08", name: "External Works & Landscaping", planned: 0, actual: 0, start: "May 1 '27", end: "Sep 30 '27", status: "Not Started" },
];

const projWBS = [
  { id: "1", label: "Lekki Mixed-Use Hub", level: 0, value: 2_850_000_000, status: "In Progress" },
  { id: "1.1", label: "Substructure", level: 1, value: 420_000_000, status: "Complete" },
  { id: "1.1.1", label: "Earthworks & Excavation", level: 2, value: 85_000_000, status: "Complete" },
  { id: "1.1.2", label: "Piling Works", level: 2, value: 195_000_000, status: "Complete" },
  { id: "1.1.3", label: "Foundation Concrete", level: 2, value: 140_000_000, status: "Complete" },
  { id: "1.2", label: "Superstructure", level: 1, value: 980_000_000, status: "In Progress" },
  { id: "1.2.1", label: "Block A & B Frames", level: 2, value: 340_000_000, status: "In Progress" },
  { id: "1.2.2", label: "Block C & D Frames", level: 2, value: 290_000_000, status: "Not Started" },
  { id: "1.2.3", label: "Staircases & Lift Cores", level: 2, value: 175_000_000, status: "Not Started" },
  { id: "1.2.4", label: "Roof Structure", level: 2, value: 175_000_000, status: "Not Started" },
  { id: "1.3", label: "MEP Works", level: 1, value: 510_000_000, status: "Not Started" },
  { id: "1.4", label: "Finishes", level: 1, value: 620_000_000, status: "Not Started" },
  { id: "1.5", label: "External Works", level: 1, value: 185_000_000, status: "Not Started" },
  { id: "1.6", label: "Preliminaries & PC Sums", level: 1, value: 135_000_000, status: "In Progress" },
];

const projBOQ = [
  { ref: "A", desc: "PRELIMINARIES", unit: "Item", qty: 1, rate: 135_000_000, amount: 135_000_000, claimed: 108_000_000, cat: "header" },
  { ref: "B", desc: "SUBSTRUCTURE", unit: "Item", qty: 1, rate: 420_000_000, amount: 420_000_000, claimed: 420_000_000, cat: "header" },
  { ref: "B1", desc: "Excavation to reduced level (>1.5m)", unit: "m³", qty: 4200, rate: 8_500, amount: 35_700_000, claimed: 35_700_000, cat: "item" },
  { ref: "B2", desc: "Bored piles 600mm dia × 18m", unit: "No.", qty: 180, rate: 850_000, amount: 153_000_000, claimed: 153_000_000, cat: "item" },
  { ref: "B3", desc: "Pile caps and ground beams", unit: "m³", qty: 1_200, rate: 68_000, amount: 81_600_000, claimed: 81_600_000, cat: "item" },
  { ref: "B4", desc: "Ground floor slab (200mm RC)", unit: "m²", qty: 3_800, rate: 41_000, amount: 155_800_000, claimed: 155_800_000, cat: "item" },
  { ref: "C", desc: "SUPERSTRUCTURE", unit: "Item", qty: 1, rate: 980_000_000, amount: 980_000_000, claimed: 280_000_000, cat: "header" },
  { ref: "C1", desc: "RC columns (500×500) all floors", unit: "m³", qty: 2_100, rate: 85_000, amount: 178_500_000, claimed: 62_000_000, cat: "item" },
  { ref: "C2", desc: "RC suspended slabs (200mm) Floors 1-5", unit: "m²", qty: 14_000, rate: 32_000, amount: 448_000_000, claimed: 142_000_000, cat: "item" },
  { ref: "D", desc: "MEP INSTALLATIONS", unit: "Item", qty: 1, rate: 510_000_000, amount: 510_000_000, claimed: 0, cat: "header" },
  { ref: "E", desc: "FINISHES", unit: "Item", qty: 1, rate: 620_000_000, amount: 620_000_000, claimed: 0, cat: "header" },
  { ref: "F", desc: "EXTERNAL WORKS", unit: "Item", qty: 1, rate: 185_000_000, amount: 185_000_000, claimed: 0, cat: "header" },
];

const projProcurement = [
  { id: "PO-2026-078", item: "Reinforcement Steel Y16, 25T", vendor: "Julius Steel Ltd", value: 63_400_000, status: "Pending Approval", stage: "Award", date: "2026-08-29" },
  { id: "PO-2026-065", item: "Cement, 2,000 bags OPC", vendor: "Dangote Cement", value: 12_200_000, status: "Delivered", stage: "Closed", date: "2026-08-01" },
  { id: "PO-2026-059", item: "Formwork panels, 800m²", vendor: "Woodcraft Nigeria", value: 8_800_000, status: "On Site", stage: "Execution", date: "2026-07-20" },
  { id: "PO-2026-088", item: "Binding wire, 500kg", vendor: "Northgate Metals", value: 1_250_000, status: "Raised", stage: "Request", date: "2026-09-03" },
  { id: "PO-2026-089", item: "Reinforcement Steel Y20, 12T", vendor: "TBD", value: 28_500_000, status: "Pending GMD", stage: "Award", date: "2026-09-05" },
];

const projSiteOps = [
  { date: "5 Sep 2026", workforce: 148, plant: ["Tower Crane ×1", "Concrete Mixer ×3", "Forklift ×2"], activities: "RC column casting: Grid D4-D8 (1F), Blockwork: Block B Level 2, Reinforcement fixing: Block A Level 3", issues: "Crane idle 2hrs. Boom inspection.", safety: "1 near-miss reported (ladder), toolbox talk conducted" },
  { date: "4 Sep 2026", workforce: 152, plant: ["Tower Crane ×1", "Concrete Mixer ×2", "Forklift ×2"], activities: "Concrete slab pour: Block A Level 2 (280m³), Blockwork: Block B Level 1, Setting out: Block C ground floor", issues: null, safety: "No incidents" },
  { date: "3 Sep 2026", workforce: 135, plant: ["Tower Crane ×1", "Concrete Mixer ×3"], activities: "Reinforcement fixing: Block A Level 2 slab, Foundation waterproofing: Block C, Material offload: cement (2,000 bags)", issues: "Delayed start 1hr. Delivery congestion at gate.", safety: "No incidents" },
];

const projCosts = [
  { cat: "Substructure", budget: 420_000_000, committed: 420_000_000, actual: 418_500_000, forecast: 420_000_000 },
  { cat: "Superstructure", budget: 980_000_000, committed: 340_000_000, actual: 280_000_000, forecast: 995_000_000 },
  { cat: "MEP", budget: 510_000_000, committed: 0, actual: 0, forecast: 525_000_000 },
  { cat: "Finishes", budget: 620_000_000, committed: 0, actual: 0, forecast: 620_000_000 },
  { cat: "External Works", budget: 185_000_000, committed: 0, actual: 0, forecast: 185_000_000 },
  { cat: "Preliminaries", budget: 135_000_000, committed: 135_000_000, actual: 108_000_000, forecast: 135_000_000 },
];

const projAudit = [
  { id: "AUD-001", action: "Contract signed", user: "GMD", timestamp: "2026-03-15 10:30", ref: "CON-USV-2026-001", type: "Contract" },
  { id: "AUD-002", action: "Site mobilisation approved", user: "GED Projects", timestamp: "2026-03-21 09:00", ref: null as string | null, type: "Approval" },
  { id: "AUD-003", action: "Piling contract awarded: Georock Foundations", user: "Procurement Officer", timestamp: "2026-04-02 14:15", ref: "PO-2026-021", type: "Procurement" },
  { id: "AUD-004", action: "EOT request received: 45 days (weather)", user: "Contractor", timestamp: "2026-07-08 11:00", ref: "EOT-001", type: "Variation" },
  { id: "AUD-005", action: "EOT granted: 59 days", user: "GED Projects", timestamp: "2026-07-18 16:30", ref: "EOT-001", type: "Approval" },
  { id: "AUD-006", action: "Variation VC-001 raised: Additional earthworks Zone C", user: "Site Engineer", timestamp: "2026-08-10 09:45", ref: "VC-001", type: "Variation" },
  { id: "AUD-007", action: "Variation VC-001 approved: ₦4.85M", user: "GED Projects", timestamp: "2026-08-12 15:20", ref: "VC-001", type: "Approval" },
  { id: "AUD-008", action: "PO-2026-089 raised: Reinforcement Steel Y20", user: "Procurement Officer", timestamp: "2026-09-05 08:30", ref: "PO-2026-089", type: "Procurement" },
];

const projDocuments = [
  { ref: "DRW-2026-001", title: "Site Layout & Setting-out Plan", type: "Drawing", rev: "C", date: "2026-03-18", status: "Approved" },
  { ref: "DRW-2026-012", title: "Foundation Structural Layout", type: "Drawing", rev: "B", date: "2026-04-02", status: "Approved" },
  { ref: "DRW-2026-031", title: "Block A Typical Floor Plan (1F-5F)", type: "Drawing", rev: "A", date: "2026-07-15", status: "Under Review" },
  { ref: "SR-2026-006", title: "Monthly Progress Report: August 2026", type: "Report", rev: "-", date: "2026-09-01", status: "Issued" },
  { ref: "BOQ-2026-001", title: "Bill of Quantities: Revised (Post VC-001)", type: "BOQ", rev: "2", date: "2026-08-14", status: "Approved" },
  { ref: "CON-USV-2026-001", title: "Main Contract Agreement", type: "Contract", rev: "-", date: "2026-03-15", status: "Executed" },
];

const projInvoices = [
  { id: "INV-2026-031", ref: "PC-2026-01", desc: "Progress Claim: Milestone 1 (Piling complete)", amount: 85_000_000, vat: 8_500_000, total: 93_500_000, status: "Paid", date: "2026-06-30", paidDate: "2026-07-15" as string | null },
  { id: "INV-2026-048", ref: "PC-2026-02", desc: "Progress Claim: Milestone 2 (Substructure complete)", amount: 135_000_000, vat: 13_500_000, total: 148_500_000, status: "Paid", date: "2026-07-31", paidDate: "2026-08-12" as string | null },
  { id: "INV-2026-061", ref: "PC-2026-03", desc: "Progress Claim: Milestone 3 (Block A Level 1)", amount: 85_000_000, vat: 8_500_000, total: 93_500_000, status: "Overdue", date: "2026-08-10", paidDate: null as string | null },
];

const projVariations = [
  { id: "VC-001", desc: "Additional earthworks: Zone C (unforeseen ground conditions)", requestedBy: "Site Engineer", amount: 4_850_000, status: "Approved", date: "2026-08-12", approver: "GED Projects" },
  { id: "VC-002", desc: "Revised MEP spec: Block D (client upgrade)", requestedBy: "M&E Consultant", amount: 12_300_000, status: "Under Review", date: "2026-08-28", approver: "QS Manager" },
  { id: "EOT-001", desc: "Extension of Time: 59 days (weather + design delay)", requestedBy: "Contractor", amount: 0, status: "Approved", date: "2026-07-18", approver: "GED Projects" },
];

export function ProjectControlRoom({ code, nav }: { code: string; nav: Nav }) {
  const p = projects.find((x) => x.code === code) ?? projects[0];
  const tabLabels = ["Overview", "Contract", "Programme", "WBS", "QS / BOQ", "Procurement", "Site Operations", "Costs", "Invoices", "Variations", "Issues & Risks", "Documents", "Audit"];
  const [activeTab, setActiveTab] = useState(0);

  const noBackupCount = projResponsibilities.filter((r) => !r.backup).length;

  return (
    <div className="animate-in">
      <button onClick={() => nav("portfolio")} className="mb-3 text-xs font-semibold text-muted-foreground hover:text-primary">← Portfolio</button>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CompanyTag company={p.company} />
            <span className="font-mono text-xs text-muted-foreground">{p.code}</span>
          </div>
          <h1 className="mt-1.5 font-display text-xl sm:text-2xl font-bold tracking-tight">{p.name}</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {p.client} · {p.location} · PM {p.pm} · ends {p.endDate}
          </p>
        </div>
        <div className={`rounded-[var(--radius)] border px-5 py-3 text-center ${p.health === "critical" ? "border-critical/30 bg-critical-bg" : p.health === "attention" ? "border-attention/30 bg-attention-bg" : "border-healthy/30 bg-healthy-bg"}`}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Project Health</p>
          <p className={`font-display text-xl font-bold uppercase ${p.health === "critical" ? "text-critical" : p.health === "attention" ? "text-attention" : "text-healthy"}`}>
            {p.health === "critical" ? "At Risk" : healthLabel[p.health]}
          </p>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-border">
        {tabLabels.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition ${
              activeTab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
            {t === "Issues & Risks" && projIssues.filter((x) => x.severity === "critical").length > 0 && (
              <span className="ml-1.5 rounded-full bg-critical px-1.5 py-0.5 text-[9px] font-bold text-white">
                {projIssues.filter((x) => x.severity === "critical").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 0 && (
        <>
          {/* health dimensions */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {dims.map((d) => {
              const h = p[d.key] as Health;
              return (
                <Card key={d.label} className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{d.label}</p>
                    <HealthDot h={h} />
                  </div>
                  <p className={`mt-1.5 text-xs font-semibold ${h === "critical" ? "text-critical" : h === "attention" ? "text-attention" : "text-healthy"}`}>{healthLabel[h]}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{d.detail}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <SectionHead title="Progress: Planned vs Actual" hint={`Variance ${p.progressActual - p.progressPlanned}% · critical path slipping`} />
              <div className="p-4 pt-2">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={sCurve} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid stroke="#e0e0da" vertical={false} />
                    <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                    <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #d9d9d3", fontSize: 12 }} />
                    <Area type="monotone" dataKey="plan" stroke="#6b6f77" strokeWidth={2} fill="transparent" strokeDasharray="4 3" />
                    <Area type="monotone" dataKey="act" stroke="#b23120" strokeWidth={2.5} fill="#f6e2de" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <SectionHead title="Financial Exposure" />
              <div className="space-y-3 p-4">
                {[
                  ["Contract value", naira(p.contractValue), "text-foreground"],
                  ["Approved budget", naira(p.contractValue * 0.82), "text-foreground"],
                  ["Actual cost", naira(p.contractValue * 0.5), "text-foreground"],
                  ["Committed (open POs)", naira(p.contractValue * 0.22), "text-attention"],
                  ["Committed position", naira(p.contractValue * 0.72), "text-critical"],
                  ["Overdue receivable", naira(p.receivablesOverdue), "text-critical"],
                ].map(([l, v, c]) => (
                  <div key={l} className="flex items-center justify-between border-b border-border pb-2 text-sm last:border-0">
                    <span className="text-muted-foreground">{l}</span>
                    <span className={`font-mono font-semibold tabular-nums ${c}`}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Responsibility Matrix */}
          <Card className="mt-3">
            <SectionHead
              title="Responsibility Matrix"
              hint="Who owns what; gaps flagged"
              action={
                noBackupCount > 0 ? (
                  <div className="flex items-center gap-1.5 rounded border border-attention/30 bg-attention-bg px-2.5 py-1 text-[11px] font-semibold text-attention">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {noBackupCount} coverage gaps
                  </div>
                ) : null
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["Function", "Owner", "Backup / Cover", "Status"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projResponsibilities.map((r) => (
                    <tr key={r.fn} className="border-b border-border last:border-0 transition hover:bg-panel">
                      <td className="px-4 py-2.5 font-medium">{r.fn}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{r.owner}</td>
                      <td className="px-4 py-2.5">
                        {r.backup ? (
                          <span className="text-muted-foreground">{r.backup}</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-critical">
                            <AlertTriangle className="h-3 w-3" /> No backup
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                          r.status === "critical" ? "bg-critical-bg text-critical" :
                          r.status === "attention" ? "bg-attention-bg text-attention" :
                          "bg-healthy-bg text-healthy"
                        }`}>
                          {r.status === "critical" ? "Gap: cover needed" : r.status === "attention" ? "Monitor" : "Covered"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Card>
              <SectionHead title="What Needs Attention?" />
              <ul className="divide-y divide-border">
                {[
                  { t: "Reinforcement PO awaiting your approval", h: "critical" as Health, m: "Foundation blocked · SLA breached" },
                  { t: "Client GA approval overdue 12 days", h: "critical" as Health, m: "Escalation to GGMP recommended" },
                  { t: "₦85m Milestone-3 invoice overdue", h: "critical" as Health, m: "34 days · finance following up" },
                  { t: "PM over-allocated across 3 projects", h: "attention" as Health, m: "Consider support PM" },
                ].map((x, i) => (
                  <li key={i} className="flex items-start gap-2.5 px-4 py-3">
                    <HealthDot h={x.h} className="mt-1.5" />
                    <div><p className="text-sm font-medium">{x.t}</p><p className="text-xs text-muted-foreground">{x.m}</p></div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <SectionHead title="What's Happening?" />
              <ul className="space-y-3 p-4">
                {timeline.map((e, i) => (
                  <li key={i} className="flex gap-3 text-xs">
                    <span className="w-10 shrink-0 font-mono text-muted-foreground">{e.time}</span>
                    <div className="relative border-l border-border pl-3">
                      <span className="absolute -left-[3px] top-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <p><span className="font-medium text-foreground">{e.actor}</span> <span className="text-muted-foreground">{e.text}</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <SectionHead title="What's Next?" />
              <ul className="divide-y divide-border">
                {[
                  ["Milestone 4: Superstructure start", "22 Sep", "attention"],
                  ["Client design review meeting", "09 Sep", "healthy"],
                  ["Reinforcement delivery (post-PO)", "11 Sep", "attention"],
                  ["QS valuation 3 cut-off", "15 Sep", "healthy"],
                  ["Contract expiry alert window", "14 Jul '26", "healthy"],
                ].map(([t, d, h], i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="flex items-center gap-2"><HealthDot h={h as Health} /> {t}</span>
                    <span className="font-mono text-xs text-muted-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}

      {/* ── CONTRACT TAB ── */}
      {activeTab === 1 && (
        <div className="mt-5 space-y-4 animate-in">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Contract details */}
            <Card>
              <SectionHead title="Contract Details" hint={projContract.ref} />
              <div className="divide-y divide-border">
                {[
                  ["Reference", projContract.ref],
                  ["Type", projContract.type],
                  ["Retention", projContract.retention],
                  ["Defects Liability", projContract.defectsLiability],
                  ["Governing Law", projContract.govLaw],
                  ["Dispute Resolution", projContract.disputeResolution],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground shrink-0">{l}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
                <div className="px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Contract Value</p>
                  <p className="font-display text-2xl font-bold text-foreground tabular-nums">{naira(projContract.value)}</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {/* Key Dates */}
              <Card>
                <SectionHead title="Key Dates" />
                <div className="divide-y divide-border">
                  {[
                    { l: "Signed", v: projContract.signDate, highlight: false },
                    { l: "Commencement", v: projContract.commenceDate, highlight: false },
                    { l: "Original Completion", v: projContract.originalCompletion, highlight: false },
                    { l: "Revised Completion", v: projContract.revisedCompletion, highlight: true },
                    { l: "Extensions Granted", v: projContract.extensionsGranted, highlight: true },
                  ].map(({ l, v, highlight }) => (
                    <div key={l} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground">{l}</span>
                      <span className={`font-mono font-semibold ${highlight ? "text-attention" : "text-foreground"}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Parties */}
              <Card>
                <SectionHead title="Parties" />
                <div className="divide-y divide-border">
                  {[
                    ["Contractor", projContract.contractor],
                    ["Client", projContract.client],
                    ["Engineer / Architect", projContract.engineer],
                    ["Project Manager", projContract.pm],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground shrink-0">{l}</span>
                      <span className="font-medium text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Special Conditions */}
          <Card>
            <SectionHead title="Special Conditions" />
            <ul className="divide-y divide-border">
              {projContract.specialConditions.map((c, i) => (
                <li key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-healthy" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* ── PROGRAMME TAB ── */}
      {activeTab === 2 && (
        <div className="mt-5 space-y-4 animate-in">
          <div className="rounded-[var(--radius)] border border-attention/30 bg-attention-bg px-4 py-3 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-attention mt-0.5" />
            <p className="text-sm font-semibold text-attention">Critical Path: Superstructure is 22pp behind planned progress; risk to revised completion date (Nov 2027).</p>
          </div>

          <Card>
            <SectionHead title="Work Package Schedule" hint="Planned vs Actual progress by work package" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["ID", "Work Package", "Start", "End", "Planned %", "Actual %", "Progress", "Status"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projWorkPackages.map((wp) => {
                    const behind = wp.actual < wp.planned;
                    return (
                      <tr key={wp.id} className="border-b border-border last:border-0 hover:bg-panel transition">
                        <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{wp.id}</td>
                        <td className="px-4 py-2.5 font-medium max-w-xs">{wp.name}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{wp.start}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{wp.end}</td>
                        <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{wp.planned}%</td>
                        <td className={`px-4 py-2.5 font-mono text-xs font-semibold tabular-nums ${behind && wp.planned > 0 ? "text-critical" : "text-foreground"}`}>{wp.actual}%</td>
                        <td className="px-4 py-2.5 min-w-[120px]">
                          <div className="relative h-2 rounded-full bg-border overflow-hidden">
                            <div className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/30" style={{ width: `${wp.planned}%` }} />
                            <div className={`absolute inset-y-0 left-0 rounded-full ${wp.status === "Complete" ? "bg-healthy" : behind && wp.planned > 0 ? "bg-critical" : "bg-primary"}`} style={{ width: `${wp.actual}%` }} />
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                            wp.status === "Complete" ? "bg-healthy-bg text-healthy" :
                            wp.status === "In Progress" ? "bg-primary/10 text-primary" :
                            "bg-panel text-muted-foreground"
                          }`}>{wp.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Overall Planned", value: `${Math.round(projWorkPackages.reduce((s, w) => s + w.planned, 0) / projWorkPackages.length)}%`, tone: "attention" as Health },
              { label: "Overall Actual", value: `${Math.round(projWorkPackages.reduce((s, w) => s + w.actual, 0) / projWorkPackages.length)}%`, tone: "critical" as Health },
              { label: "Variance", value: `-${Math.round(projWorkPackages.reduce((s, w) => s + w.planned, 0) / projWorkPackages.length) - Math.round(projWorkPackages.reduce((s, w) => s + w.actual, 0) / projWorkPackages.length)}pp`, tone: "critical" as Health },
            ].map((t) => (
              <Card key={t.label} className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.label}</p>
                <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${t.tone === "critical" ? "text-critical" : t.tone === "attention" ? "text-attention" : "text-healthy"}`}>{t.value}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── WBS TAB ── */}
      {activeTab === 3 && (
        <div className="mt-5 space-y-4 animate-in">
          <Card>
            <SectionHead title="Work Breakdown Structure" hint="Budget allocation by WBS element" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["WBS Code", "Description", "Budget (₦)", "Status"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projWBS.map((w) => (
                    <tr key={w.id} className={`border-b border-border last:border-0 hover:bg-panel transition ${w.level === 0 ? "bg-panel" : ""}`}>
                      <td className={`px-4 py-2.5 font-mono text-[11px] text-muted-foreground ${w.level === 1 ? "pl-8" : w.level === 2 ? "pl-12" : ""}`}>{w.id}</td>
                      <td className={`px-4 py-2.5 ${w.level === 0 ? "font-bold text-foreground" : w.level === 1 ? "pl-8 font-semibold text-foreground" : "pl-12 text-muted-foreground"}`}>{w.label}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-right text-xs">{naira(w.value)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                          w.status === "Complete" ? "bg-healthy-bg text-healthy" :
                          w.status === "In Progress" ? "bg-primary/10 text-primary" :
                          "bg-panel text-muted-foreground"
                        }`}>{w.status}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary/30 bg-panel font-bold">
                    <td className="px-4 py-2.5 font-mono text-[11px]">TOTAL</td>
                    <td className="px-4 py-2.5 font-bold">All Work Elements</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-right text-xs font-bold">{naira(projWBS.filter(w => w.level === 1).reduce((s, w) => s + w.value, 0))}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── QS / BOQ TAB ── */}
      {activeTab === 4 && (
        <div className="mt-5 space-y-4 animate-in">
          {(() => {
            const totalBoQ = projBOQ.filter(r => r.cat === "header").reduce((s, r) => s + r.amount, 0);
            const totalClaimed = projBOQ.reduce((s, r) => s + r.claimed, 0);
            const pctClaimed = Math.round((totalClaimed / totalBoQ) * 100);
            return (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { l: "Total BoQ Value", v: naira(totalBoQ), tone: "healthy" as Health },
                    { l: "Total Claimed to Date", v: naira(totalClaimed), tone: "healthy" as Health },
                    { l: "% Claimed", v: `${pctClaimed}%`, tone: "attention" as Health },
                    { l: "Outstanding", v: naira(totalBoQ - totalClaimed), tone: "attention" as Health },
                  ].map((t) => (
                    <Card key={t.l} className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.l}</p>
                      <p className={`mt-2 font-display text-xl font-bold tabular-nums ${t.tone === "critical" ? "text-critical" : t.tone === "attention" ? "text-attention" : "text-healthy"}`}>{t.v}</p>
                    </Card>
                  ))}
                </div>

                <Card>
                  <SectionHead title="Bill of Quantities" hint="Ref-level breakdown with claim status" />
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-panel">
                          {["Ref", "Description", "Unit", "Qty", "Rate (₦)", "Amount (₦)", "Claimed (₦)", "%"].map((h) => (
                            <th key={h} className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground last:text-right">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projBOQ.map((row) => (
                          <tr key={row.ref} className={`border-b border-border last:border-0 hover:bg-panel transition ${row.cat === "header" ? "bg-panel/60" : ""}`}>
                            <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{row.ref}</td>
                            <td className={`px-3 py-2 ${row.cat === "header" ? "font-bold text-foreground" : "text-muted-foreground"}`}>{row.desc}</td>
                            <td className="px-3 py-2 text-xs text-muted-foreground">{row.unit}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs tabular-nums">{row.cat === "header" ? "" : row.qty.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs tabular-nums">{row.cat === "header" ? "" : naira(row.rate)}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs tabular-nums font-semibold">{naira(row.amount)}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs tabular-nums">{naira(row.claimed)}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs tabular-nums">{row.amount > 0 ? `${Math.round((row.claimed / row.amount) * 100)}%` : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            );
          })()}
        </div>
      )}

      {/* ── PROCUREMENT TAB ── */}
      {activeTab === 5 && (
        <div className="mt-5 space-y-4 animate-in">
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Total PO Value", v: naira(projProcurement.reduce((s, p) => s + p.value, 0)), tone: "healthy" as Health },
              { l: "Pending Approval", v: projProcurement.filter(p => p.status.startsWith("Pending")).length.toString(), tone: "attention" as Health },
              { l: "Delivered / Closed", v: projProcurement.filter(p => p.status === "Delivered" || p.stage === "Closed").length.toString(), tone: "healthy" as Health },
            ].map((t) => (
              <Card key={t.l} className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.l}</p>
                <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${t.tone === "critical" ? "text-critical" : t.tone === "attention" ? "text-attention" : "text-healthy"}`}>{t.v}</p>
              </Card>
            ))}
          </div>
          <Card>
            <SectionHead title="Purchase Orders" hint="Project-level procurement register" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["PO ID", "Description", "Vendor", "Value (₦)", "Stage", "Status", "Date"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projProcurement.map((po) => (
                    <tr key={po.id} className="border-b border-border last:border-0 hover:bg-panel transition">
                      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{po.id}</td>
                      <td className="px-4 py-2.5 font-medium max-w-xs">{po.item}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{po.vendor}</td>
                      <td className="px-4 py-2.5 font-mono text-xs tabular-nums font-semibold">{naira(po.value)}</td>
                      <td className="px-4 py-2.5"><span className="rounded bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{po.stage}</span></td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                          po.status === "Delivered" ? "bg-healthy-bg text-healthy" :
                          po.status.startsWith("Pending") ? "bg-attention-bg text-attention" :
                          po.status === "On Site" ? "bg-primary/10 text-primary" :
                          "bg-panel text-muted-foreground"
                        }`}>{po.status}</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{po.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── SITE OPERATIONS TAB ── */}
      {activeTab === 6 && (
        <div className="mt-5 space-y-4 animate-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Daily Site Diary</h2>
              <p className="text-xs text-muted-foreground">Last updated: {projSiteOps[0].date}</p>
            </div>
          </div>
          {projSiteOps.map((entry, idx) => (
            <Card key={entry.date}>
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded px-2.5 py-1 text-xs font-bold ${idx === 0 ? "bg-primary text-primary-foreground" : "bg-panel text-muted-foreground"}`}>{entry.date}</div>
                    {idx === 0 && <span className="rounded bg-healthy-bg px-2 py-0.5 text-[10px] font-bold text-healthy">Latest</span>}
                  </div>
                  <div className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-sm font-bold">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{entry.workforce}</span>
                    <span className="text-xs font-normal text-muted-foreground">workforce</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Plant &amp; Equipment</p>
                    <div className="flex flex-wrap gap-1">
                      {entry.plant.map((pl) => (
                        <span key={pl} className="rounded bg-panel px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{pl}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Activities</p>
                    <p className="text-xs text-foreground leading-relaxed">{entry.activities}</p>
                  </div>
                </div>

                {entry.issues && (
                  <div className="mt-3 flex items-start gap-2 rounded border border-attention/30 bg-attention-bg px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-attention mt-0.5" />
                    <p className="text-xs font-semibold text-attention">{entry.issues}</p>
                  </div>
                )}
                <div className="mt-2 flex items-start gap-2 rounded bg-panel px-3 py-2">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground"><span className="font-semibold">Safety: </span>{entry.safety}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── COSTS TAB ── */}
      {activeTab === 7 && (
        <div className="mt-5 space-y-4 animate-in">
          {(() => {
            const totalBudget = projCosts.reduce((s, c) => s + c.budget, 0);
            const totalCommitted = projCosts.reduce((s, c) => s + c.committed, 0);
            const totalActual = projCosts.reduce((s, c) => s + c.actual, 0);
            const totalForecast = projCosts.reduce((s, c) => s + c.forecast, 0);
            const variance = totalForecast - totalBudget;
            return (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    { l: "Total Budget", v: naira(totalBudget), tone: "healthy" as Health },
                    { l: "Committed", v: naira(totalCommitted), tone: "attention" as Health },
                    { l: "Actual Cost", v: naira(totalActual), tone: "attention" as Health },
                    { l: "Forecast Final", v: naira(totalForecast), tone: "attention" as Health },
                    { l: "Cost Variance", v: (variance >= 0 ? "+" : "") + naira(variance), tone: variance > 0 ? "critical" as Health : "healthy" as Health },
                  ].map((t) => (
                    <Card key={t.l} className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.l}</p>
                      <p className={`mt-2 font-display text-lg font-bold tabular-nums ${t.tone === "critical" ? "text-critical" : t.tone === "attention" ? "text-attention" : "text-healthy"}`}>{t.v}</p>
                    </Card>
                  ))}
                </div>

                <Card>
                  <SectionHead title="Cost Breakdown by Category" />
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-panel">
                          {["Category", "Budget (₦)", "Committed (₦)", "Actual (₦)", "Forecast (₦)", "Variance (₦)", "% Complete"].map((h) => (
                            <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projCosts.map((c) => {
                          const v = c.forecast - c.budget;
                          const pct = c.budget > 0 ? Math.round((c.actual / c.budget) * 100) : 0;
                          return (
                            <tr key={c.cat} className="border-b border-border last:border-0 hover:bg-panel transition">
                              <td className="px-4 py-2.5 font-medium">{c.cat}</td>
                              <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{naira(c.budget)}</td>
                              <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{naira(c.committed)}</td>
                              <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{naira(c.actual)}</td>
                              <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{naira(c.forecast)}</td>
                              <td className={`px-4 py-2.5 font-mono text-xs tabular-nums font-semibold ${v > 0 ? "text-critical" : "text-healthy"}`}>{(v >= 0 ? "+" : "") + naira(v)}</td>
                              <td className="px-4 py-2.5 min-w-[100px]">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(pct, 100)}%` }} />
                                  </div>
                                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{pct}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="border-t-2 border-primary/30 bg-panel font-bold">
                          <td className="px-4 py-2.5 font-bold">TOTAL</td>
                          <td className="px-4 py-2.5 font-mono text-xs tabular-nums font-bold">{naira(totalBudget)}</td>
                          <td className="px-4 py-2.5 font-mono text-xs tabular-nums font-bold">{naira(totalCommitted)}</td>
                          <td className="px-4 py-2.5 font-mono text-xs tabular-nums font-bold">{naira(totalActual)}</td>
                          <td className="px-4 py-2.5 font-mono text-xs tabular-nums font-bold">{naira(totalForecast)}</td>
                          <td className={`px-4 py-2.5 font-mono text-xs tabular-nums font-bold ${variance > 0 ? "text-critical" : "text-healthy"}`}>{(variance >= 0 ? "+" : "") + naira(variance)}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card>
                  <SectionHead title="Budget vs Actual by Category" />
                  <div className="p-4 pt-2">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={projCosts.map(c => ({ name: c.cat, Budget: Math.round(c.budget / 1_000_000), Actual: Math.round(c.actual / 1_000_000) }))} margin={{ left: -10, right: 8, top: 8 }}>
                        <CartesianGrid stroke={chartColors.grid} vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#6b6f77" }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#6b6f77" }} unit="M" />
                        <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #d9d9d3", fontSize: 12 }} formatter={(v) => [`₦${v}M`, ""]} />
                        <Bar dataKey="Budget" fill="#d9d9d3" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Actual" fill={chartColors.primary} radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </>
            );
          })()}
        </div>
      )}

      {/* ── INVOICES TAB ── */}
      {activeTab === 8 && (
        <div className="mt-5 space-y-4 animate-in">
          {(() => {
            const totalInvoiced = projInvoices.reduce((s, i) => s + i.total, 0);
            const totalReceived = projInvoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.total, 0);
            const overdue = projInvoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.total, 0);
            return (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "Total Invoiced", v: naira(totalInvoiced), tone: "healthy" as Health },
                    { l: "Total Received", v: naira(totalReceived), tone: "healthy" as Health },
                    { l: "Overdue", v: naira(overdue), tone: "critical" as Health },
                  ].map((t) => (
                    <Card key={t.l} className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.l}</p>
                      <p className={`mt-2 font-display text-xl font-bold tabular-nums ${t.tone === "critical" ? "text-critical" : t.tone === "attention" ? "text-attention" : "text-healthy"}`}>{t.v}</p>
                    </Card>
                  ))}
                </div>

                <Card>
                  <SectionHead title="Invoice Register" hint="Progress claims and payment status" />
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-panel">
                          {["Invoice ID", "Ref", "Description", "Excl. VAT (₦)", "VAT (₦)", "Total (₦)", "Status", "Invoice Date", "Paid Date"].map((h) => (
                            <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projInvoices.map((inv) => (
                          <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-panel transition">
                            <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{inv.id}</td>
                            <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{inv.ref}</td>
                            <td className="px-4 py-2.5 text-xs max-w-xs">{inv.desc}</td>
                            <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{naira(inv.amount)}</td>
                            <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{naira(inv.vat)}</td>
                            <td className="px-4 py-2.5 font-mono text-xs tabular-nums font-semibold">{naira(inv.total)}</td>
                            <td className="px-4 py-2.5">
                              <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                                inv.status === "Paid" ? "bg-healthy-bg text-healthy" :
                                inv.status === "Overdue" ? "bg-critical-bg text-critical" :
                                "bg-attention-bg text-attention"
                              }`}>{inv.status}</span>
                            </td>
                            <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{inv.date}</td>
                            <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{inv.paidDate ?? <span className="text-critical">—</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            );
          })()}
        </div>
      )}

      {/* ── VARIATIONS TAB ── */}
      {activeTab === 9 && (
        <div className="mt-5 space-y-4 animate-in">
          {(() => {
            const approvedVars = projVariations.filter(v => v.status === "Approved" && v.amount > 0);
            const netValue = projVariations.reduce((s, v) => s + v.amount, 0);
            return (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "Approved Variations", v: approvedVars.length.toString(), tone: "healthy" as Health },
                    { l: "Net Variation Value", v: naira(netValue), tone: "attention" as Health },
                    { l: "Impact on Contract", v: `+${((netValue / projContract.value) * 100).toFixed(2)}%`, tone: "attention" as Health },
                  ].map((t) => (
                    <Card key={t.l} className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.l}</p>
                      <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${t.tone === "critical" ? "text-critical" : t.tone === "attention" ? "text-attention" : "text-healthy"}`}>{t.v}</p>
                    </Card>
                  ))}
                </div>

                <Card>
                  <SectionHead title="Variation / Change Order Register" hint="All contract changes and EOTs" />
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-panel">
                          {["VC Ref", "Description", "Requested By", "Amount (₦)", "Status", "Date", "Approver"].map((h) => (
                            <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projVariations.map((v) => (
                          <tr key={v.id} className="border-b border-border last:border-0 hover:bg-panel transition">
                            <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{v.id}</td>
                            <td className="px-4 py-2.5 text-xs max-w-xs font-medium">{v.desc}</td>
                            <td className="px-4 py-2.5 text-xs text-muted-foreground">{v.requestedBy}</td>
                            <td className={`px-4 py-2.5 font-mono text-xs tabular-nums font-semibold ${v.amount > 0 ? "text-attention" : v.amount < 0 ? "text-healthy" : "text-muted-foreground"}`}>
                              {v.amount === 0 ? "EOT only" : (v.amount > 0 ? "+" : "") + naira(v.amount)}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                                v.status === "Approved" ? "bg-healthy-bg text-healthy" :
                                v.status === "Under Review" ? "bg-attention-bg text-attention" :
                                "bg-panel text-muted-foreground"
                              }`}>{v.status}</span>
                            </td>
                            <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{v.date}</td>
                            <td className="px-4 py-2.5 text-xs text-muted-foreground">{v.approver}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            );
          })()}
        </div>
      )}

      {/* ── ISSUES & RISKS TAB ── */}
      {activeTab === 10 && (
        <div className="mt-5 space-y-4">
          {/* Issues */}
          <Card>
            <SectionHead
              title="Issues Register"
              hint="Open issues requiring resolution"
              action={<span className="rounded bg-critical-bg px-2 py-0.5 text-[11px] font-bold text-critical">{projIssues.filter((i) => i.severity === "critical").length} critical</span>}
            />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["ID", "Description", "Category", "Severity", "Owner", "Deadline", "Status"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projIssues.map((iss) => (
                    <tr key={iss.id} className="border-b border-border last:border-0 transition hover:bg-panel">
                      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{iss.id}</td>
                      <td className="max-w-xs px-4 py-2.5">
                        <p className="text-sm font-medium leading-snug">{iss.desc}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="rounded bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{iss.cat}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <HealthDot h={iss.severity} />
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{iss.owner}</td>
                      <td className={`px-4 py-2.5 font-mono text-xs font-semibold ${iss.severity === "critical" ? "text-critical" : iss.severity === "attention" ? "text-attention" : "text-foreground"}`}>{iss.deadline}</td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                          iss.status === "Escalated" ? "bg-critical-bg text-critical" :
                          iss.status === "Open" ? "bg-attention-bg text-attention" :
                          "bg-secondary text-muted-foreground"
                        }`}>{iss.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Risks */}
          <Card>
            <SectionHead
              title="Risk Register"
              hint="Identified risks with probability and mitigation"
              action={<Chip tone="accent">{projRisks.length} risks logged</Chip>}
            />
            <div className="space-y-3 p-4">
              {projRisks.map((r) => (
                <div key={r.id} className="rounded border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          r.prob === "High" && r.impact === "High" ? "bg-critical-bg text-critical" :
                          r.prob === "Medium" || r.impact === "Medium" ? "bg-attention-bg text-attention" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {r.prob} prob · {r.impact} impact
                        </span>
                        <span className="rounded bg-panel px-2 py-0.5 text-[10px] text-muted-foreground">{r.status}</span>
                      </div>
                      <p className="text-sm font-medium leading-snug">{r.desc}</p>
                      <div className="mt-2 rounded bg-panel px-3 py-2 text-[11px]">
                        <span className="font-semibold text-muted-foreground">Mitigation: </span>
                        <span className="text-foreground">{r.mitigation}</span>
                      </div>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">Owner: <span className="font-semibold text-foreground">{r.owner}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── DOCUMENTS TAB ── */}
      {activeTab === 11 && (
        <div className="mt-5 space-y-4 animate-in">
          {(() => {
            const [docTabFilter, setDocTabFilter] = useState<string>("All");
            const docTypes = ["All", "Drawing", "Report", "BOQ", "Contract"];
            const filtered = docTabFilter === "All" ? projDocuments : projDocuments.filter(d => d.type === docTabFilter);
            return (
              <Card>
                <SectionHead title="Project Documents" hint={`${projDocuments.length} records`} />
                <div className="flex flex-wrap gap-1 border-b border-border px-4 py-3">
                  {docTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setDocTabFilter(t)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${docTabFilter === t ? "border-primary/30 bg-primary/8 text-primary" : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"}`}
                    >{t}</button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-panel">
                        {["Ref", "Title", "Type", "Rev", "Date", "Status", ""].map((h) => (
                          <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((doc) => (
                        <tr key={doc.ref} className="border-b border-border last:border-0 hover:bg-panel transition">
                          <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{doc.ref}</td>
                          <td className="px-4 py-2.5 font-medium max-w-xs">{doc.title}</td>
                          <td className="px-4 py-2.5"><span className="rounded bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{doc.type}</span></td>
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{doc.rev}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{doc.date}</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                              doc.status === "Approved" || doc.status === "Executed" ? "bg-healthy-bg text-healthy" :
                              doc.status === "Under Review" ? "bg-attention-bg text-attention" :
                              "bg-panel text-muted-foreground"
                            }`}>{doc.status}</span>
                          </td>
                          <td className="px-4 py-2.5"><button className="text-xs font-medium text-primary hover:underline">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })()}
        </div>
      )}

      {/* ── AUDIT TAB ── */}
      {activeTab === 12 && (
        <div className="mt-5 space-y-4 animate-in">
          {(() => {
            const [auditTypeFilter, setAuditTypeFilter] = useState<string>("All");
            const auditTypes = ["All", "Contract", "Approval", "Procurement", "Variation"];
            const filteredAudit = auditTypeFilter === "All" ? projAudit : projAudit.filter(a => a.type === auditTypeFilter);
            return (
              <Card>
                <SectionHead title="Project Audit Trail" hint="Chronological record of all significant events" />
                <div className="flex flex-wrap gap-1 border-b border-border px-4 py-3">
                  {auditTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setAuditTypeFilter(t)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${auditTypeFilter === t ? "border-primary/30 bg-primary/8 text-primary" : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"}`}
                    >{t}</button>
                  ))}
                </div>
                <div className="p-4 space-y-0">
                  {filteredAudit.map((entry, idx) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="mt-1 h-3 w-3 rounded-full border-2 border-primary bg-card shrink-0" />
                        {idx < filteredAudit.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                      </div>
                      <div className={`pb-4 flex-1 ${idx === filteredAudit.length - 1 ? "pb-0" : ""}`}>
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] text-muted-foreground">{entry.timestamp}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            entry.type === "Contract" ? "bg-primary/10 text-primary" :
                            entry.type === "Approval" ? "bg-healthy-bg text-healthy" :
                            entry.type === "Procurement" ? "bg-attention-bg text-attention" :
                            "bg-panel text-muted-foreground"
                          }`}>{entry.type}</span>
                          {entry.ref && <span className="font-mono text-[10px] rounded bg-panel px-1.5 py-0.5 text-muted-foreground">{entry.ref}</span>}
                        </div>
                        <p className="text-sm font-medium text-foreground">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">by {entry.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export function Procurement() {
  const { show } = useToast();
  const { invoices } = useInvoices();
  const [procTab, setProcTab] = useState<"requests" | "invoices">("requests");
  const [procModal, setProcModal] = useState<{ open: boolean; id: string; item: string; kind: "approve" | "escalate" | "view" }>({ open: false, id: "", item: "", kind: "approve" });
  const [resolvedProcIds, setResolvedProcIds] = useState<string[]>([]);
  const [recommended, setRecommended] = useState("Julius Steel Ltd");
  const [escSearch, setEscSearch] = useState("");
  const [escTarget, setEscTarget] = useState("");
  const [createInvOpen, setCreateInvOpen] = useState(false);
  const [viewInv, setViewInv] = useState<AppInvoice | null>(null);

  const quotes = [
    { v: "Julius Steel Ltd", price: 63_400_000, quality: "A", delivery: "5 days", rel: "High", comp: "✓" },
    { v: "Dangote Trading", price: 61_900_000, quality: "B+", delivery: "9 days", rel: "Medium", comp: "✓" },
    { v: "Northgate Metals", price: 66_100_000, quality: "A", delivery: "4 days", rel: "High", comp: "Partial" },
  ];

  const activeProcRequests = procRequests.filter((r) => !resolvedProcIds.includes(r.id));
  const blockedCount = activeProcRequests.filter((r) => r.blocker && r.sla === "critical").length;

  const statusBadge = (s: AppInvoice["status"]) => {
    if (s === "paid") return <span className="rounded-full bg-healthy-bg px-2 py-0.5 text-[10px] font-bold text-healthy">PAID</span>;
    if (s === "under-review") return <span className="rounded-full bg-info-bg px-2 py-0.5 text-[10px] font-bold text-info">Under Review</span>;
    return <span className="rounded-full bg-attention-bg px-2 py-0.5 text-[10px] font-bold text-attention">Awaiting Payment</span>;
  };

  return (
    <div className="animate-in">
      <ScreenHeader title="Procurement" desc="Need → request → approval → quotation → comparison → PO → delivery → project cost update. Traceable end to end.">
        <button onClick={() => setCreateInvOpen(true)}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
          <FileText className="h-3.5 w-3.5" /> Raise Invoice
        </button>
      </ScreenHeader>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-[var(--radius)] border border-border bg-panel p-1 w-fit">
        {([["requests", "Procurement Requests"], ["invoices", `Invoices (${invoices.length})`]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setProcTab(id)}
            className={`rounded px-4 py-1.5 text-xs font-semibold transition ${procTab === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {procTab === "requests" && <>
      {blockedCount > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-[var(--radius)] border border-critical/30 bg-critical-bg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-critical" />
          <p className="text-sm font-semibold text-critical">{blockedCount} request{blockedCount > 1 ? "s" : ""} blocked. SLA breached. Site work is stalled.</p>
        </div>
      )}

      {/* Active request cards with workflow state */}
      <div className="mb-4 space-y-3">
        {activeProcRequests.map((req) => (
          <Card key={req.id}>
            <div className="p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-muted-foreground">{req.id}</span>
                    <CompanyTag company={req.company} />
                    {req.sla === "critical" && (
                      <span className="flex items-center gap-1 rounded bg-critical-bg px-2 py-0.5 text-[10px] font-bold text-critical">
                        <AlertCircle className="h-3 w-3" /> BLOCKED
                      </span>
                    )}
                  </div>
                  <p className="font-display text-sm font-bold text-foreground">{req.item}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{req.project} · {req.requestedBy} · {req.submitted}</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{naira(req.amount)}</p>
                </div>
                <StatusBadge h={req.sla}>{req.sla === "critical" ? "SLA Breached" : req.sla === "attention" ? "In Progress" : "On Track"}</StatusBadge>
              </div>

              {/* Workflow progress bar */}
              <div className="mb-3 rounded bg-panel px-3 py-2.5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Procurement stage</p>
                <div className="flex flex-wrap items-center gap-1">
                  {PROC_FLOW.map((s, i) => (
                    <span key={s} className="flex items-center gap-1">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                        i < req.currentStage ? "bg-primary/15 text-primary" :
                        i === req.currentStage ? (req.blocker && req.sla === "critical" ? "bg-critical text-white" : "bg-accent text-accent-foreground") :
                        "bg-secondary text-muted-foreground"
                      }`}>{s}</span>
                      {i < PROC_FLOW.length - 1 && <ArrowRight className={`h-2.5 w-2.5 shrink-0 ${i < req.currentStage ? "text-primary/50" : "text-border"}`} />}
                    </span>
                  ))}
                </div>

                {/* Why blocked */}
                {req.blocker && (
                  <div className={`mt-2.5 rounded px-3 py-2 ${req.sla === "critical" ? "bg-critical-bg border border-critical/20" : "bg-attention-bg border border-attention/20"}`}>
                    <p className={`text-[11px] font-semibold ${req.sla === "critical" ? "text-critical" : "text-attention"}`}>
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      {req.blocker}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {req.sla === "critical" ? (
                  <>
                    <button
                      onClick={() => setProcModal({ open: true, id: req.id, item: req.item, kind: "approve" })}
                      className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      Approve Now <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setProcModal({ open: true, id: req.id, item: req.item, kind: "escalate" })}
                      className="inline-flex items-center gap-1.5 rounded border border-critical/30 bg-critical-bg px-4 py-2 text-xs font-semibold text-critical transition hover:bg-critical/10"
                    >
                      Escalate
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setProcModal({ open: true, id: req.id, item: req.item, kind: "view" })}
                    className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-border-strong hover:text-foreground"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quotation comparison section */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHead title="Quotation Comparison" hint="PR-USV-2026-0081 · Reinforcement steel, 42T Y16/Y12" action={
            <button
              onClick={() => show("Vendor recommendation submitted for approval", "success")}
              className="inline-flex items-center gap-1 rounded bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground transition hover:opacity-90"
            >
              Recommend vendor
            </button>
          } />
          <Table
            head={["Vendor", "Price", "Quality", "Delivery", "Reliability", "Compliance", ""]}
            rows={quotes.map((q) => [
              <span className="font-medium">{q.v}</span>,
              <span className="font-mono tabular-nums">{naira(q.price)}</span>,
              q.quality,
              q.delivery,
              q.rel,
              q.comp === "✓" ? <CheckCircle2 className="h-4 w-4 text-healthy" /> : <span className="text-attention">{q.comp}</span>,
              q.v === recommended
                ? <Chip tone="primary">Recommended</Chip>
                : <button onClick={() => { setRecommended(q.v); show(`${q.v} selected as recommended vendor`, "success"); }} className="text-xs text-muted-foreground hover:text-primary">Select</button>,
            ])}
          />
          <div className="border-t border-border bg-panel px-4 py-3 text-sm">
            <span className="font-semibold text-foreground">Recommended: {recommended}</span>
            <span className="text-muted-foreground">, best reliability + full compliance; justified by delivery time on blocked works.</span>
          </div>
        </Card>
        <Card>
          <SectionHead title="Approval Queue" hint="Procurement requests" />
          <ul className="divide-y divide-border">
            {procRequests.map((r) => (
              <li key={r.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                  <HealthDot h={resolvedProcIds.includes(r.id) ? "healthy" : r.sla} />
                </div>
                <p className="mt-1 text-sm font-medium">{r.item}</p>
                <p className="text-xs text-muted-foreground">{naira(r.amount)} · Stage {r.currentStage + 1} · {r.submitted}</p>
                {resolvedProcIds.includes(r.id) && <p className="mt-0.5 text-[10px] font-semibold text-healthy">Approved</p>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Escalate modal with staff picker */}
      {procModal.open && procModal.kind === "escalate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setProcModal(m => ({ ...m, open: false }))}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl animate-scalein" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-critical-bg">
                  <AlertTriangle className="h-3.5 w-3.5 text-critical" />
                </div>
                <p className="font-display text-[15px] font-bold">Escalate Procurement Item</p>
              </div>
              <button onClick={() => setProcModal(m => ({ ...m, open: false }))} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded border border-critical/20 bg-critical-bg/50 px-3 py-2 text-[11px] font-medium text-critical">
                Escalating: <span className="font-bold">{procModal.item}</span> ({procModal.id})
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Escalate To <span className="text-critical">*</span></label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={escSearch}
                    onChange={e => { setEscSearch(e.target.value); if (escTarget) setEscTarget(""); }}
                    placeholder="Search by name or title…"
                    className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none"
                    autoFocus
                  />
                </div>
                {escSearch.trim().length > 0 && !escTarget && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded border border-border divide-y divide-border">
                    {staffMembers.filter(s => s.name.toLowerCase().includes(escSearch.toLowerCase()) || s.title.toLowerCase().includes(escSearch.toLowerCase())).map(s => (
                      <button key={s.id} onClick={() => { setEscTarget(s.name); setEscSearch(s.name); }} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">{s.initials}</div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.title} · {s.department}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {escTarget && <p className="mt-1 text-[11px] font-semibold text-healthy">✓ Escalating to: {escTarget}</p>}
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Reason <span className="text-critical">*</span></label>
                <textarea id="proc-esc-reason" rows={3} placeholder="Why is this being escalated? What decision or action is required?" className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button onClick={() => setProcModal(m => ({ ...m, open: false }))} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button
                  onClick={() => {
                    const reason = (document.getElementById("proc-esc-reason") as HTMLTextAreaElement)?.value ?? "";
                    if (!escTarget || !reason.trim()) { show("Please select a person and provide a reason.", "warning"); return; }
                    setResolvedProcIds(p => [...p, procModal.id]);
                    setProcModal(m => ({ ...m, open: false }));
                    setEscSearch(""); setEscTarget("");
                    show(`${procModal.id} escalated to ${escTarget} for urgent resolution`, "warning");
                  }}
                  className="inline-flex items-center gap-1.5 rounded bg-critical px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Confirm Escalation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ActionModal
        open={procModal.open && procModal.kind !== "escalate"}
        onClose={() => setProcModal(m => ({ ...m, open: false }))}
        title={procModal.kind === "approve" ? "Approve Procurement Request" : "Procurement Request Details"}
        actionLabel={procModal.kind === "approve" ? "Approve & Advance" : "Acknowledge"}
        tone="primary"
        context={procModal.item}
        showFileUpload={procModal.kind === "approve"}
        onConfirm={() => {
          if (procModal.kind !== "view") setResolvedProcIds(p => [...p, procModal.id]);
          setProcModal(m => ({ ...m, open: false }));
          const msgs: Record<string, string> = { approve: `${procModal.id} approved. Advanced to next procurement stage.`, view: `${procModal.id} acknowledged` };
          show(msgs[procModal.kind] ?? "Done", "success");
        }}
      />
      </>}

      {/* ── Invoices tab ── */}
      {procTab === "invoices" && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Invoices", value: invoices.length, tone: "" },
              { label: "Awaiting Payment", value: invoices.filter(i => i.status === "submitted" || i.status === "under-review").length, tone: "text-attention" },
              { label: "Paid", value: invoices.filter(i => i.status === "paid").length, tone: "text-healthy" },
            ].map(s => (
              <Card key={s.label} className="p-4">
                <p className={`font-display text-2xl font-bold tabular-nums ${s.tone || "text-foreground"}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>

          {invoices.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <FileText className="h-8 w-8 text-muted-foreground" strokeWidth={1.4} />
              <p className="font-semibold">No invoices yet</p>
              <p className="text-sm text-muted-foreground">Click "Raise Invoice" to generate your first invoice.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {invoices.map(inv => (
                <Card key={inv.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{inv.id}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${inv.company === "USV" ? "bg-[#0B2551]/10 text-[#0B2551] dark:text-[#6fa3d8]" : "bg-[#0D3E72]/10 text-[#0D3E72] dark:text-[#6AAED8]"}`}>{inv.company}</span>
                        {statusBadge(inv.status)}
                      </div>
                      <p className="font-semibold">{inv.vendorName}</p>
                      <p className="text-xs text-muted-foreground">{inv.project} · Raised {inv.createdAt} by {inv.createdBy}</p>
                      <p className="mt-1 font-mono text-sm font-bold tabular-nums">{nairaFmt(inv.total)}</p>
                      {inv.status === "paid" && inv.paymentReceipt && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-healthy">
                          <CheckCircle2 className="h-3 w-3" /> Paid {inv.paidAt} · Receipt: {inv.paymentReceipt}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setViewInv(inv)}
                      className="shrink-0 rounded border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      View Invoice
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invoice view modal */}
      {viewInv && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[4vh]" onClick={() => setViewInv(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[11px] text-white/70">{viewInv.id}</p>
              <button onClick={() => setViewInv(null)} className="rounded p-1.5 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <InvoiceTemplate inv={viewInv} />
          </div>
        </div>
      )}

      <CreateInvoiceModal open={createInvOpen} onClose={() => setCreateInvOpen(false)} createdBy="Procurement Officer" />
    </div>
  );
}

/* ─────────────────────────── APPROVAL CENTRE ─────────────────────────── */

function ApprovalChain({
  requester, requesterDept, reviewer, reviewerDept, approver, approverDept, stage,
}: {
  requester: string; requesterDept?: string;
  reviewer: string; reviewerDept?: string;
  approver: string; approverDept?: string;
  stage: string;
}) {
  const steps = [
    { label: "Requester", role: requester },
    { label: "Reviewer", role: reviewer },
    { label: "Approver", role: approver },
    { label: "Records", role: "Finance / QS" },
  ];
  const activeIdx = stage === "Review" ? 1 : stage === "Approval" || stage === "Recommendation" ? 2 : stage === "Approved" ? 3 : 0;
  return (
    <div className="flex flex-wrap items-start gap-1">
      {steps.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className={`flex flex-col items-start ${i === activeIdx ? "text-primary" : i < activeIdx ? "text-healthy" : "text-muted-foreground"}`}>
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
              i === activeIdx ? "bg-primary/10 text-primary" :
              i < activeIdx ? "bg-healthy-bg text-healthy" :
              "bg-panel text-muted-foreground"
            }`}>{s.label}</span>
            <span className={`mt-0.5 max-w-[80px] text-[10px] font-semibold leading-tight ${i === activeIdx ? "text-primary" : i < activeIdx ? "text-healthy" : "text-muted-foreground/60"}`}>{s.role}</span>
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className={`h-3 w-3 shrink-0 mt-1 ${i < activeIdx ? "text-healthy" : "text-border-strong"}`} />
          )}
        </span>
      ))}
    </div>
  );
}

const APPROVAL_STATUSES = ["All", "Pending", "Approved", "Rejected"] as const;
type ApprovalStatus = typeof APPROVAL_STATUSES[number];

/* ── Approval Timeline (visual chain steps) ── */
function ApprovalTimeline({ steps }: {
  steps: { label: string; actor: string; status: "done" | "current" | "pending"; date?: string }[];
}) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3 pb-3">
          <div className="relative flex flex-col items-center">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
              step.status === "done"
                ? "border-healthy bg-healthy-bg"
                : step.status === "current"
                ? "border-primary bg-primary/10"
                : "border-border bg-panel"
            }`}>
              {step.status === "done" && (
                <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 text-healthy" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              )}
              {step.status === "current" && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              )}
              {step.status === "pending" && (
                <div className="h-2 w-2 rounded-full bg-border" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`mt-1 w-px flex-1 ${step.status === "done" ? "bg-healthy/40" : "bg-border"}`} style={{ minHeight: 16 }} />
            )}
          </div>
          <div className="pb-1 pt-0.5">
            <p className={`text-[12px] font-bold ${step.status === "pending" ? "text-muted-foreground/60" : "text-foreground"}`}>
              {step.label}
            </p>
            <p className={`text-[11px] ${step.status === "pending" ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
              {step.actor}
            </p>
            {step.date && (
              <p className="text-[10px] text-healthy">{step.date}</p>
            )}
            {step.status === "current" && !step.date && (
              <p className="text-[10px] text-primary">Awaiting action</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Build mock timeline steps for an approval request */
function buildMockTimeline(req: ApprovalRequest): { label: string; actor: string; status: "done" | "current" | "pending"; date?: string }[] {
  const isHighValue = (req.amount ?? 0) > 50_000_000;
  const base: { label: string; actor: string; status: "done" | "current" | "pending"; date?: string }[] = [
    { label: "Submitted", actor: req.requesterName, status: "done", date: req.submitted },
    { label: "Department Head Review", actor: "Department Head", status: "done", date: "05 Sep 2026" },
    { label: "GED Projects Approval", actor: "Engr. Fatima Aliyu Dantata", status: "current" },
  ];
  if (isHighValue) {
    base.push({ label: "GMD Final Sign-off", actor: "Dr. Ibrahim Umar Garba", status: "pending" });
  }
  return base;
}

export function Approvals({ persona }: { persona: UserPersona }) {
  const { show } = useToast();
  const [tab, setTab] = useState<"incoming" | "mine" | "all" | "history">("incoming");
  const [detailItem, setDetailItem] = useState<ApprovalDetailItem | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [localRequests, setLocalRequests] = useState<ApprovalRequest[]>(approvalRequests);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; request: ApprovalRequest | null }>({ open: false, request: null });
  const [detailReq, setDetailReq] = useState<ApprovalRequest | null>(null);
  const [modalDecision, setModalDecision] = useState<"approve" | "reject">("approve");
  const [modalNote, setModalNote] = useState("");
  const [modalMarkFinal, setModalMarkFinal] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");
  const [modalForwardTo, setModalForwardTo] = useState("");

  const isExecutive = ["CHAIRMAN", "GMD", "GGMP", "EXECUTIVE"].includes(persona.authority);
  const nextPendingStep = (req: ApprovalRequest) => req.chain.find((s) => s.action === "pending");

  const incoming = localRequests.filter((r) => {
    const step = nextPendingStep(r);
    return step && step.staffName === persona.name;
  });
  const mine = localRequests.filter((r) => r.requesterName === persona.name);
  /** Items this user has acted on (approved or rejected a step) */
  const myHistory = localRequests.filter((r) =>
    r.chain.some((s) => (s.action === "approved" || s.action === "rejected" || s.action === "final") && s.staffName === persona.name)
  );
  const currentList = tab === "incoming" ? incoming : tab === "mine" ? mine : tab === "history" ? myHistory : localRequests;

  const handleTabChange = (t: "incoming" | "mine" | "all" | "history") => {
    setTab(t as any);
    setPage(1);
    setSelectedIds([]);
  };

  const openApproveModal = (req: ApprovalRequest) => {
    setModal({ open: true, request: req });
    setModalDecision("approve");
    setModalNote("");
    setModalMarkFinal(false);
    setStaffSearch("");
    setModalForwardTo("");
  };

  const handleSubmit = () => {
    if (!modal.request) return;
    const newStatus: ApprovalRequestStatus = modalDecision === "reject" ? "rejected" : modalMarkFinal ? "disbursed" : "in-review";
    setLocalRequests((prev) => prev.map((r) => r.id === modal.request!.id ? { ...r, status: newStatus } : r));
    const reqId = modal.request.id;
    setModal({ open: false, request: null });
    show(
      modalDecision === "reject"
        ? `${reqId} rejected`
        : modalMarkFinal
        ? `${reqId} approved. Disbursement triggered.`
        : `${reqId} approved. Forwarded.`,
      modalDecision === "reject" ? "warning" : "success"
    );
  };

  const handleBulkApprove = () => {
    setLocalRequests((prev) => prev.map((r) => selectedIds.includes(r.id) ? { ...r, status: "approved" as ApprovalRequestStatus } : r));
    show(`${selectedIds.length} requests approved`, "success");
    setSelectedIds([]);
  };

  const filteredStaff = staffDirectory.filter((s) =>
    !staffSearch || s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.title.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const handleExportCSV = () => {
    exportCSV("approvals-export.csv", currentList.map((r) => ({
      ID: r.id, Type: r.type, Title: r.title, Amount: r.amount ?? 0,
      Requester: r.requesterName, Project: r.project, Company: r.company,
      Submitted: r.submitted, Status: r.status, SLA: r.sla,
    })));
  };

  const initials = (name: string) =>
    name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  const StepPill = ({ action }: { action: string }) => {
    const cls: Record<string, string> = {
      approved: "bg-healthy-bg text-healthy",
      pending: "bg-attention-bg text-attention",
      rejected: "bg-critical-bg text-critical",
      final: "bg-primary/10 text-primary",
    };
    const label: Record<string, string> = { approved: "Approved", pending: "Pending", rejected: "Rejected", final: "Final" };
    return (
      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${cls[action] ?? "bg-panel text-muted-foreground"}`}>
        {label[action] ?? action}
      </span>
    );
  };

  const reqTypeChip = (t: string): "muted" | "info" | "accent" | "primary" => {
    const map: Record<string, "muted" | "info" | "accent" | "primary"> = {
      "Purchase Order": "info", "Payment Certificate": "primary", Variation: "accent", Invoice: "accent",
    };
    return map[t] ?? "muted";
  };

  const slaH = (sla: string): Health => sla === "critical" ? "critical" : sla === "attention" ? "attention" : "healthy";
  const statusH = (s: string): Health => s === "rejected" ? "critical" : s === "disbursed" || s === "approved" ? "healthy" : "attention";

  const paginated = currentList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const slaBreachCount = currentList.filter((r) => r.sla === "critical" && r.status !== "rejected" && r.status !== "disbursed").length;

  return (
    <div className="animate-in">
      <ScreenHeader title="Approval Centre" desc="Chain-of-custody workflow: request, review, approve, disburse. Full audit trail maintained.">
        <div className="flex gap-2">
          {isExecutive && selectedIds.length > 0 && (
            <button
              onClick={handleBulkApprove}
              className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Approve selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </ScreenHeader>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-[var(--radius)] border border-border bg-panel p-1 w-fit">
        {([
          { key: "incoming", label: `Incoming (${incoming.length})` },
          { key: "mine",     label: `My Requests (${mine.length})` },
          { key: "history",  label: `My History (${myHistory.length})` },
          { key: "all",      label: `All (${localRequests.length})` },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`rounded px-4 py-1.5 text-xs font-semibold transition ${tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SLA alert */}
      {slaBreachCount > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-[var(--radius)] border border-critical/30 bg-critical-bg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-critical" />
          <p className="text-sm font-semibold text-critical">
            {slaBreachCount} request{slaBreachCount > 1 ? "s" : ""} breaching SLA. Immediate action required.
          </p>
        </div>
      )}

      {paginated.length === 0 && (
        <EmptyState
          icon={CheckCircle2}
          title="Nothing here"
          subtitle={
            tab === "incoming"
              ? "No requests awaiting your approval."
              : tab === "mine"
              ? "You have not submitted any requests."
              : tab === "history"
              ? "You have not acted on any requests yet."
              : "No approval requests found."
          }
        />
      )}

      {/* History tab — compact decision-centric view */}
      {tab === "history" && paginated.length > 0 && (
        <div className="space-y-2 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground px-1">
            Actions you have taken; click any item to view full chain and final disbursement status
          </p>
          {paginated.map((req) => {
            const myStep = req.chain.find(
              (s) => s.staffName === persona.name && (s.action === "approved" || s.action === "rejected" || s.action === "final")
            );
            return (
              <Card key={req.id}>
                <button
                  className="w-full p-4 text-left hover:bg-panel transition-colors rounded-[var(--radius)]"
                  onClick={() => setDetailReq(req)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-muted-foreground">{req.id}</span>
                        <Chip tone={reqTypeChip(req.type)}>{req.type}</Chip>
                        <CompanyTag company={req.company} />
                      </div>
                      <p className="font-display text-sm font-semibold text-foreground">{req.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{req.project} · {req.submitted}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {myStep && (
                        <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${
                          myStep.action === "approved" || myStep.action === "final"
                            ? "border-healthy/30 bg-healthy-bg text-healthy"
                            : "border-critical/30 bg-critical-bg text-critical"
                        }`}>
                          You: {myStep.action === "final" ? "Final Approved" : myStep.action === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
                      <StatusBadge h={req.status === "disbursed" || req.status === "approved" ? "healthy" : req.status === "rejected" ? "critical" : "attention"}>
                        {req.status === "disbursed" ? "Disbursed" : req.status}
                      </StatusBadge>
                      {req.amount && (
                        <span className="font-mono text-xs font-bold tabular-nums text-foreground">{naira(req.amount)}</span>
                      )}
                    </div>
                  </div>
                  {req.disbursedBy && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-healthy">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      Disbursed by {req.disbursedBy}{req.disbursedAt ? ` · ${req.disbursedAt}` : ""}
                    </div>
                  )}
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        {paginated.map((req) => {
          const chainDone = req.chain.filter((s) => s.action !== "pending").length;
          const chainTotal = req.chain.length;
          const isExpanded = expandedId === req.id;
          const isSelected = selectedIds.includes(req.id);

          return (
            <Card key={req.id}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {isExecutive && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        setSelectedIds((p) => e.target.checked ? [...p, req.id] : p.filter((id) => id !== req.id))
                      }
                      className="mt-1 h-4 w-4 rounded border-border accent-primary shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground">{req.id}</span>
                      <Chip tone={reqTypeChip(req.type)}>{req.type}</Chip>
                      <CompanyTag company={req.company} />
                      <HealthDot h={slaH(req.sla)} />
                    </div>
                    <button
                      onClick={() => setDetailReq(req)}
                      className="text-left font-display text-sm font-bold text-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {req.title}
                    </button>
                    <p className="mt-0.5 text-xs text-muted-foreground">{req.requesterName} · {req.project} · {req.submitted}</p>
                    {req.amount && (
                      <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-foreground">{naira(req.amount)}</p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Step {chainDone + 1} of {chainTotal + 1} · <span className="capitalize">{req.status}</span>
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <StatusBadge h={slaH(req.sla)}>
                      {req.sla === "critical" ? "SLA Breached" : req.sla === "attention" ? "Due soon" : "On track"}
                    </StatusBadge>
                    <StatusBadge h={statusH(req.status)}>{req.status}</StatusBadge>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : req.id)}
                        className="rounded border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition"
                      >
                        {isExpanded ? "Hide" : "Chain"}
                      </button>
                      {req.status === "in-review" && (
                        <button
                          onClick={() => openApproveModal(req)}
                          className="rounded bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground hover:opacity-90 transition"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chain timeline */}
                {isExpanded && (
                  <div className="mt-3 border-t border-border pt-3">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Approval Timeline</p>
                    <ApprovalTimeline steps={buildMockTimeline(req)} />
                    {req.notes && (
                      <p className="mt-2 text-[11px] text-muted-foreground italic border-l-2 border-primary/30 pl-2">{req.notes}</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {currentList.length > PAGE_SIZE && (
        <Pagination page={page} total={currentList.length} pageSize={PAGE_SIZE} onChange={setPage} />
      )}

      {/* Standalone approval detail modal (used from external dashboards) */}
      <ApprovalDetailModal item={detailItem} onClose={() => setDetailItem(null)} />

      {/* Approval Detail Slide-out */}
      {detailReq && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setDetailReq(null)} />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-card shadow-2xl animate-slidein-right">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="font-mono text-[11px] text-muted-foreground">{detailReq.id}</p>
                <h2 className="font-display text-[15px] font-bold text-foreground">{detailReq.title}</h2>
              </div>
              <button onClick={() => setDetailReq(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone={reqTypeChip(detailReq.type)}>{detailReq.type}</Chip>
                <CompanyTag company={detailReq.company} />
                <StatusBadge h={statusH(detailReq.status)}>{detailReq.status}</StatusBadge>
                <StatusBadge h={slaH(detailReq.sla)}>
                  {detailReq.sla === "critical" ? "SLA Breached" : detailReq.sla === "attention" ? "Due soon" : "On track"}
                </StatusBadge>
              </div>

              {/* Amount */}
              {detailReq.amount && (
                <div className="rounded-[var(--radius)] bg-panel px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1">Amount</p>
                  <p className="font-display text-2xl font-bold tabular-nums text-foreground">{naira(detailReq.amount)}</p>
                </div>
              )}

              {/* Request info */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Request Details</p>
                <div className="space-y-2 rounded-[var(--radius)] border border-border bg-card overflow-hidden">
                  {[
                    { label: "Requester", value: detailReq.requesterName },
                    { label: "Role", value: detailReq.requesterTitle },
                    { label: "Project", value: detailReq.project },
                    { label: "Company", value: detailReq.company },
                    { label: "Submitted", value: detailReq.submitted },
                    { label: "Type", value: detailReq.type },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 border-b border-border/60 px-4 py-2.5 last:border-0">
                      <span className="text-[12px] text-muted-foreground shrink-0">{row.label}</span>
                      <span className="text-[12px] font-semibold text-foreground text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Justification / Notes */}
              {detailReq.notes && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Justification / Notes</p>
                  <div className="rounded-[var(--radius)] border-l-4 border-primary/40 bg-panel px-4 py-3 text-[13px] text-foreground/80 leading-relaxed">
                    {detailReq.notes}
                  </div>
                </div>
              )}

              {/* Full chain timeline */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  Approval Chain: Step {detailReq.chain.filter((s) => s.action !== "pending").length + 1} of {detailReq.chain.length + 1}
                </p>
                {/* Requester as step 0 */}
                <div className="relative space-y-0">
                  <div className="flex items-start gap-3 pb-3">
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-info-bg text-[10px] font-bold text-info">
                        {initials(detailReq.requesterName)}
                      </div>
                      {detailReq.chain.length > 0 && <div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: 16 }} />}
                    </div>
                    <div className="pb-1 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[12px] font-semibold text-foreground">{detailReq.requesterName}</span>
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-info-bg text-info">Requester</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{detailReq.requesterTitle}</p>
                      <p className="text-[10px] text-muted-foreground">{detailReq.submitted}</p>
                    </div>
                  </div>
                  {detailReq.chain.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3">
                      <div className="relative flex flex-col items-center">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          step.action === "approved" || step.action === "final" ? "bg-healthy-bg text-healthy"
                          : step.action === "rejected" ? "bg-critical-bg text-critical"
                          : "bg-attention-bg text-attention"
                        }`}>
                          {initials(step.staffName)}
                        </div>
                        {i < detailReq.chain.length - 1 && <div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: 16 }} />}
                      </div>
                      <div className="pb-1 pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[12px] font-semibold text-foreground">{step.staffName}</span>
                          <StepPill action={step.action} />
                          {step.isFinal && (
                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">FINAL</span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{step.staffTitle}</p>
                        {step.note && <p className="mt-0.5 text-[11px] italic text-muted-foreground">&ldquo;{step.note}&rdquo;</p>}
                        {step.timestamp && <p className="text-[10px] text-muted-foreground">{step.timestamp}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disbursement */}
              {detailReq.status === "disbursed" && detailReq.disbursedBy && (
                <div className="rounded-[var(--radius)] border border-healthy/20 bg-healthy-bg/40 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-healthy">Disbursed</p>
                  <p className="text-[12px] text-foreground">By: <span className="font-semibold">{detailReq.disbursedBy}</span></p>
                  <p className="text-[12px] text-muted-foreground">At: {detailReq.disbursedAt}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-border px-5 py-4 flex gap-2">
              <button
                onClick={() => setDetailReq(null)}
                className="flex-1 rounded border border-border py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition"
              >
                Close
              </button>
              {detailReq.status === "in-review" && (
                <button
                  onClick={() => { openApproveModal(detailReq); setDetailReq(null); }}
                  className="flex-1 rounded bg-primary py-2 text-[12px] font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  Take Action
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Approval Modal */}
      {modal.open && modal.request && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-[var(--radius)] border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-bold text-foreground">Review Request</h2>
              <button onClick={() => setModal({ open: false, request: null })} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-4">
              {/* Summary */}
              <div className="rounded-[var(--radius)] bg-panel px-4 py-3">
                <p className="font-display text-sm font-bold text-foreground">{modal.request.title}</p>
                {modal.request.amount && (
                  <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">{naira(modal.request.amount)}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {modal.request.requesterName} · {modal.request.project} · {modal.request.submitted}
                </p>
                {modal.request.notes && (
                  <p className="mt-2 text-[11px] text-muted-foreground italic">{modal.request.notes}</p>
                )}
              </div>

              {/* Chain history */}
              {modal.request.chain.filter((s) => s.action !== "pending").length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Chain History</p>
                  <div className="space-y-2">
                    {modal.request.chain.filter((s) => s.action !== "pending").map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
                          {initials(step.staffName)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-semibold text-foreground">{step.staffName}</span>
                            <StepPill action={step.action} />
                          </div>
                          {step.note && <p className="mt-0.5 text-[10px] text-muted-foreground">{step.note}</p>}
                          {step.timestamp && <p className="text-[9px] text-muted-foreground">{step.timestamp}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision */}
              <div>
                <p className="mb-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Your Decision</p>
                <div className="flex gap-4">
                  {(["approve", "reject"] as const).map((d) => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="modal-decision"
                        value={d}
                        checked={modalDecision === d}
                        onChange={() => setModalDecision(d)}
                        className="accent-primary"
                      />
                      <span className={`text-sm font-medium capitalize ${d === "approve" ? "text-healthy" : "text-critical"}`}>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Note</label>
                <textarea
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  rows={2}
                  placeholder="Optional note for audit trail…"
                  className="w-full rounded border border-border bg-card px-3 py-2 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Forward / Mark final — shown only when approving */}
              {modalDecision === "approve" && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalMarkFinal}
                      onChange={(e) => setModalMarkFinal(e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="text-xs font-semibold text-foreground">Mark as Final: triggers disbursement</span>
                  </label>
                  {!modalMarkFinal && (
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Forward to next approver
                      </label>
                      <input
                        value={staffSearch}
                        onChange={(e) => setStaffSearch(e.target.value)}
                        placeholder="Search by name or title…"
                        className="mb-1 w-full rounded border border-border bg-card px-3 py-1.5 text-xs outline-none focus:border-primary"
                      />
                      {staffSearch.length > 0 && (
                        <div className="rounded border border-border bg-card max-h-36 overflow-y-auto">
                          {filteredStaff.slice(0, 6).map((s) => (
                            <button
                              key={s.id}
                              onClick={() => { setModalForwardTo(s.name); setStaffSearch(s.name); }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition ${modalForwardTo === s.name ? "bg-primary/8 text-primary" : ""}`}
                            >
                              <span className="font-semibold">{s.name}</span>{" "}
                              <span className="text-muted-foreground">{s.title}</span>
                            </button>
                          ))}
                          {filteredStaff.length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No staff found</p>
                          )}
                        </div>
                      )}
                      {modalForwardTo && (
                        <p className="mt-1 text-[10px] text-primary font-semibold">Will forward to: {modalForwardTo}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
              <button
                onClick={() => setModal({ open: false, request: null })}
                className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`rounded px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90 ${modalDecision === "reject" ? "bg-critical" : "bg-primary"}`}
              >
                {modalDecision === "approve" ? (modalMarkFinal ? "Approve & Disburse" : "Approve & Forward") : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── DOCUMENTS ─────────────────────────── */

/* ─────────────────────────── MEETINGS & DECISIONS ─────────────────────────── */

const meetingRecords = [
  { id: "MTG-2026-0047", title: "Project Progress Review: Abuja Housing Ph II", type: "Project Review", date: "05 Sep 2026, 09:00", venue: "Boardroom, USV HQ", chair: "Engr. Fatima Aliyu Dantata", attendees: ["Engr. Musa Usman Lawan", "Arc. Hamza Ibrahim Danladi", "Mrs. Maryam Kabiru Suleiman"], decisions: 3, open: 2, status: "Minutes Issued" },
  { id: "MTG-2026-0046", title: "Procurement Committee: Q3 Vendor Review", type: "Committee Meeting", date: "03 Sep 2026, 14:00", venue: "Conference Room 2", chair: "Barr. Hauwa Suleiman Abubakar", attendees: ["Mr. Aminu Bala Usman", "Engr. Zainab Abubakar Waziri", "Mrs. Maryam Kabiru Suleiman"], decisions: 4, open: 3, status: "Minutes Pending" },
  { id: "MTG-2026-0045", title: "Design Coordination: Lagos Commercial Dev.", type: "Technical Meeting", date: "01 Sep 2026, 11:00", venue: "CANONIC Studio", chair: "Arc. Hamza Ibrahim Danladi", attendees: ["Arc. Safiya Garba Aliyu", "Engr. Danladi Shehu"], decisions: 2, open: 1, status: "Minutes Issued" },
  { id: "MTG-2026-0044", title: "Finance Review: Group Receivables Position", type: "Finance Meeting", date: "29 Aug 2026, 10:30", venue: "Virtual (Teams)", chair: "Dr. Ibrahim Umar Garba", attendees: ["Mrs. Maryam Kabiru Suleiman", "Mr. Haruna Abubakar Wali", "Engr. Fatima Aliyu Dantata"], decisions: 5, open: 4, status: "Minutes Issued" },
];

const meetingDecisions = [
  { d: "Approve revised site programme extending Phase II completion to 30 Nov 2026", responsible: "Engr. Musa Usman Lawan", deadline: "12 Sep 2026", taskCreated: true },
  { d: "Escalate ₦85m overdue receivable directly to Federal Housing Authority, letter from GMD", responsible: "Dr. Ibrahim Umar Garba", deadline: "08 Sep 2026", taskCreated: true },
  { d: "Commission independent geotechnical review before submitting Variation +₦180m to client", responsible: "Arc. Hamza Ibrahim Danladi", deadline: "15 Sep 2026", taskCreated: false },
];

export function Meetings() {
  const [selected, setSelected] = useState<string | null>(null);
  const m = meetingRecords.find((x) => x.id === selected);

  if (m) {
    return (
      <div className="animate-in">
        <button onClick={() => setSelected(null)} className="mb-3 text-xs font-semibold text-muted-foreground hover:text-primary">← Meetings</button>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{m.id}</span>
              <Chip tone="info">{m.type}</Chip>
            </div>
            <h1 className="font-display text-2xl font-bold">{m.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{m.date} · {m.venue} · Chair: {m.chair}</p>
          </div>
          <StatusBadge h={m.open > 0 ? "attention" : "healthy"}>{m.status}</StatusBadge>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card>
            <SectionHead title="Attendees" hint={`${m.attendees.length + 1} present`} />
            <ul className="divide-y divide-border">
              {[m.chair, ...m.attendees].map((a, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                    {a.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <span className="text-sm">{a}</span>
                  {i === 0 && <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">Chair</span>}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="lg:col-span-2">
            <SectionHead title="Decisions & Actions" hint={`${meetingDecisions.length} decisions · ${m.open} open actions`} />
            <ul className="divide-y divide-border">
              {meetingDecisions.map((dec, i) => (
                <li key={i} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{dec.d}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>Responsible: <span className="font-semibold text-foreground">{dec.responsible}</span></span>
                        <span>Deadline: <span className="font-semibold text-foreground">{dec.deadline}</span></span>
                        {dec.taskCreated
                          ? <span className="flex items-center gap-1 text-healthy"><CheckCircle2 className="h-3 w-3" /> Task created in NEXUS</span>
                          : <button className="flex items-center gap-1 font-semibold text-primary hover:underline">+ Create task</button>
                        }
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <ScreenHeader title="Meetings & Decisions" desc="Every decision creates an auditable task with a responsible person and deadline. Minutes remain part of the permanent record.">
        <button className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
          <Calendar className="h-3.5 w-3.5" /> New Meeting
        </button>
      </ScreenHeader>
      <Card>
        <SectionHead title="Recent Meetings" hint={`${meetingRecords.length} this month · ${meetingRecords.reduce((s, m) => s + m.open, 0)} open actions`} />
        <Table
          head={["Ref", "Meeting", "Type", "Date", "Chair", "Decisions", "Open Actions", "Status"]}
          rows={meetingRecords.map((m) => [
            <button onClick={() => setSelected(m.id)} className="font-mono text-xs text-primary hover:underline">{m.id}</button>,
            <button onClick={() => setSelected(m.id)} className="max-w-[240px] truncate text-left font-medium hover:text-primary">{m.title}</button>,
            <Chip tone="info">{m.type}</Chip>,
            <span className="text-muted-foreground">{m.date}</span>,
            <span className="text-sm">{m.chair}</span>,
            <span className="font-mono">{m.decisions}</span>,
            <span className={`font-mono font-semibold ${m.open > 2 ? "text-critical" : m.open > 0 ? "text-attention" : "text-healthy"}`}>{m.open}</span>,
            <StatusBadge h={m.open > 0 ? "attention" : "healthy"}>{m.status}</StatusBadge>,
          ])}
        />
      </Card>
    </div>
  );
}

/* ─────────────────────────── INSTRUCTIONS & CORRESPONDENCE ─────────────────────────── */

const instructionRecords = [
  {
    id: "INS-2026-0089", title: "Expedite reinforcement delivery: Abuja Housing Ph II",
    type: "Management Instruction", from: "Dr. Ibrahim Umar Garba (GMD)", to: "Engr. Musa Usman Lawan (PM)",
    project: "PRJ-USV-2026-0015", date: "05 Sep 2026", deadline: "12 Sep 2026",
    status: "Open", priority: "Urgent" as const,
    reason: "Reinforcement steel for Block C foundation pour is 11 days past the scheduled delivery date (original: 25 Aug 2026). Block C work front is stalled with 47 labourers standing idle. The daily cost of delay is estimated at ₦840,000. Vendor (Abuja Steel Ltd) cites logistics backlog from their Port Harcourt facility. GMD has escalated this to PM level to ensure direct engagement with the vendor's Managing Director and force a firm delivery commitment.",
    expectedOutcome: "PM to provide a written delivery confirmation from Abuja Steel Ltd within 48 hours, and a revised programme showing Block C pour no later than 10 Sep 2026. If vendor cannot commit, PM to identify alternative supplier and revert to GMD/GED within 24 hours.",
    visibleTo: ["chairman","gmd","ged","ggmp","pm","project-coordinator"],
  },
  {
    id: "INS-2026-0088", title: "Commission geotechnical review before Variation submission",
    type: "Technical Instruction", from: "Engr. Fatima Aliyu Dantata (GED)", to: "Arc. Hamza Ibrahim Danladi (Head, Arch.)",
    project: "PRJ-USV-2026-0015", date: "05 Sep 2026", deadline: "15 Sep 2026",
    status: "In Progress", priority: "High" as const,
    reason: "Variation order VAR-PRJ001-003 (₦180m, revised foundation design) cannot be signed off at GED level without independent geotechnical validation of the revised soil parameters. The original soil report (dated Jan 2026) did not account for the groundwater conditions encountered at -1.5m during excavation in August. A structural redesign of this scale requires third-party confirmation before GED can certify the variation and release the related payment certificate.",
    expectedOutcome: "Head of Architecture to commission the second geotechnical visit (EXP-CAN-0203), obtain the specialist report, and forward findings to GED and structural engineer. Variation VAR-PRJ001-003 to be updated with validated soil parameters and resubmitted for GED authority no later than 15 Sep 2026.",
    visibleTo: ["chairman","gmd","ged","head-architect","architect","head-engineering","engineer","pm"],
  },
  {
    id: "INS-2026-0087", title: "Submit final account for Ibadan Ring Road: Oyo State",
    type: "Commercial Instruction", from: "Engr. Fatima Aliyu Dantata (GED)", to: "QS Haruna Sani Gombe (Head QS)",
    project: "PRJ-USV-2025-0044", date: "03 Sep 2026", deadline: "20 Sep 2026",
    status: "In Progress", priority: "High" as const,
    reason: "Ibadan Ring Road (PRJ-USV-2025-0044) reached practical completion on 14 Aug 2026. Under clause 30.1 of the JCT contract, the final account must be submitted within 30 days of practical completion. Oyo State Ministry of Works has issued a formal request (ref: OSMW/2026/FA/014) for the final account submission. USV's retention release of ₦22m is contingent on the final account being agreed. GED is directing QS to lead this to protect the company's commercial position.",
    expectedOutcome: "Head QS to prepare and submit a complete draft final account, including all agreed variations, dayworks, and final measurements, to GED for review by 20 Sep 2026. QS to copy Finance Manager for receivables tracking. Final account to be submitted to client within 3 days of GED approval.",
    visibleTo: ["chairman","gmd","ged","head-qs","qs","finance","pm"],
  },
  {
    id: "SIT-2026-0044", title: "Temporary dewatering: Abuja Housing Ph II Block C",
    type: "Site Instruction", from: "Engr. Musa Usman Lawan (PM)", to: "Engr. Suleiman Garba Jabo (Site Supervisor)",
    project: "PRJ-USV-2026-0015", date: "04 Sep 2026", deadline: "06 Sep 2026",
    status: "Completed", priority: "Normal" as const,
    reason: "Block C ground floor slab pour is scheduled for 08 Sep 2026. During preliminary excavation works, standing groundwater was detected at -1.5m depth across the northern half of the slab footprint. Pouring concrete into wet conditions would compromise mix integrity and reduce structural strength below specification. Temporary dewatering is required to achieve dry and compliant working conditions before the pour can proceed.",
    expectedOutcome: "Site Supervisor to mobilise a 3-inch submersible pump, complete dewatering, and confirm in writing (with site photo evidence) that dry working conditions have been achieved at least 48 hours before the scheduled pour. Compliance note to be logged in NEXUS under SIT-2026-0044.",
    visibleTo: ["chairman","gmd","ged","pm","project-coordinator","site-supervisor","site"],
  },
  {
    id: "CLT-2026-0031", title: "Formal letter: ₦85m overdue Milestone 3 payment (FHA)",
    type: "Client Correspondence", from: "Dr. Ibrahim Umar Garba (GMD)", to: "Federal Housing Authority",
    project: "PRJ-USV-2026-0015", date: "02 Sep 2026", deadline: "09 Sep 2026",
    status: "Awaiting Response", priority: "Urgent" as const,
    reason: "Federal Housing Authority's Milestone 3 payment of ₦85m has been outstanding for 34 days beyond the contractual 30-day payment term (payment due date: 17 Aug 2026). This receivable represents USV's largest outstanding invoice. The delay is impacting the group's operating cash position and partially contributing to the supplier payment backlog on the same project. GMD issued the formal demand letter after Finance's two prior reminders (31 Jul, 18 Aug) went unanswered.",
    expectedOutcome: "FHA to respond with a confirmed payment date and transaction reference no later than 09 Sep 2026. If no response is received, Finance and Legal will be instructed to proceed with a formal notice of dispute under clause 51 of the contract. Finance Manager to monitor FHA account daily and escalate immediately upon receipt of any payment.",
    visibleTo: ["chairman","gmd","ged","ed","finance"],
  },
  {
    id: "INS-2026-0086", title: "Prepare preliminary design report: Enugu Medical Centre",
    type: "Technical Instruction", from: "Arc. Hamza Ibrahim Danladi (Head, Arch.)", to: "Arc. Safiya Garba Aliyu",
    project: "PRJ-CAN-2026-0012", date: "01 Sep 2026", deadline: "18 Sep 2026",
    status: "In Progress", priority: "Normal" as const,
    reason: "Enugu Ministry of Health has scheduled a Stage C design gateway meeting for 20 Sep 2026, at which Canonic Associates must present the preliminary design report. This is a contractual deliverable under the consultancy agreement (ref: CAL/2026/EMC/003, clause 4.2). Failure to deliver the report on time risks triggering a delay penalty and damaging the client relationship ahead of the construction phase.",
    expectedOutcome: "Arc. Safiya Garba Aliyu to produce the preliminary design report covering: site analysis and constraints, spatial brief response, structural system proposal, MEP strategy outline, and a preliminary cost estimate coordinated with Head QS. Draft to be submitted to Head of Architecture for review by 16 Sep 2026, allowing 2 days for final edits before the client meeting.",
    visibleTo: ["chairman","gmd","ged","head-architect","architect","head-qs","qs"],
  },
];

const instStatusH: Record<string, Health> = {
  "Open": "attention",
  "In Progress": "healthy",
  "Completed": "healthy",
  "Awaiting Response": "attention",
};

const INS_STATUSES = ["All", "Open", "In Progress", "Completed", "Awaiting Response"] as const;
type InsStatus = typeof INS_STATUSES[number];

export function Instructions({ viewerRole }: { viewerRole?: string }) {
  const { show } = useToast();
  const [selectedIns, setSelectedIns] = useState<InstructionRecord | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [insFilter, setInsFilter] = useState("");
  const [insStatus, setInsStatus] = useState<InsStatus>("All");

  const getStatus = (ins: typeof instructionRecords[0]) => statuses[ins.id] ?? ins.status;

  const visibleRecords = viewerRole
    ? instructionRecords.filter(ins => !ins.visibleTo || ins.visibleTo.includes(viewerRole))
    : instructionRecords;

  const filteredIns = visibleRecords.filter((ins) => {
    const st = getStatus(ins);
    const matchesStatus = insStatus === "All" || st === insStatus;
    const q = insFilter.toLowerCase();
    const matchesSearch = !q || ins.id.toLowerCase().includes(q) || ins.title.toLowerCase().includes(q) || ins.from.toLowerCase().includes(q) || ins.to.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-in">
      <ScreenHeader title="Instructions & Correspondence" desc="Formal instructions, site instructions and client correspondence, digitising what was WhatsApp, email, and paper.">
        <button className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
          <Mail className="h-3.5 w-3.5" /> Issue Instruction
        </button>
      </ScreenHeader>

      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Open", count: visibleRecords.filter((i) => (statuses[i.id] ?? i.status) === "Open").length, tone: "attention" as Health },
          { label: "In Progress", count: visibleRecords.filter((i) => (statuses[i.id] ?? i.status) === "In Progress").length, tone: "healthy" as Health },
          { label: "Awaiting Response", count: visibleRecords.filter((i) => (statuses[i.id] ?? i.status) === "Awaiting Response").length, tone: "attention" as Health },
          { label: "Completed", count: visibleRecords.filter((i) => (statuses[i.id] ?? i.status) === "Completed").length, tone: "healthy" as Health },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className={`font-display text-2xl font-bold ${s.tone === "attention" ? "text-attention" : s.tone === "critical" ? "text-critical" : "text-foreground"}`}>{s.count}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHead title="All Instructions & Correspondence" hint={`${visibleRecords.length} records · click any row for detail and actions`} />

        {/* Search + status filter */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={insFilter}
              onChange={(e) => setInsFilter(e.target.value)}
              placeholder="Search instructions…"
              className="w-full rounded border border-border bg-panel py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {INS_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setInsStatus(s)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${insStatus === s ? "border-primary/30 bg-primary/8 text-primary" : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filteredIns.length === 0 ? (
          <EmptyState icon={Mail} title="No instructions found" subtitle="Try adjusting your search or status filter." />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-panel">
                {["Ref", "Instruction / Correspondence", "Type", "From → To", "Deadline", "Priority", "Status", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredIns.map((ins) => {
                const st = getStatus(ins);
                const sh = instStatusH[st] ?? "healthy";
                return (
                  <tr
                    key={ins.id}
                    className="cursor-pointer border-b border-border last:border-0 transition hover:bg-panel"
                    onClick={() => setSelectedIns(ins)}
                  >
                    <td className="px-4 py-2.5"><span className="font-mono text-[10px] text-muted-foreground">{ins.id}</span></td>
                    <td className="px-4 py-2.5 max-w-[220px]"><p className="truncate font-medium">{ins.title}</p></td>
                    <td className="px-4 py-2.5"><span className="rounded bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">{ins.type}</span></td>
                    <td className="px-4 py-2.5 max-w-[180px]">
                      <p className="truncate text-xs text-muted-foreground">{ins.from}</p>
                      <p className="truncate text-xs text-foreground">→ {ins.to}</p>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      <span className={ins.priority === "Urgent" ? "font-semibold text-critical" : ""}>{ins.deadline}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${ins.priority === "Urgent" ? "bg-critical-bg text-critical" : ins.priority === "High" ? "bg-attention-bg text-attention" : "bg-secondary text-muted-foreground"}`}>
                        {ins.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2.5"><StatusBadge h={sh}>{st}</StatusBadge></td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-semibold text-primary">View →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      <InstructionDetailModal
        open={!!selectedIns}
        onClose={() => setSelectedIns(null)}
        instruction={selectedIns}
        viewerRole={viewerRole}
        onAction={(action) => {
          if (selectedIns) {
            const newStatus = action === "Comply & Record" || action === "Compliance Noted" ? "Completed" :
              action === "Acknowledged" ? "In Progress" : "Awaiting Response";
            setStatuses(prev => ({ ...prev, [selectedIns.id]: newStatus }));
          }
        }}
      />
    </div>
  );
}

const DOC_TYPES = ["All", "Drawing", "Specification", "Calculation", "BOQ", "Valuation", "Contract", "Report", "PO", "GRN", "RFQ", "Finance", "HR", "Assignment", "Schedule", "Delegation"] as const;
type DocType = typeof DOC_TYPES[number];

function getDocType(n: string): string {
  if (n.startsWith("DRW-")) return "Drawing";
  if (n.startsWith("SPEC-")) return "Specification";
  if (n.startsWith("CALC-") || n.startsWith("TQ-") || n.startsWith("MEAS-")) return "Calculation";
  if (n.startsWith("BOQ-")) return "BOQ";
  if (n.startsWith("VAL-") || n.startsWith("VO-")) return "Valuation";
  if (n.startsWith("CON-")) return "Contract";
  if (n.startsWith("SR-") || n.startsWith("INSP-") || n.startsWith("ATT-") || n.startsWith("RPT-") || n.startsWith("RFI-")) return "Report";
  if (n.startsWith("PO-")) return "PO";
  if (n.startsWith("GRN-")) return "GRN";
  if (n.startsWith("RFQ-") || n.startsWith("QUOTE-")) return "RFQ";
  if (n.startsWith("REC-") || n.startsWith("VOUCHER-") || n.startsWith("PAYROLL-")) return "Finance";
  if (n.startsWith("HR-") || n.startsWith("LVE-") || n.startsWith("ONBOARD-") || n.startsWith("PERF-RPT-")) return "HR";
  if (n.startsWith("ASSIGN-") || n.startsWith("HANDOFF-")) return "Assignment";
  if (n.startsWith("DUTY-SCH-") || n.startsWith("WKPLAN-") || n.startsWith("ROSTER-")) return "Schedule";
  if (n.startsWith("DEL-")) return "Delegation";
  return "Other";
}

/* ── Version Comparison Panel ── */
type DocRecord = { n: string; t: string; disc: string; ver: string; st: string };

function VersionComparePanel({
  current,
  previous,
  onClose,
}: {
  current: DocRecord;
  previous: DocRecord;
  onClose: () => void;
}) {
  const fields: { label: string; key: keyof DocRecord }[] = [
    { label: "Ref", key: "n" },
    { label: "Title", key: "t" },
    { label: "Version", key: "ver" },
    { label: "Status", key: "st" },
    { label: "Discipline", key: "disc" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[var(--radius)] border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-bold text-foreground">Version Comparison</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          {/* Column headers */}
          <div className="grid grid-cols-3 gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            <span>Field</span>
            <span className="text-attention">Previous Version</span>
            <span className="text-healthy">Current / Latest</span>
          </div>
          <div className="divide-y divide-border rounded-[var(--radius)] border border-border overflow-hidden">
            {fields.map(({ label, key }) => {
              const changed = current[key] !== previous[key];
              return (
                <div key={key} className="grid grid-cols-3 gap-3 px-4 py-2.5 items-start">
                  <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
                  <span className={`text-[11px] font-mono ${changed ? "bg-attention/10 text-attention px-1 rounded line-through" : "text-foreground"}`}>
                    {previous[key]}
                  </span>
                  <span className={`text-[11px] font-mono ${changed ? "bg-healthy/10 text-healthy px-1 rounded font-bold" : "text-foreground"}`}>
                    {current[key]}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Change note */}
          <div className="rounded-[var(--radius)] border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary mb-1">Change Summary</p>
            <p className="text-[12px] text-foreground/80 leading-relaxed">
              Rev C supersedes Rev B. Changes: Updated column positions on grid F–G; Revised door schedule; Column grid reference B3 relocated 450mm east per structural requirement SR-PRJ001-078.
            </p>
          </div>
        </div>
        <div className="border-t border-border px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* Department prefixes used to filter officer-visible base docs */
const OFFICER_DEPT_PREFIXES: Record<string, string[]> = {
  architect:       ["DRW-", "SPEC-", "RFI-", "ASSIGN-ARC", "HANDOFF-ARC", "WKPLAN-ARC"],
  engineer:        ["CALC-", "TQ-", "SPEC-", "INSP-", "ASSIGN-ENG", "HANDOFF-ENG", "WKPLAN-ENG"],
  qs:              ["BOQ-", "VAL-", "VO-", "MEAS-", "ASSIGN-QS", "WKPLAN-QS"],
  site:            ["SR-", "INSP-", "ATT-", "DUTY-SCH-", "ROSTER-", "ASSIGN-SITE", "WKPLAN-SITE"],
  procurement:     ["RFQ-", "QUOTE-", "GRN-", "PO-", "ASSIGN-PROC", "WKPLAN-PROC"],
  accountant:      ["REC-", "VOUCHER-", "RPT-", "PAYROLL-", "ASSIGN-FIN", "WKPLAN-FIN"],
  "admin": ["HR-", "LVE-", "ONBOARD-", "PERF-RPT-", "DEL-", "WKPLAN-ADMIN"],
  "ops-officer":   ["RPT-", "INSP-", "WKPLAN-OPS"],
};

/* Comprehensive platform document registry — mirrors all active platform workflows */
const ALL_PLATFORM_DOCS: { n: string; t: string; disc: string; ver: string; st: string; h: Health; project?: string }[] = [
  // ── Architecture & Design ──
  { n: "DRW-ENM-042",   t: "First Floor Layout Revision: Enugu Medical Centre",    disc: "Architecture",       ver: "Rev A",       st: "Under Review",      h: "attention", project: "Enugu Medical Centre" },
  { n: "DRW-CAN-0442",  t: "Ground Floor GA: Lagos Commercial Complex (Rev C)",    disc: "Architecture",       ver: "Current",     st: "Awaiting Approval", h: "attention", project: "Lagos Commercial Dev." },
  { n: "DRW-LCC-013",   t: "Site Drainage Layout: Lagos Commercial Complex",       disc: "Architecture",       ver: "Rev 02",      st: "Approved",          h: "healthy",   project: "Lagos Commercial Dev." },
  { n: "DRW-CAN-0439",  t: "Ground Floor GA: Lagos Commercial (Rev B)",            disc: "Architecture",       ver: "Superseded",  st: "Archived",          h: "critical",  project: "Lagos Commercial Dev." },
  { n: "RFI-ENM-007",   t: "Client RFI Response: Roofing Material Specification",  disc: "Architecture",       ver: "Current",     st: "Awaiting Approval", h: "attention", project: "Enugu Medical Centre" },
  // ── Engineering ──
  { n: "SPEC-ENM-023",  t: "Structural Specification: Enugu Medical Centre",       disc: "Engineering",        ver: "Rev 01",      st: "Under Review",      h: "attention", project: "Enugu Medical Centre" },
  { n: "CALC-ENG-004",  t: "Roof Beam Sizing Calculations: Block D, Abuja Housing",disc: "Engineering",        ver: "Draft",       st: "In Progress",       h: "attention", project: "Abuja Housing Ph II" },
  { n: "TQ-022",        t: "TQ Response: Curtain Wall Anchor Spacing",             disc: "Engineering",        ver: "Rev 01",      st: "Under Review",      h: "attention", project: "Gov't Office Complex" },
  { n: "MEAS-PH-048",   t: "As-Built Measurement Sheet: PH Warehouse Frame",       disc: "Engineering",        ver: "Current",     st: "Submitted",         h: "healthy",   project: "PH Logistics Warehouse" },
  // ── Quantity Surveying ──
  { n: "BOQ-PRJ001-007",t: "Block C Column Concrete: Volume Measurement",          disc: "Quantity Surveying", ver: "Rev 01",      st: "Under Review",      h: "attention", project: "Abuja Housing Ph II" },
  { n: "BOQ-PRJ021-04", t: "MEP Re-measure BOQ: Gov't Office Complex",             disc: "Quantity Surveying", ver: "Rev 04",      st: "Under Review",      h: "attention", project: "Gov't Office Complex" },
  { n: "VAL-PRJ021-004",t: "M&E Interim Valuation Certificate: Cert. 04",          disc: "Quantity Surveying", ver: "Current",     st: "Awaiting Approval", h: "attention", project: "Gov't Office Complex" },
  { n: "VO-DRAFT-004",  t: "Variation Order: LED Lighting Upgrade (VO #4)",        disc: "Quantity Surveying", ver: "Draft",       st: "Awaiting Approval", h: "attention", project: "Gov't Office Complex" },
  // ── Site Operations ──
  { n: "SR-PRJ001-083", t: "Daily Site Report: 06 Sep 2026",                       disc: "Site Operations",    ver: "Current",     st: "Due Today",         h: "attention", project: "Abuja Housing Ph II" },
  { n: "SR-PRJ001-082", t: "Daily Site Report: 05 Sep 2026",                       disc: "Site Operations",    ver: "Submitted",   st: "Reviewed",          h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "SR-PRJ001-081", t: "Daily Site Report: 04 Sep 2026",                       disc: "Site Operations",    ver: "Submitted",   st: "Approved",          h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "INSP-PRJ001-002",t: "Pre-Pour Inspection Checklist: Block C Columns",      disc: "Site Operations",    ver: "Current",     st: "Due Today",         h: "attention", project: "Abuja Housing Ph II" },
  { n: "ATT-PRJ001-083",t: "Labour Attendance Register: 06 Sep 2026",              disc: "Site Operations",    ver: "Current",     st: "In Progress",       h: "attention", project: "Abuja Housing Ph II" },
  // ── Procurement ──
  { n: "RFQ-USV-2026-010", t: "RFQ: Electrical Cable Supply (3 Vendors)",          disc: "Procurement",        ver: "Current",     st: "Issued",            h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "QUOTE-CMP-082", t: "Quote Comparison: Electrical Cable Supply",             disc: "Procurement",        ver: "Draft",       st: "Under Review",      h: "attention", project: "Abuja Housing Ph II" },
  { n: "GRN-PRJ001-090",t: "Goods Received Note: Aggregate Delivery Batch 90",     disc: "Procurement",        ver: "Current",     st: "Signed",            h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "PO-USV-2026-0067", t: "Reinforcement Steel PO: Julius Steel Ltd",          disc: "Procurement",        ver: "Current",     st: "Issued",            h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "PO-USV-2026-0068", t: "Cement Supply PO: Lagos Cement Factory",            disc: "Procurement",        ver: "Current",     st: "Pending Approval",  h: "attention", project: "Abuja Housing Ph II" },
  // ── Finance & Accounts ──
  { n: "REC-SEP-002",   t: "Bank Reconciliation: August 2026",                     disc: "Finance & Accounts", ver: "Current",     st: "Under Review",      h: "attention" },
  { n: "VOUCHER-442",   t: "Payment Voucher: Julius Steel Ltd (₦63.4m)",            disc: "Finance & Accounts", ver: "Current",     st: "Awaiting Approval", h: "attention" },
  { n: "RPT-Q3-DFT",   t: "Q3 2026 Financial Report: Draft",                       disc: "Finance & Accounts", ver: "Draft",       st: "In Progress",       h: "attention" },
  { n: "PAYROLL-SEP",   t: "September 2026 Payroll Summary",                        disc: "Finance & Accounts", ver: "Current",     st: "Awaiting Approval", h: "attention" },
  // ── HR & Administration ──
  { n: "HR-LVE-2026-041", t: "Annual Leave Application: Mrs. Maimuna Sule Gombe",        disc: "HR & Administration",ver: "Current",     st: "Awaiting Approval", h: "attention" },
  { n: "HR-RPT-SEP-2026", t: "Monthly HR Report: September 2026",                  disc: "HR & Administration",ver: "Draft",       st: "In Progress",       h: "attention" },
  { n: "ONBOARD-2026-07", t: "New Hire Onboarding Pack: Site Officer",              disc: "HR & Administration",ver: "Current",     st: "Completed",         h: "healthy" },
  // ── Contracts ──
  { n: "CON-USV-2026-0021", t: "Kaduna Office Complex Construction Contract",      disc: "Contract",           ver: "Approved",    st: "Executed",          h: "healthy",   project: "Gov't Office Complex" },

  // ── Assignment Records (self-created & head-assigned) ──
  { n: "ASSIGN-ENG-004",    t: "Assignment Record: Roof Beam Sizing Calc — Block D (Self-Created)",      disc: "Engineering",        ver: "Draft",       st: "In Progress",       h: "attention", project: "Abuja Housing Ph II" },
  { n: "ASSIGN-ARC-042",    t: "Assignment Record: DWG-ENM-042 First Floor Layout (Head-Assigned)",      disc: "Architecture",       ver: "Current",     st: "Under Review",      h: "attention", project: "Enugu Medical Centre" },
  { n: "ASSIGN-QS-007",     t: "Assignment Record: BOQ-PRJ001-007 Block C Column Measurement",           disc: "Quantity Surveying", ver: "Rev 01",      st: "Under Review",      h: "attention", project: "Abuja Housing Ph II" },
  { n: "ASSIGN-PROC-010",   t: "Assignment Record: RFQ-USV-2026-010 Electrical Cable Sourcing",          disc: "Procurement",        ver: "Current",     st: "Issued",            h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "ASSIGN-FIN-002",    t: "Assignment Record: REC-SEP-002 Bank Reconciliation Finalise",            disc: "Finance & Accounts", ver: "Current",     st: "In Progress",       h: "attention" },
  { n: "ASSIGN-SITE-083",   t: "Assignment Record: Pre-Pour Inspection Checklist Block C",               disc: "Site Operations",    ver: "Current",     st: "Due Today",         h: "attention", project: "Abuja Housing Ph II" },

  // ── Assignment Handoffs / Transfers ──
  { n: "HANDOFF-ENG-001",   t: "Handoff Record: CALC-ENG-004 Transfer → Arc. Safiya Garba Aliyu (06 Sep)",     disc: "Engineering",        ver: "Current",     st: "Completed",         h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "HANDOFF-ARC-001",   t: "Handoff Record: RFI-ENM-007 Transfer → Engr. Abdullahi Musa Dabo (03 Sep)",    disc: "Architecture",       ver: "Current",     st: "Completed",         h: "healthy",   project: "Enugu Medical Centre" },

  // ── Duty Schedules & Rosters ──
  { n: "DUTY-SCH-PRJ001-W36", t: "Duty Schedule: Abuja Housing Site — Week 36 (07–13 Sep 2026)",        disc: "Site Operations",    ver: "Current",     st: "Active",            h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "DUTY-SCH-ENM-W36",    t: "Duty Schedule: Enugu Medical Centre — Week 36 (07–13 Sep 2026)",      disc: "Architecture",       ver: "Current",     st: "Active",            h: "healthy",   project: "Enugu Medical Centre" },
  { n: "ROSTER-PRJ001-W36",   t: "Labour Roster: Block C Workforce 07–13 Sep 2026",                     disc: "Site Operations",    ver: "Current",     st: "Active",            h: "healthy",   project: "Abuja Housing Ph II" },

  // ── Weekly Work Plans (My Week) ──
  { n: "WKPLAN-ARC-W36",    t: "Architecture Work Plan: Week 36 (07–13 Sep 2026)",                       disc: "Architecture",       ver: "Current",     st: "Active",            h: "healthy",   project: "Enugu Medical Centre" },
  { n: "WKPLAN-ENG-W36",    t: "Engineering Work Plan: Week 36 (07–13 Sep 2026)",                        disc: "Engineering",        ver: "Current",     st: "Active",            h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "WKPLAN-QS-W36",     t: "Quantity Surveying Work Plan: Week 36 (07–13 Sep 2026)",                 disc: "Quantity Surveying", ver: "Current",     st: "Active",            h: "healthy" },
  { n: "WKPLAN-SITE-W36",   t: "Site Operations Work Plan: Week 36 (07–13 Sep 2026)",                    disc: "Site Operations",    ver: "Current",     st: "Active",            h: "healthy",   project: "Abuja Housing Ph II" },
  { n: "WKPLAN-PROC-W36",   t: "Procurement Work Plan: Week 36 (07–13 Sep 2026)",                        disc: "Procurement",        ver: "Current",     st: "Active",            h: "healthy" },
  { n: "WKPLAN-FIN-W36",    t: "Finance Work Plan: Week 36 (07–13 Sep 2026)",                            disc: "Finance & Accounts", ver: "Current",     st: "Active",            h: "healthy" },
  { n: "WKPLAN-ADMIN-W36",  t: "Admin & HR Work Plan: Week 36 (07–13 Sep 2026)",                         disc: "HR & Administration",ver: "Current",     st: "Active",            h: "healthy" },

  // ── Delegation Notices ──
  { n: "DEL-2026-001",      t: "Delegation Notice: Site Attendance Sign-Off → Mr. Sa'adu Usman Garba",         disc: "HR & Administration",ver: "Current",     st: "Active",            h: "attention" },
  { n: "DEL-2026-002",      t: "Delegation Notice: Procurement Approval Threshold (≤₦5m) → Tunde Bello", disc: "HR & Administration",ver: "Current",     st: "Active",            h: "healthy" },
  { n: "DEL-2026-003",      t: "Delegation Notice: Drawing Review Sign-Off → Arc. Safiya Garba Aliyu",          disc: "HR & Administration",ver: "Current",     st: "Expiring Soon",     h: "attention" },

  // ── Team Performance Reports ──
  { n: "PERF-RPT-SEP-W36",  t: "Team Performance Summary: Engineering & Architecture — Wk 36",           disc: "HR & Administration",ver: "Draft",       st: "In Progress",       h: "attention" },
  { n: "PERF-RPT-AUG-2026", t: "Team Performance Report: All Departments — August 2026",                 disc: "HR & Administration",ver: "Rev 01",      st: "Approved",          h: "healthy" },
];

export function Documents({ userRole }: { userRole?: string }) {
  const { show } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [showSiteReport, setShowSiteReport] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocViewRecord | null>(null);
  const [docFilter, setDocFilter] = useState("");
  const [docType, setDocType] = useState<DocType>("All");
  const [docSortCol, setDocSortCol] = useState<string>("ref");
  const [docSortDir, setDocSortDir] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<"all" | "dept" | "assignments" | "guide">("guide");
  const [compareDoc, setCompareDoc] = useState<{ current: DocRecord; previous: DocRecord } | null>(null);

  // Hard-coded compare pair: DRW-CAN-0442 (current) vs DRW-CAN-0439 (archived/previous)
  const CAN_CURRENT = ALL_PLATFORM_DOCS.find(d => d.n === "DRW-CAN-0442");
  const CAN_PREVIOUS = ALL_PLATFORM_DOCS.find(d => d.n === "DRW-CAN-0439");

  const handleDocSort = (col: string) => {
    if (docSortCol === col) setDocSortDir(d => d === "asc" ? "desc" : "asc");
    else { setDocSortCol(col); setDocSortDir("asc"); }
  };
  const DocSortIcon = ({ col }: { col: string }) =>
    docSortCol === col ? (docSortDir === "asc" ? <ChevronUp className="inline h-2 w-2" /> : <ChevronDown className="inline h-2 w-2" />) : <span className="inline-block h-2 w-2" />;

  const OFFICER_ROLES_DOCS = ["architect", "engineer", "qs", "procurement", "project-coordinator", "accountant", "site", "bd-officer", "tender-officer", "ict-admin", "ops", "admin", "auditor"];
  const isOfficerDoc = userRole ? OFFICER_ROLES_DOCS.includes(userRole) : false;

  // Officers see their department's platform docs + anything they've uploaded
  const deptPrefixes = userRole ? (OFFICER_DEPT_PREFIXES[userRole] ?? []) : [];
  const deptDocs = ALL_PLATFORM_DOCS.filter(d => deptPrefixes.some(p => d.n.startsWith(p)));

  // Tab selection determines which base set to show
  const baseDocs = isOfficerDoc
    ? (activeTab === "dept" ? deptDocs : activeTab === "assignments" ? deptDocs.filter(d => d.st === "In Progress" || d.st === "Due Today" || d.st === "Under Review" || d.st === "Awaiting Approval") : [...deptDocs])
    : ALL_PLATFORM_DOCS;

  const allDocs = [
    ...baseDocs,
    ...uploadedDocs.map((d) => ({ n: d.n, t: d.t, disc: d.disc, ver: d.ver, st: d.st, h: d.h, project: undefined as string | undefined })),
  ];

  const filteredDocs = allDocs.filter((d) => {
    const matchesType = docType === "All" || getDocType(d.n) === docType;
    const q = docFilter.toLowerCase();
    const matchesSearch = !q || d.n.toLowerCase().includes(q) || d.t.toLowerCase().includes(q) || d.disc.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  }).sort((a, b) => {
    let cmp = 0;
    if (docSortCol === "ref") cmp = a.n.localeCompare(b.n);
    else if (docSortCol === "title") cmp = a.t.localeCompare(b.t);
    else if (docSortCol === "discipline") cmp = a.disc.localeCompare(b.disc);
    else if (docSortCol === "status") cmp = a.st.localeCompare(b.st);
    return docSortDir === "asc" ? cmp : -cmp;
  });

  // Stats computed from full (unfiltered) allDocs
  const attnCount = allDocs.filter(d => d.h === "attention").length;
  const activeCount = allDocs.filter(d => ["In Progress", "Due Today", "Under Review", "Awaiting Approval"].includes(d.st)).length;

  return (
    <div className="animate-in space-y-4">
      <ScreenHeader
        title={isOfficerDoc ? "My Documents" : "Document & Records Centre"}
        desc={isOfficerDoc
          ? "Your department documents, assignment records, weekly work plans, duty schedules, and personal uploads. Use the tabs to filter by scope."
          : "Enterprise document registry: versioned, approved, auditable. Drawings, BOQs, contracts, reports, procurement, finance, assignment records, duty schedules, delegation notices, and weekly work plans."}
      >
        <button
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Upload className="h-3.5 w-3.5" /> Upload Document
        </button>
      </ScreenHeader>

      {/* Stats strip */}
      {activeTab !== "guide" && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Records",   value: ALL_PLATFORM_DOCS.length + uploadedDocs.length, tone: "text-foreground" },
          { label: "Needs Action",    value: activeCount,  tone: attnCount > 0 ? "text-attention" : "text-healthy" },
          { label: "Archived",        value: ALL_PLATFORM_DOCS.filter(d => d.st === "Archived").length, tone: "text-critical" },
          { label: "Approved / Executed", value: ALL_PLATFORM_DOCS.filter(d => ["Approved", "Executed", "Reviewed", "Signed", "Completed"].includes(d.st)).length, tone: "text-healthy" },
        ].map(s => (
          <Card key={s.label} className="px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className={`mt-1.5 font-display text-2xl font-bold sm:text-3xl ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </div>}

      {/* Platform workflow coverage notice — shown to heads/executives */}
      {!isOfficerDoc && activeTab !== "guide" && (
        <div className="rounded-[var(--radius)] border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary mb-0.5">Registry Updated — All Platform Workflows</p>
            <p className="text-[11px] text-foreground/70 leading-relaxed">
              This registry now covers all active workflows: drawings, specs, BOQs, site reports, procurement orders, finance records, HR documents,
              <strong className="text-foreground/90"> assignment records</strong>, <strong className="text-foreground/90">handoff transfers</strong>, <strong className="text-foreground/90">weekly work plans</strong>, <strong className="text-foreground/90">duty schedules</strong>, <strong className="text-foreground/90">delegation notices</strong>, and <strong className="text-foreground/90">team performance reports</strong>.
              Use the Type filter to navigate by category.
            </p>
          </div>
        </div>
      )}

      {/* Tab bar — always visible */}
      <div className="flex flex-wrap gap-0.5 border-b border-border">
        {([
          ...(isOfficerDoc ? [
            { id: "all" as const, label: "All My Docs" },
            { id: "dept" as const, label: "Department" },
            { id: "assignments" as const, label: "Active / Pending" },
          ] : [
            { id: "all" as const, label: "Document Registry" },
          ]),
          { id: "guide" as const, label: "📖 Platform Guide", desktopOnly: true },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${"desktopOnly" in t && t.desktopOnly ? "hidden sm:flex" : ""} ${
              activeTab === t.id
                ? t.id === "guide" ? "border-primary text-primary bg-primary/5" : "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Platform Guide — desktop only ── */}
      {activeTab === "guide" && (
        <div className="hidden sm:block space-y-6 pb-4">
          {/* About NEXUS */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">About NEXUS Group</p>
              <h2 className="font-display text-lg font-bold">A Technology-Driven Construction &amp; Real-Estate Management Platform</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                NEXUS is the enterprise operations platform for <strong className="text-foreground">USV Development Services Ltd</strong> and its sister company <strong className="text-foreground">CANONIC Construction &amp; Architecture Ltd</strong> — two complementary firms that together cover the full project lifecycle from land acquisition and design through construction, commissioning, and facilities management.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The platform brings every workflow — procurement, site operations, finance, HR, document control, governance approvals — into one auditable, role-gated system. Every action generates a record; every record is retrievable here.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Active Projects", value: "6", sub: "across both entities" },
                  { label: "Contract Value", value: "₦28bn+", sub: "portfolio total" },
                  { label: "Staff Headcount", value: "34", sub: "USV + CANONIC" },
                  { label: "Platform Roles", value: "13", sub: "from Chairman to Site" },
                ].map(s => (
                  <div key={s.label} className="rounded-lg border border-border bg-panel px-3 py-2.5">
                    <p className="font-display text-xl font-bold tabular-nums text-primary">{s.value}</p>
                    <p className="text-[11px] font-semibold text-foreground">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Two Operating Entities</p>
              <div className="space-y-3">
                {[
                  { code: "USV", name: "USV Development Services Ltd", colour: "bg-primary/10 text-primary", desc: "Civil and structural construction, site management, procurement, and project delivery. Operates the main construction workforce across residential, commercial, and infrastructure projects." },
                  { code: "CAN", name: "CANONIC Construction & Architecture Ltd", colour: "bg-attention-bg text-attention", desc: "Architecture, MEP design, interior fit-out, and specialist construction. Leads design-and-build mandates and provides professional services across the Group." },
                ].map(e => (
                  <div key={e.code} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${e.colour}`}>{e.code}</span>
                      <p className="text-[11px] font-semibold text-foreground leading-tight">{e.name}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Org Hierarchy */}
          <Card className="p-5">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Organisational Structure &amp; Role Hierarchy</p>
            <div className="overflow-x-auto">
              <div className="flex min-w-[600px] flex-col gap-2">
                {[
                  { tier: "Tier 1 — Governance", colour: "bg-primary text-primary-foreground", roles: [{ role: "Chairman", desc: "Board oversight, final strategic authority, group governance" }] },
                  { tier: "Tier 2 — Group Management", colour: "bg-primary/80 text-primary-foreground", roles: [{ role: "GMD", desc: "Group Managing Director — day-to-day group leadership" }] },
                  { tier: "Tier 3 — Executive", colour: "bg-primary/60 text-primary-foreground", roles: [
                    { role: "GED", desc: "Group Executive Director, Projects — project delivery authority" },
                    { role: "ED", desc: "Executive Director, Corporate Services — finance, HR, ICT" },
                    { role: "GGMP", desc: "Group General Manager, Projects — commercial and BD" },
                  ]},
                  { tier: "Tier 4 — Senior Management", colour: "bg-secondary text-foreground", roles: [
                    { role: "PM", desc: "Senior Project Manager — day-to-day project command" },
                    { role: "Head of Architecture", desc: "Design authority and team lead for architects" },
                    { role: "Head QS", desc: "Commercial lead, valuations and BOQ sign-off" },
                    { role: "Head of Admin & HR", desc: "People, payroll, and compliance lead" },
                  ]},
                  { tier: "Tier 5 — Officers & Professionals", colour: "bg-muted text-muted-foreground", roles: [
                    { role: "Architect", desc: "Drawing production, site instructions, design" },
                    { role: "Engineer", desc: "Structural calculations, supervision, technical" },
                    { role: "QS Officer", desc: "Measurements, subcontractor valuations, BOQ" },
                    { role: "Site Officer", desc: "Daily site management, GRNs, safety" },
                    { role: "Procurement Officer", desc: "RFQs, POs, vendor management" },
                    { role: "Accountant", desc: "Ledger, reconciliation, payroll, returns" },
                    { role: "Admin Officer", desc: "HR support, leave, onboarding, office" },
                  ]},
                ].map(tier => (
                  <div key={tier.tier} className="flex items-start gap-3">
                    <div className={`shrink-0 rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wide w-40 text-center ${tier.colour}`}>{tier.tier.split("—")[0].trim()}</div>
                    <div className="flex flex-1 flex-wrap gap-2">
                      {tier.roles.map(r => (
                        <div key={r.role} className="rounded border border-border bg-panel px-3 py-1.5">
                          <p className="text-[11px] font-semibold text-foreground">{r.role}</p>
                          <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Document Numbering Guide */}
          <Card className="p-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Document Numbering Scheme</p>
            <p className="mb-4 text-[11px] text-muted-foreground">Every record on NEXUS carries a structured reference number. The prefix tells you the document type instantly.</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { prefix: "DRW-", type: "Drawing", colour: "bg-info-bg text-info", desc: "Architectural and structural drawings. Suffix indicates discipline (CAN/USV) and sequential number." },
                { prefix: "BOQ-", type: "Bill of Quantities", colour: "bg-info-bg text-info", desc: "Itemised cost schedules for projects. Revision number appended (e.g. Rev 04)." },
                { prefix: "SPEC-", type: "Specification", colour: "bg-info-bg text-info", desc: "Technical specifications governing materials, workmanship, and standards." },
                { prefix: "CALC-", type: "Calculation", colour: "bg-info-bg text-info", desc: "Structural or MEP engineering calculations supporting design decisions." },
                { prefix: "VAR-", type: "Variation Order", colour: "bg-attention-bg text-attention", desc: "Approved or pending changes to the contract scope, cost, or programme." },
                { prefix: "SR-", type: "Site Report", colour: "bg-panel text-muted-foreground border border-border", desc: "Daily or weekly site progress reports submitted by site officers." },
                { prefix: "INV-", type: "Invoice / Receivable", colour: "bg-healthy/10 text-healthy", desc: "Invoices issued to clients or received from contractors. Linked to valuations." },
                { prefix: "PO-", type: "Purchase Order", colour: "bg-healthy/10 text-healthy", desc: "Formally issued orders to approved vendors after procurement approval." },
                { prefix: "RFQ-", type: "Request for Quotation", colour: "bg-healthy/10 text-healthy", desc: "Price enquiries sent to vendors during the procurement selection process." },
                { prefix: "GRN-", type: "Goods Receipt Note", colour: "bg-healthy/10 text-healthy", desc: "Site-signed confirmation that ordered materials were received and inspected." },
                { prefix: "ASSIGN-", type: "Assignment Record", colour: "bg-primary/10 text-primary", desc: "Formal task assignments from heads to officers or self-assigned by staff." },
                { prefix: "HANDOFF-", type: "Assignment Handoff", colour: "bg-primary/10 text-primary", desc: "Transfer record when an assignment moves between staff members." },
                { prefix: "DUTY-SCH-", type: "Duty Schedule", colour: "bg-primary/10 text-primary", desc: "Weekly recurring duty rosters for site operations and officer rounds." },
                { prefix: "WKPLAN-", type: "Weekly Work Plan", colour: "bg-primary/10 text-primary", desc: "Structured weekly activity plans submitted by officers and approved by heads." },
                { prefix: "DEL-", type: "Delegation Notice", colour: "bg-critical/10 text-critical", desc: "Formal authority delegations issued when an executive is absent or delegates power." },
                { prefix: "PERF-RPT-", type: "Performance Report", colour: "bg-critical/10 text-critical", desc: "Team or individual performance summaries generated by department heads." },
                { prefix: "HR-", type: "HR Record", colour: "bg-muted text-muted-foreground border border-border", desc: "Leave applications, disciplinary files, onboarding packs, and employee records." },
                { prefix: "AUD-", type: "Audit Record", colour: "bg-muted text-muted-foreground border border-border", desc: "Internal audit findings, risk register entries, and compliance review outputs." },
              ].map(p => (
                <div key={p.prefix} className="rounded-lg border border-border bg-card p-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${p.colour}`}>{p.prefix}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-foreground">{p.type}</p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Document Lifecycle */}
          <Card className="p-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Document Lifecycle</p>
            <p className="mb-4 text-[11px] text-muted-foreground">All documents follow a controlled status progression. No document can skip a stage.</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { st: "Draft", col: "bg-muted text-muted-foreground border-border", desc: "Being prepared — not yet submitted" },
                { st: "Under Review", col: "bg-info-bg text-info border-info/20", desc: "Submitted, under technical review" },
                { st: "Awaiting Approval", col: "bg-attention-bg text-attention border-attention/20", desc: "Review complete, pending sign-off" },
                { st: "Approved", col: "bg-healthy/10 text-healthy border-healthy/20", desc: "Formally approved and current" },
                { st: "In Progress", col: "bg-primary/10 text-primary border-primary/20", desc: "Active — work ongoing against this record" },
                { st: "Completed", col: "bg-healthy/10 text-healthy border-healthy/20", desc: "Task or assignment fully closed" },
                { st: "Superseded", col: "bg-critical/10 text-critical border-critical/20 line-through", desc: "Replaced by a newer revision — do not use" },
                { st: "Archived", col: "bg-critical/10 text-critical border-critical/20", desc: "Permanently closed and filed for audit" },
              ].map((s, i, arr) => (
                <span key={s.st} className="flex items-center gap-1.5">
                  <span className={`rounded border px-2.5 py-1 text-[11px] font-semibold ${s.col}`} title={s.desc}>{s.st}</span>
                  {i < arr.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { st: "Draft", desc: "Being prepared — not yet submitted" },
                { st: "Awaiting Approval", desc: "Review complete, pending sign-off" },
                { st: "Superseded", desc: "Replaced by a newer revision — do not use" },
                { st: "Archived", desc: "Permanently closed and filed for audit" },
              ].map(s => (
                <p key={s.st} className="text-[10px] text-muted-foreground"><span className="font-semibold text-foreground">{s.st}:</span> {s.desc}</p>
              ))}
            </div>
          </Card>

          {/* Platform Workflows */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Key Platform Workflows</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Procurement Workflow",
                  icon: "🛒",
                  colour: "border-healthy/30 bg-healthy/5",
                  header: "bg-healthy/10 text-healthy",
                  steps: [
                    { step: "Procurement Request", who: "PM / Department Head", note: "Identifies requirement, submits request with justification and budget code" },
                    { step: "RFQ Issued to Vendors", who: "Procurement Officer", note: "Minimum 3 quotes required for amounts >₦5m per Group policy" },
                    { step: "Bid Comparison", who: "Procurement Officer + Committee", note: "Scored on price, certification, delivery, and past performance" },
                    { step: "PO Approval", who: "GED / GGMP / GMD", note: "Approval authority determined by value: <₦10m Dept Head, <₦50m GED, >₦50m GMD" },
                    { step: "PO Issued to Vendor", who: "Procurement Officer", note: "Formal purchase order emailed and logged in NEXUS" },
                    { step: "GRN on Delivery", who: "Site Officer", note: "Goods received note signed on site. Triggers payment eligibility" },
                    { step: "Invoice → Payment", who: "Finance Manager", note: "Invoice matched to PO + GRN. Payment processed within contractual terms" },
                  ],
                },
                {
                  title: "Drawing Approval Workflow",
                  icon: "📐",
                  colour: "border-info/30 bg-info/5",
                  header: "bg-info/10 text-info",
                  steps: [
                    { step: "Drawing Prepared", who: "Architect Officer", note: "CAD drawing produced to client brief and applicable codes" },
                    { step: "Internal QA Check", who: "Head of Architecture", note: "Reviewed for technical accuracy, completeness, and code compliance" },
                    { step: "Client Review", who: "Client Representative", note: "Issued for client comment; comments logged against the drawing register" },
                    { step: "Revision (if required)", who: "Architect Officer", note: "Revisions incorporated and re-issued with incremented revision number" },
                    { step: "Head Sign-off", who: "Head of Architecture", note: "Formal approval stamp applied. Drawing enters Approved status" },
                    { step: "Issue for Construction", who: "Document Controller", note: "IFC drawing distributed to site. Previous revision superseded and archived" },
                  ],
                },
                {
                  title: "Variation Order Workflow",
                  icon: "📋",
                  colour: "border-attention/30 bg-attention/5",
                  header: "bg-attention/10 text-attention",
                  steps: [
                    { step: "Site Instruction Issued", who: "Architect / PM", note: "Change to scope identified on site or by client; SI issued to contractor" },
                    { step: "QS Assessment", who: "Quantity Surveyor", note: "Cost and programme impact calculated using agreed rates and BOQ" },
                    { step: "PM Commercial Review", who: "Senior PM", note: "PM signs off the QS costing and confirms programme impact is acceptable" },
                    { step: "GED Authority", who: "GED: Projects", note: "Variations >₦10m require GED formal approval before submission to client" },
                    { step: "Client Submission", who: "PM / GGMP", note: "Variation submitted to client with full justification and supporting documentation" },
                    { step: "Client Sign-off", who: "Client", note: "Client approves and issues instruction to proceed. VO becomes contract variation" },
                  ],
                },
                {
                  title: "Assignment & Task Workflow",
                  icon: "✅",
                  colour: "border-primary/30 bg-primary/5",
                  header: "bg-primary/10 text-primary",
                  steps: [
                    { step: "Assignment Created", who: "Head of Department / Officer", note: "HOD assigns to officer, or officer creates self-assignment for their own work" },
                    { step: "Officer Accepts / Starts", who: "Officer", note: "Assignment appears in Active Assignments panel. Officer begins work" },
                    { step: "Progress Updates", who: "Officer", note: "Comments and updates logged against the assignment record throughout execution" },
                    { step: "Mark Complete", who: "Officer", note: "Officer marks complete with completion note. Status moves to Completed" },
                    { step: "HOD Review", who: "Head of Department", note: "HOD verifies completion and signs off. Assignment archived to Documents" },
                    { step: "Handoff (if needed)", who: "Officer / HOD", note: "If transferred, HANDOFF- record created. Receiving officer continues from logged point" },
                  ],
                },
                {
                  title: "Leave & HR Workflow",
                  icon: "🏖",
                  colour: "border-muted bg-muted/30",
                  header: "bg-muted text-muted-foreground",
                  steps: [
                    { step: "Leave Application", who: "Staff Member", note: "Staff submits leave request via NEXUS HR Portal with dates and cover arrangement" },
                    { step: "HR Head Review", who: "Head of Admin & HR", note: "Checks leave balance, staffing levels, and project commitments before deciding" },
                    { step: "Approval / Rejection", who: "Head of Admin & HR", note: "Decision recorded. Staff notified immediately via notification" },
                    { step: "Leave Records Updated", who: "HR System (auto)", note: "Leave balance debited. Absence logged for payroll and attendance" },
                    { step: "Payroll Submission", who: "Head of Admin & HR → Finance", note: "Monthly payroll submitted for Finance verification and bank transfer" },
                    { step: "PAYE & Pension Remittance", who: "Accountant", note: "Statutory deductions filed to FIRS and pension administrators by the 10th" },
                  ],
                },
                {
                  title: "Finance Payment Workflow",
                  icon: "💳",
                  colour: "border-critical/20 bg-critical/5",
                  header: "bg-critical/10 text-critical",
                  steps: [
                    { step: "Payment Certificate Issued", who: "Quantity Surveyor", note: "QS certifies the value of work completed by subcontractor or vendor" },
                    { step: "PM Commercial Approval", who: "Senior PM", note: "PM confirms the certified amount matches work done and is within budget" },
                    { step: "GED Approval (>₦10m)", who: "GED: Projects", note: "Payments above threshold require GED formal sign-off before processing" },
                    { step: "Finance Processing", who: "Finance Manager", note: "Invoice matched to PO, GRN, and payment certificate. Bank transfer initiated" },
                    { step: "Vendor Payment Confirmation", who: "Finance / Accountant", note: "Payment reference sent to vendor. Transaction posted to project cost ledger" },
                    { step: "Bank Reconciliation", who: "Accountant", note: "Monthly reconciliation confirms all payments match bank statement entries" },
                  ],
                },
              ].map(wf => (
                <Card key={wf.title} className={`border ${wf.colour} overflow-hidden`}>
                  <div className={`flex items-center gap-2 px-4 py-3 ${wf.header}`}>
                    <span className="text-base">{wf.icon}</span>
                    <p className="text-[11px] font-bold">{wf.title}</p>
                  </div>
                  <div className="divide-y divide-border">
                    {wf.steps.map((s, i) => (
                      <div key={i} className="flex gap-3 px-4 py-2.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-border text-[9px] font-bold text-muted-foreground">{i + 1}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-foreground">{s.step}</p>
                          <p className="text-[10px] font-medium text-primary/80">{s.who}</p>
                          <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">{s.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Role Directory */}
          <Card className="p-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Role Directory — Who Does What</p>
            <p className="mb-4 text-[11px] text-muted-foreground">Each role on NEXUS has a defined authority level, approval scope, and set of documents they can create, review, or approve.</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { role: "Chairman", tier: "Governance", auth: "Board-level", company: "Group", doc: "Receives all consolidated reports. Final sign-off on board resolutions, policy changes, and major capital decisions. Oversees audit and compliance at Group level.", canApprove: "Board resolutions, executive appointments, major capex >₦500m" },
                { role: "GMD — Group Managing Director", tier: "Executive", auth: "Group authority", company: "Group", doc: "Day-to-day leadership across both entities. Reviews all major contracts, instructions, and strategic decisions. Escalation point for all executive decisions.", canApprove: "Contracts >₦50m, executive instructions, group policy" },
                { role: "GED — Group Executive Director, Projects", tier: "Executive", auth: "Projects authority", company: "USV + CAN", doc: "Governs all project delivery, technical quality, and contract administration across both companies. Signs off variations, procurement above threshold, and project risk decisions.", canApprove: "Variations >₦10m, POs >₦10m, payment certs >₦10m" },
                { role: "ED — Executive Director, Corporate Services", tier: "Executive", auth: "Corporate authority", company: "Group", doc: "Leads finance, HR, ICT, and legal compliance at group level. Signs off payroll, statutory filings, HR policy decisions, and finance controls.", canApprove: "Payroll, PAYE/pension, HR decisions, ICT procurement" },
                { role: "GGMP — Group General Manager, Projects", tier: "Executive", auth: "Commercial authority", company: "Group", doc: "Leads commercial strategy, business development, tender pipeline, and client relationships. Signs off tender submissions and new business decisions.", canApprove: "Tender submissions, client proposals, BD spend" },
                { role: "PM — Senior Project Manager", tier: "Management", auth: "Project authority", company: "USV + CAN", doc: "Full command of day-to-day project delivery. Reviews site reports, approves valuations, signs off QS work, and escalates to GED when thresholds are exceeded.", canApprove: "Valuations <₦10m, site instructions, programme changes" },
                { role: "Head of Architecture", tier: "Management", auth: "Design authority", company: "CAN", doc: "Approves all drawings, design decisions, and site instructions. Reviews architect officers' work before issue for construction. Client-facing technical lead.", canApprove: "Drawing approvals, design sign-offs, site instructions" },
                { role: "Head QS", tier: "Management", auth: "Commercial lead", company: "USV + CAN", doc: "Signs off all BOQs, valuations, and variation costings. Manages the commercial health of projects. Reviews QS officer work and escalates variation approvals.", canApprove: "Valuations, BOQ revisions, variation assessments" },
                { role: "Head of Admin & HR", tier: "Management", auth: "People authority", company: "Group", doc: "Approves all leave, manages onboarding, owns HR records, and verifies payroll before Finance. Manages disciplinary processes and staff welfare.", canApprove: "Leave applications, HR documents, onboarding packs" },
                { role: "Architect Officer", tier: "Professional", auth: "None (creates)", company: "CAN", doc: "Produces drawings, processes site instructions, and manages drawing registers. Creates self-assignments and receives tasks from Head of Architecture.", canApprove: "Cannot approve — submits for Head review" },
                { role: "Engineer", tier: "Professional", auth: "None (creates)", company: "USV", doc: "Structural calculations, technical supervision, and engineering drawings. Works within assignments set by PM or creates own task records.", canApprove: "Cannot approve — submits to PM or GED for review" },
                { role: "Quantity Surveyor", tier: "Professional", auth: "None (certifies)", company: "USV + CAN", doc: "Measurements, subcontractor claims, BOQ preparation, and variation costing. Produces payment certificates for Head QS countersignature.", canApprove: "Cannot approve — certifies and submits to Head QS" },
                { role: "Site Officer", tier: "Professional", auth: "None (operates)", company: "USV", doc: "Daily site management, GRN sign-off on delivery, safety inspections, and site reports. Submits all records to PM and site supervisor.", canApprove: "Can sign GRNs only — all other actions submitted to PM" },
                { role: "Procurement Officer", tier: "Professional", auth: "None (executes)", company: "USV + CAN", doc: "Processes RFQs, issues POs after approval, manages vendor database, and updates GRN system. Creates procurement documents for committee review.", canApprove: "Cannot approve spend — executes approved decisions" },
                { role: "Accountant", tier: "Professional", auth: "None (processes)", company: "Group", doc: "Maintains ledgers, processes transactions, reconciles bank accounts, and files statutory returns. Processes payments after Finance Manager approval.", canApprove: "Cannot approve payments — processes Finance Manager decisions" },
                { role: "Admin Officer", tier: "Officer", auth: "None (supports)", company: "Group", doc: "General admin, leave processing support, office management, filing, and onboarding coordination. Reports to Head of Admin & HR.", canApprove: "Cannot approve — supports HR and admin processes" },
              ].map(r => (
                <div key={r.role} className="rounded-lg border border-border bg-card p-3">
                  <div className="mb-2 flex flex-wrap items-start gap-2">
                    <p className="text-[12px] font-bold text-foreground leading-tight">{r.role}</p>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{r.tier}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">{r.doc}</p>
                  <div className="mt-2 rounded border border-border/60 bg-panel px-2 py-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Approval Scope</p>
                    <p className="mt-0.5 text-[10px] text-foreground/80">{r.canApprove}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick navigation hint */}
          <div className="rounded-lg border border-border bg-panel px-5 py-4 flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-[11px] font-bold text-foreground">Navigating NEXUS as a Reviewer</p>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                To explore the platform: use the <strong className="text-foreground">Login</strong> screen to switch between any of the 13 roles and see the exact view each person has.
                The <strong className="text-foreground">Action Centre</strong> shows every pending approval with its full workflow chain.
                The <strong className="text-foreground">Document Registry</strong> tab above contains all active records.
                The <strong className="text-foreground">Portfolio</strong> screen maps all active projects.
                Each dashboard is role-gated — executives see group-level KPIs; officers see only their own tasks and assignments.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "guide" && <Card>
        <SectionHead
          title="Documents"
          hint={`${filteredDocs.length} records${docFilter ? " matching search" : ""}${docType !== "All" ? ` · ${docType}` : ""}`}
          action={
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center gap-1.5 rounded border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary/10 sm:hidden"
            >
              <Upload className="h-3 w-3" /> Upload
            </button>
          }
        />

        {/* Search + type filter */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative flex-1 min-w-[160px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value)}
              placeholder="Search ref, title, discipline…"
              className="w-full rounded border border-border bg-panel py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {DOC_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setDocType(t)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${docType === t ? "border-primary/30 bg-primary/8 text-primary" : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sort bar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-4 py-2">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Sort:</span>
          {[
            { col: "ref", label: "Ref" },
            { col: "title", label: "Title" },
            { col: "discipline", label: "Discipline" },
            { col: "status", label: "Status" },
          ].map(({ col, label }) => (
            <button
              key={col}
              onClick={() => handleDocSort(col)}
              className={`flex items-center gap-0.5 rounded border px-2.5 py-1 text-[11px] font-semibold transition ${docSortCol === col ? "border-primary/30 bg-primary/8 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
            >
              {label} <DocSortIcon col={col} />
            </button>
          ))}
        </div>

        {filteredDocs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={allDocs.length === 0 && isOfficerDoc ? "No department documents found" : "No documents match your filter"}
            subtitle={allDocs.length === 0 && isOfficerDoc ? "Upload a document or ask your head to assign tasks to populate this view." : "Try changing the type filter or clearing your search."}
          />
        ) : (
          <div className="table-responsive">
          <Table
            head={["Number", "Title", "Type", "Discipline", "Project", "Version", "Status", ""]}
            rows={filteredDocs.map((d) => {
              const isSR = d.n.startsWith("SR-");
              const isInv = d.n.startsWith("INV-");
              const handleClick = () => {
                if (isSR) setShowSiteReport(true);
                else if (isInv) {
                  setSelectedInvoice({
                    id: d.n,
                    company: d.n.includes("CAN") ? "CANONIC" : "USV",
                    client: "Client, as per contract",
                    project: d.t,
                    amount: 85_000_000,
                    status: d.st,
                  });
                } else setSelectedDoc(d);
              };
              const proj = (d as any).project;
              const isComparable = d.n === "DRW-CAN-0442" && CAN_CURRENT && CAN_PREVIOUS;
              return [
                <span className="font-mono text-[11px] text-muted-foreground">{d.n}</span>,
                <button onClick={handleClick} className="text-left font-medium hover:text-primary transition text-xs max-w-[220px] leading-snug">{d.t}</button>,
                <span className="rounded bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{getDocType(d.n)}</span>,
                <Chip>{d.disc}</Chip>,
                proj ? <span className="text-[10px] text-muted-foreground">{proj}</span> : <span className="text-[10px] text-muted-foreground/40">—</span>,
                <span className={`font-mono text-xs font-semibold ${d.ver === "Superseded" ? "text-critical line-through" : d.ver === "Approved" ? "text-healthy" : "text-foreground"}`}>{d.ver}</span>,
                <StatusBadge h={d.h}>{d.st}</StatusBadge>,
                <span className="flex items-center gap-2">
                  <button onClick={handleClick} className="text-xs font-medium text-primary hover:underline">View</button>
                  {isComparable && (
                    <button
                      onClick={() => CAN_CURRENT && CAN_PREVIOUS && setCompareDoc({ current: CAN_CURRENT, previous: CAN_PREVIOUS })}
                      className="text-xs font-medium text-attention hover:underline"
                    >
                      Compare
                    </button>
                  )}
                </span>,
              ];
            })}
          />
          </div>
        )}
      </Card>}

      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={(doc) => {
          setUploadedDocs(p => [...p, doc]);
          show(`${doc.t} uploaded. Pending review.`, "success");
        }}
      />
      <SiteReportViewerModal
        open={showSiteReport}
        onClose={() => setShowSiteReport(false)}
      />
      <InvoiceDetailModal
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
      <DocumentViewerModal
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        doc={selectedDoc}
      />
      {compareDoc && (
        <VersionComparePanel
          current={compareDoc.current}
          previous={compareDoc.previous}
          onClose={() => setCompareDoc(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── AUDIT & COMPLIANCE ─────────────────────────── */

const auditFindings = [
  { id: "AUD-2026-0021", title: "Procurement: 3 POs issued without GED countersignature", risk: "High", status: "Open", project: "Abuja Housing Ph II", owner: "Procurement Manager", raised: "15 Aug 2026", deadline: "15 Sep 2026" },
  { id: "AUD-2026-0019", title: "Site expense claim: ₦2.3m submitted without supporting receipts", risk: "Medium", status: "In Review", project: "PH Logistics Warehouse", owner: "Finance Manager", raised: "28 Jul 2026", deadline: "31 Aug 2026" },
  { id: "AUD-2026-0017", title: "Leave records: 4 staff with no approved leave form on file", risk: "Low", status: "Remediated", project: "Group HR", owner: "Head of Admin & HR", raised: "10 Jul 2026", deadline: "10 Aug 2026" },
  { id: "AUD-2026-0015", title: "Drawing register: 6 superseded drawings not archived with approval stamp", risk: "Medium", status: "Open", project: "Lagos Commercial Dev.", owner: "Document Controller", raised: "22 Jun 2026", deadline: "22 Sep 2026" },
  { id: "AUD-2026-0012", title: "Vendor evaluation: Julius Steel Ltd onboarding missing two NRA certifications", risk: "High", status: "Remediated", project: "Procurement", owner: "Procurement Manager", raised: "01 Jun 2026", deadline: "01 Jul 2026" },
];

const complianceChecks = [
  { area: "Procurement Controls", score: 72, trend: "attention" as Health, note: "3 open findings. PO countersignature gap being addressed." },
  { area: "Finance Controls", score: 88, trend: "healthy" as Health, note: "Expense claims process improved; no critical findings" },
  { area: "HR Compliance", score: 91, trend: "healthy" as Health, note: "Leave records now 95% complete after recent drive" },
  { area: "Document Control", score: 65, trend: "critical" as Health, note: "Superseded drawings archive incomplete; high priority" },
  { area: "Contract Administration", score: 80, trend: "attention" as Health, note: "Variation log maintained; 1 unapproved contract amendment" },
  { area: "Safety & HSE", score: 94, trend: "healthy" as Health, note: "Zero LTI for 47 consecutive days. Site safety strong." },
];

export function AuditScreen() {
  const { show } = useToast();
  const [tab, setTab] = useState<"findings" | "compliance" | "approvals" | "access">("findings");
  const [newFinding, setNewFinding] = useState(false);

  const openCount = auditFindings.filter((f) => f.status === "Open").length;
  const highRisk = auditFindings.filter((f) => f.risk === "High" && f.status !== "Remediated").length;

  return (
    <div className="animate-in">
      <ScreenHeader title="Audit & Compliance" desc="Internal audit findings, compliance scores, approval register and access review, visible to Chairman, GMD and Audit team.">
        <button
          onClick={() => setNewFinding(true)}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <ClipboardList className="h-3.5 w-3.5" /> Raise Finding
        </button>
      </ScreenHeader>

      {/* Summary tiles */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { l: "Open Findings", v: openCount.toString(), h: openCount > 0 ? "critical" as Health : "healthy" as Health },
          { l: "High-Risk Open", v: highRisk.toString(), h: highRisk > 0 ? "critical" as Health : "healthy" as Health },
          { l: "Avg. Compliance", v: `${Math.round(complianceChecks.reduce((s, c) => s + c.score, 0) / complianceChecks.length)}%`, h: "attention" as Health },
          { l: "In Review", v: auditFindings.filter((f) => f.status === "In Review").length.toString(), h: "attention" as Health },
        ].map((t) => (
          <Card key={t.l} className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.l}</p>
            <p className={`mt-2 font-display text-3xl font-bold ${t.h === "critical" ? "text-critical" : t.h === "attention" ? "text-attention" : "text-healthy"}`}>{t.v}</p>
          </Card>
        ))}
      </div>

      {/* Tab bar */}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-border">
        {[
          { id: "findings" as const, label: "Audit Findings" },
          { id: "compliance" as const, label: "Compliance Scores" },
          { id: "approvals" as const, label: "Approval Register" },
          { id: "access" as const, label: "Access Review" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "findings" && (
        <Card>
          <SectionHead title="Audit Findings Register" hint={`${auditFindings.length} findings · ${openCount} open`} />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-panel">
                  {["Ref", "Finding", "Risk", "Project", "Owner", "Deadline", "Status"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditFindings.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-panel">
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{f.id}</td>
                    <td className="px-4 py-3 font-medium max-w-xs">{f.title}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${f.risk === "High" ? "bg-critical-bg text-critical" : f.risk === "Medium" ? "bg-attention-bg text-attention" : "bg-panel text-muted-foreground"}`}>{f.risk}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{f.project}</td>
                    <td className="px-4 py-3 text-xs">{f.owner}</td>
                    <td className="px-4 py-3 font-mono text-xs">{f.deadline}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${f.status === "Open" ? "bg-critical-bg text-critical" : f.status === "In Review" ? "bg-attention-bg text-attention" : "bg-healthy-bg text-healthy"}`}>{f.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "compliance" && (
        <div className="space-y-3">
          {complianceChecks.map((c) => (
            <Card key={c.area} className="p-4">
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-display text-sm font-bold">{c.area}</p>
                    <span className={`font-mono text-lg font-bold ${c.score >= 85 ? "text-healthy" : c.score >= 70 ? "text-attention" : "text-critical"}`}>{c.score}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${c.score >= 85 ? "bg-healthy" : c.score >= 70 ? "bg-attention" : "bg-critical"}`} style={{ width: `${c.score}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{c.note}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "approvals" && (
        <Card>
          <SectionHead title="Approval Register" hint="All approval decisions: immutable audit trail" />
          <Table
            head={["Ref", "Item", "Amount", "Requester", "Approver", "Decision", "Date"]}
            rows={[
              ["PR-USV-2026-0067", "Reinforcement Steel PO: Julius Steel", naira(63_400_000), "Site Supervisor", "GED Projects", <span className="rounded bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">Approved</span>, "04 Sep 2026"],
              ["PR-USV-2026-0079", "Diesel: 12,000L", naira(14_100_000), "Site Supervisor", "GGMP", <span className="rounded bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">Approved</span>, "03 Sep 2026"],
              ["EXP-CAN-2026-0189", "Site survey: Enugu 1st visit", naira(1_850_000), "Arc. Safiya Garba Aliyu", "Head of Architecture", <span className="rounded bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">Approved</span>, "28 Aug 2026"],
              ["VEN-2026-0015", "Vendor: concrete works (3 quotes)", naira(28_500_000), "Procurement Officer", "GGMP", <span className="rounded bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">Approved</span>, "20 Aug 2026"],
              ["PR-USV-2026-0061", "Timber formwork, 200m²", naira(4_600_000), "Site Officer", "PM", <span className="rounded bg-attention-bg px-2 py-0.5 text-[10px] font-semibold text-attention">Returned</span>, "18 Aug 2026"],
            ].map((row) => row)}
          />
        </Card>
      )}

      {tab === "access" && (
        <div className="space-y-3">
          <Card>
            <SectionHead title="System Access Review" hint="Last reviewed: 01 Sep 2026" />
            <Table
              head={["User", "Role", "Last Login", "Access Level", "Status"]}
              rows={[
                ["Engr. Fatima Aliyu Dantata", "GED, Projects", "Today, 06:30", "Executive", <StatusBadge h="healthy">Active</StatusBadge>],
                ["Barr. Hauwa Suleiman Abubakar", "GGMP", "Yesterday, 18:20", "Executive", <StatusBadge h="healthy">Active</StatusBadge>],
                ["Mrs. Maryam Kabiru Suleiman", "Finance Manager", "Today, 08:45", "Manager", <StatusBadge h="healthy">Active</StatusBadge>],
                ["Mr. Haruna Ibrahim Kure", "ICT Admin", "Today, 09:10", "System Admin", <StatusBadge h="healthy">Active</StatusBadge>],
                ["Mr. Wale Okonjo", "Project Officer", "Today, 09:10", "Operations", <StatusBadge h="attention">Probation</StatusBadge>],
                ["Mr. Biodun Salami", "Foreman", "2 weeks ago", "Field", <StatusBadge h="attention">On Leave</StatusBadge>],
              ].map((r) => r)}
            />
          </Card>
          <div className="flex justify-end">
            <button
              onClick={() => show("Access review report exported", "success")}
              className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Export Access Report
            </button>
          </div>
        </div>
      )}

      {newFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4" onClick={() => setNewFinding(false)}>
          <div className="w-full max-w-lg rounded-[var(--radius)] border border-border bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 font-display text-base font-bold">Raise Audit Finding</h2>
            <div className="space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-muted-foreground">Finding Description *</label><textarea className="w-full rounded border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-primary" rows={3} placeholder="Describe the audit finding..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs font-semibold text-muted-foreground">Risk Level</label><select className="w-full rounded border border-border bg-panel px-3 py-2 text-sm"><option>High</option><option>Medium</option><option>Low</option></select></div>
                <div><label className="mb-1 block text-xs font-semibold text-muted-foreground">Related Project</label><select className="w-full rounded border border-border bg-panel px-3 py-2 text-sm"><option>Group-wide</option>{projects.map((p) => <option key={p.code}>{p.name}</option>)}</select></div>
              </div>
              <div><label className="mb-1 block text-xs font-semibold text-muted-foreground">Responsible Owner</label><input className="w-full rounded border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Name / role of responsible party" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-muted-foreground">Deadline</label><input type="date" className="w-full rounded border border-border bg-panel px-3 py-2 text-sm" /></div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setNewFinding(false)} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground">Cancel</button>
              <button onClick={() => { setNewFinding(false); show("Audit finding AUD-2026-0022 raised. Responsible party notified.", "success"); }} className="rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Submit Finding</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── INVOICES SCREEN ─────────────────────────── */

const allInvoices: InvoiceRecord[] = [
  { id: "INV-USV-2026-0044", company: "USV", client: "Fed. Housing Auth.", clientAddress: "Federal Housing Authority, 7 Ladoke Akintola Blvd, Garki, Abuja", project: "Abuja Housing Development: Phase II", projectCode: "PRJ-USV-001", amount: 85_000_000, status: "Overdue", daysOverdue: 34, issued: "03 Aug 2026", due: "17 Aug 2026" },
  { id: "INV-USV-2026-0051", company: "USV", client: "Kaduna State Govt", clientAddress: "Ministry of Works, Secretariat Complex, Kaduna", project: "Government Office Complex", projectCode: "PRJ-USV-003", amount: 120_000_000, status: "Submitted", daysOverdue: 0, issued: "28 Aug 2026", due: "11 Sep 2026" },
  { id: "INV-USV-2025-0038", company: "USV", client: "Oyo State Govt", clientAddress: "Ministry of Infrastructure, State Secretariat, Ibadan", project: "Ibadan Ring Road", projectCode: "PRJ-USV-005", amount: 62_000_000, status: "Paid", daysOverdue: 0, issued: "10 Jul 2026", due: "24 Jul 2026" },
  { id: "INV-CAN-2026-0019", company: "CANONIC", client: "Enugu Min. of Health", clientAddress: "Ministry of Health, Government House, Enugu", project: "Enugu Medical Centre", projectCode: "PRJ-CAN-002", amount: 41_000_000, status: "Overdue", daysOverdue: 18, issued: "19 Aug 2026", due: "02 Sep 2026" },
  { id: "INV-CAN-2026-0015", company: "CANONIC", client: "Landmark Properties Ltd", clientAddress: "Plot 18, Broad Street, Lagos Island", project: "Lagos Commercial Development", projectCode: "PRJ-CAN-001", amount: 55_000_000, status: "Submitted", daysOverdue: 0, issued: "01 Sep 2026", due: "15 Sep 2026" },
  { id: "INV-USV-2026-0039", company: "USV", client: "Niger Delta Dev. Comm.", clientAddress: "NDDC Headquarters, Port Harcourt", project: "PH Logistics Warehouse", projectCode: "PRJ-USV-004", amount: 32_000_000, status: "Paid", daysOverdue: 0, issued: "12 Jun 2026", due: "26 Jun 2026" },
];

type InvFilter = "all" | "USV" | "CANONIC" | "overdue" | "paid";

export function InvoicesScreen({ nav }: { nav: (screen: string) => void }) {
  const { show } = useToast();
  const [filter, setFilter] = useState<InvFilter>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const filtered = allInvoices.filter((inv) => {
    if (filter === "all") return true;
    if (filter === "USV") return inv.company === "USV";
    if (filter === "CANONIC") return inv.company === "CANONIC";
    if (filter === "overdue") return inv.status === "Overdue";
    if (filter === "paid") return inv.status === "Paid";
    return true;
  });

  const totalOutstanding = allInvoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = allInvoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const totalPaid = allInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);

  const tabs: { id: InvFilter; label: string; count: number }[] = [
    { id: "all", label: "All Invoices", count: allInvoices.length },
    { id: "USV", label: "USV", count: allInvoices.filter((i) => i.company === "USV").length },
    { id: "CANONIC", label: "CANONIC", count: allInvoices.filter((i) => i.company === "CANONIC").length },
    { id: "overdue", label: "Overdue", count: allInvoices.filter((i) => i.status === "Overdue").length },
    { id: "paid", label: "Paid", count: allInvoices.filter((i) => i.status === "Paid").length },
  ];

  return (
    <div className="animate-in">
      <ScreenHeader
        title="Invoice Management"
        desc="All invoices across USV Construction and CANONIC Architects. Track, download, and manage receivables."
      >
        <button
          onClick={() => setSelectedInvoice(allInvoices[0])}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          <FileText className="h-3.5 w-3.5" /> New Invoice
        </button>
      </ScreenHeader>

      {/* KPI strip */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { l: "Outstanding", v: naira(totalOutstanding), t: "attention" as Health },
          { l: "Overdue", v: naira(totalOverdue), t: "critical" as Health },
          { l: "Paid (All Time)", v: naira(totalPaid), t: "healthy" as Health },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <div className="flex items-center gap-2">
              <HealthDot h={s.t} />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</p>
            </div>
            <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${s.t === "critical" ? "text-critical" : s.t === "attention" ? "text-attention" : "text-healthy"}`}>{s.v}</p>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === t.id
                ? t.id === "overdue" ? "border-critical/30 bg-critical-bg text-critical" : "border-primary/30 bg-primary/8 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"
            }`}
          >
            {t.label}
            <span className="rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Invoice list */}
      <div className="space-y-2">
        {filtered.map((inv) => (
          <Card key={inv.id}>
            <button
              onClick={() => setSelectedInvoice(inv)}
              className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-panel"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
                    inv.company === "USV"
                      ? "border-[#1A3D8F]/30 text-[#1A3D8F] bg-[#1A3D8F]/6"
                      : "border-[#3580B5]/30 text-[#3580B5] bg-[#3580B5]/6"
                  }`}>{inv.company}</span>
                  <span className="font-mono text-xs text-muted-foreground">{inv.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    inv.status === "Overdue" ? "bg-critical-bg text-critical" :
                    inv.status === "Paid" ? "bg-healthy-bg text-healthy" :
                    "bg-info-bg text-info"
                  }`}>{inv.status}{(inv.daysOverdue ?? 0) > 0 ? ` · ${inv.daysOverdue}d` : ""}</span>
                </div>
                <p className="text-sm font-semibold group-hover:text-primary">{inv.client}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{inv.project}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  {inv.issued && <span>Issued: {inv.issued}</span>}
                  {inv.due && <span>Due: {inv.due}</span>}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-lg font-bold tabular-nums">{naira(inv.amount)}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground opacity-0 transition group-hover:opacity-100">
                  View Invoice <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          </Card>
        ))}
      </div>

      <InvoiceDetailModal
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}

/* ─────────────────────────── VARIATIONS ─────────────────────────── */

const variationData = [
  { id: "VC-001", project: "PRJ-USV-2026-0015", title: "Additional earthworks: Zone C", requestedBy: "Site Engineer", amount: 4850000, status: "Approved", date: "2026-08-12", approver: "GED Projects" },
  { id: "VC-002", project: "PRJ-USV-2026-0015", title: "Revised MEP specification: Block D", requestedBy: "M&E Consultant", amount: 12300000, status: "Under Review", date: "2026-08-28", approver: "QS Manager" },
  { id: "VC-003", project: "PRJ-USV-2026-0012", title: "Scope reduction: Perimeter fencing", requestedBy: "PMO", amount: -2200000, status: "Approved", date: "2026-07-15", approver: "GED Projects" },
  { id: "VC-004", project: "PRJ-USV-2026-0018", title: "Additional piling works", requestedBy: "Structural Engineer", amount: 8750000, status: "Pending", date: "2026-09-01", approver: null },
  { id: "VC-005", project: "PRJ-USV-2026-0012", title: "Temporary works redesign", requestedBy: "Geotechnical Consultant", amount: 3100000, status: "Rejected", date: "2026-07-28", approver: "GED Projects" },
];

const fmtVar = (n: number) => (n < 0 ? "-₦" : "₦") + Math.abs(n).toLocaleString();

export function Variations({ nav }: { nav: (s: string, code?: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedVar, setSelectedVar] = useState<typeof variationData[0] | null>(null);

  const totalValue = variationData.reduce((s, v) => s + v.amount, 0);
  const approvedCount = variationData.filter((v) => v.status === "Approved").length;
  const pendingCount = variationData.filter((v) => v.status === "Pending" || v.status === "Under Review").length;

  const varStatusH = (s: string): Health =>
    s === "Approved" ? "healthy" : s === "Rejected" ? "critical" : "attention";

  return (
    <div className="animate-in">
      <ScreenHeader title="Variation Management" desc="Track, raise, and approve project variations; amount, status, and approver visibility in one place.">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Raise Variation
        </button>
      </ScreenHeader>

      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Variations", value: String(variationData.length), tone: "healthy" as Health },
          { label: "Total Value", value: fmtVar(totalValue), tone: "attention" as Health },
          { label: "Approved", value: String(approvedCount), tone: "healthy" as Health },
          { label: "Pending / In Review", value: String(pendingCount), tone: "attention" as Health },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${s.tone === "critical" ? "text-critical" : s.tone === "attention" ? "text-attention" : "text-foreground"}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Variations table */}
        <Card className="lg:col-span-2">
          <SectionHead title="Variation Register" hint={`${variationData.length} variations · click any row to view detail`} />
          {variationData.length === 0 ? (
            <EmptyState icon={GitBranch} title="No variations recorded" subtitle="Raise a variation to get started." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["ID", "Project", "Description", "Requested By", "Amount", "Status", "Date", "Approver"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {variationData.map((v) => (
                    <tr
                      key={v.id}
                      className="cursor-pointer border-b border-border last:border-0 transition hover:bg-panel"
                      onClick={() => setSelectedVar(v)}
                    >
                      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{v.id}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{v.project}</td>
                      <td className="px-4 py-2.5 max-w-[200px]"><p className="truncate font-medium">{v.title}</p></td>
                      <td className="px-4 py-2.5 text-xs">{v.requestedBy}</td>
                      <td className={`px-4 py-2.5 font-mono text-xs font-semibold tabular-nums ${v.amount < 0 ? "text-critical" : "text-foreground"}`}>{fmtVar(v.amount)}</td>
                      <td className="px-4 py-2.5"><StatusBadge h={varStatusH(v.status)}>{v.status}</StatusBadge></td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{v.date}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{v.approver ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Detail side panel */}
        <div>
          {selectedVar ? (
            <Card className="p-4">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground">{selectedVar.id}</span>
                  <p className="mt-0.5 font-display text-sm font-bold leading-snug">{selectedVar.title}</p>
                </div>
                <button onClick={() => setSelectedVar(null)} className="shrink-0 rounded p-1 text-muted-foreground hover:bg-panel hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ["Project", selectedVar.project],
                  ["Requested By", selectedVar.requestedBy],
                  ["Date", selectedVar.date],
                  ["Approver", selectedVar.approver ?? "Pending assignment"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-semibold text-foreground text-right max-w-[160px]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className={`font-mono font-bold tabular-nums ${selectedVar.amount < 0 ? "text-critical" : "text-foreground"}`}>{fmtVar(selectedVar.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge h={varStatusH(selectedVar.status)}>{selectedVar.status}</StatusBadge>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <EmptyState icon={GitBranch} title="Select a variation" subtitle="Click any row to see full details here." />
            </Card>
          )}
        </div>
      </div>

      {/* Raise Variation Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[var(--radius)] border border-border bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold">Raise Variation Order</h2>
              <button onClick={() => setShowForm(false)} className="rounded p-1 text-muted-foreground hover:bg-panel"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Project *</label>
                <select className="w-full rounded border border-border bg-panel px-3 py-2 text-sm">
                  {projects.map((p) => <option key={p.code}>{p.code}: {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Variation Description *</label>
                <textarea className="w-full rounded border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-primary" rows={3} placeholder="Describe the variation scope change…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Amount (NGN) *</label>
                  <input type="number" className="w-full rounded border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-primary" placeholder="0" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Requested By</label>
                  <input className="w-full rounded border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Name / role" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Supporting Document</label>
                <div className="flex items-center gap-2 rounded border border-dashed border-border bg-panel px-3 py-3 text-xs text-muted-foreground">
                  <Upload className="h-4 w-4" /> Click to attach supporting document
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground">Cancel</button>
              <button onClick={() => setShowForm(false)} className="rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Submit Variation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── PAYMENT CERTS ─────────────────────────── */

const certData = [
  { id: "PC-2026-01", project: "PRJ-USV-2026-0015", contractor: "Zenith Builders Ltd", amount: 45000000, cumulative: 180000000, retention: 4500000, status: "Paid", certDate: "2026-06-30", payDate: "2026-07-15" },
  { id: "PC-2026-02", project: "PRJ-USV-2026-0015", contractor: "Zenith Builders Ltd", amount: 38000000, cumulative: 218000000, retention: 3800000, status: "Paid", certDate: "2026-07-31", payDate: "2026-08-12" },
  { id: "PC-2026-03", project: "PRJ-USV-2026-0015", contractor: "Zenith Builders Ltd", amount: 52000000, cumulative: 270000000, retention: 5200000, status: "Approved", certDate: "2026-08-31", payDate: null },
  { id: "PC-2026-04", project: "PRJ-USV-2026-0015", contractor: "Zenith Builders Ltd", amount: 47000000, cumulative: 317000000, retention: 4700000, status: "Submitted", certDate: "2026-09-05", payDate: null },
  { id: "PC-2026-05", project: "PRJ-USV-2026-0012", contractor: "Delta Structures", amount: 28500000, cumulative: 85500000, retention: 2850000, status: "Paid", certDate: "2026-07-31", payDate: "2026-08-20" },
];

const CERT_PIPELINE = ["Submitted", "QS Review", "PM Sign-off", "Finance Approval", "Paid"] as const;

export function PaymentCerts({ nav }: { nav: (s: string, code?: string) => void }) {
  const { show } = useToast();
  const [selectedCert, setSelectedCert] = useState<typeof certData[0] | null>(null);

  const certStatusH = (s: string): Health =>
    s === "Paid" ? "healthy" : s === "Approved" ? "attention" : "attention";

  const pipelineStages = CERT_PIPELINE.map((stage) => ({
    stage,
    count:
      stage === "Submitted" ? certData.filter((c) => c.status === "Submitted").length
      : stage === "Finance Approval" ? certData.filter((c) => c.status === "Approved").length
      : stage === "Paid" ? certData.filter((c) => c.status === "Paid").length
      : 0,
  }));

  return (
    <div className="animate-in">
      <ScreenHeader title="Payment Certificate Workflow" desc="Track payment certificates from submission through QS, PM, and Finance approval to payment disbursement.">
        <button className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
          <FileBadge className="h-3.5 w-3.5" /> Submit New Certificate
        </button>
      </ScreenHeader>

      {/* Pipeline status bar */}
      <Card className="mb-4 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Workflow Pipeline</p>
        <div className="flex flex-wrap items-start gap-0">
          {pipelineStages.map((s, i) => (
            <div key={s.stage} className="flex items-center">
              <div className={`flex flex-col items-center rounded px-3 py-2 ${s.count > 0 ? "bg-primary/8" : "bg-panel"}`}>
                <span className={`font-display text-lg font-bold tabular-nums ${s.count > 0 ? "text-primary" : "text-muted-foreground"}`}>{s.count}</span>
                <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground whitespace-nowrap">{s.stage}</span>
              </div>
              {i < pipelineStages.length - 1 && <ArrowRight className="h-4 w-4 mx-1 text-border-strong shrink-0 mt-1" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Certs table */}
      <Card>
        <SectionHead title="Certificate Register" hint={`${certData.length} certificates · ${certData.filter((c) => c.status === "Paid").length} paid · click any row for detail`} />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-panel">
                {["Cert ID", "Project", "Contractor", "Cert Amount", "Cumulative", "Retention Held", "Status", "Cert Date", "Pay Date", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certData.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCert(c)}
                  className="group cursor-pointer border-b border-border last:border-0 transition hover:bg-panel"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-primary group-hover:underline">{c.id}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.project}</td>
                  <td className="px-4 py-3 text-xs font-medium">{c.contractor}</td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold tabular-nums">{naira(c.amount)}</td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground">{naira(c.cumulative)}</td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-attention">{naira(c.retention)}</td>
                  <td className="px-4 py-3"><StatusBadge h={certStatusH(c.status)}>{c.status}</StatusBadge></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.certDate}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.payDate ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground opacity-0 transition group-hover:opacity-100">
                      View →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Certificate Detail Slide-out Panel */}
      {selectedCert && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelectedCert(null)} />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl animate-slidein-right">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="font-mono text-[11px] text-muted-foreground">{selectedCert.id}</p>
                <h2 className="font-display text-[16px] font-bold text-foreground">Payment Certificate</h2>
              </div>
              <button onClick={() => setSelectedCert(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Status */}
              <div className="flex items-center gap-2">
                <StatusBadge h={certStatusH(selectedCert.status)}>{selectedCert.status}</StatusBadge>
                {selectedCert.status === "Paid" && (
                  <span className="text-[11px] text-muted-foreground">Payment released {selectedCert.payDate}</span>
                )}
              </div>

              {/* Parties */}
              <div className="rounded-[var(--radius)] bg-panel px-4 py-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">Parties</p>
                <div className="flex justify-between text-[12px]">
                  <span className="text-muted-foreground">Contractor</span>
                  <span className="font-semibold text-foreground">{selectedCert.contractor}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-muted-foreground">Project Ref</span>
                  <span className="font-mono text-[11px] text-foreground">{selectedCert.project}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-muted-foreground">Certificate Date</span>
                  <span className="font-mono text-[11px]">{selectedCert.certDate}</span>
                </div>
              </div>

              {/* Financial breakdown */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Financial Breakdown</p>
                <div className="space-y-2 rounded-[var(--radius)] border border-border bg-card overflow-hidden">
                  {[
                    { label: "Gross Certificate Amount", value: naira(selectedCert.amount), bold: false },
                    { label: `Retention Deducted (${Math.round(selectedCert.retention / selectedCert.amount * 100)}%)`, value: `−${naira(selectedCert.retention)}`, bold: false, neg: true },
                    { label: "VAT (7.5%)", value: naira(Math.round(selectedCert.amount * 0.075)), bold: false },
                    { label: "Net Payable to Contractor", value: naira(selectedCert.amount - selectedCert.retention), bold: true },
                  ].map((row, i, arr) => (
                    <div key={row.label} className={`flex items-center justify-between px-4 py-2.5 ${i === arr.length - 1 ? "border-t border-border bg-panel" : ""}`}>
                      <span className={`text-[12px] ${row.bold ? "font-bold text-foreground" : "text-muted-foreground"}`}>{row.label}</span>
                      <span className={`font-mono text-[12px] font-semibold tabular-nums ${row.neg ? "text-critical" : row.bold ? "text-foreground" : ""}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between px-1 text-[11px] text-muted-foreground">
                  <span>Cumulative to date</span>
                  <span className="font-mono font-semibold">{naira(selectedCert.cumulative)}</span>
                </div>
              </div>

              {/* Approval workflow */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Approval Workflow</p>
                <div className="space-y-1">
                  {CERT_PIPELINE.map((stage) => {
                    const stageOrder = CERT_PIPELINE.indexOf(stage);
                    const currentOrder = selectedCert.status === "Paid" ? CERT_PIPELINE.length
                      : selectedCert.status === "Approved" ? CERT_PIPELINE.indexOf("Finance Approval")
                      : CERT_PIPELINE.indexOf("Submitted");
                    const done = stageOrder < currentOrder;
                    const active = stageOrder === currentOrder;
                    return (
                      <div key={stage} className={`flex items-center gap-3 rounded-[6px] px-3 py-2 ${active ? "bg-primary/8" : done ? "bg-healthy-bg/50" : "bg-panel"}`}>
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${done ? "bg-healthy text-white" : active ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"}`}>
                          {done ? "✓" : stageOrder + 1}
                        </div>
                        <span className={`text-[12px] font-medium ${active ? "text-primary" : done ? "text-healthy" : "text-muted-foreground"}`}>{stage}</span>
                        {active && <span className="ml-auto text-[10px] font-semibold text-primary">Current</span>}
                        {done && <span className="ml-auto text-[10px] text-healthy">Done</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment details */}
              {selectedCert.status === "Paid" && selectedCert.payDate && (
                <div className="rounded-[var(--radius)] bg-healthy-bg/40 border border-healthy/20 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-healthy">Payment Confirmed</p>
                  <div className="space-y-1.5 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Date</span>
                      <span className="font-mono font-semibold">{selectedCert.payDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Disbursed By</span>
                      <span className="font-semibold">Finance, Mrs. Maryam Kabiru Suleiman</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Reference</span>
                      <span className="font-mono">TRF-{selectedCert.id}-2026</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-border px-5 py-4 flex gap-2">
              <button
                onClick={() => show(`Downloading ${selectedCert.id}.pdf…`, "info")}
                className="flex-1 rounded border border-border py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition"
              >
                Download PDF
              </button>
              {selectedCert.status !== "Paid" && (
                <button
                  onClick={() => { show(`${selectedCert.id} action recorded`, "success"); setSelectedCert(null); }}
                  className="flex-1 rounded bg-primary py-2 text-[12px] font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  {selectedCert.status === "Submitted" ? "Approve Certificate" : "Release Payment"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── CLIENT PORTAL ─────────────────────────── */

const clientPortalClients = [
  {
    name: "Lekki Development Authority",
    projects: [{ code: "PRJ-USV-2026-0015", name: "Abuja Housing Development: Phase II", progress: 48, status: "attention" as Health }],
    payments: [
      { cert: "PC-2026-03", amount: 52000000, status: "Approved, awaiting payment" },
      { cert: "PC-2026-04", amount: 47000000, status: "Submitted for review" },
    ],
    documents: ["Ground Floor GA: Rev C", "BOQ Revision 04", "Site Progress Report Aug-2026"],
  },
  {
    name: "Abuja Metropolitan Board",
    projects: [{ code: "PRJ-USV-2026-0018", name: "Government Office Complex", progress: 62, status: "healthy" as Health }],
    payments: [{ cert: "PC-2026-01", amount: 45000000, status: "Paid, 15 Jul 2026" }],
    documents: ["Structural Drawings Rev 02", "Approved BOQ Summary"],
  },
  {
    name: "Enugu State MDA",
    projects: [{ code: "PRJ-CAN-2026-0012", name: "Enugu Medical Centre", progress: 35, status: "healthy" as Health }],
    payments: [],
    documents: ["Preliminary Design Report", "Site Survey: 2nd Visit"],
  },
];

export function ClientPortal({ nav }: { nav: (s: string, code?: string) => void }) {
  const [selectedClient, setSelectedClient] = useState(clientPortalClients[0].name);
  const client = clientPortalClients.find((c) => c.name === selectedClient) ?? clientPortalClients[0];

  return (
    <div className="animate-in">
      {/* Banner */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-teal-600/20 bg-teal-600/5 px-5 py-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600/10">
          <Globe className="h-5 w-5 text-teal-600" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-teal-700">Client Portal: External View</p>
          <p className="text-xs text-teal-700/70">Shared project visibility for authorised client representatives. Data is curated for external consumption.</p>
        </div>
        <span className="rounded-full border border-teal-600/20 bg-teal-600/8 px-3 py-1 font-mono text-[10px] font-bold text-teal-700">READ ONLY</span>
      </div>

      {/* Client selector */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground">Select Client:</label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="rounded border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
        >
          {clientPortalClients.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Active projects + payments */}
        <div className="space-y-4 lg:col-span-2">
          <div>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Active Projects</h2>
            {client.projects.map((p) => (
              <div key={p.code} className="rounded-[var(--radius)] border-2 border-teal-600/20 bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                    <p className="mt-0.5 font-display text-sm font-bold">{p.name}</p>
                  </div>
                  <StatusBadge h={p.status}>{p.status === "healthy" ? "On Track" : "Needs Attention"}</StatusBadge>
                </div>
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Overall Progress</span>
                    <span className="font-mono font-semibold text-foreground">{p.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => nav("project", p.code)}
                  className="inline-flex items-center gap-1.5 rounded border border-teal-600/20 bg-teal-600/5 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-600/10"
                >
                  Share Document <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Recent Payment Summaries</h2>
            {client.payments.length === 0 ? (
              <div className="rounded-[var(--radius)] border-2 border-dashed border-teal-600/20 p-6 text-center text-xs text-muted-foreground">No payment records for this client yet.</div>
            ) : (
              <div className="space-y-2">
                {client.payments.map((pay) => (
                  <div key={pay.cert} className="rounded-[var(--radius)] border-2 border-teal-600/20 bg-card p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-muted-foreground">{pay.cert}</span>
                      <span className="font-mono text-sm font-bold tabular-nums">{naira(pay.amount)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{pay.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents shared */}
        <div>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Documents Shared</h2>
          <div className="rounded-[var(--radius)] border-2 border-teal-600/20 bg-card">
            {client.documents.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">No documents shared yet.</div>
            ) : (
              <ul className="divide-y divide-teal-600/10">
                {client.documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-3">
                    <FileText className="h-4 w-4 shrink-0 text-teal-600/60" strokeWidth={1.6} />
                    <span className="flex-1 text-xs font-medium text-foreground">{doc}</span>
                    <button className="text-[10px] font-semibold text-teal-700 hover:underline">View</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t-2 border-teal-600/10 px-4 py-3">
              <button className="w-full rounded border border-teal-600/20 bg-teal-600/5 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-600/10">
                + Share Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  ICT & Systems Screen                                           */
/* ─────────────────────────────────────────────────────────────── */
type ICTQAModal = "reset-password" | "new-user" | "new-ticket" | "log-asset" | "assign-asset" | "decommission" | null;

export function ICTScreen({ persona }: { persona: UserPersona }) {
  const { show } = useToast();
  const [tab, setTab] = useState<"actions" | "assets" | "tickets" | "access">("actions");
  const [assetPage, setAssetPage] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketFilter, setTicketFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all");
  const [qaModal, setQaModal] = useState<ICTQAModal>(null);
  const [localAccessRequests, setLocalAccessRequests] = useState([
    { id: "ACC-001", requestor: "Mr. Wale Okonjo",        type: "NEXUS ERP Access",          date: "07 Sep 2026", status: "pending",      note: "New project officer, full project module access" },
    { id: "ACC-002", requestor: "Miss Ramatu Yusuf Waziri",          type: "VPN Access: Kaduna Site",   date: "06 Sep 2026", status: "in-progress",  note: "Site officer requires remote access" },
    { id: "ACC-003", requestor: "Engr. Jamilu Umar Sani",   type: "Power BI Dashboard",         date: "05 Sep 2026", status: "provisioned",  note: "Provisioned: read-only project analytics" },
    { id: "ACC-004", requestor: "Mrs. Yetunde Adesanya",  type: "Document Control System",    date: "04 Sep 2026", status: "provisioned",  note: "Doc control access granted" },
  ]);

  // Reset Password modal state
  const [pwSearch, setPwSearch] = useState("");
  const [pwSelected, setPwSelected] = useState<string[]>([]);
  const [pwSent, setPwSent] = useState(false);

  // New User modal state
  const [nuForm, setNuForm] = useState({ name: "", email: "", role: "", department: "", company: "USV", access: "" });
  const [nuDone, setNuDone] = useState(false);

  // New Ticket modal state
  const [ntForm, setNtForm] = useState({ title: "", reporter: "", type: "Hardware", priority: "normal", desc: "" });
  const [ntDone, setNtDone] = useState(false);

  // Log Asset modal state
  const [laForm, setLaForm] = useState({ name: "", type: "Laptop", brand: "", serial: "", assignedTo: "", dept: "", value: "" });
  const [laDone, setLaDone] = useState(false);

  // Assign Asset modal state
  const [aaAssetSearch, setAaAssetSearch] = useState("");
  const [aaStaffSearch, setAaStaffSearch] = useState("");
  const [aaAsset, setAaAsset] = useState("");
  const [aaStaff, setAaStaff] = useState("");
  const [aaDone, setAaDone] = useState(false);

  // Decommission modal state
  const [dcSearch, setDcSearch] = useState("");
  const [dcSelected, setDcSelected] = useState("");
  const [dcReason, setDcReason] = useState("");
  const [dcDone, setDcDone] = useState(false);

  const ASSET_PAGE_SIZE = 10;
  const TICKET_PAGE_SIZE = 10;

  const assetStats = {
    total: ictAssets.length,
    active: ictAssets.filter((a) => a.status === "active").length,
    faulty: ictAssets.filter((a) => a.status === "faulty").length,
    inRepair: ictAssets.filter((a) => a.status === "in-repair").length,
  };

  const isWarrantyAlert = (w: string) => {
    const year = parseInt(w.split(" ").pop() ?? "9999");
    return year <= 2025;
  };

  const filteredTickets = ticketFilter === "all" ? ictTickets : ictTickets.filter((t) => t.status === ticketFilter);

  const ticketStats = {
    open: ictTickets.filter((t) => t.status === "open").length,
    inProgress: ictTickets.filter((t) => t.status === "in-progress").length,
    resolved: ictTickets.filter((t) => t.status === "resolved").length,
  };

  const paginatedAssets = ictAssets.slice((assetPage - 1) * ASSET_PAGE_SIZE, assetPage * ASSET_PAGE_SIZE);
  const paginatedTickets = filteredTickets.slice((ticketPage - 1) * TICKET_PAGE_SIZE, ticketPage * TICKET_PAGE_SIZE);

  const assetStatusH = (s: string): Health => s === "faulty" || s === "decommissioned" ? "critical" : s === "in-repair" ? "attention" : "healthy";
  const ticketPriority = (p: string): "Urgent" | "High" | "Normal" => p === "urgent" ? "Urgent" : p === "high" ? "High" : "Normal";
  const ticketStatusH = (s: string): Health => s === "open" ? "critical" : s === "in-progress" ? "attention" : "healthy";
  const accStatusH = (s: string): Health => s === "provisioned" ? "healthy" : "attention";

  const filteredStaff = staffMembers.filter((s) =>
    pwSearch.trim() === "" ? false :
      s.name.toLowerCase().includes(pwSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(pwSearch.toLowerCase())
  );

  const filteredAssets = ictAssets.filter((a) =>
    aaAssetSearch.trim() === "" ? false :
      a.name.toLowerCase().includes(aaAssetSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(aaAssetSearch.toLowerCase())
  );

  const filteredStaffAA = staffMembers.filter((s) =>
    aaStaffSearch.trim() === "" ? false :
      s.name.toLowerCase().includes(aaStaffSearch.toLowerCase())
  );

  const filteredDcAssets = ictAssets.filter((a) =>
    dcSearch.trim() === "" ? false :
      a.name.toLowerCase().includes(dcSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(dcSearch.toLowerCase())
  );

  const closeModal = () => {
    setQaModal(null);
    setPwSearch(""); setPwSelected([]); setPwSent(false);
    setNuForm({ name: "", email: "", role: "", department: "", company: "USV", access: "" }); setNuDone(false);
    setNtForm({ title: "", reporter: "", type: "Hardware", priority: "normal", desc: "" }); setNtDone(false);
    setLaForm({ name: "", type: "Laptop", brand: "", serial: "", assignedTo: "", dept: "", value: "" }); setLaDone(false);
    setAaAssetSearch(""); setAaStaffSearch(""); setAaAsset(""); setAaStaff(""); setAaDone(false);
    setDcSearch(""); setDcSelected(""); setDcReason(""); setDcDone(false);
  };

  const quickActions = [
    { id: "reset-password" as ICTQAModal, label: "Reset Password", icon: KeyRound, desc: "Send password reset link to one or more staff members", color: "text-info bg-info-bg" },
    { id: "new-user" as ICTQAModal, label: "New User Provisioning", icon: UserPlus, desc: "Create a new NEXUS ERP user account and assign access level", color: "text-primary bg-primary/8" },
    { id: "new-ticket" as ICTQAModal, label: "Log New Ticket", icon: ClipboardList, desc: "Create a helpdesk support ticket for hardware, software or access issues", color: "text-attention bg-attention-bg" },
    { id: "log-asset" as ICTQAModal, label: "Log Asset", icon: Laptop, desc: "Register a new hardware or software asset in the ICT register", color: "text-healthy bg-healthy-bg" },
    { id: "assign-asset" as ICTQAModal, label: "Assign Asset", icon: UserCheck, desc: "Reassign an existing asset to a different staff member", color: "text-accent bg-accent/8" },
    { id: "decommission" as ICTQAModal, label: "Decommission Asset", icon: Trash2, desc: "Mark an asset for decommission with reason and confirmation", color: "text-critical bg-critical-bg" },
  ];

  return (
    <div className="animate-in">
      <ScreenHeader title="ICT &amp; Systems" desc="Quick actions, asset register, helpdesk tickets, and access provisioning for NEXUS infrastructure." />

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-[var(--radius)] border border-border bg-panel p-1 w-fit">
        {(["actions", "assets", "tickets", "access"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded px-4 py-1.5 text-xs font-semibold transition ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "actions" ? "Quick Actions" : t === "assets" ? "Assets" : t === "tickets" ? "Tickets" : "Access Requests"}
          </button>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      {tab === "actions" && (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((qa) => (
              <button
                key={qa.id}
                onClick={() => setQaModal(qa.id)}
                className="group flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-5 text-left transition hover:border-primary/30 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${qa.color}`}>
                  <qa.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition">{qa.label}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{qa.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>

          {/* ── Recent ICT activity digest ── */}
          <div className="mt-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Recent Activity</p>
            <div className="space-y-2">
              {ictTickets.slice(0, 4).map((t) => (
                <Card key={t.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.status === "resolved" ? "bg-healthy" : t.status === "in-progress" ? "bg-attention" : "bg-critical"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground">{t.reporter} · {t.opened}</p>
                    </div>
                    <StatusBadge h={ticketStatusH(t.status)}>{t.status}</StatusBadge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Assets ── */}
      {tab === "assets" && (
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
            {[
              { label: "Total Assets",  value: assetStats.total,    tone: "healthy"    as Health },
              { label: "Active",        value: assetStats.active,   tone: "healthy"    as Health },
              { label: "Faulty",        value: assetStats.faulty,   tone: "critical"   as Health },
              { label: "In Repair",     value: assetStats.inRepair, tone: "attention"  as Health },
            ].map(({ label, value, tone }) => (
              <Card key={label} className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">{label}</p>
                <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${tone === "critical" ? "text-critical" : tone === "attention" ? "text-attention" : "text-foreground"}`}>
                  {value}
                </p>
              </Card>
            ))}
          </div>
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => exportCSV("ict-assets.csv", ictAssets.map((a) => ({
                ID: a.id, Name: a.name, Type: a.type, AssignedTo: a.assignedTo,
                Department: a.department, Company: a.company, Status: a.status,
                WarrantyExpiry: a.warrantyExpiry, PurchaseValue: a.purchaseValue,
              })))}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
          <div className="space-y-2">
            {paginatedAssets.map((asset) => {
              const warrantyAlert = isWarrantyAlert(asset.warrantyExpiry);
              return (
                <Card key={asset.id} className="p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground w-20 shrink-0">{asset.id}</span>
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-sm font-semibold text-foreground">{asset.name}</p>
                      <p className="text-[10px] text-muted-foreground">{asset.assignedTo} · {asset.department}</p>
                    </div>
                    <Chip tone="info">{asset.type}</Chip>
                    <CompanyTag company={asset.company} />
                    <StatusBadge h={assetStatusH(asset.status)}>{asset.status}</StatusBadge>
                    <span className={`font-mono text-[10px] font-semibold shrink-0 ${warrantyAlert ? "text-critical" : "text-muted-foreground"}`}>
                      Warranty: {asset.warrantyExpiry}{warrantyAlert ? " ⚠" : ""}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
          {ictAssets.length > ASSET_PAGE_SIZE && (
            <Pagination page={assetPage} total={ictAssets.length} pageSize={ASSET_PAGE_SIZE} onChange={setAssetPage} />
          )}
        </div>
      )}

      {/* ── Tickets ── */}
      {tab === "tickets" && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Open",        value: ticketStats.open,       tone: "critical"  as Health },
              { label: "In Progress", value: ticketStats.inProgress, tone: "attention" as Health },
              { label: "Resolved",    value: ticketStats.resolved,   tone: "healthy"   as Health },
            ].map(({ label, value, tone }) => (
              <Card key={label} className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">{label}</p>
                <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${tone === "critical" ? "text-critical" : tone === "attention" ? "text-attention" : "text-healthy"}`}>
                  {value}
                </p>
              </Card>
            ))}
          </div>
          <div className="mb-4 flex flex-wrap gap-1">
            {(["all", "open", "in-progress", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setTicketFilter(f); setTicketPage(1); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${ticketFilter === f ? "border-primary/30 bg-primary/8 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
          {paginatedTickets.length === 0 && (
            <EmptyState icon={ClipboardList} title="No tickets found" subtitle="Try a different status filter." />
          )}
          <div className="space-y-2">
            {paginatedTickets.map((t) => (
              <Card key={t.id} className="p-3">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0 w-28">{t.id}</span>
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-sm font-semibold text-foreground">{t.title}</p>
                    <p className="text-[10px] text-muted-foreground">{t.reporter} · Opened {t.opened}</p>
                    {t.assignedTo && <p className="text-[10px] text-muted-foreground">Assigned: {t.assignedTo}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Chip tone="info">{t.type}</Chip>
                    <PriorityDot p={ticketPriority(t.priority)} />
                    <StatusBadge h={ticketStatusH(t.status)}>{t.status}</StatusBadge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {filteredTickets.length > TICKET_PAGE_SIZE && (
            <Pagination page={ticketPage} total={filteredTickets.length} pageSize={TICKET_PAGE_SIZE} onChange={setTicketPage} />
          )}
        </div>
      )}

      {/* ── Access Requests ── */}
      {tab === "access" && (
        <div className="space-y-2">
          {localAccessRequests.map((req) => (
            <Card key={req.id} className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{req.id}</span>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm font-semibold text-foreground">{req.requestor}</p>
                  <p className="text-[10px] text-muted-foreground">{req.type} · {req.date}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground italic">{req.note}</p>
                </div>
                <StatusBadge h={accStatusH(req.status)}>
                  {req.status === "pending" ? "Pending" : req.status === "in-progress" ? "In Progress" : "Provisioned"}
                </StatusBadge>
                {req.status !== "provisioned" ? (
                  <button
                    onClick={() => {
                      setLocalAccessRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "provisioned" } : r));
                      show(`Access provisioned for ${req.requestor}`);
                    }}
                    className="rounded bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                    {req.status === "pending" ? "Provision" : "Complete"}
                  </button>
                ) : (
                  <button
                    onClick={() => show(`Access log for ${req.requestor}: ${req.note}`)}
                    className="rounded border border-border px-3 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition"
                  >
                    View
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ════════════ QUICK ACTION MODALS ════════════ */}
      {qaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg rounded-[var(--radius)] border border-border bg-card shadow-2xl animate-scalein"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                {quickActions.find((q) => q.id === qaModal) && (() => {
                  const qa = quickActions.find((q) => q.id === qaModal)!;
                  return (
                    <>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-[6px] ${qa.color}`}>
                        <qa.icon className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <p className="font-display text-[15px] font-bold">{qa.label}</p>
                    </>
                  );
                })()}
              </div>
              <button onClick={closeModal} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Reset Password ── */}
            {qaModal === "reset-password" && (
              <div className="p-5">
                {!pwSent ? (
                  <>
                    <p className="mb-3 text-sm text-muted-foreground">Search by name or email address. Select one or more staff to send a password reset link.</p>
                    <div className="relative mb-3">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={pwSearch}
                        onChange={(e) => setPwSearch(e.target.value)}
                        placeholder="Search staff by name or email…"
                        className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    {filteredStaff.length > 0 && (
                      <div className="mb-3 max-h-48 overflow-y-auto rounded border border-border divide-y divide-border">
                        {filteredStaff.map((s) => (
                          <label key={s.id} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/50">
                            <input
                              type="checkbox"
                              checked={pwSelected.includes(s.id)}
                              onChange={(e) => setPwSelected((prev) => e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id))}
                              className="h-3.5 w-3.5 accent-primary"
                            />
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                              {s.initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground">{s.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{s.email} · {s.department}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {pwSelected.length > 0 && (
                      <div className="mb-3 rounded bg-info-bg px-3 py-2 text-[11px] text-info font-medium">
                        {pwSelected.length} staff selected for password reset
                      </div>
                    )}
                    <button
                      onClick={() => { if (pwSelected.length > 0) setPwSent(true); }}
                      disabled={pwSelected.length === 0}
                      className="w-full rounded bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                    >
                      Send Reset Email{pwSelected.length > 0 ? ` (${pwSelected.length})` : ""}
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-healthy-bg">
                      <CheckCircle2 className="h-6 w-6 text-healthy" />
                    </div>
                    <p className="font-display font-bold text-foreground">Reset emails sent!</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Password reset links have been sent to {pwSelected.length} staff member{pwSelected.length !== 1 ? "s" : ""}.
                    </p>
                    <button onClick={closeModal} className="mt-4 rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition">Done</button>
                  </div>
                )}
              </div>
            )}

            {/* ── New User Provisioning ── */}
            {qaModal === "new-user" && (
              <div className="p-5">
                {!nuDone ? (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">Fill in the new staff details and assign their NEXUS access level.</p>
                    <div className="space-y-3">
                      {([
                        { label: "Full Name", key: "name", placeholder: "e.g. Mr. Tunde Adesola" },
                        { label: "Work Email", key: "email", placeholder: "e.g. t.adesola@nexus-erp.com" },
                        { label: "Job Title / Role", key: "role", placeholder: "e.g. Site Engineer" },
                        { label: "Department", key: "department", placeholder: "e.g. Project Management" },
                        { label: "NEXUS Access Level", key: "access", placeholder: "e.g. Site Module, Documents, MyHR" },
                      ] as { label: string; key: keyof typeof nuForm; placeholder: string }[]).map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                          <input
                            value={nuForm[key]}
                            onChange={(e) => setNuForm((f) => ({ ...f, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Company</label>
                        <select
                          value={nuForm.company}
                          onChange={(e) => setNuForm((f) => ({ ...f, company: e.target.value }))}
                          className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                        >
                          <option>USV</option><option>CANONIC</option><option>USV + CANONIC</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => { if (nuForm.name && nuForm.email) setNuDone(true); }}
                      disabled={!nuForm.name || !nuForm.email}
                      className="mt-4 w-full rounded bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                    >
                      Create User Account
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-healthy-bg">
                      <CheckCircle2 className="h-6 w-6 text-healthy" />
                    </div>
                    <p className="font-display font-bold">Account Created</p>
                    <p className="mt-1 text-sm text-muted-foreground">{nuForm.name} has been provisioned in NEXUS. A welcome email with login credentials has been sent to {nuForm.email}.</p>
                    <button onClick={closeModal} className="mt-4 rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition">Done</button>
                  </div>
                )}
              </div>
            )}

            {/* ── New Ticket ── */}
            {qaModal === "new-ticket" && (
              <div className="p-5">
                {!ntDone ? (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">Log a helpdesk support ticket for any hardware, software or access issue.</p>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Issue Title</label>
                        <input value={ntForm.title} onChange={(e) => setNtForm((f) => ({ ...f, title: e.target.value }))} placeholder="Brief title of the issue" className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Reported By</label>
                        <input value={ntForm.reporter} onChange={(e) => setNtForm((f) => ({ ...f, reporter: e.target.value }))} placeholder="Staff name" className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
                          <select value={ntForm.type} onChange={(e) => setNtForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                            {["Hardware","Software","Access","Email","Network","Other"].map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Priority</label>
                          <select value={ntForm.priority} onChange={(e) => setNtForm((f) => ({ ...f, priority: e.target.value }))} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                            <option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Description</label>
                        <textarea value={ntForm.desc} onChange={(e) => setNtForm((f) => ({ ...f, desc: e.target.value }))} placeholder="Describe the issue in detail…" rows={3} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none" />
                      </div>
                    </div>
                    <button
                      onClick={() => { if (ntForm.title && ntForm.reporter) setNtDone(true); }}
                      disabled={!ntForm.title || !ntForm.reporter}
                      className="mt-4 w-full rounded bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                    >
                      Submit Ticket
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-healthy-bg"><CheckCircle2 className="h-6 w-6 text-healthy" /></div>
                    <p className="font-display font-bold">Ticket Logged</p>
                    <p className="mt-1 text-sm text-muted-foreground">Ticket TKT-2026-{Math.floor(Math.random() * 900 + 100)} created for "{ntForm.title}". {ntForm.reporter} will be notified of updates.</p>
                    <button onClick={closeModal} className="mt-4 rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition">Done</button>
                  </div>
                )}
              </div>
            )}

            {/* ── Log Asset ── */}
            {qaModal === "log-asset" && (
              <div className="p-5">
                {!laDone ? (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">Register a new hardware or software asset in the ICT asset register.</p>
                    <div className="space-y-3">
                      {([
                        { label: "Asset Name", key: "name", placeholder: "e.g. Laptop: HP EliteBook 840" },
                        { label: "Brand / Manufacturer", key: "brand", placeholder: "e.g. HP, Dell, Cisco" },
                        { label: "Serial Number", key: "serial", placeholder: "e.g. SN-HP-00234" },
                        { label: "Assigned To (Staff)", key: "assignedTo", placeholder: "e.g. Engr. Musa Usman Lawan" },
                        { label: "Department", key: "dept", placeholder: "e.g. Project Management" },
                        { label: "Purchase Value (₦)", key: "value", placeholder: "e.g. 850000" },
                      ] as { label: string; key: keyof typeof laForm; placeholder: string }[]).map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                          <input value={laForm[key]} onChange={(e) => setLaForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                        </div>
                      ))}
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Asset Type</label>
                        <select value={laForm.type} onChange={(e) => setLaForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                          {["Laptop","Desktop","Printer","Switch","Server","UPS","Monitor","Other"].map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => { if (laForm.name && laForm.serial) setLaDone(true); }}
                      disabled={!laForm.name || !laForm.serial}
                      className="mt-4 w-full rounded bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                    >
                      Register Asset
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-healthy-bg"><CheckCircle2 className="h-6 w-6 text-healthy" /></div>
                    <p className="font-display font-bold">Asset Registered</p>
                    <p className="mt-1 text-sm text-muted-foreground">"{laForm.name}" (S/N: {laForm.serial}) has been added to the ICT asset register.</p>
                    <button onClick={closeModal} className="mt-4 rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition">Done</button>
                  </div>
                )}
              </div>
            )}

            {/* ── Assign Asset ── */}
            {qaModal === "assign-asset" && (
              <div className="p-5">
                {!aaDone ? (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">Search for an asset and the staff member to reassign it to.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Asset</label>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <input value={aaAssetSearch} onChange={(e) => { setAaAssetSearch(e.target.value); setAaAsset(""); }} placeholder="Search by asset name or ID…" className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none" />
                        </div>
                        {filteredAssets.length > 0 && !aaAsset && (
                          <div className="mt-1 max-h-36 overflow-y-auto rounded border border-border divide-y divide-border">
                            {filteredAssets.map((a) => (
                              <button key={a.id} onClick={() => { setAaAsset(a.id); setAaAssetSearch(a.name); }} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50">
                                <span className="font-mono text-[10px] text-muted-foreground w-20 shrink-0">{a.id}</span>
                                <span className="text-xs font-medium text-foreground">{a.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {aaAsset && <p className="mt-1 text-[10px] text-healthy font-semibold">✓ Selected: {aaAssetSearch}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Assign To (Staff)</label>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <input value={aaStaffSearch} onChange={(e) => { setAaStaffSearch(e.target.value); setAaStaff(""); }} placeholder="Search staff by name…" className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none" />
                        </div>
                        {filteredStaffAA.length > 0 && !aaStaff && (
                          <div className="mt-1 max-h-36 overflow-y-auto rounded border border-border divide-y divide-border">
                            {filteredStaffAA.map((s) => (
                              <button key={s.id} onClick={() => { setAaStaff(s.id); setAaStaffSearch(s.name); }} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/50">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold">{s.initials}</div>
                                <div>
                                  <p className="text-xs font-medium text-foreground">{s.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{s.department}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {aaStaff && <p className="mt-1 text-[10px] text-healthy font-semibold">✓ Selected: {aaStaffSearch}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => { if (aaAsset && aaStaff) setAaDone(true); }}
                      disabled={!aaAsset || !aaStaff}
                      className="mt-4 w-full rounded bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                    >
                      Confirm Assignment
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-healthy-bg"><CheckCircle2 className="h-6 w-6 text-healthy" /></div>
                    <p className="font-display font-bold">Asset Assigned</p>
                    <p className="mt-1 text-sm text-muted-foreground">{aaAssetSearch} has been reassigned to {aaStaffSearch}. The asset register has been updated.</p>
                    <button onClick={closeModal} className="mt-4 rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition">Done</button>
                  </div>
                )}
              </div>
            )}

            {/* ── Decommission Asset ── */}
            {qaModal === "decommission" && (
              <div className="p-5">
                {!dcDone ? (
                  <>
                    <div className="mb-4 rounded bg-critical-bg px-3 py-2 text-[11px] font-medium text-critical">
                      This action is irreversible. The asset will be marked as decommissioned.
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Select Asset</label>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <input value={dcSearch} onChange={(e) => { setDcSearch(e.target.value); setDcSelected(""); }} placeholder="Search by asset name or ID…" className="w-full rounded border border-border bg-panel py-2 pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none" />
                        </div>
                        {filteredDcAssets.length > 0 && !dcSelected && (
                          <div className="mt-1 max-h-36 overflow-y-auto rounded border border-border divide-y divide-border">
                            {filteredDcAssets.map((a) => (
                              <button key={a.id} onClick={() => { setDcSelected(a.id); setDcSearch(a.name); }} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50">
                                <span className="font-mono text-[10px] text-muted-foreground w-20 shrink-0">{a.id}</span>
                                <span className="text-xs font-medium text-foreground">{a.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {dcSelected && <p className="mt-1 text-[10px] text-healthy font-semibold">✓ Selected: {dcSearch}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Reason for Decommission</label>
                        <textarea value={dcReason} onChange={(e) => setDcReason(e.target.value)} placeholder="e.g. End of life, beyond economic repair; replaced by AST-018" rows={3} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none" />
                      </div>
                    </div>
                    <button
                      onClick={() => { if (dcSelected && dcReason.trim()) setDcDone(true); }}
                      disabled={!dcSelected || !dcReason.trim()}
                      className="mt-4 w-full rounded bg-critical py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-40"
                    >
                      Confirm Decommission
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-critical-bg"><CheckCircle2 className="h-6 w-6 text-critical" /></div>
                    <p className="font-display font-bold">Asset Decommissioned</p>
                    <p className="mt-1 text-sm text-muted-foreground">"{dcSearch}" has been marked as decommissioned. A record has been created with the stated reason and your credentials.</p>
                    <button onClick={closeModal} className="mt-4 rounded border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition">Done</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Finance Dashboard Screen                                       */
/* ─────────────────────────────────────────────────────────────── */
export function FinanceDashboard({ persona }: { persona: UserPersona }) {
  const [tab, setTab] = useState<"overview" | "payables" | "disbursements" | "invoices">("overview");
  const { invoices } = useInvoices();
  const [payInv, setPayInv] = useState<AppInvoice | null>(null);
  const [viewFinInv, setViewFinInv] = useState<AppInvoice | null>(null);
  const pendingInvoices = invoices.filter(i => i.status === "submitted" || i.status === "under-review");
  const paidInvoices = invoices.filter(i => i.status === "paid");

  const kpis = [
    { label: "Total Receivables",   value: naira(148_000_000), tone: "healthy"   as Health },
    { label: "Overdue Receivables", value: naira(107_000_000), tone: "critical"  as Health },
    { label: "Total Payables",      value: naira(239_000_000), tone: "attention" as Health },
    { label: "Overdue Payables",    value: naira(56_000_000),  tone: "critical"  as Health },
  ];

  const payablesTotal = payables.reduce((s, p) => s + p.amount, 0);

  const payableStatusH = (s: string): Health =>
    s === "overdue" ? "critical" : s === "disputed" ? "attention" : "healthy";

  const disbursed = approvalRequests.filter((r) => r.status === "disbursed");

  const mockDisbursements: Array<{
    id: string; title: string; amount: number;
    disbursedBy: string; disbursedAt: string;
    company: "USV" | "CANONIC" | "USV + CANONIC";
  }> = [
    { id: "DSB-2026-0044", title: "Diesel supply: Abuja Housing Ph II",           amount: 14_100_000, disbursedBy: "Mrs. Maryam Kabiru Suleiman",      disbursedAt: "05 Sep 2026, 14:00", company: "USV"           },
    { id: "DSB-2026-0038", title: "Site survey specialist fee: Enugu",            amount: 2_350_000,  disbursedBy: "Mrs. Maryam Kabiru Suleiman",      disbursedAt: "02 Sep 2026, 11:30", company: "CANONIC"       },
    { id: "DSB-2026-0031", title: "Structural engineering consultant: Kaduna",    amount: 8_750_000,  disbursedBy: "Barr. Hauwa Suleiman Abubakar",   disbursedAt: "28 Aug 2026, 10:00", company: "USV + CANONIC" },
  ];

  return (
    <div className="animate-in">
      <ScreenHeader title="Finance Dashboard" desc="Receivables, payables, cash flow and disbursement records, USV + CANONIC." />

      {/* Alert for pending invoices */}
      {pendingInvoices.length > 0 && (
        <div className="mb-4 flex cursor-pointer items-center gap-3 rounded border border-attention/30 bg-attention-bg px-4 py-3" onClick={() => setTab("invoices")}>
          <AlertCircle className="h-4 w-4 shrink-0 text-attention" />
          <p className="text-sm font-semibold text-attention">
            {pendingInvoices.length} invoice{pendingInvoices.length > 1 ? "s" : ""} awaiting payment; click to review
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-[var(--radius)] border border-border bg-panel p-1 w-fit">
        {([
          ["overview", "Overview"],
          ["payables", "Payables"],
          ["disbursements", "Disbursements"],
          ["invoices", `Invoices${pendingInvoices.length > 0 ? ` (${pendingInvoices.length} pending)` : ""}`],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded px-4 py-1.5 text-xs font-semibold transition ${tab === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}${id === "invoices" && pendingInvoices.length > 0 ? " text-attention" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {kpis.map(({ label, value, tone }) => (
              <Card key={label} className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">{label}</p>
                <p className={`mt-2 font-display text-xl font-bold tabular-nums ${tone === "critical" ? "text-critical" : tone === "attention" ? "text-attention" : "text-foreground"}`}>
                  {value}
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-4">
            <SectionHead title="Cash Flow: Apr to Sep 2026" />
            <div className="pt-2">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={cashFlowData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `₦${(v / 1_000_000).toFixed(0)}m`} />
                  <Tooltip
                    formatter={(value: any, name: any) => [naira(Number(value)), name === "income" ? "Income" : "Expenditure"]}
                    labelFormatter={(l: any) => `Month: ${l}`}
                  />
                  <Area type="monotone" dataKey="income"      stroke="#1A3D8F" fill="#1A3D8F" fillOpacity={0.6} strokeWidth={2} />
                  <Area type="monotone" dataKey="expenditure" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <SectionHead title="Monthly Net" />
            <div className="pt-2">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={cashFlowData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `₦${(v / 1_000_000).toFixed(0)}m`} />
                  <Tooltip formatter={(value: any) => [naira(Number(value)), "Net"]} />
                  <Bar dataKey="net" name="Net">
                    {cashFlowData.map((entry, i) => (
                      <Cell key={i} fill={entry.net >= 0 ? "#1A3D8F" : "#dc2626"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ── Payables ── */}
      {tab === "payables" && (
        <div>
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => exportCSV("payables.csv", payables.map((p) => ({
                ID: p.id, Vendor: p.vendor, Description: p.description,
                Project: p.project, Company: p.company, Amount: p.amount,
                DueDate: p.dueDate, DaysOverdue: p.daysOverdue, Status: p.status,
              })))}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
          <div className="space-y-2">
            {payables.map((p) => (
              <Card key={p.id} className="p-3">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0 w-20">{p.id}</span>
                  <div className="flex-1 min-w-[140px]">
                    <p className="text-sm font-semibold text-foreground">{p.vendor}</p>
                    <p className="text-[10px] text-muted-foreground">{p.description} · {p.project}</p>
                  </div>
                  <CompanyTag company={p.company} />
                  <span className="font-mono text-sm font-bold tabular-nums text-foreground shrink-0">{naira(p.amount)}</span>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-muted-foreground">Due {p.dueDate}</p>
                    {p.daysOverdue > 0 && (
                      <p className="text-[10px] font-semibold text-critical">{p.daysOverdue}d overdue</p>
                    )}
                  </div>
                  <StatusBadge h={payableStatusH(p.status)}>{p.status}</StatusBadge>
                </div>
              </Card>
            ))}
            <div className="rounded-[var(--radius)] border border-border bg-panel px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Payables</span>
              <span className="font-mono text-base font-bold tabular-nums text-foreground">{naira(payablesTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Disbursements ── */}
      {tab === "disbursements" && (
        <div className="space-y-2">
          {disbursed.length === 0 && mockDisbursements.length === 0 && (
            <EmptyState icon={TrendingUp} title="No disbursements yet" subtitle="Approved requests will appear here once marked as final." />
          )}
          {disbursed.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex flex-wrap items-start gap-3">
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{r.id}</span>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm font-semibold text-foreground">{r.title}</p>
                  {r.amount && (
                    <p className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">{naira(r.amount)}</p>
                  )}
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Disbursed by {r.disbursedBy} · {r.disbursedAt}
                  </p>
                </div>
                <CompanyTag company={r.company} />
                <StatusBadge h="healthy">Disbursed</StatusBadge>
              </div>
            </Card>
          ))}
          {mockDisbursements.map((d) => (
            <Card key={d.id} className="p-4">
              <div className="flex flex-wrap items-start gap-3">
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{d.id}</span>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm font-semibold text-foreground">{d.title}</p>
                  <p className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">{naira(d.amount)}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Disbursed by {d.disbursedBy} · {d.disbursedAt}</p>
                </div>
                <CompanyTag company={d.company} />
                <StatusBadge h="healthy">Disbursed</StatusBadge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Invoices tab (Finance) ── */}
      {tab === "invoices" && (
        <div className="space-y-4">
          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Invoices", value: invoices.length },
              { label: "Pending Payment", value: pendingInvoices.length, warn: pendingInvoices.length > 0 },
              { label: "Paid", value: paidInvoices.length },
            ].map(s => (
              <Card key={s.label} className="p-4">
                <p className={`font-display text-2xl font-bold tabular-nums ${s.warn ? "text-attention" : "text-foreground"}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Pending invoices — action required */}
          {pendingInvoices.length > 0 && (
            <Card>
              <SectionHead title="Awaiting Payment" hint="Review invoice and upload payment receipt to confirm" />
              <div className="divide-y divide-border">
                {pendingInvoices.map(inv => {
                  const subtotal = inv.lineItems.reduce((s, l) => s + l.qty * l.unitPrice, 0);
                  const total = subtotal + Math.round(subtotal * 0.075);
                  return (
                    <div key={inv.id} className="flex flex-wrap items-center gap-4 px-4 py-3 hover:bg-panel">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] text-muted-foreground">{inv.id}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${inv.company === "USV" ? "bg-[#0B2551]/10 text-[#0B2551] dark:text-[#6fa3d8]" : "bg-[#0D3E72]/10 text-[#0D3E72] dark:text-[#6AAED8]"}`}>{inv.company}</span>
                          <span className="rounded-full bg-attention-bg px-2 py-0.5 text-[10px] font-bold text-attention">PENDING</span>
                        </div>
                        <p className="font-semibold">{inv.vendorName}</p>
                        <p className="text-[12px] text-muted-foreground">{inv.project} · Raised {inv.createdAt}</p>
                        <p className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">{nairaFmt(total)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setViewFinInv(inv)}
                          className="rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                          View
                        </button>
                        <button onClick={() => setPayInv(inv)}
                          className="inline-flex items-center gap-1.5 rounded bg-healthy px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Mark Paid
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Paid invoices */}
          {paidInvoices.length > 0 && (
            <Card>
              <SectionHead title="Paid Invoices" hint="Payment receipt evidence recorded" />
              <div className="divide-y divide-border">
                {paidInvoices.map(inv => {
                  const subtotal = inv.lineItems.reduce((s, l) => s + l.qty * l.unitPrice, 0);
                  const total = subtotal + Math.round(subtotal * 0.075);
                  return (
                    <div key={inv.id} className="flex flex-wrap items-center gap-4 px-4 py-3 hover:bg-panel">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] text-muted-foreground">{inv.id}</span>
                          <span className="rounded-full bg-healthy-bg px-2 py-0.5 text-[10px] font-bold text-healthy">PAID</span>
                        </div>
                        <p className="font-semibold">{inv.vendorName} <span className="font-normal text-muted-foreground">· {inv.project}</span></p>
                        <p className="text-[12px] text-muted-foreground">Paid {inv.paidAt} by {inv.paidBy}</p>
                        <div className="mt-0.5 flex items-center gap-3">
                          <p className="font-mono text-sm font-bold tabular-nums">{nairaFmt(total)}</p>
                          {inv.paymentReceipt && (
                            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Paperclip className="h-3 w-3" />{inv.paymentReceipt}
                            </p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setViewFinInv(inv)}
                        className="rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {invoices.length === 0 && (
            <Card className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <Receipt className="h-8 w-8 text-muted-foreground" strokeWidth={1.4} />
              <p className="font-semibold">No invoices yet</p>
              <p className="text-sm text-muted-foreground">Invoices raised by Procurement will appear here for payment processing.</p>
            </Card>
          )}
        </div>
      )}

      {/* Invoice view (read-only) */}
      {viewFinInv && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[4vh]" onClick={() => setViewFinInv(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[11px] text-white/70">{viewFinInv.id}</p>
              <button onClick={() => setViewFinInv(null)} className="rounded p-1.5 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <InvoiceTemplate inv={viewFinInv} />
            {viewFinInv.status !== "paid" && (
              <div className="mt-3 flex justify-end">
                <button onClick={() => { setViewFinInv(null); setPayInv(viewFinInv); }}
                  className="inline-flex items-center gap-1.5 rounded bg-healthy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                  <CheckCircle2 className="h-4 w-4" /> Mark as Paid
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <PayInvoiceModal inv={payInv} onClose={() => setPayInv(null)} paidBy={persona.name} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Contract Register Screen                                       */
/* ─────────────────────────────────────────────────────────────── */
export function ContractRegister({ persona }: { persona: UserPersona }) {
  const [tab, setTab] = useState<"active" | "all">("active");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const displayed = tab === "active" ? contracts.filter((c) => c.status === "active") : contracts;
  const paginated = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const expiring30 = displayed.filter((c) => c.daysToExpiry >= 0 && c.daysToExpiry < 30).length;

  const expiryColor = (days: number) => {
    if (days < 0)  return "text-critical";
    if (days < 30) return "text-critical";
    if (days < 90) return "text-attention";
    return "text-healthy";
  };

  const contractStatusH = (s: string): Health =>
    s === "expired" || s === "suspended" ? "critical" : s === "in-negotiation" ? "attention" : "healthy";

  return (
    <div className="animate-in">
      <ScreenHeader title="Contract Register" desc="Active and historical contracts: expiry monitoring, value tracking, and compliance.">
        <button
          onClick={() => exportCSV("contracts.csv", displayed.map((c) => ({
            ID: c.id, Title: c.title, Client: c.client, Company: c.company,
            Type: c.type, Value: c.value, Start: c.startDate, End: c.endDate,
            Status: c.status, DaysToExpiry: c.daysToExpiry, PM: c.pm,
          })))}
          className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </ScreenHeader>

      {/* Expiry alert banner */}
      {expiring30 > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-[var(--radius)] border border-attention/30 bg-attention-bg px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-attention" />
          <p className="text-sm font-semibold text-attention">
            {expiring30} contract{expiring30 > 1 ? "s" : ""} expiring within 30 days. Action required.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-[var(--radius)] border border-border bg-panel p-1 w-fit">
        {(["active", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); }}
            className={`rounded px-4 py-1.5 text-xs font-semibold transition capitalize ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "active"
              ? `Active (${contracts.filter((c) => c.status === "active").length})`
              : `All (${contracts.length})`}
          </button>
        ))}
      </div>

      {paginated.length === 0 && (
        <EmptyState icon={FileText} title="No contracts found" subtitle="No contracts match the current filter." />
      )}

      <div className="space-y-2">
        {paginated.map((c) => (
          <Card key={c.id}>
            <div className="p-4">
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-[160px]">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                    <Chip tone="info">{c.type}</Chip>
                    <CompanyTag company={c.company} />
                  </div>
                  <p className="font-display text-sm font-bold text-foreground">{c.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.client} · PM: {c.pm}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{c.startDate} – {c.endDate}</p>
                </div>
                <div className="shrink-0 text-right space-y-1.5">
                  <p className="font-mono text-sm font-bold tabular-nums text-foreground">{naira(c.value)}</p>
                  <StatusBadge h={contractStatusH(c.status)}>{c.status}</StatusBadge>
                  <div>
                    <span className={`font-mono text-[10px] font-semibold ${expiryColor(c.daysToExpiry)}`}>
                      {c.daysToExpiry < 0
                        ? `Expired ${Math.abs(c.daysToExpiry)}d ago`
                        : `${c.daysToExpiry}d to expiry`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {displayed.length > PAGE_SIZE && (
        <Pagination page={page} total={displayed.length} pageSize={PAGE_SIZE} onChange={setPage} />
      )}
    </div>
  );
}

/* ───────────────────────────────── MY WEEK ───────────────────────────────── */

type WeekDay = { day: string; date: string; task: string; duty: string; borderColor: string };

function getWeekData(userRole?: string): WeekDay[] {
  const tasksByRole: Record<string, string[]> = {
    engineer:    ["Complete roof beam calc submission", "TQ-022 response due", "Abuja site inspection visit", "MEP coordination meeting", "Weekly engineering summary report"],
    architect:   ["DWG-ENM-042 rev submission", "Enugu site visit brief", "RFI-ENM-007 client response", "Design review meeting", "Drawing register update"],
    qs:          ["BOQ-PRJ001-007 measurement verify", "Val certificate draft", "Variation VO-DRAFT-004 submission", "Cost plan update", "Weekly QS report"],
    site:        ["Pre-pour inspection Block C", "Labour attendance compile", "SR-PRJ001-085 submission", "Material delivery check", "Weekly site summary"],
    procurement: ["RFQ-USV-2026-010 issue to vendors", "Quote follow-up: 3 vendors", "QUOTE-CMP-082 evaluation", "PO-DRAFT-093 review", "Weekly procurement log"],
    accountant:  ["REC-SEP-002 finalise", "Voucher batch process", "RPT-Q3-DFT draft sections", "Payroll data verify", "Finance weekly summary"],
  };
  const defaultTasks = ["Leave applications review", "Staff onboarding check", "HR report draft", "Welfare round", "Weekly admin summary"];
  const tasks = tasksByRole[userRole ?? ""] ?? defaultTasks;

  const duties = ["Morning briefing, team stand-up", "Progress review call", "Coordination meeting", "Document submissions close", "Report compilation + handover"];
  const days = [
    { day: "Monday",    date: "07 Sep 2026" },
    { day: "Tuesday",   date: "08 Sep 2026" },
    { day: "Wednesday", date: "09 Sep 2026" },
    { day: "Thursday",  date: "10 Sep 2026" },
    { day: "Friday",    date: "11 Sep 2026" },
  ];
  const borders = ["border-blue-500", "border-blue-400", "border-blue-400", "border-blue-300", "border-blue-300"];

  return days.map((d, i) => ({
    day: d.day,
    date: d.date,
    task: tasks[i] ?? "",
    duty: duties[i] ?? "",
    borderColor: borders[i] ?? "border-border",
  }));
}

function getRoleLabel(userRole?: string): string {
  const map: Record<string, string> = {
    engineer: "Engineer", architect: "Architect", qs: "Quantity Surveyor",
    site: "Site Officer", procurement: "Procurement Officer", accountant: "Accountant",
    "admin": "Admin Officer", "ops": "Operations Officer",
  };
  return map[userRole ?? ""] ?? "Officer";
}

function getWeekSubmissions(userRole?: string): { ref: string; title: string; status: string; h: Health }[] {
  const map: Record<string, { ref: string; title: string; status: string; h: Health }[]> = {
    engineer: [
      { ref: "CALC-ENG-004", title: "Roof Beam Sizing Calculations", status: "Pending", h: "attention" },
      { ref: "TQ-022",       title: "TQ Response: Curtain Wall Anchor",  status: "Under Review", h: "attention" },
      { ref: "SPEC-ENM-023", title: "Structural Specification Rev 01",   status: "Approved", h: "healthy" },
    ],
    architect: [
      { ref: "DRW-ENM-042",  title: "First Floor Layout Revision",  status: "Under Review", h: "attention" },
      { ref: "RFI-ENM-007",  title: "Client RFI Response: Roofing", status: "Awaiting Approval", h: "attention" },
      { ref: "DRW-CAN-0442", title: "Ground Floor GA Rev C",         status: "Returned", h: "critical" },
    ],
    qs: [
      { ref: "BOQ-PRJ001-007", title: "Block C Column Concrete Measurement", status: "Pending", h: "attention" },
      { ref: "VO-DRAFT-004",   title: "Variation Order: LED Lighting",       status: "Awaiting Approval", h: "attention" },
      { ref: "VAL-PRJ021-004", title: "M&E Interim Valuation Certificate",   status: "Approved", h: "healthy" },
    ],
    site: [
      { ref: "SR-PRJ001-083",   title: "Daily Site Report 06 Sep", status: "Due Today", h: "attention" },
      { ref: "INSP-PRJ001-002", title: "Pre-Pour Inspection Block C", status: "Pending", h: "attention" },
      { ref: "SR-PRJ001-082",   title: "Daily Site Report 05 Sep",   status: "Reviewed", h: "healthy" },
    ],
    procurement: [
      { ref: "RFQ-USV-2026-010", title: "RFQ: Electrical Cable Supply", status: "Issued", h: "healthy" },
      { ref: "QUOTE-CMP-082",    title: "Quote Comparison: Elec. Cable", status: "Under Review", h: "attention" },
      { ref: "PO-USV-2026-0068", title: "Cement Supply PO", status: "Pending Approval", h: "attention" },
    ],
    accountant: [
      { ref: "REC-SEP-002", title: "Bank Reconciliation August 2026", status: "Under Review", h: "attention" },
      { ref: "VOUCHER-442", title: "Payment Voucher: Julius Steel",    status: "Awaiting Approval", h: "attention" },
      { ref: "RPT-Q3-DFT",  title: "Q3 Financial Report Draft",       status: "In Progress", h: "attention" },
    ],
  };
  return map[userRole ?? ""] ?? [
    { ref: "HR-LVE-2026-041",  title: "Annual Leave Application", status: "Awaiting Approval", h: "attention" },
    { ref: "HR-RPT-SEP-2026",  title: "Monthly HR Report Sep",    status: "In Progress", h: "attention" },
    { ref: "ONBOARD-2026-07",  title: "New Hire Onboarding Pack", status: "Completed", h: "healthy" },
  ];
}

function getWeekApprovals(userRole?: string): { ref: string; title: string; awaitingBy: string }[] {
  const map: Record<string, { ref: string; title: string; awaitingBy: string }[]> = {
    engineer:    [
      { ref: "CALC-ENG-004", title: "Roof Beam Sizing Calcs", awaitingBy: "GED Projects" },
      { ref: "TQ-022",       title: "TQ Response: Curtain Wall", awaitingBy: "Project Manager" },
    ],
    architect:   [
      { ref: "DRW-ENM-042",  title: "First Floor Layout Rev",   awaitingBy: "Lead Architect" },
      { ref: "RFI-ENM-007",  title: "RFI Client Response",      awaitingBy: "GED Projects" },
    ],
    qs:          [
      { ref: "VO-DRAFT-004",   title: "Variation VO #4 Approval", awaitingBy: "GED Projects" },
      { ref: "VAL-PRJ021-004", title: "M&E Interim Val Cert",      awaitingBy: "Finance Manager" },
    ],
    site:        [
      { ref: "SR-PRJ001-083",   title: "Daily Site Report 06 Sep", awaitingBy: "Project Manager" },
      { ref: "INSP-PRJ001-002", title: "Pre-Pour Inspection",      awaitingBy: "Head of Engineering" },
    ],
    procurement: [
      { ref: "PO-USV-2026-0068", title: "Cement Supply PO",        awaitingBy: "GED Projects" },
      { ref: "QUOTE-CMP-082",    title: "Quote Comparison Report",  awaitingBy: "Procurement Manager" },
    ],
    accountant:  [
      { ref: "PAYROLL-SEP", title: "September Payroll Summary", awaitingBy: "Finance Manager" },
      { ref: "VOUCHER-442", title: "Payment Voucher ₦63.4m",    awaitingBy: "GMD" },
    ],
  };
  return map[userRole ?? ""] ?? [
    { ref: "HR-LVE-2026-041", title: "Annual Leave Application",  awaitingBy: "Head of Admin" },
    { ref: "HR-RPT-SEP-2026", title: "Monthly HR Report Sep",     awaitingBy: "Executive Office" },
  ];
}

export function MyWeek({ userRole, nav }: { userRole?: string; nav: (screen: string) => void }) {
  const weekData = getWeekData(userRole);
  const submissions = getWeekSubmissions(userRole);
  const approvals = getWeekApprovals(userRole);
  const roleLabel = getRoleLabel(userRole);

  const tasksDueCount = weekData.length;
  const pendingSubmissions = submissions.filter(s => s.status !== "Approved" && s.status !== "Reviewed" && s.status !== "Completed" && s.status !== "Issued").length;

  const stats = [
    { label: "Tasks Due This Week", value: tasksDueCount, tone: "text-foreground" },
    { label: "Duties Remaining", value: 5, tone: "text-attention" },
    { label: "Pending Submissions", value: pendingSubmissions, tone: pendingSubmissions > 0 ? "text-attention" : "text-healthy" },
    { label: "Days Until Weekend", value: 5, tone: "text-primary" },
  ];

  const submissionStatusH = (st: string): Health =>
    st === "Approved" || st === "Reviewed" || st === "Completed" || st === "Issued" ? "healthy"
    : st === "Returned" ? "critical"
    : "attention";

  return (
    <div className="animate-in space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">My Week</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Week 36 · 07–13 Sep 2026</p>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
          {roleLabel}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className={`mt-1.5 font-display text-2xl font-bold sm:text-3xl ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Day-by-day timeline */}
      <Card>
        <SectionHead title="Week at a Glance" hint="Mon 07 – Fri 11 Sep 2026" />
        <div className="divide-y divide-border">
          {weekData.map((d) => (
            <div key={d.day} className={`flex items-start gap-4 border-l-4 ${d.borderColor} px-4 py-4`}>
              <div className="w-28 shrink-0">
                <p className="text-[11px] font-bold text-foreground">{d.day}</p>
                <p className="text-[10px] text-muted-foreground">{d.date}</p>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 rounded bg-attention/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-attention shrink-0">Task</span>
                  <p className="text-[12px] font-semibold text-foreground">{d.task}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 rounded bg-panel px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground shrink-0">Duty</span>
                  <p className="text-[11px] text-muted-foreground">{d.duty}</p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="rounded-full border border-blue-500/30 bg-blue-500/8 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-600">Upcoming</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pending Submissions */}
        <Card>
          <SectionHead title="Pending Submissions" hint={`${pendingSubmissions} awaiting action`} />
          <div className="divide-y divide-border">
            {submissions.map(s => (
              <div key={s.ref} className="flex items-center gap-3 px-4 py-3">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-muted-foreground">{s.ref}</p>
                  <p className="text-[12px] font-semibold text-foreground leading-snug">{s.title}</p>
                </div>
                <StatusBadge h={submissionStatusH(s.status)}>{s.status}</StatusBadge>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Approvals */}
        <Card>
          <SectionHead title="Upcoming Approvals" hint="Awaiting Head Approval" />
          <div className="divide-y divide-border">
            {approvals.map(a => (
              <div key={a.ref} className="flex items-center gap-3 px-4 py-3">
                <Clock className="h-4 w-4 shrink-0 text-attention" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-muted-foreground">{a.ref}</p>
                  <p className="text-[12px] font-semibold text-foreground leading-snug">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">Awaiting: {a.awaitingBy}</p>
                </div>
                <StatusBadge h="attention">Pending</StatusBadge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Navigation shortcuts */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => nav("role-home")}
          className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm hover:border-primary/40 hover:text-primary transition"
        >
          Go to My Assignments <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => nav("documents")}
          className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm hover:border-primary/40 hover:text-primary transition"
        >
          My Documents <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => nav("action")}
          className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm hover:border-primary/40 hover:text-primary transition"
        >
          Action Centre <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
