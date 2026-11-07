import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ALL_STUDENTS_180 } from '../../data/mockData';
import { CheckSquare, Upload, Download, CheckCircle2, AlertCircle, Save, Send, Award, FileSpreadsheet, Sparkles } from 'lucide-react';


const SCHOOL_CLASSES = [
  { id: 'class-10-a', name: 'Class 10-A', subject: 'Physical Science (SSC)' },
  { id: 'class-10-b', name: 'Class 10-B', subject: 'Mathematics (SSC)' },
  { id: 'class-9-a',  name: 'Class 9-A',  subject: 'English Literature' },
  { id: 'class-9-b',  name: 'Class 9-B',  subject: 'Social Science' },
  { id: 'class-8-a',  name: 'Class 8-A',  subject: 'Biological Science' },
  { id: 'class-8-b',  name: 'Class 8-B',  subject: 'Hindi & Sanskrit' }
];

interface StudentMarkState {
  rollNo: number;
  studentName: string;
  studentId: string;
  faScore: number; // Formative Assessment (out of 20)
  saScore: number; // Summative Assessment (out of 80)
  isAbsent: boolean;
}

export const TeacherMarksGrid: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [selectedClassId, setSelectedClassId] = useState<string>('class-10-a');
  const marks10A = workflow.marksEntries.find(m => m.classId === 'Grade 10-A');

  const [studentMarks, setStudentMarks] = useState<StudentMarkState[]>(() => {
    return (ALL_STUDENTS_180 as any[])
      .filter(s => s.classId === 'class-10-a')
      .map(s => {
        const fa = 15 + ((s.rollNo * 3) % 6);
        const sa = 55 + ((s.rollNo * 7) % 25);
        return {
          rollNo: s.rollNo,
          studentName: s.name,
          studentId: s.admissionNo,
          faScore: s.rollNo === 5 ? 12 : fa,
          saScore: s.rollNo === 5 ? 0 : sa,
          isAbsent: s.rollNo === 5
        };
      });
  });

  // Re-populate when selectedClassId changes
  React.useEffect(() => {
    let isMounted = true;
    async function loadClassStudents() {
      try {
        const raw = localStorage.getItem('futureschool_auth_token_v1');
        let authHeader: Record<string, string> = {};
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.accessToken) authHeader = { Authorization: `Bearer ${parsed.accessToken}` };
        }
        const res = await fetch(`/api/students/class/${selectedClassId}`, { headers: authHeader });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStudentMarks(data.map((s: any) => ({
              rollNo: Number(s.roll) || s.rollNo,
              studentName: s.name,
              studentId: s.admissionNumber || s.admissionNo || s.id,
              faScore: 16 + ((Number(s.roll) * 3) % 5),
              saScore: 60 + ((Number(s.roll) * 7) % 20),
              isAbsent: Number(s.roll) === 5
            })));
            return;
          }
        }
      } catch (err) {
        console.warn('Marks grid local fallback for class:', selectedClassId);
      }

      if (isMounted) {
        const fallback = (ALL_STUDENTS_180 as any[])
          .filter(s => s.classId === selectedClassId)
          .map(s => ({
            rollNo: s.rollNo,
            studentName: s.name,
            studentId: s.admissionNo,
            faScore: 16 + ((s.rollNo * 3) % 5),
            saScore: 60 + ((s.rollNo * 7) % 20),
            isAbsent: s.rollNo === 5
          }));
        if (fallback.length > 0) setStudentMarks(fallback);
      }
    }
    loadClassStudents();
    return () => { isMounted = false; };
  }, [selectedClassId]);

  const [toast, setToast] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStagingSuccess, setImportStagingSuccess] = useState(false);

  // State Board (SSC) 10-Point GPA Calculation
  const calculateStateBoardGrade = (total: number, isAbsent: boolean) => {
    if (isAbsent) return { grade: 'AB', points: 0, remark: 'Absent' };
    if (total >= 91) return { grade: 'A1', points: 10, remark: 'Outstanding' };
    if (total >= 81) return { grade: 'A2', points: 9, remark: 'Excellent' };
    if (total >= 71) return { grade: 'B1', points: 8, remark: 'Very Good' };
    if (total >= 61) return { grade: 'B2', points: 7, remark: 'Good' };
    if (total >= 51) return { grade: 'C1', points: 6, remark: 'Fair' };
    if (total >= 41) return { grade: 'C2', points: 5, remark: 'Average' };
    if (total >= 35) return { grade: 'D', points: 4, remark: 'Pass' };
    return { grade: 'E', points: 0, remark: 'Needs Improvement' };
  };

  const handleFaChange = (studentId: string, val: string) => {
    const num = Math.min(20, Math.max(0, Number(val) || 0));
    setStudentMarks(prev => prev.map(s => s.studentId === studentId ? { ...s, faScore: num, isAbsent: false } : s));
  };

  const handleSaChange = (studentId: string, val: string) => {
    const num = Math.min(80, Math.max(0, Number(val) || 0));
    setStudentMarks(prev => prev.map(s => s.studentId === studentId ? { ...s, saScore: num, isAbsent: false } : s));
  };

  const handleToggleAbsent = (studentId: string) => {
    setStudentMarks(prev => prev.map(s => (s.studentId === studentId ? { ...s, isAbsent: !s.isAbsent } : s)));
  };

  const handleSaveDraft = () => {
    const formattedMarks = studentMarks.map(s => ({
      studentId: s.studentId,
      studentName: s.studentName,
      rollNo: s.rollNo,
      score: s.isAbsent ? 0 : s.faScore + s.saScore,
      maxScore: 100,
      isAbsent: s.isAbsent
    }));
    store.saveDraftMarks('Grade 10-A', 'Mathematics', formattedMarks);
    setToast('Marksheet draft successfully saved to local register.');
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmitToPrincipal = () => {
    const formattedMarks = studentMarks.map(s => ({
      studentId: s.studentId,
      studentName: s.studentName,
      rollNo: s.rollNo,
      score: s.isAbsent ? 0 : s.faScore + s.saScore,
      maxScore: 100,
      isAbsent: s.isAbsent
    }));
    store.submitMarksForVerification('Grade 10-A', 'Mathematics', formattedMarks);
    setToast('Marks submitted to Headmaster for State Board verification.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleExcelImport = () => {
    setImportStagingSuccess(true);
    setTimeout(() => {
      setImportStagingSuccess(false);
      setShowImportModal(false);
      setToast('Imported State Board Excel marks template with 0 validation errors.');
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  const isLocked = marks10A?.status === 'APPROVED' || marks10A?.status === 'PENDING';

  return (
    <div className="space-y-6">
      <PageHeader
        title="State Board Marks Register & Evaluation Grid"
        subtitle="Class 10 - Section A · Mathematics (Paper 1 & 2) | FA (20M) + SA (80M) Format"
        badge={<StatusBadge status={marks10A?.status || 'DRAFT'} />}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              disabled={isLocked}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-blue-700" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isLocked}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={handleSubmitToPrincipal}
              disabled={isLocked}
              className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Headmaster</span>
            </button>
          </div>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-blue-900 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* State Board Grading Reference Pill Banner */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Award className="w-4 h-4 text-blue-700" />
          <span>SSC 10-Point GPA System:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">A1: 91–100 (10 GP)</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">A2: 81–90 (9 GP)</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">B1: 71–80 (8 GP)</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">B2: 61–70 (7 GP)</span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">C1: 51–60 (6 GP)</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">D: 35–40 (Pass)</span>
          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">&lt;35: Fail (E)</span>
        </div>
      </div>

      {/* Marks Entry Roster Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Class 10-A Student Evaluation Roster</CardTitle>
            <span className="text-xs font-bold text-slate-600 font-mono">
              Formula: Internal FA (20M) + External SA (80M) = Total 100M
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-3 text-center">FA Internal (/20)</th>
                  <th className="py-3 px-3 text-center">SA Exam (/80)</th>
                  <th className="py-3 px-3 text-center font-bold text-slate-900">Total Marks (/100)</th>
                  <th className="py-3 px-3 text-center">Absent Flag</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-right">Grade Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentMarks.map((s) => {
                  const total = s.isAbsent ? 0 : s.faScore + s.saScore;
                  const result = calculateStateBoardGrade(total, s.isAbsent);

                  return (
                    <tr key={s.studentId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">#{s.rollNo}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{s.studentName}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{s.studentId}</td>
                      
                      {/* FA Internal (out of 20) */}
                      <td className="py-3 px-3 text-center">
                        {s.isAbsent ? (
                          <span className="font-mono text-slate-400 font-bold">-</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max="20"
                            disabled={isLocked}
                            value={s.faScore}
                            onChange={(e) => handleFaChange(s.studentId, e.target.value)}
                            className="w-14 text-center py-1 border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        )}
                      </td>

                      {/* SA Exam (out of 80) */}
                      <td className="py-3 px-3 text-center">
                        {s.isAbsent ? (
                          <span className="font-mono text-rose-600 font-bold">AB</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max="80"
                            disabled={isLocked}
                            value={s.saScore}
                            onChange={(e) => handleSaChange(s.studentId, e.target.value)}
                            className="w-16 text-center py-1 border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        )}
                      </td>

                      {/* Computed Total Marks */}
                      <td className="py-3 px-3 text-center font-mono font-black text-sm text-slate-900">
                        {s.isAbsent ? <span className="text-rose-600">0</span> : total}
                      </td>

                      {/* Absent Toggle Button */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          disabled={isLocked}
                          onClick={() => handleToggleAbsent(s.studentId)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            s.isAbsent
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          {s.isAbsent ? 'Absent (AB)' : 'Mark AB'}
                        </button>
                      </td>

                      {/* State Board Grade Badge */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono font-black text-xs ${
                          result.grade === 'A1' || result.grade === 'A2'
                            ? 'bg-emerald-100 text-emerald-800'
                            : result.grade === 'B1' || result.grade === 'B2'
                            ? 'bg-blue-100 text-blue-800'
                            : result.grade === 'AB' || result.grade === 'E'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {result.grade}
                        </span>
                      </td>

                      {/* State Board Grade Points (out of 10) */}
                      <td className="py-3 px-3 text-right font-mono font-black text-sm text-slate-800">
                        {result.points} / 10
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Excel Import Simulation Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                State Board Excel Marks Template Staging
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload FA and SA marks formatted according to SSC Board standards.
              </p>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50">
              <FileSpreadsheet className="w-8 h-8 text-blue-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop "SSC_Grade10A_Maths_Marks.xlsx"
              </p>
              <button
                type="button"
                onClick={() => alert('Downloaded blank template: SSC_Grade10A_Maths_Marks.xlsx')}
                className="mt-2 text-[11px] font-bold text-blue-700 underline cursor-pointer"
              >
                Download Official SSC Staging Template
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExcelImport}
                className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-blue-800 hover:bg-blue-900 cursor-pointer"
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
