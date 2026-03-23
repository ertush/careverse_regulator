import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LicenseApplication } from '@/types/license'
import StatusBadge from './StatusBadge'

interface ApplicationsTableProps {
  applications: LicenseApplication[]
  loading?: boolean
  onRowClick: (applicationId: string) => void
}

export default function ApplicationsTable({ applications, loading, onRowClick }: ApplicationsTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application ID</TableHead>
            <TableHead>Facility Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>License Type</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow
                key={app.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onRowClick(app.licenseApplicationId)}
              >
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
