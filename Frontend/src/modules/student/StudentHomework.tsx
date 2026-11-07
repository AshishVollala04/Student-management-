import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FilterBar } from '../../components/common/CommonUi';
import { 
  BookOpen, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  X,
  Paperclip,
  Check,
  Award
} from 'lucide-react';

interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  assignedDate: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'EVALUATED';
  description: string;
  attachmentName?: string;
  score?: string;
  teacherFeedback?: string;
  studentSubmissionFile?: string;
}

export const StudentHomework: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'EVALUATED'>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<HomeworkItem | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([
    {
      id: 'hw_1',
      subject: 'Mathematics',
      title: 'Quadratic Equations: Real Roots & Discriminant Analysis',
      teacher: 'Mrs. Sarah Jenkins',
      assignedDate: '31 Oct 2026',
      dueDate: '04 Nov 2026',
      status: 'PENDING',
      description: 'Complete problem sets 4.1 to 4.4 from Chapter 4. Include graph sketches for parabolic vertices and write out the discriminant conditions.',
      attachmentName: 'Chapter_4_Quadratic_Practice_Set.pdf'
    },
    {
      id: 'hw_2',
      subject: 'Physics',
      title: 'Snell\'s Law & Total Internal Reflection Lab Report',
      teacher: 'Dr. Michael Chen',
      assignedDate: '01 Nov 2026',
      dueDate: '06 Nov 2026',
      status: 'PENDING',
      description: 'Summarize ray tracing data from the prism refraction experiment. Plot the angle of deviation vs angle of incidence and calculate the refractive index of crown glass.',
      attachmentName: 'Optics_Prism_Data_Sheet.xlsx'
    },
    {
      id: 'hw_3',
      subject: 'Computer Science',
      title: 'Object-Oriented Banking Engine in Python',
      teacher: 'Mr. Alan Turing Jr.',
      assignedDate: '26 Oct 2026',
      dueDate: '30 Oct 2026',
      status: 'EVALUATED',
      description: 'Construct BankAccount, SavingsAccount, and CurrentAccount classes with unit tests for deposits, withdrawals, and overdraft protection logic.',
      attachmentName: 'OOP_Banking_Requirements.pdf',
      score: '19.5 / 20 (A1)',
      teacherFeedback: 'Clean modular class hierarchy with excellent docstrings and complete assert tests. Great work on overdraft limit handling.',
      studentSubmissionFile: 'aarav_sharma_banking_engine.py'
    },
    {
      id: 'hw_4',
      subject: 'English Literature',
      title: 'Critical Analysis: The Merchant of Venice Act IV Trial Scene',
      teacher: 'Ms. Clara Oswald',
      assignedDate: '28 Oct 2026',
      dueDate: '02 Nov 2026',
      status: 'SUBMITTED',
      description: 'Write a 600-word analytical essay evaluating Portia\'s "Quality of Mercy" monologue and Shylock\'s legal arguments.',
      attachmentName: 'Venice_Trial_Analysis_Rubric.pdf',
      studentSubmissionFile: 'aarav_merchant_of_venice_essay.docx'
    }
  ]);

  const filtered = homeworkList.filter(h => {
    if (filter === 'PENDING') return h.status === 'PENDING';
    if (filter === 'SUBMITTED') return h.status === 'SUBMITTED';
    if (filter === 'EVALUATED') return h.status === 'EVALUATED';
    return true;
  });

  const handleOpenSubmission = (item: HomeworkItem) => {
    setActiveModalItem(item);
    setSubmissionNotes('');
    setUploadedFileName('');
  };

  const handleSimulateFileUpload = () => {
    if (activeModalItem) {
      setUploadedFileName(`${activeModalItem.subject.toLowerCase()}_solution_aarav_sharma.pdf`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;

    const fileToRecord = uploadedFileName || `${activeModalItem.subject.toLowerCase()}_submission.pdf`;

    setHomeworkList(prev => prev.map(item => {
      if (item.id === activeModalItem.id) {
        return {
          ...item,
          status: 'SUBMITTED',
          studentSubmissionFile: fileToRecord
        };
      }
      return item;
    }));

    setToast(`Assignment "${activeModalItem.title}" uploaded to instructor.`);
    setActiveModalItem(null);
    setSubmissionNotes('');
    setUploadedFileName('');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework & Task Center"
        subtitle="Submit assignments, track submission deadlines & review mentor feedback"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <FilterBar
          options={[
            { id: 'ALL', label: 'All Tasks', count: homeworkList.length },
            { id: 'PENDING', label: 'Pending Due', count: homeworkList.filter(h => h.status === 'PENDING').length },
            { id: 'SUBMITTED', label: 'Submitted', count: homeworkList.filter(h => h.status === 'SUBMITTED').length },
            { id: 'EVALUATED', label: 'Graded', count: homeworkList.filter(h => h.status === 'EVALUATED').length }
          ]}
          selectedId={filter}
          onSelect={(id) => setFilter(id as any)}
        />
      </div>

      {/* Homework List */}
      <div className="space-y-3.5">
        {filtered.map((item) => (
          <Card key={item.id} className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {item.subject}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500">{item.teacher}</span>
                  <StatusBadge status={item.status === 'EVALUATED' ? 'COMPLETED' : item.status === 'SUBMITTED' ? 'PENDING' : 'DRAFT'} />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {item.title}
                </h3>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>

                {item.attachmentName && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    <Paperclip className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Teacher Worksheet: {item.attachmentName}</span>
                  </div>
                )}

                {/* Evaluated Marks & Teacher Feedback Banner */}
                {item.status === 'EVALUATED' && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Teacher Grade Awarded:</span>
                      </span>
                      <span className="font-mono text-sm">{item.score}</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1">
                      "{item.teacherFeedback}"
                    </p>
                  </div>
                )}

                {/* Submitted file banner */}
                {item.status === 'SUBMITTED' && item.studentSubmissionFile && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Submitted file: <strong className="font-mono text-slate-700 dark:text-slate-300">{item.studentSubmissionFile}</strong></span>
                  </div>
                )}
              </div>

              {/* Due Date & Action Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Due Date</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.dueDate}</span>
                  </div>
                </div>

                {item.status === 'PENDING' ? (
                  <button
                    onClick={() => handleOpenSubmission(item)}
                    className="mt-3 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                ) : (
                  <span className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status === 'EVALUATED' ? 'Graded' : 'Turned In'}</span>
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Submission Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {activeModalItem.subject}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Turn In Assignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Solution File
                </label>
                
                <div 
                  onClick={handleSimulateFileUpload}
                  className="p-4 border-2 border-dashed border-teal-300 dark:border-teal-800 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 text-center cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors"
                >
                  <Upload className="w-6 h-6 text-teal-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {uploadedFileName ? uploadedFileName : 'Click to Attach Assignment Document'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports PDF, DOCX, JPG, PNG (Max 25 MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes for Teacher (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="e.g. Attached solution with graphs for problem 4.2..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800 shadow-sm"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
