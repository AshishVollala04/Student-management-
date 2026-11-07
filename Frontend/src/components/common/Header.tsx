import React, { useState } from 'react';
import { Logo } from './Logo';
import { UserRole, UserSession, ScreenType } from '../../types';
import { Moon, Sun, ArrowLeft, ChevronDown, Check, ShieldCheck, UserCheck, GraduationCap, Users } from 'lucide-react';

interface HeaderProps {
  currentUser: UserSession;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onSwitchRole: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentScreen,
  onNavigate,
  onSwitchRole,
  darkMode,
  onToggleDarkMode,
  onLogout
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isDetailScreen = !['dashboard', 'parent-portal', 'teacher-portal', 'admin-portal'].includes(currentScreen);

  const getScreenTitle = (screen: ScreenType): string => {
    switch (screen) {
      case 'attendance': return 'Attendance Register';
      case 'timetable': return 'Weekly Timetable';
      case 'homework': return 'Homework & Tasks';
      case 'exams': return 'Academic Reports & Marks';
      case 'fees': return 'Fee Management & Receipts';
      case 'notices': return 'Notices & Circulars';
      case 'profile': return 'Student Profile';
      default: return 'FutureSchool';
    }
  };

  const roles: { role: UserRole; label: string; icon: any; subtitle: string }[] = [
    { role: 'student', label: 'Student', icon: GraduationCap, subtitle: 'Aarav (Grade 10-A)' },
    { role: 'parent', label: 'Parent', icon: Users, subtitle: 'Dr. Rajesh Sharma' },
    { role: 'teacher', label: 'Teacher', icon: UserCheck, subtitle: 'Mrs. Sarah Jenkins' },
    { role: 'admin', label: 'School Admin', icon: ShieldCheck, subtitle: 'Principal Vance' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left Slot: Back Button or Brand Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          {isDetailScreen ? (
            <button
              onClick={() => {
                if (currentUser.role === 'parent') onNavigate('parent-portal');
                else if (currentUser.role === 'teacher') onNavigate('teacher-portal');
                else if (currentUser.role === 'admin') onNavigate('admin-portal');
                else onNavigate('dashboard');
              }}
              className="flex items-center gap-1.5 p-1.5 -ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold truncate max-w-[170px] sm:max-w-xs">
                {getScreenTitle(currentScreen)}
              </span>
            </button>
          ) : (
            <button 
              onClick={() => {
                if (currentUser.role === 'parent') onNavigate('parent-portal');
                else if (currentUser.role === 'teacher') onNavigate('teacher-portal');
                else if (currentUser.role === 'admin') onNavigate('admin-portal');
                else onNavigate('dashboard');
              }}
              className="text-left focus:outline-none"
            >
              <Logo size="sm" />
            </button>
          )}
        </div>

        {/* Right Slot: Role Switcher & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Role Selector Pill / Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
              title="Switch demo role"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              <span className="capitalize hidden sm:inline text-slate-500 dark:text-slate-400">Role:</span>
              <span className="font-semibold capitalize">{currentUser.role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Demo Role
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Explore FutureSchool across all 4 school personas
                    </p>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const active = currentUser.role === r.role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => {
                            onSwitchRole(r.role);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                            active
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white capitalize">{r.label}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{r.subtitle}</div>
                            </div>
                          </div>
                          {active && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Avatar Click to Profile */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center pl-1 focus:outline-none"
            title="View Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30 object-cover bg-indigo-50 dark:bg-slate-800"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
