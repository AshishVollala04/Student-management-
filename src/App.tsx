/**
 * FutureSchool - Main Application Routing & Providers
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './modules/auth/LoginPage';

// Student Modules
import { StudentDashboard } from './modules/student/StudentDashboard';
import { StudentAcademics } from './modules/student/StudentAcademics';
import { StudentAttendance } from './modules/student/StudentAttendance';
import { StudentHomework } from './modules/student/StudentHomework';
import { StudentQuiz } from './modules/student/StudentQuiz';
import { StudentMaterials } from './modules/student/StudentMaterials';
import { StudentLibrary } from './modules/student/StudentLibrary';
import { StudentAiTutor } from './modules/student/StudentAiTutor';
import { StudentTimetable } from './modules/student/StudentTimetable';
import { StudentHallTicket } from './modules/student/StudentHallTicket';
import { StudentProgress } from './modules/student/StudentProgress';
import { StudentProfile } from './modules/student/StudentProfile';
import { StudentFees } from './modules/student/StudentFees';
import { StudentNotices } from './modules/student/StudentNotices';

// Parent Modules
import { ParentDashboard } from './modules/parent/ParentDashboard';
import { ParentChildOverview } from './modules/parent/ParentChildOverview';
import { ParentFees } from './modules/parent/ParentFees';
import { ParentLeave } from './modules/parent/ParentLeave';
import { ParentTransport } from './modules/parent/ParentTransport';
import { ParentComplaints } from './modules/parent/ParentComplaints';
import { ParentMessages, ParentMeetings, ParentPickup, ParentConsent } from './modules/parent/ParentOtherPages';

// Teacher Modules
import { TeacherDashboard } from './modules/teacher/TeacherDashboard';
import { TeacherMarksGrid } from './modules/teacher/TeacherMarksGrid';
import { TeacherAttendance } from './modules/teacher/TeacherAttendance';
import { TeacherLeaveRequests } from './modules/teacher/TeacherLeaveRequests';
import { TeacherReportCards, TeacherHallTickets } from './modules/teacher/TeacherReportCards';
import { TeacherClasses, TeacherHomework, TeacherQuizBuilder, TeacherLessonPlanner } from './modules/teacher/TeacherExtras';

// Principal Modules
import { PrincipalDashboard } from './modules/principal/PrincipalDashboard';
import { PrincipalApprovals } from './modules/principal/PrincipalApprovals';
import { PrincipalExamControl } from './modules/principal/PrincipalExamControl';
import { 
  PrincipalTeacherLeave, 
  PrincipalComplaints, 
  PrincipalDelegation, 
  PrincipalAiSummary 
} from './modules/principal/PrincipalOtherPages';
import { 
  PrincipalReportCards, 
  PrincipalReExams, 
  PrincipalFeeApprovals, 
  PrincipalCoverage 
} from './modules/principal/PrincipalDeskExtras';

// Admin Modules
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { AdminExecutionQueue, AdminTransport } from './modules/admin/AdminOperations';
import { AdminAdmissions, AdminAcademicStructure, AdminStaff } from './modules/admin/AdminAcademic';
import { AdminFees, AdminBilling } from './modules/admin/AdminFinance';
import { 
  AdminTimetableGenerator, 
  AdminStudents, 
  AdminPermissions, 
  AdminBulkImport, 
  AdminAudit 
} from './modules/admin/AdminSystem';

// Platform Admin Modules
import { PlatformDashboard } from './modules/platformAdmin/PlatformDashboard';
import { 
  PlatformTenantsDirectory, 
  PlatformVerificationQueue, 
  PlatformTenantOnboarding 
} from './modules/platformAdmin/PlatformTenants';
import { 
  PlatformSubscriptionPlans, 
  PlatformCapacityEntitlements 
} from './modules/platformAdmin/PlatformSubscriptions';
import { 
  PlatformSystemHealth, 
  PlatformSecurityAudit, 
  PlatformSupportCases 
} from './modules/platformAdmin/PlatformGovernance';

export default function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ========================================================= */}
          {/* 1. STUDENT ROUTES (Protected)                             */}
          {/* ========================================================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="academics" element={<StudentAcademics />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="homework" element={<StudentHomework />} />
            <Route path="quiz" element={<StudentQuiz />} />
            <Route path="materials" element={<StudentMaterials />} />
            <Route path="library" element={<StudentLibrary />} />
            <Route path="ai-tutor" element={<StudentAiTutor />} />
            <Route path="exams" element={<StudentAcademics />} />
            <Route path="results" element={<StudentAcademics />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="notices" element={<StudentNotices />} />
            <Route path="hall-ticket" element={<StudentHallTicket />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* ========================================================= */}
          {/* 2. PARENT ROUTES (Protected)                              */}
          {/* ========================================================= */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={['PARENT']}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/parent/dashboard" replace />} />
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="overview" element={<ParentChildOverview />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="academics" element={<StudentAcademics />} />
            <Route path="homework" element={<StudentHomework />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="exams" element={<StudentHallTicket />} />
            <Route path="fees" element={<ParentFees />} />
            <Route path="leave" element={<ParentLeave />} />
            <Route path="messages" element={<ParentMessages />} />
            <Route path="meetings" element={<ParentMeetings />} />
            <Route path="complaints" element={<ParentComplaints />} />
            <Route path="transport" element={<ParentTransport />} />
            <Route path="pickup" element={<ParentPickup />} />
            <Route path="consent" element={<ParentConsent />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* ========================================================= */}
          {/* 3. TEACHER ROUTES (Protected)                             */}
          {/* ========================================================= */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="homework" element={<TeacherHomework />} />
            <Route path="marks" element={<TeacherMarksGrid />} />
            <Route path="quiz-builder" element={<TeacherQuizBuilder />} />
            <Route path="materials" element={<StudentMaterials />} />
            <Route path="planner" element={<TeacherLessonPlanner />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="leave-requests" element={<TeacherLeaveRequests />} />
            <Route path="report-cards" element={<TeacherReportCards />} />
            <Route path="hall-tickets" element={<TeacherHallTickets />} />
            <Route path="messages" element={<ParentMessages />} />
          </Route>

          {/* ========================================================= */}
          {/* 4. PRINCIPAL ROUTES (Protected)                           */}
          {/* ========================================================= */}
          <Route
            path="/principal"
            element={
              <ProtectedRoute allowedRoles={['PRINCIPAL']}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/principal/dashboard" replace />} />
            <Route path="dashboard" element={<PrincipalDashboard />} />
            <Route path="approvals" element={<PrincipalApprovals />} />
            <Route path="report-cards" element={<PrincipalReportCards />} />
            <Route path="teacher-leave" element={<PrincipalTeacherLeave />} />
            <Route path="re-exams" element={<PrincipalReExams />} />
            <Route path="fee-approvals" element={<PrincipalFeeApprovals />} />
            <Route path="coverage" element={<PrincipalCoverage />} />
            <Route path="exam-control" element={<PrincipalExamControl />} />
            <Route path="complaints" element={<PrincipalComplaints />} />
            <Route path="delegation" element={<PrincipalDelegation />} />
            <Route path="ai-summary" element={<PrincipalAiSummary />} />
          </Route>

          {/* ========================================================= */}
          {/* 5. ADMIN ROUTES (Protected)                               */}
          {/* ========================================================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="execution-queue" element={<AdminExecutionQueue />} />
            <Route path="academic-structure" element={<AdminAcademicStructure />} />
            <Route path="admissions" element={<AdminAdmissions />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="transport" element={<AdminTransport />} />
            <Route path="timetable-generator" element={<AdminTimetableGenerator />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="permissions" element={<AdminPermissions />} />
            <Route path="bulk-import" element={<AdminBulkImport />} />
            <Route path="audit" element={<AdminAudit />} />
          </Route>

          {/* ========================================================= */}
          {/* 6. PLATFORM ADMIN ROUTES (Protected)                      */}
          {/* ========================================================= */}
          <Route
            path="/platform"
            element={
              <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/platform/dashboard" replace />} />
            <Route path="dashboard" element={<PlatformDashboard />} />
            <Route path="schools" element={<PlatformTenantsDirectory />} />
            <Route path="verification" element={<PlatformVerificationQueue />} />
            <Route path="onboarding" element={<PlatformTenantOnboarding />} />
            <Route path="plans" element={<PlatformSubscriptionPlans />} />
            <Route path="capacity" element={<PlatformCapacityEntitlements />} />
            <Route path="health" element={<PlatformSystemHealth />} />
            <Route path="audit" element={<PlatformSecurityAudit />} />
            <Route path="support" element={<PlatformSupportCases />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}
