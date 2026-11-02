import React, { useState } from 'react';
import { UserSession, ScreenType, HomeworkItem } from '../../types';
import { UserCheck, BookOpen, Clock, Plus, CheckCircle2, AlertTriangle, XCircle, Users, Check } from 'lucide-react';

interface TeacherViewProps {
  currentUser: UserSession;
  onNavigate: (screen: ScreenType) => void;
  onAddHomework: (hw: Omit<HomeworkItem, 'id' | 'status'>) => Promise<void>;
  initialRoster: { rollNo: number; name: string; status: 'present' | 'absent' | 'late'; avgScore: number }[];
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  currentUser,
  onNavigate,
  onAddHomework,
  initialRoster
}) => {
  const [roster, setRoster] = useState(initialRoster);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [hwForm, setHwForm] = useState({
    subject: 'Mathematics',
    title: '',
    description: '',
    dueDate: '05 Nov 2026',
    assignedDate: '01 Nov 2026',
    teacherName: 'Mrs. Sarah Jenkins'
  });
  const [isSubmittingHw, setIsSubmittingHw] = useState(false);
  const [hwToast, setHwToast] = useState(false);

  const toggleStudentStatus = (rollNo: number) => {
    setRoster(prev => prev.map(s => {
      if (s.rollNo === rollNo) {
        const next = s.status === 'present' ? 'late' : s.status === 'late' ? 'absent' : 'present';
        return { ...s, status: next };
      }
      return s;
    }));
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwForm.title.trim()) return;

    setIsSubmittingHw(true);
    await onAddHomework(hwForm);
    setIsSubmittingHw(false);
    setShowHomeworkModal(false);
    setHwToast(true);
    setHwForm({
      subject: 'Mathematics',
      title: '',
      description: '',
      dueDate: '05 Nov 2026',
      assignedDate: '01 Nov 2026',
      teacherName: 'Mrs. Sarah Jenkins'
    });
    setTimeout(() => setHwToast(false), 3000);
  };

  const presentCount = roster.filter(s => s.status === 'present').length;
  const lateCount = roster.filter(s => s.status === 'late').length;
  const absentCount = roster.filter(s => s.status === 'absent').length;

  return (
    <div className="space-y-5 pb-8">
      {/* Toast */}
      {hwToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>New homework assigned to Class 10-A and synced to student dashboards!</span>
        </div>
      )}

      {/* Teacher Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl ring-2 ring-white/30 object-cover bg-white/10"
            />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Faculty & Mentor Portal
              </div>
              <h1 className="text-xl font-bold text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs text-emerald-200 mt-0.5">
                Head of Mathematics · Class Mentor: Grade 10-A (42 Students)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHomeworkModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-emerald-50 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Homework</span>
          </button>
        </div>
      </div>

      {/* Attendance Roll Call for Class 10-A */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Class 10-A Attendance Register
            </h2>
            <p className="text-xs text-slate-500">
              Tap any status badge to cycle: Present → Late → Absent
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">Present: {presentCount}</span>
            <span className="text-amber-600 dark:text-amber-400">Late: {lateCount}</span>
            <span className="text-rose-600 dark:text-rose-400">Absent: {absentCount}</span>
          </div>
        </div>

        {/* Student list */}
        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {roster.map((s) => (
            <div key={s.rollNo} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center text-[11px]">
                  #{s.rollNo}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Avg Grade Score: {s.avgScore}%
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleStudentStatus(s.rollNo)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  s.status === 'present'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : s.status === 'late'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {s.status}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Homework Modal */}
      {showHomeworkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleCreateHomework} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Assign Homework to Class 10-A
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This will broadcast to all 42 enrolled students in Class 10-A.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={hwForm.subject}
                  onChange={(e) => setHwForm({ ...hwForm, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English Literature">English Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={hwForm.title}
                  onChange={(e) => setHwForm({ ...hwForm, title: e.target.value })}
                  placeholder="e.g. Coordinate Geometry & Distance Formula Problem Set"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value="2026-11-05"
                  onChange={(e) => setHwForm({ ...hwForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  value={hwForm.description}
                  onChange={(e) => setHwForm({ ...hwForm, description: e.target.value })}
                  placeholder="Enter questions to solve, textbook page numbers, or submission format guidelines..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHomeworkModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHw}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                >
                  {isSubmittingHw ? 'Publishing...' : 'Assign to Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
