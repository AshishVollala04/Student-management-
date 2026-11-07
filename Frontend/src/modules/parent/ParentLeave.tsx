import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CalendarCheck, Plus, CheckCircle2, Clock, FileText } from 'lucide-react';

export const ParentLeave: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [showModal, setShowModal] = useState(false);
  const [leaveType, setLeaveType] = useState('Medical Leave');
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-11');
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    store.submitParentLeave({
      studentId: 'GVS-2027-0001',
      studentName: 'Aarav Sharma',
      grade: 'Grade 10',
      section: 'A',
      leaveType,
      startDate,
      endDate,
      reason,
      parentName: 'Dr. Rajesh Sharma'
    });

    setShowModal(false);
    setReason('');
    setToast('Leave request submitted to Class Mentor Mrs. Sarah Jenkins.');
    setTimeout(() => setToast(null), 3000);
  };

  const requests = workflow.leaveRequests.filter(l => l.studentId === 'GVS-2027-0001');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Leave Applications"
        subtitle="Submit medical or personal absence notices to class mentor with review tracking"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Apply New Leave</span>
          </button>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-3">
        {requests.map((req) => (
          <Card key={req.id} className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {req.leaveType}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Reason: "{req.reason}"
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                  <span>Period: <strong className="text-slate-800 dark:text-slate-200">{req.startDate} to {req.endDate}</strong></span>
                  <span>·</span>
                  <span>Applied on: {req.appliedDate}</span>
                </div>
                {req.reviewedBy && (
                  <div className="mt-2 text-[11px] text-emerald-600 font-semibold">
                    Reviewed by: {req.reviewedBy} ({req.reviewComment})
                  </div>
                )}
              </div>

              <div className="self-end sm:self-center">
                {req.status === 'PENDING' ? (
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Mentor In Review
                  </span>
                ) : (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Sanctioned
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Apply Student Absence Leave
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Candidate: Aarav Sharma (Grade 10-A)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Category
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="Medical Leave">Medical Leave (Doctor prescription)</option>
                  <option value="Casual / Family Event">Casual / Family Event</option>
                  <option value="Academic Olympiad Competition">Academic Olympiad Competition</option>
                  <option value="Bereavement Leave">Bereavement Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason & Medical Specifics
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide detailed explanation for class mentor..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
