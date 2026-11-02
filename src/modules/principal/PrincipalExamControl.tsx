/**
 * FutureSchool - Principal Exam Control Center
 * Manages Hall Ticket clearance, fee blocks, and controlled overrides with audited reasons
 */

import React, { useState } from 'react';
import { PageHeader, StatCard, SearchInput } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useWorkflow } from '../../hooks/useWorkflow';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  FileCheck, 
  AlertTriangle,
  History
} from 'lucide-react';

export const PrincipalExamControl: React.FC = () => {
  const { hallTicketCleared, overrideHallTicketClearance, fastForwardScenario } = useWorkflow();
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const handleConfirmOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    overrideHallTicketClearance(overrideReason);
    setShowOverrideModal(false);
    setToast(`Principal override executed for GVS-2027-0001. Audit logged: "${overrideReason}". Admit card released.`);
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Exam Control & Hall Ticket Desk"
        subtitle="Oversight of exam eligibility, fee dues clearance, and audited executive overrides"
        breadcrumbs={[{ label: 'Principal', href: '/principal/dashboard' }, { label: 'Exam Control' }]}
        actions={
          <Button variant="outline" size="sm" onClick={() => fastForwardScenario(3)}>
            Fast-Forward Scenario 3
          </Button>
        }
      />

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Eligible Candidates"
          value="604 Students"
          subtitle="Annual Board & Term Examinations"
          icon={FileCheck}
          color="teal"
        />
        <StatCard
          title="Hall Tickets Released"
          value={hallTicketCleared ? '604 / 604' : '598 / 604'}
          subtitle={hallTicketCleared ? '100% Cleared' : '6 Blocked on Fee Clearance'}
          icon={hallTicketCleared ? CheckCircle2 : AlertTriangle}
          color={hallTicketCleared ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Executive Overrides Logged"
          value={hallTicketCleared ? '1 Active' : '0'}
          subtitle="Hardship Undertaking Policy"
          icon={ShieldAlert}
          color="blue"
        />
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Candidate Eligibility & Clearance Roster</h3>
            <p className="text-xs text-gray-500">Class 10-A Mid-Term Examination 2027</p>
          </div>
          <div className="w-full sm:w-64">
            <SearchInput placeholder="Search student or roll number..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Fee Clearance</th>
                <th className="py-3 px-4">Admit Card Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/70">
                <td className="py-3.5 px-4 font-mono font-bold text-xs text-teal-800">GVS-2027-0001</td>
                <td className="py-3.5 px-4 font-semibold text-gray-900">Aarav Sharma</td>
                <td className="py-3.5 px-4 text-gray-600">Class 10-A</td>
                <td className="py-3.5 px-4 font-medium text-emerald-700">96.4% (Eligible)</td>
                <td className="py-3.5 px-4">
                  {hallTicketCleared ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Cleared (Principal Override)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Dues (₹24,500)
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {hallTicketCleared ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> Released
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Blocked
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {!hallTicketCleared ? (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => setShowOverrideModal(true)}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      Executive Override
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Override Active
                    </Button>
                  )}
                </td>
              </tr>

              <tr className="hover:bg-gray-50/70">
                <td className="py-3.5 px-4 font-mono font-bold text-xs text-teal-800">GVS-2027-0002</td>
                <td className="py-3.5 px-4 font-semibold text-gray-900">Aditi Rao</td>
                <td className="py-3.5 px-4 text-gray-600">Class 10-A</td>
                <td className="py-3.5 px-4 font-medium text-emerald-700">92.1% (Eligible)</td>
                <td className="py-3.5 px-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Paid in Full
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" /> Released
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-xs text-gray-400">Standard Clearance</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Override Modal */}
      <Modal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        title="Execute Principal Hall Ticket Override"
      >
        <form onSubmit={handleConfirmOverride} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            <p className="font-semibold mb-1">Institutional Audit Notice:</p>
            This action bypasses standard automated fee clearance for student <strong>Aarav Sharma (GVS-2027-0001)</strong>. 
            The reason will be permanently recorded in the administrative compliance log.
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Directive Reason / Audit Justification
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              rows={3}
              placeholder="e.g., Parent submitted written undertaking for fee clearance post-harvest on Apr 30; student cleared for exams."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="outline" type="button" onClick={() => setShowOverrideModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit">
              Sign & Unlock Admit Card
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
