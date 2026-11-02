/**
 * FutureSchool - Admin Academic Management
 * Admissions Wizard, Academic Structure, Staff Onboarding
 */

import React, { useState } from 'react';
import { PageHeader, StatCard, SearchInput } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { 
  UserPlus, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Building2, 
  Plus, 
  FileCheck, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

// ==========================================
// 1. ADMIN ADMISSIONS WIZARD
// ==========================================
export const AdminAdmissions: React.FC = () => {
  const [step, setStep] = useState(1);
  const [generatedId, setGeneratedId] = useState('GVS-2027-0605');

  // Form State
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('2011-08-14');
  const [gender, setGender] = useState('Male');
  const [admitClass, setAdmitClass] = useState('Class 10-A');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setStep(1);
    setFullName('');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    const randomNum = Math.floor(606 + Math.random() * 50);
    setGeneratedId(`GVS-2027-0${randomNum}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Admissions Wizard"
        subtitle="Standardized student enrollment with automated Student ID allocation and portal credentials"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Admissions' }]}
      />

      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0" />
          {[
            { num: 1, label: 'Student Bio & Grade' },
            { num: 2, label: 'Parent / Guardian' },
            { num: 3, label: 'Verification & ID' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center bg-white px-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === s.num
                    ? 'bg-teal-700 text-white shadow-md'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs mt-1 font-semibold ${step === s.num ? 'text-teal-900' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {isSuccess ? (
          <Card className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Student Admission Completed!</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Student account and Parent account have been created and mapped to the single ID below.
            </p>

            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 max-w-sm mx-auto text-center space-y-1">
              <span className="text-xs uppercase tracking-wider text-teal-800 font-bold block">
                Permanent Student ID
              </span>
              <span className="text-2xl font-mono font-bold text-teal-950 block">{generatedId}</span>
              <span className="text-xs text-gray-500 block">Class: {admitClass} • Name: {fullName || 'New Student'}</span>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={resetForm}>
                Admit Another Student
              </Button>
              <Button variant="primary" onClick={() => window.location.href = '/admin/students'}>
                View in Student 360
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8">
            <form onSubmit={handleFinish}>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-base border-b pb-2">Student Basic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Student Name"
                      placeholder="e.g., Ananya Mehra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    <Select
                      label="Enrolling Class & Section"
                      value={admitClass}
                      onChange={(e) => setAdmitClass(e.target.value)}
                      options={[
                        { value: 'Class 6-A', label: 'Class 6-A' },
                        { value: 'Class 8-B', label: 'Class 8-B' },
                        { value: 'Class 9-A', label: 'Class 9-A' },
                        { value: 'Class 10-A', label: 'Class 10-A' },
                        { value: 'Class 11-A', label: 'Class 11-A' },
                        { value: 'Class 12-A', label: 'Class 12-A' },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                    <Select
                      label="Gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' },
                      ]}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button variant="primary" type="button" onClick={handleNext} disabled={!fullName}>
                      Next: Parent Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-base border-b pb-2">Parent / Primary Guardian Details</h3>
                  <Input
                    label="Parent / Guardian Name"
                    placeholder="e.g., Rajesh Mehra"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Primary Mobile Number"
                      placeholder="+91 98765 43210"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Residential Address"
                    placeholder="Street, locality, city, pincode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" type="button" onClick={handlePrev}>
                      Back
                    </Button>
                    <Button variant="primary" type="button" onClick={handleNext} disabled={!parentName || !parentPhone}>
                      Next: Verification <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-base border-b pb-2">Admission Preview & Student ID Allocation</h3>
                  
                  <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Generated Student ID:</span>
                      <span className="font-mono font-bold text-teal-900">{generatedId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Student Name:</span>
                      <span className="font-semibold text-gray-900">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Enrolled In:</span>
                      <span className="font-semibold text-gray-900">{admitClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Parent / Phone:</span>
                      <span className="font-semibold text-gray-900">{parentName} ({parentPhone})</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
                    <span>
                      Completing this admission automatically generates the Student Portal and Parent Portal logins mapped to ID <strong>{generatedId}</strong>.
                    </span>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" type="button" onClick={handlePrev}>
                      Back
                    </Button>
                    <Button variant="accent" type="submit">
                      <Check className="w-4 h-4 mr-1.5" />
                      Confirm & Register Student
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. ADMIN ACADEMIC STRUCTURE
// ==========================================
export const AdminAcademicStructure: React.FC = () => {
  const [classes] = useState([
    { id: '10a', name: 'Class 10-A', wing: 'Senior Secondary', capacity: 40, enrolled: 38, mentor: 'Vikramaditya Sen (TCH0001)' },
    { id: '10b', name: 'Class 10-B', wing: 'Senior Secondary', capacity: 40, enrolled: 37, mentor: 'Pooja Iyer (TCH0004)' },
    { id: '11a', name: 'Class 11-A', wing: 'Senior Secondary (Science)', capacity: 35, enrolled: 32, mentor: 'Kavita Menon (TCH0002)' },
    { id: '12a', name: 'Class 12-A', wing: 'Senior Secondary (Science)', capacity: 35, enrolled: 30, mentor: 'Rajesh Nair (TCH0003)' },
    { id: '9a', name: 'Class 9-A', wing: 'High School', capacity: 40, enrolled: 39, mentor: 'Arjun Das (TCH0005)' },
    { id: '8a', name: 'Class 8-A', wing: 'Middle School', capacity: 40, enrolled: 38, mentor: 'Shalini Rao (TCH0006)' },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Structure & Class Divisions"
        subtitle="Manage academic years, classes, seat caps, and class mentor assignments"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Academic Structure' }]}
        actions={
          <Button variant="accent" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Section
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Classes" value="16 Sections" subtitle="Grades 6 through 12" icon={Building2} color="teal" />
        <StatCard title="Total Capacity" value="640 Seats" subtitle="604 Currently filled" icon={Users} color="emerald" />
        <StatCard title="Active Mentors" value="16 Faculty" subtitle="100% Mentorship coverage" icon={CheckCircle2} color="blue" />
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Class Directory & Seat Capacities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Academic Wing</th>
                <th className="py-3 px-4">Class Mentor</th>
                <th className="py-3 px-4">Occupancy</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classes.map((cls) => {
                const fillPercent = Math.round((cls.enrolled / cls.capacity) * 100);
                return (
                  <tr key={cls.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 font-bold text-teal-900">{cls.name}</td>
                    <td className="py-3.5 px-4 text-gray-600">{cls.wing}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">{cls.mentor}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${fillPercent >= 95 ? 'bg-amber-500' : 'bg-teal-600'}`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{cls.enrolled}/{cls.capacity}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="outline" size="sm">
                        Manage Roster
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 3. ADMIN STAFF ONBOARDING
// ==========================================
export const AdminStaff: React.FC = () => {
  const [staff] = useState([
    { id: 'TCH0001', name: 'Vikramaditya Sen', role: 'Senior Mathematics Faculty', dept: 'Mathematics', email: 'v.sen@futureschool.edu', status: 'ACTIVE' },
    { id: 'TCH0002', name: 'Kavita Menon', role: 'Head of Physics', dept: 'Science', email: 'k.menon@futureschool.edu', status: 'ACTIVE' },
    { id: 'PRN0001', name: 'Dr. Arundhati Roy', role: 'School Principal', dept: 'Executive', email: 'principal@futureschool.edu', status: 'ACTIVE' },
    { id: 'ADM0001', name: 'Sanjay Deshmukh', role: 'Head of School Operations', dept: 'Administration', email: 'operations@futureschool.edu', status: 'ACTIVE' },
    { id: 'TCH0004', name: 'Pooja Iyer', role: 'Chemistry Faculty', dept: 'Science', email: 'p.iyer@futureschool.edu', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Directory & Onboarding"
        subtitle="Manage faculty credentials, department allocations, and access permissions"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Staff' }]}
        actions={
          <Button variant="accent" size="sm">
            <UserPlus className="w-4 h-4 mr-1.5" />
            Onboard New Faculty
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Teaching Faculty" value="38" subtitle="Average student-ratio 1:16" icon={GraduationCap} color="teal" />
        <StatCard title="Administrative & Support" value="10" subtitle="Transport, accounts, security" icon={Users} color="blue" />
        <StatCard title="Portal Accounts" value="48 / 48" subtitle="MFA enabled for executives" icon={ShieldCheck} color="emerald" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Staff Directory</h3>
          <div className="w-full sm:w-64">
            <SearchInput placeholder="Search faculty name or ID..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Role / Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-teal-800">{s.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{s.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{s.role}</td>
                  <td className="py-3.5 px-4 text-gray-600">{s.dept}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="outline" size="sm">
                      Permissions
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
