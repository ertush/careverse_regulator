import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type RowSelectionState,
} from '@tanstack/react-table'
import type { Inspection } from '@/types/inspection'
import StatusBadge from './StatusBadge'
import dayjs from 'dayjs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EntityLink } from '@/components/entities'

interface InspectionTableProps {
  inspections: Inspection[]
  selectedRowKeys: React.Key[]
  onSelectionChange: (keys: React.Key[]) => void
  onViewInspection: (inspection: Inspection) => void
}

function isInspectionOverdue(inspection: Inspection): boolean {
  if (inspection.status !== 'Pending') return false
  const today = dayjs().startOf('day')
  const inspectionDate = dayjs(inspection.date, 'DD/MM/YYYY')
  return inspectionDate.isBefore(today)
}

const columnHelper = createColumnHelper<Inspection>()

export default function InspectionTable({
  inspections,
  selectedRowKeys,
  onSelectionChange,
  onViewInspection,
}: InspectionTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Convert selectedRowKeys to row selection state
  const rowSelection = useMemo(() => {
    const selection: RowSelectionState = {}
    selectedRowKeys.forEach((key) => {
      const index = inspections.findIndex((i) => i.id === key)
      if (index !== -1) {
        selection[index] = true
      }
    })
    return selection
  }, [selectedRowKeys, inspections])

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 40,
      }),
      columnHelper.accessor('inspectionId', {
        header: 'Inspection ID',
        cell: (info) => (
          <span className="font-medium text-sm">{info.getValue()}</span>
        ),
        size: 150,
      }),
      columnHelper.accessor('facilityName', {
        header: 'Facility Name',
        cell: (info) => (
          <EntityLink
            type="facility"
            id={info.row.original.facilityId}
            className="text-sm truncate block max-w-[200px]"
          >
            {info.getValue()}
          </EntityLink>
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
        size: 120,
      }),
      columnHelper.accessor('inspector', {
        header: 'Inspector',
        cell: (info) => (
          <EntityLink
            type="professional"
            id={info.row.original.professionalId}
            className="text-sm truncate block max-w-[150px]"
          >
            {info.getValue()}
          </EntityLink>
        ),
        size: 150,
      }),
      columnHelper.accessor('noteToInspector', {
        header: 'Note to Inspector',
        cell: (info) => (
          <span className="text-sm text-muted-foreground truncate block max-w-[200px]">
            {info.getValue() || '-'}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const inspection = info.row.original
          if (isInspectionOverdue(inspection)) {
            return (
              <Badge variant="destructive" className="gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                Overdue
              </Badge>
            )
          }
          return <StatusBadge status={info.getValue()} />
        },
        size: 130,
      }),
      columnHelper.display({
        id: 'action',
        header: 'Action',
        cell: (info) => (
          <Button
            size="sm"
            onClick={() => onViewInspection(info.row.original)}
            className="h-8 whitespace-nowrap"
          >
            View
          </Button>
        ),
        size: 100,
      }),
    ],
    [onViewInspection]
  )

  const table = useReactTable({
    data: inspections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater
      const selectedIds = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((index) => inspections[parseInt(index)]?.id)
        .filter(Boolean)
      onSelectionChange(selectedIds)
    },
    state: {
      pagination,
      rowSelection,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
  })

  const totalPages = table.getPageCount()
  const currentPage = pagination.pageIndex + 1

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <span className="text-muted-foreground">No results.</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
