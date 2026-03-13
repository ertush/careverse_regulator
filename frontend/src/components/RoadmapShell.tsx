import { List, Tag, Typography } from 'antd'
import { ProCard } from '@ant-design/pro-components'

const { Paragraph, Title } = Typography

interface RoadmapShellProps {
  title: string
  description: string
}

const currentTracks = [
  'Information architecture is route-complete and ready for module integration.',
  'Role-aware actions and policy checks are staged for backend binding.',
  'Admin-grade visual hierarchy and glassmorphic shell are production-ready.',
]

const nextTracks = [
  'Connect domain APIs to replace placeholder metrics with live compliance data.',
  'Add module-level filters, exports, and audit trails.',
  'Finalize reviewer workflows and approval decision forms.',
]

export default function RoadmapShell({ title, description }: RoadmapShellProps) {
  return (
    <div className="roadmap-wrap">
      <ProCard className="glass-pro-card roadmap-hero-card" bordered={false}>
        <Tag className="roadmap-tag" color="processing">Module status: In progress</Tag>
        <Title level={3} className="roadmap-hero-title">{title}</Title>
        <Paragraph type="secondary" className="roadmap-hero-description">{description}</Paragraph>
      </ProCard>

      <ProCard ghost gutter={[16, 16]} wrap>
        <ProCard colSpan={{ xs: 24, xl: 12 }} className="glass-pro-card roadmap-card" title="Current delivery tracks">
          <List
            size="small"
            dataSource={currentTracks}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </ProCard>

        <ProCard colSpan={{ xs: 24, xl: 12 }} className="glass-pro-card roadmap-card" title="Next implementation tracks">
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
