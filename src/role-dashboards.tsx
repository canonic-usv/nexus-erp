import type React from "react";
import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  FolderOpen,
  Globe,
  HardHat,
  Landmark,
  Layers,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Wifi,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { actions, naira, procRequests, projects, staffMembers, staffTasks, tenders, headDisplayMap, type UserRole, salaryGrades, salaryAuditTrail, delegations, DELEGATION_PERMISSION_LABELS, deptResponsibilities } from "./data";
import { Card, HealthDot, Progress, SectionHead, StatusBadge } from "./ui";
import {
  useToast,
  SiteReportModal,
  MaterialRequestModal,
  IssueLogModal,
  ApprovalDetailModal,
  DirectiveTag,
  PhotoUploadModal,
  ProgressUpdateModal,
  InspectionModal,
  TicketModal,
  ProvisionModal,
  NewStaffModal,
  InvoiceDetailModal,
  SiteReportViewerModal,
  type ApprovalDetailItem,
  type TicketRecord,
  type ProvisionRecord,
  type InvoiceRecord,
} from "./overlays";

type Nav = (screen: string, projectCode?: string) => void;

const today = "Sunday, 06 September 2026";

function RoleHeader({
  greeting,
  name,
  title,
  company,
  date,
}: {
  greeting: string;
  name: string;
  title: string;
  company: string;
  date: string;
}) {
  return (
    <div className="mb-4 sm:mb-6 flex items-start sm:items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {greeting}
        </p>
        <h1 className="font-display mt-0.5 text-xl sm:text-2xl font-bold tracking-tight truncate">
          {name}
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground truncate">
          {title} · {company}
        </p>
      </div>
      <p className="hidden sm:block shrink-0 font-mono text-[11px] text-muted-foreground">{date}</p>
    </div>
  );
}

function Sparkline({ data, tone = "primary" }: { data: number[]; tone?: "primary" | "healthy" | "critical" | "attention" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 56;
  const H = 20;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 2) - 1}`).join(" ");
  const colorMap: Record<string, string> = {
    primary: "var(--color-primary, #1A3D8F)",
    healthy: "var(--color-healthy, #16a34a)",
    critical: "var(--color-critical, #dc2626)",
    attention: "var(--color-attention, #d97706)",
  };
  return (
    <svg width={W} height={H} className="shrink-0 opacity-70">
      <polyline points={pts} fill="none" stroke={colorMap[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricTile({
  label,
  value,
  sub,
  tone,
  icon: Icon,
  onClick,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "healthy" | "attention" | "critical" | "neutral";
  icon?: React.ElementType;
  onClick?: () => void;
  trend?: number[];
}) {
  const toneColor =
    tone === "critical" ? "#dc2626" : tone === "attention" ? "#d97706" : "#1A3D8F";

  const valueColor =
    tone === "critical"
      ? "text-critical"
      : tone === "attention"
        ? "text-attention"
        : tone === "healthy"
          ? "text-healthy"
          : "text-foreground";

  const gradId = `sg-${label.replace(/\s/g, "")}`;

  const content = (
    <>
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
          {label}
        </p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />}
      </div>
      <p className={`mt-2 font-display text-xl sm:text-2xl font-bold tabular-nums ${valueColor}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">{sub}</p>}
      {trend && (
        <div className="mt-2 h-8 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend.map((v, i) => ({ i, v }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={toneColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={toneColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={toneColor} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      {onClick && <p className="mt-2 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition">View details →</p>}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="group w-full rounded-[var(--radius)] border border-border bg-card p-4 text-left transition hover:border-primary/30 hover:shadow-sm">
        {content}
      </button>
    );
  }

  return <Card className="p-4">{content}</Card>;
}

function PriorityBanner({ items }: { items: { text: string; tone: "critical" | "attention" }[] }) {
  const critical = items.filter(i => i.tone === "critical");
  if (critical.length === 0) return null;
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius)] border border-critical/30 bg-critical-bg px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-critical" />
      <div className="flex-1 space-y-0.5">
        {critical.slice(0, 2).map((item, i) => (
          <p key={i} className="text-sm font-semibold text-critical">{item.text}</p>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── PROJECT MANAGER DASHBOARD ─────────────────────────── */

const pmDrawings = [
  { id: "SR-082", label: "Site Report: Block C foundation", project: "Abuja Housing Ph II", status: "Reviewed", time: "09:42" },
  { id: "PR-081", label: "Approve reinforcement steel 42T Y16", project: "Abuja Housing Ph II", status: "Pending Your Action", time: "Due 16:00" },
  { id: "VAR-003", label: "Variation: revised foundation (+₦180m)", project: "Abuja Housing Ph II", status: "Overdue", time: "Yesterday" },
];

const pmMilestones = [
  { date: "08 Sep", label: "Block C foundation pour", project: "Abuja Housing Ph II", status: "attention" as const },
  { date: "12 Sep", label: "Curtain wall procurement complete", project: "Gov't Office Complex", status: "critical" as const },
  { date: "18 Sep", label: "Progress valuation submission", project: "Abuja Housing Ph II", status: "attention" as const },
  { date: "25 Sep", label: "Roof slab completion: Block A", project: "Abuja Housing Ph II", status: "healthy" as const },
];

export function PMDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const [siteReport, setSiteReport] = useState(false);
  const [matRequest, setMatRequest] = useState(false);
  const [issueLog, setIssueLog] = useState(false);
  const [progressUpdate, setProgressUpdate] = useState(false);
  const [milestones, setMilestones] = useState(pmMilestones);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  const myProjects = projects.filter((p) =>
    ["PRJ-USV-2026-0015", "PRJ-USV-2026-0021", "PRJ-USV-2026-0009"].includes(p.code)
  );

  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="Engr. Musa Usman Lawan"
        title="Senior Project Manager"
        company="USV"
        date={today}
      />

      <PriorityBanner items={[
        { text: "Reinforcement steel PO approval breaching SLA. Foundation works halted.", tone: "critical" },
        { text: "Variation VAR-003 overdue. Requires escalation to GED.", tone: "critical" },
      ]} />

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Active Projects" value="3" sub="all under management" icon={Layers} onClick={() => nav("portfolio")} trend={[1, 2, 2, 2, 3, 3, 3]} />
        <MetricTile label="Critical Actions" value="2" sub="require action today" tone="critical" icon={AlertTriangle} onClick={() => nav("action")} trend={[0, 1, 2, 1, 3, 2, 2]} />
        <MetricTile label="Overdue Tasks" value="4" sub="past target date" tone="attention" icon={Clock} onClick={() => nav("action")} />
        <MetricTile label="Pending Procurement" value="₦77.5m" sub="awaiting approval" tone="neutral" icon={Package} onClick={() => nav("procurement")} />
      </div>

      {/* ── PM Charts ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHead
            title="Abuja Housing Ph II — Progress vs. Programme"
            hint="Jan – Sep 2026 · % complete"
            action={<span className="rounded bg-attention-bg px-2 py-0.5 font-mono text-[10px] font-bold text-attention">8% behind plan</span>}
          />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={pmProgressData}
              lines={[
                { key: "Planned %", label: "Planned %", color: "var(--primary)", dashed: true },
                { key: "Actual %",  label: "Actual %",  color: "var(--healthy)" },
              ]}
              yFormatter={(v) => `${v}%`}
            />
          </div>
        </Card>
        <Card>
          <SectionHead
            title="Site Workforce Attendance"
            hint="Weeks 27 – 35 · workers on site daily"
            action={<span className="rounded bg-healthy/10 px-2 py-0.5 font-mono text-[10px] font-bold text-healthy">169 on site today</span>}
          />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={pmAttendanceData}
              lines={[{ key: "On Site", label: "Workers on Site", color: "var(--primary)" }]}
              yFormatter={(v) => `${v}`}
              referenceY={165}
              referenceLabel="Target 165"
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* My Projects */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <SectionHead
              title="My Projects"
              hint="Health · Progress · Budget"
              action={
                <button
                  onClick={() => nav("portfolio")}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  All projects <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {myProjects.map((p) => (
                <button
                  key={p.code}
                  onClick={() => nav("project", p.code)}
                  className="flex w-full items-start gap-4 px-4 py-3.5 text-left hover:bg-panel transition"
                >
                  <div className="mt-0.5">
                    <HealthDot h={p.health} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <StatusBadge h={p.health} />
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {p.code} · {p.phase}
                    </p>
                    <div className="mt-2">
                      <Progress planned={p.progressPlanned} actual={p.progressActual} />
                    </div>
                    <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
                      <span>Contract {naira(p.contractValue)}</span>
                      <span>Budget {p.budgetConsumed}% used</span>
                      <span>End {p.endDate}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <SectionHead title="Upcoming Milestones" hint="Next 30 days" />
            <div className="divide-y divide-border">
              {(showAllMilestones ? milestones : milestones.slice(0, 3)).map((m, i) => {
                const milestoneKey = m.label;
                const statusToLabel = (s: string) =>
                  s === "critical" ? "Delayed" : s === "attention" ? "At Risk" : "On Track";
                const labelToHealth = (s: string): "healthy" | "attention" | "critical" =>
                  s === "Delayed" ? "critical" : s === "At Risk" ? "attention" : "healthy";
                return (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <div className="w-14 shrink-0 text-center">
                      <p className="font-mono text-xs font-bold text-foreground">{m.date}</p>
                    </div>
                    <HealthDot h={m.status} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.project}</p>
                    </div>
                    {editingMilestoneId === milestoneKey ? (
                      <select
                        autoFocus
                        defaultValue={statusToLabel(m.status)}
                        onBlur={(e) => {
                          const newHealth = labelToHealth(e.target.value);
                          setMilestones((prev) =>
                            prev.map((item) =>
                              item.label === milestoneKey ? { ...item, status: newHealth } : item
                            )
                          );
                          setEditingMilestoneId(null);
                        }}
                        className="rounded border border-border bg-card px-2 py-0.5 text-[12px] outline-none focus:border-primary"
                      >
                        <option>On Track</option>
                        <option>At Risk</option>
                        <option>Delayed</option>
                        <option>Complete</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingMilestoneId(milestoneKey)}
                        className="group flex items-center gap-1.5"
                      >
                        <StatusBadge h={m.status} />
                        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {milestones.length > 3 && (
              <button
                onClick={() => setShowAllMilestones((s) => !s)}
                className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                {showAllMilestones ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {showAllMilestones ? "Show less" : `Show ${milestones.length - 3} more`}
              </button>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Today's Actions */}
          <Card>
            <SectionHead title="Today's Critical Actions" />
            <div className="divide-y divide-border">
              {pmDrawings.map((d) => (
                <div key={d.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold leading-snug">{d.label}</p>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        d.status === "Pending Your Action"
                          ? "bg-attention-bg text-attention"
                          : d.status === "Overdue"
                            ? "bg-critical-bg text-critical"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{d.project}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{d.id} · {d.time}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Health matrix for my projects */}
          <Card>
            <SectionHead title="Project Health Matrix" hint="Abuja Housing Ph II" />
            <div className="p-4 space-y-2">
              {[
                { label: "Schedule", h: "critical" as const },
                { label: "Cost", h: "attention" as const },
                { label: "Procurement", h: "attention" as const },
                { label: "Payment", h: "critical" as const },
                { label: "Quality", h: "healthy" as const },
                { label: "Client", h: "attention" as const },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden"
                    >
                      <div
                        className={`h-full rounded-full ${
                          item.h === "critical"
                            ? "bg-critical w-2/5"
                            : item.h === "attention"
                              ? "bg-attention w-3/5"
                              : "bg-healthy w-4/5"
                        }`}
                      />
                    </div>
                    <StatusBadge h={item.h} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Submit Site Report", icon: HardHat, fn: () => setSiteReport(true) },
                { label: "Update Progress", icon: CheckCircle2, fn: () => setProgressUpdate(true) },
                { label: "Raise Procurement Request", icon: Package, fn: () => setMatRequest(true) },
                { label: "Log Issue", icon: AlertTriangle, fn: () => setIssueLog(true) },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={q.fn}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <SiteReportModal open={siteReport} onClose={() => setSiteReport(false)} onSuccess={() => show("Site report submitted. Pending review.", "success")} />
      <MaterialRequestModal open={matRequest} onClose={() => setMatRequest(false)} onSuccess={() => show("Procurement request submitted for approval", "success")} />
      <IssueLogModal open={issueLog} onClose={() => setIssueLog(false)} onSuccess={() => show("Issue logged and team notified", "success")} />
      <ProgressUpdateModal open={progressUpdate} onClose={() => setProgressUpdate(false)} onSuccess={() => show("Progress update recorded", "success")} />
    </div>
  );
}

/* ─────────────────────────── ARCHITECT DASHBOARD ─────────────────────────── */

const drawings = [
  { id: "DWG-CAN-0442", label: "Ground Floor GA, Rev C", project: "Lagos Commercial Development", status: "Awaiting Review", date: "Tomorrow", urgent: false },
  { id: "DWG-CAN-0441", label: "Structural Layout, Rev B", project: "Lagos Commercial Development", status: "Approved", date: "02 Sep", urgent: false },
  { id: "DWG-CAN-0431", label: "Façade Elevation, Rev 01", project: "Enugu Medical Centre", status: "Revision Requested", date: "Overdue", urgent: true },
  { id: "DWG-CAN-0428", label: "Roof Plan, Rev 03", project: "Enugu Medical Centre", status: "In Review", date: "05 Sep", urgent: false },
];

const designStages = [
  { label: "Concept Design", project: "Lagos Commercial Dev.", complete: 100 },
  { label: "Schematic Design", project: "Lagos Commercial Dev.", complete: 100 },
  { label: "Design Development", project: "Lagos Commercial Dev.", complete: 72 },
  { label: "Technical Design", project: "Lagos Commercial Dev.", complete: 45 },
  { label: "Concept Design", project: "Enugu Medical Centre", complete: 100 },
  { label: "Schematic Design", project: "Enugu Medical Centre", complete: 100 },
  { label: "Supervision", project: "Enugu Medical Centre", complete: 42 },
];

export function ArchitectDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const [uploadDrawing, setUploadDrawing] = useState(false);
  const [issueLog, setIssueLog] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  const canProjects = projects.filter(
    (p) => p.company === "CANONIC" || p.code === "PRJ-CAN-2026-0008"
  );

  return (
    <div className="space-y-6 animate-in">
      <HeadAssignTaskModal open={showAssign} onClose={() => setShowAssign(false)} officerRole="architect" officerName="Arc. Safiya Garba Aliyu" headName="Arc. Hamza Ibrahim Danladi" />
      <RoleHeader
        greeting="Good morning"
        name="Arc. Hamza Ibrahim Danladi"
        title="Principal Architect"
        company="CANONIC"
        date={today}
      />

      <PriorityBanner items={[
        { text: "Façade Elevation Rev 01: Revision requested, now overdue. Client review blocked.", tone: "critical" },
      ]} />

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Design Projects" value="2" sub="CANONIC portfolio" icon={Pencil} onClick={() => nav("portfolio")} trend={[1, 1, 2, 2, 2, 2, 2]} />
        <MetricTile label="Drawings Pending" value="3" sub="awaiting review/approval" tone="attention" icon={FileText} onClick={() => nav("documents")} trend={[5, 4, 4, 3, 3, 4, 3]} />
        <MetricTile label="Site Instructions" value="7" sub="issued this month" icon={BookOpen} onClick={() => nav("instructions")} />
        <MetricTile label="Technical Issues" value="2" sub="open, require resolution" tone="critical" icon={AlertTriangle} onClick={() => nav("action")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Design Stage Progress */}
          <Card>
            <SectionHead title="Design Stage Progress" hint="CANONIC active projects" />
            <div className="divide-y divide-border">
              {designStages.map((s, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium">{s.label}</p>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {s.complete}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.complete === 100 ? "bg-healthy" : "bg-primary"}`}
                        style={{ width: `${s.complete}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">{s.project}</p>
                  </div>
                  {s.complete === 100 && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-healthy" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Drawing Register */}
          <Card>
            <SectionHead
              title="Drawing Register"
              hint="Recent submissions"
              action={
                <button
                  onClick={() => nav("documents")}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  All drawings <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {drawings.map((d) => (
                <div key={d.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{d.label}</p>
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                          d.status === "Approved"
                            ? "bg-healthy-bg text-healthy"
                            : d.status === "Revision Requested"
                              ? "bg-critical-bg text-critical"
                              : d.status === "Awaiting Review"
                                ? "bg-attention-bg text-attention"
                                : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {d.id} · {d.project} · {d.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Project health */}
          <Card>
            <SectionHead title="CANONIC Project Health" />
            <div className="divide-y divide-border">
              {canProjects.map((p) => (
                <button
                  key={p.code}
                  onClick={() => nav("project", p.code)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-panel transition"
                >
                  <HealthDot h={p.health} className="mt-1" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{p.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {p.progressActual}% complete · {p.phase}
                    </p>
                  </div>
                  <StatusBadge h={p.health} />
                </button>
              ))}
            </div>
          </Card>

          {/* Technical Issues */}
          <Card>
            <SectionHead title="Technical Issues" hint="Open items" />
            <div className="divide-y divide-border">
              {[
                {
                  label: "Structural conflict: grid line D/4",
                  project: "Lagos Commercial Dev.",
                  severity: "critical" as const,
                  days: 3,
                },
                {
                  label: "MEP coordination: Level 2",
                  project: "Enugu Medical Centre",
                  severity: "attention" as const,
                  days: 6,
                },
              ].map((issue, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium leading-snug">{issue.label}</p>
                    <StatusBadge h={issue.severity} />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {issue.project} · Open {issue.days} days
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Upload Drawing", icon: FileText, fn: () => setUploadDrawing(true) },
                { label: "Issue Site Instruction", icon: BookOpen, fn: () => show("Site instruction form opened. Complete in Documents.", "info") },
                { label: "Log Technical Issue", icon: AlertTriangle, fn: () => setIssueLog(true) },
                { label: "Schedule Design Review", icon: Camera, fn: () => show("Design review scheduled. Team notified via NEXUS calendar.", "success") },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={q.fn}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Assign Task to Officer */}
          <Card className="p-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Assign Task to Officer</p>
            <p className="mb-3 text-[10px] text-muted-foreground">Create a task for Arc. Safiya Garba Aliyu — they will see it immediately in their Active Assignments.</p>
            <button
              onClick={() => setShowAssign(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              <ClipboardList className="h-3.5 w-3.5" /> Assign Task to Arc. Okoro
            </button>
          </Card>
        </div>
        <div className="space-y-4">
          <TeamPerformanceCard officerName="Arc. Safiya Garba Aliyu" officerRole="architect" />
        </div>
      </div>

      <PhotoUploadModal open={uploadDrawing} onClose={() => setUploadDrawing(false)} onSuccess={() => show("Drawing uploaded and added to register", "success")} />
      <IssueLogModal open={issueLog} onClose={() => setIssueLog(false)} onSuccess={() => show("Technical issue logged. Assigned to design team.", "success")} />
    </div>
  );
}

/* ─────────────────────────── FINANCE DASHBOARD ─────────────────────────── */

const invoices = [
  { id: "INV-USV-2026-0044", client: "Fed. Housing Auth.", project: "Abuja Housing Ph II", amount: 85_000_000, status: "Overdue", daysOverdue: 34 },
  { id: "INV-USV-2026-0051", client: "Kaduna State Govt", project: "Gov't Office Complex", amount: 120_000_000, status: "Submitted", daysOverdue: 0 },
  { id: "INV-USV-2025-0038", client: "Oyo State Govt", project: "Ibadan Ring Road", amount: 62_000_000, status: "Paid", daysOverdue: 0 },
  { id: "INV-CAN-2026-0019", client: "Enugu Min. of Health", project: "Enugu Medical Centre", amount: 41_000_000, status: "Overdue", daysOverdue: 18 },
];

const ageingData = [
  { bucket: "Current", amount: 132 },
  { bucket: "1–30 days", amount: 85 },
  { bucket: "31–60 days", amount: 41 },
  { bucket: "61–90 days", amount: 22 },
  { bucket: ">90 days", amount: 8 },
];

export function FinanceDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const totalReceivables = ageingData.reduce((s, d) => s + d.amount, 0);
  const overdue = ageingData.slice(1).reduce((s, d) => s + d.amount, 0);

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [showSiteReport, setShowSiteReport] = useState(false);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [teamDetailItem, setTeamDetailItem] = useState<ApprovalDetailItem | null>(null);

  const invoiceRecords: InvoiceRecord[] = [
    { id: "INV-USV-2026-0044", company: "USV", client: "Fed. Housing Auth.", clientAddress: "Federal Housing Authority, 7 Ladoke Akintola Blvd, Garki, Abuja", project: "Abuja Housing Development: Phase II", projectCode: "PRJ-USV-001", amount: 85_000_000, status: "Overdue", daysOverdue: 34, issued: "03 Aug 2026", due: "17 Aug 2026" },
    { id: "INV-USV-2026-0051", company: "USV", client: "Kaduna State Govt", clientAddress: "Ministry of Works, Secretariat Complex, Kaduna", project: "Government Office Complex", projectCode: "PRJ-USV-003", amount: 120_000_000, status: "Submitted", daysOverdue: 0, issued: "28 Aug 2026", due: "11 Sep 2026" },
    { id: "INV-USV-2025-0038", company: "USV", client: "Oyo State Govt", clientAddress: "Ministry of Infrastructure, State Secretariat, Ibadan", project: "Ibadan Ring Road", projectCode: "PRJ-USV-005", amount: 62_000_000, status: "Paid", daysOverdue: 0, issued: "10 Jul 2026", due: "24 Jul 2026" },
    { id: "INV-CAN-2026-0019", company: "CANONIC", client: "Enugu Min. of Health", clientAddress: "Ministry of Health, Government House, Enugu", project: "Enugu Medical Centre", projectCode: "PRJ-CAN-002", amount: 41_000_000, status: "Overdue", daysOverdue: 18, issued: "19 Aug 2026", due: "02 Sep 2026" },
  ];

  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="Mrs. Maryam Kabiru Suleiman"
        title="Finance Manager"
        company="USV + CANONIC"
        date={today}
      />

      <PriorityBanner items={[
        { text: `₦${overdue}m in overdue receivables. Federal Housing Authority 34 days outstanding`, tone: "critical" },
      ]} />

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Total Receivables" value={`₦${totalReceivables}m`} sub="across all projects" icon={DollarSign} onClick={() => nav("invoices")} trend={[220, 230, 245, 258, 262, 270, 288]} />
        <MetricTile label="Overdue Amount" value={`₦${overdue}m`} sub="beyond payment terms" tone="critical" icon={TrendingDown} onClick={() => nav("approvals")} trend={[98, 110, 120, 132, 140, 148, 156]} />
        <MetricTile label="Invoiced (Sep)" value="₦248m" sub="month to date" tone="neutral" icon={FileText} onClick={() => nav("invoices")} />
        <MetricTile label="Collections (Sep)" value="₦163m" sub="received this month" tone="healthy" icon={TrendingUp} onClick={() => nav("invoices")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Receivables Ageing */}
          <Card>
            <SectionHead title="Receivables Ageing Matrix" hint={`Total ₦${totalReceivables}m outstanding`} />
            <div className="p-4">
              <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {ageingData.map((d) => {
                  const isOverdue = d.bucket !== "Current";
                  return (
                    <div
                      key={d.bucket}
                      className="rounded border p-3 text-center"
                      style={{
                        borderColor: isOverdue ? "rgba(178,49,32,0.2)" : "#D9E2EC",
                        background: isOverdue ? "rgba(246,226,222,0.3)" : "#F5F7FA",
                      }}
                    >
                      <p
                        className={`font-display text-xl font-bold tabular-nums ${isOverdue ? "text-critical" : "text-foreground"}`}
                      >
                        ₦{d.amount}m
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                        {d.bucket}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="h-px bg-border mb-4" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-critical">₦{overdue}m</span> overdue
                ({Math.round((overdue / totalReceivables) * 100)}% of total); primary exposure
                in Abuja Housing and Enugu Medical Centre.
              </p>
            </div>
          </Card>

          {/* Invoice Tracker */}
          <Card>
            <SectionHead
              title="Invoice Tracker"
              hint="Open and recent invoices"
              action={
                <span className="rounded bg-critical-bg px-2 py-0.5 font-mono text-[10px] font-bold text-critical">
                  2 OVERDUE
                </span>
              }
            />
            <div className="divide-y divide-border">
              {(showAllInvoices ? invoiceRecords : invoiceRecords.slice(0, 3)).map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="group flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-panel"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold group-hover:text-primary">{inv.client}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {inv.id} · {inv.project}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono text-sm font-bold tabular-nums">
                          {naira(inv.amount)}
                        </p>
                        <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                          inv.status === "Overdue" ? "bg-critical-bg text-critical"
                          : inv.status === "Paid" ? "bg-healthy-bg text-healthy"
                          : "bg-secondary text-muted-foreground"
                        }`}>
                          {inv.status}{(inv.daysOverdue ?? 0) > 0 ? ` · ${inv.daysOverdue}d` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                </button>
              ))}
            </div>
            {invoiceRecords.length > 3 && (
              <button
                onClick={() => setShowAllInvoices((s) => !s)}
                className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                {showAllInvoices ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {showAllInvoices ? "Show less" : `Show ${invoiceRecords.length - 3} more`}
              </button>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Receivables chart */}
          <Card>
            <SectionHead title="Ageing Distribution" />
            <div className="px-4 pb-4 pt-3">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ageingData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
                  <XAxis
                    dataKey="bucket"
                    tick={{ fontSize: 10, fill: "#627D98" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#627D98" }}
                    axisLine={false}
                    tickLine={false}
                    unit="m"
                  />
                  <Tooltip
                    formatter={(v) => [`₦${v}m`, "Amount"]}
                    contentStyle={{
                      fontSize: 12,
                      border: "1px solid #D9E2EC",
                      borderRadius: 4,
                    }}
                  />
                  <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                    {ageingData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={
                          d.bucket === "Current"
                            ? "#1A3D8F"
                            : d.bucket === "1–30 days"
                              ? "#b5820e"
                              : "#b23120"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Payment alerts */}
          <Card>
            <SectionHead title="Payment Alerts" />
            <div className="divide-y divide-border">
              {[
                {
                  label: "FHA: Milestone 3 overdue 34 days",
                  amount: "₦85m",
                  severity: "critical" as const,
                },
                {
                  label: "Enugu MoH: payment outstanding 18 days",
                  amount: "₦41m",
                  severity: "attention" as const,
                },
                {
                  label: "Delta Freight: payment approaching",
                  amount: "₦22m",
                  severity: "attention" as const,
                },
              ].map((a, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs leading-snug">{a.label}</p>
                    <StatusBadge h={a.severity} />
                  </div>
                  <p className="mt-1 font-mono text-xs font-bold tabular-nums">
                    {a.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Procurement Disbursement Queue */}
          <Card>
            <SectionHead
              title="Procurement Disbursements"
              hint="Approved POs awaiting payment"
              action={
                <span className="rounded bg-attention-bg px-2 py-0.5 font-mono text-[10px] font-bold text-attention">
                  PENDING
                </span>
              }
            />
            <div className="divide-y divide-border">
              {procRequests.filter((r) => r.currentStage >= 10).map((req) => (
                <div key={req.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-muted-foreground">{req.id}</p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug">{req.item}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{req.project} · {req.location}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Requested by: {req.requestedBy}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm font-bold tabular-nums">{naira(req.amount)}</p>
                      <span className={`mt-0.5 inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${req.disbursedAt ? "bg-healthy-bg text-healthy" : "bg-attention-bg text-attention"}`}>
                        {req.disbursedAt ? "Disbursed" : "Awaiting Disbursement"}
                      </span>
                    </div>
                  </div>
                  {req.disbursedAt && (
                    <p className="mt-1 text-[10px] text-healthy">Disbursed: {req.disbursedAt} · All stakeholders notified</p>
                  )}
                  {!req.disbursedAt && (
                    <div className="mt-2">
                      <p className="text-[11px] text-muted-foreground">Chain: {req.approvalChain.join(" → ")} ✓ · Final approver: {req.finalApprover}</p>
                    </div>
                  )}
                </div>
              ))}
              {procRequests.filter((r) => r.currentStage >= 10).length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">No items awaiting disbursement.</div>
              )}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Issue Invoice (USV)", icon: FileText, fn: () => setSelectedInvoice(invoiceRecords[0]) },
                { label: "Issue Invoice (CANONIC)", icon: FileText, fn: () => setSelectedInvoice(invoiceRecords[3]) },
                { label: "Record Payment", icon: CheckCircle2, fn: () => show("Select an invoice to record payment against", "info") },
                { label: "Escalate Overdue", icon: ShieldAlert, fn: () => show("Escalation notices sent to Finance Director and client contacts", "warning") },
                { label: "Export Statement", icon: LogOut, fn: () => { setShowSiteReport(true); } },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={q.fn}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Team submissions pending Finance Manager review */}
      <TeamPendingPanel
        onNav={() => nav("action")}
        onView={(s) => setTeamDetailItem({ id: s.id, title: s.title, type: s.type, submitted: s.submittedAt, status: "in-review", requesterName: s.from, requesterTitle: s.fromTitle, directedBy: `${s.from}, ${s.fromTitle}`, chain: [{ staffId: "sub-01", staffName: s.from, staffTitle: s.fromTitle, action: "approved", note: `${s.type} submitted for Finance Manager review.`, timestamp: s.submittedAt, isFinal: false }, { staffId: "fin-01", staffName: "Mrs. Maryam Kabiru Suleiman", staffTitle: "Finance Manager", action: "pending", note: "", timestamp: "", isFinal: true }] })}
        submissions={[
          { from: "Mr. Haruna Abubakar Wali", fromTitle: "Accountant", id: "REC-SEP-001", title: "August bank reconciliation: Access Bank", type: "Bank Reconciliation", submittedAt: "05 Sep 10:15", urgency: "high" },
          { from: "Mr. Haruna Abubakar Wali", fromTitle: "Accountant", id: "VOUCHER-441", title: "Payment voucher: Delta Freight Ltd ₦8.2m", type: "Payment Voucher", submittedAt: "05 Sep 14:00", urgency: "normal" },
          { from: "Mr. Haruna Abubakar Wali", fromTitle: "Accountant", id: "VAT-AUG-2026", title: "August VAT computation: requires correction", type: "Tax Computation", submittedAt: "28 Aug 16:30", urgency: "normal" },
        ]}
      />
      <ApprovalDetailModal item={teamDetailItem} onClose={() => setTeamDetailItem(null)} />

      <InvoiceDetailModal
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
      <SiteReportViewerModal
        open={showSiteReport}
        onClose={() => setShowSiteReport(false)}
      />
    </div>
  );
}

/* ─────────────────────────── QS / COMMERCIAL DASHBOARD ─────────────────────────── */

const boqStatus = [
  { project: "Abuja Housing Ph II", budget: 1380, actual: 994, committed: 138, forecast: 1350, margin: 30, variationsOpen: 3 },
  { project: "Gov't Office Complex", budget: 2150, actual: 452, committed: 215, forecast: 2100, margin: 50, variationsOpen: 1 },
  { project: "PH Logistics Warehouse", budget: 480, actual: 355, committed: 48, forecast: 472, margin: 8, variationsOpen: 0 },
];

const variations = [
  { id: "VAR-PRJ001-003", label: "Revised foundation design", value: 180_000_000, project: "Abuja Housing Ph II", status: "Awaiting Approval" },
  { id: "VAR-PRJ021-001", label: "MEP re-measure (+₦46m)", value: 46_000_000, project: "Gov't Office Complex", status: "Under Review" },
  { id: "VAR-PRJ001-002", label: "Block C scope extension", value: 34_500_000, project: "Abuja Housing Ph II", status: "Draft" },
];

export function QSDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const [teamDetailItem, setTeamDetailItem] = useState<ApprovalDetailItem | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const totalContract = boqStatus.reduce((s, r) => s + r.budget, 0);
  const totalActual = boqStatus.reduce((s, r) => s + r.actual, 0);

  return (
    <div className="space-y-6 animate-in">
      <HeadAssignTaskModal open={showAssign} onClose={() => setShowAssign(false)} officerRole="qs" officerName="Mr. Ismail Sule Waziri" headName="QS Haruna Sani Gombe" />
      <RoleHeader
        greeting="Good morning"
        name="QS Haruna Sani Gombe"
        title="Senior Quantity Surveyor"
        company="USV + CANONIC"
        date={today}
      />

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Total Contract Value" value="₦4.01bn" sub="3 active projects" icon={BarChart2} onClick={() => nav("portfolio")} />
        <MetricTile label="Actual Cost" value={naira(totalActual * 1_000_000)} sub={`${Math.round((totalActual / totalContract) * 100)}% of contract`} tone="neutral" icon={TrendingUp} />
        <MetricTile label="Variations Open" value="4" sub="₦260.5m exposure" tone="attention" icon={AlertTriangle} onClick={() => nav("approvals")} />
        <MetricTile label="Certs Pending" value="2" sub="awaiting payment" tone="attention" icon={FileText} onClick={() => nav("approvals")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Cost Performance Table */}
          <Card>
            <SectionHead title="Cost Performance: Budget vs Actual" hint="All active projects" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-panel text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5 text-left">Project</th>
                    <th className="px-4 py-2.5 text-right">Contract</th>
                    <th className="px-4 py-2.5 text-right">Actual</th>
                    <th className="px-4 py-2.5 text-right">Committed</th>
                    <th className="px-4 py-2.5 text-right">Forecast</th>
                    <th className="px-4 py-2.5 text-right">% Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {boqStatus.map((row) => {
                    const pctUsed = Math.round(((row.actual + row.committed) / row.budget) * 100);
                    const tone =
                      pctUsed > 90
                        ? "text-critical"
                        : pctUsed > 75
                          ? "text-attention"
                          : "text-healthy";
                    return (
                      <tr key={row.project} className="hover:bg-panel transition">
                        <td className="px-4 py-3 text-sm font-medium">{row.project}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">
                          ₦{row.budget}m
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">
                          ₦{row.actual}m
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-muted-foreground">
                          ₦{row.committed}m
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">
                          ₦{row.forecast}m
                        </td>
                        <td className={`px-4 py-3 text-right font-mono text-xs font-bold tabular-nums ${tone}`}>
                          {pctUsed}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Variations */}
          <Card>
            <SectionHead title="Variations & Claims" hint="Open variations" />
            <div className="divide-y divide-border">
              {variations.map((v) => (
                <div key={v.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{v.label}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                          {v.id} · {v.project}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono text-sm font-bold tabular-nums">
                          {naira(v.value)}
                        </p>
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                            v.status === "Awaiting Approval"
                              ? "bg-attention-bg text-attention"
                              : v.status === "Draft"
                                ? "bg-secondary text-muted-foreground"
                                : "bg-info-bg text-info"
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <TeamPendingPanel
            onNav={() => nav("action")}
            onView={(s) => setTeamDetailItem({ id: s.id, title: s.title, type: s.type, submitted: s.submittedAt, status: "in-review", requesterName: s.from, requesterTitle: s.fromTitle, directedBy: `${s.from}, ${s.fromTitle}`, chain: [{ staffId: "sub-01", staffName: s.from, staffTitle: s.fromTitle, action: "approved", note: `${s.type} submitted for Head QS review.`, timestamp: s.submittedAt, isFinal: false }, { staffId: "qs-01", staffName: "QS Haruna Sani Gombe", staffTitle: "Head Quantity Surveyor", action: "pending", note: "", timestamp: "", isFinal: true }] })}
            submissions={[
              { from: "Mr. Ismail Sule Waziri", fromTitle: "Quantity Surveyor", id: "BOQ-PRJ001-006", title: "Block C foundation BOQ: full measure", type: "Bill of Quantities", submittedAt: "05 Sep 14:30", urgency: "high" },
              { from: "Mr. Ismail Sule Waziri", fromTitle: "Quantity Surveyor", id: "MEAS-PH-047",    title: "Warehouse roof slab measurement sheet", type: "Measurement Sheet", submittedAt: "04 Sep 11:00", urgency: "normal" },
            ]}
          />
          <ApprovalDetailModal item={teamDetailItem} onClose={() => setTeamDetailItem(null)} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Project summaries */}
          <Card>
            <SectionHead title="Budget Utilisation" />
            <div className="divide-y divide-border">
              {boqStatus.map((row) => {
                const pct = Math.round(((row.actual + row.committed) / row.budget) * 100);
                const h = pct > 90 ? "critical" : pct > 75 ? "attention" : "healthy";
                return (
                  <div key={row.project} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium truncate">{row.project}</p>
                      <span className={`font-mono text-xs font-bold ${h === "critical" ? "text-critical" : h === "attention" ? "text-attention" : "text-healthy"}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${h === "critical" ? "bg-critical" : h === "attention" ? "bg-attention" : "bg-healthy"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      ₦{row.actual}m actual + ₦{row.committed}m committed
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Create BOQ", icon: FileText, fn: () => nav("documents") },
                { label: "Submit Variation", icon: TrendingUp, fn: () => show("Variation form opened. Complete in Approvals.", "info") },
                { label: "Issue Payment Certificate", icon: CheckCircle2, fn: () => show("Payment certificate draft created. Ref PCert-2026-003.", "success") },
                { label: "Run Cost Report", icon: BarChart2, fn: () => show("Cost report generating. Will be available in Documents in 2 minutes.", "info") },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={q.fn}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Assign Task to Officer */}
          <Card className="p-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Assign Task to Officer</p>
            <p className="mb-3 text-[10px] text-muted-foreground">Create a task for Mr. Ismail Sule Waziri — they will see it immediately in their Active Assignments.</p>
            <button
              onClick={() => setShowAssign(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              <ClipboardList className="h-3.5 w-3.5" /> Assign Task to Mr. Obi
            </button>
          </Card>
        </div>
        <div className="space-y-4">
          <TeamPerformanceCard officerName="Mr. Ismail Sule Waziri" officerRole="qs" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── SITE MANAGER DASHBOARD ─────────────────────────── */

const siteWorkplan = [
  { area: "Block C: Foundation", crew: 22, status: "In Progress", pct: 60 },
  { area: "Block A: Ground Floor Slab", crew: 18, status: "Completed", pct: 100 },
  { area: "Block B: Blockwork Level 1", crew: 14, status: "On Hold", pct: 35 },
  { area: "External Works: Drainage", crew: 8, status: "In Progress", pct: 45 },
];

const materialAlerts = [
  { item: "Y16 Reinforcement Bars", available: "8T", required: "42T", status: "critical" as const },
  { item: "Ordinary Portland Cement", available: "240 bags", required: "500 bags", status: "attention" as const },
  { item: "Sharp Sand", available: "12m³", required: "20m³", status: "attention" as const },
];

export function SiteDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const project = projects.find((p) => p.code === "PRJ-USV-2026-0015")!;
  const [siteReport, setSiteReport] = useState(false);
  const [matRequest, setMatRequest] = useState(false);
  const [issueLog, setIssueLog] = useState(false);
  const [photoUpload, setPhotoUpload] = useState(false);
  const [progressUpdate, setProgressUpdate] = useState(false);
  const [inspection, setInspection] = useState(false);

  const quickActions = [
    { label: "Site Report", icon: FileText, tone: "primary", hint: "+ Submit", open: () => setSiteReport(true) },
    { label: "Material Request", icon: Package, tone: "primary", hint: "+ Request", open: () => setMatRequest(true) },
    { label: "Log Issue", icon: ShieldAlert, tone: "critical", hint: "+ Issue", open: () => setIssueLog(true) },
    { label: "Site Photo", icon: Camera, tone: "primary", hint: "+ Upload", open: () => setPhotoUpload(true) },
    { label: "Progress Update", icon: TrendingUp, tone: "primary", hint: "+ Update", open: () => setProgressUpdate(true) },
    { label: "Inspection", icon: ClipboardList, tone: "primary", hint: "+ Start", open: () => setInspection(true) },
  ] as const;

  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="Engr. Jamilu Umar Sani"
        title="Site Manager"
        company="USV, Abuja Housing Phase II"
        date={today}
      />

      {/* Project context banner */}
      <div
        className="flex items-center justify-between rounded-[var(--radius)] border p-4"
        style={{ background: "#F5F7FA", borderColor: "#D9E2EC" }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Active Project
          </p>
          <p className="mt-0.5 font-display text-lg font-bold">
            {project.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {project.code} · {project.client} · {project.location}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="font-display text-2xl font-bold tabular-nums text-critical">
              {project.progressActual}%
            </p>
            <p className="text-[11px] text-muted-foreground">Actual Progress</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold tabular-nums text-muted-foreground">
              {project.progressPlanned}%
            </p>
            <p className="text-[11px] text-muted-foreground">Planned</p>
          </div>
          <StatusBadge h={project.health} />
          <button
            onClick={() => nav("project", project.code)}
            className="flex items-center gap-1.5 rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
          >
            Full Control Room <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <PriorityBanner items={[
        { text: "Reinforcement steel: 42T Y16/Y12 critical shortage. PO blocked for 2 days. Foundation works halted.", tone: "critical" },
      ]} />

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Today's Workforce" value="62" sub="personnel on site" icon={Users} onClick={() => nav("people")} trend={[48, 52, 55, 58, 60, 61, 62]} />
        <MetricTile label="Work Areas Active" value="3" sub="of 4 planned" tone="attention" icon={HardHat} trend={[4, 4, 3, 3, 3, 3, 3]} />
        <MetricTile label="Material Shortages" value="3" sub="items below threshold" tone="critical" icon={Package} onClick={() => nav("action")} />
        <MetricTile label="Open Safety Items" value="0" sub="all resolved" tone="healthy" icon={ShieldAlert} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Today's Work Plan */}
          <Card>
            <SectionHead title="Today's Work Plan" hint="06 September 2026" />
            <div className="divide-y divide-border">
              {siteWorkplan.map((w) => (
                <div key={w.area} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{w.area}</p>
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                          w.status === "Completed"
                            ? "bg-healthy-bg text-healthy"
                            : w.status === "On Hold"
                              ? "bg-critical-bg text-critical"
                              : "bg-info-bg text-info"
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${w.status === "Completed" ? "bg-healthy" : w.status === "On Hold" ? "bg-critical" : "bg-primary"}`}
                        style={{ width: `${w.pct}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                      <span>{w.pct}% complete</span>
                      <span>{w.crew} crew</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Material Alerts */}
          <Card>
            <SectionHead
              title="Material Availability"
              hint="Items below site threshold"
              action={
                <span className="rounded bg-critical-bg px-2 py-0.5 font-mono text-[10px] font-bold text-critical">
                  ACTION REQUIRED
                </span>
              }
            />
            <div className="divide-y divide-border">
              {materialAlerts.map((m) => (
                <div key={m.item} className="flex items-center gap-4 px-4 py-3">
                  <HealthDot h={m.status} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{m.item}</p>
                    <div className="mt-0.5 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                      <span>
                        On site:{" "}
                        <span className="text-critical font-semibold">{m.available}</span>
                      </span>
                      <span>Required: {m.required}</span>
                    </div>
                  </div>
                  <StatusBadge h={m.status} />
                </div>
              ))}
              <div className="px-4 py-3">
                <button
                  onClick={() => setMatRequest(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                >
                  Raise procurement request <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Site report status */}
          <Card>
            <SectionHead title="Site Reports" hint="This week" />
            <div className="divide-y divide-border">
              {[
                { date: "06 Sep", status: "Due Today", label: "SR-PRJ001-083", action: true },
                { date: "05 Sep", status: "Submitted", label: "SR-PRJ001-082" },
                { date: "04 Sep", status: "Approved", label: "SR-PRJ001-081" },
                { date: "03 Sep", status: "Approved", label: "SR-PRJ001-080" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{r.date}</p>
                    <p className="text-xs font-medium">{r.label}</p>
                  </div>
                  {r.action ? (
                    <button
                      onClick={() => setSiteReport(true)}
                      className="rounded bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                      Submit Now
                    </button>
                  ) : (
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        r.status === "Approved"
                          ? "bg-healthy-bg text-healthy"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {r.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* OFFICER DUTIES — Head assigns and tracks completion */}
          <HeadDutyAssignmentPanel headName="Engr. Jamilu Umar Sani" officerDuties={[
            { id: "H001", officerName: "Mr. Sa'adu Usman Garba", officerTitle: "Site Officer", task: "Record morning workforce muster: all gangs", time: "07:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Site Operations", done: true, completedAt: "07:05" },
            { id: "H002", officerName: "Mr. Sa'adu Usman Garba", officerTitle: "Site Officer", task: "Verify concrete pour readiness: Block C ground slab", time: "08:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Inspection", done: true, completedAt: "08:35" },
            { id: "H003", officerName: "Mr. Sa'adu Usman Garba", officerTitle: "Site Officer", task: "Incoming aggregate delivery inspection: Delta Freight 40T", time: "11:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Inspection", done: false },
            { id: "H004", officerName: "Mr. Sa'adu Usman Garba", officerTitle: "Site Officer", task: "Labour attendance sheet: compile and submit to supervisor", time: "18:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reporting", done: false },
            { id: "H005", officerName: "Mr. Sa'adu Usman Garba", officerTitle: "Site Officer", task: "Daily site report SR-PRJ001-083: submit to supervisor", time: "17:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reporting", done: false, comment: "Waiting for concrete cube test results before compiling" },
            { id: "H006", officerName: "Mr. Sa'adu Usman Garba", officerTitle: "Site Officer", task: "Pre-pour inspection checklist: Block B columns", time: "09:00", date: "05 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Inspection", done: true, completedAt: "09:20" },
            { id: "H007", officerName: "Mr. Sa'adu Usman Garba", officerTitle: "Site Officer", task: "Submit concrete cube test results to lab", time: "14:00", date: "05 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Documentation", done: true },
          ]} />

          {/* MY SITE TODAY — Quick Actions */}
          <Card>
            <div className="border-b border-border px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                My Site Today
              </p>
              <p className="text-[10px] text-muted-foreground">Three clicks to any field action</p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              {quickActions.map((q) => (
                <button
                  key={q.label}
                  onClick={q.open}
                  className={`flex flex-col items-center gap-2 rounded-[var(--radius)] border py-3 text-xs font-semibold transition ${
                    q.tone === "critical"
                      ? "border-critical/20 bg-critical-bg/50 text-critical hover:bg-critical-bg"
                      : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                >
                  <q.icon className="h-5 w-5" strokeWidth={1.6} />
                  <span>{q.label}</span>
                  <span className="font-mono text-[10px] opacity-70">{q.hint}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <SiteReportModal open={siteReport} onClose={() => setSiteReport(false)} onSuccess={() => show("Site report SR-PRJ001-083 submitted. Pending PM review.", "success")} />
      <MaterialRequestModal open={matRequest} onClose={() => setMatRequest(false)} onSuccess={() => show("Material request submitted. Routed for approval.", "success")} />
      <IssueLogModal open={issueLog} onClose={() => setIssueLog(false)} onSuccess={() => show("Issue logged and assigned. Site team notified.", "success")} />
      <PhotoUploadModal open={photoUpload} onClose={() => setPhotoUpload(false)} onSuccess={() => show("Site photos uploaded to project gallery", "success")} />
      <ProgressUpdateModal open={progressUpdate} onClose={() => setProgressUpdate(false)} onSuccess={() => show("Progress update recorded. Dashboard refreshed.", "success")} />
      <InspectionModal open={inspection} onClose={() => setInspection(false)} onSuccess={() => show("Inspection report submitted", "success")} />
    </div>
  );
}

/* ─────────────────────────── HR / ADMIN DASHBOARD ─────────────────────────── */

function SalaryGradeManagement() {
  const { show } = useToast();
  const [view, setView] = useState<"bands" | "audit" | "staff">("bands");
  const [editGrade, setEditGrade] = useState<string | null>(null);
  const [newMin, setNewMin] = useState("");
  const [newMax, setNewMax] = useState("");
  const [newDefault, setNewDefault] = useState("");
  const [editReason, setEditReason] = useState("");

  const formatSalary = (n: number) => `₦${(n / 1000).toFixed(0)}k`;

  return (
    <Card>
      <SectionHead title="Salary Grade Management" hint="S1–S7 bands · Full audit trail on every change" />
      <div className="border-b border-border">
        <div className="flex gap-4 px-4">
          {(["bands", "staff", "audit"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`border-b-2 py-2.5 text-xs font-semibold transition ${view === v ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {v === "bands" ? "Grade Bands" : v === "staff" ? "Staff Grades" : "Audit Trail"}
            </button>
          ))}
        </div>
      </div>

      {view === "bands" && (
        <div className="divide-y divide-border">
          {salaryGrades.map(g => (
            <div key={g.grade} className="px-4 py-3">
              {editGrade === g.grade ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">{g.grade}</span>
                    <span className="text-sm font-semibold">{g.title}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Min (₦/mo)</label>
                      <input value={newMin} onChange={e => setNewMin(e.target.value)} placeholder={`${g.minSalary}`} className="w-full rounded border border-border bg-panel px-2 py-1.5 text-xs focus:border-primary/50 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Max (₦/mo)</label>
                      <input value={newMax} onChange={e => setNewMax(e.target.value)} placeholder={`${g.maxSalary}`} className="w-full rounded border border-border bg-panel px-2 py-1.5 text-xs focus:border-primary/50 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Default (₦/mo)</label>
                      <input value={newDefault} onChange={e => setNewDefault(e.target.value)} placeholder={`${g.defaultSalary}`} className="w-full rounded border border-border bg-panel px-2 py-1.5 text-xs focus:border-primary/50 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Reason for Change <span className="text-critical">*</span></label>
                    <textarea value={editReason} onChange={e => setEditReason(e.target.value)} rows={2} placeholder="State the business reason for updating this grade band…" className="w-full rounded border border-border bg-panel px-2 py-2 text-xs focus:border-primary/50 focus:outline-none resize-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { if (!editReason.trim()) { show("Reason required.", "warning"); return; } show(`Grade ${g.grade} bands updated. Change logged in audit trail.`, "success"); setEditGrade(null); setEditReason(""); setNewMin(""); setNewMax(""); setNewDefault(""); }} className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">Save Changes</button>
                    <button onClick={() => { setEditGrade(null); setEditReason(""); setNewMin(""); setNewMax(""); setNewDefault(""); }} className="rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="w-8 rounded bg-primary/10 text-center font-mono text-xs font-bold text-primary py-0.5">{g.grade}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{g.title}</p>
                    <p className="text-[10px] text-muted-foreground">{g.description}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground">
                        Range: <span className="font-semibold text-foreground">{formatSalary(g.minSalary)} – {formatSalary(g.maxSalary)}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Default: <span className="font-semibold text-foreground">{formatSalary(g.defaultSalary)}</span>
                      </span>
                    </div>
                  </div>
                  <button onClick={() => { setEditGrade(g.grade); setNewMin(String(g.minSalary)); setNewMax(String(g.maxSalary)); setNewDefault(String(g.defaultSalary)); }} className="shrink-0 rounded border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition">
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "staff" && (
        <div className="divide-y divide-border">
          {staffMembers.filter(s => s.salaryGrade).slice(0, 10).map(s => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">{s.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">{s.title} · {s.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">{s.salaryGrade || "—"}</span>
                <span className="font-mono text-[10px] text-muted-foreground">₦{((s.monthlySalary || 0) / 1000).toFixed(0)}k/mo</span>
                <button onClick={() => show(`Opening salary override for ${s.name}…`, "info")} className="rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition">Override</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "audit" && (
        <div className="divide-y divide-border">
          {salaryAuditTrail.map(entry => (
            <div key={entry.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{entry.staffName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {entry.previousGrade} → {entry.newGrade} · ₦{(entry.previousSalary / 1000).toFixed(0)}k → ₦{(entry.newSalary / 1000).toFixed(0)}k/mo
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground italic">"{entry.reason}"</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Changed by {entry.changedBy} · {entry.date}</p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{entry.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function DelegationManagement() {
  const { show } = useToast();
  const [showGrant, setShowGrant] = useState(false);
  const [grantTo, setGrantTo] = useState("");
  const [grantPerm, setGrantPerm] = useState<string>("");
  const [grantReason, setGrantReason] = useState("");
  const [grantEndDate, setGrantEndDate] = useState("");
  const [grantConditions, setGrantConditions] = useState("");

  const activeDelegations = delegations.filter(d => d.active);

  return (
    <Card>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <div>
          <p className="font-display text-sm font-bold">Permission Delegation</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Grant specific authorities to officers in your department — with full audit trail</p>
        </div>
        <button onClick={() => setShowGrant(true)} className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
          + Grant Authority
        </button>
      </div>

      {activeDelegations.length > 0 ? (
        <div className="divide-y divide-border">
          {activeDelegations.map(d => (
            <div key={d.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="rounded bg-healthy-bg px-1.5 py-0.5 text-[9px] font-bold text-healthy uppercase tracking-wide">Active</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{d.id}</span>
                  </div>
                  <p className="text-xs font-semibold">{DELEGATION_PERMISSION_LABELS[d.permission]}</p>
                  <p className="text-[10px] text-muted-foreground">Delegated to: <span className="font-semibold">{d.toName}</span></p>
                  {d.conditions && <p className="mt-0.5 text-[10px] text-attention italic">{d.conditions}</p>}
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    From {d.startDate}{d.endDate ? ` to ${d.endDate}` : " (open-ended)"} · Granted {d.grantedAt}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Reason: {d.reason}</p>
                </div>
                <button
                  onClick={() => show(`Delegation ${d.id} revoked. ${d.toName} no longer has ${DELEGATION_PERMISSION_LABELS[d.permission]} authority.`, "warning")}
                  className="shrink-0 rounded border border-critical/30 px-2.5 py-1 text-[10px] font-medium text-critical hover:bg-critical-bg transition"
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 text-center">
          <Shield className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">No active delegations. Use "Grant Authority" to delegate specific permissions to your officers.</p>
        </div>
      )}

      {showGrant && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={() => setShowGrant(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-[14px] font-bold">Grant Permission to Officer</h2>
              <button onClick={() => setShowGrant(false)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Delegate To <span className="text-critical">*</span></label>
                <select value={grantTo} onChange={e => setGrantTo(e.target.value)} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                  <option value="">Select officer…</option>
                  {staffMembers.filter(s => ["architect","engineer","qs","procurement","project-coordinator","accountant","site","admin","ops","ict-admin"].includes(s.role || "")).map(s => (
                    <option key={s.id} value={s.name}>{s.name} — {s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Permission to Grant <span className="text-critical">*</span></label>
                <div className="space-y-1.5">
                  {Object.entries(DELEGATION_PERMISSION_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setGrantPerm(key)}
                      className={`flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-xs font-medium transition ${grantPerm === key ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground hover:border-border-strong"}`}
                    >
                      <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${grantPerm === key ? "text-primary" : "text-muted-foreground/40"}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Reason <span className="text-critical">*</span></label>
                <textarea value={grantReason} onChange={e => setGrantReason(e.target.value)} rows={2} placeholder="Why are you delegating this authority?" className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">End Date (Optional)</label>
                  <input type="date" value={grantEndDate} onChange={e => setGrantEndDate(e.target.value)} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Conditions (Optional)</label>
                  <input value={grantConditions} onChange={e => setGrantConditions(e.target.value)} placeholder="e.g. max 5 days leave only" className="w-full rounded border border-border bg-panel px-2 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button onClick={() => setShowGrant(false)} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button
                  onClick={() => {
                    if (!grantTo || !grantPerm || !grantReason.trim()) { show("Please fill all required fields.", "warning"); return; }
                    show(`Delegation granted to ${grantTo}. Audit trail recorded.`, "success");
                    setShowGrant(false); setGrantTo(""); setGrantPerm(""); setGrantReason(""); setGrantEndDate(""); setGrantConditions("");
                  }}
                  className="rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Grant Authority
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function DeptResponsibilitiesPanel() {
  const { show } = useToast();
  const [selected, setSelected] = useState<string>(deptResponsibilities[0]?.department ?? "");
  const [editMode, setEditMode] = useState(false);
  const current = deptResponsibilities.find(d => d.department === selected);

  return (
    <Card>
      <SectionHead title="Departmental Responsibilities" hint="Standard responsibilities per department — edit to customise" />
      <div className="border-b border-border px-4 pb-3 pt-3">
        <div className="flex flex-wrap gap-1.5">
          {deptResponsibilities.map(d => (
            <button
              key={d.department}
              onClick={() => { setSelected(d.department); setEditMode(false); }}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${selected === d.department ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
            >
              {d.department}
            </button>
          ))}
        </div>
      </div>
      {current && (
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">{current.directorate}</p>
              <p className="text-[10px] text-muted-foreground">Last updated by {current.lastUpdatedBy} · {current.lastUpdatedAt}</p>
            </div>
            <button onClick={() => setEditMode(!editMode)} className="rounded border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition">
              {editMode ? "Cancel Edit" : "Edit"}
            </button>
          </div>
          <ul className="space-y-2">
            {current.standard.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">{i + 1}</span>
                {editMode ? (
                  <input defaultValue={r} className="flex-1 rounded border border-border bg-panel px-2 py-1 text-xs focus:border-primary/50 focus:outline-none" />
                ) : (
                  <span className="text-xs leading-relaxed">{r}</span>
                )}
              </li>
            ))}
          </ul>
          {editMode && (
            <div className="mt-4 flex gap-2">
              <button onClick={() => { show(`Responsibilities for ${current.department} updated.`, "success"); setEditMode(false); }} className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">Save Changes</button>
              <button onClick={() => show("New responsibility line added.", "info")} className="rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">+ Add Line</button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function HRDashboard({ nav }: { nav: Nav }) {
  const [showNewStaff, setShowNewStaff] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter((s) => s.status === "active").length;
  const onLeave = staffMembers.filter((s) => s.status === "on-leave").length;
  const suspended = staffMembers.filter((s) => s.status === "suspended").length;
  const totalPayroll = staffMembers.reduce((sum, s) => sum + s.monthlySalary, 0);

  const dirBreakdown = [
    { label: "Governance", count: staffMembers.filter((s) => s.directorate === "governance").length },
    { label: "Projects Directorate", count: staffMembers.filter((s) => s.directorate === "projects").length },
    { label: "Technical Directorate", count: staffMembers.filter((s) => s.directorate === "technical").length },
    { label: "Corporate Services", count: staffMembers.filter((s) => s.directorate === "corporate").length },
  ];

  const overloadedStaff = staffMembers.filter((s) => s.workload >= 85).sort((a, b) => b.workload - a.workload);

  const recentActivity = staffTasks
    .filter((t) => t.department === "Administration & Human Resources")
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-in">
      <HeadAssignTaskModal open={showAssign} onClose={() => setShowAssign(false)} officerRole="admin" officerName="Miss Bola Adekunle" headName="Mrs. Zainab Umar Lawan" />
      <RoleHeader
        greeting="Good morning"
        name="Mrs. Zainab Umar Lawan"
        title="Head of Administration & HR"
        company="USV + CANONIC"
        date={today}
      />

      {/* Staff Management CTA Banner */}
      <div className="flex items-center justify-between rounded-[var(--radius)] border border-primary/25 bg-primary/5 p-5">
        <div>
          <p className="font-display text-base font-bold">People & Teams</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {totalStaff} staff · 4 directorates · 17 departments ·{" "}
            <span className="font-semibold text-healthy">{activeStaff} active</span>
            {onLeave > 0 && <> · <span className="font-semibold text-attention">{onLeave} on leave</span></>}
            {suspended > 0 && <> · <span className="font-semibold text-critical">{suspended} suspended</span></>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav("people")}
            className="flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            <Search className="h-4 w-4" /> Staff Directory
          </button>
          <button
            onClick={() => setShowNewStaff(true)}
            className="flex items-center gap-2 rounded bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Total Staff" value={String(totalStaff)} sub="across both companies" icon={Users} onClick={() => nav("people")} />
        <MetricTile label="Active" value={String(activeStaff)} sub="on duty today" tone="healthy" icon={CheckCircle2} onClick={() => nav("people")} />
        <MetricTile label="On Leave" value={String(onLeave)} sub="currently on leave" tone={onLeave > 0 ? "attention" : "neutral"} icon={Clock} onClick={() => nav("people")} />
        <MetricTile label="Sep Payroll" value={naira(totalPayroll)} sub="gross monthly salaries" tone="neutral" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Headcount by directorate */}
          <Card>
            <SectionHead
              title="Headcount by Directorate"
              hint={`${totalStaff} staff total`}
              action={
                <button
                  onClick={() => nav("people")}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Full directory <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {dirBreakdown.map((d) => (
                <button
                  key={d.label}
                  onClick={() => nav("people")}
                  className="flex w-full items-center gap-4 px-4 py-3 hover:bg-panel transition"
                >
                  <p className="w-40 text-left text-sm font-medium">{d.label}</p>
                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(d.count / totalStaff) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-sm font-bold tabular-nums">
                      {d.count}
                    </span>
                    <span className="w-8 text-right text-xs text-muted-foreground">
                      {Math.round((d.count / totalStaff) * 100)}%
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Card>

          {/* Staff quick access list */}
          <Card>
            <SectionHead
              title="Staff Quick Access"
              hint="Click any row to open full profile"
              action={
                <button
                  onClick={() => nav("people")}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  All {totalStaff} staff <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {staffMembers.slice(0, 7).map((s) => {
                const statusClass =
                  s.status === "active"
                    ? "bg-[#2f7d52]/12 text-[#2f7d52]"
                    : s.status === "on-leave"
                      ? "bg-[#b5820e]/12 text-[#b5820e]"
                      : s.status === "suspended"
                        ? "bg-[#b23120]/12 text-[#b23120]"
                        : "bg-info-bg text-info";
                const statusTxt =
                  s.status === "active"
                    ? "Active"
                    : s.status === "on-leave"
                      ? "On Leave"
                      : s.status === "suspended"
                        ? "Suspended"
                        : "Probation";
                return (
                  <button
                    key={s.id}
                    onClick={() => nav("people")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-panel"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{
                        background:
                          s.company === "USV"
                            ? "#1A3D8F"
                            : s.company === "CANONIC"
                              ? "#3580B5"
                              : "#345b8a",
                      }}
                    >
                      {s.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {s.title} · {s.department}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {s.employeeId}
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusClass}`}>
                        {statusTxt}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Recent HR tasks */}
          <Card>
            <SectionHead title="Recent HR & Admin Activity" hint="Assigned tasks and actions" />
            <div className="divide-y divide-border">
              {recentActivity.map((t) => {
                const assignee = staffMembers.find((s) => s.id === t.assigneeId);
                return (
                  <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                    <span
                      className={`mt-0.5 inline-block shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        t.priority === "urgent"
                          ? "bg-[#b23120]/12 text-[#b23120]"
                          : t.priority === "high"
                            ? "bg-[#b5820e]/12 text-[#b5820e]"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {t.priority.toUpperCase()[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium leading-snug">{t.title}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {assignee?.name ?? "Unassigned"} · Due {t.dueDate}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        t.status === "completed"
                          ? "bg-[#2f7d52]/12 text-[#2f7d52]"
                          : t.status === "overdue"
                            ? "bg-[#b23120]/12 text-[#b23120]"
                            : t.status === "in-progress"
                              ? "bg-info-bg text-info"
                              : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {t.status === "not-started"
                        ? "Not Started"
                        : t.status === "in-progress"
                          ? "In Progress"
                          : t.status === "completed"
                            ? "Done"
                            : "Overdue"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Employment mix */}
          <Card>
            <SectionHead title="Employment Mix" />
            <div className="space-y-3 p-4">
              {[
                {
                  label: "Permanent",
                  count: staffMembers.filter((s) => s.contractType === "permanent").length,
                  color: "bg-healthy",
                },
                {
                  label: "Contract",
                  count: staffMembers.filter((s) => s.contractType === "contract").length,
                  color: "bg-attention",
                },
                {
                  label: "Intern",
                  count: staffMembers.filter((s) => s.contractType === "intern").length,
                  color: "bg-info",
                },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="font-mono text-xs font-semibold">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${(count / totalStaff) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Workload alerts */}
          <Card>
            <SectionHead
              title="Workload Alerts"
              hint="Staff at or above 85%"
              action={
                <button
                  onClick={() => nav("people")}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {overloadedStaff.slice(0, 5).map((s) => (
                <button
                  key={s.id}
                  onClick={() => nav("people")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-panel"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{s.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{s.department}</p>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold ${s.workload >= 90 ? "text-critical" : "text-attention"}`}
                  >
                    {s.workload}%
                  </span>
                </button>
              ))}
              {overloadedStaff.length === 0 && (
                <p className="px-4 py-3 text-xs text-muted-foreground">All staff within normal workload range.</p>
              )}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => setShowNewStaff(true)}
                className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
              >
                <UserPlus className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                Add New Staff Member
              </button>
              {[
                { label: "Staff Directory", icon: Users, screen: "people" },
                { label: "Approve Leave Request", icon: Calendar, screen: "approvals" },
                { label: "Assign Task", icon: ClipboardList, screen: "people" },
                { label: "View Action Centre", icon: AlertTriangle, screen: "action" },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => nav(q.screen)}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Assign Task to Officer */}
          <Card className="p-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Assign Task to Officer</p>
            <p className="mb-3 text-[10px] text-muted-foreground">Create a task for Miss Bola Adekunle — they will see it immediately in their Active Assignments.</p>
            <button
              onClick={() => setShowAssign(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              <ClipboardList className="h-3.5 w-3.5" /> Assign Task to Miss Eze
            </button>
          </Card>
          <TeamPerformanceCard officerName="Miss Bola Adekunle" officerRole="admin" />
        </div>
      </div>
      <SalaryGradeManagement />
      <DelegationManagement />
      <DeptResponsibilitiesPanel />
      <NewStaffModal open={showNewStaff} onClose={() => setShowNewStaff(false)} />
    </div>
  );
}

/* ─────────────────────────── ADMIN OFFICER DASHBOARD ─────────────────────────── */

const adminOfficerTasks: AssignmentTask[] = [
  {
    id: "ADMIN-001",
    title: "Process leave applications — week ending 12 Sep",
    project: "HR Operations",
    due: "Today 17:00",
    priority: "high",
    description: "Review and process all pending leave applications submitted this week. You have been delegated authority to approve applications up to 5 days by the HR Head.",
    assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)",
    deliverables: [
      "Review each application against the leave balance records",
      "Approve or return applications within the 48-hour SLA",
      "Update the leave register and notify applicants",
    ],
    milestones: [
      { label: "Review all 4 pending applications", done: false },
      { label: "Cross-check leave balances", done: false },
      { label: "Issue decision letters", done: false },
    ],
    relatedDocs: ["LEAVE-POLICY-2026", "LEAVE-REG-SEP"],
  },
  {
    id: "ADMIN-002",
    title: "Prepare monthly welfare bulletin — September 2026",
    project: "Staff Communications",
    due: "10 Sep",
    priority: "normal",
    description: "Draft and distribute the September welfare bulletin covering birthday announcements, upcoming training, and welfare updates. Delegated authority from HR Head.",
    assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)",
    deliverables: [
      "Draft bulletin (Word document)",
      "Head approval before circulation",
      "Distribute via company email",
    ],
    milestones: [
      { label: "Collect content from departments", done: true },
      { label: "Draft bulletin", done: false },
      { label: "Submit to Head for sign-off", done: false },
    ],
    relatedDocs: ["WELFARE-TEMPLATE-2026"],
  },
  {
    id: "ADMIN-003",
    title: "Coordinate Q3 performance review scheduling",
    project: "HR Operations",
    due: "15 Sep",
    priority: "normal",
    description: "Send scheduling notices to all department heads for Q3 performance reviews. Compile the review timetable and share with the ED office.",
    assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)",
    deliverables: [
      "Performance review timetable (Excel)",
      "Departmental scheduling notices sent",
      "Timetable shared with ED office",
    ],
    milestones: [
      { label: "Prepare scheduling template", done: true },
      { label: "Send notices to all department heads", done: false },
      { label: "Compile and share final timetable", done: false },
    ],
    relatedDocs: ["PERF-REVIEW-Q3-TEMPLATE"],
  },
];

const adminOfficerSubmissions: OfficerSubmission[] = [
  { id: "HR-SUB-001", title: "Leave application — Mr. Hamza Ibrahim Danladi (2 days)", type: "Leave Approval", submittedDate: "Today", status: "pending-head" },
  { id: "HR-SUB-002", title: "August welfare bulletin — final draft", type: "Staff Communication", submittedDate: "05 Sep", status: "head-approved" },
  { id: "HR-SUB-003", title: "Leave application — Miss Ramatu Yusuf Waziri (sick leave, 3 days)", type: "Leave Approval", submittedDate: "04 Sep", status: "forwarded", forwardedTo: "Executive Director (Engr. Yahaya Abdullahi Bello)" },
];

const adminDuties: DutyEntry[] = [
  { id: "AD001", task: "Process 4 pending leave applications — review against policy and leave balances", time: "09:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Leave Management", assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)", recurring: "daily" },
  { id: "AD002", task: "Update onboarding tracker: 2 new joiners starting 09 Sep", time: "10:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Onboarding", assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)" },
  { id: "AD003", task: "Staff welfare check: follow up with overloaded staff (workload >85%)", time: "12:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Welfare", assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)", recurring: "weekly" },
  { id: "AD004", task: "File September HR correspondence and policy acknowledgement forms", time: "14:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Filing", assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)", recurring: "daily" },
  { id: "AD005", task: "Compile September HR report draft: headcount, leave stats, new joiners", time: "15:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reporting", assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)" },
  { id: "AD006", task: "Send welfare bulletin draft to HR Head for approval before circulation", time: "17:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Communication", assignedBy: "Mrs. Funmi Adeola (HR/Admin Head)" },
];

export function AdminOfficerDashboard({ nav }: { nav: Nav }) {
  const head = headDisplayMap["head-admin"]!;
  const [subDetail, setSubDetail] = useState<ApprovalDetailItem | null>(null);

  function buildDetail(s: OfficerSubmission): ApprovalDetailItem {
    return {
      id: s.id,
      title: s.title,
      type: s.type,
      submitted: s.submittedDate,
      status: s.status === "rejected" ? "rejected" : s.status === "forwarded" || s.status === "head-approved" ? "approved" : "in-review",
      notes: s.rejectionNote,
      chain: [
        { staffId: "self-admin", staffName: "Miss Bola Adekunle", staffTitle: "Admin Officer", action: "approved", note: "Processed and submitted.", timestamp: s.submittedDate, isFinal: false },
        { staffId: "head-admin-01", staffName: head.name, staffTitle: head.title, action: s.status === "pending-head" ? "pending" : s.status === "rejected" ? "rejected" : "approved", note: s.status !== "pending-head" ? "Reviewed by HR Head." : "", timestamp: s.status !== "pending-head" ? s.submittedDate : "", isFinal: !s.forwardedTo },
        ...(s.forwardedTo ? [{ staffId: "next-01", staffName: s.forwardedTo, staffTitle: "Next approver", action: "pending" as const, note: "", timestamp: "", isFinal: true }] : []),
      ],
    };
  }

  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={subDetail} onClose={() => setSubDetail(null)} />
      <RoleHeader greeting="Good morning" name="Miss Bola Adekunle" title="Admin Officer" company="USV Development Services" date={today} />
      <DelegationBanner role="admin" />
      <ApprovalFlowBanner headName={head.name} headTitle={head.title} nextParty="Executive Director" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Pending Actions" value="3" sub="tasks this week" icon={ClipboardList} tone="neutral" />
        <MetricTile label="Leave Applications" value="4" sub="awaiting review" tone="attention" icon={Calendar} onClick={() => nav("action")} />
        <MetricTile label="Processed Today" value="2" sub="within SLA" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Escalated" value="1" sub="forwarded to ED" tone="neutral" icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <OfficerTasksPanel tasks={adminOfficerTasks} officerRole="admin" officerName="Miss Bola Adekunle" officerRoleLabel="Admin Officer" />
          <OfficerSubmissionsPanel submissions={adminOfficerSubmissions} headName={head.name} onView={(s) => setSubDetail(buildDetail(s))} />
          <DutiesTodayPanel duties={adminDuties} headName={head.name} />
        </div>
        <div className="space-y-4">
          <OfficerQuickActions
            headName={head.name}
            requestTypes={["Leave Approval", "Staff Communication", "Onboarding Request", "Offboarding Notice", "Welfare Notice", "Policy Query", "Expense Claim", "Other"]}
            actions={[
              { label: "Process Leave Application", icon: Calendar, hint: "→ HR Head (if >5 days)" },
              { label: "Send Staff Communication", icon: Users, hint: "→ HR Head sign-off" },
              { label: "Submit Welfare Report", icon: FileText, hint: "→ HR Head" },
              { label: "Flag HR Issue", icon: AlertTriangle, hint: "→ HR Head immediately" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── PROCUREMENT DASHBOARD ─────────────────────────── */

const procPOs = [
  { id: "PO-USV-2026-0067", vendor: "Julius Steel Ltd", project: "Abuja Housing Ph II", amount: 63_400_000, status: "Issued", date: "02 Sep" },
  { id: "PO-USV-2026-0068", vendor: "Lagos Cement Factory", project: "Abuja Housing Ph II", amount: 18_750_000, status: "Pending Approval", date: "04 Sep" },
  { id: "PO-USV-2026-0065", vendor: "Delta Freight Ltd", project: "Gov't Office Complex", amount: 22_100_000, status: "Delivered", date: "29 Aug" },
  { id: "PO-USV-2026-0062", vendor: "Alumaco Nigeria Ltd", project: "Gov't Office Complex", amount: 44_500_000, status: "In Transit", date: "20 Aug" },
];

const rfqStatus = [
  { id: "RFQ-2026-0031", desc: "Cement supply: Abuja Housing", vendors: 3, closes: "08 Sep", status: "Open" },
  { id: "RFQ-2026-0030", desc: "Curtain wall: Gov't Office", vendors: 3, closes: "11 Sep", status: "Evaluation" },
  { id: "RFQ-2026-0029", desc: "Sanitary fittings: Abuja Housing", vendors: 2, closes: "01 Sep", status: "Closed" },
];

export function ProcurementDashboard({ nav }: { nav: Nav }) {
  const [showAllPOs, setShowAllPOs] = useState(false);
  const [teamDetailItem, setTeamDetailItem] = useState<ApprovalDetailItem | null>(null);
  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="Alhaji Sani Abubakar"
        title="Procurement Manager"
        company="USV"
        date={today}
      />

      <PriorityBanner items={[
        { text: "PR-USV-2026-0081: Reinforcement steel approval 2 days overdue. Site works halted. Requires immediate escalation.", tone: "critical" },
      ]} />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Active POs" value="8" sub="across all projects" icon={Package} onClick={() => nav("procurement")} trend={[5, 6, 6, 7, 7, 8, 8]} />
        <MetricTile label="Pending Approval" value="2" sub="awaiting sign-off" tone="attention" icon={AlertTriangle} onClick={() => nav("approvals")} />
        <MetricTile label="Open RFQs" value="3" sub="awaiting vendor response" icon={FileText} onClick={() => nav("procurement")} />
        <MetricTile label="Committed Value" value="₦401m" sub="total PO commitments" tone="neutral" icon={DollarSign} trend={[320, 335, 348, 362, 374, 389, 401]} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* PO list */}
          <Card>
            <SectionHead
              title="Purchase Orders"
              hint="Active and recent"
              action={
                <button
                  onClick={() => nav("procurement")}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  All POs <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {(showAllPOs ? procPOs : procPOs.slice(0, 3)).map((po) => (
                <button
                  key={po.id}
                  onClick={() => nav("procurement")}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-panel"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{po.vendor}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                          {po.id} · {po.project}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-sm font-bold tabular-nums">
                          {naira(po.amount)}
                        </p>
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                            po.status === "Pending Approval"
                              ? "bg-attention-bg text-attention"
                              : po.status === "Delivered"
                                ? "bg-healthy-bg text-healthy"
                                : po.status === "Issued"
                                  ? "bg-info-bg text-info"
                                  : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {po.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {procPOs.length > 3 && (
              <button
                onClick={() => setShowAllPOs((s) => !s)}
                className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                {showAllPOs ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {showAllPOs ? "Show less" : `Show ${procPOs.length - 3} more`}
              </button>
            )}
          </Card>

          {/* RFQ tracker */}
          <Card>
            <SectionHead title="RFQ Tracker" hint="Open and recent RFQs" />
            <div className="divide-y divide-border">
              {rfqStatus.map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{r.desc}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {r.id} · {r.vendors} vendor{r.vendors !== 1 ? "s" : ""} · Closes {r.closes}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      r.status === "Open"
                        ? "bg-info-bg text-info"
                        : r.status === "Evaluation"
                          ? "bg-attention-bg text-attention"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Vendor performance snapshot */}
          <Card>
            <SectionHead title="Vendor Summary" hint="Active vendors" />
            <div className="divide-y divide-border">
              {[
                { vendor: "Julius Steel Ltd", deliveries: 4, rating: "On Time", h: "healthy" as const },
                { vendor: "Lagos Cement Factory", deliveries: 2, rating: "Delayed once", h: "attention" as const },
                { vendor: "Delta Freight Ltd", deliveries: 6, rating: "Reliable", h: "healthy" as const },
              ].map((v) => (
                <div key={v.vendor} className="px-4 py-3">
                  <p className="text-xs font-semibold">{v.vendor}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge h={v.h}>{v.rating}</StatusBadge>
                    <span className="text-[10px] text-muted-foreground">{v.deliveries} deliveries</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Create New RFQ", icon: FileText, screen: "procurement" },
                { label: "Issue Purchase Order", icon: Package, screen: "procurement" },
                { label: "Approve PO", icon: CheckCircle2, screen: "approvals" },
                { label: "Vendor Evaluation", icon: BarChart2, screen: "procurement" },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => nav(q.screen)}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Team submissions pending Procurement Manager review */}
      <TeamPendingPanel
        onNav={() => nav("action")}
        onView={(s) => setTeamDetailItem({ id: s.id, title: s.title, type: s.type, submitted: s.submittedAt, status: "in-review", requesterName: s.from, requesterTitle: s.fromTitle, directedBy: `${s.from}, ${s.fromTitle}`, chain: [{ staffId: "sub-01", staffName: s.from, staffTitle: s.fromTitle, action: "approved", note: `${s.type} submitted for Procurement Manager review.`, timestamp: s.submittedAt, isFinal: false }, { staffId: "proc-mgr", staffName: "Alhaji Sani Abubakar", staffTitle: "Procurement Manager", action: "pending", note: "", timestamp: "", isFinal: true }] })}
        submissions={[
          { from: "Miss Ramatu Yusuf Waziri", fromTitle: "Procurement Officer", id: "RFQ-USV-2026-009", title: "RFQ evaluation: electrical cable supply (4 vendors)", type: "RFQ Evaluation", submittedAt: "05 Sep 15:30", urgency: "high" },
          { from: "Miss Ramatu Yusuf Waziri", fromTitle: "Procurement Officer", id: "PO-DRAFT-092", title: "Draft PO: cement supply 80T (₦6.4m)", type: "Purchase Order Draft", submittedAt: "03 Sep 11:00", urgency: "normal" },
          { from: "Miss Ramatu Yusuf Waziri", fromTitle: "Procurement Officer", id: "QUOTE-CMP-081", title: "Comparative analysis: scaffolding hire (3 vendors)", type: "Comparative Analysis", submittedAt: "29 Aug 14:00", urgency: "normal" },
        ]}
      />
      <ApprovalDetailModal item={teamDetailItem} onClose={() => setTeamDetailItem(null)} />
    </div>
  );
}

/* ─────────────────────────── BUSINESS DEVELOPMENT DASHBOARD ─────────────────────────── */

export function BDDashboard({ nav }: { nav: Nav }) {
  const activeTenders = tenders.slice(0, 4);

  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="BD & Operations"
        title="Business Development"
        company="USV + CANONIC"
        date={today}
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Active Tenders" value={String(tenders.length)} sub="in pipeline" icon={Globe} onClick={() => nav("business-dev")} />
        <MetricTile label="Submission Due" value="2" sub="within 30 days" tone="attention" icon={Clock} onClick={() => nav("business-dev")} />
        <MetricTile label="Pipeline Value" value="₦6.2bn" sub="tender total value" tone="neutral" icon={TrendingUp} onClick={() => nav("business-dev")} />
        <MetricTile label="Won (2026 YTD)" value="3" sub="contracts secured" tone="healthy" icon={CheckCircle2} onClick={() => nav("clients")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Tender pipeline */}
          <Card>
            <SectionHead title="Active Tender Pipeline" hint="Current tender submissions" />
            <div className="divide-y divide-border">
              {activeTenders.map((t) => (
                <button
                  key={t.id}
                  onClick={() => nav("command")}
                  className="flex w-full items-start gap-4 px-4 py-3.5 text-left transition hover:bg-panel"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                          {t.id} · {t.client}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-sm font-bold tabular-nums">
                          {naira(t.value)}
                        </p>
                        <span className="rounded bg-panel px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {t.stage}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>Closes: {t.deadline}</span>
                      <span>Probability: {t.probability}%</span>
                      <span>{t.daysLeft} days left</span>
                    </div>
                  </div>
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Card>

          {/* Bid schedule */}
          <Card>
            <SectionHead title="Upcoming Bid Milestones" hint="Next 45 days" />
            <div className="divide-y divide-border">
              {[
                { date: "15 Sep", label: "Federal Secretariat Annexe: tender submission deadline", status: "attention" as const },
                { date: "20 Sep", label: "Anambra Water Treatment Plant: bid bond deadline", status: "healthy" as const },
                { date: "05 Oct", label: "Enugu Science Park: pre-qualification submission", status: "healthy" as const },
                { date: "18 Oct", label: "Delta Bridge Rehabilitation: site visit", status: "healthy" as const },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-14 shrink-0 text-center">
                    <p className="font-mono text-xs font-bold">{m.date}</p>
                  </div>
                  <HealthDot h={m.status} />
                  <p className="flex-1 text-sm">{m.label}</p>
                  <StatusBadge h={m.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Stage funnel */}
          <Card>
            <SectionHead title="Pipeline by Stage" />
            <div className="divide-y divide-border">
              {[
                { stage: "Opportunity Identified", count: 3, color: "bg-info" },
                { stage: "Pre-qualification", count: 2, color: "bg-primary" },
                { stage: "Commercial Preparation", count: 2, color: "bg-attention" },
                { stage: "Submitted", count: 1, color: "bg-healthy" },
              ].map((s) => (
                <div key={s.stage} className="px-4 py-3">
                  <div className="mb-1 flex justify-between">
                    <p className="text-xs font-medium">{s.stage}</p>
                    <span className="font-mono text-xs font-bold">{s.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.count * 25}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "New Tender Submission", icon: FileText, screen: "command" },
                { label: "Update Pipeline", icon: TrendingUp, screen: "command" },
                { label: "Schedule Bid Review", icon: Calendar, screen: "action" },
                { label: "View All Tenders", icon: FolderOpen, screen: "command" },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => nav(q.screen)}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── OPERATIONS DASHBOARD ─────────────────────────── */

export function OpsDashboard({ nav, persona }: { nav: Nav; persona: { name: string; title: string; role: string } }) {
  const isOfficer = persona.role === "ops";
  const allStaff = staffMembers;
  const activeStaff = allStaff.filter(s => s.status === "active").length;
  const onLeave = allStaff.filter(s => s.status === "on-leave").length;
  const overloaded = allStaff.filter(s => s.workload >= 85).length;

  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name={persona.name}
        title={persona.title}
        company="USV + CANONIC"
        date={today}
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Active Projects" value={String(projects.length)} sub="group-wide" icon={FolderOpen} onClick={() => nav("portfolio")} />
        <MetricTile label="Active Staff" value={String(activeStaff)} sub="on duty today" tone="healthy" icon={Users} onClick={() => isOfficer ? undefined : nav("people")} />
        <MetricTile label="On Leave" value={String(onLeave)} sub="currently away" tone={onLeave > 0 ? "attention" : "neutral"} icon={Clock} onClick={() => isOfficer ? undefined : nav("people")} />
        <MetricTile label="Overloaded Staff" value={String(overloaded)} sub="above 85% workload" tone={overloaded > 0 ? "critical" : "neutral"} icon={AlertTriangle} onClick={() => isOfficer ? undefined : nav("people")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Project Status Overview */}
          <Card>
            <SectionHead
              title="Project Portfolio Status"
              hint="All active projects"
              action={<button onClick={() => nav("portfolio")} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">View all <ArrowRight className="h-3 w-3" /></button>}
            />
            <div className="divide-y divide-border">
              {projects.slice(0, 5).map(p => (
                <button
                  key={p.code}
                  onClick={() => nav("portfolio")}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-panel"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{p.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{p.company} · {p.client}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="mb-1 flex items-center gap-2 justify-end">
                      <span className="text-xs font-mono font-semibold text-foreground">{p.progressActual}%</span>
                    </div>
                    <div className="h-1 w-20 overflow-hidden rounded-full bg-secondary">
                      <div className={`h-full rounded-full ${p.health === "healthy" ? "bg-healthy" : p.health === "attention" ? "bg-attention" : "bg-critical"}`} style={{ width: `${p.progressActual}%` }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Operations tasks */}
          <Card>
            <SectionHead title="Operations Actions" hint="My current tasks" action={<button onClick={() => nav("action")} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">All actions <ArrowRight className="h-3 w-3" /></button>} />
            <div className="divide-y divide-border">
              {[
                { ref: "OPS-2026-041", task: "Fleet utilisation review: September allocations across all sites", due: "Today", priority: "high" as const },
                { ref: "OPS-2026-039", task: "Facilities inspection: Lagos office HVAC maintenance scheduling", due: "12 Sep", priority: "medium" as const },
                { ref: "OPS-2026-038", task: "Logistics coordination: Abuja Housing Phase II — cement delivery tracking", due: "11 Sep", priority: "medium" as const },
                { ref: "OPS-2026-036", task: "H&S compliance check: PPE stock audit across all USV sites", due: "15 Sep", priority: "low" as const },
              ].map(t => (
                <button key={t.ref} onClick={() => nav("action")} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-panel">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold">{t.task}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground font-mono">{t.ref} · Due {t.due}</p>
                  </div>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${t.priority === "high" ? "bg-critical-bg text-critical" : t.priority === "medium" ? "bg-attention-bg text-attention" : "bg-secondary text-muted-foreground"}`}>
                    {t.priority}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {!isOfficer && (
            <Card>
              <SectionHead title="Staff Workload" hint="Resource snapshot" action={<button onClick={() => nav("people")} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">Directory <ArrowRight className="h-3 w-3" /></button>} />
              <div className="divide-y divide-border">
                {allStaff.filter(s => s.workload >= 80).sort((a,b) => b.workload - a.workload).slice(0, 5).map(s => (
                  <button key={s.id} onClick={() => nav("people")} className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-panel">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{s.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{s.department}</p>
                    </div>
                    <span className={`font-mono text-xs font-bold ${s.workload >= 90 ? "text-critical" : "text-attention"}`}>{s.workload}%</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Quick Actions</p>
            <div className="space-y-1.5">
              {[
                { label: "View Project Portfolio", icon: FolderOpen, screen: "portfolio" },
                ...(isOfficer ? [] : [
                  { label: "Staff Directory", icon: Users, screen: "people" },
                  { label: "Schedule Meeting", icon: Calendar, screen: "meetings" },
                ]),
                { label: "Action Centre", icon: AlertTriangle, screen: "action" },
              ].map(q => (
                <button key={q.label} onClick={() => nav(q.screen)} className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5">
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── AUDIT DASHBOARD ─────────────────────────── */

export function AuditDashboard({ nav }: { nav: Nav }) {
  const auditTasks = staffTasks.filter((t) => t.department === "Internal Audit & Compliance");

  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="Mr. Lanre Adebayo"
        title="Internal Auditor"
        company="USV + CANONIC"
        date={today}
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Open Findings" value="4" sub="audit observations" tone="attention" icon={AlertTriangle} onClick={() => nav("audit")} />
        <MetricTile label="Active Audits" value="2" sub="in fieldwork phase" icon={ShieldCheck} onClick={() => nav("audit")} />
        <MetricTile label="Resolved (YTD)" value="11" sub="findings closed" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Compliance Score" value="86%" sub="overall group rating" tone="healthy" icon={BarChart2} onClick={() => nav("audit")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Active audits */}
          <Card>
            <SectionHead title="Active Audit Engagements" hint="Current fieldwork" />
            <div className="divide-y divide-border">
              {[
                {
                  title: "Procurement Process Audit: Q3 2026",
                  scope: "Vendor selection, PO approvals, delivery verification",
                  phase: "Fieldwork",
                  dueDate: "30 Sep 2026",
                  risk: "attention" as const,
                  findings: 2,
                },
                {
                  title: "Payroll & Compensation Audit: Sep 2026",
                  scope: "Salary computation, bank details accuracy, deductions",
                  phase: "Planning",
                  dueDate: "31 Oct 2026",
                  risk: "healthy" as const,
                  findings: 0,
                },
              ].map((a, i) => (
                <div key={i} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{a.scope}</p>
                    </div>
                    <StatusBadge h={a.risk} />
                  </div>
                  <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
                    <span>Phase: {a.phase}</span>
                    <span>Due: {a.dueDate}</span>
                    {a.findings > 0 && (
                      <span className="text-attention font-semibold">{a.findings} finding{a.findings !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Findings register */}
          <Card>
            <SectionHead title="Open Audit Findings" hint="Awaiting management response" />
            <div className="divide-y divide-border">
              {[
                { ref: "AUD-2026-014", desc: "PR-USV-2026-0079: vendor selection documentation incomplete", area: "Procurement", severity: "critical" as const, age: 12 },
                { ref: "AUD-2026-013", desc: "Petty cash reconciliation: 3 missing receipts Jul 2026", area: "Finance", severity: "attention" as const, age: 18 },
                { ref: "AUD-2026-012", desc: "Subcontractor variation approval: missing second signatory", area: "Projects", severity: "attention" as const, age: 24 },
                { ref: "AUD-2026-010", desc: "Obsolete user accounts not deactivated: 2 instances", area: "ICT", severity: "attention" as const, age: 35 },
              ].map((f) => (
                <div key={f.ref} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium leading-snug">{f.desc}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {f.ref} · {f.area} · Open {f.age} days
                      </p>
                    </div>
                    <StatusBadge h={f.severity} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* My audit tasks */}
          <Card>
            <SectionHead title="My Assigned Tasks" />
            <div className="divide-y divide-border">
              {auditTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                  <span
                    className={`mt-0.5 inline-block shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      t.priority === "urgent"
                        ? "bg-[#b23120]/12 text-[#b23120]"
                        : "bg-[#b5820e]/12 text-[#b5820e]"
                    }`}
                  >
                    {t.priority.toUpperCase()[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug">{t.title}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">Due {t.dueDate}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      t.status === "completed"
                        ? "bg-[#2f7d52]/12 text-[#2f7d52]"
                        : t.status === "in-progress"
                          ? "bg-info-bg text-info"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {t.status === "in-progress" ? "In Progress" : t.status === "completed" ? "Done" : "Not Started"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Compliance overview */}
          <Card>
            <SectionHead title="Compliance Overview" />
            <div className="divide-y divide-border">
              {[
                { area: "Procurement", score: 82, h: "attention" as const },
                { area: "Finance & Accounts", score: 91, h: "healthy" as const },
                { area: "HR & Administration", score: 88, h: "healthy" as const },
                { area: "Project Controls", score: 79, h: "attention" as const },
                { area: "ICT & Systems", score: 85, h: "healthy" as const },
              ].map((c) => (
                <div key={c.area} className="px-4 py-3">
                  <div className="mb-1 flex justify-between">
                    <p className="text-xs font-medium">{c.area}</p>
                    <span className={`font-mono text-xs font-bold ${c.h === "healthy" ? "text-healthy" : "text-attention"}`}>
                      {c.score}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${c.h === "healthy" ? "bg-healthy" : "bg-attention"}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Raise Audit Finding", icon: AlertTriangle, screen: "action" },
                { label: "Review Procurement Docs", icon: FileText, screen: "procurement" },
                { label: "Approval Register", icon: CheckCircle2, screen: "approvals" },
                { label: "Staff Access Review", icon: Users, screen: "people" },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => nav(q.screen)}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ICT / ERP ADMIN DASHBOARD ─────────────────────────── */

export function ICTDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const totalAccounts = staffMembers.length;
  const loggedInToday = staffMembers.filter((s) => s.lastLogin.startsWith("Today")).length;
  const ictTasks = staffTasks.filter((t) => t.department === "ICT, ERP & Systems Administration");

  const [provisionQueue, setProvisionQueue] = useState<ProvisionRecord[]>([
    { name: "Engr. Haruna Abubakar Wali", action: "Provision", reason: "New hire: Site Engineer, USV", ref: "ONB-2026-018", since: "Today", role: "Site Engineer", department: "Technical Services" },
    { name: "Miss Bola Adekunle", action: "Deactivate", reason: "Resignation effective 05 Sep: Procurement Officer", ref: "OFB-2026-007", since: "Yesterday", role: "Procurement Officer", department: "Procurement" },
    { name: "Mr. Bola Akinyemi", action: "Access Review", reason: "Audit finding AUD-2026-010: account inactive 35 days", ref: "AUD-2026-010", since: "35 days ago", role: "Consultant", department: "Finance" },
  ]);
  const [selectedProvision, setSelectedProvision] = useState<ProvisionRecord | null>(null);
  const [showNewStaff, setShowNewStaff] = useState(false);

  const [showAllEvents, setShowAllEvents] = useState(false);
  const [tickets, setTickets] = useState<TicketRecord[]>([
    { id: "TKT-0142", user: "Engr. Musa Usman Lawan", issue: "Cannot generate monthly progress report. PDF export fails.", category: "ERP Report", status: "Open", raised: "Today, 07:30" },
    { id: "TKT-0141", user: "Mrs. Zainab Umar Lawan", issue: "Staff profile photo upload not saving changes", category: "ERP Account", status: "In Progress", raised: "Yesterday" },
    { id: "TKT-0140", user: "QS Haruna Sani Gombe", issue: "BOQ import template throwing validation error on row 42", category: "ERP Import", status: "Open", raised: "04 Sep" },
    { id: "TKT-0139", user: "Engr. Jamilu Umar Sani", issue: "Mobile app offline sync not working on site; intermittent", category: "Mobile / Connectivity", status: "Escalated", raised: "03 Sep" },
  ]);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);

  const systemEvents = [
    { time: "Today, 09:12", event: "Failed login: 3 attempts from unknown device", user: "s-11 (Musa Abdullahi)", type: "security" },
    { time: "Today, 08:45", event: "Permission elevated: Procurement module read/write granted", user: "Haruna Ibrahim Kure (ICT Admin)", type: "access" },
    { time: "Today, 08:30", event: "New user account provisioned", user: "Engr. Jamilu Umar Sani → Site Engineer role", type: "provision" },
    { time: "Yesterday, 23:00", event: "Automated database backup completed", user: "System", type: "system" },
    { time: "Yesterday, 17:10", event: "Bulk export: full staff payroll report", user: "Mrs. Maryam Kabiru Suleiman (Finance)", type: "export" },
  ];

  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="Mr. Haruna Ibrahim Kure"
        title="ICT & ERP Administrator"
        company="USV + CANONIC"
        date={today}
      />

      <PriorityBanner items={[
        { text: "Security alert: 3 failed login attempts from unknown device on account s-11. Requires immediate review.", tone: "critical" },
      ]} />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="NEXUS Accounts" value={String(totalAccounts)} sub="provisioned user accounts" icon={Users} onClick={() => nav("people")} trend={[40, 41, 42, 43, 44, 44, 45]} />
        <MetricTile label="Active Today" value={String(loggedInToday)} sub="staff logged in today" tone="healthy" icon={Wifi} trend={[28, 31, 30, 33, 29, 32, 34]} />
        <MetricTile label="Provisioning Queue" value={String(provisionQueue.length)} sub="access actions pending" tone="attention" icon={UserPlus} />
        <MetricTile label="Open IT Tickets" value={String(tickets.filter((t) => t.status !== "Resolved").length)} sub="unresolved support requests" tone="attention" icon={ShieldAlert} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">

          {/* Access Provisioning Queue */}
          <Card>
            <SectionHead
              title="Access Provisioning Queue"
              hint="Pending account actions"
              action={
                <button onClick={() => nav("people")} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  User directory <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {provisionQueue.map((item) => (
                <div key={item.ref} className="flex items-start gap-3 px-4 py-3">
                  <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    item.action === "Deactivate"
                      ? "bg-critical-bg text-critical"
                      : item.action === "Access Review"
                        ? "bg-attention-bg text-attention"
                        : "bg-info-bg text-info"
                  }`}>
                    {item.action.toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.reason}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{item.ref} · Pending since {item.since}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProvision(item)}
                    className="shrink-0 rounded border border-border px-2.5 py-1 text-[11px] font-medium transition hover:border-primary hover:text-primary"
                  >
                    Action
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* IT Support Tickets */}
          <Card>
            <SectionHead
              title="IT Support Tickets"
              hint="ERP and infrastructure issues"
              action={
                <span className="rounded-full bg-attention-bg px-2.5 py-0.5 text-[10px] font-bold text-attention">
                  {tickets.filter(t => t.status !== "Resolved").length} open
                </span>
              }
            />
            <div className="divide-y divide-border">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="group w-full px-4 py-3 text-left transition hover:bg-panel"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{t.category}</span>
                      </div>
                      <p className="mt-0.5 text-sm font-medium leading-snug group-hover:text-primary">{t.issue}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{t.user} · {t.raised}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      t.status === "Open" ? "bg-attention-bg text-attention"
                      : t.status === "In Progress" ? "bg-info-bg text-info"
                      : t.status === "Escalated" ? "bg-critical-bg text-critical"
                      : "bg-healthy-bg text-healthy"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent System Events */}
          <Card>
            <SectionHead title="Recent System Events" hint="Security and activity log" />
            <div className="divide-y divide-border">
              {(showAllEvents ? systemEvents : systemEvents.slice(0, 3)).map((e, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                  <span className={`mt-0.5 shrink-0 h-2 w-2 rounded-full ${
                    e.type === "security" ? "bg-critical"
                    : e.type === "access" ? "bg-attention"
                    : e.type === "export" ? "bg-info"
                    : "bg-border-strong"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{e.event}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{e.user} · {e.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {systemEvents.length > 3 && (
              <button
                onClick={() => setShowAllEvents((s) => !s)}
                className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                {showAllEvents ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {showAllEvents ? "Show less" : `Show ${systemEvents.length - 3} more`}
              </button>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {/* NEXUS Module Status */}
          <Card>
            <SectionHead title="NEXUS Module Status" hint="Live system health" />
            <div className="divide-y divide-border">
              {[
                { module: "Project Portfolio", status: "Operational", uptime: "99.9%" },
                { module: "Finance & Accounts", status: "Operational", uptime: "100%" },
                { module: "Procurement", status: "Operational", uptime: "99.8%" },
                { module: "People & Teams", status: "Operational", uptime: "99.9%" },
                { module: "Document Control", status: "Operational", uptime: "100%" },
                { module: "Approval Workflows", status: "Operational", uptime: "99.7%" },
              ].map((m) => (
                <div key={m.module} className="flex items-center justify-between px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{m.module}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Uptime {m.uptime}</p>
                  </div>
                  <span className="ml-2 shrink-0 rounded-full bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Infrastructure Health */}
          <Card>
            <SectionHead title="Infrastructure" hint="Server and backup status" />
            <div className="divide-y divide-border">
              {[
                { label: "Database Server", value: "Online", sub: "Response: 42ms avg", h: "healthy" as const },
                { label: "Last DB Backup", value: "Completed", sub: "Yesterday, 23:00", h: "healthy" as const },
                { label: "Storage Used", value: "64%", sub: "512 GB of 800 GB", h: "attention" as const },
                { label: "SSL Certificate", value: "Valid", sub: "Expires 14 Feb 2027", h: "healthy" as const },
                { label: "30-Day Uptime", value: "99.8%", sub: "12 min downtime total", h: "healthy" as const },
              ].map((item) => (
                <div key={item.label} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">{item.label}</p>
                    <span className={`font-mono text-xs font-bold ${item.h === "healthy" ? "text-healthy" : "text-attention"}`}>
                      {item.value}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* My ICT Tasks */}
          <Card>
            <SectionHead title="My Tasks" />
            <div className="divide-y divide-border">
              {ictTasks.length > 0 ? ictTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                  <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    t.status === "completed" ? "bg-healthy-bg text-healthy"
                    : t.status === "in-progress" ? "bg-info-bg text-info"
                    : "bg-secondary text-muted-foreground"
                  }`}>
                    {t.status === "completed" ? "Done" : t.status === "in-progress" ? "WIP" : "Todo"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug">{t.title}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">Due {t.dueDate}</p>
                  </div>
                </div>
              )) : (
                <p className="px-4 py-4 text-xs text-muted-foreground">No tasks assigned.</p>
              )}
            </div>
          </Card>

          {/* ICT Quick Actions */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Quick Actions</p>
            <div className="space-y-1.5">
              {[
                { label: "New User Account", icon: UserPlus, fn: () => setShowNewStaff(true) },
                { label: "Reset User Password", icon: Shield, fn: () => show("Password reset link sent to user's registered email", "success") },
                { label: "Deactivate Account", icon: LogOut, fn: () => show("Select a user from the provisioning queue to deactivate", "info") },
                { label: "Run Access Audit", icon: ShieldAlert, fn: () => show("Access audit report queued. Will be ready in 5 minutes.", "info") },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={q.fn}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <TicketModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onUpdate={(id, newStatus) => {
          setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
          setSelectedTicket(null);
        }}
      />
      <ProvisionModal
        open={!!selectedProvision}
        onClose={() => setSelectedProvision(null)}
        item={selectedProvision}
        onConfirm={(ref) => {
          setProvisionQueue(prev => prev.filter(p => p.ref !== ref));
          setSelectedProvision(null);
        }}
      />
      <NewStaffModal open={showNewStaff} onClose={() => setShowNewStaff(false)} />
    </div>
  );
}

/* ─────────────────────────── DOC CONTROLLER DASHBOARD ─────────────────────────── */

export function DocDashboard({ nav }: { nav: Nav }) {
  return (
    <div className="space-y-6 animate-in">
      <RoleHeader
        greeting="Good morning"
        name="Mrs. Yetunde Adesanya"
        title="Project Document Controller"
        company="USV + CANONIC"
        date={today}
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Total Drawings" value="442" sub="in register" icon={FileText} />
        <MetricTile label="Pending Review" value="6" sub="awaiting approval" tone="attention" icon={AlertTriangle} />
        <MetricTile label="Issued This Week" value="14" sub="new transmittals" icon={Layers} />
        <MetricTile label="Overdue Returns" value="2" sub="for comment" tone="critical" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Drawing register */}
          <Card>
            <SectionHead
              title="Drawing Register: Recent"
              hint="Last 7 days activity"
              action={
                <button
                  onClick={() => nav("documents")}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Full register <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            <div className="divide-y divide-border">
              {[
                { id: "DWG-USV-0514", title: "Block C Foundation Layout, Rev D", project: "Abuja Housing Ph II", status: "Issued for Construction", date: "05 Sep" },
                { id: "DWG-CAN-0442", title: "Ground Floor GA, Rev C", project: "Lagos Commercial Dev.", status: "Awaiting Review", date: "04 Sep" },
                { id: "DWG-USV-0513", title: "Roof Plan, Block A Rev 02", project: "Abuja Housing Ph II", status: "Approved", date: "03 Sep" },
                { id: "DWG-CAN-0441", title: "Structural Layout, Rev B", project: "Lagos Commercial Dev.", status: "Returned for Revision", date: "02 Sep" },
                { id: "DWG-USV-0510", title: "Drainage Layout, Phase II Ext", project: "Abuja Housing Ph II", status: "For Review", date: "01 Sep" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => nav("documents")}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-panel"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{d.title}</p>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                          d.status === "Approved" || d.status === "Issued for Construction"
                            ? "bg-healthy-bg text-healthy"
                            : d.status === "Returned for Revision"
                              ? "bg-critical-bg text-critical"
                              : d.status === "Awaiting Review" || d.status === "For Review"
                                ? "bg-attention-bg text-attention"
                                : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {d.id} · {d.project} · {d.date}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Transmittal log */}
          <Card>
            <SectionHead title="Recent Transmittals" hint="Document transmittals issued" />
            <div className="divide-y divide-border">
              {[
                { id: "TRN-2026-0088", to: "FHA Technical Team", count: 4, project: "Abuja Housing Ph II", date: "04 Sep" },
                { id: "TRN-2026-0087", to: "Julius Steel Ltd (RFI)", count: 2, project: "Abuja Housing Ph II", date: "03 Sep" },
                { id: "TRN-2026-0086", to: "Landmark Properties Ltd", count: 3, project: "Lagos Commercial Dev.", date: "02 Sep" },
              ].map((t) => (
                <div key={t.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">To: {t.to}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {t.id} · {t.count} document{t.count !== 1 ? "s" : ""} · {t.project} · {t.date}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* By project */}
          <Card>
            <SectionHead title="Drawings by Project" />
            <div className="divide-y divide-border">
              {[
                { name: "Abuja Housing Ph II", company: "USV + CANONIC", count: 118 },
                { name: "Lagos Commercial Dev.", company: "CANONIC", count: 86 },
                { name: "Gov't Office Complex", company: "USV + CANONIC", count: 74 },
                { name: "PH Logistics Warehouse", company: "USV", count: 52 },
              ].map((p) => (
                <button
                  key={p.name}
                  onClick={() => nav("documents")}
                  className="flex w-full items-center justify-between px-4 py-3 transition hover:bg-panel"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-xs font-semibold">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.company}</p>
                  </div>
                  <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
                    {p.count}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Upload Drawing", icon: FileText, screen: "documents" },
                { label: "Issue Transmittal", icon: ArrowRight, screen: "documents" },
                { label: "Full Document Register", icon: FolderOpen, screen: "documents" },
                { label: "Pending Reviews", icon: AlertTriangle, screen: "approvals" },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => nav(q.screen)}
                  className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                >
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ROUTER ─────────────────────────── */

/* ═══════════════════════════════════════════════════════════════════════════
   EXECUTIVE DASHBOARDS
   Five distinct command views — each scoped to the executive's mandate.
   Chairman: board governance   GMD: full group command (CommandCentre in screens.tsx)
   GED: projects delivery       ED: corporate services      GGMP: group operations
   ═══════════════════════════════════════════════════════════════════════════ */

const execToday = "Sunday, 06 September 2026";

/* ─── Shared exec line-chart component ─── */

const MONTHS_9 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

interface ChartLine {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
}

function ExecLineChart({
  data,
  lines,
  height = 210,
  yFormatter,
  referenceY,
  referenceLabel,
}: {
  data: Record<string, string | number>[];
  lines: ChartLine[];
  height?: number;
  yFormatter?: (v: number) => string;
  referenceY?: number;
  referenceLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: -4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.55} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={yFormatter ?? ((v: number) => String(v))}
          width={42}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 11,
            padding: "8px 12px",
          }}
          labelStyle={{ color: "var(--muted-foreground)", fontWeight: 700, marginBottom: 4 }}
          itemStyle={{ color: "var(--foreground)", padding: "1px 0" }}
          formatter={(value) => [yFormatter && typeof value === "number" ? yFormatter(value) : value, ""]}
        />
        {lines.length > 1 && (
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 10, paddingTop: 10, color: "var(--muted-foreground)" }}
          />
        )}
        {referenceY !== undefined && (
          <ReferenceLine
            y={referenceY}
            stroke="var(--attention)"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: referenceLabel ?? "Target", fontSize: 9, fill: "var(--attention)", position: "insideTopRight" }}
          />
        )}
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label}
            stroke={l.color}
            strokeWidth={2}
            dot={{ r: 3.5, strokeWidth: 0, fill: l.color }}
            activeDot={{ r: 5.5, strokeWidth: 1.5, stroke: "var(--card)" }}
            strokeDasharray={l.dashed ? "5 4" : undefined}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─── Chart data sets ─── */

// Chairman: group revenue & expenditure (₦m)
const chairmanFinancialData = MONTHS_9.map((month, i) => ({
  month,
  Revenue:     [180, 220, 195, 340, 280, 420, 380, 290, 460][i],
  Expenditure: [145, 178, 162, 290, 245, 378, 312, 265, 398][i],
}));

// Chairman: receivables position (₦m)
const chairmanReceivablesData = MONTHS_9.map((month, i) => ({
  month,
  "Total Receivables": [620, 680, 710, 750, 790, 820, 840, 850, 850][i],
  "Overdue (>60 days)": [85, 120, 140, 160, 180, 220, 240, 260, 280][i],
}));

// GED: portfolio progress planned vs actual (%)
const gedProgressData = MONTHS_9.map((month, i) => ({
  month,
  "Planned %": [8, 15, 22, 30, 38, 46, 55, 63, 70][i],
  "Actual %":  [7, 13, 19, 26, 33, 40, 48, 56, 62][i],
}));

// GED: variation exposure by month (₦m cumulative)
const gedVariationData = MONTHS_9.map((month, i) => ({
  month,
  "Approved (₦m)":    [0, 12, 28, 45, 68, 95, 118, 148, 172][i],
  "Pending (₦m)":     [0, 0,  15, 22, 35, 48, 68,   88, 261][i],
}));

// ED: monthly payroll (₦m)
const edPayrollData = MONTHS_9.map((month, i) => ({
  month,
  "Payroll (₦m)": [4.2, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.7, 4.8][i],
}));

// ED: group compliance score (%) by month
const edComplianceData = MONTHS_9.map((month, i) => ({
  month,
  "Compliance %": [72, 74, 76, 78, 78, 80, 82, 84, 83][i],
}));

// GGMP: business pipeline value (₦bn) and win rate (%)
const ggmpPipelineData = MONTHS_9.map((month, i) => ({
  month,
  "Pipeline (₦bn)": [6.2, 6.8, 7.1, 7.8, 8.2, 8.9, 9.1, 9.4, 9.89][i],
  "Win Rate %":      [30,  32,  35,  33,  36,  38,  36,  38,  38][i],
}));

// PM: Abuja Housing Ph II progress planned vs actual (%)
const pmProgressData = MONTHS_9.map((month, i) => ({
  month,
  "Planned %": [5, 12, 20, 28, 36, 45, 54, 63, 70][i],
  "Actual %":  [4, 10, 17, 24, 31, 38, 46, 55, 62][i],
}));

// PM: weekly site attendance (workers on site)
const pmAttendanceData = [
  { month: "Wk 27", "On Site": 142 },
  { month: "Wk 28", "On Site": 156 },
  { month: "Wk 29", "On Site": 148 },
  { month: "Wk 30", "On Site": 161 },
  { month: "Wk 31", "On Site": 138 },
  { month: "Wk 32", "On Site": 165 },
  { month: "Wk 33", "On Site": 158 },
  { month: "Wk 34", "On Site": 172 },
  { month: "Wk 35", "On Site": 169 },
];

function ExecHeader({ role, name, title }: { role: string; name: string; title: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
          {role}
        </span>
        <h1 className="font-display mt-2 text-xl sm:text-2xl font-bold tracking-tight">{name}</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">{title} · USV + CANONIC</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="font-mono text-[11px] text-muted-foreground">{execToday}</p>
        <div className="flex items-center gap-1.5 rounded border border-healthy/30 bg-healthy-bg px-2.5 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-healthy" />
          <span className="font-mono text-[10px] font-semibold text-healthy">Live · 14:32 WAT</span>
        </div>
      </div>
    </div>
  );
}

function ExecKpi({ label, value, sub, tone, icon: Icon, onClick }: {
  label: string; value: string; sub?: string;
  tone?: "healthy" | "attention" | "critical" | "neutral";
  icon?: React.ElementType; onClick?: () => void;
}) {
  const valCls = tone === "critical" ? "text-critical" : tone === "attention" ? "text-attention" : tone === "healthy" ? "text-healthy" : "text-foreground";
  const content = (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />}
      </div>
      <p className={`mt-2 font-display text-xl sm:text-2xl font-bold tabular-nums ${valCls}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
  if (onClick) return <button onClick={onClick} className="w-full text-left transition hover:opacity-90">{content}</button>;
  return content;
}

/* ─── CHAIRMAN — Board Governance View ─── */

export function ChairmanDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const atRisk = projects.filter((p) => p.health !== "healthy").length;

  const boardCalendar = [
    { date: "15 Sep 2026", event: "Finance & Risk Committee Meeting", location: "Board Room, VI", type: "committee" },
    { date: "30 Sep 2026", event: "Q3 Board Review: Group Performance", location: "Group HQ, Abuja", type: "board" },
    { date: "07 Oct 2026", event: "Audit Committee: Q2 Report Sign-off", location: "Board Room, VI", type: "audit" },
    { date: "15 Oct 2026", event: "Annual General Meeting (AGM)", location: "Civic Centre, Lagos", type: "agm" },
  ];

  const strategicRisks = [
    { id: "RSK-001", risk: "Reinforcement steel shortage: Abuja Housing Ph II halted", severity: "critical" as const, owner: "GED", action: "Procurement escalation in progress" },
    { id: "RSK-002", risk: "₦280m receivables overdue: 3 clients > 60 days", severity: "critical" as const, owner: "ED / Finance", action: "Legal notice issued to 2 clients" },
    { id: "RSK-003", risk: "Tender pipeline concentration: 2 of 3 bids closing within 10 days", severity: "attention" as const, owner: "GGMP", action: "Proposal teams mobilised" },
    { id: "RSK-004", risk: "Q3 project margin compression: forecast below target on 2 projects", severity: "attention" as const, owner: "GED / QS", action: "Commercial review scheduled 09 Sep" },
  ];

  const groupFinancials = [
    { label: "Cash Position", value: "₦280m", sub: "Group consolidated", tone: "healthy" as const },
    { label: "Total Receivables", value: "₦850m", sub: "₦280m > 60 days overdue", tone: "critical" as const },
    { label: "Total Payables", value: "₦312m", sub: "within contractual terms", tone: "neutral" as const },
    { label: "Net Position", value: "+₦538m", sub: "operating surplus", tone: "healthy" as const },
  ];

  return (
    <div className="space-y-6 animate-in">
      <ExecHeader role="CHAIRMAN" name="Alhaji Mustapha Sule Dankaka" title="Chairman, Board of Directors" />

      {/* Board-level KPIs */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <ExecKpi label="Group Portfolio" value={naira(totalValue)} sub="6 active projects" icon={FolderOpen} onClick={() => nav("portfolio")} />
        <ExecKpi label="Projects at Risk" value={String(atRisk)} sub="3 critical · 2 attention" tone="critical" icon={AlertTriangle} onClick={() => nav("portfolio")} />
        <ExecKpi label="Tender Pipeline" value="₦9.89bn" sub="3 live bids · win rate 38% YTD" icon={TrendingUp} onClick={() => nav("business-dev")} />
        <ExecKpi label="Group Headcount" value="34" sub="across USV + CANONIC" icon={Users} onClick={() => nav("people")} />
      </div>

      {/* ── Chairman Charts ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHead title="Group Revenue vs. Expenditure" hint="Jan – Sep 2026 · ₦ millions" />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={chairmanFinancialData}
              lines={[
                { key: "Revenue",     label: "Revenue",     color: "var(--healthy)" },
                { key: "Expenditure", label: "Expenditure", color: "var(--primary)" },
              ]}
              yFormatter={(v) => `₦${v}m`}
            />
          </div>
        </Card>
        <Card>
          <SectionHead
            title="Receivables Position"
            hint="Jan – Sep 2026 · ₦ millions"
            action={<span className="rounded bg-critical/10 px-2 py-0.5 font-mono text-[10px] font-bold text-critical">₦280m overdue</span>}
          />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={chairmanReceivablesData}
              lines={[
                { key: "Total Receivables",  label: "Total Receivables",  color: "var(--primary)" },
                { key: "Overdue (>60 days)", label: "Overdue (>60 days)", color: "var(--critical)" },
              ]}
              yFormatter={(v) => `₦${v}m`}
              referenceY={200}
              referenceLabel="Overdue threshold"
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Strategic Risk Register */}
          <Card>
            <SectionHead
              title="Strategic Risk Register"
              hint="Board-level risks requiring oversight"
              action={
                <span className="rounded bg-critical/10 px-2 py-0.5 font-mono text-[10px] font-bold text-critical">
                  {strategicRisks.filter(r => r.severity === "critical").length} CRITICAL
                </span>
              }
            />
            <div className="divide-y divide-border">
              {strategicRisks.map((r) => (
                <div key={r.id} className={`flex items-start gap-4 px-4 py-3.5 ${r.severity === "critical" ? "bg-critical/[0.02]" : ""}`}>
                  <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${r.severity === "critical" ? "bg-critical" : "bg-attention"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{r.risk}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Owner: <span className="font-semibold text-foreground">{r.owner}</span> · {r.action}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{r.id}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Group Financial Summary */}
          <Card>
            <SectionHead title="Group Financial Position" hint="Consolidated · September 2026" />
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {groupFinancials.map((f) => (
                <div key={f.label} className="bg-card px-4 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">{f.label}</p>
                  <p className={`mt-2 font-display text-xl font-bold tabular-nums ${f.tone === "critical" ? "text-critical" : f.tone === "healthy" ? "text-healthy" : "text-foreground"}`}>{f.value}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{f.sub}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Portfolio snapshot */}
          <Card>
            <SectionHead title="Portfolio Overview" hint="All active projects" action={
              <button onClick={() => nav("portfolio")} className="text-xs font-semibold text-primary hover:underline">Full portfolio →</button>
            } />
            <div className="divide-y divide-border">
              {projects.slice(0, 4).map((p) => (
                <button key={p.code} onClick={() => nav("project", p.code)} className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-panel transition">
                  <HealthDot h={p.health} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{p.code} · {naira(p.contractValue)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-xs font-bold tabular-nums">{p.progressActual}%</p>
                    <p className="text-[10px] text-muted-foreground">vs {p.progressPlanned}% planned</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Board Calendar */}
          <Card>
            <SectionHead title="Board Calendar" hint="Upcoming engagements" />
            <div className="divide-y divide-border">
              {boardCalendar.map((b) => (
                <div key={b.date} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${b.type === "board" ? "bg-primary/10 text-primary" : b.type === "audit" ? "bg-attention-bg text-attention" : b.type === "agm" ? "bg-info-bg text-info" : "bg-secondary text-muted-foreground"}`}>
                      {b.type}
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-snug">{b.event}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{b.date} · {b.location}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Chairman Quick Actions */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Board Actions</p>
            <div className="space-y-1.5">
              {[
                { label: "Request Management Report", icon: FileText, fn: () => show("Management report request sent to GMD", "success") },
                { label: "View Audit Report", icon: ShieldCheck, fn: () => nav("audit") },
                { label: "Access Board Papers", icon: BookOpen, fn: () => nav("documents") },
                { label: "Review Compliance Status", icon: Shield, fn: () => nav("audit") },
                { label: "Open Risk Register", icon: AlertTriangle, fn: () => show("Risk register opened. Q3 update in progress.", "info") },
              ].map((q) => (
                <button key={q.label} onClick={q.fn} className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5">
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── GED — Group Executive Director, Projects ─── */

const gedProjectApprovals = [
  { id: "VAR-PRJ001-003", title: "Variation: Revised foundation design +₦180m", project: "Abuja Housing Ph II", type: "Variation", awaiting: "GED Final Approval", submitted: "04 Sep", urgency: "high" as const },
  { id: "PCERT-003",      title: "Payment Certificate #3: Gov't Office Complex", project: "Gov't Office Complex", type: "Payment Cert", awaiting: "GED Sign-off", submitted: "05 Sep", urgency: "normal" as const },
  { id: "EXP-CAN-0203",   title: "Specialist site survey: 2nd geotechnical visit", project: "Enugu Medical Centre", type: "Expenditure", awaiting: "GED Authority", submitted: "06 Sep", urgency: "high" as const },
];

const gedMilestones = [
  { date: "08 Sep", project: "Abuja Housing Ph II",       milestone: "Block C foundation pour", h: "critical" as const },
  { date: "12 Sep", project: "Gov't Office Complex",      milestone: "Curtain wall procurement complete", h: "critical" as const },
  { date: "18 Sep", project: "Abuja Housing Ph II",       milestone: "Progress valuation submission", h: "attention" as const },
  { date: "22 Sep", project: "Enugu Medical Centre",      milestone: "Structural drawings: issue for construction", h: "attention" as const },
  { date: "25 Sep", project: "PH Logistics Warehouse",    milestone: "Roof slab completion: Bay A", h: "healthy" as const },
];

export function GEDDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const [detailItem, setDetailItem] = useState<ApprovalDetailItem | null>(null);
  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const atRisk = projects.filter((p) => p.health !== "healthy").length;
  const totalActual = 994 + 452 + 355;
  const totalBudget = 1380 + 2150 + 480;

  const gedChains: Record<string, ApprovalDetailItem> = {
    "VAR-PRJ001-003": {
      id: "VAR-PRJ001-003", title: "Variation: Revised foundation design +₦180m",
      type: "Variation Order", project: "Abuja Housing Ph II", submitted: "04 Sep",
      status: "in-review",
      directedBy: "Engr. Musa Usman Lawan, Senior PM (variation package escalated to GED after PM sign-off 03 Sep)",
      chain: [
        { staffId: "qs-01", staffName: "QS Haruna Sani Gombe", staffTitle: "Head Quantity Surveyor", action: "approved", note: "Variation priced at ₦182.4m; within contingency tolerance. Recommended for PM approval.", timestamp: "02 Sep 11:30", isFinal: false },
        { staffId: "pm-01", staffName: "Engr. Musa Usman Lawan", staffTitle: "Senior Project Manager", action: "approved", note: "Commercial review complete. Design change is necessary. Recommend GED sign-off due to >₦100m threshold.", timestamp: "03 Sep 14:15", isFinal: false },
        { staffId: "ged-01", staffName: "Engr. Fatima Aliyu Dantata", staffTitle: "GED: Projects", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [
        { label: "Project", value: "Abuja Housing Ph II" },
        { label: "Variation Type", value: "Design Change: Foundation Revision" },
        { label: "Amount", value: "₦180,000,000" },
        { label: "Submitted", value: "04 Sep 2026" },
      ],
    },
    "PCERT-003": {
      id: "PCERT-003", title: "Payment Certificate #3: Gov't Office Complex",
      type: "Payment Certificate", project: "Gov't Office Complex", submitted: "05 Sep",
      status: "in-review",
      directedBy: "Mrs. Maryam Kabiru Suleiman, Finance Manager (cert verified against interim valuation VAL-PRJ021-003, submitted for GED sign-off 05 Sep)",
      chain: [
        { staffId: "qs-01", staffName: "QS Haruna Sani Gombe", staffTitle: "Head Quantity Surveyor", action: "approved", note: "Interim valuation certified at ₦46.8m for work done to 03 Sep. Drawings and site records verified.", timestamp: "04 Sep 09:00", isFinal: false },
        { staffId: "pm-01", staffName: "Engr. Musa Usman Lawan", staffTitle: "Senior PM", action: "approved", note: "Progress confirmed on site. Recommended for payment.", timestamp: "04 Sep 16:30", isFinal: false },
        { staffId: "fin-01", staffName: "Mrs. Maryam Kabiru Suleiman", staffTitle: "Finance Manager", action: "approved", note: "Vendor payment terms confirmed. No outstanding disputes. GED sign-off required for release.", timestamp: "05 Sep 10:00", isFinal: false },
        { staffId: "ged-01", staffName: "Engr. Fatima Aliyu Dantata", staffTitle: "GED: Projects", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [
        { label: "Project", value: "Gov't Office Complex" },
        { label: "Certificate No.", value: "#3 of Contract" },
        { label: "Amount", value: "₦46,800,000" },
        { label: "Submitted", value: "05 Sep 2026" },
      ],
    },
    "EXP-CAN-0203": {
      id: "EXP-CAN-0203", title: "Specialist site survey: 2nd geotechnical visit",
      type: "Expenditure Authority", project: "Enugu Medical Centre", submitted: "06 Sep",
      status: "in-review",
      directedBy: "Engr. Musa Usman Lawan, Project Manager (specialist survey required per geotechnical review report dated 03 Sep; budget not covered by PC sum)",
      chain: [
        { staffId: "pm-01", staffName: "Engr. Musa Usman Lawan", staffTitle: "Project Manager", action: "approved", note: "Site conditions differ from initial soil report. Second geotechnical visit essential before foundation redesign. Cost ₦4.2m; outside PM expenditure authority.", timestamp: "06 Sep 08:45", isFinal: false },
        { staffId: "ged-01", staffName: "Engr. Fatima Aliyu Dantata", staffTitle: "GED: Projects", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [
        { label: "Project", value: "Enugu Medical Centre" },
        { label: "Expenditure Type", value: "Specialist Survey: Geotechnical" },
        { label: "Amount", value: "₦4,200,000" },
        { label: "Submitted", value: "06 Sep 2026" },
      ],
    },
  };

  const healthDims: { key: keyof typeof projects[0]; label: string }[] = [
    { key: "schedule", label: "Sched" }, { key: "cost", label: "Cost" },
    { key: "procurement", label: "Proc" }, { key: "payment", label: "Pay" },
    { key: "quality", label: "Qual" }, { key: "client_state", label: "Client" },
  ];

  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      <ExecHeader role="GED: PROJECTS" name="Engr. Fatima Aliyu Dantata" title="Group Executive Director, Projects & Technical Delivery" />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <ExecKpi label="Portfolio Value" value={naira(totalValue)} sub="6 active projects" icon={FolderOpen} onClick={() => nav("portfolio")} />
        <ExecKpi label="Projects at Risk" value={String(atRisk)} sub="require executive intervention" tone={atRisk > 2 ? "critical" : "attention"} icon={AlertTriangle} onClick={() => nav("portfolio")} />
        <ExecKpi label="Variations Open" value="4" sub="₦260.5m exposure; 2 awaiting GED" tone="attention" icon={TrendingUp} onClick={() => nav("variations")} />
        <ExecKpi label="Cost Consumed" value={`${Math.round((totalActual / totalBudget) * 100)}%`} sub="of total contract value" tone="neutral" icon={BarChart2} />
      </div>

      {/* ── GED Charts ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHead title="Portfolio Progress: Planned vs. Actual" hint="Jan – Sep 2026 · aggregate across all projects" />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={gedProgressData}
              lines={[
                { key: "Planned %", label: "Planned %", color: "var(--primary)", dashed: true },
                { key: "Actual %",  label: "Actual %",  color: "var(--healthy)" },
              ]}
              yFormatter={(v) => `${v}%`}
            />
          </div>
        </Card>
        <Card>
          <SectionHead
            title="Cumulative Variation Exposure"
            hint="Jan – Sep 2026 · ₦ millions"
            action={<span className="rounded bg-attention-bg px-2 py-0.5 font-mono text-[10px] font-bold text-attention">₦261m pending</span>}
          />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={gedVariationData}
              lines={[
                { key: "Approved (₦m)", label: "Approved",       color: "var(--healthy)" },
                { key: "Pending (₦m)",  label: "Pending / Unapproved", color: "var(--attention)" },
              ]}
              yFormatter={(v) => `₦${v}m`}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* GED Approvals Queue */}
          <Card>
            <SectionHead title="Awaiting Your Authority" hint="Items escalated to GED for decision" action={
              <span className="rounded bg-attention-bg px-2 py-0.5 font-mono text-[10px] font-bold text-attention">
                {gedProjectApprovals.length} PENDING
              </span>
            } />
            <div className="divide-y divide-border">
              {gedProjectApprovals.map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3.5 transition hover:bg-panel/50">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.urgency === "high" ? "bg-critical" : "bg-attention"}`} />
                  <button className="min-w-0 flex-1 text-left" onClick={() => setDetailItem(gedChains[a.id])}>
                    <p className="text-sm font-semibold hover:text-primary transition-colors">{a.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{a.id} · {a.project} · Submitted {a.submitted}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Awaiting: <span className="font-semibold text-foreground">{a.awaiting}</span></p>
                    <p className="mt-1 text-[10px] font-semibold text-primary/70 underline-offset-2 hover:underline">View approval history →</p>
                  </button>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button onClick={() => show(`${a.id} approved. Next stage notified.`, "success")} className="rounded bg-primary px-2.5 py-1 font-mono text-[10px] font-semibold text-primary-foreground hover:opacity-90 transition">Approve</button>
                    <button onClick={() => show(`${a.id} returned for additional information`, "info")} className="rounded border border-border px-2.5 py-1 font-mono text-[10px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition">Query</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Portfolio Health Matrix */}
          <Card>
            <SectionHead title="Portfolio Health Matrix" hint="All projects × all dimensions" action={<span className="rounded bg-critical/10 px-2 py-0.5 font-mono text-[10px] font-bold text-critical">{atRisk} at risk</span>} />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Project</th>
                    {healthDims.map((d) => <th key={d.key} className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{d.label}</th>)}
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.code} className="cursor-pointer border-b border-border transition hover:bg-panel" onClick={() => nav("project", p.code)}>
                      <td className="px-4 py-2.5">
                        <p className="max-w-[150px] truncate text-xs font-semibold">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.pm}</p>
                      </td>
                      {healthDims.map((d) => <td key={d.key} className="px-2 py-2.5 text-center"><HealthDot h={p[d.key] as any} /></td>)}
                      <td className="px-3 py-2.5"><div className="w-20"><Progress planned={p.progressPlanned} actual={p.progressActual} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Milestones */}
          <Card>
            <SectionHead title="Critical Milestones" hint="Next 30 days" />
            <div className="divide-y divide-border">
              {gedMilestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <HealthDot h={m.h} className="mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-snug">{m.milestone}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{m.project}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{m.date}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Technical team snapshot */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Technical Teams</p>
            <div className="space-y-3">
              {[
                { team: "Engineering", head: "Engr. Bode Akintunde", load: 88, h: "critical" as const },
                { team: "Architecture", head: "Arc. Hamza Ibrahim Danladi", load: 72, h: "attention" as const },
                { team: "Quantity Surveying", head: "QS Haruna Sani Gombe", load: 65, h: "healthy" as const },
                { team: "Project Mgmt", head: "Engr. Musa Usman Lawan", load: 82, h: "attention" as const },
              ].map((t) => (
                <div key={t.team}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold">{t.team}</p>
                    <span className={`font-mono text-[10px] font-bold ${t.h === "critical" ? "text-critical" : t.h === "attention" ? "text-attention" : "text-healthy"}`}>{t.load}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${t.h === "critical" ? "bg-critical" : t.h === "attention" ? "bg-attention" : "bg-healthy"}`} style={{ width: `${t.load}%` }} />
                  </div>
                  <p className="mt-0.5 text-[9px] text-muted-foreground">{t.head}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">GED Actions</p>
            <div className="space-y-1.5">
              {[
                { label: "Open Full Portfolio", icon: FolderOpen, fn: () => nav("portfolio") },
                { label: "Review Variations", icon: TrendingUp, fn: () => nav("variations") },
                { label: "Approve Payment Cert", icon: CheckCircle2, fn: () => nav("payment-certs") },
                { label: "Schedule Site Visit", icon: HardHat, fn: () => show("Site visit request sent to PM. Awaiting confirmation.", "success") },
              ].map((q) => (
                <button key={q.label} onClick={q.fn} className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5">
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── ED — Executive Director, Corporate Services ─── */

export function EDDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const [detailItem, setDetailItem] = useState<ApprovalDetailItem | null>(null);
  const totalStaff = staffMembers.length;
  const onLeave = staffMembers.filter(s => s.status === "on-leave").length;
  const totalPayroll = staffMembers.reduce((s, m) => s + m.monthlySalary, 0);

  const edChains: Record<string, ApprovalDetailItem> = {
    "RPT-Q2-2026": {
      id: "RPT-Q2-2026", title: "Q2 Management Accounts: Final Sign-off",
      type: "Financial Report", submitted: "01 Sep", status: "in-review",
      directedBy: "Mrs. Maryam Kabiru Suleiman, Finance Manager (Q2 accounts finalised, submitted for ED sign-off per statutory timetable)",
      chain: [
        { staffId: "acct-01", staffName: "Mr. Haruna Abubakar Wali", staffTitle: "Accountant", action: "approved", note: "Q2 accounts prepared and reconciled against bank statements. All entries verified.", timestamp: "31 Aug 17:00", isFinal: false },
        { staffId: "fin-01", staffName: "Mrs. Maryam Kabiru Suleiman", staffTitle: "Finance Manager", action: "approved", note: "Management accounts reviewed. Margin and cash position align with Q2 forecast. Recommend ED approval.", timestamp: "01 Sep 11:30", isFinal: false },
        { staffId: "ed-01", staffName: "Engr. Yahaya Abdullahi Bello", staffTitle: "Executive Director", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [{ label: "Period", value: "Q2 2026 (Apr–Jun)" }, { label: "Submitted By", value: "Mrs. Maryam Kabiru Suleiman, Finance Manager" }, { label: "Submitted", value: "01 Sep 2026" }],
    },
    "POLICY-HR-009": {
      id: "POLICY-HR-009", title: "Updated Leave Policy: effective 01 Oct",
      type: "HR Policy", submitted: "03 Sep", status: "in-review",
      directedBy: "Mrs. Zainab Umar Lawan, Head of HR & Admin (policy updated per new Labour Act provisions; requires ED approval before publication)",
      chain: [
        { staffId: "hr-01", staffName: "Mrs. Zainab Umar Lawan", staffTitle: "Head of HR & Admin", action: "approved", note: "Policy revised to align with Labour Act 2024 amendments. Legal review completed 02 Sep. Recommend ED sign-off.", timestamp: "03 Sep 09:00", isFinal: false },
        { staffId: "ed-01", staffName: "Engr. Yahaya Abdullahi Bello", staffTitle: "Executive Director", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [{ label: "Policy Ref", value: "HR-POL-009" }, { label: "Effective Date", value: "01 October 2026" }, { label: "Submitted By", value: "Mrs. Zainab Umar Lawan" }],
    },
    "ICT-CAPEX-004": {
      id: "ICT-CAPEX-004", title: "ICT Capital Plan: server refresh ₦14.2m",
      type: "Capital Request", submitted: "04 Sep", status: "in-review",
      directedBy: "Mr. Haruna Ibrahim Kure, Head of ICT (server infrastructure at end-of-life; business continuity risk if refresh deferred past Q4 2026)",
      chain: [
        { staffId: "ict-01", staffName: "Mr. Haruna Ibrahim Kure", staffTitle: "Head of ICT", action: "approved", note: "Three vendor quotations obtained. Recommended vendor: DataServ ₦14.2m. Deloitte IT reviewed and approved scope.", timestamp: "03 Sep 14:00", isFinal: false },
        { staffId: "fin-01", staffName: "Mrs. Maryam Kabiru Suleiman", staffTitle: "Finance Manager", action: "approved", note: "Budget availability confirmed. Within approved CAPEX envelope. ED authority required > ₦10m.", timestamp: "04 Sep 10:30", isFinal: false },
        { staffId: "ed-01", staffName: "Engr. Yahaya Abdullahi Bello", staffTitle: "Executive Director", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [{ label: "Capex Category", value: "ICT Infrastructure: Server Refresh" }, { label: "Amount", value: "₦14,200,000" }, { label: "Vendor", value: "DataServ Nigeria Ltd" }],
    },
  };

  const auditActions = [
    { ref: "AUD-ACT-019", title: "Q3 Risk register: management update", owner: "Mr. Lanre Adebayo", due: "12 Sep", status: "In Progress" },
    { ref: "AUD-ACT-020", title: "Q2 management action follow-up verification", owner: "Mr. Lanre Adebayo", due: "09 Sep", status: "Overdue" },
    { ref: "COMP-011",    title: "Annual NSITF remittance: Q3 filing", owner: "Finance", due: "15 Sep", status: "Pending" },
  ];

  const ictStatus = [
    { system: "NEXUS ERP", status: "Operational", uptime: "99.9%", h: "healthy" as const },
    { system: "Microsoft 365", status: "Operational", uptime: "99.7%", h: "healthy" as const },
    { system: "AutoCAD Server", status: "Minor Issue", uptime: "97.2%", h: "attention" as const },
    { system: "Finance Module", status: "Operational", uptime: "100%", h: "healthy" as const },
  ];

  const edSignoffQueue = [
    { id: "RPT-Q2-2026",  title: "Q2 Management Accounts: Final Sign-off",  from: "Mrs. Maryam Kabiru Suleiman", type: "Financial Report", urgency: "high" as const },
    { id: "POLICY-HR-009",title: "Updated Leave Policy: effective 01 Oct",  from: "Mrs. Zainab Umar Lawan", type: "HR Policy", urgency: "normal" as const },
    { id: "ICT-CAPEX-004",title: "ICT Capital Plan: server refresh ₦14.2m", from: "Mr. Haruna Ibrahim Kure", type: "Capital Request", urgency: "normal" as const },
  ];

  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      <ExecHeader role="ED: CORPORATE SERVICES" name="Engr. Yahaya Abdullahi Bello" title="Executive Director, Finance, HR & Administration, ICT, Audit" />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <ExecKpi label="Group Payroll" value={naira(totalPayroll)} sub="monthly, all staff" icon={DollarSign} onClick={() => nav("people")} />
        <ExecKpi label="Cash Position" value="₦280m" sub="group consolidated" tone="healthy" icon={Landmark} onClick={() => nav("invoices")} />
        <ExecKpi label="Staff Count" value={String(totalStaff)} sub={`${onLeave} on leave · ${totalStaff - onLeave} active`} icon={Users} onClick={() => nav("people")} />
        <ExecKpi label="Compliance Score" value="87%" sub="3 audit actions outstanding" tone="attention" icon={ShieldCheck} onClick={() => nav("audit")} />
      </div>

      {/* ── ED Charts ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHead title="Monthly Payroll Cost" hint="Jan – Sep 2026 · ₦ millions" />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={edPayrollData}
              lines={[{ key: "Payroll (₦m)", label: "Payroll", color: "var(--primary)" }]}
              yFormatter={(v) => `₦${v}m`}
              referenceY={4.5}
              referenceLabel="Budget cap"
            />
          </div>
        </Card>
        <Card>
          <SectionHead
            title="Group Compliance Score"
            hint="Jan – Sep 2026 · monthly average %"
            action={<span className="rounded bg-healthy/10 px-2 py-0.5 font-mono text-[10px] font-bold text-healthy">↑ 11pts YTD</span>}
          />
          <div className="px-2 pb-4 pt-2">
            <ExecLineChart
              data={edComplianceData}
              lines={[{ key: "Compliance %", label: "Compliance Score", color: "var(--healthy)" }]}
              yFormatter={(v) => `${v}%`}
              referenceY={90}
              referenceLabel="Target 90%"
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* ED Sign-off Queue */}
          <Card>
            <SectionHead title="Awaiting Your Authority" hint="Submissions requiring ED approval" action={
              <span className="rounded bg-attention-bg px-2 py-0.5 font-mono text-[10px] font-bold text-attention">{edSignoffQueue.length} PENDING</span>
            } />
            <div className="divide-y divide-border">
              {edSignoffQueue.map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3.5 transition hover:bg-panel/50">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.urgency === "high" ? "bg-critical" : "bg-attention"}`} />
                  <button className="min-w-0 flex-1 text-left" onClick={() => setDetailItem(edChains[a.id])}>
                    <p className="text-sm font-semibold hover:text-primary transition-colors">{a.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{a.id} · {a.type}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">From: <span className="font-semibold text-foreground">{a.from}</span></p>
                    <p className="mt-1 text-[10px] font-semibold text-primary/70 underline-offset-2 hover:underline">View approval history →</p>
                  </button>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button onClick={() => show(`${a.id} approved by ED`, "success")} className="rounded bg-primary px-2.5 py-1 font-mono text-[10px] font-semibold text-primary-foreground hover:opacity-90 transition">Approve</button>
                    <button onClick={() => show(`${a.id} returned for revision`, "info")} className="rounded border border-border px-2.5 py-1 font-mono text-[10px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition">Return</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Finance Summary */}
          <Card>
            <SectionHead title="Finance Summary: September 2026" hint="Group P&L snapshot" />
            <div className="grid grid-cols-3 gap-px bg-border">
              {[
                { label: "Revenue YTD", value: "₦3.02bn", sub: "vs ₦3.20bn target", tone: "attention" as const },
                { label: "Expenditure YTD", value: "₦2.18bn", sub: "within approved budget", tone: "healthy" as const },
                { label: "Outstanding Invoices", value: "3", sub: "₦47.15m pending", tone: "attention" as const },
                { label: "Overdue Receivables", value: "₦280m", sub: "3 clients > 60 days", tone: "critical" as const },
                { label: "Payroll: Sep", value: naira(totalPayroll), sub: "due 25 Sep 2026", tone: "neutral" as const },
                { label: "VAT Liability", value: "₦18.4m", sub: "Sep return due 21 Sep", tone: "attention" as const },
              ].map((f) => (
                <div key={f.label} className="bg-card px-4 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">{f.label}</p>
                  <p className={`mt-2 font-display text-lg font-bold tabular-nums ${f.tone === "critical" ? "text-critical" : f.tone === "attention" ? "text-attention" : f.tone === "healthy" ? "text-healthy" : "text-foreground"}`}>{f.value}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{f.sub}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Audit Actions */}
          <Card>
            <SectionHead title="Audit & Compliance Actions" hint="Outstanding items" action={
              <button onClick={() => nav("audit")} className="text-xs font-semibold text-primary hover:underline">Full audit log →</button>
            } />
            <div className="divide-y divide-border">
              {auditActions.map((a) => (
                <div key={a.ref} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{a.ref} · Owner: {a.owner} · Due {a.due}</p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${a.status === "Overdue" ? "bg-critical-bg text-critical" : a.status === "In Progress" ? "bg-info-bg text-info" : "bg-secondary text-muted-foreground"}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* ICT Status */}
          <Card>
            <SectionHead title="ICT & Systems" hint="Current health" />
            <div className="divide-y divide-border">
              {ictStatus.map((s) => (
                <div key={s.system} className="flex items-center gap-3 px-4 py-3">
                  <HealthDot h={s.h} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{s.system}</p>
                    <p className="text-[10px] text-muted-foreground">{s.status}</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{s.uptime}</span>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button onClick={() => show("ICT full report generated. Available in Documents.", "info")} className="text-xs font-semibold text-primary hover:underline">Full ICT report →</button>
              </div>
            </div>
          </Card>

          {/* HR Snapshot */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">HR Snapshot</p>
            <div className="space-y-3">
              {[
                { label: "Governance", count: staffMembers.filter(s => s.directorate === "governance").length },
                { label: "Projects", count: staffMembers.filter(s => s.directorate === "projects").length },
                { label: "Technical", count: staffMembers.filter(s => s.directorate === "technical").length },
                { label: "Corporate", count: staffMembers.filter(s => s.directorate === "corporate").length },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <span className="font-mono text-xs font-bold">{d.count}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <p className="text-xs font-semibold">Total Headcount</p>
                <span className="font-mono text-xs font-bold">{totalStaff}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">ED Quick Actions</p>
            <div className="space-y-1.5">
              {[
                { label: "Finance Dashboard", icon: DollarSign, fn: () => nav("invoices") },
                { label: "HR & People", icon: Users, fn: () => nav("people") },
                { label: "Audit & Compliance", icon: ShieldCheck, fn: () => nav("audit") },
                { label: "Approval Centre", icon: CheckCircle2, fn: () => nav("approvals") },
              ].map((q) => (
                <button key={q.label} onClick={q.fn} className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5">
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── GGMP — Group General Manager, Operations ─── */

const ggmpProcExceptions = [
  { id: "PR-USV-2026-0081", title: "Reinforcement steel 42T Y16: approval 2 days overdue", project: "Abuja Housing Ph II", waitingOn: "Procurement Manager", urgency: "critical" as const },
  { id: "PR-USV-2026-0079", title: "Diesel 12,000L: under review by Ops", project: "Abuja Housing Ph II", waitingOn: "Head of Operations", urgency: "attention" as const },
];

const ggmpClientStatus = [
  { client: "Federal Ministry of Works", project: "Gov't Office Complex", status: "Active", h: "healthy" as const, lastContact: "04 Sep" },
  { client: "Abuja Municipal Area Council", project: "Abuja Housing Ph II", status: "Escalation Pending", h: "critical" as const, lastContact: "01 Sep" },
  { client: "PHED (Port Harcourt)", project: "PH Logistics", status: "Active", h: "healthy" as const, lastContact: "06 Sep" },
];

const ggmpPipeline = [
  { stage: "Prospect", value: 1200 }, { stage: "Qualified", value: 2800 },
  { stage: "Proposal", value: 3400 }, { stage: "Final", value: 2490 },
];

export function GGMPDashboard({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const [detailItem, setDetailItem] = useState<ApprovalDetailItem | null>(null);
  const activeTenders = tenders.filter(t => t.daysLeft < 30).length;

  const ggmpChains: Record<string, ApprovalDetailItem> = {
    "PR-USV-2026-0081": {
      id: "PR-USV-2026-0081", title: "Reinforcement steel 42T Y16: approval 2 days overdue",
      type: "Procurement Request", project: "Abuja Housing Ph II", submitted: "04 Sep",
      status: "in-review",
      directedBy: "Engr. Musa Usman Lawan, Senior PM (steel shortage blocking Block C pour; escalated to GGMP as Procurement Manager approval overdue by 2 days)",
      chain: [
        { staffId: "proc-officer", staffName: "Miss Ramatu Yusuf Waziri", staffTitle: "Procurement Officer", action: "approved", note: "RFQ issued to 4 vendors. Recommended: Abuja Steel Ltd at ₦8.4m; lowest compliant bid. GRN template prepared.", timestamp: "02 Sep 10:00", isFinal: false },
        { staffId: "pm-01", staffName: "Engr. Musa Usman Lawan", staffTitle: "Senior PM", action: "approved", note: "Steel specification confirmed against structural drawings. Urgency confirmed. Block C pour scheduled 08 Sep.", timestamp: "02 Sep 15:00", isFinal: false },
        { staffId: "proc-mgr", staffName: "Alhaji Sani Abubakar", staffTitle: "Procurement Manager", action: "pending", note: "Approval overdue by 2 days. Escalated to GGMP.", timestamp: "", isFinal: false },
        { staffId: "ggmp-01", staffName: "Barr. Hauwa Suleiman Abubakar", staffTitle: "GGMP: Operations", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [
        { label: "Project", value: "Abuja Housing Ph II" },
        { label: "Material", value: "Reinforcement Steel Y16: 42 Tonnes" },
        { label: "Recommended Vendor", value: "Abuja Steel Ltd" },
        { label: "Amount", value: "₦8,400,000" },
        { label: "Urgency", value: "CRITICAL: approval 2 days overdue" },
      ],
    },
    "PR-USV-2026-0079": {
      id: "PR-USV-2026-0079", title: "Diesel 12,000L: under review by Ops",
      type: "Procurement Request", project: "Abuja Housing Ph II", submitted: "05 Sep",
      status: "in-review",
      directedBy: "Mr. Sa'adu Usman Garba, Site Officer (generator and equipment fuel supply for next 2 weeks; current stock at 3-day reserve)",
      chain: [
        { staffId: "site-01", staffName: "Mr. Sa'adu Usman Garba", staffTitle: "Site Officer", action: "approved", note: "Fuel request submitted. Current stock: 800L. Equipment requires ~600L/day. Recommend 12,000L order.", timestamp: "04 Sep 17:00", isFinal: false },
        { staffId: "site-sup", staffName: "Engr. Suleiman Garba Jabo", staffTitle: "Site Supervisor", action: "approved", note: "Fuel level verified on site. 2-week supply appropriate given programme.", timestamp: "05 Sep 08:30", isFinal: false },
        { staffId: "ggmp-01", staffName: "Barr. Hauwa Suleiman Abubakar", staffTitle: "GGMP: Operations", action: "pending", note: "", timestamp: "", isFinal: true },
      ],
      meta: [
        { label: "Project", value: "Abuja Housing Ph II" },
        { label: "Item", value: "Diesel: 12,000 Litres" },
        { label: "Duration", value: "Approx. 2-week supply" },
        { label: "Submitted", value: "05 Sep 2026" },
      ],
    },
  };

  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      <ExecHeader role="GGMP: OPERATIONS" name="Barr. Hauwa Suleiman Abubakar" title="Group General Manager, Operations, BD & Client Relations" />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <ExecKpi label="Active Procurements" value="11" sub="POs across all projects" icon={Package} onClick={() => nav("procurement")} />
        <ExecKpi label="BD Pipeline" value="₦9.89bn" sub={`${activeTenders} tenders closing this month`} icon={TrendingUp} onClick={() => nav("business-dev")} />
        <ExecKpi label="Procurement Exceptions" value={String(ggmpProcExceptions.length)} sub="require GGMP intervention" tone="critical" icon={AlertTriangle} />
        <ExecKpi label="Pending Instructions" value="3" sub="awaiting GGMP sign-off" tone="attention" icon={FileText} onClick={() => nav("instructions")} />
      </div>

      {/* ── GGMP Chart ── */}
      <Card>
        <SectionHead
          title="Business Development Pipeline & Win Rate"
          hint="Jan – Sep 2026 · pipeline ₦ billions, win rate %"
          action={<span className="rounded bg-healthy/10 px-2 py-0.5 font-mono text-[10px] font-bold text-healthy">₦9.89bn active</span>}
        />
        <div className="px-2 pb-4 pt-2">
          <ExecLineChart
            data={ggmpPipelineData}
            lines={[
              { key: "Pipeline (₦bn)", label: "Pipeline Value (₦bn)", color: "var(--primary)" },
              { key: "Win Rate %",     label: "Win Rate %",            color: "var(--healthy)", dashed: true },
            ]}
            height={200}
            yFormatter={(v) => `${v}`}
            referenceY={40}
            referenceLabel="Win-rate target 40%"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Procurement Exceptions */}
          <Card>
            <SectionHead title="Procurement Exceptions" hint="Items requiring GGMP intervention" action={
              <span className="rounded bg-critical/10 px-2 py-0.5 font-mono text-[10px] font-bold text-critical">ACTION REQUIRED</span>
            } />
            <div className="divide-y divide-border">
              {ggmpProcExceptions.map((e) => (
                <div key={e.id} className={`flex items-start gap-3 px-4 py-3.5 transition hover:bg-panel/50 ${e.urgency === "critical" ? "bg-critical/[0.025]" : ""}`}>
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${e.urgency === "critical" ? "bg-critical animate-pulse" : "bg-attention"}`} />
                  <button className="min-w-0 flex-1 text-left" onClick={() => setDetailItem(ggmpChains[e.id])}>
                    <p className="text-sm font-semibold hover:text-primary transition-colors">{e.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{e.id} · {e.project}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Waiting on: <span className="font-semibold text-foreground">{e.waitingOn}</span></p>
                    <p className="mt-1 text-[10px] font-semibold text-primary/70 underline-offset-2 hover:underline">View approval chain →</p>
                  </button>
                  <button onClick={() => { nav("procurement"); }} className="shrink-0 rounded border border-border px-2.5 py-1 font-mono text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    Intervene
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* BD Pipeline chart */}
          <Card>
            <SectionHead title="Business Development Pipeline" hint="Value by stage (₦m)" action={
              <button onClick={() => nav("business-dev")} className="text-xs font-semibold text-primary hover:underline">Full pipeline →</button>
            } />
            <div className="p-4 pt-2">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={ggmpPipeline} margin={{ left: -18, right: 8, top: 4 }}>
                  <CartesianGrid stroke="#e8e8e4" vertical={false} />
                  <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b6f77" }} />
                  <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #d9d9d3", fontSize: 12 }} cursor={{ fill: "#f1f1ee" }} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {ggmpPipeline.map((_, i) => <Cell key={i} fill={i === 2 ? "#3580B5" : "#A8D0EC"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Total pipeline: <span className="font-mono font-semibold text-foreground">₦9.89bn</span> · Win rate target 35% · YTD actual 38%
              </p>
            </div>
            <div className="border-t border-border">
              {tenders.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{t.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{t.id} · {t.client}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-xs font-bold">{naira(t.value)}</p>
                    <span className={`font-mono text-[10px] ${t.daysLeft <= 7 ? "text-critical font-semibold" : "text-muted-foreground"}`}>{t.daysLeft}d left</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Client Status */}
          <Card>
            <SectionHead title="Client Relationships" hint="Active client health" action={
              <button onClick={() => nav("clients")} className="text-xs font-semibold text-primary hover:underline">All clients →</button>
            } />
            <div className="divide-y divide-border">
              {ggmpClientStatus.map((c) => (
                <div key={c.client} className="flex items-center gap-4 px-4 py-3">
                  <HealthDot h={c.h} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{c.client}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{c.project} · Last contact: {c.lastContact}</p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${c.h === "critical" ? "bg-critical-bg text-critical" : "bg-healthy-bg text-healthy"}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Resource overview */}
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Resource Deployment</p>
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <button key={p.code} onClick={() => nav("project", p.code)} className="flex w-full items-start gap-2.5 text-left">
                  <HealthDot h={p.health} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold truncate">{p.name}</p>
                    <p className="text-[9px] text-muted-foreground">{p.pm}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{p.progressActual}%</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">GGMP Actions</p>
            <div className="space-y-1.5">
              {[
                { label: "BD Pipeline", icon: TrendingUp, fn: () => nav("business-dev") },
                { label: "Procurement", icon: Package, fn: () => nav("procurement") },
                { label: "Issue Instruction", icon: FileText, fn: () => show("Instruction form opened", "info") },
                { label: "Clients & Vendors", icon: Building2, fn: () => nav("clients") },
                { label: "Client Portal", icon: Globe, fn: () => nav("client-portal") },
                { label: "My Work Queue", icon: ClipboardList, fn: () => nav("mywork") },
              ].map((q) => (
                <button key={q.label} onClick={q.fn} className="flex w-full items-center gap-2.5 rounded border border-border px-3 py-2 text-xs font-medium transition hover:border-primary hover:bg-primary/5">
                  <q.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OFFICER-LEVEL SHARED COMPONENTS & DASHBOARDS
   All officer submissions must be reviewed by the departmental head before
   any external escalation. These components enforce and visualise that flow.
   ═══════════════════════════════════════════════════════════════════════════ */

interface OfficerSubmission {
  id: string;
  title: string;
  type: string;
  submittedDate: string;
  status: "draft" | "pending-head" | "head-approved" | "forwarded" | "rejected";
  forwardedTo?: string;
  rejectionNote?: string;
}

function ApprovalFlowBanner({
  headName,
  headTitle,
  nextParty,
}: {
  headName: string;
  headTitle: string;
  nextParty: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-info/30 bg-info-bg px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="rounded bg-primary px-2.5 py-1 font-mono text-[10px] font-bold text-primary-foreground">
          YOU
        </span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <div className="rounded border border-info/40 bg-white/50 px-2.5 py-1 max-w-[160px] sm:max-w-none">
          <span className="font-mono text-[10px] font-bold text-info truncate">{headName}</span>
          <span className="ml-1 hidden sm:inline font-mono text-[9px] text-muted-foreground">({headTitle})</span>
        </div>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="font-mono text-[10px] text-muted-foreground truncate">{nextParty}</span>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        All submissions require <span className="font-semibold text-foreground">{headName}</span>&apos;s sign-off before escalation outside the department.
      </p>
    </div>
  );
}

function OfficerSubmissionsPanel({
  submissions,
  headName,
  onView,
}: {
  submissions: OfficerSubmission[];
  headName: string;
  onView?: (s: OfficerSubmission) => void;
}) {
  const { show } = useToast();
  const [localStatuses, setLocalStatuses] = useState<Record<string, OfficerSubmission["status"]>>({});
  const [resubmitItem, setResubmitItem] = useState<OfficerSubmission | null>(null);
  const [resubmitNote, setResubmitNote] = useState("");

  const statusConfig = {
    draft:          { label: "Draft",                      cls: "bg-secondary text-muted-foreground" },
    "pending-head": { label: `Awaiting ${headName}`,       cls: "bg-attention-bg text-attention" },
    "head-approved":{ label: "Head Approved",              cls: "bg-healthy-bg text-healthy" },
    forwarded:      { label: "Forwarded On",               cls: "bg-info-bg text-info" },
    rejected:       { label: "Returned: Revise",           cls: "bg-critical-bg text-critical" },
  };

  function handleResubmit() {
    if (!resubmitItem) return;
    if (!resubmitNote.trim()) { show("Please describe the changes made before resubmitting.", "warning"); return; }
    setLocalStatuses(prev => ({ ...prev, [resubmitItem.id]: "pending-head" }));
    show(`${resubmitItem.id} re-submitted directly to ${headName}. The chain continues from where it was rejected.`, "success");
    setResubmitItem(null);
    setResubmitNote("");
  }

  return (
    <>
      {resubmitItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={() => setResubmitItem(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="font-display text-[14px] font-bold">Edit &amp; Resubmit</h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Goes directly back to <span className="font-semibold">{headName}</span> — chain does not restart</p>
              </div>
              <button onClick={() => setResubmitItem(null)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded border border-critical/20 bg-critical-bg px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-critical mb-1">Rejection Reason</p>
                <p className="text-xs text-critical">{resubmitItem.rejectionNote}</p>
              </div>
              <div className="rounded bg-panel px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Submission</p>
                <p className="text-xs font-medium">{resubmitItem.title}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{resubmitItem.id} · {resubmitItem.type}</p>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Changes Made <span className="text-critical">*</span></label>
                <textarea
                  value={resubmitNote}
                  onChange={e => setResubmitNote(e.target.value)}
                  rows={3}
                  placeholder="Describe what you updated to address the rejection reason..."
                  className="w-full resize-none rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setResubmitItem(null)} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button onClick={handleResubmit} className="rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Resubmit to {headName}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <SectionHead title="My Submissions" hint="Status of your raised requests and documents" />
        <div className="divide-y divide-border">
          {submissions.map((s) => {
            const effectiveStatus = localStatuses[s.id] ?? s.status;
            const cfg = statusConfig[effectiveStatus];
            const wasResubmitted = localStatuses[s.id] === "pending-head" && s.status === "rejected";
            return (
              <div key={s.id} className="px-4 py-3 transition hover:bg-panel/40">
                <div className="flex items-start justify-between gap-2">
                  <button className="min-w-0 flex-1 text-left" onClick={() => onView?.(s)}>
                    <p className="text-sm font-medium leading-snug hover:text-primary transition-colors">{s.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {s.id} · {s.type} · {s.submittedDate}
                    </p>
                    {effectiveStatus === "forwarded" && s.forwardedTo && (
                      <p className="mt-1 text-[10px] text-info">
                        Head approved → now with <span className="font-semibold">{s.forwardedTo}</span>
                      </p>
                    )}
                    {s.status === "rejected" && !wasResubmitted && s.rejectionNote && (
                      <p className="mt-1 text-[10px] text-critical">{s.rejectionNote}</p>
                    )}
                    {wasResubmitted && (
                      <p className="mt-1 text-[10px] text-healthy font-medium">✓ Resubmitted — awaiting {headName}</p>
                    )}
                    {onView && <p className="mt-1 text-[10px] font-semibold text-primary/70 underline-offset-2 hover:underline">Track status →</p>}
                  </button>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${cfg.cls}`}>
                      {wasResubmitted ? `Awaiting ${headName}` : cfg.label}
                    </span>
                    {s.status === "rejected" && !wasResubmitted && (
                      <button
                        onClick={() => { setResubmitItem(s); setResubmitNote(""); }}
                        className="rounded border border-primary/40 bg-primary/5 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary hover:bg-primary/10 transition"
                      >
                        Edit &amp; Resubmit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

// ── Threaded comments store ──
interface TaskComment {
  id: string;
  author: string;
  role: string;
  text: string;
  time: string;
}
const _commentStore: Record<string, TaskComment[]> = {};
function addTaskComment(taskId: string, comment: TaskComment) {
  if (!_commentStore[taskId]) _commentStore[taskId] = [];
  _commentStore[taskId] = [..._commentStore[taskId], comment];
}
function getTaskComments(taskId: string): TaskComment[] {
  return _commentStore[taskId] ?? [];
}

// ── Simple cross-dashboard assignment store ──
type StoreListener = (tasks: AssignmentTask[]) => void;
const _assignStore: { tasks: Record<string, AssignmentTask[]>; listeners: Record<string, StoreListener[]> } = { tasks: {}, listeners: {} };
function _assignToRole(officerRole: string, task: AssignmentTask) {
  if (!_assignStore.tasks[officerRole]) _assignStore.tasks[officerRole] = [];
  _assignStore.tasks[officerRole] = [task, ...(_assignStore.tasks[officerRole] ?? [])];
  (_assignStore.listeners[officerRole] ?? []).forEach(fn => fn(_assignStore.tasks[officerRole]));
}
function useHeadAssignedTasks(officerRole: string): AssignmentTask[] {
  const [tasks, setTasks] = useState<AssignmentTask[]>(() => _assignStore.tasks[officerRole] ?? []);
  useEffect(() => {
    const listener: StoreListener = (t) => setTasks([...t]);
    if (!_assignStore.listeners[officerRole]) _assignStore.listeners[officerRole] = [];
    _assignStore.listeners[officerRole].push(listener);
    return () => { _assignStore.listeners[officerRole] = (_assignStore.listeners[officerRole] ?? []).filter(l => l !== listener); };
  }, [officerRole]);
  return tasks;
}

interface AssignmentTask {
  id: string;
  title: string;
  project: string;
  due: string;
  priority: "high" | "normal" | "low";
  description?: string;
  deliverables?: string[];
  assignedBy?: string;
  relatedDocs?: string[];
  milestones?: { label: string; done: boolean }[];
  createdBy?: "self" | "head";
  completed?: boolean;
  completedAt?: string;
  completionNote?: string;
}

function AssignmentDetailModal({ task, onClose, onUpdate, onTransfer, authorName, authorRole }: { task: AssignmentTask | null; onClose: () => void; onUpdate?: (id: string, updates: Partial<AssignmentTask>) => void; onTransfer?: () => void; authorName?: string; authorRole?: string }) {
  if (!task) return null;
  return <AssignmentDetailContent key={task.id} task={task} onClose={onClose} onUpdate={onUpdate} onTransfer={onTransfer} authorName={authorName} authorRole={authorRole} />;
}

function AssignmentDetailContent({ task, onClose, onUpdate, onTransfer, authorName, authorRole }: { task: AssignmentTask; onClose: () => void; onUpdate?: (id: string, updates: Partial<AssignmentTask>) => void; onTransfer?: () => void; authorName?: string; authorRole?: string }) {
  const { show } = useToast();
  const [milestonesDone, setMilestonesDone] = useState<boolean[]>(
    () => (task.milestones ?? []).map(m => m.done)
  );
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progressNote, setProgressNote] = useState("");
  const [progressPct, setProgressPct] = useState("");
  const [blocker, setBlocker] = useState("");
  const [progressSubmitted, setProgressSubmitted] = useState(false);

  // Edit mode state (only for self-created tasks)
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? "");
  const [editDue, setEditDue] = useState(task.due);
  const [editPriority, setEditPriority] = useState<AssignmentTask["priority"]>(task.priority);
  const [editMilestones, setEditMilestones] = useState<string[]>(() => (task.milestones ?? []).map(m => m.label));
  const [newMilestone, setNewMilestone] = useState("");
  const [editSaved, setEditSaved] = useState(false);
  const [editRelatedDocs, setEditRelatedDocs] = useState<string[]>(() => task.relatedDocs ?? []);
  const [editDocRefInput, setEditDocRefInput] = useState("");

  // Mark-complete flow (self-created tasks)
  const [showComplete, setShowComplete] = useState(false);
  const [completeNote, setCompleteNote] = useState("");
  const [completeSubmitted, setCompleteSubmitted] = useState(false);

  // Threaded comments
  const [comments, setComments] = useState<TaskComment[]>(() => getTaskComments(task.id));
  const [commentText, setCommentText] = useState("");

  const isSelf = task.createdBy === "self";
  const isCompleted = task.completed === true;

  const priorityConfig = {
    high:   { label: "High Priority",   cls: "bg-critical-bg text-critical" },
    normal: { label: "Normal Priority", cls: "bg-attention-bg text-attention" },
    low:    { label: "Low Priority",    cls: "bg-healthy-bg text-healthy" },
  };
  const pc = priorityConfig[task.priority];
  const doneCount = milestonesDone.filter(Boolean).length;
  const totalCount = milestonesDone.length;
  const overallPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  function toggleMilestone(i: number) {
    const wasAlready = milestonesDone[i];
    setMilestonesDone(prev => { const next = [...prev]; next[i] = !next[i]; return next; });
    show(wasAlready ? "Milestone unchecked." : "Milestone marked complete!", "success");
  }

  function handleProgressSubmit() {
    if (!progressNote.trim()) { show("Please add a progress note.", "warning"); return; }
    setProgressSubmitted(true);
    show("Progress update submitted to your head.", "success");
  }

  function handleSaveEdit() {
    if (!editTitle.trim()) { show("Title is required.", "warning"); return; }
    const updatedMilestones = editMilestones.filter(l => l.trim()).map(l => ({ label: l, done: false }));
    onUpdate?.(task.id, {
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
      due: editDue.trim() || task.due,
      priority: editPriority,
      milestones: updatedMilestones.length > 0 ? updatedMilestones : undefined,
      relatedDocs: editRelatedDocs.length > 0 ? editRelatedDocs : undefined,
    });
    setEditSaved(true);
    show("Assignment updated.", "success");
    setTimeout(() => { setEditMode(false); setEditSaved(false); }, 1200);
  }

  function handleMarkComplete() {
    onUpdate?.(task.id, {
      completed: true,
      completedAt: new Date().toISOString(),
      completionNote: completeNote.trim() || undefined,
    });
    setCompleteSubmitted(true);
    show("Assignment marked as complete. Great work!", "success");
    setTimeout(onClose, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {docPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-black/70" onClick={e => { e.stopPropagation(); setDocPreview(null); }}>
          <div className="relative w-full max-w-sm rounded-[var(--radius)] border border-border bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-display text-sm font-bold">{docPreview}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Related document · read-only</p>
              </div>
              <button onClick={() => setDocPreview(null)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-panel p-6 flex flex-col items-center justify-center gap-3 min-h-[150px]">
              <FileText className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground text-center font-mono font-semibold">{docPreview}</p>
              <p className="text-[10px] text-muted-foreground text-center">Open in your document viewer for full content.</p>
            </div>
            <button
              onClick={() => { show(`Opening ${docPreview}…`, "info"); setDocPreview(null); }}
              className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Document
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-lg rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${pc.cls}`}>{pc.label}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{task.id}</span>
              {isSelf && <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-info-bg text-info">Personal</span>}
            </div>
            <h2 className="font-display text-[15px] font-bold leading-snug">{editMode ? editTitle : task.title}</h2>
          </div>
          <button onClick={onClose} className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-5 space-y-4">
          {/* Already-completed banner */}
          {isCompleted && (
            <div className="rounded-lg border border-healthy/40 bg-healthy-bg px-4 py-3 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-healthy shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-healthy">Assignment Completed</p>
                {task.completedAt && (
                  <p className="text-[10px] text-healthy/70 mt-0.5">
                    {new Date(task.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
                {task.completionNote && (
                  <p className="mt-1 text-[11px] text-healthy/80 italic">"{task.completionNote}"</p>
                )}
              </div>
            </div>
          )}

          {editMode ? (
            // ── Edit form for self-created tasks ──
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Title <span className="text-critical">*</span></label>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Description</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className="w-full resize-none rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Due Date</label>
                  <input value={editDue} onChange={e => setEditDue(e.target.value)} placeholder="e.g. Next Week" className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Priority</label>
                  <div className="flex gap-1.5">
                    {(["high", "normal", "low"] as const).map(p => (
                      <button key={p} onClick={() => setEditPriority(p)} className={`flex-1 rounded border px-2 py-1.5 text-[10px] font-bold capitalize transition ${editPriority === p ? (p === "high" ? "border-critical bg-critical-bg text-critical" : p === "normal" ? "border-attention bg-attention-bg text-attention" : "border-healthy bg-healthy-bg text-healthy") : "border-border text-muted-foreground"}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Milestones</label>
                <div className="space-y-1.5 mb-2">
                  {editMilestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={m} onChange={e => setEditMilestones(prev => { const n = [...prev]; n[i] = e.target.value; return n; })} className="flex-1 rounded border border-border bg-white px-2 py-1.5 text-xs focus:border-primary focus:outline-none" />
                      <button onClick={() => setEditMilestones(prev => prev.filter((_, j) => j !== i))} className="rounded p-1 text-muted-foreground hover:text-critical hover:bg-critical-bg transition"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newMilestone.trim()) { setEditMilestones(p => [...p, newMilestone.trim()]); setNewMilestone(""); } }} placeholder="Add milestone…" className="flex-1 rounded border border-dashed border-border bg-panel px-2 py-1.5 text-xs focus:border-primary focus:outline-none" />
                  <button onClick={() => { if (newMilestone.trim()) { setEditMilestones(p => [...p, newMilestone.trim()]); setNewMilestone(""); } }} className="rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition">Add</button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Related Documents</label>
                <div className="space-y-1.5 mb-2">
                  {editRelatedDocs.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex-1 rounded border border-border bg-panel px-2 py-1.5 font-mono text-xs">{r}</span>
                      <button onClick={() => setEditRelatedDocs(prev => prev.filter((_, j) => j !== i))} className="rounded p-1 text-muted-foreground hover:text-critical transition"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={editDocRefInput} onChange={e => setEditDocRefInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && editDocRefInput.trim()) { setEditRelatedDocs(p => [...p, editDocRefInput.trim()]); setEditDocRefInput(""); } }} placeholder="e.g. DRW-ENM-042" className="flex-1 rounded border border-dashed border-border bg-panel px-2 py-1.5 font-mono text-xs focus:border-primary focus:outline-none" />
                  <button onClick={() => { if (editDocRefInput.trim()) { setEditRelatedDocs(p => [...p, editDocRefInput.trim()]); setEditDocRefInput(""); } }} className="rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition">Add</button>
                </div>
              </div>
              {editSaved && (
                <div className="rounded-lg border border-healthy/30 bg-healthy-bg px-4 py-2 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-healthy" />
                  <p className="text-xs text-healthy font-medium">Saved!</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Project</p>
                  <p className="mt-0.5 text-sm font-medium">{task.project}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Deadline</p>
                  <p className={`mt-0.5 text-sm font-medium ${task.due.toLowerCase().includes("today") || task.due.toLowerCase().includes("overdue") ? "text-critical font-bold" : ""}`}>{task.due}</p>
                </div>
                {task.assignedBy && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Assigned By</p>
                    <p className="mt-0.5 text-sm">{task.assignedBy}</p>
                  </div>
                )}
              </div>

              {task.description && (
                <div className="rounded bg-panel px-4 py-3">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Task Description</p>
                  <p className="text-sm leading-relaxed">{task.description}</p>
                </div>
              )}

              {task.deliverables && task.deliverables.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Expected Deliverables</p>
                  <ul className="space-y-1.5">
                    {task.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/50" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {task.milestones && task.milestones.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Milestones</p>
                    <span className="font-mono text-[10px] font-semibold text-muted-foreground">{doneCount}/{totalCount} · {overallPct}%</span>
                  </div>
                  <div className="mb-3 h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${overallPct === 100 ? "bg-healthy" : overallPct > 50 ? "bg-primary" : "bg-attention"}`}
                      style={{ width: `${overallPct}%` }}
                    />
                  </div>
                  <div className="space-y-1">
                    {task.milestones.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => toggleMilestone(i)}
                        className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition hover:bg-panel/60 group"
                      >
                        <div className={`h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition ${milestonesDone[i] ? "border-healthy bg-healthy/15" : "border-border group-hover:border-primary/60"}`}>
                          {milestonesDone[i] && <CheckCircle2 className="h-2.5 w-2.5 text-healthy" />}
                        </div>
                        <span className={`text-xs transition ${milestonesDone[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {task.relatedDocs && task.relatedDocs.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Related Documents</p>
                  <div className="flex flex-wrap gap-1.5">
                    {task.relatedDocs.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => setDocPreview(d)}
                        className="inline-flex items-center gap-1 rounded border border-border bg-panel px-2.5 py-1 text-[11px] font-mono text-muted-foreground transition hover:border-primary hover:text-primary"
                      >
                        <FileText className="h-3 w-3" />{d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussion / Threaded Comments */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Discussion</p>
                {comments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {comments.map(c => (
                      <div key={c.id} className="flex items-start gap-2.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                          {c.author.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1 rounded-lg border border-border bg-panel px-3 py-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-bold">{c.author}</span>
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">{c.role}</span>
                            <span className="ml-auto font-mono text-[9px] text-muted-foreground">{c.time}</span>
                          </div>
                          <p className="text-xs leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={2}
                    placeholder="Add a comment…"
                    className="flex-1 resize-none rounded border border-border bg-panel px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!commentText.trim()) return;
                      const newComment: TaskComment = { id: Date.now().toString(), author: authorName ?? "You", role: authorRole ?? "Officer", text: commentText.trim(), time: "Just now" };
                      addTaskComment(task.id, newComment);
                      setComments(prev => [...prev, newComment]);
                      setCommentText("");
                      show("Comment posted.", "success");
                    }}
                    className="self-end rounded bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Mark-complete form (self-created tasks only) */}
              {isSelf && showComplete && !completeSubmitted && (
                <div className="rounded-lg border border-healthy/30 bg-healthy-bg/50 p-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-healthy">Mark Assignment Complete</p>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Completion Notes <span className="text-[10px] normal-case font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={completeNote}
                      onChange={e => setCompleteNote(e.target.value)}
                      rows={3}
                      placeholder="Describe what was accomplished, any deliverables, or handoff notes…"
                      className="w-full resize-none rounded border border-border bg-white px-3 py-2 text-xs focus:border-healthy focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => { setShowComplete(false); setEditMode(true); }}
                      className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition"
                    >
                      ← Needs modification instead
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => setShowComplete(false)} className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                      <button onClick={handleMarkComplete} className="rounded bg-healthy px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition">
                        Confirm Complete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isSelf && completeSubmitted && (
                <div className="rounded-lg border border-healthy/30 bg-healthy-bg px-4 py-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-healthy shrink-0" />
                  <p className="text-xs font-medium text-healthy">Assignment marked complete. Well done!</p>
                </div>
              )}

              {showProgress && !progressSubmitted && (
                <div className="rounded-lg border border-primary/25 bg-primary/5 p-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-primary">Submit Progress Update</p>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Progress Note <span className="text-critical">*</span></label>
                    <textarea
                      value={progressNote}
                      onChange={e => setProgressNote(e.target.value)}
                      rows={3}
                      placeholder="Describe what has been completed and what remains..."
                      className="w-full resize-none rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">% Complete</label>
                      <input
                        type="number" min="0" max="100"
                        value={progressPct}
                        onChange={e => setProgressPct(e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Blockers (optional)</label>
                      <input
                        value={blocker}
                        onChange={e => setBlocker(e.target.value)}
                        placeholder="Any blockers?"
                        className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setShowProgress(false)} className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                    <button onClick={handleProgressSubmit} className="rounded bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">Submit Update</button>
                  </div>
                </div>
              )}
              {showProgress && progressSubmitted && (
                  <div className="rounded-lg border border-healthy/30 bg-healthy-bg px-4 py-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-healthy shrink-0" />
                    <p className="text-xs text-healthy font-medium">Progress update submitted to your head successfully.</p>
                  </div>
                )}
              </>
            )}
          </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          {editMode ? (
            <>
              <button onClick={() => setEditMode(false)} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleSaveEdit} className="rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Save Changes</button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Close</button>
              {isSelf && onUpdate && !isCompleted && (
                <>
                  <button onClick={() => setEditMode(true)} className="inline-flex items-center gap-1.5 rounded border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition">
                    <Pencil className="h-3.5 w-3.5" /> Modify
                  </button>
                  {onTransfer && (
                    <button onClick={onTransfer} className="inline-flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition">
                      <ArrowRight className="h-3.5 w-3.5" /> Transfer
                    </button>
                  )}
                  <button onClick={() => { setShowComplete(true); setShowProgress(false); }} className="inline-flex items-center gap-1.5 rounded bg-healthy px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                  </button>
                </>
              )}
              {!isSelf && !showProgress && !progressSubmitted && (
                <button
                  onClick={() => setShowProgress(true)}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  <FileText className="h-3.5 w-3.5" /> Submit Progress Update
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateSelfAssignmentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (task: AssignmentTask) => void }) {
  const { show } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<AssignmentTask["priority"]>("normal");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [milestones, setMilestones] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [docRefInput, setDocRefInput] = useState("");
  const [relatedDocs, setRelatedDocs] = useState<string[]>([]);

  function handleSubmit() {
    if (!title.trim()) { show("Title is required.", "warning"); return; }
    const task: AssignmentTask = {
      id: `SELF-${Date.now().toString().slice(-5)}`,
      title: title.trim(),
      project: project.trim() || "Personal",
      due: due.trim() || "Flexible",
      priority,
      description: description.trim() || undefined,
      milestones: milestones.filter(l => l.trim()).map(l => ({ label: l, done: false })),
      relatedDocs: relatedDocs.length > 0 ? relatedDocs : undefined,
      createdBy: "self",
    };
    onCreate(task);
    setSubmitted(true);
    show("Personal assignment created!", "success");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-[15px] font-bold">New Personal Assignment</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Visible only to you · not sent to your head</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-healthy" />
            <p className="font-display text-base font-bold">Assignment Created</p>
            <p className="mt-1 text-sm text-muted-foreground">Your personal task has been added to Active Assignments.</p>
            <button onClick={onClose} className="mt-6 rounded bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Title <span className="text-critical">*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Optional details..." className="w-full resize-none rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Project / Context</label>
                <input value={project} onChange={e => setProject(e.target.value)} placeholder="e.g. General Admin" className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Due Date</label>
                <input value={due} onChange={e => setDue(e.target.value)} placeholder="e.g. Next Week" className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Priority</label>
              <div className="flex gap-2">
                {(["high", "normal", "low"] as const).map(p => (
                  <button key={p} onClick={() => setPriority(p)} className={`flex-1 rounded border px-3 py-1.5 text-[10px] font-bold capitalize transition ${priority === p ? (p === "high" ? "border-critical bg-critical-bg text-critical" : p === "normal" ? "border-attention bg-attention-bg text-attention" : "border-healthy bg-healthy-bg text-healthy") : "border-border text-muted-foreground hover:border-border-strong"}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Milestones (optional)</label>
              <div className="space-y-1.5 mb-2">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 rounded border border-border bg-panel px-2 py-1.5 text-xs">{m}</span>
                    <button onClick={() => setMilestones(prev => prev.filter((_, j) => j !== i))} className="rounded p-1 text-muted-foreground hover:text-critical transition"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={milestoneInput} onChange={e => setMilestoneInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && milestoneInput.trim()) { setMilestones(p => [...p, milestoneInput.trim()]); setMilestoneInput(""); } }} placeholder="Add a milestone…" className="flex-1 rounded border border-dashed border-border bg-panel px-2 py-1.5 text-xs focus:border-primary focus:outline-none" />
                <button onClick={() => { if (milestoneInput.trim()) { setMilestones(p => [...p, milestoneInput.trim()]); setMilestoneInput(""); } }} className="rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition">Add</button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Related Documents (optional)</label>
              <div className="space-y-1.5 mb-2">
                {relatedDocs.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 rounded border border-border bg-panel px-2 py-1.5 font-mono text-xs">{r}</span>
                    <button onClick={() => setRelatedDocs(prev => prev.filter((_, j) => j !== i))} className="rounded p-1 text-muted-foreground hover:text-critical transition"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={docRefInput} onChange={e => setDocRefInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && docRefInput.trim()) { setRelatedDocs(p => [...p, docRefInput.trim()]); setDocRefInput(""); } }} placeholder="e.g. DRW-ENM-042" className="flex-1 rounded border border-dashed border-border bg-panel px-2 py-1.5 font-mono text-xs focus:border-primary focus:outline-none" />
                <button onClick={() => { if (docRefInput.trim()) { setRelatedDocs(p => [...p, docRefInput.trim()]); setDocRefInput(""); } }} className="rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition">Add</button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={onClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleSubmit} className="rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Create Assignment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ALL_OFFICERS = [
  { role: "engineer", name: "Engr. Abdullahi Musa Dabo" },
  { role: "architect", name: "Arc. Safiya Garba Aliyu" },
  { role: "qs", name: "Mr. Ismail Sule Waziri" },
  { role: "accountant", name: "Ms. Hadiza Lawal Bello" },
  { role: "procurement", name: "Mr. Bashir Abubakar Dabo" },
  { role: "admin", name: "Miss Bola Adekunle" },
  { role: "site", name: "Mr. Sa'adu Usman Garba" },
];

function TransferAssignmentModal({ open, task, onClose, fromOfficerName, currentOfficerRole }: { open: boolean; task: AssignmentTask; onClose: () => void; fromOfficerName: string; currentOfficerRole: string }) {
  const { show } = useToast();
  const [selectedRole, setSelectedRole] = useState("");
  const [handoffNote, setHandoffNote] = useState("");

  if (!open) return null;

  const eligibleOfficers = ALL_OFFICERS.filter(o => o.role !== currentOfficerRole);
  const selectedOfficer = eligibleOfficers.find(o => o.role === selectedRole);

  function handleConfirm() {
    if (!selectedRole || !selectedOfficer) { show("Please select a target officer.", "warning"); return; }
    _assignToRole(selectedRole, { ...task, assignedBy: fromOfficerName + " (transferred)", createdBy: "head" as const, completed: false });
    show(`Assignment transferred to ${selectedOfficer.name}.`, "success");
    setSelectedRole(""); setHandoffNote("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-[15px] font-bold">Transfer Assignment</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Hand off to another officer — they receive it as a head-assigned task</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Transfer To <span className="text-critical">*</span></label>
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
              <option value="">Select officer…</option>
              {eligibleOfficers.map(o => <option key={o.role} value={o.role}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Handoff Note</label>
            <textarea value={handoffNote} onChange={e => setHandoffNote(e.target.value)} rows={3} placeholder="Explain what has been done and what remains…" className="w-full resize-none rounded border border-border bg-panel px-3 py-2 text-xs focus:border-primary/50 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button onClick={onClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
            <button onClick={handleConfirm} className="rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Confirm Transfer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeadAssignTaskModal({ open, onClose, officerRole, officerName, headName }: { open: boolean; onClose: () => void; officerRole: string; officerName: string; headName: string }) {
  const { show } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<AssignmentTask["priority"]>("normal");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [milestones, setMilestones] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  function handleClose() {
    setTitle(""); setDescription(""); setDue(""); setPriority("normal");
    setMilestones([]); setMilestoneInput(""); setSubmitted(false);
    onClose();
  }

  function handleSubmit() {
    if (!title.trim()) { show("Task title is required.", "warning"); return; }
    const task: AssignmentTask = {
      id: `ASN-${Date.now().toString().slice(-5)}`,
      title: title.trim(),
      project: "Head Assigned",
      due: due.trim() || "This Week",
      priority,
      description: description.trim() || undefined,
      assignedBy: headName,
      milestones: milestones.filter(l => l.trim()).map(l => ({ label: l, done: false })),
      createdBy: "head",
    };
    _assignToRole(officerRole, task);
    setSubmitted(true);
    show(`Task assigned to ${officerName}.`, "success");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-[15px] font-bold">Assign Task to Officer</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Assign to <span className="font-semibold">{officerName}</span> · appears in their Active Assignments</p>
          </div>
          <button onClick={handleClose} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-healthy" />
            <p className="font-display text-base font-bold">Task Assigned</p>
            <p className="mt-1 text-sm text-muted-foreground">Task assigned to <span className="font-semibold">{officerName}</span> — they can see it in their Active Assignments.</p>
            <button onClick={handleClose} className="mt-6 rounded bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Task Title <span className="text-critical">*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What should they do?" className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Details, context, expected outcomes..." className="w-full resize-none rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Due Date</label>
                <input value={due} onChange={e => setDue(e.target.value)} placeholder="e.g. Today, Next Week" className="w-full rounded border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Priority</label>
                <div className="flex gap-1.5">
                  {(["high", "normal", "low"] as const).map(p => (
                    <button key={p} onClick={() => setPriority(p)} className={`flex-1 rounded border px-2 py-1.5 text-[10px] font-bold capitalize transition ${priority === p ? (p === "high" ? "border-critical bg-critical-bg text-critical" : p === "normal" ? "border-attention bg-attention-bg text-attention" : "border-healthy bg-healthy-bg text-healthy") : "border-border text-muted-foreground"}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Milestones (optional)</label>
              <div className="space-y-1.5 mb-2">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 rounded border border-border bg-panel px-2 py-1.5 text-xs">{m}</span>
                    <button onClick={() => setMilestones(prev => prev.filter((_, j) => j !== i))} className="rounded p-1 text-muted-foreground hover:text-critical transition"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={milestoneInput} onChange={e => setMilestoneInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && milestoneInput.trim()) { setMilestones(p => [...p, milestoneInput.trim()]); setMilestoneInput(""); } }} placeholder="Add a milestone…" className="flex-1 rounded border border-dashed border-border bg-panel px-2 py-1.5 text-xs focus:border-primary focus:outline-none" />
                <button onClick={() => { if (milestoneInput.trim()) { setMilestones(p => [...p, milestoneInput.trim()]); setMilestoneInput(""); } }} className="rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition">Add</button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={handleClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleSubmit} className="rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Assign to {officerName.split(" ").slice(-1)[0]}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OfficerTasksPanel({ tasks, officerRole, officerName, officerRoleLabel }: { tasks: AssignmentTask[]; officerRole?: string; officerName?: string; officerRoleLabel?: string }) {
  const headTasks = useHeadAssignedTasks(officerRole ?? "__none__");
  const [localTasks, setLocalTasks] = useState<AssignmentTask[]>([]);
  const [activeTask, setActiveTask] = useState<AssignmentTask | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [transferTask, setTransferTask] = useState<AssignmentTask | null>(null);

  const allTasks = [...headTasks, ...tasks, ...localTasks];

  function handleCreate(task: AssignmentTask) {
    setLocalTasks(prev => [task, ...prev]);
    setShowCreate(false);
  }

  function handleUpdate(id: string, updates: Partial<AssignmentTask>) {
    setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (activeTask?.id === id) setActiveTask(prev => prev ? { ...prev, ...updates } : null);
  }

  return (
    <>
      {showCreate && <CreateSelfAssignmentModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {transferTask && <TransferAssignmentModal open={true} task={transferTask} onClose={() => setTransferTask(null)} fromOfficerName={officerName ?? "You"} currentOfficerRole={officerRole ?? ""} />}
      <AssignmentDetailModal task={activeTask} onClose={() => setActiveTask(null)} onUpdate={handleUpdate} onTransfer={activeTask?.createdBy === "self" ? () => { const t = activeTask; setActiveTask(null); setTransferTask(t); } : undefined} authorName={officerName} authorRole={officerRoleLabel} />
      <Card>
        <SectionHead
          title="My Active Assignments"
          hint="Head-assigned and personal tasks"
          action={
            <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary hover:bg-primary/10 transition">
              <Plus className="h-3 w-3" /> New
            </button>
          }
        />
        <div className="divide-y divide-border">
          {allTasks.length === 0 && (
            <p className="px-4 py-3 text-xs text-muted-foreground">No active assignments. Use "+ New" to create a personal task.</p>
          )}
          {allTasks.map((t) => {
            const isSelf = t.createdBy === "self";
            const isDone = t.completed === true;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTask(t)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-panel/40 group ${isDone ? "opacity-60" : ""}`}
              >
                {isDone
                  ? <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-healthy" />
                  : <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${t.priority === "high" ? "bg-critical" : t.priority === "normal" ? "bg-attention" : "bg-healthy"}`} />
                }
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className={`text-sm font-medium leading-snug transition-colors ${isDone ? "line-through text-muted-foreground" : "group-hover:text-primary"}`}>{t.title}</p>
                    {isDone
                      ? <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold bg-healthy-bg text-healthy">Done</span>
                      : <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${isSelf ? "bg-info-bg text-info" : "bg-secondary text-muted-foreground"}`}>{isSelf ? "Personal" : "Assigned"}</span>
                    }
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">{t.id} · {t.project}</p>
                  {isDone && t.completionNote && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground italic truncate">"{t.completionNote}"</p>
                  )}
                  {!isDone && t.milestones && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {t.milestones.filter(m => m.done).length}/{t.milestones.length} milestones
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {!isDone && <span className={`font-mono text-[10px] ${t.due.toLowerCase().includes("today") ? "font-bold text-critical" : "text-muted-foreground"}`}>{t.due}</span>}
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </>
  );
}

interface RequestDraft {
  type: string;
  priority: "urgent" | "high" | "normal" | "low";
  reason: string;
  description: string;
  project: string;
  amount: string;
  hasImage: boolean;
}

function RaiseRequestModal({
  open, onClose, headName, requestTypes,
}: {
  open: boolean;
  onClose: () => void;
  headName: string;
  requestTypes: string[];
}) {
  const { show } = useToast();
  const [draft, setDraft] = useState<RequestDraft>({
    type: "", priority: "normal", reason: "", description: "", project: "", amount: "", hasImage: false,
  });
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const reqId = `REQ-${Date.now().toString().slice(-6)}`;

  function handleSubmit() {
    if (!draft.type) { show("Please select a request type.", "warning"); return; }
    if (!draft.reason.trim()) { show("Please state the reason for your request.", "warning"); return; }
    setSubmitted(true);
  }

  function handleClose() {
    setDraft({ type: "", priority: "normal", reason: "", description: "", project: "", amount: "", hasImage: false });
    setSubmitted(false);
    onClose();
  }

  const priorityOpts: { value: RequestDraft["priority"]; label: string; cls: string }[] = [
    { value: "urgent", label: "Urgent", cls: "border-critical text-critical bg-critical-bg" },
    { value: "high",   label: "High",   cls: "border-attention text-attention bg-attention-bg" },
    { value: "normal", label: "Normal", cls: "border-primary text-primary bg-primary/8" },
    { value: "low",    label: "Low",    cls: "border-border text-muted-foreground bg-panel" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-[15px] font-bold">Raise a Request</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Submitted to <span className="font-semibold">{headName}</span> for first approval
            </p>
          </div>
          <button onClick={handleClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-healthy" />
            <p className="font-display text-base font-bold">Request Submitted</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono font-semibold text-primary">{reqId}</span> has been sent to {headName} for review.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">You can track its progress in <strong>My Submissions</strong>.</p>
            <button onClick={handleClose} className="mt-6 rounded bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Request Type */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Request Type <span className="text-critical">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {requestTypes.map(rt => (
                  <button
                    key={rt}
                    onClick={() => setDraft(d => ({ ...d, type: rt }))}
                    className={`rounded border px-3 py-2 text-left text-xs font-medium transition ${draft.type === rt ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground hover:border-border-strong"}`}
                  >
                    {rt}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Priority</label>
              <div className="flex flex-wrap gap-1.5">
                {priorityOpts.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setDraft(d => ({ ...d, priority: p.value }))}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${draft.priority === p.value ? p.cls : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Reason / Justification <span className="text-critical">*</span></label>
              <textarea
                value={draft.reason}
                onChange={e => setDraft(d => ({ ...d, reason: e.target.value }))}
                rows={2}
                placeholder="Why is this request being raised? What is the business need?"
                className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Description / Details</label>
              <textarea
                value={draft.description}
                onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                rows={3}
                placeholder="Provide full details, quantities, specifications, or instructions relevant to this request..."
                className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none"
              />
            </div>

            {/* Related Project */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Related Project (if applicable)</label>
              <input
                value={draft.project}
                onChange={e => setDraft(d => ({ ...d, project: e.target.value }))}
                placeholder="e.g. Abuja Housing Ph II"
                className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>

            {/* Amount (conditional) */}
            {(draft.type.toLowerCase().includes("expense") || draft.type.toLowerCase().includes("payment") || draft.type.toLowerCase().includes("procurement") || draft.type.toLowerCase().includes("material")) && (
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Estimated Amount (&#8358;)</label>
                <input
                  value={draft.amount}
                  onChange={e => setDraft(d => ({ ...d, amount: e.target.value }))}
                  placeholder="e.g. 450,000"
                  className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>
            )}

            {/* Image upload (informational) */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Supporting Evidence / Image (Optional)</label>
              <button
                onClick={() => setDraft(d => ({ ...d, hasImage: !d.hasImage }))}
                className={`flex w-full items-center gap-3 rounded border border-dashed px-4 py-3 text-xs transition ${draft.hasImage ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                <Camera className="h-4 w-4 shrink-0" />
                {draft.hasImage ? "Supporting image attached" : "Tap to attach a photo or document"}
              </button>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <button onClick={handleClose} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                <ArrowRight className="h-3.5 w-3.5" /> Submit to {headName}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OfficerQuickActions({
  actions: qs,
  headName,
  requestTypes,
}: {
  actions: { label: string; icon: React.ElementType; hint: string; action?: () => void }[];
  headName: string;
  requestTypes: string[];
}) {
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <RaiseRequestModal open={open} onClose={() => setOpen(false)} headName={headName} requestTypes={requestTypes} />
      <Card>
        {/* Activity shortcuts */}
        <div className="border-b border-border px-4 py-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">My Quick Actions</p>
        </div>
        <div className="divide-y divide-border/60 p-1">
          {qs.map((q) => (
            <button
              key={q.label}
              onClick={() => {
                if (q.action) { q.action(); }
                else { show(`${q.label} — logged successfully.`, "success"); }
              }}
              className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left transition hover:bg-panel group"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/8 group-hover:bg-primary/15 transition">
                <q.icon className="h-3 w-3 text-primary" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium leading-tight group-hover:text-primary transition-colors">{q.label}</p>
                <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">{q.hint}</p>
              </div>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40 group-hover:text-primary transition" />
            </button>
          ))}
        </div>
        {/* Formal request section */}
        <div className="border-t border-border px-4 pb-3 pt-2.5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Formal Request</p>
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-2 rounded border border-primary/25 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
          >
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            Raise a Request → {headName}
          </button>
        </div>
      </Card>
    </>
  );
}

function DelegationBanner({ role }: { role: string }) {
  const myDelegations = delegations.filter(d => d.toRole === role && d.active);
  if (myDelegations.length === 0) return null;

  const today = new Date("2026-09-06");
  const expiringSoon = myDelegations.filter(d => {
    if (!d.endDate) return false;
    const parts = d.endDate.split(" ");
    // parse "09 Sep 2026" format
    const parsed = new Date(`${parts[2]}-${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(parts[1]) + 1}-${parts[0]}`);
    const daysLeft = Math.ceil((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft >= 0;
  });

  return (
    <div className="rounded-[var(--radius)] border border-primary/30 bg-primary/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Delegated Permissions</p>
      </div>
      {expiringSoon.length > 0 && (
        <div className="mb-3 rounded-lg border border-attention/40 bg-attention-bg/60 px-3 py-2 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-attention shrink-0" />
          <p className="text-[11px] text-attention font-medium">
            {expiringSoon.length === 1 ? "1 delegation" : `${expiringSoon.length} delegations`} expire within 3 days — contact your head to renew.
          </p>
        </div>
      )}
      <p className="mb-2 text-xs text-muted-foreground">Your Head has granted you the following additional authorities:</p>
      <div className="space-y-1.5">
        {myDelegations.map(d => (
          <div key={d.id} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-healthy" />
            <div className="min-w-0">
              <p className="text-xs font-semibold">{DELEGATION_PERMISSION_LABELS[d.permission]}</p>
              {d.conditions && <p className="text-[10px] text-muted-foreground">{d.conditions}</p>}
              <p className="text-[10px] text-muted-foreground">Granted by {d.fromName} · Valid from {d.startDate}{d.endDate ? ` to ${d.endDate}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── TEAM PERFORMANCE CARD ─────────────────────────── */

function TeamPerformanceCard({ officerName, officerRole }: { officerName: string; officerRole: string }) {
  const headTasks = useHeadAssignedTasks(officerRole);
  const totalAssigned = headTasks.length;
  const completedCount = headTasks.filter(t => t.completed).length;
  const activeCount = totalAssigned - completedCount;
  const overdueCount = headTasks.filter(t => !t.completed && (t.due.toLowerCase().includes("overdue") || t.due.toLowerCase().includes("today"))).length;
  const pct = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

  return (
    <Card className="p-4 space-y-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Officer Performance</p>
        <p className="mt-0.5 text-sm font-semibold">{officerName}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border bg-panel px-2.5 py-2 text-center">
          <p className="font-display text-lg font-bold text-foreground">{activeCount}</p>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Active</p>
        </div>
        <div className="rounded-lg border border-border bg-panel px-2.5 py-2 text-center">
          <p className="font-display text-lg font-bold text-healthy">{completedCount}</p>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Done</p>
        </div>
        <div className="rounded-lg border border-border bg-panel px-2.5 py-2 text-center">
          <p className={`font-display text-lg font-bold ${overdueCount > 0 ? "text-critical" : "text-muted-foreground"}`}>{overdueCount}</p>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Overdue</p>
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Completion rate</span>
          <span className={`font-mono text-[10px] font-bold ${pct === 100 ? "text-healthy" : pct > 50 ? "text-primary" : "text-attention"}`}>{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${pct === 100 ? "bg-healthy" : pct > 50 ? "bg-primary" : "bg-attention"}`} style={{ width: `${pct}%` }} />
        </div>
        {totalAssigned === 0 && <p className="mt-1.5 text-[10px] text-muted-foreground italic">No tasks assigned via dashboard yet.</p>}
      </div>
    </Card>
  );
}

/* ─────────────────────────── ENGINEER (OFFICER) DASHBOARD ─────────────────────────── */

const engineerTasks: AssignmentTask[] = [
  {
    id: "ENG-CALC-004",
    title: "Roof beam sizing: Block D, Abuja Housing",
    project: "Abuja Housing Ph II",
    due: "Today 17:00",
    priority: "high",
    description: "Perform structural sizing calculations for all roof beams on Block D. Use updated loading data from the architectural drawings revision C issued 04 Sep.",
    assignedBy: "Engr. Musa Usman Lawan (Project Manager)",
    deliverables: [
      "Completed beam sizing calculation sheet (PDF)",
      "Summary table: beam sizes per gridline",
      "Design note flagging any non-standard sections",
    ],
    milestones: [
      { label: "Collect revised architectural drawings", done: true },
      { label: "Perform dead + live load analysis", done: true },
      { label: "Size all beam sections", done: false },
      { label: "Peer review by Head of Engineering", done: false },
    ],
    relatedDocs: ["DWG-BLK-D-Rev-C", "STRUCT-LOAD-2026-08", "SPEC-STEEL-001"],
  },
  {
    id: "TQ-022",
    title: "Draft TQ response: curtain wall anchor spacing",
    project: "Gov't Office Complex",
    due: "Tomorrow",
    priority: "high",
    description: "The subcontractor raised a Technical Query on anchor bolt spacing for the curtain wall system. Review the specification, check against supplier technical data, and draft a clear written response.",
    assignedBy: "Head of Engineering",
    deliverables: [
      "Written TQ response with technical justification",
      "Reference to applicable code clause",
      "Revised detail sketch if required",
    ],
    milestones: [
      { label: "Review TQ and supplier technical data", done: true },
      { label: "Draft response", done: false },
      { label: "Submit to Head for review", done: false },
    ],
    relatedDocs: ["TQ-021", "SPEC-CW-2026-004", "DWG-FA-007"],
  },
  {
    id: "DWG-REV-031",
    title: "Review structural shop drawings from contractor",
    project: "PH Logistics Warehouse",
    due: "10 Sep",
    priority: "normal",
    description: "Check and comment on structural steel shop drawings submitted by the main contractor. Focus on connection details, weld sizes, and bolt grades.",
    assignedBy: "Head of Engineering",
    deliverables: [
      "Annotated drawings with review comments (PDF)",
      "Transmittal letter: Approved / Approved with Comments / Rejected",
    ],
    milestones: [
      { label: "Receive drawing set from contractor", done: true },
      { label: "Technical review", done: false },
      { label: "Issue transmittal to PM", done: false },
    ],
    relatedDocs: ["SHOP-STR-PH-031", "SPEC-STRUCT-002"],
  },
  {
    id: "INSP-PRJ001",
    title: "Pre-pour structural inspection: Block C",
    project: "Abuja Housing Ph II",
    due: "08 Sep",
    priority: "normal",
    description: "Carry out a pre-concrete pour structural inspection on Block C. Verify rebar placement, cover, lapping, and formwork dimensions against approved drawings.",
    assignedBy: "Engr. Musa Usman Lawan (Project Manager)",
    deliverables: [
      "Completed inspection checklist",
      "Photographic evidence (minimum 20 photos)",
      "Signed inspection sign-off or punch list",
    ],
    milestones: [
      { label: "Confirm site visit date with PM", done: true },
      { label: "Conduct site inspection", done: false },
      { label: "Submit report within 4 hours", done: false },
    ],
    relatedDocs: ["DWG-BLK-C-STRUCT-Rev-B", "INSP-FORM-005"],
  },
];

const engineerSubmissions: OfficerSubmission[] = [
  { id: "ENG-CALC-003", title: "Foundation load calculation: Block C revised", type: "Structural Calculation", submittedDate: "05 Sep", status: "pending-head", },
  { id: "TQ-021",       title: "TQ Response: re-bar lapping at column base", type: "Technical Query",        submittedDate: "04 Sep", status: "forwarded", forwardedTo: "Project Manager (Engr. Musa Usman Lawan)" },
  { id: "ENG-RPT-009",  title: "Structural inspection report: Block B",       type: "Inspection Report",     submittedDate: "03 Sep", status: "head-approved" },
  { id: "ENG-CALC-002", title: "Slab thickness justification: Gov't Office",  type: "Structural Calculation", submittedDate: "30 Aug", status: "rejected", rejectionNote: "Recalculate using updated soil report. Resubmit by 09 Sep." },
];

const engineerDuties: DutyEntry[] = [
  { id: "E001", task: "Weekly structural review meeting: Abuja Housing Phase II", time: "09:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Meeting", assignedBy: "Engr. Akintunde (Head Engineering)", recurring: "weekly" },
  { id: "E002", task: "On-site structural inspection: Block C column reinforcement", time: "11:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Inspection", assignedBy: "Engr. Akintunde (Head Engineering)", recurring: "daily" },
  { id: "E003", task: "Review and mark up TQ-022: grid line adjustment at Level 2", time: "14:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Design Review", assignedBy: "Engr. Akintunde (Head Engineering)" },
  { id: "E004", task: "Structural calculation review: ENG-CALC-003 before resubmission", time: "16:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Design Review", assignedBy: "Engr. Akintunde (Head Engineering)" },
  { id: "E005", task: "Prepare site visit briefing notes for Monday 07 Sep", time: "17:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Preparation", assignedBy: "Engr. Akintunde (Head Engineering)", recurring: "daily" },
  { id: "E006", task: "Coordination meeting: MEP vs structural clash resolution", time: "10:00", date: "04 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Meeting", assignedBy: "Engr. Akintunde (Head Engineering)" },
  { id: "E007", task: "Review updated soil investigation report: Gov't Office Complex", time: "14:30", date: "03 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Design Review", assignedBy: "Engr. Akintunde (Head Engineering)" },
  { id: "E008", task: "Submit corrected slab thickness calculation: ENG-CALC-002", time: "09:00", date: "02 Sep", weekLabel: "Week 35", monthLabel: "September 2026", category: "Submission", assignedBy: "Engr. Akintunde (Head Engineering)" },
];

export function EngineerDashboard({ nav }: { nav: Nav }) {
  const head = headDisplayMap["head-engineering"]!;
  const [subDetail, setSubDetail] = useState<ApprovalDetailItem | null>(null);
  function buildOfficerDetail(s: OfficerSubmission, headStaffId: string, headStaffName: string, headStaffTitle: string): ApprovalDetailItem {
    const actionMap: Record<OfficerSubmission["status"], string> = { draft: "pending", "pending-head": "pending", "head-approved": "approved", forwarded: "approved", rejected: "rejected" };
    return { id: s.id, title: s.title, type: s.type, submitted: s.submittedDate, status: s.status === "rejected" ? "rejected" : s.status === "forwarded" || s.status === "head-approved" ? "approved" : "in-review", notes: s.rejectionNote, chain: [{ staffId: "self-01", staffName: "Engr. Aminu Garba", staffTitle: "Structural Engineer", action: "approved", note: "Submitted for head review.", timestamp: s.submittedDate, isFinal: false }, { staffId: headStaffId, staffName: headStaffName, staffTitle: headStaffTitle, action: actionMap[s.status] as any, note: s.status === "rejected" ? (s.rejectionNote ?? "") : s.status === "head-approved" || s.status === "forwarded" ? "Reviewed and approved." : "", timestamp: s.status !== "pending-head" ? s.submittedDate : "", isFinal: !s.forwardedTo }, ...(s.forwardedTo ? [{ staffId: "next-01", staffName: s.forwardedTo, staffTitle: "Next approver", action: "pending" as const, note: "", timestamp: "", isFinal: true }] : []) ] };
  }
  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={subDetail} onClose={() => setSubDetail(null)} />
      <RoleHeader greeting="Good morning" name="Engr. Aminu Garba" title="Structural Engineer" company="USV Development Services" date={today} />
      <ApprovalFlowBanner headName={head.name} headTitle={head.title} nextParty="Project Manager / Client" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="My Assignments" value="4" sub="tasks this week" icon={ClipboardList} tone="neutral" />
        <MetricTile label="Pending Head" value="1" sub="awaiting Engr. Akintunde" tone="attention" icon={Clock} onClick={() => nav("action")} />
        <MetricTile label="Forwarded On" value="1" sub="Head approved, at PM" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Returned" value="1" sub="needs revision" tone="critical" icon={AlertTriangle} onClick={() => nav("action")} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <OfficerTasksPanel tasks={engineerTasks} officerRole="engineer" officerName="Engr. Aminu Garba" officerRoleLabel="Engineer" />
          <OfficerSubmissionsPanel submissions={engineerSubmissions} headName={head.name} onView={(s) => setSubDetail(buildOfficerDetail(s, "head-eng-01", head.name, head.title))} />
          <DutiesTodayPanel duties={engineerDuties} headName={head.name} />
        </div>
        <div className="space-y-4">
          <OfficerQuickActions
            headName={head.name}
            requestTypes={["Technical Query Response", "Inspection Request", "Structural Calculation", "Material Request", "Site Instruction", "Expense Claim", "Leave Request", "Other"]}
            actions={[
              { label: "Submit Structural Calculation", icon: FileText, hint: "→ Head Engineering" },
              { label: "Raise Technical Query (TQ)", icon: BookOpen, hint: "→ Head Engineering" },
              { label: "Log Site Inspection Report", icon: ClipboardList, hint: "→ Head Engineering" },
              { label: "Flag Design Discrepancy", icon: AlertTriangle, hint: "→ Head Engineering" },
            ]}
          />
          <Card className="p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">My Projects</p>
            {[
              { name: "Abuja Housing Ph II", role: "Structural Lead", h: "critical" as const },
              { name: "Gov't Office Complex", role: "MEP Co-ordinator", h: "healthy" as const },
              { name: "PH Logistics Warehouse", role: "Reviewer", h: "healthy" as const },
            ].map((p) => (
              <button key={p.name} onClick={() => nav("portfolio")} className="flex w-full items-start gap-2.5 text-left">
                <HealthDot h={p.h} className="mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.role}</p>
                </div>
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ARCHITECT (OFFICER) DASHBOARD ─────────────────────────── */

const architectTasks: AssignmentTask[] = [
  {
    id: "DWG-ENM-042",
    title: "First floor layout revision: Medical Centre",
    project: "Enugu Medical Centre",
    due: "Today 17:00",
    priority: "high",
    assignedBy: "Arc. Chidi Adeyemi (Head Architect)",
    description: "Revise the first floor layout drawings of the Enugu Medical Centre to incorporate the client's updated ward configuration. New layout reduces ward count by 2 but increases corridor width to 2.4 m. Update all affected room schedules and dimensions.",
    deliverables: [
      "Revised first-floor layout CAD drawing (DWG + PDF)",
      "Updated room schedule with areas in m²",
      "Change log noting all revisions from Rev B to Rev C",
    ],
    milestones: [
      { label: "Review client brief and Rev B drawings", done: true },
      { label: "Update layout in CAD", done: false },
      { label: "QA check by another architect", done: false },
      { label: "Issue Rev C for Head Architect review", done: false },
    ],
    relatedDocs: ["DWG-ENM-FL1-RevB", "CLIENT-BRIEF-ENM-004", "ROOM-SCH-ENM-RevB"],
  },
  {
    id: "SPEC-ENM-023",
    title: "External cladding spec sheet: Level 2",
    project: "Enugu Medical Centre",
    due: "09 Sep",
    priority: "normal",
    assignedBy: "Arc. Chidi Adeyemi (Head Architect)",
    description: "Prepare the technical specification sheet for external cladding panels at Level 2 of the medical centre. Coordinate with the structural engineer on fixing details. Reference approved material sample for colour and profile.",
    deliverables: [
      "Specification clause (NBS-format) for cladding system",
      "Fixing detail drawing (1:20 scale)",
      "Material data sheet from manufacturer",
    ],
    milestones: [
      { label: "Confirm approved material sample", done: true },
      { label: "Draft NBS specification clause", done: false },
      { label: "Coordinate fixing detail with structural engineer", done: false },
      { label: "Submit spec to Head Architect", done: false },
    ],
    relatedDocs: ["SAMPLE-CLAD-ENM-003", "STRUCT-FIX-REF-022"],
  },
  {
    id: "DWG-LCC-013",
    title: "Elevation drawing: South facade",
    project: "Lagos Commercial Complex",
    due: "11 Sep",
    priority: "low",
    assignedBy: "Arc. Chidi Adeyemi (Head Architect)",
    description: "Produce the fully annotated south elevation drawing for the Lagos Commercial Complex. Ensure all facade materials, levels, and fenestration are dimensioned and referenced to the spec. Include a 1:5 window detail.",
    deliverables: [
      "1:100 annotated south elevation drawing",
      "1:5 window jamb and head detail",
      "Materials legend and reference keynotes",
    ],
    milestones: [
      { label: "Set up drawing sheet and gridlines", done: true },
      { label: "Draft elevation from 3D model export", done: true },
      { label: "Annotate materials and dimensions", done: false },
      { label: "Issue for Head Architect sign-off", done: false },
    ],
    relatedDocs: ["DWG-LCC-PLAN-011", "SPEC-LCC-FACADE-007"],
  },
  {
    id: "RFI-ENM-007",
    title: "Respond to RFI from structural engineer",
    project: "Enugu Medical Centre",
    due: "Tomorrow",
    priority: "high",
    assignedBy: "Engr. Okonkwo (Structural Engineer) via Head Architect",
    description: "Structural engineer has raised an RFI regarding the beam depth at grid intersection B3–C3 on Level 2. The current slab soffit level conflicts with the suspended ceiling height in the corridor. Provide a coordinated response with revised soffit level or alternative detail.",
    deliverables: [
      "Written RFI response letter",
      "Revised section drawing at B3–C3 (if applicable)",
      "Coordination note signed by Head Architect",
    ],
    milestones: [
      { label: "Review RFI and original drawings", done: true },
      { label: "Identify resolution option", done: false },
      { label: "Draft written response", done: false },
      { label: "Submit to Head Architect for co-sign", done: false },
    ],
    relatedDocs: ["RFI-ENM-007-INCOMING", "SEC-ENM-B3C3-RevA", "DWG-ENM-L2-RevB"],
  },
];

const architectSubmissions: OfficerSubmission[] = [
  { id: "DWG-ENM-041",  title: "Ground floor layout revision: reception area", type: "Architectural Drawing", submittedDate: "05 Sep", status: "pending-head" },
  { id: "SPEC-ENM-022", title: "Material specification: external wall", type: "Technical Specification", submittedDate: "04 Sep", status: "forwarded", forwardedTo: "Project Manager (Engr. Musa Usman Lawan)" },
  { id: "DWG-LCC-012",  title: "North elevation drawing: issue for comment", type: "Architectural Drawing", submittedDate: "01 Sep", status: "head-approved" },
  { id: "SPEC-LCC-011", title: "Roof finish specification", type: "Technical Specification", submittedDate: "29 Aug", status: "rejected", rejectionNote: "Update to include wind load compliance note. Resubmit by 10 Sep." },
];

const architectDuties: DutyEntry[] = [
  { id: "AD001", task: "Update first-floor layout CAD file (Rev C)", time: "08:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Drawings", assignedBy: "Head Architect", recurring: "daily" },
  { id: "AD002", task: "Confirm approved cladding sample with procurement", time: "09:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Coordination", assignedBy: "Head Architect" },
  { id: "AD003", task: "Review RFI-ENM-007 from structural engineer", time: "10:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Technical", assignedBy: "Head Architect" },
  { id: "AD004", task: "Attend design co-ordination meeting (virtual)", time: "14:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Meeting", assignedBy: "Project Manager", recurring: "weekly" },
  { id: "AD005", task: "Issue Rev C drawings to Head Architect for sign-off", time: "17:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Drawings", assignedBy: "Head Architect", recurring: "daily" },
  { id: "AD006", task: "Prepare south elevation annotation", time: "09:00", date: "07 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Drawings", assignedBy: "Head Architect" },
  { id: "AD007", task: "Submit cladding spec sheet draft", time: "11:00", date: "08 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Specification", assignedBy: "Head Architect" },
  { id: "AD008", task: "Respond to RFI with revised section drawing", time: "12:00", date: "05 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Technical", assignedBy: "Head Architect" },
  { id: "AD009", task: "Weekly project status update report", time: "16:00", date: "02 Sep", weekLabel: "Week 35", monthLabel: "September 2026", category: "Admin", assignedBy: "Head Architect" },
  { id: "AD010", task: "Archive August drawing set to DMS", time: "10:00", date: "01 Sep", weekLabel: "Week 35", monthLabel: "September 2026", category: "Admin", assignedBy: "Head Architect" },
];

export function ArchitectOfficerDashboard({ nav }: { nav: Nav }) {
  const head = headDisplayMap["head-architect"]!;
  const [subDetail, setSubDetail] = useState<ApprovalDetailItem | null>(null);
  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={subDetail} onClose={() => setSubDetail(null)} />
      <RoleHeader greeting="Good morning" name="Arc. Safiya Garba Aliyu" title="Architect" company="Canonic Associates Ltd" date={today} />
      <ApprovalFlowBanner headName={head.name} headTitle={head.title} nextParty="Project Manager / Client" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Active Drawings" value="4" sub="in production this week" icon={Layers} tone="neutral" />
        <MetricTile label="Pending Head" value="1" sub="awaiting Arc. Adeyemi" tone="attention" icon={Clock} onClick={() => nav("action")} />
        <MetricTile label="Forwarded" value="1" sub="Head approved, at PM" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Returned" value="1" sub="revision required" tone="critical" icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <OfficerTasksPanel tasks={architectTasks} officerRole="architect" officerName="Arc. Safiya Garba Aliyu" officerRoleLabel="Architect" />
          <DutiesTodayPanel duties={architectDuties} headName={head.name} />
          <OfficerSubmissionsPanel submissions={architectSubmissions} headName={head.name} onView={(s) => setSubDetail({ id: s.id, title: s.title, type: s.type, submitted: s.submittedDate, status: s.status === "rejected" ? "rejected" : s.status === "forwarded" || s.status === "head-approved" ? "approved" : "in-review", notes: s.rejectionNote, chain: [{ staffId: "self-01", staffName: "Arc. Safiya Garba Aliyu", staffTitle: "Architect", action: "approved", note: "Submitted for head review.", timestamp: s.submittedDate, isFinal: false }, { staffId: "head-arc-01", staffName: head.name, staffTitle: head.title, action: s.status === "pending-head" ? "pending" : s.status === "rejected" ? "rejected" : "approved", note: s.status === "rejected" ? (s.rejectionNote ?? "") : s.status !== "pending-head" ? "Reviewed and approved." : "", timestamp: s.status !== "pending-head" ? s.submittedDate : "", isFinal: !s.forwardedTo }, ...(s.forwardedTo ? [{ staffId: "next-01", staffName: s.forwardedTo, staffTitle: "Next approver", action: "pending" as const, note: "", timestamp: "", isFinal: true }] : [])] })} />
        </div>
        <div className="space-y-4">
          <OfficerQuickActions
            headName={head.name}
            requestTypes={["Drawing Submission", "Design Query", "Technical Specification", "Client Clarification Request", "Variation Notice", "Expense Claim", "Leave Request", "Other"]}
            actions={[
              { label: "Submit Drawing for Review", icon: Layers, hint: "→ Head Architect" },
              { label: "Issue Technical Specification", icon: FileText, hint: "→ Head Architect" },
              { label: "Raise Design Query", icon: BookOpen, hint: "→ Head Architect" },
              { label: "Request Client Clarification", icon: Globe, hint: "→ Head Architect first" },
            ]}
          />
          <Card className="p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">My Projects</p>
            {[
              { name: "Enugu Medical Centre", role: "Project Architect", h: "attention" as const },
              { name: "Lagos Commercial Complex", role: "Design Contributor", h: "healthy" as const },
            ].map((p) => (
              <button key={p.name} onClick={() => nav("portfolio")} className="flex w-full items-start gap-2.5 text-left">
                <HealthDot h={p.h} className="mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.role}</p>
                </div>
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── JUNIOR QS (OFFICER) DASHBOARD ─────────────────────────── */

const jqsTasks: AssignmentTask[] = [
  {
    id: "BOQ-PRJ001-007",
    title: "Measure Block C columns: concrete volume",
    project: "Abuja Housing Ph II",
    due: "Today",
    priority: "high",
    assignedBy: "QS Haruna Sani Gombe (Head QS)",
    description: "Take off and measure the concrete volume for all columns in Block C at Abuja Housing Phase II. Use revised structural drawings issued 03 Sep. Cross-check all quantities against the earlier estimate for cost-to-complete reporting.",
    deliverables: [
      "Completed measurement worksheet (Excel)",
      "Annotated drawings with measured elements highlighted",
      "Summary quantity comparison vs. original BOQ",
    ],
    milestones: [
      { label: "Obtain revised structural drawings", done: true },
      { label: "Set up measurement worksheet", done: true },
      { label: "Take off column concrete volumes", done: false },
      { label: "Cross-check vs. original BOQ", done: false },
      { label: "Submit to Head QS for review", done: false },
    ],
    relatedDocs: ["DWG-BLK-C-STRUCT-Rev-B", "BOQ-PRJ001-Rev3", "MEAS-FORM-QS-005"],
  },
  {
    id: "VAL-PRJ021-004",
    title: "Prepare interim valuation #4 for Gov't Office",
    project: "Gov't Office Complex",
    due: "09 Sep",
    priority: "high",
    assignedBy: "QS Haruna Sani Gombe (Head QS)",
    description: "Prepare Interim Valuation #4 covering work completed up to 31 August 2026 at the Government Office Complex. Value all measured works, dayworks, and preliminaries. Deduct previous valuations. Submit for Head QS review before forwarding to Finance.",
    deliverables: [
      "Interim Valuation Certificate #4 (PDF)",
      "Supporting measurement breakdown worksheet",
      "Daywork schedule summary",
      "Cumulative valuation comparison table",
    ],
    milestones: [
      { label: "Collect site progress photographs", done: true },
      { label: "Assess completed work with site officer", done: false },
      { label: "Value preliminaries and measured works", done: false },
      { label: "Draft IV certificate", done: false },
      { label: "Submit to Head QS", done: false },
    ],
    relatedDocs: ["IV-PRJ021-003", "PROG-RPT-PRJ021-AUG", "BOQ-GOV-OfficeRev2"],
  },
  {
    id: "MEAS-PH-048",
    title: "Warehouse slab re-measure after revision",
    project: "PH Logistics",
    due: "11 Sep",
    priority: "normal",
    assignedBy: "QS Haruna Sani Gombe (Head QS)",
    description: "The structural drawings for the PH Logistics warehouse roof slab were revised on 28 Aug. Re-measure the slab to capture the reduced depth and additional penetrations. Update the BOQ accordingly.",
    deliverables: [
      "Revised slab measurement sheet",
      "Updated BOQ line items (concrete + formwork)",
      "Variation cost summary if applicable",
    ],
    milestones: [
      { label: "Review revised structural drawing", done: true },
      { label: "Re-measure slab dimensions and penetrations", done: false },
      { label: "Update BOQ quantities", done: false },
      { label: "Submit to Head QS", done: false },
    ],
    relatedDocs: ["DWG-PH-SLAB-STRUCT-Rev-C", "MEAS-PH-047", "BOQ-PH-LOG-Rev2"],
  },
  {
    id: "VO-DRAFT-004",
    title: "Price Block C scope extension variation",
    project: "Abuja Housing Ph II",
    due: "10 Sep",
    priority: "normal",
    assignedBy: "QS Haruna Sani Gombe (Head QS)",
    description: "A scope extension has been approved for Block C to include additional service duct and staircase enclosure. Price the variation order using the existing contract rates. Prepare the VO for Head QS approval and issue to client.",
    deliverables: [
      "Priced variation order document (PDF)",
      "Supporting rate build-up for non-contract items",
      "Total variation value summary",
    ],
    milestones: [
      { label: "Review scope instruction and drawings", done: true },
      { label: "Measure additional works", done: false },
      { label: "Price using contract rates / build up new rates", done: false },
      { label: "Submit VO to Head QS for sign-off", done: false },
    ],
    relatedDocs: ["SI-PRJ001-BLK-C-EXT", "CONTRACT-RATES-PRJ001", "VO-PRJ001-003"],
  },
];

const jqsSubmissions: OfficerSubmission[] = [
  { id: "BOQ-PRJ001-006", title: "Block C foundation BOQ: full measure", type: "Bill of Quantities", submittedDate: "05 Sep", status: "pending-head" },
  { id: "VAL-PRJ021-003", title: "Interim valuation #3: Gov't Office", type: "Interim Valuation", submittedDate: "03 Sep", status: "forwarded", forwardedTo: "Finance Manager (Mrs. Maryam Kabiru Suleiman)" },
  { id: "VO-PRJ001-002",  title: "Variation order: Block C scope extension", type: "Variation Order", submittedDate: "01 Sep", status: "head-approved" },
  { id: "MEAS-PH-047",    title: "Warehouse roof slab measurement sheet", type: "Measurement Sheet", submittedDate: "28 Aug", status: "rejected", rejectionNote: "Include revised drawings ref. Check column line F2–F6. Resubmit by 10 Sep." },
];

const jqsDuties: DutyEntry[] = [
  { id: "QD001", task: "Block C column concrete take-off (morning session)", time: "08:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Measurement", assignedBy: "Head QS", recurring: "daily" },
  { id: "QD002", task: "Collect site progress photos from site officer (Abuja)", time: "09:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Coordination", assignedBy: "Head QS", recurring: "daily" },
  { id: "QD003", task: "Set up IV #4 worksheet for Gov't Office", time: "11:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Valuation", assignedBy: "Head QS" },
  { id: "QD004", task: "Attend subcontractor rate negotiation call", time: "14:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Meeting", assignedBy: "Project Manager", recurring: "weekly" },
  { id: "QD005", task: "Update BOQ with revised column quantities", time: "16:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Measurement", assignedBy: "Head QS" },
  { id: "QD006", task: "Complete IV #4 draft valuation", time: "10:00", date: "07 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Valuation", assignedBy: "Head QS" },
  { id: "QD007", task: "Review revised slab drawing (PH Logistics)", time: "11:00", date: "08 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Measurement", assignedBy: "Head QS" },
  { id: "QD008", task: "Monthly cost report summary — August 2026", time: "09:00", date: "01 Sep", weekLabel: "Week 35", monthLabel: "September 2026", category: "Reporting", assignedBy: "Head QS" },
];

export function JuniorQSDashboard({ nav }: { nav: Nav }) {
  const head = headDisplayMap["head-qs"]!;
  const [subDetail, setSubDetail] = useState<ApprovalDetailItem | null>(null);
  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={subDetail} onClose={() => setSubDetail(null)} />
      <RoleHeader greeting="Good morning" name="Mr. Ismail Sule Waziri" title="Quantity Surveyor" company="USV Development Services" date={today} />
      <ApprovalFlowBanner headName={head.name} headTitle={head.title} nextParty="Finance / Project Manager / Client" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="My Measurements" value="4" sub="active this week" icon={BarChart2} tone="neutral" />
        <MetricTile label="Pending Head QS" value="1" sub="awaiting QS Haruna Sani Gombe" tone="attention" icon={Clock} onClick={() => nav("action")} />
        <MetricTile label="Forwarded" value="1" sub="Head approved, at Finance" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Returned" value="1" sub="revision required" tone="critical" icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <OfficerTasksPanel tasks={jqsTasks} officerRole="qs" officerName="Mr. Ismail Sule Waziri" officerRoleLabel="Quantity Surveyor" />
          <DutiesTodayPanel duties={jqsDuties} headName={head.name} />
          <OfficerSubmissionsPanel submissions={jqsSubmissions} headName={head.name} onView={(s) => setSubDetail({ id: s.id, title: s.title, type: s.type, submitted: s.submittedDate, status: s.status === "rejected" ? "rejected" : s.status === "forwarded" || s.status === "head-approved" ? "approved" : "in-review", notes: s.rejectionNote, chain: [{ staffId: "self-01", staffName: "Mr. Ismail Sule Waziri", staffTitle: "Quantity Surveyor", action: "approved", note: "Submitted for Head QS review.", timestamp: s.submittedDate, isFinal: false }, { staffId: "head-qs-01", staffName: head.name, staffTitle: head.title, action: s.status === "pending-head" ? "pending" : s.status === "rejected" ? "rejected" : "approved", note: s.status === "rejected" ? (s.rejectionNote ?? "") : s.status !== "pending-head" ? "Reviewed and approved." : "", timestamp: s.status !== "pending-head" ? s.submittedDate : "", isFinal: !s.forwardedTo }, ...(s.forwardedTo ? [{ staffId: "next-01", staffName: s.forwardedTo, staffTitle: "Next approver", action: "pending" as const, note: "", timestamp: "", isFinal: true }] : [])] })} />
        </div>
        <div className="space-y-4">
          <OfficerQuickActions
            headName={head.name}
            requestTypes={["BOQ Submission", "Interim Valuation", "Variation Order", "Measurement Sheet", "Final Account Query", "Expense Claim", "Leave Request", "Other"]}
            actions={[
              { label: "Submit BOQ Section", icon: ClipboardList, hint: "→ Head QS" },
              { label: "Raise Variation Order", icon: TrendingUp, hint: "→ Head QS" },
              { label: "Submit Interim Valuation", icon: DollarSign, hint: "→ Head QS" },
              { label: "Issue Measurement Sheet", icon: FileText, hint: "→ Head QS" },
            ]}
          />
          <Card className="p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Budget Summary</p>
            {[
              { label: "Abuja Housing Ph II", budget: "₦1,380m", pct: 72 },
              { label: "Gov't Office Complex", budget: "₦2,150m", pct: 45 },
              { label: "PH Logistics", budget: "₦480m", pct: 82 },
            ].map((b) => (
              <div key={b.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium">{b.label}</p>
                  <span className={`font-mono text-[10px] font-semibold ${b.pct > 80 ? "text-critical" : b.pct > 70 ? "text-attention" : "text-healthy"}`}>{b.pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary">
                  <div className={`h-full rounded-full ${b.pct > 80 ? "bg-critical" : b.pct > 70 ? "bg-attention" : "bg-healthy"}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ACCOUNTANT (OFFICER) DASHBOARD ─────────────────────────── */

const accountantTasks: AssignmentTask[] = [
  {
    id: "REC-SEP-002",
    title: "Bank reconciliation: Zenith Sept 2026",
    project: "Finance & Accounts",
    due: "Today",
    priority: "high",
    assignedBy: "Mrs. Maryam Kabiru Suleiman (Finance Manager)",
    description: "Complete the September 2026 bank reconciliation for the Zenith Bank corporate account. Identify all outstanding lodgements and unpresented cheques. Reconcile the closing ledger balance with the bank statement. Investigate and clear any long-outstanding items.",
    deliverables: [
      "Completed bank reconciliation statement (Excel)",
      "Schedule of outstanding items with explanations",
      "Summary memo to Finance Manager",
    ],
    milestones: [
      { label: "Download September bank statement", done: true },
      { label: "Match transactions to cashbook entries", done: false },
      { label: "Identify and investigate discrepancies", done: false },
      { label: "Prepare reconciliation statement", done: false },
      { label: "Submit to Finance Manager", done: false },
    ],
    relatedDocs: ["BANK-STMT-ZEN-SEP26", "CASHBOOK-SEP26", "REC-AUG-2026-FINAL"],
  },
  {
    id: "VOUCHER-442",
    title: "Payment voucher: Julius Steel Ltd ₦44.8m",
    project: "Finance & Accounts",
    due: "Today",
    priority: "high",
    assignedBy: "Mrs. Maryam Kabiru Suleiman (Finance Manager)",
    description: "Prepare the payment voucher for Julius Steel Ltd's invoice #JSL-2026-1104 covering supply of reinforcement bars to the Abuja Housing Phase II site. Verify invoice, delivery notes, and PO before raising the voucher for Finance Manager approval.",
    deliverables: [
      "Completed payment voucher (internal format)",
      "Attached: original invoice, LPO copy, GRN",
      "Three-way match confirmation note",
    ],
    milestones: [
      { label: "Confirm GRN from procurement", done: true },
      { label: "Verify invoice against LPO", done: false },
      { label: "Raise payment voucher in accounting system", done: false },
      { label: "Attach all supporting documents", done: false },
      { label: "Route to Finance Manager for approval", done: false },
    ],
    relatedDocs: ["INV-JSL-2026-1104", "LPO-PRJ001-0443", "GRN-PRJ001-089"],
  },
  {
    id: "RPT-Q3-DFT",
    title: "Draft Q3 management accounts pack",
    project: "Group Finance",
    due: "12 Sep",
    priority: "normal",
    assignedBy: "Mrs. Maryam Kabiru Suleiman (Finance Manager)",
    description: "Compile the draft Q3 (July–September 2026) management accounts for the group. Include P&L, balance sheet, cash flow, and project cost reports. Use actuals to 31 Aug with September forecasted. Highlight variances against budget greater than 10%.",
    deliverables: [
      "Draft management accounts pack (PowerPoint + Excel model)",
      "Budget variance commentary (written narrative)",
      "Project cost-to-complete summary by project",
    ],
    milestones: [
      { label: "Obtain August trial balance", done: true },
      { label: "Compile P&L and balance sheet drafts", done: false },
      { label: "Build September forecasts", done: false },
      { label: "Prepare budget variance commentary", done: false },
      { label: "Submit draft to Finance Manager for review", done: false },
    ],
    relatedDocs: ["TB-AUG-2026", "BUDGET-FY2026-MASTER", "Q2-MGMT-ACCOUNTS-FINAL"],
  },
  {
    id: "PAYROLL-PROC",
    title: "Process September payroll journal entries",
    project: "Finance & Accounts",
    due: "10 Sep",
    priority: "normal",
    assignedBy: "Mrs. Maryam Kabiru Suleiman (Finance Manager)",
    description: "Post the September 2026 payroll journal entries in the accounting system. Debit payroll expense accounts and credit accrued salaries. Ensure staff grades match payroll schedule approved by HR. Reconcile net pay to bank transfer instructions.",
    deliverables: [
      "Posted payroll journal (system confirmation printout)",
      "Reconciliation of gross pay to net pay and deductions",
      "Signed approval from Finance Manager",
    ],
    milestones: [
      { label: "Receive approved payroll schedule from HR", done: true },
      { label: "Post salary journal entries", done: false },
      { label: "Reconcile deductions (pension, PAYE, NSITF)", done: false },
      { label: "Obtain Finance Manager sign-off", done: false },
    ],
    relatedDocs: ["PAYROLL-SEP26-HR-APPROVED", "COA-SALARY-ACCOUNTS", "BANK-TRANSFER-SEP26"],
  },
];

const accountantSubmissions: OfficerSubmission[] = [
  { id: "REC-SEP-001",    title: "August bank reconciliation: Access Bank", type: "Bank Reconciliation", submittedDate: "05 Sep", status: "pending-head" },
  { id: "RPT-Q2-2026",    title: "Q2 management accounts: final", type: "Financial Report", submittedDate: "01 Sep", status: "forwarded", forwardedTo: "Executive Director (Engr. Yahaya Abdullahi Bello)" },
  { id: "VOUCHER-439",    title: "Payment voucher: Delta Freight ₦8.2m", type: "Payment Voucher", submittedDate: "03 Sep", status: "head-approved" },
  { id: "VAT-AUG-2026",   title: "August VAT computation workings", type: "Tax Computation", submittedDate: "28 Aug", status: "rejected", rejectionNote: "Include input VAT on Aug 15 cement invoice. Reconcile and resubmit." },
];

const accountantDuties: DutyEntry[] = [
  { id: "ACD001", task: "Download Zenith Bank Sept statement and begin reconciliation", time: "08:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reconciliation", assignedBy: "Finance Manager", recurring: "daily" },
  { id: "ACD002", task: "Verify GRN for Julius Steel ₦44.8m invoice with procurement", time: "09:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Payments", assignedBy: "Finance Manager" },
  { id: "ACD003", task: "Post August closing journal entries", time: "11:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Ledger", assignedBy: "Finance Manager", recurring: "daily" },
  { id: "ACD004", task: "Prepare payment voucher: Julius Steel Ltd", time: "14:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Payments", assignedBy: "Finance Manager" },
  { id: "ACD005", task: "Submit bank reconciliation to Finance Manager", time: "16:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reconciliation", assignedBy: "Finance Manager", recurring: "weekly" },
  { id: "ACD006", task: "Obtain payroll schedule from HR for September", time: "09:00", date: "07 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Payroll", assignedBy: "Finance Manager" },
  { id: "ACD007", task: "Start Q3 P&L draft in Excel model", time: "10:00", date: "08 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reporting", assignedBy: "Finance Manager" },
  { id: "ACD008", task: "Monthly invoice register reconciliation", time: "09:00", date: "01 Sep", weekLabel: "Week 35", monthLabel: "September 2026", category: "Ledger", assignedBy: "Finance Manager" },
];

export function AccountantDashboard({ nav }: { nav: Nav }) {
  const head = headDisplayMap["finance"]!;
  const [subDetail, setSubDetail] = useState<ApprovalDetailItem | null>(null);
  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={subDetail} onClose={() => setSubDetail(null)} />
      <RoleHeader greeting="Good morning" name="Mr. Haruna Abubakar Wali" title="Accountant" company="USV + CANONIC" date={today} />
      <ApprovalFlowBanner headName={head.name} headTitle={head.title} nextParty="Executive Director / External Auditors" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Tasks This Week" value="4" sub="active assignments" icon={ClipboardList} tone="neutral" />
        <MetricTile label="Pending Manager" value="1" sub="awaiting Mrs. Nwosu" tone="attention" icon={Clock} onClick={() => nav("action")} />
        <MetricTile label="Forwarded" value="1" sub="Finance Mgr approved, at ED" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Returned" value="1" sub="correction required" tone="critical" icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <OfficerTasksPanel tasks={accountantTasks} officerRole="accountant" officerName="Mr. Haruna Abubakar Wali" officerRoleLabel="Accountant" />
          <DutiesTodayPanel duties={accountantDuties} headName={head.name} />
          <OfficerSubmissionsPanel submissions={accountantSubmissions} headName={head.name} onView={(s) => setSubDetail({ id: s.id, title: s.title, type: s.type, submitted: s.submittedDate, status: s.status === "rejected" ? "rejected" : s.status === "forwarded" || s.status === "head-approved" ? "approved" : "in-review", notes: s.rejectionNote, chain: [{ staffId: "self-01", staffName: "Mr. Haruna Abubakar Wali", staffTitle: "Accountant", action: "approved", note: "Submitted for Finance Manager review.", timestamp: s.submittedDate, isFinal: false }, { staffId: "fin-01", staffName: head.name, staffTitle: head.title, action: s.status === "pending-head" ? "pending" : s.status === "rejected" ? "rejected" : "approved", note: s.status === "rejected" ? (s.rejectionNote ?? "") : s.status !== "pending-head" ? "Reviewed and approved." : "", timestamp: s.status !== "pending-head" ? s.submittedDate : "", isFinal: !s.forwardedTo }, ...(s.forwardedTo ? [{ staffId: "next-01", staffName: s.forwardedTo, staffTitle: "Next approver", action: "pending" as const, note: "", timestamp: "", isFinal: true }] : [])] })} />
        </div>
        <div className="space-y-4">
          <OfficerQuickActions
            headName={head.name}
            requestTypes={["Bank Reconciliation", "Payment Voucher", "Financial Report", "Tax Computation", "Petty Cash Request", "Expense Claim", "Leave Request", "Other"]}
            actions={[
              { label: "Submit Bank Reconciliation", icon: FileText, hint: "→ Finance Manager" },
              { label: "Prepare Payment Voucher", icon: DollarSign, hint: "→ Finance Manager" },
              { label: "Submit Financial Report", icon: BarChart2, hint: "→ Finance Manager" },
              { label: "Submit Tax Computation", icon: Shield, hint: "→ Finance Manager" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── PROCUREMENT OFFICER DASHBOARD ─────────────────────────── */

const procOfficerTasks: AssignmentTask[] = [
  {
    id: "RFQ-USV-2026-010",
    title: "Issue RFQ: electrical cable supply (3 vendors)",
    project: "Abuja Housing Ph II",
    due: "Today",
    priority: "high",
    assignedBy: "Alhaji Musa Abubakar (Procurement Manager)",
    description: "Prepare and issue a Request for Quotation to three pre-qualified vendors for the supply of electrical cables required for the Abuja Housing Phase II site. Specifications have been provided by the electrical engineer. Deadline for vendor responses is 09 Sep 2026.",
    deliverables: [
      "RFQ document (PDF) issued to 3 vendors",
      "Email confirmation of issue with read receipts",
      "RFQ register updated",
    ],
    milestones: [
      { label: "Obtain cable specification from electrical engineer", done: true },
      { label: "Confirm 3 approved vendors from approved list", done: true },
      { label: "Draft RFQ document", done: false },
      { label: "Review with Procurement Manager", done: false },
      { label: "Issue to vendors and log in RFQ register", done: false },
    ],
    relatedDocs: ["SPEC-ELEC-CABLE-PRJ001", "APPROVED-VENDOR-LIST-2026", "RFQ-FORM-TEMPLATE"],
  },
  {
    id: "GRN-PRJ001-090",
    title: "Process GRN: Lagos Cement Factory delivery",
    project: "Abuja Housing Ph II",
    due: "Today",
    priority: "high",
    assignedBy: "Alhaji Musa Abubakar (Procurement Manager)",
    description: "Process the Goods Received Note for the delivery of 200 bags of cement from Lagos Cement Factory per delivery note LCF-DN-2026-0482. Verify quantity and condition against the purchase order. Raise and sign GRN and forward to accounts for payment processing.",
    deliverables: [
      "Completed and signed GRN form",
      "Three-way match: PO vs. delivery note vs. GRN",
      "Copy forwarded to Finance for payment voucher",
    ],
    milestones: [
      { label: "Receive delivery note from site officer", done: true },
      { label: "Verify quantity and condition at site", done: false },
      { label: "Complete GRN form and obtain site officer signature", done: false },
      { label: "Forward GRN to Finance (Mr. Haruna Abubakar Wali)", done: false },
    ],
    relatedDocs: ["PO-PRJ001-0441", "LCF-DN-2026-0482", "GRN-FORM-005"],
  },
  {
    id: "QUOTE-CMP-082",
    title: "Comparative analysis: 4 quotes for formwork",
    project: "Gov't Office Complex",
    due: "09 Sep",
    priority: "normal",
    assignedBy: "Alhaji Musa Abubakar (Procurement Manager)",
    description: "Analyse the four quotes received for formwork hire at the Government Office Complex. Prepare a comparative analysis showing price, delivery lead time, insurance status, and past performance. Recommend the preferred vendor with justification.",
    deliverables: [
      "Comparative analysis spreadsheet (Excel)",
      "Written recommendation memo with justification",
      "Insurance compliance check per vendor",
    ],
    milestones: [
      { label: "Collect all 4 vendor quotes", done: true },
      { label: "Verify insurance compliance for each vendor", done: false },
      { label: "Build comparative analysis table", done: false },
      { label: "Draft recommendation memo", done: false },
      { label: "Submit to Procurement Manager", done: false },
    ],
    relatedDocs: ["RFQ-GOV-FORM-008", "VENDOR-QUOTES-FORM-x4", "INSURANCE-CHECKLIST-002"],
  },
  {
    id: "PO-DRAFT-093",
    title: "Draft PO: aggregate supply, 150T",
    project: "PH Logistics",
    due: "10 Sep",
    priority: "normal",
    assignedBy: "Alhaji Musa Abubakar (Procurement Manager)",
    description: "Draft a purchase order for the supply of 150 tonnes of chippings aggregate to the PH Logistics Warehouse site. Use the approved unit rate from the RFQ evaluation (RFQ-008). Ensure PO includes delivery schedule, quality specification, and penalty clause.",
    deliverables: [
      "Draft PO document (company format)",
      "Total value calculation and budget code",
      "Delivery schedule attached",
    ],
    milestones: [
      { label: "Confirm aggregate specification with site engineer", done: true },
      { label: "Apply approved rate from RFQ-008 evaluation", done: false },
      { label: "Draft PO using company template", done: false },
      { label: "Submit to Procurement Manager for approval", done: false },
    ],
    relatedDocs: ["RFQ-USV-2026-008-EVAL", "SPEC-AGGREGATE-PH", "PO-TEMPLATE-2026"],
  },
];

const procOfficerSubmissions: OfficerSubmission[] = [
  { id: "RFQ-USV-2026-009", title: "RFQ evaluation: electrical cable (4 vendors)", type: "RFQ Evaluation", submittedDate: "05 Sep", status: "pending-head" },
  { id: "PO-DRAFT-092",     title: "Draft PO: cement supply, 80T (₦6.4m)", type: "Purchase Order", submittedDate: "03 Sep", status: "forwarded", forwardedTo: "Project Manager for project code sign-off" },
  { id: "GRN-PRJ001-089",   title: "GRN: Delta Freight aggregate delivery", type: "Goods Received Note", submittedDate: "02 Sep", status: "head-approved" },
  { id: "QUOTE-CMP-081",    title: "Quote comparison: scaffolding hire", type: "Comparative Analysis", submittedDate: "29 Aug", status: "rejected", rejectionNote: "Include insurance compliance status for each vendor. Resubmit by 09 Sep." },
];

const procDuties: DutyEntry[] = [
  { id: "PRD001", task: "Draft RFQ for electrical cable and confirm 3 vendors", time: "08:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Procurement", assignedBy: "Procurement Manager", recurring: "daily" },
  { id: "PRD002", task: "Receive and verify Lagos Cement Factory delivery at site", time: "09:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "GRN", assignedBy: "Procurement Manager", recurring: "daily" },
  { id: "PRD003", task: "RFQ register update for all open RFQs", time: "11:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Admin", assignedBy: "Procurement Manager" },
  { id: "PRD004", task: "Issue RFQ-010 to vendors and send email confirmations", time: "13:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Procurement", assignedBy: "Procurement Manager" },
  { id: "PRD005", task: "Forward signed GRN-090 to Finance for payment processing", time: "15:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "GRN", assignedBy: "Procurement Manager", recurring: "weekly" },
  { id: "PRD006", task: "Begin formwork quote comparative analysis", time: "09:00", date: "07 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Analysis", assignedBy: "Procurement Manager" },
  { id: "PRD007", task: "Verify insurance compliance for 4 formwork vendors", time: "11:00", date: "08 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Compliance", assignedBy: "Procurement Manager" },
  { id: "PRD008", task: "Monthly procurement report — August 2026", time: "09:00", date: "01 Sep", weekLabel: "Week 35", monthLabel: "September 2026", category: "Reporting", assignedBy: "Procurement Manager" },
];

export function ProcurementOfficerDashboard({ nav }: { nav: Nav }) {
  const head = headDisplayMap["procurement-manager"]!;
  const [subDetail, setSubDetail] = useState<ApprovalDetailItem | null>(null);
  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={subDetail} onClose={() => setSubDetail(null)} />
      <RoleHeader greeting="Good morning" name="Miss Ramatu Yusuf Waziri" title="Procurement Officer" company="USV Development Services" date={today} />
      <ApprovalFlowBanner headName={head.name} headTitle={head.title} nextParty="Project Manager / Finance" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Open RFQs" value="3" sub="vendor responses pending" icon={Package} tone="neutral" onClick={() => nav("procurement")} />
        <MetricTile label="Pending Manager" value="1" sub="awaiting Alhaji Abubakar" tone="attention" icon={Clock} onClick={() => nav("action")} />
        <MetricTile label="Forwarded" value="1" sub="Manager approved, at PM" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Returned" value="1" sub="amendment required" tone="critical" icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <OfficerTasksPanel tasks={procOfficerTasks} officerRole="procurement" officerName="Miss Ramatu Yusuf Waziri" officerRoleLabel="Procurement Officer" />
          <DutiesTodayPanel duties={procDuties} headName={head.name} />
          <OfficerSubmissionsPanel submissions={procOfficerSubmissions} headName={head.name} onView={(s) => setSubDetail({ id: s.id, title: s.title, type: s.type, submitted: s.submittedDate, status: s.status === "rejected" ? "rejected" : s.status === "forwarded" || s.status === "head-approved" ? "approved" : "in-review", notes: s.rejectionNote, chain: [{ staffId: "self-01", staffName: "Miss Ramatu Yusuf Waziri", staffTitle: "Procurement Officer", action: "approved", note: "Submitted for Procurement Manager review.", timestamp: s.submittedDate, isFinal: false }, { staffId: "proc-mgr-01", staffName: head.name, staffTitle: head.title, action: s.status === "pending-head" ? "pending" : s.status === "rejected" ? "rejected" : "approved", note: s.status === "rejected" ? (s.rejectionNote ?? "") : s.status !== "pending-head" ? "Reviewed and approved." : "", timestamp: s.status !== "pending-head" ? s.submittedDate : "", isFinal: !s.forwardedTo }, ...(s.forwardedTo ? [{ staffId: "next-01", staffName: s.forwardedTo, staffTitle: "Next approver", action: "pending" as const, note: "", timestamp: "", isFinal: true }] : [])] })} />
        </div>
        <div className="space-y-4">
          <OfficerQuickActions
            headName={head.name}
            requestTypes={["New RFQ", "Quote Comparison", "Purchase Order Draft", "Goods Received Note (GRN)", "Vendor Pre-qualification", "Expense Claim", "Leave Request", "Other"]}
            actions={[
              { label: "Issue New RFQ", icon: FileText, hint: "→ Procurement Manager" },
              { label: "Submit Quote Comparison", icon: BarChart2, hint: "→ Procurement Manager" },
              { label: "Draft Purchase Order", icon: Package, hint: "→ Procurement Manager" },
              { label: "Submit GRN", icon: ClipboardList, hint: "→ Procurement Manager" },
            ]}
          />
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Active RFQs</p>
            <div className="space-y-2">
              {[
                { id: "RFQ-010", desc: "Electrical cable", vendors: 3, closes: "08 Sep", h: "attention" as const },
                { id: "RFQ-009", desc: "Formwork (evaluation)", vendors: 4, closes: "12 Sep", h: "healthy" as const },
                { id: "RFQ-008", desc: "Aggregate supply", vendors: 2, closes: "15 Sep", h: "healthy" as const },
              ].map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <HealthDot h={r.h} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{r.desc}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{r.id} · {r.vendors} vendors · {r.closes}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── DUTIES TODAY PANEL (shared officer component) ─────────────────────────── */

type DutyPeriod = "day" | "week" | "month";

interface DutyEntry {
  id: string;
  task: string;
  time: string;
  date: string; // YYYY-MM-DD label e.g. "06 Sep"
  weekLabel: string; // e.g. "Week 36"
  monthLabel: string; // e.g. "September 2026"
  assignedBy?: string;
  category: string;
  recurring?: "daily" | "weekly";
}

interface DutyState {
  done: boolean;
  comment: string;
  completedAt?: string;
}

function DutiesTodayPanel({ duties, headName }: { duties: DutyEntry[]; headName: string }) {
  const { show } = useToast();
  const [period, setPeriod] = useState<DutyPeriod>("day");
  const [states, setStates] = useState<Record<string, DutyState>>(() =>
    Object.fromEntries(duties.map(d => [d.id, { done: false, comment: "" }]))
  );
  const [commentOpen, setCommentOpen] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState("");

  const periodLabel: Record<DutyPeriod, string> = { day: "Today", week: "This Week", month: "This Month" };

  const filteredDuties = duties.filter(d => {
    if (period === "day") return d.date === "06 Sep";
    if (period === "week") return d.weekLabel === "Week 36";
    return d.monthLabel === "September 2026";
  });

  const doneCount = filteredDuties.filter(d => states[d.id]?.done).length;
  const progress = filteredDuties.length > 0 ? Math.round((doneCount / filteredDuties.length) * 100) : 0;

  function toggleDone(id: string) {
    const current = states[id];
    if (!current.done) {
      setStates(s => ({ ...s, [id]: { ...s[id], done: true, completedAt: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) } }));
      show("Duty marked complete.", "success");
    } else {
      setStates(s => ({ ...s, [id]: { ...s[id], done: false, completedAt: undefined } }));
    }
  }

  function saveComment(id: string) {
    setStates(s => ({ ...s, [id]: { ...s[id], comment: tempComment } }));
    setCommentOpen(null);
    setTempComment("");
    show("Note saved.", "success");
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-4 pt-4 pb-3">
        <div>
          <p className="font-display text-sm font-bold">My Duties</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Assigned by {headName} · Mark complete or add a note when blocked</p>
        </div>
        <div className="flex items-center gap-1">
          {(["day", "week", "month"] as DutyPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded px-2.5 py-1 text-[10px] font-semibold transition ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {p === "day" ? "Today" : p === "week" ? "Week" : "Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {filteredDuties.length > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-muted-foreground">{periodLabel[period]} — {doneCount}/{filteredDuties.length} complete</span>
            <span className={`font-mono text-[10px] font-bold ${progress === 100 ? "text-healthy" : progress >= 50 ? "text-attention" : "text-muted-foreground"}`}>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary">
            <div className="h-1.5 rounded-full bg-healthy transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {filteredDuties.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">No duties assigned for {periodLabel[period].toLowerCase()}.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredDuties.map(d => {
            const st = states[d.id] ?? { done: false, comment: "" };
            return (
              <div key={d.id} className={`px-4 py-3 transition ${st.done ? "bg-healthy-bg/20" : ""}`}>
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleDone(d.id)}
                    className={`no-min-touch mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${st.done ? "border-healthy bg-healthy text-white" : "border-border hover:border-primary"}`}
                    title={st.done ? "Mark incomplete" : "Mark complete"}
                  >
                    {st.done && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
                  </button>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-snug ${st.done ? "text-muted-foreground line-through" : "font-medium"}`}>{d.task}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{d.time}</span>
                      {period !== "day" && <span className="text-[10px] text-muted-foreground">{d.date}</span>}
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">{d.category}</span>
                      {d.recurring === "daily" && <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-primary uppercase">↺ Daily</span>}
                      {d.recurring === "weekly" && <span className="ml-1.5 rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-accent uppercase">↺ Weekly</span>}
                      {st.completedAt && <span className="text-[10px] text-healthy font-semibold">✓ {st.completedAt}</span>}
                    </div>
                    {st.comment && (
                      <p className="mt-1 text-[10px] italic text-attention">Note: {st.comment}</p>
                    )}
                  </div>

                  {/* Note button */}
                  {!st.done && (
                    <button
                      onClick={() => { setCommentOpen(d.id); setTempComment(st.comment); }}
                      className="shrink-0 rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-attention hover:text-attention transition"
                      title="Add note or reason"
                    >
                      {st.comment ? "Edit Note" : "+ Note"}
                    </button>
                  )}
                </div>

                {/* Inline comment form */}
                {commentOpen === d.id && (
                  <div className="mt-2 ml-7 space-y-1.5">
                    <textarea
                      autoFocus
                      value={tempComment}
                      onChange={e => setTempComment(e.target.value)}
                      rows={2}
                      placeholder="Why is this not completed? Any blockers or notes for your Head…"
                      className="w-full rounded border border-border bg-panel px-2 py-1.5 text-xs focus:border-attention/50 focus:outline-none resize-none"
                    />
                    <div className="flex gap-1.5">
                      <button onClick={() => saveComment(d.id)} className="rounded bg-attention/90 px-2.5 py-1 text-[10px] font-semibold text-white hover:opacity-90">Save Note</button>
                      <button onClick={() => { setCommentOpen(null); setTempComment(""); }} className="rounded border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* Head duty assignment panel — for heads to assign duties to officers and view completion */
interface HeadDutyRecord {
  id: string;
  officerName: string;
  officerTitle: string;
  task: string;
  time: string;
  date: string;
  weekLabel: string;
  monthLabel: string;
  category: string;
  done: boolean;
  comment?: string;
  completedAt?: string;
}

function HeadDutyAssignmentPanel({ officerDuties, headName }: { officerDuties: HeadDutyRecord[]; headName: string }) {
  const { show } = useToast();
  const [period, setPeriod] = useState<DutyPeriod>("day");
  const [showAssign, setShowAssign] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newOfficer, setNewOfficer] = useState("");
  const [newCategory, setNewCategory] = useState("Site Operations");
  const [newRecurring, setNewRecurring] = useState<"" | "daily" | "weekly">("");

  const filtered = officerDuties.filter(d => {
    if (period === "day") return d.date === "06 Sep";
    if (period === "week") return d.weekLabel === "Week 36";
    return d.monthLabel === "September 2026";
  });

  const doneCount = filtered.filter(d => d.done).length;

  const officers = [...new Set(officerDuties.map(d => d.officerName))];

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-4 pt-4 pb-3">
        <div>
          <p className="font-display text-sm font-bold">Officer Duties</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Duties assigned to your officers — track completion and add new tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {(["day", "week", "month"] as DutyPeriod[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`rounded px-2.5 py-1 text-[10px] font-semibold transition ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {p === "day" ? "Today" : p === "week" ? "Week" : "Month"}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAssign(true)} className="rounded bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground hover:opacity-90">+ Assign</button>
        </div>
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border">
          <span className="text-[10px] font-semibold text-muted-foreground">{doneCount}/{filtered.length} complete</span>
          <div className="flex-1 h-1 rounded-full bg-secondary">
            <div className="h-1 rounded-full bg-healthy transition-all" style={{ width: `${filtered.length > 0 ? Math.round(doneCount / filtered.length * 100) : 0}%` }} />
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {filtered.map(d => (
          <div key={d.id} className={`flex items-start gap-3 px-4 py-3 ${d.done ? "bg-healthy-bg/10" : ""}`}>
            <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${d.done ? "border-healthy bg-healthy text-white" : "border-border"}`}>
              {d.done && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm leading-snug ${d.done ? "text-muted-foreground line-through" : "font-medium"}`}>{d.task}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">{d.officerTitle}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{d.time}</span>
                {period !== "day" && <span className="text-[10px] text-muted-foreground">{d.date}</span>}
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">{d.category}</span>
                {d.done && d.completedAt && <span className="text-[10px] text-healthy font-semibold">✓ {d.completedAt}</span>}
              </div>
              {d.comment && (
                <p className="mt-1 rounded border border-attention/20 bg-attention-bg/30 px-2 py-1 text-[10px] italic text-attention">
                  Officer note: {d.comment}
                </p>
              )}
            </div>
            {!d.done && <span className="shrink-0 rounded bg-attention-bg px-2 py-0.5 font-mono text-[9px] font-semibold text-attention">Pending</span>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">No duties assigned for this period.</p>
          </div>
        )}
      </div>

      {/* Assign duty modal */}
      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-4 sm:p-4 sm:py-10" onClick={() => setShowAssign(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card shadow-2xl mx-1 sm:mx-0" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-[14px] font-bold">Assign Duty to Officer</h2>
              <button onClick={() => setShowAssign(false)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Assign To <span className="text-critical">*</span></label>
                <select value={newOfficer} onChange={e => setNewOfficer(e.target.value)} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                  <option value="">Select officer…</option>
                  {officers.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Task Description <span className="text-critical">*</span></label>
                <textarea value={newTask} onChange={e => setNewTask(e.target.value)} rows={2} placeholder="Describe the duty clearly and specifically…" className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Scheduled Time</label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                    {["Site Operations", "Inspection", "Documentation", "Safety", "Reporting", "Admin", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Recurs</label>
                  <select value={newRecurring} onChange={e => setNewRecurring(e.target.value as "" | "daily" | "weekly")} className="w-full rounded border border-border bg-panel px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                    <option value="">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button onClick={() => setShowAssign(false)} className="rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button
                  onClick={() => {
                    if (!newOfficer || !newTask.trim()) { show("Please fill all required fields.", "warning"); return; }
                    show(`Duty assigned to ${newOfficer}. They will see it in their Duties panel.`, "success");
                    setShowAssign(false); setNewTask(""); setNewTime(""); setNewOfficer(""); setNewCategory("Site Operations"); setNewRecurring("");
                  }}
                  className="rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Assign Duty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ─────────────────────────── SITE OFFICER DASHBOARD ─────────────────────────── */

const siteOfficerTasks: AssignmentTask[] = [
  {
    id: "INSP-PRJ001-C083",
    title: "Pre-pour inspection: Block C ground slab",
    project: "Abuja Housing Ph II",
    due: "Today 08:30",
    priority: "high",
    assignedBy: "Mr. Bassey Ita (Site Supervisor)",
    description: "Conduct pre-pour inspection of the Block C ground slab before concrete pour commences. Check reinforcement placement, cover, laps, and form work integrity against approved drawings.",
    milestones: [
      { label: "Review approved structural drawings for Block C", done: true },
      { label: "Inspect reinforcement placement and laps", done: false },
      { label: "Check concrete cover with cover meter", done: false },
      { label: "Sign off pre-pour checklist and submit to supervisor", done: false },
    ],
  },
  {
    id: "SR-PRJ001-083",
    title: "Daily site report SR-PRJ001-083: submit to supervisor",
    project: "Abuja Housing Ph II",
    due: "Today 17:00",
    priority: "high",
    assignedBy: "Mr. Bassey Ita (Site Supervisor)",
    description: "Compile and submit the daily site report for 06 September 2026. Include workforce count, work progress by zone, material deliveries, equipment on site, and any safety observations.",
    milestones: [
      { label: "Record morning workforce muster", done: true },
      { label: "Document progress across all active zones", done: false },
      { label: "Note any material deliveries and quantities", done: false },
      { label: "Submit completed report to supervisor", done: false },
    ],
  },
  {
    id: "LABOUR-083",
    title: "Labour attendance compilation: all gangs",
    project: "Abuja Housing Ph II",
    due: "Today 18:00",
    priority: "normal",
    assignedBy: "Mr. Bassey Ita (Site Supervisor)",
    description: "Collect attendance sheets from all gang supervisors and compile the daily labour attendance record. Cross-check with morning muster and report any discrepancies.",
    milestones: [
      { label: "Collect sheets from all 4 gang supervisors", done: false },
      { label: "Cross-check against morning muster roll", done: false },
      { label: "Submit compiled attendance to site supervisor", done: false },
    ],
  },
  {
    id: "GRN-PRJ001-AGG-041",
    title: "Aggregate delivery inspection report: Delta Freight 40T",
    project: "Abuja Housing Ph II",
    due: "Tomorrow",
    priority: "normal",
    assignedBy: "Mr. Bassey Ita (Site Supervisor)",
    description: "Inspect and document the aggregate delivery from Delta Freight (40 tonnes). Verify quantity, grade, and condition. Raise GRN and submit to procurement for payment processing.",
    milestones: [
      { label: "Receive delivery note from driver", done: false },
      { label: "Inspect aggregate grade and condition", done: false },
      { label: "Confirm quantity: weigh-bridge slip or visual estimate", done: false },
      { label: "Complete GRN form and submit to Procurement Officer", done: false },
    ],
  },
];

const siteOfficerSubmissions: OfficerSubmission[] = [
  { id: "SR-PRJ001-082",  title: "Daily site report: 05 September 2026", type: "Site Report", submittedDate: "05 Sep 18:00", status: "forwarded", forwardedTo: "Project Manager" },
  { id: "LABOUR-082",     title: "Labour attendance: 05 September", type: "Attendance Sheet", submittedDate: "05 Sep 18:30", status: "head-approved" },
  { id: "MAT-REQ-039",    title: "Material requisition: Y16 steel bars, 5T", type: "Material Requisition", submittedDate: "04 Sep", status: "forwarded", forwardedTo: "Procurement Manager" },
  { id: "SR-PRJ001-081",  title: "Daily site report: 04 September 2026", type: "Site Report", submittedDate: "04 Sep 18:00", status: "head-approved" },
];

export function SiteOfficerDashboard({ nav }: { nav: Nav }) {
  const head = headDisplayMap["site-supervisor"]!;
  const [subDetail, setSubDetail] = useState<ApprovalDetailItem | null>(null);
  return (
    <div className="space-y-6 animate-in">
      <ApprovalDetailModal item={subDetail} onClose={() => setSubDetail(null)} />
      <RoleHeader greeting="Good morning" name="Mr. Sa'adu Usman Garba" title="Site Officer" company="USV, Abuja Housing Phase II" date={today} />
      <ApprovalFlowBanner headName={head.name} headTitle={head.title} nextParty="Project Manager / Procurement" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricTile label="Today's Tasks" value="4" sub="submissions due today" icon={ClipboardList} tone="neutral" />
        <MetricTile label="Awaiting Supervisor" value="0" sub="all reviewed" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Forwarded" value="2" sub="Supervisor approved" tone="healthy" icon={CheckCircle2} />
        <MetricTile label="Reports This Week" value="4" sub="5 expected (Mon–Fri)" tone="attention" icon={FileText} />
      </div>

      <OfficerTasksPanel tasks={siteOfficerTasks} officerRole="site" officerName="Mr. Sa'adu Usman Garba" officerRoleLabel="Site Officer" />
      <DutiesTodayPanel headName={head.name} duties={[
        { id: "S001", task: "Record morning workforce muster: all gangs", time: "07:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Site Operations", assignedBy: head.name },
        { id: "S002", task: "Verify concrete pour readiness: Block C ground slab", time: "08:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Inspection", assignedBy: head.name },
        { id: "S003", task: "Incoming aggregate delivery inspection: Delta Freight 40T", time: "11:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Inspection", assignedBy: head.name },
        { id: "S004", task: "Labour attendance sheet: compile and submit to supervisor", time: "18:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reporting", assignedBy: head.name },
        { id: "S005", task: "Daily site report SR-PRJ001-083: submit to supervisor", time: "17:00", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Reporting", assignedBy: head.name },
        { id: "S006", task: "Site photo documentation: Blocks B and C progress", time: "16:30", date: "06 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Documentation", assignedBy: head.name },
        { id: "S007", task: "Pre-pour inspection checklist: Block B columns", time: "09:00", date: "05 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Inspection", assignedBy: head.name },
        { id: "S008", task: "Submit concrete cube test results to lab", time: "14:00", date: "05 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Documentation", assignedBy: head.name },
        { id: "S009", task: "Safety toolbox talk: crane operations", time: "07:30", date: "04 Sep", weekLabel: "Week 36", monthLabel: "September 2026", category: "Safety", assignedBy: head.name },
        { id: "S010", task: "Monthly site progress photos — all blocks", time: "15:00", date: "01 Sep", weekLabel: "Week 35", monthLabel: "September 2026", category: "Documentation", assignedBy: head.name },
      ]} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OfficerSubmissionsPanel submissions={siteOfficerSubmissions} headName={head.name} onView={(s) => setSubDetail({ id: s.id, title: s.title, type: s.type, submitted: s.submittedDate, status: s.status === "rejected" ? "rejected" : s.status === "forwarded" || s.status === "head-approved" ? "approved" : "in-review", notes: s.rejectionNote, chain: [{ staffId: "self-01", staffName: "Mr. Sa'adu Usman Garba", staffTitle: "Site Officer", action: "approved", note: "Submitted for Site Supervisor review.", timestamp: s.submittedDate, isFinal: false }, { staffId: "site-sup-01", staffName: head.name, staffTitle: head.title, action: s.status === "pending-head" ? "pending" : s.status === "rejected" ? "rejected" : "approved", note: s.status === "rejected" ? (s.rejectionNote ?? "") : s.status !== "pending-head" ? "Reviewed and approved." : "", timestamp: s.status !== "pending-head" ? s.submittedDate : "", isFinal: !s.forwardedTo }, ...(s.forwardedTo ? [{ staffId: "next-01", staffName: s.forwardedTo, staffTitle: "Next approver", action: "pending" as const, note: "", timestamp: "", isFinal: true }] : [])] })} />
        </div>
        <div className="space-y-4">
          <OfficerQuickActions
            headName={head.name}
            requestTypes={["Daily Site Report", "Labour Attendance", "Material Request", "Safety Observation", "Defect / Snag Report", "Expense Claim", "Leave Request", "Other"]}
            actions={[
              { label: "Submit Daily Site Report", icon: FileText, hint: "→ Supervisor" },
              { label: "Submit Labour Attendance", icon: Users, hint: "→ Supervisor" },
              { label: "Raise Material Request", icon: Package, hint: "→ Supervisor" },
              { label: "Log Safety Observation", icon: ShieldAlert, hint: "→ Supervisor" },
            ]}
          />
          <Card className="p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Site Report Log</p>
            <div className="space-y-2">
              {[
                { ref: "SR-PRJ001-083", date: "06 Sep", status: "Due Today",  cls: "bg-attention-bg text-attention" },
                { ref: "SR-PRJ001-082", date: "05 Sep", status: "Forwarded",  cls: "bg-info-bg text-info" },
                { ref: "SR-PRJ001-081", date: "04 Sep", status: "Approved",   cls: "bg-healthy-bg text-healthy" },
                { ref: "SR-PRJ001-080", date: "03 Sep", status: "Approved",   cls: "bg-healthy-bg text-healthy" },
              ].map((r) => (
                <div key={r.ref} className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] font-semibold">{r.ref}</p>
                    <p className="text-[10px] text-muted-foreground">{r.date}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${r.cls}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEAM SUBMISSIONS PANELS — injected into relevant head dashboards
   ═══════════════════════════════════════════════════════════════════════════ */

interface TeamSubmission {
  from: string;
  fromTitle: string;
  id: string;
  title: string;
  type: string;
  submittedAt: string;
  urgency: "high" | "normal";
}

function TeamPendingPanel({ submissions, onNav, onView }: { submissions: TeamSubmission[]; onNav: () => void; onView?: (s: TeamSubmission) => void }) {
  const { show } = useToast();
  if (submissions.length === 0) return null;
  return (
    <Card>
      <SectionHead
        title="Team Submissions: Pending Your Review"
        hint={`${submissions.length} item${submissions.length !== 1 ? "s" : ""} awaiting your sign-off`}
        action={
          <span className="rounded bg-attention-bg px-2 py-0.5 font-mono text-[10px] font-bold text-attention">
            ACTION REQUIRED
          </span>
        }
      />
      <div className="divide-y divide-border">
        {submissions.map((s) => (
          <div key={s.id} className="flex items-start gap-3 px-4 py-3 transition hover:bg-panel/50">
            <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${s.urgency === "high" ? "bg-critical" : "bg-attention"}`} />
            <button className="min-w-0 flex-1 text-left" onClick={() => onView?.(s)}>
              <p className="text-sm font-semibold hover:text-primary transition-colors">{s.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                {s.id} · {s.type} · submitted {s.submittedAt}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                From: <span className="font-semibold text-foreground">{s.from}</span> · {s.fromTitle}
              </p>
              {onView && <p className="mt-1 text-[10px] font-semibold text-primary/70 underline-offset-2 hover:underline">View details →</p>}
            </button>
            <div className="flex shrink-0 flex-col gap-1.5">
              <button
                onClick={() => show(`${s.id} approved. Forwarding to next stage.`, "success")}
                className="rounded bg-primary px-2.5 py-1 font-mono text-[10px] font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Approve
              </button>
              <button
                onClick={() => show(`${s.id} returned to ${s.from} with comments`, "info")}
                className="rounded border border-border px-2.5 py-1 font-mono text-[10px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition"
              >
                Return
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export { TeamPendingPanel };

export function RoleDashboard({
  role,
  nav,
  personaName,
  personaTitle,
}: {
  role: UserRole;
  nav: Nav;
  personaName?: string;
  personaTitle?: string;
}) {
  switch (role) {
    // PM-family: project management and coordination
    case "pm":
    case "planner":
      return <PMDashboard nav={nav} />;
    case "project-coordinator":
      return <PMDashboard nav={nav} />;

    // Engineering — head gets PM-style aggregate view; officer gets personal workspace
    case "head-engineering":
      return <PMDashboard nav={nav} />;
    case "engineer":
      return <EngineerDashboard nav={nav} />;

    // Site — supervisor gets full site control; officer gets personal duty workspace
    case "site-supervisor":
      return <SiteDashboard nav={nav} />;
    case "site":
      return <SiteOfficerDashboard nav={nav} />;

    // Architecture — head manages studio; officer works on assigned drawings
    case "head-architect":
      return <ArchitectDashboard nav={nav} />;
    case "architect":
      return <ArchitectOfficerDashboard nav={nav} />;

    // QS — head sees portfolio-wide cost control; junior QS sees personal measurements
    case "head-qs":
      return <QSDashboard nav={nav} />;
    case "qs":
      return <JuniorQSDashboard nav={nav} />;

    // Finance — manager sees full treasury/invoice view; accountant sees personal processing queue
    case "finance":
      return <FinanceDashboard nav={nav} />;
    case "accountant":
      return <AccountantDashboard nav={nav} />;

    // HR & Admin
    case "head-admin":
      return <HRDashboard nav={nav} />;
    case "admin":
      return <AdminOfficerDashboard nav={nav} />;

    // Procurement — manager sees full pipeline; officer sees their RFQ/GRN workspace
    case "procurement-manager":
      return <ProcurementDashboard nav={nav} />;
    case "procurement":
      return <ProcurementOfficerDashboard nav={nav} />;

    // Operations — dedicated dashboard for resource/fleet/logistics oversight
    case "head-ops":
    case "ops":
      return <OpsDashboard nav={nav} persona={{ name: personaName ?? "Operations", title: personaTitle ?? "Operations", role }} />;

    // Business Development / Ops — bd-officer and tender-officer use BDDashboard
    case "bd-officer":
    case "tender-officer":
    case "client-support":
      return <BDDashboard nav={nav} />;

    // Internal Audit
    case "auditor":
      return <AuditDashboard nav={nav} />;

    // ICT & Systems
    case "ict-admin":
      return <ICTDashboard nav={nav} />;

    // Document Control
    case "doc-controller":
      return <DocDashboard nav={nav} />;

    // Roles that use command centre (executive) — handled by App shell.
    // Any unmapped role falls back to the PM dashboard rather than a blank
    // panel, so a new role can never render nothing.
    default:
      return <PMDashboard nav={nav} />;
  }
}
