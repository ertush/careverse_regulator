import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAffiliationStore } from '@/stores/affiliationStore'
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
  Users,
  ListFilter,
  FileText,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { getAffiliationDashboardStats, type AffiliationDashboardStats } from '@/api/affiliationApi'

export function AffiliationsDashboard() {
  const navigate = useNavigate()
  const { approveAffiliation, rejectAffiliation } = useAffiliationStore()
  const [dashboardData, setDashboardData] = useState<AffiliationDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Load dashboard stats from backend
  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const stats = await getAffiliationDashboardStats()
        setDashboardData(stats)
      } catch (error) {
        console.error('Failed to load affiliation dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  // Quick actions
  const quickActions = [
    {
      label: 'View All Affiliations',
      onClick: () => navigate({ to: '/affiliations/list' }),
      variant: 'default' as const,
      icon: Users,
    },
    {
      label: 'Review Pending',
      onClick: () =>
        navigate({ to: '/affiliations/list', search: { status: 'Pending' } }),
      variant: 'secondary' as const,
      icon: Clock,
    },
  ]

  const renderPendingItem = (item: AffiliationDashboardStats['pending_affiliations'][0]) => {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {item.professional_full_name}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {item.facility_name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Submitted {formatDistanceToNow(dayjs(item.start_date, 'YYYY-MM-DD').toDate(), { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.stopPropagation()
              approveAffiliation(item.id)
            }}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              rejectAffiliation(item.id)
            }}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate({ to: `/affiliations/${item.id}` })}
          >
            Details
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Affiliations Management</h1>
        <p className="text-muted-foreground mt-1">
          Overview of professional affiliations with health facilities
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Quick Actions" />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Review"
          value={dashboardData?.metrics.pending || 0}
          variant="warning"
          icon={Clock}
          onClick={() =>
            navigate({ to: '/affiliations/list', search: { status: 'Pending' } })
          }
        />
        <MetricCard
          title="Active Affiliations"
          value={dashboardData?.metrics.active || 0}
          variant="success"
          icon={CheckCircle}
          onClick={() =>
            navigate({ to: '/affiliations/list', search: { status: 'Active' } })
          }
        />
        <MetricCard
          title="Rejected This Month"
          value={dashboardData?.metrics.rejected || 0}
          variant="danger"
          icon={XCircle}
        />
        <MetricCard
          title="Total Affiliations"
          value={dashboardData?.metrics.total || 0}
          variant="neutral"
          icon={Users}
        />
      </div>

      {/* Trend Chart */}
      <TrendChart
        data={dashboardData?.trend_data || []}
        title="Affiliation Activity Trend"
        subtitle="New affiliations over last 6 months"
        height={240}
      />

      {/* Status Distribution and Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistribution
          data={dashboardData?.status_distribution || []}
          title="Status Distribution"
          onSegmentClick={(status) =>
            navigate({ to: '/affiliations/list', search: { status } })
          }
        />
        <PrioritySection
          title="Pending Affiliations Requiring Review"
          items={dashboardData?.pending_affiliations || []}
          renderItem={renderPendingItem}
          onViewAll={() =>
            navigate({ to: '/affiliations/list', search: { status: 'Pending' } })
          }
          emptyMessage="No pending affiliations to review"
        />
      </div>
    </div>
  )
}
