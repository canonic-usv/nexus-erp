import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Globe,
  HeartHandshake,
  Inbox,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  X,
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
import { naira, projects, staffMembers, tenders, type Health, type UserPersona } from "./data";
import { Card, Chip, CompanyTag, HealthDot, Progress, SectionHead, StatusBadge, healthLabel } from "./ui";
import {
  useToast,
  LeaveRequestModal,
  WelfareRequestModal,
  NewOpportunityModal,
  ScheduleMeetingModal,
  NewTaskModal,
  PayslipDetailModal,
  WelfareDetailModal,
  OppDetailModal,
  type PayslipRecord,
  type WelfareRecord,
  type OppRecord,
} from "./overlays";

type Nav = (screen: string, code?: string) => void;

function ScreenHeader({ title, desc, children }: { title: string; desc: string; children?: any }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

/* ─────────────────────────── MY HR ─────────────────────────── */

type MyHRTab = "overview" | "payslips" | "leave" | "welfare" | "performance" | "documents";

const payslips = [
  { period: "August 2026", gross: 485_000, deductions: 72_750, net: 412_250, status: "Paid", paidOn: "28 Aug 2026" },
  { period: "July 2026", gross: 485_000, deductions: 72_750, net: 412_250, status: "Paid", paidOn: "28 Jul 2026" },
  { period: "June 2026", gross: 485_000, deductions: 72_750, net: 412_250, status: "Paid", paidOn: "28 Jun 2026" },
  { period: "May 2026", gross: 485_000, deductions: 72_750, net: 412_250, status: "Paid", paidOn: "28 May 2026" },
  { period: "April 2026", gross: 485_000, deductions: 72_750, net: 412_250, status: "Paid", paidOn: "28 Apr 2026" },
];

const welfareItems = [
  { id: "WEL-2026-0023", type: "Medical Reimbursement", amount: 45_000, status: "approved" as const, submitted: "02 Sep 2026", desc: "Optician — prescription glasses" },
  { id: "WEL-2026-0019", type: "Emergency Assistance", amount: 150_000, status: "pending" as const, submitted: "15 Aug 2026", desc: "Family emergency travel" },
  { id: "WEL-2026-0014", type: "HMO Top-up", amount: 30_000, status: "approved" as const, submitted: "10 Jul 2026", desc: "Dental procedure co-payment" },
];

const performanceGoals = [
  { goal: "Project Abuja Housing — Phase II delivery on schedule", progress: 68, h: "attention" as Health },
  { goal: "Complete PMP certification", progress: 45, h: "attention" as Health },
  { goal: "Zero HSE incidents on sites under supervision", progress: 100, h: "healthy" as Health },
  { goal: "Submit all site reports on same day", progress: 88, h: "healthy" as Health },
  { goal: "Resolve all critical procurement blockers within 24h", progress: 33, h: "critical" as Health },
];

const myDocs = [
  {
    name: "Employment Contract",
    category: "Legal",
    date: "15 Jan 2005",
    issuedBy: "Head of Administration & HR",
    size: "412 KB",
    status: "Active",
    description: "Permanent employment agreement covering terms, remuneration, benefits and obligations.",
    expiry: null,
  },
  {
    name: "Appointment Letter",
    category: "Legal",
    date: "10 Jan 2005",
    issuedBy: "Group Managing Director",
    size: "186 KB",
    status: "Active",
    description: "Formal letter of appointment to current position.",
    expiry: null,
  },
  {
    name: "Payslip — August 2026",
    category: "Finance",
    date: "28 Aug 2026",
    issuedBy: "Finance & Accounts",
    size: "94 KB",
    status: "Available",
    description: "Monthly salary advice for August 2026 including all allowances and deductions.",
    expiry: null,
  },
  {
    name: "Payslip — July 2026",
    category: "Finance",
    date: "31 Jul 2026",
    issuedBy: "Finance & Accounts",
    size: "94 KB",
    status: "Available",
    description: "Monthly salary advice for July 2026.",
    expiry: null,
  },
  {
    name: "Annual Leave Approval — 2026",
    category: "HR",
    date: "18 Jan 2026",
    issuedBy: "Head of Administration & HR",
    size: "78 KB",
    status: "Active",
    description: "Approved leave plan for calendar year 2026. 30 days annual entitlement.",
    expiry: "31 Dec 2026",
  },
  {
    name: "HMO / Health Insurance Card",
    category: "Welfare",
    date: "01 Jan 2026",
    issuedBy: "Administration & HR",
    size: "48 KB",
    status: "Active",
    description: "NHIS-linked HMO card valid for 2026. Plan: Hygeia HMO Standard Plus.",
    expiry: "31 Dec 2026",
  },
  {
    name: "Training Certificate — PMP Foundation",
    category: "Training",
    date: "15 Mar 2026",
    issuedBy: "Project Management Institute (PMI)",
    size: "220 KB",
    status: "Available",
    description: "PMI-accredited Project Management Professional Foundation certificate.",
    expiry: null,
  },
  {
    name: "Tax Clearance Certificate 2025",
    category: "Legal",
    date: "01 Feb 2026",
    issuedBy: "FIRS / State IRS",
    size: "312 KB",
    status: "Active",
    description: "Income tax clearance for the 2025 tax year. Required for contract renewals.",
    expiry: "31 Jan 2027",
  },
  {
    name: "Pension / RSA Statement — Q2 2026",
    category: "Finance",
    date: "15 Jul 2026",
    issuedBy: "Stanbic IBTC Pensions",
    size: "158 KB",
    status: "Available",
    description: "Quarterly retirement savings account statement. Cumulative balance: ₦8.4m.",
    expiry: null,
  },
  {
    name: "Staff ID Card — 2026",
    category: "Identity",
    date: "02 Jan 2026",
    issuedBy: "Administration & HR",
    size: "34 KB",
    status: "Active",
    description: "Official USV/CANONIC group staff identity card.",
    expiry: "31 Dec 2026",
  },
];

const ROLE_RESPONSIBILITIES: Record<string, string[]> = {
  chairman: ["Strategic direction and board oversight", "Final approval authority on all major decisions", "Shareholder relations and corporate governance", "Group policy ratification", "Appointment of senior executives"],
  gmd: ["Group-wide management and operations oversight", "Executive decision-making and resource allocation", "Stakeholder and client engagement at group level", "Performance monitoring of all directorates", "Quarterly reporting to the Board"],
  ged: ["Directorate planning, coordination and P&L oversight", "GED-level approvals and sign-offs", "Cross-functional team leadership", "Risk identification and escalation to GMD", "Monthly KPI review and reporting"],
  ed: ["Divisional planning and programme delivery", "Procurement and budget oversight at division level", "Supplier and client contract management", "Staff performance evaluation", "Weekly progress reporting to GED"],
  ggm: ["Group management of assigned operations", "Approvals within delegated authority", "Inter-company coordination and reporting", "Policy implementation and compliance", "Mentoring senior staff"],
  ggmp: ["Operations governance and process standardisation", "Vendor and procurement governance", "Group compliance monitoring", "Performance dashboards and reporting to GED", "Capacity and resource planning"],
  pm: ["Project planning, scheduling and monitoring", "Weekly progress reports to directorate lead", "Team coordination and issue escalation", "Client liaison and relationship management", "Budget monitoring and variance reporting"],
  site: ["Daily site supervision and safety checks", "Progress measurement and site diary", "Material and workforce management", "Subcontractor coordination on site", "Incident reporting and escalation"],
  qs: ["Bills of quantities preparation and review", "Interim and final valuation certificates", "Variation assessment and costing", "Procurement support — vendor pricing", "Monthly cost report to PM"],
  procurement: ["Tender documentation and vendor sourcing", "Purchase order processing and tracking", "Supplier evaluation and performance management", "Procurement compliance and record-keeping", "Budget utilisation reporting"],
  finance: ["Invoice processing and payment verification", "Payroll processing and statutory deductions", "Financial reporting and budget analysis", "Bank reconciliation and cash flow management", "Disbursement evidence upload post-approval"],
  "head-admin": ["HR policy administration and staff records", "Recruitment coordination and onboarding", "Leave, welfare and disciplinary management", "Salary administration and grade reviews", "Staff training and development planning"],
  admin: ["General administrative support", "Meeting logistics and minute-taking", "Document filing and registry management", "Travel and accommodation coordination", "Stationery and facilities management"],
  "ict-admin": ["NEXUS platform administration and user management", "IT infrastructure maintenance and monitoring", "Help-desk support and ticket resolution", "Cybersecurity policy enforcement", "Hardware and software asset tracking"],
  architect: ["Architectural design and drawing production", "Design review and quality control", "Client briefing and design presentations", "Coordination with structural and M&E teams", "Site visits and design compliance checks"],
  engineer: ["Structural / MEP design and calculations", "Shop drawing review and approvals", "Site inspection and technical snag-list", "Engineering compliance sign-offs", "Monthly technical progress reports"],
  auditor: ["Internal audit planning and execution", "Compliance and regulatory review", "Audit findings documentation and reporting", "Follow-up on management action plans", "Risk register maintenance"],
  "business-dev": ["Lead generation and market research", "Tender submission and prequalification", "Client relationship and CRM management", "Business proposals and presentations", "Pipeline tracking and win-rate analysis"],
  default: ["Duties assigned by line manager", "Compliance with company policies", "Accurate and timely record-keeping", "Cross-departmental collaboration", "Continuous professional development"],
};

export function MyHR({ persona }: { persona: UserPersona }) {
  const me = staffMembers.find((s) => s.name === persona.name) ?? null;
  const { show } = useToast();
  const [tab, setTab] = useState<MyHRTab>("overview");
  const [leaveModal, setLeaveModal] = useState(false);
  const [welfareModal, setWelfareModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);
  const [selectedWelfare, setSelectedWelfare] = useState<WelfareRecord | null>(null);
  const [viewDoc, setViewDoc] = useState<typeof myDocs[0] | null>(null);

  const tabs: { id: MyHRTab; label: string; icon: any }[] = [
    { id: "overview", label: "My Profile", icon: Users },
    { id: "payslips", label: "Salary & Payslips", icon: Wallet },
    { id: "leave", label: "Leave", icon: CalendarDays },
    { id: "welfare", label: "Welfare", icon: HeartHandshake },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "documents", label: "My Documents", icon: FileText },
  ];

  return (
    <div className="animate-in">
      <ScreenHeader
        title="My HR"
        desc="Your personal employment record, payslips, leave, welfare and performance — private to you."
      >
        <div className="flex gap-2">
          <button
            onClick={() => setLeaveModal(true)}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Leave Request
          </button>
          <button
            onClick={() => setWelfareModal(true)}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Welfare Request
          </button>
        </div>
      </ScreenHeader>

      {/* Tab bar */}
      <div className="mb-5 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MY PROFILE ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {persona.initials}
              </div>
              <h2 className="mt-3 font-display text-lg font-bold">{persona.name}</h2>
              <p className="text-sm text-muted-foreground">{persona.title}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                <CompanyTag company={persona.company} />
                <span className="rounded bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">Active</span>
              </div>
              <div className="mt-4 w-full space-y-2 text-left">
                <InfoRow label="Employee ID" value={me?.employeeId ?? "—"} mono />
                <InfoRow label="Staff Grade" value={me?.salaryGrade ?? "—"} />
                <InfoRow label="Authority" value={persona.authority} />
                <InfoRow label="Directorate" value={persona.directorate.charAt(0).toUpperCase() + persona.directorate.slice(1)} />
                <InfoRow label="Department" value={persona.department} />
              </div>
            </div>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card className="p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Leave Summary</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Annual Balance", v: `${me?.leaveBalance ?? 18} days`, t: "healthy" as Health },
                  { l: "Taken This Year", v: `${me?.leaveTaken ?? 5} days`, t: "attention" as Health },
                  { l: "Pending Request", v: "None", t: "healthy" as Health },
                ].map((s) => (
                  <div key={s.l} className="rounded border border-border p-3">
                    <p className="text-[11px] text-muted-foreground">{s.l}</p>
                    <p className={`mt-1 font-display text-xl font-bold ${s.t === "critical" ? "text-critical" : s.t === "attention" ? "text-attention" : "text-healthy"}`}>{s.v}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Permanent Responsibilities</p>
              <ul className="space-y-2">
                {(ROLE_RESPONSIBILITIES[persona.role] ?? ROLE_RESPONSIBILITIES["default"]).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Current Assignment</p>
              <div className="rounded bg-panel px-4 py-3 text-sm space-y-2">
                <p className="font-semibold">{me?.currentAssignment ?? `${persona.title} — Primary role duties`}</p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-muted-foreground">
                  <span><span className="font-medium text-foreground">Status:</span> Ongoing</span>
                  <span><span className="font-medium text-foreground">Company:</span> {persona.company}</span>
                  <span><span className="font-medium text-foreground">Workload:</span> {me?.workload ?? "—"}%</span>
                  <span><span className="font-medium text-foreground">Last login:</span> {me?.lastLogin ?? "—"}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── PAYSLIPS ── */}
      {tab === "payslips" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { l: "Basic Salary", v: naira(350_000), tone: "" },
              { l: "Gross (Aug 2026)", v: naira(485_000), tone: "" },
              { l: "Net (Aug 2026)", v: naira(412_250), tone: "text-healthy font-bold" },
            ].map((s) => (
              <Card key={s.l} className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</p>
                <p className={`mt-2 font-display text-2xl tabular-nums ${s.tone || "text-foreground"}`}>{s.v}</p>
              </Card>
            ))}
          </div>

          <Card>
            <SectionHead title="Payslip History" hint="Last 12 months" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["Period", "Gross", "Deductions", "Net", "Status", ""].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((p) => (
                    <tr key={p.period} className="cursor-pointer border-b border-border last:border-0 hover:bg-panel transition" onClick={() => setSelectedPayslip(p)}>
                      <td className="px-4 py-2.5 font-medium">{p.period}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">{naira(p.gross)}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-attention">{naira(p.deductions)}</td>
                      <td className="px-4 py-2.5 font-mono font-semibold tabular-nums text-healthy">{naira(p.net)}</td>
                      <td className="px-4 py-2.5">
                        <span className="rounded bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">{p.status}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs font-semibold text-primary hover:underline">View / Download</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">August 2026 Breakdown</p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              {[
                ["Basic Salary", naira(350_000), ""],
                ["Housing Allowance", naira(70_000), ""],
                ["Transport Allowance", naira(35_000), ""],
                ["Medical Allowance", naira(30_000), ""],
                ["Gross Pay", naira(485_000), "font-bold border-t border-border mt-2 pt-2"],
                ["PAYE Tax", `(${naira(55_000)})`, "text-attention"],
                ["Pension (8%)", `(${naira(28_000)})`, "text-attention"],
                ["Other Deductions", `(${naira(7_750)})`, "text-attention"],
                ["NET PAY", naira(412_250), "font-bold text-healthy border-t border-border mt-2 pt-2"],
              ].map(([l, v, cls]) => (
                <div key={l} className={`flex justify-between py-1 text-sm ${cls}`}>
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-mono tabular-nums">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── LEAVE ── */}
      {tab === "leave" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { l: "Annual Entitlement", v: "30 days", t: "healthy" as Health },
              { l: "Days Taken", v: `${me?.leaveTaken ?? 5} days`, t: "attention" as Health },
              { l: "Balance", v: `${me?.leaveBalance ?? 25} days`, t: "healthy" as Health },
              { l: "Pending Requests", v: "0", t: "healthy" as Health },
            ].map((s) => (
              <Card key={s.l} className="p-4">
                <div className="flex items-start justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</p>
                  <HealthDot h={s.t} />
                </div>
                <p className={`mt-2 font-display text-2xl font-bold ${s.t === "critical" ? "text-critical" : s.t === "attention" ? "text-attention" : "text-healthy"}`}>{s.v}</p>
              </Card>
            ))}
          </div>

          <Card>
            <SectionHead
              title="Leave Records"
              action={
                <button
                  onClick={() => setLeaveModal(true)}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="h-3.5 w-3.5" /> New Leave Request
                </button>
              }
            />
            {(me?.leaveRecords ?? []).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-panel">
                      {["Type", "Dates", "Days", "Status"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(me?.leaveRecords ?? []).map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-panel">
                        <td className="px-4 py-2.5 capitalize font-medium">{r.type}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{r.dates}</td>
                        <td className="px-4 py-2.5 font-mono">{r.days}</td>
                        <td className="px-4 py-2.5">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                            r.status === "approved" ? "bg-healthy-bg text-healthy" :
                            r.status === "pending" ? "bg-attention-bg text-attention" :
                            "bg-critical-bg text-critical"
                          }`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">No leave records yet.</div>
            )}
          </Card>

          {/* Leave entitlement breakdown */}
          <Card className="p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Leave Types Available</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { type: "Annual Leave", entitlement: "30 days", eligibility: "All permanent staff" },
                { type: "Sick Leave", entitlement: "14 days", eligibility: "With medical certificate" },
                { type: "Maternity Leave", entitlement: "12 weeks", eligibility: "Female staff" },
                { type: "Paternity Leave", entitlement: "1 week", eligibility: "Male staff on birth" },
                { type: "Emergency Leave", entitlement: "5 days", eligibility: "Bereavement / emergency" },
                { type: "Study Leave", entitlement: "By approval", eligibility: "Approved programmes only" },
              ].map((l) => (
                <div key={l.type} className="rounded border border-border p-3">
                  <p className="text-sm font-semibold">{l.type}</p>
                  <p className="text-xs text-muted-foreground">{l.entitlement} · {l.eligibility}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── WELFARE ── */}
      {tab === "welfare" && (
        <div className="space-y-4">
          <Card>
            <SectionHead
              title="Welfare Requests"
              action={
                <button
                  onClick={() => setWelfareModal(true)}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="h-3.5 w-3.5" /> New Request
                </button>
              }
            />
            <div className="space-y-3 p-4">
              {welfareItems.map((w) => (
                <button key={w.id} onClick={() => setSelectedWelfare(w)} className="w-full rounded border border-border p-3 text-left transition hover:border-primary/30 hover:bg-panel">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{w.type}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{w.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">{naira(w.amount)}</p>
                      <span className={`mt-0.5 inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                        w.status === "approved" ? "bg-healthy-bg text-healthy" : "bg-attention-bg text-attention"
                      }`}>{w.status === "approved" ? "Approved" : "Pending"}</span>
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">{w.id} · Submitted {w.submitted}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Benefits & Entitlements</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { b: "HMO / Medical Insurance", status: "Active", detail: "NHIS registered · Family cover" },
                { b: "Group Life Insurance", status: "Active", detail: "3× annual salary" },
                { b: "Pension (RSSF)", status: "Active", detail: "8% employee + 10% employer" },
                { b: "Annual Medical Allowance", status: "Active", detail: `${naira(30_000)} per year` },
                { b: "Transport Allowance", status: "Active", detail: `${naira(35_000)} per month` },
                { b: "Staff Welfare Fund", status: "Active", detail: "Emergency assistance available" },
              ].map((b) => (
                <div key={b.b} className="flex items-start gap-2.5 rounded border border-border p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-healthy" />
                  <div>
                    <p className="text-sm font-semibold">{b.b}</p>
                    <p className="text-xs text-muted-foreground">{b.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── PERFORMANCE ── */}
      {tab === "performance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { l: "Overall Rating", v: "Good", t: "healthy" as Health, sub: "FY 2025–26 interim" },
              { l: "Goals Completed", v: "3 / 5", t: "attention" as Health, sub: "2 in progress" },
              { l: "Next Review", v: "Dec 2026", t: "healthy" as Health, sub: "Annual appraisal" },
            ].map((s) => (
              <Card key={s.l} className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</p>
                <p className={`mt-2 font-display text-2xl font-bold ${s.t === "critical" ? "text-critical" : s.t === "attention" ? "text-attention" : "text-healthy"}`}>{s.v}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
              </Card>
            ))}
          </div>

          <Card>
            <SectionHead title="Performance Goals — FY 2026" hint="Set by line manager · reviewed quarterly" />
            <div className="space-y-3 p-4">
              {performanceGoals.map((g, i) => (
                <div key={i} className="rounded border border-border p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{g.goal}</p>
                    <span className={`shrink-0 font-mono text-sm font-bold ${g.h === "critical" ? "text-critical" : g.h === "attention" ? "text-attention" : "text-healthy"}`}>{g.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-panel">
                    <div
                      className={`h-1.5 rounded-full transition-all ${g.h === "critical" ? "bg-critical" : g.h === "attention" ? "bg-attention" : "bg-healthy"}`}
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── DOCUMENTS ── */}
      {tab === "documents" && (
        <div className="space-y-3">
          {/* Summary strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Documents", value: myDocs.length },
              { label: "Active", value: myDocs.filter((d) => d.status === "Active").length },
              { label: "Available", value: myDocs.filter((d) => d.status === "Available").length },
              { label: "Expiring < 90 days", value: myDocs.filter((d) => d.expiry).length },
            ].map((s) => (
              <Card key={s.label} className="px-4 py-3">
                <p className="font-display text-lg font-bold tabular-nums text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>

          <Card>
            <SectionHead title="My Documents" hint={`${myDocs.length} personal employment documents`} />
            <div className="divide-y divide-border">
              {myDocs.map((d) => {
                const catColor: Record<string, string> = {
                  Legal: "bg-info-bg text-info", Finance: "bg-healthy-bg text-healthy",
                  HR: "bg-primary/8 text-primary", Welfare: "bg-attention-bg text-attention",
                  Training: "bg-[#7c3aed]/8 text-[#7c3aed]", Identity: "bg-muted text-muted-foreground",
                };
                return (
                  <div key={d.name} className="group flex items-start gap-3 px-4 py-3 transition hover:bg-panel">
                    {/* Category icon */}
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-foreground">{d.name}</span>
                        <span className={`rounded-full px-2 py-[2px] text-[9px] font-bold uppercase tracking-wide ${catColor[d.category] ?? "bg-muted text-muted-foreground"}`}>{d.category}</span>
                        <span className={`rounded px-1.5 py-[2px] text-[9px] font-semibold ${d.status === "Active" ? "bg-healthy-bg text-healthy" : "bg-info-bg text-info"}`}>{d.status}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{d.description}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[10px] text-muted-foreground">
                        <span>Issued: <span className="font-mono">{d.date}</span></span>
                        <span>By: {d.issuedBy}</span>
                        <span>Size: {d.size}</span>
                        {d.expiry && <span className="text-attention font-semibold">Expires: {d.expiry}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 pt-0.5">
                      <button
                        onClick={() => {
                          const blob = new Blob([`${d.name}\nIssued by: ${d.issuedBy}\nDate: ${d.date}\nCategory: ${d.category}\n\n${d.description}`], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url; a.download = `${d.name.replace(/\s+/g, "_")}.txt`; a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="rounded border border-border px-2.5 py-1 text-[10px] font-semibold text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => setViewDoc(d)}
                        className="rounded bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground opacity-0 transition hover:opacity-90 group-hover:opacity-100"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      <LeaveRequestModal open={leaveModal} onClose={() => setLeaveModal(false)} onSuccess={() => show("Leave request submitted — pending line manager approval", "success")} />
      <WelfareRequestModal open={welfareModal} onClose={() => setWelfareModal(false)} onSuccess={() => show("Welfare request submitted — HR will review within 3 working days", "success")} />
      <PayslipDetailModal open={!!selectedPayslip} onClose={() => setSelectedPayslip(null)} payslip={selectedPayslip} />
      <WelfareDetailModal open={!!selectedWelfare} onClose={() => setSelectedWelfare(null)} item={selectedWelfare} />

      {/* ── Document Viewer Modal ── */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewDoc(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative flex w-full max-w-2xl flex-col rounded-[var(--radius)] border border-border bg-card shadow-2xl" style={{ maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-display text-[14px] font-bold leading-tight">{viewDoc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{viewDoc.category} · Issued {viewDoc.date} · {viewDoc.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([`${viewDoc.name}\nIssued by: ${viewDoc.issuedBy}\nDate: ${viewDoc.date}\n\n${viewDoc.description}`], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `${viewDoc.name.replace(/\s+/g, "_")}.txt`; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
                <button onClick={() => setViewDoc(null)} className="rounded p-1.5 text-muted-foreground hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document body — simulated letterhead */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="rounded border border-border bg-white dark:bg-[#1a1a1a] shadow-sm font-sans text-[#1a1a1a] dark:text-[#e5e5e5]">
                {/* Letterhead */}
                <div className="border-b-4 border-[#1a3a5c] px-8 py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[18px] font-black tracking-tight text-[#1a3a5c] dark:text-[#6fa3d8]">USV DEVELOPMENT SERVICES LTD</p>
                      <p className="text-[11px] font-medium text-[#4a6a8a]">& CANONIC ASSOCIATES LTD</p>
                      <p className="mt-1 text-[10px] text-[#666]">Plot 254, Cadastral Zone B09, Abuja, FCT — Nigeria</p>
                      <p className="text-[10px] text-[#666]">Tel: +234 (0) 803 000 0000 · info@usvgroup.com.ng</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#1a3a5c] text-[22px] font-black text-[#1a3a5c] dark:text-[#6fa3d8]">USV</div>
                    </div>
                  </div>
                </div>

                {/* Document meta */}
                <div className="border-b border-[#ddd] bg-[#f7f9fc] dark:bg-[#222] px-8 py-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[11px]">
                    <div><span className="font-semibold text-[#555] dark:text-[#aaa]">Reference No: </span><span className="font-mono">{viewDoc.category.substring(0,3).toUpperCase()}-USV-{viewDoc.date.replace(/\s/g,"-")}-001</span></div>
                    <div><span className="font-semibold text-[#555] dark:text-[#aaa]">Date: </span>{viewDoc.date}</div>
                    <div><span className="font-semibold text-[#555] dark:text-[#aaa]">Category: </span>{viewDoc.category}</div>
                    <div><span className="font-semibold text-[#555] dark:text-[#aaa]">Status: </span><span className={viewDoc.status === "Active" ? "font-bold text-green-700 dark:text-green-400" : "text-[#555]"}>{viewDoc.status}</span></div>
                    <div><span className="font-semibold text-[#555] dark:text-[#aaa]">Issued By: </span>{viewDoc.issuedBy}</div>
                    {viewDoc.expiry && <div><span className="font-semibold text-[#555] dark:text-[#aaa]">Expiry: </span><span className="font-semibold text-orange-600 dark:text-orange-400">{viewDoc.expiry}</span></div>}
                  </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-4 text-[13px] leading-relaxed">
                  <p className="font-bold text-[15px] text-[#1a3a5c] dark:text-[#6fa3d8] uppercase tracking-wide">{viewDoc.name}</p>
                  <p>{viewDoc.description}</p>
                  {viewDoc.category === "Legal" && (
                    <>
                      <p>This document constitutes a formal legal instrument between the Employee and USV Development Services Ltd / Canonic Associates Ltd (collectively "the Company") and shall be governed by the Labour Act CAP L1 LFN 2004 and all applicable Nigerian employment laws.</p>
                      <p>The terms herein supersede all prior verbal or written agreements between the parties unless expressly stated otherwise. Any amendments to this document must be made in writing and signed by both parties.</p>
                      <p>This document is issued in duplicate. One copy is retained by the Company's Administration and Human Resources Department; the other is retained by the Employee.</p>
                    </>
                  )}
                  {viewDoc.category === "Finance" && (
                    <>
                      <p>This financial document has been prepared in accordance with the Company's internal financial policies and applicable Nigerian tax regulations. All figures are stated in Nigerian Naira (₦) unless otherwise indicated.</p>
                      <p>Any queries regarding figures contained herein should be directed to the Finance and Accounts Department within 14 working days of the document date. Unchallenged figures will be deemed accepted.</p>
                    </>
                  )}
                  {viewDoc.category === "HR" && (
                    <>
                      <p>This HR record has been processed in accordance with the Company's Human Resource policies and procedures as documented in the NEXUS ERP HR Management module.</p>
                      <p>Any disputes or clarifications regarding this document should be raised with the Head of Administration and Human Resources within 5 working days of receipt.</p>
                    </>
                  )}
                  {viewDoc.category === "Training" && (
                    <>
                      <p>This certificate confirms successful completion of the training programme and demonstrates the holder's competency in the subject area. The certificate is valid for continued professional development (CPD) credit purposes.</p>
                      <p>A copy of this certificate has been filed in the employee's personal training record maintained by the Administration and HR Department.</p>
                    </>
                  )}
                  {(viewDoc.category === "Welfare" || viewDoc.category === "Identity") && (
                    <p>This document is issued by the Company's Administration and Human Resources Department as an official record of the named individual's employment and entitlements within USV Development Services Ltd and Canonic Associates Ltd.</p>
                  )}

                  {/* Signature block */}
                  <div className="mt-8 grid grid-cols-2 gap-8 border-t border-[#ddd] pt-6 text-[11px]">
                    <div>
                      <div className="mb-4 h-10 border-b border-[#999]" />
                      <p className="font-semibold">Authorised Signatory</p>
                      <p className="text-[#666]">{viewDoc.issuedBy}</p>
                      <p className="text-[#666]">USV Development Services Ltd</p>
                    </div>
                    <div>
                      <div className="mb-4 h-10 border-b border-[#999]" />
                      <p className="font-semibold">Employee Acknowledgement</p>
                      <p className="text-[#666]">Signature and date of receipt</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] text-[#999] italic">This is a confidential document issued to the named employee only. Unauthorised disclosure, copying or distribution is strictly prohibited.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── BUSINESS DEVELOPMENT ─────────────────────────── */

const bdPipeline = [
  { id: "OPP-2026-0012", name: "Abuja FCT Schools Rehabilitation", client: "FCT Education Board", company: "USV" as const, stage: "Pursuit Decision", value: 1_800_000_000, probability: 65, officer: "BD Officer", deadline: "15 Oct 2026", h: "healthy" as Health },
  { id: "TND-2026-0045", name: "Federal Secretariat Annexe", client: "Federal Ministry of Works", company: "USV + CANONIC" as const, stage: "Commercial Preparation", value: 3_400_000_000, probability: 55, officer: "Tender Officer", deadline: "18 Sep 2026", h: "attention" as Health },
  { id: "TND-2026-0041", name: "Lekki Waterfront Residences", client: "Landmark Properties", company: "CANONIC" as const, stage: "Internal Review", value: 890_000_000, probability: 70, officer: "Head of Architecture", deadline: "09 Sep 2026", h: "attention" as Health },
  { id: "TND-2026-0038", name: "Abuja Light Rail Depot", client: "FCT Transport Sec.", company: "USV" as const, stage: "Technical Preparation", value: 5_600_000_000, probability: 35, officer: "Tender Officer", deadline: "26 Sep 2026", h: "healthy" as Health },
  { id: "OPP-2026-0009", name: "Enugu State Assembly Complex", client: "Enugu State Govt.", company: "USV + CANONIC" as const, stage: "Qualification", value: 2_100_000_000, probability: 40, officer: "BD Officer", deadline: "30 Oct 2026", h: "healthy" as Health },
  { id: "OPP-2026-0007", name: "Port Harcourt Commercial Centre", client: "Rivers Investment Co.", company: "USV" as const, stage: "Opportunity", value: 4_500_000_000, probability: 20, officer: "BD Officer", deadline: "Dec 2026", h: "healthy" as Health },
];

const bdStages = ["Opportunity", "Qualification", "Pursuit Decision", "Tender / Proposal", "Technical Preparation", "Commercial Preparation", "Internal Review", "Submission", "Follow-up", "Award / Rejection"];

const wonLost = [
  { name: "Kaduna Office Complex", client: "Kaduna State Govt.", value: 980_000_000, outcome: "Won", date: "Mar 2026" },
  { name: "Lagos Housing Phase I", client: "Lagos State Housing Corp.", value: 1_200_000_000, outcome: "Won", date: "Jan 2026" },
  { name: "Ibadan Commercial Hub", client: "Ibadan Dev. Corp.", value: 2_300_000_000, outcome: "Lost", date: "Feb 2026" },
  { name: "Abuja Civic Centre", client: "FCT Authority", value: 870_000_000, outcome: "Lost", date: "Dec 2025" },
];

const bdTotals = bdPipeline.reduce(
  (a, b) => ({ count: a.count + 1, value: a.value + b.value, weighted: a.weighted + b.value * b.probability / 100 }),
  { count: 0, value: 0, weighted: 0 }
);

export function BusinessDev({ nav }: { nav: Nav }) {
  const { show } = useToast();
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [oppModal, setOppModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<OppRecord | null>(null);
  const [pipeline, setPipeline] = useState(bdPipeline);
  const filtered = activeStage ? pipeline.filter((b) => b.stage === activeStage) : pipeline;

  const stageCounts = bdStages.reduce((acc, s) => {
    acc[s] = bdPipeline.filter((b) => b.stage === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="animate-in">
      <ScreenHeader
        title="Business Development"
        desc="Opportunity pipeline — from first contact to contract award. Retain intelligence from every tender, won or lost."
      >
        <button
          onClick={() => setOppModal(true)}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> New Opportunity
        </button>
      </ScreenHeader>

      {/* KPI strip */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { l: "Active Opportunities", v: bdPipeline.length.toString(), sub: "across pipeline" },
          { l: "Pipeline Value", v: `₦${(bdTotals.value / 1_000_000_000).toFixed(1)}B`, sub: "combined tender value" },
          { l: "Weighted Value", v: `₦${(bdTotals.weighted / 1_000_000_000).toFixed(1)}B`, sub: "probability adjusted" },
          { l: "Near Deadline", v: bdPipeline.filter((b) => b.h === "attention").length.toString(), sub: "within 14 days", tone: "attention" as Health },
        ].map((k) => (
          <Card key={k.l} className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k.l}</p>
            <p className={`mt-2 font-display text-2xl font-bold tabular-nums ${k.tone === "attention" ? "text-attention" : "text-foreground"}`}>{k.v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* Pipeline funnel */}
      <Card className="mb-4">
        <SectionHead title="Pipeline Funnel" hint="Click a stage to filter" />
        <div className="flex flex-wrap items-center gap-1.5 p-4">
          {bdStages.map((s, i) => {
            const count = stageCounts[s] ?? 0;
            return (
              <button
                key={s}
                onClick={() => setActiveStage(activeStage === s ? null : s)}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  activeStage === s
                    ? "bg-primary text-primary-foreground"
                    : count > 0
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "bg-panel text-muted-foreground"
                }`}
              >
                {s}
                {count > 0 && (
                  <span className={`rounded-full px-1.5 text-[9px] font-bold ${activeStage === s ? "bg-white/20 text-white" : "bg-primary/15 text-primary"}`}>{count}</span>
                )}
              </button>
            );
          })}
          {activeStage && (
            <button onClick={() => setActiveStage(null)} className="text-xs text-muted-foreground hover:text-primary">
              Clear filter ×
            </button>
          )}
        </div>
      </Card>

      {/* Opportunity cards */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {filtered.map((opp) => (
          <Card key={opp.id}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => nav("portfolio")}
                      className="font-mono text-[10px] text-primary hover:underline"
                    >
                      {opp.id}
                    </button>
                    <CompanyTag company={opp.company} />
                  </div>
                  <p className="font-display text-sm font-bold leading-snug">{opp.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{opp.client}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold tabular-nums">{naira(opp.value)}</p>
                  <span className={`mt-0.5 inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${opp.h === "attention" ? "bg-attention-bg text-attention" : "bg-panel text-muted-foreground"}`}>
                    {opp.probability}% prob.
                  </span>
                </div>
              </div>

              {/* Stage progress */}
              <div className="mb-3 rounded bg-panel px-3 py-2">
                <div className="flex flex-wrap items-center gap-1">
                  {bdStages.slice(0, 5).map((s, i) => {
                    const curIdx = bdStages.indexOf(opp.stage);
                    const sIdx = bdStages.indexOf(s);
                    return (
                      <span key={s} className="flex items-center gap-1">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                          sIdx < curIdx ? "bg-primary/15 text-primary" :
                          sIdx === curIdx ? "bg-accent text-accent-foreground" :
                          "bg-secondary text-muted-foreground"
                        }`}>{s.split(" ")[0]}</span>
                        {i < 4 && <ChevronRight className="h-2.5 w-2.5 text-border-strong" />}
                      </span>
                    );
                  })}
                  <span className="text-[9px] text-muted-foreground">…</span>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Current: <span className="font-semibold text-foreground">{opp.stage}</span>
                  {" · "}Officer: {opp.officer}
                  {" · "}Deadline: <span className={opp.h === "attention" ? "font-semibold text-attention" : ""}>{opp.deadline}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedOpp({ ...opp }); }}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  Update <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => { setSelectedOpp({ ...opp }); }}
                  className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-border-strong hover:text-foreground transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Won / Lost */}
      <Card>
        <SectionHead title="Recent Outcomes" hint="Retained for institutional knowledge" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-panel">
                {["Tender", "Client", "Value", "Outcome", "Date"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wonLost.map((r) => (
                <tr key={r.name} className="border-b border-border last:border-0 hover:bg-panel">
                  <td className="px-4 py-2.5 font-medium">{r.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.client}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums">{naira(r.value)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${r.outcome === "Won" ? "bg-healthy-bg text-healthy" : "bg-critical-bg text-critical"}`}>
                      {r.outcome}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <NewOpportunityModal open={oppModal} onClose={() => setOppModal(false)} onSuccess={() => show("New opportunity added to pipeline — BD team notified", "success")} />
      <OppDetailModal
        open={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
        opp={selectedOpp}
        bdStages={bdStages}
        onUpdate={(id, updates) => {
          setPipeline(prev => prev.map(o => o.id === id ? { ...o, stage: updates.stage ?? o.stage, probability: updates.probability ?? o.probability } : o));
        }}
      />
    </div>
  );
}

/* ─────────────────────────── MEETINGS & DECISIONS ─────────────────────────── */

const meetings = [
  {
    id: "MTG-2026-0041",
    title: "Abuja Housing — Weekly Project Review",
    type: "Project Review",
    company: "USV" as const,
    project: "Abuja Housing Ph II",
    date: "06 Sep 2026",
    time: "09:00",
    chair: "Engr. Musa Bello",
    attendees: ["Engr. Musa Bello", "Engr. James Oyelaran", "QS Officer", "Procurement Officer", "HSE Officer"],
    status: "Completed",
    decisions: [
      { d: "Approve revised site programme — 2-week extension", responsible: "Project Manager", deadline: "09 Sep 2026", taskCreated: true },
      { d: "Expedite PO for reinforcement steel — approve within 24h", responsible: "GED Projects", deadline: "07 Sep 2026", taskCreated: true },
      { d: "Engage backup subcontractor for blockwork", responsible: "Site Supervisor", deadline: "10 Sep 2026", taskCreated: true },
    ],
    actions: 3,
    open: 2,
  },
  {
    id: "MTG-2026-0040",
    title: "Management Monthly Review",
    type: "Executive Review",
    company: "USV + CANONIC" as const,
    project: null,
    date: "01 Sep 2026",
    time: "10:00",
    chair: "GMD",
    attendees: ["Chairman", "GMD", "GED Projects", "GED Technical", "Finance Manager", "Head of Operations"],
    status: "Completed",
    decisions: [
      { d: "Canonic to complete Enugu Medical Centre design by 15 Sep", responsible: "Head of Architecture", deadline: "15 Sep 2026", taskCreated: true },
      { d: "Finance to follow up on all outstanding receivables", responsible: "Finance Manager", deadline: "08 Sep 2026", taskCreated: true },
      { d: "HR to present staff workload report at next meeting", responsible: "Head of HR", deadline: "01 Oct 2026", taskCreated: false },
    ],
    actions: 3,
    open: 1,
  },
  {
    id: "MTG-2026-0042",
    title: "Canonic Design Coordination",
    type: "Technical",
    company: "CANONIC" as const,
    project: "Enugu Medical Centre",
    date: "09 Sep 2026",
    time: "14:00",
    chair: "Head of Architecture",
    attendees: ["Head of Architecture", "Arc. Ngozi Okoro", "Head of QS", "Client Rep."],
    status: "Upcoming",
    decisions: [],
    actions: 0,
    open: 0,
  },
];

export function MeetingsDecisions() {
  const { show } = useToast();
  const [selectedMtg, setSelectedMtg] = useState<typeof meetings[0] | null>(null);
  const [scheduleMtgModal, setScheduleMtgModal] = useState(false);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [taskDecision, setTaskDecision] = useState("");
  const [createdTaskIds, setCreatedTaskIds] = useState<string[]>([]);

  const upcoming = meetings.filter((m) => m.status === "Upcoming");
  const completed = meetings.filter((m) => m.status === "Completed");
  const totalOpen = meetings.reduce((a, m) => a + m.open, 0);

  return (
    <div className="animate-in">
      <ScreenHeader
        title="Meetings & Decisions"
        desc="Every meeting produces a record. Every decision becomes a tracked task. No action is lost after the call ends."
      >
        <button
          onClick={() => setScheduleMtgModal(true)}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Schedule Meeting
        </button>
      </ScreenHeader>

      {totalOpen > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded border border-attention/30 bg-attention-bg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-attention" />
          <p className="text-sm font-semibold text-attention">{totalOpen} meeting action{totalOpen > 1 ? "s" : ""} still open — assigned tasks require completion.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Meeting list */}
        <div className="space-y-3 lg:col-span-1">
          {upcoming.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Upcoming</p>
              {upcoming.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMtg(m)}
                  className={`w-full rounded-[var(--radius)] border p-3 text-left transition hover:border-primary/30 ${selectedMtg?.id === m.id ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold">{m.title}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{m.date} {m.time} · {m.chair}</p>
                    </div>
                    <CompanyTag company={m.company} />
                  </div>
                  <span className="mt-1.5 inline-block rounded bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">{m.type}</span>
                </button>
              ))}
            </>
          )}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Recent</p>
          {completed.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMtg(m)}
              className={`w-full rounded-[var(--radius)] border p-3 text-left transition hover:border-primary/30 ${selectedMtg?.id === m.id ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold">{m.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{m.date} · {m.chair}</p>
                </div>
                <CompanyTag company={m.company} />
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="rounded bg-healthy-bg px-2 py-0.5 text-[9px] font-semibold text-healthy">Completed</span>
                {m.open > 0 && (
                  <span className="rounded bg-attention-bg px-2 py-0.5 text-[9px] font-semibold text-attention">{m.open} open actions</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Meeting detail */}
        <div className="lg:col-span-2">
          {selectedMtg ? (
            <div className="space-y-3">
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground">{selectedMtg.id}</span>
                      <CompanyTag company={selectedMtg.company} />
                    </div>
                    <h2 className="font-display text-lg font-bold">{selectedMtg.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedMtg.date} at {selectedMtg.time} · Chaired by {selectedMtg.chair}
                    </p>
                    {selectedMtg.project && (
                      <p className="mt-0.5 text-xs text-muted-foreground">Project: {selectedMtg.project}</p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${selectedMtg.status === "Upcoming" ? "bg-primary/10 text-primary" : "bg-healthy-bg text-healthy"}`}>
                    {selectedMtg.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Attendees</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMtg.attendees.map((a) => (
                      <span key={a} className="rounded bg-panel px-2 py-0.5 text-xs">{a}</span>
                    ))}
                  </div>
                </div>
              </Card>

              {selectedMtg.decisions.length > 0 ? (
                <Card>
                  <SectionHead title="Decisions & Actions" hint="Each decision auto-creates a tracked task" />
                  <div className="space-y-3 p-4">
                    {selectedMtg.decisions.map((dec, i) => (
                      <div key={i} className="rounded border border-border p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold leading-snug">{dec.d}</p>
                          {dec.taskCreated ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-healthy" />
                          ) : (
                            <AlertCircle className="h-4 w-4 shrink-0 text-attention" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {dec.responsible}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due {dec.deadline}
                          </span>
                          {dec.taskCreated || createdTaskIds.includes(`${selectedMtg?.id}-${i}`) ? (
                            <span className="rounded bg-healthy-bg px-1.5 py-0.5 text-[10px] font-semibold text-healthy">Task created</span>
                          ) : (
                            <button
                              onClick={() => { setTaskDecision(dec.d); setNewTaskModal(true); }}
                              className="rounded bg-attention-bg px-1.5 py-0.5 text-[10px] font-semibold text-attention hover:bg-attention/15"
                            >
                              Create task
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center">
                  <ClipboardList className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {selectedMtg.status === "Upcoming" ? "Agenda and decisions will appear after the meeting." : "No decisions recorded."}
                  </p>
                  {selectedMtg.status === "Upcoming" && (
                    <button
                      onClick={() => show("Agenda item added — attendees will be notified", "success")}
                      className="mt-3 inline-flex items-center gap-1 rounded bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15"
                    >
                      <Plus className="h-3 w-3" /> Add Agenda Item
                    </button>
                  )}
                </Card>
              )}
            </div>
          ) : (
            <Card className="flex h-64 items-center justify-center p-8 text-center">
              <div>
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" strokeWidth={1.4} />
                <p className="font-semibold text-foreground">Select a meeting</p>
                <p className="mt-1 text-sm text-muted-foreground">Click any meeting on the left to view its record and decisions.</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <ScheduleMeetingModal open={scheduleMtgModal} onClose={() => setScheduleMtgModal(false)} onSuccess={() => show("Meeting scheduled — calendar invites sent to attendees", "success")} />
      <NewTaskModal
        open={newTaskModal}
        onClose={() => setNewTaskModal(false)}
        defaultTitle={taskDecision ? taskDecision.slice(0, 80) : ""}
        onSuccess={() => {
          const key = `${selectedMtg?.id}-task`;
          setCreatedTaskIds(p => [...p, key]);
          show("Task created and assigned — responsible party notified", "success");
        }}
      />
    </div>
  );
}

/* ─────────────────────────── CLIENTS & VENDORS ─────────────────────────── */

const clients = [
  { id: "CLT-001", name: "Federal Ministry of Works", short: "FMW", type: "Government", projects: 2, activeContracts: 1, totalValue: 3_400_000_000, outstanding: 145_000_000, status: "Active", contact: "Engr. Sule Ibrahim", phone: "+234-803-xxx-xxxx" },
  { id: "CLT-002", name: "Landmark Properties Ltd", short: "LP", type: "Private Sector", projects: 2, activeContracts: 2, totalValue: 2_490_000_000, outstanding: 85_000_000, status: "Active", contact: "Mr. Chukwudi Obi", phone: "+234-802-xxx-xxxx" },
  { id: "CLT-003", name: "FCT Transport Secretariat", short: "FCT-TS", type: "Government", projects: 1, activeContracts: 0, totalValue: 5_600_000_000, outstanding: 0, status: "Tender", contact: "Dir. Abubakar", phone: "+234-809-xxx-xxxx" },
  { id: "CLT-004", name: "Kaduna State Government", short: "KDG", type: "Government", projects: 1, activeContracts: 1, totalValue: 980_000_000, outstanding: 42_000_000, status: "Active", contact: "Sec. Tanko Aliyu", phone: "+234-806-xxx-xxxx" },
  { id: "CLT-005", name: "Rivers Investment Company", short: "RIC", type: "Private Sector", projects: 0, activeContracts: 0, totalValue: 0, outstanding: 0, status: "Prospect", contact: "Mr. Fubara", phone: "+234-801-xxx-xxxx" },
];

const vendors = [
  { id: "VEN-001", name: "Julius Steel Ltd", category: "Materials", products: "Reinforcement Steel", performance: "A", reliability: "High", pOs: 12, totalSpend: 847_000_000, contact: "Mr. Julius Adeyemi", status: "Approved" },
  { id: "VEN-002", name: "Dangote Trading", category: "Materials", products: "Steel, Cement", performance: "B+", reliability: "Medium", pOs: 8, totalSpend: 412_000_000, contact: "Procurement Desk", status: "Approved" },
  { id: "VEN-003", name: "Northgate Metals", category: "Materials", products: "Structural Steel", performance: "A", reliability: "High", pOs: 5, totalSpend: 215_000_000, contact: "Ms. Ngozi Peters", status: "Approved" },
  { id: "VEN-004", name: "Lafarge Africa", category: "Materials", products: "Cement", performance: "A", reliability: "Very High", pOs: 24, totalSpend: 1_240_000_000, contact: "Key Accounts", status: "Preferred" },
  { id: "VEN-005", name: "FastTrack Logistics", category: "Services", products: "Transport & Haulage", performance: "B", reliability: "Medium", pOs: 18, totalSpend: 178_000_000, contact: "Mr. Efosa", status: "Approved" },
  { id: "VEN-006", name: "Apex Electrical", category: "Subcontractor", products: "Electrical Works", performance: "B+", reliability: "High", pOs: 3, totalSpend: 95_000_000, contact: "Arc. Maikafi", status: "Approved" },
];

export function ClientsVendors() {
  const [view, setView] = useState<"clients" | "vendors">("clients");
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

  return (
    <div className="animate-in">
      <ScreenHeader
        title="Clients & Vendors"
        desc="Master records — one record per client or vendor, referenced across every project, contract, invoice and correspondence."
      >
        <button className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> Add Record
        </button>
      </ScreenHeader>

      {/* Toggle */}
      <div className="mb-4 flex gap-1 rounded-[var(--radius)] border border-border bg-panel p-1 w-fit">
        {(["clients", "vendors"] as const).map((v) => (
          <button
            key={v}
            onClick={() => { setView(v); setSelectedClient(null); }}
            className={`rounded px-4 py-1.5 text-xs font-semibold transition ${view === v ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {v === "clients" ? `Clients (${clients.length})` : `Vendors (${vendors.length})`}
          </button>
        ))}
      </div>

      {view === "clients" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Client list */}
          <div className="space-y-2 lg:col-span-1">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c)}
                className={`w-full rounded-[var(--radius)] border p-3 text-left transition ${selectedClient?.id === c.id ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:border-primary/20"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                      {c.short}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.type}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                    c.status === "Active" ? "bg-healthy-bg text-healthy" :
                    c.status === "Tender" ? "bg-primary/10 text-primary" :
                    "bg-panel text-muted-foreground"
                  }`}>{c.status}</span>
                </div>
                {c.outstanding > 0 && (
                  <p className="mt-1.5 text-[10px] font-semibold text-critical">₦{(c.outstanding / 1_000_000).toFixed(0)}M outstanding</p>
                )}
              </button>
            ))}
          </div>

          {/* Client detail */}
          <div className="lg:col-span-2">
            {selectedClient ? (
              <div className="space-y-3">
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="font-mono text-[10px] text-muted-foreground">{selectedClient.id}</span>
                      <h2 className="font-display text-lg font-bold">{selectedClient.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedClient.type}</p>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${selectedClient.status === "Active" ? "bg-healthy-bg text-healthy" : "bg-panel text-muted-foreground"}`}>
                      {selectedClient.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
                    {[
                      { l: "Projects", v: selectedClient.projects.toString() },
                      { l: "Active Contracts", v: selectedClient.activeContracts.toString() },
                      { l: "Total Contract Value", v: naira(selectedClient.totalValue) },
                      { l: "Outstanding Receivable", v: naira(selectedClient.outstanding), tone: selectedClient.outstanding > 0 ? "text-critical" : "text-foreground" },
                    ].map((s) => (
                      <div key={s.l} className="rounded border border-border p-3">
                        <p className="text-[10px] text-muted-foreground">{s.l}</p>
                        <p className={`mt-1 font-display text-lg font-bold tabular-nums ${(s as any).tone ?? "text-foreground"}`}>{s.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <InfoRow label="Primary Contact" value={selectedClient.contact} />
                    <InfoRow label="Phone" value={selectedClient.phone} />
                  </div>
                </Card>

                <Card>
                  <SectionHead title="Projects" hint="Project Context" />
                  {projects.filter((p) => p.client === selectedClient.name).length > 0 ? (
                    <ul className="divide-y divide-border">
                      {projects.filter((p) => p.client === selectedClient.name).map((p) => (
                        <li key={p.code}>
                          <div className="flex w-full items-center gap-3 px-4 py-3 hover:bg-panel transition">
                            <HealthDot h={p.health} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-mono text-[10px] font-bold tracking-wide rounded bg-primary/10 px-2 py-0.5 text-primary shrink-0">
                                  {p.code}
                                </span>
                                <CompanyTag company={p.company} />
                              </div>
                              <p className="text-sm font-semibold truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{naira(p.contractValue)} · {p.phase}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">No projects currently linked to this client.</p>
                  )}
                </Card>
              </div>
            ) : (
              <Card className="flex h-64 items-center justify-center text-center">
                <div>
                  <Building2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" strokeWidth={1.4} />
                  <p className="font-semibold">Select a client</p>
                  <p className="mt-1 text-sm text-muted-foreground">Click any client to view their full record.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {view === "vendors" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { l: "Approved Vendors", v: vendors.filter((v) => v.status === "Approved" || v.status === "Preferred").length.toString() },
              { l: "Preferred Vendors", v: vendors.filter((v) => v.status === "Preferred").length.toString() },
              { l: "Total POs Issued", v: vendors.reduce((a, v) => a + v.pOs, 0).toString() },
              { l: "Total Spend (FY26)", v: naira(vendors.reduce((a, v) => a + v.totalSpend, 0)) },
            ].map((s) => (
              <Card key={s.l} className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</p>
                <p className="mt-2 font-display text-2xl font-bold tabular-nums">{s.v}</p>
              </Card>
            ))}
          </div>

          <Card>
            <SectionHead title="Vendor Register" hint="Approved supplier database" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    {["ID", "Vendor", "Category", "Products / Services", "Performance", "Reliability", "POs", "Total Spend", "Status"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0 hover:bg-panel">
                      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{v.id}</td>
                      <td className="px-4 py-2.5">
                        <p className="font-semibold">{v.name}</p>
                        <p className="text-[10px] text-muted-foreground">{v.contact}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="rounded bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{v.category}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{v.products}</td>
                      <td className="px-4 py-2.5">
                        <span className={`font-bold ${v.performance === "A" ? "text-healthy" : "text-attention"}`}>{v.performance}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{v.reliability}</td>
                      <td className="px-4 py-2.5 font-mono text-sm">{v.pOs}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-sm">{naira(v.totalSpend)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${v.status === "Preferred" ? "bg-primary text-primary-foreground" : "bg-healthy-bg text-healthy"}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
