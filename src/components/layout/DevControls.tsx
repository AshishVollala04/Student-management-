import React, { useState } from 'react';
import { UserRole } from '../../types/roles';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { workflowStore } from '../../mock/workflowStore';
import { Wrench, ChevronDown, RefreshCw, Play, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DevControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { currentRole, quickSwitchRole } = useAuth();
  const navigate = useNavigate();

  const roles: { role: UserRole; label: string; route: string; id: string }[] = [
    { role: 'STUDENT', label: 'Student', route: '/student/dashboard', id: 'GVS-2027-0001' },
    { role: 'PARENT', label: 'Parent', route: '/parent/dashboard', id: 'GVS-2027-0001' },
    { role: 'TEACHER', label: 'Teacher', route: '/teacher/dashboard', id: 'TCH0001' },
    { role: 'PRINCIPAL', label: 'Principal', route: '/principal/dashboard', id: 'PRN0001' },
    { role: 'ADMIN', label: 'Admin', route: '/admin/dashboard', id: 'ADM0001' },
    { role: 'PLATFORM_ADMIN', label: 'Platform Admin', route: '/platform/dashboard', id: 'PLA0001' }
  ];

  const scenarios = [
    { num: 1, title: '1. Parent Leave → Teacher Approves', desc: 'Auto-approves Aarav\'s medical leave request.' },
    { num: 2, title: '2. Marks → Principal Approves → Published', desc: 'Publishes 10-A Maths exam marks to student & parent.' },
    { num: 3, title: '3. Fees Cleared → Hall Ticket Released', desc: 'Clears $1,200 balance and releases exam hall ticket.' },
    { num: 4, title: '4. Transport Change → Admin Approves', desc: 'Approves transfer to Route 7 Express Link.' },
    { num: 5, title: '5. Complaint → Principal Escalates & Resolves', desc: 'Simulates bus route timing resolution.' },
    { num: 6, title: '6. Teacher Leave → Principal Approves', desc: 'Allocates David Vance as substitute for Jenkins.' },
    { num: 7, title: '7. Admin Config → Principal Sign-off → Executed', desc: 'Approves & activates Term 2 master schedule.' }
  ];

  const handleSwitch = (r: UserRole, route: string) => {
    quickSwitchRole(r);
    navigate(route);
    setToastMsg(`Switched role to ${r}`);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleApplyScenario = (num: number, title: string) => {
    workflowStore.applyScenario(num);
    setToastMsg(`Scenario executed: ${title}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleReset = () => {
    workflowStore.resetToDefault();
    setToastMsg('All prototype workflows restored to initial state.');
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <>
      {toastMsg && (
        <div className="fixed top-16 right-4 z-50 bg-teal-900 text-teal-100 text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-teal-700 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white dark:bg-teal-600 rounded-xl shadow-xl hover:bg-slate-800 text-xs font-bold ring-2 ring-white/20 transition-all active:scale-95"
          title="Development Role Switcher & Scenario Test Harness"
        >
          <Wrench className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">Demo Tool:</span>
          <span className="text-orange-300 font-extrabold">{currentRole || 'SELECT ROLE'}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute bottom-12 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
                  Dev-Only Harness
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Cross-Role Journey Simulator
                </h4>
              </div>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold flex items-center gap-1"
                title="Reset all workflow state"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Role Switcher */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Switch Active Role & Navigate:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => handleSwitch(r.role, r.route)}
                    className={`p-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                      currentRole === r.role
                        ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 font-bold border border-teal-200 dark:border-teal-800'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="capitalize">{r.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.id}</div>
                    </div>
                    {currentRole === r.role && <div className="w-2 h-2 rounded-full bg-teal-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fast-Forward Scenario Tester */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Simulate Cross-Role Workflows (1-Click):
              </span>
              <div className="space-y-1.5">
                {scenarios.map(s => (
                  <button
                    key={s.num}
                    onClick={() => handleApplyScenario(s.num, s.title)}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200 dark:border-slate-700/60 text-xs transition-colors group"
                  >
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      {s.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 text-[10px] text-slate-400 text-center">
              Shared state stored in browser localStorage. Safe for demo.
            </div>
          </div>
        )}
      </div>
    </>
  );
};
