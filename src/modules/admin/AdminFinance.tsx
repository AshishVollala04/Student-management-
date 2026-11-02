/**
 * FutureSchool - Admin Finance (Fee Structures, Ledger & Billing Run)
 */

import React, { useState } from 'react';
import { PageHeader, StatCard, SearchInput } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { 
  CreditCard, 
  Receipt, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  FileSpreadsheet,
  ShieldCheck,
  Check
} from 'lucide-react';

// ==========================================
// 1. ADMIN FEES & STRUCTURE
// ==========================================
export const AdminFees: React.FC = () => {
  const [structures] = useState([
    {
      gradeRange: 'Grades 9 & 10 (Secondary)',
      tuitionPerYear: '₹68,000',
      labFee: '₹12,000',
      sportsFee: '₹5,000',
      totalAnnual: '₹85,000',
      instalmentSchedule: '4 Quarters (₹21,250 each)',
    },
    {
      gradeRange: 'Grades 11 & 12 (Senior Secondary - Science)',
      tuitionPerYear: '₹82,000',
      labFee: '₹18,000',
      sportsFee: '₹5,000',
      totalAnnual: '₹1,05,000',
      instalmentSchedule: '4 Quarters (₹26,250 each)',
    },
    {
      gradeRange: 'Grades 6 to 8 (Middle School)',
      tuitionPerYear: '₹56,000',
      labFee: '₹6,000',
      sportsFee: '₹5,000',
      totalAnnual: '₹67,000',
      instalmentSchedule: '4 Quarters (₹16,750 each)',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Fee Structures & Ledger"
        subtitle="Configure 4-instalment schedules, lab charges, and track campus-wide collections"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Fee Structures' }]}
        actions={
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
            Export Collection Ledger
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Annual Fee Billed" value="₹5.12 Cr" subtitle="Across 600 students" icon={CreditCard} color="teal" />
        <StatCard title="Total Realized" value="₹4.82 Cr" subtitle="94.1% collection rate" icon={CheckCircle2} color="emerald" />
        <StatCard title="Pending Receivables" value="₹30.4 L" subtitle="Overdue instalments" icon={Clock} color="amber" />
        <StatCard title="Concessions Granted" value="₹14.2 L" subtitle="Bursaries & merit" icon={Receipt} color="blue" />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Grade-wise Annual Fee Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {structures.map((s, idx) => (
            <Card key={idx} className="p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1">{s.gradeRange}</h4>
                <span className="text-xs text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 block w-fit mb-4">
                  {s.instalmentSchedule}
                </span>

                <div className="space-y-2 text-xs py-2 border-y border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tuition Component</span>
                    <span className="font-semibold text-gray-900">{s.tuitionPerYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Science Lab & Tech</span>
                    <span className="font-semibold text-gray-900">{s.labFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sports & Activity</span>
                    <span className="font-semibold text-gray-900">{s.sportsFee}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Total Annual</span>
                  <span className="text-lg font-bold text-teal-900">{s.totalAnnual}</span>
                </div>
                <Button variant="outline" size="sm">
                  Edit Slab
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ADMIN BILLING RUN (Validated Billing Run)
// ==========================================
export const AdminBilling: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRunBilling = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setIsCompleted(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Validated Billing Run Engine"
        subtitle="Quarterly invoice generation with duplicate prevention and automated bursary offsets"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Billing Run' }]}
      />

      <div className="max-w-2xl mx-auto">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <Receipt className="w-6 h-6 text-teal-700" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Quarter 2 Billing Run (July - September 2027)</h3>
              <p className="text-xs text-gray-500">Batch processing across 604 registered student accounts</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Enrolled Student Accounts</span>
              <span className="font-bold text-gray-900">604</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Concessions / Merit Waivers</span>
              <span className="font-bold text-teal-700">18 accounts (Pre-deducted)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Duplicate Invoicing Protection</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Enforced
              </span>
            </div>
          </div>

          {isCompleted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Quarter 2 Billing Run Successfully Dispatched!</span>
                <span className="text-xs text-emerald-700">
                  604 electronic demand invoices generated and published to Parent Portals.
                </span>
              </div>
            </div>
          ) : null}

          <div className="pt-2 flex justify-end">
            <Button
              variant="accent"
              onClick={handleRunBilling}
              disabled={isRunning || isCompleted}
            >
              {isRunning ? (
                <>Processing 604 Invoices...</>
              ) : isCompleted ? (
                <>Billing Run Completed</>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5" /> Execute Quarter 2 Billing Run
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
