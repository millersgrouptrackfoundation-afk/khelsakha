import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import Teachers from './pages/Teachers'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import SkillScores from './pages/SkillScores'
import LessonPlans from './pages/LessonPlans'
import CBSEReports from './pages/CBSEReports'
import CoachEvaluations from './pages/CoachEvaluations'
import Events from './pages/Events'
import Equipment from './pages/Equipment'
import AImentor from './pages/AImentor'
import Settings from './pages/Settings'
import SessionCoach from './pages/SessionCoach'
import PlanningAdmin from './pages/PlanningAdmin'
import CurriculumLibrary from './pages/CurriculumLibrary'
import StudentTrackerPro from './pages/StudentTrackerPro'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="classes" element={<Classes />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="skill-scores" element={<SkillScores />} />
            <Route path="lesson-plans" element={<LessonPlans />} />
            <Route path="cbsereports" element={<CBSEReports />} />
            <Route path="coach-evaluations" element={<CoachEvaluations />} />
            <Route path="events" element={<Events />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="aimentor" element={<AImentor />} />
            <Route path="session-coach" element={<SessionCoach />} />
            <Route path="planning-admin" element={<PlanningAdmin />} />
            <Route path="curriculum" element={<CurriculumLibrary />} />
            <Route path="student-tracker" element={<StudentTrackerPro />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
