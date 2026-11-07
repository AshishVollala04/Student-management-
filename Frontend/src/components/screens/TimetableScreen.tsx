import React, { useState } from 'react';
import { TimetablePeriod } from '../../types';
import { Clock, MapPin, User, Coffee, Calendar, Printer } from 'lucide-react';

interface TimetableScreenProps {
  timetableData: Record<string, TimetablePeriod[]>;
}

export const TimetableScreen: React.FC<TimetableScreenProps> = ({ timetableData }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const currentSchedule = timetableData[selectedDay] || [];

  const getSubjectAccent = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-300';
    if (s.includes('physic')) return 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/40 dark:border-sky-900 dark:text-sky-300';
    if (s.includes('chem')) return 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-900 dark:text-teal-300';
    if (s.includes('bio')) return 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300';
    if (s.includes('comp') || s.includes('robot')) return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-300';
    if (s.includes('eng')) return 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300';
    if (s.includes('sport') || s.includes('athletic')) return 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/40 dark:border-orange-900 dark:text-orange-300';
    return 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300';
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Day Selector Pill Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {days.map((day) => {
            const isActive = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[76px] py-2.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Header Banner */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {selectedDay}'s Class Schedule
          </h2>
          <p className="text-xs text-slate-500">
            Grade 10 - Section A · Room 304 Home Room
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Print / PDF</span>
        </button>
      </div>

      {/* Period Cards List */}
      <div className="space-y-2.5">
        {currentSchedule.map((item, index) => {
          if (item.isBreak) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-dashed border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">{item.subject}</span>
                  <span className="text-slate-500 text-[11px]">({item.room})</span>
                </div>
                <div className="font-mono tabular-nums font-semibold text-[11px] text-amber-700 dark:text-amber-400">
                  {item.startTime} – {item.endTime}
                </div>
              </div>
            );
          }

          const isOngoing = index === 1; // demo active period

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isOngoing
                  ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-500 shadow-md ring-1 ring-indigo-400/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isOngoing ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    P{item.period}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.subject}
                      </h3>
                      {isOngoing && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                          Active Now
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.teacher}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-500 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                    {item.startTime} – {item.endTime}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">
                    45 minutes duration
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
