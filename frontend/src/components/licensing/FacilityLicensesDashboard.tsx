import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  MetricCard,
  StatusDistribution,
  PrioritySection,
  QuickActions,
  TrendChart,
} from '@/components/dashboard'
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  List,
} from 'lucide-react'
import { differenceInDays } from 'date-fns'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { getLicenseDashboardStats, type LicenseDashboardStats } from '@/api/licensingApi'

export function FacilityLicensesDashboard() {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<LicenseDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Load dashboard stats from backend
  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const stats = await getLicenseDashboardStats()
        setDashboardData(stats)
      } catch (error) {
        console.error('Failed to load license dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  // Quick actions
  const quickActions = [
    {
      label: 'View All Licenses',
      onClick: () => navigate({ to: '/license-management/licenses' }),
      variant: 'default' as const,
      icon: List,
    },
    {
      label: 'Review Expiring',
      onClick: () =>
        navigate({ to: '/license-management/licenses' }),
      variant: 'secondary' as const,
      icon: Clock,
    },
  ]

  const renderExpiringItem = (item: LicenseDashboardStats['expiring_licenses'][0]) => {
    const daysUntilExpiry = differenceInDays(dayjs(item.date_of_expiry, 'YYYY-MM-DD').toDate(), new Date())

    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {item.owner}
          </p>
          <p className="text-sm text-gray-600 truncate">
            License #{item.license_number} • {item.facility_type}
          </p>
          <p className="text-xs text-red-600 font-medium mt-1">
            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => navigate({ to: `/license-management/${item.license_number}` })}
          >
            View Details
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Quick Actions" />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Expiring Soon (30 days)"
          value={dashboardData?.metrics.expiring_soon || 0}
          variant="warning"
          icon={AlertTriangle}
          onClick={() =>
            navigate({ to: '/license-management/licenses', search: { status: 'Expiring' } })
          }
        />
        <MetricCard
          title="Active Licenses"
          value={dashboardData?.metrics.active || 0}
          variant="success"
          icon={CheckCircle}
          onClick={() =>
            navigate({ to: '/license-management/licenses', search: { status: 'Active' } })
          }
        />
        <MetricCard
          title="Suspended/Denied"
          value={dashboardData?.metrics.suspended_denied || 0}
          variant="danger"
          icon={XCircle}
        />
        <MetricCard
          title="Pending Renewals"
          value={dashboardData?.metrics.pending_renewals || 0}
          variant="info"
          icon={Clock}
        />
      </div>

      {/* Status Distribution and Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistribution
          data={dashboardData?.status_distribution || []}
          title="License Status Distribution"
          type="bar"
          onSegmentClick={(status) =>
            navigate({ to: '/license-management/licenses', search: { status } })
          }
        />
        <PrioritySection
          title="Licenses Expiring Soon"
          items={dashboardData?.expiring_licenses || []}
          renderItem={renderExpiringItem}
          onViewAll={() =>
            navigate({ to: '/license-management/licenses', search: { status: 'Expiring' } })
          }
          emptyMessage="No licenses expiring in the next 30 days"
        />
      </div>
    </div>
  )
}
