import React, { useState } from 'react';
import { StudentProfile, UserSession, ScreenType } from '../../types';
import { SIBLING_STUDENT, PRIMARY_STUDENT } from '../../data/mockData';
import { Users, GraduationCap, Calendar, Clock, CreditCard, ChevronRight, MessageSquare, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';

interface ParentViewProps {
  currentUser: UserSession;
  onNavigate: (screen: ScreenType) => void;
  onSelectStudent: (student: StudentProfile) => void;
  selectedStudent: StudentProfile;
}

export const ParentView: React.FC<ParentViewProps> = ({
  currentUser,
  onNavigate,
  onSelectStudent,
  selectedStudent
}) => {
  const [messageTeacherModal, setMessageTeacherModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [teacherMsg, setTeacherMsg] = useState('');

  const children = [PRIMARY_STUDENT, SIBLING_STUDENT];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherMsg.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageTeacherModal(false);
      setTeacherMsg('');
    }, 2000);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Parent Welcome Banner */}
      <div className="bg-gradient-to-br from-sky-700 via-indigo-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl ring-2 ring-white/30 object-cover bg-white/10"
            />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                Guardian & Parent Portal
              </div>
              <h1 className="text-xl font-bold text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs text-sky-200 mt-0.5">
                Monitoring 2 Enrolled Wards at FutureSchool Academy
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessageTeacherModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-sky-300" />
            <span>Message Class Mentor</span>
          </button>
        </div>
      </div>

      {/* Child Switcher Selector */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
          Select Child to Monitor
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {children.map((child) => {
            const isSelected = selectedStudent.id === child.id;
            return (
              <div
                key={child.id}
                onClick={() => onSelectStudent(child)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {child.name}
                        </h3>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {child.grade} · Section {child.section} (Roll #{child.rollNo})
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {child.attendancePercentage}% Attendance
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">
                          {child.house}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Child Status Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Today's Campus Safety & Attendance Status for {selectedStudent.name}
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
            Present on Campus
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Campus Entry Check-in:</span>
            <div className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">
              Today at 07:48 AM (Gate 2 - Main Hallway Scanner)
            </div>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Attendance Logs →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div
            onClick={() => onNavigate('homework')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
              Homework Status
            </span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              3 Tasks Pending
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Math, Physics, English</span>
          </div>

          <div
            onClick={() => onNavigate('exams')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
              Recent Exam Marks
            </span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              92.4% (Grade A1)
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Term 1 Comprehensive Exam</span>
          </div>

          <div
            onClick={() => onNavigate('fees')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block">
              School Dues
            </span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              $1,200 Pending
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Due Nov 15th · Pay Online</span>
          </div>
        </div>
      </div>

      {/* Message Teacher Modal */}
      {messageTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            {messageSent ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Note Transmitted</h3>
                <p className="text-xs text-slate-500">
                  Your message has been delivered to mentor Mrs. Sarah Jenkins. She usually responds within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Direct Message to Class Mentor
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Regarding student: <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.name}</strong> ({selectedStudent.grade}-{selectedStudent.section})
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mentor Recipient
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Mrs. Sarah Jenkins (Head of Mathematics · Class 10-A Mentor)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Message / Question
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={teacherMsg}
                    onChange={(e) => setTeacherMsg(e.target.value)}
                    placeholder="Inquire about homework submissions, exam preparation, or schedule a parent-teacher discussion..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMessageTeacherModal(false)}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                  >
                    Send to Teacher
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
