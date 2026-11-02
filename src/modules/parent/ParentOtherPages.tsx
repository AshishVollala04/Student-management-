import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MessageSquare, Users, ShieldAlert, FileCheck2, CheckCircle2, Send, Clock, UserCheck } from 'lucide-react';

export const ParentMessages: React.FC = () => {
  const [msgText, setMsgText] = useState('');
  const [recipient, setRecipient] = useState('Mrs. Sarah Jenkins (Class Mentor 10-A)');
  const [toast, setToast] = useState<string | null>(null);

  const [conversation, setConversation] = useState([
    {
      sender: 'mentor',
      author: 'Mrs. Sarah Jenkins',
      text: 'Good afternoon Dr. Sharma. Aarav demonstrated exceptional calculus formulation in today\'s quiz. His preparation for Term 2 is progressing well.',
      time: 'Yesterday, 03:40 PM'
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
    setToast('Message delivered to mentor inbox.');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher & Mentor Communications"
        subtitle="Direct official messaging with Class Mentor and assigned Subject Faculty"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <Card className="flex flex-col h-[500px]">
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-900 dark:text-white">Active Mentor Channel:</span>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800"
            >
              <option value="Mrs. Sarah Jenkins (Class Mentor 10-A)">Mrs. Sarah Jenkins (Class Mentor 10-A)</option>
              <option value="Dr. Michael Chen (Physics Faculty)">Dr. Michael Chen (Physics Faculty)</option>
              <option value="Mr. Alan Turing Jr. (CS Faculty)">Mr. Alan Turing Jr. (CS Faculty)</option>
            </select>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {conversation.map((c, i) => (
            <div
              key={i}
              className={`flex flex-col ${c.sender === 'parent' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  c.sender === 'parent'
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-bold opacity-75 mb-1">{c.author} · {c.time}</div>
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
            placeholder="Type your inquiry for class mentor..."
            className="flex-1 px-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-colors"
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
        title="Parent-Teacher Meetings (PTM)"
        subtitle="School-controlled consultation slots and official meeting minutes summaries"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Confirmed Reservation
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Term 1 Academic Feedback Consultation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Date: Saturday, November 14th · 10:15 - 10:30 AM (15 mins)
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Venue: Class 10-A Mentor Room 304 or Secure Video Room
            </p>
          </div>
          <StatusBadge status="APPROVED" />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Faculty Attendees:
          </span>
          <p className="text-slate-600 dark:text-slate-400">
            Mrs. Sarah Jenkins (Class Mentor), Dr. Michael Chen (Physics), Ms. Clara Oswald (English)
          </p>
        </div>
      </Card>
    </div>
  );
};

export const ParentPickup: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  const handleAuthorize = () => {
    setToast('Temporary gate clearance code dispatched to registered mobile.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pickup Contacts & Early Release"
        subtitle="Security gate authorization for primary guardians, secondary contacts, and emergency exits"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Authorized Gate Pickups</CardTitle>
          </CardHeader>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <strong>Dr. Rajesh Sharma</strong> (Father / Primary)
                <div className="text-[11px] text-slate-500 font-mono">+1 (555) 382-9912</div>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <strong>Sunita Sharma</strong> (Mother / Secondary)
                <div className="text-[11px] text-slate-500 font-mono">+1 (555) 382-9915</div>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Early Campus Pickup Request</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Submit 2 hours prior to scheduled departure</p>
          </CardHeader>
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              Generates an RFID gate exit pass validated by the Head of Security and Class Mentor.
            </p>
            <button
              onClick={handleAuthorize}
              className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Generate Early Gate Pass (Demo)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const ParentConsent: React.FC = () => {
  const [signed, setSigned] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parental Consent & Permissions"
        subtitle="Digital waivers and agreements for academic excursions, competitions, and laboratory safety"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Mandatory Consent
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Annual STEM & Robotics Exhibition 2026 Participation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Event Date: 20 November 2026 · Venue: State Convention Center
            </p>
          </div>
          <StatusBadge status={signed ? 'APPROVED' : 'PENDING'} />
        </div>

        <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            I hereby give consent for my ward <strong>Aarav Sharma (Grade 10-A)</strong> to travel via official school coach to the State Convention Center and present the quadratic trajectory simulation project.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">
            {signed ? 'Digital signature acknowledged on file.' : 'Requires guardian authorization.'}
          </span>
          {!signed ? (
            <button
              onClick={() => setSigned(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm"
            >
              Sign Consent Electronically
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Signed by Dr. Rajesh Sharma
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};
