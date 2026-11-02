import { UserProfile } from '../types/roles';

export interface DemoAccount {
  id: string; // Identifier entered at login
  password: string;
  role: 'STUDENT' | 'PARENT' | 'TEACHER' | 'PRINCIPAL' | 'ADMIN';
  email: string;
  user: UserProfile;
  mfaCode?: string;
  description: string;
}

export const DEMO_PASSWORD = 'password123';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'GVS-2027-0001',
    password: DEMO_PASSWORD,
    role: 'STUDENT',
    email: 'sharma.family@gvs.edu',
    description: 'Class 10-A · Roll #18 (Student Access)',
    user: {
      id: 'GVS-2027-0001',
      name: 'Aarav Sharma',
      email: 'sharma.family@gvs.edu',
      role: 'STUDENT',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=c0aede',
      roleLabel: 'Student · Grade 10-A',
      studentId: 'GVS-2027-0001'
    }
  },
  {
    id: 'GVS-2027-0001',
    password: DEMO_PASSWORD,
    role: 'PARENT',
    email: 'sharma.family@gvs.edu',
    description: 'Guardian of Aarav Sharma (Parent Access)',
    user: {
      id: 'GVS-2027-0001',
      name: 'Dr. Rajesh Sharma',
      email: 'sharma.family@gvs.edu',
      role: 'PARENT',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rajesh&backgroundColor=b6e3f4',
      roleLabel: 'Parent / Guardian',
      studentId: 'GVS-2027-0001'
    }
  },
  {
    id: 'TCH0001',
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 's.jenkins@futureschool.edu',
    description: 'Head of Mathematics & Class 10-A Mentor',
    user: {
      id: 'TCH0001',
      name: 'Mrs. Sarah Jenkins',
      email: 's.jenkins@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=ffd5dc',
      roleLabel: 'Faculty · Class 10-A Mentor',
      department: 'Mathematics & STEM',
      classTeacherOf: 'Grade 10-A'
    }
  },
  {
    id: 'PRN0001',
    password: DEMO_PASSWORD,
    role: 'PRINCIPAL',
    email: 'principal.vance@futureschool.edu',
    description: 'School Principal & Academic Director (MFA Step)',
    mfaCode: '849201',
    user: {
      id: 'PRN0001',
      name: 'Dr. Robert Vance',
      email: 'principal.vance@futureschool.edu',
      role: 'PRINCIPAL',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Robert&backgroundColor=d1d4f9',
      roleLabel: 'Principal & Executive Director',
      requiresMfa: true
    }
  },
  {
    id: 'ADM0001',
    password: DEMO_PASSWORD,
    role: 'ADMIN',
    email: 'admin.ops@futureschool.edu',
    description: 'Chief Operations & Administrative Officer (MFA Step)',
    mfaCode: '392810',
    user: {
      id: 'ADM0001',
      name: 'Arthur Pendelton',
      email: 'admin.ops@futureschool.edu',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arthur&backgroundColor=c4f1be',
      roleLabel: 'Operations & Campus Administrator',
      permissions: ['ADMISSIONS', 'FINANCE', 'ACADEMIC_OPERATIONS', 'TRANSPORT', 'SECURITY', 'REPORTS'],
      requiresMfa: true
    }
  }
];
