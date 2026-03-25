import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EntityLink } from '@/components/entities'
import { Search, UserRound, ArrowLeft, ArrowUpDown, ArrowUp, ArrowDown, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { ProfessionalRecord } from '@/api/registryApi'

const columns: ColumnDef<ProfessionalRecord>[] = [
  {
    accessorKey: 'full_name',
    header: ({ column }) => <SortableHeader column={column} label="Full Name" />,
    cell: ({ row }) => (
      <div className="font-medium">
        <EntityLink type="professional" id={row.original.registration_number || ''}>
          {row.original.full_name}
        </EntityLink>
      </div>
    ),
  },
  {
    accessorKey: 'registration_number',
    header: ({ column }) => <SortableHeader column={column} label="Registration #" />,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.registration_number || '—'}</span>
    ),
  },
  {
    accessorKey: 'license_number',
    header: ({ column }) => <SortableHeader column={column} label="License #" />,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.license_number || '—'}</span>
    ),
  },
  {
    accessorKey: 'category_of_practice',
    header: ({ column }) => <SortableHeader column={column} label="Category of Practice" />,
    cell: ({ row }) => row.original.category_of_practice || <span className="text-muted-foreground">—</span>,
    filterFn: 'equals',
  },
  {
    accessorKey: 'place_of_practice',
    header: ({ column }) => <SortableHeader column={column} label="Place of Practice" />,
    cell: ({ row }) => row.original.place_of_practice || <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: 'county',
    header: ({ column }) => <SortableHeader column={column} label="County" />,
    cell: ({ row }) => row.original.county || <span className="text-muted-foreground">—</span>,
    filterFn: 'equals',
  },
  {
    accessorKey: 'nationality',
    header: ({ column }) => <SortableHeader column={column} label="Nationality" />,
    cell: ({ row }) => row.original.nationality || <span className="text-muted-foreground">—</span>,
  },
  {
    id: 'affiliations_count',
    header: 'Affiliations',
    accessorFn: (row) => row.affiliations?.length || 0,
    cell: ({ row }) => {
      const count = row.original.affiliations?.length || 0
      return count > 0 ? (
        <Badge variant="secondary">{count}</Badge>
      ) : (
        <span className="text-muted-foreground">0</span>
      )
    },
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) =>
      row.original.active ? (
        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">Active</Badge>
      ) : (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">Inactive</Badge>
      ),
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === '') return true
      return String(row.getValue(columnId)) === filterValue
    },
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <ViewAction id={row.original.registration_number || ''} />,
    enableSorting: false,
  },
]

function SortableHeader({ column, label }: { column: any; label: string }) {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 font-medium"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className="ml-1 h-3.5 w-3.5" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="ml-1 h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />
      )}
    </Button>
  )
}

function ViewAction({ id }: { id: string }) {
  return (
    <EntityLink type="professional" id={id}>
      <Button variant="ghost" size="sm" className="h-8 px-2">
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
    </EntityLink>
  )
}

function getUniqueValues(data: ProfessionalRecord[], key: keyof ProfessionalRecord): string[] {
  const values = new Set<string>()
  for (const row of data) {
    const val = row[key]
    if (val && typeof val === 'string') values.add(val)
  }
  return Array.from(values).sort()
}

interface ProfessionalsTableProps {
  professionals: ProfessionalRecord[]
}

export default function ProfessionalsTable({ professionals }: ProfessionalsTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: professionals,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  const categories = getUniqueValues(professionals, 'category_of_practice')
  const counties = getUniqueValues(professionals, 'county')
  const nationalities = getUniqueValues(professionals, 'nationality')

  const activeFilterCount = columnFilters.length + (globalFilter ? 1 : 0)

  const clearAllFilters = () => {
    setColumnFilters([])
    setGlobalFilter('')
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/affiliations' })}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>

      <div>
        <h2 className="text-2xl font-bold text-foreground">Health Professionals</h2>
        <p className="text-muted-foreground mt-1">
          Registry of {professionals.length} health professionals
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <FilterSelect
          placeholder="Category"
          label="Categories"
          options={categories}
          value={(table.getColumn('category_of_practice')?.getFilterValue() as string) ?? ''}
          onChange={(val) => table.getColumn('category_of_practice')?.setFilterValue(val || undefined)}
        />
        <FilterSelect
          placeholder="County"
          label="Counties"
          options={counties}
          value={(table.getColumn('county')?.getFilterValue() as string) ?? ''}
          onChange={(val) => table.getColumn('county')?.setFilterValue(val || undefined)}
        />
        <FilterSelect
          placeholder="Status"
          label="Statuses"
          options={['Active', 'Inactive']}
          value={
            (table.getColumn('active')?.getFilterValue() as string) === 'true'
              ? 'Active'
              : (table.getColumn('active')?.getFilterValue() as string) === 'false'
                ? 'Inactive'
                : ''
          }
          onChange={(val) => {
            if (val === 'Active') table.getColumn('active')?.setFilterValue('true')
            else if (val === 'Inactive') table.getColumn('active')?.setFilterValue('false')
            else table.getColumn('active')?.setFilterValue(undefined)
          }}
        />

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9">
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <UserRound className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {activeFilterCount > 0 ? 'No professionals match your filters' : 'No professionals found'}
                    </p>
                    {activeFilterCount > 0 && (
                      <Button variant="outline" size="sm" onClick={clearAllFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} professionals
          {table.getFilteredRowModel().rows.length !== professionals.length &&
            ` (${professionals.length} total)`}
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(val) => table.setPageSize(Number(val))}
          >
            <SelectTrigger className="h-9 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({
  placeholder,
  label,
  options,
  value,
  onChange,
}: {
  placeholder: string
  label?: string
  options: string[]
  value: string
  onChange: (val: string) => void
}) {
  return (
    <Select value={value || '__all__'} onValueChange={(val) => onChange(val === '__all__' ? '' : val)}>
      <SelectTrigger className="h-9 w-[150px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">All {label || `${placeholder}s`}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
