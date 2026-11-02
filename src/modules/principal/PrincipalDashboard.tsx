import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard } from '../../components/common/PageHeader';
import { ActionCard } from '../../components/common/CommonUi';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  Building,
  Clock,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';

export const PrincipalDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [workflow, store] = useWorkflow();
  const navigate = useNavigate();

  const pendingTeacherLeaves = workflow.teacherLeaves.filter(t => t.status === 'PENDING');
  const pendingMarks = workflow.marksEntries.filter(m => m.principalApprovalStatus === 'PENDING');
  const pendingConfigs = workflow.configs.filter(c => c.status === 'PENDING');
  const escalatedComplaints = workflow.complaints.filter(c => c.isEscalatedToPrincipal);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Executive Directorate: ${currentUser?.name}`}
        subtitle="FutureSchool Academy · 614 Students · 38 Faculty · Term 2 Operational Governance"
        badge={<StatusBadge status="ACTIVE" />}
        actions={
          <button
            onClick={() => navigate('/principal/approvals')}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Open Executive Approvals</span>
          </button>
        }
      />

      {/* 1. Executive Action Center: Pending Critical Approvals */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Pending Executive Decisions & Sign-offs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Marksheet Approval */}
          <div
            onClick={() => navigate('/principal/approvals')}
            className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 cursor-pointer hover:border-teal-400 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold text-teal-900 dark:text-teal-200">
              <span>Class 10-A Marks Verification</span>
              <StatusBadge status={pendingMarks.length > 0 ? 'PENDING' : 'APPROVED'} />
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-300 mt-1">
              {pendingMarks.length > 0 ? 'Submitted by Mrs. Sarah Jenkins. Ready for sign-off.' : 'All marks sheets signed off.'}
            </p>
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-200 mt-2 inline-flex items-center gap-1">
              Review Grade Matrix →
            </span>
          </div>

          {/* Teacher Leave Approval */}
          <div
            onClick={() => navigate('/principal/teacher-leave')}
            className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 cursor-pointer hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
              <span>Faculty Leave Application</span>
              <StatusBadge status={pendingTeacherLeaves.length > 0 ? 'PENDING' : 'APPROVED'} />
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
              {pendingTeacherLeaves.length > 0
                ? `${pendingTeacherLeaves[0].teacherName} (Maths Symposium) · Substitution ready.`
                : 'Zero pending faculty leave requests.'}
            </p>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-200 mt-2 inline-flex items-center gap-1">
              Sanction & Allocate Sub →
            </span>
          </div>

          {/* Administrative Config Sign-off */}
          <div
            onClick={() => navigate('/principal/approvals')}
            className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 cursor-pointer hover:border-purple-400 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-200">
              <span>Operational Configuration</span>
              <StatusBadge status={pendingConfigs.length > 0 ? 'PENDING' : 'APPROVED'} />
            </div>
            <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">
              {pendingConfigs.length > 0
                ? `${pendingConfigs[0].title} awaiting executive sign-off.`
                : 'Configurations authorized.'}
            </p>
            <span className="text-[11px] font-bold text-purple-800 dark:text-purple-200 mt-2 inline-flex items-center gap-1">
              Sign-off Configuration →
            </span>
          </div>
        </div>
      </div>

      {/* 2. School-Wide Governance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Enrollment"
          value="614 Students"
          subtext="Grades 6 through 12"
          icon={<Users className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          label="Campus Attendance Today"
          value="96.2%"
          subtext="591 Present · Gate biometric logs"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Faculty Headcount"
          value="38 Teachers"
          subtext="1:16 Student to Faculty Ratio"
          icon={<Building className="w-5 h-5" />}
          accentColor="slate"
        />
        <StatCard
          label="Tuition Realization"
          value="89.2%"
          subtext="$2.62M of $2.94M Target"
          icon={<Award className="w-5 h-5" />}
          accentColor="orange"
        />
      </div>

      {/* 3. Executive Decision Shortcuts */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Executive Decision Portals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ActionCard
            title="Report Card Approval Desk"
            description="Exception-first review: validate class averages and sign off"
            icon={<Award className="w-5 h-5" />}
            accentColor="teal"
            onClick={() => navigate('/principal/report-cards')}
          />
          <ActionCard
            title="Exam & Hall Ticket Control"
            description="Monitor clearance policies and exercise controlled overrides"
            icon={<ShieldCheck className="w-5 h-5" />}
            accentColor="orange"
            onClick={() => navigate('/principal/exam-control')}
          />
          <ActionCard
            title="Campus Safety & Grievances"
            description="Review escalated parent complaints and emergency broadcasts"
            icon={<AlertTriangle className="w-5 h-5" />}
            badge={escalatedComplaints.length > 0 ? `${escalatedComplaints.length} Escalated` : undefined}
            accentColor="rose"
            onClick={() => navigate('/principal/complaints')}
          />
          <ActionCard
            title="Acting Principal Delegation"
            description="Temporarily delegate governance authority to Vice Principal"
            icon={<Users className="w-5 h-5" />}
            accentColor="slate"
            onClick={() => navigate('/principal/delegation')}
          />
          <ActionCard
            title="Teacher Leave & Substitution"
            description="Sanction leaves with automated classroom coverage check"
            icon={<Clock className="w-5 h-5" />}
            accentColor="teal"
            onClick={() => navigate('/principal/teacher-leave')}
          />
          <ActionCard
            title="Leadership AI Executive Brief"
            description="Concise institutional summary assistant (Safe Mock)"
            icon={<Sparkles className="w-5 h-5" />}
            badge="Mock AI"
            accentColor="teal"
            onClick={() => navigate('/principal/ai-summary')}
          />
        </div>
      </div>
    </div>
  );
};
