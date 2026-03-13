import { useEffect } from 'react'
import { Button, Empty, Progress, Typography } from 'antd'
import { ProCard, StatisticCard } from '@ant-design/pro-components'
import { ArrowDownOutlined, ArrowRightOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useDashboardStore } from '@/stores/dashboardStore'

const { Paragraph, Title } = Typography

interface DashboardViewProps {
  emptyState: boolean
  onNavigate: (route: string) => void
  company?: string | null
}

function trendIcon(trend: 'up' | 'down' | 'neutral') {
  if (trend === 'up') return <ArrowUpOutlined />
  if (trend === 'down') return <ArrowDownOutlined />
  return <ArrowRightOutlined />
}

function queueToneClass(tone: 'critical' | 'attention' | 'steady') {
  if (tone === 'critical') return 'critical'
  if (tone === 'attention') return 'attention'
  return 'steady'
}

function countyToneClass(level: 'Critical' | 'High' | 'Moderate' | 'Stable') {
  if (level === 'Critical') return 'critical'
  if (level === 'High') return 'high'
  if (level === 'Moderate') return 'moderate'
  return 'stable'
}

export default function DashboardView({ emptyState, onNavigate, company }: DashboardViewProps) {
  const { priorityQueues, recentActivity, companyBoards, countyRiskItems, applyMockForCompany } = useDashboardStore()

  useEffect(() => {
    applyMockForCompany(company)
  }, [applyMockForCompany, company])

  const visibleQueues = priorityQueues.slice(0, 4)
  const visibleActivity = recentActivity.slice(0, 4)
  const activeBoard = companyBoards[0]
  const visibleCountyRisk = countyRiskItems.slice(0, 3)

  const tenantLabel = company || activeBoard?.unitName || 'Company not configured'
  const companyMetrics = [
    {
      id: 'renewals',
      title: 'Renewals pending',
      value: activeBoard?.pendingRenewals || '--',
      delta: `${visibleQueues.length} queue items`,
      trend: 'up' as const,
    },
    {
      id: 'cases',
      title: 'Active cases',
      value: activeBoard?.activeCases || '--',
      delta: 'Enforcement and discipline',
      trend: 'neutral' as const,
    },
    {
      id: 'sla',
      title: 'SLA compliance',
      value: activeBoard ? `${activeBoard.slaCompliance}%` : '--',
      delta: activeBoard ? `${activeBoard.inspectionBacklog} inspection backlog` : 'No board data',
      trend: activeBoard && activeBoard.slaCompliance < 75 ? 'down' as const : 'up' as const,
    },
  ]

  return (
    <div className="dashboard-shell dashboard-shell--nextgen">
      <ProCard className="glass-pro-card dashboard-command-card" bordered={false}>
        <div className="dashboard-command-head">
          <div className="dashboard-command-copy">
            <span className="dashboard-command-chip">Active tenant</span>
            <Title level={3} className="dashboard-command-title">{tenantLabel}</Title>
            <Paragraph className="dashboard-command-subtitle">
              Licensing, inspection, and enforcement decisions in one operator view.
            </Paragraph>
          </div>
          <div className="dashboard-command-actions">
            <Button type="primary" onClick={() => onNavigate('license-management')}>
              Open licensing queue
            </Button>
            <Button onClick={() => onNavigate('affiliations')}>
              Review affiliations
            </Button>
          </div>
        </div>

        <div className="dashboard-command-stats">
          <button
            type="button"
            className="dashboard-command-stat"
            onClick={() => onNavigate(activeBoard?.route || 'license-management')}
          >
            <span>Pending renewals</span>
            <strong>{activeBoard?.pendingRenewals || '--'}</strong>
            <em>{activeBoard?.unitName || 'Active company unit'}</em>
          </button>
          <button type="button" className="dashboard-command-stat" onClick={() => onNavigate('users-roles')}>
            <span>Active cases</span>
            <strong>{activeBoard?.activeCases || '--'}</strong>
            <em>Enforcement and disciplinary</em>
          </button>
          <button type="button" className="dashboard-command-stat" onClick={() => onNavigate('dashboard')}>
            <span>SLA compliance</span>
            <strong>{activeBoard ? `${activeBoard.slaCompliance}%` : '--'}</strong>
            <em>Operational throughput</em>
          </button>
        </div>
      </ProCard>

      <ProCard gutter={[12, 12]} wrap ghost className="dashboard-metric-grid">
        {companyMetrics.map((metric) => (
          <ProCard key={metric.id} colSpan={{ xs: 24, sm: 8 }} className="glass-pro-card kpi-card-shell dashboard-metric-shell">
            <StatisticCard
              className="kpi-card"
              statistic={{
                title: metric.title,
                value: metric.value,
                description: (
                  <span className={`metric-delta ${metric.trend}`}>
                    {trendIcon(metric.trend)} {metric.delta}
                  </span>
                ),
              }}
            />
          </ProCard>
        ))}
      </ProCard>

      {emptyState ? (
        <ProCard className="glass-pro-card empty-pro-card">
          <Empty description="No dashboard data connected yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </ProCard>
      ) : (
        <>
          <ProCard ghost gutter={[12, 12]} wrap className="dashboard-primary-grid">
            <ProCard colSpan={{ xs: 24, xl: 14 }} className="glass-pro-card dashboard-panel" title="Priority queue">
              <div className="dashboard-list">
                {visibleQueues.length > 0 ? (
                  visibleQueues.map((queue) => (
                    <button
                      key={queue.id}
                      type="button"
                      className={`dashboard-list-item ${queueToneClass(queue.tone)}`}
                      onClick={() => onNavigate(queue.route)}
                    >
                      <div>
                        <strong>{queue.title}</strong>
                        <span>{queue.detail}</span>
                      </div>
                      <em>{queue.value}</em>
                    </button>
                  ))
                ) : (
                  <div className="dashboard-list-item steady">
                    <div>
                      <strong>No queue items in this company context</strong>
                      <span>Once applications are loaded for this company, queue items will appear here.</span>
                    </div>
                  </div>
                )}
              </div>
            </ProCard>

            <ProCard colSpan={{ xs: 24, xl: 10 }} className="glass-pro-card dashboard-panel" title="County risk watch">
              <div className="dashboard-list">
                {visibleCountyRisk.length > 0 ? (
                  visibleCountyRisk.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`county-line ${countyToneClass(item.riskLevel)}`}
                      onClick={() => onNavigate(item.route)}
                    >
                      <div className="county-line-head">
                        <strong>{item.county}</strong>
                        <em>{item.riskLevel}</em>
                      </div>
                      <span>{item.openInvestigations}</span>
                      <Progress percent={item.complianceRate} showInfo={false} size="small" />
                    </button>
                  ))
                ) : (
                  <div className="county-line stable">
                    <div className="county-line-head">
                      <strong>No county risk items for this company</strong>
                    </div>
                    <span>Risk watch will populate once company data is linked.</span>
                  </div>
                )}
              </div>
            </ProCard>
          </ProCard>

          <ProCard className="glass-pro-card dashboard-panel" title="Recent activity">
            <div className="dashboard-list">
              {visibleActivity.length > 0 ? (
                visibleActivity.map((item) => (
                  <button key={item.id} type="button" className="dashboard-list-item" onClick={() => onNavigate(item.route)}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <em>{item.time}</em>
                  </button>
                ))
              ) : (
                <div className="dashboard-list-item steady">
                  <div>
                    <strong>No recent activity in this company context</strong>
                    <span>Operational events will appear here once this company starts processing cases.</span>
                  </div>
                </div>
              )}
            </div>
          </ProCard>
        </>
      )}
    </div>
  )
}
