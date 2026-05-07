/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useEffect } from 'react';
import { useStore } from './store';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Focus from './pages/Focus';
import AIPlanner from './pages/AIPlanner';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Timetable from './pages/Timetable';

// Mentor Workspace
import StudentWorkspace from './pages/StudentWorkspace';
import StudentTaskDetail from './pages/StudentTaskDetail';
import StudentGrades from './pages/StudentGrades';
import MentorDashboard from './pages/MentorDashboard';
import MentorAssignTask from './pages/MentorAssignTask';
import MentorStudents from './pages/MentorStudents';
import StudentDoubts from './pages/StudentDoubts';
import MentorDoubts from './pages/MentorDoubts';

export default function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="focus" element={<Focus />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="goals" element={<Goals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="ai" element={<AIPlanner />} />
          <Route path="settings" element={<Settings />} />

          {/* Student Workspace */}
          <Route path="workspace" element={<StudentWorkspace />} />
          <Route path="workspace/grades" element={<StudentGrades />} />
          <Route path="workspace/doubts" element={<StudentDoubts />} />
          <Route path="workspace/:taskId" element={<StudentTaskDetail />} />

          {/* Mentor Pages */}
          <Route path="mentor-dashboard" element={<MentorDashboard />} />
          <Route path="mentor-assign" element={<MentorAssignTask />} />
          <Route path="mentor-students" element={<MentorStudents />} />
          <Route path="mentor-doubts" element={<MentorDoubts />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
