import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  FileCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  Printer, 
  Lock, 
  CreditCard, 
  Sparkles,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../mock/academicData';

export const StudentHallTicket: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow, store] = useWorkflow();
  const navigate = useNavigate();

  const myTicket = workflow.hallTickets.find(h => h.studentId === currentUser?.id);
  const isReleased = myTicket?.classTeacherReleased || myTicket?.principalOverride;
  const isFeesCleared = workflow.fees.pendingAmount === 0 || workflow.fees.hallTicketCleared;

  const handleDemoQuickRelease = () => {
    store.processFeePayment(workflow.fees.pendingAmount, 'Instant Demonstration Waiver');
    store.principalOverrideHallTicket(currentUser?.id || 'GVS-2027-0001', 'Institutional Demo Override');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination Hall Ticket (Admit Card)"
        subtitle="Official board admission credentials for semester written examinations"
        badge={
          isReleased ? (
            <StatusBadge status="ACTIVE" />
          ) : (
            <StatusBadge status="BLOCKED" />
          )
        }
        actions={
          isReleased ? (
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Admit Card</span>
            </button>
          ) : undefined
        }
      />

      {!isReleased ? (
        <Card className="p-8 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/60 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Hall Ticket Clearance Pending
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Institutional clearance requires satisfactory attendance (&gt;75%), fee account settlement, and class mentor signature.
          </p>

          <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">1. Attendance Minimum (75%):</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>94.2% (Satisfied)</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">2. Fee Clearance:</span>
              <span className={isFeesCleared ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                {isFeesCleared ? '✓ Cleared' : `✗ $${workflow.fees.pendingAmount} Pending`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">3. Class Mentor Release:</span>
              <span className={myTicket?.classTeacherReleased ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'}>
                {myTicket?.classTeacherReleased ? '✓ Released' : 'Pending Mentor Sign-Off'}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center gap-2">
            {!isFeesCleared && (
              <button
                onClick={() => navigate('/student/fees')}
                className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Clear Fees Now</span>
              </button>
            )}
            <button
              onClick={handleDemoQuickRelease}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo Release</span>
            </button>
          </div>
        </Card>
      ) : (
        /* OFFICIAL RELEASED HALL TICKET */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-teal-800 shadow-xl space-y-6">
          <div className="text-center pb-5 border-b-2 border-teal-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {STUDENT_PROFILE.schoolName}
            </h2>
            <p className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5">
              Affiliated to CBSE, New Delhi · Affiliation Code 830114
            </p>
            <div className="mt-2 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Official Examination Admit Card · Term 1 Comprehensive Assessment 2026
            </div>
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-800">
              ADMIT CARD ID: {myTicket?.hallTicketNumber || 'HT-2026-10A-18'}
            </div>
          </div>

          {/* Candidate Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Name</span>
              <strong className="text-slate-900 dark:text-white text-sm">{STUDENT_PROFILE.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
              <strong className="text-slate-900 dark:text-white text-sm">Grade {STUDENT_PROFILE.grade} - Section {STUDENT_PROFILE.section}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Roll No</span>
              <strong className="text-slate-900 dark:text-white text-sm font-mono">{STUDENT_PROFILE.rollNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Registration ID</span>
              <strong className="font-mono text-slate-900 dark:text-white">{STUDENT_PROFILE.id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Examination Center</span>
              <strong className="text-teal-700 dark:text-teal-400">Wing B · Hall 304</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Institutional Status</span>
              <strong className="text-emerald-600 font-bold">✓ Clearance Verified</strong>
            </div>
          </div>

          {/* Exam Timetable Schedule */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
              Authorized Examination Schedule
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                <span>18 Nov 2026 · 08:30 – 11:30 AM</span>
                <span className="font-bold font-sans text-slate-900 dark:text-white">Mathematics (041)</span>
                <span className="text-emerald-600 text-[11px] font-sans">Desk #18</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                <span>20 Nov 2026 · 08:30 – 11:30 AM</span>
                <span className="font-bold font-sans text-slate-900 dark:text-white">Science & Practical (086)</span>
                <span className="text-emerald-600 text-[11px] font-sans">Desk #18</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                <span>24 Nov 2026 · 08:30 – 11:30 AM</span>
                <span className="font-bold font-sans text-slate-900 dark:text-white">Computer Applications (165)</span>
                <span className="text-emerald-600 text-[11px] font-sans">Desk #18</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                <span>26 Nov 2026 · 08:30 – 11:30 AM</span>
                <span className="font-bold font-sans text-slate-900 dark:text-white">English Language & Lit (184)</span>
                <span className="text-emerald-600 text-[11px] font-sans">Desk #18</span>
              </div>
            </div>
          </div>

          {/* Barcode & Signatures */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Class Mentor</span>
              <strong className="text-slate-800 dark:text-slate-200">Mrs. Sarah Jenkins</strong>
            </div>
            <div className="text-center font-mono text-teal-700 dark:text-teal-400">
              <div className="tracking-widest text-xs">||| | |||| | |||||| || | |||| |||</div>
              <span className="text-[9px] uppercase">CBSE-VERIFIED-2026</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Chief Controller</span>
              <strong className="text-slate-800 dark:text-slate-200">Dr. Robert Vance</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
