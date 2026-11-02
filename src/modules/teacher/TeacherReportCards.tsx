import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Award, CheckCircle2, AlertCircle, Send, Globe } from 'lucide-react';

export const TeacherReportCards: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [toast, setToast] = useState<string | null>(null);

  const reportCard = workflow.reportCards.find(r => r.studentId === 'GVS-2027-0001');
  const marks = workflow.marksEntries.find(m => m.classId === 'Grade 10-A');

  const isPrincipalApproved = marks?.principalApprovalStatus === 'APPROVED' || reportCard?.principalSignature;
  const isPublished = reportCard?.isPublished;

  const handlePublishClass = () => {
    store.classTeacherPublishReportCards();
    setToast('Officially published Term 1 results to all Grade 10-A students & parents.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Card Preparation & Publication"
        subtitle="Grade 10-A Mentor Governance · Principal Sign-off & Class-Wide Release"
        badge={
          isPublished ? (
            <StatusBadge status="COMPLETED" />
          ) : isPrincipalApproved ? (
            <StatusBadge status="APPROVED" />
          ) : (
            <StatusBadge status="PENDING" />
          )
        }
        actions={
          isPrincipalApproved && !isPublished ? (
            <button
              onClick={handlePublishClass}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-900/20"
            >
              <Globe className="w-4 h-4" />
              <span>Publish to Class 10-A (Cross-Role)</span>
            </button>
          ) : undefined
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Workflow Stage Tracker */}
      <Card className="p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Institutional Report Card Pipeline:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Step 1: Faculty Marks</span>
            <div className="font-bold text-slate-900 dark:text-white mt-1">10-A Marks Entry</div>
            <StatusBadge status={marks?.status || 'DRAFT'} className="mt-2" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Step 2: Principal Signature</span>
            <div className="font-bold text-slate-900 dark:text-white mt-1">Executive Sign-off</div>
            <StatusBadge status={isPrincipalApproved ? 'APPROVED' : 'PENDING'} className="mt-2" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Step 3: Portal Publication</span>
            <div className="font-bold text-slate-900 dark:text-white mt-1">Student / Parent View</div>
            <StatusBadge status={isPublished ? 'COMPLETED' : 'PENDING'} className="mt-2" />
          </div>
        </div>
      </Card>

      {/* Sample Student Grade Sheet in Preparation */}
      <Card className="p-5">
        <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <CardTitle>Candidate Roster: Aarav Sharma (#18)</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Calculated Term 1 Aggregate: 92.4% (Grade A1)</p>
          </div>
          {isPublished && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              Live on Student & Parent Portal
            </span>
          )}
        </CardHeader>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Class Mentor Conduct Remark:
            </span>
            <p className="text-slate-600 dark:text-slate-400 italic">
              "{reportCard?.conductRemarks}"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const TeacherHallTickets: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [toast, setToast] = useState<string | null>(null);

  const ticket = workflow.hallTickets.find(h => h.studentId === 'GVS-2027-0001');

  const handleRelease = (studentId: string) => {
    store.classTeacherReleaseHallTicket(studentId);
    setToast('Hall Ticket unlocked and released for candidate Aarav Sharma.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hall Ticket Release (Class 10-A)"
        subtitle="Verify institutional fee clearance and attendance qualification before exam release"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {ticket?.studentName} (Roll #{18})
              </h4>
              <StatusBadge status={ticket?.classTeacherReleased ? 'APPROVED' : 'PENDING'} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="text-emerald-600 font-semibold">Attendance: 94.2% (Qualified)</span>
              <span>·</span>
              <span className={ticket?.feeCleared ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                Fees: {ticket?.feeCleared ? 'Cleared' : '$1,200 Pending'}
              </span>
            </div>
          </div>

          <div className="self-end sm:self-center">
            {!ticket?.classTeacherReleased ? (
              <button
                onClick={() => handleRelease('GVS-2027-0001')}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Release Admit Card
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Released to Candidate
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
