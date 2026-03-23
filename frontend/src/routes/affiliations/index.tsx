import { createFileRoute } from '@tanstack/react-router'
import { AffiliationsDashboard } from '@/components/affiliations/AffiliationsDashboard'

export const Route = createFileRoute('/affiliations/')({
  component: AffiliationsDashboard,
})
