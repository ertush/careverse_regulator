import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'
import AppLayout from '@/components/AppLayout'
import { useAuthStore } from '@/stores/authStore'

const MainDashboard = lazy(() => import('@/components/MainDashboard'))

function DashboardComponent() {
  const navigate = Route.useNavigate()
  const user = useAuthStore((state) => state.user)

  const handleNavigate = (route: string) => {
    navigate({ to: `/${route}` as any })
  }

  const handleLogout = () => {
    window.location.href = '/logout?redirect-to=/'
  }

  const handleSwitchToDesk = () => {
    window.location.href = '/app'
  }

  return (
    <AppLayout
      currentRoute="dashboard"
      pageTitle="Dashboard"
      pageSubtitle="Compliance signals and priority actions."
      onNavigate={handleNavigate}
      onOpenNotifications={() => handleNavigate('notifications-center')}
      onLogout={handleLogout}
      onSwitchToDesk={handleSwitchToDesk}
      user={user}
    >
      <MainDashboard onNavigate={handleNavigate} company={user?.company} />
    </AppLayout>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})
