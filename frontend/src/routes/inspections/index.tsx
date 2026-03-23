import { createFileRoute } from '@tanstack/react-router'
import { InspectionsDashboard } from '@/components/inspection/InspectionsDashboard'

export const Route = createFileRoute('/inspections/')({
  component: InspectionsDashboard,
})
