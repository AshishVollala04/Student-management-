import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Users, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2, UserCheck, Bell } from 'lucide-react';

export const PrincipalTeacherLeave: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [toast, setToast] = useState<string | null>(null);

  const leaves = workflow.teacherLeaves;

  const handleApprove = (id: string, name: string) => {
    store.approveTeacherLeave(id, 'Prof. David Vance');
    setToast(`Approved leave for ${name}. Substitute Prof. David Vance allocated.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Leave & Classroom Coverage"
        subtitle="Review teacher leave applications and confirm operational syllabus coverage"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-3">
        {leaves.map((tl) => (
          <Card key={tl.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {tl.teacherName} ({tl.subject})
                  </h4>
                  <StatusBadge status={tl.status} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Reason: "{tl.reason}"
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                  <span>Period: {tl.startDate} to {tl.endDate}</span>
                  <span>·</span>
                  <span>Allocated Substitute: <strong className="text-teal-700 dark:text-teal-300">{tl.substituteTeacherName || 'Pending'}</strong></span>
                </div>
              </div>

              <div className="self-end sm:self-center">
                {tl.status === 'PENDING' ? (
                  <button
                    onClick={() => handleApprove(tl.id, tl.teacherName)}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    Sanction & Allocate Sub
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Sanctioned (Sub: {tl.substituteTeacherName})
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

export const PrincipalComplaints: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [toast, setToast] = useState<string | null>(null);

  const escalated = workflow.complaints;

  const handleResolve = (id: string) => {
    store.resolveComplaint(id);
    setToast('Executive resolution note recorded.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Incidents & Escalated Grievances"
        subtitle="Executive oversight of parent appeals and campus welfare matters"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-3">
        {escalated.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  {c.category} Grievance
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {c.subject}
                </h4>
              </div>
              <StatusBadge status={c.status} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              "{c.description}"
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">Complainant: {c.parentName}</span>
              {c.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolve(c.id)}
                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold"
                >
                  Endorse Executive Resolution
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const PrincipalDelegation: React.FC = () => {
  const [delegated, setDelegated] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Acting Principal Delegation"
        subtitle="Time-scoped, least-privilege executive delegation to Vice Principal or Senior Dean"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <Card className="p-5 max-w-xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Delegate Executive Authority
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          In case of off-campus official conferences or leave, temporary sign-off permissions for student leave and timetable approvals can be delegated to Vice Principal Dr. Elena Rostova.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Designated Acting Principal
            </label>
            <input
              type="text"
              disabled
              value="Dr. Elena Rostova (Vice Principal & Academic Dean)"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium"
            />
          </div>

          <div className="pt-2">
            {!delegated ? (
              <button
                onClick={() => setDelegated(true)}
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Activate 48-Hour Delegation Protocol
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
                ✓ Active Delegation: Dr. Elena Rostova authorized until Nov 3rd, 05:00 PM.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const PrincipalAiSummary: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leadership AI Executive Brief (Mock)"
        subtitle="Automated institutional analytics and operational exceptions briefing"
        badge={
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            Safe Prototype
          </span>
        }
      />

      <Card className="p-6 max-w-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-teal-700 dark:text-teal-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Daily Executive Briefing · Monday, 01 November 2026
          </h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>1. Attendance & Gate Telemetry:</strong> School-wide presence recorded at <strong>96.2%</strong> (591 / 614 students). Grade 12 achieved highest consistency (98.1%). Zero unexcused faculty absences.
          </p>
          <p>
            <strong>2. Academic Evaluation Pipeline:</strong> Class 10-A Mathematics marksheet submitted by Mrs. Sarah Jenkins is pending your review. 3 candidates scored Distinction (&gt;90%). 1 candidate absent due to sanctioned medical leave.
          </p>
          <p>
            <strong>3. Bursar & Fee Clearance:</strong> 89.2% of annual fee target collected. Outstanding amount for Term 2 is $1,200. Hall ticket block is functioning as intended.
          </p>
          <p>
            <strong>4. Transit & Campus Safety:</strong> Route 4 bus dispatch re-timed by 10 minutes earlier. Parent grievance ticket resolved in accordance with institutional policy.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          Note: This brief is generated deterministically from centralized mock state and does not contact external LLM APIs.
        </div>
      </Card>
    </div>
  );
};
