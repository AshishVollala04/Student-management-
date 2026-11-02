import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Bus, MapPin, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ParentTransport: React.FC = () => {
  const [workflow] = useWorkflow();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [targetRoute, setTargetRoute] = useState('Route 7 (Express Metro Link)');
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const activeRequest = workflow.transportRequests.find(t => t.studentId === 'GVS-2027-0001');

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequestModal(false);
    setToast('Transport route change request forwarded to Admin Operations.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bus Route & Transit Operations"
        subtitle="Designated stop schedules, safety driver details, and route allocation requests"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Request Route Transfer
          </button>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Safety Notice (Phase 3 Rule 13: No personal GPS tracking) */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          <strong>Campus Transit Protocol:</strong> Vehicle locations are tracked institutional-wide at campus gates. Individual personal GPS streaming is restricted to prevent device battery depletion and protect pupil privacy.
        </span>
      </div>

      {/* Current Route Allocation Card */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Active Assignment
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Route 4: North Enclave - Pinecrest Loop
              </h3>
              <p className="text-xs text-slate-500">
                Bus Vehicle: Yellow Mini-Coach #FS-BUS-04 (Capacity: 32 / 30 Occupied)
              </p>
            </div>
          </div>
          <StatusBadge status="ACTIVE" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pick-Up Stop</span>
            <strong className="text-slate-900 dark:text-white">Pinecrest Blvd Gate 2</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Arrival</span>
            <strong className="font-mono text-teal-700 dark:text-teal-400">07:25 AM</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Certified Driver</span>
            <strong className="text-slate-900 dark:text-white">Mr. Harish Rawat</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Helpline</span>
            <strong className="font-mono text-slate-600 dark:text-slate-300">+1 555-019-2810</strong>
          </div>
        </div>
      </Card>

      {/* Active Transfer Request (if any from workflow) */}
      {activeRequest && (
        <Card className="p-5 border-orange-200 dark:border-orange-900/60 bg-orange-50/30 dark:bg-orange-950/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                Route Change Request (Under Review)
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Transfer to: {activeRequest.requestedRoute}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Reason: "{activeRequest.reason}"
              </p>
              {activeRequest.adminNote && (
                <p className="text-xs text-emerald-600 font-bold mt-1">
                  Admin Resolution: {activeRequest.adminNote}
                </p>
              )}
            </div>
            <StatusBadge status={activeRequest.status} />
          </div>
        </Card>
      )}

      {/* Route Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Request Transport Route Change
                </h3>
                <p className="text-xs text-slate-500">
                  Operations team verifies seat capacity and tariff differential.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Requested Target Route
                </label>
                <select
                  value={targetRoute}
                  onChange={(e) => setTargetRoute(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Route 7 (Express Metro Link)">Route 7: Express Metro Link (Seats Avail: 4)</option>
                  <option value="Route 2 (Central Commercial Bypass)">Route 2: Central Commercial Bypass (Seats Avail: 1)</option>
                  <option value="Route 5 (Riverfront Tech Corridor)">Route 5: Riverfront Tech Corridor (Waitlist: 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Circumstances / Moving Date
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detail changes in residential address or pickup timing..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800"
                >
                  Transmit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
