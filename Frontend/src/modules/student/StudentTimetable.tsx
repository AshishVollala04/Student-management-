import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Clock, MapPin, User, AlertCircle, Printer, Download, Sparkles } from 'lucide-react';
import { TIMETABLE_DATA, TimetablePeriod } from '../../mock/academicData';

export const StudentTimetable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const periods: TimetablePeriod[] = TIMETABLE_DATA[selectedDay] || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Academic Timetable"
        subtitle="Grade 10 · Section A | Home Room: Room 304 (East Academic Block)"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
        }
      />

      {/* Official Timetable Circular Notice */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5 shadow-xs">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Official Timetable Notice:</strong> Computer Science Lab sessions on Thursday have moved to CyberLab 2. Friday Period 6 is scheduled for Physics Seminar in Auditorium West.
        </div>
      </div>

      {/* Monday - Saturday Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-teal-700 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Schedule Period Cards */}
      <div className="space-y-3">
        {periods.map((p, idx) => {
          if (p.isBreak) {
            return (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-dashed border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">☕</span>
                  <span className="font-bold">{p.subject}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300">{p.room}</span>
                </div>
                <div className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300">
                  {p.startTime} – {p.endTime}
                </div>
              </div>
            );
          }

          const isCurrentDemoPeriod = selectedDay === 'Monday' && idx === 0;

          return (
            <Card
              key={p.id}
              className={`p-4 sm:p-5 transition-all ${
                isCurrentDemoPeriod
                  ? 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/20 dark:bg-teal-950/20 shadow-md'
                  : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-mono font-bold shrink-0 ${
                    isCurrentDemoPeriod
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <span className="text-[9px] uppercase tracking-tighter opacity-80">Period</span>
                    <span className="text-sm">{p.period}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {p.subject}
                      </h4>
                      {isCurrentDemoPeriod && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                          Active Now
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.teacher}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{p.room}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{p.startTime} – {p.endTime}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">50 Mins Session</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
