import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '@/components/AppLayout'
import { DocumentManagementView } from '@/components/documents'

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
})

function DocumentsPage() {
  return (
    <AppLayout
      currentRoute="documents"
      pageTitle="Documents"
      pageSubtitle="Manage regulatory documents and files"
      onNavigate={(route) => {
        // Navigation is handled by router
      }}
      onOpenNotifications={() => {}}
      onLogout={() => {}}
      onSwitchToDesk={() => {}}
      user={null}
    >
      <DocumentManagementView />
    </AppLayout>
  )
}
