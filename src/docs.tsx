import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Globe,
  LayoutDashboard,
  Loader2,
  Lock,
  Search,
  Shield,
  ShieldCheck,
  Users,
  X,
  ArrowUpRight,
  Layers,
  GitBranch,
  Workflow,
  ClipboardCheck,
} from "lucide-react";

/* ── Module metadata ── */
const MODULES: { id: string; label: string; icon: any; desc: string }[] = [
  { id: "command",       label: "Command Centre",       icon: ShieldCheck,   desc: "Executive KPI dashboard, live group overview" },
  { id: "role-home",     label: "My Dashboard",         icon: LayoutDashboard, desc: "Role-specific home screen with personal KPIs" },
  { id: "action",        label: "Action Centre",        icon: ClipboardCheck, desc: "Tasks, outstanding actions, SLA tracking" },
  { id: "myhr",          label: "My HR",                icon: Users,         desc: "Leave requests, payslips, personal profile" },
  { id: "portfolio",     label: "Project Portfolio",    icon: Layers,        desc: "All projects, health dashboard, progress" },
  { id: "procurement",   label: "Procurement",          icon: FileText,      desc: "RFQs, purchase orders, vendor management" },
  { id: "business-dev",  label: "Business Development", icon: ArrowUpRight,  desc: "Opportunities, tenders, bid pipeline" },
  { id: "approvals",     label: "Approval Centre",      icon: CheckCircle2,  desc: "Approval workflow, chain routing, SLA alerts" },
  { id: "documents",     label: "Documents",            icon: FileText,      desc: "Drawing register, BOQs, reports" },
  { id: "meetings",      label: "Meetings & Decisions", icon: BookOpen,      desc: "Minutes, decisions, action register" },
  { id: "instructions",  label: "Instructions",         icon: Globe,         desc: "Internal and client instructions" },
  { id: "people",        label: "People & Teams",       icon: Users,         desc: "Staff directory, org chart, HR records" },
  { id: "clients",       label: "Clients & Vendors",    icon: Building2,     desc: "Client and vendor register" },
  { id: "audit",         label: "Audit & Compliance",   icon: Shield,        desc: "Internal audit, risk register, findings" },
  { id: "invoices",      label: "Invoices",             icon: FileText,      desc: "Client invoices, receivables, aging" },
  { id: "variations",    label: "Variations",           icon: GitBranch,     desc: "Contract variations, VO management" },
  { id: "payment-certs", label: "Payment Certificates", icon: FileText,      desc: "Interim and final payment certificates" },
  { id: "client-portal", label: "Client Portal",        icon: Globe,         desc: "Client-facing project status and documents" },
];

/* ── Role definitions ── */
type Directorate = "governance" | "projects" | "technical" | "corporate";

interface RoleDef {
  id: string;
  title: string;
  authority: string;
  directorate: Directorate;
  department: string;
  company: string;
  summary: string;
  responsibilities: string[];
  approvalAuthority: string;
  navItems: string[];
  persona: string;
}

const ROLES: RoleDef[] = [
  /* ── GOVERNANCE ── */
  {
    id: "chairman",
    title: "Chairman",
    authority: "CHAIRMAN",
    directorate: "governance",
    department: "Board",
    company: "USV + CANONIC",
    persona: "Chief Emeka Eze",
    summary: "Board-level oversight with full, unrestricted visibility across both companies and all modules. Super-administrator of the NEXUS platform.",
    responsibilities: [
      "Board governance and strategic direction for USV Development Services Ltd and Canonic Associates Ltd",
      "Final authority on all financial commitments above policy thresholds",
      "Executive appointment, succession and performance review",
      "Group-level risk oversight and regulatory compliance",
      "NEXUS platform super-administration and user role management",
      "Express approval override capability on any pending request",
    ],
    approvalAuthority: "Unlimited. Can approve any item at any stage. Express Override available.",
    navItems: ["command","mywork","action","myhr","portfolio","procurement","business-dev","approvals","documents","meetings","instructions","people","clients","audit","invoices","variations","payment-certs","client-portal"],
  },
  {
    id: "gmd",
    title: "Group Managing Director",
    authority: "GMD",
    directorate: "governance",
    department: "Group Executive",
    company: "USV + CANONIC",
    persona: "Dr. Emeka Okonkwo",
    summary: "Full executive oversight across both companies. Drives strategy, manages executive team and represents the group to external stakeholders.",
    responsibilities: [
      "Group-wide strategic leadership and P&L accountability",
      "Executive management team oversight (GED, ED, GGMP)",
      "Client relationship management at CEO/Director level",
      "Financial approval authority per board delegation",
      "Board reporting and investor/stakeholder communications",
      "Procurement and contract approval above GED threshold",
    ],
    approvalAuthority: "High. Approves major contracts, large POs, all board-level financial items. Express Override available.",
    navItems: ["command","mywork","action","myhr","portfolio","procurement","business-dev","approvals","documents","meetings","instructions","people","clients","audit","variations","payment-certs","client-portal"],
  },
  {
    id: "ged",
    title: "Group Executive Director: Projects",
    authority: "EXECUTIVE",
    directorate: "governance",
    department: "Group Projects",
    company: "USV + CANONIC",
    persona: "Engr. Adaeze Okafor",
    summary: "Oversees all engineering and project delivery across both companies. Accountable for project health, technical quality and delivery performance.",
    responsibilities: [
      "Portfolio oversight: all active construction and consultancy projects",
      "Technical quality governance and design review sign-off",
      "Project Manager performance and resource allocation",
      "Major variation and contract amendment approval",
      "Client escalation for project-related disputes",
      "Monthly group project performance reporting to GMD/Board",
    ],
    approvalAuthority: "Senior. Approves POs, variations and payment certs up to set threshold. Final approver for most project-level items.",
    navItems: ["command","action","myhr","portfolio","procurement","approvals","documents","meetings","people","variations","payment-certs"],
  },
  {
    id: "ed",
    title: "Executive Director: Corporate Services",
    authority: "EXECUTIVE",
    directorate: "governance",
    department: "Group Executive",
    company: "USV + CANONIC",
    persona: "Engr. Chukwudi Obi",
    summary: "Corporate services leadership covering finance, HR, administration, ICT and legal. Ensures the enabling functions support project delivery.",
    responsibilities: [
      "Finance and accounts oversight: receivables, payables, budgets",
      "HR and administration governance across the group",
      "ICT and NEXUS platform strategy",
      "Legal and compliance advisory",
      "Corporate governance, board secretariat",
      "Approval authority for corporate-side expenditure",
    ],
    approvalAuthority: "Senior. Approves finance and HR-side expenditure, corporate contracts.",
    navItems: ["command","action","myhr","approvals","documents","meetings","people","audit","invoices","payment-certs"],
  },
  {
    id: "ggmp",
    title: "Group General Manager (Operations)",
    authority: "GGMP",
    directorate: "governance",
    department: "Group Operations",
    company: "USV + CANONIC",
    persona: "Barr. Funke Adeyinka",
    summary: "Group operations management, vendor governance and corporate compliance. Bridge between executive strategy and operational delivery.",
    responsibilities: [
      "Day-to-day operations management across all departments",
      "Procurement committee chair: vendor selection and evaluation",
      "Approval authority for operational and mid-tier procurement",
      "Group compliance monitoring and policy enforcement",
      "Facilities, logistics and administration management",
      "Staff performance management below executive level",
    ],
    approvalAuthority: "Mid-Senior. Approves operational expenditure, POs and general requests within set limits.",
    navItems: ["command","mywork","action","myhr","portfolio","procurement","business-dev","approvals","documents","meetings","instructions","people","clients","client-portal"],
  },

  /* ── PROJECTS DIRECTORATE ── */
  {
    id: "pm",
    title: "Senior Project Manager",
    authority: "MANAGER",
    directorate: "projects",
    department: "Project Management",
    company: "USV",
    persona: "Engr. Musa Bello",
    summary: "End-to-end delivery of assigned construction projects. Accountable for programme, cost, quality and client relationship at project level.",
    responsibilities: [
      "Project delivery: programme, cost, quality and safety",
      "Subcontractor and supplier management on-site",
      "Site report review and daily progress monitoring",
      "Procurement requests for project materials and services",
      "Variation identification, documentation and submission",
      "Monthly project performance reporting to GED",
      "Client liaison and site meeting management",
    ],
    approvalAuthority: "Limited. Initiates procurement requests and variations; does not have final approval authority. Recommends to GED/GGMP.",
    navItems: ["role-home","action","myhr","portfolio","procurement","approvals","documents","meetings","instructions","people","variations","payment-certs"],
  },
  {
    id: "project-coordinator",
    title: "Project Coordinator",
    authority: "COORDINATOR",
    directorate: "projects",
    department: "Project Management",
    company: "USV",
    persona: "Engr. Grace Eze",
    summary: "Supports the PM in coordinating logistics, schedules, documentation and inter-team communication across active projects.",
    responsibilities: [
      "Project schedule updates and programme coordination",
      "Meeting facilitation and minutes preparation",
      "Action register tracking and follow-up",
      "Procurement request initiation and tracking",
      "Resource coordination between site and office",
      "Submittals register and RFI management",
    ],
    approvalAuthority: "Minimal. Initiates requests only. No independent approval authority.",
    navItems: ["role-home","action","myhr","portfolio","procurement","documents","meetings","instructions","people"],
  },
  {
    id: "site-supervisor",
    title: "Site Supervisor",
    authority: "SUPERVISOR",
    directorate: "projects",
    department: "Construction & Site Management",
    company: "USV",
    persona: "Engr. James Oyelaran",
    summary: "Field operations lead for a specific project site. Responsible for daily productivity, safety compliance and site reporting.",
    responsibilities: [
      "Daily site reports: labour, plant, materials and progress",
      "Safety and quality inspections",
      "Material delivery verification and on-site inventory",
      "Subcontractor supervision and sign-off on daily output",
      "Site issue and defect logging",
      "Material and resource requests to PM",
    ],
    approvalAuthority: "None. Creates requests only. All approvals escalate to PM and above.",
    navItems: ["role-home","action","myhr","documents","instructions"],
  },
  {
    id: "site",
    title: "Site Officer",
    authority: "OPERATIONS",
    directorate: "projects",
    department: "Construction & Site Management",
    company: "USV",
    persona: "Mr. Chukwuemeka Nnaji",
    summary: "On-site reporting and daily activity logging. Supports the Site Supervisor with documentation and data capture.",
    responsibilities: [
      "Daily site diary entries and labour count logging",
      "Photo documentation of site progress",
      "Material intake recording",
      "Basic quality check records",
      "Escalating issues to Site Supervisor",
    ],
    approvalAuthority: "None.",
    navItems: ["role-home","action","myhr","documents","instructions"],
  },
  {
    id: "procurement-manager",
    title: "Procurement Manager",
    authority: "MANAGER",
    directorate: "projects",
    department: "Procurement",
    company: "USV",
    persona: "Alhaji Sani Abubakar",
    summary: "Leads all procurement activities for USV. Manages vendor relationships, RFQ processes and purchase order issuance.",
    responsibilities: [
      "Vendor pre-qualification and approved vendor list management",
      "RFQ issuance and competitive tender management",
      "Vendor comparison matrix preparation",
      "Purchase order creation and issuance",
      "Contract administration with suppliers",
      "Procurement reporting to GGMP and GED",
    ],
    approvalAuthority: "Limited. Issues POs within approved thresholds. Recommends vendor selections to GGMP for approval.",
    navItems: ["role-home","action","myhr","procurement","approvals","instructions","people"],
  },
  {
    id: "procurement",
    title: "Procurement Officer",
    authority: "OFFICER",
    directorate: "projects",
    department: "Procurement",
    company: "USV",
    persona: "Miss Ngozi Eze",
    summary: "Handles day-to-day RFQs, vendor price comparisons and supports the Procurement Manager in PO processing.",
    responsibilities: [
      "Requesting quotations from approved vendors",
      "Price comparison and vendor evaluation support",
      "PO documentation preparation",
      "Delivery tracking and goods receipt notes",
      "Procurement register maintenance",
    ],
    approvalAuthority: "None. Prepares documents; approvals made by Procurement Manager and above.",
    navItems: ["role-home","action","myhr","procurement","instructions"],
  },
  {
    id: "doc-controller",
    title: "Project Document Controller",
    authority: "CONTROLLER",
    directorate: "projects",
    department: "Project Document Control",
    company: "USV + CANONIC",
    persona: "Mrs. Yetunde Adesanya",
    summary: "Controls all project documentation, drawing revisions and document distribution across the group.",
    responsibilities: [
      "Drawing register management: revisions, supersessions, distribution",
      "Document numbering and filing standards",
      "Transmittal management: incoming and outgoing",
      "BOQ and specification register",
      "Ensuring all issued documents are latest approved revisions",
      "Document archive and retrieval",
    ],
    approvalAuthority: "None. Manages and distributes documents; does not approve content.",
    navItems: ["role-home","action","myhr","portfolio","documents","meetings","instructions","people"],
  },

  /* ── TECHNICAL DIRECTORATE ── */
  {
    id: "head-architect",
    title: "Head of Architecture",
    authority: "HEAD",
    directorate: "technical",
    department: "Architecture & Design",
    company: "CANONIC",
    persona: "Arc. Tunde Adeyemi",
    summary: "Leads design delivery and studio management for Canonic Associates. Signs off all architectural outputs and manages the design team.",
    responsibilities: [
      "Design leadership: concept, schematic, detailed and working drawings",
      "Drawing review and sign-off authority",
      "Client design presentations and approval facilitation",
      "Studio resource planning and workload management",
      "Regulatory submission management (planning, building regs)",
      "Design quality audit and peer review",
    ],
    approvalAuthority: "Limited. Signs off design outputs and recommends design-related expenditure.",
    navItems: ["role-home","action","myhr","portfolio","documents","meetings","instructions","people"],
  },
  {
    id: "architect",
    title: "Architect",
    authority: "PROFESSIONAL",
    directorate: "technical",
    department: "Architecture & Design",
    company: "CANONIC",
    persona: "Arc. Ngozi Okoro",
    summary: "Project architect responsible for producing design deliverables and coordinating with consultants on assigned projects.",
    responsibilities: [
      "CAD/BIM drawing production and revision management",
      "Consultant coordination: structural, MEP, landscape",
      "Site instructions for design-related queries",
      "Design specification writing",
      "Drawing register updates",
    ],
    approvalAuthority: "None. Produces deliverables reviewed by Head of Architecture.",
    navItems: ["role-home","action","myhr","portfolio","documents","instructions"],
  },
  {
    id: "head-qs",
    title: "Head of Quantity Surveying",
    authority: "HEAD",
    directorate: "technical",
    department: "Quantity Surveying",
    company: "USV + CANONIC",
    persona: "QS Blessing Obi",
    summary: "Commercial management lead across all projects. Responsible for BOQs, cost plans, variations and payment certifications.",
    responsibilities: [
      "BOQ preparation, measurement and re-measurement",
      "Cost plan management and budget tracking",
      "Variation order valuation and submission",
      "Interim and final payment certificate preparation",
      "Subcontractor valuation and certification",
      "Final account preparation and settlement",
      "Commercial reporting to GED",
    ],
    approvalAuthority: "Mid. Certifies payment applications and variations; recommends to GED for final approval.",
    navItems: ["role-home","action","myhr","portfolio","approvals","documents","meetings","instructions","people","variations","payment-certs"],
  },
  {
    id: "qs",
    title: "Quantity Surveyor",
    authority: "PROFESSIONAL",
    directorate: "technical",
    department: "Quantity Surveying",
    company: "USV",
    persona: "Mr. Ikenna Obi",
    summary: "Supports the Head QS with measurements, valuations and BOQ updates on assigned projects.",
    responsibilities: [
      "Site measurement and take-off",
      "BOQ revision and update",
      "Variation documentation support",
      "Subcontractor valuation assistance",
      "Material quantity reconciliation",
    ],
    approvalAuthority: "None. Produces documents reviewed by Head QS.",
    navItems: ["role-home","action","myhr","portfolio","documents","instructions","variations","payment-certs"],
  },
  {
    id: "head-engineering",
    title: "Head of Engineering",
    authority: "HEAD",
    directorate: "technical",
    department: "Engineering & Technical Services",
    company: "USV",
    persona: "Engr. Bode Akintunde",
    summary: "Technical oversight for all structural, civil and MEP engineering on USV projects. Signs off engineering deliverables.",
    responsibilities: [
      "Structural and civil engineering design review",
      "MEP coordination and engineering sign-off",
      "Technical specification review",
      "Engineering query resolution (RFIs)",
      "Site technical inspection and certification",
      "Engineering team workload and resource management",
    ],
    approvalAuthority: "Limited. Signs off technical deliverables; recommends engineering-related expenditure.",
    navItems: ["role-home","action","myhr","portfolio","documents","meetings","instructions","people"],
  },
  {
    id: "engineer",
    title: "Structural Engineer",
    authority: "PROFESSIONAL",
    directorate: "technical",
    department: "Engineering & Technical Services",
    company: "USV",
    persona: "Engr. Aminu Garba",
    summary: "Structural engineering analysis, calculations and site supervision on assigned projects.",
    responsibilities: [
      "Structural analysis and calculation production",
      "Structural drawing review and mark-up",
      "Foundation and superstructure site inspections",
      "Structural RFI responses",
      "Specification and method statement review",
    ],
    approvalAuthority: "None.",
    navItems: ["role-home","action","myhr","portfolio","documents","instructions"],
  },

  /* ── CORPORATE SERVICES ── */
  {
    id: "head-ops",
    title: "Head of Operations",
    authority: "HEAD",
    directorate: "corporate",
    department: "Operations",
    company: "USV + CANONIC",
    persona: "Mrs. Kemi Adewale",
    summary: "Group operations management and resource coordination. Ensures all operational functions run efficiently and in line with policy.",
    responsibilities: [
      "Operations planning and resource scheduling",
      "Fleet and logistics management",
      "Facilities and office administration",
      "Vendor and supplier relationship management",
      "Operational procurement processing",
      "Health & safety compliance oversight",
    ],
    approvalAuthority: "Mid. Approves operational expenditure within set limits.",
    navItems: ["role-home","action","myhr","portfolio","meetings","people"],
  },
  {
    id: "ops-officer",
    title: "Operations Officer",
    authority: "OFFICER",
    directorate: "corporate",
    department: "Operations",
    company: "USV + CANONIC",
    persona: "Mr. Dayo Adeyemi",
    summary: "Day-to-day operations support, scheduling and resource coordination. Works under the Head of Operations.",
    responsibilities: [
      "Operational task execution and scheduling support",
      "Resource request initiation and tracking",
      "Fleet and logistics coordination",
      "Facilities and office support",
      "Health and safety checklist completion",
    ],
    approvalAuthority: "None. Executes operational tasks; approvals escalate to Head of Operations.",
    navItems: ["role-home","action","myhr","portfolio"],
  },
  {
    id: "bd-officer",
    title: "Business Development Officer",
    authority: "OFFICER",
    directorate: "corporate",
    department: "Business Development & Tenders",
    company: "USV + CANONIC",
    persona: "Mr. Seun Olatunji",
    summary: "Market development, client engagement and opportunity identification. Manages the BD pipeline and client relationships.",
    responsibilities: [
      "Market research and opportunity identification",
      "Client relationship management and networking",
      "BD pipeline maintenance and reporting",
      "Proposal and capability statement preparation",
      "Client portal management and updates",
      "BD performance reporting to GGMP",
    ],
    approvalAuthority: "None. Initiates opportunities; proposals approved by GED/GMD.",
    navItems: ["action","myhr","portfolio","business-dev","documents","meetings","clients","client-portal"],
  },
  {
    id: "tender-officer",
    title: "Tender & Proposals Officer",
    authority: "OFFICER",
    directorate: "corporate",
    department: "Business Development & Tenders",
    company: "USV + CANONIC",
    persona: "Mr. Femi Ogunsanya",
    summary: "Tender preparation, bid pricing and submission management. Works alongside BD Officer to win new contracts.",
    responsibilities: [
      "Tender document analysis and compliance review",
      "BOQ pricing and bid preparation",
      "Subcontractor quotation coordination for tenders",
      "Bid submission logistics and deadline management",
      "Post-bid analysis and feedback reporting",
      "Tender library and past bid maintenance",
    ],
    approvalAuthority: "None. Prepares tender packs; submission authorised by GED/GMD.",
    navItems: ["action","myhr","portfolio","business-dev","documents","meetings","clients","client-portal"],
  },
  {
    id: "finance",
    title: "Finance Manager",
    authority: "MANAGER",
    directorate: "corporate",
    department: "Finance & Accounts",
    company: "USV + CANONIC",
    persona: "Mrs. Chioma Nwosu",
    summary: "Group finance oversight, receivables management and payment processing. Processes all fully-approved disbursements.",
    responsibilities: [
      "Group financial reporting: P&L, cash flow, balance sheet",
      "Client invoicing and receivables chasing",
      "Payment processing for fully-approved procurement items",
      "Payroll management and statutory deductions",
      "Bank reconciliation and accounts management",
      "Audit support and financial compliance",
      "Disbursement processing for approved approval chains",
    ],
    approvalAuthority: "Mid. Certifies financial documents; approves payments within threshold. Receives and processes fully-approved disbursements.",
    navItems: ["role-home","action","myhr","invoices","approvals","documents","meetings","people","payment-certs"],
  },
  {
    id: "accountant",
    title: "Accountant",
    authority: "PROFESSIONAL",
    directorate: "corporate",
    department: "Finance & Accounts",
    company: "USV + CANONIC",
    persona: "Mr. Tunde Fashola",
    summary: "Accounts processing, journal entries, reconciliations and financial reporting support.",
    responsibilities: [
      "Journal entry processing and ledger maintenance",
      "Supplier invoice verification and processing",
      "Bank and intercompany reconciliation",
      "VAT and withholding tax calculations",
      "Financial report data preparation",
      "Petty cash management",
    ],
    approvalAuthority: "None. Processes transactions reviewed and approved by Finance Manager.",
    navItems: ["role-home","action","myhr","invoices","documents","payment-certs"],
  },
  {
    id: "head-admin",
    title: "Head of Administration & HR",
    authority: "HEAD",
    directorate: "corporate",
    department: "Administration & Human Resources",
    company: "USV + CANONIC",
    persona: "Mrs. Folake Balogun",
    summary: "HR strategy and administration across the group. Manages staff records, leave, payroll processing and onboarding.",
    responsibilities: [
      "HR policy development and enforcement",
      "Recruitment, onboarding and offboarding",
      "Leave management and payroll preparation",
      "Performance management administration",
      "Staff records and contract management",
      "Disciplinary and grievance procedures",
      "Disbursement processing for HR-approved staff claims",
    ],
    approvalAuthority: "Mid. Approves leave and HR-related staff requests. Receives disbursement instructions for staff payments.",
    navItems: ["role-home","action","myhr","meetings","people"],
  },
  {
    id: "admin-officer",
    title: "Administrative Officer",
    authority: "OFFICER",
    directorate: "corporate",
    department: "Administration & Human Resources",
    company: "USV + CANONIC",
    persona: "Miss Bola Adekunle",
    summary: "General office administration and staff support. Handles day-to-day admin tasks under the Head of Administration.",
    responsibilities: [
      "Office correspondence and filing management",
      "Reception and visitor management",
      "Travel and accommodation coordination",
      "Meeting room bookings and logistics",
      "Stationery and consumables management",
      "General support tasks as assigned by Head of Admin",
    ],
    approvalAuthority: "None. Administrative support role; all approvals escalate to Head of Administration.",
    navItems: ["role-home","action","myhr"],
  },
  {
    id: "ict-admin",
    title: "ICT & ERP Administrator",
    authority: "ADMIN",
    directorate: "corporate",
    department: "ICT, ERP & Systems Administration",
    company: "USV + CANONIC",
    persona: "Mr. Emeka Nwosu",
    summary: "NEXUS platform administration, user management and ICT support across the group.",
    responsibilities: [
      "NEXUS user account creation, modification and deactivation",
      "Role and permission assignment on the platform",
      "System health monitoring and uptime management",
      "IT asset register maintenance",
      "IT support ticket resolution",
      "Data backup and recovery procedures",
      "Network and infrastructure management",
    ],
    approvalAuthority: "Platform Admin. Manages all NEXUS access but has no financial approval authority.",
    navItems: ["role-home","action","myhr","people"],
  },
  {
    id: "auditor",
    title: "Internal Auditor",
    authority: "AUDITOR",
    directorate: "corporate",
    department: "Internal Audit & Compliance",
    company: "USV + CANONIC",
    persona: "Mr. Lanre Adebayo",
    summary: "Independent internal audit and compliance monitoring. Reviews processes, controls and financial records for integrity and policy adherence.",
    responsibilities: [
      "Audit plan development and execution",
      "Procurement process and vendor payment audit",
      "Project cost and contract compliance review",
      "Approval chain integrity verification",
      "Risk register maintenance and reporting",
      "Audit findings and management letter preparation",
      "Follow-up on agreed management actions",
    ],
    approvalAuthority: "Read-only audit access across most modules. No approval authority; serves in an independent oversight role.",
    navItems: ["role-home","action","myhr","audit","approvals","documents","meetings","people"],
  },
];

const DIRECTORATE_META: Record<Directorate, { label: string; color: string; bg: string; border: string; desc: string }> = {
  governance: { label: "Governance & Executive", color: "#1A3D8F", bg: "#EAF0FA", border: "#BDD0F0", desc: "Board and senior executive team with cross-company oversight" },
  projects:   { label: "Projects Directorate",   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", desc: "Project delivery, site operations and procurement" },
  technical:  { label: "Technical Directorate",  color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", desc: "Architecture, engineering and quantity surveying" },
  corporate:  { label: "Corporate Services",      color: "#3580B5", bg: "#fff7ed", border: "#fed7aa", desc: "Finance, HR, administration, ICT and audit" },
};

const ALL_MODULES = MODULES.map(m => m.id);

function hasAccess(navItems: string[], moduleId: string) {
  return navItems.includes(moduleId);
}

/* ── Sidebar sections ── */
const SECTIONS = [
  { id: "overview",    label: "Overview",            icon: BookOpen },
  { id: "structure",   label: "Organisation",         icon: Layers },
  { id: "workflow",    label: "Approval Workflow",    icon: Workflow },
  { id: "governance",  label: "Governance & Executive", icon: ShieldCheck },
  { id: "projects",    label: "Projects Directorate",   icon: FileText },
  { id: "technical",   label: "Technical Directorate",  icon: GitBranch },
  { id: "corporate",   label: "Corporate Services",     icon: Building2 },
  { id: "permissions", label: "Head vs Officer",     icon: Users },
  { id: "matrix",      label: "Permission Matrix",   icon: Lock },
];

/* ── Helpers ── */
function Badge({ children, color, bg, border }: { children: string; color: string; bg: string; border: string }) {
  return (
    <span className="inline-flex items-center rounded-[4px] border px-2 py-[2px] font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color, background: bg, borderColor: border }}>
      {children}
    </span>
  );
}

function AccessDot({ has }: { has: boolean }) {
  return has
    ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-healthy-bg" title="Access granted"><CheckCircle2 className="h-3 w-3 text-healthy" /></span>
    : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted" title="No access"><X className="h-3 w-3 text-muted-foreground/40" /></span>;
}

function RoleCard({ role, expanded, onToggle }: { role: RoleDef; expanded: boolean; onToggle: () => void }) {
  const meta = DIRECTORATE_META[role.directorate];
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-sm">
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-panel"
      >
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] font-display text-[13px] font-bold text-white"
          style={{ background: meta.color }}
        >
          {role.persona.split(" ").map(p => p[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-display text-[15px] font-bold text-foreground">{role.title}</span>
            <Badge color={meta.color} bg={meta.bg} border={meta.border}>{role.authority}</Badge>
          </div>
          <p className="text-[12px] text-muted-foreground">{role.department} · {role.company}</p>
          <p className="mt-1.5 text-[13px] text-foreground/80 leading-relaxed">{role.summary}</p>
        </div>
        <ChevronRight className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-border px-5 pb-5">
          <div className="grid gap-6 pt-4 sm:grid-cols-2">
            {/* Responsibilities */}
            <div>
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Responsibilities</p>
              <ul className="space-y-1.5">
                {role.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: meta.color }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Access & authority */}
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Approval Authority</p>
                <p className="rounded-[var(--radius)] border border-border bg-panel px-3 py-2 text-[12px] text-foreground/80 leading-relaxed">{role.approvalAuthority}</p>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Module Access ({role.navItems.length} modules)</p>
                <div className="flex flex-wrap gap-1.5">
                  {MODULES.filter(m => role.navItems.includes(m.id)).map(m => (
                    <span key={m.id} className="rounded-full bg-primary/8 px-2.5 py-[3px] text-[10px] font-medium text-primary">
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Demo Persona</p>
                <p className="font-mono text-[11px] text-muted-foreground">{role.persona}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const mainRef = useRef<HTMLElement>(null);

  const downloadPDF = async () => {
    if (downloading || !mainRef.current) return;
    setDownloading(true);
    const prevSearch = searchQuery;
    setSearchQuery("");
    await new Promise(r => setTimeout(r, 350));

    try {
      const [{ default: jsPDF }, { toCanvas }] = await Promise.all([
        import("jspdf"),
        import("html-to-image"),
      ]);

      const el = mainRef.current;
      const canvas = await toCanvas(el, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        skipFonts: false,
        style: { overflow: "visible" },
      });

      /* ── A4 layout ── */
      const pW = 210;           // page width  mm
      const pH = 297;           // page height mm
      const mX = 14;            // left/right margin mm
      const mTop = 20;          // top margin mm (room for header strip)
      const mBot = 16;          // bottom margin mm (room for footer)
      const contW = pW - 2 * mX;            // 182 mm usable width
      const contH = pH - mTop - mBot;       // 261 mm usable height per page

      /* canvas is at scale:2, so 1 "logical" px = 2 canvas px */
      const logW = canvas.width / 2;
      const logH = canvas.height / 2;
      const mmPerPx = contW / logW;         // mm per logical pixel
      const totalMm = logH * mmPerPx;
      const numPages = Math.ceil(totalMm / contH);
      const pxPerPage = Math.round(contH / mmPerPx); // logical px per page

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      for (let i = 0; i < numPages; i++) {
        if (i > 0) pdf.addPage();

        /* ── Top brand strip ── */
        pdf.setFillColor(26, 61, 143);
        pdf.rect(0, 0, pW, 10, "F");
        pdf.setFontSize(7);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.text("NEXUS", mX, 6.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(180, 200, 240);
        pdf.text("Platform Documentation  ·  USV Development Services Ltd & Canonic Associates Ltd  ·  v2026.09", mX + 12, 6.5);

        /* ── Content slice ── */
        const srcY = i * pxPerPage * 2;           // canvas pixels (2x)
        const sliceHCanvas = Math.min(pxPerPage * 2, canvas.height - srcY);
        const sliceHMm = (sliceHCanvas / 2) * mmPerPx;

        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = sliceHCanvas;
        const ctx = slice.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(canvas, 0, -srcY);

        pdf.addImage(
          slice.toDataURL("image/jpeg", 0.93),
          "JPEG",
          mX, mTop,
          contW, sliceHMm
        );

        /* ── Footer ── */
        pdf.setDrawColor(220, 228, 242);
        pdf.setLineWidth(0.3);
        pdf.line(mX, pH - mBot + 3, pW - mX, pH - mBot + 3);
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(140, 150, 170);
        pdf.text(`Page ${i + 1} of ${numPages}`, pW - mX, pH - mBot + 8, { align: "right" });
        pdf.text("Confidential  ·  Internal Use Only", mX, pH - mBot + 8);
      }

      pdf.save("NEXUS-Platform-Documentation-Sep2026.pdf");
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setDownloading(false);
      setSearchQuery(prevSearch);
    }
  };

  const toggleRole = (id: string) => {
    setExpandedRoles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* Intersection observer to highlight active section */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    Object.values(sectionRefs.current).forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  /* Filtered roles by search */
  const filteredRoles = searchQuery
    ? ROLES.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.persona.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const rolesByDirectorate = (d: Directorate) => ROLES.filter(r => r.directorate === d);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Top header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 md:px-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-[6px] font-display text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #1A3D8F 0%, #1A3D8F 100%)" }}
            >
              N
            </div>
            <div className="leading-none">
              <p className="font-display text-[12px] font-bold tracking-tight text-foreground">NEXUS</p>
              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Platform Docs</p>
            </div>
          </a>

          <div className="h-5 w-px bg-border mx-1" />

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search roles, modules…"
              className="w-full rounded-[var(--radius)] border border-border bg-muted py-1.5 pl-8 pr-3 text-[12px] outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-card"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full border border-border px-3 py-1 font-mono text-[10px] text-muted-foreground sm:inline">
              v2026.09
            </span>
            <button
              onClick={downloadPDF}
              disabled={downloading}
              title="Download A4 PDF"
              className="hidden sm:flex items-center gap-1.5 rounded-[var(--radius)] border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading
                ? <><Loader2 className="h-3 w-3 animate-spin" /> Generating PDF…</>
                : <><Download className="h-3 w-3" /> Download PDF</>
              }
            </button>
            <a
              href="/"
              className="flex items-center gap-1.5 rounded-[var(--radius)] bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Open App <ArrowUpRight className="h-3 w-3" />
            </a>
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground md:hidden"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] px-4 md:px-6">
        {/* ── Left sidebar ── */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 overflow-y-auto border-r border-border bg-card pt-16 pb-8 transition-transform md:sticky md:top-[57px] md:z-auto md:h-[calc(100vh-57px)] md:translate-x-0 md:pt-8 ${mobileNavOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}`}>
          <nav className="px-4">
            <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60">Contents</p>
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`group relative mb-0.5 flex w-full items-center gap-2.5 rounded-[5px] px-2.5 py-2 text-[12px] font-medium transition-colors text-left ${
                    active ? "bg-primary/8 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {active && <span className="absolute inset-y-[3px] left-0 w-[3px] rounded-r-full bg-primary" />}
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground/60"}`} strokeWidth={1.8} />
                  {s.label}
                </button>
              );
            })}

            <div className="mt-6 rounded-[var(--radius)] border border-border/60 bg-panel px-3 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">Companies</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#1A3D8F]" />
                  <span className="text-[11px] text-foreground/70">USV Development Services Ltd</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#3580B5]" />
                  <span className="text-[11px] text-foreground/70">Canonic Associates Ltd</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-info" />
                  <span className="text-[11px] text-foreground/70">Group (Combined view)</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setMobileNavOpen(false)} />
        )}

        {/* ── Main content ── */}
        <main ref={mainRef} className="min-w-0 flex-1 py-10 md:pl-10">

          {/* ──────────── SEARCH RESULTS ──────────── */}
          {filteredRoles && (
            <div className="mb-10">
              <p className="mb-4 text-[13px] text-muted-foreground">
                {filteredRoles.length} result{filteredRoles.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
              </p>
              <div className="space-y-3">
                {filteredRoles.map(r => (
                  <RoleCard key={r.id} role={r} expanded={expandedRoles.has(r.id)} onToggle={() => toggleRole(r.id)} />
                ))}
              </div>
              {filteredRoles.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <Search className="mb-3 h-8 w-8 text-muted-foreground/40" />
                  <p className="font-display text-base font-bold text-foreground">No results found</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">Try a different search term.</p>
                </div>
              )}
            </div>
          )}

          {!filteredRoles && (
            <>
              {/* ──────────── OVERVIEW ──────────── */}
              <section id="overview" ref={el => { sectionRefs.current["overview"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Introduction</div>
                <h1 className="font-display text-[32px] font-bold leading-tight tracking-tight text-foreground">
                  NEXUS Platform<br />Roles & Permissions
                </h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  NEXUS is the unified enterprise resource platform for <strong className="text-foreground">USV Development Services Ltd</strong> and <strong className="text-foreground">Canonic Associates Ltd</strong>. This document covers every role in the system: their responsibilities, module access, approval authority and how they interact with the platform day to day.
                </p>

                {/* Feature highlights */}
                <div className="mt-6 rounded-[var(--radius)] border border-primary/20 bg-primary/5 px-5 py-4">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Current Platform Capabilities</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { title: "Role-based Dashboards", desc: "Every role has a bespoke dashboard with personal KPIs, action queues and navigation scoped to their responsibilities." },
                      { title: "Approval Chain Visibility", desc: "Every approval item is clickable. Open it to view the full chain of who approved before you, who is still pending and whether disbursement has been processed." },
                      { title: "Approval History Tab", desc: "Each approver has a personal history tab showing all items they have approved or rejected, with final outcome and disbursement details for every record." },
                      { title: "Directive Attribution", desc: "Every action centre item shows who issued the directive, giving full chain-of-command traceability from board level down to site." },
                      { title: "Portfolio Health Matrix", desc: "GED dashboard shows a real-time matrix of all projects × all health dimensions (schedule, cost, procurement, quality, client). Progress bars show planned vs actual with hover detail." },
                      { title: "Officer Submission Flow", desc: "Officers cannot bypass their department head. All submissions go to the head first, then escalate. The approval flow banner on every officer dashboard shows the chain at a glance." },
                    ].map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <div>
                          <p className="text-[12px] font-semibold text-foreground">{f.title}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: Users,
                      value: ROLES.length.toString(),
                      label: "Total Roles",
                      color: "#1A3D8F",
                      bg: "#EAF0FA",
                      desc: "Every person in the group has a dedicated NEXUS profile with a role-specific dashboard, scoped module access and a defined approval authority tier. Profiles cover both USV Development Services Ltd and Canonic Associates Ltd.",
                    },
                    {
                      icon: Layers,
                      value: MODULES.length.toString(),
                      label: "Platform Modules",
                      color: "#2563eb",
                      bg: "#eff6ff",
                      desc: "The full operational toolset includes Command Centre, Project Portfolio, Procurement, Finance, Approvals, Documents, Meetings, Instructions, Audit and Client Portal. Each module is visible only to the roles that need it.",
                    },
                    {
                      icon: Building2,
                      value: "2",
                      label: "Group Companies",
                      color: "#3580B5",
                      bg: "#dbeafe",
                      desc: "USV Development Services Ltd handles construction delivery, site operations and quantity surveying. Canonic Associates Ltd covers architectural consultancy and design. Some roles serve both companies; others are specific to one.",
                    },
                    {
                      icon: Lock,
                      value: "6",
                      label: "Access Tiers",
                      color: "#7c3aed",
                      bg: "#f5f3ff",
                      desc: "A six-level authority scale. At the base, Site Officers hold no approval power. At the top, the Chairman holds unlimited authority with express override capability and platform super-administration rights. Every role belongs to exactly one tier.",
                    },
                    {
                      icon: GitBranch,
                      value: "4",
                      label: "Directorates",
                      color: "#15803d",
                      bg: "#f0fdf4",
                      desc: "All roles sit within one of four directorates: Governance & Executive, Projects, Technical and Corporate Services. Each directorate manages its own escalation path and carries a distinct colour throughout the platform.",
                    },
                    {
                      icon: Workflow,
                      value: "5",
                      label: "Approval Steps",
                      color: "#d97706",
                      bg: "#fffbeb",
                      desc: "A typical approval moves through five stages: submission, first approver review, optional chain extension, final approval and Finance or HR disbursement. Chain length is flexible with no enforced maximum, and every step is permanently logged and auditable.",
                    },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="group rounded-[var(--radius)] border border-border bg-card p-5 hover:border-primary/20 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-display text-[36px] font-bold leading-none tabular-nums text-foreground">{s.value}</p>
                            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: s.color }}>{s.label}</p>
                          </div>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px]" style={{ background: s.bg }}>
                            <Icon className="h-5 w-5" style={{ color: s.color }} strokeWidth={1.7} />
                          </div>
                        </div>
                        <p className="text-[12px] leading-relaxed text-muted-foreground">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Access Tiers explanation */}
                <div className="mt-6 overflow-hidden rounded-[var(--radius)] border border-border bg-card">
                  <div className="border-b border-border bg-panel px-5 py-3 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Access Tiers Explained: From None to Unlimited</p>
                    <span className="font-mono text-[10px] text-muted-foreground/60">6 tiers · approval authority scale</span>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      {
                        tier: "Tier 1", label: "Unlimited", color: "#1A3D8F",
                        roles: "Chairman",
                        access: "All 18 modules including Command Centre",
                        authority: "Can approve any item at any stage. Express Override overrides any pending chain. Platform super-administrator.",
                      },
                      {
                        tier: "Tier 2", label: "Executive", color: "#15803d",
                        roles: "Group Managing Director (GMD), Group Executive Director (GED), Executive Director (ED)",
                        access: "All modules except Command Centre home (use Command Centre dashboard)",
                        authority: "Approves major contracts, large POs, board-level financial items. Can mark approvals final for most categories.",
                      },
                      {
                        tier: "Tier 3", label: "Senior Management", color: "#2563eb",
                        roles: "GGMP, Head of Architecture, Head of QS, Head of Engineering, Head of Operations, Finance Manager, Head of Admin & HR",
                        access: "Directorate-scoped modules relevant to their function",
                        authority: "Approves within delegated thresholds. Certifies payments, signs off department-level items. Escalates exceptions upward.",
                      },
                      {
                        tier: "Tier 4", label: "Management", color: "#7c3aed",
                        roles: "Senior Project Manager, Procurement Manager",
                        access: "Project and procurement modules; no Command Centre or group-level finance",
                        authority: "Initiates and recommends. Issues POs within approved limits. Does not hold final sign-off authority; escalations go to Tier 3 or above.",
                      },
                      {
                        tier: "Tier 5", label: "Professional", color: "#3580B5",
                        roles: "Architects, Engineers, QS Officers, Procurement Officers, Project Coordinators, BD & Tender Officers, Accountants, Auditors",
                        access: "Role-specific modules only, with no access to approval management, procurement or finance screens",
                        authority: "Prepares documents, records data, and initiates requests. All outputs reviewed and approved by Tier 3 or above.",
                      },
                      {
                        tier: "Tier 6", label: "Operational (None)", color: "#6b7280",
                        roles: "Site Supervisor, Site Officer, ICT & ERP Administrator",
                        access: "Minimal access: personal dashboard, HR self-service, instructions and documents only",
                        authority: "No approval authority. Creates records, logs site data and raises requests only. ICT Admin has platform-admin access but zero financial authority.",
                      },
                    ].map((t, i) => (
                      <div key={t.tier} className={`flex gap-4 px-5 py-4 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
                        <div className="shrink-0 pt-0.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-[6px] font-mono text-[9px] font-bold text-white" style={{ background: t.color }}>
                            T{i + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <span className="font-display text-[13px] font-bold text-foreground">{t.tier}: {t.label}</span>
                            <span className="font-mono text-[10px]" style={{ color: t.color }}>{t.roles}</span>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-2 text-[11px]">
                            <div>
                              <span className="font-semibold text-muted-foreground">Module Access: </span>
                              <span className="text-foreground/75">{t.access}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-muted-foreground">Approval Authority: </span>
                              <span className="text-foreground/75">{t.authority}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Module list */}
                <div className="mt-8">
                  <h2 className="mb-4 font-display text-[18px] font-bold text-foreground">Platform Modules</h2>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {MODULES.map(m => {
                      const Icon = m.icon;
                      return (
                        <div key={m.id} className="flex items-start gap-3 rounded-[var(--radius)] border border-border bg-card px-4 py-3 hover:border-primary/30 hover:bg-panel transition-colors">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.7} />
                          <div>
                            <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
                            <p className="text-[11px] text-muted-foreground">{m.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ──────────── ORGANISATION ──────────── */}
              <section id="structure" ref={el => { sectionRefs.current["structure"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Organisational Design</div>
                <h2 className="mb-6 font-display text-[24px] font-bold text-foreground">Four Directorates</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  {(Object.entries(DIRECTORATE_META) as [Directorate, typeof DIRECTORATE_META[Directorate]][]).map(([key, meta]) => {
                    const roles = rolesByDirectorate(key);
                    return (
                      <div key={key} className="rounded-[var(--radius)] border bg-card p-5" style={{ borderColor: meta.border }}>
                        <div className="mb-3 flex items-center gap-2.5">
                          <div className="h-3 w-3 rounded-full" style={{ background: meta.color }} />
                          <span className="font-display text-[14px] font-bold text-foreground">{meta.label}</span>
                        </div>
                        <p className="mb-4 text-[12px] text-muted-foreground">{meta.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {roles.map(r => (
                            <span key={r.id} className="rounded-full border px-2.5 py-[3px] text-[10px] font-medium" style={{ color: meta.color, borderColor: meta.border, background: meta.bg }}>
                              {r.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hierarchy pyramid */}
                <div className="mt-8 overflow-hidden rounded-[var(--radius)] border border-border bg-card">
                  <div className="border-b border-border px-5 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Authority Hierarchy (top to bottom)</p>
                  </div>
                  <div className="p-5 space-y-1">
                    {[
                      { tier: "Tier 1: Unlimited", roles: "Chairman", color: "#1A3D8F", w: "100%" },
                      { tier: "Tier 2: Executive", roles: "GMD, GED, ED", color: "#15803d", w: "85%" },
                      { tier: "Tier 3: Senior Management", roles: "GGMP, Head of Architecture, Head of QS, Head of Engineering, Head of Operations, Finance Manager, Head of Admin", color: "#2563eb", w: "70%" },
                      { tier: "Tier 4: Management", roles: "Project Manager, Procurement Manager", color: "#7c3aed", w: "55%" },
                      { tier: "Tier 5: Professional", roles: "All professional officers and coordinators", color: "#3580B5", w: "40%" },
                      { tier: "Tier 6: Operational", roles: "Site Officers, Accountant, Admin staff", color: "#6b7280", w: "28%" },
                    ].map(t => (
                      <div key={t.tier} className="flex items-center gap-3">
                        <div className="shrink-0 w-48 text-right">
                          <span className="font-mono text-[9px] text-muted-foreground">{t.tier}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="h-6 rounded-r-[4px] flex items-center px-2" style={{ width: t.w, background: t.color + "18", borderLeft: `3px solid ${t.color}` }}>
                            <span className="text-[10px] font-medium truncate" style={{ color: t.color }}>{t.roles}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ──────────── APPROVAL WORKFLOW ──────────── */}
              <section id="workflow" ref={el => { sectionRefs.current["workflow"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Approval System</div>
                <h2 className="mb-2 font-display text-[24px] font-bold text-foreground">Flexible Approval Workflow</h2>
                <p className="mb-8 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                  NEXUS does not enforce a rigid approval hierarchy. The requester selects the first approver, and each approver then decides whether to forward to a further reviewer or mark the request as final. This design accommodates the different approval paths across procurement, finance, HR and operations.
                </p>

                {/* Steps */}
                <div className="relative space-y-0">
                  {[
                    {
                      n: "1", color: "#1A3D8F",
                      title: "Requester Creates",
                      desc: "Any staff member initiates a request (Purchase Order, Invoice, Variation, Payment Certificate or General request). They fill in the details and select the first approver from the staff directory.",
                    },
                    {
                      n: "2", color: "#2563eb",
                      title: "First Approver Reviews",
                      desc: "The selected approver receives a notification. They review the request and decide to Approve or Reject. If approved, they choose: forward to another approver, or mark as Final.",
                    },
                    {
                      n: "3", color: "#7c3aed",
                      title: "Chain Continues (Optional)",
                      desc: "If not final, the next approver in the chain receives the request. This continues until someone marks the approval as final. There is no limit on chain length.",
                    },
                    {
                      n: "4", color: "#3580B5",
                      title: "Final Approval",
                      desc: "The approver who marks it Final completes the chain. The request status changes to Fully Approved and a disbursement notification is sent automatically.",
                    },
                    {
                      n: "5", color: "#1A3D8F",
                      title: "Finance / HR Disbursement",
                      desc: "Finance (for financial items) or HR (for staff claims) receives the disbursement. They review the fully-approved request and process the payment or action, marking it Disbursed.",
                    },
                  ].map((step, i, arr) => (
                    <div key={step.n} className="relative flex gap-5 pb-0">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold text-white" style={{ background: step.color }}>
                          {step.n}
                        </div>
                        {i < arr.length - 1 && <div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: 32 }} />}
                      </div>
                      <div className="pb-8 pt-0.5">
                        <p className="font-display text-[14px] font-bold text-foreground">{step.title}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rejection note */}
                <div className="rounded-[var(--radius)] border border-critical/30 bg-critical-bg px-4 py-3 mt-2">
                  <p className="text-[12px] font-semibold text-critical mb-1">On Rejection</p>
                  <p className="text-[12px] text-critical/80">
                    If any approver rejects the request, the requester is notified immediately. The chain is terminated and the request status is set to Rejected. The requester may amend and resubmit.
                  </p>
                </div>
              </section>

              {/* ──────────── GOVERNANCE ROLES ──────────── */}
              <section id="governance" ref={el => { sectionRefs.current["governance"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: DIRECTORATE_META.governance.color }}>Governance & Executive Management</div>
                <h2 className="mb-2 font-display text-[24px] font-bold text-foreground">Executive Team</h2>
                <p className="mb-6 text-[14px] text-muted-foreground max-w-2xl">
                  The Governance & Executive directorate combines two distinct layers of leadership with fundamentally different roles. Understanding the boundary between them is essential for correct NEXUS use.
                </p>

                {/* Board vs Executive differentiation callout */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  {/* Board Layer */}
                  <div className="rounded-[var(--radius)] border-2 p-5 space-y-3" style={{ borderColor: "#1A3D8F", background: "#EAF0FA" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[6px] font-display text-[12px] font-bold text-white" style={{ background: "#1A3D8F" }}>
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-display text-[14px] font-bold text-foreground">Governance: Board Layer</p>
                        <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#1A3D8F" }}>Chairman · GMD</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "Sets company strategy, policy and authority thresholds",
                        "Reviews aggregate financial performance but does not process individual transactions",
                        "Sees board-level risk register, group KPIs and the strategic pipeline",
                        "No day-to-day operational approval queue; the board approves only at board-mandated thresholds",
                        "NEXUS access: Command Centre, Portfolio overview, Board documents, People",
                        "Platform super-administrator capability (Chairman only)",
                      ].map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/80">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A3D8F]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Executive Management Layer */}
                  <div className="rounded-[var(--radius)] border-2 p-5 space-y-3" style={{ borderColor: "#3580B5", background: "#dbeafe" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[6px] font-display text-[12px] font-bold text-white" style={{ background: "#3580B5" }}>
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-display text-[14px] font-bold text-foreground">Executive Management: Operational Layer</p>
                        <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#3580B5" }}>GED · ED · GGMP</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "Lead the three operational directorates: Projects, Corporate Services, Operations",
                        "Manage and decide on live approval queues as the first executives in the operational approval chain",
                        "See real-time pending items: payment certs, variations, sign-off requests, procurement exceptions",
                        "Issue directives that cascade to departments via Action Centre",
                        "Responsible for day-to-day budget control and resource allocation within directorate",
                        "Report to GMD/Board and receive escalations from heads-of-department",
                      ].map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/80">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3580B5]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key differences table */}
                <div className="mb-8 overflow-hidden rounded-[var(--radius)] border border-border bg-card">
                  <div className="border-b border-border px-5 py-3 bg-panel">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Governance vs Executive Management: Key Differences</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground w-1/4">Dimension</th>
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#1A3D8F" }}>Board (Chairman / GMD)</th>
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#3580B5" }}>Executive Mgmt (GED / ED / GGMP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { d: "Dashboard Focus", b: "Group KPIs, risk register, board calendar, strategic pipeline", e: "Live approval queues, team workload, real-time project health" },
                          { d: "Approval Queue", b: "No day-to-day queue. Board resolutions only, at board-mandated thresholds", e: "Active queue of payment certs, variations, PO sign-offs and policy items" },
                          { d: "Directive Authority", b: "Issues policy mandates through GMD and GED", e: "Issues operational directives directly to departments, logged in the NEXUS Action Centre" },
                          { d: "Finance Involvement", b: "Sees P&L, receivables and group position but does not process individual transactions", e: "Approves transactions and signs off budgets within delegated authority" },
                          { d: "Escalation Direction", b: "Receives escalations from Executive Management", e: "Receives escalations from heads of department and escalates only exceptional items to GMD or Board" },
                          { d: "NEXUS Platform Docs", b: "Full access (Board and Governance layer)", e: "Full access (Executive Management layer)" },
                        ].map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                            <td className="px-4 py-2.5 text-[11px] font-semibold text-foreground">{row.d}</td>
                            <td className="px-4 py-2.5 text-[11px] text-foreground/80">{row.b}</td>
                            <td className="px-4 py-2.5 text-[11px] text-foreground/80">{row.e}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Platform Docs access restriction notice */}
                <div className="mb-8 flex items-start gap-3 rounded-[var(--radius)] border border-primary/30 bg-primary/5 px-4 py-3.5">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[13px] font-semibold text-primary">Platform Docs: Restricted Access</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-foreground/70">
                      This Platform Docs page is visible only to the <strong className="text-foreground">Governance & Executive Management</strong> group (Chairman, GMD, GED, ED and GGMP). Operational staff, officers and coordinators do not see the Docs link in their navigation. This is by design. Platform architecture, role definitions and access policy are governance-layer information, managed centrally by the ICT Administrator under GMD and Board oversight.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {rolesByDirectorate("governance").map(r => (
                    <RoleCard key={r.id} role={r} expanded={expandedRoles.has(r.id)} onToggle={() => toggleRole(r.id)} />
                  ))}
                </div>
              </section>

              {/* ──────────── PROJECTS ROLES ──────────── */}
              <section id="projects" ref={el => { sectionRefs.current["projects"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: DIRECTORATE_META.projects.color }}>Projects Directorate</div>
                <h2 className="mb-2 font-display text-[24px] font-bold text-foreground">Project Delivery Roles</h2>
                <p className="mb-6 text-[14px] text-muted-foreground">Project management, site operations, procurement and document control.</p>
                <div className="space-y-3">
                  {rolesByDirectorate("projects").map(r => (
                    <RoleCard key={r.id} role={r} expanded={expandedRoles.has(r.id)} onToggle={() => toggleRole(r.id)} />
                  ))}
                </div>
              </section>

              {/* ──────────── TECHNICAL ROLES ──────────── */}
              <section id="technical" ref={el => { sectionRefs.current["technical"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: DIRECTORATE_META.technical.color }}>Technical Directorate</div>
                <h2 className="mb-2 font-display text-[24px] font-bold text-foreground">Technical & Professional Roles</h2>
                <p className="mb-6 text-[14px] text-muted-foreground">Architecture, engineering, quantity surveying and technical delivery professionals.</p>
                <div className="space-y-3">
                  {rolesByDirectorate("technical").map(r => (
                    <RoleCard key={r.id} role={r} expanded={expandedRoles.has(r.id)} onToggle={() => toggleRole(r.id)} />
                  ))}
                </div>
              </section>

              {/* ──────────── CORPORATE ROLES ──────────── */}
              <section id="corporate" ref={el => { sectionRefs.current["corporate"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: DIRECTORATE_META.corporate.color }}>Corporate Services Directorate</div>
                <h2 className="mb-2 font-display text-[24px] font-bold text-foreground">Corporate Services Roles</h2>
                <p className="mb-6 text-[14px] text-muted-foreground">Finance, HR, administration, ICT administration and internal audit.</p>
                <div className="space-y-3">
                  {rolesByDirectorate("corporate").map(r => (
                    <RoleCard key={r.id} role={r} expanded={expandedRoles.has(r.id)} onToggle={() => toggleRole(r.id)} />
                  ))}
                </div>
              </section>

              {/* ──────────── HEAD vs OFFICER ──────────── */}
              <section id="permissions" ref={el => { sectionRefs.current["permissions"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Permission Architecture</div>
                <h2 className="mb-2 font-display text-[24px] font-bold text-foreground">Head vs Officer Access</h2>
                <p className="mb-6 text-[14px] text-muted-foreground leading-relaxed">
                  Within each department, NEXUS applies two distinct permission tiers. Department heads carry administrative authority — meetings management, people oversight, approval chain participation — while officers and professionals receive a focused working set limited to their core deliverables.
                </p>

                {/* Key principle callout */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Users, title: "People & Meetings", desc: "Heads manage team scheduling and meetings. Officers see only their own tasks and instructions." },
                    { icon: ShieldCheck, title: "Approval Chains", desc: "Heads participate in formal approval workflows. Officers initiate requests but cannot approve." },
                    { icon: Lock, title: "Module Scope", desc: "Officers access 3 to 9 modules versus 8 to 15 for heads — focused tools only, no admin overhead." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 rounded-[var(--radius)] border border-border bg-card p-4">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/8">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-foreground">{title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Department comparison table */}
                <div className="overflow-hidden rounded-[var(--radius)] border border-border">
                  <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-border bg-panel">
                    <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Department</div>
                    <div className="border-l border-border px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#1A3D8F" }}>
                        <span className="h-2 w-2 rounded-sm" style={{ background: "#1A3D8F" }} /> Head / Manager
                      </span>
                    </div>
                    <div className="border-l border-border px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#2E7D52" }}>
                        <span className="h-2 w-2 rounded-sm" style={{ background: "#2E7D52" }} /> Officer / Professional
                      </span>
                    </div>
                  </div>
                  {[
                    {
                      dept: "Project Management",
                      head: { role: "Project Manager", modules: ["Portfolio", "Procurement", "Approvals", "Docs", "Meetings", "Instructions", "People", "Variations", "Payment Certs"], count: 12 },
                      officer: { role: "Project Coordinator", modules: ["Portfolio", "Procurement", "Docs", "Meetings", "Instructions", "People"], count: 9 },
                      diff: "No Approvals, Variations, or Payment Certs",
                    },
                    {
                      dept: "Construction & Site",
                      head: { role: "Site Supervisor", modules: ["Docs", "Instructions"], count: 4 },
                      officer: { role: "Site Officer", modules: ["Docs", "Instructions"], count: 4 },
                      diff: "Both access the same limited set — site data entry roles",
                    },
                    {
                      dept: "Procurement",
                      head: { role: "Procurement Manager", modules: ["Procurement", "Approvals", "Instructions", "People"], count: 7 },
                      officer: { role: "Procurement Officer", modules: ["Procurement", "Instructions"], count: 5 },
                      diff: "No Approvals or People management",
                    },
                    {
                      dept: "Architecture",
                      head: { role: "Head of Architecture", modules: ["Portfolio", "Docs", "Meetings", "Instructions", "People"], count: 8 },
                      officer: { role: "Architect", modules: ["Portfolio", "Docs", "Instructions"], count: 6 },
                      diff: "No Meetings management or People oversight",
                    },
                    {
                      dept: "Quantity Surveying",
                      head: { role: "Head QS", modules: ["Portfolio", "Approvals", "Docs", "Meetings", "Instructions", "People", "Variations", "Payment Certs"], count: 11 },
                      officer: { role: "Quantity Surveyor", modules: ["Portfolio", "Docs", "Instructions", "Variations", "Payment Certs"], count: 8 },
                      diff: "No Approvals, Meetings, or People",
                    },
                    {
                      dept: "Engineering",
                      head: { role: "Head of Engineering", modules: ["Portfolio", "Docs", "Meetings", "Instructions", "People"], count: 8 },
                      officer: { role: "Structural Engineer", modules: ["Portfolio", "Docs", "Instructions"], count: 6 },
                      diff: "No Meetings management or People oversight",
                    },
                    {
                      dept: "Operations",
                      head: { role: "Head of Operations", modules: ["Portfolio", "Meetings", "People"], count: 6 },
                      officer: { role: "Operations Officer", modules: ["Portfolio"], count: 4 },
                      diff: "No Meetings, People — task execution only",
                    },
                    {
                      dept: "Finance & Accounts",
                      head: { role: "Finance Manager", modules: ["Invoices", "Approvals", "Docs", "Meetings", "People", "Payment Certs"], count: 9 },
                      officer: { role: "Accountant", modules: ["Invoices", "Docs", "Payment Certs"], count: 6 },
                      diff: "No Approvals, Meetings, or People",
                    },
                    {
                      dept: "Administration & HR",
                      head: { role: "Head of Admin & HR", modules: ["Meetings", "People"], count: 5 },
                      officer: { role: "Administrative Officer", modules: ["(Self-service HR only)"], count: 3 },
                      diff: "No Meetings management or People directory",
                    },
                  ].map((row, i) => (
                    <div key={row.dept} className={`grid grid-cols-[1fr_1fr_1fr] border-b border-border/60 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                      <div className="px-4 py-3">
                        <p className="text-[12px] font-semibold text-foreground">{row.dept}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/70 italic">{row.diff}</p>
                      </div>
                      <div className="border-l border-border px-4 py-3">
                        <p className="text-[11px] font-semibold" style={{ color: "#1A3D8F" }}>{row.head.role}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {row.head.modules.map(m => (
                            <span key={m} className="rounded-full px-1.5 py-px text-[9px] font-medium" style={{ background: "rgba(26,61,143,0.08)", color: "#1A3D8F" }}>{m}</span>
                          ))}
                        </div>
                        <p className="mt-1 text-[9px] font-mono text-muted-foreground">{row.head.count} modules</p>
                      </div>
                      <div className="border-l border-border px-4 py-3">
                        <p className="text-[11px] font-semibold" style={{ color: "#2E7D52" }}>{row.officer.role}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {row.officer.modules.map(m => (
                            <span key={m} className="rounded-full px-1.5 py-px text-[9px] font-medium" style={{ background: "rgba(46,125,82,0.08)", color: "#2E7D52" }}>{m}</span>
                          ))}
                        </div>
                        <p className="mt-1 text-[9px] font-mono text-muted-foreground">{row.officer.count} modules</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[11px] text-muted-foreground">
                  Module counts include the base Role Home, Action Centre, and MyHR tabs present for all staff. Executives and governance roles are not listed above as they carry a separate, elevated access tier.
                </p>
              </section>

              {/* ──────────── PERMISSION MATRIX ──────────── */}
              <section id="matrix" ref={el => { sectionRefs.current["matrix"] = el; }} className="mb-16 scroll-mt-20">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Access Control</div>
                <h2 className="mb-2 font-display text-[24px] font-bold text-foreground">Full Permission Matrix</h2>
                <p className="mb-6 text-[14px] text-muted-foreground">Every role × every module. Green = access granted, grey = no access.</p>

                <div className="overflow-x-auto rounded-[var(--radius)] border border-border">
                  <table className="min-w-max w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-panel">
                        <th className="sticky left-0 z-10 bg-panel px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground min-w-[200px]">
                          Role
                        </th>
                        {MODULES.map(m => (
                          <th key={m.id} className="px-2 py-3 text-center">
                            <span className="block text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap"
                              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", height: 80, lineHeight: "1.1" }}>
                              {m.label}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ROLES.map((role, ri) => {
                        const meta = DIRECTORATE_META[role.directorate];
                        return (
                          <tr key={role.id} className={`border-b border-border/60 transition-colors hover:bg-panel ${ri % 2 === 0 ? "" : "bg-muted/30"}`}>
                            <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 min-w-[200px]">
                              <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: meta.color }} />
                                <div>
                                  <p className="text-[11px] font-semibold text-foreground leading-tight">{role.title}</p>
                                  <p className="text-[9px] text-muted-foreground">{role.persona}</p>
                                </div>
                              </div>
                            </td>
                            {MODULES.map(m => (
                              <td key={m.id} className="px-2 py-2.5 text-center">
                                <div className="flex justify-center">
                                  <AccessDot has={hasAccess(role.navItems, m.id)} />
                                </div>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-healthy-bg"><CheckCircle2 className="h-2.5 w-2.5 text-healthy" /></span>
                    Access granted
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted"><X className="h-2.5 w-2.5 text-muted-foreground/40" /></span>
                    No access
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">
                    Executives use the Command Centre as their primary dashboard instead of a role-specific home.
                  </p>
                </div>
              </section>
            </>
          )}

          {/* Footer */}
          <footer className="border-t border-border pt-8 pb-16 text-[11px] text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded font-display text-[9px] font-bold text-white" style={{ background: "#1A3D8F" }}>N</div>
                <span>NEXUS ERP · USV Development Services Ltd & Canonic Associates Ltd</span>
              </div>
              <span className="font-mono text-muted-foreground/60">Docs v2026.09 · September 2026</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
