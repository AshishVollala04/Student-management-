import React, { useState } from 'react';
import { FeeTransaction, FeeBreakdownItem } from '../../types';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Receipt, ArrowRight, ShieldCheck, Download, ChevronRight } from 'lucide-react';

interface FeesScreenProps {
  feesData: {
    totalFees: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: string;
    breakdown: FeeBreakdownItem[];
    transactions: FeeTransaction[];
  };
  onPayFee: (amount: number, method: string) => Promise<{ receipt: any }>;
}

export const FeesScreen: React.FC<FeesScreenProps> = ({ feesData, onPayFee }) => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(feesData.pendingAmount || 600);
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit / Debit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<FeeTransaction | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    setIsProcessing(true);
    const result = await onPayFee(payAmount, paymentMethod);
    setIsProcessing(false);
    setGeneratedReceipt(result.receipt);
  };

  const paidPercentage = Math.round((feesData.paidAmount / feesData.totalFees) * 100);

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Main Fee Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Total Academic Fees
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            ${feesData.totalFees.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Annual 2026-27 Enrollment
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Paid Amount
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            ${feesData.paidAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
            {paidPercentage}% Cleared
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Pending Dues
            </span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            ${feesData.pendingAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5 block">
            Due on {feesData.dueDate}
          </span>
        </div>
      </div>

      {/* Progress Bar & Pay Now Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Annual Fee Clearance Status</span>
              <span className="text-indigo-600 dark:text-indigo-400 tabular-nums">{paidPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Next installment deadline is <strong className="text-slate-700 dark:text-slate-300">{feesData.dueDate}</strong>. Avoid late surcharge by paying in advance.
            </p>
          </div>

          {feesData.pendingAmount > 0 && (
            <button
              onClick={() => {
                setPayAmount(feesData.pendingAmount);
                setShowPayModal(true);
              }}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Now (${feesData.pendingAmount})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Fee Breakdown by Heads */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Fee Component Breakdown
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {feesData.breakdown.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  ${item.amount.toLocaleString()}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  item.status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Payment History Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Payment History & Receipts
        </h3>

        <div className="space-y-2.5">
          {feesData.transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {tx.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Receipt: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{tx.receiptNo}</span> · {tx.date}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Via {tx.method}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                    +${tx.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    Successful
                  </span>
                </div>

                <button
                  onClick={() => setGeneratedReceipt(tx)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Now Interactive Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pay School Fees Online
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure campus payment gateway · Instant receipt generation
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="10"
                    max={feesData.pendingAmount || 5000}
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPayAmount(feesData.pendingAmount)}
                    className="text-[10px] font-semibold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                  >
                    Full Balance (${feesData.pendingAmount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayAmount(Math.round(feesData.pendingAmount / 2))}
                    className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    50% Installment (${Math.round(feesData.pendingAmount / 2)})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choose Payment Method
                </label>
                <div className="space-y-1.5">
                  {['Credit / Debit Card (Visa, Master)', 'Instant UPI / QR Code', 'Net Banking (All Major Banks)'].map(m => (
                    <label
                      key={m}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                        paymentMethod === m
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-white font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{m}</span>
                      <input
                        type="radio"
                        name="method"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m)}
                        className="text-indigo-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pay ${payAmount}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Receipt Modal */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center pb-3 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Payment Authorized
              </h3>
              <p className="text-xs text-slate-500">
                Official FutureSchool Digital Fee Voucher
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Receipt Voucher No:</span>
                <span className="font-mono font-bold text-slate-900">{generatedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date & Timestamp:</span>
                <span className="text-slate-900">{generatedReceipt.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="text-slate-900">{generatedReceipt.method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-900">{generatedReceipt.title}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold border-b-2 border-slate-900">
                <span>Amount Cleared:</span>
                <span className="text-emerald-700 font-mono">${generatedReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setGeneratedReceipt(null);
                  setShowPayModal(false);
                }}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
