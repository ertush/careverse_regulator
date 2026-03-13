import { Button, Space, Tag, Typography } from 'antd'
import { ProCard } from '@ant-design/pro-components'
import { DesktopOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'

const { Paragraph, Title, Text } = Typography

interface ProfileViewProps {
  userName: string
  userEmail: string
  userRole: string
  onOpenDesk: () => void
  onLogout: () => void
}

export default function ProfileView({ userName, userEmail, userRole, onOpenDesk, onLogout }: ProfileViewProps) {
  return (
    <div className="profile-view-wrap">
      <ProCard className="glass-pro-card profile-identity-card" bordered={false}>
        <Space direction="vertical" size={14} style={{ width: '100%' }}>
          <Tag icon={<UserOutlined />} className="profile-pill" color="blue">
            Signed in operator
          </Tag>
          <Title level={3} style={{ margin: 0 }}>{userName}</Title>
          <Paragraph className="profile-copy">Use this account profile to verify your current role and session context.</Paragraph>
          <div className="profile-meta-grid">
            <div>
              <Text type="secondary">Email</Text>
              <strong>{userEmail}</strong>
            </div>
            <div>
              <Text type="secondary">Role</Text>
              <strong>{userRole}</strong>
            </div>
          </div>
          <div className="profile-actions">
            <Button icon={<DesktopOutlined />} onClick={onOpenDesk}>
              Open Desk
            </Button>
            <Button icon={<LogoutOutlined />} danger onClick={onLogout}>
              Logout
            </Button>
          </div>
        </Space>
      </ProCard>
    </div>
  )
}
