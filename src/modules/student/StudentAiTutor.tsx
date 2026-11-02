import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Sparkles, Send, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MockResponse {
  question: string;
  answer: string;
  citation: string;
  sourceDoc: string;
}

const MOCK_GROUNDED_DATABASE: MockResponse[] = [
  {
    question: 'How do I solve quadratic equations using the discriminant formula?',
    answer: 'For ax² + bx + c = 0, calculate the discriminant Δ = b² - 4ac. If Δ > 0, there are two distinct real roots x = (-b ± √Δ) / 2a. If Δ = 0, there is one repeated real root x = -b / 2a. If Δ < 0, there are two complex conjugate roots.',
    citation: 'Chapter 4: Quadratic Equations & Parabolic Modelling, Section 4.3 (Theorem 4.1)',
    sourceDoc: 'Mrs. Sarah Jenkins - Mathematics Compendium 2026'
  },
  {
    question: 'Explain Snell\'s law and total internal reflection for prism experiments',
    answer: 'Snell\'s law states n1·sin(θ1) = n2·sin(θ2). When light travels from an optically denser medium to a rarer medium (n1 > n2), total internal reflection occurs if the angle of incidence exceeds the critical angle θc = arcsin(n2 / n1).',
    citation: 'Optics Laboratory Manual, Exp #3 (Prism Refraction & Minimum Deviation)',
    sourceDoc: 'Dr. Michael Chen - Physics Laboratory Guide'
  },
  {
    question: 'What is the difference between class inheritance and encapsulation in Python?',
    answer: 'Encapsulation bundles data attributes and behavior methods inside a class while hiding private attributes using leading underscores (_ or __). Inheritance allows a derived child class (e.g., SavingsAccount) to inherit attributes and methods from a parent base class (e.g., Account), promoting code reuse.',
    citation: 'Object-Oriented Design in Python, Unit 2 (Principles of OOP)',
    sourceDoc: 'Mr. Alan Turing Jr. - Computer Science Syllabus 2026'
  }
];

export const StudentAiTutor: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'tutor'; text: string; citation?: string; doc?: string }[]>([
    {
      sender: 'tutor',
      text: 'Hello Aarav! I am your FutureSchool Grounded Academic Study Companion. I answer questions by citing approved syllabus textbooks and notes provided by your teachers. How can I help you study today?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAsk = (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      // Look for grounded answer in mock database
      const match = MOCK_GROUNDED_DATABASE.find(item =>
        q.toLowerCase().includes('quadratic') ||
        q.toLowerCase().includes('discriminant')
      ) || MOCK_GROUNDED_DATABASE.find(item =>
        q.toLowerCase().includes('snell') ||
        q.toLowerCase().includes('prism') ||
        q.toLowerCase().includes('reflection')
      ) || MOCK_GROUNDED_DATABASE.find(item =>
        q.toLowerCase().includes('python') ||
        q.toLowerCase().includes('oop') ||
        q.toLowerCase().includes('encapsulation')
      ) || {
        question: q,
        answer: `According to the Class 10 Syllabus Guidelines, this topic is covered in your prescribed curriculum. Review your teacher-uploaded lecture slides and notes for in-depth step-by-step examples.`,
        citation: 'Standard Academic Curriculum Guide 2026-2027',
        sourceDoc: 'Faculty Approved Notes & Central Library Repository'
      };

      setMessages(prev => [
        ...prev,
        {
          sender: 'tutor',
          text: match.answer,
          citation: match.citation,
          doc: match.sourceDoc
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Study Tutor (Prototype Simulation)"
        subtitle="Grounded learning assistant citing approved teacher study materials"
        badge={
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Mock Simulation
          </span>
        }
      />

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <span>
          <strong>Prototype Notice:</strong> This is a deterministic frontend simulation that demonstrates grounded textbook citations. It does not initiate real external LLM API calls.
        </span>
      </div>

      {/* Chat Area */}
      <Card className="flex flex-col h-[520px]">
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700'
                }`}
              >
                {m.sender === 'tutor' && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FutureSchool Academic AI Tutor</span>
                  </div>
                )}
                <p>{m.text}</p>

                {m.citation && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                    <span className="font-bold text-teal-800 dark:text-teal-300 block">
                      Approved Citation:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                      {m.citation}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Source: {m.doc}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Sparkles className="w-4 h-4 text-teal-500 animate-spin" />
              <span>Retrieving grounded explanation from teacher compendium...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Inquiries */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Sample prompts:</span>
          {MOCK_GROUNDED_DATABASE.map(item => (
            <button
              key={item.question}
              onClick={() => handleAsk(item.question)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap hover:border-teal-500 hover:text-teal-600"
            >
              {item.question.slice(0, 35)}...
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask a question about Math, Physics, or Computer Science syllabus..."
            className="flex-1 px-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            onClick={() => handleAsk()}
            className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};
