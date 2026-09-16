// Seed data for the USV × CANONIC unified ERP prototype.
// Realistic Nigerian construction / consultancy operating records.

export type Company = "USV" | "CANONIC" | "USV + CANONIC";
export type Health = "healthy" | "attention" | "critical";

export const naira = (n: number) => {
  if (n >= 1_000_000_000) return "₦" + (n / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "bn";
  if (n >= 1_000_000) return "₦" + (n / 1_000_000).toFixed(0) + "m";
  if (n >= 1_000) return "₦" + (n / 1_000).toFixed(0) + "k";
  return "₦" + n.toLocaleString();
};

export const currentUser = {
  name: "Engr. Fatima Aliyu Dantata",
  initials: "AO",
  title: "GED — Projects",
  authority: "EXECUTIVE",
  company: "USV + CANONIC" as Company,
  department: "Group Projects",
};

export interface Project {
  code: string;
  name: string;
  company: Company;
  client: string;
  location: string;
  pm: string;
  phase: string;
  contractValue: number;
  progressPlanned: number;
  progressActual: number;
  health: Health;
  schedule: Health;
  cost: Health;
  procurement: Health;
  payment: Health;
  quality: Health;
  client_state: Health;
  resources: Health;
  budgetConsumed: number;
  receivablesOverdue: number;
  endDate: string;
}

export const projects: Project[] = [
  {
    code: "PRJ-USV-2026-0015",
    name: "Abuja Housing Development — Phase II",
    company: "USV + CANONIC",
    client: "Federal Housing Authority",
    location: "Lugbe, Abuja (FCT)",
    pm: "Engr. Musa Usman Lawan",
    phase: "Execution / Construction",
    contractValue: 1_380_000_000,
    progressPlanned: 62,
    progressActual: 48,
    health: "critical",
    schedule: "critical",
    cost: "attention",
    procurement: "attention",
    payment: "critical",
    quality: "healthy",
    client_state: "attention",
    resources: "attention",
    budgetConsumed: 72,
    receivablesOverdue: 85_000_000,
    endDate: "14 Aug 2026",
  },
  {
    code: "PRJ-CAN-2026-0008",
    name: "Lagos Commercial Development",
    company: "CANONIC",
    client: "Landmark Properties Ltd",
    location: "Victoria Island, Lagos",
    pm: "Arc. Hamza Ibrahim Danladi",
    phase: "Design / Technical Preparation",
    contractValue: 640_000_000,
    progressPlanned: 40,
    progressActual: 38,
    health: "healthy",
    schedule: "healthy",
    cost: "healthy",
    procurement: "healthy",
    payment: "healthy",
    quality: "healthy",
    client_state: "attention",
    resources: "healthy",
    budgetConsumed: 34,
    receivablesOverdue: 0,
    endDate: "30 Nov 2026",
  },
  {
    code: "PRJ-USV-2026-0021",
    name: "Government Office Complex",
    company: "USV + CANONIC",
    client: "Kaduna State Government",
    location: "Kaduna",
    pm: "Engr. Musa Usman Lawan",
    phase: "Procurement",
    contractValue: 2_150_000_000,
    progressPlanned: 28,
    progressActual: 24,
    health: "attention",
    schedule: "attention",
    cost: "healthy",
    procurement: "critical",
    payment: "healthy",
    quality: "healthy",
    client_state: "healthy",
    resources: "attention",
    budgetConsumed: 21,
    receivablesOverdue: 0,
    endDate: "12 Mar 2027",
  },
  {
    code: "PRJ-USV-2026-0009",
    name: "Port Harcourt Logistics Warehouse",
    company: "USV",
    client: "Delta Freight Nigeria",
    location: "Port Harcourt, Rivers",
    pm: "Engr. Zainab Abubakar Waziri",
    phase: "Execution / Construction",
    contractValue: 480_000_000,
    progressPlanned: 78,
    progressActual: 79,
    health: "healthy",
    schedule: "healthy",
    cost: "healthy",
    procurement: "healthy",
    payment: "attention",
    quality: "healthy",
    client_state: "healthy",
    resources: "healthy",
    budgetConsumed: 74,
    receivablesOverdue: 22_000_000,
    endDate: "05 Jun 2026",
  },
  {
    code: "PRJ-CAN-2026-0012",
    name: "Enugu Medical Centre — Design & Supervision",
    company: "CANONIC",
    client: "Enugu State Ministry of Health",
    location: "Enugu",
    pm: "Arc. Safiya Garba Aliyu",
    phase: "Monitoring",
    contractValue: 310_000_000,
    progressPlanned: 55,
    progressActual: 42,
    health: "attention",
    schedule: "attention",
    cost: "attention",
    procurement: "healthy",
    payment: "attention",
    quality: "attention",
    client_state: "critical",
    resources: "attention",
    budgetConsumed: 58,
    receivablesOverdue: 41_000_000,
    endDate: "22 Sep 2026",
  },
  {
    code: "PRJ-USV-2025-0044",
    name: "Ibadan Ring Road Rehabilitation",
    company: "USV",
    client: "Oyo State Government",
    location: "Ibadan, Oyo",
    pm: "Engr. Zainab Abubakar Waziri",
    phase: "Completion",
    contractValue: 920_000_000,
    progressPlanned: 100,
    progressActual: 96,
    health: "attention",
    schedule: "attention",
    cost: "healthy",
    procurement: "healthy",
    payment: "healthy",
    quality: "attention",
    client_state: "healthy",
    resources: "healthy",
    budgetConsumed: 91,
    receivablesOverdue: 0,
    endDate: "18 May 2026",
  },
];

export interface ActionItem {
  id: string;
  title: string;
  why: string;
  type: string;
  project: string;
  company: Company;
  responsible: string;          // actual person/role name, NOT "You (X)"
  responsibleRole?: string[];   // which userRoles map to "you" for this item
  requester?: string;           // who submitted/initiated this
  submittedDate?: string;       // when it was submitted
  approvalChain?: {             // mini workflow steps
    step: string;
    person?: string;
    status: "done" | "current" | "pending";
    date?: string;
  }[];
  priority: "Urgent" | "High" | "Normal";
  due: string;
  overdue?: boolean;
  status: string;
  action: string;
  /** Who issued this directive — person, role, or system event that triggered the action */
  directedBy?: string;
  // Roles that should see this action; undefined means exec-only
  allowedRoles?: UserRole[];
}

export const actions: ActionItem[] = [
  {
    id: "APR-2026-0231",
    title: "Approve reinforcement steel purchase — 42T Y16/Y12",
    why: "Foundation works blocked pending material. GGMP instruction issued.",
    type: "Procurement Approval",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "GED: Projects (Engr. Fatima Aliyu Dantata)",
    responsibleRole: ["ged", "chairman", "gmd", "ggmp"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "Today 08:00",
    approvalChain: [
      { step: "PM Recommendation", person: "Engr. Musa Usman Lawan", status: "done", date: "Today 08:00" },
      { step: "GED / Executive Authority", status: "current" },
      { step: "Procurement Issue PO", status: "pending" },
      { step: "Finance Disbursement", status: "pending" },
    ],
    priority: "Urgent",
    due: "Today, 16:00",
    overdue: false,
    status: "Awaiting your approval",
    action: "Review & Approve",
    directedBy: "Barr. Hauwa Suleiman Abubakar — GGMP (Group General Manager, Operations)",
    allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp"],
  },
  {
    id: "VAR-PRJ001-003",
    title: "Variation — revised foundation design (+₦180m)",
    why: "Ground conditions differ from geotechnical report. Client submission pending internal sign-off.",
    type: "Variation Approval",
    project: "Abuja Housing Development — Phase II",
    company: "USV + CANONIC",
    responsible: "GED: Projects (Engr. Fatima Aliyu Dantata)",
    responsibleRole: ["ged", "chairman", "gmd", "ggmp", "ed"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "05 Sep 2026",
    approvalChain: [
      { step: "QS Assessment", person: "QS Haruna Sani Gombe", status: "done", date: "02 Sep" },
      { step: "PM Sign-off", person: "Engr. Musa Usman Lawan", status: "done", date: "03 Sep" },
      { step: "GED Authority", status: "current" },
      { step: "Client Submission", status: "pending" },
    ],
    priority: "Urgent",
    due: "Overdue 1 day",
    overdue: true,
    status: "Awaiting authorisation",
    action: "Review Variation",
    directedBy: "Engr. Musa Usman Lawan — Senior PM (scope change triggered by geotechnical re-assessment)",
    allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "pm", "project-coordinator"],
  },
  {
    id: "INV-USV-2026-0044",
    title: "Overdue receivable — Milestone 3 valuation",
    why: "₦85m invoice 34 days overdue. Client finance unresponsive to 2 reminders.",
    type: "Receivable Escalation",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Finance Manager + Executive Authority",
    responsibleRole: ["ged", "ed", "chairman", "gmd", "ggmp", "finance", "accountant"],
    requester: "Engr. Fatima Aliyu Dantata, GED Projects",
    submittedDate: "03 Aug 2026 (34 days overdue)",
    approvalChain: [
      { step: "Invoice Submitted to Client", status: "done", date: "03 Aug" },
      { step: "First Reminder Sent", status: "done", date: "20 Aug" },
      { step: "Second Reminder Sent", status: "done", date: "01 Sep" },
      { step: "Legal / Executive Escalation", status: "current" },
    ],
    priority: "High",
    due: "Overdue 34 days",
    overdue: true,
    status: "Escalated to management",
    action: "View & Escalate",
    directedBy: "Engr. Fatima Aliyu Dantata — GED, Projects (escalation instruction ref INV-USV-2026-0044)",
    allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "finance", "accountant"],
  },
  {
    id: "DRW-CAN-0442",
    title: "Approve Ground Floor GA drawing — Rev C",
    why: "Detailed design cannot proceed until GA approved. Client review complete.",
    type: "Design Approval",
    project: "Lagos Commercial Development",
    company: "CANONIC",
    responsible: "Head of Architecture (Arc. Hamza Ibrahim Danladi)",
    responsibleRole: ["head-architect", "ged", "chairman", "gmd", "ggmp", "ed"],
    requester: "Arc. Safiya Garba Aliyu, Architect Officer",
    submittedDate: "04 Sep 2026",
    approvalChain: [
      { step: "Drawing Prepared", person: "Arc. Safiya Garba Aliyu", status: "done", date: "04 Sep" },
      { step: "Client Review Completed", status: "done", date: "05 Sep" },
      { step: "Head of Architecture Sign-off", status: "current" },
      { step: "Issue for Construction", status: "pending" },
    ],
    priority: "Normal",
    due: "Tomorrow",
    status: "Awaiting review",
    action: "Review Drawing",
    directedBy: "Arc. Hamza Ibrahim Danladi — Head of Architecture (design release instruction)",
    allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "head-architect", "architect"],
  },
  {
    id: "BOQ-PRJ021-04",
    title: "Review BOQ Revision 04 — MEP re-measure",
    why: "Commercial re-measure changes tender sum by ₦46m. Needs QS head confirmation.",
    type: "BOQ Review",
    project: "Government Office Complex",
    company: "USV + CANONIC",
    responsible: "Head of Quantity Surveying (QS Haruna Sani Gombe)",
    responsibleRole: ["head-qs", "qs", "ged", "chairman", "gmd", "ggmp", "pm", "project-coordinator"],
    requester: "Mr. Ismail Sule Waziri, Junior QS",
    submittedDate: "05 Sep 2026",
    approvalChain: [
      { step: "BOQ Revision Prepared", person: "Mr. Ismail Sule Waziri", status: "done", date: "05 Sep" },
      { step: "Head QS Review", status: "current" },
      { step: "PM Commercial Approval", status: "pending" },
      { step: "GED Authority (>₦40m variance)", status: "pending" },
    ],
    priority: "Normal",
    due: "In 2 days",
    status: "Awaiting review",
    action: "Open BOQ",
    directedBy: "QS Haruna Sani Gombe — Head of Quantity Surveying (re-measure instruction post-design change)",
    allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "head-qs", "qs", "pm", "project-coordinator"],
  },
  {
    id: "INS-2026-0087",
    title: "Verify GMD instruction — expedite Kaduna procurement",
    why: "GMD instructed procurement of curtain-wall system by 12 Sep. Evidence required.",
    type: "Instruction Verification",
    project: "Government Office Complex",
    company: "USV",
    responsible: "Procurement Manager (Alhaji Sani Abubakar)",
    responsibleRole: ["procurement-manager", "ged", "chairman", "gmd", "ggmp", "pm", "project-coordinator"],
    requester: "Dr. Ibrahim Umar Garba, GMD",
    submittedDate: "04 Sep 2026",
    approvalChain: [
      { step: "GMD Verbal Instruction Issued", person: "Dr. Ibrahim Umar Garba", status: "done", date: "04 Sep" },
      { step: "PM Instruction Log Recorded", status: "done", date: "05 Sep" },
      { step: "Procurement Evidence Submission", status: "current" },
      { step: "GMD Verification", status: "pending" },
    ],
    priority: "High",
    due: "12 Sep 2026",
    status: "Execution in progress",
    action: "Verify Evidence",
    directedBy: "Dr. Ibrahim Umar Garba — GMD (verbal instruction ref GMD-INS-2026-0087 dated 04 Sep)",
    allowedRoles: ["chairman", "gmd", "ged", "ed", "ggmp", "pm", "project-coordinator", "planner"],
  },
  {
    id: "HR-2026-0041",
    title: "Process leave application — 4 pending approvals",
    why: "Leave requests submitted by staff are awaiting HR head approval. SLA: 48 hours.",
    type: "Leave Approval",
    project: "Group Administration",
    company: "USV + CANONIC",
    responsible: "Mrs. Zainab Umar Lawan, Head of Admin & HR",
    responsibleRole: ["head-admin", "admin", "chairman", "gmd"],
    requester: "4 Staff Members (via NEXUS HR Portal)",
    submittedDate: "Oldest: 03 Sep 2026",
    approvalChain: [
      { step: "Staff Applications Submitted", status: "done", date: "03–06 Sep" },
      { step: "HR Head Review", status: "current" },
      { step: "Staff Notification", status: "pending" },
      { step: "HR Records Updated", status: "pending" },
    ],
    priority: "High",
    due: "Today",
    overdue: false,
    status: "Awaiting HR approval",
    action: "Review Applications",
    directedBy: "Staff submissions via NEXUS HR Portal (4 leave requests pending — see HR module)",
    allowedRoles: ["head-admin", "admin", "chairman", "gmd"],
  },
  {
    id: "HR-2026-0042",
    title: "Onboard new joiners — September intake (3 staff)",
    why: "Three new staff members start 08 Sep. Accounts, access and induction packs required.",
    type: "Staff Onboarding",
    project: "Group Administration",
    company: "USV + CANONIC",
    responsible: "Mrs. Zainab Umar Lawan, Head of Admin & HR",
    responsibleRole: ["head-admin", "admin"],
    requester: "Group HR — Offer Letters Approved 28 Aug",
    submittedDate: "28 Aug 2026",
    approvalChain: [
      { step: "Offer Letters Signed", status: "done", date: "28 Aug" },
      { step: "Contract Issued", status: "done", date: "01 Sep" },
      { step: "IT Account Provisioning", status: "current" },
      { step: "Induction Completed", status: "pending" },
    ],
    priority: "Urgent",
    due: "08 Sep 2026",
    overdue: false,
    status: "In progress",
    action: "Complete Onboarding",
    directedBy: "Mrs. Zainab Umar Lawan — Head of HR & Admin (new hire offer letters approved 28 Aug)",
    allowedRoles: ["head-admin", "admin", "ict-admin"],
  },
  {
    id: "HR-2026-0043",
    title: "Monthly payroll verification — September 2026",
    why: "Payroll run requires HR sign-off before finance can disburse. Deadline: 10 Sep.",
    type: "Payroll Review",
    project: "Group Administration",
    company: "USV + CANONIC",
    responsible: "Mrs. Zainab Umar Lawan, Head of Admin & HR",
    responsibleRole: ["head-admin", "admin", "chairman", "gmd"],
    requester: "Mrs. Maryam Kabiru Suleiman, Finance Manager",
    submittedDate: "06 Sep 2026",
    approvalChain: [
      { step: "Finance Payroll Run Initiated", person: "Mrs. Maryam Kabiru Suleiman", status: "done", date: "06 Sep" },
      { step: "HR Verification", status: "current" },
      { step: "Finance Bank Transfer", status: "pending" },
      { step: "PAYE / Pension Remittance", status: "pending" },
    ],
    priority: "Urgent",
    due: "10 Sep 2026",
    overdue: false,
    status: "Awaiting HR verification",
    action: "Verify & Sign Off",
    directedBy: "Mrs. Maryam Kabiru Suleiman — Finance Manager (payroll run initiated, HR sign-off required)",
    allowedRoles: ["head-admin", "admin", "chairman", "gmd"],
  },
  {
    id: "HR-2026-0044",
    title: "Staff disciplinary matter — review case file",
    why: "One staff member on formal warning. Case file review required within 5 working days.",
    type: "HR Action",
    project: "Group Administration",
    company: "USV",
    responsible: "Mrs. Zainab Umar Lawan, Head of Admin & HR",
    responsibleRole: ["head-admin", "admin", "chairman", "gmd"],
    requester: "Internal HR Policy Trigger",
    submittedDate: "04 Sep 2026 (formal warning issued)",
    approvalChain: [
      { step: "Formal Warning Issued", status: "done", date: "04 Sep" },
      { step: "Case File Review", status: "current" },
      { step: "HR Panel Decision", status: "pending" },
      { step: "ED Sign-off if Dismissal", status: "pending" },
    ],
    priority: "High",
    due: "11 Sep 2026",
    overdue: false,
    status: "Under review",
    action: "Review Case",
    directedBy: "Internal HR Policy — formal warning issued 04 Sep 2026; review due within 5 working days",
    allowedRoles: ["head-admin", "admin", "chairman", "gmd"],
  },
  {
    id: "ICT-2026-0031",
    title: "New user accounts — September intake provisioning",
    why: "IT accounts, email and NEXUS access needed for 3 new joiners before 08 Sep.",
    type: "User Provisioning",
    project: "ICT & Systems",
    company: "USV + CANONIC",
    responsible: "Mr. Haruna Ibrahim Kure, Head of ICT",
    responsibleRole: ["ict-admin", "head-admin"],
    requester: "Mrs. Zainab Umar Lawan, Head of Admin & HR",
    submittedDate: "06 Sep 2026",
    approvalChain: [
      { step: "HR Onboarding Request", person: "Mrs. Zainab Umar Lawan", status: "done", date: "06 Sep" },
      { step: "ICT Account Provisioning", status: "current" },
      { step: "Access Tested & Confirmed", status: "pending" },
    ],
    priority: "Urgent",
    due: "07 Sep 2026",
    overdue: false,
    status: "Pending provisioning",
    action: "Create Accounts",
    directedBy: "Mrs. Zainab Umar Lawan — Head of HR & Admin (new joiners confirmed, ICT provisioning required)",
    allowedRoles: ["ict-admin", "head-admin"],
  },
  {
    id: "AUD-2026-0018",
    title: "Q3 internal audit — data request from Finance Directorate",
    why: "Audit team requires financial reconciliation data for Q3 review. Due 09 Sep.",
    type: "Audit Request",
    project: "Internal Audit",
    company: "USV + CANONIC",
    responsible: "Internal Audit Team",
    responsibleRole: ["auditor", "chairman", "gmd"],
    requester: "Board Audit Committee",
    submittedDate: "04 Sep 2026",
    approvalChain: [
      { step: "Board Audit Mandate Issued", status: "done", date: "01 Sep" },
      { step: "Finance Data Collection", status: "current" },
      { step: "Audit Review & Fieldwork", status: "pending" },
      { step: "Audit Report to Board", status: "pending" },
    ],
    priority: "High",
    due: "09 Sep 2026",
    overdue: false,
    status: "Data collection in progress",
    action: "Submit Data",
    directedBy: "Board Audit Committee — Q3 audit plan approved by Chairman; Finance must cooperate fully",
    allowedRoles: ["auditor", "chairman", "gmd"],
  },

  // ── Site / Field roles ──
  {
    id: "SR-PRJ001-083",
    title: "Submit daily site report — Abuja Housing Ph. II (Block C)",
    why: "Daily site report due before 17:00. PM requires today's progress for client update.",
    type: "Site Report",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Mr. Sa'adu Usman Garba, Site Officer",
    responsibleRole: ["site", "site-supervisor", "project-coordinator", "pm"],
    requester: "Engr. Musa Usman Lawan, Senior PM (standing instruction)",
    submittedDate: "Daily — due today 17:00",
    approvalChain: [
      { step: "Site Activities Completed", status: "done", date: "Today" },
      { step: "Site Report Compiled & Submitted", status: "current" },
      { step: "PM Review", status: "pending" },
      { step: "Client Progress Update", status: "pending" },
    ],
    priority: "Urgent",
    due: "Today, 17:00",
    overdue: false,
    status: "Not yet submitted",
    action: "Submit Report",
    directedBy: "Engr. Musa Usman Lawan — Senior PM (daily reporting protocol, project standing instruction)",
    allowedRoles: ["site", "site-supervisor", "project-coordinator", "pm"],
  },
  {
    id: "MAT-2026-0044",
    title: "Confirm delivery — 42T reinforcement steel (Julius Steel)",
    why: "Delivery arrived on site. GRN must be signed and logged before unloading can proceed.",
    type: "Material Delivery",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Mr. Sa'adu Usman Garba, Site Officer",
    responsibleRole: ["site", "site-supervisor", "project-coordinator"],
    requester: "Alhaji Sani Abubakar, Procurement Manager",
    submittedDate: "Today (delivery arrived on site)",
    approvalChain: [
      { step: "PO Issued to Julius Steel Ltd", person: "Alhaji Sani Abubakar", status: "done", date: "02 Sep" },
      { step: "Delivery Arrived on Site", status: "done", date: "Today" },
      { step: "Site GRN Sign-off", status: "current" },
      { step: "Procurement System Update", status: "pending" },
    ],
    priority: "Urgent",
    due: "Today",
    overdue: false,
    status: "Pending GRN confirmation",
    action: "Confirm & Sign GRN",
    directedBy: "Alhaji Sani Abubakar — Procurement Manager (PO-USV-2026-0088 delivery GRN required)",
    allowedRoles: ["site", "site-supervisor", "project-coordinator"],
  },
  {
    id: "SAFE-2026-0011",
    title: "Weekly HSE inspection — submit signed checklist",
    why: "Mandatory weekly HSE inspection overdue by 1 day. Site continues at risk without sign-off.",
    type: "Safety Inspection",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Mr. Sa'adu Usman Garba, Site Officer",
    responsibleRole: ["site", "site-supervisor"],
    requester: "Engr. Suleiman Garba Jabo, Site Supervisor (HSE standing requirement)",
    submittedDate: "Weekly — overdue 1 day",
    approvalChain: [
      { step: "Inspection Conducted", status: "current" },
      { step: "Checklist Signed & Submitted", status: "pending" },
      { step: "PM Sign-off", status: "pending" },
    ],
    priority: "High",
    due: "Overdue 1 day",
    overdue: true,
    status: "Overdue",
    action: "Submit Checklist",
    directedBy: "Engr. Jamilu Umar Sani — Site Supervisor (mandatory HSE standing instruction, weekly schedule)",
    allowedRoles: ["site", "site-supervisor"],
  },

  // ── QS roles ──
  {
    id: "VAL-PRJ001-003",
    title: "Prepare interim valuation — Subcontractor blockwork (Val. 2)",
    why: "Subcontractor submitted claim. QS must measure and certify within 5 days per contract.",
    type: "Valuation",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Mr. Ismail Sule Waziri, Quantity Surveyor",
    responsibleRole: ["qs", "head-qs"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "06 Sep 2026 (claim filed)",
    approvalChain: [
      { step: "Subcontractor Claim Filed", status: "done", date: "06 Sep" },
      { step: "QS Measurement & Certification", status: "current" },
      { step: "PM Commercial Review", status: "pending" },
      { step: "Finance Approval & Payment", status: "pending" },
    ],
    priority: "High",
    due: "12 Sep 2026",
    overdue: false,
    status: "Measurement in progress",
    action: "Submit Valuation",
    directedBy: "Engr. Musa Usman Lawan — Senior PM (contract clause 18.3; subcontractor claim filed 06 Sep)",
    allowedRoles: ["qs", "head-qs"],
  },
  {
    id: "VAR-QS-0031",
    title: "Cost assessment — Variation VO-031 (MEP re-route)",
    why: "Site instruction issued. Variation must be costed and submitted to PM for approval within 48h.",
    type: "Variation Costing",
    project: "Government Office Complex",
    company: "USV + CANONIC",
    responsible: "Mr. Ismail Sule Waziri, Quantity Surveyor",
    responsibleRole: ["qs", "head-qs", "pm"],
    requester: "Arc. Safiya Garba Aliyu, Architect (Site Instruction SI-031)",
    submittedDate: "09 Sep 2026",
    approvalChain: [
      { step: "Site Instruction Issued", person: "Arc. Safiya Garba Aliyu", status: "done", date: "09 Sep" },
      { step: "QS Cost Assessment", status: "current" },
      { step: "PM Approval", status: "pending" },
      { step: "GED Authority (>₦10m)", status: "pending" },
    ],
    priority: "High",
    due: "11 Sep 2026",
    overdue: false,
    status: "Awaiting cost assessment",
    action: "Submit Cost Report",
    directedBy: "Arc. Safiya Garba Aliyu — Architect (Site Instruction SI-031 issued 09 Sep; MEP re-route scope)",
    allowedRoles: ["qs", "head-qs", "pm"],
  },

  // ── Procurement roles ──
  {
    id: "PO-USV-2026-0088",
    title: "Issue purchase order — curtain wall (Cladtech Nigeria Ltd)",
    why: "Procurement committee approved vendor. PO must be issued within 24h per vendor MoU.",
    type: "Purchase Order",
    project: "Government Office Complex",
    company: "USV + CANONIC",
    responsible: "Miss Ramatu Yusuf Waziri, Procurement Officer",
    responsibleRole: ["procurement", "procurement-manager"],
    requester: "Alhaji Sani Abubakar, Procurement Manager",
    submittedDate: "09 Sep 2026",
    approvalChain: [
      { step: "Procurement Committee Approval", person: "Alhaji Sani Abubakar", status: "done", date: "08 Sep" },
      { step: "PO Preparation", status: "done", date: "09 Sep" },
      { step: "PO Issue to Cladtech", status: "current" },
      { step: "Vendor Acknowledgement", status: "pending" },
    ],
    priority: "Urgent",
    due: "Today",
    overdue: false,
    status: "Awaiting PO issue",
    action: "Issue PO",
    directedBy: "Alhaji Sani Abubakar — Procurement Manager (committee approval PCO-2026-031 dated 08 Sep)",
    allowedRoles: ["procurement", "procurement-manager"],
  },
  {
    id: "RFQ-2026-0029",
    title: "Request quotations — roofing membrane (3 vendors)",
    why: "Roof works commence Oct 2026. Need 3 comparable quotes by 15 Sep for committee review.",
    type: "Procurement",
    project: "Lagos Commercial Development",
    company: "CANONIC",
    responsible: "Miss Ramatu Yusuf Waziri, Procurement Officer",
    responsibleRole: ["procurement"],
    requester: "Alhaji Sani Abubakar, Procurement Manager",
    submittedDate: "06 Sep 2026",
    approvalChain: [
      { step: "Procurement Request Raised", status: "done", date: "06 Sep" },
      { step: "Vendor Shortlist & RFQ Issue", status: "current" },
      { step: "Quote Comparison", status: "pending" },
      { step: "Committee Recommendation", status: "pending" },
    ],
    priority: "Normal",
    due: "15 Sep 2026",
    overdue: false,
    status: "In progress",
    action: "Send RFQs",
    directedBy: "Alhaji Sani Abubakar — Procurement Manager (project programme schedule requirement)",
    allowedRoles: ["procurement"],
  },

  // ── Finance / Accounts roles ──
  {
    id: "PAY-FIN-2026-0061",
    title: "Process supplier payment — Julius Steel Ltd (₦63.4m)",
    why: "Approved payment certificate PAY-USV-2026-0051. Must be processed before banking cut-off today.",
    type: "Payment Processing",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Mrs. Maryam Kabiru Suleiman, Finance Manager",
    responsibleRole: ["finance", "accountant"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "Today (banking cut-off: 14:00)",
    approvalChain: [
      { step: "Payment Cert Approved by GED", status: "done", date: "05 Sep" },
      { step: "Finance Processing", status: "current" },
      { step: "Bank Transfer Initiated", status: "pending" },
      { step: "Vendor Payment Confirmation", status: "pending" },
    ],
    priority: "Urgent",
    due: "Today, 14:00",
    overdue: false,
    status: "Disbursement pending",
    action: "Process Payment",
    directedBy: "Engr. Musa Usman Lawan — Senior PM (payment cert PAY-USV-2026-0051 approved by GED 05 Sep)",
    allowedRoles: ["finance", "accountant"],
  },
  {
    id: "REC-2026-0019",
    title: "September bank reconciliation — Access Bank main account",
    why: "Monthly reconciliation due. Unreconciled balance of ₦2.1m flagged. Must close before 10 Sep.",
    type: "Reconciliation",
    project: "Finance — Group Accounts",
    company: "USV + CANONIC",
    responsible: "Mr. Haruna Abubakar Wali, Accountant",
    responsibleRole: ["finance", "accountant"],
    requester: "Mrs. Maryam Kabiru Suleiman, Finance Manager",
    submittedDate: "01 Sep 2026",
    approvalChain: [
      { step: "Bank Statement Received", status: "done", date: "01 Sep" },
      { step: "Reconciliation in Progress", status: "current" },
      { step: "Finance Manager Review", status: "pending" },
      { step: "Month-End Close", status: "pending" },
    ],
    priority: "High",
    due: "10 Sep 2026",
    overdue: false,
    status: "In progress",
    action: "Complete Reconciliation",
    directedBy: "Mrs. Maryam Kabiru Suleiman — Finance Manager (monthly closing procedure, statutory obligation)",
    allowedRoles: ["finance", "accountant"],
  },
  {
    id: "INV-REV-2026-0031",
    title: "Review and post 4 contractor invoices — Abuja Housing Ph. II",
    why: "Invoices received and approved. Posting required to update project cost ledger.",
    type: "Invoice Review",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Mr. Haruna Abubakar Wali, Accountant",
    responsibleRole: ["finance", "accountant"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "06 Sep 2026",
    approvalChain: [
      { step: "Invoices Received & Approved by PM", status: "done", date: "06 Sep" },
      { step: "Finance Review & Posting", status: "current" },
      { step: "Ledger Updated", status: "pending" },
    ],
    priority: "Normal",
    due: "11 Sep 2026",
    overdue: false,
    status: "Pending finance review",
    action: "Review Invoices",
    directedBy: "Engr. Musa Usman Lawan — Senior PM (invoices approved in payment cert cycle; posting required)",
    allowedRoles: ["finance", "accountant"],
  },

  {
    id: "PAYROLL-FIN-2026-009",
    title: "Disburse September payroll — HR sign-off received",
    why: "HR has verified and signed off September payroll. Finance must initiate bank transfers before 10 Sep cut-off.",
    type: "Payroll Disbursement",
    project: "Finance — Payroll",
    company: "USV + CANONIC",
    responsible: "Mrs. Maryam Kabiru Suleiman, Finance Manager",
    responsibleRole: ["finance", "accountant"],
    requester: "Mrs. Zainab Umar Lawan, Head of HR & Admin",
    submittedDate: "09 Sep 2026",
    approvalChain: [
      { step: "HR Payroll Verified & Signed Off", person: "Mrs. Zainab Umar Lawan", status: "done", date: "09 Sep" },
      { step: "Finance Bank Transfer Initiation", status: "current" },
      { step: "PAYE / Pension Remittance", status: "pending" },
    ],
    priority: "Urgent",
    due: "10 Sep 2026",
    overdue: false,
    status: "HR-verified; awaiting finance transfer",
    action: "Initiate Transfer",
    directedBy: "Mrs. Zainab Umar Lawan — Head of HR & Admin (payroll sign-off ref HR-2026-0043 completed 09 Sep)",
    allowedRoles: ["finance", "accountant"],
  },
  {
    id: "CERT-FIN-2026-012",
    title: "Approve payment certificate — subcontractor blockwork Val. 2 (₦31.8m)",
    why: "QS-certified subcontractor valuation received. Finance must approve and schedule disbursement per contract milestone.",
    type: "Payment Certificate",
    project: "Port Harcourt Logistics Warehouse",
    company: "USV",
    responsible: "Mrs. Maryam Kabiru Suleiman, Finance Manager",
    responsibleRole: ["finance"],
    requester: "QS Haruna Sani Gombe, Head of Quantity Surveying",
    submittedDate: "07 Sep 2026",
    approvalChain: [
      { step: "QS Valuation Certified", person: "QS Haruna Sani Gombe", status: "done", date: "07 Sep" },
      { step: "Finance Approval & Schedule", status: "current" },
      { step: "Payment to Subcontractor", status: "pending" },
    ],
    priority: "High",
    due: "11 Sep 2026",
    overdue: false,
    status: "Awaiting finance approval",
    action: "Approve & Schedule",
    directedBy: "QS Haruna Sani Gombe — Head of QS (Valuation VAL-PRJ001-003 certified and submitted 07 Sep)",
    allowedRoles: ["finance"],
  },
  {
    id: "VAT-2026-009",
    title: "File August VAT return — FIRS e-filing portal",
    why: "VAT returns for August 2026 due 21 Sep. Late filing attracts 10% penalty on tax payable plus interest.",
    type: "Statutory Filing",
    project: "Finance — Statutory Compliance",
    company: "USV + CANONIC",
    responsible: "Mr. Haruna Abubakar Wali, Accountant",
    responsibleRole: ["finance", "accountant"],
    requester: "FIRS Statutory Obligation",
    submittedDate: "Due 21 Sep 2026",
    approvalChain: [
      { step: "VAT Computation Prepared", status: "current" },
      { step: "Finance Manager Review", status: "pending" },
      { step: "FIRS e-Filing Portal Submission", status: "pending" },
    ],
    priority: "High",
    due: "21 Sep 2026",
    overdue: false,
    status: "In preparation",
    action: "Submit Return",
    directedBy: "Mrs. Maryam Kabiru Suleiman — Finance Manager (statutory obligation, FIRS circular VAT/2026/08)",
    allowedRoles: ["finance", "accountant"],
  },
  {
    id: "PAYE-2026-009",
    title: "Remit September PAYE & pension — FIRS / Stanbic IBTC",
    why: "PAYE and pension contributions must be remitted by 10th of the following month. Payroll values confirmed.",
    type: "Statutory Remittance",
    project: "Finance — Statutory Compliance",
    company: "USV + CANONIC",
    responsible: "Mr. Haruna Abubakar Wali, Accountant",
    responsibleRole: ["finance", "accountant"],
    requester: "Statutory Requirement (FIRS)",
    submittedDate: "Due 10 Sep 2026",
    approvalChain: [
      { step: "Payroll Values Confirmed", status: "done", date: "09 Sep" },
      { step: "PAYE / Pension Remittance", status: "current" },
      { step: "FIRS Confirmation Received", status: "pending" },
    ],
    priority: "Urgent",
    due: "10 Sep 2026",
    overdue: false,
    status: "Pending remittance",
    action: "Process Remittance",
    directedBy: "Mrs. Maryam Kabiru Suleiman — Finance Manager (payroll confirmed; PAYE/pension schedule ref)",
    allowedRoles: ["finance", "accountant"],
  },

  // ── Procurement additions ──
  {
    id: "VEN-PRE-2026-007",
    title: "Complete prequalification assessment — 2 new material suppliers",
    why: "Northgate Metals and Abuja Steel Hub submitted PQ documents. Procurement must assess and recommend within 7 days.",
    type: "Vendor Prequalification",
    project: "Group Procurement",
    company: "USV + CANONIC",
    responsible: "Miss Ramatu Yusuf Waziri, Procurement Officer",
    responsibleRole: ["procurement", "procurement-manager"],
    requester: "Alhaji Sani Abubakar, Procurement Manager",
    submittedDate: "07 Sep 2026",
    approvalChain: [
      { step: "Vendors Submit PQ Documents", status: "done", date: "07 Sep" },
      { step: "Procurement Assessment", status: "current" },
      { step: "Committee Recommendation", status: "pending" },
      { step: "Approved Vendor List Updated", status: "pending" },
    ],
    priority: "Normal",
    due: "14 Sep 2026",
    overdue: false,
    status: "Documents under review",
    action: "Submit Assessment",
    directedBy: "Alhaji Sani Abubakar — Procurement Manager (vendors applied 07 Sep; PQ assessment required)",
    allowedRoles: ["procurement", "procurement-manager"],
  },
  {
    id: "GRN-2026-044",
    title: "Reconcile GRNs — reinforcement steel delivery (42T, Julius Steel)",
    why: "Site GRN signed but not yet matched to PO in system. Must reconcile before invoice can be approved for payment.",
    type: "GRN Reconciliation",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Miss Ramatu Yusuf Waziri, Procurement Officer",
    responsibleRole: ["procurement", "procurement-manager"],
    requester: "Mr. Sa'adu Usman Garba, Site Officer",
    submittedDate: "Today (GRN signed on site)",
    approvalChain: [
      { step: "Delivery Received & GRN Signed", status: "done", date: "Today" },
      { step: "Procurement System GRN Entry", status: "current" },
      { step: "PO Matching Complete", status: "pending" },
      { step: "Finance Invoice Processing", status: "pending" },
    ],
    priority: "High",
    due: "Today",
    overdue: false,
    status: "GRN received; pending system entry",
    action: "Reconcile GRN",
    allowedRoles: ["procurement", "procurement-manager"],
  },

  // ── Auditor additions ──
  {
    id: "AUD-2026-019",
    title: "Q3 risk register — reassess 3 open financial risks",
    why: "Board mandates quarterly risk register review. Three financial and operational risks require reassessment before board report.",
    type: "Risk Management",
    project: "Internal Audit",
    company: "USV + CANONIC",
    responsible: "Internal Audit Team",
    responsibleRole: ["auditor"],
    requester: "Board Audit Committee",
    submittedDate: "Quarterly cycle — due 15 Sep",
    approvalChain: [
      { step: "Board Mandate Issued", status: "done", date: "01 Sep" },
      { step: "Risk Register Reassessment", status: "current" },
      { step: "Management Review", status: "pending" },
      { step: "Board Report Submission", status: "pending" },
    ],
    priority: "Normal",
    due: "15 Sep 2026",
    overdue: false,
    status: "Pending review",
    action: "Update Register",
    allowedRoles: ["auditor"],
  },
  {
    id: "AUD-2026-020",
    title: "Follow up — Q2 management action plan (3 items overdue for closure)",
    why: "Three management action items from Q2 audit remain open past agreed closure dates. Escalation to GMD may be required.",
    type: "Audit Follow-up",
    project: "Internal Audit",
    company: "USV + CANONIC",
    responsible: "Internal Audit Team",
    responsibleRole: ["auditor"],
    requester: "Internal Audit Plan",
    submittedDate: "Ongoing — 3 items past closure date",
    approvalChain: [
      { step: "Q2 Audit Complete", status: "done", date: "30 Jun" },
      { step: "Management Actions Agreed", status: "done", date: "15 Jul" },
      { step: "Follow-up & Chase", status: "current" },
      { step: "GMD Escalation (if overdue)", status: "pending" },
    ],
    priority: "High",
    due: "12 Sep 2026",
    overdue: false,
    status: "Awaiting management response",
    action: "Chase & Update",
    allowedRoles: ["auditor"],
  },

  // ── ICT Admin additions ──
  {
    id: "ICT-2026-032",
    title: "Apply NEXUS server security patch — maintenance window tonight",
    why: "Critical vulnerability patch released for ERP server. Must be applied in tonight's maintenance window to prevent exposure.",
    type: "System Maintenance",
    project: "ICT & Systems",
    company: "USV + CANONIC",
    responsible: "Mr. Haruna Ibrahim Kure, Head of ICT",
    responsibleRole: ["ict-admin"],
    requester: "Vendor Security Advisory",
    submittedDate: "Today (patch released)",
    approvalChain: [
      { step: "Patch Released by Vendor", status: "done", date: "Today" },
      { step: "Testing in Sandbox", status: "current" },
      { step: "Production Deployment Tonight", status: "pending" },
      { step: "Post-Patch Verification", status: "pending" },
    ],
    priority: "High",
    due: "Tonight, 22:00",
    overdue: false,
    status: "Patch tested in staging; ready to deploy",
    action: "Deploy Patch",
    allowedRoles: ["ict-admin"],
  },
  {
    id: "ICT-2026-033",
    title: "Microsoft 365 licence audit — identify unused seats (renewal 01 Oct)",
    why: "Annual licence renewal due 01 Oct. Unused seats must be identified and removed before renewal to avoid overpayment.",
    type: "Licence Management",
    project: "ICT & Systems",
    company: "USV + CANONIC",
    responsible: "Mr. Haruna Ibrahim Kure, Head of ICT",
    responsibleRole: ["ict-admin"],
    requester: "Vendor / Annual Licence Renewal Cycle",
    submittedDate: "Annual renewal — due 01 Oct",
    approvalChain: [
      { step: "Licence Inventory Pull", status: "current" },
      { step: "Unused Seats Identified", status: "pending" },
      { step: "Renewal Order Placed", status: "pending" },
    ],
    priority: "Normal",
    due: "22 Sep 2026",
    overdue: false,
    status: "Audit in progress",
    action: "Complete Audit",
    allowedRoles: ["ict-admin"],
  },

  // ── Site additions ──
  {
    id: "LAB-2026-041",
    title: "Submit daily labour attendance — Abuja Housing Ph. II (Block C)",
    why: "Labour attendance record required for payroll processing and site cost reporting. Must be submitted before 18:00.",
    type: "Labour Report",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Mr. Sa'adu Usman Garba, Site Officer",
    responsibleRole: ["site", "site-supervisor"],
    requester: "Engr. Musa Usman Lawan, Senior PM (standing instruction)",
    submittedDate: "Daily — due today 18:00",
    approvalChain: [
      { step: "Labour Attendance Recorded", status: "current" },
      { step: "Site Officer Submission", status: "pending" },
      { step: "PM Review", status: "pending" },
    ],
    priority: "High",
    due: "Today, 18:00",
    overdue: false,
    status: "Not yet submitted",
    action: "Submit Attendance",
    allowedRoles: ["site", "site-supervisor"],
  },

  // ── Business Development roles ──
  {
    id: "BD-2026-0041",
    title: "Submit prequalification — Abuja Metro Station Phase 3 (FCTA)",
    why: "Tender closes 15 Sep. Prequalification documents require BD lead submission.",
    type: "Tender Submission",
    project: "Business Development Pipeline",
    company: "USV",
    responsible: "BD Lead / Tender Officer",
    responsibleRole: ["business-dev", "bd-officer", "tender-officer"],
    requester: "FCTA Tender Notice",
    submittedDate: "Today (deadline 15 Sep)",
    approvalChain: [
      { step: "PQ Documents Preparation", status: "current" },
      { step: "Internal Review", status: "pending" },
      { step: "Submission to FCTA", status: "pending" },
    ],
    priority: "Urgent",
    due: "15 Sep 2026",
    overdue: false,
    status: "Documents in preparation",
    action: "Submit PQ",
    allowedRoles: ["business-dev", "bd-officer", "tender-officer"],
  },
  {
    id: "BD-2026-0042",
    title: "Update CRM — follow up with Landmark Properties (3 weeks silent)",
    why: "Key client has gone silent post-proposal. BD must re-engage before competitor does.",
    type: "Client Follow-up",
    project: "Lagos Commercial Development",
    company: "CANONIC",
    responsible: "BD Officer",
    responsibleRole: ["business-dev", "bd-officer"],
    requester: "Landmark Properties Ltd (key client, post-proposal)",
    submittedDate: "3 weeks ago (proposal submitted)",
    approvalChain: [
      { step: "Proposal Submitted", status: "done", date: "20 Aug" },
      { step: "Follow-up Attempt 1", status: "done", date: "28 Aug" },
      { step: "CRM Re-engagement", status: "current" },
    ],
    priority: "High",
    due: "Today",
    overdue: false,
    status: "Follow-up required",
    action: "Log CRM Update",
    allowedRoles: ["business-dev", "bd-officer"],
  },

  // ── PM / Project Coordinator roles ──
  {
    id: "PM-2026-0021",
    title: "Review and approve site report — Abuja Housing Block C (today)",
    why: "Site supervisor submitted report. PM must review and acknowledge within 2 hours.",
    type: "Site Report Review",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Engr. Musa Usman Lawan, Senior PM",
    responsibleRole: ["pm", "project-coordinator"],
    requester: "Mr. Sa'adu Usman Garba, Site Officer",
    submittedDate: "Today (report submitted ~17:00)",
    approvalChain: [
      { step: "Site Report Submitted", status: "done", date: "Today" },
      { step: "PM Review & Acknowledgement", status: "current" },
      { step: "Client Progress Update", status: "pending" },
    ],
    priority: "High",
    due: "Today, 19:00",
    overdue: false,
    status: "Awaiting PM review",
    action: "Review Report",
    allowedRoles: ["pm", "project-coordinator"],
  },
  {
    id: "PM-2026-0022",
    title: "Update project programme — incorporate 7-day delay (ground conditions)",
    why: "Unforeseen ground conditions caused 7-day delay. Programme must reflect revised dates for client report.",
    type: "Programme Update",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Engr. Musa Usman Lawan, Senior PM",
    responsibleRole: ["pm", "planner"],
    requester: "Site Report — Ground Condition Delay",
    submittedDate: "05 Sep 2026 (delay identified)",
    approvalChain: [
      { step: "Delay Identified on Site", status: "done", date: "05 Sep" },
      { step: "Programme Revision", status: "current" },
      { step: "GED Notification", status: "pending" },
      { step: "Client Programme Resubmission", status: "pending" },
    ],
    priority: "High",
    due: "12 Sep 2026",
    overdue: false,
    status: "Revision required",
    action: "Update Programme",
    allowedRoles: ["pm", "planner"],
  },

  // ── Architect roles ──
  {
    id: "DRW-CAN-0443",
    title: "Issue Rev D — First Floor layout (post-client comments)",
    why: "Client returned GA with 3 comments. Rev D must be issued within 48h of meeting.",
    type: "Drawing Issue",
    project: "Lagos Commercial Development",
    company: "CANONIC",
    responsible: "Arc. Safiya Garba Aliyu, Architect Officer",
    responsibleRole: ["head-architect", "architect"],
    requester: "Client (3 comments returned from meeting)",
    submittedDate: "10 Sep 2026 (client meeting)",
    approvalChain: [
      { step: "Client Comments Received", status: "done", date: "10 Sep" },
      { step: "Rev D In Progress", status: "current" },
      { step: "Head of Architecture Check", status: "pending" },
      { step: "Issue to Client", status: "pending" },
    ],
    priority: "High",
    due: "12 Sep 2026",
    overdue: false,
    status: "In progress",
    action: "Issue Drawing",
    allowedRoles: ["head-architect", "architect"],
  },

  // ── Head of Operations / Operations ──
  {
    id: "OPS-2026-001",
    title: "Approve site resource deployment — Abuja Housing Ph. II (Block C)",
    why: "Block C mobilisation is behind schedule. Site team needs 6 additional labourers and 2 plant operators drawn from the group resource pool.",
    type: "Resource Deployment",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Head of Operations",
    responsibleRole: ["head-ops"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "10 Sep 2026",
    approvalChain: [
      { step: "PM Deployment Request", status: "done", date: "10 Sep" },
      { step: "Ops Review & Approval", status: "current" },
      { step: "Resource Deployed to Site", status: "pending" },
    ],
    priority: "High",
    due: "11 Sep 2026",
    overdue: false,
    status: "Deployment plan submitted by PM",
    action: "Approve Deployment",
    allowedRoles: ["head-ops"],
  },
  {
    id: "OPS-2026-002",
    title: "Approve site mobilisation — Government Office Complex (Kaduna, 15 Sep start)",
    why: "Structural works commence 15 Sep. Site office, accommodation, equipment and personnel require formal ops mobilisation clearance.",
    type: "Site Mobilisation",
    project: "Government Office Complex",
    company: "USV",
    responsible: "Head of Operations",
    responsibleRole: ["head-ops"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "08 Sep 2026",
    approvalChain: [
      { step: "Mobilisation Plan Submitted", status: "done", date: "08 Sep" },
      { step: "Ops Clearance & Sign-off", status: "current" },
      { step: "Site Mobilised", status: "pending" },
    ],
    priority: "Urgent",
    due: "12 Sep 2026",
    overdue: false,
    status: "Mobilisation plan ready for sign-off",
    action: "Approve Mobilisation",
    allowedRoles: ["head-ops"],
  },
  {
    id: "OPS-2026-003",
    title: "Submit August operational performance report to GMD",
    why: "GMD requires monthly ops summary covering all sites, logistics efficiency, resource utilisation and subcontractor performance before board meeting.",
    type: "Operational Report",
    project: "Group Operations",
    company: "USV + CANONIC",
    responsible: "Head of Operations",
    responsibleRole: ["head-ops"],
    requester: "Dr. Ibrahim Umar Garba, GMD",
    submittedDate: "01 Sep 2026 (standing monthly requirement)",
    approvalChain: [
      { step: "Site Data Collected", status: "current" },
      { step: "Report Compiled", status: "pending" },
      { step: "Submitted to GMD", status: "pending" },
    ],
    priority: "High",
    due: "12 Sep 2026",
    overdue: false,
    status: "Data collection in progress",
    action: "Submit Report",
    allowedRoles: ["head-ops"],
  },
  {
    id: "OPS-2026-004",
    title: "Schedule fleet maintenance — 3 vehicles due service (September)",
    why: "Vehicles USV-004, USV-011 and CAN-002 are due their statutory 3-month service. Site operations will be affected if not booked this week.",
    type: "Fleet Management",
    project: "Group Operations",
    company: "USV + CANONIC",
    responsible: "Head of Operations",
    responsibleRole: ["head-ops"],
    requester: "Fleet Maintenance Schedule (statutory 3-month)",
    submittedDate: "This week (vehicles due)",
    approvalChain: [
      { step: "Vehicles Due Identified", status: "done" },
      { step: "Workshop Booking", status: "current" },
      { step: "Vehicles Serviced", status: "pending" },
    ],
    priority: "Normal",
    due: "14 Sep 2026",
    overdue: false,
    status: "Workshop booking required",
    action: "Book Service",
    allowedRoles: ["head-ops"],
  },
  {
    id: "OPS-2026-005",
    title: "Review subcontractor performance — blockwork team, Abuja Housing",
    why: "Blockwork subcontractor missed two programme milestones. Performance review required before extension of assignment.",
    type: "Subcontractor Review",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Head of Operations",
    responsibleRole: ["head-ops"],
    requester: "Engr. Musa Usman Lawan, Senior PM",
    submittedDate: "10 Sep 2026 (2nd milestone missed)",
    approvalChain: [
      { step: "Performance Issues Flagged", status: "done", date: "10 Sep" },
      { step: "Performance Review Meeting", status: "current" },
      { step: "Decision on Extension", status: "pending" },
    ],
    priority: "High",
    due: "13 Sep 2026",
    overdue: false,
    status: "Review meeting to be scheduled",
    action: "Complete Review",
    allowedRoles: ["head-ops"],
  },

  // ── Engineering roles ──
  {
    id: "ENG-2026-001",
    title: "Review & sign off structural calculations — Enugu Medical Centre (ground floor slab)",
    why: "Structural engineer submitted slab design calculations. Head of Engineering sign-off required before reinforcement can commence on site.",
    type: "Technical Review",
    project: "Enugu Medical Centre",
    company: "CANONIC",
    responsible: "Head of Engineering",
    responsibleRole: ["head-engineering"],
    requester: "Structural Engineer (site)",
    submittedDate: "11 Sep 2026",
    approvalChain: [
      { step: "Calculations Submitted", status: "done", date: "11 Sep" },
      { step: "Senior Engineering Review", status: "current" },
      { step: "Reinforcement Commencement on Site", status: "pending" },
    ],
    priority: "High",
    due: "12 Sep 2026",
    overdue: false,
    status: "Calculations submitted; awaiting senior review",
    action: "Review & Sign Off",
    allowedRoles: ["head-engineering"],
  },
  {
    id: "ENG-2026-002",
    title: "Respond to Technical Query TQ-031 — column grid deviation (Abuja Housing, grids C4–C7)",
    why: "Site raised TQ on column grid deviation at C4–C7. Structural clarification is required before further vertical works can proceed — site is currently on hold.",
    type: "Technical Query",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Engineer / Head of Engineering",
    responsibleRole: ["head-engineering", "engineer"],
    requester: "Mr. Sa'adu Usman Garba, Site Officer (site on hold)",
    submittedDate: "Today (site on hold)",
    approvalChain: [
      { step: "TQ Raised by Site", status: "done", date: "Today" },
      { step: "Engineering Response", status: "current" },
      { step: "Site Works Resume", status: "pending" },
    ],
    priority: "Urgent",
    due: "Today",
    overdue: false,
    status: "Site works held pending engineering response",
    action: "Submit TQ Response",
    allowedRoles: ["head-engineering", "engineer"],
  },
  {
    id: "ENG-2026-003",
    title: "Approve concrete mix design — high-strength C40/50 (Abuja Housing columns)",
    why: "Columns specified C40/50. Site laboratory submitted mix design for engineering approval. Batching cannot commence without sign-off.",
    type: "Material Specification",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Engineer / Head of Engineering",
    responsibleRole: ["head-engineering", "engineer"],
    requester: "Site Laboratory",
    submittedDate: "10 Sep 2026",
    approvalChain: [
      { step: "Mix Design Submitted", status: "done", date: "10 Sep" },
      { step: "Engineering Review", status: "current" },
      { step: "Batching Approved to Commence", status: "pending" },
    ],
    priority: "High",
    due: "11 Sep 2026",
    overdue: false,
    status: "Mix design submitted; under review",
    action: "Approve Mix Design",
    allowedRoles: ["head-engineering", "engineer"],
  },
  {
    id: "ENG-2026-004",
    title: "Pre-mobilisation structural assessment — Government Office Complex (Kaduna)",
    why: "Ops team requires a structural condition assessment of the existing structure before mobilisation on 15 Sep.",
    type: "Site Inspection",
    project: "Government Office Complex",
    company: "USV",
    responsible: "Engineer / Head of Engineering",
    responsibleRole: ["head-engineering", "engineer"],
    requester: "Head of Operations",
    submittedDate: "08 Sep 2026",
    approvalChain: [
      { step: "Ops Mobilisation Request", status: "done", date: "08 Sep" },
      { step: "Structural Assessment Visit", status: "current" },
      { step: "Assessment Report to Ops", status: "pending" },
    ],
    priority: "Normal",
    due: "13 Sep 2026",
    overdue: false,
    status: "Inspection to be scheduled",
    action: "Submit Assessment",
    allowedRoles: ["head-engineering", "engineer"],
  },
  {
    id: "ENG-2026-005",
    title: "Review and comment on MEP coordination drawings — Lagos Commercial Dev.",
    why: "MEP coordination drawings issued for structural engineer review. Clashes must be identified and resolved before combined drawing issue.",
    type: "Drawing Review",
    project: "Lagos Commercial Development",
    company: "CANONIC",
    responsible: "Head of Engineering",
    responsibleRole: ["head-engineering", "engineer"],
    requester: "MEP Consultant (drawings issued)",
    submittedDate: "09 Sep 2026",
    approvalChain: [
      { step: "MEP Drawings Received", status: "done", date: "09 Sep" },
      { step: "Structural Review & Clash Check", status: "current" },
      { step: "Combined Drawing Issue", status: "pending" },
    ],
    priority: "Normal",
    due: "15 Sep 2026",
    overdue: false,
    status: "Drawings received; review pending",
    action: "Submit Comments",
    allowedRoles: ["head-engineering", "engineer"],
  },

  // ── Business Development Officer / Tender Officer ──
  {
    id: "TENDER-2026-001",
    title: "Finalise bid pricing — Federal Secretariat Annexe (₦3.4bn tender, deadline 18 Sep)",
    why: "Commercial preparation stage. Pricing review, built-up rates and management sign-off required before submission.",
    type: "Tender Pricing",
    project: "Business Development Pipeline",
    company: "USV + CANONIC",
    responsible: "Tender Officer",
    responsibleRole: ["tender-officer", "business-dev"],
    requester: "Federal Ministry of Works (tender notice)",
    submittedDate: "Tender opened (deadline 18 Sep)",
    approvalChain: [
      { step: "Pricing Draft 90% Complete", status: "current" },
      { step: "Management Sign-off", status: "pending" },
      { step: "Tender Submission to Client", status: "pending" },
    ],
    priority: "Urgent",
    due: "16 Sep 2026",
    overdue: false,
    status: "Pricing draft 90% complete",
    action: "Submit for Sign-off",
    allowedRoles: ["tender-officer", "business-dev"],
  },
  {
    id: "TENDER-2026-002",
    title: "Compile prequalification pack — Abuja Light Rail Depot (FCTA, due 26 Sep)",
    why: "Company profile, audited accounts, PENCOM certificate and past project references must be compiled and reviewed before submission.",
    type: "Prequalification",
    project: "Business Development Pipeline",
    company: "USV",
    responsible: "Tender Officer",
    responsibleRole: ["tender-officer"],
    requester: "FCT Transport Secretariat (tender notice)",
    submittedDate: "Documents being collated",
    approvalChain: [
      { step: "PQ Documents Collation", status: "current" },
      { step: "Internal Review", status: "pending" },
      { step: "Submission to FCTA", status: "pending" },
    ],
    priority: "High",
    due: "22 Sep 2026",
    overdue: false,
    status: "Documents being collated",
    action: "Submit PQ Pack",
    allowedRoles: ["tender-officer"],
  },
  {
    id: "TENDER-2026-003",
    title: "Prepare technical methodology — Enugu State Assembly Complex (USV + CANONIC)",
    why: "Tender requires detailed technical methodology statement. Architecture and engineering inputs received; tender officer to compile.",
    type: "Tender Preparation",
    project: "Business Development Pipeline",
    company: "USV + CANONIC",
    responsible: "Tender Officer",
    responsibleRole: ["tender-officer"],
    requester: "Enugu State Government (tender notice)",
    submittedDate: "Architecture & engineering inputs received",
    approvalChain: [
      { step: "Technical Inputs Received", status: "done" },
      { step: "Methodology Draft", status: "current" },
      { step: "Internal Review & Submission", status: "pending" },
    ],
    priority: "Normal",
    due: "25 Sep 2026",
    overdue: false,
    status: "First draft in progress",
    action: "Complete Methodology",
    allowedRoles: ["tender-officer"],
  },
  {
    id: "BD-OFC-001",
    title: "Send capability statement & follow-up letter — Rivers Investment Company",
    why: "BD meeting held 02 Sep. Client requested capability statement within 7 days. No response sent yet.",
    type: "Client Engagement",
    project: "Business Development Pipeline",
    company: "USV",
    responsible: "BD Officer",
    responsibleRole: ["bd-officer"],
    requester: "Rivers Investment Company (client meeting 02 Sep)",
    submittedDate: "02 Sep 2026 (meeting held)",
    approvalChain: [
      { step: "BD Meeting Held", status: "done", date: "02 Sep" },
      { step: "Capability Statement Preparation", status: "current" },
      { step: "Send to Rivers Investment Company", status: "pending" },
    ],
    priority: "High",
    due: "11 Sep 2026",
    overdue: false,
    status: "Follow-up due",
    action: "Send Follow-up",
    allowedRoles: ["bd-officer"],
  },
  {
    id: "BD-OFC-002",
    title: "Submit September pipeline report to GMD — 6 live opportunities",
    why: "Monthly BD report due to GMD by 12 Sep. Probability, stage and required management decisions must be updated for all 6 opportunities.",
    type: "Pipeline Report",
    project: "Business Development Pipeline",
    company: "USV + CANONIC",
    responsible: "BD Officer",
    responsibleRole: ["bd-officer", "business-dev"],
    requester: "Dr. Ibrahim Umar Garba, GMD (monthly requirement)",
    submittedDate: "01 Sep 2026 (standing monthly report)",
    approvalChain: [
      { step: "BD Team Inputs Requested", status: "current" },
      { step: "Report Compiled", status: "pending" },
      { step: "Submitted to GMD", status: "pending" },
    ],
    priority: "Normal",
    due: "12 Sep 2026",
    overdue: false,
    status: "Inputs from BD team pending",
    action: "Submit Report",
    allowedRoles: ["bd-officer", "business-dev"],
  },

  // ── Document Controller ──
  {
    id: "DOC-2026-001",
    title: "Register and distribute Rev D drawings — Enugu Medical Centre (First Floor GA)",
    why: "Architect issued Rev D. Must be registered in the document register, transmitted to site via DMS, and superseded Rev C archived immediately.",
    type: "Document Registration",
    project: "Enugu Medical Centre",
    company: "CANONIC",
    responsible: "Document Controller",
    responsibleRole: ["doc-controller"],
    requester: "Arc. Safiya Garba Aliyu, Architect",
    submittedDate: "Today (Rev D issued)",
    approvalChain: [
      { step: "Rev D Drawings Issued by Architect", status: "done", date: "Today" },
      { step: "DMS Registration & Distribution", status: "current" },
      { step: "Rev C Archived", status: "pending" },
    ],
    priority: "High",
    due: "Today",
    overdue: false,
    status: "Drawings received; registration pending",
    action: "Register & Transmit",
    allowedRoles: ["doc-controller"],
  },
  {
    id: "DOC-2026-002",
    title: "Issue drawing transmittal DT-PRJ001-088 to site — Abuja Housing (structural Rev E)",
    why: "Revised structural drawings (Rev E) approved and ready for site issue. Formal transmittal required before site can act on them.",
    type: "Drawing Transmittal",
    project: "Abuja Housing Development — Phase II",
    company: "USV",
    responsible: "Document Controller",
    responsibleRole: ["doc-controller"],
    requester: "Engineering Team (Rev E approved)",
    submittedDate: "Today (Rev E approved)",
    approvalChain: [
      { step: "Rev E Approved", status: "done", date: "Today" },
      { step: "Transmittal Preparation & Issue", status: "current" },
      { step: "Site Receipt Confirmed", status: "pending" },
    ],
    priority: "High",
    due: "Today",
    overdue: false,
    status: "Transmittal to be prepared",
    action: "Issue Transmittal",
    allowedRoles: ["doc-controller"],
  },
  {
    id: "DOC-2026-003",
    title: "Compile O&M manual — Government Office Complex (project closeout, client submission)",
    why: "Practical completion issued. Operation and maintenance manuals must be compiled from all subcontractors and submitted to client within 14 days.",
    type: "Closeout Documentation",
    project: "Government Office Complex",
    company: "USV",
    responsible: "Document Controller",
    responsibleRole: ["doc-controller"],
    requester: "Practical Completion Certificate (client requirement)",
    submittedDate: "Practical completion issued (14-day window)",
    approvalChain: [
      { step: "Practical Completion Issued", status: "done" },
      { step: "Subcontractor O&M Collation", status: "current" },
      { step: "Client Submission", status: "pending" },
    ],
    priority: "Normal",
    due: "20 Sep 2026",
    overdue: false,
    status: "Subcontractor O&M packs being collated",
    action: "Submit O&M Pack",
    allowedRoles: ["doc-controller"],
  },
  {
    id: "DOC-2026-004",
    title: "Monthly document register audit — verify all issued drawings are logged",
    why: "Monthly QA check required to ensure all drawings issued in August are correctly logged, numbered and accessible in the central DMS.",
    type: "Document Audit",
    project: "Group Administration",
    company: "USV + CANONIC",
    responsible: "Document Controller",
    responsibleRole: ["doc-controller"],
    requester: "QA Procedure (monthly standing requirement)",
    submittedDate: "01 Sep 2026 (monthly cycle)",
    approvalChain: [
      { step: "August Drawing Register Pulled", status: "current" },
      { step: "Verification Complete", status: "pending" },
      { step: "QA Sign-off", status: "pending" },
    ],
    priority: "Normal",
    due: "12 Sep 2026",
    overdue: false,
    status: "Audit not yet started",
    action: "Complete Audit",
    allowedRoles: ["doc-controller"],
  },
];

export interface Approval {
  id: string;
  item: string;
  amount?: number;
  requester: string;
  requesterDept?: string;
  reviewer: string;
  reviewerDept?: string;
  approver: string;
  approverDept?: string;
  stage: "Review" | "Recommendation" | "Approval";
  project: string;
  company: Company;
  submitted: string;
  sla: Health;
  notes?: string;
}

export const approvals: Approval[] = [
  { id: "PR-USV-2026-0081", item: "Reinforcement steel — 42T Y16/Y12", amount: 63_400_000, requester: "Engr. Musa Usman Lawan", requesterDept: "Project Management", reviewer: "Mr. Aminu Bala Usman", reviewerDept: "Procurement Dept.", approver: "Engr. Fatima Aliyu Dantata", approverDept: "GED — Projects Directorate", stage: "Approval", project: "Abuja Housing Ph II", company: "USV", submitted: "2 days ago", sla: "critical", notes: "Critical material — reinforcement on site exhausted. Site will be idle if not treated." },
  { id: "PR-USV-2026-0079", item: "Diesel supply — 12,000L site power", amount: 14_100_000, requester: "Alhaji Garba Usman Wada", requesterDept: "Site Operations, Lugbe", reviewer: "Engr. Zainab Abubakar Waziri", reviewerDept: "Head of Operations", approver: "Dr. Ibrahim Umar Garba", approverDept: "GMD Office", stage: "Review", project: "Abuja Housing Ph II", company: "USV", submitted: "6 hrs ago", sla: "attention", notes: "Generator running low. Approval needed before tomorrow morning shift." },
  { id: "EXP-CAN-2026-0203", item: "Site survey — Enugu (2nd visit)", amount: 2_350_000, requester: "Arc. Safiya Garba Aliyu", requesterDept: "Architecture — CANONIC", reviewer: "Arc. Hamza Ibrahim Danladi", reviewerDept: "Head of Architecture", approver: "Engr. Fatima Aliyu Dantata", approverDept: "GED — CANONIC", stage: "Recommendation", project: "Enugu Medical Centre", company: "CANONIC", submitted: "1 day ago", sla: "healthy", notes: "First survey found soil anomaly — second specialist visit required before design can proceed." },
  { id: "PAY-USV-2026-0051", item: "Subcontractor valuation 2 — blockwork", amount: 31_800_000, requester: "Mr. Haruna Abubakar Wali", requesterDept: "Quantity Surveying", reviewer: "Mrs. Maryam Kabiru Suleiman", reviewerDept: "Finance Dept.", approver: "Barr. Hauwa Suleiman Abubakar", approverDept: "Finance Manager", stage: "Approval", project: "PH Logistics Warehouse", company: "USV", submitted: "3 hrs ago", sla: "healthy", notes: "Blockwork subcontractor has completed Val. 2. Payment due per contract milestones." },
  { id: "VEN-2026-0018", item: "Vendor selection — curtain wall (3 quotes)", amount: 210_000_000, requester: "Mr. Aminu Bala Usman", requesterDept: "Procurement Dept.", reviewer: "Engr. Zainab Abubakar Waziri", reviewerDept: "Procurement Committee", approver: "Engr. Danladi Shehu", approverDept: "GGMP — Operations", stage: "Recommendation", project: "Government Office Complex", company: "USV + CANONIC", submitted: "1 day ago", sla: "attention", notes: "Three competitive quotes received. Recommended vendor: Cladtech Nigeria Ltd (mid-price, strongest reference)." },
];

export interface TimelineEvent {
  time: string;
  text: string;
  actor: string;
  kind: "site" | "design" | "procurement" | "finance" | "approval" | "decision";
}

export const timeline: TimelineEvent[] = [
  { time: "09:42", actor: "Site Officer — Lugbe", text: "Submitted Site Report SR-PRJ001-082 (foundation, block C)", kind: "site" },
  { time: "10:15", actor: "Engr. Musa Usman Lawan (PM)", text: "Reviewed site report, flagged reinforcement shortage", kind: "site" },
  { time: "11:03", actor: "QS Officer", text: "Uploaded BOQ Revision 04 for MEP re-measure", kind: "procurement" },
  { time: "12:30", actor: "GGMP", text: "Approved procurement request PR-USV-2026-0079 (diesel)", kind: "approval" },
  { time: "14:10", actor: "Procurement", text: "Issued PO-USV-2026-0067 to Julius Steel Ltd", kind: "procurement" },
  { time: "15:45", actor: "Arc. Hamza Ibrahim Danladi", text: "Uploaded revised Ground Floor GA drawing (Rev C)", kind: "design" },
  { time: "16:20", actor: "GMD", text: "Issued instruction INS-2026-0087 — expedite Kaduna procurement", kind: "decision" },
];

export interface Tender {
  id: string;
  name: string;
  client: string;
  company: Company;
  value: number;
  stage: string;
  probability: number;
  deadline: string;
  daysLeft: number;
}

export const tenders: Tender[] = [
  { id: "TND-2026-0045", name: "Federal Secretariat Annexe", client: "Federal Ministry of Works", company: "USV + CANONIC", value: 3_400_000_000, stage: "Commercial Preparation", probability: 55, deadline: "18 Sep 2026", daysLeft: 14 },
  { id: "TND-2026-0041", name: "Lekki Waterfront Residences", client: "Landmark Properties", company: "CANONIC", value: 890_000_000, stage: "Internal Review", probability: 70, deadline: "09 Sep 2026", daysLeft: 5 },
  { id: "TND-2026-0038", name: "Abuja Light Rail Depot", client: "FCT Transport Sec.", company: "USV", value: 5_600_000_000, stage: "Technical Preparation", probability: 35, deadline: "26 Sep 2026", daysLeft: 22 },
];

export const quickActions = [
  "New Opportunity", "New Client", "New Tender", "New Proposal", "New Contract",
  "New Project", "Assign Task", "Procurement Request", "Submit Site Report",
  "Upload Drawing", "Create BOQ", "Submit Variation", "Create Invoice",
  "Submit Expense", "Create Meeting", "Create Instruction", "Upload Document",
  "Approval Request", "Staff Request", "Raise Variation", "Submit Payment Certificate",
  "Share with Client",
];

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: "approval" | "report" | "instruction" | "variation" | "payment" | "meeting" | "opportunity";
  urgent: boolean;
  read: boolean;
  roles?: string[];
}

export const notifications: NotificationItem[] = [
  { id: "n1", title: "PO-2026-089 requires GMD approval", time: "2 min ago", type: "approval", urgent: true, read: false, roles: ["chairman", "gmd", "ged", "ed", "ggmp"] },
  { id: "n2", title: "Site progress report overdue — Lekki Hub", time: "15 min ago", type: "report", urgent: true, read: false, roles: ["chairman", "gmd", "ged", "ed", "ggmp", "pm", "site"] },
  { id: "n3", title: "New instruction from GED Projects", time: "1 hr ago", type: "instruction", urgent: false, read: false },
  { id: "n4", title: "Variation VC-001 approved by QS", time: "2 hrs ago", type: "variation", urgent: false, read: true },
  { id: "n5", title: "Payment certificate PC-2026-04 submitted", time: "3 hrs ago", type: "payment", urgent: false, read: true },
  { id: "n6", title: "Board meeting minutes published", time: "5 hrs ago", type: "meeting", urgent: false, read: true },
  { id: "n7",  title: "BD opportunity: Abuja Stadium Phase 2",                                    time: "Yesterday", type: "opportunity", urgent: false, read: true },
  { id: "n8",  title: "New assignment: DWG-ENM-042 assigned by Head Architect",                  time: "30 min ago", type: "instruction", urgent: true,  read: false, roles: ["architect"] },
  { id: "n9",  title: "Assignment CALC-ENG-004: deadline in 3 hours",                            time: "1 hr ago",   type: "report",      urgent: true,  read: false, roles: ["engineer"] },
  { id: "n10", title: "BOQ-PRJ001-007 returned for revision by Head QS",                         time: "2 hrs ago",  type: "approval",    urgent: false, read: false, roles: ["qs"] },
  { id: "n11", title: "Daily site report SR-PRJ001-083 due by 17:00 today",                      time: "3 hrs ago",  type: "report",      urgent: true,  read: false, roles: ["site"] },
  { id: "n12", title: "RFQ-USV-2026-010 vendor response received — review needed",               time: "4 hrs ago",  type: "approval",    urgent: false, read: false, roles: ["procurement"] },
  { id: "n13", title: "Payment voucher VOUCHER-442 approved by Finance Manager",                  time: "5 hrs ago",  type: "payment",     urgent: false, read: true,  roles: ["accountant"] },
  { id: "n14", title: "Leave application HR-LVE-2026-041 awaiting your action",                  time: "Yesterday",  type: "approval",    urgent: false, read: false, roles: ["admin"] },
  { id: "n15", title: "Duty: Pre-pour inspection not yet marked complete",                        time: "2 hrs ago",  type: "report",      urgent: true,  read: false, roles: ["site", "engineer"] },
];

// ── Role taxonomy (aligned to NEXUS User Role document, Sep 2026) ──
export type UserDirectorate =
  | "governance"
  | "projects"
  | "technical"
  | "corporate";

export type UserRole =
  // Governance & Executive Management
  | "chairman"
  | "gmd"
  | "ged"
  | "ed"
  | "ggmp"
  // Projects Directorate
  | "pm"
  | "project-coordinator"
  | "site-supervisor"
  | "site"
  | "procurement-manager"
  | "procurement"
  | "doc-controller"
  // Technical Directorate
  | "head-architect"
  | "architect"
  | "head-qs"
  | "qs"
  | "head-engineering"
  | "engineer"
  | "planner"
  // Corporate Services Directorate
  | "head-ops"
  | "ops"
  | "bd-officer"
  | "business-dev"
  | "tender-officer"
  | "finance"
  | "accountant"
  | "head-admin"
  | "admin"
  | "client-support"
  | "ict-admin"
  | "auditor";

// Maps each officer role to their department head role
export const departmentHeadMap: Partial<Record<UserRole, UserRole>> = {
  "engineer":             "head-engineering",
  "architect":            "head-architect",
  "qs":                   "head-qs",
  "accountant":           "finance",
  "procurement":          "procurement-manager",
  "site":                 "site-supervisor",
  "project-coordinator":  "pm",
  "bd-officer":           "ggmp",
  "tender-officer":       "ggmp",
  "planner":              "pm",
  "admin":                "head-admin",
  "client-support":       "ggmp",
};

// Head display names for use in officer dashboards
export const headDisplayMap: Partial<Record<UserRole, { name: string; title: string }>> = {
  "head-engineering":   { name: "Engr. Bode Akintunde",    title: "Head of Engineering" },
  "head-architect":     { name: "Arc. Hamza Ibrahim Danladi",      title: "Head of Architecture" },
  "head-qs":            { name: "QS Haruna Sani Gombe",         title: "Head of Quantity Surveying" },
  "finance":            { name: "Mrs. Maryam Kabiru Suleiman",       title: "Finance Manager" },
  "procurement-manager":{ name: "Alhaji Sani Abubakar",    title: "Procurement Manager" },
  "site-supervisor":    { name: "Engr. Jamilu Umar Sani",    title: "Site Supervisor" },
  "pm":                 { name: "Engr. Musa Usman Lawan",        title: "Senior Project Manager" },
  "ggmp":               { name: "Barr. Hauwa Suleiman Abubakar",    title: "Group General Manager (Operations)" },
  "head-admin":         { name: "Mrs. Zainab Umar Lawan",     title: "Head of Administration & HR" },
};

export interface UserPersona {
  id: string;
  name: string;
  initials: string;
  title: string;
  role: UserRole;
  directorate: UserDirectorate;
  department: string;
  authority: string;
  company: Company;
  defaultScreen: string;
  defaultCompany: Company;
  bio: string;
  navItems: string[];
}

// Full navigation sets by access tier
const ALL_ACCESS_NAV = ["command", "mywork", "action", "myhr", "portfolio", "procurement", "business-dev", "approvals", "documents", "meetings", "instructions", "people", "clients", "audit", "invoices", "variations", "payment-certs", "client-portal"];

// GMD: full group-wide visibility minus the raw invoices module (finance team handles that)
const EXEC_NAV       = ["command", "mywork", "action", "myhr", "portfolio", "procurement", "business-dev", "approvals", "documents", "meetings", "instructions", "people", "clients", "audit", "variations", "payment-certs", "client-portal"];

// GED: projects & technical delivery — no finance/audit/HR admin
const GED_NAV        = ["command", "action", "myhr", "portfolio", "procurement", "approvals", "documents", "meetings", "people", "variations", "payment-certs"];

// ED: corporate services — finance, HR, audit, compliance — no project procurement/variations
const ED_NAV         = ["command", "action", "myhr", "approvals", "documents", "meetings", "people", "audit", "invoices", "payment-certs"];

// GGMP: operational management — BD, procurement, operations, client relations — no audit/finance detail
const GGMP_NAV       = ["command", "mywork", "action", "myhr", "portfolio", "procurement", "business-dev", "approvals", "documents", "meetings", "instructions", "people", "clients", "client-portal"];
const PM_NAV         = ["role-home", "action", "myhr", "portfolio", "procurement", "approvals", "documents", "meetings", "instructions", "people", "variations", "payment-certs"];
const SITE_NAV       = ["role-home", "my-week", "action", "myhr", "documents", "instructions"];
const PROC_NAV       = ["role-home", "action", "myhr", "procurement", "approvals", "instructions", "people"];
const DOC_NAV        = ["role-home", "action", "myhr", "portfolio", "documents", "meetings", "instructions", "people"];
const TECH_NAV          = ["role-home", "action", "myhr", "portfolio", "documents", "meetings", "instructions", "people"];
const QS_NAV            = ["role-home", "action", "myhr", "portfolio", "approvals", "documents", "meetings", "instructions", "people", "variations", "payment-certs"];
const FINANCE_NAV       = ["role-home", "action", "myhr", "invoices", "approvals", "documents", "meetings", "people", "payment-certs"];
const OPS_NAV           = ["role-home", "action", "myhr", "portfolio", "meetings", "people"];
const ADMIN_NAV         = ["role-home", "action", "myhr", "meetings", "people"];
const AUDIT_NAV         = ["role-home", "action", "myhr", "audit", "approvals", "documents", "meetings", "people"];
const ICT_NAV           = ["role-home", "action", "myhr", "people"];
const BD_NAV            = ["role-home", "action", "myhr", "portfolio", "business-dev", "documents", "meetings", "clients", "client-portal"];
// Officer-level nav sets (reduced access vs head/manager counterparts)
const COORDINATOR_NAV   = ["role-home", "action", "myhr", "portfolio", "procurement", "documents", "meetings", "instructions", "people"];
const PROC_OFFICER_NAV  = ["role-home", "my-week", "action", "myhr", "procurement", "instructions"];
const OFFICER_TECH_NAV  = ["role-home", "my-week", "action", "myhr", "documents", "instructions"];
const QS_OFFICER_NAV    = ["role-home", "my-week", "action", "myhr", "documents", "instructions", "variations", "payment-certs"];
const ACCOUNTANT_NAV    = ["role-home", "my-week", "action", "myhr", "invoices", "documents", "payment-certs"];
const OPS_OFFICER_NAV   = ["role-home", "my-week", "action", "myhr"];
const ADMIN_OFFICER_NAV = ["role-home", "my-week", "action", "myhr"];

export const userPersonas: UserPersona[] = [
  // ── A. GOVERNANCE & EXECUTIVE MANAGEMENT ──
  {
    id: "chairman",
    name: "Alhaji Mustapha Sule Dankaka",
    initials: "CE",
    title: "Chairman",
    role: "chairman",
    directorate: "governance",
    department: "Board",
    authority: "CHAIRMAN",
    company: "USV + CANONIC",
    defaultScreen: "command",
    defaultCompany: "USV + CANONIC",
    bio: "Board oversight — full executive visibility",
    navItems: ALL_ACCESS_NAV,
  },
  {
    id: "gmd",
    name: "Dr. Ibrahim Umar Garba",
    initials: "EO",
    title: "Group Managing Director",
    role: "gmd",
    directorate: "governance",
    department: "Group Executive",
    authority: "GMD",
    company: "USV + CANONIC",
    defaultScreen: "command",
    defaultCompany: "USV + CANONIC",
    bio: "Full executive oversight across both companies",
    navItems: EXEC_NAV,
  },
  {
    id: "ged",
    name: "Engr. Fatima Aliyu Dantata",
    initials: "AO",
    title: "Group Executive Director — Projects",
    role: "ged",
    directorate: "governance",
    department: "Group Projects",
    authority: "GED",
    company: "USV + CANONIC",
    defaultScreen: "command",
    defaultCompany: "USV + CANONIC",
    bio: "Executive accountability for all project delivery, engineering quality, and commercial performance across both companies",
    navItems: GED_NAV,
  },
  {
    id: "ed",
    name: "Engr. Yahaya Abdullahi Bello",
    initials: "CO",
    title: "Executive Director — Corporate Services",
    role: "ed",
    directorate: "governance",
    department: "Corporate Services",
    authority: "ED",
    company: "USV + CANONIC",
    defaultScreen: "command",
    defaultCompany: "USV + CANONIC",
    bio: "Executive oversight of Finance, HR & Administration, ICT, and Internal Audit across the group",
    navItems: ED_NAV,
  },
  {
    id: "ggmp",
    name: "Barr. Hauwa Suleiman Abubakar",
    initials: "FA",
    title: "Group General Manager (Operations)",
    role: "ggmp",
    directorate: "governance",
    department: "Group Operations",
    authority: "GGMP",
    company: "USV + CANONIC",
    defaultScreen: "command",
    defaultCompany: "USV + CANONIC",
    bio: "Day-to-day group operations management — procurement governance, BD oversight, vendor relations, resource deployment and client escalations",
    navItems: GGMP_NAV,
  },

  // ── B. PROJECTS DIRECTORATE ──
  {
    id: "pm",
    name: "Engr. Musa Usman Lawan",
    initials: "MB",
    title: "Senior Project Manager",
    role: "pm",
    directorate: "projects",
    department: "Project Management",
    authority: "MANAGER",
    company: "USV",
    defaultScreen: "role-home",
    defaultCompany: "USV",
    bio: "Manages 3 active construction projects — USV Development Services",
    navItems: PM_NAV,
  },
  {
    id: "project-coordinator",
    name: "Engr. Zainab Abubakar Waziri",
    initials: "GE",
    title: "Project Coordinator",
    role: "project-coordinator",
    directorate: "projects",
    department: "Project Management",
    authority: "COORDINATOR",
    company: "USV",
    defaultScreen: "role-home",
    defaultCompany: "USV",
    bio: "Coordinates logistics and schedules across active projects",
    navItems: COORDINATOR_NAV,
  },
  {
    id: "site-supervisor",
    name: "Engr. Jamilu Umar Sani",
    initials: "JO",
    title: "Site Supervisor — Abuja",
    role: "site-supervisor",
    directorate: "projects",
    department: "Construction & Site Management",
    authority: "SUPERVISOR",
    company: "USV",
    defaultScreen: "role-home",
    defaultCompany: "USV",
    bio: "Field operations and daily site management, Abuja Housing Phase II",
    navItems: SITE_NAV,
  },
  {
    id: "site",
    name: "Mr. Sa'adu Usman Garba",
    initials: "CN",
    title: "Site Officer",
    role: "site",
    directorate: "projects",
    department: "Construction & Site Management",
    authority: "OPERATIONS",
    company: "USV",
    defaultScreen: "role-home",
    defaultCompany: "USV",
    bio: "On-site reporting and daily activity logging",
    navItems: SITE_NAV,
  },
  {
    id: "procurement-manager",
    name: "Alhaji Sani Abubakar",
    initials: "SA",
    title: "Procurement Manager",
    role: "procurement-manager",
    directorate: "projects",
    department: "Procurement",
    authority: "MANAGER",
    company: "USV",
    defaultScreen: "procurement",
    defaultCompany: "USV",
    bio: "Leads all procurement activities for USV Development Services",
    navItems: PROC_NAV,
  },
  {
    id: "procurement",
    name: "Miss Ramatu Yusuf Waziri",
    initials: "NE",
    title: "Procurement Officer",
    role: "procurement",
    directorate: "projects",
    department: "Procurement",
    authority: "OFFICER",
    company: "USV",
    defaultScreen: "procurement",
    defaultCompany: "USV",
    bio: "Handles RFQs, vendor comparisons and purchase orders",
    navItems: PROC_OFFICER_NAV,
  },
  {
    id: "doc-controller",
    name: "Mrs. Yetunde Adesanya",
    initials: "YA",
    title: "Project Document Controller",
    role: "doc-controller",
    directorate: "projects",
    department: "Project Document Control",
    authority: "CONTROLLER",
    company: "USV + CANONIC",
    defaultScreen: "documents",
    defaultCompany: "USV + CANONIC",
    bio: "Controls project documentation, revisions and distribution",
    navItems: DOC_NAV,
  },

  // ── C. TECHNICAL DIRECTORATE ──
  {
    id: "head-architect",
    name: "Arc. Hamza Ibrahim Danladi",
    initials: "TA",
    title: "Head of Architecture",
    role: "head-architect",
    directorate: "technical",
    department: "Architecture & Design",
    authority: "HEAD",
    company: "CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "CANONIC",
    bio: "Leads design delivery and studio management — Canonic Associates Ltd",
    navItems: TECH_NAV,
  },
  {
    id: "architect",
    name: "Arc. Safiya Garba Aliyu",
    initials: "NO",
    title: "Architect",
    role: "architect",
    directorate: "technical",
    department: "Architecture & Design",
    authority: "PROFESSIONAL",
    company: "CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "CANONIC",
    bio: "Project architect — Enugu Medical Centre and Lagos Commercial",
    navItems: OFFICER_TECH_NAV,
  },
  {
    id: "head-qs",
    name: "QS Haruna Sani Gombe",
    initials: "BO",
    title: "Head of Quantity Surveying",
    role: "head-qs",
    directorate: "technical",
    department: "Quantity Surveying",
    authority: "HEAD",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "Commercial management, cost control and BOQ across all projects",
    navItems: QS_NAV,
  },
  {
    id: "qs",
    name: "Mr. Ismail Sule Waziri",
    initials: "IO",
    title: "Quantity Surveyor",
    role: "qs",
    directorate: "technical",
    department: "Quantity Surveying",
    authority: "PROFESSIONAL",
    company: "USV",
    defaultScreen: "role-home",
    defaultCompany: "USV",
    bio: "BOQ, valuations and variation management",
    navItems: QS_OFFICER_NAV,
  },
  {
    id: "head-engineering",
    name: "Engr. Bode Akintunde",
    initials: "BA",
    title: "Head of Engineering",
    role: "head-engineering",
    directorate: "technical",
    department: "Engineering & Technical Services",
    authority: "HEAD",
    company: "USV",
    defaultScreen: "role-home",
    defaultCompany: "USV",
    bio: "Technical oversight, engineering review and planning",
    navItems: TECH_NAV,
  },
  {
    id: "engineer",
    name: "Engr. Aminu Garba",
    initials: "AG",
    title: "Structural Engineer",
    role: "engineer",
    directorate: "technical",
    department: "Engineering & Technical Services",
    authority: "PROFESSIONAL",
    company: "USV",
    defaultScreen: "role-home",
    defaultCompany: "USV",
    bio: "Structural engineering and technical supervision",
    navItems: OFFICER_TECH_NAV,
  },

  // ── D. CORPORATE SERVICES DIRECTORATE ──
  {
    id: "head-ops",
    name: "Mrs. Kemi Adewale",
    initials: "KA",
    title: "Head of Operations",
    role: "head-ops",
    directorate: "corporate",
    department: "Operations",
    authority: "HEAD",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "Group operations management and resource coordination",
    navItems: OPS_NAV,
  },
  {
    id: "bd-officer",
    name: "Mr. Seun Olatunji",
    initials: "SO",
    title: "Business Development Officer",
    role: "bd-officer",
    directorate: "corporate",
    department: "Business Development & Tenders",
    authority: "OFFICER",
    company: "USV + CANONIC",
    defaultScreen: "business-dev",
    defaultCompany: "USV + CANONIC",
    bio: "Market development, client engagement and opportunity pipeline",
    navItems: BD_NAV,
  },
  {
    id: "tender-officer",
    name: "Mr. Femi Ogunsanya",
    initials: "FO",
    title: "Tender & Proposals Officer",
    role: "tender-officer",
    directorate: "corporate",
    department: "Business Development & Tenders",
    authority: "OFFICER",
    company: "USV + CANONIC",
    defaultScreen: "business-dev",
    defaultCompany: "USV + CANONIC",
    bio: "Tender preparation, bid pricing and proposal management",
    navItems: BD_NAV,
  },
  {
    id: "finance",
    name: "Mrs. Maryam Kabiru Suleiman",
    initials: "CN",
    title: "Finance Manager",
    role: "finance",
    directorate: "corporate",
    department: "Finance & Accounts",
    authority: "MANAGER",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "Group finance, receivables and payment management",
    navItems: FINANCE_NAV,
  },
  {
    id: "accountant",
    name: "Mr. Haruna Abubakar Wali",
    initials: "TF",
    title: "Accountant",
    role: "accountant",
    directorate: "corporate",
    department: "Finance & Accounts",
    authority: "PROFESSIONAL",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "Accounts processing, reconciliation and financial reporting",
    navItems: ACCOUNTANT_NAV,
  },
  {
    id: "head-admin",
    name: "Mrs. Zainab Umar Lawan",
    initials: "FB",
    title: "Head of Administration & HR",
    role: "head-admin",
    directorate: "corporate",
    department: "Administration & Human Resources",
    authority: "HEAD",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "HR, administration and staff management across the group",
    navItems: ADMIN_NAV,
  },
  {
    id: "ops-officer",
    name: "Mr. Dayo Adeyemi",
    initials: "DA",
    title: "Operations Officer",
    role: "ops",
    directorate: "corporate",
    department: "Operations",
    authority: "OFFICER",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "Day-to-day operations support, scheduling and resource coordination",
    navItems: OPS_OFFICER_NAV,
  },
  {
    id: "admin-officer",
    name: "Miss Bola Adekunle",
    initials: "BA",
    title: "Administrative Officer",
    role: "admin",
    directorate: "corporate",
    department: "Administration & Human Resources",
    authority: "OFFICER",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "General administration, office management and staff support services",
    navItems: ADMIN_OFFICER_NAV,
  },
  {
    id: "ict-admin",
    name: "Mr. Haruna Ibrahim Kure",
    initials: "EN",
    title: "ICT & ERP Administrator",
    role: "ict-admin",
    directorate: "corporate",
    department: "ICT, ERP & Systems Administration",
    authority: "ADMIN",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "NEXUS platform administration, user management and ICT support",
    navItems: ICT_NAV,
  },
  {
    id: "auditor",
    name: "Mr. Lanre Adebayo",
    initials: "LA",
    title: "Internal Auditor",
    role: "auditor",
    directorate: "corporate",
    department: "Internal Audit & Compliance",
    authority: "AUDITOR",
    company: "USV + CANONIC",
    defaultScreen: "role-home",
    defaultCompany: "USV + CANONIC",
    bio: "Internal audit, compliance monitoring and risk review",
    navItems: AUDIT_NAV,
  },
];

// ─────────────────────────── STAFF & PEOPLE DATA ───────────────────────────

export interface LeaveRecord {
  type: "annual" | "sick" | "maternity" | "paternity" | "emergency";
  dates: string;
  days: number;
  status: "approved" | "pending" | "rejected";
}

export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  initials: string;
  title: string;
  role: UserRole;
  directorate: UserDirectorate;
  department: string;
  company: Company;
  reportsTo: string | null; // staff id
  email: string;
  phone: string;
  status: "active" | "on-leave" | "suspended" | "probation";
  workload: number; // 0–100
  currentAssignment: string;
  // Employment — HR access only
  employmentDate: string;
  contractType: "permanent" | "contract" | "intern";
  salaryGrade: string; // S1–S7
  probationEnd?: string;
  // Compensation — HR sees all; Finance sees salary + bank only
  monthlySalary: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  // HR-only fields
  leaveBalance: number;
  leaveTaken: number;
  leaveRecords: LeaveRecord[];
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  disciplinaryNotes?: string;
  // System
  lastLogin: string;
}

export interface StaffTask {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  assignedById: string;
  department: string;
  project?: string;
  priority: "urgent" | "high" | "normal" | "low";
  status: "not-started" | "in-progress" | "completed" | "overdue";
  dueDate: string;
  createdDate: string;
  isExternal: boolean;
}

export const staffMembers: StaffMember[] = [
  // ── A. GOVERNANCE ──
  {
    id: "s-01", employeeId: "USV-EMP-0001", name: "Alhaji Mustapha Sule Dankaka", initials: "CE",
    title: "Chairman", role: "chairman", directorate: "governance", department: "Board",
    company: "USV + CANONIC", reportsTo: null,
    email: "chairman@nexus-erp.com", phone: "+234 803 001 0001",
    status: "active", workload: 45, currentAssignment: "Board oversight and strategic direction",
    employmentDate: "15 Jan 2005", contractType: "permanent", salaryGrade: "S7",
    monthlySalary: 4_200_000, bankName: "First Bank of Nigeria", accountNumber: "3010001234", accountName: "Alhaji Mustapha Sule Dankaka",
    leaveBalance: 30, leaveTaken: 0, leaveRecords: [],
    emergencyContact: "Mrs. Patricia Eze", emergencyPhone: "+234 803 001 0002",
    address: "12 Maitama Close, Abuja FCT", lastLogin: "Today, 08:14",
  },
  {
    id: "s-02", employeeId: "USV-EMP-0002", name: "Dr. Ibrahim Umar Garba", initials: "EO",
    title: "Group Managing Director", role: "gmd", directorate: "governance", department: "Group Executive",
    company: "USV + CANONIC", reportsTo: "s-01",
    email: "gmd@nexus-erp.com", phone: "+234 802 100 2200",
    status: "active", workload: 78, currentAssignment: "Kaduna project strategic review and FHA negotiations",
    employmentDate: "01 Mar 2010", contractType: "permanent", salaryGrade: "S6",
    monthlySalary: 2_800_000, bankName: "Guaranty Trust Bank", accountNumber: "0221005678", accountName: "Dr. Ibrahim Umar Garba",
    leaveBalance: 22, leaveTaken: 8, leaveRecords: [
      { type: "annual", dates: "10–17 Jan 2026", days: 8, status: "approved" },
    ],
    emergencyContact: "Mrs. Chidinma Okonkwo", emergencyPhone: "+234 803 100 2201",
    address: "Plot 44 Asokoro, Abuja FCT", lastLogin: "Today, 07:52",
  },
  {
    id: "s-03", employeeId: "USV-EMP-0003", name: "Engr. Fatima Aliyu Dantata", initials: "AO",
    title: "Group Executive Director — Projects", role: "ged", directorate: "governance", department: "Group Executive",
    company: "USV + CANONIC", reportsTo: "s-02",
    email: "ged.projects@nexus-erp.com", phone: "+234 806 300 4401",
    status: "active", workload: 88, currentAssignment: "Executive oversight — Abuja Housing crisis management",
    employmentDate: "12 Jun 2012", contractType: "permanent", salaryGrade: "S6",
    monthlySalary: 2_650_000, bankName: "Zenith Bank", accountNumber: "1012345670", accountName: "Fatima Aliyu Dantata",
    leaveBalance: 18, leaveTaken: 12, leaveRecords: [
      { type: "annual", dates: "22 Dec 2025 – 02 Jan 2026", days: 12, status: "approved" },
    ],
    emergencyContact: "Mr. Sa'adu Usman Garba", emergencyPhone: "+234 806 300 4402",
    address: "9 Gwarinpa Estate, Abuja FCT", lastLogin: "Today, 06:30",
  },
  {
    id: "s-03b", employeeId: "USV-EMP-0005", name: "Engr. Yahaya Abdullahi Bello", initials: "CO",
    title: "Executive Director — Corporate Services", role: "ed", directorate: "governance", department: "Group Executive",
    company: "USV + CANONIC", reportsTo: "s-02",
    email: "ed.corporate@nexus-erp.com", phone: "+234 805 200 3301",
    status: "active", workload: 74, currentAssignment: "Corporate services oversight — finance, admin, operations strategy",
    employmentDate: "01 Feb 2013", contractType: "permanent", salaryGrade: "S6",
    monthlySalary: 2_500_000, bankName: "Zenith Bank", accountNumber: "1023456781", accountName: "Yahaya Abdullahi Bello",
    leaveBalance: 20, leaveTaken: 10, leaveRecords: [
      { type: "annual", dates: "05–14 Jan 2026", days: 10, status: "approved" },
    ],
    emergencyContact: "Mrs. Ngozi Obi", emergencyPhone: "+234 805 200 3302",
    address: "Plot 21 Diplomatic Zone, Abuja FCT", lastLogin: "Today, 07:10",
  },
  {
    id: "s-04", employeeId: "USV-EMP-0004", name: "Barr. Hauwa Suleiman Abubakar", initials: "FA",
    title: "Group General Manager (Operations)", role: "ggmp", directorate: "governance", department: "Group Operations",
    company: "USV + CANONIC", reportsTo: "s-03b",
    email: "ggmp@nexus-erp.com", phone: "+234 809 400 5501",
    status: "active", workload: 72, currentAssignment: "Group operations management, vendor governance and compliance",
    employmentDate: "08 Sep 2014", contractType: "permanent", salaryGrade: "S5",
    monthlySalary: 1_750_000, bankName: "United Bank for Africa", accountNumber: "2080055501", accountName: "Hauwa Suleiman Abubakar",
    leaveBalance: 25, leaveTaken: 5, leaveRecords: [
      { type: "sick", dates: "03–07 Mar 2026", days: 5, status: "approved" },
    ],
    emergencyContact: "Mr. Tobi Adeyinka", emergencyPhone: "+234 809 400 5502",
    address: "17 Wuse Zone 5, Abuja FCT", lastLogin: "Yesterday, 18:20",
  },

  // ── B. PROJECTS DIRECTORATE ──
  {
    id: "s-05", employeeId: "USV-EMP-0011", name: "Engr. Musa Usman Lawan", initials: "MB",
    title: "Senior Project Manager", role: "pm", directorate: "projects", department: "Project Management",
    company: "USV", reportsTo: "s-03",
    email: "m.bello@nexus-erp.com", phone: "+234 803 500 6601",
    status: "active", workload: 95, currentAssignment: "Managing Abuja Housing Ph II, Kaduna Office Complex and PH Warehouse",
    employmentDate: "15 Feb 2016", contractType: "permanent", salaryGrade: "S5",
    monthlySalary: 1_380_000, bankName: "Access Bank", accountNumber: "0780066601", accountName: "Musa Usman Lawan",
    leaveBalance: 20, leaveTaken: 10, leaveRecords: [
      { type: "annual", dates: "20–29 Jul 2026", days: 10, status: "approved" },
    ],
    emergencyContact: "Mrs. Hauwa Bello", emergencyPhone: "+234 803 500 6602",
    address: "Block 8 Federal Housing, Lugbe, Abuja", lastLogin: "Today, 07:45",
  },
  {
    id: "s-06", employeeId: "USV-EMP-0012", name: "Engr. Zainab Abubakar Waziri", initials: "GE",
    title: "Project Coordinator", role: "project-coordinator", directorate: "projects", department: "Project Management",
    company: "USV", reportsTo: "s-05",
    email: "g.eze@nexus-erp.com", phone: "+234 801 600 7701",
    status: "active", workload: 82, currentAssignment: "Coordinating programme updates and milestone tracking across all active projects",
    employmentDate: "03 Aug 2019", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 550_000, bankName: "Stanbic IBTC Bank", accountNumber: "0020077701", accountName: "Zainab Abubakar Waziri",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Mr. Chibuzor Eze", emergencyPhone: "+234 801 600 7702",
    address: "14 Airport Road, Lugbe, Abuja", lastLogin: "Today, 08:01",
  },
  {
    id: "s-07", employeeId: "USV-EMP-0013", name: "Mr. Wale Okonjo", initials: "WO",
    title: "Project Officer", role: "project-coordinator", directorate: "projects", department: "Project Management",
    company: "USV", reportsTo: "s-05",
    email: "w.okonjo@nexus-erp.com", phone: "+234 802 700 8801",
    status: "probation", workload: 65, currentAssignment: "Document collation and action register updates — Abuja Housing",
    employmentDate: "15 Jun 2026", contractType: "permanent", salaryGrade: "S2", probationEnd: "15 Dec 2026",
    monthlySalary: 320_000, bankName: "Polaris Bank", accountNumber: "4020088801", accountName: "Wale Okonjo",
    leaveBalance: 30, leaveTaken: 0, leaveRecords: [],
    emergencyContact: "Mrs. Abiola Okonjo", emergencyPhone: "+234 802 700 8802",
    address: "22 Kubwa, Abuja FCT", lastLogin: "Today, 09:10",
  },
  {
    id: "s-08", employeeId: "USV-EMP-0021", name: "Engr. Jamilu Umar Sani", initials: "JO",
    title: "Site Supervisor — Abuja", role: "site-supervisor", directorate: "projects", department: "Construction & Site Management",
    company: "USV", reportsTo: "s-05",
    email: "j.oyelaran@nexus-erp.com", phone: "+234 807 800 9901",
    status: "active", workload: 88, currentAssignment: "Supervising Block C foundation pour and site safety compliance",
    employmentDate: "22 Apr 2017", contractType: "permanent", salaryGrade: "S4",
    monthlySalary: 870_000, bankName: "Ecobank", accountNumber: "5290099901", accountName: "Jamilu Umar Sani",
    leaveBalance: 24, leaveTaken: 6, leaveRecords: [
      { type: "annual", dates: "01–06 Jan 2026", days: 6, status: "approved" },
    ],
    emergencyContact: "Mrs. Sola Oyelaran", emergencyPhone: "+234 807 800 9902",
    address: "Block 3 Flat 12, Lugbe, Abuja", lastLogin: "Today, 06:15",
  },
  {
    id: "s-09", employeeId: "USV-EMP-0022", name: "Mr. Sa'adu Usman Garba", initials: "CN",
    title: "Site Officer", role: "site", directorate: "projects", department: "Construction & Site Management",
    company: "USV", reportsTo: "s-08",
    email: "c.nnaji@nexus-erp.com", phone: "+234 805 900 1001",
    status: "active", workload: 90, currentAssignment: "Daily site log, labour attendance and materials receipt — Block C",
    employmentDate: "10 Jan 2021", contractType: "permanent", salaryGrade: "S2",
    monthlySalary: 310_000, bankName: "First Bank of Nigeria", accountNumber: "3060101001", accountName: "Sa'adu Usman Garba",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Mrs. Hadiza Usman Musa", emergencyPhone: "+234 805 900 1002",
    address: "Lugbe Site Camp, Abuja FCT", lastLogin: "Today, 07:30",
  },
  {
    id: "s-10", employeeId: "USV-EMP-0023", name: "Mr. Biodun Salami", initials: "BS",
    title: "Foreman", role: "site", directorate: "projects", department: "Construction & Site Management",
    company: "USV", reportsTo: "s-08",
    email: "b.salami@nexus-erp.com", phone: "+234 808 010 1101",
    status: "on-leave", workload: 0, currentAssignment: "On approved annual leave — returns 10 Sep 2026",
    employmentDate: "05 Mar 2018", contractType: "permanent", salaryGrade: "S1",
    monthlySalary: 195_000, bankName: "Union Bank", accountNumber: "0040111001", accountName: "Biodun Salami",
    leaveBalance: 14, leaveTaken: 16, leaveRecords: [
      { type: "annual", dates: "01–10 Sep 2026", days: 10, status: "approved" },
    ],
    emergencyContact: "Mrs. Yemisi Salami", emergencyPhone: "+234 808 010 1102",
    address: "Lugbe, Abuja FCT", lastLogin: "30 Aug 2026, 17:45",
  },
  {
    id: "s-11", employeeId: "USV-EMP-0031", name: "Alhaji Sani Abubakar", initials: "SA",
    title: "Procurement Manager", role: "procurement-manager", directorate: "projects", department: "Procurement",
    company: "USV", reportsTo: "s-03",
    email: "s.abubakar@nexus-erp.com", phone: "+234 803 111 1201",
    status: "active", workload: 85, currentAssignment: "Curtain-wall vendor selection — Kaduna Office Complex (GMD instruction)",
    employmentDate: "18 Nov 2015", contractType: "permanent", salaryGrade: "S4",
    monthlySalary: 920_000, bankName: "Guaranty Trust Bank", accountNumber: "0221120001", accountName: "Sani Abubakar",
    leaveBalance: 22, leaveTaken: 8, leaveRecords: [
      { type: "annual", dates: "15–22 Apr 2026", days: 8, status: "approved" },
    ],
    emergencyContact: "Mrs. Fatima Abubakar", emergencyPhone: "+234 803 111 1202",
    address: "Plot 7 Garki II, Abuja FCT", lastLogin: "Today, 08:30",
  },
  {
    id: "s-12", employeeId: "USV-EMP-0032", name: "Miss Ramatu Yusuf Waziri", initials: "NE",
    title: "Procurement Officer", role: "procurement", directorate: "projects", department: "Procurement",
    company: "USV", reportsTo: "s-11",
    email: "n.eze.proc@nexus-erp.com", phone: "+234 806 212 1301",
    status: "active", workload: 75, currentAssignment: "Preparing RFQ documents for reinforcement steel and cement procurement",
    employmentDate: "01 Mar 2022", contractType: "permanent", salaryGrade: "S2",
    monthlySalary: 340_000, bankName: "Zenith Bank", accountNumber: "1012130001", accountName: "Ramatu Yusuf Waziri",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Dr. Sani Ibrahim Kano", emergencyPhone: "+234 806 212 1302",
    address: "15 Kado Estate, Abuja FCT", lastLogin: "Today, 09:00",
  },
  {
    id: "s-13", employeeId: "USV-EMP-0041", name: "Mrs. Yetunde Adesanya", initials: "YA",
    title: "Project Document Controller", role: "doc-controller", directorate: "projects", department: "Project Document Control",
    company: "USV + CANONIC", reportsTo: "s-03",
    email: "y.adesanya@nexus-erp.com", phone: "+234 809 313 1401",
    status: "active", workload: 70, currentAssignment: "Managing drawing register and document distribution for all active projects",
    employmentDate: "20 Jul 2020", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 520_000, bankName: "Access Bank", accountNumber: "0780140001", accountName: "Yetunde Adesanya",
    leaveBalance: 26, leaveTaken: 4, leaveRecords: [
      { type: "emergency", dates: "14–15 Aug 2026", days: 2, status: "approved" },
    ],
    emergencyContact: "Mr. Femi Adesanya", emergencyPhone: "+234 809 313 1402",
    address: "21 Asokoro, Abuja FCT", lastLogin: "Yesterday, 16:45",
  },

  // ── C. TECHNICAL DIRECTORATE ──
  {
    id: "s-14", employeeId: "CAN-EMP-0011", name: "Arc. Hamza Ibrahim Danladi", initials: "TA",
    title: "Head of Architecture", role: "head-architect", directorate: "technical", department: "Architecture & Design",
    company: "CANONIC", reportsTo: "s-03",
    email: "t.adeyemi@nexus-erp.com", phone: "+234 802 414 1501",
    status: "active", workload: 80, currentAssignment: "Technical design review — Lagos Commercial Development Phase 2 elevation",
    employmentDate: "14 Jan 2013", contractType: "permanent", salaryGrade: "S5",
    monthlySalary: 1_450_000, bankName: "Stanbic IBTC Bank", accountNumber: "0020150001", accountName: "Hamza Ibrahim Danladi",
    leaveBalance: 20, leaveTaken: 10, leaveRecords: [
      { type: "annual", dates: "26 Dec 2025 – 04 Jan 2026", days: 10, status: "approved" },
    ],
    emergencyContact: "Mrs. Tosin Adeyemi", emergencyPhone: "+234 802 414 1502",
    address: "5A Bourdillon Road, Victoria Island, Lagos", lastLogin: "Today, 08:20",
  },
  {
    id: "s-15", employeeId: "CAN-EMP-0012", name: "Arc. Safiya Garba Aliyu", initials: "NO",
    title: "Architect", role: "architect", directorate: "technical", department: "Architecture & Design",
    company: "CANONIC", reportsTo: "s-14",
    email: "n.okoro@nexus-erp.com", phone: "+234 808 515 1601",
    status: "active", workload: 85, currentAssignment: "Supervision architect — Enugu Medical Centre construction phase",
    employmentDate: "09 Apr 2018", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 580_000, bankName: "Ecobank", accountNumber: "5290160001", accountName: "Safiya Garba Aliyu",
    leaveBalance: 25, leaveTaken: 5, leaveRecords: [
      { type: "sick", dates: "22–26 Jul 2026", days: 5, status: "approved" },
    ],
    emergencyContact: "Mr. Chima Okoro", emergencyPhone: "+234 808 515 1602",
    address: "14 Independence Layout, Enugu", lastLogin: "Today, 08:50",
  },
  {
    id: "s-16", employeeId: "CAN-EMP-0013", name: "Mr. Seun Afolabi", initials: "SA",
    title: "Architectural Technician", role: "architect", directorate: "technical", department: "Architecture & Design",
    company: "CANONIC", reportsTo: "s-14",
    email: "s.afolabi@nexus-erp.com", phone: "+234 805 616 1701",
    status: "active", workload: 68, currentAssignment: "CAD drawings revision — Lagos Commercial Development façade details",
    employmentDate: "02 Feb 2023", contractType: "permanent", salaryGrade: "S2",
    monthlySalary: 290_000, bankName: "Union Bank", accountNumber: "0040170001", accountName: "Seun Afolabi",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Mrs. Kemi Afolabi", emergencyPhone: "+234 805 616 1702",
    address: "32 Surulere, Lagos", lastLogin: "Yesterday, 17:30",
  },
  {
    id: "s-17", employeeId: "USV-EMP-0051", name: "QS Haruna Sani Gombe", initials: "BO",
    title: "Head of Quantity Surveying", role: "head-qs", directorate: "technical", department: "Quantity Surveying",
    company: "USV + CANONIC", reportsTo: "s-03",
    email: "b.obi@nexus-erp.com", phone: "+234 803 717 1801",
    status: "active", workload: 82, currentAssignment: "BOQ revision 04 — Kaduna MEP re-measure and variation claims management",
    employmentDate: "07 May 2016", contractType: "permanent", salaryGrade: "S5",
    monthlySalary: 1_320_000, bankName: "First Bank of Nigeria", accountNumber: "3010180001", accountName: "Haruna Sani Gombe",
    leaveBalance: 22, leaveTaken: 8, leaveRecords: [
      { type: "annual", dates: "03–10 Mar 2026", days: 8, status: "approved" },
    ],
    emergencyContact: "Mr. Ibrahim Umar Garba", emergencyPhone: "+234 803 717 1802",
    address: "7 Maitama, Abuja FCT", lastLogin: "Today, 07:55",
  },
  {
    id: "s-18", employeeId: "USV-EMP-0052", name: "Mr. Ismail Sule Waziri", initials: "IO",
    title: "Quantity Surveyor", role: "qs", directorate: "technical", department: "Quantity Surveying",
    company: "USV", reportsTo: "s-17",
    email: "i.obi@nexus-erp.com", phone: "+234 806 818 1901",
    status: "active", workload: 77, currentAssignment: "Interim valuation certificate preparation — Abuja Housing milestone 3",
    employmentDate: "12 Nov 2020", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 545_000, bankName: "Guaranty Trust Bank", accountNumber: "0221190001", accountName: "Ismail Sule Waziri",
    leaveBalance: 26, leaveTaken: 4, leaveRecords: [],
    emergencyContact: "Mrs. Chioma Obi", emergencyPhone: "+234 806 818 1902",
    address: "19 Karu, Abuja FCT", lastLogin: "Today, 08:45",
  },
  {
    id: "s-19", employeeId: "USV-EMP-0061", name: "Engr. Bode Akintunde", initials: "BA",
    title: "Head of Engineering", role: "head-engineering", directorate: "technical", department: "Engineering & Technical Services",
    company: "USV", reportsTo: "s-03",
    email: "b.akintunde@nexus-erp.com", phone: "+234 807 919 2001",
    status: "active", workload: 74, currentAssignment: "Structural review — Block C revised foundation design and geotechnical response",
    employmentDate: "30 Jun 2014", contractType: "permanent", salaryGrade: "S5",
    monthlySalary: 1_390_000, bankName: "Zenith Bank", accountNumber: "1012200001", accountName: "Bode Akintunde",
    leaveBalance: 24, leaveTaken: 6, leaveRecords: [
      { type: "annual", dates: "15–20 Jun 2026", days: 6, status: "approved" },
    ],
    emergencyContact: "Mrs. Lola Akintunde", emergencyPhone: "+234 807 919 2002",
    address: "Plot 33 Jabi, Abuja FCT", lastLogin: "Today, 09:05",
  },
  {
    id: "s-20", employeeId: "USV-EMP-0062", name: "Engr. Aminu Garba", initials: "AG",
    title: "Structural Engineer", role: "engineer", directorate: "technical", department: "Engineering & Technical Services",
    company: "USV", reportsTo: "s-19",
    email: "a.garba@nexus-erp.com", phone: "+234 803 020 2101",
    status: "active", workload: 70, currentAssignment: "Preparing structural calculations — revised foundation depth, Block C",
    employmentDate: "19 Jan 2022", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 540_000, bankName: "Polaris Bank", accountNumber: "4020210001", accountName: "Aminu Garba",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Mrs. Hadiza Garba", emergencyPhone: "+234 803 020 2102",
    address: "Sabon Gari, Kaduna", lastLogin: "Yesterday, 17:10",
  },

  // ── D. CORPORATE SERVICES ──
  {
    id: "s-21", employeeId: "USV-EMP-0071", name: "Mrs. Kemi Adewale", initials: "KA",
    title: "Head of Operations", role: "head-ops", directorate: "corporate", department: "Operations",
    company: "USV + CANONIC", reportsTo: "s-04",
    email: "k.adewale@nexus-erp.com", phone: "+234 805 121 2201",
    status: "active", workload: 68, currentAssignment: "Group operations coordination and logistics management",
    employmentDate: "25 Aug 2015", contractType: "permanent", salaryGrade: "S4",
    monthlySalary: 890_000, bankName: "United Bank for Africa", accountNumber: "2080220001", accountName: "Kemi Adewale",
    leaveBalance: 24, leaveTaken: 6, leaveRecords: [],
    emergencyContact: "Mr. Tunji Adewale", emergencyPhone: "+234 805 121 2202",
    address: "11 Gwarinpa, Abuja FCT", lastLogin: "Today, 08:40",
  },
  {
    id: "s-22", employeeId: "USV-EMP-0081", name: "Mr. Seun Olatunji", initials: "SO",
    title: "Business Development Officer", role: "bd-officer", directorate: "corporate", department: "Business Development & Tenders",
    company: "USV + CANONIC", reportsTo: "s-04",
    email: "s.olatunji@nexus-erp.com", phone: "+234 802 222 2301",
    status: "active", workload: 72, currentAssignment: "Federal Secretariat Annexe tender — commercial preparation and client meetings",
    employmentDate: "11 Mar 2021", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 560_000, bankName: "Access Bank", accountNumber: "0780230001", accountName: "Seun Olatunji",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Mrs. Nike Olatunji", emergencyPhone: "+234 802 222 2302",
    address: "Plot 9 Wuse II, Abuja FCT", lastLogin: "Today, 09:15",
  },
  {
    id: "s-23", employeeId: "USV-EMP-0082", name: "Mr. Femi Ogunsanya", initials: "FO",
    title: "Tender & Proposals Officer", role: "tender-officer", directorate: "corporate", department: "Business Development & Tenders",
    company: "USV + CANONIC", reportsTo: "s-04",
    email: "f.ogunsanya@nexus-erp.com", phone: "+234 809 323 2401",
    status: "active", workload: 85, currentAssignment: "Abuja Light Rail Depot tender technical preparation — pricing and schedule",
    employmentDate: "02 Sep 2022", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 510_000, bankName: "First Bank of Nigeria", accountNumber: "3010240001", accountName: "Femi Ogunsanya",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Mrs. Tola Ogunsanya", emergencyPhone: "+234 809 323 2402",
    address: "23 Lekki Phase 1, Lagos", lastLogin: "Today, 07:50",
  },
  {
    id: "s-24", employeeId: "USV-EMP-0091", name: "Mrs. Maryam Kabiru Suleiman", initials: "CN",
    title: "Finance Manager", role: "finance", directorate: "corporate", department: "Finance & Accounts",
    company: "USV + CANONIC", reportsTo: "s-04",
    email: "c.nwosu@nexus-erp.com", phone: "+234 806 424 2501",
    status: "active", workload: 78, currentAssignment: "Month-end close, FHA receivables escalation and payroll processing",
    employmentDate: "16 Oct 2016", contractType: "permanent", salaryGrade: "S5",
    monthlySalary: 1_280_000, bankName: "Stanbic IBTC Bank", accountNumber: "0020250001", accountName: "Maryam Kabiru Suleiman",
    leaveBalance: 22, leaveTaken: 8, leaveRecords: [
      { type: "maternity", dates: "01 Apr – 30 Jun 2024", days: 90, status: "approved" },
    ],
    emergencyContact: "Mr. Uche Nwosu", emergencyPhone: "+234 806 424 2502",
    address: "4 Maitama Close, Abuja FCT", lastLogin: "Today, 07:30",
  },
  {
    id: "s-25", employeeId: "USV-EMP-0092", name: "Mr. Haruna Abubakar Wali", initials: "TF",
    title: "Accountant", role: "accountant", directorate: "corporate", department: "Finance & Accounts",
    company: "USV + CANONIC", reportsTo: "s-24",
    email: "t.fashola@nexus-erp.com", phone: "+234 801 525 2601",
    status: "active", workload: 72, currentAssignment: "Project cost reconciliation and vendor payment processing",
    employmentDate: "04 Jul 2020", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 530_000, bankName: "Ecobank", accountNumber: "5290260001", accountName: "Haruna Abubakar Wali",
    leaveBalance: 26, leaveTaken: 4, leaveRecords: [],
    emergencyContact: "Mrs. Bisi Fashola", emergencyPhone: "+234 801 525 2602",
    address: "16 Kubwa, Abuja FCT", lastLogin: "Today, 08:10",
  },
  {
    id: "s-26", employeeId: "USV-EMP-0101", name: "Mrs. Zainab Umar Lawan", initials: "FB",
    title: "Head of Administration & HR", role: "head-admin", directorate: "corporate", department: "Administration & Human Resources",
    company: "USV + CANONIC", reportsTo: "s-04",
    email: "f.balogun@nexus-erp.com", phone: "+234 808 626 2701",
    status: "active", workload: 74, currentAssignment: "Leave management, September payroll preparation and ICT user provisioning",
    employmentDate: "09 Feb 2017", contractType: "permanent", salaryGrade: "S4",
    monthlySalary: 950_000, bankName: "Zenith Bank", accountNumber: "1012270001", accountName: "Zainab Umar Lawan",
    leaveBalance: 24, leaveTaken: 6, leaveRecords: [
      { type: "annual", dates: "24–29 Jun 2026", days: 6, status: "approved" },
    ],
    emergencyContact: "Mr. Tayo Balogun", emergencyPhone: "+234 808 626 2702",
    address: "Plot 18 Gwarinpa, Abuja FCT", lastLogin: "Today, 08:00",
  },
  {
    id: "s-27", employeeId: "USV-EMP-0102", name: "Miss Amaka Osei", initials: "AO",
    title: "Administrative Officer", role: "admin", directorate: "corporate", department: "Administration & Human Resources",
    company: "USV + CANONIC", reportsTo: "s-26",
    email: "a.osei@nexus-erp.com", phone: "+234 803 727 2801",
    status: "active", workload: 60, currentAssignment: "Staff movement register, travel logistics and office supply coordination",
    employmentDate: "21 May 2023", contractType: "permanent", salaryGrade: "S2",
    monthlySalary: 285_000, bankName: "United Bank for Africa", accountNumber: "2080280001", accountName: "Amaka Osei",
    leaveBalance: 30, leaveTaken: 0, leaveRecords: [],
    emergencyContact: "Mrs. Chinwe Osei", emergencyPhone: "+234 803 727 2802",
    address: "8 Lokogoma, Abuja FCT", lastLogin: "Today, 09:30",
  },
  {
    id: "s-28", employeeId: "USV-EMP-0111", name: "Mr. Haruna Ibrahim Kure", initials: "EN",
    title: "ICT & ERP Administrator", role: "ict-admin", directorate: "corporate", department: "ICT, ERP & Systems Administration",
    company: "USV + CANONIC", reportsTo: "s-26",
    email: "e.nwosu.ict@nexus-erp.com", phone: "+234 807 828 2901",
    status: "active", workload: 65, currentAssignment: "NEXUS user provisioning, system maintenance and IT infrastructure support",
    employmentDate: "15 Mar 2021", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 520_000, bankName: "Access Bank", accountNumber: "0780290001", accountName: "Haruna Ibrahim Kure",
    leaveBalance: 28, leaveTaken: 2, leaveRecords: [],
    emergencyContact: "Mrs. Ngozi Nwosu", emergencyPhone: "+234 807 828 2902",
    address: "24 Kado, Abuja FCT", lastLogin: "Today, 09:00",
  },
  {
    id: "s-29", employeeId: "USV-EMP-0121", name: "Mr. Lanre Adebayo", initials: "LA",
    title: "Internal Auditor", role: "auditor", directorate: "corporate", department: "Internal Audit & Compliance",
    company: "USV + CANONIC", reportsTo: "s-04",
    email: "l.adebayo@nexus-erp.com", phone: "+234 803 929 3001",
    status: "active", workload: 58, currentAssignment: "Q2 2026 procurement audit — reviewing vendor selection compliance",
    employmentDate: "18 Aug 2019", contractType: "permanent", salaryGrade: "S3",
    monthlySalary: 555_000, bankName: "Stanbic IBTC Bank", accountNumber: "0020300001", accountName: "Lanre Adebayo",
    leaveBalance: 26, leaveTaken: 4, leaveRecords: [
      { type: "annual", dates: "05–08 May 2026", days: 4, status: "approved" },
    ],
    emergencyContact: "Mrs. Funmi Adebayo", emergencyPhone: "+234 803 929 3002",
    address: "Plot 14 Galadimawa, Abuja FCT", lastLogin: "Today, 08:55",
  },
];

export const staffTasks: StaffTask[] = [
  { id: "TSK-2026-0041", title: "Prepare VAR-PRJ001-003 variation report and client submission pack", assigneeId: "s-06", assignedById: "s-05", department: "Project Management", project: "Abuja Housing Ph II", priority: "urgent", status: "in-progress", dueDate: "08 Sep 2026", createdDate: "04 Sep 2026", isExternal: false },
  { id: "TSK-2026-0042", title: "Update project programme — revised Block C sequencing", assigneeId: "s-06", assignedById: "s-05", department: "Project Management", project: "Abuja Housing Ph II", priority: "high", status: "not-started", dueDate: "10 Sep 2026", createdDate: "05 Sep 2026", isExternal: false },
  { id: "TSK-2026-0043", title: "Submit action register update to GED", assigneeId: "s-07", assignedById: "s-05", department: "Project Management", priority: "normal", status: "overdue", dueDate: "05 Sep 2026", createdDate: "02 Sep 2026", isExternal: false },
  { id: "TSK-2026-0044", title: "Submit daily site report SR-PRJ001-083", assigneeId: "s-08", assignedById: "s-08", department: "Construction & Site Management", project: "Abuja Housing Ph II", priority: "urgent", status: "not-started", dueDate: "06 Sep 2026", createdDate: "06 Sep 2026", isExternal: false },
  { id: "TSK-2026-0045", title: "Verify reinforcement bar delivery from Julius Steel — count and tag", assigneeId: "s-09", assignedById: "s-08", department: "Construction & Site Management", project: "Abuja Housing Ph II", priority: "high", status: "in-progress", dueDate: "07 Sep 2026", createdDate: "05 Sep 2026", isExternal: false },
  { id: "TSK-2026-0046", title: "Issue RFQ for cement supply — minimum 3 vendors", assigneeId: "s-12", assignedById: "s-11", department: "Procurement", project: "Abuja Housing Ph II", priority: "urgent", status: "in-progress", dueDate: "08 Sep 2026", createdDate: "04 Sep 2026", isExternal: false },
  { id: "TSK-2026-0047", title: "Prepare curtain-wall vendor comparison matrix (3 quotes received)", assigneeId: "s-12", assignedById: "s-11", department: "Procurement", project: "Government Office Complex", priority: "high", status: "not-started", dueDate: "11 Sep 2026", createdDate: "05 Sep 2026", isExternal: false },
  { id: "TSK-2026-0048", title: "Update drawing register — Rev C GA drawings for Lagos Commercial", assigneeId: "s-13", assignedById: "s-14", department: "Project Document Control", project: "Lagos Commercial Development", priority: "normal", status: "completed", dueDate: "03 Sep 2026", createdDate: "02 Sep 2026", isExternal: true },
  { id: "TSK-2026-0049", title: "Design review — Lagos Commercial Development Level 3 plan layout", assigneeId: "s-15", assignedById: "s-14", department: "Architecture & Design", project: "Lagos Commercial Development", priority: "high", status: "in-progress", dueDate: "09 Sep 2026", createdDate: "04 Sep 2026", isExternal: false },
  { id: "TSK-2026-0050", title: "Issue site instruction SI-CAN-0078 — Enugu external works", assigneeId: "s-15", assignedById: "s-14", department: "Architecture & Design", project: "Enugu Medical Centre", priority: "urgent", status: "not-started", dueDate: "07 Sep 2026", createdDate: "05 Sep 2026", isExternal: false },
  { id: "TSK-2026-0051", title: "Revise CAD elevation sheets — Lagos Commercial façade Rev D", assigneeId: "s-16", assignedById: "s-14", department: "Architecture & Design", project: "Lagos Commercial Development", priority: "normal", status: "in-progress", dueDate: "12 Sep 2026", createdDate: "03 Sep 2026", isExternal: false },
  { id: "TSK-2026-0052", title: "Complete BOQ Revision 04 — Kaduna MEP re-measure and sign off", assigneeId: "s-17", assignedById: "s-03", department: "Quantity Surveying", project: "Government Office Complex", priority: "urgent", status: "in-progress", dueDate: "08 Sep 2026", createdDate: "03 Sep 2026", isExternal: true },
  { id: "TSK-2026-0053", title: "Prepare milestone 3 interim valuation certificate — Abuja Housing", assigneeId: "s-18", assignedById: "s-17", department: "Quantity Surveying", project: "Abuja Housing Ph II", priority: "high", status: "in-progress", dueDate: "10 Sep 2026", createdDate: "04 Sep 2026", isExternal: false },
  { id: "TSK-2026-0054", title: "Structural assessment report — Block C revised foundation", assigneeId: "s-19", assignedById: "s-03", department: "Engineering & Technical Services", project: "Abuja Housing Ph II", priority: "urgent", status: "in-progress", dueDate: "09 Sep 2026", createdDate: "02 Sep 2026", isExternal: true },
  { id: "TSK-2026-0055", title: "Finalize structural calculations for foundation redesign", assigneeId: "s-20", assignedById: "s-19", department: "Engineering & Technical Services", project: "Abuja Housing Ph II", priority: "high", status: "in-progress", dueDate: "08 Sep 2026", createdDate: "04 Sep 2026", isExternal: false },
  { id: "TSK-2026-0056", title: "Reconcile September payroll — all staff deductions and benefits", assigneeId: "s-25", assignedById: "s-24", department: "Finance & Accounts", priority: "urgent", status: "not-started", dueDate: "20 Sep 2026", createdDate: "05 Sep 2026", isExternal: false },
  { id: "TSK-2026-0057", title: "Chase FHA overdue payment — draft formal letter and escalation memo", assigneeId: "s-24", assignedById: "s-03", department: "Finance & Accounts", project: "Abuja Housing Ph II", priority: "urgent", status: "in-progress", dueDate: "08 Sep 2026", createdDate: "04 Sep 2026", isExternal: true },
  { id: "TSK-2026-0058", title: "Prepare Federal Secretariat Annexe tender submission document", assigneeId: "s-23", assignedById: "s-22", department: "Business Development & Tenders", priority: "high", status: "in-progress", dueDate: "15 Sep 2026", createdDate: "01 Sep 2026", isExternal: false },
  { id: "TSK-2026-0059", title: "Provision NEXUS system access for new Project Officer (Wale Okonjo)", assigneeId: "s-28", assignedById: "s-26", department: "ICT, ERP & Systems Administration", priority: "normal", status: "completed", dueDate: "15 Jun 2026", createdDate: "14 Jun 2026", isExternal: false },
  { id: "TSK-2026-0060", title: "Procurement audit fieldwork — review PR-USV-2026-0079 supporting docs", assigneeId: "s-29", assignedById: "s-04", department: "Internal Audit & Compliance", priority: "normal", status: "in-progress", dueDate: "15 Sep 2026", createdDate: "01 Sep 2026", isExternal: false },
  { id: "TSK-2026-0061", title: "Process leave applications — September batch (4 pending)", assigneeId: "s-26", assignedById: "s-26", department: "Administration & Human Resources", priority: "high", status: "in-progress", dueDate: "07 Sep 2026", createdDate: "06 Sep 2026", isExternal: false },
  { id: "TSK-2026-0062", title: "Prepare September payroll summary for Finance sign-off", assigneeId: "s-26", assignedById: "s-04", department: "Administration & Human Resources", priority: "urgent", status: "not-started", dueDate: "10 Sep 2026", createdDate: "05 Sep 2026", isExternal: false },
  { id: "TSK-2026-0063", title: "Coordinate new joiner onboarding — 3 staff reporting 08 Sep", assigneeId: "s-27", assignedById: "s-26", department: "Administration & Human Resources", priority: "urgent", status: "in-progress", dueDate: "08 Sep 2026", createdDate: "04 Sep 2026", isExternal: false },
  { id: "TSK-2026-0064", title: "Update staff records — contract renewal for 2 engineering officers", assigneeId: "s-27", assignedById: "s-26", department: "Administration & Human Resources", priority: "normal", status: "overdue", dueDate: "01 Sep 2026", createdDate: "20 Aug 2026", isExternal: false },
];

export const searchIndex = [
  { type: "Project", label: "Abuja Housing Development — Phase II", meta: "USV + CANONIC · Lugbe · At Risk", nav: "project" },
  { type: "Project", label: "Government Office Complex", meta: "USV + CANONIC · Kaduna · Attention", nav: "portfolio" },
  { type: "Project", label: "Enugu Medical Centre", meta: "CANONIC · Enugu · Attention", nav: "portfolio" },
  { type: "Contract", label: "CON-USV-2026-0021", meta: "USV · ₦2.15bn · Active", nav: "portfolio" },
  { type: "Client", label: "Federal Ministry of Works", meta: "2 projects · ₦145m outstanding", nav: "clients" },
  { type: "Client", label: "Landmark Properties Ltd", meta: "2 projects · ₦85m outstanding", nav: "clients" },
  { type: "Client", label: "Kaduna State Government", meta: "1 project · active contract", nav: "clients" },
  { type: "Tender", label: "TND-2026-0045 Federal Secretariat Annexe", meta: "Commercial Prep · closes 18 Sep", nav: "business-dev" },
  { type: "Tender", label: "TND-2026-0041 Lekki Waterfront Residences", meta: "Internal Review · closes 09 Sep", nav: "business-dev" },
  { type: "Tender", label: "TND-2026-0038 Abuja Light Rail Depot", meta: "Technical Prep · closes 26 Sep", nav: "business-dev" },
  { type: "Purchase Order", label: "PO-USV-2026-0067", meta: "Julius Steel Ltd · ₦63.4m · Issued", nav: "procurement" },
  { type: "Invoice", label: "INV-USV-2026-0044", meta: "FHA · ₦85m · Overdue 34 days", nav: "command" },
  { type: "Site Report", label: "SR-PRJ001-082", meta: "Abuja Housing · foundation · Reviewed", nav: "project" },
  { type: "Staff", label: "Engr. Musa Usman Lawan", meta: "USV · PM · 3 active projects · overloaded", nav: "portfolio" },
  { type: "Meeting", label: "MTG-2026-0047 — Project Progress Review", meta: "Abuja Housing · 05 Sep · 2 open actions", nav: "meetings" },
  { type: "Meeting", label: "MTG-2026-0046 — Procurement Committee Q3", meta: "Group · 03 Sep · 3 open actions", nav: "meetings" },
  { type: "Instruction", label: "INS-2026-0089 — Expedite reinforcement delivery", meta: "USV · GMD → PM · Urgent · Open", nav: "instructions" },
  { type: "Instruction", label: "CLT-2026-0031 — ₦85m overdue client letter", meta: "FHA · GMD · Awaiting Response", nav: "instructions" },
  { type: "Drawing", label: "DRW-CAN-0442 — Ground Floor GA Rev C", meta: "CANONIC · Architecture · Awaiting Approval", nav: "documents" },
  { label: "Variation Management", type: "Module", meta: "VC-001 · VC-002 · VC-003", nav: "variations" },
  { label: "Payment Certificates", type: "Module", meta: "PC-2026-01 · PC-2026-04", nav: "payment-certs" },
  { label: "Client Portal", type: "Module", meta: "Lekki Dev Authority · Abuja Metropolitan", nav: "client-portal" },
  { label: "VC-001 — Additional earthworks Zone C", type: "Variation", meta: "PRJ-USV-2026-0015 · ₦4.85M · Approved", nav: "variations" },
  { label: "PC-2026-04 — Payment Certificate", type: "Certificate", meta: "Zenith Builders · ₦47M · Submitted", nav: "payment-certs" },
  { type: "Assignment", label: "CALC-ENG-004 — Roof Beam Sizing: Block D", meta: "Engineer · Due Today · In Progress", nav: "role-home" },
  { type: "Assignment", label: "DWG-ENM-042 — First Floor Layout Revision", meta: "Architect · Rev A · Under Review", nav: "role-home" },
  { type: "Assignment", label: "BOQ-PRJ001-007 — Block C Column Measurement", meta: "QS · Rev 01 · Under Review", nav: "role-home" },
  { type: "Assignment", label: "RFQ-USV-2026-010 — Electrical Cable Supply", meta: "Procurement · Issued · 3 Vendors", nav: "role-home" },
  { type: "Duty",       label: "Pre-Pour Inspection Block C — 06 Sep", meta: "Site Officer · Due Today", nav: "role-home" },
  { type: "Document",   label: "SPEC-ENM-023 — Structural Specification: Medical Centre", meta: "Engineering · Rev 01 · Under Review", nav: "documents" },
  { type: "Document",   label: "VAL-PRJ021-004 — M&E Interim Valuation Certificate", meta: "QS · Awaiting Approval", nav: "documents" },
  { type: "Staff",      label: "Arc. Safiya Garba Aliyu", meta: "CANONIC · Architect Officer · 4 active assignments", nav: "people" },
  { type: "Staff",      label: "Mr. Ismail Sule Waziri", meta: "USV · Junior QS · 3 active assignments", nav: "people" },
];

export interface ProcRequest {
  id: string;
  item: string;
  project: string;
  location: string;
  company: Company;
  amount: number;
  requestedBy: string;
  requesterId: string;
  currentStage: number;
  approvalChain: string[];
  finalApprover: string;
  disbursedBy: string | null;
  disbursedAt: string | null;
  blocker: string | null;
  blockedAt: string | null;
  sla: Health;
  submitted: string;
}

// ── Nav badges (count of pending items per route) ──
export const navBadges: Record<string, number> = {
  approvals: 3,
  action: 5,
  procurement: 2,
  invoices: 1,
};

// ── Staff directory (simplified for approver picker) ──
export interface StaffDirectoryEntry {
  id: string;
  name: string;
  title: string;
  department: string;
  company: Company;
  authority: string;
}

export const staffDirectory: StaffDirectoryEntry[] = [
  { id: "s-01", name: "Alhaji Mustapha Sule Dankaka",           title: "Chairman",                              department: "Board",                              company: "USV + CANONIC", authority: "CHAIRMAN" },
  { id: "s-02", name: "Dr. Ibrahim Umar Garba",          title: "Group Managing Director",               department: "Group Executive",                    company: "USV + CANONIC", authority: "GMD" },
  { id: "s-03", name: "Engr. Fatima Aliyu Dantata",        title: "Group Executive Director — Projects",   department: "Group Executive",                    company: "USV + CANONIC", authority: "EXECUTIVE" },
  { id: "s-03b", name: "Engr. Yahaya Abdullahi Bello",        title: "Executive Director — Corporate Services", department: "Group Executive",                  company: "USV + CANONIC", authority: "EXECUTIVE" },
  { id: "s-04", name: "Barr. Hauwa Suleiman Abubakar",       title: "Group General Manager (Operations)",    department: "Group Operations",                   company: "USV + CANONIC", authority: "GGMP" },
  { id: "s-05", name: "Engr. Musa Usman Lawan",           title: "Senior Project Manager",                department: "Project Management",                 company: "USV",           authority: "MANAGER" },
  { id: "s-06", name: "Engr. Zainab Abubakar Waziri",            title: "Project Coordinator",                   department: "Project Management",                 company: "USV",           authority: "COORDINATOR" },
  { id: "s-11", name: "Alhaji Sani Abubakar",       title: "Procurement Manager",                   department: "Procurement",                        company: "USV",           authority: "MANAGER" },
  { id: "s-14", name: "Arc. Hamza Ibrahim Danladi",         title: "Head of Architecture",                  department: "Architecture & Design",              company: "CANONIC",       authority: "HEAD" },
  { id: "s-17", name: "QS Haruna Sani Gombe",            title: "Head of Quantity Surveying",            department: "Quantity Surveying",                 company: "USV + CANONIC", authority: "HEAD" },
  { id: "s-19", name: "Engr. Bode Akintunde",       title: "Head of Engineering",                   department: "Engineering & Technical Services",   company: "USV",           authority: "HEAD" },
  { id: "s-21", name: "Mrs. Kemi Adewale",          title: "Head of Operations",                    department: "Operations",                         company: "USV + CANONIC", authority: "HEAD" },
  { id: "s-24", name: "Mrs. Maryam Kabiru Suleiman",          title: "Finance Manager",                       department: "Finance & Accounts",                 company: "USV + CANONIC", authority: "MANAGER" },
  { id: "s-26", name: "Mrs. Zainab Umar Lawan",        title: "Head of Administration & HR",           department: "Administration & Human Resources",   company: "USV + CANONIC", authority: "HEAD" },
  { id: "s-29", name: "Mr. Lanre Adebayo",          title: "Internal Auditor",                      department: "Internal Audit & Compliance",         company: "USV + CANONIC", authority: "AUDITOR" },
];

// ── Chain-of-custody approval requests ──
export type ApprovalStepStatus = "pending" | "approved" | "rejected" | "final";

export interface ApprovalStep {
  staffId: string;
  staffName: string;
  staffTitle: string;
  action: ApprovalStepStatus;
  note: string;
  timestamp: string;
  isFinal: boolean;
}

export type ApprovalRequestType = "Purchase Order" | "Invoice" | "Variation" | "Payment Certificate" | "HR Request" | "General";
export type ApprovalRequestStatus = "pending" | "in-review" | "approved" | "rejected" | "disbursed";

export interface ApprovalRequest {
  id: string;
  type: ApprovalRequestType;
  title: string;
  amount?: number;
  requesterStaffId: string;
  requesterName: string;
  requesterTitle: string;
  project: string;
  company: Company;
  submitted: string;
  sla: Health;
  notes: string;
  status: ApprovalRequestStatus;
  chain: ApprovalStep[];
  disbursedBy?: string;
  disbursedAt?: string;
}

export const approvalRequests: ApprovalRequest[] = [
  {
    id: "AP-2026-0081",
    type: "Purchase Order",
    title: "Reinforcement steel — 42T Y16/Y12",
    amount: 63_400_000,
    requesterStaffId: "s-08",
    requesterName: "Engr. Jamilu Umar Sani",
    requesterTitle: "Site Supervisor — Abuja",
    project: "Abuja Housing Ph II",
    company: "USV",
    submitted: "2 days ago",
    sla: "critical",
    notes: "Critical material — site will idle if not treated. Foundation works blocked.",
    status: "in-review",
    chain: [
      { staffId: "s-11", staffName: "Alhaji Sani Abubakar", staffTitle: "Procurement Manager", action: "approved", note: "RFQ complete. Julius Steel Ltd is lowest conforming bid.", timestamp: "1 day ago", isFinal: false },
      { staffId: "s-03", staffName: "Engr. Fatima Aliyu Dantata", staffTitle: "GED Projects", action: "pending", note: "", timestamp: "", isFinal: false },
    ],
  },
  {
    id: "AP-2026-0079",
    type: "Purchase Order",
    title: "Diesel supply — 12,000L site power",
    amount: 14_100_000,
    requesterStaffId: "s-08",
    requesterName: "Engr. Jamilu Umar Sani",
    requesterTitle: "Site Supervisor — Abuja",
    project: "Abuja Housing Ph II",
    company: "USV",
    submitted: "6 hrs ago",
    sla: "attention",
    notes: "Generator running low. Needed before morning shift.",
    status: "in-review",
    chain: [
      { staffId: "s-21", staffName: "Mrs. Kemi Adewale", staffTitle: "Head of Operations", action: "pending", note: "", timestamp: "", isFinal: false },
    ],
  },
  {
    id: "AP-2026-0203",
    type: "General",
    title: "Site survey — Enugu 2nd visit",
    amount: 2_350_000,
    requesterStaffId: "s-15",
    requesterName: "Arc. Safiya Garba Aliyu",
    requesterTitle: "Architect",
    project: "Enugu Medical Centre",
    company: "CANONIC",
    submitted: "1 day ago",
    sla: "healthy",
    notes: "Soil anomaly found on first visit. Specialist second survey required.",
    status: "in-review",
    chain: [
      { staffId: "s-14", staffName: "Arc. Hamza Ibrahim Danladi", staffTitle: "Head of Architecture", action: "approved", note: "Technically justified — soil issue confirmed.", timestamp: "Today, 10:00", isFinal: false },
      { staffId: "s-03", staffName: "Engr. Fatima Aliyu Dantata", staffTitle: "GED Projects", action: "pending", note: "", timestamp: "", isFinal: false },
    ],
  },
  {
    id: "AP-2026-0051",
    type: "Payment Certificate",
    title: "Subcontractor valuation 2 — blockwork",
    amount: 31_800_000,
    requesterStaffId: "s-17",
    requesterName: "QS Haruna Sani Gombe",
    requesterTitle: "Head of Quantity Surveying",
    project: "PH Logistics Warehouse",
    company: "USV",
    submitted: "3 days ago",
    sla: "healthy",
    notes: "Blockwork subcontractor has completed Val. 2. Payment due per contract milestones.",
    status: "disbursed",
    chain: [
      { staffId: "s-24", staffName: "Mrs. Maryam Kabiru Suleiman", staffTitle: "Finance Manager", action: "final", note: "Payment certified. Disbursement processed.", timestamp: "Today, 11:30", isFinal: true },
    ],
    disbursedBy: "Mrs. Maryam Kabiru Suleiman",
    disbursedAt: "Today, 11:30",
  },
  {
    id: "AP-2026-0018",
    type: "Variation",
    title: "Vendor selection — curtain wall (3 quotes)",
    amount: 210_000_000,
    requesterStaffId: "s-11",
    requesterName: "Alhaji Sani Abubakar",
    requesterTitle: "Procurement Manager",
    project: "Government Office Complex",
    company: "USV + CANONIC",
    submitted: "1 day ago",
    sla: "attention",
    notes: "Recommended vendor: Cladtech Nigeria Ltd (mid-price, strongest reference).",
    status: "in-review",
    chain: [
      { staffId: "s-04", staffName: "Barr. Hauwa Suleiman Abubakar", staffTitle: "GGMP Operations", action: "pending", note: "", timestamp: "", isFinal: false },
    ],
  },
  {
    id: "AP-2026-0091",
    type: "HR Request",
    title: "Annual leave approval — 4 pending staff requests",
    requesterStaffId: "s-26",
    requesterName: "Mrs. Zainab Umar Lawan",
    requesterTitle: "Head of Admin & HR",
    project: "Group Administration",
    company: "USV + CANONIC",
    submitted: "Today",
    sla: "healthy",
    notes: "Leave requests from Engr. Oyelaran, Miss Eze (Proc), Mr. Okonjo, and Arc. Okoro all pending.",
    status: "pending",
    chain: [],
  },
];

// ── Contracts ──
export interface Contract {
  id: string;
  title: string;
  client: string;
  company: Company;
  project: string;
  type: "Lump Sum" | "Remeasurement" | "Cost Plus" | "Consultancy" | "Supply";
  value: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "suspended" | "expired" | "in-negotiation";
  daysToExpiry: number;
  retentionRate: number;
  retentionHeld: number;
  paymentTerms: string;
  pm: string;
}

export const contracts: Contract[] = [
  { id: "CON-USV-2026-0015", title: "Abuja Housing Development — Phase II", client: "Federal Housing Authority", company: "USV + CANONIC", project: "Abuja Housing Ph II", type: "Lump Sum", value: 1_380_000_000, startDate: "01 Feb 2025", endDate: "14 Aug 2026", status: "active", daysToExpiry: 7, retentionRate: 5, retentionHeld: 69_000_000, paymentTerms: "30 days net", pm: "Engr. Musa Usman Lawan" },
  { id: "CON-CAN-2026-0008", title: "Lagos Commercial Development — Architecture", client: "Landmark Properties Ltd", company: "CANONIC", project: "Lagos Commercial Development", type: "Consultancy", value: 640_000_000, startDate: "01 Mar 2025", endDate: "30 Nov 2026", status: "active", daysToExpiry: 83, retentionRate: 0, retentionHeld: 0, paymentTerms: "Monthly milestones", pm: "Arc. Hamza Ibrahim Danladi" },
  { id: "CON-USV-2026-0021", title: "Government Office Complex — Kaduna", client: "Kaduna State Government", company: "USV + CANONIC", project: "Government Office Complex", type: "Remeasurement", value: 2_150_000_000, startDate: "01 Jun 2025", endDate: "12 Mar 2027", status: "active", daysToExpiry: 185, retentionRate: 5, retentionHeld: 45_000_000, paymentTerms: "IPC within 30 days", pm: "Engr. Musa Usman Lawan" },
  { id: "CON-USV-2026-0009", title: "Port Harcourt Logistics Warehouse", client: "Delta Freight Nigeria", company: "USV", project: "PH Logistics Warehouse", type: "Lump Sum", value: 480_000_000, startDate: "15 Sep 2024", endDate: "05 Jun 2026", status: "active", daysToExpiry: -90, retentionRate: 5, retentionHeld: 24_000_000, paymentTerms: "30 days net", pm: "Engr. Zainab Abubakar Waziri" },
  { id: "CON-CAN-2026-0012", title: "Enugu Medical Centre — Design & Supervision", client: "Enugu State Ministry of Health", company: "CANONIC", project: "Enugu Medical Centre", type: "Consultancy", value: 310_000_000, startDate: "01 Jan 2025", endDate: "22 Sep 2026", status: "active", daysToExpiry: 14, retentionRate: 0, retentionHeld: 0, paymentTerms: "Monthly", pm: "Arc. Safiya Garba Aliyu" },
  { id: "CON-USV-2025-0044", title: "Ibadan Ring Road Rehabilitation", client: "Oyo State Government", company: "USV", project: "Ibadan Ring Road Rehabilitation", type: "Remeasurement", value: 920_000_000, startDate: "01 Jun 2024", endDate: "18 May 2026", status: "completed", daysToExpiry: -113, retentionRate: 5, retentionHeld: 46_000_000, paymentTerms: "Monthly IPC", pm: "Engr. Zainab Abubakar Waziri" },
];

// ── ICT Assets ──
export interface ICTAsset {
  id: string;
  name: string;
  type: "Laptop" | "Desktop" | "Printer" | "Server" | "Network" | "Phone" | "Tablet" | "Camera" | "UPS";
  brand: string;
  model: string;
  serialNumber: string;
  assignedTo: string;
  department: string;
  company: Company;
  purchaseDate: string;
  warrantyExpiry: string;
  status: "active" | "faulty" | "decommissioned" | "in-repair" | "spare";
  location: string;
  purchaseValue: number;
}

export const ictAssets: ICTAsset[] = [
  { id: "AST-001", name: "Laptop — Dell Latitude 5540", type: "Laptop",  brand: "Dell",       model: "Latitude 5540",  serialNumber: "DL-5540-0021", assignedTo: "Engr. Musa Usman Lawan",       department: "Project Management",     company: "USV",           purchaseDate: "Jan 2024", warrantyExpiry: "Jan 2027", status: "active",      location: "Abuja Office", purchaseValue: 1_850_000 },
  { id: "AST-002", name: "Laptop — HP EliteBook 840",   type: "Laptop",  brand: "HP",         model: "EliteBook 840",  serialNumber: "HP-840-0034",  assignedTo: "Arc. Safiya Garba Aliyu",        department: "Architecture & Design",  company: "CANONIC",       purchaseDate: "Mar 2023", warrantyExpiry: "Mar 2026", status: "faulty",      location: "Lagos Office", purchaseValue: 1_640_000 },
  { id: "AST-003", name: "Desktop — HP Z2 Tower",       type: "Desktop", brand: "HP",         model: "Z2 Tower G9",    serialNumber: "HP-Z2-0018",   assignedTo: "Mr. Haruna Ibrahim Kure",         department: "ICT",                    company: "USV + CANONIC", purchaseDate: "Jun 2022", warrantyExpiry: "Jun 2025", status: "active",      location: "Abuja Office", purchaseValue: 1_200_000 },
  { id: "AST-004", name: "Server — Dell PowerEdge R350", type: "Server",  brand: "Dell",       model: "PowerEdge R350", serialNumber: "DL-R350-0003", assignedTo: "ICT Dept.",               department: "ICT",                    company: "USV + CANONIC", purchaseDate: "Sep 2022", warrantyExpiry: "Sep 2025", status: "active",      location: "Server Room — Abuja", purchaseValue: 8_400_000 },
  { id: "AST-005", name: "Laptop — Lenovo ThinkPad T14", type: "Laptop", brand: "Lenovo",     model: "ThinkPad T14",   serialNumber: "LN-T14-0041",  assignedTo: "Mrs. Maryam Kabiru Suleiman",       department: "Finance",                company: "USV + CANONIC", purchaseDate: "Aug 2023", warrantyExpiry: "Aug 2026", status: "active",      location: "Abuja Office", purchaseValue: 1_540_000 },
  { id: "AST-006", name: "Laptop — Dell Latitude 3540",  type: "Laptop", brand: "Dell",       model: "Latitude 3540",  serialNumber: "DL-3540-0015", assignedTo: "Mr. Sa'adu Usman Garba",  department: "Site Management",        company: "USV",           purchaseDate: "Dec 2023", warrantyExpiry: "Dec 2026", status: "active",      location: "Site — Abuja", purchaseValue: 1_100_000 },
  { id: "AST-007", name: "Network Switch — Cisco 2960",  type: "Network",brand: "Cisco",      model: "Catalyst 2960",  serialNumber: "CS-2960-0007", assignedTo: "ICT Dept.",               department: "ICT",                    company: "USV + CANONIC", purchaseDate: "Jan 2021", warrantyExpiry: "Jan 2024", status: "active",      location: "Server Room — Abuja", purchaseValue: 3_200_000 },
  { id: "AST-008", name: "Printer — HP LaserJet M428",   type: "Printer",brand: "HP",         model: "LaserJet M428",  serialNumber: "HP-LJ-0022",   assignedTo: "Shared — Finance Dept.",  department: "Finance",                company: "USV + CANONIC", purchaseDate: "Feb 2022", warrantyExpiry: "Feb 2025", status: "in-repair",   location: "Abuja Office", purchaseValue: 380_000 },
  { id: "AST-009", name: "UPS — APC Smart-UPS 1500",     type: "UPS",    brand: "APC",        model: "Smart-UPS 1500", serialNumber: "APC-1500-0004",assignedTo: "ICT Dept.",               department: "ICT",                    company: "USV + CANONIC", purchaseDate: "Sep 2022", warrantyExpiry: "Sep 2025", status: "active",      location: "Server Room — Abuja", purchaseValue: 420_000 },
  { id: "AST-010", name: "Tablet — iPad 10th Gen",       type: "Tablet", brand: "Apple",      model: "iPad 10th Gen",  serialNumber: "AP-PAD-0009",  assignedTo: "Engr. Jamilu Umar Sani",    department: "Site Management",        company: "USV",           purchaseDate: "Nov 2023", warrantyExpiry: "Nov 2025", status: "active",      location: "Site — Abuja", purchaseValue: 680_000 },
];

// ── ICT Tickets ──
export interface ICTTicket {
  id: string;
  title: string;
  reporter: string;
  department: string;
  company: Company;
  type: "Hardware" | "Software" | "Access" | "Network" | "ERP" | "Email";
  priority: "urgent" | "high" | "normal" | "low";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignedTo: string;
  opened: string;
  resolved?: string;
  notes: string;
}

export const ictTickets: ICTTicket[] = [
  { id: "TKT-2026-0041", title: "Arc. Safiya Garba Aliyu laptop — keyboard failure",           reporter: "Arc. Safiya Garba Aliyu",       department: "Architecture",     company: "CANONIC",       type: "Hardware",  priority: "high",   status: "in-progress", assignedTo: "Mr. Haruna Ibrahim Kure",   opened: "Today, 08:30",   notes: "HP EliteBook keyboard unresponsive. Replacement ordered." },
  { id: "TKT-2026-0042", title: "NEXUS login issue — Miss Ramatu Yusuf Waziri (Procurement)",    reporter: "Miss Ramatu Yusuf Waziri",          department: "Procurement",      company: "USV",           type: "ERP",       priority: "urgent", status: "open",        assignedTo: "Unassigned",        opened: "Today, 09:10",   notes: "Password reset failing — account may be locked." },
  { id: "TKT-2026-0043", title: "Finance shared printer — paper jam / toner",          reporter: "Mr. Haruna Abubakar Wali",       department: "Finance",          company: "USV + CANONIC", type: "Hardware",  priority: "normal", status: "in-progress", assignedTo: "Mr. Haruna Ibrahim Kure",   opened: "Yesterday",      notes: "HP LaserJet M428 sent for repair. ETA 2 days." },
  { id: "TKT-2026-0044", title: "VPN access required — site officer (Kaduna)",         reporter: "Engr. Zainab Abubakar Waziri",         department: "Project Mgmt",     company: "USV",           type: "Access",    priority: "high",   status: "open",        assignedTo: "Mr. Haruna Ibrahim Kure",   opened: "Yesterday",      notes: "New site officer at Kaduna needs VPN credentials." },
  { id: "TKT-2026-0045", title: "Email delivery failure — Canonic outbound SMTP",     reporter: "Mrs. Yetunde Adesanya",   department: "Doc Control",      company: "CANONIC",       type: "Email",     priority: "urgent", status: "resolved",    assignedTo: "Mr. Haruna Ibrahim Kure",   opened: "2 days ago", resolved: "Yesterday, 16:00", notes: "SMTP relay misconfiguration. Fixed and tested." },
  { id: "TKT-2026-0046", title: "NEXUS — slow performance on Procurement module",     reporter: "Miss Ramatu Yusuf Waziri",          department: "Procurement",      company: "USV",           type: "ERP",       priority: "normal", status: "open",        assignedTo: "Unassigned",        opened: "3 days ago",     notes: "Intermittent slowness on PO creation. Under investigation." },
  { id: "TKT-2026-0047", title: "New user account — Mr. Wale Okonjo (Project Offr)", reporter: "Mrs. Zainab Umar Lawan",     department: "Admin & HR",       company: "USV",           type: "Access",    priority: "normal", status: "resolved",    assignedTo: "Mr. Haruna Ibrahim Kure",   opened: "15 Jun 2026", resolved: "15 Jun 2026", notes: "Account created. NEXUS access provisioned." },
];

// ── Risk Register ──
export interface RiskItem {
  id: string;
  title: string;
  category: "Financial" | "Schedule" | "Technical" | "Legal" | "Reputational" | "Safety";
  project: string;
  company: Company;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  status: "open" | "mitigated" | "closed" | "escalated";
  owner: string;
  mitigation: string;
  dateRaised: string;
}

export const riskItems: RiskItem[] = [
  { id: "RSK-2026-0021", title: "Abuja Housing — foundation cost overrun due to soil variance", category: "Financial", project: "Abuja Housing Ph II", company: "USV", likelihood: 5, impact: 5, status: "open", owner: "Engr. Musa Usman Lawan", mitigation: "Variation submitted to FHA. Revised BOQ under GED review.", dateRaised: "04 Sep 2026" },
  { id: "RSK-2026-0022", title: "FHA receivables — ₦85m overdue 34 days; cash flow impact", category: "Financial", project: "Abuja Housing Ph II", company: "USV", likelihood: 4, impact: 5, status: "escalated", owner: "Mrs. Maryam Kabiru Suleiman", mitigation: "GMD letter issued. Finance team chasing daily.", dateRaised: "01 Sep 2026" },
  { id: "RSK-2026-0023", title: "Curtain-wall procurement delay — critical path for Kaduna", category: "Schedule", project: "Government Office Complex", company: "USV + CANONIC", likelihood: 4, impact: 4, status: "open", owner: "Alhaji Sani Abubakar", mitigation: "GMD instruction to expedite. 3 quotes in. GGMP to approve.", dateRaised: "03 Sep 2026" },
  { id: "RSK-2026-0024", title: "Enugu Medical Centre — client relationship critical", category: "Reputational", project: "Enugu Medical Centre", company: "CANONIC", likelihood: 3, impact: 5, status: "open", owner: "Arc. Safiya Garba Aliyu", mitigation: "Client meeting scheduled for 12 Sep. Design team to present revised schedule.", dateRaised: "02 Sep 2026" },
  { id: "RSK-2026-0025", title: "Ring Road — 4% completion gap (96% vs 100% planned)", category: "Schedule", project: "Ibadan Ring Road Rehabilitation", company: "USV", likelihood: 2, impact: 3, status: "mitigated", owner: "Engr. Zainab Abubakar Waziri", mitigation: "Snagging list being addressed. Expected handover +2 weeks.", dateRaised: "20 Aug 2026" },
  { id: "RSK-2026-0026", title: "Staff overload — Engr. Musa Usman Lawan at 95% workload (3 projects)", category: "Technical", project: "Abuja Housing Ph II", company: "USV", likelihood: 4, impact: 3, status: "open", owner: "Engr. Fatima Aliyu Dantata", mitigation: "Resource review with GED scheduled. Additional PM being hired.", dateRaised: "05 Sep 2026" },
  { id: "RSK-2026-0027", title: "Tender deadline — Federal Secretariat Annexe closes 18 Sep", category: "Financial", project: "Federal Secretariat Annexe (Tender)", company: "USV + CANONIC", likelihood: 3, impact: 4, status: "open", owner: "Mr. Femi Ogunsanya", mitigation: "Tender team engaged. Pricing 70% complete.", dateRaised: "01 Sep 2026" },
  { id: "RSK-2026-0028", title: "Warrant expiry — Cisco network switch Jan 2024 (unrenewed)", category: "Technical", project: "ICT Infrastructure", company: "USV + CANONIC", likelihood: 2, impact: 3, status: "open", owner: "Mr. Haruna Ibrahim Kure", mitigation: "ICT admin to evaluate replacement vs SMARTnet renewal.", dateRaised: "06 Sep 2026" },
];

// ── Finance data ──
export interface CashFlowPoint {
  month: string;
  income: number;
  expenditure: number;
  net: number;
}

export const cashFlowData: CashFlowPoint[] = [
  { month: "Apr", income: 142_000_000, expenditure: 98_000_000,  net: 44_000_000  },
  { month: "May", income: 185_000_000, expenditure: 133_000_000, net: 52_000_000  },
  { month: "Jun", income: 96_000_000,  expenditure: 128_000_000, net: -32_000_000 },
  { month: "Jul", income: 220_000_000, expenditure: 155_000_000, net: 65_000_000  },
  { month: "Aug", income: 163_000_000, expenditure: 180_000_000, net: -17_000_000 },
  { month: "Sep", income: 48_000_000,  expenditure: 95_000_000,  net: -47_000_000 },
];

export interface PayableItem {
  id: string;
  vendor: string;
  description: string;
  project: string;
  company: Company;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  status: "current" | "overdue" | "paid" | "disputed";
}

export const payables: PayableItem[] = [
  { id: "PAY-001", vendor: "Julius Steel Ltd",        description: "Reinforcement steel — 42T",   project: "Abuja Housing Ph II",        company: "USV",           amount: 63_400_000, dueDate: "12 Sep 2026", daysOverdue: 0, status: "current"  },
  { id: "PAY-002", vendor: "Cladtech Nigeria Ltd",    description: "Curtain-wall supply deposit",  project: "Government Office Complex",  company: "USV",           amount: 42_000_000, dueDate: "30 Aug 2026", daysOverdue: 9, status: "overdue"  },
  { id: "PAY-003", vendor: "Zenith Power Solutions",  description: "Generator diesel — 12,000L",   project: "Abuja Housing Ph II",        company: "USV",           amount: 14_100_000, dueDate: "14 Sep 2026", daysOverdue: 0, status: "current"  },
  { id: "PAY-004", vendor: "Enugu Geo-Tech Ltd",      description: "Site survey — 2nd visit",      project: "Enugu Medical Centre",       company: "CANONIC",       amount: 2_350_000,  dueDate: "07 Sep 2026", daysOverdue: 1, status: "overdue"  },
  { id: "PAY-005", vendor: "Gbadebo Blockworks Ltd",  description: "Subcontractor Val. 2",         project: "PH Logistics Warehouse",     company: "USV",           amount: 31_800_000, dueDate: "01 Sep 2026", daysOverdue: 0, status: "paid"     },
  { id: "PAY-006", vendor: "Apex Civil Engineering",  description: "Earthworks subcontract",       project: "Abuja Housing Ph II",        company: "USV",           amount: 85_000_000, dueDate: "25 Aug 2026", daysOverdue: 14, status: "disputed" },
];

export const procRequests: ProcRequest[] = [
  {
    id: "PR-USV-2026-0081",
    item: "Reinforcement steel — 42T Y16/Y12",
    project: "Abuja Housing Ph II",
    location: "Lugbe, Abuja FCT",
    company: "USV",
    amount: 63_400_000,
    requestedBy: "Engr. Jamilu Umar Sani (Site Supervisor)",
    requesterId: "site-supervisor",
    currentStage: 3,
    approvalChain: ["GED Projects", "GGMP", "GMD"],
    finalApprover: "GMD",
    disbursedBy: null,
    disbursedAt: null,
    blocker: "Awaiting GED Projects approval — SLA breached by 2 days. Foundation works halted.",
    blockedAt: "Approval",
    sla: "critical",
    submitted: "2 days ago",
  },
  {
    id: "PR-USV-2026-0079",
    item: "Diesel — 12,000L site power",
    project: "Abuja Housing Ph II",
    location: "Lugbe, Abuja FCT",
    company: "USV",
    amount: 14_100_000,
    requestedBy: "Engr. Jamilu Umar Sani (Site Supervisor)",
    requesterId: "site-supervisor",
    currentStage: 2,
    approvalChain: ["Head of Operations", "GGMP"],
    finalApprover: "GGMP",
    disbursedBy: null,
    disbursedAt: null,
    blocker: "Ops Officer review in progress — within SLA.",
    blockedAt: null,
    sla: "attention",
    submitted: "6 hrs ago",
  },
  {
    id: "EXP-CAN-2026-0203",
    item: "Site survey — Enugu (2nd visit)",
    project: "Enugu Medical Centre",
    location: "GRA, Enugu",
    company: "CANONIC",
    amount: 2_350_000,
    requestedBy: "Arc. Safiya Garba Aliyu (Architect)",
    requesterId: "architect",
    currentStage: 2,
    approvalChain: ["Head of Architecture", "GED"],
    finalApprover: "GED",
    disbursedBy: null,
    disbursedAt: null,
    blocker: null,
    blockedAt: null,
    sla: "healthy",
    submitted: "1 day ago",
  },
  {
    id: "PAY-USV-2026-0051",
    item: "Subcontractor valuation 2 — blockwork",
    project: "PH Logistics Warehouse",
    location: "Port Harcourt, Rivers State",
    company: "USV",
    amount: 31_800_000,
    requestedBy: "QS Haruna Sani Gombe (Head of QS)",
    requesterId: "head-qs",
    currentStage: 10,
    approvalChain: ["Finance Officer", "Finance Manager", "GGMP"],
    finalApprover: "Finance Manager",
    disbursedBy: "Mrs. Maryam Kabiru Suleiman (Finance Manager)",
    disbursedAt: "Today, 11:30",
    blocker: null,
    blockedAt: null,
    sla: "healthy",
    submitted: "3 days ago",
  },
];

// ─────────────────────────────────────────────
// SALARY GRADE SYSTEM
// ─────────────────────────────────────────────
export interface SalaryGrade {
  grade: string;
  title: string;
  description: string;
  minSalary: number;
  maxSalary: number;
  defaultSalary: number;
}

export const salaryGrades: SalaryGrade[] = [
  { grade: "S1", title: "Entry Level / Support", description: "Site assistants, admin support, junior operatives, messengers", minSalary: 80_000, maxSalary: 180_000, defaultSalary: 120_000 },
  { grade: "S2", title: "Junior Professional", description: "Graduate engineers, junior quantity surveyors, early-career technical staff", minSalary: 180_000, maxSalary: 320_000, defaultSalary: 240_000 },
  { grade: "S3", title: "Mid-Level Professional", description: "Officers, accountants, QS officers, site officers, 2-5 year experience", minSalary: 320_000, maxSalary: 550_000, defaultSalary: 420_000 },
  { grade: "S4", title: "Senior Professional", description: "Senior engineers, senior QS, project coordinators, ICT administrators", minSalary: 550_000, maxSalary: 900_000, defaultSalary: 720_000 },
  { grade: "S5", title: "Principal / Manager", description: "Project managers, finance managers, procurement managers, site supervisors", minSalary: 900_000, maxSalary: 1_500_000, defaultSalary: 1_200_000 },
  { grade: "S6", title: "Head of Department", description: "Department heads, senior managers, principal architects, chief QS", minSalary: 1_500_000, maxSalary: 3_000_000, defaultSalary: 2_000_000 },
  { grade: "S7", title: "Executive / Director", description: "Executive directors, group general managers, MD, board-level roles", minSalary: 3_000_000, maxSalary: 15_000_000, defaultSalary: 5_000_000 },
];

// ─────────────────────────────────────────────
// SALARY OVERRIDE AUDIT TRAIL
// ─────────────────────────────────────────────
export interface SalaryAuditEntry {
  id: string;
  staffId: string;
  staffName: string;
  changedBy: string;
  changedByRole: string;
  date: string;
  previousGrade: string;
  newGrade: string;
  previousSalary: number;
  newSalary: number;
  reason: string;
}

export const salaryAuditTrail: SalaryAuditEntry[] = [
  {
    id: "SAL-AUD-001",
    staffId: "S007",
    staffName: "Engr. Yusuf Abdullahi Kano",
    changedBy: "Dr. Ibrahim Umar Garba (GMD)",
    changedByRole: "gmd",
    date: "12 Aug 2026",
    previousGrade: "S4",
    newGrade: "S5",
    previousSalary: 720_000,
    newSalary: 1_200_000,
    reason: "Promotion following completion of Lagos Commercial project — exemplary performance and client commendation.",
  },
  {
    id: "SAL-AUD-002",
    staffId: "S012",
    staffName: "Miss Fatima Sule Bello",
    changedBy: "Alhaji Mustapha Sule Dankaka (Chairman)",
    changedByRole: "chairman",
    date: "1 Sep 2026",
    previousGrade: "S3",
    newGrade: "S4",
    previousSalary: 420_000,
    newSalary: 720_000,
    reason: "Grade override — specialised skill in BIM coordination not reflected in standard band; approved by board directive.",
  },
];

// ─────────────────────────────────────────────
// DELEGATION SYSTEM
// ─────────────────────────────────────────────
export type DelegationPermission =
  | "leave-approval"
  | "request-review"
  | "staff-communication"
  | "document-review"
  | "timesheet-approval"
  | "minor-procurement";

export const DELEGATION_PERMISSION_LABELS: Record<DelegationPermission, string> = {
  "leave-approval": "Leave Request Approval",
  "request-review": "Review Staff Requests",
  "staff-communication": "Official Staff Communication",
  "document-review": "Document Review & Comment",
  "timesheet-approval": "Timesheet Approval",
  "minor-procurement": "Minor Procurement (up to ₦500k)",
};

export interface Delegation {
  id: string;
  fromRole: string;
  fromName: string;
  toStaffId: string;
  toName: string;
  toRole: string;
  permission: DelegationPermission;
  startDate: string;
  endDate?: string;
  reason: string;
  grantedAt: string;
  active: boolean;
  conditions?: string;
}

export const delegations: Delegation[] = [
  {
    id: "DEL-2026-001",
    fromRole: "head-admin",
    fromName: "Mrs. Funmi Adeola (HR/Admin Head)",
    toStaffId: "admin-officer",
    toName: "Miss Aisha Musa Dantata (Admin Officer)",
    toRole: "admin",
    permission: "leave-approval",
    startDate: "1 Sep 2026",
    endDate: "09 Sep 2026",
    reason: "Head travelling on extended site visits — delegating routine leave approvals for operational continuity.",
    grantedAt: "31 Aug 2026, 09:14",
    active: true,
    conditions: "Leave periods over 5 days must still be escalated to Head for final sign-off.",
  },
  {
    id: "DEL-2026-002",
    fromRole: "head-admin",
    fromName: "Mrs. Funmi Adeola (HR/Admin Head)",
    toStaffId: "admin-officer",
    toName: "Miss Aisha Musa Dantata (Admin Officer)",
    toRole: "admin",
    permission: "staff-communication",
    startDate: "1 Sep 2026",
    reason: "Routine internal HR notices, reminders, and welfare communications.",
    grantedAt: "31 Aug 2026, 09:20",
    active: true,
  },
];

// ─────────────────────────────────────────────
// DEPARTMENT PERMANENT RESPONSIBILITIES
// ─────────────────────────────────────────────
export interface DeptResponsibilities {
  department: string;
  directorate: string;
  headRole: string;
  standard: string[];
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export const deptResponsibilities: DeptResponsibilities[] = [
  {
    department: "Project Management",
    directorate: "B — Projects Directorate",
    headRole: "pm",
    standard: [
      "Own the project delivery plan and maintain the master programme",
      "Chair weekly project review meetings and produce minutes within 24 hours",
      "Issue monthly project status reports to GED and GMD",
      "Manage client relationships and attend all client progress meetings",
      "Approve site instructions and design change notices",
      "Monitor project cost against approved budget and flag variances above 5%",
      "Coordinate the final account and project close-out report",
    ],
    lastUpdatedBy: "Engr. Fatima Aliyu Dantata (GED)",
    lastUpdatedAt: "2 Sep 2026",
  },
  {
    department: "HR / Administration",
    directorate: "C — Corporate Services",
    headRole: "head-admin",
    standard: [
      "Maintain staff records and ensure HR documentation is current",
      "Process all leave applications within 48 hours of receipt",
      "Coordinate monthly payroll inputs and liaise with Finance by the 20th",
      "Onboard new staff and conduct first-week orientation",
      "Manage discipline, grievance, and performance improvement processes",
      "Publish quarterly HR reports to the ED and Board",
      "Ensure compliance with the company staff handbook",
    ],
    lastUpdatedBy: "Engr. Yahaya Abdullahi Bello (ED)",
    lastUpdatedAt: "5 Sep 2026",
  },
  {
    department: "Finance",
    directorate: "C — Corporate Services",
    headRole: "finance",
    standard: [
      "Prepare monthly management accounts by the 10th of the following month",
      "Process approved payment vouchers within 3 working days",
      "Reconcile all bank statements monthly and report discrepancies immediately",
      "Maintain the fixed asset register and ensure insurance is current",
      "Prepare annual budget and quarterly reforecasts",
      "Liaise with external auditors and prepare statutory accounts",
      "Issue client invoices within 5 working days of valuation sign-off",
    ],
    lastUpdatedBy: "Engr. Yahaya Abdullahi Bello (ED)",
    lastUpdatedAt: "5 Sep 2026",
  },
  {
    department: "Architecture",
    directorate: "B — Projects Directorate",
    headRole: "head-architect",
    standard: [
      "Lead all architectural design and ensure compliance with regulatory standards",
      "Review and approve all drawings before issue to client or site",
      "Coordinate design submissions for planning and building regulation approval",
      "Maintain the drawing register and version control",
      "Interface with structural, MEP and QS teams during design development",
      "Issue architect's instructions and manage design change requests",
    ],
    lastUpdatedBy: "Engr. Fatima Aliyu Dantata (GED)",
    lastUpdatedAt: "2 Sep 2026",
  },
  {
    department: "Quantity Surveying",
    directorate: "B — Projects Directorate",
    headRole: "head-qs",
    standard: [
      "Prepare and maintain the Bills of Quantities for all active projects",
      "Issue interim valuations and interim payment certificates monthly",
      "Track contract variations and maintain the variation register",
      "Prepare and submit the final account within 60 days of project completion",
      "Manage subcontractor accounts and procurement cost plans",
      "Advise PM on commercial risks and value engineering opportunities",
    ],
    lastUpdatedBy: "Engr. Fatima Aliyu Dantata (GED)",
    lastUpdatedAt: "2 Sep 2026",
  },
];
