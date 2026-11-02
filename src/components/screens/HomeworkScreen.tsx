import React, { useState } from 'react';
import { HomeworkItem } from '../../types';
import { BookOpen, CheckCircle2, Circle, Clock, Filter, Upload, Check, AlertCircle, FileText, ChevronRight } from 'lucide-react';

interface HomeworkScreenProps {
  homeworkList: HomeworkItem[];
  onToggleStatus: (id: string) => void;
  onSubmitHomework: (id: string, notes: string) => Promise<void>;
}

export const HomeworkScreen: React.FC<HomeworkScreenProps> = ({
  homeworkList,
  onToggleStatus,
  onSubmitHomework
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [submissionModalItem, setSubmissionModalItem] = useState<HomeworkItem | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Extract unique subjects
  const subjects = ['all', ...Array.from(new Set(homeworkList.map(h => h.subject)))];

  const filteredItems = homeworkList.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || item.subject === filterSubject;
    return matchesStatus && matchesSubject;
  });

  const pendingCount = homeworkList.filter(h => h.status === 'pending').length;
  const completedCount = homeworkList.filter(h => h.status === 'completed').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalItem) return;

    setIsSubmitting(true);
    await onSubmitHomework(submissionModalItem.id, submissionNotes || 'File uploaded via student portal');
    setIsSubmitting(false);
    setSuccessToast(`Homework for ${submissionModalItem.subject} submitted successfully!`);
    setSubmissionModalItem(null);
    setSubmissionNotes('');

    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Pending Submissions
            </span>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 tabular-nums">
              {pendingCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Completed Tasks
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
              {completedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Controls: Status Filter & Subject Dropdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({homeworkList.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="subject-filter-select" className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">Subject:</label>
          <select
            id="subject-filter-select"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            {subjects.map(s => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Subjects' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No tasks match your filter
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up with your school assignments!
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCompleted = item.status === 'completed';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item.id)}
                    className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-amber-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {item.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          Due: {item.dueDate}
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-sm font-bold text-slate-900 dark:text-white mt-1 ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                      <span>Assigned by: <strong className="text-slate-700 dark:text-slate-300">{item.teacherName}</strong></span>
                      
                      {!isCompleted ? (
                        <button
                          onClick={() => setSubmissionModalItem(item)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Work</span>
                        </button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Submitted {item.submittedAt || 'on portal'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Submission Modal */}
      {submissionModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {submissionModalItem.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Submit Homework: {submissionModalItem.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Due: {submissionModalItem.dueDate} · Teacher: {submissionModalItem.teacherName}
                </p>
              </div>

              {/* Fake file dropzone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Click to attach assignment PDF / Word doc
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                  Supports .pdf, .docx, .png, .py (Max 25MB)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Notes for Teacher (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="e.g. Completed questions 1-14. Added graph visualization on page 4."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmissionModalItem(null)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
