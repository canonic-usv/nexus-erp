import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { userPersonas, type UserPersona } from "./data";

const companyColor: Record<string, string> = {
  USV: "#1A3D8F",
  CANONIC: "#3580B5",
  "USV + CANONIC": "#345b8a",
};

/* ─── Welcome Page ─── */
export function WelcomePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden"
      style={{ background: "#0B1F33" }}
    >
      {/* Subtle engineering grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,226,236,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(217,226,236,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Corner accent lines */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-40 w-40 opacity-20"
        style={{
          background: "linear-gradient(135deg, rgba(15,118,110,0.4) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 opacity-20"
        style={{
          background: "linear-gradient(315deg, rgba(15,118,110,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Top bar */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between border-b px-4 py-4 sm:px-8 sm:py-5"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded font-bold text-[13px]"
            style={{ background: "#1A3D8F", color: "#fff", fontFamily: "Archivo, system-ui, sans-serif" }}
          >
            NX
          </div>
          <span
            className="font-mono text-[10px] tracking-[0.12em] uppercase sm:text-[11px] sm:tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <span className="hidden sm:inline">NEXUS ENTERPRISE PLATFORM</span>
            <span className="sm:hidden">NEXUS</span>
          </span>
        </div>
        <span
          className="hidden font-mono text-[11px] sm:block"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          NEXUS v2.6 · Build 2026.09
        </span>
      </div>

      {/* Centre content */}
      <div className="relative z-10 flex w-full flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-20">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
          <div
            className="h-px w-8 sm:w-16"
            style={{ background: "linear-gradient(90deg, transparent, #1A3D8F)" }}
          />
          <span
            className="font-mono text-[9px] tracking-[0.16em] uppercase sm:text-[11px] sm:tracking-[0.22em]"
            style={{ color: "#1A3D8F" }}
          >
            Connected People, Projects and Process
          </span>
          <div
            className="h-px w-8 sm:w-16"
            style={{ background: "linear-gradient(90deg, #1A3D8F, transparent)" }}
          />
        </div>

        {/* Wordmark */}
        <h1
          className="font-display mb-3 text-4xl font-bold leading-none tracking-tight sm:text-6xl"
          style={{ color: "#F1F5F9", fontFamily: "Archivo, system-ui, sans-serif" }}
        >
          NEXUS
        </h1>
        <p className="mb-3 text-base font-light sm:text-xl" style={{ color: "#94A3B8" }}>
          USV Development Services Ltd &amp; Canonic Associates Ltd
        </p>
        <p
          className="max-w-sm text-xs leading-relaxed sm:max-w-lg sm:text-sm"
          style={{ color: "#4A6785" }}
        >
          A unified enterprise operating system for project delivery, commercial
          management, procurement, finance and executive oversight — built for
          USV Development Services Ltd and Canonic Associates Ltd.
        </p>

        {/* Stats strip */}
        <div
          className="mb-8 mt-8 grid w-full max-w-xl grid-cols-3 gap-4 border-b border-t py-6 sm:mb-10 sm:mt-10 sm:gap-8 sm:py-8"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {[
            { label: "Active Projects", value: "6", sub: "across both companies" },
            { label: "Proposed Users", value: "64", sub: "across 4 directorates" },
            { label: "Pending Actions", value: "23", sub: "requiring attention" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="font-display text-2xl font-bold tabular-nums sm:text-3xl"
                style={{ color: "#F1F5F9", fontFamily: "Archivo" }}
              >
                {s.value}
              </p>
              <p
                className="mt-1 text-[9px] font-semibold uppercase tracking-wider sm:text-[11px]"
                style={{ color: "#1A3D8F" }}
              >
                {s.label}
              </p>
              <p className="mt-0.5 hidden text-xs sm:block" style={{ color: "#4A6785" }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onEnter}
          className="group flex items-center gap-3 rounded px-6 py-3 text-sm font-semibold text-white transition-all duration-200 sm:px-8 sm:py-3.5"
          style={{ background: "#1A3D8F" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0a5e57")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1A3D8F")}
        >
          Access Platform
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Feature chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8">
          {[
            "Executive Command Centre",
            "Project Portfolio",
            "Procurement Control",
            "Approval Workflows",
            "Finance & Receivables",
            "Document Management",
          ].map((f) => (
            <span
              key={f}
              className="rounded-full border px-2.5 py-1 font-mono text-[10px] sm:px-3 sm:text-[11px]"
              style={{ borderColor: "rgba(255,255,255,0.08)", color: "#4A6785" }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-center border-t px-4 py-3 sm:px-8 sm:py-4"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <p
          className="text-center font-mono text-[9px] sm:text-[11px]"
          style={{ color: "#223344" }}
        >
          Confidential · USV Development Services Ltd · Canonic Associates Ltd · Authorised Access Only
        </p>
      </div>
    </div>
  );
}

/* ─── Login Page ─── */
export function LoginPage({ onLogin }: { onLogin: (user: UserPersona) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePersonaLogin = (persona: UserPersona) => {
    if (selected) return;
    setSelected(persona.id);
    setTimeout(() => onLogin(persona), 350);
  };

  const features = [
    {
      icon: TrendingUp,
      label: "Executive Analytics",
      desc: "Real-time portfolio intelligence and risk visibility",
    },
    {
      icon: Shield,
      label: "Approval Workflows",
      desc: "Multi-level authorisation with full audit trail",
    },
    {
      icon: Building2,
      label: "Project Control",
      desc: "End-to-end delivery oversight for every project",
    },
    {
      icon: Zap,
      label: "Action Intelligence",
      desc: "Exception-based management — know what matters",
    },
  ];

  const byId = Object.fromEntries(userPersonas.map((p) => [p.id, p]));

  const directorateGroups: {
    label: string;
    code: string;
    departments: { dept: string; head: string | null; officer: string | null }[];
  }[] = [
    {
      label: "A — Governance & Executive Management",
      code: "GOV",
      departments: [
        { dept: "Board",             head: "chairman", officer: null },
        { dept: "Group Executive",   head: "gmd",      officer: null },
        { dept: "Projects (Group)",  head: "ged",      officer: null },
        { dept: "Corporate (Group)", head: "ed",       officer: null },
        { dept: "Operations (Group)",head: "ggmp",     officer: null },
      ],
    },
    {
      label: "B — Projects Directorate",
      code: "PRJ",
      departments: [
        { dept: "Project Management",  head: "pm",                  officer: "project-coordinator" },
        { dept: "Construction & Site", head: "site-supervisor",     officer: "site" },
        { dept: "Procurement",         head: "procurement-manager", officer: "procurement" },
        { dept: "Document Control",    head: "doc-controller",      officer: null },
      ],
    },
    {
      label: "C — Technical Directorate",
      code: "TEC",
      departments: [
        { dept: "Architecture & Design",  head: "head-architect",   officer: "architect" },
        { dept: "Quantity Surveying",      head: "head-qs",          officer: "qs" },
        { dept: "Engineering & Technical", head: "head-engineering", officer: "engineer" },
      ],
    },
    {
      label: "D — Corporate Services Directorate",
      code: "COR",
      departments: [
        { dept: "Operations",         head: "head-ops",   officer: "ops-officer" },
        { dept: "Finance & Accounts", head: "finance",    officer: "accountant" },
        { dept: "Administration & HR",head: "head-admin", officer: "admin-officer" },
        { dept: "Business Development",head: "bd-officer",officer: "tender-officer" },
        { dept: "ICT & Systems",      head: "ict-admin",  officer: null },
        { dept: "Audit & Compliance", head: "auditor",    officer: null },
      ],
    },
  ];

  const renderCard = (persona: UserPersona | null, isOfficer: boolean) => {
    if (!persona) {
      return (
        <div
          key="empty"
          className="flex items-center justify-center rounded-lg border p-3 text-[10px]"
          style={{ borderColor: "#EBF0F5", borderStyle: "dashed", color: "#B0BCCA" }}
        >
          Single role
        </div>
      );
    }
    const isSelected = selected === persona.id;
    const moduleCount = persona.navItems.length;
    return (
      <button
        key={persona.id}
        onClick={() => handlePersonaLogin(persona)}
        disabled={!!selected}
        className="flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-all duration-200 w-full"
        style={{
          background: isSelected ? "#EEF2F6" : "#fff",
          borderTopColor: isSelected ? "#1A3D8F" : isOfficer ? "rgba(46,125,82,0.2)" : "#D9E2EC",
          borderRightColor: isSelected ? "#1A3D8F" : isOfficer ? "rgba(46,125,82,0.2)" : "#D9E2EC",
          borderBottomColor: isSelected ? "#1A3D8F" : isOfficer ? "rgba(46,125,82,0.2)" : "#D9E2EC",
          borderLeftWidth: isOfficer ? "3px" : "1px",
          borderLeftColor: isOfficer ? "#2E7D52" : (isSelected ? "#1A3D8F" : "#D9E2EC"),
          opacity: selected && !isSelected ? 0.35 : 1,
          transform: isSelected ? "scale(0.97)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!selected) {
            const c = isOfficer ? "rgba(46,125,82,0.5)" : "rgba(26,61,143,0.4)";
            e.currentTarget.style.borderTopColor = c;
            e.currentTarget.style.borderRightColor = c;
            e.currentTarget.style.borderBottomColor = c;
            e.currentTarget.style.borderLeftColor = c;
            e.currentTarget.style.background = isOfficer ? "rgba(46,125,82,0.03)" : "rgba(26,61,143,0.03)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selected) {
            const c = isOfficer ? "rgba(46,125,82,0.2)" : "#D9E2EC";
            e.currentTarget.style.borderTopColor = c;
            e.currentTarget.style.borderRightColor = c;
            e.currentTarget.style.borderBottomColor = c;
            e.currentTarget.style.borderLeftColor = isOfficer ? "#2E7D52" : "#D9E2EC";
            e.currentTarget.style.background = "#fff";
          }
        }}
      >
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white sm:h-8 sm:w-8"
          style={{ background: companyColor[persona.company] }}
        >
          {isSelected ? <CheckCircle2 className="h-3.5 w-3.5" /> : persona.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold leading-tight" style={{ color: "#102A43" }}>
            {persona.title}
          </p>
          <p className="mt-0.5 truncate text-[9px] leading-tight" style={{ color: "#627D98" }}>
            {persona.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <span
              className="rounded px-1 py-px font-mono text-[8px] font-bold uppercase tracking-wider"
              style={{
                background: `${companyColor[persona.company]}18`,
                color: companyColor[persona.company],
              }}
            >
              {persona.company === "USV + CANONIC" ? "GROUP" : persona.company}
            </span>
            <span
              className="rounded px-1 py-px font-mono text-[8px] font-semibold uppercase tracking-wider"
              style={{
                background: isOfficer ? "rgba(46,125,82,0.1)" : "#EEF2F6",
                color: isOfficer ? "#2E7D52" : "#627D98",
              }}
            >
              {persona.authority}
            </span>
            <span
              className="rounded px-1 py-px font-mono text-[8px] font-semibold"
              style={{ background: "#F0F4F8", color: "#829AB1" }}
              title="Navigation modules accessible"
            >
              {moduleCount}m
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    /* Mobile: single column, scrolls vertically.
       lg+: two-column side panel layout, right panel scrolls. */
    <div className="flex h-full flex-col lg:flex-row" style={{ background: "#F5F7FA" }}>

      {/* ── Left dark panel ── */}
      {/* Mobile: compact top header bar */}
      {/* lg+: full-height decorative panel */}
      <div
        className="relative flex shrink-0 flex-col justify-between overflow-hidden"
        style={{ background: "#0B1F33" }}
      >
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(217,226,236,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217,226,236,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Mobile compact bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded font-bold text-sm"
              style={{ background: "#1A3D8F", color: "#fff", fontFamily: "Archivo" }}
            >
              NX
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight" style={{ color: "#F1F5F9", fontFamily: "Archivo" }}>
                NEXUS
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#4A6785" }}>
                Enterprise Platform
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span
              className="rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase"
              style={{ borderColor: "rgba(26,61,143,0.5)", color: "#1A3D8F", background: "rgba(26,61,143,0.10)" }}
            >
              USV
            </span>
            <span
              className="rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase"
              style={{ borderColor: "rgba(53,128,181,0.5)", color: "#3580B5", background: "rgba(53,128,181,0.10)" }}
            >
              CANONIC
            </span>
          </div>
        </div>

        {/* Desktop full panel */}
        <div className="relative z-10 hidden w-[400px] flex-1 flex-col justify-between p-10 lg:flex">
          <div>
            {/* Logo */}
            <div className="mb-12 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded font-bold text-sm"
                style={{ background: "#1A3D8F", color: "#fff", fontFamily: "Archivo" }}
              >
                NX
              </div>
              <div>
                <p className="font-display text-base font-bold" style={{ color: "#F1F5F9", fontFamily: "Archivo" }}>
                  NEXUS
                </p>
                <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#4A6785" }}>
                  Enterprise Platform
                </p>
              </div>
            </div>

            <h2
              className="font-display mb-4 text-2xl font-bold leading-tight"
              style={{ color: "#F1F5F9", fontFamily: "Archivo" }}
            >
              Connected People, Projects and Process.
            </h2>
            <p className="mb-10 text-sm leading-relaxed" style={{ color: "#4A6785" }}>
              A unified platform serving USV Development Services Ltd's construction
              operations and Canonic Associates Ltd's architecture and consultancy
              practice across Nigeria.
            </p>

            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.label} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded"
                    style={{ background: "rgba(15,118,110,0.18)", color: "#1A3D8F" }}
                  >
                    <f.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "#CBD5E1" }}>
                      {f.label}
                    </p>
                    <p className="text-xs" style={{ color: "#4A6785" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              className="mb-5 flex flex-wrap items-center gap-2 border-t pt-5"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <span
                className="rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
                style={{ borderColor: "rgba(26,61,143,0.5)", color: "#1A3D8F", background: "rgba(26,61,143,0.10)" }}
              >
                USV Dev Services
              </span>
              <span
                className="rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
                style={{ borderColor: "rgba(53,128,181,0.5)", color: "#3580B5", background: "rgba(53,128,181,0.10)" }}
              >
                Canonic Associates
              </span>
              <span className="font-mono text-[10px]" style={{ color: "#334E68" }}>
                NEXUS Platform
              </span>
            </div>
            <p className="font-mono text-[11px]" style={{ color: "#223344" }}>
              © 2026 USV Development Services Ltd · Canonic Associates Ltd
              <br />
              All rights reserved · Confidential
            </p>
          </div>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          {/* Header */}
          <div className="mb-6 sm:mb-7">
            <h2
              className="font-display text-xl font-bold sm:text-2xl"
              style={{ color: "#102A43", fontFamily: "Archivo" }}
            >
              Sign in to your account
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: "#627D98" }}>
              NEXUS Enterprise Platform · September 2026
            </p>
          </div>

          {/* Credential form */}
          <div
            className="mb-5 rounded-lg border p-4 sm:p-6"
            style={{ background: "#fff", borderColor: "#D9E2EC" }}
          >
            <div className="space-y-4">
              <div>
                <label
                  className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide"
                  style={{ color: "#334E68" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@nexus-erp.com"
                  className="w-full rounded border px-3 py-2.5 text-sm outline-none transition"
                  style={{ borderColor: "#D9E2EC", color: "#102A43" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1A3D8F")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D9E2EC")}
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide"
                  style={{ color: "#334E68" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded border px-3 py-2.5 text-sm outline-none transition"
                  style={{ borderColor: "#D9E2EC", color: "#102A43" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1A3D8F")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D9E2EC")}
                />
              </div>
              <button
                onClick={() => handlePersonaLogin(userPersonas[0])}
                className="w-full rounded py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "#102A43" }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "#D9E2EC" }} />
            <span className="shrink-0 text-[11px] font-medium" style={{ color: "#627D98" }}>
              or select a demonstration account
            </span>
            <div className="h-px flex-1" style={{ background: "#D9E2EC" }} />
          </div>

          {/* Persona cards — organised by directorate */}
          <div className="space-y-5 sm:space-y-6">
            {directorateGroups.map((group) => (
              <div key={group.label}>
                {/* Directorate header */}
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: "#102A43", color: "#CBD5E1" }}
                  >
                    {group.code}
                  </span>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider sm:text-[11px]"
                    style={{ color: "#334E68" }}
                  >
                    {group.label}
                  </p>
                </div>

                {/* Column headers — only when officers exist in this group */}
                {group.departments.some((d) => d.officer) && (
                  <div className="mb-1.5 grid grid-cols-2 gap-2 px-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#1A3D8F" }}>
                      HEAD / MANAGER
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#2E7D52" }}>
                      OFFICER / PROFESSIONAL
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  {group.departments.map((dept) => {
                    const headPersona = dept.head ? byId[dept.head] : null;
                    const officerPersona = dept.officer ? byId[dept.officer] : null;
                    const hasPair = headPersona && officerPersona;
                    const headOnly = headPersona && !officerPersona;

                    if (headOnly) {
                      return (
                        <div
                          key={dept.dept}
                          className={group.departments.some((d) => d.officer) ? "grid grid-cols-2 gap-2" : "grid grid-cols-1"}
                        >
                          {renderCard(headPersona, false)}
                          {group.departments.some((d) => d.officer) && renderCard(null, true)}
                        </div>
                      );
                    }

                    return (
                      <div key={dept.dept} className={hasPair ? "grid grid-cols-2 gap-2" : "grid grid-cols-1"}>
                        {renderCard(headPersona, false)}
                        {officerPersona && renderCard(officerPersona, true)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div
            className="mt-6 flex items-start gap-2.5 rounded border p-3"
            style={{ borderColor: "#D9E2EC", background: "#F5F7FA" }}
          >
            <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#627D98" }} />
            <div>
              <p className="text-[11px] font-semibold" style={{ color: "#334E68" }}>
                Prototype — Proposed User Structure
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: "#627D98" }}>
                Accounts shown as{" "}
                <strong style={{ color: "#1A3D8F" }}>Head / Manager</strong> and{" "}
                <strong style={{ color: "#2E7D52" }}>Officer / Professional</strong> pairs per department.
                The <span className="font-mono text-[10px]">Nm</span> badge shows the number of navigation
                modules accessible. Full platform supports{" "}
                <strong style={{ color: "#334E68" }}>64 users</strong> across 4 directorates.
              </p>
            </div>
          </div>

          {/* Bottom padding for mobile safe area */}
          <div className="h-6 lg:h-0" />
        </div>
      </div>
    </div>
  );
}
