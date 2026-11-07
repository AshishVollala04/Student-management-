import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const TeacherLeaveRequests: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [toast, setToast] = useState<string | null>(null);

  const leaves = workflow.leaveRequests;

  const handleApprove = (id: string, name: string) => {
    store.approveParentLeave(id, 'Mrs. Sarah Jenkins (Class Mentor 10-A)', 'Sanctioned with homework concession');
    setToast(`Sanctioned leave application for ${name}. Updated in Parent & Student portal.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Leave Sanctions (Class 10-A)"
        subtitle="Review guardian-submitted leave applications with conflict detection"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-3">
        {leaves.map((req) => (
          <Card key={req.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {req.studentName} ({req.grade}-{req.section})
                  </span>
                  <StatusBadge status={req.status} />
                  <span className="text-xs text-slate-400">· Applied by: {req.parentName}</span>
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200">{req.leaveType}</strong>: "{req.reason}"
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                  <span>From: {req.startDate}</span>
                  <span>To: {req.endDate}</span>
                  <span>Applied: {req.appliedDate}</span>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {req.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(req.id, req.studentName)}
                      className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sanction Leave</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Sanctioned on File
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
