/**
 * FutureSchool - Principal Desk Extras
 * Report Card Approvals, Special Re-Exams, Fee Concessions, Teacher Coverage Matrix
 */

import React, { useState } from 'react';
import { PageHeader, StatCard, SearchInput } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { 
  FileCheck2, 
  AlertCircle, 
  DollarSign, 
  Check, 
  X, 
  Calendar, 
  ShieldCheck, 
  UserCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

// ==========================================
// 1. PRINCIPAL REPORT CARDS DESK
// ==========================================
export const PrincipalReportCards: React.FC = () => {
  const [batches, setBatches] = useState([
    {
      id: 'rc-10a',
      class: 'Class 10-A',
      mentor: 'Vikramaditya Sen (TCH0001)',
      totalStudents: 38,
      status: 'PENDING_APPROVAL',
      submittedDate: '2027-04-12',
      remarks: 'All 38 marks validated, moderation applied within CBSE guidelines.',
    },
    {
      id: 'rc-10b',
      class: 'Class 10-B',
      mentor: 'Pooja Iyer (TCH0004)',
      totalStudents: 37,
      status: 'APPROVED',
      submittedDate: '2027-04-10',
      remarks: 'Endorsed and released to parent portal.',
    },
    {
      id: 'rc-12a',
      class: 'Class 12-A',
      mentor: 'Kavita Menon (TCH0002)',
      totalStudents: 30,
      status: 'APPROVED',
      submittedDate: '2027-04-09',
      remarks: 'Pre-board cumulative cards published.',
    },
  ]);

  const [endorsedId, setEndorsedId] = useState<string | null>(null);

  const handleEndorse = (id: string) => {
    setBatches(batches.map(b => b.id === id ? { ...b, status: 'APPROVED' } : b));
    setEndorsedId(id);
    setTimeout(() => setEndorsedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Card Endorsement Desk"
        subtitle="Principal final sign-off before term report cards are released to parents"
        breadcrumbs={[{ label: 'Principal', href: '/principal/dashboard' }, { label: 'Report Cards' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Batches Pending Sign-off" value="1" subtitle="Requires executive endorsement" icon={Clock} color="amber" />
        <StatCard title="Total Students Evaluated" value="105" subtitle="Across 3 senior grades" icon={UserCheck} color="teal" />
        <StatCard title="Endorsed Batches" value="2" subtitle="Active in parent & student app" icon={CheckCircle2} color="emerald" />
      </div>

      <div className="space-y-4">
        {batches.map((batch) => (
          <Card key={batch.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{batch.class}</h3>
                  <StatusBadge status={batch.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted by <span className="font-semibold text-gray-700">{batch.mentor}</span> on {batch.submittedDate}
                </p>
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {batch.remarks}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm">
                  Audit Marksheets
                </Button>
                {batch.status === 'PENDING_APPROVAL' ? (
                  <Button variant="primary" size="sm" onClick={() => handleEndorse(batch.id)}>
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Affix Digital Seal & Release
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Released to Parents
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. PRINCIPAL SPECIAL RE-EXAMS
// ==========================================
export const PrincipalReExams: React.FC = () => {
  const [requests, setRequests] = useState([
    {
      id: 'rex-1',
      studentName: 'Rohan Verma',
      studentId: 'GVS-2027-0112',
      class: 'Class 9-B',
      subject: 'Science (Physics & Chemistry)',
      reason: 'Hospitalized with Dengue during Mid-Term theory paper. Doctor certificate attached.',
      submittedDate: '2027-04-11',
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'rex-2',
      studentName: 'Sneha Patel',
      studentId: 'GVS-2027-0098',
      class: 'Class 11-A',
      subject: 'Mathematics',
      reason: 'Represented state in National Swimming Championship. Sports quota sanction approved.',
      submittedDate: '2027-04-05',
      status: 'APPROVED',
    },
  ]);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Special Re-Examination Sanctioning"
        subtitle="Approve re-assessment slots for certified medical or national sports absence"
        breadcrumbs={[{ label: 'Principal', href: '/principal/dashboard' }, { label: 'Re-Exams' }]}
      />

      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-gray-900">{req.studentName}</h4>
                  <span className="text-xs text-gray-500 font-mono">({req.studentId})</span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  {req.class} • Subject: {req.subject}
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 border border-gray-100">
                  <span className="font-semibold text-gray-900 block mb-1">Reason & Supporting Docs:</span>
                  {req.reason}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {req.status === 'PENDING_APPROVAL' ? (
                  <>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button variant="accent" size="sm" onClick={() => handleApprove(req.id)}>
                      <Check className="w-4 h-4 mr-1" /> Sanction Re-Exam
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Sanctioned (Slot: Apr 24)
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. PRINCIPAL FEE CONCESSIONS & REFUNDS
// ==========================================
export const PrincipalFeeApprovals: React.FC = () => {
  const [concessions, setConcessions] = useState([
    {
      id: 'f-1',
      studentName: 'Aarav Sharma',
      studentId: 'GVS-2027-0001',
      type: 'Merit Concession (Academic Excellence)',
      amountRequested: '₹12,000',
      justification: 'School topper in Science Olympiad State Round. Eligible for 15% tuition concession.',
      status: 'APPROVED',
      date: '2027-04-02',
    },
    {
      id: 'f-2',
      studentName: 'Tanvi Joshi',
      studentId: 'GVS-2027-0341',
      type: 'Sibling Discount',
      amountRequested: '₹8,500',
      justification: 'Second sibling enrolled in Class 4-A. Verification completed by accounts desk.',
      status: 'PENDING_APPROVAL',
      date: '2027-04-12',
    },
  ]);

  const handleApprove = (id: string) => {
    setConcessions(concessions.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Concession & Refund Approvals"
        subtitle="Executive oversight on bursaries, merit waivers, and sibling discounts"
        breadcrumbs={[{ label: 'Principal', href: '/principal/dashboard' }, { label: 'Fee Approvals' }]}
      />

      <div className="space-y-4">
        {concessions.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-gray-900">{item.studentName}</h4>
                  <span className="text-xs text-gray-500 font-mono">({item.studentId})</span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span className="font-semibold text-teal-800">{item.type}</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-bold text-gray-900">{item.amountRequested}</span>
                </div>
                <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {item.justification}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'PENDING_APPROVAL' ? (
                  <>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Decline
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleApprove(item.id)}>
                      Approve Concession
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Approved by Principal
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. PRINCIPAL TEACHER COVERAGE MATRIX
// ==========================================
export const PrincipalCoverage: React.FC = () => {
  const [substitutions] = useState([
    {
      period: 'Period 2 (09:40 - 10:25)',
      absentTeacher: 'Kavita Menon (Physics)',
      class: 'Class 11-A',
      assignedSubstitute: 'Vikramaditya Sen (Mathematics)',
      room: 'Room 302',
      status: 'ALLOCATED',
    },
    {
      period: 'Period 4 (11:20 - 12:05)',
      absentTeacher: 'Kavita Menon (Physics)',
      class: 'Class 12-A',
      assignedSubstitute: 'Ananya Sharma (Chemistry)',
      room: 'Physics Lab 1',
      status: 'ALLOCATED',
    },
    {
      period: 'Period 6 (01:30 - 02:15)',
      absentTeacher: 'Rajesh Kumar (Physical Ed)',
      class: 'Class 8-C',
      assignedSubstitute: 'Sports Assistant Coach',
      room: 'Outdoor Ground 2',
      status: 'ALLOCATED',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Faculty Coverage Matrix"
        subtitle="Automatic substitute assignment to guarantee zero unmonitored classrooms"
        breadcrumbs={[{ label: 'Principal', href: '/principal/dashboard' }, { label: 'Teacher Coverage' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Teachers On Leave Today" value="2" subtitle="Leaves sanctioned" icon={AlertCircle} color="amber" />
        <StatCard title="Substitutions Assigned" value="3" subtitle="100% periods covered" icon={CheckCircle2} color="emerald" />
        <StatCard title="Zero Idle Classroom Guarantee" value="Active" subtitle="No unmonitored class" icon={ShieldCheck} color="teal" />
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Today's Substitution Roster (Apr 15, 2027)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Period & Time</th>
                <th className="py-3 px-4">Class & Room</th>
                <th className="py-3 px-4">Absent Faculty</th>
                <th className="py-3 px-4">Assigned Substitute</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {substitutions.map((sub, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{sub.period}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-teal-800">{sub.class}</span>
                    <span className="text-xs text-gray-500 block">{sub.room}</span>
                  </td>
                  <td className="py-3.5 px-4 text-red-600 font-medium">{sub.absentTeacher}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">{sub.assignedSubstitute}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Covered
                    </span>
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
