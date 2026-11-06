import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Clock, 
  Receipt, 
  ShieldCheck,
  Building,
  RotateCw,
  QrCode,
  ArrowRight
} from 'lucide-react';

export const StudentFees: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CARD' | 'UPI' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  const fees = workflow.fees;

  const handlePayNowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const modeString = paymentMode === 'UPI' 
        ? 'UPI (Google Pay / PhonePe)' 
        : paymentMode === 'CARD' 
        ? 'Visa Debit Card' 
        : 'HDFC NetBanking';

      store.processFeePayment(fees.pendingAmount, modeString);
      store.classTeacherReleaseHallTicket(fees.studentId);

      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Fee Statement & Dues"
        subtitle="Tuition instalments, examination fees, and digital transaction receipts"
        badge={
          fees.pendingAmount === 0 ? (
            <StatusBadge status="COMPLETED" />
          ) : (
            <StatusBadge status="PENDING" />
          )
        }
        actions={
          fees.pendingAmount > 0 ? (
            <button
              onClick={() => {
                setShowPaymentModal(true);
                setPaymentSuccess(false);
              }}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Outstanding Dues (${fees.pendingAmount})</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Dues Settled</span>
            </div>
          )
        }
      />

      {/* 3 Fee Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          label="Total Annual Fee"
          value={`$${fees.totalAnnualFee.toLocaleString()}`}
          subtext="Tuition, Labs & Exam Charges"
          icon={<Building className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          label="Settled Amount"
          value={`$${fees.paidAmount.toLocaleString()}`}
          subtext="Verified via Bank Settlement"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Outstanding Balance"
          value={`$${fees.pendingAmount.toLocaleString()}`}
          subtext={fees.pendingAmount > 0 ? 'Due Date: 15 Nov 2026' : 'Zero balance remaining'}
          icon={<CreditCard className="w-5 h-5" />}
          accentColor={fees.pendingAmount > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* Hall Ticket Clearance Alert */}
      {fees.pendingAmount > 0 ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Exam Hall Ticket Clearance Blocked
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Clear the pending instalment of <strong>${fees.pendingAmount}</strong> to unlock the Term 1 examination hall ticket.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowPaymentModal(true);
              setPaymentSuccess(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Pay Now
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="font-bold">Finance Clearance Confirmed:</strong> Your account is fully paid up. Examination hall ticket is released for printing.
          </div>
        </div>
      )}

      {/* Instalment Breakdown & Transactions History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Payment Receipts History */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Official Payment Receipts History</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Digital fee invoices & transaction tokens</p>
                </div>
                <Receipt className="w-4 h-4 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {fees.transactions.map((tx) => (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800 font-mono text-xs font-bold">
                        TX
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {tx.instalment}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono">{tx.receiptNo}</span>
                          <span>·</span>
                          <span>{tx.date}</span>
                          <span>·</span>
                          <span>{tx.method}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        +${tx.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setActiveReceipt(tx)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="View & Print Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Fee Schedule & Breakdown */}
        <div className="space-y-4">
          <Card className="p-5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Fee Category Schedule
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Term 1 Tuition:</span>
                <span className="font-mono font-bold text-emerald-600">✓ $2,400 (Paid)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">STEM Lab & Tech Fee:</span>
                <span className="font-mono font-bold text-emerald-600">✓ $1,200 (Paid)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Term 2 Tuition & Exam:</span>
                <span className={`font-mono font-bold ${fees.pendingAmount === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {fees.pendingAmount === 0 ? '✓ $1,200 (Paid)' : '$1,200 (Due)'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
              <span>Account Status</span>
              <span className={fees.pendingAmount === 0 ? 'text-emerald-600' : 'text-amber-600'}>
                {fees.pendingAmount === 0 ? 'Cleared for Year' : 'Action Required'}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Pay Now Interactive Modal (Simulated Payment Gateway) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            {paymentSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Confirmed Successfully!
                </h4>
                <p className="text-xs text-slate-500">
                  Transaction completed for <strong>${fees.pendingAmount || 1200}</strong>. An official invoice receipt has been created and your exam hall ticket is released.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-md"
                >
                  Done & Close Gateway
                </button>
              </div>
            ) : (
              <form onSubmit={handlePayNowSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      FutureSchool Payment Gateway
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      256-Bit SSL Encrypted Transaction
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount to Pay */}
                <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-300">Amount Due</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      Term 2 Final Settlement
                    </div>
                  </div>
                  <span className="font-mono text-xl font-black text-teal-700 dark:text-teal-300">
                    ${fees.pendingAmount}
                  </span>
                </div>

                {/* Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('UPI')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMode === 'UPI'
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1" />
                      <span>Instant UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('CARD')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMode === 'CARD'
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1" />
                      <span>Debit/Credit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('NETBANKING')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMode === 'NETBANKING'
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Building className="w-4 h-4 mx-auto mb-1" />
                      <span>NetBanking</span>
                    </button>
                  </div>
                </div>

                {paymentMode === 'UPI' && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-300 mx-auto flex items-center justify-center font-mono text-[10px] text-slate-400">
                      [DEMO QR CODE]
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      VPA: futureschool.gvs@icici
                    </span>
                  </div>
                )}

                {paymentMode === 'CARD' && (
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="Card Number (4532 •••• •••• 8910)"
                      defaultValue="4532 8910 2341 8910"
                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="08/29"
                        className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-center"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        defaultValue="381"
                        maxLength={3}
                        className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-center"
                      />
                    </div>
                  </div>
                )}

                {paymentMode === 'NETBANKING' && (
                  <select className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <option>HDFC Bank Corporate</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Authorizing...</span>
                      </>
                    ) : (
                      <>
                        <span>Authorize Payment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Digital Receipt Inspection Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Official E-Receipt
              </span>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2">
              <div className="font-bold text-base text-slate-900">Greenwood Valley School</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">Receipt #{activeReceipt.receiptNo}</div>
              <div className="text-2xl font-black text-teal-700 mt-2 font-mono">${activeReceipt.amount}</div>
              <div className="text-[11px] text-emerald-600 font-bold uppercase mt-1">Status: Paid & Reconciled</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Student ID:</span>
                <span className="font-mono font-bold">GVS-2027-0001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold">Aarav Sharma</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Instalment:</span>
                <span>{activeReceipt.instalment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Paid:</span>
                <span className="font-mono">{activeReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mode:</span>
                <span>{activeReceipt.method}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-teal-700 text-white hover:bg-teal-800 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
