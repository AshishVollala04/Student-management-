/**
 * FutureSchool - Admin Operations (Execution Queue & Transport Management)
 * Includes Scenario 7 and Scenario 4 workflow connections
 */

import React, { useState } from 'react';
import { PageHeader, StatCard, SearchInput } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useWorkflow } from '../../hooks/useWorkflow';
import { 
  Bus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Play,
  RotateCcw,
  Check,
  User,
  Users
} from 'lucide-react';

// ==========================================
// 1. ADMIN EXECUTION QUEUE (Scenario 7)
// ==========================================
export const AdminExecutionQueue: React.FC = () => {
  const { configChanges, executeConfigChange, fastForwardScenario } = useWorkflow();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExecute = (id: string, title: string) => {
    executeConfigChange(id);
    setSuccessMsg(`Successfully executed and deployed: "${title}" into live system.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approved-for-Execution Queue"
        subtitle="Final administrative deployment for policies and schedules signed off by Principal"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Execution Queue' }]}
        actions={
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fastForwardScenario(7)}
          >
            <Play className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Fast-Forward Scenario 7
          </Button>
        }
      />

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Principal Approved Jobs"
          value={String(configChanges.filter(c => c.status === 'APPROVED').length)}
          subtitle="Ready for execution"
          icon={CheckCircle2}
          color="teal"
        />
        <StatCard
          title="Executed This Term"
          value={String(configChanges.filter(c => c.status === 'EXECUTED').length)}
          subtitle="Active in production"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Awaiting Principal Review"
          value={String(configChanges.filter(c => c.status === 'PENDING_APPROVAL').length)}
          subtitle="Under executive desk"
          icon={Clock}
          color="amber"
        />
      </div>

      <div className="space-y-4">
        {configChanges.map((cfg) => (
          <Card key={cfg.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{cfg.title}</h3>
                  <StatusBadge status={cfg.status} />
                </div>
                <p className="text-sm text-gray-600">{cfg.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span>Author: <strong>{cfg.requestedBy}</strong></span>
                  <span>•</span>
                  <span>Submitted: {cfg.requestedAt}</span>
                  {cfg.approvedAt && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">
                        Principal Sign-off: {cfg.approvedAt}
                      </span>
                    </>
                  )}
                  {cfg.executedAt && (
                    <>
                      <span>•</span>
                      <span className="text-teal-700 font-semibold">
                        Admin Executed: {cfg.executedAt}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {cfg.status === 'APPROVED' ? (
                  <Button
                    variant="primary"
                    onClick={() => handleExecute(cfg.id, cfg.title)}
                  >
                    <Play className="w-4 h-4 mr-1.5" />
                    Deploy & Execute Config
                  </Button>
                ) : cfg.status === 'EXECUTED' ? (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-600" />
                    Deployed in Production
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Under Principal Review
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

// ==========================================
// 2. ADMIN TRANSPORT OPERATIONS (Scenario 4)
// ==========================================
export const AdminTransport: React.FC = () => {
  const { transportRequests, approveTransportRequest, fastForwardScenario } = useWorkflow();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [routes] = useState([
    {
      id: 'RT-04',
      name: 'Route 4 - Koramangala & HSR',
      vehicle: 'Bus KA-01-F-4921 (Tata Starbus 40-Seater)',
      driver: 'Ramesh Naik (Ph: +91 98450 11223)',
      capacity: 40,
      occupied: 38,
      status: 'NORMAL',
    },
    {
      id: 'RT-07',
      name: 'Route 7 - Indiranagar & Cambridge Layout',
      vehicle: 'Bus KA-01-F-8812 (Ashok Leyland 40-Seater)',
      driver: 'Suresh Gowda (Ph: +91 98450 99881)',
      capacity: 40,
      occupied: 38,
      status: 'HIGH_DEMAND',
    },
    {
      id: 'RT-01',
      name: 'Route 1 - Whitefield & ITPL',
      vehicle: 'Bus KA-01-F-1029 (Tata Starbus 45-Seater)',
      driver: 'Manjunath B. (Ph: +91 98450 44556)',
      capacity: 45,
      occupied: 42,
      status: 'NORMAL',
    },
  ]);

  const handleApprove = (id: string) => {
    approveTransportRequest(id);
    setSuccessMsg('Route change request approved! Capacity reallocated and Route 7 seat confirmed.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transport Fleet & Route Allocation"
        subtitle="Manage 12 buses, 8 GPS-tracked routes, and parent route transfer requests"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Transport' }]}
        actions={
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fastForwardScenario(4)}
          >
            <Play className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Fast-Forward Scenario 4
          </Button>
        }
      />

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pending Parent Route Requests */}
      <Card className="p-6 border-l-4 border-l-amber-500">
        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Bus className="w-5 h-5 text-amber-600" />
          Parent Route Transfer Requests
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Review parent requests for stop changes or route transfers with automated vehicle capacity validation.
        </p>

        {transportRequests.length > 0 ? (
          <div className="space-y-4">
            {transportRequests.map((req) => (
              <div 
                key={req.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-sm">{req.studentName}</span>
                    <span className="text-xs text-gray-500 font-mono">({req.studentId})</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Transfer from <strong className="text-red-700">{req.currentRoute}</strong> to{' '}
                    <strong className="text-teal-800">{req.requestedRoute}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Reason: {req.reason} • Route 7 Seat Capacity Check: <strong>38/40 Occupied (2 Seats Free)</strong>
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {req.status === 'PENDING' ? (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleApprove(req.id)}
                    >
                      <Check className="w-4 h-4 mr-1" /> Sanction Seat Reassignment
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Transfer Sanctioned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No active transfer requests.</p>
        )}
      </Card>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((rt) => {
          const occupancyRate = Math.round((rt.occupied / rt.capacity) * 100);
          return (
            <Card key={rt.id} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {rt.id}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {rt.occupied} / {rt.capacity} seats
                </span>
              </div>

              <h4 className="font-bold text-gray-900 text-base">{rt.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{rt.vehicle}</p>
              <p className="text-xs text-teal-700 font-medium mt-1">{rt.driver}</p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Occupancy</span>
                  <span className="font-semibold text-gray-800">{occupancyRate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${occupancyRate >= 95 ? 'bg-amber-500' : 'bg-teal-600'}`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
