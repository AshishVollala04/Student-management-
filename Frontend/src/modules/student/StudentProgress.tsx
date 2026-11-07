import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TrendingUp, Award, CalendarCheck, BookOpen, AlertCircle } from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const publishedTrends = [
    { term: 'Unit Test 1', score: 86.5 },
    { term: 'Quarterly Drill', score: 89.0 },
    { term: 'Mid-Term Exam', score: 90.2 },
    { term: 'Term 1 Assessment', score: 92.4 }
  ];

  const subjectScores = [
    { subject: 'Mathematics', score: 96, change: '+4%' },
    { subject: 'Physics', score: 92, change: '+5%' },
    { subject: 'Computer Science', score: 98, change: '+2%' },
    { subject: 'English Literature', score: 88, change: '+3%' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Academic Growth & Trends"
        subtitle="Individual progression tracking across published terms (Self-referential metric discipline)"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {/* Institutional Policy Notice on Zero Peer Comparison */}
      <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          <strong>Pedagogical Standard:</strong> To nurture intrinsic mastery, student progress reflects individual mastery trajectories without peer ranking or class percentile comparisons.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Trend progression across terms */}
        <Card className="p-5">
          <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Term Assessment Progression</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Historical published marks curve</p>
          </CardHeader>
          <div className="space-y-3">
            {publishedTrends.map(t => (
              <div key={t.term} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{t.term}</span>
                  <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{t.score}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${t.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject Strength Breakdown */}
        <Card className="p-5">
          <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Subject Performance Trajectory</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Recent semester gains</p>
          </CardHeader>
          <div className="space-y-2.5">
            {subjectScores.map(s => (
              <div
                key={s.subject}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{s.subject}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">{s.change} vs previous term</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-teal-700 dark:text-teal-400 font-mono tabular-nums">
                    {s.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
