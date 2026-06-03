import { HashRouter, Routes, Route } from 'react-router'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BrandPage } from './pages/BrandPage'
import { DashboardLayout } from './pages/DashboardLayout'
import { AnalyticsDashboard } from './pages/AnalyticsDashboard'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { ChatPage } from './pages/ChatPage'
import { LearningGoalsPage } from './pages/LearningGoalsPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<ErrorBoundary><BrandPage /></ErrorBoundary>} />
            <Route path="/login" element={<ErrorBoundary><LoginPage /></ErrorBoundary>} />
            <Route path="/register" element={<ErrorBoundary><RegisterPage /></ErrorBoundary>} />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            >
              <Route index element={<ErrorBoundary><AnalyticsDashboard /></ErrorBoundary>} />
              <Route path="profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
              <Route path="ai-chat" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
              <Route path="goals" element={<ErrorBoundary><LearningGoalsPage /></ErrorBoundary>} />
              <Route path="courses" element={<ErrorBoundary><PlaceholderPage title="课程管理" /></ErrorBoundary>} />
              <Route path="notes" element={<ErrorBoundary><PlaceholderPage title="学习笔记" /></ErrorBoundary>} />
              <Route path="settings" element={<ErrorBoundary><PlaceholderPage title="设置" /></ErrorBoundary>} />
              <Route path="*" element={<ErrorBoundary><PlaceholderPage title="404 - 页面未找到" /></ErrorBoundary>} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">即将推出</p>
      </div>
    </div>
  )
}

export default App
