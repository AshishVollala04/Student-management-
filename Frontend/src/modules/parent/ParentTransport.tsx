import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Bus, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  Navigation
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../mock/academicData';

export const ParentTransport: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [targetRoute, setTargetRoute] = useState('Route 7 (Express Metro Link)');
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const activeRequest = workflow.transportRequests.find(t => t.studentId === 'GVS-2027-0001');

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    store.submitTransportChange({
      studentId: 'GVS-2027-0001',
      studentName: 'Aarav Sharma',
      currentRoute: 'Route 14 (East Quadrant)',
      requestedRoute: targetRoute,
      reason,
      parentName: 'Dr. Rajesh Sharma'
    });

    setShowRequestModal(false);
    setReason('');
    setToast('Transport route change request forwarded to Admin Operations.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Bus Route & Commute Safety"
        subtitle="Live transit schedule, bus stop monitoring & official route re-allocation"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            Request Route Transfer
          </button>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Safety Notice on Campus Transit Protocol */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          <strong>Fleet Telematics Active:</strong> Bus KA-01-FS-4012 is equipped with verified GPS transponders and speed governors compliant with Central Motor Vehicle Safety Standards.
        </span>
      </div>

      {/* Live Transit Radar Card */}
      <Card className="p-5 border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/30 via-white to-white dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Bus className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Morning Commute Transit
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  On Route (32 km/h)
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Route 14: East Quadrant (Palm Meadows Loop)
              </h3>
              <p className="text-xs text-slate-500">
                Vehicle: School Bus #{STUDENT_PROFILE.transport.busNumber} · Capacity: 36 / 32 Occupied
              </p>
            </div>
          </div>
          <StatusBadge status="ACTIVE" />
        </div>

        {/* Live Proximity Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Navigation className="w-4 h-4 text-teal-400 animate-spin" />
            <div>
              <span className="font-bold text-teal-300 block">Next Scheduled Stop:</span>
              <span className="text-slate-300">Palm Meadows Main Gate (Stop #6)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Arrival</span>
            <span className="font-mono text-base font-bold text-emerald-400">07:15 AM (4 mins)</span>
          </div>
        </div>

        {/* Driver & Schedule Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pick-Up Stop</span>
            <strong className="text-slate-900 dark:text-white">Palm Meadows Main Gate</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Morning Time</span>
            <strong className="font-mono text-teal-700 dark:text-teal-400">07:15 AM Pickup</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Certified Driver</span>
            <strong className="text-slate-900 dark:text-white">Mr. Suresh Kumar</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Driver Helpline</span>
            <a href="tel:+919886033441" className="font-mono text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>+91 98860 33441</span>
            </a>
          </div>
        </div>
      </Card>

      {/* Active Transfer Request (if any from workflow) */}
      {activeRequest && (
        <Card className="p-5 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Route Transfer Application
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Target Route: {activeRequest.requestedRoute}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Reason: "{activeRequest.reason}"
              </p>
              {activeRequest.adminNote && (
                <p className="text-xs text-emerald-600 font-bold mt-1">
                  Administrative Decision: {activeRequest.adminNote}
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
                  Operations team verifies seat capacity and stops within 24 hours.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Requested Target Route
                </label>
                <select
                  value={targetRoute}
                  onChange={(e) => setTargetRoute(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="Route 7 (Express Metro Link)">Route 7: Express Metro Link (Seats Avail: 4)</option>
                  <option value="Route 2 (Central Commercial Bypass)">Route 2: Central Commercial Bypass (Seats Avail: 1)</option>
                  <option value="Route 5 (Riverfront Tech Corridor)">Route 5: Riverfront Tech Corridor (Waitlist: 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Relocation Address or Reason
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
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800 shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
