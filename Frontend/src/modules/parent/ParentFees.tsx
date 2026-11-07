import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  CreditCard, 
  CheckCircle2, 
  Receipt, 
  AlertCircle, 
  Download, 
  IndianRupee, 
  QrCode, 
  Printer, 
  X, 
  Building2, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../mock/academicData';

interface VoucherDetails {
  receiptNo: string;
  utrNo: string;
  amount: number;
  date: string;
  time: string;
  method: string;
  instalmentName: string;
}

function numberToWordsIndian(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }
  return inWords(num) + ' Rupees Only';
}

export const ParentFees: React.FC = () => {
  const [workflow, store] = useWorkflow();
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(workflow.fees.pendingAmount || 12000);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING' | 'CARD'>('UPI');
  const [upiApp, setUpiApp] = useState<'PHONEPE' | 'GPAY' | 'PAYTM' | 'BHIM'>('PHONEPE');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 3-Part Voucher Modal State
  const [activeVoucher, setActiveVoucher] = useState<VoucherDetails | null>(null);

  // 4 Instalments Structure (Total ₹48,000 for Grade 10 SSC)
  const instalments = [
    { 
      name: 'Instalment 1: Term 1 Admission & School Reopening', 
      amount: 24000, 
      dueDate: '10 Aug 2026', 
      status: 'COMPLETED',
      description: 'Tuition, Science & Computer Lab, Annual Registration'
    },
    { 
      name: 'Instalment 2: Term 2 Pre-Half-Yearly Tuition', 
      amount: 12000, 
      dueDate: '15 Sep 2026', 
      status: 'COMPLETED',
      description: 'Term 2 Instruction, Formative Assessment (FA-1 & FA-2)'
    },
    { 
      name: 'Instalment 3: Term 3 Pre-Quarterly Assessment', 
      amount: 8000, 
      dueDate: '15 Nov 2026', 
      status: workflow.fees.pendingAmount <= 4000 ? 'COMPLETED' : 'OVERDUE',
      description: 'Term 3 Tuition, FA-3 Evaluation, Library & Sports Fee'
    },
    { 
      name: 'Instalment 4: Term 4 Pre-Final & Board Exam Fee', 
      amount: 4000, 
      dueDate: '15 Jan 2027', 
      status: workflow.fees.pendingAmount === 0 ? 'COMPLETED' : 'PENDING',
      description: 'SSC Board Exam Center Fee, SA-2 & Hall Ticket Clearance'
    }
  ];

  const handleCheckoutSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (payAmount <= 0) return;

    setIsProcessing(true);
    const methodLabel = paymentMethod === 'UPI' 
      ? `Instant UPI (${upiApp === 'PHONEPE' ? 'PhonePe' : upiApp === 'GPAY' ? 'Google Pay' : upiApp === 'PAYTM' ? 'Paytm' : 'BHIM'})`
      : paymentMethod === 'NETBANKING'
      ? `NetBanking (${selectedBank})`
      : 'RuPay / Debit Card';

    setTimeout(() => {
      store.processFeePayment(payAmount, methodLabel);
      if (payAmount >= workflow.fees.pendingAmount) {
        store.classTeacherReleaseHallTicket('GVS-2027-0001');
      }
      setIsProcessing(false);
      setShowPayModal(false);

      const now = new Date();
      const voucherData: VoucherDetails = {
        receiptNo: `GVS/SSC/2026-27/${Math.floor(1000 + Math.random() * 9000)}`,
        utrNo: `UPI${now.getFullYear()}${Math.floor(100000000 + Math.random() * 900000000)}`,
        amount: payAmount,
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        method: methodLabel,
        instalmentName: payAmount >= 8000 ? 'Instalment 3 & 4 (Term 3 & SSC Board Fee)' : 'Instalment 3 (Term 3 Assessment)'
      };

      setActiveVoucher(voucherData);
    }, 700);
  };

  const openHistoricalVoucher = (tx: any) => {
    setActiveVoucher({
      receiptNo: tx.receiptNo || 'GVS/SSC/2026-27/3812',
      utrNo: `UPI2026${Math.floor(100000000 + Math.random() * 900000000)}`,
      amount: tx.amount,
      date: tx.date || '10 Aug 2026',
      time: '11:30 AM',
      method: tx.method || 'Instant UPI',
      instalmentName: tx.instalment || 'Academic Tuition Instalment'
    });
  };

  return (
    <div className="space-y-6">
      {/* Print CSS Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #three-part-receipt-printable, #three-part-receipt-printable * {
            visibility: visible !important;
          }
          #three-part-receipt-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <PageHeader
        title="Student Fee Portal & Accounts Clearance"
        subtitle="Greenwood Valley High School · State Board (SSC) · Fee schedule, Instant UPI gateway & 3-Part Receipts"
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
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-900/20 transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Pay Outstanding via UPI (₹{workflow.fees.pendingAmount.toLocaleString()})</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All 4 Annual Instalments Fully Cleared</span>
            </div>
          )
        }
      />

      {/* Safety Notice on Simulated Indian School Payment Gateway */}
      <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Official State Board Fee Counter:</strong> Payment reconciled directly with SBI Institutional Fee Account (VPA: <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded font-mono font-bold text-blue-800 dark:text-blue-300">gvs.ssc@sbi</code>). Cleared payments immediately unblock the SSC Examination Hall Ticket.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 shrink-0">
          State Board SSC
        </span>
      </div>

      {/* 3 Indian Rupee Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Annual Fee"
          value={`₹${workflow.fees.totalAnnualFee.toLocaleString()}`}
          subtext="Grade 10 Annual SSC Tuition & Lab"
          icon={<IndianRupee className="w-5 h-5" />}
          accentColor="slate"
        />
        <StatCard
          label="Total Settled to Date"
          value={`₹${workflow.fees.paidAmount.toLocaleString()}`}
          subtext={`${Math.round((workflow.fees.paidAmount / workflow.fees.totalAnnualFee) * 100)}% Cleared across approved milestones`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Pending Balance"
          value={`₹${workflow.fees.pendingAmount.toLocaleString()}`}
          subtext={workflow.fees.pendingAmount === 0 ? 'No Dues · Hall Ticket Unlocked' : 'Due Deadline: 15 Nov 2026'}
          icon={<CreditCard className="w-5 h-5" />}
          accentColor={workflow.fees.pendingAmount === 0 ? 'emerald' : 'rose'}
        />
      </div>

      {/* 4 Instalments Schedule Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>State Board 4-Instalment Academic Fee Structure (Total ₹48,000)</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Approved annual schedule as per Karnataka State Secondary Education Board guidelines</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
              Candidate: {STUDENT_PROFILE.name} (Roll #18)
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {instalments.map((inst, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {inst.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Term {i + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {inst.description}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    Payment Deadline: <strong className="text-slate-700 dark:text-slate-300">{inst.dueDate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-slate-900 dark:text-white block">
                      ₹{inst.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Instalment Value</span>
                  </div>
                  <StatusBadge status={inst.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Official Payment History & 3-Part Voucher Generation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Official Payment Receipts & 3-Part Vouchers</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Accounts clearance vouchers with verified Bank UTR and QR verification</p>
            </div>
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workflow.fees.transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No payment records currently on file.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Settle your upcoming term fee via Instant UPI or NetBanking to generate an official 3-Part State Board voucher.</p>
              </div>
            ) : (
              workflow.fees.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    ₹
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Receipt #{tx.receiptNo}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {tx.instalment}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Paid on <strong className="text-slate-700 dark:text-slate-300">{tx.date}</strong> via {tx.method}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-mono font-bold text-sm text-emerald-600">
                    +₹{tx.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => openHistoricalVoucher(tx)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="View formal 3-Part State Board Fee Receipt Voucher"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View 3-Part Voucher</span>
                  </button>
                </div>
              </div>
            )))}
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          CHECKOUT MODAL: INSTANT UPI QR CODE MODAL
         ========================================================================= */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    State Board Fee Counter
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Affil #GVS-SSC-2026</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Online Fee Settlement & Clearance
                </h3>
                <p className="text-xs text-slate-500">Student: Aarav Sharma · Class 10-A · Reg: GVS-2027-0001</p>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Amount Selection */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Settlement Amount (in ₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-base font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="500"
                  max={workflow.fees.pendingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 text-base font-black border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={() => setPayAmount(workflow.fees.pendingAmount)}
                  className="text-xs font-bold text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  Pay Full Balance (₹{workflow.fees.pendingAmount.toLocaleString()})
                </button>
                {workflow.fees.pendingAmount >= 8000 && (
                  <button
                    type="button"
                    onClick={() => setPayAmount(8000)}
                    className="text-xs font-bold text-slate-700 bg-slate-200 dark:bg-slate-700 dark:text-slate-200 px-3 py-1 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Pay Term 3 Only (₹8,000)
                  </button>
                )}
                {workflow.fees.pendingAmount > 4000 && (
                  <button
                    type="button"
                    onClick={() => setPayAmount(4000)}
                    className="text-xs font-bold text-slate-700 bg-slate-200 dark:bg-slate-700 dark:text-slate-200 px-3 py-1 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Pay Term 4 Exam Only (₹4,000)
                  </button>
                )}
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Choose Instant Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-blue-600" />
                  <span>Instant UPI QR</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Zero Surcharge</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>NetBanking</span>
                  <span className="text-[10px] text-slate-400 font-medium">All Major Banks</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-teal-600" />
                  <span>RuPay / Debit Card</span>
                  <span className="text-[10px] text-slate-400 font-medium">OTP Verified</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: UPI QR CODE */}
            {paymentMethod === 'UPI' && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Scan with any UPI App</span>
                </div>

                {/* UPI App Selection Chips */}
                <div className="flex justify-center gap-2">
                  {[
                    { id: 'PHONEPE', name: 'PhonePe', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                    { id: 'GPAY', name: 'Google Pay', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { id: 'PAYTM', name: 'Paytm UPI', color: 'bg-sky-50 text-sky-700 border-sky-200' },
                    { id: 'BHIM', name: 'BHIM UPI', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        upiApp === app.id
                          ? `${app.color} ring-2 ring-blue-500`
                          : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>

                {/* Visual Crisp SVG QR Code Box */}
                <div className="relative inline-block p-4 bg-white rounded-2xl shadow-md border-2 border-slate-200">
                  <svg className="w-44 h-44 mx-auto" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background */}
                    <rect width="160" height="160" fill="white" />
                    
                    {/* Top-Left Corner Box */}
                    <rect x="10" y="10" width="40" height="40" rx="4" fill="#0f172a" />
                    <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
                    <rect x="22" y="22" width="16" height="16" rx="2" fill="#1e3a8a" />

                    {/* Top-Right Corner Box */}
                    <rect x="110" y="10" width="40" height="40" rx="4" fill="#0f172a" />
                    <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
                    <rect x="122" y="22" width="16" height="16" rx="2" fill="#1e3a8a" />

                    {/* Bottom-Left Corner Box */}
                    <rect x="10" y="110" width="40" height="40" rx="4" fill="#0f172a" />
                    <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
                    <rect x="22" y="122" width="16" height="16" rx="2" fill="#1e3a8a" />

                    {/* Authentic QR Matrix Pattern Grid */}
                    <g fill="#1e293b">
                      {/* Top Timing Line */}
                      <rect x="54" y="26" width="6" height="6" />
                      <rect x="66" y="26" width="6" height="6" />
                      <rect x="78" y="26" width="6" height="6" />
                      <rect x="90" y="26" width="6" height="6" />
                      <rect x="102" y="26" width="6" height="6" />

                      {/* Left Timing Line */}
                      <rect x="26" y="54" width="6" height="6" />
                      <rect x="26" y="66" width="6" height="6" />
                      <rect x="26" y="78" width="6" height="6" />
                      <rect x="26" y="90" width="6" height="6" />
                      <rect x="26" y="102" width="6" height="6" />

                      {/* Data modules */}
                      <rect x="58" y="42" width="6" height="6" />
                      <rect x="70" y="42" width="6" height="6" />
                      <rect x="82" y="42" width="6" height="6" />
                      <rect x="94" y="42" width="6" height="6" />
                      <rect x="118" y="58" width="6" height="6" />
                      <rect x="130" y="58" width="6" height="6" />
                      <rect x="142" y="70" width="6" height="6" />
                      <rect x="118" y="70" width="6" height="6" />
                      <rect x="130" y="82" width="6" height="6" />
                      <rect x="118" y="94" width="6" height="6" />
                      <rect x="130" y="94" width="6" height="6" />
                      <rect x="142" y="94" width="6" height="6" />
                      <rect x="106" y="82" width="6" height="6" />
                      <rect x="94" y="94" width="6" height="6" />
                      <rect x="82" y="106" width="6" height="6" />
                      <rect x="70" y="106" width="6" height="6" />
                      <rect x="58" y="118" width="6" height="6" />
                      <rect x="70" y="118" width="6" height="6" />
                      <rect x="82" y="118" width="6" height="6" />
                      <rect x="94" y="118" width="6" height="6" />
                      <rect x="106" y="118" width="6" height="6" />
                      <rect x="118" y="118" width="6" height="6" />
                      <rect x="130" y="118" width="6" height="6" />
                      <rect x="142" y="118" width="6" height="6" />
                      <rect x="58" y="130" width="6" height="6" />
                      <rect x="82" y="130" width="6" height="6" />
                      <rect x="106" y="130" width="6" height="6" />
                      <rect x="130" y="130" width="6" height="6" />
                      <rect x="70" y="142" width="6" height="6" />
                      <rect x="94" y="142" width="6" height="6" />
                      <rect x="118" y="142" width="6" height="6" />
                      <rect x="142" y="142" width="6" height="6" />
                    </g>

                    {/* Central UPI Logo Badge */}
                    <rect x="56" y="56" width="48" height="48" rx="8" fill="white" stroke="#1e3a8a" strokeWidth="2" />
                    <rect x="59" y="59" width="42" height="42" rx="6" fill="#1e3a8a" />
                    <text x="80" y="76" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="900" fontFamily="sans-serif">
                      UPI
                    </text>
                    <text x="80" y="92" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                      ₹{payAmount >= 1000 ? `${payAmount / 1000}k` : payAmount}
                    </text>
                  </svg>
                  
                  {/* Verified Indian UPI Watermark */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Verified VPA</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    UPI ID: <span className="text-blue-600 dark:text-blue-400">gvs.ssc@sbi</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Payee: <strong>Greenwood Valley School Fee Collection A/C</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Candidate: Aarav Sharma (GVS-2027-0001)
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: NETBANKING */}
            {paymentMethod === 'NETBANKING' && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Participating Bank
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  {[
                    'State Bank of India (SBI)',
                    'HDFC Bank',
                    'ICICI Bank',
                    'Canara Bank',
                    'Punjab National Bank',
                    'Axis Bank'
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-left truncate transition-colors cursor-pointer ${
                        selectedBank === bank
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: RUPAY / DEBIT CARD */}
            {paymentMethod === 'CARD' && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    RuPay / Visa / MasterCard Debit Card Number
                  </label>
                  <input
                    type="text"
                    defaultValue="6074 •••• •••• 9214"
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      defaultValue="08/29"
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CVV / Security Code
                    </label>
                    <input
                      type="password"
                      defaultValue="•••"
                      readOnly
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCheckoutSubmit()}
                disabled={isProcessing}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reconciling Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Pay ₹{payAmount.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE 3-PART STATE BOARD FEE RECEIPT VOUCHER MODAL
          (Student Copy, Bank/Accounts Copy, School Copy)
         ========================================================================= */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl bg-white text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 max-h-[96vh] overflow-y-auto">
            {/* Modal Action Toolbar (Hidden during Print) */}
            <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    State Board Formal 3-Part Fee Receipt Voucher
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Official 3-coupon voucher (Student Copy · Bank/Accounts Copy · School Copy)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print 3-Part Voucher</span>
                </button>
                <button
                  onClick={() => setActiveVoucher(null)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ================= PRINTABLE AREA START ================= */}
            <div id="three-part-receipt-printable" className="space-y-6 bg-white text-slate-900">
              {[
                { partName: 'PART 1: STUDENT / PARENT COPY', colorTag: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                { partName: 'PART 2: BANK / ACCOUNTS OFFICE COPY', colorTag: 'bg-blue-100 text-blue-900 border-blue-300' },
                { partName: 'PART 3: SCHOOL MANAGEMENT RECORD COPY', colorTag: 'bg-amber-100 text-amber-900 border-amber-300' }
              ].map((coupon, idx) => (
                <div key={idx} className="relative">
                  {/* Coupon Card Container */}
                  <div className="border-2 border-slate-800 rounded-2xl p-4 sm:p-5 bg-white space-y-3">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b-2 border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black tracking-tight text-blue-950 uppercase">
                            GREENWOOD VALLEY HIGH SCHOOL
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${coupon.colorTag}`}>
                            {coupon.partName}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium">
                          Recognized by Dept. of Public Instruction, Govt. of Karnataka · Affiliated to State Board (SSC)
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Affiliation Code: GVS-SSC-2026 · Whitefield Main Road, Bengaluru - 560066 · Tel: 080-2845-1234
                        </p>
                      </div>

                      <div className="text-right sm:text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-slate-900">
                          Receipt No: <span className="text-blue-900 font-black">{activeVoucher.receiptNo}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Date: <strong>{activeVoucher.date}</strong> · Time: <strong>{activeVoucher.time}</strong>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Bank Ref / UTR: <strong>{activeVoucher.utrNo}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Candidate Demographics Table */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                        <span className="font-bold text-slate-900">{STUDENT_PROFILE.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Class & Section</span>
                        <span className="font-bold text-slate-900">Class 10 - Section A (Roll #{STUDENT_PROFILE.rollNumber})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Admission / Reg No</span>
                        <span className="font-mono font-bold text-slate-900">{STUDENT_PROFILE.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Father / Guardian</span>
                        <span className="font-bold text-slate-900">{STUDENT_PROFILE.father.name}</span>
                      </div>
                    </div>

                    {/* Particulars Breakdown Table */}
                    <table className="w-full text-xs border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-left">
                          <th className="p-2 border-r border-slate-300 w-12 text-center">S.No</th>
                          <th className="p-2 border-r border-slate-300">Fee Head / Description</th>
                          <th className="p-2 border-r border-slate-300">Academic Term</th>
                          <th className="p-2 text-right w-36">Amount (INR ₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2 border-r border-slate-200 text-center font-mono">1</td>
                          <td className="p-2 border-r border-slate-200">
                            <span className="font-bold text-slate-900">{activeVoucher.instalmentName}</span>
                            <span className="block text-[10px] text-slate-500">State Board SSC Tuition & Academic Instruction</span>
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">Academic Year 2026-27</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-900">
                            ₹{activeVoucher.amount.toLocaleString()}.00
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-bold border-t-2 border-slate-800">
                          <td colSpan={3} className="p-2 border-r border-slate-300 text-right uppercase text-[11px] text-slate-700">
                            Total Received Amount:
                          </td>
                          <td className="p-2 text-right font-mono text-sm font-black text-blue-950">
                            ₹{activeVoucher.amount.toLocaleString()}.00
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* In Words & Mode */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                      <div>
                        <span className="text-slate-500">Amount in Words: </span>
                        <strong className="text-slate-900 underline decoration-slate-300">
                          {numberToWordsIndian(activeVoucher.amount)}
                        </strong>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        Payment Mode: <strong>{activeVoucher.method}</strong>
                      </div>
                    </div>

                    {/* Official Stamp & Signatures */}
                    <div className="pt-4 border-t border-dashed border-slate-300 flex items-end justify-between text-xs">
                      <div className="text-[10px] text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Computer Generated Voucher · Signature Validated</span>
                        </div>
                        <div>Subject to realization of payment · Retain for IT tax exemption under 80C</div>
                      </div>

                      <div className="flex items-center gap-8 text-center text-[10px] font-bold text-slate-600">
                        <div className="border-t border-slate-400 pt-1 w-32">
                          Parent / Depositor
                        </div>
                        <div className="border-t border-slate-800 pt-1 w-36 text-blue-950 font-black">
                          Accounts Officer / Cashier
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scissor / Cut Line Divider between coupons */}
                  {idx < 2 && (
                    <div className="relative my-4 text-center">
                      <div className="border-t-2 border-dashed border-slate-400 w-full" />
                      <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-3 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                        ✂ - - - - - - - - [ TEAR / DETACH HERE ] - - - - - - - - ✂
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* ================= PRINTABLE AREA END ================= */}

            {/* Bottom Actions */}
            <div className="no-print pt-4 border-t border-slate-200 mt-4 flex justify-end gap-3">
              <button
                onClick={() => setActiveVoucher(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close Voucher
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-800 hover:bg-blue-900 text-white shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official 3-Part Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
