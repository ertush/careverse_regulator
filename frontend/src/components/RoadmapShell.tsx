import { List, Tag, Typography } from 'antd'
import { ProCard } from '@ant-design/pro-components'

const { Paragraph, Title } = Typography

interface RoadmapShellProps {
  title: string
  description: string
}

const currentTracks = [
  'Module route, access guardrails, and shell layout are ready.',
  'Form and queue components are wired for role-aware workflows.',
  'Design tokens and dark-mode surfaces are aligned to portal standards.',
]

const nextTracks = [
  'Connect live domain APIs for real queue and status data.',
  'Add filters, exports, and full audit-trail visibility.',
  'Complete reviewer actions and approval decision forms.',
]

export default function RoadmapShell({ title, description }: RoadmapShellProps) {
  return (
    <div className="roadmap-wrap">
      <ProCard className="glass-pro-card roadmap-hero-card" bordered={false}>
        <Tag className="roadmap-tag">Module status: In progress</Tag>
        <Title level={3} className="roadmap-hero-title">{title}</Title>
        <Paragraph type="secondary" className="roadmap-hero-description">{description}</Paragraph>
      </ProCard>

      <ProCard ghost gutter={[16, 16]} wrap>
        <ProCard colSpan={{ xs: 24, xl: 12 }} className="glass-pro-card roadmap-card" title="Ready now">
          <List
            size="small"
            dataSource={currentTracks}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </ProCard>

        <ProCard colSpan={{ xs: 24, xl: 12 }} className="glass-pro-card roadmap-card" title="Next up">
          <List
            size="small"
            dataSource={nextTracks}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </ProCard>
      </ProCard>
    </div>
  )
}
