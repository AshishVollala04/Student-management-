import React, { useState } from 'react';
import { AttendanceDay } from '../../types';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertTriangle, Send, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface AttendanceScreenProps {
  days: AttendanceDay[];
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  onSubmitLeave: (req: { fromDate: string; toDate: string; reason: string; type: string }) => Promise<void>;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({
  days,
  summary,
  onSubmitLeave
}) => {
  const [selectedDay, setSelectedDay] = useState<AttendanceDay>(days[days.length - 2] || days[0]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Medical Leave',
    fromDate: '2026-11-04',
    toDate: '2026-11-05',
    reason: ''
  });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSuccessMsg, setLeaveSuccessMsg] = useState<string | null>(null);

  // Month navigation demo
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason.trim()) return;
    setLeaveSubmitting(true);
    await onSubmitLeave(leaveForm);
    setLeaveSubmitting(false);
    setLeaveSuccessMsg('Leave request submitted to mentor Mrs. Sarah Jenkins.');
    setTimeout(() => {
      setLeaveSuccessMsg(null);
      setShowLeaveModal(false);
      setLeaveForm({ type: 'Medical Leave', fromDate: '2026-11-04', toDate: '2026-11-05', reason: '' });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500 text-white dark:bg-emerald-600';
      case 'absent':
        return 'bg-rose-500 text-white dark:bg-rose-600';
      case 'late':
        return 'bg-amber-500 text-white dark:bg-amber-600';
      case 'holiday':
      default:
        return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Overall Attendance Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Attendance Rate
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {summary.percentage}%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
            Satisfies CBSE Criteria (75%)
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Days Present
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {summary.present}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Out of {summary.total} working days
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Late Arrivals
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1 tabular-nums">
            {summary.late}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Avg check-in 08:11 AM
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Absences
            </span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-500 mt-1 tabular-nums">
            {summary.absent}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            1 sanctioned leave
          </span>
        </div>
      </div>

      {/* 2. Calendar Header & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Attendance Register
              </h2>
              <p className="text-xs text-slate-500">
                Tap any calendar date to inspect arrival telemetry & remarks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Month Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs font-semibold">
              <button
                onClick={() => setCurrentMonth(currentMonth.includes('Oct') ? 'September 2026' : 'October 2026')}
                className="p-1 hover:text-indigo-600 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 min-w-[110px] text-center text-slate-700 dark:text-slate-200">
                {currentMonth}
              </span>
              <button
                onClick={() => setCurrentMonth(currentMonth.includes('Oct') ? 'November 2026' : 'October 2026')}
                className="p-1 hover:text-indigo-600 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Apply Leave</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 py-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>Holiday / Weekend</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-2">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map((d) => {
              const isSelected = selectedDay.date === d.date;
              return (
                <button
                  key={d.date}
                  onClick={() => setSelectedDay(d)}
                  className={`relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 shadow-md scale-105 z-10'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-xs sm:text-sm font-bold ${
                    isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {d.dayNumber}
                  </span>

                  <span
                    className={`mt-1 w-2.5 h-2.5 rounded-full ${getStatusColor(d.status)}`}
                    title={d.status}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Telemetry Inspector */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${getStatusColor(selectedDay.status)}`}>
                {selectedDay.status}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedDay.date}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDay.remark || 'Standard academic session'}
                </p>
              </div>
            </div>

            {selectedDay.checkInTime && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>RFiD Gate Check-in: <strong className="text-slate-900 dark:text-white font-mono">{selectedDay.checkInTime}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            {leaveSuccessMsg ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Dispatched</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{leaveSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Submit Student Leave Request
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Requires guardian authorization and mentor sign-off.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Leave Category
                  </label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Medical Leave">Medical Leave (Doctor prescription required)</option>
                    <option value="Casual Family Leave">Casual Family Leave</option>
                    <option value="Academic Olympiad / Competition">Academic Olympiad / Competition</option>
                    <option value="Bereavement Leave">Bereavement Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={leaveForm.fromDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={leaveForm.toDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reason & Explanation
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    placeholder="Provide specific medical reason or circumstances..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={leaveSubmitting}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {leaveSubmitting ? 'Submitting...' : 'Send to Principal'}
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
