import React, { useState } from 'react';
import { NoticeItem } from '../../types';
import { Bell, Search, Calendar, AlertCircle, FileText, Share2, Bookmark, Check } from 'lucide-react';

interface NoticesScreenProps {
  notices: NoticeItem[];
}

export const NoticesScreen: React.FC<NoticesScreenProps> = ({ notices }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'exam', label: 'Exam Notifications' },
    { id: 'holiday', label: 'Holidays' },
    { id: 'urgent', label: 'Important' }
  ];

  const filteredNotices = notices.filter(n => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: string, priority: string) => {
    if (priority === 'high') {
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
    }
    switch (category) {
      case 'exam':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'holiday':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'announcement':
      default:
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
    }
  };

  const handleShare = (notice: NoticeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search school circulars, exam dates, keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No circulars found matching "{searchQuery}"
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadge(notice.category, notice.priority)}`}>
                    {notice.priority === 'high' ? 'Urgent' : notice.category}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {notice.date}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleShare(notice, e)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                  title="Copy circular link"
                >
                  {copiedId === notice.id ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {notice.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {notice.content}
              </p>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>Issued by: <strong className="text-slate-700 dark:text-slate-300">{notice.author}</strong> ({notice.authorRole})</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                  Read full circular →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Active Notice Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getCategoryBadge(activeNotice.category, activeNotice.priority)}`}>
                {activeNotice.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {activeNotice.date}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeNotice.title}
              </h3>
              <div className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {activeNotice.content}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Official Sign-off</p>
                <p className="text-[11px] text-slate-500">{activeNotice.author} · {activeNotice.authorRole}</p>
              </div>
              <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded font-mono text-[10px] text-slate-500 border border-slate-200 dark:border-slate-700">
                Circular #{activeNotice.id.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setActiveNotice(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
