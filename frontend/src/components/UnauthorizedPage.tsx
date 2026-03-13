import { Button, Space, Typography } from 'antd'
import { ProCard } from '@ant-design/pro-components'
import { LockOutlined, StopOutlined, UserOutlined } from '@ant-design/icons'

const { Paragraph, Title, Text } = Typography

interface UnauthorizedPageProps {
  mode: 'guest' | 'forbidden' | 'tenant-misconfigured'
  userEmail?: string
  accessMessage?: string
  onLogin: () => void
  onContinueLimited?: () => void
  onLogout?: () => void
  onSwitchToDesk?: () => void
}

export default function UnauthorizedPage({
  mode,
  userEmail,
  accessMessage,
  onLogin,
  onContinueLimited,
  onLogout,
  onSwitchToDesk,
}: UnauthorizedPageProps) {
  const isGuest = mode === 'guest'
  const isTenantMisconfigured = mode === 'tenant-misconfigured'

  return (
    <div className="unauthorized-wrap">
      <ProCard className="unauthorized-card" bordered={false}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div className="unauthorized-icon">
            <StopOutlined />
          </div>
          <div className="unauthorized-side-kicker">Compliance 360</div>
          <Title level={3} style={{ margin: 0 }}>
            {isGuest ? 'Authentication required' : isTenantMisconfigured ? 'Company access misconfigured' : 'Access denied'}
          </Title>
          <Paragraph className="unauthorized-copy">
            {isGuest
              ? 'Sign in with an authorized company account to access approval queues and affiliation visibility.'
              : isTenantMisconfigured
                ? 'Your account must have exactly one Company User Permission to access this portal instance.'
                : 'Your current account does not have the role required for this workspace.'}
          </Paragraph>

          {!isGuest && (
            <>
              <div className="unauthorized-alert info">
                <UserOutlined />
                <div>
                  <strong>Signed in as</strong>
                  <span>{userEmail || 'Unknown user'}</span>
                </div>
              </div>
              <div className="unauthorized-alert warning">
                <LockOutlined />
                <div>
                  <strong>{isTenantMisconfigured ? 'Required Company setup' : 'Required access'}</strong>
                  <span>
                    {isTenantMisconfigured
                      ? (accessMessage || 'Ask your administrator to assign exactly one Company User Permission (Allow = Company).')
                      : 'Ask an administrator to assign the correct portal role.'}
                  </span>
                </div>
              </div>
            </>
          )}

          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            {isGuest && (
              <Button type="primary" block onClick={onLogin}>
                Sign in
              </Button>
            )}
            {!isGuest && !isTenantMisconfigured && onContinueLimited && (
              <Button type="primary" block onClick={onContinueLimited}>
                Continue with limited access
              </Button>
            )}
            {!isGuest && isTenantMisconfigured && (
              <Button type="primary" block onClick={onLogin}>
                Re-open sign in
              </Button>
            )}
            <Button block onClick={onSwitchToDesk}>
              Switch to Desk
            </Button>
            {!isGuest && (
              <Button block danger onClick={onLogout}>
                Log out
              </Button>
            )}
          </Space>
          <Text type="secondary">Support: support@careverse.africa</Text>
        </Space>
      </ProCard>
    </div>
  )
}
