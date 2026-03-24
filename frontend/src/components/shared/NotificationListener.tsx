import { useEffect, useRef } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'
import { useWebSocketNotifications } from '@/hooks/useWebSocketNotifications'
import { toast } from 'sonner'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

export default function NotificationListener() {
  const { notifications, preferences } = useNotificationStore()
  const lastNotificationIdRef = useRef<string | null>(null)

  // Initialize WebSocket connection for real-time notifications
  useWebSocketNotifications()

  useEffect(() => {
    if (notifications.length === 0) return

    const latestNotification = notifications[0]

    // Only show toast for new notifications
    if (
      latestNotification.id !== lastNotificationIdRef.current &&
      preferences.enabled &&
      preferences.showToasts &&
      preferences.categories[latestNotification.category]
    ) {
      const Icon = notificationIcons[latestNotification.type]

      const toastFn = toast[latestNotification.type] || toast

      toastFn(latestNotification.title, {
        description: latestNotification.message,
        icon: <Icon className="w-4 h-4" />,
        action: latestNotification.actionUrl
          ? {
              label: latestNotification.actionLabel || 'View',
              onClick: () => {
                window.location.href = latestNotification.actionUrl!
              },
            }
          : undefined,
      })

      lastNotificationIdRef.current = latestNotification.id
    }
  }, [notifications, preferences])

  return null
}
