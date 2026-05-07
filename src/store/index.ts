import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'student' | 'mentor';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  durationCompleted: number;
  durationEstimated: number; // in minutes
  status: 'todo' | 'in-progress' | 'done';
}

export interface TimetableEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  textColor?: string;
  daysOfWeek?: number[]; // 0=Sun, 1=Mon...
  startTime?: string; // '10:00'
  endTime?: string; // '11:00'
  startRecur?: string;
  endRecur?: string;
  subtext?: string;
  isOptimal?: boolean;
  avatars?: string[];
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  progress: number;
  deadline: string;
  category: 'Academic' | 'Skill' | 'Habit';
}

export interface MentorTask {
  id: string;
  title: string;
  description: string;
  subject: string;
  assignedBy: string;
  assignedTo: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedDuration: number; // minutes
  maxMarks: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'graded';
  progress: number; // 0-100
  submissionNote?: string;
  marks?: number;
  feedback?: string;
  completedAt?: string;
  focusMinutesSpent: number;
}

export interface Doubt {
  id: string;
  studentEmail: string;
  studentName: string;
  mentorName: string;
  subject: string;
  relatedTaskId?: string;
  title: string;
  description: string;
  status: 'pending' | 'answered';
  response?: string;
  createdAt: string;
  answeredAt?: string;
}

// Rich seed data for demo
const seedMentorTasks: MentorTask[] = [
  {
    id: 'mt-1',
    title: 'DSA Assignment 3 — Graph Traversal',
    description: 'Implement BFS and DFS for an adjacency list graph. Solve the "Number of Islands" and "Shortest Path in Binary Matrix" problems. Write clean code with time/space complexity analysis in comments.',
    subject: 'Data Structures',
    assignedBy: 'Prof. Sharma',
    assignedTo: 'student@ascendos.com',
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(), // tomorrow
    priority: 'High',
    estimatedDuration: 120,
    maxMarks: 10,
    status: 'in-progress',
    progress: 40,
    focusMinutesSpent: 50,
  },
  {
    id: 'mt-2',
    title: 'DBMS Unit 3 — Normalization Practice',
    description: 'Normalize the given unnormalized "Student-Course-Enrollment" dataset up to BCNF. Show all intermediate forms (1NF, 2NF, 3NF) with functional dependencies clearly listed. Submit as a PDF or text.',
    subject: 'Database Systems',
    assignedBy: 'Prof. Sharma',
    assignedTo: 'student@ascendos.com',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
    priority: 'Medium',
    estimatedDuration: 90,
    maxMarks: 10,
    status: 'pending',
    progress: 0,
    focusMinutesSpent: 0,
  },
  {
    id: 'mt-3',
    title: 'OS Lab — Process Scheduling Simulator',
    description: 'Build a simulator in C/Python that implements FCFS, SJF, Round Robin, and Priority scheduling. Include Gantt chart output and average waiting/turnaround time calculations.',
    subject: 'Operating Systems',
    assignedBy: 'Dr. Mehta',
    assignedTo: 'student@ascendos.com',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days
    priority: 'High',
    estimatedDuration: 180,
    maxMarks: 15,
    status: 'pending',
    progress: 0,
    focusMinutesSpent: 0,
  },
  {
    id: 'mt-4',
    title: 'Math — Linear Algebra Problem Set 7',
    description: 'Solve problems 1-12 from Chapter 4 on Eigenvalues and Eigenvectors. Show all steps. Problems 8-12 are proof-based — provide rigorous proofs.',
    subject: 'Mathematics',
    assignedBy: 'Prof. Sharma',
    assignedTo: 'student@ascendos.com',
    deadline: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago (overdue but submitted)
    priority: 'Medium',
    estimatedDuration: 60,
    maxMarks: 10,
    status: 'graded',
    progress: 100,
    submissionNote: 'Completed all 12 problems. Proofs for 8-12 included.',
    marks: 8.5,
    feedback: 'Good work overall. Proof for Q11 was incomplete — revisit the orthogonality argument. Code optimization in Q8 could be improved.',
    completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    focusMinutesSpent: 75,
  },
  {
    id: 'mt-5',
    title: 'CN — TCP/IP Protocol Analysis',
    description: 'Use Wireshark to capture a TCP handshake and analyze the packet headers. Document each field in the TCP header and explain the 3-way handshake process with screenshots.',
    subject: 'Computer Networks',
    assignedBy: 'Dr. Mehta',
    assignedTo: 'student@ascendos.com',
    deadline: new Date(Date.now() - 86400000 * 1).toISOString(), // yesterday
    priority: 'Low',
    estimatedDuration: 75,
    maxMarks: 10,
    status: 'submitted',
    progress: 100,
    submissionNote: 'Wireshark analysis complete with annotated screenshots.',
    focusMinutesSpent: 80,
  },
  {
    id: 'mt-6',
    title: 'Web Dev — React Portfolio Project',
    description: 'Build a personal portfolio website using React + Tailwind CSS. Must include: About, Projects (min 3), Skills, and Contact sections. Deploy on Vercel and submit the link.',
    subject: 'Web Development',
    assignedBy: 'Prof. Sharma',
    assignedTo: 'student@ascendos.com',
    deadline: new Date(Date.now() - 86400000 * 5).toISOString(),
    priority: 'High',
    estimatedDuration: 240,
    maxMarks: 20,
    status: 'graded',
    progress: 100,
    submissionNote: 'Portfolio deployed at https://rahul-dev.vercel.app',
    marks: 18,
    feedback: 'Excellent work! Clean design, responsive layout, and good use of animations. Minor point: add a favicon and meta tags for SEO.',
    completedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    focusMinutesSpent: 210,
  },
  // Tasks for other students (mentor sees these)
  {
    id: 'mt-7',
    title: 'DSA Assignment 3 — Graph Traversal',
    description: 'Implement BFS and DFS for an adjacency list graph.',
    subject: 'Data Structures',
    assignedBy: 'Prof. Sharma',
    assignedTo: 'priya@ascendos.com',
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    priority: 'High',
    estimatedDuration: 120,
    maxMarks: 10,
    status: 'submitted',
    progress: 100,
    submissionNote: 'BFS and DFS implemented with test cases.',
    focusMinutesSpent: 95,
  },
  {
    id: 'mt-8',
    title: 'DBMS Unit 3 — Normalization Practice',
    description: 'Normalize the given dataset up to BCNF.',
    subject: 'Database Systems',
    assignedBy: 'Prof. Sharma',
    assignedTo: 'amit@ascendos.com',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    priority: 'Medium',
    estimatedDuration: 90,
    maxMarks: 10,
    status: 'in-progress',
    progress: 60,
    focusMinutesSpent: 45,
  },
  {
    id: 'mt-9',
    title: 'OS Lab — Process Scheduling Simulator',
    description: 'Build a process scheduling simulator.',
    subject: 'Operating Systems',
    assignedBy: 'Dr. Mehta',
    assignedTo: 'sneha@ascendos.com',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    priority: 'High',
    estimatedDuration: 180,
    maxMarks: 15,
    status: 'pending',
    progress: 0,
    focusMinutesSpent: 0,
  },
  {
    id: 'mt-10',
    title: 'Math — Linear Algebra Problem Set 7',
    description: 'Solve problems 1-12 from Chapter 4.',
    subject: 'Mathematics',
    assignedBy: 'Prof. Sharma',
    assignedTo: 'priya@ascendos.com',
    deadline: new Date(Date.now() - 86400000 * 2).toISOString(),
    priority: 'Medium',
    estimatedDuration: 60,
    maxMarks: 10,
    status: 'graded',
    progress: 100,
    marks: 9,
    feedback: 'Excellent proofs. Well structured.',
    completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    focusMinutesSpent: 55,
  },
];

const seedDoubts: Doubt[] = [
  {
    id: 'dbt-1',
    studentEmail: 'student@ascendos.com',
    studentName: 'Rahul',
    mentorName: 'Prof. Sharma',
    subject: 'Database Systems',
    relatedTaskId: 'mt-2',
    title: 'Normalization confusion — 2NF vs 3NF',
    description: "I'm confused between 2NF and 3NF. In the example given in class, the table had partial dependency removed in 2NF, but I'm not sure when transitive dependency applies for 3NF. Can you give a concrete example?",
    status: 'answered',
    response: '2NF removes partial dependency — when a non-key attribute depends on only part of a composite primary key. 3NF removes transitive dependency — when a non-key attribute depends on another non-key attribute. Example: Student(Roll, Name, Dept, DeptHOD) — DeptHOD depends on Dept, not on Roll directly. That\'s transitive. Split into Student(Roll, Name, Dept) and Dept(Dept, DeptHOD).',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    answeredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'dbt-2',
    studentEmail: 'student@ascendos.com',
    studentName: 'Rahul',
    mentorName: 'Prof. Sharma',
    subject: 'Data Structures',
    relatedTaskId: 'mt-1',
    title: 'BFS vs DFS — When to use which?',
    description: 'For the Graph Traversal assignment, when should I prefer BFS over DFS? Are there cases where one is strictly better than the other for finding shortest paths?',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'dbt-3',
    studentEmail: 'priya@ascendos.com',
    studentName: 'Priya',
    mentorName: 'Prof. Sharma',
    subject: 'Mathematics',
    title: 'Eigenvalue proof approach',
    description: 'For Q11 in Problem Set 7, should I use the characteristic polynomial approach or the direct definition to prove the eigenvalue property? The question is ambiguous.',
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

interface AppState {
  user: { name: string; email: string; role: UserRole } | null;
  theme: 'light' | 'dark';
  tasks: Task[];
  goals: Goal[];
  events: TimetableEvent[];
  mentorTasks: MentorTask[];
  doubts: Doubt[];
  productivityScore: number;
  streak: number;
  focusTimeTotal: number; // in minutes
  xp: number;
  login: (user: { name: string; email: string; role: UserRole }) => void;
  logout: () => void;
  toggleTheme: () => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addEvent: (event: TimetableEvent) => void;
  updateEvent: (id: string, updates: Partial<TimetableEvent>) => void;
  deleteEvent: (id: string) => void;
  addFocusTime: (minutes: number) => void;
  addMentorTask: (task: MentorTask) => void;
  updateMentorTask: (id: string, updates: Partial<MentorTask>) => void;
  deleteMentorTask: (id: string) => void;
  addDoubt: (doubt: Doubt) => void;
  answerDoubt: (id: string, response: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'dark',
      tasks: [
        { id: '1', title: 'Calculus Assignment 4', subject: 'Math', priority: 'High', deadline: new Date(Date.now() + 86400000 * 2).toISOString(), durationCompleted: 30, durationEstimated: 120, status: 'in-progress' },
        { id: '2', title: 'Read Chapter 5', subject: 'History', priority: 'Medium', deadline: new Date(Date.now() + 86400000).toISOString(), durationCompleted: 0, durationEstimated: 60, status: 'todo' },
        { id: '3', title: 'Physics Lab Report', subject: 'Physics', priority: 'High', deadline: new Date().toISOString(), durationCompleted: 90, durationEstimated: 90, status: 'done' },
      ],
      goals: [
        { id: '1', name: 'Study 30 Hours', category: 'Academic', target: 30, progress: 12, deadline: new Date(Date.now() + 86400000 * 7).toISOString() },
        { id: '2', name: 'Finish DSA Graph module', category: 'Skill', target: 100, progress: 45, deadline: new Date(Date.now() + 86400000 * 14).toISOString() },
      ],
      events: [
        { id: '1', title: 'Calculus Lecture', start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(), end: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(), backgroundColor: '#6366f1' },
      ],
      mentorTasks: seedMentorTasks,
      doubts: seedDoubts,
      productivityScore: 82,
      streak: 7,
      focusTimeTotal: 260,
      xp: 1450,
      
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),
      
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),
      
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id)
      })),
      
      addFocusTime: (minutes) => set((state) => ({
        focusTimeTotal: state.focusTimeTotal + minutes,
        xp: state.xp + (minutes * 2) // 2 XP per minute
      })),

      addMentorTask: (task) => set((state) => ({ mentorTasks: [...state.mentorTasks, task] })),
      updateMentorTask: (id, updates) => set((state) => ({
        mentorTasks: state.mentorTasks.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteMentorTask: (id) => set((state) => ({
        mentorTasks: state.mentorTasks.filter((t) => t.id !== id)
      })),

      addDoubt: (doubt) => set((state) => ({ doubts: [...state.doubts, doubt] })),
      answerDoubt: (id, response) => set((state) => ({
        doubts: state.doubts.map((d) => d.id === id ? { ...d, status: 'answered' as const, response, answeredAt: new Date().toISOString() } : d)
      })),
    }),
    {
      name: 'ascend-os-storage',
    }
  )
);
