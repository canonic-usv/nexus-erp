# USV–CANONIC UNIFIED ERP

## EXISTING PLATFORM ENHANCEMENT, USER RESPONSIBILITY & SEAMLESS DIGITAL WORKFLOW MASTER PROMPT

### IMPORTANT INSTRUCTION TO FIGMA AI

An initial version of this ERP has already been designed by Figma AI.

**DO NOT START THE PRODUCT FROM SCRATCH.**

Treat the existing Figma design as the current product baseline.

Your task is to **audit, understand, enhance and extend the existing platform** based on the requirements below.

Where a feature, page, component, workflow or data structure already exists:

> **MODIFY AND ENHANCE IT.**

Where it does not exist:

> **CREATE IT.**

Do not unnecessarily duplicate existing screens or create parallel versions of the same feature.

The objective is to evolve the existing ERP into a **seamless, action-oriented, enterprise-grade operating platform for USV and CANONIC**.

The final experience should feel like one coherent product that has evolved deliberately—not like new screens have been added onto an old design.

---

# 1. CORE PRODUCT PURPOSE

The purpose of this ERP is to move USV and CANONIC from a heavily paper-, WhatsApp-, email-, Excel- and manually-driven operating environment into a **centralised digital workflow and operational system of record**.

The ERP must digitise:

* People
* Departments
* Responsibilities
* Assignments
* Projects
* Tasks
* Approvals
* Procurement
* Construction/site activities
* Architecture
* Quantity surveying
* Contracts
* Documents
* Finance/project cost control
* Invoicing
* Receivables
* Staff welfare
* Salary and bonuses
* Reporting
* Management oversight
* Audit trails
* Communication and decisions

The platform must make it easy for every employee to know:

**WHO AM I?**

**WHAT AM I RESPONSIBLE FOR?**

**WHAT HAVE I BEEN ASSIGNED?**

**WHAT DO I NEED TO DO NOW?**

**WHAT IS WAITING FOR ME?**

**WHO NEEDS TO ACT NEXT?**

**WHAT HAPPENS AFTER I COMPLETE THIS?**

---

# 2. MOST IMPORTANT UX PRINCIPLE

## ACTION FIRST — NOT MODULE FIRST

Do not design the ERP around forcing users to navigate through modules.

Users should not have to think:

> Projects → Project Management → Requests → Material Requests → New Request

Instead, the ERP should provide:

> **+ Material Request**

and automatically understand the user's context.

The platform should always prioritise:

1. Action Required
2. My Responsibilities
3. My Assignments
4. My Tasks
5. My Approvals
6. Upcoming Deadlines
7. Relevant Projects
8. Recent Activity

Modules remain available, but **work should drive navigation**.

---

# 3. THE THREE-CLICK PRINCIPLE

Design the normal user experience around:

## "THREE CLICKS TO ACTION"

Where reasonably possible, every routine activity should be completed within three meaningful interactions.

Examples:

### Site Report

Click 1:
`+ Site Report`

Click 2:
Complete/update report and attach photos

Click 3:
`Submit`

---

### Material Request

Click 1:
`+ Material Request`

Click 2:
Select material + quantity + project

Click 3:
`Submit`

---

### Task

Click 1:
`+ Task`

Click 2:
Select responsible person + deadline

Click 3:
`Assign`

---

### Approval

Click 1:
Open approval notification

Click 2:
Review

Click 3:
Approve / Reject / Return

---

### Leave Request

Click 1:
`+ Leave Request`

Click 2:
Select leave type + dates

Click 3:
Submit

---

Do not artificially force complex transactions into three clicks.

For complex activities such as contracts, major procurement, BOQ preparation or project creation, use **guided workflows/wizards**, but minimise data entry through:

* Pre-filled information
* Smart defaults
* Existing project data
* Existing employee data
* Existing client data
* Existing vendor data
* Auto-generated numbering
* Auto-routing
* Auto-calculation
* Auto-save

---

# 4. SINGLE SOURCE OF TRUTH

The ERP must behave as **one connected data system**.

Do not design isolated modules that contain duplicate information.

For example:

A project should have one project record.

That project record should connect to:

Project
→ Client
→ Contract
→ Team
→ Responsibilities
→ Tasks
→ Programme
→ Drawings
→ BOQ
→ Procurement
→ Vendors
→ Site Reports
→ Issues
→ Risks
→ Variations
→ Invoices
→ Payments
→ Documents
→ Approvals
→ Activity History

If a project name, contract value, client or responsible person changes, every relevant screen should reflect the same source data.

---

# 5. ORGANISATIONAL STRUCTURE

Use the approved organisational structure.

## GOVERNANCE & EXECUTIVE MANAGEMENT

* Chairman / Executive Chairman
* Managing Director / GMD
* Group Executive Director / GED
* Executive Director / ED
* Group General Manager
* Group General Manager, Operations — **GGMP**

Do not use "GGMD".

---

# 6. THREE PRINCIPAL DIRECTORATES

## PROJECTS DIRECTORATE

Departments:

### Project Management

* Head / Principal Officer
* Project Manager
* Project Coordinator
* Project Officer

### Construction & Site Management

* Site Supervisor
* Site Officer
* Foreman
* Project Monitoring Officer

### Procurement

* Procurement Manager
* Procurement Officer

### Project Document Control

* Project Document Controller
* Site Records Officer

---

# 7. TECHNICAL DIRECTORATE

### Architecture & Design

* Head of Architecture
* Architect
* Architectural Technician / Designer

### Quantity Surveying

* Head of Quantity Surveying
* Quantity Surveyor
* QS Officer

### Engineering & Technical Services

* Head of Engineering
* Engineers
* Planners
* Technical Officers

---

# 8. CORPORATE SERVICES DIRECTORATE

### Operations

* Head of Operations
* Operations Officer

### Business Development & Tenders

* Business Development Officer
* Tender / Proposal Officer

### Finance & Accounts

* Finance Manager
* Accountant
* Finance Officer

### Administration & Human Resources

* Head of Administration / HR
* Administrative Officer
* HR Officer

### Client Support & Customer Care

* Customer Care Officer
* Client Support Officer
* Front Desk / Helpdesk Officer

### Corporate Records Management

* Records Officer
* Corporate Document Controller

### ICT / ERP / Systems Administration

* ICT Officer
* ERP Administrator
* System Administrator

### Internal Audit & Compliance

* Internal Auditor
* Compliance / Audit Officer

Preserve the existing Figma structure where already implemented, but enhance it to support the responsibility model below.

---

# 9. CRITICAL USER MODEL

Do NOT treat a user as simply:

> User → Role → Permissions

Instead model every employee as:

## PERSON

↓

## EMPLOYMENT

↓

## ORGANISATIONAL POSITION

↓

## PERMANENT RESPONSIBILITIES

↓

## AUTHORITY / PERMISSIONS

↓

## PROJECT ASSIGNMENTS

↓

## TEMPORARY RESPONSIBILITIES

↓

## DELEGATIONS

↓

## TASKS / APPROVALS / WORK

↓

## PERFORMANCE / HISTORY

This is a fundamental enhancement.

---

# 10. PERMANENT RESPONSIBILITY VS ASSIGNMENT

The ERP must clearly distinguish between:

### Permanent Responsibility

What the employee is employed/appointed to do.

Example:

**Project Manager**

Permanent responsibilities:

* Project planning
* Project coordination
* Project monitoring
* Project reporting
* Team coordination
* Issue escalation

AND:

### Current Assignment

What the employee is currently assigned to do.

Example:

**Lekki Housing Project**

Role:
`Lead Project Manager`

This assignment may have:

* Start date
* End date
* Project
* Assignment type
* Responsibilities
* Reporting relationship
* Backup officer
* Status

An employee's permanent role must remain unchanged when a project assignment ends.

---

# 11. TEMPORARY RESPONSIBILITIES

Support temporary responsibilities.

Example:

Senior Architect:

`Acting Head of Architecture`

Effective:
1 September – 15 September

The system should automatically:

* Record the delegation
* Show the acting responsibility
* Apply approved authority
* Route relevant work
* Notify affected users
* Preserve the permanent officer's identity
* Expire the acting assignment when its end date is reached

---

# 12. DELEGATION & HANDOVER

Create a proper digital handover system.

If an employee goes on leave or becomes unavailable:

The system should identify:

* Open tasks
* Pending approvals
* Active projects
* Documents
* Client actions
* Procurement requests
* Issues
* Responsibilities

Then allow management to assign a temporary replacement.

Example:

**David Okafor**
Permanent:
Project Manager

Leave:
10–20 September

Delegate:
Sarah Adeyemi

Sarah becomes:

`Acting / Delegated Project Responsibilities`

David remains the historical owner.

Sarah can continue the work without changing historical ownership.

---

# 13. STAFF PROFILE — MASTER VIEW

Enhance the existing staff profile.

Every staff profile should have:

### Overview

* Name
* Photograph
* Staff ID
* Company
* Directorate
* Department
* Position
* Reporting manager
* Location
* Employment status

### Responsibilities

* Permanent responsibilities
* Department responsibilities
* Project responsibilities
* Temporary responsibilities
* Delegated responsibilities

### Assignments

* Current projects
* Past projects
* Assignment dates
* Assignment roles

### My Work

* Tasks
* Approvals
* Reports
* Requests
* Issues
* Deadlines

### Workload

* Active assignments
* Task load
* Overdue tasks
* Capacity indicators

### Leave & Attendance

### Performance

### Documents

### Activity History

### Handover

---

# 14. HR VIEW

HR should have a dedicated **People & Workforce Command Centre**.

HR should manage:

* Employee records
* Organisation structure
* Departments
* Positions
* Reporting lines
* Permanent responsibilities
* Project assignments
* Temporary assignments
* Delegation
* Leave
* Attendance
* Performance
* Training
* Employee documents
* Employee requests
* Staff welfare
* Benefits
* Compensation information according to permission

---

# 15. SALARY, BONUS & STAFF WELFARE

Salary, bonuses and welfare are **confidential information**.

HR and authorised Finance/Executive users should have access according to permission.

The system should support:

### Compensation

* Basic salary
* Allowances
* Gross salary
* Deductions
* Net salary
* Salary history
* Effective dates
* Salary adjustments

### Bonuses

* Performance bonus
* Project bonus
* Annual bonus
* Special bonus
* Approval status
* Payment status
* History

### Staff Welfare

* Welfare requests
* Emergency assistance
* Staff support
* Welfare payments
* Benefits
* HMO/medical benefits
* Insurance
* Other approved benefits
* Welfare history

---

# 16. FINANCE VISIBILITY

Finance and sensitive financial information must have **strict access control**.

Full financial/compensation visibility should be restricted to:

* Chairman
* GGM
* GED
* EDM
* GGMP

Other users should only see financial information required for their job.

For example:

A Project Manager can see:

* Project budget
* Project cost
* Budget utilisation
* Approved procurement
* Project financial status

But should not see:

* Company payroll
* Other employees' salaries
* Confidential compensation
* Unrelated company finances

---

# 17. EMPLOYEE "MY HR"

Every employee should have a private self-service HR area:

### MY HR

* My Profile
* My Employment
* My Salary / Payslips
* My Benefits
* My Welfare
* My Leave
* My Requests
* My Performance
* My Documents

The employee should be able to initiate appropriate requests without physically submitting paper forms.

---

# 18. PROJECT DIRECTORATE — MAKE THIS THE OPERATIONAL HEART

The Projects Directorate should be significantly enhanced.

Its command centre should show:

### Portfolio

* Active projects
* On-track projects
* At-risk projects
* Delayed projects
* Completed projects

### Execution

* Physical progress
* Programme performance
* Milestones
* Delays
* Site reports
* Issues
* Risks

### Commercial

* Contract value
* Project budget
* Actual cost
* Budget variance
* Variations
* Claims
* Invoices
* Receivables

### Procurement

* Material requests
* Purchase requests
* Pending approvals
* POs
* Deliveries
* Vendor performance

### People

* Project teams
* Staff assignments
* Workload
* Responsibility gaps
* Staff availability

---

# 19. PROJECT CONTROL ROOM

Every project should have a single operational control room.

Example:

## LEKKI HOUSING PROJECT

Contract:
₦1.85B

Progress:
67%

Planned:
72%

Schedule:
5% Behind

Budget:
91% Utilised

Payment:
₦180M Outstanding

Overall Health:
`AT RISK`

Use strong visual hierarchy and line charts.

---

# 20. PROJECT HEALTH MODEL

Project health should consider:

* Schedule
* Cost
* Scope
* Quality
* Procurement
* Client
* Resources
* Risks
* Issues
* Cash/payment
* Documentation

Do not reduce project health to a single arbitrary colour.

Show the reason behind the health status.

Example:

**AT RISK**

* Schedule: 🔴
* Cost: 🟢
* Procurement: 🟡
* Client Approval: 🟡
* Quality: 🟢
* Cash: 🔴

---

# 21. PROJECT PEOPLE & RESPONSIBILITY

Every project must have a responsibility matrix.

Example:

| Responsibility     | Owner   | Backup | Status    |
| ------------------ | ------- | ------ | --------- |
| Project Management | David   | Sarah  | Active    |
| Site Supervision   | Michael | —      | No backup |
| QS / Cost Control  | Sarah   | John   | Active    |
| Procurement        | Grace   | Peter  | Active    |
| Document Control   | Esther  | Daniel | Active    |
| Site Reporting     | Daniel  | Esther | Active    |

Flag responsibility gaps.

---

# 22. PROJECT TEAM COLLABORATION

USV and CANONIC remain separate companies but can collaborate on the same project.

A project must support:

### Owning Company

USV / CANONIC

### Participating Company

USV / CANONIC / Both

Example:

CANONIC:

* Design
* Consultancy
* Architecture
* QS
* Technical oversight

USV:

* Construction
* Site execution

Clearly show the company of every project participant.

Do not merge the companies into one legal entity.

---

# 23. SITE USER EXPERIENCE

Site staff use mobile devices.

Do not give them a desktop ERP squeezed onto mobile.

Create a simplified field interface.

### MY SITE TODAY

Project:
Lekki Housing

Today's Activities:

* Foundation inspection
* Blockwork
* Material delivery
* Contractor coordination

Quick Actions:

`+ Site Report`

`+ Photo`

`+ Material Request`

`+ Issue`

`+ Inspection`

`+ Progress Update`

`+ Incident`

Site reports should automatically capture:

* Project
* Site
* Date
* User
* Personnel
* Work completed
* Materials
* Progress
* Problems
* Photos
* Recommendations
* Required action

Use mobile-first forms and minimal typing.

---

# 24. PROCUREMENT FLOW

Create one connected workflow:

Need identified

↓

Material / Service Request

↓

Review

↓

Approval

↓

Quotation / RFQ

↓

Vendor Comparison

↓

Vendor Selection

↓

Purchase Order

↓

Delivery

↓

Verification

↓

Project Cost

↓

Document Record

Each step should automatically route to the responsible person.

---

# 25. ARCHITECTURE WORKFLOW

Support:

Client Brief

→ Site Information

→ Concept

→ Preliminary Design

→ Design Development

→ Client Review

→ Approval

→ Detailed Drawings

→ Documentation

→ Construction / Supervision

→ Post-Construction

Drawings must support:

* Versions
* Revisions
* Approval
* Superseded drawings
* Comments
* Responsible architect
* Project connection
* Construction reference

---

# 26. QS WORKFLOW

Support:

Drawings / Scope

→ BOQ

→ Estimate

→ Budget

→ Procurement

→ Valuation

→ Cost Monitoring

→ Variations

→ Final Account

Provide strong cost visualisation and variance tracking.

---

# 27. CONTRACT MANAGEMENT

Every contract should connect to:

* Client
* Project
* Company
* Contract value
* Scope
* Start date
* End date
* Milestones
* Deliverables
* Payment terms
* Obligations
* Variations
* Claims
* Correspondence
* Documents
* Approvals

Provide alerts for:

* Expiry
* Milestones
* Payment dates
* Variation deadlines
* Deliverables

---

# 28. APPROVAL ENGINE

Approvals must be workflow-driven.

Never rely on users knowing who to send something to.

The system should automatically determine:

**Who created it?**

↓

**Who is responsible?**

↓

**Who reviews it?**

↓

**Who approves it?**

↓

**Who executes it?**

↓

**Who verifies it?**

↓

**Who needs to be notified?**

Every approval should permanently record:

* Person
* Role
* Date/time
* Action
* Decision
* Comment
* Previous status
* New status

---

# 29. ACTION CENTRE

Create a universal **ACTION CENTRE**.

This should be available to every user.

Categories:

### Needs My Action

### Pending Approval

### Assigned to Me

### Due Today

### Overdue

### Waiting for Someone Else

### Recently Completed

Every item should provide a direct action.

Example:

> Procurement Request PR-0248
> Lekki Housing
> ₦4.8M
> **Review →**

Do not force users to search for the relevant record.

---

# 30. "WHAT HAPPENS NEXT?"

Every workflow should clearly show the next stage.

Example:

**Material Request**

Current:
`Awaiting Project Manager Review`

Next:
`Procurement Review`

Then:
`Approval`

Then:
`Purchase Order`

Then:
`Delivery`

Users should never wonder where their request went.

---

# 31. "WHY IS THIS BLOCKED?"

Whenever an item cannot progress, explain why.

Example:

### Procurement Blocked

**Reason:**
Vendor quotation comparison has not been completed.

**Waiting on:**
Procurement Officer

**Since:**
4 September 2026

**Action:**
`Notify Responsible Officer`

---

# 32. MANAGEMENT BY EXCEPTION

Management should not have to inspect every transaction.

The ERP should surface exceptions.

Examples:

🔴 Project behind schedule

🔴 Budget exceeded

🔴 Payment overdue

🔴 Approval overdue

🔴 Procurement delayed

🔴 Responsibility has no backup

🔴 Contract approaching expiry

🔴 Site report missing

🔴 Staff overloaded

🔴 Critical document missing

The executive dashboard should prioritise these exceptions.

---

# 33. EXECUTIVE FINANCIAL / MANAGEMENT VIEW

Create a highly restricted executive view for:

* Chairman
* GGM
* GED
* EDM
* GGMP

Show:

* Group financial position
* Project financial performance
* Revenue
* Contract value
* Receivables
* Cash collection
* Project cost
* Budget variance
* Payroll summary
* Salary/bonus exposure
* Welfare expenditure
* Procurement exposure
* Business performance

Do not expose detailed sensitive financial information to general users.

---

# 34. LINE CHARTS AS A SIGNATURE VISUAL LANGUAGE

Retain and enhance the previously defined line-chart visual language.

Use line charts for:

* Revenue trend
* Project progress
* Planned vs actual progress
* Project cost
* Cash collection
* Receivables
* Profitability
* Budget utilisation
* Procurement cycle time
* Tender pipeline
* Workload
* Task completion
* Delays
* Variations
* Claims
* Forecasts

Prefer:

* Single-series charts
* Maximum 3–4 comparison lines
* Solid = actual
* Dashed = forecast
* Thin reference line = target
* Subtle grid
* Clear labels
* Hover interaction
* Drill-down
* Period filters

Use:

7D / 30D / 90D / 6M / YTD / 1Y / 3Y / Custom

Avoid excessive charts and visual noise.

---

# 35. DOCUMENT MANAGEMENT

Documents must become part of workflows, not merely storage.

Every document should have:

* Company
* Directorate
* Department
* Project
* Client/vendor
* Document type
* Owner
* Version
* Status
* Approval
* Date
* Related activity

Support:

* Upload
* Preview
* Version
* Replace
* Approve
* Reject
* Supersede
* Archive

Never permanently delete important business records.

---

# 36. MEETINGS & DECISIONS

Add structured meetings.

A meeting should produce:

* Meeting details
* Attendees
* Agenda
* Discussion
* Decisions
* Actions
* Responsible person
* Deadline

An action created during a meeting should automatically become a task.

Example:

Meeting Decision:

> Approve revised site programme.

Responsible:
Project Manager

Deadline:
12 September

The ERP automatically creates the task.

---

# 37. INSTRUCTIONS & CORRESPONDENCE

Digitise formal instructions and correspondence.

Support:

* Internal instruction
* Client instruction
* Site instruction
* Management instruction
* Contractor correspondence
* Official letters

Every instruction should have:

* Sender
* Recipient
* Date
* Project
* Subject
* Instruction
* Attachment
* Response
* Status
* Deadline

This reduces dependence on WhatsApp as the actual record.

---

# 38. ISSUES, RISKS & ESCALATION

Every issue should have:

* Description
* Project
* Category
* Severity
* Owner
* Date raised
* Deadline
* Status
* Escalation
* Resolution
* Evidence

Automatically escalate overdue critical issues.

---

# 39. BUSINESS DEVELOPMENT

Support:

Opportunity

→ Qualification

→ Pursuit Decision

→ Tender / Proposal

→ Submission

→ Follow-up

→ Award / Rejection

→ Contract

Retain unsuccessful proposals for institutional knowledge.

---

# 40. CLIENT & VENDOR MASTER RECORDS

Do not create duplicate client/vendor records.

One client may work with both USV and CANONIC.

The system should show:

### Client

* Organisation
* Contacts
* Projects
* Contracts
* Opportunities
* Tenders
* Invoices
* Payments
* Correspondence
* Documents
* History

Similarly, vendors should have:

* Services/products
* Contact details
* Bank details
* Projects
* Transactions
* Performance
* Pricing
* Reliability
* Quality
* Delivery

---

# 41. STAFF WORKLOAD

Managers should be able to see:

* Who is overloaded
* Who has capacity
* Current assignments
* Tasks
* Deadlines
* Projects
* Leave
* Responsibility gaps

Use visual workload indicators.

Do not create a separate data source for workload.

Calculate it from actual assignments/tasks.

---

# 42. NOTIFICATIONS

Notifications should be actionable.

Support:

* In-system
* Email
* SMS
* WhatsApp where appropriate

Notification example:

> 🔴 Procurement Approval Required
> Lekki Housing
> ₦4.8M
> **Review →**

Avoid generic:

> "You have a new notification."

---

# 43. GLOBAL SEARCH

Create a universal search.

Search across:

* People
* Projects
* Clients
* Vendors
* Contracts
* Documents
* Tasks
* Requests
* Procurement
* Invoices
* Meetings
* Decisions

Support command-style quick actions.

Example:

`Ctrl + K`

Search:

> Lekki Housing

Results should intelligently group:

Projects / People / Documents / Tasks / Procurement / Contracts

---

# 44. DATA CONSISTENCY RULE

Never create duplicate records simply because different departments use the same information.

For example:

There must be one:

**Employee**

one:

**Client**

one:

**Vendor**

one:

**Project**

one:

**Contract**

one:

**Document**

one:

**Purchase Order**

one:

**Invoice**

one:

**Task**

Each can be referenced from multiple workflows.

---

# 45. STATUS SYSTEM

Use consistent statuses across the ERP.

Examples:

### General

Draft
Submitted
Under Review
Approved
Rejected
Returned
In Progress
Blocked
Completed
Cancelled
Archived

Do not invent slightly different status names in different modules unless operationally necessary.

---

# 46. AUDIT TRAIL

Every important action must be recorded.

Example:

> David Okafor
> Changed project progress
> 62% → 67%
> 06 Sep 2026, 10:42 AM

Also track:

* Created
* Edited
* Approved
* Rejected
* Assigned
* Delegated
* Transferred
* Uploaded
* Downloaded where appropriate
* Status changes
* Financial changes

---

# 47. MOBILE VS DESKTOP

### Executives

Desktop-first.

Rich analytics.

Portfolio overview.

Management-by-exception.

Drill-down.

### Managers

Desktop + mobile.

### Office Staff

Desktop + mobile.

### Site Staff

Mobile-first.

Minimal fields.

Large action buttons.

Camera/photo integration.

Fast submissions.

---

# 48. DO NOT OVERLOAD THE INTERFACE

Do not show every available feature to every user.

Use role-aware interfaces.

A site supervisor should not see:

* Payroll
* Salary
* Executive finance
* Tender strategy
* Corporate HR data

A Project Manager should see what helps them manage projects.

A QS should see cost/BOQ functions.

An Architect should see design/drawing functions.

HR should see people functions.

Executives should see management intelligence.

---

# 49. EXISTING FEATURE ENHANCEMENT RULE

For every existing Figma screen:

### STEP 1 — IDENTIFY

What feature already exists?

### STEP 2 — RETAIN

Keep useful existing design, branding, navigation and components.

### STEP 3 — ENHANCE

Add the new responsibility, workflow, context, permissions and data relationships.

### STEP 4 — CONNECT

Connect it to related records and workflows.

### STEP 5 — SIMPLIFY

Remove unnecessary clicks, duplicate forms and unnecessary navigation.

### STEP 6 — VALIDATE

Ensure the screen makes sense for the specific user role.

Do not create duplicate screens when an existing screen can be enhanced.

---

# 50. EXAMPLE OF REQUIRED ENHANCEMENT

If an existing screen says:

**Projects**

with:

* Project name
* Status
* Progress

Enhance it to:

**Project Control Room**

with:

* Project identity
* Owning company
* Participating companies
* Client
* Contract
* Project team
* Responsibilities
* Progress
* Programme
* Cost
* Procurement
* Cash
* Risks
* Issues
* Documents
* Approvals
* Activities
* Timeline
* Project health
* Action required

But keep the existing design language where it is good.

---

# 51. RESPONSIBILITY ENGINE

Build the UI around a consistent responsibility model:

### PERMANENT OWNER

Who permanently owns the responsibility?

### CURRENT RESPONSIBLE PERSON

Who is currently expected to act?

### REVIEWER

Who reviews?

### APPROVER

Who approves?

### EXECUTOR

Who performs the activity?

### VERIFIER

Who verifies completion?

### BACKUP

Who covers the responsibility if the primary owner is unavailable?

### DELEGATION

Has the responsibility temporarily moved?

This model should appear consistently across projects, HR, procurement, documents, approvals and operations.

---

# 52. "MY WORK" SHOULD BE UNIVERSAL

Every employee should have a personalised:

## MY WORK

### Needs My Action

### My Tasks

### My Approvals

### My Projects

### My Assignments

### My Deadlines

### My Requests

### My Documents

### My Recent Activity

The exact contents should change according to the user's responsibilities.

---

# 53. HOME DASHBOARD SHOULD BE ROLE-AWARE

Do not create one generic dashboard for everybody.

### Chairman

Group intelligence.

### GGM / GED / EDM / GGMP

Executive/operational management.

### Head of Directorate

Directorate performance.

### Head of Department

Department responsibilities and workload.

### Project Manager

Project execution.

### Site Supervisor

Field execution.

### Architect

Design workflow.

### QS

Commercial/cost workflow.

### Procurement

Procurement pipeline.

### HR

People/workforce.

### Finance

Authorised financial operations.

### Document Controller

Document workflow.

---

# 54. THE ERP SHOULD FEEL LIKE A DIGITAL ASSISTANT

Whenever possible, the interface should proactively tell the user:

> **You have 4 actions requiring attention.**

> **Project Lekki is behind schedule.**

> **Three approvals are waiting.**

> **Two documents are missing.**

> **Sarah is currently covering David's responsibilities.**

> **This project has no backup site supervisor.**

> **This invoice is 18 days overdue.**

> **This contract milestone is due in 5 days.**

The system should surface information rather than requiring users to search for it.

---

# 55. FINAL UX TEST

Before considering the design complete, test common activities.

Ask:

### Can a site supervisor submit a report in approximately three actions?

### Can a project manager assign a task quickly?

### Can a department head approve a request without navigating through multiple modules?

### Can HR find an employee and understand their responsibilities immediately?

### Can HR see salary, bonus and welfare information according to permission?

### Can an employee submit leave/welfare requests without paper?

### Can management understand project health within seconds?

### Can management identify what is going wrong without opening every project?

### Can the ERP show who is responsible for an activity?

### Can it show who is acting when the permanent owner is unavailable?

### Can a replacement continue someone's work without losing historical ownership?

### Can a project connect its people, tasks, procurement, documents, costs and approvals?

### Can the system explain why something is blocked?

### Can the system show what happens next?

If the answer is no, improve the UX.

---

# 56. DESIGN QUALITY

The existing visual identity should be preserved where strong, but enhance it toward:

**Premium Enterprise Operations Platform**

Use:

* Executive Navy
* Deep Navy
* Slate
* Enterprise Teal
* Refined Gold
* Controlled semantic colours
* Light neutral backgrounds
* Strong typography
* Dense but breathable information architecture
* High-quality tables
* Elegant line charts
* Clear data hierarchy
* Minimal visual noise

The interface should feel comparable to a **top-tier enterprise operations platform**, not a generic admin dashboard.

---

# 57. FINAL PRODUCT EXPERIENCE

The completed ERP should feel like:

## ONE DIGITAL WORKPLACE

Not:

> HR software + Project software + Procurement software + Finance software

Instead:

> **One connected operational system where people, responsibilities, projects, documents, approvals, transactions and decisions naturally flow into one another.**

The fundamental journey should be:

**Person**

→ Responsibility

→ Assignment

→ Action

→ Review

→ Approval

→ Execution

→ Verification

→ Record

→ Reporting

→ Audit

---

# FINAL DIRECTIVE TO FIGMA AI

**DO NOT REBUILD THE EXISTING ERP BLINDLY.**

First understand the existing design.

Then:

**PRESERVE what works.**

**MODIFY what exists.**

**CREATE what is missing.**

**CONNECT what is disconnected.**

**REMOVE unnecessary duplication.**

**SIMPLIFY unnecessary steps.**

**MAKE RESPONSIBILITY EXPLICIT.**

**MAKE WORKFLOW AUTOMATIC.**

**MAKE DATA CONSISTENT.**

**MAKE THE NEXT ACTION OBVIOUS.**

**TARGET THREE CLICKS FOR NORMAL ACTIVITIES.**

The final platform must allow USV and CANONIC to move from:

**Paper → WhatsApp → Email → Excel → Physical Filing → Manual Follow-up**

to:

**Digital Request → Automatic Routing → Review → Approval → Execution → Verification → Record → Reporting**

with a complete audit trail.

The ERP must always make it clear:

### WHO IS RESPONSIBLE?

### WHAT NEEDS TO BE DONE?

### WHO NEEDS TO APPROVE?

### WHAT IS THE STATUS?

### WHAT IS BLOCKING IT?

### WHAT HAPPENS NEXT?

### WHO COVERS THE RESPONSIBILITY IF THE OWNER IS UNAVAILABLE?

Build the interface around these questions.

**ACTION FIRST.
CONTEXT AUTOMATICALLY.
MINIMUM DATA ENTRY.
THREE CLICKS WHERE POSSIBLE.
ONE SOURCE OF TRUTH.
ONE CONNECTED WORKFLOW.
ZERO UNNECESSARY COMPLEXITY.**
