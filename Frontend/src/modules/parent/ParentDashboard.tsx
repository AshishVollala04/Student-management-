import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CreditCard,
  CalendarCheck,
  Award,
  Bus,
  BookOpen,
  Bell,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  QrCode,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  Clock,
  Compass,
  MapPin,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { STUDENT_PROFILE, STUDENT_EXAM_RESULTS } from '../../mock/academicData';

export const ParentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow] = useWorkflow();
  const navigate = useNavigate();
  const [showQrModal, setShowQrModal] = useState(false);

  // Defensive fee calculation
  const rawFee = workflow?.fees?.pendingAmount ?? (workflow?.fees as any)?.pendingamount;
  const feeDue = typeof rawFee === 'number' && !isNaN(rawFee) ? rawFee : 12000;
  const myHallTicket = workflow?.hallTickets?.find(h => h.studentId === 'GVS-2027-0001');
  const isTicketCleared = Boolean(myHallTicket?.classTeacherReleased || feeDue === 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* =========================================================================
          1. RAILONE-STYLE INSTITUTIONAL HERO PASS (Header Banner)
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b3b60] via-[#0f4c81] to-[#1e5a8a] text-white p-5 sm:p-7 shadow-xl border border-blue-900/40">
        {/* Subtle Background Geometric Circuit/Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-4">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Candidate Pass & Identity */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={currentUser?.studentName ? `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(currentUser.studentName)}&backgroundColor=c0aede` : STUDENT_PROFILE.avatar}
                alt={currentUser?.studentName || STUDENT_PROFILE.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 bg-white/10 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs border border-white/20">
                  State Board (SSC)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 font-mono">
                  Roll #{currentUser?.rollNumber || '18'}
                </span>
                <span className="text-[11px] text-blue-200 font-medium hidden sm:inline">
                  Affil: GVS-SSC-2026
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {currentUser?.studentName || STUDENT_PROFILE.name}
              </h2>

              <p className="text-xs text-blue-100 flex items-center gap-2 mt-0.5">
                <span>Class {currentUser?.grade || '10'} - Section {currentUser?.section || 'A'}</span>
                <span>·</span>
                <span className="font-mono">Reg ID: {currentUser?.studentId || STUDENT_PROFILE.id}</span>
                <span>·</span>
                <span>Guardian: {currentUser?.name || 'Dr. Rajesh Sharma'}</span>
              </p>
            </div>
          </div>

          {/* Right: Quick QR Admit Pass Button & Status */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-white/15 gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-[#0b3b60] hover:bg-blue-50 text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-800" />
              <span>Digital Exam Pass</span>
            </button>

            <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Academic Year 2026-27 Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. URGENT / PRIORITY SERVICE STRIP (Like RailOne Live Booking / Alert)
         ========================================================================= */}
      {feeDue > 0 ? (
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-300 dark:border-orange-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-900 dark:text-orange-200">
                  Priority Action: Term 3 Fee Due
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-100 font-mono">
                  ₹{feeDue.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-orange-800 dark:text-orange-300 mt-0.5">
                Settle outstanding fee via Instant UPI (PhonePe / GPay) to maintain unblocked Examination Hall Ticket.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/parent/fees')}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md self-end sm:self-center transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Pay via UPI Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>All Term Fees Cleared:</strong> State Board Examination Hall Ticket is released and validated.
            </span>
          </div>
          <button
            onClick={() => navigate('/parent/fees')}
            className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 underline cursor-pointer shrink-0"
          >
            View 3-Part Receipts
          </button>
        </div>
      )}

      {/* =========================================================================
          3. RAILONE 8-SERVICE GRID (The Core "Super-App" Action Hub)
         ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-700" />
            <span>RailOne School Services & Quick Actions</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Class 10-A Portal</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Fees & UPI */}
          <div
            onClick={() => navigate('/parent/fees')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                ₹
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                feeDue > 0 ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {feeDue > 0 ? 'Due' : 'Cleared'}
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-700 transition-colors">
                Fees & UPI Pay
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                4-term ledger & 3-part vouchers
              </p>
            </div>
          </div>

          {/* 2. Hall Ticket */}
          <div
            onClick={() => setShowQrModal(true)}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                SA-1 Ready
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 transition-colors">
                Exam Admit Card
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Paperless QR ticket pass
              </p>
            </div>
          </div>

          {/* 3. Daily Attendance */}
          <div
            onClick={() => navigate('/parent/attendance')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-mono">
                94.2%
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-700 transition-colors">
                Attendance Log
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Morning & afternoon roll-call
              </p>
            </div>
          </div>

          {/* 4. Marks & 10-Point GPA */}
          <div
            onClick={() => navigate('/parent/academics')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                A1 · Rank 3
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-700 transition-colors">
                Marks & Report Card
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                FA & SA continuous evaluation
              </p>
            </div>
          </div>

          {/* 5. Live School Bus Commute */}
          <div
            onClick={() => navigate('/parent/transport')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono">
                Route 14
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-700 transition-colors">
                Live Bus Commute
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                KA-01-FS-4012 · Palm Meadows
              </p>
            </div>
          </div>

          {/* 6. Daily Homework & Tasks */}
          <div
            onClick={() => navigate('/parent/homework')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                2 Due
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700 transition-colors">
                Homework & Diary
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Daily assignments & revision
              </p>
            </div>
          </div>

          {/* 7. Class Mentor Channel */}
          <div
            onClick={() => navigate('/parent/messages')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Online
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 transition-colors">
                Mentor Helpline
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Mrs. Sarah Jenkins (10-A)
              </p>
            </div>
          </div>

          {/* 8. Leave Application */}
          <div
            onClick={() => navigate('/parent/leave')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                Quick Apply
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-700 transition-colors">
                Apply for Leave
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Medical & emergency leave
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. LIVE COMMUTE & CAMPUS NOTICES DUAL CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transit Status (Like Live Train Status in RailOne) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Commute Tracker
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">Bus KA-01-FS-4012 · Route 14</p>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              ON TIME
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Boarding Point:</span>
              <strong className="text-slate-900 dark:text-white">Palm Meadows Gate (07:15 AM)</strong>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Destination:</span>
              <strong className="text-slate-900 dark:text-white">Campus Main Porch (08:10 AM)</strong>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Assigned Driver:</span>
              <span className="text-blue-700 font-semibold">Suresh Kumar (+91 98860 33441)</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/parent/transport')}
            className="w-full py-2 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Track Bus Route & Stops</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Campus Notices */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Official Campus Circulars
                </h4>
                <p className="text-[10px] text-slate-500">State Board Examination Wing</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              URGENT
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
            <div className="font-bold text-slate-900 dark:text-white">
              SSC Class 10 Candidate Verification
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cross-check candidate spelling, date of birth, and language codes with Class Mentor before Nov 10th.
            </p>
            <span className="text-[10px] text-blue-700 font-mono font-bold block pt-1">
              Doc: SSC_Candidate_Verification_Checklist.pdf
            </span>
          </div>

          <button
            onClick={() => navigate('/parent/messages')}
            className="w-full py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Message Examination Office</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          5. RAILONE-STYLE DIGITAL QR PASS MODAL (Paperless Ticket Pass)
         ========================================================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-blue-900 text-center space-y-4">
            {/* Ticket Header */}
            <div className="border-b-2 border-dashed border-slate-300 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 dark:text-blue-300">
                  Greenwood Valley High School
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-900 font-mono">
                  GVS-SSC-2026
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase mt-1">
                Official Examination Admit Pass
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Term 1 Comprehensive Assessment 2026-27
              </p>
            </div>

            {/* High Contrast QR Code Display (like RailOne Paperless QR Ticket) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-40 h-40 bg-white p-2.5 rounded-xl border-2 border-slate-800 mx-auto shadow-inner flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 160 160" fill="none">
                  <rect width="160" height="160" fill="white" />
                  <rect x="10" y="10" width="40" height="40" rx="4" fill="#0b3b60" />
                  <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
                  <rect x="22" y="22" width="16" height="16" rx="2" fill="#0b3b60" />

                  <rect x="110" y="10" width="40" height="40" rx="4" fill="#0b3b60" />
                  <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
                  <rect x="122" y="22" width="16" height="16" rx="2" fill="#0b3b60" />

                  <rect x="10" y="110" width="40" height="40" rx="4" fill="#0b3b60" />
                  <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
                  <rect x="22" y="122" width="16" height="16" rx="2" fill="#0b3b60" />

                  <g fill="#1e293b">
                    <rect x="58" y="22" width="8" height="8" />
                    <rect x="74" y="22" width="8" height="8" />
                    <rect x="90" y="22" width="8" height="8" />
                    <rect x="58" y="38" width="8" height="8" />
                    <rect x="90" y="38" width="8" height="8" />
                    <rect x="22" y="58" width="8" height="8" />
                    <rect x="38" y="58" width="8" height="8" />
                    <rect x="58" y="58" width="8" height="8" />
                    <rect x="74" y="58" width="8" height="8" />
                    <rect x="110" y="58" width="8" height="8" />
                    <rect x="130" y="58" width="8" height="8" />
                    <rect x="58" y="74" width="8" height="8" />
                    <rect x="90" y="74" width="8" height="8" />
                    <rect x="122" y="74" width="8" height="8" />
                    <rect x="22" y="90" width="8" height="8" />
                    <rect x="58" y="90" width="8" height="8" />
                    <rect x="74" y="90" width="8" height="8" />
                    <rect x="110" y="90" width="8" height="8" />
                    <rect x="130" y="90" width="8" height="8" />
                    <rect x="58" y="110" width="8" height="8" />
                    <rect x="74" y="110" width="8" height="8" />
                    <rect x="122" y="110" width="8" height="8" />
                    <rect x="58" y="130" width="8" height="8" />
                    <rect x="90" y="130" width="8" height="8" />
                    <rect x="130" y="130" width="8" height="8" />
                  </g>
                </svg>
              </div>

              <div className="mt-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                PASS ID: <span className="text-blue-700">HT-2026-10A-18</span>
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                {isTicketCleared ? '✓ Validated & Cleared' : 'Provisional Pass'}
              </span>
            </div>

            {/* Candidate Credentials */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate:</span>
                <strong className="text-slate-900 dark:text-white">{currentUser?.studentName || STUDENT_PROFILE.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class & Roll:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">Class {currentUser?.grade || '10'}-{currentUser?.section || 'A'} (Roll #{currentUser?.rollNumber || '18'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exam Center:</span>
                <span className="text-blue-700 font-bold">Hall 304 · Main Academic Wing</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
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
