import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { ActionCard } from '../../components/common/CommonUi';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  CheckSquare,
  BookOpen,
  CalendarCheck,
  AlertTriangle,
  Clock,
  Award,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow, store] = useWorkflow();
  const navigate = useNavigate();

  const pendingLeaves = workflow.leaveRequests.filter(l => l.status === 'PENDING');
  const marks10A = workflow.marksEntries.find(m => m.classId === 'Grade 10-A');
  const isMarksSubmitted = marks10A?.status === 'PENDING';
  const isMarksReturned = marks10A?.status === 'RETURNED';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Faculty Portal: ${currentUser?.name}`}
        subtitle="Department Head of Mathematics · Class Mentor: Grade 10-A (42 Students)"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => navigate('/teacher/attendance')}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Morning Roll Call</span>
          </button>
        }
      />

      {/* 1. Severity-Based Action Required Center */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Class Mentor Actions Required</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Pending Leave Requests */}
          {pendingLeaves.length > 0 ? (
            <div
              onClick={() => navigate('/teacher/leave-requests')}
              className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 cursor-pointer hover:border-amber-400 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                <span>{pendingLeaves.length} Student Leave Application Pending</span>
                <StatusBadge status="PENDING" />
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                Candidate: {pendingLeaves[0].studentName} ({pendingLeaves[0].leaveType}) awaiting sanction.
              </p>
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-200 mt-2 inline-flex items-center gap-1">
                Sanction Leave Request →
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All student leave applications reviewed and up to date.</span>
            </div>
          )}

          {/* Marks Entry Submission or Returned Alert */}
          {isMarksReturned ? (
            <div
              onClick={() => navigate('/teacher/marks')}
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 cursor-pointer hover:border-rose-400 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-rose-900 dark:text-rose-200">
                <span>Marks Sheet Returned by Principal</span>
                <StatusBadge status="RETURNED" />
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">
                Reason: "{marks10A?.returnReason || 'Verify practical scores for absent students.'}"
              </p>
              <span className="text-[11px] font-bold text-rose-800 dark:text-rose-200 mt-2 inline-flex items-center gap-1">
                Correct & Resubmit Marks →
              </span>
            </div>
          ) : (
            <div
              onClick={() => navigate('/teacher/marks')}
              className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 cursor-pointer hover:border-teal-400 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-teal-900 dark:text-teal-200">
                <span>Grade 10-A Mathematics Marksheet</span>
                <StatusBadge status={marks10A?.status || 'DRAFT'} />
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-300 mt-1">
                {isMarksSubmitted ? 'Under Principal verification review.' : 'Draft ready for submission to examination controller.'}
              </p>
              <span className="text-[11px] font-bold text-teal-800 dark:text-teal-200 mt-2 inline-flex items-center gap-1">
                Open Marks Web Grid →
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. My Teaching vs Class Mentor KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="My Teaching Allocation"
          value="3 Sections"
          subtext="10-A, 10-B, 11-A Calculus"
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="teal"
          onClick={() => navigate('/teacher/classes')}
        />
        <StatCard
          label="10-A Morning Attendance"
          value="95.2%"
          subtext="40 / 42 Present Today"
          icon={<CalendarCheck className="w-5 h-5" />}
          accentColor="emerald"
          onClick={() => navigate('/teacher/attendance')}
        />
        <StatCard
          label="Hall Tickets Released"
          value={workflow.hallTickets.filter(h => h.classTeacherReleased).length > 0 ? 'Released' : 'Pending'}
          subtext="Cleared candidates unlocked"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="teal"
          onClick={() => navigate('/teacher/hall-tickets')}
        />
        <StatCard
          label="Report Card Preparation"
          value={workflow.reportCards[0]?.isPublished ? 'Published' : 'Drafting'}
          subtext="Term 1 Semester Compilation"
          icon={<Award className="w-5 h-5" />}
          accentColor="orange"
          onClick={() => navigate('/teacher/report-cards')}
        />
      </div>

      {/* 3. Two Core Pillars: My Teaching & Class Mentor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Subject Teacher Workflows */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Subject Teacher Workflows
          </h3>
          <div className="space-y-2.5">
            <ActionCard
              title="Formal Marks Web Grid"
              description="Draft, validate, input absent (AB) marks, Excel import, and submit"
              icon={<CheckSquare className="w-5 h-5" />}
              badge={marks10A?.status}
              accentColor="teal"
              onClick={() => navigate('/teacher/marks')}
            />
            <ActionCard
              title="Homework Assignment Manager"
              description="Create, publish, and review student file submissions"
              icon={<BookOpen className="w-5 h-5" />}
              accentColor="orange"
              onClick={() => navigate('/teacher/homework')}
            />
            <ActionCard
              title="Quiz & Question Bank Builder"
              description="Construct MCQ diagnostic assessments with instant answer key"
              icon={<Award className="w-5 h-5" />}
              accentColor="teal"
              onClick={() => navigate('/teacher/quiz-builder')}
            />
          </div>
        </div>

        {/* Right Column: Class Mentor 10-A Responsibility */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Class Mentor Responsibility (Grade 10-A)
          </h3>
          <div className="space-y-2.5">
            <ActionCard
              title="Attendance Roll Call (AM/PM)"
              description="Record morning & afternoon presence, mark all present, note delays"
              icon={<CalendarCheck className="w-5 h-5" />}
              accentColor="emerald"
              onClick={() => navigate('/teacher/attendance')}
            />
            <ActionCard
              title="Parent Leave Applications"
              description="Review and sanction medical/casual leave with conflict awareness"
              icon={<Clock className="w-5 h-5" />}
              badge={`${pendingLeaves.length} Pending`}
              accentColor="orange"
              onClick={() => navigate('/teacher/leave-requests')}
            />
            <ActionCard
              title="Report Card Compilation & Publication"
              description="Prepare remarks, review Principal approval, and publish results to class"
              icon={<Award className="w-5 h-5" />}
              badge={workflow.reportCards[0]?.isPublished ? 'Published' : 'In Prep'}
              accentColor="teal"
              onClick={() => navigate('/teacher/report-cards')}
            />
            <ActionCard
              title="Hall Ticket Release"
              description="Release exam credentials for eligible candidates with fee clearance"
              icon={<ShieldCheck className="w-5 h-5" />}
              accentColor="teal"
              onClick={() => navigate('/teacher/hall-tickets')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
