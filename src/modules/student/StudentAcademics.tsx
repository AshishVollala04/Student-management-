import React, { useState } from 'react';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Award, 
  TrendingUp, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Calendar,
  Building2,
  Medal,
  ChevronDown
} from 'lucide-react';
import { STUDENT_EXAM_RESULTS, STUDENT_PROFILE } from '../../mock/academicData';

export const StudentAcademics: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<'term1_final' | 'mid_term'>('term1_final');
  const [showOfficialModal, setShowOfficialModal] = useState(false);

  const termData = STUDENT_EXAM_RESULTS[selectedTerm];
  const previousTermData = selectedTerm === 'term1_final' ? STUDENT_EXAM_RESULTS['mid_term'] : null;

  const totalObtained = termData.scores.reduce((acc, s) => acc + s.marksObtained, 0);
  const totalMax = termData.scores.reduce((acc, s) => acc + s.maxMarks, 0);
  const percentage = ((totalObtained / totalMax) * 100).toFixed(1);

  const diffFromPrevious = previousTermData 
    ? (termData.overallPercentage - previousTermData.overallPercentage).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examinations & Academic Performance"
        subtitle="CBSE Continuous and Comprehensive Evaluation (CCE) marksheets & rank analytics"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => setShowOfficialModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Official Report Card</span>
          </button>
        }
      />

      {/* Term Selector & Performance Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Selected Evaluation Cycle
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {termData.termName} ({termData.termDate})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTerm('term1_final')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTerm === 'term1_final'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Term 1 Final (Recent)
          </button>
          <button
            onClick={() => setSelectedTerm('mid_term')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTerm === 'mid_term'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Mid-Term Assessment
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Aggregate Percentage"
          value={`${percentage}%`}
          subtext={`Total: ${totalObtained} / ${totalMax} marks`}
          trend={diffFromPrevious ? { value: `+${diffFromPrevious}%`, isPositive: true } : undefined}
          icon={<Award className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          label="Cumulative CGPA"
          value={`${termData.cgpa} / 10.0`}
          subtext="Grade Point Average"
          icon={<Sparkles className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Class Standing"
          value={`Rank #${termData.classRank}`}
          subtext={`Among ${termData.totalStudents} students in 10-A`}
          icon={<Medal className="w-5 h-5" />}
          accentColor="orange"
        />
        <StatCard
          label="Cohort Average"
          value="72.4%"
          subtext="Outperforming cohort by +18.8%"
          icon={<BarChart3 className="w-5 h-5" />}
          accentColor="teal"
        />
      </div>

      {/* Detailed Subject-Wise Marks Matrix */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Subject-Wise Academic Marksheet</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Internal assessments + Theory paper combined scores
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
              Pass Criteria: 33% per subject
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Subject & Code</th>
                  <th className="py-3 px-3 text-center">Max Marks</th>
                  <th className="py-3 px-3 text-center">Marks Obtained</th>
                  <th className="py-3 px-3 text-center">Percentage</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-center">Cohort Avg</th>
                  <th className="py-3 px-3">Faculty Academic Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {termData.scores.map((row) => {
                  const subjectPct = ((row.marksObtained / row.maxMarks) * 100).toFixed(0);
                  return (
                    <tr key={row.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{row.subject}</div>
                        <div className="font-mono text-[10px] text-slate-400">{row.code}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">{row.maxMarks}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-teal-800 dark:text-teal-300">
                        {row.marksObtained}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{subjectPct}%</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.grade === 'A1' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          row.grade === 'A2' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {row.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">{row.classAverage}%</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {row.remarks}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50/80 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700">
                <tr>
                  <td className="py-3 px-3 text-slate-900 dark:text-white font-bold">TOTAL AGGREGATE</td>
                  <td className="py-3 px-3 text-center font-mono">{totalMax}</td>
                  <td className="py-3 px-3 text-center font-mono text-teal-700 dark:text-teal-300 font-bold">{totalObtained}</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-600">{percentage}%</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600">A1</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-500">72.4%</td>
                  <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-sans text-xs">
                    Promoted with Distinction Honors
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Official Report Card Modal */}
      {showOfficialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
            {/* Modal Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Official Board Document Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfficialModal(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-900 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* School Crest & Header */}
            <div className="text-center pb-6 border-b-2 border-slate-900">
              <div className="text-lg font-black tracking-tight text-teal-900 uppercase">
                {STUDENT_PROFILE.schoolName}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Affiliated to Central Board of Secondary Education (CBSE), New Delhi · Affiliation No. 830114
              </p>
              <div className="inline-block mt-3 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold uppercase tracking-widest text-slate-800 border border-slate-300">
                Academic Achievement Certificate & Marksheet
              </div>
            </div>

            {/* Student Credentials Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-bold text-slate-900">{STUDENT_PROFILE.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Registration / Roll No</span>
                <span className="font-mono font-bold text-slate-900">{STUDENT_PROFILE.id} (Roll #{STUDENT_PROFILE.rollNumber})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Class & Section</span>
                <span className="font-bold text-slate-900">Grade {STUDENT_PROFILE.grade}-{STUDENT_PROFILE.section}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Academic Session</span>
                <span className="font-mono font-bold text-slate-900">{STUDENT_PROFILE.academicYear}</span>
              </div>
            </div>

            {/* Print Marksheet Table */}
            <div className="py-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b-2 border-slate-900 font-bold uppercase text-[10px]">
                    <th className="py-2">Subject Name</th>
                    <th className="py-2 text-center">Max Marks</th>
                    <th className="py-2 text-center">Obtained</th>
                    <th className="py-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {termData.scores.map(s => (
                    <tr key={s.code}>
                      <td className="py-2 font-sans font-medium text-slate-900">{s.subject}</td>
                      <td className="py-2 text-center text-slate-600">{s.maxMarks}</td>
                      <td className="py-2 text-center font-bold text-slate-900">{s.marksObtained}</td>
                      <td className="py-2 text-center font-bold text-teal-800">{s.grade}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-900 font-bold">
                    <td className="py-2 uppercase">Grand Total Aggregate</td>
                    <td className="py-2 text-center">{totalMax}</td>
                    <td className="py-2 text-center text-teal-800">{totalObtained}</td>
                    <td className="py-2 text-center text-emerald-700">A1 ({percentage}%)</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Principal & Mentor Remarks */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mt-2 space-y-1">
              <span className="font-bold block text-slate-900">Principal's Evaluation:</span>
              <p className="italic">
                "Aarav has shown remarkable intellectual dedication, active classroom leadership, and rigorous scientific inquiry throughout Term 1."
              </p>
            </div>

            {/* Signatures */}
            <div className="pt-8 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 mt-6">
              <div className="text-center">
                <div className="font-serif italic font-bold text-sm text-slate-800 mb-1">Sarah Jenkins</div>
                <span className="text-[10px] uppercase font-bold border-t border-slate-300 pt-1 block">Class Mentor Signature</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border border-dashed border-teal-700 text-teal-800 text-[9px] font-bold uppercase flex items-center justify-center mx-auto mb-1">
                  OFFICIAL SEAL
                </div>
                <span className="text-[10px] uppercase font-bold block">Greenwood Valley</span>
              </div>
              <div className="text-center">
                <div className="font-serif italic font-bold text-sm text-slate-800 mb-1">Dr. Robert Vance</div>
                <span className="text-[10px] uppercase font-bold border-t border-slate-300 pt-1 block">Principal & Director</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
