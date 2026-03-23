import { useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLicensingStore } from '@/stores/licensingStore'
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
  AlertTriangle,
  FileText,
  List,
} from 'lucide-react'
import { differenceInDays, formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import type { License } from '@/types/license'

export function FacilityLicensesDashboard() {
  const navigate = useNavigate()
  const { licenses, licensesLoading, fetchLicenses, updateLicense } = useLicensingStore()

  // Load licenses for dashboard
  useEffect(() => {
    fetchLicenses(1, {})
  }, [fetchLicenses])

  // Compute metrics
  const metrics = useMemo(() => {
    const now = new Date()

    const expiringSoon = licenses.filter((l) => {
      const daysUntilExpiry = differenceInDays(new Date(l.dateOfExpiry), now)
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30 && l.status === 'Active'
    }).length

    const active = licenses.filter((l) => l.status === 'Active').length
    const suspended = licenses.filter(
      (l) => l.status === 'Suspended' || l.status === 'Denied'
    ).length
    const pendingRenewals = licenses.filter(
      (l) => l.status === 'In Review' || l.status === 'Renewal Reviewed'
    ).length
    const total = licenses.length

    return { expiringSoon, active, suspended, pendingRenewals, total }
  }, [licenses])

  // Status distribution data
  const statusDistribution = useMemo(() => {
    const statusCounts = licenses.reduce(
      (acc, license) => {
        const status = license.status
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const statusColors: Record<string, string> = {
      Active: '#10b981',
      Expired: '#6b7280',
      Suspended: '#f59e0b',
      Denied: '#ef4444',
      Pending: '#3b82f6',
      'In Review': '#8b5cf6',
      'Renewal Reviewed': '#06b6d4',
      Approved: '#10b981',
      'Info Requested': '#f59e0b',
    }

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6b7280',
    }))
  }, [licenses])

  // Expiring licenses for priority section
  const expiringLicenses = useMemo(() => {
    const now = new Date()
    return licenses
      .filter((l) => {
        const daysUntilExpiry = differenceInDays(new Date(l.dateOfExpiry), now)
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30 && l.status === 'Active'
      })
      .sort((a, b) => new Date(a.dateOfExpiry).getTime() - new Date(b.dateOfExpiry).getTime())
      .slice(0, 5)
  }, [licenses])

  // Recent activity
  const recentActivity = useMemo(() => {
    return licenses
      .filter((l) => l.status !== 'Pending')
      .slice(0, 5)
      .map((license) => ({
        id: license.licenseNumber,
        type: license.status.toLowerCase().replace(' ', '_'),
        description: `License ${license.licenseNumber} for ${license.owner} - ${license.status}`,
        timestamp: license.dateOfIssuance,
        status: license.status,
      }))
  }, [licenses])

  // Quick actions
  const quickActions = useMemo(
    () => [
      {
        label: 'View All Licenses',
        onClick: () => navigate({ to: '/license-management/licenses' }),
        variant: 'default' as const,
        icon: List,
      },
      {
        label: 'Review Expiring',
        onClick: () =>
          navigate({ to: '/license-management/licenses', search: { status: 'Expiring' } }),
        variant: 'secondary' as const,
        icon: Clock,
      },
      {
        label: 'Generate Report',
        onClick: () => {
          console.log('Generate report')
        },
        variant: 'outline' as const,
        icon: FileText,
      },
    ],
    [navigate]
  )

  const renderExpiringItem = (license: License) => {
    const daysUntilExpiry = differenceInDays(new Date(license.dateOfExpiry), new Date())

    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {license.owner}
          </p>
          <p className="text-sm text-gray-600 truncate">
            License #{license.licenseNumber} • {license.facilityType}
          </p>
          <p className="text-xs text-red-600 font-medium mt-1">
            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => navigate({ to: `/license-management/${license.licenseNumber}` })}
          >
            View Details
          </Button>
        </div>
      </div>
    )
  }

  if (licensesLoading && licenses.length === 0) {
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
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Expiring Soon (30 days)"
          value={metrics.expiringSoon}
          variant="warning"
          icon={AlertTriangle}
          onClick={() =>
            navigate({ to: '/license-management/licenses', search: { status: 'Expiring' } })
          }
        />
        <MetricCard
          title="Active Licenses"
          value={metrics.active}
          variant="success"
          icon={CheckCircle}
          onClick={() =>
            navigate({ to: '/license-management/licenses', search: { status: 'Active' } })
          }
        />
        <MetricCard
          title="Suspended/Denied"
          value={metrics.suspended}
          variant="danger"
          icon={XCircle}
        />
        <MetricCard
          title="Pending Renewals"
          value={metrics.pendingRenewals}
          variant="info"
          icon={Clock}
        />
      </div>

      {/* Status Distribution and Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistribution
          data={statusDistribution}
          title="License Status Distribution"
          type="bar"
          onSegmentClick={(status) =>
            navigate({ to: '/license-management/licenses', search: { status } })
          }
        />
        <PrioritySection
          title="Licenses Expiring Soon"
          items={expiringLicenses}
          renderItem={renderExpiringItem}
          onViewAll={() =>
            navigate({ to: '/license-management/licenses', search: { status: 'Expiring' } })
          }
          emptyMessage="No licenses expiring in the next 30 days"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} title="Recent License Actions" />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Quick Actions" />
    </div>
  )
}
