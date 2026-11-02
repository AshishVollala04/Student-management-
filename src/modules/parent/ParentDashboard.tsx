import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { ActionCard } from '../../components/common/CommonUi';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CreditCard,
  CalendarCheck,
  BookOpen,
  Users,
  AlertCircle,
  FileCheck2,
  Bell,
  Bus,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow] = useWorkflow();
  const navigate = useNavigate();

  const feeDue = workflow.fees.pendingAmount;
  const pendingLeave = workflow.leaveRequests.find(l => l.studentId === 'GVS-2027-0001');

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Guardian Portal: ${currentUser?.name}`}
        subtitle="Monitoring Enrolled Ward: Aarav Sharma (Grade 10-A · Roll #18)"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => navigate('/parent/fees')}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pay Dues (${feeDue})</span>
          </button>
        }
      />

      {/* 1. Action Center: Urgent Items First */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>Priority Action Center</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Urgent Fee Banner */}
          {feeDue > 0 && (
            <div
              onClick={() => navigate('/parent/fees')}
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 cursor-pointer hover:border-rose-400 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-300">
                <span>Term 2 Fee Outstanding</span>
                <span className="font-mono text-sm">${feeDue}</span>
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                Due on 15 Nov 2026. Hall ticket clearance requires settlement.
              </p>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 mt-2 inline-flex items-center gap-1">
                Open Secure Checkout →
              </span>
            </div>
          )}

          {/* Upcoming PTM Consultation */}
          <div
            onClick={() => navigate('/parent/meetings')}
            className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 cursor-pointer hover:border-teal-400 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold text-teal-800 dark:text-teal-300">
              <span>Parent-Teacher Conference</span>
              <span className="text-[10px] bg-teal-200 dark:bg-teal-800 px-1.5 py-0.5 rounded">Upcoming</span>
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1">
              Sat, Nov 14th · Slot reserved with mentor Mrs. Sarah Jenkins.
            </p>
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 mt-2 inline-flex items-center gap-1">
              View Consultation Summary →
            </span>
          </div>

          {/* Consent Form Deadline */}
          <div
            onClick={() => navigate('/parent/consent')}
            className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 cursor-pointer hover:border-orange-400 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold text-orange-800 dark:text-orange-300">
              <span>Consent: STEM Expo 2026</span>
              <span className="text-[10px] bg-orange-200 dark:bg-orange-800 px-1.5 py-0.5 rounded">Pending Sign</span>
            </div>
            <p className="text-[11px] text-orange-700 dark:text-orange-400 mt-1">
              Annual inter-school robotics excursion requires parental agreement.
            </p>
            <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300 mt-2 inline-flex items-center gap-1">
              Review & Sign Consent →
            </span>
          </div>
        </div>
      </div>

      {/* 2. Ward Today Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Today's Campus Safety"
          value="Present"
          subtext="Checked in 07:48 AM"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          accentColor="emerald"
          onClick={() => navigate('/parent/attendance')}
        />
        <StatCard
          label="Homework Assigned"
          value="2 Tasks Due"
          subtext="Math & Physics pending"
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="orange"
          onClick={() => navigate('/parent/homework')}
        />
        <StatCard
          label="Fee Dues"
          value={`$${feeDue}`}
          subtext={feeDue === 0 ? 'Fully Cleared' : 'Instalment 2 Due'}
          icon={<CreditCard className="w-5 h-5" />}
          accentColor={feeDue === 0 ? 'emerald' : 'rose'}
          onClick={() => navigate('/parent/fees')}
        />
        <StatCard
          label="Bus Commute"
          value="Route 4"
          subtext="North Academic Enclave"
          icon={<Bus className="w-5 h-5" />}
          accentColor="teal"
          onClick={() => navigate('/parent/transport')}
        />
      </div>

      {/* 3. Parent Quick Actions & School Liaison */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Parent Workflows & Liaison
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ActionCard
            title="School Fees & Receipts"
            description="View 4 instalments breakdown, receipts, and mock checkout"
            icon={<CreditCard className="w-5 h-5" />}
            badge={feeDue > 0 ? `$${feeDue} Due` : 'Cleared'}
            accentColor="rose"
            onClick={() => navigate('/parent/fees')}
          />
          <ActionCard
            title="Submit Student Leave"
            description="Submit medical/casual absence with mentor review status"
            icon={<CalendarCheck className="w-5 h-5" />}
            accentColor="teal"
            onClick={() => navigate('/parent/leave')}
          />
          <ActionCard
            title="Message Class Mentor"
            description="Inquire with Mrs. Sarah Jenkins (Grade 10-A Lead)"
            icon={<Users className="w-5 h-5" />}
            accentColor="teal"
            onClick={() => navigate('/parent/messages')}
          />
          <ActionCard
            title="Complaints & Resolution"
            description="Log transport, academic or campus safety concerns"
            icon={<AlertCircle className="w-5 h-5" />}
            accentColor="orange"
            onClick={() => navigate('/parent/complaints')}
          />
          <ActionCard
            title="Pickup & Early Release"
            description="Authorize temporary guardians or submit early exit request"
            icon={<ShieldAlert className="w-5 h-5" />}
            accentColor="teal"
            onClick={() => navigate('/parent/pickup')}
          />
          <ActionCard
            title="Bus Route & Safety"
            description="Inspect designated bus stops and request route transfers"
            icon={<Bus className="w-5 h-5" />}
            accentColor="teal"
            onClick={() => navigate('/parent/transport')}
          />
        </div>
      </div>
    </div>
  );
};
