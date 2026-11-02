import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileCheck, ShieldAlert, CheckCircle2, Download, Printer, Lock } from 'lucide-react';

export const StudentHallTicket: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow] = useWorkflow();

  const myTicket = workflow.hallTickets.find(h => h.studentId === currentUser?.id);
  const isReleased = myTicket?.classTeacherReleased || myTicket?.principalOverride;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination Hall Ticket (Admit Card)"
        subtitle="Official clearance credentials for semester written examinations"
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
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
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
            Hall Ticket Release Pending
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            According to institutional policy, your Hall Ticket is currently pending institutional clearance. Please have your parent verify term fee installments or consult your class mentor.
          </p>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Attendance Requirement (75%):</span>
              <span className="font-bold text-emerald-600">✓ Satisfied (94.2%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fee Clearance:</span>
              <span className={workflow.fees.hallTicketCleared ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                {workflow.fees.hallTicketCleared ? '✓ Cleared' : '✗ $1,200 Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Class Mentor Sign-off:</span>
              <span className="font-bold text-amber-600">Awaiting release</span>
            </div>
          </div>
        </Card>
      ) : (
        /* OFFICIAL RELEASED HALL TICKET */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-teal-800 shadow-xl space-y-6">
          <div className="text-center pb-4 border-b-2 border-teal-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              FutureSchool Academy
            </h2>
            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              Official Examination Admit Card · Mid-Year Assessment 2026
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-300">
              HALL TICKET ID: {myTicket?.hallTicketNumber || 'HT-2026-10A-18'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Name</span>
              <strong className="text-slate-900 dark:text-white text-sm">{currentUser?.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
              <strong className="text-slate-900 dark:text-white text-sm">Grade 10 - Section A</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Roll No</span>
              <strong className="text-slate-900 dark:text-white text-sm">18</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Student ID</span>
              <strong className="font-mono text-slate-900 dark:text-white">{currentUser?.id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Examination Hall</span>
              <strong className="text-teal-700 dark:text-teal-400">Wing B · Hall 304</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Institutional Status</span>
              <strong className="text-emerald-600 font-bold">✓ Clearance Verified</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Authorized Examination Schedule:</h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span>18 Nov 2026 · 08:30 AM</span>
                <span className="font-bold">Mathematics (Paper 101)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span>20 Nov 2026 · 08:30 AM</span>
                <span className="font-bold">Physics & Practical (Paper 102)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span>24 Nov 2026 · 08:30 AM</span>
                <span className="font-bold">Computer Science (Paper 103)</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>Class Mentor: <strong>Mrs. Sarah Jenkins</strong></div>
            <div className="font-mono text-emerald-600 font-bold">✓ DIGITAL SEAL APPLIED</div>
          </div>
        </div>
      )}
    </div>
  );
};
