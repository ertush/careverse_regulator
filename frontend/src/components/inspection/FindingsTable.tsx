import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type RowSelectionState,
} from '@tanstack/react-table'
import type { Finding } from '@/stores/findingsStore'
import FindingsBadge from './FindingsBadge'
import { EntityLink } from '@/components/entities/EntityLink'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

interface FindingsTableProps {
  findings: Finding[]
  selectedRowKeys: React.Key[]
  onSelectionChange: (keys: React.Key[]) => void
  onViewFinding: (finding: Finding) => void
}

const columnHelper = createColumnHelper<Finding>()

export default function FindingsTable({
  findings,
  selectedRowKeys,
  onSelectionChange,
  onViewFinding,
}: FindingsTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Convert selectedRowKeys to row selection state
  const rowSelection = useMemo(() => {
    const selection: RowSelectionState = {}
    selectedRowKeys.forEach((key) => {
      const index = findings.findIndex((f) => f.id === key)
      if (index !== -1) {
        selection[index] = true
      }
    })
    return selection
  }, [selectedRowKeys, findings])

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
      columnHelper.accessor('findingId', {
        header: 'Finding ID',
        cell: (info) => (
          <span className="font-medium text-sm">{info.getValue()}</span>
        ),
        size: 120,
      }),
      columnHelper.accessor('facilityName', {
        header: 'Facility Name',
        cell: (info) => {
          const finding = info.row.original
          return finding.facilityId ? (
            <EntityLink
              type="facility"
              id={finding.facilityId}
              className="text-sm truncate block max-w-[180px] underline hover:no-underline"
            >
              {info.getValue()}
            </EntityLink>
          ) : (
            <span className="text-sm truncate block max-w-[180px]">{info.getValue()}</span>
          )
        },
        size: 200,
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <span className="text-sm truncate block max-w-[160px]">{info.getValue()}</span>
        ),
        size: 180,
      }),
      columnHelper.accessor('severity', {
        header: 'Severity',
        cell: (info) => <FindingsBadge severity={info.getValue()} />,
        size: 120,
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => (
          <span className="text-sm text-muted-foreground truncate block max-w-[250px]">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <FindingsBadge status={info.getValue()} />,
        size: 140,
      }),
      columnHelper.accessor('dueDate', {
        header: 'Due Date',
        cell: (info) => (
          <span className="text-sm">{info.getValue() || '-'}</span>
        ),
        size: 120,
      }),
      columnHelper.display({
        id: 'action',
        header: 'Action',
        cell: (info) => (
          <Button
            size="sm"
            onClick={() => onViewFinding(info.row.original)}
            className="h-8 whitespace-nowrap"
          >
            View
          </Button>
        ),
        size: 100,
      }),
    ],
    [onViewFinding]
  )

  const table = useReactTable({
    data: findings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater
      const selectedIds = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((index) => findings[parseInt(index)]?.id)
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
