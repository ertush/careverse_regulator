import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useThemeBridge } from '@/lib/theme-bridge'

function RootComponent() {
  // Synchronize theme between light/dark modes
  useThemeBridge()

  return <Outlet />
}

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    const authState = useAuthStore.getState()

    // If guest, redirect to unauthorized page
    if (authState.status === 'guest') {
      throw redirect({
        to: '/unauthorized',
        search: { mode: 'guest' },
      })
    }

    // If authenticated but no portal access, determine mode and redirect
    if (authState.status === 'authenticated' && !authState.hasPortalAccess) {
      const isCompanyMisconfigured =
        authState.accessIssue === 'missing_company_permission' ||
        authState.accessIssue === 'multiple_company_permissions'

      throw redirect({
        to: '/unauthorized',
        search: {
          mode: isCompanyMisconfigured ? 'tenant-misconfigured' : 'forbidden'
        },
      })
    }
  },
})
