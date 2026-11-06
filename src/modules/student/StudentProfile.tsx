import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  User, 
  ShieldAlert, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  Lock, 
  QrCode, 
  Bus, 
  Phone, 
  Mail, 
  MapPin, 
  Printer, 
  Sparkles,
  Building2
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../mock/academicData';

export const StudentProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  const handleLogoutAllSessions = () => {
    setToast('Security event: Successfully terminated 2 other active session tokens.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Biographical Profile & Credentials"
        subtitle="School identity registry, parental emergency contacts & transport profile"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => setShowIdCardModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital ID Card</span>
          </button>
        }
      />

      {toast && (
        <div className="p-3.5 rounded-xl bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Student Avatar Card & Quick Badges */}
        <div className="space-y-4">
          <Card className="p-6 text-center">
            <div className="relative inline-block mx-auto">
              <img
                src={currentUser?.avatar || STUDENT_PROFILE.avatar}
                alt={currentUser?.name}
                className="w-28 h-28 rounded-3xl mx-auto ring-4 ring-teal-700/20 object-cover bg-teal-50 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Enrolled & Active" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
              {STUDENT_PROFILE.name}
            </h3>
            <p className="text-xs font-mono text-teal-700 dark:text-teal-400 font-bold mt-0.5">
              Registration: {STUDENT_PROFILE.id}
            </p>

            <div className="mt-3 flex justify-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 font-bold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
                Grade {STUDENT_PROFILE.grade}-{STUDENT_PROFILE.section}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                Roll #{STUDENT_PROFILE.rollNumber}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">House:</span>
                <span className="font-semibold text-emerald-600">{STUDENT_PROFILE.house}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-bold text-rose-600">{STUDENT_PROFILE.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Curriculum:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">CBSE Secondary</span>
              </div>
            </div>

            <button
              onClick={() => setShowIdCardModal(true)}
              className="w-full mt-5 py-2.5 rounded-xl border border-teal-600 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Inspect Student Digital Pass</span>
            </button>
          </Card>

          {/* School Bus Route Card */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Fleet Transport Route
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Bus:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">KA-01-FS-4012</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Designated Stop:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Palm Meadows Gate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Morning Pickup:</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">07:15 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evening Drop:</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">03:45 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driver Contact:</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">+91 98860 33441</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Columns: Bio, Parental Contact, and Security */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Biographical Identifiers */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Biographical & Academic Identifiers</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Admission Number</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{STUDENT_PROFILE.admissionNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                <span className="font-semibold text-slate-900 dark:text-white">{STUDENT_PROFILE.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
                <span className="font-semibold text-slate-900 dark:text-white">{STUDENT_PROFILE.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Home Room Teacher</span>
                <span className="font-semibold text-teal-700 dark:text-teal-400">Mrs. Sarah Jenkins</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Year</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{STUDENT_PROFILE.academicYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Affiliation</span>
                <span className="font-semibold text-slate-900 dark:text-white">CBSE Affiliation #830114</span>
              </div>
            </div>
          </Card>

          {/* Parental Guardian Information */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Parent / Guardian Emergency Contact</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Father's Record</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{STUDENT_PROFILE.father.name}</div>
                <div className="text-[11px] text-slate-500">{STUDENT_PROFILE.father.occupation}</div>
                <div className="font-mono text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{STUDENT_PROFILE.father.phone}</span>
                </div>
                <div className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>{STUDENT_PROFILE.father.email}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Mother's Record</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{STUDENT_PROFILE.mother.name}</div>
                <div className="text-[11px] text-slate-500">{STUDENT_PROFILE.mother.occupation}</div>
                <div className="font-mono text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{STUDENT_PROFILE.mother.phone}</span>
                </div>
                <div className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>{STUDENT_PROFILE.mother.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-2">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Permanent Residential Address</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {STUDENT_PROFILE.address.street}, {STUDENT_PROFILE.address.city}, {STUDENT_PROFILE.address.state} - {STUDENT_PROFILE.address.postalCode}
                </span>
              </div>
            </div>
          </Card>

          {/* Session & Credential Security */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Session & Token Security</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Active Device JWT Tokens</div>
                  <div className="text-[11px] text-slate-500">Currently active on Web Station & Mobile App with 1-hour renewal cycle.</div>
                </div>
                <button
                  onClick={handleLogoutAllSessions}
                  className="px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                >
                  Revoke All Tokens
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Digital Student ID Card Modal */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-teal-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-teal-700/60 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                  Greenwood Valley School
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowIdCardModal(false)}
                className="w-6 h-6 rounded-full bg-teal-950/60 text-teal-300 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-center my-3">
              <img
                src={STUDENT_PROFILE.avatar}
                alt="Student ID"
                className="w-20 h-20 rounded-2xl mx-auto border-2 border-teal-300/60 bg-white/10 object-cover shadow-lg"
              />
              <h3 className="text-lg font-bold text-white mt-2">{STUDENT_PROFILE.name}</h3>
              <div className="text-xs font-mono text-teal-300 font-bold">ID: {STUDENT_PROFILE.id}</div>
              <div className="text-xs text-teal-200 mt-0.5">Grade 10 · Section A (Roll #{STUDENT_PROFILE.rollNumber})</div>
            </div>

            <div className="my-4 p-3 rounded-2xl bg-teal-950/60 border border-teal-700/40 text-[11px] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-teal-400 font-sans">DOB:</span>
                <span>{STUDENT_PROFILE.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-400 font-sans">Blood Group:</span>
                <span className="text-rose-300 font-bold">{STUDENT_PROFILE.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-400 font-sans">Emergency Phone:</span>
                <span>{STUDENT_PROFILE.phone}</span>
              </div>
            </div>

            {/* Barcode & NFC Simulation */}
            <div className="text-center pt-2 border-t border-teal-700/60">
              <div className="font-mono text-xs tracking-widest text-teal-300 mb-1">
                ||| | |||| | |||||| || | |||| |||
              </div>
              <span className="text-[10px] text-teal-400 uppercase tracking-widest font-mono">
                CAMPUS RFID · 2026-2027 VALID
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-4 py-2 text-xs font-bold rounded-xl bg-white text-teal-900 hover:bg-teal-50 transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Identification Card</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
