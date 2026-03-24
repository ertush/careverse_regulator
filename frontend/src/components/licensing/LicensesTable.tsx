import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import type { License } from '@/types/license'
import StatusBadge from './StatusBadge'
import { Badge } from '@/components/ui/badge'
import { EntityLink } from '@/components/entities'

interface LicensesTableProps {
  licenses: License[]
  loading?: boolean
  onRowClick: (licenseNumber: string) => void
}

export default function LicensesTable({ licenses, loading, onRowClick }: LicensesTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>License #</TableHead>
            <TableHead>Registration #</TableHead>
            <TableHead>Facility Type</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Issuance Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && licenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : licenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No licenses found
              </TableCell>
            </TableRow>
          ) : (
            licenses.map((license) => (
              <TableRow
                key={license.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onRowClick(license.licenseNumber)}
              >
                <TableCell className="font-mono text-sm font-medium">{license.licenseNumber}</TableCell>
                <TableCell className="font-mono text-sm">{license.registrationNumber}</TableCell>
                <TableCell>{license.facilityType}</TableCell>
                <TableCell>
                  <EntityLink type="facility" id={license.registrationNumber}>
                    {license.owner}
                  </EntityLink>
                </TableCell>
                <TableCell>{license.dateOfIssuance}</TableCell>
                <TableCell>{license.dateOfExpiry}</TableCell>
                <TableCell>
                  <Badge
                    variant={license.paymentStatus === 'Paid' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {license.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={license.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
