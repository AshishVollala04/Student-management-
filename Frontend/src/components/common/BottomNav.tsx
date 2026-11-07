import React from 'react';
import { TabType, ScreenType, UserRole } from '../../types';
import { Home, BookOpen, Bell, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  currentScreen: ScreenType;
  userRole: UserRole;
  unreadNoticesCount: number;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  currentScreen,
  userRole,
  unreadNoticesCount,
  onTabChange
}) => {
  // If user is on login screen, do not show bottom navigation
  if (currentScreen === 'login') return null;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg shadow-slate-900/5">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center relative min-h-[44px] min-w-[44px] py-1 text-center transition-all duration-200 active:scale-95 focus:outline-none"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.4] scale-110'
                      : 'text-slate-600 dark:text-slate-400 stroke-[1.8] hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                />
                {tab.id === 'notices' && unreadNoticesCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {unreadNoticesCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Active pill dot indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
