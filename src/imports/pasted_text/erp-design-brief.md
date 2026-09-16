# DESIGN A COMPLETE ENTERPRISE ERP UI/UX FOR USV & CANONIC ASSOCIATES

Design a complete, high-fidelity, production-quality **Unified ERP Platform for USV and CANONIC Associates**.

This is an internal enterprise operating system for two related Nigerian companies. It must NOT look like a generic ERP template, generic CRM, generic accounting application, generic HR platform, or generic SaaS dashboard.

The product must feel like a **purpose-built digital operating system for a professional construction, engineering, architecture, quantity surveying, consultancy, project management, contracting, logistics and corporate services organisation**.

The final design must demonstrate exceptional:

* UX
* Information architecture
* Usability
* Operational clarity
* Enterprise functionality
* Project visibility
* Accountability
* Workflow control
* Cross-company collaboration
* Management oversight
* Auditability
* Mobile usability
* Document management
* Construction/project-management intelligence

The design should be **premium, modern, sophisticated, restrained, professional and highly practical**.

Do not prioritise decoration over usability.

The most important UX principle is:

> **ACTION-FIRST, NOT MODULE-FIRST.**

Users should not have to search through modules to discover what they need to do.

The ERP should continuously answer:

> **What requires my attention?**
> **What am I responsible for?**
> **What is overdue?**
> **What is coming next?**
> **What is blocked?**
> **What changed?**
> **What decision is required?**
> **What is the current state of the business/project?**

---

# 1. BUSINESS CONTEXT

USV is the registered company and has operated for more than 10 years.

USV's major activities include:

* Construction
* General logistics
* Contracting
* Government projects
* Organisational/corporate projects
* Private projects
* Real-estate-related projects

CANONIC Associates is a related professional consultancy/consortium.

CANONIC's activities include:

* Architecture
* Quantity surveying
* Consultancy
* Project management
* Operations
* Technical services
* Design
* Construction/project supervision
* Professional project services

USV and CANONIC:

* Are separate businesses
* Have shared management
* May independently obtain projects
* May independently execute projects
* May collaborate on the same project
* May share staff
* May share vendors
* May share equipment/resources
* May share administrative resources
* May collaborate on technical and operational activities

Example:

> CANONIC designs/manages/provides consultancy and technical oversight while USV executes construction.

The ERP must support this relationship without incorrectly merging the two companies.

---

# 2. COMPANY MODEL

Every relevant business record must have a clear:

**Owning Company**

Possible values:

* USV
* CANONIC

Where applicable:

**Participating Company/Companies**

Possible examples:

* USV only
* CANONIC only
* USV + CANONIC

A project might display:

> **USV | Abuja Housing Development**

or:

> **CANONIC | Lagos Commercial Development**

or:

> **USV + CANONIC | Government Office Complex**

Users must always know which company context they are operating within.

The Group/Executive view may consolidate authorised information, but company records, permissions and financial information must remain logically separated.

---

# 3. THE ERP'S CORE BUSINESS LIFECYCLE

Design the entire system around this business lifecycle:

**Opportunity**

↓

**Tender / Proposal**

↓

**Contract**

↓

**Project**

↓

**Planning**

↓

**Design / Technical Preparation**

↓

**Procurement**

↓

**Mobilisation**

↓

**Execution / Construction**

↓

**Monitoring**

↓

**Variations / Claims / Changes**

↓

**Invoicing**

↓

**Payment**

↓

**Completion**

↓

**Handover**

↓

**Closure**

↓

**Archive**

The interface must make this lifecycle visible and interconnected.

Do not design each module as an isolated application.

---

# 4. THE CORE DATA RELATIONSHIP

The ERP should fundamentally operate around:

**People + Companies + Clients + Opportunities + Tenders + Contracts + Projects + Work + Resources + Money + Documents + Decisions + Audit**

The central relationship is:

**Client → Opportunity → Tender/Proposal → Contract → Project**

After a project is created:

**Project → Programme → Tasks → Design → BOQ → Procurement → Site → Costs → Invoices → Payments → Completion**

Every major record must connect naturally to related records.

---

# 5. ORGANISATIONAL STRUCTURE

Support the following organisational structure.

## Executive / Group

* Chairman
* GMD
* GGMP — Group General Manager, Operations
* GED
* ED
* GED Projects

## USV

* Administration
* Operations
* Projects

## CANONIC

* Architecture
* Quantity Surveying
* Projects
* Operations
* Technical Services

Also support:

* Finance
* Procurement
* HR/Staff Administration
* Business Development
* Tender/Proposal
* Construction/Site Operations
* Customer Care/Support
* Document/Records Management
* Audit/Compliance
* ERP/System Administration

---

# 6. USER AND RESPONSIBILITY MODEL

Do not rely only on job titles.

Use:

**User → Company → Department → Role → Responsibility → Project Assignment → Permission**

A person can have different responsibilities on different projects.

Example:

> Architect A
> CANONIC
> Architecture
> Lead Architect
> Project Alpha
> Responsible for design
> Reviewer on Project Beta

Another example:

> QS A
> CANONIC
> QS Department
> Quantity Surveyor
> Commercial Lead – Project X
> Supporting QS – Project Y

The UI must support this flexibility.

---

# 7. USER TYPES

Design role-specific experiences for:

1. Chairman / Executive
2. GMD
3. GGMP — Group General Manager, Operations
4. GED
5. ED
6. GED Projects
7. Head of Operations
8. Operations Officer
9. Project Manager
10. Project Coordinator
11. Project Officer
12. Business Development Officer
13. Tender/Proposal Officer
14. Head of Architecture
15. Architect
16. Architectural Designer/Technician
17. Head of Quantity Surveying
18. Quantity Surveyor
19. QS Officer
20. Engineer
21. Planner
22. Technical Officer
23. Site Supervisor
24. Site Officer
25. Project Monitoring Officer
26. Finance Manager/Head
27. Finance Officer
28. Procurement Manager
29. Procurement Officer
30. Administration Officer
31. HR/Staff Administration
32. Customer Care Officer
33. Client Support Officer
34. Front Desk/Helpdesk
35. Document Controller
36. Records Officer
37. ERP/System Administrator
38. Audit/Compliance Officer

Do not show every function to every user.

---

# 8. AUTHORITY MODEL

Use four conceptual authority levels:

### EXECUTE

Can perform assigned work.

### REVIEW

Can review submitted work.

### AUTHORISE

Can approve or reject.

### EXECUTIVE

Can make strategic/management decisions.

Permissions should support:

* View
* Create
* Edit
* Submit
* Review
* Recommend
* Approve
* Reject
* Archive
* Export
* Administer

Permissions must be configurable.

---

# 9. EXECUTIVE COMMAND CENTRE

Create a premium Executive Command Centre.

This should not be a generic KPI dashboard.

It should be a **management control room**.

Prioritise:

1. Important Alerts
2. Pending Approvals
3. Active Projects
4. Projects at Risk
5. Tender Deadlines
6. Procurement Activities
7. New Opportunities
8. Project Financial Performance
9. Receivables
10. Staff Workload

Show:

* Active projects
* Total contract value
* Projects at risk
* Delayed projects
* Upcoming milestones
* Pending approvals
* Outstanding receivables
* Tender pipeline
* Opportunity pipeline
* Critical issues
* Major risks
* Executive instructions
* Outstanding decisions
* Procurement exceptions
* Financial exceptions

Use meaningful charts only.

---

# 10. MANAGEMENT BY EXCEPTION

The dashboard should actively surface problems.

Examples:

**Project X**

* Schedule: Critical
* Cost: Healthy
* Procurement: Attention Required
* Payment: Critical
* Quality: Healthy

The system should automatically surface:

* Delayed projects
* Budget overruns
* Cost variance
* Delayed procurement
* Overdue invoices
* Contracts approaching expiry
* Stuck approvals
* Missing site reports
* Designs awaiting approval
* BOQs awaiting review
* Unresolved project issues
* Material requests awaiting action
* Client responses overdue
* Tasks overdue
* Resource conflicts

Every exception must be clickable.

---

# 11. MY WORK

Every user gets a personalised **My Work** home.

Sections:

### Needs My Action

### My Tasks

### My Projects

### My Approvals

### My Reviews

### My Requests

### My Deadlines

### Upcoming

### Overdue

### Blocked

### Waiting for Someone Else

### Recent Activity

This should be the default experience for most operational users.

---

# 12. ACTION CENTRE

Create a universal Action Centre.

Consolidate:

* Approvals
* Reviews
* Tasks
* Procurement actions
* Project actions
* Site reports
* Document reviews
* Client follow-ups
* Issues
* Risks
* Escalations
* Instructions
* Meetings
* Staff requests
* Invoice follow-ups

Each action must clearly display:

* What needs to happen
* Why
* Related project/company
* Responsible person
* Priority
* Deadline
* Current status
* Supporting information
* Available action

---

# 13. QUICK ACTION COMMAND CENTRE

Create a persistent global quick-action mechanism.

Examples:

* New Opportunity
* New Client
* New Tender
* New Proposal
* New Contract
* New Project
* Assign Task
* Submit Procurement Request
* Submit Site Report
* Upload Drawing
* Create BOQ
* Submit Variation
* Create Invoice
* Submit Expense
* Create Meeting
* Create Instruction
* Upload Document
* Submit Approval Request
* Create Staff Request

Use contextual pre-population.

---

# 14. PROJECT AS THE CENTRAL OBJECT

Projects are the heart of the ERP.

Create a powerful **Project Control Room**.

Every project should show:

* Project name
* Project code
* Owning company
* Participating companies
* Client
* Location
* Contract
* Contract value
* Start date
* End date
* Project Manager
* Project team
* Current phase
* Overall progress
* Project health
* Financial health
* Schedule health
* Procurement status
* Payment status
* Critical alerts

Project tabs:

* Overview
* Contract
* Programme
* WBS
* Tasks
* Team
* Architecture
* QS / BOQ
* Procurement
* Site Operations
* Budget
* Costs
* Expenses
* Invoices
* Payments
* Variations
* Claims
* Issues & Risks
* Quality
* HSE
* Meetings
* Instructions
* Correspondence
* Documents
* Reports
* Approvals
* Activity
* Audit

---

# 15. PROJECT CONTROL ROOM

Make this one of the flagship screens.

At the top:

> **PROJECT HEALTH: AT RISK**

Then show:

### Schedule

48% actual vs 62% planned

### Cost

72% budget consumed

### Procurement

3 requests pending

### Payment

₦85m overdue

### Quality

2 unresolved issues

### Client

Approval pending

### Resources

PM overloaded

Then:

## What Needs Attention?

Show actionable exceptions.

## What's Happening?

Show chronological project activity.

## What's Next?

Show upcoming milestones and deadlines.

This screen must allow an executive to understand a project in under one minute.

---

# 16. PROJECT HEALTH MODEL

Overall project health should consider:

* Schedule
* Cost
* Scope
* Quality
* Procurement
* Client
* Resources
* Risks
* Payment/Cash Position

Allow:

**Overall: AT RISK**

with individual states:

* Healthy
* Attention
* Critical

Make the reason behind each status visible.

---

# 17. PROJECT PLANNING & WBS

Support:

**Project → Phase → Work Package → Activity → Task → Deliverable**

Example:

Project

→ Design Phase

→ Detailed Design

→ Architectural Drawings

→ Ground Floor Drawing

→ Review Drawing

→ Approve Drawing

For construction:

Project

→ Construction Phase

→ Foundation

→ Excavation

→ Blinding

→ Reinforcement

→ Concrete

Allow:

* Start/end dates
* Dependencies
* Duration
* Milestones
* Planned progress
* Actual progress
* Critical activities
* Responsible person
* Baseline programme
* Revised programme

Show:

**Planned Progress vs Actual Progress**

---

# 18. PROJECT PROGRAMME

Create a professional programme/Gantt-style experience.

Show:

* Activities
* Dependencies
* Milestones
* Baseline
* Actual
* Delays
* Critical path indicators
* Revised dates
* Completion percentage

Example:

> Planned: 62%
> Actual: 48%
> Variance: -14%

---

# 19. RESOURCE PLANNING

Treat people, equipment and materials as project resources.

## People

Show:

* Current assignments
* Workload
* Availability
* Responsibility
* Project allocation
* Over-allocation

## Equipment

Show:

* Current project
* Location
* Status
* Maintenance
* Assignment history

## Materials

Show:

* Required
* Requested
* Approved
* Ordered
* Delivered
* Consumed
* Remaining

Surface resource conflicts.

---

# 20. BUSINESS DEVELOPMENT

Create:

**Opportunity Pipeline**

Sources:

* Government invitation
* Public tender
* Direct client
* Existing client
* Referral
* Relationship/network

Capture:

* Client
* Company
* Opportunity source
* Estimated value
* Strategic importance
* Profitability potential
* Technical capability
* Risk
* Responsible person
* Probability
* Expected submission
* Next action
* Documents

Management decision:

**Pursue / Do Not Pursue**

---

# 21. CLIENT MANAGEMENT

Central client profile.

A client can have relationships with both USV and CANONIC.

Client profile should show:

* Client information
* Contacts
* Company relationships
* Opportunities
* Tenders
* Proposals
* Contracts
* Projects
* Invoices
* Payments
* Correspondence
* Documents
* Activity history

---

# 22. TENDER & PROPOSAL MANAGEMENT

Workflow:

**Tender Received**

→ Requirements Review

→ Technical Preparation

→ Commercial Preparation

→ Internal Review

→ Approval

→ Submission

→ Outcome

Support:

* Tender documents
* Technical proposal
* Commercial proposal
* BOQ
* Methodology
* Company profile
* CVs
* Project references
* Submission deadline
* Approval history
* Submission evidence
* Win/loss outcome

Retain unsuccessful proposals.

---

# 23. TENDER KNOWLEDGE BASE

Create a searchable repository of approved historical proposal material.

Allow authorised users to reuse:

* Previous proposals
* Methodologies
* Company profiles
* Project references
* Staff CVs
* Technical documents
* BOQs
* Relevant project experience

Clearly distinguish:

**Approved Template / Current Version / Historical Version**

---

# 24. CONTRACT MANAGEMENT

Contract workspace should capture:

* Contract value
* Client
* Company
* Project
* Scope
* Start date
* End date
* Deliverables
* Milestones
* Payment terms
* Obligations
* Variations
* Claims
* Extensions
* Documents
* Approval history

Show alerts for:

* Expiry
* Payment milestones
* Deliverables
* Obligations
* Pending variations
* Claims
* Delays

---

# 25. ARCHITECTURE & DESIGN

Create a dedicated CANONIC Architecture workspace.

Workflow:

**Client Brief**

→ Site Information

→ Concept

→ Preliminary Design

→ Design Development

→ Client Review

→ Approval

→ Detailed Drawings

→ Documentation

→ Construction/Supervision

→ Post-Construction

Support:

* Design brief
* Site data
* Design stages
* Drawings
* Drawing revisions
* Review comments
* Client approval
* Internal approval
* Construction reference

Make:

**Latest Version**

**Latest Approved Version**

**Superseded Version**

visually obvious.

---

# 26. DRAWING MANAGEMENT

Create a professional drawing/document interface.

Each drawing should show:

* Drawing number
* Title
* Discipline
* Revision
* Status
* Uploaded by
* Date
* Approval
* Related project
* Related activity
* Superseded versions

Allow authorised users to compare revisions.

---

# 27. QUANTITY SURVEYING

Create a professional QS workspace.

Support:

* BOQ
* Cost planning
* Estimates
* Measurements
* Valuations
* Contractor costs
* Material costs
* Variations
* Claims
* Project commercial performance

Connect QS data to:

* Contract
* Project
* Procurement
* Costs
* Variations
* Invoices

Support BOQ revisions and history.

---

# 28. PROJECT COST CONTROL

Create a strong project commercial control system.

Use:

**Budget → Commitments → Actual Cost → Forecast → Variance**

Example:

Materials:

Budget: ₦200m
Committed: ₦170m
Actual: ₦145m
Forecast: ₦210m
Variance: +₦10m

Support:

* Cost categories
* Cost codes
* Budget
* Approved budget
* Purchase commitments
* Actual expenditure
* Forecast final cost
* Variance

---

# 29. COMMITTED COST

Make committed cost visible separately from actual expenditure.

Example:

Budget:

₦500m

Actual:

₦250m

Approved purchase orders:

₦150m

Committed position:

₦400m

The project manager should immediately understand remaining financial exposure.

---

# 30. CONSTRUCTION & SITE OPERATIONS

Create a mobile-first site experience.

Site users should see:

* My projects
* Today's activities
* Assigned tasks
* Material requests
* Site instructions
* Open issues
* Required reports
* Recent activity

Make field interaction extremely simple.

---

# 31. SITE REPORT

Create a fast mobile workflow:

**New Site Report**

Automatically populate:

* Project
* Company
* User
* Date

Capture:

* Personnel present
* Activities
* Work completed
* Materials used
* Progress
* Problems
* Recommendations
* Required actions
* Photos
* Videos
* Supporting documents

Submission states:

* Draft
* Saved
* Pending Upload
* Submitted
* Synced
* Reviewed

---

# 32. PROJECT / SITE DIARY

Create a chronological project diary.

Example:

8:15 AM — Site opened

9:00 AM — Materials delivered

10:30 AM — Engineer inspection

12:20 PM — Concrete works started

2:00 PM — Client representative visited

4:30 PM — Work stopped due to rainfall

This creates an operational history of the project.

---

# 33. QUALITY MANAGEMENT

Support:

* Inspection requests
* Inspection results
* Defects
* Non-conformance
* Corrective actions
* Reinspection
* Approval
* Evidence/photos

Example:

> Concrete Inspection
> FAILED
> Reinforcement spacing not compliant
> Corrective action assigned
> Reinspection scheduled

---

# 34. HSE / SAFETY

Include a lightweight HSE module.

Support:

* Site safety observations
* Incidents
* Near misses
* Safety inspections
* PPE checks
* Corrective actions
* Evidence
* Escalations

---

# 35. PROCUREMENT

Use the workflow:

**Need Identified**

→ Purchase Request

→ Review

→ Approval

→ Quotation / Market Survey

→ Comparison

→ Vendor Selection

→ Purchase Order

→ Delivery

→ Verification

→ Project Cost Update

Purchase request should include:

* Requester
* Company
* Department
* Project
* Item/service
* Quantity
* Estimated cost
* Required date
* Justification
* Supporting documents

---

# 36. QUOTATION COMPARISON

Create a proper comparison workspace.

Show:

| Vendor | Price | Quality | Delivery | Reliability | Compliance |
| ------ | ----- | ------- | -------- | ----------- | ---------- |

Allow authorised users to recommend a vendor.

Show:

**Recommended Vendor**

**Reason**

**Approval**

---

# 37. VENDOR / CONTRACTOR MANAGEMENT

Separate vendor categories:

* Supplier
* Contractor
* Consultant
* Service Provider

Capture:

* Company
* Contact
* Address
* Bank information
* Products/services
* Projects
* Procurement history
* Transactions
* Performance

Performance:

* Price
* Quality
* Delivery
* Reliability
* Compliance
* Responsiveness

---

# 38. CONTRACTOR MANAGEMENT

Contractors should have:

* Contract
* Project
* Scope
* BOQ
* Work package
* Mobilisation
* Performance
* Valuations
* Payments
* Variations
* Defects
* Compliance documents

---

# 39. VARIATION MANAGEMENT

Workflow:

**Identified**

→ Assessed

→ Costed

→ Internally Reviewed

→ Client Submitted

→ Approved / Rejected

→ Implemented

→ Commercially Recorded

Capture:

* Reason
* Description
* Origin
* Drawing reference
* BOQ reference
* Cost impact
* Time impact
* Client impact
* Supporting documents

Show:

Original Contract: ₦1.2bn

Approved Variations: ₦180m

Revised Contract: ₦1.38bn

---

# 40. CLAIMS & EXTENSION OF TIME

Support:

### Claims

* Reference
* Cause
* Amount
* Evidence
* Submission
* Response
* Status

### Extension of Time

* Original completion
* Requested extension
* Reason
* Evidence
* Client response
* Approved extension
* Revised completion date

Connect these to programme and contract.

---

# 41. FINANCE

This phase should focus on operational/project financial control rather than attempting to replace a full accounting package.

Show:

* Contract value
* Approved budget
* Budget consumed
* Commitments
* Actual cost
* Forecast
* Variance
* Invoiced
* Received
* Outstanding

Expenses should be linked to projects.

---

# 42. INVOICING

Workflow:

**Draft**

→ Review

→ Approval

→ Issued

→ Due

→ Partially Paid

→ Paid / Overdue

Capture:

* Invoice number
* Client
* Project
* Contract
* Amount
* Date
* Due date
* Payment terms
* Status
* Outstanding
* Payment history
* Supporting documents

---

# 43. RECEIVABLES

Create a management receivables view.

Show:

* Invoice
* Client
* Project
* Amount
* Due date
* Outstanding
* Days overdue
* Follow-up owner
* Last action
* Next action

Highlight overdue accounts.

---

# 44. STAFF & ADMINISTRATION

Staff profile:

* Personal information
* Company
* Department
* Role
* Responsibilities
* Projects
* Tasks
* Approvals
* Delegation
* Requests
* Documents
* Activity history

Support requests:

* Leave
* DTA/allowances
* Project requests
* Site requests
* Material requests
* Other approval requests

---

# 45. WORKLOAD MANAGEMENT

Create:

**Staff Workload Dashboard**

Show:

* Active tasks
* Projects
* Overdue tasks
* Upcoming deadlines
* Pending approvals
* Current workload
* Capacity indicators

Surface:

> **Potential Over-allocation**

---

# 46. DELEGATION & HANDOVER

Create a proper delegation workflow.

When an employee is absent:

**Create Delegation**

→ Select acting person

→ Select responsibilities

→ Select projects

→ Select duration

→ Approve

→ Activate

The system should clearly display:

> Acting on behalf of: [Employee]

Do not permanently transfer ownership.

Create a **Handover Mode** showing:

* Active projects
* Tasks
* Approvals
* Documents
* Open issues
* Upcoming deadlines
* Client follow-ups
* Procurement
* Correspondence

---

# 47. MEETINGS

Create Meetings & Decisions.

Meeting:

* Title
* Project
* Company
* Date
* Participants
* Agenda
* Notes
* Decisions
* Actions
* Assigned persons
* Deadlines
* Attachments
* Follow-up

A decision should be convertible into a task.

---

# 48. DECISION REGISTER

Create a formal Decision Register.

Example:

**DEC-024**

Decision:

Approve revised foundation design.

Capture:

* Project
* Date
* Decision maker
* Participants
* Reason
* Supporting documents
* Financial impact
* Time impact
* Action
* Outcome

This must be different from the technical audit log.

---

# 49. EXECUTIVE INSTRUCTION REGISTER

Create a formal management instruction workflow:

**Instruction**

→ Responsible Person

→ Deadline

→ Execution

→ Evidence

→ Verification

Example:

> GMD instructed Procurement to source reinforcement steel for Project X.

Show:

* Issuer
* Recipient
* Date
* Project
* Deadline
* Status
* Evidence
* Verification

---

# 50. INSTRUCTIONS & CORRESPONDENCE

Support:

* Management instructions
* Internal memos
* Client correspondence
* Contractor correspondence
* Site instructions
* Formal letters
* Responses
* Follow-ups

Link correspondence to:

* Company
* Client
* Project
* Contract
* Task
* Document

Important correspondence must remain traceable.

---

# 51. ISSUES, RISKS & ESCALATIONS

Differentiate:

### ISSUE

Existing problem.

### RISK

Potential future problem.

### ESCALATION

Issue/risk requiring higher management intervention.

Capture:

* Description
* Project
* Severity
* Owner
* Impact
* Mitigation
* Due date
* Status
* Escalation level
* Resolution
* Evidence

---

# 52. SLA & ESCALATION ENGINE

The ERP should monitor how long actions remain pending.

Example:

Procurement request submitted.

24 hours:

→ Reminder

48 hours:

→ Escalation

72 hours:

→ Management exception

Similarly:

Invoice overdue 7 days:

→ Reminder

Invoice overdue 30 days:

→ Management escalation

Contract expiry in 30 days:

→ Alert

Missing site report:

→ PM reminder

Design approval delayed:

→ Escalation

Do not hardcode monetary thresholds or exact policies; make these configurable.

---

# 53. DOCUMENT MANAGEMENT

Create a serious enterprise Document & Records Centre.

Documents include:

* Contracts
* Tender documents
* Proposals
* Drawings
* BOQs
* Site reports
* Purchase orders
* Invoices
* Receipts
* Certificates
* Correspondence
* Vendor documents
* Staff documents
* Approval records

Every document should support:

* Company
* Project
* Record type
* Version
* Owner
* Status
* Upload date
* Approval
* Access
* Related records

Support:

**Current Version**

**Approved Version**

**Superseded Version**

---

# 54. OFFICIAL RECORDS

The ERP is the official operational record for:

* Important tasks
* Approvals
* Decisions
* Project reports
* Documents
* Instructions
* Status changes
* Procurement
* Financial/project control

Email and WhatsApp may remain communication channels, but important operational records should be captured in the ERP.

---

# 55. DOCUMENT TEMPLATES

Create a controlled template library for:

* Tender letters
* Proposals
* Project reports
* Site reports
* Purchase requests
* Purchase orders
* Invoices
* Memos
* Instructions
* Meeting minutes
* Variation submissions
* Completion reports
* Handover documents

Clearly identify:

**Official Template**

**Current Version**

**Deprecated Template**

---

# 56. RECORD NUMBERING

Create configurable reference numbers.

Examples:

OPP-2026-0012

TND-2026-0045

CON-USV-2026-0021

PRJ-USV-2026-0015

PR-USV-2026-0081

PO-USV-2026-0067

INV-USV-2026-0044

VAR-PRJ001-003

SR-PRJ001-082

Make numbering configurable by company and record type.

---

# 57. ASSETS & EQUIPMENT

Support:

* Vehicles
* Computers
* Construction equipment
* Tools
* Office equipment
* Project equipment

Track:

* Asset ID
* Company
* Current location
* Assigned employee
* Assigned project
* Condition
* Maintenance
* Movement history

Support movement between USV and CANONIC.

---

# 58. CUSTOMER CARE / SUPPORT

Create a dedicated Support workspace.

Show:

* Client enquiries
* Assigned clients
* Follow-ups
* Requests
* Communication history
* Related projects
* Priority
* Escalations
* Outstanding responses

Strictly restrict access to confidential financial, salary and procurement information.

---

# 59. CALENDAR

Create a unified operational calendar.

Show:

* Tender deadlines
* Contract milestones
* Project milestones
* Meetings
* Site inspections
* Design reviews
* BOQ deadlines
* Invoice due dates
* Procurement deadlines
* Staff leave
* Contract expiry
* Task deadlines

Views:

* My Calendar
* Project Calendar
* Department Calendar
* Company Calendar
* Group Calendar

---

# 60. GLOBAL SEARCH

Create powerful global search.

Search:

* Projects
* Clients
* Contracts
* Opportunities
* Tenders
* Staff
* Vendors
* Documents
* Tasks
* Purchase Orders
* Invoices
* Site Reports

Results must show context:

**Record Type | Company | Project | Location | Status | Responsible Person**

Support filters.

---

# 61. PROJECT ACTIVITY TIMELINE

Every major record should have a human-readable timeline.

Example:

> 9:42 AM — Site Officer submitted Site Report
> 10:15 AM — Project Manager reviewed report
> 11:03 AM — QS uploaded BOQ Revision 04
> 12:30 PM — GGMP approved procurement request
> 2:10 PM — Procurement issued PO
> 3:45 PM — Architect uploaded revised drawing

This should reconstruct the history of the project.

---

# 62. AUDIT TRAIL

Create a formal audit trail separate from the normal activity timeline.

Record:

* User
* Action
* Date/time
* Record
* Previous value
* New value
* Comment/reason
* Supporting evidence

Audit sensitive actions including:

* Approvals
* Rejections
* Financial changes
* Contract changes
* BOQ revisions
* Drawing revisions
* Procurement
* User permissions
* Archiving
* Delegation

---

# 63. APPROVAL ENGINE

Create a universal Approval Centre.

Applicable to:

* Opportunities
* Proposals
* Contracts
* Procurement
* Payments
* Expenses
* Variations
* Vendor selection
* Project activities
* Staff requests
* Documents

Display:

**Requester → Reviewer → Approver → Decision**

Actions:

* Approve
* Reject
* Return for Revision
* View Details

Require comments where appropriate.

Maintain permanent history.

---

# 64. DATA GOVERNANCE

Design interfaces for:

* Record ownership
* Edit rights
* Approval rights
* Archive rights
* Retention
* Export rights
* Employee exit
* Project closure
* Historical records

Do not allow important business history to disappear.

---

# 65. PROJECT CLOSURE

Workflow:

**Inspection**

→ Completion Confirmation

→ Outstanding Items

→ Documentation

→ Client Handover

→ Final Financial Review

→ Closure

→ Archive

Do not allow critical unresolved items to be hidden by simply marking a project completed.

---

# 66. KNOWLEDGE & LESSONS LEARNED

At project closure, capture:

* What went well?
* What went wrong?
* Causes of delay
* Vendor performance
* Cost lessons
* Procurement lessons
* Client issues
* Technical lessons
* Recommendations

Future projects should be able to reference this knowledge.

---

# 67. PROJECT INTELLIGENCE

When a new opportunity or project is created, authorised users should eventually be able to see similar historical projects.

Example:

> Similar Projects
> 4 projects
> Total historical value: ₦4.8bn
> Common delay: client approvals
> Typical duration: 14 months
> Frequently used contractors: X

Use this as a future-ready intelligence layer.

---

# 68. RELATIONSHIP INTELLIGENCE

Business development should understand relationships.

Show:

**Client → Contacts → Previous Projects → Contracts → Opportunities → Relationship Owner**

This is particularly important for government and corporate business development.

---

# 69. REPORTING

Create a comprehensive reporting centre.

### Business Development

* Opportunities
* Tender pipeline
* Win/loss
* Success rate

### Projects

* Active projects
* Progress
* Delays
* Milestones
* At-risk projects
* Project performance

### Finance

* Revenue
* Expenses
* Project costs
* Profitability indicators
* Receivables
* Variance

### Procurement

* Requests
* POs
* Vendor performance
* Expenditure

### Management

* Executive summary
* Company performance
* Projects at risk
* Outstanding actions
* Pending approvals
* Exceptions

Allow filters:

* Company
* Department
* Project
* Client
* Date
* Status
* Responsible person

---

# 70. KPI DEFINITIONS

Do not create meaningless dashboard numbers.

Every KPI should have a defined source and meaning.

Examples:

### Project Progress

Based on approved project activities/WBS.

### Budget Variance

Approved Budget − Actual/Forecast Cost.

### Receivables

Issued Invoice − Confirmed Payments.

### Schedule Variance

Planned Progress − Actual Progress.

### Procurement Cycle Time

Purchase Request Date → PO Date.

### Project Cost Exposure

Actual Cost + Committed Cost + Forecast Remaining Cost.

---

# 71. NOTIFICATION CENTRE

Support notifications for:

* Tasks
* Deadlines
* Overdue
* Opportunities
* Tenders
* Proposals
* Procurement
* Approvals
* Invoices
* Payments
* Project delays
* Site reports
* Contract expiry
* Variations
* Meetings
* Decisions
* Instructions
* Escalations

States:

* Unread
* Read
* Action Required
* Urgent

---

# 72. MOBILE EXPERIENCE

Do NOT simply shrink desktop screens.

Create purpose-built mobile workflows for:

* Site staff
* Site supervisors
* Project officers
* Architects
* QS
* Management
* Executives

Mobile should prioritise:

* My Work
* Approvals
* Site Reports
* Photos
* Material Requests
* Tasks
* Instructions
* Project Status
* Notifications

Use:

* Bottom navigation
* Action sheets
* Camera capture
* Simplified forms
* Swipe actions where appropriate
* Large touch targets
* Offline-aware states

---

# 73. MOBILE FIELD CONNECTIVITY

Assume site connectivity can sometimes be poor.

Design states such as:

**Draft**

**Saved Locally**

**Pending Upload**

**Uploading**

**Submitted**

**Synced**

**Failed — Retry**

Do not make field workers repeatedly re-enter information.

---

# 74. ROLE-SPECIFIC DASHBOARDS

Create different dashboard experiences.

## Chairman

Strategic overview.

## GMD

Operational + financial + project control.

## GGMP

Operations + procurement + site + project execution.

## GED Projects

Project portfolio + project health.

## Project Manager

My projects + tasks + programme + site + issues + procurement.

## Architect

Design pipeline + drawings + reviews + approvals.

## QS

BOQs + costs + variations + valuations.

## Procurement

Requests + quotations + approvals + POs + deliveries.

## Finance

Budgets + costs + invoices + receivables.

## Site Supervisor

Today's site activities + reports + materials + issues.

## Support

Client enquiries + follow-ups.

## Administration

Staff + requests + administrative actions.

## Audit

Records + approvals + historical actions.

---

# 75. COMPANY CONTEXT

Always display company context.

Examples:

**USV**

**CANONIC**

**USV + CANONIC**

Use a subtle but clear company indicator throughout the application.

Allow authorised users to switch between:

**My Company**

**Group View**

**Project Context**

without losing context.

---

# 76. CROSS-COMPANY COLLABORATION

Joint projects must support:

* USV personnel
* CANONIC personnel
* Shared project team
* Individual responsibilities
* Reporting lines
* Company-specific permissions
* Shared documents
* Shared tasks
* Shared project timeline

Do not create artificial barriers where collaboration is legitimate.

But do not expose confidential company information unnecessarily.

---

# 77. USER CONTEXT

The user should always know:

**Where am I?**

**Which company?**

**Which department?**

**Which project?**

**Which role?**

**What responsibility am I acting under?**

Use contextual breadcrumbs.

Example:

> USV / Projects / Abuja Housing Project / Procurement / Purchase Request PR-1024

---

# 78. "WHAT HAPPENS NEXT?"

Every important record should clearly display:

### Current Status

Awaiting GMD Approval

### Next Action

GMD must approve procurement request

### Responsible

GMD

### Due

Today

This should be a recurring UX pattern across the application.

---

# 79. "WHY IS THIS BLOCKED?"

Whenever something is blocked, explain the reason.

Example:

**Project At Risk**

Schedule 🔴
Client approval delayed 12 days

Procurement 🟠
Reinforcement PO awaiting approval

Payment 🔴
₦85m invoice overdue

Next intervention:

**GGMP**

The ERP should explain problems, not just colour them red.

---

# 80. GLOBAL ACTIVITY / BUSINESS EVENT MODEL

Treat major business actions as events:

* Proposal Submitted
* Contract Awarded
* Project Created
* PM Assigned
* Drawing Approved
* BOQ Revised
* Procurement Requested
* PO Issued
* Material Delivered
* Site Report Submitted
* Variation Approved
* Invoice Issued
* Payment Received
* Project Completed

Use these events to power:

* Timelines
* Notifications
* Audit
* Reports
* Management dashboards
* Project history

This creates the ERP's institutional memory.

---

# 81. DESIGN SYSTEM

Create a sophisticated enterprise design system.

Use:

* Strong typography
* Excellent spacing
* Clear hierarchy
* Professional tables
* Status badges
* Timelines
* Drawers
* Modals
* Tabs
* Filters
* Charts
* Cards
* Forms
* Document previews
* Activity feeds
* Progress indicators
* Confirmation states
* Error states

Visual direction:

**Premium corporate + modern enterprise + construction/project intelligence**

Avoid:

* Generic SaaS templates
* Excessive gradients
* Cartoon illustrations
* Excessive glassmorphism
* Excessive shadows
* Over-rounded cards
* Excessive animation
* Gimmicky dashboards
* AI-generated-looking interfaces
* Visual clutter

The product should feel credible enough for senior executives, government contracts and major construction projects.

---

# 82. INFORMATION DENSITY

The ERP will contain large amounts of information.

Do not make everything a giant card.

Use:

* Tables for scanning
* Cards for summaries
* Timelines for history
* Forms for data capture
* Charts for trends
* Drawers for contextual details
* Tabs for related information
* Side panels for quick actions

Allow filtering, sorting and search.

---

# 83. STATES

Every major component must have:

* Default
* Hover
* Active
* Selected
* Loading
* Empty
* Error
* Success
* Disabled
* Permission denied
* Archived
* Overdue
* Blocked

Design realistic examples.

---

# 84. ACCESS CONTROL UX

When a user lacks access, do not simply hide everything without explanation.

Use clear states such as:

> You don't have permission to view financial details for this project.

Where appropriate, show non-sensitive information while protecting confidential data.

---

# 85. SECURITY-SENSITIVE ACTIONS

Require confirmation for:

* Approval
* Rejection
* Financial changes
* Contract changes
* Archiving
* Deletion
* Permission changes
* Delegation
* Status changes

Show consequences before confirming.

---

# 86. ARCHIVE, DON'T DESTROY HISTORY

Important records should generally be archived rather than permanently deleted.

Apply to:

* Projects
* Contracts
* Proposals
* Procurement
* Invoices
* Documents
* Approvals
* Site reports
* Decisions

Historical records must remain searchable and auditable.

---

# 87. SYSTEM ADMINISTRATION

Create an administration centre for:

* Users
* Companies
* Departments
* Roles
* Permissions
* Approval workflows
* Notifications
* Statuses
* Project types
* Cost categories
* Document categories
* Numbering
* Delegation
* System configuration

Business rules should be configurable rather than hardcoded wherever practical.

---

# 88. SYSTEM HEALTH

System administrators should have visibility into:

* Failed notifications
* Upload errors
* Workflow failures
* Synchronisation issues
* Inactive users
* Storage
* Security events
* Scheduled processes
* Integration failures

Keep this separate from business dashboards.

---

# 89. INTEGRATION-READY DESIGN

Design the ERP so it can eventually connect to:

* Email
* SMS
* WhatsApp
* Accounting software
* Banking/payment systems
* Cloud storage
* Calendar
* Digital signatures
* Government/client portals
* Future mobile applications

Do not make the UX dependent on a specific integration being available in Phase 1.

---

# 90. DATA OBJECTS

Design the interface around clearly identifiable business objects:

* User
* Employee
* Company
* Department
* Role
* Responsibility
* Client
* Opportunity
* Tender
* Proposal
* Contract
* Project
* Phase
* Work Package
* Activity
* Task
* Milestone
* Drawing
* BOQ
* Variation
* Claim
* Purchase Request
* Quotation
* Vendor
* Contractor
* Purchase Order
* Delivery
* Asset
* Expense
* Budget
* Cost
* Invoice
* Payment
* Meeting
* Decision
* Instruction
* Issue
* Risk
* Escalation
* Document
* Approval
* Site Report
* Notification
* Audit Event

Ensure these objects are visually and logically connected.

---

# 91. END-TO-END PROTOTYPE FLOWS

The prototype must demonstrate complete workflows rather than isolated screens.

## FLOW 1 — Opportunity to Project

Opportunity

→ Management Decision

→ Tender

→ Proposal

→ Review

→ Approval

→ Submission

→ Award

→ Contract

→ Project

→ PM Assignment

→ Team Assignment

→ Programme

→ Execution

---

## FLOW 2 — Procurement

Need

→ Purchase Request

→ Review

→ Approval

→ Quotation

→ Comparison

→ Vendor Recommendation

→ Approval

→ PO

→ Delivery

→ Verification

→ Project Cost Update

---

## FLOW 3 — Architecture

Client Brief

→ Concept

→ Design Development

→ Drawing

→ Revision

→ Review

→ Approval

→ Construction Reference

---

## FLOW 4 — Site

Project

→ Today's Activity

→ Site Report

→ Photos

→ Submit

→ PM Review

→ Project Timeline

→ Management Dashboard

---

## FLOW 5 — BOQ / Variation

BOQ

→ Revision

→ Variation

→ Cost Assessment

→ Internal Review

→ Client Submission

→ Approval

→ Revised Contract

---

## FLOW 6 — Invoice

Milestone

→ Invoice

→ Review

→ Approval

→ Issue

→ Due

→ Payment

→ Receivable Updated

---

## FLOW 7 — Staff Request

Staff Request

→ Review

→ Approval

→ Processing

→ Completion

---

## FLOW 8 — Meeting

Meeting

→ Discussion

→ Decision

→ Action Item

→ Assigned Person

→ Deadline

→ Completion

---

## FLOW 9 — Issue

Issue

→ Assessment

→ Owner

→ Corrective Action

→ Escalation

→ Management Decision

→ Resolution

---

## FLOW 10 — Delegation

Employee

→ Handover

→ Acting Assignment

→ Temporary Access

→ Work Continuity

→ Delegation End

→ Responsibility Returned

---

# 92. REQUIRED CORE SCREENS

Create a complete high-fidelity prototype including at minimum:

### Authentication

* Login
* Password recovery
* MFA/verification concept
* Session state

### Executive

* Group Dashboard
* USV Dashboard
* CANONIC Dashboard
* Executive Command Centre
* Management Exceptions

### Personal

* My Work
* Action Centre
* My Calendar
* Notifications

### Business Development

* Opportunity List
* Opportunity Pipeline
* Opportunity Details
* Client Directory
* Client Profile
* Tender List
* Tender Workspace
* Proposal Workspace

### Contracts

* Contract List
* Contract Workspace
* Contract Details
* Milestones
* Variations
* Claims
* Extensions

### Projects

* Project Portfolio
* Project List
* Project Overview
* Project Control Room
* Project Health
* Project Programme
* WBS
* Tasks
* Team
* Resource Planning
* Project Timeline

### Architecture

* Architecture Dashboard
* Design Workspace
* Drawing List
* Drawing Details
* Revision Management
* Revision Comparison
* Design Approval

### QS

* QS Dashboard
* BOQ Workspace
* BOQ Revision
* Cost Planning
* Valuation
* Variation

### Construction

* Construction Dashboard
* Site Dashboard
* Site Report
* Site Diary
* Quality Inspection
* Defect
* HSE
* Material Request

### Procurement

* Procurement Dashboard
* Purchase Request
* Quotation Management
* Quotation Comparison
* Vendor Selection
* Purchase Order
* Delivery Verification
* Vendor Directory
* Vendor Profile
* Contractor Profile

### Finance

* Finance Dashboard
* Project Cost Control
* Budget
* Commitments
* Actual Costs
* Expenses
* Invoice
* Receivables
* Payment History

### People

* Staff Directory
* Staff Profile
* Workload
* Responsibilities
* Staff Request
* Delegation
* Handover

### Collaboration

* Meetings
* Meeting Details
* Decisions
* Instructions
* Correspondence
* Issues
* Risks
* Escalations

### Documents

* Document Centre
* Folder/Project View
* Document Preview
* Version History
* Approval
* Archive

### Control

* Approval Centre
* Audit Trail
* Reports
* KPI Dashboard
* Compliance

### Administration

* User Management
* Role Management
* Permission Management
* Approval Matrix
* Workflow Configuration
* Notification Settings
* Company Configuration
* Department Configuration
* Numbering
* System Health

---

# 93. DESIGN PRINCIPLES

Follow these principles throughout the entire product:

### 1. Action-first

Bring work to the user.

### 2. Project-centric

Projects are the operational heart of the system.

### 3. Context-aware

Always show company, project and responsibility.

### 4. Connected

Every record should connect to related records.

### 5. Traceable

Every important action should have a history.

### 6. Exception-driven

Management should see problems first.

### 7. Role-aware

Different people need different experiences.

### 8. Mobile-first for field work

Do not force site workers into desktop workflows.

### 9. Minimum data entry

Pre-populate contextual information.

### 10. Human-readable

Avoid technical system language where normal business language works better.

### 11. No hidden business history

Archive rather than destroy.

### 12. Explain status

Never just show "At Risk"; explain why.

### 13. Show the next action

Every important record should tell the user what happens next.

### 14. Preserve accountability

Delegation must never destroy original ownership/history.

### 15. One system of record

Important operational information should ultimately live in the ERP.

---

# 94. VISUAL EXPERIENCE

The final interface should feel like:

**A premium enterprise operating system designed for a serious Nigerian construction, consultancy and project-management organisation.**

It should communicate:

* Trust
* Control
* Precision
* Professionalism
* Accountability
* Intelligence
* Stability
* Operational maturity

Use realistic business data.

Use realistic project names, Nigerian locations, construction activities, professional roles, contract values and operational records.

Do not use meaningless lorem ipsum.

Do not make the product look like an abstract demo.

---

# 95. UX QUALITY BAR

The design must pass these tests:

### Can a new user understand where they are?

### Can a user immediately see what requires action?

### Can a Project Manager understand their project without opening ten modules?

### Can an executive identify projects at risk immediately?

### Can management trace why a project is delayed?

### Can a user determine who is responsible for an action?

### Can a user determine who approved something?

### Can a manager understand project financial exposure?

### Can site staff submit a report in under a few minutes?

### Can an employee continue another employee's work through authorised delegation?

### Can management reconstruct the sequence of project events?

### Can USV and CANONIC collaborate without losing company separation?

### Can users find important documents quickly?

### Can management identify overdue receivables?

### Can procurement be traced from request to delivery?

### Can the system explain why something is blocked?

If the answer to any of these is no, improve the UX.

---

# 96. FINAL DESIGN DIRECTION

Do not create a collection of disconnected dashboards.

Create a **single coherent enterprise platform**.

The ERP should feel like:

> **The digital operating system, control centre and institutional memory of USV and CANONIC.**

It should connect:

**People**

with

**Responsibilities**

with

**Projects**

with

**Clients**

with

**Contracts**

with

**Design**

with

**QS**

with

**Construction**

with

**Procurement**

with

**Money**

with

**Documents**

with

**Decisions**

with

**Communication**

with

**Risks**

with

**Management**

with

**Audit History**

The system should reduce dependence on:

* WhatsApp
* Excel
* Physical files
* Verbal instructions
* Individual computers
* Manual approvals
* Scattered documents

and replace fragmented operational processes with:

**One source of truth.**

**One project history.**

**One approval trail.**

**One operational workflow.**

**One management view.**

**One accountable system.**

Most importantly:

> **Do not design an ERP where users have to hunt for their work. Design an ERP that understands their role, responsibility, project, deadlines, decisions, exceptions and next actions — and brings the right information to them at the right time.**

Generate the UI as a **complete high-fidelity enterprise product**, with reusable components, responsive layouts, realistic data, coherent navigation, role-specific dashboards, complete workflows, excellent information hierarchy and polished interaction states.

The final Figma output should be sufficiently detailed to serve as the primary **UI/UX reference for the subsequent PRD, technical architecture, database design, frontend implementation and backend development**.
