import { createFileRoute } from '@tanstack/react-router'
import { LicensesDashboard } from '@/components/licensing/LicensesDashboard'

export const Route = createFileRoute('/license-management/')({
  component: LicensesDashboard,
})
