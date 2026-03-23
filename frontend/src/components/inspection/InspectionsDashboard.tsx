import { useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useInspectionStore } from '@/stores/inspectionStore'
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
  AlertTriangle,
  FileText,
  List,
  Calendar,
} from 'lucide-react'
import { differenceInDays, formatDistanceToNow, isAfter, isBefore } from 'date-fns'
import { Button } from '@/components/ui/button'
import type { Inspection } from '@/types/inspection'

export function InspectionsDashboard() {
  const navigate = useNavigate()
  const { inspections, loading, fetchInspections } = useInspectionStore()

  // Load inspections for dashboard
  useEffect(() => {
    fetchInspections(1, {})
  }, [fetchInspections])

  // Compute metrics
  const metrics = useMemo(() => {
    const now = new Date()

    // Inspections due within next 7 days
    const dueSoon = inspections.filter((i) => {
      const inspectionDate = new Date(i.date)
      const daysUntilDue = differenceInDays(inspectionDate, now)
      return i.status === 'Pending' && daysUntilDue >= 0 && daysUntilDue <= 7
    }).length

    // Completed inspections
    const completed = inspections.filter((i) => i.status === 'Completed').length

    // In progress (could be "Pending" as status)
    const inProgress = inspections.filter((i) => i.status === 'Pending').length

    // Overdue inspections (past scheduled date and still pending)
    const overdue = inspections.filter((i) => {
      const inspectionDate = new Date(i.date)
      return i.status === 'Pending' && isBefore(inspectionDate, now)
    }).length

    const total = inspections.length

    return { dueSoon, completed, inProgress, overdue, total }
  }, [inspections])

  // Status distribution data
  const statusDistribution = useMemo(() => {
    const statusCounts = inspections.reduce(
      (acc, inspection) => {
        const status = inspection.status
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const statusColors: Record<string, string> = {
      Completed: '#10b981',
      Pending: '#f59e0b',
      'Non Compliant': '#ef4444',
    }

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6b7280',
    }))
  }, [inspections])

  // Upcoming inspections for priority section
  const upcomingInspections = useMemo(() => {
    const now = new Date()
    return inspections
      .filter((i) => {
        const inspectionDate = new Date(i.date)
        return i.status === 'Pending' && !isBefore(inspectionDate, now)
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }, [inspections])

  // Recent activity (completed inspections)
  const recentActivity = useMemo(() => {
    return inspections
      .filter((i) => i.status === 'Completed')
      .slice(0, 5)
      .map((inspection) => ({
        id: inspection.id,
        type: 'completed',
        description: `Inspection at ${inspection.facilityName} completed${inspection.findingCount ? ` with ${inspection.findingCount} finding(s)` : ''}`,
        timestamp: inspection.inspectedDate || inspection.date,
        status: inspection.status,
      }))
  }, [inspections])

  // Quick actions
  const quickActions = useMemo(
    () => [
      {
        label: 'View All Inspections',
        onClick: () => navigate({ to: '/inspections/list' }),
        variant: 'default' as const,
        icon: List,
      },
      {
        label: 'Review Overdue',
        onClick: () =>
          navigate({ to: '/inspections/list', search: { status: 'Overdue' } }),
        variant: 'secondary' as const,
        icon: AlertTriangle,
      },
      {
        label: 'Schedule Inspection',
        onClick: () => navigate({ to: '/inspections/list' }),
        variant: 'outline' as const,
        icon: Calendar,
      },
    ],
    [navigate]
  )

  const renderUpcomingItem = (inspection: Inspection) => {
    const daysUntilDue = differenceInDays(new Date(inspection.date), new Date())

    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {inspection.facilityName}
          </p>
          <p className="text-sm text-gray-600 truncate">
            Inspector: {inspection.inspector}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {daysUntilDue === 0
              ? 'Due today'
              : daysUntilDue === 1
                ? 'Due tomorrow'
                : `Due in ${daysUntilDue} days`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => navigate({ to: '/inspections/list' })}
          >
            View Details
          </Button>
        </div>
      </div>
    )
  }

  if (loading && inspections.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-900">Inspections Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor facility inspections and track compliance status
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Due This Week"
          value={metrics.dueSoon}
          variant="warning"
          icon={Clock}
          onClick={() =>
            navigate({ to: '/inspections/list', search: { status: 'Due Soon' } })
          }
        />
        <MetricCard
          title="Completed This Month"
          value={metrics.completed}
          variant="success"
          icon={CheckCircle}
          onClick={() =>
            navigate({ to: '/inspections/list', search: { status: 'Completed' } })
          }
        />
        <MetricCard
          title="In Progress"
          value={metrics.inProgress}
          variant="info"
          icon={FileText}
          onClick={() =>
            navigate({ to: '/inspections/list', search: { status: 'Pending' } })
          }
        />
        <MetricCard
          title="Overdue"
          value={metrics.overdue}
          variant="danger"
          icon={AlertTriangle}
          onClick={() =>
            navigate({ to: '/inspections/list', search: { status: 'Overdue' } })
          }
        />
      </div>

      {/* Status Distribution and Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistribution
          data={statusDistribution}
          title="Inspection Status Distribution"
          onSegmentClick={(status) =>
            navigate({ to: '/inspections/list', search: { status } })
          }
        />
        <PrioritySection
          title="Upcoming Inspections"
          items={upcomingInspections}
          renderItem={renderUpcomingItem}
          onViewAll={() =>
            navigate({ to: '/inspections/list', search: { status: 'Pending' } })
          }
          emptyMessage="No upcoming inspections scheduled"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} title="Recent Inspection Completions" />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} title="Quick Actions" />
    </div>
  )
}
