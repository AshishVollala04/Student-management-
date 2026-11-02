import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AlertCircle, MessageSquare, Plus, CheckCircle2, RotateCcw } from 'lucide-react';

export const ParentComplaints: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [showNewModal, setShowNewModal] = useState(false);
  const [category, setCategory] = useState<'ACADEMIC' | 'TRANSPORT' | 'SAFETY' | 'FACILITY' | 'OTHER'>('TRANSPORT');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const complaints = workflow.complaints.filter(c => c.studentId === 'GVS-2027-0001');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    workflow.complaints.unshift({
      id: 'cmp_' + Date.now(),
      studentId: 'GVS-2027-0001',
      parentName: 'Dr. Rajesh Sharma',
      category,
      subject,
      description: desc,
      status: 'PENDING',
      isEscalatedToPrincipal: false,
      responses: [],
      parentConfirmedResolved: false
    });

    setShowNewModal(false);
    setSubject('');
    setDesc('');
    setToast('Grievance ticket created and logged in School Control Registry.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmResolved = (id: string) => {
    store.resolveComplaint(id);
    setToast('Thank you! Grievance recorded as confirmed resolved.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grievance & Resolution Center"
        subtitle="Transparent campus issue reporting with response tracking and principal escalation"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Formal Grievance</span>
          </button>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-4">
        {complaints.map((cmp) => (
          <Card key={cmp.id} className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {cmp.category}
                  </span>
                  <StatusBadge status={cmp.status} />
                  {cmp.isEscalatedToPrincipal && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                      Escalated to Principal
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {cmp.subject}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Ticket #{cmp.id}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              "{cmp.description}"
            </p>

            {/* Official Responses */}
            {cmp.responses.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Campus Administration Responses:
                </span>
                {cmp.responses.map((resp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs">
                    <div className="flex items-center justify-between font-semibold text-teal-900 dark:text-teal-200">
                      <span>{resp.author} ({resp.role})</span>
                      <span className="text-[10px] text-teal-600 font-mono">{resp.timestamp}</span>
                    </div>
                    <p className="mt-1 text-slate-700 dark:text-slate-300">
                      {resp.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Resolution confirmation by Parent */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {cmp.parentConfirmedResolved ? 'Resolution acknowledged by parent.' : 'Awaiting parent confirmation of resolution.'}
              </span>

              {!cmp.parentConfirmedResolved && (
                <button
                  onClick={() => handleConfirmResolved(cmp.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Issue Resolved</span>
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* New Complaint Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Log Institutional Grievance
                </h3>
                <p className="text-xs text-slate-500">
                  Managed under the institutional parent charter and escalates directly to leadership.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Concern Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                >
                  <option value="ACADEMIC">Academic / Teaching Concern</option>
                  <option value="TRANSPORT">Transit / Bus Route Safety</option>
                  <option value="SAFETY">Campus Welfare & Safety</option>
                  <option value="FACILITY">Dining / STEM Facilities</option>
                  <option value="OTHER">General Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Schedule delay on Morning Route 4 at Ring Road"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Provide timestamps, location, personnel involved, and specific impact on your ward..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700"
                >
                  File Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
