import { Outlet } from 'react-router'
import { Sidebar } from '../components/Sidebar'

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
