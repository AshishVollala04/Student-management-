import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/CommonUi';
import { Library, BookOpen, ExternalLink, Bookmark } from 'lucide-react';

export const StudentLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const books = [
    { id: 1, title: 'Hall & Knight: Higher Algebra & Series', category: 'MATHEMATICS', author: 'H.S. Hall', shelf: 'STEM E-Stack 4', available: true },
    { id: 2, title: 'Fundamentals of Physics (Extended 10th Ed)', category: 'PHYSICS', author: 'Halliday & Resnick', shelf: 'Physics Digital Reserve', available: true },
    { id: 3, title: 'Clean Code: A Handbook of Agile Software Craftsmanship', category: 'COMPUTER SCIENCE', author: 'Robert C. Martin', shelf: 'CS Lab Collection', available: true },
    { id: 4, title: 'Oxford Companion to English Literature', category: 'LITERATURE', author: 'Dinah Birch', shelf: 'Humanities Wing', available: false },
    { id: 5, title: 'Campbell Biology: Concepts & Connections', category: 'BIOLOGY', author: 'Martha R. Taylor', shelf: 'Life Sciences E-Shelf', available: true }
  ];

  const categories = ['ALL', 'MATHEMATICS', 'PHYSICS', 'COMPUTER SCIENCE', 'LITERATURE', 'BIOLOGY'];

  const filtered = books.filter(b => {
    const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Digital Library"
        subtitle="Catalog and digital e-book repository across 600-student school academic resources"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by title, author, or ISBN..."
          className="max-w-md w-full"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-teal-700 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(book => (
          <Card key={book.id} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                <span>{book.category}</span>
                <span className={book.available ? 'text-emerald-600' : 'text-slate-400'}>
                  {book.available ? '● Available' : '○ Checked Out'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                {book.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">By {book.author}</p>
              <div className="mt-2 text-[11px] text-slate-400">
                Location: <strong className="text-slate-600 dark:text-slate-300">{book.shelf}</strong>
              </div>
            </div>

            <button
              onClick={() => alert(`Digital reader demo: Opening "${book.title}" in secure campus viewer.`)}
              className="mt-4 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open E-Reader</span>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
