/**
 * FutureSchool - Platform Governance (Health, Security Audit, Support Cases)
 */

import React, { useState } from 'react';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Activity,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Lock,
  Clock,
  Check,
  Send,
  MessageSquare
} from 'lucide-react';

// ==========================================
// 1. SYSTEM HEALTH & INTEGRATIONS
// ==========================================
export const PlatformSystemHealth: React.FC = () => {
  const [services] = useState([
    {
      name: 'PostgreSQL Multi-Tenant Partitions',
      status: 'OPERATIONAL',
      latency: '4ms',
      detail: 'Isolated schema per tenant (tenant_id enforcement active)',
    },
    {
      name: 'Spring Boot Application Gateway',
      status: 'OPERATIONAL',
      latency: '28ms',
      detail: 'JWT Token Validation & Role Authority filters active',
    },
    {
      name: 'Real-time Transport GPS Telemetry',
      status: 'OPERATIONAL',
      latency: '62ms',
      detail: 'WebSocket bus beacon stream healthy',
    },
    {
      name: 'Notification Dispatch Engine (SMS/Email)',
      status: 'OPERATIONAL',
      latency: '140ms',
      detail: 'Twilio SMS & SendGrid gateway active',
    },
    {
      name: 'Automated Billing & Invoicing Worker',
      status: 'IDLE_HEALTHY',
      latency: 'N/A',
      detail: 'Scheduled for 00:00 UTC daily run',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform System Health & Service Telemetry"
        subtitle="Real-time multi-tenant infrastructure diagnostics and database connection pool health"
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            All Systems Operational
          </span>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="API Latency (p95)"
          value="34ms"
          subtext="Edge CDN acceleration"
          icon={<Activity className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          label="Database Connections"
          value="42 / 200"
          subtext="Connection pool healthy"
          icon={<Database className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          label="Security Perimeter"
          value="Enforced"
          subtext="Tenant RLS Active"
          icon={<Lock className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="SaaS Availability"
          value="99.98%"
          subtext="Past 90 calendar days"
          icon={<Server className="w-5 h-5" />}
          accentColor="slate"
        />
      </div>

      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Micro-Service & Tenant Partition Registry
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {services.map((svc, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{svc.name}</span>
                <span className="text-[11px] text-slate-500">{svc.detail}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-slate-400">{svc.latency}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 2. PLATFORM SECURITY AUDIT
// ==========================================
export const PlatformSecurityAudit: React.FC = () => {
  const [logs] = useState([
    {
      id: 'sec_001',
      tenant: 'Greenwood Valley School (GVS)',
      user: 'Dr. Elizabeth Warren (PLA0001)',
      event: 'TENANT_ENTITLEMENT_MODIFICATION',
      ip: '10.200.4.1 (Platform Console)',
      timestamp: '2026-11-02 10:14:22',
      status: 'VERIFIED',
    },
    {
      id: 'sec_002',
      tenant: 'Delhi Public Heritage High (DPS)',
      user: 'Meenakshi Sundaram (PRN0003)',
      event: 'AFFILIATION_DOCUMENT_UPLOAD',
      ip: '103.21.144.18 (External Broadband)',
      timestamp: '2026-11-01 16:30:05',
      status: 'PENDING_AUDIT',
    },
    {
      id: 'sec_003',
      tenant: 'Oakridge International Academy (OAK)',
      user: 'Sunita Reddy (ADM0002)',
      event: 'BULK_STUDENT_ENROLLMENT',
      ip: '14.139.241.66 (Campus Gateway)',
      timestamp: '2026-11-01 11:05:40',
      status: 'VERIFIED',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Security & Cross-Tenant Audit Log"
        subtitle="Immutable ledger of administrative actions, tenant provisioning, and permission adjustments"
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Immutable Audit Trail
          </span>
        }
      />

      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Audit Event Ledger (Cross-Tenant Scope)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">School Tenant</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Executed By</th>
                <th className="py-2.5 px-3">Network IP</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {log.tenant}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-teal-700 dark:text-teal-400 text-[11px]">
                    {log.event}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{log.user}</td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 3. SCHOOL SUPPORT CASES
// ==========================================
export const PlatformSupportCases: React.FC = () => {
  const [cases, setCases] = useState([
    {
      id: 'CASE-4921',
      tenant: 'Greenwood Valley School',
      requester: 'Arthur Pendelton (Admin)',
      subject: 'Request for WhatsApp Notification Gateway activation',
      priority: 'MEDIUM',
      status: 'OPEN',
      date: '2026-11-01',
    },
    {
      id: 'CASE-4890',
      tenant: 'Delhi Public Heritage High',
      requester: 'Meenakshi Sundaram (Principal)',
      subject: 'Inquiry regarding State Board Affiliation verification turnaround time',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      date: '2026-10-31',
    },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleResolve = (caseId: string) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'RESOLVED' } : c));
    setToast(`Resolved ticket ${caseId}. Response dispatched to school administrator.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Tenant Support & SLA Desk"
        subtitle="Manage technical escalation cases, onboarding inquiries, and infrastructure support tickets"
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {cases.filter(c => c.status !== 'RESOLVED').length} Active Cases
          </span>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-4">
        {cases.map((c) => (
          <Card key={c.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-800 dark:text-teal-300 text-xs">
                    {c.id}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.subject}</h4>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  School: <strong className="text-slate-700 dark:text-slate-300">{c.tenant}</strong> · Contact: {c.requester} · Submitted: {c.date}
                </p>
              </div>

              <div className="self-end sm:self-center">
                {c.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleResolve(c.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Resolve & Close Case
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Case Resolved
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
