import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CalendarCheck, CheckCircle2, Clock, Check, AlertCircle } from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const [session, setSession] = useState<'MORNING' | 'AFTERNOON'>('MORNING');
  const [roster, setRoster] = useState([
    { rollNo: 1, name: 'Aadhya Patel', status: 'PRESENT', leaveContext: null },
    { rollNo: 2, name: 'Aditya Nair', status: 'PRESENT', leaveContext: null },
    { rollNo: 3, name: 'Aryan Kapoor', status: 'LATE', leaveContext: null },
    { rollNo: 4, name: 'Avani Deshmukh', status: 'PRESENT', leaveContext: null },
    { rollNo: 5, name: 'Devansh Reddy', status: 'ABSENT', leaveContext: 'Medical Leave Sanctioned' },
    { rollNo: 18, name: 'Aarav Sharma', status: 'PRESENT', leaveContext: null },
    { rollNo: 19, name: 'Rohan Mehra', status: 'PRESENT', leaveContext: null }
  ]);
  const [toast, setToast] = useState<string | null>(null);

  const toggleStatus = (rollNo: number) => {
    setRoster(prev => prev.map(s => {
      if (s.rollNo === rollNo) {
        const next = s.status === 'PRESENT' ? 'LATE' : s.status === 'LATE' ? 'ABSENT' : 'PRESENT';
        return { ...s, status: next };
      }
      return s;
    }));
  };

  const handleMarkAllPresent = () => {
    setRoster(prev => prev.map(s => s.leaveContext ? s : { ...s, status: 'PRESENT' }));
    setToast('All active students without sanctioned leave marked PRESENT.');
    setTimeout(() => setToast(null), 2500);
  };

  const handleSaveRegister = () => {
    setToast(`Class 10-A ${session} attendance register recorded and synced to School Portal.`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class 10-A Attendance Register"
        subtitle="Morning and Afternoon session roll call with approved leave context integration"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSession('MORNING')}
                className={`px-3 py-1.5 rounded-lg ${session === 'MORNING' ? 'bg-teal-700 text-white font-bold' : 'text-slate-600'}`}
              >
                Morning
              </button>
              <button
                onClick={() => setSession('AFTERNOON')}
                className={`px-3 py-1.5 rounded-lg ${session === 'AFTERNOON' ? 'bg-teal-700 text-white font-bold' : 'text-slate-600'}`}
              >
                Afternoon
              </button>
            </div>
            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>
            <button
              onClick={handleSaveRegister}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Register</span>
            </button>
          </div>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Session: {session} Roll Call (Grade 10-A)</CardTitle>
            <span className="text-xs text-slate-500 font-mono">Date: Today</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {roster.map((s) => (
              <div key={s.rollNo} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    #{s.rollNo}
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white text-sm block">
                      {s.name}
                    </strong>
                    {s.leaveContext && (
                      <span className="text-[11px] text-amber-600 font-medium">
                        ⓘ {s.leaveContext}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStatus(s.rollNo)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    s.status === 'PRESENT'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                      : s.status === 'LATE'
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
                  }`}
                >
                  {s.status}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
