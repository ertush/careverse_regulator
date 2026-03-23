import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'
import { useAuthStore } from '@/stores/authStore'

const AffiliationsView = lazy(() => import('@/components/affiliations'))

function AffiliationsListComponent() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="hq-page-wrap">
      <AffiliationsView company={user?.company} />
    </div>
  )
}

export const Route = createFileRoute('/affiliations/list')({
  component: AffiliationsListComponent,
})
