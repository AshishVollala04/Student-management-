/**
 * FutureSchool - Platform Subscriptions & Capacity Entitlements
 */

import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { SUBSCRIPTION_PLANS } from '../../mock/tenants';
import { SubscriptionTier } from '../../types/tenant';
import {
  CreditCard,
  Users,
  CheckCircle2,
  Check,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Sliders
} from 'lucide-react';

// ==========================================
// 1. SUBSCRIPTION PLANS & ENTITLEMENTS
// ==========================================
export const PlatformSubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState(SUBSCRIPTION_PLANS);
  const [toast, setToast] = useState<string | null>(null);

  const tiers: SubscriptionTier[] = ['STARTER', 'STANDARD', 'PRO', 'ENTERPRISE'];

  const toggleFeature = (tierKey: SubscriptionTier, featureKey: string) => {
    setPlans(prev => {
      const current = prev[tierKey];
      return {
        ...prev,
        [tierKey]: {
          ...current,
          entitlements: {
            ...current.entitlements,
            [featureKey]: !((current.entitlements as any)[featureKey])
          }
        }
      };
    });
    setToast(`Updated ${tierKey} tier entitlement: ${featureKey}`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans & Feature Entitlements"
        subtitle="Manage commercial tiers, feature toggles, and base student capacity allocations"
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            4 Commercial Tiers
          </span>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tierKey) => {
          const plan = plans[tierKey];
          return (
            <Card
              key={tierKey}
              className={`p-5 flex flex-col justify-between ${
                tierKey === 'PRO'
                  ? 'border-2 border-teal-600 dark:border-teal-500 shadow-md'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tier {tierKey}
                  </span>
                  {tierKey === 'PRO' && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-600 text-white">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {plan.displayName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Base Student Limit
                  </span>
                  <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
                    {plan.baseStudentCapacity.toLocaleString()} Students
                  </span>
                </div>

                {/* Feature Entitlements Matrix */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Module Toggles (Click to override)
                  </span>

                  {[
                    { key: 'fleetTransport', label: 'Fleet Bus Transport' },
                    { key: 'aiTutorStudent', label: 'AI Student Tutor' },
                    { key: 'aiLessonPlannerTeacher', label: 'Teacher AI Planner' },
                    { key: 'aiExecutiveBriefPrincipal', label: 'Leadership AI Brief' },
                    { key: 'smsWhatsappAlerts', label: 'SMS & WhatsApp Gateway' },
                    { key: 'customDomainSupport', label: 'Custom Domain SSL' },
                    { key: 'dedicatedAccountManager', label: 'Dedicated Account SLA' },
                  ].map((f) => {
                    const isEnabled = (plan.entitlements as any)[f.key];
                    return (
                      <button
                        key={f.key}
                        onClick={() => toggleFeature(tierKey, f.key)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          isEnabled
                            ? 'bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 hover:bg-teal-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <span className="text-[11px] font-medium">{f.label}</span>
                        {isEnabled ? (
                          <Check className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">OFF</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-[11px] text-slate-400">
                Audit Retention: <strong>{plan.entitlements.auditRetentionDays} Days</strong>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. CAPACITY ENTITLEMENTS GAUGE
// ==========================================
export const PlatformCapacityEntitlements: React.FC = () => {
  const { allTenants } = useTenant();
  const [toast, setToast] = useState<string | null>(null);

  const handleUpgradeCapacity = (schoolName: string, current: number) => {
    setToast(`Allocated +200 student capacity expansion for ${schoolName}. New limit: ${current + 200}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Capacity & Multi-Tenant Entitlements"
        subtitle="Live monitoring of school enrollment vs license caps to prevent resource oversubscription"
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Capacity Governance
          </span>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allTenants.map((t) => {
          const percent = Math.round((t.currentEnrolledStudents / t.capacityLimit) * 100);
          const isNearCap = percent >= 90;
          return (
            <Card key={t.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                  <span className="font-mono text-[10px] text-slate-400">{t.code} · {t.board}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                  {t.subscriptionTier}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Utilization</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {t.currentEnrolledStudents} / {t.capacityLimit} Students ({percent}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent >= 95
                        ? 'bg-rose-500'
                        : isNearCap
                        ? 'bg-amber-500'
                        : 'bg-teal-600'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>

              {isNearCap && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Approaching 90% hard license cap. Recommend capacity expansion.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleUpgradeCapacity(t.name, t.capacityLimit)}
                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Expand +200 Seats</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
