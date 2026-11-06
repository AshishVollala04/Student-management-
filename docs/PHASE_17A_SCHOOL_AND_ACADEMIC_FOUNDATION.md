# FUTURESCHOOL PHASE 17A: SCHOOL AND ACADEMIC FOUNDATION BUSINESS MODULE

## 1. Executive Summary

Phase 17A delivers the production backend for the **School and Academic Foundation Business Module** of the FutureSchool Multi-School SaaS platform.

It implements complete tenant-isolated, role-and-permission-gated domain services, JPA entities, Flyway migrations, REST controllers, and automated tests for:
1. **School Context**: Authenticated school read model returning safe branding, timezone, supported languages, current active academic year, and enabled feature flags.
2. **Academic Years**: Full lifecycle management (`DRAFT` → `READY` → `ACTIVE` → `CLOSED`), strict date interval validation, tenant-aware code uniqueness, read summary, readiness evaluation, and one-active-year-per-school enforcement.
3. **School Classes**: Class configuration with normal capacity, maximum capacity (`normal_capacity <= max_capacity`), display order, status, and optimistic locking (`@Version`).
4. **Sections**: Class-scoped sections with capacity validation, lifecycle status, and duplicate section name prevention within classes.
5. **Subjects**: Tenant-scoped subjects with subject codes, names, departments, types (`CORE`, `ELECTIVE`, `VOCATIONAL`, `ACTIVITY`), weekly period requirements, and duplicate code prevention.
6. **Class-Subject Configuration**: Mapping between Academic Year, Class, and Subject with requirement flags, weekly period overrides, and assessment enablement.
7. **School Calendar Foundation**: Multi-version school calendar (`DRAFT` → `PUBLISHED` → `ARCHIVED`) and daily calendar entries (`WORKING_DAY`, `HOLIDAY`, `VACATION`, `SPECIAL_WORKING_DAY`, `EXAM_DAY`, `PTM_EVENT`) with academic year date bounds checking and duplicate date conflict prevention.

---

## 2. Database Schema (`V3__phase17a_academic_foundation.sql`)

The following relational structures were created/enhanced in Flyway migration `V3`:
- `school_classes`: Added `normal_capacity`, `max_capacity`, `display_order`, `status`, `version`.
- `sections`: Added `normal_capacity`, `status`, `version`.
- `subjects`: Added `subject_type`, `status`, `weekly_period_requirement`, `version`.
- `class_subject_configurations`:
  - `config_id` (UUID PK)
  - `school_id` (FK -> schools)
  - `academic_year_id` (FK -> academic_years)
  - `class_id` (FK -> school_classes)
  - `subject_id` (FK -> subjects)
  - `is_required` (BOOLEAN)
  - `weekly_periods_override` (INT)
  - `is_assessment_enabled` (BOOLEAN)
  - `version` (BIGINT)
  - Unique constraint: `(academic_year_id, class_id, subject_id)`
- `school_calendars`:
  - `calendar_id` (UUID PK)
  - `school_id` (FK -> schools)
  - `academic_year_id` (FK -> academic_years)
  - `name` (VARCHAR)
  - `version` (INT)
  - `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
  - Unique constraint: `(school_id, academic_year_id, version)`
- `school_calendar_entries`:
  - `entry_id` (UUID PK)
  - `calendar_id` (FK -> school_calendars)
  - `school_id` (FK -> schools)
  - `entry_date` (DATE)
  - `day_type` (`WORKING_DAY`, `HOLIDAY`, `VACATION`, etc.)
  - `description` (VARCHAR)
  - `is_instructional` (BOOLEAN)
  - Unique constraint: `(calendar_id, entry_date)`

---

## 3. Endpoints Implemented

| Method | Path | Required Permission | Description |
|---|---|---|---|
| `GET` | `/api/v1/school/context` | Authenticated School User | Retrieves safe school context & current academic year |
| `POST` | `/api/v1/academic/years` | `PERM_ACADEMIC_OPERATIONS` | Creates an Academic Year in `DRAFT` status |
| `PUT` | `/api/v1/academic/years/{yearId}` | `PERM_ACADEMIC_OPERATIONS` | Updates an Academic Year draft (blocked on `CLOSED`) |
| `POST` | `/api/v1/academic/years/{yearId}/activate` | `PERM_ACADEMIC_OPERATIONS` | Activates an Academic Year (enforces max 1 active) |
| `GET` | `/api/v1/academic/years` | Authenticated School User | Lists Academic Years ordered by start date |
| `GET` | `/api/v1/academic/years/{yearId}` | Authenticated School User | Gets details of a specific Academic Year |
| `GET` | `/api/v1/academic/years/{yearId}/readiness` | `PERM_ACADEMIC_OPERATIONS` | Computes readiness summary for activation |
| `POST` | `/api/v1/academic/classes` | `PERM_ACADEMIC_OPERATIONS` | Creates a Class (capacity validation) |
| `PUT` | `/api/v1/academic/classes/{classId}` | `PERM_ACADEMIC_OPERATIONS` | Updates Class configuration |
| `GET` | `/api/v1/academic/classes` | Authenticated School User | Lists Classes ordered by display order and grade |
| `GET` | `/api/v1/academic/classes/{classId}` | Authenticated School User | Gets Class details |
| `POST` | `/api/v1/academic/sections` | `PERM_ACADEMIC_OPERATIONS` | Creates a Section under a Class |
| `PUT` | `/api/v1/academic/sections/{sectionId}` | `PERM_ACADEMIC_OPERATIONS` | Updates Section configuration |
| `GET` | `/api/v1/academic/classes/{classId}/sections` | Authenticated School User | Lists Sections belonging to a Class |
| `GET` | `/api/v1/academic/sections/{sectionId}` | Authenticated School User | Gets Section details |
| `POST` | `/api/v1/academic/subjects` | `PERM_ACADEMIC_OPERATIONS` | Creates a Subject |
| `PUT` | `/api/v1/academic/subjects/{subjectId}` | `PERM_ACADEMIC_OPERATIONS` | Updates Subject configuration |
| `GET` | `/api/v1/academic/subjects` | Authenticated School User | Lists Subjects for school |
| `GET` | `/api/v1/academic/subjects/{subjectId}` | Authenticated School User | Gets Subject details |
| `POST` | `/api/v1/academic/class-subjects` | `PERM_ACADEMIC_OPERATIONS` | Configures Subject for Academic Year & Class |
| `PUT` | `/api/v1/academic/class-subjects/{configId}` | `PERM_ACADEMIC_OPERATIONS` | Updates Class-Subject configuration |
| `GET` | `/api/v1/academic/years/{yearId}/classes/{classId}/subjects` | Authenticated School User | Lists configured Subjects for a Class |
| `POST` | `/api/v1/academic/calendars` | `PERM_ACADEMIC_OPERATIONS` | Creates a School Calendar draft |
| `POST` | `/api/v1/academic/calendars/{calendarId}/entries` | `PERM_ACADEMIC_OPERATIONS` | Adds a Calendar day entry (checks bounds & conflict) |
| `POST` | `/api/v1/academic/calendars/{calendarId}/publish` | `PERM_ACADEMIC_OPERATIONS` | Publishes a School Calendar |
| `GET` | `/api/v1/academic/calendars/{calendarId}` | Authenticated School User | Retrieves School Calendar and entries |

---

## 4. Automated Verification Results

All 47 tests passed with zero failures and zero errors:

```text
[INFO] Results:
[INFO] 
[INFO] Tests run: 47, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### Phase 17A Test Cases in `AcademicFoundationTest`:
1. `testGetSchoolContext`: Safe branding and current academic year returned for authenticated user.
2. `testAcademicAdminCreatesClass`: School A Academic Admin creates Class -> `ALLOW` (200).
3. `testCrossTenantClassReadDenied`: School B Admin reads School A Class -> `DENY` (404/Not Found in tenant).
4. `testTeacherListsClassesAndSubjects`: Teacher reads current classes and subjects -> `ALLOW`.
5. `testTeacherCannotCreateClass`: Teacher attempts to create class -> `DENY` (403 Forbidden).
6. `testFinanceAdminCannotCreateSubject`: Finance-only Admin attempts to create subject -> `DENY` (403 Forbidden).
7. `testDuplicateSectionConflict`: Duplicate section name in same class -> `CONFLICT` (409).
8. `testCapacityValidationFailure`: `normal_capacity > max_capacity` -> `VALIDATION FAILURE` (422).
9. `testClosedAcademicYearEditBlocked`: Edit on `CLOSED` academic year -> `CONFLICT` (409).
10. `testTwoActiveAcademicYearsBlocked`: Activating second academic year when one is already active -> `BLOCKED` (409).
11. `testCalendarConflict`: Duplicate calendar date in same calendar -> `CONFLICT` (409).
12. `testAuditEventCreated`: Material change generates cryptographic chained audit event -> `PASS`.
