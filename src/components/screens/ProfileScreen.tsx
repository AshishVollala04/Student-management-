import React, { useState } from 'react';
import { StudentProfile, UserSession } from '../../types';
import { User, Phone, Mail, MapPin, ShieldAlert, Heart, Calendar, LogOut, Moon, Sun, Bell, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ProfileScreenProps {
  student: StudentProfile;
  currentUser: UserSession;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  student,
  currentUser,
  darkMode,
  onToggleDarkMode,
  onLogout,
  onResetData
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [resetToast, setResetToast] = useState(false);

  const handleReset = () => {
    onResetData();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Toast */}
      {resetToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Prototype state reset to default 600-student dataset!</span>
          </div>
        </div>
      )}

      {/* Main Student Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-slate-800 ring-4 ring-indigo-500/20 mx-auto overflow-hidden shadow-inner flex items-center justify-center">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
            {student.name}
          </h2>

          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
            {student.grade} - Section {student.section} · Roll No: {student.rollNo}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              Admission: {student.admissionNo}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              Academic Year: {student.academicYear}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
              {student.house}
            </span>
          </div>
        </div>
      </div>

      {/* Student Vital Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
          Bio & Medical Records
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 block">Date of Birth</span>
            <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{student.dob}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 block">Blood Group</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400 mt-0.5 block">{student.bloodGroup}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 block">Gender</span>
            <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{student.gender}</span>
          </div>
        </div>
      </div>

      {/* Parent / Guardian Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
          Parent & Guardian Details
        </h3>

        <div className="space-y-3 text-xs">
          {/* Father */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {student.parents.fatherName} (Father)
            </div>
            <div className="text-slate-500 mt-0.5">{student.parents.fatherOccupation}</div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mt-2">
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              <span>{student.parents.fatherPhone}</span>
            </div>
          </div>

          {/* Mother */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {student.parents.motherName} (Mother)
            </div>
            <div className="text-slate-500 mt-0.5">{student.parents.motherOccupation}</div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mt-2">
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              <span>{student.parents.motherPhone}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{student.parents.email}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>{student.parents.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency Contact Person</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {student.emergencyContact.name} ({student.emergencyContact.relationship}) · <span className="font-bold font-mono text-slate-900 dark:text-white">{student.emergencyContact.phone}</span>
        </p>
      </div>

      {/* App Settings & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Preferences & Security
        </h3>

        <div className="space-y-1">
          {/* Dark Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Dark Theme</div>
                <div className="text-[11px] text-slate-500">Toggle dark / light appearance</div>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                darkMode ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-indigo-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Push Notifications</div>
                <div className="text-[11px] text-slate-500">Attendance alerts, notices & homework</div>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Reset Demo State</div>
                <div className="text-[11px] text-slate-500">Restore default 600-student mock database</div>
              </div>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full mt-2 py-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of FutureSchool</span>
        </button>
      </div>
    </div>
  );
};
