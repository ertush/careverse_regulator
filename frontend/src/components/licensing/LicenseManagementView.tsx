import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLicensingStore } from '@/stores/licensingStore'
import { useResponsive } from '@/hooks/useResponsive'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Plus, ArrowLeft } from 'lucide-react'
import LicensesTable from './LicensesTable'
import LicenseCard from './LicenseCard'
import LicensesFilters from './LicensesFilters'
import ApplicationsTable from './ApplicationsTable'
import ApplicationCard from './ApplicationCard'
import ApplicationsFilters from './ApplicationsFilters'
import PaginationControls from './PaginationControls'
import { cn } from '@/lib/utils'

interface LicenseManagementViewProps {
  company?: string | null
}

export default function LicenseManagementView({ company }: LicenseManagementViewProps) {
  const navigate = useNavigate()
  const {
    licenses,
    licensesLoading,
    licensesError,
    licensesPagination,
    licensesFilters,
    setLicensesFilters,
    setLicensesPage,
    applications,
    applicationsLoading,
    applicationsError,
    applicationsPagination,
    applicationsFilters,
    setApplicationsFilters,
    setApplicationsPage,
  } = useLicensingStore()

  const { isMobile, isTablet } = useResponsive()

  const [activeTab, setActiveTab] = useState<'licenses' | 'applications'>('licenses')

  // Licenses filters state
  const [licenseSearchText, setLicenseSearchText] = useState(licensesFilters.search || '')
  const [selectedLicenseStatuses, setSelectedLicenseStatuses] = useState<string[]>(
    licensesFilters.status ? licensesFilters.status.split(',') : ['all']
  )
  const [licenseSortOrder, setLicenseSortOrder] = useState<'asc' | 'desc' | 'recent'>('recent')

  // Applications filters state
  const [appSearchText, setAppSearchText] = useState(applicationsFilters.search || '')
  const [selectedAppStatuses, setSelectedAppStatuses] = useState<string[]>(['all'])
  const [selectedAppTypes, setSelectedAppTypes] = useState<string[]>(['all'])

  // Debounce license search
  useEffect(() => {
    const timer = setTimeout(() => {
      setLicensesFilters({ ...licensesFilters, search: licenseSearchText || undefined })
    }, 300)
    return () => clearTimeout(timer)
  }, [licenseSearchText])

  // Debounce application search
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplicationsFilters({ ...applicationsFilters, search: appSearchText || undefined })
    }, 300)
    return () => clearTimeout(timer)
  }, [appSearchText])

  // License filters handlers
  const handleLicenseStatusChange = (statuses: string[]) => {
    setSelectedLicenseStatuses(statuses)
    const statusFilter = statuses.includes('all') ? undefined : statuses.join(',')
    setLicensesFilters({ ...licensesFilters, status: statusFilter })
  }

  const handleLicenseSortChange = (order: 'asc' | 'desc' | 'recent') => {
    setLicenseSortOrder(order)
    if (order === 'asc') {
      setLicensesFilters({ ...licensesFilters, sortBy: 'license_number', sortOrder: 'asc' })
    } else if (order === 'desc') {
      setLicensesFilters({ ...licensesFilters, sortBy: 'license_number', sortOrder: 'desc' })
    } else {
      setLicensesFilters({ ...licensesFilters, sortBy: 'expiry_date', sortOrder: 'desc' })
    }
  }

  const handleClearLicenseFilters = () => {
    setLicenseSearchText('')
    setSelectedLicenseStatuses(['all'])
    setLicenseSortOrder('recent')
    setLicensesFilters({})
  }

  // Application filters handlers
  const handleAppStatusChange = (statuses: string[]) => {
    setSelectedAppStatuses(statuses)
    const statusFilter = statuses.includes('all') ? undefined : statuses.join(',')
    setApplicationsFilters({ ...applicationsFilters, applicationStatus: statusFilter })
  }

  const handleAppTypeChange = (types: string[]) => {
    setSelectedAppTypes(types)
    const typeFilter = types.includes('all') ? undefined : types[0]
    setApplicationsFilters({ ...applicationsFilters, applicationType: typeFilter })
  }

  const handleClearAppFilters = () => {
    setAppSearchText('')
    setSelectedAppStatuses(['all'])
    setSelectedAppTypes(['all'])
    setApplicationsFilters({})
  }

  // Row click handlers
  const handleLicenseRowClick = (licenseNumber: string) => {
    navigate({ to: `/license-management/${licenseNumber}` })
  }

  const handleApplicationRowClick = (applicationId: string) => {
    navigate({ to: `/license-management/applications/${applicationId}` })
  }

  // Calculate active filters
  const activeLicenseFiltersCount =
    (licenseSearchText ? 1 : 0) +
    (!selectedLicenseStatuses.includes('all') ? 1 : 0) +
    (licenseSortOrder !== 'recent' ? 1 : 0)

  const activeAppFiltersCount =
    (appSearchText ? 1 : 0) +
    (!selectedAppStatuses.includes('all') ? 1 : 0) +
    (!selectedAppTypes.includes('all') ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Back to Dashboard */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/license-management' })}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
        </div>

        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-6">
          <LicensesFilters
            searchText={licenseSearchText}
            onSearchChange={setLicenseSearchText}
            selectedStatuses={selectedLicenseStatuses}
            onStatusChange={handleLicenseStatusChange}
            sortOrder={licenseSortOrder}
            onSortChange={handleLicenseSortChange}
            activeFiltersCount={activeLicenseFiltersCount}
            onClearFilters={handleClearLicenseFilters}
          />

          {licensesError && (
            <Card className="border-destructive">
              <CardContent className="py-4">
                <p className="text-sm text-destructive">{licensesError}</p>
              </CardContent>
            </Card>
          )}

          {isMobile || isTablet ? (
            <div className="space-y-4">
              {licenses.map((license) => (
                <LicenseCard
                  key={license.id}
                  license={license}
                  onClick={() => handleLicenseRowClick(license.licenseNumber)}
                />
              ))}
            </div>
          ) : (
            <LicensesTable
              licenses={licenses}
              loading={licensesLoading}
              onRowClick={handleLicenseRowClick}
            />
          )}

          {licensesPagination && licensesPagination.total_pages > 1 && (
            <PaginationControls
              currentPage={licensesPagination.page}
              totalPages={licensesPagination.total_pages}
              onPageChange={setLicensesPage}
              totalCount={licensesPagination.total_count}
              pageSize={licensesPagination.page_size}
              isMobile={isMobile}
            />
          )}

          {!licensesLoading && licenses.length === 0 && activeLicenseFiltersCount === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Licenses Found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  There are currently no facility licenses in the system.
                </p>
              </CardContent>
            </Card>
          )}

          {!licensesLoading && licenses.length === 0 && activeLicenseFiltersCount > 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  No licenses match your current filters.
                </p>
                <Button variant="outline" onClick={handleClearLicenseFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <ApplicationsFilters
            searchText={appSearchText}
            onSearchChange={setAppSearchText}
            selectedStatuses={selectedAppStatuses}
            onStatusChange={handleAppStatusChange}
            selectedTypes={selectedAppTypes}
            onTypeChange={handleAppTypeChange}
            activeFiltersCount={activeAppFiltersCount}
            onClearFilters={handleClearAppFilters}
          />

          {applicationsError && (
            <Card className="border-destructive">
              <CardContent className="py-4">
                <p className="text-sm text-destructive">{applicationsError}</p>
              </CardContent>
            </Card>
          )}

          {isMobile || isTablet ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onClick={() => handleApplicationRowClick(app.licenseApplicationId)}
                />
              ))}
            </div>
          ) : (
            <ApplicationsTable
              applications={applications}
              loading={applicationsLoading}
              onRowClick={handleApplicationRowClick}
            />
          )}

          {applicationsPagination && applicationsPagination.total_pages > 1 && (
            <PaginationControls
              currentPage={applicationsPagination.page}
              totalPages={applicationsPagination.total_pages}
              onPageChange={setApplicationsPage}
              totalCount={applicationsPagination.total_count}
              pageSize={applicationsPagination.page_size}
              isMobile={isMobile}
            />
          )}

          {!applicationsLoading && applications.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {activeAppFiltersCount > 0
                    ? 'No applications match your current filters.'
                    : 'There are currently no license applications.'}
                </p>
                {activeAppFiltersCount > 0 && (
                  <Button variant="outline" onClick={handleClearAppFilters} className="mt-4">
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
