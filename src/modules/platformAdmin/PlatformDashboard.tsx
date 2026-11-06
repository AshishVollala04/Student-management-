/**
 * FutureSchool - Platform Admin Overview Dashboard
 * Platform-wide SaaS intelligence, multi-tenant statistics, and operational health
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Building2,
  Users,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
  TrendingUp,
  Server,
  UserPlus
} from 'lucide-react';

export const PlatformDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { allTenants, updateTenantStatus } = useTenant();
  const navigate = useNavigate();

  const totalSchools = allTenants.length;
  const activeSchools = allTenants.filter(t => t.status === 'ACTIVE').length;
  const pendingVerification = allTenants.filter(t => t.status === 'PENDING_VERIFICATION');
  const totalStudents = allTenants.reduce((acc, t) => acc + t.currentEnrolledStudents, 0);
  const totalCapacity = allTenants.reduce((acc, t) => acc + t.capacityLimit, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`FutureSchool Multi-Tenant Platform Core`}
        subtitle={`Platform Directorate · Dr. Elizabeth Warren (PLA0001) · ${totalSchools} Registered Campuses`}
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            SaaS Platform Layer
          </span>
        }
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/platform/verification')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verification Queue ({pendingVerification.length})</span>
            </button>
            <button
              onClick={() => navigate('/platform/onboarding')}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard School</span>
            </button>
          </div>
        }
      />

      {/* 1. Platform-wide SaaS Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Onboarded Schools"
          value={`${activeSchools} Active / ${totalSchools}`}
          subtext="1 Pending Verification"
          icon={<Building2 className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          label="Aggregated Students"
          value={`${totalStudents.toLocaleString()} Students`}
          subtext={`${Math.round((totalStudents / totalCapacity) * 100)}% of ${totalCapacity.toLocaleString()} limit`}
          icon={<Users className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          label="Platform MRR"
          value="$44,500 / mo"
          subtext="+$6,200 vs last quarter"
          icon={<CreditCard className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Infrastructure Health"
          value="99.98% Uptime"
          subtext="Isolated Postgres Schemas"
          icon={<Server className="w-5 h-5" />}
          accentColor="slate"
        />
      </div>

      {/* 2. Critical Attention: Verification & Compliance Desk */}
      {pendingVerification.length > 0 && (
        <Card className="p-5 border-l-4 border-l-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Institutional Verification Required ({pendingVerification.length} School Pending)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  <strong>{pendingVerification[0].name}</strong> ({pendingVerification[0].code}) submitted board affiliation documents ({pendingVerification[0].affiliationNumber}). Review before activating tenant database partition.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/platform/verification')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Review Verification File</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}

      {/* 3. Multi-School Status Roster */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional Tenant Directory & Capacity Allocation
            </h3>
            <p className="text-xs text-slate-500">
              Live status, student capacity utilization, and tier entitlements
            </p>
          </div>
          <button
            onClick={() => navigate('/platform/schools')}
            className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All Tenants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">School Code & Name</th>
                <th className="py-2.5 px-3">Board & Affiliation</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Capacity Gauge</th>
                <th className="py-2.5 px-3">Principal & Contact</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allTenants.map((tenant) => {
                const percentCapacity = Math.round(
                  (tenant.currentEnrolledStudents / tenant.capacityLimit) * 100
                );
                return (
                  <tr key={tenant.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {tenant.name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {tenant.id} · {tenant.code}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-teal-800 dark:text-teal-300 block">
                        {tenant.board}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {tenant.affiliationNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {tenant.subscriptionTier}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {tenant.currentEnrolledStudents} / {tenant.capacityLimit}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{percentCapacity}%</span>
                      </div>
                      <div className="w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            percentCapacity >= 95
                              ? 'bg-rose-500'
                              : percentCapacity >= 80
                              ? 'bg-amber-500'
                              : 'bg-teal-600'
                          }`}
                          style={{ width: `${Math.min(100, percentCapacity)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block">
                        {tenant.principalName}
                      </span>
                      <span className="text-[10px] text-slate-500">{tenant.principalEmail}</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={tenant.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      {tenant.status === 'PENDING_VERIFICATION' ? (
                        <button
                          onClick={() => {
                            updateTenantStatus(tenant.id, 'ACTIVE');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Verify & Activate
                        </button>
                      ) : tenant.status === 'ACTIVE' ? (
                        <button
                          onClick={() => {
                            updateTenantStatus(tenant.id, 'SUSPENDED');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateTenantStatus(tenant.id, 'ACTIVE');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Platform Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => navigate('/platform/plans')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2.5 mb-1.5 text-teal-700 dark:text-teal-400">
            <CreditCard className="w-4 h-4" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Subscription Tier Entitlements
            </h4>
          </div>
          <p className="text-[11px] text-slate-500">
            Configure feature flags (AI Tutor, Bus Fleet, Subdomains) across Starter, Standard, Pro, and Enterprise tiers.
          </p>
        </div>

        <div
          onClick={() => navigate('/platform/health')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2.5 mb-1.5 text-indigo-700 dark:text-indigo-400">
            <Activity className="w-4 h-4" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              System Telemetry & Multi-Tenant Isolation
            </h4>
          </div>
          <p className="text-[11px] text-slate-500">
            Verify database partition integrity, tenant row-level security isolation, and API latency.
          </p>
        </div>

        <div
          onClick={() => navigate('/platform/audit')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-500 transition-colors cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2.5 mb-1.5 text-slate-700 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Platform Security Audit
            </h4>
          </div>
          <p className="text-[11px] text-slate-500">
            Inspect cross-tenant privilege elevation, administrative access logs, and compliance records.
          </p>
        </div>
      </div>
    </div>
  );
};
