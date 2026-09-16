import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  ClipboardList,
  Clock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Shield,
  TrendingUp,
  User as UserIcon,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react";
import {
  naira,
  staffMembers,
  staffTasks,
  type Company,
  type StaffMember,
  type StaffTask,
  type UserRole,
} from "./data";
import { Card, CompanyTag, SectionHead } from "./ui";

// ── Access control ──────────────────────────────────────────────────────────

interface Access {
  canSeeAllStaff: boolean;
  viewOwnDeptOnly: boolean;
  canSeeEmployment: boolean;
  canSeeSalaryAmount: boolean;
  canSeeBankDetails: boolean;
  canSeeLeaveDetails: boolean;
  canSeeDisciplinary: boolean;
  canCreateUsers: boolean;
  canAssignTasks: boolean;
  canSeeWorkload: boolean;
  canSeeAssignment: boolean;
  showMyTeamTab: boolean;
  showAdminTab: boolean;
  showOrgTab: boolean;
  showCompanyFilter: boolean;
}

function getAccess(role: UserRole): Access {
  // Chairman and GMD are superadmins — full unrestricted access
  if (role === "chairman" || role === "gmd") {
    return {
      canSeeAllStaff: true,
      viewOwnDeptOnly: false,
      canSeeEmployment: true,
      canSeeSalaryAmount: true,
      canSeeBankDetails: true,
      canSeeLeaveDetails: true,
      canSeeDisciplinary: true,
      canCreateUsers: true,
      canAssignTasks: true,
      canSeeWorkload: true,
      canSeeAssignment: true,
      showMyTeamTab: false,
      showAdminTab: true,
      showOrgTab: true,
      showCompanyFilter: true,
    };
  }
  const isExec = (["ged", "ed", "ggm", "ggmp"] as UserRole[]).includes(role);
  const isHR = role === "head-admin";
  const isFinance = role === "finance" || role === "accountant";
  const isAudit = role === "auditor";
  const isICT = role === "ict-admin";
  const isDeptHead = (
    ["pm", "site-supervisor", "procurement-manager",
      "head-architect", "head-qs", "head-engineering", "head-ops"] as UserRole[]
  ).includes(role);

  return {
    canSeeAllStaff: isExec || isHR || isFinance || isAudit || isICT,
    viewOwnDeptOnly: !isExec && !isHR && !isFinance && !isAudit && !isICT,
    canSeeEmployment: isHR,
    canSeeSalaryAmount: isHR || isFinance,
    canSeeBankDetails: isHR || isFinance,
    canSeeLeaveDetails: isHR,
    canSeeDisciplinary: isHR,
    canCreateUsers: isHR || isICT,
    canAssignTasks: isExec || isHR || isDeptHead || role === "pm",
    canSeeWorkload: isExec || isHR || isDeptHead || role === "pm" || isAudit,
    canSeeAssignment: isExec || isHR || isDeptHead || role === "pm",
    showMyTeamTab: isDeptHead || isHR,
    showAdminTab: isHR || isICT,
    showOrgTab: isExec || isHR,
    showCompanyFilter: isHR,
  };
}

// ── Style maps ──────────────────────────────────────────────────────────────

const statusStyle: Record<StaffMember["status"], string> = {
  active: "bg-[#2f7d52]/12 text-[#2f7d52]",
  "on-leave": "bg-[#b5820e]/12 text-[#b5820e]",
  suspended: "bg-[#b23120]/12 text-[#b23120]",
  probation: "bg-[#345b8a]/12 text-[#345b8a]",
};

const statusLabel: Record<StaffMember["status"], string> = {
  active: "Active",
  "on-leave": "On Leave",
  suspended: "Suspended",
  probation: "Probation",
};

const priorityStyle: Record<StaffTask["priority"], string> = {
  urgent: "bg-[#b23120]/12 text-[#b23120]",
  high: "bg-[#b5820e]/12 text-[#b5820e]",
  normal: "bg-secondary text-secondary-foreground",
  low: "bg-secondary text-muted-foreground",
};

const taskStatusStyle: Record<StaffTask["status"], string> = {
  "not-started": "bg-secondary text-muted-foreground",
  "in-progress": "bg-info-bg text-info",
  completed: "bg-[#2f7d52]/12 text-[#2f7d52]",
  overdue: "bg-[#b23120]/12 text-[#b23120]",
};

const taskStatusLabel: Record<StaffTask["status"], string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
  overdue: "Overdue",
};

const companyBg: Record<Company, string> = {
  USV: "#1A3D8F",
  CANONIC: "#3580B5",
  "USV + CANONIC": "#345b8a",
};

const inputCls =
  "w-full rounded border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-primary";

// ── Primitive components ────────────────────────────────────────────────────

function Avatar({
  initials,
  company,
  size = "md",
}: {
  initials: string;
  company: Company;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizes[size]}`}
      style={{ background: companyBg[company] }}
    >
      {initials}
    </div>
  );
}

function WorkloadBar({ value }: { value: number }) {
  const color =
    value >= 90 ? "bg-[#b23120]" : value >= 75 ? "bg-[#b5820e]" : "bg-[#2f7d52]";
  const textColor =
    value >= 90
      ? "text-[#b23120]"
      : value >= 75
        ? "text-[#b5820e]"
        : "text-[#2f7d52]";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`font-mono text-[11px] font-semibold ${textColor}`}>{value}%</span>
    </div>
  );
}

function Row({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="text-foreground">{label}</span>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-medium ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function KpiTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "healthy" | "attention" | "critical";
}) {
  const textColor =
    color === "healthy"
      ? "text-[#2f7d52]"
      : color === "attention"
        ? "text-[#b5820e]"
        : color === "critical"
          ? "text-[#b23120]"
          : "text-foreground";
  return (
    <Card className="p-4">
      <p className={`font-mono text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-sm font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-muted-foreground hover:bg-panel hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Staff Profile Drawer ────────────────────────────────────────────────────

import type React from "react";

type DrawerTab = "overview" | "work" | "responsibilities" | "assignments" | "hr" | "comp";

function StaffProfileDrawer({
  staff,
  access,
  onClose,
  onAssignTask,
}: {
  staff: StaffMember;
  access: Access;
  onClose: () => void;
  onAssignTask: (s: StaffMember) => void;
}) {
  const [tab, setTab] = useState<DrawerTab>("overview");

  const myTasks = useMemo(
    () => staffTasks.filter((t) => t.assigneeId === staff.id),
    [staff.id],
  );
  const manager = staff.reportsTo
    ? staffMembers.find((s) => s.id === staff.reportsTo)
    : null;

  const tabs: { id: DrawerTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    ...(access.canSeeAssignment ? [{ id: "work" as DrawerTab, label: "Work" }] : []),
    { id: "responsibilities" as DrawerTab, label: "Responsibilities" },
    ...(access.canSeeAssignment ? [{ id: "assignments" as DrawerTab, label: "Assignments" }] : []),
    ...(access.canSeeEmployment ? [{ id: "hr" as DrawerTab, label: "HR Details" }] : []),
    ...(access.canSeeSalaryAmount || access.canSeeBankDetails
      ? [{ id: "comp" as DrawerTab, label: "Compensation" }]
      : []),
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[5vh]">
        <div className="flex w-full max-w-[660px] flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-2xl" style={{ maxHeight: "88vh" }}>
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-border px-6 py-5 shrink-0">
          <Avatar initials={staff.initials} company={staff.company} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[18px] font-bold leading-tight">{staff.name}</h2>
            <p className="text-sm text-muted-foreground">{staff.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CompanyTag company={staff.company} />
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle[staff.status]}`}>
                {statusLabel[staff.status]}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{staff.employeeId}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-panel hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-border px-5 pt-2 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-3 pb-2 pt-1 text-xs font-semibold transition ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "overview" && (
            <div className="space-y-5">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Contact
                </p>
                <div className="space-y-2">
                  <Row icon={Mail} label={staff.email} />
                  <Row icon={Phone} label={staff.phone} />
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Organisation
                </p>
                <div className="space-y-2">
                  <Row icon={Briefcase} label={staff.department} />
                  {manager && (
                    <Row icon={Users} label={`Reports to: ${manager.name}`} />
                  )}
                  <Row
                    icon={Shield}
                    label={`${staff.directorate.charAt(0).toUpperCase() + staff.directorate.slice(1)} Directorate`}
                  />
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Activity
                </p>
                <div className="space-y-2">
                  <Row icon={Clock} label={`Last login: ${staff.lastLogin}`} />
                  {access.canSeeWorkload && (
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-muted-foreground">Workload:</span>
                      <WorkloadBar value={staff.workload} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "work" && (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Current Assignment
                </p>
                <p className="rounded bg-panel p-3 text-xs leading-relaxed">
                  {staff.currentAssignment}
                </p>
              </div>
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Tasks ({myTasks.filter((t) => t.status !== "completed").length} open)
                  </p>
                  {access.canAssignTasks && (
                    <button
                      onClick={() => onAssignTask(staff)}
                      className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/15"
                    >
                      <Plus className="h-3 w-3" /> Assign
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {myTasks.length === 0 && (
                    <p className="text-xs text-muted-foreground">No tasks assigned.</p>
                  )}
                  {myTasks.map((task) => (
                    <div key={task.id} className="rounded border border-border p-2.5">
                      <p className="text-xs font-medium leading-snug">{task.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${priorityStyle[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${taskStatusStyle[task.status]}`}
                        >
                          {taskStatusLabel[task.status]}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "responsibilities" && (
            <div className="space-y-5">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Permanent Responsibilities
                </p>
                <div className="space-y-2">
                  {[
                    `${staff.department} day-to-day operations and delivery`,
                    `Reporting to ${manager ? manager.name : "Board / Executive"}`,
                    `${staff.directorate.charAt(0).toUpperCase() + staff.directorate.slice(1)} directorate coordination`,
                  ].map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 rounded border border-border bg-panel px-3 py-2.5 text-sm">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Project Responsibilities
                </p>
                <div className="space-y-2">
                  {staffTasks.filter((t) => t.assigneeId === staff.id && t.project).slice(0, 3).length > 0 ? (
                    staffTasks.filter((t) => t.assigneeId === staff.id && t.project).slice(0, 3).map((t) => (
                      <div key={t.id} className="rounded border border-border p-2.5">
                        <p className="text-xs font-medium">{t.title}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{t.project} · Due {t.dueDate}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No active project responsibilities.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Delegated / Temporary
                </p>
                <p className="rounded border border-dashed border-border bg-panel px-3 py-3 text-xs text-muted-foreground">
                  No delegated responsibilities currently active.
                </p>
              </div>
            </div>
          )}

          {tab === "assignments" && access.canSeeAssignment && (
            <div className="space-y-5">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Current Assignment
                </p>
                <div className="rounded border border-border bg-panel p-3">
                  <p className="text-sm leading-relaxed">{staff.currentAssignment}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">Active</span>
                    <span>Since {staff.employmentDate}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Project Assignments
                </p>
                <div className="space-y-2">
                  {staffTasks.filter((t) => t.assigneeId === staff.id).slice(0, 5).length > 0 ? (
                    staffTasks.filter((t) => t.assigneeId === staff.id).slice(0, 5).map((t) => (
                      <div key={t.id} className="rounded border border-border p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium leading-snug">{t.title}</p>
                            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{t.project}</p>
                          </div>
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            t.status === "completed" ? "bg-healthy-bg text-healthy" :
                            t.status === "in-progress" ? "bg-primary/10 text-primary" :
                            "bg-panel text-muted-foreground"
                          }`}>
                            {t.status === "completed" ? "Done" : t.status === "in-progress" ? "Active" : "Pending"}
                          </span>
                        </div>
                        <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                          Due {t.dueDate} · Role: {t.department}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No project assignments found.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Past Assignments
                </p>
                <div className="space-y-2">
                  {[
                    { project: "Abuja Transit Hub Ph. I", role: "Site Engineer", duration: "Jan 2024 – Aug 2025", outcome: "Completed" },
                    { project: "Port Harcourt Logistics Park", role: "Structural Engineer", duration: "Mar 2023 – Dec 2023", outcome: "Completed" },
                    { project: "Lagos Marina Development", role: "Project Engineer", duration: "Jun 2022 – Feb 2023", outcome: "Completed" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 rounded-[var(--radius)] border border-border bg-card p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold">{a.project}</p>
                        <p className="text-[11px] text-muted-foreground">{a.role} · {a.duration}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-healthy-bg px-2 py-0.5 text-[10px] font-semibold text-healthy">{a.outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "hr" && access.canSeeEmployment && (
            <div className="space-y-5">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Employment
                </p>
                <div className="space-y-2">
                  <InfoRow label="Employee ID" value={staff.employeeId} mono />
                  <InfoRow label="Start Date" value={staff.employmentDate} />
                  <InfoRow
                    label="Contract Type"
                    value={staff.contractType.charAt(0).toUpperCase() + staff.contractType.slice(1)}
                  />
                  <InfoRow label="Salary Grade" value={staff.salaryGrade} mono />
                  {staff.probationEnd && (
                    <InfoRow label="Probation End" value={staff.probationEnd} />
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Leave
                </p>
                <div className="space-y-2">
                  <InfoRow label="Balance" value={`${staff.leaveBalance} days`} />
                  <InfoRow label="Taken (2026)" value={`${staff.leaveTaken} days`} />
                </div>
                {staff.leaveRecords.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {staff.leaveRecords.map((lr, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded border border-border bg-panel px-2.5 py-2 text-xs"
                      >
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="font-medium capitalize">{lr.type} leave</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{lr.dates}</span>
                        <span
                          className={`ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            lr.status === "approved"
                              ? "bg-[#2f7d52]/12 text-[#2f7d52]"
                              : lr.status === "pending"
                                ? "bg-[#b5820e]/12 text-[#b5820e]"
                                : "bg-[#b23120]/12 text-[#b23120]"
                          }`}
                        >
                          {lr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Emergency Contact
                </p>
                <div className="space-y-2">
                  <InfoRow label="Name" value={staff.emergencyContact} />
                  <InfoRow label="Phone" value={staff.emergencyPhone} mono />
                  <Row icon={MapPin} label={staff.address} />
                </div>
              </div>
              {staff.disciplinaryNotes && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#b23120]">
                    Disciplinary Notes
                  </p>
                  <p className="rounded border border-[#b23120]/20 bg-[#b23120]/5 p-3 text-xs leading-relaxed">
                    {staff.disciplinaryNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "comp" && (
            <div className="space-y-5">
              {access.canSeeSalaryAmount && (
                <div>
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Salary
                  </p>
                  <div className="rounded border border-border bg-panel p-4 text-center">
                    <p className="font-mono text-2xl font-bold">
                      {naira(staff.monthlySalary)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      per month · Grade {staff.salaryGrade}
                    </p>
                  </div>
                </div>
              )}
              {access.canSeeBankDetails && (
                <div>
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Banking
                  </p>
                  <div className="space-y-2">
                    <InfoRow label="Bank" value={staff.bankName} />
                    <InfoRow label="Account Name" value={staff.accountName} />
                    <InfoRow label="Account Number (NUBAN)" value={staff.accountNumber} mono />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
}

// ── Assign Task Modal ───────────────────────────────────────────────────────

function AssignTaskModal({
  defaultAssignee,
  availableStaff,
  onClose,
}: {
  defaultAssignee: StaffMember | null;
  availableStaff: StaffMember[];
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState(defaultAssignee?.id ?? "");
  const [priority, setPriority] = useState<StaffTask["priority"]>("normal");
  const [dueDate, setDueDate] = useState("");
  const [project, setProject] = useState("");

  const canSubmit = title.trim().length > 0 && assigneeId !== "" && dueDate !== "";

  return (
    <Modal title="Assign Task" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Task Title *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Prepare BOQ revision for Block C"
            className={inputCls}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Additional context or acceptance criteria..."
            className={`${inputCls} resize-none`}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Assignee *">
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={inputCls}
            >
              <option value="">Select person...</option>
              {availableStaff
                .filter((s) => s.status === "active")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as StaffTask["priority"])}
              className={inputCls}
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Due Date *">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Link to Project">
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. Abuja Housing Ph II"
              className={inputCls}
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-3">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-muted-foreground hover:bg-panel"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            disabled={!canSubmit}
            className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:opacity-90"
          >
            Assign Task
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Create User Modal ───────────────────────────────────────────────────────

const DEPARTMENTS = [
  "Board",
  "Group Executive",
  "Legal & Company Secretariat",
  "Project Management",
  "Construction & Site Management",
  "Procurement",
  "Project Document Control",
  "Architecture & Design",
  "Quantity Surveying",
  "Engineering & Technical Services",
  "Planning & Programme Management",
  "Business Development & Tenders",
  "Finance & Accounts",
  "Administration & Human Resources",
  "ICT, ERP & Systems Administration",
  "Client Relations & Customer Experience",
  "Internal Audit & Compliance",
];

const ROLES_BY_DEPT: Record<string, string[]> = {
  "Board": ["chairman"],
  "Group Executive": ["gmd", "ged", "ed", "ggm", "ggmp"],
  "Project Management": ["pm", "project-coordinator", "planner"],
  "Construction & Site Management": ["site-supervisor", "site"],
  "Procurement": ["procurement-manager", "procurement"],
  "Project Document Control": ["doc-controller"],
  "Architecture & Design": ["head-architect", "architect"],
  "Quantity Surveying": ["head-qs", "qs"],
  "Engineering & Technical Services": ["head-engineering", "engineer"],
  "Finance & Accounts": ["finance", "accountant"],
  "Administration & Human Resources": ["head-admin", "admin"],
  "ICT, ERP & Systems Administration": ["ict-admin"],
  "Business Development & Tenders": ["head-ops", "ops", "bd-officer", "tender-officer"],
  "Client Relations & Customer Experience": ["client-support"],
  "Internal Audit & Compliance": ["auditor"],
};

const BANKS = [
  "Access Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank",
  "United Bank for Africa",
  "Zenith Bank",
  "Stanbic IBTC Bank",
  "Ecobank",
  "First City Monument Bank",
  "Fidelity Bank",
  "Union Bank",
  "Polaris Bank",
];

const SALARY_GRADES = ["S1", "S2", "S3", "S4", "S5", "S6", "S7"];

type CreateStep = 1 | 2 | 3;

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<CreateStep>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "USV",
    department: "",
    role: "",
    contractType: "permanent",
    salaryGrade: "S2",
    monthlySalary: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const roleOptions = form.department ? (ROLES_BY_DEPT[form.department] ?? []) : [];

  const steps = ["Personal Info", "Role & Department", "Compensation"];

  return (
    <Modal title="Create New User" onClose={onClose} wide>
      {/* Step indicators */}
      <div className="mb-5 flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                step > i + 1
                  ? "bg-primary text-primary-foreground"
                  : step === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs ${step === i + 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
            >
              {s}
            </span>
            {i < 2 && (
              <ChevronRight className="mx-1 h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name *">
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Engr. Kola Adesanya"
                className={inputCls}
              />
            </Field>
            <Field label="Email Address *">
              <input
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="k.adesanya@nexus-erp.com"
                className={inputCls}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone Number">
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+234 800 000 0000"
                className={inputCls}
              />
            </Field>
            <Field label="Company">
              <select
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className={inputCls}
              >
                <option value="USV">USV Development Services Ltd</option>
                <option value="CANONIC">Canonic Associates Ltd</option>
                <option value="USV + CANONIC">Group (Both Companies)</option>
              </select>
            </Field>
          </div>
          <Field label="Residential Address">
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="e.g. 15 Wuse II, Abuja FCT"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Emergency Contact Name">
              <input
                value={form.emergencyContact}
                onChange={(e) => set("emergencyContact", e.target.value)}
                placeholder="Full name"
                className={inputCls}
              />
            </Field>
            <Field label="Emergency Contact Phone">
              <input
                value={form.emergencyPhone}
                onChange={(e) => set("emergencyPhone", e.target.value)}
                placeholder="+234 800 000 0001"
                className={inputCls}
              />
            </Field>
          </div>
          <div className="flex justify-end border-t border-border pt-3">
            <button
              onClick={() => setStep(2)}
              disabled={!form.name.trim() || !form.email.trim()}
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:opacity-90"
            >
              Next: Role &amp; Department
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department *">
              <select
                value={form.department}
                onChange={(e) => {
                  set("department", e.target.value);
                  set("role", "");
                }}
                className={inputCls}
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="System Role *">
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className={inputCls}
                disabled={!form.department}
              >
                <option value="">Select role...</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contract Type">
              <select
                value={form.contractType}
                onChange={(e) => set("contractType", e.target.value)}
                className={inputCls}
              >
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </Field>
            <Field label="Salary Grade">
              <select
                value={form.salaryGrade}
                onChange={(e) => set("salaryGrade", e.target.value)}
                className={inputCls}
              >
                {SALARY_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <button
              onClick={() => setStep(1)}
              className="rounded px-4 py-2 text-sm text-muted-foreground hover:bg-panel"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.department || !form.role}
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:opacity-90"
            >
              Next: Compensation
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monthly Salary (₦)">
              <input
                value={form.monthlySalary}
                onChange={(e) => set("monthlySalary", e.target.value)}
                placeholder="e.g. 350000"
                type="number"
                className={inputCls}
              />
            </Field>
            <Field label="Bank Name">
              <select
                value={form.bankName}
                onChange={(e) => set("bankName", e.target.value)}
                className={inputCls}
              >
                <option value="">Select bank...</option>
                {BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account Name">
              <input
                value={form.accountName}
                onChange={(e) => set("accountName", e.target.value)}
                placeholder="As registered with bank"
                className={inputCls}
              />
            </Field>
            <Field label="Account Number (NUBAN)">
              <input
                value={form.accountNumber}
                onChange={(e) => set("accountNumber", e.target.value)}
                placeholder="10-digit NUBAN"
                maxLength={10}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="rounded border border-[#2f7d52]/20 bg-[#2f7d52]/5 p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">After creation:</strong> The user receives
            a welcome email with login credentials. ICT Admin is notified to complete
            system access provisioning in NEXUS.
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <button
              onClick={() => setStep(2)}
              className="rounded px-4 py-2 text-sm text-muted-foreground hover:bg-panel"
            >
              Back
            </button>
            <button
              onClick={onClose}
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Create User
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── Directory View ──────────────────────────────────────────────────────────

function DirectoryView({
  staff,
  access,
  onOpenProfile,
  onAssignTask,
}: {
  staff: StaffMember[];
  access: Access;
  onOpenProfile: (s: StaffMember) => void;
  onAssignTask: (s: StaffMember) => void;
}) {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dirFilter, setDirFilter] = useState("all");

  const departments = useMemo(
    () => [...new Set(staff.map((s) => s.department))].sort(),
    [staff],
  );

  const filtered = useMemo(
    () =>
      staff.filter((s) => {
        const q = query.toLowerCase();
        if (
          q &&
          !s.name.toLowerCase().includes(q) &&
          !s.title.toLowerCase().includes(q) &&
          !s.department.toLowerCase().includes(q)
        )
          return false;
        if (deptFilter !== "all" && s.department !== deptFilter) return false;
        if (statusFilter !== "all" && s.status !== statusFilter) return false;
        if (dirFilter !== "all" && s.directorate !== dirFilter) return false;
        return true;
      }),
    [staff, query, deptFilter, statusFilter, dirFilter],
  );

  const showContact = !access.canSeeWorkload && !access.canSeeSalaryAmount;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="staff-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title or department..."
            className="w-full rounded border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        {access.canSeeAllStaff && (
          <select
            value={dirFilter}
            onChange={(e) => setDirFilter(e.target.value)}
            className="rounded border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Directorates</option>
            <option value="governance">Governance</option>
            <option value="projects">Projects</option>
            <option value="technical">Technical</option>
            <option value="corporate">Corporate Services</option>
          </select>
        )}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="probation">Probation</option>
          <option value="suspended">Suspended</option>
        </select>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {staff.length}
        </span>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Staff Member
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Department
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                {access.canSeeWorkload && (
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Workload
                  </th>
                )}
                {access.canSeeAssignment && (
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Assignment
                  </th>
                )}
                {access.canSeeSalaryAmount && (
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly Salary
                  </th>
                )}
                {access.canSeeBankDetails && (
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Bank Details
                  </th>
                )}
                {showContact && (
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact
                  </th>
                )}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border/50 transition-colors hover:bg-panel/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={s.initials} company={s.company} size="sm" />
                      <div className="min-w-0">
                        <p className="max-w-36 truncate text-xs font-semibold">{s.name}</p>
                        <p className="max-w-36 truncate text-[10px] text-muted-foreground">
                          {s.title}
                        </p>
                      </div>
                      <CompanyTag company={s.company} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{s.department}</p>
                    <p className="text-[10px] capitalize text-muted-foreground">
                      {s.directorate}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </td>
                  {access.canSeeWorkload && (
                    <td className="px-4 py-3">
                      <WorkloadBar value={s.workload} />
                    </td>
                  )}
                  {access.canSeeAssignment && (
                    <td className="px-4 py-3">
                      <p className="max-w-xs truncate text-xs text-muted-foreground">
                        {s.currentAssignment}
                      </p>
                    </td>
                  )}
                  {access.canSeeSalaryAmount && (
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold">
                        {naira(s.monthlySalary)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{s.salaryGrade}</p>
                    </td>
                  )}
                  {access.canSeeBankDetails && (
                    <td className="px-4 py-3">
                      <p className="text-xs">{s.bankName}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {s.accountNumber}
                      </p>
                    </td>
                  )}
                  {showContact && (
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                      <p className="text-[10px] text-muted-foreground">{s.phone}</p>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {access.canAssignTasks && s.status === "active" && (
                        <button
                          onClick={() => onAssignTask(s)}
                          className="rounded border border-border p-1.5 text-muted-foreground transition hover:border-primary hover:text-primary"
                          title="Assign task"
                        >
                          <ClipboardList className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onOpenProfile(s)}
                        className="rounded border border-border p-1.5 text-muted-foreground transition hover:border-primary hover:text-primary"
                        title="View profile"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-[13px] font-semibold">No staff found</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── My Team View ────────────────────────────────────────────────────────────

function TaskRow({ task }: { task: StaffTask }) {
  const assignee = staffMembers.find((s) => s.id === task.assigneeId);
  return (
    <div className="flex items-start gap-2.5 px-4 py-2.5">
      <span
        className={`mt-0.5 inline-block shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${priorityStyle[task.priority]}`}
      >
        {task.priority.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-xs font-medium leading-snug">{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${taskStatusStyle[task.status]}`}
          >
            {taskStatusLabel[task.status]}
          </span>
          {assignee && (
            <span className="text-[10px] text-muted-foreground">
              {assignee.name.split(" ").slice(-1)[0]}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">· {task.dueDate}</span>
        </div>
      </div>
    </div>
  );
}

function MyTeamView({
  viewer,
  access,
  onOpenProfile,
  onAssignTask,
}: {
  viewer: StaffMember | null;
  access: Access;
  onOpenProfile: (s: StaffMember) => void;
  onAssignTask: (s: StaffMember) => void;
}) {
  const team = useMemo(
    () => (viewer ? staffMembers.filter((s) => s.reportsTo === viewer.id) : []),
    [viewer?.id],
  );

  const deptTasks = useMemo(
    () => (viewer ? staffTasks.filter((t) => t.department === viewer.department) : []),
    [viewer?.department],
  );

  if (!viewer) {
    return (
      <p className="text-sm text-muted-foreground">
        No team data available for this role.
      </p>
    );
  }

  const openTasks = deptTasks.filter((t) => t.status !== "completed");
  const overdueTasks = deptTasks.filter((t) => t.status === "overdue");
  const inProgressTasks = deptTasks.filter((t) => t.status === "in-progress");
  const notStartedTasks = deptTasks.filter((t) => t.status === "not-started");
  const completedTasks = deptTasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        <KpiTile label="Team Members" value={String(team.length)} />
        <KpiTile
          label="Active"
          value={String(team.filter((s) => s.status === "active").length)}
          color="healthy"
        />
        <KpiTile
          label="On Leave"
          value={String(team.filter((s) => s.status === "on-leave").length)}
          color="attention"
        />
        <KpiTile label="Open Tasks" value={String(openTasks.length)} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Team roster */}
        <Card>
          <SectionHead
            title={`${viewer.department} — Team`}
            hint={`${team.length} staff reporting to you`}
            action={
              access.canAssignTasks && team.length > 0 ? (
                <button
                  onClick={() => onAssignTask(team[0])}
                  className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/15"
                >
                  <Plus className="h-3.5 w-3.5" /> Assign Task
                </button>
              ) : undefined
            }
          />
          {team.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No staff currently report to you in this department.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {team.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar initials={s.initials} company={s.company} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {s.currentAssignment}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <WorkloadBar value={s.workload} />
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                    {access.canAssignTasks && (
                      <button
                        onClick={() => onAssignTask(s)}
                        className="rounded p-1 text-muted-foreground hover:bg-panel hover:text-primary"
                        title="Assign task"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onOpenProfile(s)}
                      className="rounded p-1 text-muted-foreground hover:bg-panel hover:text-foreground"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Task board */}
        <Card>
          <SectionHead
            title="Department Tasks"
            hint={`${deptTasks.length} total · ${overdueTasks.length} overdue`}
          />
          <div className="max-h-[420px] divide-y divide-border overflow-y-auto">
            {overdueTasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
            {inProgressTasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
            {notStartedTasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
            {completedTasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
            {deptTasks.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground">
                No tasks for this department.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── User Management View ────────────────────────────────────────────────────

function UserManagementView({
  staff,
  access,
  onOpenProfile,
  onCreateUser,
}: {
  staff: StaffMember[];
  access: Access;
  onOpenProfile: (s: StaffMember) => void;
  onCreateUser: () => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      staff.filter((s) => {
        const q = query.toLowerCase();
        if (
          q &&
          !s.name.toLowerCase().includes(q) &&
          !s.employeeId.toLowerCase().includes(q) &&
          !s.department.toLowerCase().includes(q)
        )
          return false;
        if (statusFilter !== "all" && s.status !== statusFilter) return false;
        return true;
      }),
    [staff, query, statusFilter],
  );

  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.status === "active").length,
    onLeave: staff.filter((s) => s.status === "on-leave").length,
    suspended: staff.filter((s) => s.status === "suspended").length,
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <KpiTile label="Total Users" value={String(stats.total)} />
        <KpiTile label="Active" value={String(stats.active)} color="healthy" />
        <KpiTile label="On Leave" value={String(stats.onLeave)} color="attention" />
        <KpiTile label="Suspended" value={String(stats.suspended)} color="critical" />
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, employee ID or department..."
              className="w-full rounded border border-border bg-panel py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-border bg-panel px-3 py-1.5 text-sm outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="probation">Probation</option>
            <option value="suspended">Suspended</option>
          </select>
          {access.canCreateUsers && (
            <button
              onClick={onCreateUser}
              className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <UserPlus className="h-4 w-4" /> Add User
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Employee
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Department
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Contract
                </th>
                {access.canSeeEmployment && (
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Since
                  </th>
                )}
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Last Login
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border/50 transition-colors hover:bg-panel/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={s.initials} company={s.company} size="sm" />
                      <div>
                        <p className="text-xs font-semibold">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">{s.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">{s.employeeId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{s.department}</p>
                    <p className="text-[10px] capitalize text-muted-foreground">
                      {s.directorate}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs capitalize">{s.contractType}</span>
                  </td>
                  {access.canSeeEmployment && (
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {s.employmentDate}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{s.lastLogin}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenProfile(s)}
                        className="rounded border border-border p-1.5 text-muted-foreground transition hover:border-primary hover:text-primary"
                        title="View profile"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      {access.canCreateUsers && (
                        <button
                          className="rounded border border-border p-1.5 text-muted-foreground transition hover:border-[#b23120] hover:text-[#b23120]"
                          title="Deactivate user"
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Org Tree View ──────────────────────────────────────────────────────────

const dirConfig: { key: string; label: string; color: string }[] = [
  { key: "governance", label: "Governance", color: "#345b8a" },
  { key: "projects", label: "Projects Directorate", color: "#1A3D8F" },
  { key: "technical", label: "Technical Directorate", color: "#3580B5" },
  { key: "corporate", label: "Corporate Services", color: "#5a3d8a" },
];

function OrgTreeView({
  staff,
  access,
  onOpenProfile,
}: {
  staff: StaffMember[];
  access: Access;
  onOpenProfile: (s: StaffMember) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (dept: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(dept)) next.delete(dept);
      else next.add(dept);
      return next;
    });

  const tree = dirConfig.map(({ key, label, color }) => {
    const dirStaff = staff.filter((s) => s.directorate === key);
    const deptNames = [...new Set(dirStaff.map((s) => s.department))];
    const departments = deptNames.map((dept) => {
      const deptStaff = dirStaff.filter((s) => s.department === dept);
      // Head: the staff member whose manager is NOT in this same department
      const head =
        deptStaff.find((s) => !s.reportsTo || !deptStaff.find((x) => x.id === s.reportsTo)) ??
        deptStaff[0];
      const supporting = deptStaff.filter((s) => s.id !== head?.id);
      return { dept, head, supporting };
    });
    return { key, label, color, departments };
  });

  const execChain = [
    { id: "s-01", label: "Chairman", color: "#345b8a" },
    { id: "s-02", label: "GMD", color: "#1A3D8F" },
    { id: "s-03", label: "GED — Projects", color: "#3580B5" },
    { id: "s-03b", label: "ED — Corporate Services", color: "#5a3d8a" },
    { id: "s-04", label: "GGMP — Operations", color: "#3580B5" },
  ].map(({ id, label, color }) => ({
    label,
    color,
    member: staff.find((s) => s.id === id),
  }));

  return (
    <div className="space-y-6">
      {/* Executive reporting chain */}
      <div>
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Executive Reporting Chain
        </p>
        <div className="flex flex-wrap items-center gap-0">
          {execChain.map(({ label, color, member }, i) => (
            <div key={label} className="flex items-center">
              <button
                onClick={() => member && onOpenProfile(member)}
                className="flex flex-col items-center rounded-lg border border-border bg-card px-3 py-2.5 text-center hover:border-primary hover:bg-panel transition"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <div
                  className="mb-1 flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold text-white"
                  style={{ background: color }}
                >
                  {member?.initials ?? "—"}
                </div>
                <p className="text-[11px] font-semibold leading-tight">{member?.name ?? label}</p>
                <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">{label}</p>
              </button>
              {i < execChain.length - 1 && (
                <div className="mx-1 flex flex-col items-center gap-0.5">
                  <div className="h-px w-5 bg-border" />
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <div className="h-px w-5 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {tree.map(({ key, label, color, departments }) => {
        if (departments.length === 0) return null;
        const totalStaff = departments.reduce(
          (s, d) => s + 1 + d.supporting.length,
          0,
        );
        return (
          <div key={key}>
            <div
              className="mb-3 flex items-center gap-3 rounded px-3 py-2"
              style={{ background: `${color}12`, borderLeft: `3px solid ${color}` }}
            >
              <span
                className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ color }}
              >
                {label}
              </span>
              <span className="text-xs text-muted-foreground">
                {totalStaff} staff · {departments.length} department
                {departments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2 pl-4">
              {departments.map(({ dept, head, supporting }) => {
                const isOpen = expanded.has(dept);
                const total = 1 + supporting.length;
                return (
                  <Card key={dept} className="overflow-hidden">
                    <button
                      onClick={() => toggle(dept)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-panel"
                    >
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-semibold">{dept}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {total} staff
                        </span>
                      </div>
                      {head && (
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            initials={head.initials}
                            company={head.company}
                            size="sm"
                          />
                          <div className="hidden text-right sm:block">
                            <p className="text-xs font-semibold">{head.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              Dept. Head
                            </p>
                          </div>
                        </div>
                      )}
                    </button>

                    {isOpen && (
                      <div className="border-t border-border">
                        {head && (
                          <div
                            className="flex cursor-pointer items-center gap-3 px-6 py-3 transition hover:bg-panel"
                            style={{ background: `${color}05` }}
                            onClick={() => onOpenProfile(head)}
                          >
                            <Avatar
                              initials={head.initials}
                              company={head.company}
                              size="md"
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold">{head.name}</p>
                                <span
                                  className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                                  style={{ background: color }}
                                >
                                  HEAD
                                </span>
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle[head.status]}`}
                                >
                                  {statusLabel[head.status]}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {head.title}
                              </p>
                            </div>
                            <div className="hidden text-right lg:block">
                              <p className="text-xs text-muted-foreground">
                                {head.email}
                              </p>
                              {access.canSeeWorkload && (
                                <WorkloadBar value={head.workload} />
                              )}
                            </div>
                          </div>
                        )}

                        {supporting.map((s) => (
                          <div
                            key={s.id}
                            className="flex cursor-pointer items-center gap-3 border-t border-border/40 py-2.5 pl-14 pr-6 transition hover:bg-panel"
                            onClick={() => onOpenProfile(s)}
                          >
                            <Avatar
                              initials={s.initials}
                              company={s.company}
                              size="sm"
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-medium">{s.name}</p>
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle[s.status]}`}
                                >
                                  {statusLabel[s.status]}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                {s.title}
                              </p>
                            </div>
                            {access.canSeeWorkload && (
                              <WorkloadBar value={s.workload} />
                            )}
                          </div>
                        ))}

                        {supporting.length === 0 && (
                          <p className="px-6 py-2 text-xs text-muted-foreground">
                            No supporting staff under this head.
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── My HR Self-Service View ─────────────────────────────────────────────────

function MyHRView({ viewer }: { viewer: StaffMember | null }) {
  const me = viewer;

  const leaveBalance = [
    { type: "Annual Leave", total: 21, used: 8, remaining: 13 },
    { type: "Sick Leave", total: 12, used: 2, remaining: 10 },
    { type: "Maternity / Paternity", total: 84, used: 0, remaining: 84 },
    { type: "Compassionate", total: 5, used: 0, remaining: 5 },
  ];

  const myRequests = [
    { id: "LVE-2026-0041", type: "Annual Leave", dates: "15–22 Sep 2026", status: "Approved", submitted: "01 Sep 2026" },
    { id: "WEL-2026-0012", type: "Welfare Request", dates: "—", status: "Under Review", submitted: "28 Aug 2026" },
    { id: "LVE-2026-0029", type: "Annual Leave", dates: "12–16 May 2026", status: "Completed", submitted: "04 May 2026" },
  ];

  const myPayslips = [
    { month: "August 2026", gross: 485_000, net: 392_000, status: "Paid" },
    { month: "July 2026", gross: 485_000, net: 392_000, status: "Paid" },
    { month: "June 2026", gross: 485_000, net: 392_000, status: "Paid" },
  ];

  const [myHrTab, setMyHrTab] = useState<"profile" | "leave" | "payslips" | "requests">("profile");

  const hrTabs = [
    { id: "profile" as const, label: "My Profile" },
    { id: "leave" as const, label: "Leave & Attendance" },
    { id: "payslips" as const, label: "My Payslips" },
    { id: "requests" as const, label: "My Requests" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-base font-bold">My HR — Self-Service</h2>
          <p className="text-xs text-muted-foreground">Private view — only you can see this information</p>
        </div>
        <div className="flex items-center gap-1.5 rounded bg-primary/10 px-2.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-[10px] font-bold text-primary">SELF-SERVICE</span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-border">
        {hrTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setMyHrTab(t.id)}
            className={`border-b-2 px-3 py-2 text-xs font-medium transition ${myHrTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {myHrTab === "profile" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white">
                {me ? me.name.split(" ").map((w) => w[0]).join("").slice(0, 2) : "ME"}
              </div>
              <div>
                <p className="font-display text-base font-bold">{me?.name ?? "My Profile"}</p>
                <p className="text-sm text-muted-foreground">{me?.title}</p>
                <p className="text-xs text-muted-foreground">{me?.department} · {me?.directorate}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
              {[
                ["Staff ID", me?.id ?? "—"],
                ["Company", me?.company ?? "—"],
                ["Directorate", me?.directorate ?? "—"],
                ["Department", me?.department ?? "—"],
                ["Reports to", me?.reportsTo ?? "—"],
                ["Location", me?.address ? me.address.split(",").slice(-2).join(",").trim() : "Head Office, Abuja"],
                ["Status", me?.status ?? "Active"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-wide">My Responsibilities</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Project planning and coordination",
                "Project monitoring and reporting",
                "Team leadership and coordination",
                "Stakeholder management",
                "Issue escalation",
                "Programme management",
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {myHrTab === "leave" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {leaveBalance.map((l) => (
              <div key={l.type} className="rounded-[var(--radius)] border border-border bg-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{l.type}</p>
                <p className="mt-2 font-display text-2xl font-bold">{l.remaining}</p>
                <p className="text-xs text-muted-foreground">days remaining of {l.total}</p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(l.remaining / l.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white">
              <Calendar className="h-3.5 w-3.5" /> Request Leave
            </button>
          </div>
        </div>
      )}

      {myHrTab === "payslips" && (
        <div className="rounded-[var(--radius)] border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wide">Payslips</h3>
            <p className="text-xs text-muted-foreground">Your confidential salary information</p>
          </div>
          <ul className="divide-y divide-border">
            {myPayslips.map((ps) => (
              <li key={ps.month} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{ps.month}</p>
                  <p className="text-xs text-muted-foreground">Gross: {naira(ps.gross)} · Net: {naira(ps.net)}</p>
                </div>
                <span className="rounded bg-healthy/10 px-2 py-0.5 font-mono text-[10px] font-bold text-healthy">{ps.status}</span>
                <button className="text-xs font-semibold text-primary hover:underline">Download</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {myHrTab === "requests" && (
        <div className="space-y-3">
          <div className="flex justify-end gap-2">
            <button className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-semibold hover:bg-panel">Welfare Request</button>
            <button className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white">+ New Request</button>
          </div>
          <div className="rounded-[var(--radius)] border border-border bg-card">
            <ul className="divide-y divide-border">
              {myRequests.map((r) => (
                <li key={r.id} className="flex items-center gap-4 px-4 py-3">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.type}</p>
                    <p className="text-xs text-muted-foreground">Submitted {r.submitted}{r.dates !== "—" ? ` · ${r.dates}` : ""}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${r.status === "Approved" || r.status === "Completed" ? "bg-healthy/10 text-healthy" : "bg-attention/10 text-attention"}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main People Module ──────────────────────────────────────────────────────

type PeopleTab = "directory" | "my-team" | "admin" | "org-tree";

export default function People({ viewerRole }: { viewerRole: UserRole }) {
  const access = getAccess(viewerRole);
  const viewer = staffMembers.find((s) => s.role === viewerRole) ?? null;

  const [activeTab, setActiveTab] = useState<PeopleTab>("directory");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [assignTarget, setAssignTarget] = useState<StaffMember | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [companyFilter, setCompanyFilter] = useState<"All" | "USV" | "CANONIC">("All");

  const directoryStaff = useMemo(() => {
    if (access.canSeeAllStaff) return staffMembers;
    if (viewer) return staffMembers.filter((s) => s.department === viewer.department);
    return staffMembers;
  }, [access.canSeeAllStaff, viewer]);

  const filteredByCompany = useMemo(() => {
    if (!access.showCompanyFilter || companyFilter === "All") return directoryStaff;
    return directoryStaff.filter(
      (s) => s.company === companyFilter || s.company === "USV + CANONIC",
    );
  }, [directoryStaff, companyFilter, access.showCompanyFilter]);

  const tabs: { id: PeopleTab; label: string; icon: React.ElementType }[] = [
    { id: "directory", label: "Staff Directory", icon: Users },
    ...(access.showOrgTab
      ? [{ id: "org-tree" as PeopleTab, label: "Org Chart", icon: TrendingUp }]
      : []),
    ...(access.showMyTeamTab
      ? [{ id: "my-team" as PeopleTab, label: "My Team", icon: Briefcase }]
      : []),
    ...(access.showAdminTab
      ? [{ id: "admin" as PeopleTab, label: "People Admin", icon: Shield }]
      : []),
  ];

  // Access context banner
  const accessNote = access.canSeeAllStaff
    ? null
    : access.canSeeSalaryAmount
      ? "Showing all staff — compensation and banking details visible per Finance access"
      : viewer
        ? `Showing ${viewer.department} staff only — contact your HR administrator for access to the full directory`
        : null;

  const usvCount = directoryStaff.filter(
    (s) => s.company === "USV" || s.company === "USV + CANONIC",
  ).length;
  const canonicCount = directoryStaff.filter(
    (s) => s.company === "CANONIC" || s.company === "USV + CANONIC",
  ).length;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-lg font-bold">People &amp; Teams</h1>
          <p className="text-sm text-muted-foreground">
            {access.canSeeAllStaff
              ? `${staffMembers.length} staff · 4 directorates · 17 departments`
              : viewer
                ? `${directoryStaff.length} staff in ${viewer.department}`
                : "Staff directory"}
          </p>
        </div>
        {access.canCreateUsers && (
          <button
            onClick={() => setShowCreateUser(true)}
            className="flex items-center gap-1.5 rounded bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" /> Add User
          </button>
        )}
      </div>

      {/* Company filter — chairman / gmd / hr only */}
      {access.showCompanyFilter && (
        <div className="flex items-center gap-1.5 rounded border border-border bg-card p-1.5">
          <span className="px-2 text-xs text-muted-foreground">Company:</span>
          {(
            [
              { key: "All" as const, label: `All Staff (${directoryStaff.length})`, color: "#345b8a" },
              { key: "USV" as const, label: `USV Dev. Services (${usvCount})`, color: "#1A3D8F" },
              { key: "CANONIC" as const, label: `Canonic Associates (${canonicCount})`, color: "#3580B5" },
            ] as const
          ).map((co) => (
            <button
              key={co.key}
              onClick={() => setCompanyFilter(co.key)}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                companyFilter === co.key ? "text-white" : "text-muted-foreground hover:bg-panel"
              }`}
              style={companyFilter === co.key ? { background: co.color } : {}}
            >
              {co.label}
            </button>
          ))}
        </div>
      )}

      {/* Access note */}
      {accessNote && (
        <div className="rounded border border-border bg-panel px-4 py-2.5 text-xs text-muted-foreground">
          {accessNote}
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-1 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 pb-3 pt-1 text-sm font-semibold transition ${
                activeTab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {activeTab === "directory" && (
        <DirectoryView
          staff={filteredByCompany}
          access={access}
          onOpenProfile={setSelectedStaff}
          onAssignTask={setAssignTarget}
        />
      )}
      {activeTab === "org-tree" && (
        <OrgTreeView
          staff={filteredByCompany}
          access={access}
          onOpenProfile={setSelectedStaff}
        />
      )}
      {activeTab === "my-team" && (
        <MyTeamView
          viewer={viewer}
          access={access}
          onOpenProfile={setSelectedStaff}
          onAssignTask={setAssignTarget}
        />
      )}
      {activeTab === "admin" && (
        <UserManagementView
          staff={staffMembers}
          access={access}
          onOpenProfile={setSelectedStaff}
          onCreateUser={() => setShowCreateUser(true)}
        />
      )}

      {/* Profile Drawer */}
      {selectedStaff && (
        <StaffProfileDrawer
          staff={selectedStaff}
          access={access}
          onClose={() => setSelectedStaff(null)}
          onAssignTask={(s) => {
            setSelectedStaff(null);
            setAssignTarget(s);
          }}
        />
      )}

      {/* Assign Task Modal */}
      {assignTarget && (
        <AssignTaskModal
          defaultAssignee={assignTarget}
          availableStaff={access.canSeeAllStaff ? staffMembers : directoryStaff}
          onClose={() => setAssignTarget(null)}
        />
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <CreateUserModal onClose={() => setShowCreateUser(false)} />
      )}
    </div>
  );
}
