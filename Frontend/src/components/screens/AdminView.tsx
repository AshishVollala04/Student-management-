import React, { useState } from 'react';
import { UserSession, ScreenType, NoticeItem } from '../../types';
import { SCHOOL_ADMIN_STATS } from '../../data/mockData';
import { ShieldCheck, Users, TrendingUp, CreditCard, Bell, Plus, CheckCircle2, Building, Award, Search } from 'lucide-react';

interface AdminViewProps {
  currentUser: UserSession;
  onNavigate: (screen: ScreenType) => void;
  onBroadcastNotice: (notice: Omit<NoticeItem, 'id' | 'date' | 'read'>) => Promise<void>;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  onNavigate,
  onBroadcastNotice
}) => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'announcement' | 'exam' | 'holiday' | 'urgent'>('announcement');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'high'>('normal');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastToast, setBroadcastToast] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    setIsBroadcasting(true);
    await onBroadcastNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      priority: noticePriority,
      author: 'Principal Vance',
      authorRole: 'Administration'
    });
    setIsBroadcasting(false);
    setShowBroadcastModal(false);
    setBroadcastToast(true);
    setNoticeTitle('');
    setNoticeContent('');
    setTimeout(() => setBroadcastToast(false), 3000);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Toast */}
      {broadcastToast && (
        <div className="p-3.5 rounded-xl bg-purple-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Official circular broadcasted to 614 students, parents, and faculty!</span>
        </div>
      )}

      {/* Admin Hero Card */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl ring-2 ring-white/30 object-cover bg-white/10"
            />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                School Principal & Governance
              </div>
              <h1 className="text-xl font-bold text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs text-purple-200 mt-0.5">
                FutureSchool Academy · 614 Students · 38 Faculty · 24 Classrooms
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Circular</span>
          </button>
        </div>
      </div>

      {/* 4 Core School Governance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Enrollment</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {SCHOOL_ADMIN_STATS.totalStudents}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Grades 6 to 12
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Campus Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {SCHOOL_ADMIN_STATS.attendanceRate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            {SCHOOL_ADMIN_STATS.presentToday} Present Today
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Teaching Staff</span>
            <Building className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 tabular-nums">
            {SCHOOL_ADMIN_STATS.totalTeachers}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            1:16 Faculty Ratio
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Fees Realization</span>
            <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            {SCHOOL_ADMIN_STATS.collectionRate}%
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            $2.62M of $2.94M
          </span>
        </div>
      </div>

      {/* Grade-by-Grade Student Census & Attendance Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Campus Grade Roster Census (600 Students Scale)
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {SCHOOL_ADMIN_STATS.studentDistribution.map((dist) => (
            <div key={dist.grade} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-white w-20">
                  {dist.grade}
                </span>
                <span className="text-slate-500">
                  {dist.count} Enrolled Wards
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-28 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${dist.attendance}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {dist.attendance}% Attendance
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Circular Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Publish Principal Circular
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Broadcasts immediately across student portals, parent app & faculty notices.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Annual Sports Day 2026 Schedule & Guidelines"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="exam">Exam Notification</option>
                    <option value="holiday">Holiday Notice</option>
                    <option value="urgent">Important Circular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High (Banner Ticker)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Announcement Text
                </label>
                <textarea
                  rows={4}
                  required
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Detail the schedule, venue, target grades, dress code, and instructions..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
                >
                  {isBroadcasting ? 'Broadcasting...' : 'Publish to School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
