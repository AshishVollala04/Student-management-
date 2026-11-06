import React, { useState } from 'react';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { STUDENT_ATTENDANCE_OCTOBER, AttendanceDayLog } from '../../mock/academicData';

export const StudentAttendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [selectedDayLog, setSelectedDayLog] = useState<AttendanceDayLog | null>(STUDENT_ATTENDANCE_OCTOBER[19]); // Oct 20 (Late)

  const daysInMonth = STUDENT_ATTENDANCE_OCTOBER;
  const presentDays = daysInMonth.filter(d => d.status === 'PRESENT').length;
  const lateDays = daysInMonth.filter(d => d.status === 'LATE').length;
  const absentDays = daysInMonth.filter(d => d.status === 'ABSENT').length;
  const workingDays = presentDays + lateDays + absentDays;
  const monthlyPercentage = workingDays > 0 ? (((presentDays + lateDays) / workingDays) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Register & Calendar"
        subtitle="RFID biometric check-in log & mandatory board threshold tracking"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Overall Cumulative"
          value="94.2%"
          subtext="Above 75% CBSE Board minimum"
          icon={<CalendarCheck className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          label="October Monthly Rate"
          value={`${monthlyPercentage}%`}
          subtext={`${presentDays + lateDays} attended of ${workingDays} sessions`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Late Check-Ins"
          value={`${lateDays} Days`}
          subtext="Logged after 08:00 AM bell"
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="orange"
        />
        <StatCard
          label="Sanctioned Leave"
          value={`${absentDays} Day`}
          subtext="Approved Medical Sanction"
          icon={<XCircle className="w-5 h-5" />}
          accentColor="rose"
        />
      </div>

      {/* Main Attendance Content: Calendar View + Day Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Calendar Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Attendance Calendar
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[100px] text-center">
                  {selectedMonth}
                </span>
                <button
                  type="button"
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-bold text-slate-400 uppercase">
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
            </div>

            {/* 31 Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {daysInMonth.map((item) => {
                const isSelected = selectedDayLog?.day === item.day;
                let bgStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400';
                let indicator = null;

                if (item.status === 'PRESENT') {
                  bgStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-bold';
                  indicator = <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mx-auto mt-1" />;
                } else if (item.status === 'LATE') {
                  bgStyle = 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 font-bold';
                  indicator = <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-auto mt-1" />;
                } else if (item.status === 'ABSENT') {
                  bgStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 font-bold';
                  indicator = <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mx-auto mt-1" />;
                } else if (item.status === 'HOLIDAY') {
                  bgStyle = 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300';
                }

                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => setSelectedDayLog(item)}
                    className={`h-14 sm:h-16 p-1.5 rounded-xl border flex flex-col justify-between transition-all text-left ${bgStyle} ${
                      isSelected ? 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-mono">{item.day}</span>
                      <span className="text-[9px] uppercase tracking-tighter hidden sm:inline">
                        {item.status === 'HOLIDAY' ? 'HOL' : item.status === 'WEEKEND' ? 'OFF' : item.status}
                      </span>
                    </div>
                    {indicator}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Present</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Late Arrival</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Absent</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>School Holiday</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Weekend</span>
              </span>
            </div>
          </Card>

          {/* Historical Session Log Table */}
          <Card>
            <CardHeader>
              <CardTitle>Biometric RFID Terminal Logs</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Time-stamped entry logs from North Campus Turnstile Gate #3
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">RFID Turnstile Check-In</th>
                      <th className="py-2.5 px-3">Dismissal Check-Out</th>
                      <th className="py-2.5 px-3">Session Status</th>
                      <th className="py-2.5 px-3">Administrative Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {daysInMonth.slice(20, 29).map((row) => (
                      <tr key={row.date} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{row.date}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{row.morningCheckIn || '—'}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{row.afternoonCheckOut || '—'}</td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.status === 'PRESENT' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                            row.status === 'LATE' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                            row.status === 'HOLIDAY' ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300' :
                            'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px]">{row.remarks || 'Normal Attendance'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Selected Date Inspect Card & Policy Overview */}
        <div className="space-y-4">
          {selectedDayLog && (
            <Card className="p-5 border-teal-200 dark:border-teal-900 bg-gradient-to-b from-teal-50/40 via-white to-white dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                  Day Inspector
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {selectedDayLog.date}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Record Status:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedDayLog.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    selectedDayLog.status === 'LATE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    selectedDayLog.status === 'HOLIDAY' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {selectedDayLog.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Morning In-Scan:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedDayLog.morningCheckIn || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Afternoon Out-Scan:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedDayLog.afternoonCheckOut || 'N/A'}
                    </span>
                  </div>
                </div>

                {selectedDayLog.remarks && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold block mb-0.5">Note:</span>
                    {selectedDayLog.remarks}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Board Criteria Information */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                CBSE Examination Threshold Policy
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              As per CBSE Examination By-laws (Rule 13), a student must have a minimum aggregate attendance of <strong>75%</strong> to be eligible to sit for the Secondary School Examination.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Current Status: Cleared for Board Admit Card Release</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
