# FutureSchool — Enterprise School Management SaaS Prototype

A modern, mobile-first, and desktop-optimized school management platform designed for ~600 students across Grades 6–12. Built with React 19, TypeScript, Tailwind CSS, Lucide icons, and React Router v7.

---

## 1. Demo Credentials & Architecture

The application uses prototype credentials with role-based routing and centralized mock state stored in `localStorage`.

| Role | Username / ID | Password | Prototype MFA Code | Assigned Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `GVS-2027-0001` | `password123` | — | Class 10-A (Aarav Sharma) |
| **Parent** | `GVS-2027-0001` | `password123` | — | Parent of Aarav Sharma (Dr. Rajesh Sharma) |
| **Teacher** | `TCH0001` | `password123` | — | Vikramaditya Sen (Senior Math Faculty & Mentor Class 10-A) |
| **Principal** | `PRN0001` | `password123` | `849201` | Dr. Arundhati Roy (Executive Governance & Approvals) |
| **Admin** | `ADM0001` | `password123` | `392810` | Sanjay Deshmukh (Head of School Operations) |

> **Shared Student ID Note:** In FutureSchool, a student and their guardian share the single permanent student ID (`GVS-2027-0001`), ensuring single-source record integrity while routing to distinct role experiences.

---

## 2. Role Portals & Routes

### A. Student Portal (`/student/*`)
- `/student/dashboard`: Core KPIs (Attendance 96.4%, upcoming periods, homework deadlines, announcements).
- `/student/academics`: Class curriculum and verified published results (draft results guarded).
- `/student/attendance`: Morning & afternoon roll call history with visual percentage calendar.
- `/student/timetable`: Weekly 6-period master timetable and exam schedules.
- `/student/progress`: Longitudinal individual academic growth without peer rank or competitive comparison.
- `/student/homework`: Active assignments with PDF upload simulation and evaluation status.
- `/student/quiz`: Formative assessment drills with instant grading.
- `/student/materials`: Study blueprints, syllabus documents, and downloadable course packs.
- `/student/library`: Digital library catalog with reserve status.
- `/student/ai-tutor`: Grounded mock AI tutor with curriculum citations (CBSE NCERT Class 10).
- `/student/hall-ticket`: Admit card clearance with automated fee lock and QR verification code.
- `/student/profile`: Bio details, emergency contacts, and active session controls.

### B. Parent Portal (`/parent/*`)
- `/parent/dashboard`: Action Center with urgent pending dues, overdue homework alert, PTM booking, and notifications.
- `/parent/fees`: 4-instalment fee breakdown, partial payment entry, transport fee add-on, and mock checkout.
- `/parent/leave`: Student medical & personal leave request submission.
- `/parent/transport`: Route 4 tracking, driver contact, and Route 7 transfer request.
- `/parent/complaints`: Grievance submission, administrative responses, and parent resolution sign-off.
- `/parent/messages`: Direct messaging with Class 10-A Mentor.
- `/parent/meetings`: PTM calendar and slot reservations.
- `/parent/pickup`: Authorized pickup personnel registry and security verification.
- `/parent/consent`: Digital permissions for annual excursions and laboratory activities.

### C. Teacher Portal (`/teacher/*`)
- `/teacher/dashboard`: Strict segregation between **My Teaching Classes** (10-A, 10-B, 11-A) and **Class Mentor (10-A)** responsibilities.
- `/teacher/marks`: Interactive marks grid with Absent (`AB`) toggles, Excel import simulation, and verification submission to Principal.
- `/teacher/attendance`: Morning & afternoon roll call with 1-click "Mark All Present".
- `/teacher/leave-requests`: Review and sanction leave applications submitted by parents.
- `/teacher/report-cards`: Moderate student grades and publish endorsed report cards.
- `/teacher/hall-tickets`: Release hall tickets once fee clearance is validated.
- `/teacher/classes`: Class roster directory and syllabus velocity metrics.
- `/teacher/homework`: Homework creator with evaluation review modal.
- `/teacher/quiz-builder`: Formative assessment authoring tool.
- `/teacher/planner`: Weekly lesson planning and CBSE curriculum alignment.

### D. Principal Portal (`/principal/*`)
- `/principal/dashboard`: Institutional overview, faculty coverage, fee collection health, and urgent approval queues.
- `/principal/approvals`: Executive endorsement for academic marksheets with directive return notes.
- `/principal/exam-control`: Exam eligibility desk with audited executive overrides bypassing fee blocks with logged justification.
- `/principal/report-cards`: Batch review and digital sealing of term report cards.
- `/principal/teacher-leave`: Faculty leave approval with automated substitute teacher assignment.
- `/principal/re-exams`: Special re-examination sanctions for medical or sports absences.
- `/principal/fee-approvals`: Executive sign-off for bursaries, scholarships, and sibling discounts.
- `/principal/coverage`: Daily faculty substitution roster guaranteeing zero unmonitored classrooms.
- `/principal/complaints`: Escalated grievance oversight.
- `/principal/delegation`: Temporary governance handover to Vice Principal.
- `/principal/ai-summary`: Executive briefing mock generating weekly operational summaries.

### E. Admin Portal (`/admin/*`)
- `/admin/dashboard`: Operations Control Center with urgent queues and execution status.
- `/admin/execution-queue`: Administrative execution of configurations approved by the Principal.
- `/admin/admissions`: 3-step student admission wizard generating permanent ID `GVS-2027-XXXX`.
- `/admin/academic-structure`: Grades 6–12 class divisions, seat capacities, and mentor mapping.
- `/admin/staff`: Staff directory with credentials and department allocations.
- `/admin/fees`: Grade-wise annual fee structures (4 quarters) and collections ledger.
- `/admin/billing`: Validated billing run engine with duplicate invoice prevention.
- `/admin/transport`: Fleet operations (12 buses, 8 routes) and parent route change sanctioning.
- `/admin/timetable-generator`: Algorithmic timetable conflict detector (rooms, teachers, labs).
- `/admin/students`: Student 360 registry with holistic profiles.
- `/admin/permissions`: Role-based access control (RBAC) bundles.
- `/admin/bulk-import`: Excel/CSV staging area with schema check.
- `/admin/audit`: Immutable security audit log tracking administrative deployments.

---

## 3. The 7 Cross-Role Simulated Workflows

The platform features a persistent reactive store (`workflowStore.ts`) and floating **DevControls** harness (accessible via the floating pill in the bottom-right corner) with 1-click role switcher and instant scenario fast-forwards:

1. **Workflow 1: Parent Leave Request -> Teacher Sanction**
   - Parent applies for leave on `/parent/leave`.
   - Class 10-A Teacher reviews and sanctions the request on `/teacher/leave-requests`.
2. **Workflow 2: Teacher Marks Submission -> Principal Endorsement -> Class Teacher Publish**
   - Teacher inputs marks on `/teacher/marks` and submits for verification.
   - Principal audits and approves on `/principal/approvals` (or returns with directive note).
   - Class Teacher publishes report cards on `/teacher/report-cards` to unlock view in Student and Parent portals.
3. **Workflow 3: Fee Payment / Executive Override -> Hall Ticket Clearance**
   - Hall ticket initially blocked due to pending fees.
   - Either Parent pays outstanding balance on `/parent/fees`, OR Principal exercises audited override on `/principal/exam-control`.
   - Admit card unlocks on `/student/hall-ticket`.
4. **Workflow 4: Parent Route Transfer -> Admin Sanction**
   - Parent requests route shift from Route 4 to Route 7 on `/parent/transport`.
   - Admin validates seat capacity (38/40) and sanctions the transfer on `/admin/transport`.
5. **Workflow 5: Parent Grievance -> Principal Escalation -> Resolution Confirmation**
   - Parent submits complaint on `/parent/complaints`.
   - Case is escalated to Principal on `/principal/complaints`.
   - Operations team responds and parent marks issue as resolved.
6. **Workflow 6: Teacher Leave Application -> Principal Approval & Substitution Allocation**
   - Teacher requests leave for symposium on `/principal/teacher-leave`.
   - Principal approves and allocates substitute faculty on `/principal/coverage`.
7. **Workflow 7: Admin Configuration -> Principal Endorsement -> Admin Deployment**
   - Admin drafts updated master calendar on `/admin/execution-queue`.
   - Principal reviews and signs off on `/principal/approvals`.
   - Admin executes deployment into active school operations.

---

## 4. Design Language & Constraints

- **Palette**: Deep Teal (`#0f766e`, `#115e59`) with Warm Orange accents (`#ea580c`), balanced with clean neutrals.
- **Visuals**: Zero broken image dependencies; handcrafted SVGs and deterministic avatar rings.
- **Pedagogical Ethics**: No peer ranking or class percentile comparison in Student or Parent progress views.
- **Prototype Boundaries**: Frontend simulation only; all state persists in browser `localStorage`.
