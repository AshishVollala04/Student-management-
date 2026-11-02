import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { ActionCard } from '../../components/common/CommonUi';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CalendarCheck,
  BookOpen,
  Award,
  CheckSquare,
  FileCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow] = useWorkflow();
  const navigate = useNavigate();

  const myHallTicket = workflow.hallTickets.find(h => h.studentId === currentUser?.id);
  const myPendingLeave = workflow.leaveRequests.find(l => l.studentId === currentUser?.id && l.status === 'PENDING');
  const myMarks = workflow.marksEntries.find(m => m.classId === 'Grade 10-A');
  const publishedMarksAvailable = myMarks?.isPublishedToStudents;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${currentUser?.name}`}
        subtitle="Grade 10 · Section A | Academic Year 2026-2027"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => navigate('/student/timetable')}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Schedule</span>
          </button>
        }
      />

      {/* Action Required Banner (if any) */}
      {myPendingLeave && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 dark:bg-amber-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Leave Sanction in Progress
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {myPendingLeave.leaveType} ({myPendingLeave.startDate} to {myPendingLeave.endDate}) awaiting mentor review.
              </div>
            </div>
          </div>
          <StatusBadge status="PENDING" />
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Attendance Rate"
          value="94.2%"
          subtext="Satisfies 75% threshold"
          trend={{ value: '+1.4%', isPositive: true }}
          icon={<CalendarCheck className="w-5 h-5" />}
          accentColor="teal"
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard
          label="Pending Homework"
          value="2 Tasks"
          subtext="Math & Physics due soon"
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="orange"
          onClick={() => navigate('/student/homework')}
        />
        <StatCard
          label="Published Result"
          value={publishedMarksAvailable ? '92.4% (A1)' : 'Pending'}
          subtext={publishedMarksAvailable ? 'Term 1 Confirmed' : 'Results not yet published'}
          icon={<Award className="w-5 h-5" />}
          accentColor="emerald"
          onClick={() => navigate('/student/academics')}
        />
        <StatCard
          label="Exam Hall Ticket"
          value={myHallTicket?.classTeacherReleased ? 'Released' : 'Locked'}
          subtext={myHallTicket?.classTeacherReleased ? 'Cleared for entry' : 'Requires mentor release'}
          icon={<FileCheck className="w-5 h-5" />}
          accentColor={myHallTicket?.classTeacherReleased ? 'teal' : 'rose'}
          onClick={() => navigate('/student/hall-ticket')}
        />
      </div>

      {/* Main Grid: Today's Schedule & Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Schedule (Monday)
                </h3>
              </div>
              <button
                onClick={() => navigate('/student/timetable')}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
              >
                Full Week →
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    Period 1 · 08:00 - 08:45 AM
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    Advanced Mathematics: Calculus & Quadratic Systems
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Instructor: Mrs. Sarah Jenkins · Room 304
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100">
                  Current
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Period 2 · 08:50 - 09:35 AM
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    Physics: Wave Optics & Snell's Law
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Instructor: Dr. Michael Chen · Physics Lab 2
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Up Next</span>
              </div>
            </div>
          </div>

          {/* Quick Learning Actions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Learning Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ActionCard
                title="Homework Submissions"
                description="Upload assignments or check review feedback"
                icon={<BookOpen className="w-5 h-5" />}
                badge="2 Due"
                accentColor="orange"
                onClick={() => navigate('/student/homework')}
              />
              <ActionCard
                title="Quiz Self-Assessment"
                description="Practice multiple choice drills with immediate scoring"
                icon={<CheckSquare className="w-5 h-5" />}
                accentColor="teal"
                onClick={() => navigate('/student/quiz')}
              />
              <ActionCard
                title="Study Materials"
                description="Download teacher-provided slides, notes & question papers"
                icon={<FileCheck className="w-5 h-5" />}
                accentColor="emerald"
                onClick={() => navigate('/student/materials')}
              />
              <ActionCard
                title="AI Study Tutor (Mock)"
                description="Grounded explanation assistant citing approved textbooks"
                icon={<Sparkles className="w-5 h-5" />}
                badge="Safe Mock"
                accentColor="teal"
                onClick={() => navigate('/student/ai-tutor')}
              />
            </div>
          </div>
        </div>

        {/* Right Col: Academic Status & Hall Ticket Spotlight */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Examination Clearance Status
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Mid-Year Comprehensive Examination 2026
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Attendance Minimum:</span>
                <span className="font-bold text-emerald-600">✓ Satisfied (94.2%)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Finance Dues Cleared:</span>
                <span className={workflow.fees.hallTicketCleared ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                  {workflow.fees.hallTicketCleared ? '✓ Cleared' : '✗ $1,200 Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Class Mentor Release:</span>
                <span className={myHallTicket?.classTeacherReleased ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'}>
                  {myHallTicket?.classTeacherReleased ? '✓ Released' : 'Awaiting Approval'}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/student/hall-ticket')}
              className="w-full mt-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Inspect Hall Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Notice to Students:</span>
            According to school policy, fee settlement & payment controls are managed exclusively through the <strong>Parent Portal</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
