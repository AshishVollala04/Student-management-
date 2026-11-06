import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CheckSquare, Upload, Download, CheckCircle2, AlertCircle, Save, Send, RotateCcw } from 'lucide-react';

export const TeacherMarksGrid: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const marks10A = workflow.marksEntries.find(m => m.classId === 'Grade 10-A');

  const [studentMarks, setStudentMarks] = useState(marks10A?.studentMarks || []);
  const [toast, setToast] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStagingSuccess, setImportStagingSuccess] = useState(false);

  const handleScoreChange = (studentId: string, val: string) => {
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    setStudentMarks(prev => prev.map(s => s.studentId === studentId ? { ...s, score: num, isAbsent: false } : s));
  };

  const handleToggleAbsent = (studentId: string) => {
    setStudentMarks(prev => prev.map(s => s.studentId === studentId ? { ...s, isAbsent: !s.isAbsent, score: !s.isAbsent ? 0 : 80 } : s));
  };

  const handleSaveDraft = () => {
    store.saveDraftMarks('Grade 10-A', 'Mathematics', studentMarks);
    setToast('Marks grid saved to local draft.');
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmitToPrincipal = () => {
    store.submitMarksForVerification('Grade 10-A', 'Mathematics', studentMarks);
    setToast('Marksheet successfully submitted to Principal for institutional review.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleExcelImport = () => {
    setImportStagingSuccess(true);
    setTimeout(() => {
      setImportStagingSuccess(false);
      setShowImportModal(false);
      setToast('Imported 4 marks records from Excel staging template with 0 validation errors.');
      setTimeout(() => setToast(null), 3000);
    }, 1200);
  };

  const isLocked = marks10A?.status === 'APPROVED' || marks10A?.status === 'PENDING';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formal Marks Entry Grid"
        subtitle="Grade 10-A · Mathematics (Code 041) | Term 1 Assessment Series"
        badge={<StatusBadge status={marks10A?.status || 'DRAFT'} />}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              disabled={isLocked}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isLocked}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={handleSubmitToPrincipal}
              disabled={isLocked}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Principal</span>
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

      {/* Return Reason Banner (if returned by Principal) */}
      {marks10A?.status === 'RETURNED' && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Principal Return Directive:</strong> "{marks10A.returnReason || 'Please verify re-exam eligibility for candidate Devansh Reddy.'}" Correct scores below and resubmit.
          </div>
        </div>
      )}

      {/* Marks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Class 10-A Roster Marks Evaluation</CardTitle>
            <span className="text-xs text-slate-500 font-mono">Max Marks: 100</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Candidate ID</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained (/100)</th>
                  <th className="py-2.5 px-3 text-center">Absent Flag</th>
                  <th className="py-2.5 px-3 text-right">Computed Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentMarks.map((s) => (
                  <tr key={s.studentId}>
                    <td className="py-2.5 px-3 font-mono font-bold">#{s.rollNo}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{s.studentName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{s.studentId}</td>
                    <td className="py-2.5 px-3 text-center">
                      {s.isAbsent ? (
                        <span className="font-bold text-rose-600 font-mono">AB</span>
                      ) : (
                        <input
                          type="number"
                          disabled={isLocked}
                          value={s.score}
                          onChange={(e) => handleScoreChange(s.studentId, e.target.value)}
                          className="w-16 text-center py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-800"
                        />
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleToggleAbsent(s.studentId)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.isAbsent
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {s.isAbsent ? 'Absent (AB)' : 'Mark AB'}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 font-mono">
                      {s.isAbsent ? 'AB' : s.score >= 90 ? 'A1' : s.score >= 80 ? 'A2' : 'B1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Excel Import Simulation Modal (Phase 4 Rule 4) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Excel Marks Template Staging & Import
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bulk upload scores using standard institutional format.
              </p>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800/40">
              <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Drag and drop "Grade10A_Maths_Marks_Template.xlsx"
              </p>
              <button
                type="button"
                onClick={() => alert('Downloaded blank template: Grade10A_Maths_Marks_Template.xlsx')}
                className="mt-2 text-[11px] font-bold text-teal-700 dark:text-teal-400 underline"
              >
                Download Official CSV / Excel Staging Template
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExcelImport}
                className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800"
              >
                {importStagingSuccess ? 'Validating...' : 'Stage & Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
