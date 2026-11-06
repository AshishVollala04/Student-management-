import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FilterBar } from '../../components/common/CommonUi';
import { 
  Bell, 
  Calendar, 
  Paperclip, 
  AlertTriangle, 
  Building2, 
  ChevronRight, 
  Download,
  Award,
  Sparkles
} from 'lucide-react';
import { STUDENT_NOTICES, NoticeItem } from '../../mock/academicData';

export const StudentNotices: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'EXAMINATION' | 'ACADEMIC' | 'HOLIDAY' | 'SPORTS'>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const filteredNotices = STUDENT_NOTICES.filter(n => {
    if (filter === 'ALL') return true;
    return n.category === filter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Circulars & Official Notices"
        subtitle="Important announcements, board circulars, examination updates and festival breaks"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <FilterBar
          options={[
            { id: 'ALL', label: 'All Notices', count: STUDENT_NOTICES.length },
            { id: 'EXAMINATION', label: 'Examinations', count: STUDENT_NOTICES.filter(n => n.category === 'EXAMINATION').length },
            { id: 'ACADEMIC', label: 'Academic', count: STUDENT_NOTICES.filter(n => n.category === 'ACADEMIC').length },
            { id: 'HOLIDAY', label: 'Holidays', count: STUDENT_NOTICES.filter(n => n.category === 'HOLIDAY').length },
            { id: 'SPORTS', label: 'Sports & Arts', count: STUDENT_NOTICES.filter(n => n.category === 'SPORTS').length }
          ]}
          selectedId={filter}
          onSelect={(id) => setFilter(id as any)}
        />
      </div>

      {/* Notices Feed */}
      <div className="space-y-3.5">
        {filteredNotices.map((notice) => (
          <Card 
            key={notice.id} 
            className={`p-4 sm:p-5 cursor-pointer transition-all hover:border-teal-400 dark:hover:border-teal-700 ${
              notice.isUrgent ? 'border-amber-400 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/10' : ''
            }`}
            onClick={() => setSelectedNotice(notice)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    notice.category === 'EXAMINATION' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    notice.category === 'HOLIDAY' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                    notice.category === 'SPORTS' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  }`}>
                    {notice.category}
                  </span>

                  {notice.isUrgent && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Action Required</span>
                    </span>
                  )}

                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500 font-medium">{notice.department}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>

                {notice.attachmentName && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-teal-700 dark:text-teal-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attached Document: {notice.attachmentName}</span>
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                <span className="font-mono text-xs text-slate-500">{notice.publishDate}</span>
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-2 flex items-center gap-1">
                  <span>Read Circular</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {selectedNotice.category} Circular
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedNotice.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Issued By: {selectedNotice.author} ({selectedNotice.department})</span>
              <span>Date: {selectedNotice.publishDate}</span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p>{selectedNotice.content}</p>
              <p>For inquiries or clarifications, students may visit the Academic Operations Desk during home room hours.</p>
            </div>

            {selectedNotice.attachmentName && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Paperclip className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{selectedNotice.attachmentName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Downloading attachment: ${selectedNotice.attachmentName}`)}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-teal-700 text-white hover:bg-teal-800 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
