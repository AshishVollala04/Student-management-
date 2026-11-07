import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CheckCircle2, RotateCcw, AlertCircle, FileText, Check, ShieldCheck } from 'lucide-react';

export const PrincipalApprovals: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [toast, setToast] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);

  const marks10A = workflow.marksEntries.find(m => m.classId === 'Grade 10-A');
  const pendingConfig = workflow.configs.find(c => c.status === 'PENDING');

  const handleApproveMarks = () => {
    store.principalApproveMarks('Grade 10-A', 'Mathematics');
    store.principalApproveReportCards();
    setToast('Approved Grade 10-A Mathematics marksheet and endorsed report cards.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleReturnMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) return;
    store.principalReturnMarks('Grade 10-A', 'Mathematics', returnReason);
    setShowReturnModal(false);
    setReturnReason('');
    setToast('Returned marksheet to Mrs. Sarah Jenkins with official directive note.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleApproveConfig = (configId: string) => {
    store.principalApproveConfig(configId);
    setToast('Approved operational configuration. Queued for Administrative Execution.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Approval Desk"
        subtitle="Institutional checks, academic mark verification, and configuration sign-offs"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. Academic Marksheet Verification (Class 10-A) */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Grade 10-A Mathematics Marksheet Endorsement
              </h3>
              <StatusBadge status={marks10A?.principalApprovalStatus || 'PENDING'} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Faculty: Mrs. Sarah Jenkins · Term 1 Mid-Year Examination (Max: 100)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Class Average: 91.2%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Candidates</span>
              <strong>4 Evaluated</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">A1 Distinction</span>
              <strong className="text-emerald-600">3 Students (75%)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Absentee (AB)</span>
              <strong className="text-rose-600">1 Student (Devansh Reddy)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Class Mentor</span>
              <strong>Mrs. Sarah Jenkins</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {marks10A?.principalApprovalStatus !== 'APPROVED' ? (
            <>
              <button
                onClick={() => setShowReturnModal(true)}
                className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return with Reason</span>
              </button>
              <button
                onClick={handleApproveMarks}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Endorse & Sign Marksheet</span>
              </button>
            </>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Officially Endorsed & Ready for Publication
            </span>
          )}
        </div>
      </Card>

      {/* 2. Admin Configuration Approval */}
      {pendingConfig && (
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Administrative Policy Sign-off
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {pendingConfig.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Version: <strong className="font-mono text-slate-700 dark:text-slate-300">{pendingConfig.version}</strong> · Prepared by: {pendingConfig.submittedByAdmin}
              </p>
            </div>

            <button
              onClick={() => handleApproveConfig(pendingConfig.id)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 self-end sm:self-center"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Executive Sign-off</span>
            </button>
          </div>
        </Card>
      )}

      {/* Return Directive Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleReturnMarks} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Return Marksheet to Class Teacher
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify the academic discrepancy, moderation rule or verification required.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Directive Reason Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Please verify medical re-exam sanction for candidate Devansh Reddy before final grade compilation..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700"
                >
                  Return to Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const PrincipalExamControl: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [toast, setToast] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const ticket = workflow.hallTickets.find(h => h.studentId === 'GVS-2027-0001');

  const handleOverride = (e: React.FormEvent) => {
    e.preventDefault();
    store.principalOverrideHallTicket('GVS-2027-0001', overrideReason || 'Executive hardship clearance');
    setShowOverrideModal(false);
    setToast('Authorized Principal Override: Hall Ticket released for Aarav Sharma.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Control & Hall Ticket Oversight"
        subtitle="Institutional examination clearance policies, audit integrity, and controlled principal overrides"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Candidate Admit Card Audit: {ticket?.studentName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mid-Year Comprehensive Examination 2026 · Class 10-A
            </p>
          </div>
          <StatusBadge status={ticket?.classTeacherReleased ? 'APPROVED' : 'BLOCKED'} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Fee Clearance</span>
            <strong className={ticket?.feeCleared ? 'text-emerald-600' : 'text-rose-600'}>
              {ticket?.feeCleared ? 'Cleared' : 'Pending Dues'}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Attendance</span>
            <strong className="text-emerald-600">Qualified (94.2%)</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Executive Override</span>
            <strong className={ticket?.principalOverride ? 'text-purple-600' : 'text-slate-400'}>
              {ticket?.principalOverride ? 'Active Override' : 'None'}
            </strong>
          </div>
        </div>

        {!ticket?.classTeacherReleased && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => setShowOverrideModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Exercise Controlled Principal Override</span>
            </button>
          </div>
        )}
      </Card>

      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleOverride} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Controlled Principal Admit Card Override
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Overrides fee block for extraordinary compassionate/scholarship circumstances with audit trail.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Audit Rationale
                </label>
                <textarea
                  rows={3}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="State academic reason or hardship provision warranting release..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700"
                >
                  Authorize Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
