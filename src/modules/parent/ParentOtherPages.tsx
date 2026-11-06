import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  MessageSquare, 
  Users, 
  ShieldAlert, 
  FileCheck2, 
  CheckCircle2, 
  Send, 
  Clock, 
  UserCheck,
  QrCode,
  ShieldCheck,
  Phone,
  AlertTriangle,
  Lock,
  Printer
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../mock/academicData';

export const ParentMessages: React.FC = () => {
  const [msgText, setMsgText] = useState('');
  const [recipient, setRecipient] = useState('Mrs. Sarah Jenkins (Class Mentor 10-A)');
  const [toast, setToast] = useState<string | null>(null);

  const [conversation, setConversation] = useState([
    {
      sender: 'mentor',
      author: 'Mrs. Sarah Jenkins',
      text: 'Good afternoon Dr. Sharma. Aarav demonstrated exceptional calculus formulation in today\'s quadratic quiz. His preparation for Term 2 is progressing very well.',
      time: 'Yesterday, 03:40 PM'
    },
    {
      sender: 'parent',
      author: 'Dr. Rajesh Sharma',
      text: 'Thank you Mrs. Jenkins. We noticed he was spending extra time reviewing ray optics diagrams as well. Please let us know if additional mentoring is suggested.',
      time: 'Yesterday, 06:15 PM'
    },
    {
      sender: 'mentor',
      author: 'Mrs. Sarah Jenkins',
      text: 'Certainly! Dr. Michael Chen will be reviewing optics ray tracing during the Wednesday lab. He is in good hands.',
      time: 'Today, 08:15 AM'
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;

    setConversation(prev => [
      ...prev,
      {
        sender: 'parent',
        author: 'Dr. Rajesh Sharma',
        text: msgText,
        time: 'Just now'
      }
    ]);
    setMsgText('');
    setToast('Message transmitted securely to mentor inbox.');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher & Mentor Communication Channel"
        subtitle="Direct official messaging with Class Mentor and assigned Subject Faculty"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <Card className="flex flex-col h-[520px]">
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-900 dark:text-white">Active Channel:</span>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 font-semibold"
            >
              <option value="Mrs. Sarah Jenkins (Class Mentor 10-A)">Mrs. Sarah Jenkins (Class Mentor 10-A)</option>
              <option value="Dr. Michael Chen (Physics Faculty)">Dr. Michael Chen (Physics Faculty)</option>
              <option value="Mr. Alan Turing Jr. (CS Faculty)">Mr. Alan Turing Jr. (CS Faculty)</option>
            </select>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mentor Online</span>
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {conversation.map((c, i) => (
            <div
              key={i}
              className={`flex flex-col ${c.sender === 'parent' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  c.sender === 'parent'
                    ? 'bg-teal-700 text-white rounded-br-xs shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-bold opacity-80 mb-1">{c.author} · {c.time}</div>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            placeholder="Type your inquiry for Mrs. Sarah Jenkins..."
            className="flex-1 px-4 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </Card>
    </div>
  );
};

export const ParentMeetings: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent-Teacher Conferences (PTM)"
        subtitle="Scheduled consultation slots and official meeting minutes summaries"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Confirmed Reservation
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Term 1 Academic Progress & Board Preparation Conference
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Date: Saturday, November 14th · 10:15 - 10:30 AM (15 mins reserved)
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Venue: Academic Block East · Room 304 (Home Room)
            </p>
          </div>
          <StatusBadge status="APPROVED" />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            Faculty Panel:
          </span>
          <p className="text-slate-600 dark:text-slate-400">
            Mrs. Sarah Jenkins (Class Mentor · Mathematics), Dr. Michael Chen (Physics), Ms. Clara Oswald (English)
          </p>

          <div className="mt-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-[11px] text-teal-900 dark:text-teal-200">
            <strong>Agenda:</strong> Discussion of Aarav's 91.2% Term 1 result, advanced problem solving for CBSE Board preparation, and project guidance for the upcoming STEM exhibition.
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ParentPickup: React.FC = () => {
  const [showGatePassModal, setShowGatePassModal] = useState(false);
  const [passRecipientName, setPassRecipientName] = useState('Vikram Sharma (Uncle)');
  const [passRecipientPhone, setPassRecipientPhone] = useState('+91 98450 77112');
  const [passReason, setPassReason] = useState('Parent attending emergency medical consultation');
  const [generatedPass, setGeneratedPass] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `GATE-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedPass(token);
    setToast(`One-time security exit pass ${token} activated for 2 hours.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gate Clearance & Pickup Authorizations"
        subtitle="Security gate authorizations, authorized primary guardians, and emergency early exit passes"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => {
              setShowGatePassModal(true);
              setGeneratedPass(null);
            }}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            Generate Emergency Exit Pass
          </button>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Authorized Caregivers Card */}
        <Card className="p-5">
          <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Authorized Gate Pickups</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Verified biometric & photo ID on campus security system</p>
          </CardHeader>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 dark:text-white">Dr. Rajesh Sharma</strong> (Father / Primary)
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">+91 98450 12345 · Aadhaar Verified</div>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 dark:text-white">Mrs. Priya Sharma</strong> (Mother / Secondary)
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">+91 98450 67890 · Aadhaar Verified</div>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>
          </div>
        </Card>

        {/* Emergency Early Exit Pass Card */}
        <Card className="p-5">
          <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Early Campus Exit Pass</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Authorizes non-registered relatives or drivers</p>
          </CardHeader>
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If a relative, driver, or guardian needs to pick up <strong>Aarav Sharma</strong> before dismissal time (03:15 PM), generate an encrypted time-limited QR/OTP pass for presentation at Gate #1 security kiosk.
            </p>
            <button
              onClick={() => {
                setShowGatePassModal(true);
                setGeneratedPass(null);
              }}
              className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Issue Temporary Gate Token
            </button>
          </div>
        </Card>
      </div>

      {/* Emergency Gate Pass Modal */}
      {showGatePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            {generatedPass ? (
              <div className="text-center py-3 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-300">
                  <QrCode className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Temporary Gate Pass Generated
                </h4>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-lg font-black tracking-widest text-teal-700 dark:text-teal-300">
                  {generatedPass}
                </div>
                <p className="text-xs text-slate-500">
                  Authorized for: <strong>{passRecipientName}</strong> ({passRecipientPhone}).
                  <br />Valid for 2 Hours from issuance. Dispatched via SMS.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGatePassModal(false)}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGeneratePass} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Generate Security Gate Token
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowGatePassModal(false)}
                    className="text-slate-400 hover:text-slate-900"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Caregiver / Person Collecting Ward
                  </label>
                  <input
                    type="text"
                    required
                    value={passRecipientName}
                    onChange={(e) => setPassRecipientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Caregiver Mobile Number (For SMS Pass)
                  </label>
                  <input
                    type="text"
                    required
                    value={passRecipientPhone}
                    onChange={(e) => setPassRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reason for Early Release
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={passReason}
                    onChange={(e) => setPassReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGatePassModal(false)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800 shadow-sm"
                  >
                    Activate Pass
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ParentConsent: React.FC = () => {
  const [signed, setSigned] = useState(false);
  const [signedDate, setSignedDate] = useState<string | null>(null);

  const handleSign = () => {
    setSigned(true);
    setSignedDate(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parental Consent & Digital Waivers"
        subtitle="Electronic authorizations for academic field trips, science exhibitions, and athletic heats"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded">
                Action Required
              </span>
              <span className="text-xs font-mono text-slate-400">REF: PERM-2026-STEM-04</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              Annual STEM & Robotics Exhibition 2026 Participation & Coach Excursion
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Excursion Date: 20 November 2026 · Destination: State Convention Center & ISRO Pavilion
            </p>
          </div>
          <StatusBadge status={signed ? 'APPROVED' : 'PENDING'} />
        </div>

        <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            I hereby give consent for my ward <strong>Aarav Sharma (Grade 10-A, Roll #18)</strong> to travel via official chartered school coach to the State Convention Center and present the quadratic trajectory simulation robotics exhibit.
          </p>
          <p>
            I confirm that the school has medical information on file and that certified faculty mentors (Mrs. Sarah Jenkins & Dr. Michael Chen) will accompany the delegation.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            {signed ? `Digital signature timestamped: ${signedDate}` : 'Requires electronic guardian signature before 10 Nov 2026.'}
          </span>
          {!signed ? (
            <button
              onClick={handleSign}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Sign Consent Electronically
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Signed by Dr. Rajesh Sharma (Guardian)</span>
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};
