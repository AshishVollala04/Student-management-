import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CheckSquare, Clock, Award, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUIZ: Question[] = [
  {
    id: 1,
    question: 'What is the nature of the roots of a quadratic equation ax² + bx + c = 0 when the discriminant Δ = b² - 4ac > 0 and a perfect square?',
    options: ['Real, rational, and unequal', 'Real, irrational, and unequal', 'Real and equal', 'Complex conjugates'],
    correctIndex: 0,
    explanation: 'When Δ > 0 and is a perfect square (with rational coefficients), the square root is rational, producing two distinct rational roots.'
  },
  {
    id: 2,
    question: 'According to Snell\'s law of refraction, what ratio remains constant for a given pair of optical media?',
    options: ['sin(i) / sin(r)', 'sin(i) × sin(r)', 'cos(i) / cos(r)', 'tan(i) / tan(r)'],
    correctIndex: 0,
    explanation: 'Snell\'s Law states sin(i) / sin(r) = n2 / n1 (refractive index ratio).'
  },
  {
    id: 3,
    question: 'In object-oriented design, what principle encapsulates object state and restricts direct member access?',
    options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Compilation'],
    correctIndex: 0,
    explanation: 'Encapsulation restricts direct access to internal components and packages data with member methods.'
  }
];

export const StudentQuiz: React.FC = () => {
  const [inQuiz, setInQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (quizFinished) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    SAMPLE_QUIZ.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return correct;
  };

  const score = calculateScore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quiz Self-Assessment"
        subtitle="Self-paced MCQ knowledge verification with immediate scoring and explanations"
        badge={<StatusBadge status="ACTIVE" />}
      />

      {!inQuiz && !quizFinished ? (
        <Card className="p-6 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Grade 10 STEM Diagnostic Drill #4
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            3 High-Yield Concept Questions · Mathematics, Physics & Computer Science · Instant Review
          </p>
          <div className="flex justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 my-4">
            <span>Duration: 10 mins</span>
            <span>·</span>
            <span>3 Total Points</span>
            <span>·</span>
            <span>Max 3 Attempts</span>
          </div>
          <button
            onClick={() => setInQuiz(true)}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-900/20"
          >
            Start Quiz Attempt
          </button>
        </Card>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {quizFinished && (
            <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Attempt Results
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  You scored {score} / {SAMPLE_QUIZ.length} ({Math.round((score / SAMPLE_QUIZ.length) * 100)}%)
                </div>
              </div>
              <button
                onClick={() => {
                  setAnswers({});
                  setQuizFinished(false);
                  setInQuiz(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-teal-300 text-xs font-bold text-teal-800 dark:text-teal-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Drill</span>
              </button>
            </div>
          )}

          {SAMPLE_QUIZ.map((q, qIndex) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.correctIndex;

            return (
              <Card key={q.id} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                    Q{qIndex + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>

                    <div className="space-y-2 mt-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx;
                        let optionStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';

                        if (quizFinished) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-bold';
                          }
                        } else if (isChosen) {
                          optionStyle = 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-100 font-bold';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelect(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${optionStyle}`}
                          >
                            <span className="font-mono mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {quizFinished && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-800 dark:text-slate-200">Conceptual Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {!quizFinished && (
            <button
              onClick={() => setQuizFinished(true)}
              disabled={Object.keys(answers).length < SAMPLE_QUIZ.length}
              className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              Submit Quiz for Instant Scoring
            </button>
          )}
        </div>
      )}
    </div>
  );
};
