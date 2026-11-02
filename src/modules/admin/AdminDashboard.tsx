/**
 * FutureSchool - Admin Operations Control Center Dashboard
 * Phase 6 implementation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, ActionCard } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useWorkflow } from '../../hooks/useWorkflow';
import { 
  Users, 
  Bus, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  UserPlus, 
  FileSpreadsheet, 
  Settings,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { transportRequests, configChanges } = useWorkflow();

  const pendingTransportCount = transportRequests.filter(r => r.status === 'PENDING').length;
  const approvedConfigsCount = configChanges.filter(c => c.status === 'APPROVED').length;
  const pendingPrincipalConfig = configChanges.filter(c => c.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Control Center"
        subtitle="School Year 2026-27 • 600 Enrolled Students • 48 Teaching & Non-Teaching Staff"
        breadcrumbs={[{ label: 'Admin Portal', href: '/admin/dashboard' }, { label: 'Control Center' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/audit')}>
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Audit Log
            </Button>
            <Button variant="accent" size="sm" onClick={() => navigate('/admin/admissions')}>
              <UserPlus className="w-4 h-4 mr-1.5" />
              New Student Admission
            </Button>
          </div>
        }
      />

      {/* Top Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Student Strength"
          value="604 / 640"
          subtitle="94.3% Campus capacity"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Fleet Operations"
          value="8 Routes"
          subtitle="12 Buses • 428 Commuters"
          icon={Bus}
          color="blue"
        />
        <StatCard
          title="Term 1 Fee Realization"
          value="96.2%"
          subtitle="₹28,50,000 Collected"
          icon={CreditCard}
          color="emerald"
        />
        <StatCard
          title="Awaiting Admin Execution"
          value={String(approvedConfigsCount)}
          subtitle="Principal endorsed actions"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Action Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Queues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Approved-For-Execution Queue */}
          <Card className="p-6 border-l-4 border-l-teal-600">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  Approved-for-Execution Queue
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configuration changes endorsed by Principal that require Admin deployment
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/execution-queue')}>
                View Queue ({approvedConfigsCount})
              </Button>
            </div>

            {configChanges.length > 0 ? (
              <div className="space-y-3">
                {configChanges.map((cfg) => (
                  <div key={cfg.id} className="p-3.5 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{cfg.title}</span>
                        <StatusBadge status={cfg.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{cfg.description}</p>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => navigate('/admin/execution-queue')}
                    >
                      Process
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">No pending execution jobs.</p>
            )}
          </Card>

          {/* Urgent Attention: Transport & Admissions */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Urgent Operational Demands
            </h3>

            <div className="space-y-3">
              {pendingTransportCount > 0 ? (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-amber-700" />
                      <span className="font-bold text-sm text-amber-900">
                        {pendingTransportCount} Bus Route Shift Request
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 mt-1">
                      Parent requested seat reassignment to Route 7 (Indiranagar). Capacity: 38/40.
                    </p>
                  </div>
                  <Button variant="accent" size="sm" onClick={() => navigate('/admin/transport')}>
                    Review & Sanction
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  All route allocation requests are up to date.
                </div>
              )}

              <div className="p-3.5 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-800 text-sm block">Billing Run: Quarter 2 (July) Pending</span>
                  <span className="text-xs text-gray-500">Scheduled automated invoicing for 604 accounts</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/billing')}>
                  Billing Center
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Links & Operations Calendar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3">
              Quick Administrative Tasks
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/admin/admissions')}
                className="w-full text-left p-2.5 rounded-lg hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors flex items-center justify-between text-sm font-medium text-gray-700 hover:text-teal-900"
              >
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-teal-600" /> Admissions Wizard
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button 
                onClick={() => navigate('/admin/staff')}
                className="w-full text-left p-2.5 rounded-lg hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors flex items-center justify-between text-sm font-medium text-gray-700 hover:text-teal-900"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" /> Staff Onboarding
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button 
                onClick={() => navigate('/admin/academic-structure')}
                className="w-full text-left p-2.5 rounded-lg hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors flex items-center justify-between text-sm font-medium text-gray-700 hover:text-teal-900"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-teal-600" /> Academic Classes & Sections
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button 
                onClick={() => navigate('/admin/timetable-generator')}
                className="w-full text-left p-2.5 rounded-lg hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors flex items-center justify-between text-sm font-medium text-gray-700 hover:text-teal-900"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" /> Timetable Conflict Engine
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button 
                onClick={() => navigate('/admin/bulk-import')}
                className="w-full text-left p-2.5 rounded-lg hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors flex items-center justify-between text-sm font-medium text-gray-700 hover:text-teal-900"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-teal-600" /> Bulk Excel Staging
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3">
              Operations Calendar (April 2027)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-teal-50/50 rounded border border-teal-100">
                <span className="font-bold text-teal-800 block">Apr 18, 2027</span>
                <span className="text-gray-600">Parent-Teacher Meeting (Senior Secondary)</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                <span className="font-bold text-gray-800 block">Apr 24, 2027</span>
                <span className="text-gray-600">CBSE Annual Inspection Documentation Audit</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                <span className="font-bold text-gray-800 block">May 01, 2027</span>
                <span className="text-gray-600">Quarterly Bus Fleet Safety & RTO Recertification</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
