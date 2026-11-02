import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_NAVIGATION } from '../../app/navigationConfig';
import { NavIcon } from './NavIcon';
import { DevControls } from './DevControls';
import { Logo } from '../common/Logo';
import {
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Globe,
  ShieldCheck,
  Check
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('futureschool_theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('futureschool_theme', 'dark');
      setDarkMode(true);
    }
  };

  const navGroups = currentRole ? ROLE_NAVIGATION[currentRole] || [] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* 1. TopBar Navigation */}
      <header className="sticky top-0 z-40 h-16 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
        {/* Left: Mobile Drawer Trigger + Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="hidden sm:inline-block h-5 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {currentRole} Workspace
            </span>
          </div>
        </div>

        {/* Center: Search placeholder */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              readOnly
              placeholder="Search students, subjects, circulars or files (Ctrl + K)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 placeholder-slate-400 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-600"
              onClick={() => alert('Search index: Enter student roll number, subject code or notice title in any module.')}
            />
          </div>
        </div>

        {/* Right: Actions (Language, Theme, Notifications, Profile) */}
        <div className="flex items-center gap-2">
          {/* Language Placeholder */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-lg">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Campus Notices</h4>
                    <span className="text-[10px] text-teal-600 font-bold uppercase">3 New</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">Term 2 Exam Matrix Released</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Morning session begins at 08:30 AM sharp.</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">Annual Science & STEM Expo 2026</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Abstract registrations close on Nov 10th.</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser?.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 bg-teal-50"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                  {currentUser?.id}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      {currentUser?.roleLabel}
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Layout Split (Desktop Sidebar + Content Body) */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar (hidden on mobile, visible lg:) */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-r border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)]">
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/20 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <NavIcon name={item.iconName} className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.badgeColor === 'orange' ? 'bg-orange-500 text-white' :
                          item.badgeColor === 'rose' ? 'bg-rose-500 text-white' :
                          'bg-teal-600 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 text-[11px] text-slate-400 text-center">
            FutureSchool Enterprise SaaS · 600 Students Scale
          </div>
        </aside>

        {/* Mobile Drawer (visible when mobileDrawerOpen) */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 p-4 h-full flex flex-col shadow-2xl z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 mt-4 flex-1">
                {navGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                              isActive
                                ? 'bg-teal-700 text-white font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <NavIcon name={item.iconName} className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-24">
          <Outlet />
        </main>
      </div>

      {/* Floating Development Harness */}
      <DevControls />
    </div>
  );
};
