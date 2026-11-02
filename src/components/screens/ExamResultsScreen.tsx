import React, { useState } from 'react';
import { ExamRecord, StudentProfile } from '../../types';
import { Award, TrendingUp, Download, CheckCircle2, ChevronRight, FileText, Printer, Star } from 'lucide-react';

interface ExamResultsScreenProps {
  exams: ExamRecord[];
  student: StudentProfile;
}

export const ExamResultsScreen: React.FC<ExamResultsScreenProps> = ({ exams, student }) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const totalMarksObtained = currentExam.subjects.reduce((sum, s) => sum + s.marksObtained, 0);
  const totalMaxMarks = currentExam.subjects.reduce((sum, s) => sum + s.maxMarks, 0);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300';
    if (grade.startsWith('B')) return 'text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-950/60 dark:border-sky-800 dark:text-sky-300';
    if (grade.startsWith('C')) return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300';
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Exam Selector Dropdown & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <label htmlFor="exam-cycle-select" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Examination Cycle
          </label>
          <select
            id="exam-cycle-select"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.date})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowReportCardModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Official Report Card (PDF)</span>
        </button>
      </div>

      {/* Main Performance Summary Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="border-r border-white/10 pr-2">
            <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
              Overall Score
            </span>
            <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
              {currentExam.overallPercentage}%
            </div>
            <span className="text-xs text-indigo-200 mt-0.5 block">
              {totalMarksObtained} / {totalMaxMarks} Marks
            </span>
          </div>

          <div className="border-r border-white/10 pr-2">
            <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
              Final Grade
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">
              A1
            </div>
            <span className="text-xs text-emerald-200 mt-0.5 block font-medium">
              Outstanding Performance
            </span>
          </div>

          <div className="border-r border-white/10 pr-2">
            <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
              Class Standing
            </span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1 tabular-nums">
              #{currentExam.rank}
            </div>
            <span className="text-xs text-amber-200 mt-0.5 block">
              Top 7% of Class (42 Students)
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
              Academic Verdict
            </span>
            <div className="text-lg font-bold text-white mt-2 flex items-center justify-center sm:justify-start gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Promoted</span>
            </div>
            <span className="text-xs text-indigo-200 mt-0.5 block">
              Eligible for Honors
            </span>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Subject-Wise Marks Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Subject-Wise Evaluation
        </h3>

        <div className="space-y-3">
          {currentExam.subjects.map((sub) => {
            const pct = Math.round((sub.marksObtained / sub.maxMarks) * 100);
            return (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getGradeColor(sub.grade)}`}>
                      {sub.grade}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sub.subject}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sub.remarks}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {sub.marksObtained} <span className="text-xs text-slate-400 font-normal">/ {sub.maxMarks}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {pct}%
                      </span>
                    </div>

                    {/* Mini visual score bar */}
                    <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Previous Exam Comparison Trend */}
      {currentExam.comparisonWithPrevious && currentExam.comparisonWithPrevious.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Historical Progression & Trend
              </h3>
            </div>
            <span className="text-xs text-emerald-600 font-semibold">
              +5.9% trajectory this academic year
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentExam.comparisonWithPrevious.map((comp, idx) => (
              <div
                key={comp.examName}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              >
                <span className="text-[11px] text-slate-500 font-medium block truncate">
                  {comp.examName}
                </span>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                  {comp.percentage}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${comp.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Report Card Printable Modal */}
      {showReportCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl my-6 border border-slate-200">
            {/* Header of Report Card */}
            <div className="border-b-2 border-indigo-900 pb-4 text-center">
              <h2 className="text-xl font-black tracking-tight text-indigo-950 uppercase">
                FutureSchool Academy
              </h2>
              <p className="text-xs text-slate-600 font-medium tracking-wide">
                Affiliated with Central Board of Secondary Education · Code 42091
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-lg uppercase tracking-wider">
                Official Cumulative Grade Sheet
              </div>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-slate-200">
              <div>
                <p><span className="text-slate-500">Student:</span> <strong>{student.name}</strong></p>
                <p className="mt-1"><span className="text-slate-500">Class & Sec:</span> <strong>{student.grade} - {student.section}</strong></p>
                <p className="mt-1"><span className="text-slate-500">Roll No:</span> <strong>{student.rollNo}</strong></p>
              </div>
              <div className="text-right sm:text-left">
                <p><span className="text-slate-500">Admission No:</span> <strong>{student.admissionNo}</strong></p>
                <p className="mt-1"><span className="text-slate-500">Term:</span> <strong>{currentExam.title}</strong></p>
                <p className="mt-1"><span className="text-slate-500">Academic Year:</span> <strong>{student.academicYear}</strong></p>
              </div>
            </div>

            {/* Subject Table */}
            <div className="py-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 font-bold">
                    <th className="py-2 text-left">Subject</th>
                    <th className="py-2 text-center">Max Marks</th>
                    <th className="py-2 text-center">Marks Scored</th>
                    <th className="py-2 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentExam.subjects.map(s => (
                    <tr key={s.id} className="text-slate-800">
                      <td className="py-2 font-medium">{s.subject}</td>
                      <td className="py-2 text-center font-mono">{s.maxMarks}</td>
                      <td className="py-2 text-center font-bold font-mono">{s.marksObtained}</td>
                      <td className="py-2 text-right font-bold text-indigo-900">{s.grade}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-900 font-bold text-slate-900">
                    <td className="py-2.5">Grand Aggregate</td>
                    <td className="py-2.5 text-center font-mono">{totalMaxMarks}</td>
                    <td className="py-2.5 text-center font-mono">{totalMarksObtained}</td>
                    <td className="py-2.5 text-right text-emerald-700">{currentExam.overallPercentage}% (A1)</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500">
              <div>
                <div className="h-8 border-b border-dashed border-slate-400 mb-1" />
                <span>Class Mentor</span>
              </div>
              <div>
                <div className="h-8 flex items-center justify-center text-indigo-900 font-serif italic text-xs mb-1">
                  ✓ Verified Seal
                </div>
                <span>Exam Controller</span>
              </div>
              <div>
                <div className="h-8 border-b border-dashed border-slate-400 mb-1" />
                <span>Principal</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowReportCardModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
