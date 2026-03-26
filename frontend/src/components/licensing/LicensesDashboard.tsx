import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FacilityLicensesDashboard } from './FacilityLicensesDashboard'
import { ApplicationsDashboard } from './ApplicationsDashboard'

export function LicensesDashboard() {
  const [activeTab, setActiveTab] = useState('licenses')

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">License Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage health facility and professional licenses and applications
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="mt-6">
          <FacilityLicensesDashboard />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <ApplicationsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
