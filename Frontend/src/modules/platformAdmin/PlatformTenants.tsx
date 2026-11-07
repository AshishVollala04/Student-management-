/**
 * FutureSchool - Platform Admin Tenants Management
 * School Tenants Directory, Verification Queue, and Onboarding Wizard
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { SchoolTenant, EducationalBoard, SubscriptionTier } from '../../types/tenant';
import { SUBSCRIPTION_PLANS } from '../../mock/tenants';
import {
  Building2,
  ShieldCheck,
  UserPlus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Eye,
  FileCheck,
  Globe,
  SlidersHorizontal
} from 'lucide-react';

// ==========================================
// 1. SCHOOL TENANTS DIRECTORY
// ==========================================
export const PlatformTenantsDirectory: React.FC = () => {
  const { allTenants, switchTenant, updateTenantStatus } = useTenant();
  const [search, setSearch] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [inspectTenant, setInspectTenant] = useState<SchoolTenant | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredTenants = allTenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.affiliationNumber.toLowerCase().includes(search.toLowerCase());
    const matchesBoard = selectedBoard === 'ALL' || t.board === selectedBoard;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesBoard && matchesStatus;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Tenants Directory"
        subtitle="Multi-tenant registry across all contracted educational institutions and campuses"
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            {allTenants.length} Enrolled Institutions
          </span>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search school name, affiliation code, or tenant ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Curricula</option>
              <option value="State Board">State Board</option>
              <option value="ICSE">ICSE</option>
              <option value="IB">IB World</option>
              <option value="CAMBRIDGE">Cambridge (CAIE)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tenants Table */}
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">School Name & Code</th>
                <th className="py-2.5 px-3">Board & Affiliation</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Enrolled / Limit</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{t.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{t.id} · {t.code}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-teal-800 dark:text-teal-300">{t.board}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">{t.affiliationNumber}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {t.subscriptionTier}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium">
                    {t.currentEnrolledStudents} / {t.capacityLimit}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {t.address.city}, {t.address.state}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setInspectTenant(t)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                      {t.status === 'ACTIVE' ? (
                        <button
                          onClick={() => {
                            updateTenantStatus(t.id, 'SUSPENDED');
                            showToast(`Suspended tenant ${t.name} (Access revoked)`);
                          }}
                          className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateTenantStatus(t.id, 'ACTIVE');
                            showToast(`Activated tenant ${t.name}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Tenant Modal */}
      {inspectTenant && (
        <Modal
          isOpen={!!inspectTenant}
          onClose={() => setInspectTenant(null)}
          title={`Tenant Profile: ${inspectTenant.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Affiliation Board:</span>
                  <strong>{inspectTenant.board} ({inspectTenant.affiliationNumber})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Subscription Tier:</span>
                  <strong className="text-indigo-600">{inspectTenant.subscriptionTier}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Principal In-Charge:</span>
                  <strong>{inspectTenant.principalName}</strong> ({inspectTenant.principalEmail})
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">School Administrator:</span>
                  <strong>{inspectTenant.adminName}</strong> ({inspectTenant.adminEmail})
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Enrollment / Capacity Limit:</span>
                  <strong>{inspectTenant.currentEnrolledStudents} / {inspectTenant.capacityLimit} Students</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Contract Renews:</span>
                  <strong>{inspectTenant.subscriptionRenewsAt}</strong>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Enabled Module Entitlements:</h5>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(inspectTenant.entitlements).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {typeof v === 'boolean' ? (
                      v ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 text-slate-400 text-center font-bold">✕</span>
                      )
                    ) : (
                      <span className="font-bold text-teal-700 dark:text-teal-400">{v}</span>
                    )}
                    <span className="truncate">{k}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectTenant(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ==========================================
// 2. VERIFICATION QUEUE
// ==========================================
export const PlatformVerificationQueue: React.FC = () => {
  const { allTenants, updateTenantStatus } = useTenant();
  const [toast, setToast] = useState<string | null>(null);

  const pending = allTenants.filter((t) => t.status === 'PENDING_VERIFICATION');

  const handleVerify = (tenantId: string, name: string) => {
    updateTenantStatus(tenantId, 'ACTIVE');
    setToast(`Verified & Activated ${name}. Tenant database partition provisioned.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Verification Desk"
        subtitle="Review educational board affiliations, statutory documents, and activate school tenant database schemas"
        badge={
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {pending.length} Pending Verification
          </span>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      {pending.length > 0 ? (
        <div className="space-y-4">
          {pending.map((t) => (
            <Card key={t.id} className="p-6 border-l-4 border-l-amber-500 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Verification
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Onboarded: {t.onboardedAt} · Board: <strong className="text-teal-700">{t.board}</strong> · Plan Tier: <strong className="text-indigo-600">{t.subscriptionTier}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleVerify(t.id, t.name)}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Affiliation & Activate Tenant</span>
                </button>
              </div>

              {/* Compliance Checklist */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
                  Compliance Document Review Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Board Certificate ({t.affiliationNumber})</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Principal Authorization ({t.principalName})</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>School Trust Registration Deed</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>Campus Location: <strong>{t.address.street}, {t.address.city}, {t.address.state}</strong></span>
                <span>•</span>
                <span>Requested Capacity: <strong>{t.capacityLimit} Students</strong></span>
                <span>•</span>
                <span>Admin Liaison: <strong>{t.adminName}</strong> ({t.contactPhone})</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">All Clear! No Pending Verifications</h4>
          <p className="text-xs text-slate-500">All registered educational institutions have been verified and activated.</p>
        </Card>
      )}
    </div>
  );
};

// ==========================================
// 3. TENANT ONBOARDING WIZARD
// ==========================================
export const PlatformTenantOnboarding: React.FC = () => {
  const { registerNewTenant } = useTenant();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [board, setBoard] = useState<EducationalBoard>('State Board');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [tagline, setTagline] = useState('Nurturing Tomorrow’s Leaders');
  const [tier, setTier] = useState<SubscriptionTier>('STANDARD');
  const [capacityLimit, setCapacityLimit] = useState(1000);
  const [principalName, setPrincipalName] = useState('');
  const [principalEmail, setPrincipalEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [createdTenant, setCreatedTenant] = useState<SchoolTenant | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant = registerNewTenant({
      code: `${name.slice(0, 3).toUpperCase()}-${city.slice(0, 3).toUpperCase() || 'IND'}`,
      name,
      tagline,
      affiliationNumber,
      board,
      subscriptionTier: tier,
      entitlements: SUBSCRIPTION_PLANS[tier].entitlements,
      currentEnrolledStudents: 0,
      capacityLimit,
      principalName,
      principalEmail,
      adminName,
      adminEmail,
      contactPhone,
      address: {
        street: 'Main Campus Road',
        city: city || 'Bengaluru',
        state: state || 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      subscriptionRenewsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setCreatedTenant(newTenant);
    setStep(3);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Tenant Onboarding Wizard"
        subtitle="Provision dedicated tenant partitions, configure student capacity limits, and assign initial admin credentials"
        breadcrumbs={[{ label: 'Platform Core', href: '/platform/dashboard' }, { label: 'Onboard School' }]}
      />

      <div className="max-w-2xl mx-auto">
        {step < 3 ? (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {step === 1 ? 'Step 1: School Profile & Curriculum Board' : 'Step 2: Capacity & Executive Leadership'}
                </h3>
                <p className="text-xs text-slate-500">Contractual entity onboarding for SaaS multitenancy</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-lg">
                Step {step} of 2
              </span>
            </div>

            {step === 1 ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cambridge Academy of World Scholars"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Curriculum / Board *
                    </label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value as EducationalBoard)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="State Board">State Board (Central Board)</option>
                      <option value="ICSE">ICSE / CISCE</option>
                      <option value="IB">IB (International Baccalaureate)</option>
                      <option value="CAMBRIDGE">Cambridge (CAIE)</option>
                      <option value="STATE_BOARD">State Department of Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Affiliation / Recognition Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. State Board-AFF-2027/99120"
                      value={affiliationNumber}
                      onChange={(e) => setAffiliationNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Karnataka"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    disabled={!name || !affiliationNumber}
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold"
                  >
                    Proceed to Leadership & Limits →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Subscription Plan Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as SubscriptionTier)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="STARTER">Starter School (Up to 500)</option>
                      <option value="STANDARD">Standard Campus (Up to 1,000)</option>
                      <option value="PRO">Professional Academy (Up to 2,000)</option>
                      <option value="ENTERPRISE">Enterprise Multi-Campus (5,000+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Licensed Student Capacity Limit
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={10000}
                      value={capacityLimit}
                      onChange={(e) => setCapacityLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Principal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Catherine Brooks"
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Principal Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. principal@cambridge.edu"
                      value={principalEmail}
                      onChange={(e) => setPrincipalEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      School Admin Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Thorne"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      School Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@cambridge.edu"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
                  >
                    Onboard & Provision Tenant Schema
                  </button>
                </div>
              </form>
            )}
          </Card>
        ) : (
          <Card className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                School Tenant Successfully Onboarded!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tenant ID: <strong className="font-mono text-teal-700">{createdTenant?.id}</strong> ({createdTenant?.name})
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-left text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <StatusBadge status={createdTenant?.status || 'PENDING_VERIFICATION'} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Board Affiliation:</span>
                <span className="font-bold">{createdTenant?.board}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Licensed Student Capacity:</span>
                <span className="font-bold">{createdTenant?.capacityLimit} Students</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('/platform/schools')}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                View in Directory
              </button>
              <button
                onClick={() => navigate('/platform/verification')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Open Verification Queue →
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
