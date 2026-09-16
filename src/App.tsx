import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Command,
  FileBadge,
  FileText,
  FolderOpen,
  GitBranch,
  Globe,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Monitor,
  Moon,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sun,
  TrendingUp,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { navBadges, notifications as notificationsData, quickActions, searchIndex, type Company, type NotificationItem, type UserPersona } from "./data";
import { WelcomePage, LoginPage } from "./auth";
import {
  ActionCentre,
  Approvals,
  AuditScreen,
  ClientPortal,
  CommandCentre,
  ContractRegister,
  Documents,
  FinanceDashboard,
  ICTScreen,
  Instructions,
  InvoicesScreen,
  MyWeek,
  MyWork,
  PaymentCerts,
  Portfolio,
  Procurement,
  ProjectControlRoom,
  Variations,
} from "./screens";
import { RoleDashboard, ChairmanDashboard, GEDDashboard, EDDashboard, GGMPDashboard } from "./role-dashboards";
import People from "./people";
import { MyHR, BusinessDev, MeetingsDecisions, ClientsVendors } from "./modules";
import { ToastProvider } from "./overlays";
import { InvoiceProvider } from "./invoice-store";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="max-w-md rounded-[var(--radius)] border border-critical/30 bg-critical-bg p-6 text-center">
            <p className="font-display text-lg font-bold text-critical">Something went wrong</p>
            <p className="mt-2 text-sm text-critical/80">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-4 rounded bg-critical px-4 py-2 text-sm font-semibold text-white hover:bg-critical/90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type AppPhase = "welcome" | "login" | "app";

type Screen =
  | "command"
  | "mywork"
  | "action"
  | "myhr"
  | "portfolio"
  | "project"
  | "procurement"
  | "business-dev"
  | "approvals"
  | "documents"
  | "meetings"
  | "instructions"
  | "role-home"
  | "people"
  | "clients"
  | "audit"
  | "invoices"
  | "variations"
  | "payment-certs"
  | "client-portal"
  | "ict"
  | "finance"
  | "contracts"
  | "my-week";

/* ── Nav definition ── */
const ALL_NAV: { group: string; items: { id: Screen; label: string; icon: any }[] }[] = [
  {
    group: "Personal",
    items: [
      { id: "role-home", label: "My Dashboard", icon: LayoutDashboard },
      { id: "my-week" as Screen, label: "My Week", icon: CalendarDays },
      { id: "mywork", label: "My Work", icon: LayoutDashboard },
      { id: "action", label: "Action Centre", icon: Inbox },
      { id: "myhr", label: "My HR", icon: HeartHandshake },
    ],
  },
  {
    group: "Executive",
    items: [{ id: "command", label: "Command Centre", icon: ShieldCheck }],
  },
  {
    group: "Delivery",
    items: [
      { id: "portfolio", label: "Project Portfolio", icon: FolderOpen },
      { id: "procurement", label: "Procurement", icon: ShoppingCart },
      { id: "variations", label: "Variations", icon: GitBranch },
      { id: "payment-certs", label: "Payment Certs", icon: FileBadge },
      { id: "business-dev", label: "Business Development", icon: TrendingUp },
    ],
  },
  {
    group: "Control",
    items: [
      { id: "approvals", label: "Approval Centre", icon: Check },
      { id: "documents", label: "Documents", icon: FileText },
      { id: "invoices", label: "Invoices", icon: Receipt },
      { id: "meetings", label: "Meetings & Decisions", icon: BookOpen },
      { id: "audit", label: "Audit & Compliance", icon: ClipboardCheck },
      { id: "client-portal", label: "Client Portal", icon: Globe },
    ],
  },
  {
    group: "Finance",
    items: [
      { id: "finance", label: "Finance Dashboard", icon: Receipt },
      { id: "contracts", label: "Contract Register", icon: FileBadge },
      { id: "ict", label: "ICT & Systems", icon: Monitor },
    ],
  },
  {
    group: "Collaboration",
    items: [
      { id: "instructions", label: "Instructions", icon: Mail },
    ],
  },
  {
    group: "People",
    items: [
      { id: "people", label: "People & Teams", icon: Users },
      { id: "clients", label: "Clients & Vendors", icon: Building2 },
    ],
  },
];

const breadcrumbs: Record<Screen, string> = {
  command: "Executive › Command Centre",
  mywork: "Personal › My Work",
  action: "Personal › Action Centre",
  myhr: "Personal › My HR",
  portfolio: "Delivery › Project Portfolio",
  project: "Delivery › Portfolio › Project Control Room",
  procurement: "Delivery › Procurement",
  variations: "Delivery › Variation Management",
  "payment-certs": "Delivery › Payment Certificates",
  "business-dev": "Delivery › Business Development",
  approvals: "Control › Approval Centre",
  documents: "Control › Documents",
  meetings: "Control › Meetings & Decisions",
  audit: "Control › Audit & Compliance",
  invoices: "Finance › Invoices",
  "client-portal": "Control › Client Portal",
  instructions: "Collaboration › Instructions",
  "role-home": "Home › Dashboard",
  "my-week": "Personal › My Week",
  people: "People › Staff Directory",
  clients: "People › Clients & Vendors",
  finance: "Finance › Finance Dashboard",
  contracts: "Finance › Contract Register",
  ict: "Corporate › ICT & Systems",
};

const crumbNav: Record<string, string> = {
  "Project Portfolio": "portfolio",
  "Portfolio": "portfolio",
  "Command Centre": "command",
  "Action Centre": "action",
  "My HR": "myhr",
  "Procurement": "procurement",
  "Approval Centre": "approvals",
  "Documents": "documents",
  "Invoices": "invoices",
  "Meetings & Decisions": "meetings",
  "Audit & Compliance": "audit",
  "Instructions": "instructions",
  "People & Teams": "people",
  "Clients & Vendors": "clients",
  "Business Development": "business-dev",
};

/* Every screen the main content area knows how to render. Used as a
   safety net so an unexpected `screen` value can never leave the panel
   blank. */
const RENDERABLE_SCREENS = new Set<Screen>([
  "command", "mywork", "action", "myhr", "portfolio", "project",
  "procurement", "business-dev", "approvals", "documents", "invoices",
  "meetings", "audit", "instructions", "role-home", "people", "clients",
  "variations", "payment-certs", "client-portal",
  "ict", "finance", "contracts", "my-week",
]);

const companies: Company[] = ["USV + CANONIC", "USV", "CANONIC"];

const companyColor: Record<Company, string> = {
  USV: "#1A3D8F",
  CANONIC: "#3580B5",
  "USV + CANONIC": "#1A3D8F",
};

/* ── Build nav groups for a given user ── */
function buildNav(
  persona: UserPersona | null,
  allNav: typeof ALL_NAV
): typeof ALL_NAV {
  if (!persona) return allNav;
  const allowed = new Set(persona.navItems);
  const isExecutive = ["chairman", "gmd", "ged", "ed", "ggmp"].includes(persona.role);

  return allNav
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        if (isExecutive && it.id === "role-home") return false;
        if (!isExecutive && it.id === "mywork") return false;
        return allowed.has(it.id);
      }),
    }))
    .filter((g) => g.items.length > 0);
}

/* ─────────────────────── DEMO SESSION ─────────────────────── */
const DEMO_RESET_MS = 24 * 60 * 60 * 1000; // 24-hour stakeholder review session
const LIVE_INTERVAL_MS = 3 * 60 * 1000; // inject live activity every 3 minutes

const LIVE_NOTIF_POOL: Partial<Record<string, { title: string; type: string; urgent: boolean }[]>> = {
  chairman: [
    { title: "Board resolution BRD-2026-014 signed and archived", type: "report",      urgent: false },
    { title: "Q3 audit summary ready for Chairman review",          type: "report",      urgent: false },
  ],
  gmd: [
    { title: "GED Projects briefing note — Abuja Phase II uploaded",         type: "report",      urgent: false },
    { title: "Client escalation: Federal Housing Authority response needed",  type: "approval",    urgent: true  },
  ],
  ged: [
    { title: "Variation VO-DRAFT-004 approved by PM — awaiting your sign-off", type: "approval", urgent: true  },
    { title: "New site report SR-PRJ001-084 submitted for review",               type: "report",   urgent: false },
  ],
  ed: [
    { title: "PAYE schedule submitted to FIRS — confirmation received",      type: "payment",     urgent: false },
    { title: "ICT capital request pending your approval",                    type: "approval",    urgent: true  },
  ],
  ggmp: [
    { title: "Vendor evaluation report ready: curtain wall contract",        type: "report",      urgent: false },
    { title: "Fuel delivery GRN-012 confirmed — stock replenished",          type: "approval",    urgent: false },
  ],
  pm: [
    { title: "Block C pour scheduled for 08 Sep — readiness confirmed",      type: "report",      urgent: false },
    { title: "Subcontractor claim SC-PRJ001-007 filed — review required",    type: "approval",    urgent: true  },
  ],
  architect: [
    { title: "Client approved DWG-ENM-042 Rev A — proceed to Rev B",        type: "approval",    urgent: false },
    { title: "RFI-ENM-008 received from site — response required today",     type: "instruction", urgent: true  },
  ],
  engineer: [
    { title: "TQ-023 response issued by Head Engineer — download available", type: "report",      urgent: false },
    { title: "Concrete cube test results: CALC-ENG-004 all cubes passed",    type: "report",      urgent: false },
  ],
  qs: [
    { title: "Val. Certificate VAL-PRJ021-004 approved by Finance Manager",  type: "payment",     urgent: false },
    { title: "BOQ-PRJ001-007 revision comments returned by Head QS",         type: "approval",    urgent: true  },
  ],
  site: [
    { title: "Aggregate delivery confirmed: 40T received on site",           type: "report",      urgent: false },
    { title: "Safety inspection scheduled for 08 Sep — prepare checklist",   type: "instruction", urgent: false },
  ],
  procurement: [
    { title: "Vendor response received: RFQ-USV-2026-010 (3/3 vendors)",     type: "report",      urgent: false },
    { title: "PO-USV-2026-0068 approved — issue to supplier",                type: "approval",    urgent: true  },
  ],
  accountant: [
    { title: "Payroll batch processed — PAYE returns filed",                 type: "payment",     urgent: false },
    { title: "VOUCHER-443 awaiting your counter-signature",                  type: "approval",    urgent: true  },
  ],
  "admin": [
    { title: "Onboarding pack signed — new hire starts Monday",              type: "instruction", urgent: false },
    { title: "3 leave applications pending your review",                     type: "approval",    urgent: true  },
  ],
};

function useDemoSession(
  activeRole: string | undefined,
  onInjectNotif: (n: NotificationItem) => void,
) {
  const [secondsLeft, setSecondsLeft] = useState(() => Math.floor(DEMO_RESET_MS / 1000));
  const poolIndexRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.location.reload();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const inject = useCallback(() => {
    const role = activeRole ?? "gmd";
    const pool = LIVE_NOTIF_POOL[role] ?? LIVE_NOTIF_POOL["gmd"] ?? [];
    if (!pool.length) return;
    const idx = (poolIndexRef.current[role] ?? 0) % pool.length;
    poolIndexRef.current[role] = idx + 1;
    const src = pool[idx];
    onInjectNotif({
      id: `live-${Date.now()}`,
      title: src.title,
      time: "Just now",
      type: src.type as NotificationItem["type"],
      urgent: src.urgent,
      read: false,
    });
  }, [activeRole, onInjectNotif]);

  useEffect(() => {
    if (!activeRole) return;
    const t = setInterval(inject, LIVE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [activeRole, inject]);

  const hrs = Math.floor(secondsLeft / 3600).toString().padStart(2, "0");
  const mins = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

export default function App() {
  return <ToastProvider><InvoiceProvider><AppInner /></InvoiceProvider></ToastProvider>;
}

function AppInner() {
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [activeUser, setActiveUser] = useState<UserPersona | null>(null);
  const [screen, setScreen] = useState<Screen>("mywork");
  const [projectCode, setProjectCode] = useState("PRJ-USV-2026-0015");
  const [company, setCompany] = useState<Company>("USV + CANONIC");
  const [companyOpen, setCompanyOpen] = useState(false);
  const [palette, setPalette] = useState<null | "search" | "quick">(null);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("nexus-dark") === "1");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<NotificationItem[]>(() => notificationsData);
  const [recentScreens, setRecentScreens] = useState<Array<{screen: string; label: string}>>([]);
  const [online, setOnline] = useState(navigator.onLine);
  const scrollMemory = useRef<Record<string, number>>({});
  const mainRef = useRef<HTMLElement>(null);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("nexus-dark", next ? "1" : "0");
  };

  const nav = (s: string, code?: string) => {
    if (code) setProjectCode(code);
    setScreen(s as Screen);
    setCompanyOpen(false);
    setTimeout(() => {
      if (mainRef.current) mainRef.current.scrollTop = scrollMemory.current[s] ?? 0;
    }, 50);
  };

  const handleLogin = (persona: UserPersona) => {
    setActiveUser(persona);
    setScreen(persona.defaultScreen as Screen);
    setCompany(persona.defaultCompany);
    setPhase("app");
  };

  const handleSignOut = () => {
    setPhase("welcome");
    setActiveUser(null);
    setScreen("mywork");
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPalette("search");
      }
      if (e.key === "Escape") { setPalette(null); setNotifOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (phase !== "app") return;
    const label = breadcrumbs[screen]?.split(" › ").at(-1) ?? screen;
    setRecentScreens(prev => {
      const next = [{ screen, label }, ...prev.filter(r => r.screen !== screen)].slice(0, 5);
      return next;
    });
  }, [screen, phase]);

  const injectNotif = useCallback((n: NotificationItem) => {
    setNotifItems((prev) => [n, ...prev]);
  }, []);

  const demoCountdown = useDemoSession(
    phase === "app" ? (activeUser?.role ?? undefined) : undefined,
    injectNotif,
  );

  const visibleNotifs = notifItems.filter((n) => !n.roles || !activeUser || n.roles.includes(activeUser.role));
  const unreadCount = visibleNotifs.filter((n) => !n.read).length;

  /* ── Pre-auth phases ── */
  if (phase === "welcome") {
    return (
      <div className="h-full">
        <WelcomePage onEnter={() => setPhase("login")} />
      </div>
    );
  }

  if (phase === "login") {
    return (
      <div className="h-full">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  /* ── Post-auth app shell ── */
  const results = searchIndex.filter(
    (r) =>
      r.label.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase())
  );

  const navGroups = buildNav(activeUser, ALL_NAV);
  const isExecutive = !activeUser || ["chairman", "gmd", "ged", "ed", "ggmp"].includes(activeUser.role);

  const displayUser = activeUser ?? {
    name: "Engr. Fatima Aliyu Dantata",
    initials: "AO",
    title: "GED: Projects",
    authority: "EXECUTIVE",
    company: "USV + CANONIC" as Company,
    department: "Group Projects",
  };

  const userColor = activeUser ? companyColor[activeUser.company] : "#1A3D8F";

  /* ── Sidebar nav item renderer (dark surface) ── */
  function SidebarItem({
    id,
    label,
    icon: Icon,
    active,
    accentColor = "#5BA3D0",
    activeTextColor = "#9ECDE8",
    activeBg = "rgba(91,163,208,0.14)",
    onClick,
  }: {
    id: Screen;
    label: string;
    icon: any;
    active: boolean;
    accentColor?: string;
    activeTextColor?: string;
    activeBg?: string;
    onClick: () => void;
  }) {
    return (
      <button
        key={id}
        onClick={onClick}
        className="group relative flex w-full items-center gap-2.5 rounded-[5px] px-2.5 py-[7px] text-[13px] font-medium leading-none transition-colors"
        style={
          active
            ? { background: activeBg, color: activeTextColor }
            : undefined
        }
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.color = "#90B4D8";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "";
            (e.currentTarget as HTMLElement).style.color = "";
          }
        }}
      >
        {active && (
          <span
            className="absolute inset-y-[3px] left-0 w-[3px] rounded-r-full"
            style={{ background: accentColor }}
          />
        )}
        <Icon
          className="h-4 w-4 shrink-0"
          strokeWidth={1.7}
          style={{ color: active ? accentColor : "#3E5D82" }}
        />
        <span className="truncate" style={!active ? { color: "#6080AA" } : undefined}>
          {label}
        </span>
        {navBadges[id] && (
          <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 font-mono text-[9px] font-bold text-white">
            {navBadges[id]}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`relative h-screen overflow-hidden bg-background${darkMode ? " dark" : ""}`}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══════════════════════ SIDEBAR ═══════════════════════ */}
      <aside
        className={`nexus-sidebar fixed inset-y-0 left-0 z-40 flex h-full w-[248px] flex-col transition-transform duration-200 ease-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0B1D3F" }}
      >
        {/* ── Logo / wordmark ── */}
        <div
          className="flex items-center gap-3 px-4 py-[15px]"
          style={{ borderBottom: "1px solid #1b2a3a" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] font-display text-[14px] font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #3D72D4 0%, #0B2551 100%)",
              boxShadow: "0 2px 8px rgba(61,114,212,0.4)",
            }}
          >
            N
          </div>
          <div className="min-w-0">
            <p className="font-display text-[13px] font-bold tracking-tight text-white">
              NEXUS
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.12em]"
              style={{ color: "#2D4C7A" }}
            >
              Enterprise Platform
            </p>
          </div>
        </div>

        {/* ── Company context pill ── */}
        {activeUser && (
          <div
            className="mx-3 mt-2.5 rounded-[6px] px-3 py-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1b2a3a" }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: userColor }}
              />
              <span
                className="truncate font-mono text-[10px] font-bold uppercase tracking-wider"
                style={{ color: userColor }}
              >
                {activeUser.company === "USV + CANONIC" ? "GROUP VIEW" : activeUser.company}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px]" style={{ color: "#2D4C7A" }}>
              {activeUser.department}
            </p>
          </div>
        )}

        {/* ── Navigation ── */}
        {isExecutive ? (
          <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3">

            {/* Group Overview — items filtered by this exec's navItems */}
            <div>
              <p
                className="mb-1 px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "#1E3A6A" }}
              >
                {activeUser?.role === "chairman" ? "Board Overview" : activeUser?.role === "ged" ? "Projects Command" : activeUser?.role === "ed" ? "Corporate Services" : activeUser?.role === "ggmp" ? "Operations" : "Group Overview"}
              </p>
              <div className="space-y-0.5">
                {(
                  [
                    { id: "command" as Screen, label: "Command Centre", icon: ShieldCheck },
                    { id: "mywork" as Screen, label: "My Work", icon: LayoutDashboard },
                    { id: "action" as Screen, label: "Action Centre", icon: Inbox },
                    { id: "myhr" as Screen, label: "My HR", icon: HeartHandshake },
                    { id: "approvals" as Screen, label: "Approval Centre", icon: Check },
                    { id: "meetings" as Screen, label: "Meetings & Decisions", icon: Calendar },
                    { id: "audit" as Screen, label: "Audit & Compliance", icon: ClipboardCheck },
                    { id: "instructions" as Screen, label: "Instructions", icon: Mail },
                    { id: "invoices" as Screen, label: "Invoices", icon: Receipt },
                    { id: "variations" as Screen, label: "Variations", icon: GitBranch },
                    { id: "payment-certs" as Screen, label: "Payment Certs", icon: FileBadge },
                    { id: "business-dev" as Screen, label: "Business Development", icon: TrendingUp },
                    { id: "people" as Screen, label: "People & Teams", icon: Users },
                    { id: "clients" as Screen, label: "Clients & Vendors", icon: Building2 },
                    { id: "client-portal" as Screen, label: "Client Portal", icon: Globe },
                  ] as const
                )
                  .filter((it) => !activeUser || (activeUser.navItems as string[]).includes(it.id))
                  .map((it) => (
                  <SidebarItem
                    key={it.id}
                    id={it.id}
                    label={it.label}
                    icon={it.icon}
                    active={screen === it.id}
                    onClick={() => { nav(it.id); setSidebarOpen(false); }}
                  />
                ))}
              </div>
            </div>

            {/* USV section — only for roles that have portfolio access */}
            {(!activeUser || (activeUser.navItems as string[]).includes("portfolio")) && (
              <div>
                <div className="mb-1.5 flex items-center gap-2 px-2.5">
                  <div className="h-px flex-1" style={{ background: "#152B55" }} />
                  <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: "#4A8FE0" }}>USV</span>
                  <div className="h-px flex-1" style={{ background: "#152B55" }} />
                </div>
                <div className="space-y-0.5">
                  {(
                    [
                      { id: "portfolio" as Screen, label: "Projects", icon: FolderOpen },
                      ...((activeUser?.navItems as string[] ?? []).includes("procurement") ? [{ id: "procurement" as Screen, label: "Procurement", icon: ShoppingCart }] : []),
                      { id: "documents" as Screen, label: "Documents", icon: FileText },
                    ]
                  ).map((it) => {
                    const screenMatch = screen === it.id || (it.id === "portfolio" && screen === "project");
                    const active = screenMatch && company === "USV";
                    return (
                      <SidebarItem
                        key={`usv-${it.id}`}
                        id={it.id}
                        label={it.label}
                        icon={it.icon}
                        active={active}
                        accentColor="#4A8FE0"
                        activeTextColor="#9ECDE8"
                        activeBg="rgba(26,61,143,0.18)"
                        onClick={() => { setCompany("USV"); nav(it.id); setSidebarOpen(false); }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* CANONIC section — only for roles with portfolio access */}
            {(!activeUser || (activeUser.navItems as string[]).includes("portfolio")) && (
              <div>
                <div className="mb-1.5 flex items-center gap-2 px-2.5">
                  <div className="h-px flex-1" style={{ background: "#152B55" }} />
                  <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: "#5BA3D0" }}>CANONIC</span>
                  <div className="h-px flex-1" style={{ background: "#152B55" }} />
                </div>
                <div className="space-y-0.5">
                  {(
                    [
                      { id: "portfolio" as Screen, label: "Projects", icon: FolderOpen },
                      { id: "documents" as Screen, label: "Documents", icon: FileText },
                    ] as const
                  ).map((it) => {
                    const screenMatch = screen === it.id || (it.id === "portfolio" && screen === "project");
                    const active = screenMatch && company === "CANONIC";
                    return (
                      <SidebarItem
                        key={`canonic-${it.id}`}
                        id={it.id}
                        label={it.label}
                        icon={it.icon}
                        active={active}
                        accentColor="#5BA3D0"
                        activeTextColor="#A8D8F0"
                        activeBg="rgba(91,163,208,0.15)"
                        onClick={() => { setCompany("CANONIC"); nav(it.id); setSidebarOpen(false); }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </nav>
        ) : (
          <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
            {navGroups.map((g) => (
              <div key={g.group}>
                <p
                  className="mb-1 px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "#1E3A6A" }}
                >
                  {g.group}
                </p>
                <div className="space-y-0.5">
                  {g.items.map((it) => {
                    const active =
                      screen === it.id ||
                      (it.id === "portfolio" && screen === "project");
                    return (
                      <SidebarItem
                        key={it.id}
                        id={it.id}
                        label={it.label}
                        icon={it.icon}
                        active={active}
                        onClick={() => { nav(it.id); setSidebarOpen(false); }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        )}

        {/* ── User footer ── */}
        <div
          className="px-3 py-3"
          style={{ borderTop: "1px solid #1b2a3a", background: "#071228" }}
        >
          <div className="flex items-center gap-2.5 rounded-[6px] px-2 py-1.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: userColor }}
            >
              {displayUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold" style={{ color: "#C2D8F5" }}>
                {displayUser.name}
              </p>
              <p className="truncate text-[10px]" style={{ color: "#2D4C7A" }}>
                {displayUser.title}
              </p>
            </div>
            <span
              className="shrink-0 rounded-[4px] px-1.5 py-[3px] font-mono text-[9px] font-bold uppercase tracking-wide"
              style={{ background: "rgba(255,255,255,0.07)", color: "#3E5D82" }}
            >
              {displayUser.authority}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-2 rounded-[5px] px-2.5 py-1.5 text-[12px] transition-colors"
            style={{ color: "#1E3A6A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "#5880B8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "#1E3A6A";
            }}
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
            Sign out
          </button>

          {(!activeUser || ["chairman","gmd","ged","ed","ggmp"].includes(activeUser.role)) && (
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-2 rounded-[5px] px-2.5 py-1.5 text-[12px] transition-colors"
              style={{ color: "#1E3A6A" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.color = "#5880B8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "";
                (e.currentTarget as HTMLElement).style.color = "#1E3A6A";
              }}
            >
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
              Platform Docs
            </a>
          )}

        </div>
      </aside>

      {/* ═══════════════════════ MAIN COLUMN ═══════════════════════ */}
      <div className="flex h-screen flex-col overflow-hidden md:ml-[248px]">

        {/* ── Topbar ── */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card px-3 md:px-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] text-muted-foreground hover:bg-muted md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Company switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCompanyOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-[var(--radius)] border border-border bg-panel px-2.5 py-1.5 text-[13px] font-semibold hover:border-border-strong hover:bg-secondary"
            >
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">
                {company === "USV + CANONIC" ? "Group" : company}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {companyOpen && (
              <div className="animate-scalein absolute left-0 top-full z-20 mt-1.5 w-48 overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-lg">
                <p className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  View Context
                </p>
                {companies.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCompany(c); setCompanyOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-[13px] hover:bg-panel ${
                      company === c ? "font-semibold text-primary" : "text-foreground"
                    }`}
                  >
                    {c === "USV + CANONIC" ? "Group View" : c}
                    {company === c && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global search */}
          <button
            onClick={() => setPalette("search")}
            className="flex flex-1 items-center gap-2 rounded-[var(--radius)] border border-border bg-muted px-3 py-1.5 text-[13px] text-muted-foreground hover:border-border-strong hover:bg-secondary"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden truncate sm:inline">
              Search projects, contracts, staff, POs…
            </span>
            <span className="sm:hidden">Search…</span>
            <span className="ml-auto hidden items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
              <Command className="h-2.5 w-2.5" />K
            </span>
          </button>

          {/* Quick action */}
          <button
            onClick={() => setPalette("quick")}
            className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius)] bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="shrink-0 rounded-[var(--radius)] border border-border p-[7px] text-muted-foreground hover:bg-panel hover:text-foreground"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Demo countdown pill */}
          {phase === "app" && (
            <div
              className="hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 sm:flex"
              style={{ borderColor: "var(--border)", background: "var(--panel)" }}
              title="24-hour stakeholder review session. All activity is simulated — changes reset automatically after 24 hours."
            >
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                {demoCountdown}
              </span>
              <span className="text-[9px] text-muted-foreground/60 font-medium hidden lg:inline">demo</span>
            </div>
          )}

          {/* Notifications */}
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative shrink-0 rounded-[var(--radius)] border border-border p-[7px] text-muted-foreground hover:bg-panel hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 font-mono text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        {/* ── Context bar (breadcrumb) ── */}
        <div className="flex shrink-0 items-center justify-between gap-2 overflow-hidden border-b border-border/60 bg-panel/80 px-3 py-1 md:px-5">
          <div className="flex min-w-0 items-center gap-1 font-mono text-[10px] tracking-wide text-muted-foreground/70 overflow-hidden">
            {(() => {
              const crumb = breadcrumbs[screen] ?? screen;
              const parts = crumb.split(" › ");
              return parts.map((part, i) => (
                <span key={i} className="flex shrink-0 items-center gap-1">
                  {i > 0 && <span className="opacity-50">›</span>}
                  {i === 1 && parts.length === 3 && crumbNav[part] ? (
                    <button onClick={() => nav(crumbNav[part])} className="hover:text-foreground hover:underline transition-colors truncate max-w-[100px] sm:max-w-none">{part}</button>
                  ) : i === parts.length - 1 ? (
                    <span className="text-foreground/80 truncate max-w-[140px] sm:max-w-none">{part}</span>
                  ) : (
                    <span className="hidden sm:inline">{part}</span>
                  )}
                </span>
              ));
            })()}
          </div>
          <p className="shrink-0 text-[11px] text-muted-foreground">
            <span className="hidden sm:inline font-medium text-foreground/80">{displayUser.title}</span>
            <span className="hidden sm:inline">{"  ·  "}</span>
            <span className="font-semibold" style={{ color: userColor }}>
              {displayUser.company}
            </span>
          </p>
        </div>

        {/* ── Offline banner ── */}
        {!online && (
          <div className="flex items-center gap-2 bg-attention px-4 py-2 text-[12px] font-semibold text-white">
            <Wifi className="h-3.5 w-3.5" /> No internet connection, working offline
          </div>
        )}

        {/* ── Main content ── */}
        <main
          ref={mainRef}
          onScroll={() => { if (mainRef.current) scrollMemory.current[screen] = mainRef.current.scrollTop; }}
          className="flex-1 overflow-y-auto px-3 py-4 pb-20 sm:px-4 sm:py-5 sm:pb-20 md:px-6 md:py-6 md:pb-6"
        >
          <ErrorBoundary>
            {/* Safety net: guarantee the content area is never blank, even
                if `screen` lands on a value with no matching branch or a
                role-scoped screen renders before `activeUser` is set. */}
            {!RENDERABLE_SCREENS.has(screen) ||
            ((screen === "role-home" || screen === "people") && !activeUser) ? (
              <div className="flex h-full items-center justify-center p-8">
                <div className="max-w-sm rounded-[var(--radius)] border border-border bg-card p-6 text-center">
                  <p className="font-display text-base font-bold text-foreground">
                    Nothing to show here yet
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This view isn&rsquo;t available for your current role or context.
                    Pick another section from the sidebar.
                  </p>
                  <button
                    onClick={() => nav(activeUser?.defaultScreen ?? "command")}
                    className="mt-4 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Go to my dashboard
                  </button>
                </div>
              </div>
            ) : null}
            <div key={screen} className="animate-in fade-in duration-150">
              {screen === "command" && (
                activeUser?.role === "chairman" ? <ChairmanDashboard nav={nav} /> :
                activeUser?.role === "ged"      ? <GEDDashboard nav={nav} /> :
                activeUser?.role === "ed"       ? <EDDashboard nav={nav} /> :
                activeUser?.role === "ggmp"     ? <GGMPDashboard nav={nav} /> :
                <CommandCentre nav={nav} />
              )}
              {screen === "mywork" && <MyWork nav={nav} userRole={activeUser?.role} />}
              {screen === "action" && <ActionCentre userRole={activeUser?.role} />}
              {screen === "myhr" && activeUser && <MyHR persona={activeUser} />}
              {screen === "portfolio" && <Portfolio nav={nav} />}
              {screen === "project" && (
                <ProjectControlRoom code={projectCode} nav={nav} />
              )}
              {screen === "procurement" && <Procurement />}
              {screen === "business-dev" && <BusinessDev nav={nav} />}
              {screen === "approvals" && activeUser && <Approvals persona={activeUser} />}
              {screen === "documents" && <Documents userRole={activeUser?.role} />}
              {screen === "invoices" && <InvoicesScreen nav={nav} />}
              {screen === "meetings" && <MeetingsDecisions />}
              {screen === "audit" && <AuditScreen />}
              {screen === "instructions" && <Instructions viewerRole={activeUser?.role} />}
              {screen === "role-home" && activeUser && (
                <RoleDashboard role={activeUser.role} nav={nav} personaName={activeUser.name} personaTitle={activeUser.title} />
              )}
              {screen === "my-week" && activeUser && <MyWeek nav={nav} userRole={activeUser.role} />}
              {screen === "people" && activeUser && (
                <People viewerRole={activeUser.role} />
              )}
              {screen === "clients" && <ClientsVendors />}
              {screen === "variations" && <Variations nav={nav} />}
              {screen === "payment-certs" && <PaymentCerts nav={nav} />}
              {screen === "client-portal" && <ClientPortal nav={nav} />}
              {screen === "ict" && <ICTScreen persona={activeUser!} />}
              {screen === "finance" && <FinanceDashboard persona={activeUser!} />}
              {screen === "contracts" && <ContractRegister persona={activeUser!} />}
            </div>
          </ErrorBoundary>
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav aria-label="mobile-nav" className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-card md:hidden">
        {[
          { id: "role-home", icon: LayoutDashboard, label: "Home" },
          ...(activeUser?.navItems.includes("my-week") ? [{ id: "my-week", icon: CalendarDays, label: "My Week" }] : []),
          { id: "action", icon: Inbox, label: "Actions" },
          { id: "approvals", icon: Check, label: "Approvals" },
          ...(activeUser?.navItems.includes("documents") ? [{ id: "documents", icon: FileText, label: "Documents" }] : []),
          ...(!activeUser?.navItems.includes("my-week") ? [{ id: "command", icon: ShieldCheck, label: "Command" }] : []),
        ].map(item => {
          const isActive = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { nav(item.id); setSidebarOpen(false); }}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-muted-foreground transition"
              style={isActive ? { color: "var(--primary)" } : undefined}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.7} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ═══════════════════════ NOTIFICATION PANEL ═══════════════════════ */}
      {/* Backdrop overlay */}
      {notifOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={() => setNotifOpen(false)}
        />
      )}
      {/* Slide-out panel — always mounted, translates in/out */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-border bg-card shadow-xl transition-transform duration-200 ease-out ${
          notifOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            <p className="font-display text-[14px] font-bold tracking-tight text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 font-mono text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-[11px] font-semibold text-primary hover:underline"
              onClick={() => setNotifItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            >
              Mark all read
            </button>
            <button
              onClick={() => setNotifOpen(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {/* Urgent section */}
          {visibleNotifs.some((n) => n.urgent) && (
            <>
              <div className="px-4 pb-1 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-critical">Urgent</p>
              </div>
              {visibleNotifs.filter((n) => n.urgent).map((n) => (
                <div
                  key={n.id}
                  onClick={() => setNotifItems((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                  className="flex cursor-pointer items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-panel"
                >
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-critical"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] leading-snug ${n.read ? "font-normal text-muted-foreground" : "font-medium text-foreground"}`}>{n.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-[2px] font-mono text-[9px] uppercase tracking-wide text-muted-foreground">{n.type}</span>
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Today section */}
          {visibleNotifs.some((n) => !n.urgent) && (
            <>
              <div className="px-4 pb-1 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Today</p>
              </div>
              {visibleNotifs.filter((n) => !n.urgent).map((n) => (
                <div
                  key={n.id}
                  onClick={() => setNotifItems((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                  className="flex cursor-pointer items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-panel"
                >
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] leading-snug ${n.read ? "font-normal text-muted-foreground" : "font-medium text-foreground"}`}>{n.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-[2px] font-mono text-[9px] uppercase tracking-wide text-muted-foreground">{n.type}</span>
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Panel footer */}
        <div className="border-t border-border px-4 py-3">
          <button
            onClick={() => setNotifItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            className="w-full rounded-[var(--radius)] border border-border py-2 text-[12px] font-semibold text-muted-foreground transition-colors hover:bg-panel hover:text-foreground"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* ═══════════════════════ COMMAND PALETTE ═══════════════════════ */}
      {palette && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-[10vh] backdrop-blur-sm"
          onClick={() => setPalette(null)}
        >
          <div
            className="animate-scalein w-full max-w-[560px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {palette === "search" ? (
              <>
                <div className="flex items-center gap-3 border-b border-border px-4">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search across every record…"
                    className="flex-1 bg-transparent py-3.5 text-[14px] outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => { setPalette(null); setQuery(""); }}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Type filter hint */}
                <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2">
                  {["All", "Project", "Contract", "Staff", "PO"].map((f) => (
                    <button
                      key={f}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                        f === "All"
                          ? "bg-primary/8 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {!query && recentScreens.length > 0 && (
                  <div className="border-b border-border/60 py-1">
                    <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Recent</p>
                    {recentScreens.map(r => (
                      <button key={r.screen} onClick={() => { nav(r.screen); setPalette(null); }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-panel">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-[13px]">{r.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <ul className="max-h-72 overflow-y-auto py-1">
                  {results.length === 0 && (
                    <li className="px-4 py-8 text-center text-[13px] text-muted-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </li>
                  )}
                  {results.map((r) => (
                    <li key={r.label}>
                      <button
                        onClick={() => {
                          nav(r.nav);
                          setPalette(null);
                          setQuery("");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-panel"
                      >
                        <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                          {r.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{r.label}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{r.meta}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground/60">
                  ↑↓ navigate · ↵ open · Esc close
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-border px-4 py-3.5">
                  <p className="font-display text-[13px] font-bold tracking-tight">
                    Quick Actions
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    Context: {company}, pre-filled where possible
                  </p>
                </div>
                <div className="grid max-h-80 grid-cols-2 gap-1.5 overflow-y-auto p-3 sm:grid-cols-3">
                  {quickActions.map((q) => (
                    <button
                      key={q}
                      onClick={() => setPalette(null)}
                      className="flex items-center gap-2 rounded-[var(--radius)] border border-border px-3 py-2.5 text-left text-[12px] font-medium transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      <Plus className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
