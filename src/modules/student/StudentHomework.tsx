import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FilterBar } from '../../components/common/CommonUi';
import { BookOpen, Upload, CheckCircle2, Clock, Check, AlertCircle } from 'lucide-react';

export const StudentHomework: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'DUE' | 'COMPLETED'>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedList, setSubmittedList] = useState<string[]>(['hw_3']);
  const [toast, setToast] = useState<string | null>(null);

  const homeworkItems = [
    {
      id: 'hw_1',
      subject: 'Mathematics',
      title: 'Quadratic Equations: Real Roots & Discriminant Analysis',
      teacher: 'Mrs. Sarah Jenkins',
      dueDate: '04 Nov 2026',
      status: submittedList.includes('hw_1') ? 'COMPLETED' : 'PENDING',
      description: 'Complete problem sets 4.1 to 4.4 from Chapter 4. Include graph sketches for parabolic vertices.'
    },
    {
      id: 'hw_2',
      subject: 'Physics',
      title: 'Snell\'s Law & Total Internal Reflection Lab Report',
      teacher: 'Dr. Michael Chen',
      dueDate: '06 Nov 2026',
      status: submittedList.includes('hw_2') ? 'COMPLETED' : 'PENDING',
      description: 'Summarize ray tracing data from prism refraction experiment. Plot angle of deviation vs incidence.'
    },
    {
      id: 'hw_3',
      subject: 'Computer Science',
      title: 'Object-Oriented Banking Engine in Python',
      teacher: 'Mr. Alan Turing Jr.',
      dueDate: '30 Oct 2026',
      status: 'COMPLETED',
      description: 'Write unit tests for Account class with overdraft protection logic.'
    }
  ];

  const filtered = homeworkItems.filter(h => {
    if (filter === 'DUE') return h.status === 'PENDING';
    if (filter === 'COMPLETED') return h.status === 'COMPLETED';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;
    setSubmittedList(prev => [...prev, activeModalItem.id]);
    setToast(`Assignment "${activeModalItem.title}" uploaded to instructor.`);
    setActiveModalItem(null);
    setSubmissionText('');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework & Class Tasks"
        subtitle="Submit assignments and review teacher feedback"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <FilterBar
          options={[
            { id: 'ALL', label: 'All Tasks', count: homeworkItems.length },
            { id: 'DUE', label: 'Due / Pending', count: homeworkItems.filter(h => h.status === 'PENDING').length },
            { id: 'COMPLETED', label: 'Submitted', count: homeworkItems.filter(h => h.status === 'COMPLETED').length }
          ]}
          selectedId={filter}
          onSelect={(id) => setFilter(id as any)}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {item.subject}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span>Instructor: <strong>{item.teacher}</strong></span>
                  <span>Due: <strong className="text-rose-600 dark:text-rose-400">{item.dueDate}</strong></span>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {item.status === 'PENDING' ? (
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Work</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <Check className="w-4 h-4" /> Submitted
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {activeModalItem.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Submit Work: {activeModalItem.title}
                </h3>
              </div>

              <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800/40">
                <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select assignment document or scan (.pdf, .docx, .png)
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Prototype mock upload simulation</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Notes for Instructor (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="e.g. Attached handwritten derivation with graph plots on page 3..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800"
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
