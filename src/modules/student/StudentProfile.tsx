import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { User, ShieldAlert, KeyRound, LogOut, CheckCircle2, Lock, Smartphone } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [toast, setToast] = useState<string | null>(null);

  const handleLogoutAllSessions = () => {
    setToast('Mock security event: Successfully terminated 2 other active session tokens.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile & Security"
        subtitle="Enrolled student biographical registry, parental details, and credential controls"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Student Badge */}
        <Card className="p-6 text-center">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-2xl mx-auto ring-4 ring-teal-700/20 object-cover bg-teal-50"
          />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
            {currentUser?.name}
          </h3>
          <p className="text-xs font-mono text-teal-700 dark:text-teal-400 font-bold mt-0.5">
            ID: {currentUser?.id}
          </p>
          <div className="mt-3 flex justify-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              Grade 10-A
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              Roll #18
            </span>
          </div>
        </Card>

        {/* Right Columns: Bio & Parental Emergency Data */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Biographical & Academic Identifiers</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Admission Number</span>
                <span className="font-semibold text-slate-900 dark:text-white">FS-2021-0492</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">House Affiliation</span>
                <span className="font-semibold text-teal-700 dark:text-teal-400">Newton Green House</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                <span className="font-semibold text-slate-900 dark:text-white">14 May 2011</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
                <span className="font-semibold text-rose-600">O+ Positive</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Parent / Guardian Emergency Contact</CardTitle>
            </CardHeader>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Father & Guardian:</span>
                <strong className="text-slate-900 dark:text-white">Dr. Rajesh Sharma (Senior Cardiologist)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Emergency Telephone:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">+1 (555) 382-9912</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Registered Family Email:</span>
                <span className="font-mono text-slate-900 dark:text-white">sharma.family@gvs.edu</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Residential Address:</span>
                <span className="text-slate-900 dark:text-white">42 Pinecrest Avenue, North Academic Enclave</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Session & Credential Security</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Active Device Sessions</div>
                  <div className="text-[11px] text-slate-500">Currently authenticated on Chrome (macOS) & Android Student App</div>
                </div>
                <button
                  onClick={handleLogoutAllSessions}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                >
                  Revoke All Other Sessions
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
