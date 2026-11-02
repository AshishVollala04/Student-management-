import React from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Award, Lock, CheckCircle2, FileText, Printer } from 'lucide-react';

export const StudentAcademics: React.FC = () => {
  const [workflow] = useWorkflow();
  const marks = workflow.marksEntries.find(m => m.classId === 'Grade 10-A');
  const reportCard = workflow.reportCards.find(r => r.studentId === 'GVS-2027-0001');

  const isPublished = marks?.isPublishedToStudents;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Academics & Report Cards"
        subtitle="Term examination results and officially verified marksheets"
        badge={
          isPublished ? (
            <StatusBadge status="COMPLETED" />
          ) : (
            <StatusBadge status="PENDING" />
          )
        }
        actions={
          isPublished ? (
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Grade Sheet</span>
            </button>
          ) : undefined
        }
      />

      {!isPublished ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Results are not yet published
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            The examination controller and principal are currently completing academic verification for Term 1. Once formally approved, verified marks and teacher conduct remarks will appear here.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <span>Workflow Status:</span>
            <StatusBadge status={marks?.status || 'PENDING'} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Published Report Card Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Term 1 Mid-Year Comprehensive Examination 2026</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Published by Class Mentor Mrs. Sarah Jenkins</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-teal-700 dark:text-teal-400 font-mono">
                    {reportCard?.overallPercentage}%
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">Grade A1 (Outstanding)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Faculty Instructor</th>
                      <th className="py-2.5 px-3 text-center">Max Marks</th>
                      <th className="py-2.5 px-3 text-center">Marks Scored</th>
                      <th className="py-2.5 px-3 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Mathematics</td>
                      <td className="py-2.5 px-3 text-slate-500">Mrs. Sarah Jenkins</td>
                      <td className="py-2.5 px-3 text-center font-mono">100</td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-teal-700 dark:text-teal-300">96</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">A1</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Physics</td>
                      <td className="py-2.5 px-3 text-slate-500">Dr. Michael Chen</td>
                      <td className="py-2.5 px-3 text-center font-mono">100</td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-teal-700 dark:text-teal-300">92</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">A1</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Computer Science</td>
                      <td className="py-2.5 px-3 text-slate-500">Mr. Alan Turing Jr.</td>
                      <td className="py-2.5 px-3 text-center font-mono">100</td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-teal-700 dark:text-teal-300">98</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">A1</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">English Literature</td>
                      <td className="py-2.5 px-3 text-slate-500">Ms. Clara Oswald</td>
                      <td className="py-2.5 px-3 text-center font-mono">100</td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-teal-700 dark:text-teal-300">88</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">A2</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {reportCard?.conductRemarks && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Class Teacher Conduct Appraisal:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 italic">
                    "{reportCard.conductRemarks}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
