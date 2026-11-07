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
  MapPin,
  CreditCard,
  Bell,
  User,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { STUDENT_NOTICES, STUDENT_PROFILE } from '../../mock/academicData';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow] = useWorkflow();
  const navigate = useNavigate();

  const myHallTicket = workflow.hallTickets.find(h => h.studentId === currentUser?.id);
  const myPendingLeave = workflow.leaveRequests.find(l => l.studentId === currentUser?.id && l.status === 'PENDING');
  const fees = workflow.fees;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${currentUser?.name || STUDENT_PROFILE.name}`}
        subtitle={`Grade ${(currentUser as any)?.grade || STUDENT_PROFILE.grade} · Section ${(currentUser as any)?.section || STUDENT_PROFILE.section} | Roll #${(currentUser as any)?.rollNumber || STUDENT_PROFILE.rollNumber} | Academic Year 2026-2027`}
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => navigate('/student/timetable')}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Schedule</span>
          </button>
        }
      />

      {/* Action Required Banner (if any pending fee or leave) */}
      {fees.pendingAmount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Outstanding Term Fee Balance (${fees.pendingAmount})
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Term 2 tuition instalment is pending payment. Pay to unlock your examination hall ticket.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/student/fees')}
            className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Settle Fees
          </button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Attendance Rate"
          value="94.2%"
          subtext="Above 75% State Board criteria"
          trend={{ value: '+1.4%', isPositive: true }}
          icon={<CalendarCheck className="w-5 h-5" />}
          accentColor="teal"
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard
          label="Pending Tasks"
          value="2 Assignments"
          subtext="Math & Physics due this week"
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="orange"
          onClick={() => navigate('/student/homework')}
        />
        <StatCard
          label="Term 1 Result"
          value="91.2% (A1)"
          subtext="Rank #3 in Grade 10-A"
          trend={{ value: '+2.7%', isPositive: true }}
          icon={<Award className="w-5 h-5" />}
          accentColor="emerald"
          onClick={() => navigate('/student/academics')}
        />
        <StatCard
          label="Exam Hall Ticket"
          value={myHallTicket?.classTeacherReleased ? 'Released' : fees.pendingAmount > 0 ? 'Fee Blocked' : 'Pending Mentor'}
          subtext={myHallTicket?.classTeacherReleased ? 'Admit Card Cleared' : 'Action Required'}
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
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Full Week Timetable →
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    Period 1 · 08:30 - 09:20 AM
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    Advanced Mathematics: Quadratic Equations & Parabolas
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Instructor: Mrs. Sarah Jenkins · Room 304
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100">
                  Current Session
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Period 2 · 09:25 - 10:15 AM
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

          {/* Quick Learning Shortcuts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Essential Student Portals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ActionCard
                title="Homework Submissions"
                description="Upload assignments or check graded feedback"
                icon={<BookOpen className="w-5 h-5" />}
                badge="2 Due"
                accentColor="orange"
                onClick={() => navigate('/student/homework')}
              />
              <ActionCard
                title="Fee Statement & Pay"
                description="View instalment breakdown and digital receipts"
                icon={<CreditCard className="w-5 h-5" />}
                badge={fees.pendingAmount > 0 ? `$${fees.pendingAmount} Due` : 'Paid'}
                accentColor={fees.pendingAmount > 0 ? 'rose' : 'emerald'}
                onClick={() => navigate('/student/fees')}
              />
              <ActionCard
                title="Examination Marksheet"
                description="Subject marks, grades, and official report card"
                icon={<Award className="w-5 h-5" />}
                badge="Term 1 (91.2%)"
                accentColor="teal"
                onClick={() => navigate('/student/academics')}
              />
              <ActionCard
                title="Official Circulars"
                description="State Board board announcements & holiday schedules"
                icon={<Bell className="w-5 h-5" />}
                badge="4 Notices"
                accentColor="teal"
                onClick={() => navigate('/student/notices')}
              />
            </div>
          </div>
        </div>

        {/* Right Col: School Notices & Admit Card Snapshot */}
        <div className="space-y-4">
          
          {/* Recent Notices Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  School Announcements
                </h3>
              </div>
              <button
                onClick={() => navigate('/student/notices')}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
              >
                All →
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {STUDENT_NOTICES.slice(0, 3).map((notice) => (
                <div 
                  key={notice.id}
                  onClick={() => navigate('/student/notices')}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      {notice.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{notice.publishDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Examination Admit Card Snapshot */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Examination Clearance Status
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Term 1 Comprehensive Assessment 2026
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Attendance Minimum (75%):</span>
                <span className="font-bold text-emerald-600">✓ Satisfied (94.2%)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Finance Clearance:</span>
                <span className={fees.pendingAmount === 0 ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                  {fees.pendingAmount === 0 ? '✓ Cleared' : `✗ $${fees.pendingAmount} Pending`}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Admit Card:</span>
                <span className={myHallTicket?.classTeacherReleased ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'}>
                  {myHallTicket?.classTeacherReleased ? '✓ Released' : 'Pending Clearance'}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/student/hall-ticket')}
              className="w-full mt-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Inspect Hall Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
