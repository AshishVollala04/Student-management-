import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreditCard, CheckCircle2, Receipt, AlertCircle, ArrowRight, Download, DollarSign } from 'lucide-react';

export const ParentFees: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(workflow.fees.pendingAmount || 600);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa ··4821)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState<any | null>(null);

  // 4 Instalments Structure
  const instalments = [
    { name: 'Instalment 1: Term 1 Tuition & Tech Fee', amount: 2400, dueDate: '10 Aug 2026', status: 'COMPLETED' },
    { name: 'Instalment 2: STEM Labs & Activities', amount: 1200, dueDate: '15 Sep 2026', status: 'COMPLETED' },
    { name: 'Instalment 3: Term 2 Tuition & Campus Ops', amount: 800, dueDate: '15 Nov 2026', status: workflow.fees.pendingAmount <= 400 ? 'COMPLETED' : 'OVERDUE' },
    { name: 'Instalment 4: Annual Examination & Sports Dues', amount: 400, dueDate: '15 Jan 2027', status: workflow.fees.pendingAmount === 0 ? 'COMPLETED' : 'PENDING' }
  ];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      store.processFeePayment(payAmount, paymentMethod);
      if (payAmount >= workflow.fees.pendingAmount) {
        store.classTeacherReleaseHallTicket('GVS-2027-0001');
      }
      setIsProcessing(false);
      setShowPayModal(false);
      setRecentReceipt({
        receiptNo: `FS-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: payAmount,
        date: new Date().toLocaleDateString('en-GB'),
        method: paymentMethod
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Fee Portal & Ledger"
        subtitle="Annual tuition breakdown across 4 instalments, online checkout simulation & receipt vouchers"
        badge={
          workflow.fees.pendingAmount === 0 ? (
            <StatusBadge status="COMPLETED" />
          ) : (
            <StatusBadge status="OVERDUE" />
          )
        }
        actions={
          workflow.fees.pendingAmount > 0 ? (
            <button
              onClick={() => {
                setPayAmount(workflow.fees.pendingAmount);
                setShowPayModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-900/20 transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Outstanding (${workflow.fees.pendingAmount})</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Annual Instalments Cleared</span>
            </div>
          )
        }
      />

      {/* Safety Notice on Mock Checkout */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          <strong>Prototype Payment Gate:</strong> Real bank/card credentials are never requested. Clicking Pay simulates institutional reconciliation and immediately unlocks exam hall ticket clearance.
        </span>
      </div>

      {/* 3 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Academic Bill"
          value={`$${workflow.fees.totalAnnualFee.toLocaleString()}`}
          subtext="Grade 10 Annual Enrolment"
          icon={<DollarSign className="w-5 h-5" />}
          accentColor="slate"
        />
        <StatCard
          label="Settled to Date"
          value={`$${workflow.fees.paidAmount.toLocaleString()}`}
          subtext={`${Math.round((workflow.fees.paidAmount / workflow.fees.totalAnnualFee) * 100)}% Cleared`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Pending Balance"
          value={`$${workflow.fees.pendingAmount.toLocaleString()}`}
          subtext={workflow.fees.pendingAmount === 0 ? 'No Dues' : 'Due by Nov 15th'}
          icon={<CreditCard className="w-5 h-5" />}
          accentColor={workflow.fees.pendingAmount === 0 ? 'emerald' : 'rose'}
        />
      </div>

      {/* 4 Instalments Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>4-Instalment Academic Schedule</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Approved annual payment milestone breakdown</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {instalments.map((inst, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {inst.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Deadline: <strong className="text-slate-700 dark:text-slate-300">{inst.dueDate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    ${inst.amount}
                  </span>
                  <StatusBadge status={inst.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History & Receipt Vouchers */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History & Formal Receipts</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Automated bursar clearance receipts</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {workflow.fees.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Receipt #{tx.receiptNo} · {tx.instalment}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Paid on {tx.date} via {tx.method}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-600">
                    +${tx.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Print receipt voucher"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checkout Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Secure Bursar Checkout (Prototype)
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Settle Outstanding School Dues
                </h3>
                <p className="text-xs text-slate-500">Candidate: Aarav Sharma (Grade 10-A)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  min="10"
                  max={workflow.fees.pendingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setPayAmount(workflow.fees.pendingAmount)}
                    className="text-[10px] font-bold text-teal-700 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded"
                  >
                    Pay Full Pending (${workflow.fees.pendingAmount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayAmount(Math.round(workflow.fees.pendingAmount / 2))}
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                  >
                    Pay 50% (${Math.round(workflow.fees.pendingAmount / 2)})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Channel
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="Credit Card (Visa ··4821)">Credit Card (Visa ··4821)</option>
                  <option value="NetBanking (HDFC Core Account)">NetBanking (HDFC Core Account)</option>
                  <option value="Instant UPI Campus QR">Instant UPI Campus QR</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 shadow-md"
                >
                  {isProcessing ? 'Authorizing...' : `Authorize $${payAmount}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instant Receipt Pop */}
      {recentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fee Transaction Approved
            </h3>
            <p className="text-xs text-slate-500">
              Receipt Voucher #{recentReceipt.receiptNo} generated. Examination Hall Ticket status updated.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono">
              Cleared: ${recentReceipt.amount} via {recentReceipt.method}
            </div>
            <button
              onClick={() => setRecentReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold"
            >
              Close Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
