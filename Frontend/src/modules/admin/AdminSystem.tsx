/**
 * FutureSchool - Admin System Operations
 * Timetable Generator, Student 360, Permissions, Bulk Import, Audit Center
 */

import React, { useState } from 'react';
import { PageHeader, StatCard, SearchInput } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { 
  Calendar, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Upload, 
  Search,
  Lock,
  Eye,
  Check
} from 'lucide-react';

// ==========================================
// 1. ADMIN TIMETABLE GENERATOR
// ==========================================
export const AdminTimetableGenerator: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [conflictResult, setConflictResult] = useState<string | null>(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setConflictResult('Zero Conflicts Detected. All 48 faculty schedules, 16 classrooms, and labs are conflict-free.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assisted Timetable Conflict Engine"
        subtitle="Algorithmic validation for room availability, lab scheduling, and teacher load balancing"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Timetable Engine' }]}
        actions={
          <Button variant="accent" size="sm" onClick={handleVerify} disabled={isVerifying}>
            <Play className="w-4 h-4 mr-1.5" />
            {isVerifying ? 'Running Conflict Check...' : 'Run Conflict Audit'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Weekly Periods" value="480" subtitle="Across Grades 6 through 12" icon={Calendar} color="teal" />
        <StatCard title="Faculty Workload Balance" value="98.5%" subtitle="Max 5 periods/day/teacher" icon={Users} color="emerald" />
        <StatCard title="Specialized Labs" value="100% Free" subtitle="Physics, Chem, Bio, CS" icon={CheckCircle2} color="blue" />
      </div>

      {conflictResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{conflictResult}</span>
        </div>
      )}

      <Card className="p-6">
        <h3 className="font-bold text-gray-900 text-base mb-4">Master Section Schedule Matrix (Class 10-A)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase">
              <tr>
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Period 1</th>
                <th className="py-2.5 px-3">Period 2</th>
                <th className="py-2.5 px-3">Period 3</th>
                <th className="py-2.5 px-3">Period 4</th>
                <th className="py-2.5 px-3">Period 5</th>
                <th className="py-2.5 px-3">Period 6</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <tr key={day} className="hover:bg-gray-50/50">
                  <td className="py-3 px-3 font-bold text-gray-900">{day}</td>
                  <td className="py-3 px-3 text-teal-800 font-medium">Math (TCH0001)</td>
                  <td className="py-3 px-3 text-blue-800 font-medium">Physics (TCH0002)</td>
                  <td className="py-3 px-3 text-amber-800 font-medium">Chemistry</td>
                  <td className="py-3 px-3 text-emerald-800 font-medium">Biology</td>
                  <td className="py-3 px-3 text-purple-800 font-medium">English</td>
                  <td className="py-3 px-3 text-gray-700 font-medium">Social Studies</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 2. ADMIN STUDENTS (Student 360)
// ==========================================
export const AdminStudents: React.FC = () => {
  const [students] = useState([
    {
      id: 'GVS-2027-0001',
      name: 'Aarav Sharma',
      class: 'Class 10-A',
      roll: '01',
      parent: 'Rajesh Sharma (+91 98765 43210)',
      attendance: '96.4%',
      status: 'ACTIVE',
    },
    {
      id: 'GVS-2027-0002',
      name: 'Aditi Rao',
      class: 'Class 10-A',
      roll: '02',
      parent: 'Sunil Rao (+91 98451 22334)',
      attendance: '92.1%',
      status: 'ACTIVE',
    },
    {
      id: 'GVS-2027-0045',
      name: 'Vihaan Gupta',
      class: 'Class 11-A',
      roll: '14',
      parent: 'Manoj Gupta (+91 98112 33445)',
      attendance: '89.5%',
      status: 'ACTIVE',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student 360 Registry"
        subtitle="Holistic student directory with linked parent contacts, attendance metrics, and profile guards"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Students' }]}
      />

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Enrolled Students (604 Records)</h3>
          <div className="w-full sm:w-72">
            <SearchInput placeholder="Search by GVS ID, name, or phone..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Parent Details</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-teal-800">{st.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{st.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{st.class}</td>
                  <td className="py-3.5 px-4 text-gray-600 text-xs">{st.parent}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">{st.attendance}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={st.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="outline" size="sm">
                      Profile 360
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 3. ADMIN PERMISSIONS & ROLES
// ==========================================
export const AdminPermissions: React.FC = () => {
  const [profiles] = useState([
    {
      role: 'Full School Administrator',
      users: 2,
      permissions: ['Admissions', 'Billing & Ledger', 'Fleet Transport', 'Timetable Engine', 'Staff Management', 'Audit Clearance'],
      status: 'ACTIVE',
    },
    {
      role: 'Finance & Accounts Desk',
      users: 3,
      permissions: ['Billing & Ledger', 'Fee Structures', 'Receipt Voucher Re-generation'],
      status: 'ACTIVE',
    },
    {
      role: 'Transport Operations Officer',
      users: 2,
      permissions: ['Fleet Transport', 'Route Capacity Reassignment', 'Driver Rosters'],
      status: 'ACTIVE',
    },
    {
      role: 'Admissions & Registrar Officer',
      users: 2,
      permissions: ['Admissions Wizard', 'Student 360', 'Document Verification'],
      status: 'ACTIVE',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Role Permissions & Security Bundles"
        subtitle="Role-based access control (RBAC) bundles ensuring strict operational segregation of duties"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Permissions' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((p, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900 text-base">{p.role}</h4>
              <StatusBadge status={p.status} />
            </div>
            <span className="text-xs text-gray-500 block mb-4">{p.users} Authorized Staff Accounts</span>

            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">
                Assigned Operational Scopes:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.permissions.map((perm, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-xs px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. ADMIN BULK IMPORT STAGING
// ==========================================
export const AdminBulkImport: React.FC = () => {
  const [isStaged, setIsStaged] = useState(false);

  const handleSimulateUpload = () => {
    setIsStaged(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Data Import & Validation Staging"
        subtitle="Upload Excel / CSV spreadsheets with automated schema check and duplicate elimination"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Bulk Import' }]}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 border-2 border-dashed border-gray-200 text-center space-y-3">
          <Upload className="w-10 h-10 text-teal-600 mx-auto" />
          <h4 className="font-bold text-gray-900 text-base">Upload Students or Staff Spreadsheet</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Supports .xlsx and .csv files. Must match official FutureSchool roster schema.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={handleSimulateUpload}>
              Load Sample Staging File (25 Students)
            </Button>
          </div>
        </Card>

        {isStaged && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h4 className="font-bold text-gray-900 text-base">Staging Validation Report</h4>
                <p className="text-xs text-gray-500">25 Rows Detected • 0 Fatal Errors</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                Validation Passed
              </span>
            </div>

            <div className="text-xs space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Unique Student IDs Assigned:</span>
                <span className="font-bold text-teal-900">25 (GVS-2027-0606 to GVS-2027-0630)</span>
              </div>
              <div className="flex justify-between">
                <span>Duplicate Mobile Numbers:</span>
                <span className="font-bold text-emerald-700">0 Found</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsStaged(false)}>
                Discard Staging
              </Button>
              <Button variant="accent" size="sm" onClick={() => { alert('25 Records successfully merged into Live Registry!'); setIsStaged(false); }}>
                Commit to Live Database
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. ADMIN AUDIT CENTER
// ==========================================
export const AdminAudit: React.FC = () => {
  const [auditLogs] = useState([
    {
      id: 'aud-1',
      action: 'EXAM_POLICY_DEPLOYMENT',
      details: 'Deployed revised Mid-Term 2 schedule (Principal Endorsement #PRN-SIGN-992)',
      user: 'Sanjay Deshmukh (ADM0001)',
      timestamp: '2027-04-14 11:20:00',
      ip: '10.0.4.12 (Internal LAN)',
    },
    {
      id: 'aud-2',
      action: 'TRANSPORT_REALLOCATION',
      details: 'Approved route shift for GVS-2027-0001 from Route 4 to Route 7',
      user: 'Sanjay Deshmukh (ADM0001)',
      timestamp: '2027-04-13 15:45:12',
      ip: '10.0.4.12 (Internal LAN)',
    },
    {
      id: 'aud-3',
      action: 'BILLING_RUN_DISPATCH',
      details: 'Automated Q1 fee demand notifications sent to 604 parents',
      user: 'Finance Desk (ADM0002)',
      timestamp: '2027-04-01 09:00:00',
      ip: '10.0.4.15 (Internal LAN)',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Audit & Compliance Log"
        subtitle="Immutable security trail of administrative executions, role escalations, and fee modifications"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Audit Log' }]}
      />

      <Card className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Security Access & Execution Trail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase">
              <tr>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Action Details</th>
                <th className="py-3 px-4">Executed By</th>
                <th className="py-3 px-4">IP / Network</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">{log.action}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{log.details}</td>
                  <td className="py-3 px-4 text-gray-600">{log.user}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">{log.ip}</td>
                  <td className="py-3 px-4 text-gray-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
