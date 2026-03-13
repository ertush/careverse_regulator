import { Layout, Typography, Button, Card, Space, theme, Row, Col } from 'antd'
import {
  LockOutlined,
  LoginOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  BulbOutlined,
  BulbFilled,
  DesktopOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useResponsive } from '@/hooks/useResponsive'
import { useThemeStore } from '@/stores/themeStore'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

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
  const { token } = theme.useToken()
  const { isMobile } = useResponsive()
  const colorMode = useThemeStore((state) => state.mode)
  const toggleMode = useThemeStore((state) => state.toggleMode)
  const isDarkMode = colorMode === 'dark'

  const isGuest = mode === 'guest'
  const isTenantMisconfigured = mode === 'tenant-misconfigured'
  const brandColor = token.colorPrimary
  const pageBackground = isDarkMode
    ? 'linear-gradient(135deg, #08111f 0%, #0f1a2a 100%)'
    : 'linear-gradient(135deg, #edf3f7 0%, #e7eef5 100%)'
  const blobPrimary = isDarkMode ? 'rgba(20, 184, 166, 0.16)' : 'rgba(15, 118, 110, 0.14)'
  const blobSecondary = isDarkMode ? 'rgba(22, 163, 74, 0.14)' : 'rgba(22, 163, 74, 0.12)'
  const panelBackground = isDarkMode ? 'rgba(15, 23, 42, 0.86)' : 'rgba(255, 255, 255, 0.9)'
  const panelBorder = isDarkMode ? '1px solid rgba(71, 85, 105, 0.62)' : '1px solid rgba(216, 225, 235, 0.86)'
  const infoBackground = isDarkMode ? 'rgba(15, 23, 42, 0.78)' : '#f5f8fc'
  const infoBorder = isDarkMode ? '1px solid rgba(71, 85, 105, 0.62)' : '1px solid #e0e8f5'
  const primaryButtonGradient = `linear-gradient(135deg, ${brandColor} 0%, #16a34a 100%)`
  const primaryButtonShadow = isDarkMode ? '0 8px 24px rgba(15, 118, 110, 0.34)' : '0 8px 24px rgba(15, 118, 110, 0.26)'

  const pageTitle = isGuest ? 'Sign In Required' : isTenantMisconfigured ? 'Company Setup Required' : 'Access Restricted'
  const pageDescription = isGuest
    ? 'Welcome to Compliance 360. Sign in with your authorized credentials to continue.'
    : isTenantMisconfigured
      ? 'Your account needs exactly one assigned company before this portal can open.'
      : 'Your current role does not include this workspace.'
  const guidance = isTenantMisconfigured
    ? accessMessage || 'Ask your administrator to assign one Company User Permission to this account.'
    : isGuest
      ? 'Use your work credentials to continue.'
      : accessMessage || 'Ask your administrator to assign the correct portal role.'

  const features = [
    {
      icon: <BarChartOutlined style={{ fontSize: '20px', color: brandColor }} />,
      title: 'Executive Monitoring',
      description: 'Real-time oversight of regulator operations, queues, and compliance workload.',
    },
    {
      icon: <FileSearchOutlined style={{ fontSize: '20px', color: brandColor }} />,
      title: 'Centralized Approvals',
      description: 'Streamlined workflow for processing licensing decisions, renewals, and sanctions.',
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '20px', color: brandColor }} />,
      title: 'Unified Registry',
      description: 'Single source of truth for health workers, facilities, and lifecycle records.',
    },
  ]

  const handlePrimaryAction = () => {
    if (isGuest || isTenantMisconfigured || !onContinueLimited) {
      onLogin()
      return
    }

    onContinueLimited()
  }

  const primaryLabel = isGuest
    ? 'Sign In to Dashboard'
    : isTenantMisconfigured
      ? 'Re-open Sign In'
      : onContinueLimited
        ? 'Continue (Limited Access)'
        : 'Sign In to Dashboard'

  return (
    <Layout
      className="unauthorized-layout"
      style={{
        minHeight: '100vh',
        background: pageBackground,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glassmorphic decorative shapes */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: blobPrimary,
          filter: 'blur(80px)',
          top: '-100px',
          left: '-100px',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: blobSecondary,
          filter: 'blur(80px)',
          bottom: '-50px',
          right: '-50px',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Header
        style={{
          backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isDarkMode ? 'rgba(15, 118, 110, 0.2)' : 'rgba(15, 118, 110, 0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isDarkMode ? '1px solid rgba(20, 184, 166, 0.35)' : '1px solid rgba(15, 118, 110, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: brandColor,
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              C
            </div>
            <Title level={4} style={{ margin: 0, fontWeight: 600, letterSpacing: '-0.01em' }}>
              Compliance 360
            </Title>
          </div>

          <Button
            type="text"
            icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
            onClick={toggleMode}
            style={{ borderRadius: '8px' }}
          >
            {isDarkMode ? 'Light' : 'Dark'} Mode
          </Button>
        </div>
      </Header>

      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 20px',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '1100px', width: '100%' }}>
          <Row gutter={[40, 28]} align="middle">
            <Col xs={24} lg={11}>
              <Card
                style={{
                  background: panelBackground,
                  borderRadius: '12px',
                  border: panelBorder,
                  boxShadow: isDarkMode ? '0 2px 12px rgba(2, 6, 23, 0.42)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                }}
                bodyStyle={{ padding: isMobile ? '24px 20px' : '40px 36px' }}
              >
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: isDarkMode ? 'rgba(15, 118, 110, 0.2)' : 'rgba(15, 118, 110, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: brandColor,
                    }}
                  >
                    <LockOutlined />
                  </div>

                  <div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        display: 'block',
                        marginBottom: '10px',
                      }}
                    >
                      Organization Portal
                    </Text>
                    <Title
                      level={1}
                      style={{
                        margin: 0,
                        fontWeight: '600',
                        fontSize: isMobile ? '24px' : '30px',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        color: token.colorText,
                      }}
                    >
                      {pageTitle}
                    </Title>
                    <Paragraph
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: token.colorTextSecondary,
                        marginTop: '12px',
                        marginBottom: 0,
                      }}
                    >
                      {pageDescription}
                    </Paragraph>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    icon={<LoginOutlined />}
                    onClick={handlePrimaryAction}
                    block
                    style={{
                      height: '48px',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderRadius: '12px',
                      background: primaryButtonGradient,
                      border: 'none',
                      boxShadow: primaryButtonShadow,
                      color: '#fff',
                    }}
                  >
                    {primaryLabel}
                    <ArrowRightOutlined style={{ marginLeft: '12px' }} />
                  </Button>

                  {(onSwitchToDesk || (!isGuest && onLogout)) && (
                    <Space size={8} style={{ width: '100%' }} wrap>
                      {onSwitchToDesk && (
                        <Button
                          icon={<DesktopOutlined />}
                          onClick={onSwitchToDesk}
                          style={{ borderRadius: '10px', fontWeight: 600, height: 40 }}
                        >
                          Open Desk
                        </Button>
                      )}
                      {!isGuest && onLogout && (
                        <Button
                          danger
                          icon={<LogoutOutlined />}
                          onClick={onLogout}
                          style={{ borderRadius: '10px', fontWeight: 600, height: 40 }}
                        >
                          Log Out
                        </Button>
                      )}
                    </Space>
                  )}

                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: infoBackground,
                      border: infoBorder,
                    }}
                  >
                    <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px', color: brandColor }}>
                      {isGuest ? 'After You Sign In' : 'Current Account'}
                    </Title>
                    <Text style={{ fontSize: '12px', color: token.colorTextSecondary, lineHeight: '1.5' }}>
                      {isGuest ? guidance : (userEmail || 'Unknown user')}
                    </Text>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: infoBackground,
                      border: infoBorder,
                    }}
                  >
                    <Title level={5} style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                      Need Help?
                    </Title>
                    <Text style={{ fontSize: '12px', color: token.colorTextTertiary }}>
                      {guidance}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={13}>
              <Space direction="vertical" size={28} style={{ width: '100%', padding: '0 12px' }}>
                <div>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: isDarkMode ? '#4ade80' : '#0f766e',
                      display: 'block',
                      marginBottom: '12px',
                    }}
                  >
                    Executive Platform
                  </Text>
                  <Title level={2} style={{ margin: '0 0 10px 0', fontWeight: '600', fontSize: '28px' }}>
                    Smarter Organization Management
                  </Title>
                  <Paragraph style={{ fontSize: '14px', color: token.colorTextSecondary }}>
                    Compliance 360 provides integrated oversight of health workers, facilities, licenses, and compliance actions.
                  </Paragraph>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {features.map((feature, index) => (
                    <Card
                      key={index}
                      style={{
                        borderRadius: '12px',
                        background: panelBackground,
                        border: panelBorder,
                        boxShadow: isDarkMode ? '0 2px 12px rgba(2, 6, 23, 0.42)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                      }}
                      bodyStyle={{ padding: '18px' }}
                    >
                      <Space size={16} align="start">
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: isDarkMode ? 'rgba(15, 118, 110, 0.2)' : 'rgba(15, 118, 110, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: brandColor,
                          }}
                        >
                          {feature.icon}
                        </div>
                        <div>
                          <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                            {feature.title}
                          </Title>
                          <Text style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                            {feature.description}
                          </Text>
                        </div>
                        <CheckCircleOutlined style={{ fontSize: '18px', color: '#52c41a', marginLeft: 'auto', alignSelf: 'center' }} />
                      </Space>
                    </Card>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: token.colorTextTertiary,
                    fontSize: '12px',
                  }}
                >
                  <SafetyCertificateOutlined style={{ fontSize: '18px' }} />
                  <span>Secured by enterprise-grade authentication and audit controls</span>
                </div>
              </Space>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  )
}
