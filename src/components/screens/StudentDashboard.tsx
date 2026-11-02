import React, { useState } from 'react';
import { StudentProfile, TimetablePeriod, HomeworkItem, ExamRecord, NoticeItem, ScreenType } from '../../types';
import {
  Calendar,
  Clock,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  ChevronRight,
  CheckCircle2,
  Circle,
  FileText,
  MapPin,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  timetable: TimetablePeriod[];
  pendingHomework: HomeworkItem[];
  recentExam: ExamRecord;
  notices: NoticeItem[];
  onNavigate: (screen: ScreenType) => void;
  onToggleHomework: (id: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  timetable,
  pendingHomework,
  recentExam,
  notices,
  onNavigate,
  onToggleHomework
}) => {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  // Filter periods excluding break for preview
  const classPeriods = timetable.filter(p => !p.isBreak);
  const currentPeriod = classPeriods[1] || classPeriods[0]; // representative active class

  const urgentNotice = notices.find(n => n.priority === 'high');

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Student Identity Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white p-5 sm:p-6 shadow-xl shadow-indigo-900/10">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 ring-2 ring-white/30 object-cover shadow-inner"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-[10px] font-bold text-white shadow-sm">
                Active
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {student.name}
                </h1>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5 font-medium">
                {student.grade} · Section {student.section} &nbsp;|&nbsp; Roll No: {student.rollNo}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-indigo-200/90">
                <span className="bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {student.admissionNo}
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {student.house}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Attendance Widget in Header */}
          <div 
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/10 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="text-white/20"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="text-emerald-400"
                  strokeWidth="4"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * student.attendancePercentage) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[11px] font-bold tabular-nums">
                {student.attendancePercentage}%
              </span>
            </div>
            <div className="pr-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-indigo-200">
                Overall Attendance
              </div>
              <div className="text-xs font-medium text-white flex items-center gap-1 mt-0.5">
                <span>View Attendance</span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Ambient subtle background geometry */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-indigo-500/10 pointer-events-none blur-xl" />
      </div>

      {/* 2. Urgent School Announcement Banner */}
      {urgentNotice && (
        <div 
          onClick={() => setSelectedNotice(urgentNotice)}
          className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 cursor-pointer hover:bg-amber-500/15 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1 rounded-lg bg-amber-500 text-white shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  School Announcement
                </span>
                <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
                  {urgentNotice.date}
                </span>
              </div>
              <p className="text-xs font-semibold truncate text-slate-900 dark:text-white mt-0.5">
                {urgentNotice.title}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 ml-2" />
        </div>
      )}

      {/* 3. Quick-Action Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Quick Actions
          </h2>
          <span className="text-[11px] text-slate-500">6 Core Modules</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigate('attendance')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
              Attendance
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium tabular-nums">94.2% Rate</span>
          </button>

          <button
            onClick={() => onNavigate('timetable')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
              Timetable
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Mon - Sat</span>
          </button>

          <button
            onClick={() => onNavigate('homework')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
              Homework
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              {pendingHomework.filter(h => h.status === 'pending').length} Pending
            </span>
          </button>

          <button
            onClick={() => onNavigate('exams')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
              Exams
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium tabular-nums">92.4% (A1)</span>
          </button>

          <button
            onClick={() => onNavigate('fees')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
              Fees
            </span>
            <span className="text-[10px] text-rose-500 font-semibold mt-0.5">$1,200 Due</span>
          </button>

          <button
            onClick={() => onNavigate('notices')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
              Notices
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">5 Circulars</span>
          </button>
        </div>
      </div>

      {/* 4. Split Section: Today's Timetable & Pending Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Timetable Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Today's Schedule
              </h2>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full Week</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current / Ongoing Period Highlight */}
          <div className="mb-3 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50">
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                Current Period {currentPeriod.period}
              </span>
              <span className="tabular-nums font-mono">
                {currentPeriod.startTime} – {currentPeriod.endTime}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentPeriod.subject}
              </h3>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentPeriod.room}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Instructor: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPeriod.teacher}</span>
            </p>
          </div>

          {/* Next 3 periods preview */}
          <div className="space-y-2">
            {classPeriods.slice(2, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center text-[11px]">
                    {p.period}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {p.subject}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      {p.teacher} · {p.room}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] font-medium text-slate-500 tabular-nums">
                  {p.startTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Homework Quick List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Pending Homework
              </h2>
            </div>
            <button
              onClick={() => onNavigate('homework')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({pendingHomework.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingHomework.slice(0, 3).map((item) => {
              const isCompleted = item.status === 'completed';
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleHomework(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          {item.subject}
                        </span>
                        <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                          Due: {item.dueDate}
                        </span>
                      </div>
                      <h3 className={`text-xs font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Recent Exam Performance Spotlight Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Exam Assessment
            </h2>
          </div>
          <button
            onClick={() => onNavigate('exams')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Detailed Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {recentExam.title}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              Overall Result: {recentExam.overallPercentage}%
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Grade: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{recentExam.overallGrade}</span> · Class Rank: <span className="font-bold text-indigo-600 dark:text-indigo-400">#{recentExam.rank}</span> of {recentExam.totalStudentsInClass}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('exams')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              View Report Card
            </button>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {selectedNotice.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {selectedNotice.date}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedNotice.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedNotice.content}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Issued by: <strong className="text-slate-800 dark:text-slate-200">{selectedNotice.author}</strong></span>
                <span>{selectedNotice.authorRole}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedNotice(null)}
              className="w-full mt-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
            >
              Close Announcement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
