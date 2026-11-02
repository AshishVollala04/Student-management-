import React, { useState } from 'react';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CalendarCheck, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  const history = [
    { date: '2026-10-30', morning: 'PRESENT', afternoon: 'PRESENT', checkIn: '07:46 AM', note: 'On time' },
    { date: '2026-10-29', morning: 'PRESENT', afternoon: 'PRESENT', checkIn: '07:52 AM', note: 'On time' },
    { date: '2026-10-28', morning: 'PRESENT', afternoon: 'PRESENT', checkIn: '07:43 AM', note: 'On time' },
    { date: '2026-10-27', morning: 'PRESENT', afternoon: 'PRESENT', checkIn: '07:50 AM', note: 'On time' },
    { date: '2026-10-20', morning: 'LATE', afternoon: 'PRESENT', checkIn: '08:08 AM', note: 'Bus delayed by 10 mins' },
    { date: '2026-10-13', morning: 'ABSENT', afternoon: 'ABSENT', checkIn: '—', note: 'Sanctioned Medical Leave' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Register"
        subtitle="Morning and Afternoon session logs with RFID biometric verification"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Overall Percentage"
          value="94.2%"
          subtext="Above 75% CBSE criteria"
          icon={<CalendarCheck className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          label="Present Sessions"
          value="44 / 48"
          subtext="Morning & Afternoon tracked"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Late Check-ins"
          value="2 Days"
          subtext="Average 08:11 AM"
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="orange"
        />
        <StatCard
          label="Excused Absences"
          value="1 Day"
          subtext="Sanctioned medical leave"
          icon={<XCircle className="w-5 h-5" />}
          accentColor="rose"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Session History (Morning & Afternoon)</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Biometric gate scanner logs</p>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">RFID Check-In</th>
                  <th className="py-2.5 px-3">Morning Session</th>
                  <th className="py-2.5 px-3">Afternoon Session</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((row) => (
                  <tr key={row.date}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">{row.date}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{row.checkIn}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.morning === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        row.morning === 'LATE' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {row.morning}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.afternoon === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {row.afternoon}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
