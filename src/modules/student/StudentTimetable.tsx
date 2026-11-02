import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Clock, MapPin, AlertCircle, Calendar } from 'lucide-react';
import { TIMETABLE_DATA } from '../../data/mockData';

export const StudentTimetable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const periods = TIMETABLE_DATA[selectedDay] || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Timetable"
        subtitle="Grade 10 · Section A | Room 304 Home Room"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {/* Timetable Change Notice (Phase 2 Rule 7) */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Official Timetable Circular:</span> Friday Period 6 is updated to Physics Seminar in Auditorium West.
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDay === day
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {periods.map((p) => {
          if (p.isBreak) {
            return (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-dashed border-orange-200 dark:border-orange-900 text-orange-900 dark:text-orange-300 text-xs flex items-center justify-between font-medium"
              >
                <span>☕ {p.subject} ({p.room})</span>
                <span className="font-mono tabular-nums">{p.startTime} – {p.endTime}</span>
              </div>
            );
          }

          return (
            <Card key={p.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center font-mono">
                    P{p.period}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {p.subject}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {p.teacher} · <span className="text-slate-700 dark:text-slate-300 font-medium">{p.room}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 font-mono font-semibold">
                  {p.startTime} – {p.endTime}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const StudentExams: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination Schedule & Hall Tickets"
        subtitle="CBSE and internal semester evaluation datesheets"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <div className="space-y-3">
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Upcoming Assessment Series
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Mid-Year Comprehensive Examination 2026
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Dates: 18 Nov 2026 to 28 Nov 2026 · Morning Shift (08:30 - 11:30 AM)
              </p>
            </div>
            <a
              href="/student/hall-ticket"
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shrink-0 self-start sm:self-center transition-colors shadow-sm"
            >
              Access Hall Ticket
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Subject Examination Dates:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between">
                <span>Mathematics (Code 041)</span>
                <span className="font-mono text-slate-500">18 Nov, 08:30 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between">
                <span>Physics & Practical (Code 042)</span>
                <span className="font-mono text-slate-500">20 Nov, 08:30 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between">
                <span>Computer Science (Code 083)</span>
                <span className="font-mono text-slate-500">24 Nov, 08:30 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between">
                <span>English Language (Code 184)</span>
                <span className="font-mono text-slate-500">27 Nov, 08:30 AM</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
