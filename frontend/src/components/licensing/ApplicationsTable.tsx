import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { LicenseApplication } from '@/types/license'
import StatusBadge from './StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

interface ApplicationsTableProps {
  applications: LicenseApplication[]
  loading?: boolean
  onRowClick: (applicationId: string) => void
  selectedIds?: Set<string>
  onToggleSelection?: (applicationId: string) => void
  onSelectAll?: () => void
  onDeselectAll?: () => void
  emptyState?: React.ReactNode
}

export default function ApplicationsTable({
  applications,
  loading,
  onRowClick,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  emptyState,
}: ApplicationsTableProps) {
  const selectionEnabled = selectedIds !== undefined && onToggleSelection !== undefined
  const allSelected = selectionEnabled && applications.length > 0 && applications.every(a => selectedIds.has(a.licenseApplicationId))
  const someSelected = selectionEnabled && applications.some(a => selectedIds.has(a.licenseApplicationId)) && !allSelected

  const handleSelectAll = () => {
    if (allSelected && onDeselectAll) {
      onDeselectAll()
    } else if (onSelectAll) {
      onSelectAll()
    }
  }

  const totalColumns = selectionEnabled ? 9 : 8

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {selectionEnabled && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected || (someSelected ? 'indeterminate' : false)}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            <TableHead>Application ID</TableHead>
            <TableHead>Facility Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>License Type</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={totalColumns} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={totalColumns} className="text-center py-8 text-muted-foreground">
                {emptyState || 'No applications found'}
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => {
              const isSelected = selectionEnabled && selectedIds.has(app.licenseApplicationId)
              return (
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onRowClick(app.licenseApplicationId)}
                >
                  {selectionEnabled && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(app.licenseApplicationId)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-mono text-sm font-medium">{app.licenseApplicationId}</TableCell>
                  <TableCell>
                    {app.facilityName}
                    {app.facilityCode && (
                      <div className="text-xs text-muted-foreground">Code: {app.facilityCode}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {app.applicationType}
                    </Badge>
                  </TableCell>
                  <TableCell>{app.licenseTypeName}</TableCell>
                  <TableCell>{app.applicationDate}</TableCell>
                  <TableCell>KES {app.licenseFee.toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.applicationStatus} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground" onClick={() => onRowClick(app.licenseApplicationId)}>
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
