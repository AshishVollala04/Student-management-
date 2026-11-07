import { UserProfile, UserRole } from '../types/roles';

export interface DemoAccount {
  id: string; // Identifier entered at login
  aliases?: string[];
  password: string;
  role: UserRole;
  email: string;
  phone?: string;
  user: UserProfile;
  mfaCode?: string;
  description: string;
}

export const DEMO_PASSWORD = 'password123';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  // 1. Primary Student
  {
    id: 'GVS-2027-0001',
    aliases: ['STU0001', 'STUDENT', 'AARAV', '2027-0001', '0001', 'sharma.family@gvs.edu'],
    phone: '+91 98765 43210',
    password: DEMO_PASSWORD,
    role: 'STUDENT',
    email: 'aarav.sharma@futureschool.edu',
    description: 'Class 10-A · Roll #18 (Student Access)',
    user: {
      id: 'GVS-2027-0001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@futureschool.edu',
      role: 'STUDENT',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=c0aede',
      roleLabel: 'Student · Grade 10-A · Roll #18',
      tenantId: 'GVS',
      studentId: 'GVS-2027-0001',
      grade: '10',
      section: 'A',
      rollNumber: '18'
    }
  },

  // 2. Parent Account
  {
    id: 'PAR0001',
    aliases: ['PAR0001', 'PAR-0001', 'GVS-2027-0001', 'PARENT', '9876543210', 'rajesh.sharma@gmail.com'],
    phone: '+91 98765 43210',
    password: DEMO_PASSWORD,
    role: 'PARENT',
    email: 'rajesh.sharma@gmail.com',
    description: 'Guardian of Aarav Sharma (Parent / Mobile / ID Access)',
    user: {
      id: 'PAR0001',
      name: 'Dr. Rajesh Sharma',
      email: 'rajesh.sharma@gmail.com',
      role: 'PARENT',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rajesh&backgroundColor=b6e3f4',
      roleLabel: 'Parent / Guardian',
      tenantId: 'GVS',
      studentId: 'GVS-2027-0001'
    }
  },

  // 3. Teachers (6 Class Teachers + 7 Subject Specialists)
  {
    id: 'TCH0001',
    aliases: ['TCH0001', 'JENKINS'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'sarah.jenkins@futureschool.edu',
    description: 'Class 10-A Mentor & Science Lead',
    user: {
      id: 'TCH0001',
      name: 'Mrs. Sarah Jenkins',
      email: 'sarah.jenkins@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mrs.%20Sarah%20Jenkins&backgroundColor=ffd5dc',
      roleLabel: 'Class 10-A Mentor & Science Lead',
      tenantId: 'GVS',
      department: 'Physical Science'
    }
  },
  {
    id: 'TCH0002',
    aliases: ['TCH0002', 'NAIR'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'raghavan.nair@futureschool.edu',
    description: 'Class 10-B Mentor & Mathematics Lead',
    user: {
      id: 'TCH0002',
      name: 'Mr. Raghavan Nair',
      email: 'raghavan.nair@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mr.%20Raghavan%20Nair&backgroundColor=ffd5dc',
      roleLabel: 'Class 10-B Mentor & Mathematics Lead',
      tenantId: 'GVS',
      department: 'Mathematics'
    }
  },
  {
    id: 'TCH0003',
    aliases: ['TCH0003', 'SEN'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'ananya.sen@futureschool.edu',
    description: 'Class 9-A Mentor & English Faculty',
    user: {
      id: 'TCH0003',
      name: 'Mrs. Ananya Sen',
      email: 'ananya.sen@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mrs.%20Ananya%20Sen&backgroundColor=ffd5dc',
      roleLabel: 'Class 9-A Mentor & English Faculty',
      tenantId: 'GVS',
      department: 'English Literature'
    }
  },
  {
    id: 'TCH0004',
    aliases: ['TCH0004', 'RAO'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'rajeshwar.rao@futureschool.edu',
    description: 'Class 9-B Mentor & Humanities Lead',
    user: {
      id: 'TCH0004',
      name: 'Mr. Rajeshwar Rao',
      email: 'rajeshwar.rao@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mr.%20Rajeshwar%20Rao&backgroundColor=ffd5dc',
      roleLabel: 'Class 9-B Mentor & Humanities Lead',
      tenantId: 'GVS',
      department: 'Social Science'
    }
  },
  {
    id: 'TCH0005',
    aliases: ['TCH0005', 'SUNDARAM'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'meenakshi.sundaram@futureschool.edu',
    description: 'Class 8-A Mentor & Biology Lead',
    user: {
      id: 'TCH0005',
      name: 'Mrs. Meenakshi Sundaram',
      email: 'meenakshi.sundaram@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mrs.%20Meenakshi%20Sundaram&backgroundColor=ffd5dc',
      roleLabel: 'Class 8-A Mentor & Biology Lead',
      tenantId: 'GVS',
      department: 'Biological Science'
    }
  },
  {
    id: 'TCH0006',
    aliases: ['TCH0006', 'SHARMA'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'amit.sharma@futureschool.edu',
    description: 'Class 8-B Mentor & Languages Lead',
    user: {
      id: 'TCH0006',
      name: 'Mr. Amit Sharma',
      email: 'amit.sharma@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mr.%20Amit%20Sharma&backgroundColor=ffd5dc',
      roleLabel: 'Class 8-B Mentor & Languages Lead',
      tenantId: 'GVS',
      department: 'Hindi & Sanskrit'
    }
  },
  {
    id: 'TCH0007',
    aliases: ['TCH0007', 'RAMAN'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'kv.raman@futureschool.edu',
    description: 'Senior Mathematics Specialist',
    user: {
      id: 'TCH0007',
      name: 'Mr. K. V. Raman',
      email: 'kv.raman@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mr.%20K.%20V.%20Raman&backgroundColor=ffd5dc',
      roleLabel: 'Senior Mathematics Specialist',
      tenantId: 'GVS',
      department: 'Mathematics'
    }
  },
  {
    id: 'TCH0008',
    aliases: ['TCH0008', 'VERMA'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'pradeep.verma@futureschool.edu',
    description: 'Physics & Chemistry Specialist',
    user: {
      id: 'TCH0008',
      name: 'Dr. Pradeep Verma',
      email: 'pradeep.verma@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Dr.%20Pradeep%20Verma&backgroundColor=ffd5dc',
      roleLabel: 'Physics & Chemistry Specialist',
      tenantId: 'GVS',
      department: 'Physical Science'
    }
  },
  {
    id: 'TCH0009',
    aliases: ['TCH0009', 'REDDY'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'kavitha.reddy@futureschool.edu',
    description: 'Biology & Environmental Science',
    user: {
      id: 'TCH0009',
      name: 'Ms. Kavitha Reddy',
      email: 'kavitha.reddy@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ms.%20Kavitha%20Reddy&backgroundColor=ffd5dc',
      roleLabel: 'Biology & Environmental Science',
      tenantId: 'GVS',
      department: 'Biological Science'
    }
  },
  {
    id: 'TCH0010',
    aliases: ['TCH0010', 'MURTHY'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'deepa.murthy@futureschool.edu',
    description: 'English Language & Communication',
    user: {
      id: 'TCH0010',
      name: 'Mrs. Deepa Murthy',
      email: 'deepa.murthy@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mrs.%20Deepa%20Murthy&backgroundColor=ffd5dc',
      roleLabel: 'English Language & Communication',
      tenantId: 'GVS',
      department: 'English'
    }
  },
  {
    id: 'TCH0011',
    aliases: ['TCH0011', 'PATIL'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'suresh.patil@futureschool.edu',
    description: 'Geography & Civics Specialist',
    user: {
      id: 'TCH0011',
      name: 'Mr. Suresh Patil',
      email: 'suresh.patil@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mr.%20Suresh%20Patil&backgroundColor=ffd5dc',
      roleLabel: 'Geography & Civics Specialist',
      tenantId: 'GVS',
      department: 'Social Studies'
    }
  },
  {
    id: 'TCH0012',
    aliases: ['TCH0012', 'HEGDE'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'suhasini.hegde@futureschool.edu',
    description: 'Regional Language Coordinator',
    user: {
      id: 'TCH0012',
      name: 'Mrs. Suhasini Hegde',
      email: 'suhasini.hegde@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mrs.%20Suhasini%20Hegde&backgroundColor=ffd5dc',
      roleLabel: 'Regional Language Coordinator',
      tenantId: 'GVS',
      department: 'First Language (Kannada)'
    }
  },
  {
    id: 'TCH0013',
    aliases: ['TCH0013', 'KUMAR'],
    password: DEMO_PASSWORD,
    role: 'TEACHER',
    email: 'arun.kumar@futureschool.edu',
    description: 'Computer Applications & Robotics',
    user: {
      id: 'TCH0013',
      name: 'Mr. Arun Kumar',
      email: 'arun.kumar@futureschool.edu',
      role: 'TEACHER',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mr.%20Arun%20Kumar&backgroundColor=ffd5dc',
      roleLabel: 'Computer Applications & Robotics',
      tenantId: 'GVS',
      department: 'Computer Science & AI'
    }
  },

  // 4. Principal
  {
    id: 'PRN0001',
    aliases: ['PRN0001', 'PRINCIPAL', 'SHASHEKHAR', 'principal@futureschool.edu'],
    password: DEMO_PASSWORD,
    role: 'PRINCIPAL',
    email: 'principal@futureschool.edu',
    description: 'Principal & Head of Institution',
    user: {
      id: 'PRN0001',
      name: 'Dr. Shashi Shekhar',
      email: 'principal@futureschool.edu',
      role: 'PRINCIPAL',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Shashi&backgroundColor=d1d4f9',
      roleLabel: 'Principal & Academic Director',
      tenantId: 'GVS',
      requiresMfa: false
    }
  },

  // 5. System Administrator
  {
    id: 'ADM0001',
    aliases: ['ADM0001', 'ADMIN', 'admin@futureschool.edu'],
    password: DEMO_PASSWORD,
    role: 'ADMIN',
    email: 'admin@futureschool.edu',
    description: 'Chief Systems Administrator',
    user: {
      id: 'ADM0001',
      name: 'S. Sundaram',
      email: 'admin@futureschool.edu',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sundaram&backgroundColor=c4f1be',
      roleLabel: 'Campus Administrator & System Lead',
      tenantId: 'GVS',
      requiresMfa: false
    }
  }
];
