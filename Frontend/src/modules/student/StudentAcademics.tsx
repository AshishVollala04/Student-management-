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
  ChevronDown,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import { STUDENT_EXAM_RESULTS, STUDENT_PROFILE } from '../../mock/academicData';

interface SubjectMarkRow {
  subject: string;
  code: string;
  faMarks: number; // Internal /20
  saMarks: number; // External /80
  total: number;   // Total /100
  gradePoint: number;
  grade: string;
  classAvg: number;
  highest: number;
  remarks: string;
}

function calculateGradePoint(total: number): { gp: number; grade: string } {
  if (total >= 91) return { gp: 10, grade: 'A1' };
  if (total >= 81) return { gp: 9, grade: 'A2' };
  if (total >= 71) return { gp: 8, grade: 'B1' };
  if (total >= 61) return { gp: 7, grade: 'B2' };
  if (total >= 51) return { gp: 6, grade: 'C1' };
  if (total >= 41) return { gp: 5, grade: 'C2' };
  if (total >= 35) return { gp: 4, grade: 'D' };
  return { gp: 0, grade: 'E' };
}

export const StudentAcademics: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<'term1_final' | 'mid_term'>('term1_final');
  const [showOfficialModal, setShowOfficialModal] = useState(false);

  const rawTermData = STUDENT_EXAM_RESULTS[selectedTerm];
  const previousTermData = selectedTerm === 'term1_final' ? STUDENT_EXAM_RESULTS['mid_term'] : null;

  // Transform scores into State Board FA (20M) + SA (80M) = 100M structure
  const detailedScores: SubjectMarkRow[] = rawTermData.scores.map(s => {
    // FA is ~20% of marks, SA is remainder
    const fa = Math.min(20, Math.round(s.marksObtained * 0.20));
    const sa = s.marksObtained - fa;
    const { gp, grade } = calculateGradePoint(s.marksObtained);
    return {
      subject: s.subject,
      code: s.code,
      faMarks: fa,
      saMarks: sa,
      total: s.marksObtained,
      gradePoint: gp,
      grade,
      classAvg: s.classAverage,
      highest: s.highestInClass,
      remarks: s.remarks
    };
  });

  const totalObtained = detailedScores.reduce((acc, s) => acc + s.total, 0);
  const totalMax = detailedScores.length * 100;
  const percentage = ((totalObtained / totalMax) * 100).toFixed(1);
  const avgGpa = (detailedScores.reduce((acc, s) => acc + s.gradePoint, 0) / detailedScores.length).toFixed(1);

  const diffFromPrevious = previousTermData 
    ? (rawTermData.overallPercentage - previousTermData.overallPercentage).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Print CSS Injection for 1-Page State Board Report Card */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #report-card-printable, #report-card-printable * {
            visibility: visible !important;
          }
          #report-card-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 16px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <PageHeader
        title="Examinations & Academic Performance"
        subtitle="Karnataka State Board (SSC) Continuous & Comprehensive Evaluation (CCE) Marksheet"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => setShowOfficialModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Report Card</span>
          </button>
        }
      />

      {/* Cycle Selector & State Board Accreditation Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              State Board SSC Evaluation Cycle
            </span>
            <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-900">
              Affil #GVS-SSC-2026
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {rawTermData.termName} ({rawTermData.termDate})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTerm('term1_final')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTerm === 'term1_final'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            SA-1 Comprehensive (Term 1)
          </button>
          <button
            onClick={() => setSelectedTerm('mid_term')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTerm === 'mid_term'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            FA-1 & FA-2 Diagnostic
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Aggregate Percentage"
          value={`${percentage}%`}
          subtext={`Grand Total: ${totalObtained} / ${totalMax} Marks`}
          trend={diffFromPrevious ? { value: `+${diffFromPrevious}% vs Mid-Term`, isPositive: true } : undefined}
          icon={<Award className="w-5 h-5" />}
          accentColor="slate"
        />
        <StatCard
          label="Cumulative Grade Point"
          value={`${avgGpa} / 10.0`}
          subtext="State Board 10-Point GPA Scale"
          icon={<Sparkles className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Class Standing"
          value={`Rank #${rawTermData.classRank}`}
          subtext={`Class 10-A (Cohort of ${rawTermData.totalStudents})`}
          icon={<Medal className="w-5 h-5" />}
          accentColor="orange"
        />
        <StatCard
          label="Board Promotion Status"
          value="Distinction (A1)"
          subtext="Satisfies all SSC board criteria"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="teal"
        />
      </div>

      {/* Detailed Subject-Wise Marks Matrix (FA 20M + SA 80M = 100M) */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Continuous & Comprehensive Evaluation (CCE) Subject Marks</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Formula: Internal Formative Assessment (FA / 20M) + External Summative Assessment (SA / 80M) = 100M
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
              Passing Standard: 35% in each subject
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Subject & Code</th>
                  <th className="py-3 px-3 text-center">FA (/20)</th>
                  <th className="py-3 px-3 text-center">SA (/80)</th>
                  <th className="py-3 px-3 text-center">Total (/100)</th>
                  <th className="py-3 px-3 text-center">Grade Point</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-center">Class Avg</th>
                  <th className="py-3 px-3">Subject Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {detailedScores.map((row) => (
                  <tr key={row.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white">{row.subject}</div>
                      <div className="font-mono text-[10px] text-slate-400">{row.code}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300 font-bold">
                      {row.faMarks}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300 font-bold">
                      {row.saMarks}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-blue-900 dark:text-blue-300 text-sm">
                      {row.total}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {row.gradePoint}.0
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.grade === 'A1' ? 'bg-emerald-100 text-emerald-800 font-black' :
                        row.grade === 'A2' ? 'bg-blue-100 text-blue-800 font-bold' :
                        'bg-amber-100 text-amber-800 font-bold'
                      }`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400">
                      {row.classAvg}%
                    </td>
                    <td className="py-3 px-3 font-sans italic text-slate-600 dark:text-slate-400 text-[11px]">
                      "{row.remarks}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          PRINTABLE OFFICIAL 1-PAGE STATE BOARD PROGRESS REPORT CARD MODAL
         ========================================================================= */}
      {showOfficialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-800 max-h-[96vh] overflow-y-auto">
            {/* Modal Actions Bar (hidden in print) */}
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-700" />
                <span>State Board (SSC) Official Progress Card</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfficialModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE REPORT CARD CONTAINER */}
            <div id="report-card-printable" className="bg-white text-slate-900 p-2 sm:p-4 space-y-4">
              {/* Official School Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <div className="text-xl sm:text-2xl font-black tracking-tight text-blue-950 uppercase">
                  GREENWOOD VALLEY HIGH SCHOOL
                </div>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                  Recognized by Dept. of Public Instruction, Govt. of Karnataka · Affiliated to State Board of Secondary Education (SSC)
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  School Registration Code: GVS-SSC-2026 · Whitefield Main Road, Bengaluru - 560066
                </p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-widest border border-slate-300">
                  Annual Student Evaluation & Cumulative Progress Card (2026-2027)
                </div>
              </div>

              {/* Student Demographics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                  <span className="font-bold text-slate-900">{STUDENT_PROFILE.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Class & Section</span>
                  <span className="font-bold text-slate-900">Grade 10 - Section A (Roll #{STUDENT_PROFILE.rollNumber})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Registration / Admission ID</span>
                  <span className="font-mono font-bold text-slate-900">{STUDENT_PROFILE.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Father / Guardian</span>
                  <span className="font-bold text-slate-900">{STUDENT_PROFILE.father.name}</span>
                </div>
              </div>

              {/* Marksheet Breakdown Table */}
              <table className="w-full text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-center w-10">S.No</th>
                    <th className="p-2 border-r border-slate-300 text-left">Subject Name</th>
                    <th className="p-2 border-r border-slate-300 text-center">FA (20M)</th>
                    <th className="p-2 border-r border-slate-300 text-center">SA (80M)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Total (100M)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Grade Point</th>
                    <th className="p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {detailedScores.map((s, idx) => (
                    <tr key={s.code}>
                      <td className="p-2 border-r border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-sans font-semibold text-slate-900">
                        {s.subject} <span className="text-[10px] text-slate-400 font-mono">({s.code})</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center">{s.faMarks}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{s.saMarks}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-900">{s.total}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-900">{s.gradePoint}.0</td>
                      <td className="p-2 text-center font-black text-emerald-800">{s.grade}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold font-mono">
                    <td colSpan={2} className="p-2 border-r border-slate-300 text-right uppercase font-sans text-xs">
                      Grand Aggregate:
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-slate-700">113</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-slate-700">434</td>
                    <td className="p-2 border-r border-slate-300 text-center font-black text-blue-950 text-sm">
                      {totalObtained} / {totalMax}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-black text-blue-950">
                      {avgGpa} GPA
                    </td>
                    <td className="p-2 text-center font-black text-emerald-800">A1</td>
                  </tr>
                </tfoot>
              </table>

              {/* Standing & Evaluation Summary */}
              <div className="grid grid-cols-3 gap-2 text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Final Result</span>
                  <span className="font-black text-emerald-700">PASSED WITH DISTINCTION</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Class Standing</span>
                  <span className="font-bold text-slate-900">Rank #3 in Class 10-A</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Attendance</span>
                  <span className="font-bold text-slate-900">94.2% (Satisfied)</span>
                </div>
              </div>

              {/* Remarks */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold block text-slate-900">Mentor & Principal Evaluation:</span>
                <p className="italic text-slate-600">
                  "Aarav has shown outstanding conceptual rigor in Mathematics and Computer Science. His analytical aptitude and regular classroom participation place him among the top candidates for the upcoming SSC Board Examination."
                </p>
              </div>

              {/* Signatures & Official School Seal */}
              <div className="pt-8 flex items-center justify-between text-xs text-slate-600 border-t border-slate-300 mt-6">
                <div className="text-center w-36">
                  <div className="font-serif italic font-bold text-sm text-slate-900 mb-1">Sarah Jenkins</div>
                  <span className="text-[10px] uppercase font-bold border-t border-slate-400 pt-1 block">Class Mentor</span>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-900 text-blue-900 text-[8px] font-black uppercase flex flex-col items-center justify-center mx-auto mb-1">
                    <span>OFFICIAL</span>
                    <span>SEAL</span>
                    <span>2026-27</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Greenwood Valley</span>
                </div>

                <div className="text-center w-36">
                  <div className="font-serif italic font-bold text-sm text-slate-900 mb-1">Dr. Robert Vance</div>
                  <span className="text-[10px] uppercase font-bold border-t border-slate-400 pt-1 block">Principal & Director</span>
                </div>
              </div>
            </div>

            {/* Bottom Close Action */}
            <div className="no-print pt-4 border-t border-slate-200 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOfficialModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
