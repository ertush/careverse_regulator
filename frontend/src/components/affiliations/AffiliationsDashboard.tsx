import { useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAffiliationStore } from '@/stores/affiliationStore'
import {
  MetricCard,
  StatusDistribution,
  PrioritySection,
  RecentActivity,
  QuickActions,
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
import { Button } from '@/components/ui/button'
import type { Affiliation } from '@/types/affiliation'

export function AffiliationsDashboard() {
  const navigate = useNavigate()
  const { affiliations, loading, fetchAffiliations, approveAffiliation, rejectAffiliation } =
    useAffiliationStore()

  // Load affiliations for dashboard (limited to first 100 for metrics)
  useEffect(() => {
    fetchAffiliations(1, {})
  }, [fetchAffiliations])

  // Compute metrics
  const metrics = useMemo(() => {
    const pending = affiliations.filter(
      (a) => a.affiliationStatus === 'Pending'
    ).length
    const active = affiliations.filter(
      (a) => a.affiliationStatus === 'Active'
    ).length
    const rejected = affiliations.filter(
      (a) => a.affiliationStatus === 'Rejected'
    ).length
    const total = affiliations.length

    return { pending, active, rejected, total }
  }, [affiliations])

  // Status distribution data
  const statusDistribution = useMemo(() => {
    const statusCounts = affiliations.reduce(
      (acc, affiliation) => {
        const status = affiliation.affiliationStatus
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const statusColors: Record<string, string> = {
      Pending: '#f59e0b',
      Active: '#10b981',
      Rejected: '#ef4444',
      Inactive: '#6b7280',
    }

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6b7280',
    }))
  }, [affiliations])

  // Pending affiliations for priority section
  const pendingAffiliations = useMemo(
    () => affiliations.filter((a) => a.affiliationStatus === 'Pending').slice(0, 5),
    [affiliations]
  )

  // Recent activity (most recent first)
  const recentActivity = useMemo(() => {
    return affiliations
      .filter((a) => a.affiliationStatus !== 'Pending')
      .slice(0, 5)
      .map((affiliation) => ({
        id: affiliation.id,
        type: affiliation.affiliationStatus.toLowerCase(),
        description: `${affiliation.healthProfessional.fullName} affiliation with ${affiliation.healthFacility.facilityName} ${affiliation.affiliationStatus.toLowerCase()}`,
        timestamp: affiliation.startDate,
        status: affiliation.affiliationStatus,
      }))
  }, [affiliations])

  // Quick actions
  const quickActions = useMemo(
    () => [
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
      {
        label: 'Generate Report',
        onClick: () => {
          // TODO: Implement report generation
          console.log('Generate report')
        },
        variant: 'outline' as const,
        icon: FileText,
      },
    ],
    [navigate]
  )

  const renderPendingItem = (affiliation: Affiliation) => {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {affiliation.healthProfessional.fullName}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {affiliation.healthFacility.facilityName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Submitted {formatDistanceToNow(new Date(affiliation.startDate), { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.stopPropagation()
              approveAffiliation(affiliation.id)
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
              rejectAffiliation(affiliation.id)
            }}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate({ to: `/affiliations/${affiliation.id}` })}
          >
            Details
          </Button>
        </div>
      </div>
    )
  }

  if (loading && affiliations.length === 0) {
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Review"
          value={metrics.pending}
          variant="warning"
          icon={Clock}
          onClick={() =>
            navigate({ to: '/affiliations/list', search: { status: 'Pending' } })
          }
        />
        <MetricCard
          title="Active Affiliations"
          value={metrics.active}
          variant="success"
          icon={CheckCircle}
          onClick={() =>
            navigate({ to: '/affiliations/list', search: { status: 'Active' } })
          }
        />
        <MetricCard
          title="Rejected This Month"
          value={metrics.rejected}
          variant="danger"
          icon={XCircle}
        />
        <MetricCard
          title="Total Affiliations"
          value={metrics.total}
          variant="neutral"
          icon={Users}
        />
      </div>

      {/* Status Distribution and Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistribution
          data={statusDistribution}
          title="Status Distribution"
          onSegmentClick={(status) =>
            navigate({ to: '/affiliations/list', search: { status } })
          }
        />
        <PrioritySection
          title="Pending Affiliations Requiring Review"
          items={pendingAffiliations}
          renderItem={renderPendingItem}
          onViewAll={() =>
            navigate({ to: '/affiliations/list', search: { status: 'Pending' } })
          }
          emptyMessage="No pending affiliations to review"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} title="Recent Affiliation Actions" />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Quick Actions" />
    </div>
  )
}
