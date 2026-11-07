import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useWorkflow } from '../../hooks/useWorkflow';
import { 
  GraduationCap, 
  CalendarCheck, 
  Award, 
  BookOpen, 
  Bus, 
  CheckCircle2, 
  Clock, 
  User, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { STUDENT_PROFILE, STUDENT_EXAM_RESULTS } from '../../mock/academicData';

export const ParentChildOverview: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow] = useWorkflow();
  const navigate = useNavigate();

  const termData = STUDENT_EXAM_RESULTS['term1_final'];
  const myHallTicket = workflow.hallTickets.find(h => h.studentId === 'GVS-2027-0001');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward Profile & Academic Standing"
        subtitle={`Monitoring Enrolled Ward: ${currentUser?.studentName || STUDENT_PROFILE.name} (Grade ${currentUser?.grade || STUDENT_PROFILE.grade}-${currentUser?.section || STUDENT_PROFILE.section} · Roll #${currentUser?.rollNumber || STUDENT_PROFILE.rollNumber})`}
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => navigate('/parent/messages')}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Message Class Mentor</span>
          </button>
        }
      />

      {/* Ward Profile Banner */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={STUDENT_PROFILE.avatar}
              alt={STUDENT_PROFILE.name}
              className="w-20 h-20 rounded-2xl ring-4 ring-teal-700/20 object-cover bg-teal-50 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {STUDENT_PROFILE.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  Grade {currentUser?.grade || STUDENT_PROFILE.grade}-{currentUser?.section || STUDENT_PROFILE.section}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Roll #{currentUser?.rollNumber || STUDENT_PROFILE.rollNumber}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Mentor: <strong>Mrs. Sarah Jenkins</strong></span>
                </div>
                <div>
                  Registration: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentUser?.studentId || STUDENT_PROFILE.id}</span>
                </div>
                <div>
                  Admission: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentUser?.studentId || STUDENT_PROFILE.admissionNumber}</span>
                </div>
                <div>
                  House: <span className="font-semibold text-emerald-600">{STUDENT_PROFILE.house}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Good Standing</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1">State Board Secondary Track</span>
          </div>
        </div>
      </Card>

      {/* 4 Core Pillars Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Attendance Aggregate"
          value="94.2%"
          subtext="Satisfies 75% State Board Board rule"
          trend={{ value: '+1.4%', isPositive: true }}
          icon={<CalendarCheck className="w-5 h-5" />}
          accentColor="teal"
          onClick={() => navigate('/parent/attendance')}
        />
        <StatCard
          label="Academic Standing"
          value="91.2% (A1)"
          subtext="Rank #3 in Grade 10-A"
          trend={{ value: '+2.7%', isPositive: true }}
          icon={<Award className="w-5 h-5" />}
          accentColor="emerald"
          onClick={() => navigate('/parent/academics')}
        />
        <StatCard
          label="Homework Performance"
          value="100% Submission"
          subtext="Average Grade: 19.2 / 20"
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="orange"
          onClick={() => navigate('/parent/homework')}
        />
        <StatCard
          label="Exam Hall Ticket"
          value={myHallTicket?.classTeacherReleased ? 'Cleared' : 'Pending Fee'}
          subtext={myHallTicket?.classTeacherReleased ? 'Admit Card Ready' : 'Dues Settlement Required'}
          icon={<FileCheck className="w-5 h-5" />}
          accentColor={myHallTicket?.classTeacherReleased ? 'teal' : 'rose'}
          onClick={() => navigate('/parent/exams')}
        />
      </div>

      {/* Subject Performance Breakdown Matrix */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Subject Performance Breakdown (Term 1 CCE)</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Continuous evaluation and teacher remarks for Aarav</p>
            </div>
            <button
              onClick={() => navigate('/parent/academics')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Full Grade Sheet & Report Card →
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {termData.scores.map((s) => (
              <div
                key={s.code}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {s.subject}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">({s.code})</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {s.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    "{s.remarks}"
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
                    {s.marksObtained} / {s.maxMarks}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Cohort Avg: {s.classAverage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transit, Security & Quick Liaison Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transit Snapshot */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Assigned School Commute
              </h4>
            </div>
            <button
              onClick={() => navigate('/parent/transport')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Route Details →
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Route & Bus:</span>
              <span className="font-bold text-slate-900 dark:text-white">Route 14 (East Quadrant) · KA-01-FS-4012</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Designated Stop:</span>
              <span className="font-semibold text-slate-900 dark:text-white">Palm Meadows Main Gate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Morning Pickup:</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400">07:15 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Driver Contact:</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">+91 98860 33441 (Suresh Kumar)</span>
            </div>
          </div>
        </Card>

        {/* Security & Pickup Authorization */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Gate Clearance & Pickups
              </h4>
            </div>
            <button
              onClick={() => navigate('/parent/pickup')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Manage Passes →
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Primary Contact:</span>
              <span className="font-bold text-slate-900 dark:text-white">Dr. Rajesh Sharma (Father)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Secondary Contact:</span>
              <span className="font-bold text-slate-900 dark:text-white">Mrs. Priya Sharma (Mother)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Emergency Authorization:</span>
              <span className="text-emerald-600 font-bold">Biometric / OTP Pass Active</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
