/**
 * FutureSchool - Teacher Extra Pages
 * Classes Directory, Homework Manager, Quiz Builder, Lesson Planner
 */

import React, { useState } from 'react';
import { PageHeader, StatCard, EmptyState, SearchInput } from '../../components/common/CommonUi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText, 
  Upload, 
  Calendar,
  Sparkles,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';

// ==========================================
// 1. TEACHER CLASSES DIRECTORY
// ==========================================
export const TeacherClasses: React.FC = () => {
  const [classes] = useState([
    {
      id: 'cls-1',
      grade: 'Class 10-A',
      subject: 'Mathematics',
      room: 'Room 204 (Aryabhata Block)',
      strength: 38,
      avgAttendance: '94.2%',
      syllabusCovered: 78,
      pendingAssignments: 3,
      isMentor: true,
    },
    {
      id: 'cls-2',
      grade: 'Class 10-B',
      subject: 'Mathematics',
      room: 'Room 205 (Aryabhata Block)',
      strength: 37,
      avgAttendance: '91.8%',
      syllabusCovered: 74,
      pendingAssignments: 2,
      isMentor: false,
    },
    {
      id: 'cls-3',
      grade: 'Class 11-A',
      subject: 'Calculus & Applied Math',
      room: 'Room 302 (Ramanujan Wing)',
      strength: 32,
      avgAttendance: '96.0%',
      syllabusCovered: 65,
      pendingAssignments: 1,
      isMentor: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Teaching Classes"
        subtitle="Active classes assigned for Academic Year 2026-27"
        breadcrumbs={[{ label: 'Teacher', href: '/teacher/dashboard' }, { label: 'Classes' }]}
        actions={
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Class Schedule
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Students Taught" value="107" subtitle="Across 3 sections" icon={Users} color="teal" />
        <StatCard title="Average Class Attendance" value="94.0%" subtitle="Last 30 school days" icon={CheckCircle2} color="emerald" />
        <StatCard title="Overall Syllabus Velocity" value="72.3%" subtitle="On track for term end" icon={BookOpen} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="p-6 flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  {cls.subject}
                </span>
                {cls.isMentor ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Class Mentor
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Subject Faculty</span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900">{cls.grade}</h3>
              <p className="text-xs text-gray-500 mt-1">{cls.room}</p>

              <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-gray-100 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block">Enrolled</span>
                  <span className="font-semibold text-gray-800">{cls.strength} Students</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Attendance</span>
                  <span className="font-semibold text-emerald-600">{cls.avgAttendance}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Syllabus Covered</span>
                  <span className="font-semibold text-teal-700">{cls.syllabusCovered}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${cls.syllabusCovered}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Roster
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                Open Gradebook
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. TEACHER HOMEWORK MANAGER
// ==========================================
export const TeacherHomework: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [homeworkList, setHomeworkList] = useState([
    {
      id: 'hw-1',
      title: 'Quadratic Equations Exercise 4.2',
      class: 'Class 10-A',
      dueDate: '2027-04-16',
      totalAssigned: 38,
      submitted: 34,
      evaluated: 30,
      status: 'ACTIVE',
    },
    {
      id: 'hw-2',
      title: 'Triangles & Similarity Proofs (Ex 6.3)',
      class: 'Class 10-B',
      dueDate: '2027-04-18',
      totalAssigned: 37,
      submitted: 22,
      evaluated: 10,
      status: 'ACTIVE',
    },
    {
      id: 'hw-3',
      title: 'Limits & Derivatives Problem Set 3',
      class: 'Class 11-A',
      dueDate: '2027-04-10',
      totalAssigned: 32,
      submitted: 32,
      evaluated: 32,
      status: 'COMPLETED',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('Class 10-A');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;
    const newItem = {
      id: `hw-${Date.now()}`,
      title: newTitle,
      class: newClass,
      dueDate: newDueDate,
      totalAssigned: 38,
      submitted: 0,
      evaluated: 0,
      status: 'ACTIVE',
    };
    setHomeworkList([newItem, ...homeworkList]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework & Assignment Hub"
        subtitle="Create, collect, and evaluate student assignments"
        breadcrumbs={[{ label: 'Teacher', href: '/teacher/dashboard' }, { label: 'Homework' }]}
        actions={
          <Button variant="accent" size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create Assignment
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Assignments" value="2" subtitle="Currently open for submission" icon={Clock} color="teal" />
        <StatCard title="Pending Evaluation" value="16" subtitle="Submissions awaiting marks" icon={FileText} color="amber" />
        <StatCard title="Submission Rate" value="89.3%" subtitle="Average on-time turn in" icon={CheckCircle2} color="emerald" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Class Assignments</h3>
          <div className="w-full sm:w-64">
            <SearchInput placeholder="Search assignments..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Assignment Title</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Turn-in Progress</th>
                <th className="py-3 px-4">Evaluated</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {homeworkList.map((hw) => {
                const turnInPercent = Math.round((hw.submitted / hw.totalAssigned) * 100);
                return (
                  <tr key={hw.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{hw.title}</td>
                    <td className="py-3.5 px-4 text-gray-600">{hw.class}</td>
                    <td className="py-3.5 px-4 text-gray-600">{hw.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${turnInPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{hw.submitted}/{hw.totalAssigned}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">{hw.evaluated}/{hw.submitted}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={hw.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(hw.title)}>
                        Submissions
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Homework Assignment"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g., Arithmetic Progressions Exercise 5.1"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Target Class"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              options={[
                { value: 'Class 10-A', label: 'Class 10-A (Mathematics)' },
                { value: 'Class 10-B', label: 'Class 10-B (Mathematics)' },
                { value: 'Class 11-A', label: 'Class 11-A (Calculus)' },
              ]}
            />
            <Input
              label="Due Date"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Instructions & Problem Questions
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              rows={4}
              placeholder="State problem numbers from the textbook or type specific instructions here..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <div className="p-3 bg-teal-50 rounded-lg border border-teal-100 flex items-center justify-between text-xs text-teal-800">
            <span>Allowed Submission Type: PDF Scan / High-res Photo</span>
            <span className="font-semibold">Max Size: 10 MB</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Submissions Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={`Submissions: ${selectedAssignment}`}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Review submitted student scripts and allocate marks:
          </p>
          <div className="border rounded-lg divide-y divide-gray-100 text-sm">
            <div className="p-3 flex items-center justify-between bg-gray-50/50">
              <div>
                <span className="font-semibold text-gray-900 block">Aarav Sharma (Roll 01)</span>
                <span className="text-xs text-gray-500">Submitted on Apr 14, 04:30 PM • 3 Pages PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-3.5 h-3.5 mr-1" /> View PDF
                </Button>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded border border-emerald-200">
                  Marked: 10/10
                </span>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900 block">Aditi Rao (Roll 02)</span>
                <span className="text-xs text-gray-500">Submitted on Apr 15, 08:15 AM • 2 Pages PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-3.5 h-3.5 mr-1" /> View PDF
                </Button>
                <Button variant="primary" size="sm">
                  Grade Script
                </Button>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between bg-red-50/30">
              <div>
                <span className="font-semibold text-gray-900 block">Karan Patel (Roll 15)</span>
                <span className="text-xs text-red-600 font-medium">Pending Turn-in (Overdue)</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs text-amber-700">
                Send Reminder
              </Button>
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ==========================================
// 3. TEACHER QUIZ BUILDER
// ==========================================
export const TeacherQuizBuilder: React.FC = () => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 'q-1',
      title: 'Polynomials & Roots Speed Drill',
      subject: 'Mathematics',
      class: 'Class 10-A',
      questionsCount: 10,
      timeLimitMinutes: 15,
      status: 'PUBLISHED',
      attempts: 36,
      avgScore: '8.4 / 10',
    },
    {
      id: 'q-2',
      title: 'Coordinate Geometry Concept Check',
      subject: 'Mathematics',
      class: 'Class 10-B',
      questionsCount: 8,
      timeLimitMinutes: 12,
      status: 'DRAFT',
      attempts: 0,
      avgScore: '-',
    },
  ]);

  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [drillTitle, setDrillTitle] = useState('');
  const [drillClass, setDrillClass] = useState('Class 10-A');
  const [timeLimit, setTimeLimit] = useState(15);

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drillTitle.trim()) return;
    setQuizzes([
      {
        id: `q-${Date.now()}`,
        title: drillTitle,
        subject: 'Mathematics',
        class: drillClass,
        questionsCount: 5,
        timeLimitMinutes: timeLimit,
        status: 'PUBLISHED',
        attempts: 0,
        avgScore: '-',
      },
      ...quizzes,
    ]);
    setShowBuilderModal(false);
    setDrillTitle('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Quiz & MCQ Bank"
        subtitle="Author formative assessment drills and evaluate instant scoring"
        breadcrumbs={[{ label: 'Teacher', href: '/teacher/dashboard' }, { label: 'Quiz Builder' }]}
        actions={
          <Button variant="accent" size="sm" onClick={() => setShowBuilderModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Build New Quiz
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Quizzes Published" value="12" subtitle="This academic term" icon={HelpCircle} color="teal" />
        <StatCard title="Student Attempts" value="384" subtitle="Automatic instant grading" icon={CheckCircle2} color="emerald" />
        <StatCard title="Average Drill Score" value="82%" subtitle="Positive mastery indicator" icon={Sparkles} color="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((q) => (
          <Card key={q.id} className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {q.class} • {q.subject}
              </span>
              <StatusBadge status={q.status} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">{q.title}</h3>
            
            <div className="grid grid-cols-3 gap-2 my-4 py-3 bg-gray-50 rounded-lg text-center text-xs">
              <div>
                <span className="text-gray-400 block">Questions</span>
                <span className="font-bold text-gray-800 text-sm">{q.questionsCount} MCQs</span>
              </div>
              <div>
                <span className="text-gray-400 block">Duration</span>
                <span className="font-bold text-gray-800 text-sm">{q.timeLimitMinutes} min</span>
              </div>
              <div>
                <span className="text-gray-400 block">Avg Score</span>
                <span className="font-bold text-teal-700 text-sm">{q.avgScore}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">
                {q.attempts > 0 ? `${q.attempts} students completed` : 'No attempts yet'}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Questions
                </Button>
                <Button variant="primary" size="sm">
                  View Analytics
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Builder Modal */}
      <Modal
        isOpen={showBuilderModal}
        onClose={() => setShowBuilderModal(false)}
        title="Create New MCQ Assessment Drill"
        size="lg"
      >
        <form onSubmit={handleCreateQuiz} className="space-y-4">
          <Input
            label="Quiz / Drill Name"
            placeholder="e.g. Quadratic Formula & Discriminant Drill"
            value={drillTitle}
            onChange={(e) => setDrillTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Class"
              value={drillClass}
              onChange={(e) => setDrillClass(e.target.value)}
              options={[
                { value: 'Class 10-A', label: 'Class 10-A' },
                { value: 'Class 10-B', label: 'Class 10-B' },
                { value: 'Class 11-A', label: 'Class 11-A' },
              ]}
            />
            <Input
              label="Time Limit (Minutes)"
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              min={5}
              max={60}
              required
            />
          </div>

          <div className="p-4 border border-dashed rounded-lg bg-gray-50 text-center">
            <Sparkles className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-gray-900">Standard 5-Question Question Bank Template Loaded</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Includes pre-configured randomized multiple choice options with verified answer keys.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setShowBuilderModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit">
              Publish to Student Portal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ==========================================
// 4. TEACHER LESSON PLANNER
// ==========================================
export const TeacherLessonPlanner: React.FC = () => {
  const [plans] = useState([
    {
      week: 'Week 16 (Apr 14 - Apr 19)',
      class: 'Class 10-A',
      subject: 'Mathematics',
      topic: 'Chapter 5: Arithmetic Progressions',
      subtopics: 'nth term derivation, sum of first n terms application problems',
      status: 'APPROVED',
      pedagogy: 'Visual number lines + Peer board solving',
      hours: 5,
    },
    {
      week: 'Week 17 (Apr 21 - Apr 26)',
      class: 'Class 10-A',
      subject: 'Mathematics',
      topic: 'Chapter 6: Triangles',
      subtopics: 'Basic Proportionality Theorem (Thales theorem) and converse',
      status: 'SUBMITTED',
      pedagogy: 'Geometric cutouts and rigorous proof writing',
      hours: 6,
    },
    {
      week: 'Week 16 (Apr 14 - Apr 19)',
      class: 'Class 11-A',
      subject: 'Calculus',
      topic: 'Limits at Infinity & Continuity',
      subtopics: 'Epsilon-delta conceptual intuition, squeeze theorem',
      status: 'APPROVED',
      pedagogy: 'Graphing software demonstrations',
      hours: 5,
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Lesson Planner & Curriculum Tracking"
        subtitle="Map classroom learning objectives with State Board/State curriculum standards"
        breadcrumbs={[{ label: 'Teacher', href: '/teacher/dashboard' }, { label: 'Lesson Planner' }]}
        actions={
          <Button variant="accent" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Submit New Lesson Plan
          </Button>
        }
      />

      <div className="space-y-4">
        {plans.map((p, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 mr-2">
                  {p.class}
                </span>
                <span className="text-xs text-gray-500 font-medium">{p.week}</span>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <h4 className="text-base font-bold text-gray-900">{p.topic}</h4>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Subtopics: </span>
                  {p.subtopics}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Pedagogical Method: </span>
                  {p.pedagogy}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg flex flex-col justify-between text-xs">
                <div>
                  <span className="text-gray-400 block">Classroom Allocation</span>
                  <span className="font-semibold text-gray-800">{p.hours} Periods scheduled</span>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-teal-700 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Curriculum Aligned</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
