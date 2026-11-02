import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { AttendanceScreen } from './AttendanceScreen';
import { TimetableScreen } from './TimetableScreen';
import { HomeworkScreen } from './HomeworkScreen';
import { ExamResultsScreen } from './ExamResultsScreen';
import { Calendar, Clock, BookOpen, Award } from 'lucide-react';

interface AcademicsHubProps {
  initialSubTab?: 'attendance' | 'timetable' | 'homework' | 'exams';
  attendanceData: any;
  timetableData: any;
  homeworkData: any;
  examData: any;
  student: any;
  onSubmitLeave: any;
  onToggleHomework: any;
  onSubmitHomework: any;
  onNavigate: (screen: ScreenType) => void;
}

export const AcademicsHub: React.FC<AcademicsHubProps> = ({
  initialSubTab = 'timetable',
  attendanceData,
  timetableData,
  homeworkData,
  examData,
  student,
  onSubmitLeave,
  onToggleHomework,
  onSubmitHomework,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'timetable' | 'homework' | 'exams'>(initialSubTab);

  const tabs: { id: 'attendance' | 'timetable' | 'homework' | 'exams'; label: string; icon: any; count?: number }[] = [
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'homework', label: 'Homework', icon: BookOpen, count: homeworkData.filter((h: any) => h.status === 'pending').length },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'exams', label: 'Exam Marks', icon: Award }
  ];

  return (
    <div className="space-y-4">
      {/* Sub-Tab Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-14 sm:top-16 z-30 backdrop-blur-md">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {t.count !== undefined && t.count > 0 && (
                    <span className={`absolute -top-1.5 -right-2 px-1 text-[9px] font-bold rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-900' : 'bg-amber-500 text-white'
                    }`}>
                      {t.count}
                    </span>
                  )}
                </div>
                <span className="text-[11px] truncate max-w-full">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render active academics view */}
      {activeTab === 'timetable' && (
        <TimetableScreen timetableData={timetableData} />
      )}

      {activeTab === 'homework' && (
        <HomeworkScreen
          homeworkList={homeworkData}
          onToggleStatus={onToggleHomework}
          onSubmitHomework={onSubmitHomework}
        />
      )}

      {activeTab === 'attendance' && (
        <AttendanceScreen
          days={attendanceData.days}
          summary={attendanceData.summary}
          onSubmitLeave={onSubmitLeave}
        />
      )}

      {activeTab === 'exams' && (
        <ExamResultsScreen exams={examData} student={student} />
      )}
    </div>
  );
};
