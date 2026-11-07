import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FilterBar } from '../../components/common/CommonUi';
import { FileText, Download, Check, Sparkles } from 'lucide-react';

export const StudentMaterials: React.FC = () => {
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const materials = [
    {
      id: 'mat_1',
      subject: 'Mathematics',
      title: 'Chapter 4 Complete Formula Compendium & Solved Proofs',
      author: 'Mrs. Sarah Jenkins (Head of Dept)',
      date: '28 Oct 2026',
      size: '2.4 MB PDF',
      aiApproved: true
    },
    {
      id: 'mat_2',
      subject: 'Physics',
      title: 'Optics Laboratory Manual & Experimental Error Reference',
      author: 'Dr. Michael Chen',
      date: '24 Oct 2026',
      size: '4.8 MB PDF',
      aiApproved: true
    },
    {
      id: 'mat_3',
      subject: 'Computer Science',
      title: 'Python Data Structures & OOP Architectural Patterns',
      author: 'Mr. Alan Turing Jr.',
      date: '20 Oct 2026',
      size: '1.8 MB PDF',
      aiApproved: true
    },
    {
      id: 'mat_4',
      subject: 'English Literature',
      title: 'Shakespearean Rhetoric & Justice Motif in Venice Commentary',
      author: 'Ms. Clara Oswald',
      date: '18 Oct 2026',
      size: '950 KB PDF',
      aiApproved: false
    }
  ];

  const filtered = materials.filter(m => subjectFilter === 'ALL' || m.subject.toUpperCase() === subjectFilter);

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher-Provided Study Materials"
        subtitle="Course syllabi, lecture presentations, and revision guides provided by your faculty"
        badge={<StatusBadge status="ACTIVE" />}
      />

      <FilterBar
        options={[
          { id: 'ALL', label: 'All Subjects', count: materials.length },
          { id: 'MATHEMATICS', label: 'Mathematics' },
          { id: 'PHYSICS', label: 'Physics' },
          { id: 'COMPUTER SCIENCE', label: 'Computer Science' }
        ]}
        selectedId={subjectFilter}
        onSelect={setSubjectFilter}
      />

      <div className="space-y-3">
        {filtered.map((mat) => (
          <Card key={mat.id} className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      {mat.subject}
                    </span>
                    {mat.aiApproved && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center gap-1 border border-teal-200 dark:border-teal-800">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Tutor Grounded</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {mat.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span>Uploaded by: <strong>{mat.author}</strong></span>
                    <span>·</span>
                    <span>{mat.size}</span>
                    <span>·</span>
                    <span>{mat.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(mat.id)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 shrink-0 self-end sm:self-center transition-colors"
              >
                {downloadedId === mat.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Saved to Device</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </>
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
