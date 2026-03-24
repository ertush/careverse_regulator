# Forms Implementation Guide

## Overview

Complete forms system for regulatory workflows including license applications, renewals, and appeals with multi-step wizards, validation, draft saving, and file uploads.

---

## Implementation Summary

### ✅ Completed Components

1. **Form Types & Schemas** (`/src/types/forms.ts`)
2. **Form Wizard Component** (`/src/components/forms/FormWizard.tsx`)
3. **Forms API Client** (`/src/api/formsApi.ts`)
4. **Forms Store** (`/src/stores/formsStore.ts`)
5. **License Application Form** (to be completed)
6. **License Renewal Form** (to be completed)
7. **Appeal Submission Form** (to be completed)

---

## Form Types

### License Application

**Steps**:
1. Facility Information
2. License Details
3. Owner/Operator Information
4. Staff Information
5. Document Upload
6. Review & Submit

**Fields**: 25+ fields including facility details, license type, owner info, staff counts, and document uploads

### License Renewal

**Steps**:
1. License Verification
2. Review Changes
3. Update Information
4. Document Upload
5. Declarations & Submit

**Fields**: License number, verification checkboxes, change tracking, staff updates, service changes, and required declarations

### License Appeal

**Steps**:
1. Decision Information
2. Grounds for Appeal
3. Supporting Evidence
4. Contact Information
5. Review & Submit

**Fields**: License number, decision details, grounds (procedural error, new evidence, etc.), detailed explanation, and contact info

---

## Form Wizard Component

### Usage

```tsx
import FormWizard, { WizardStep } from '@/components/forms/FormWizard'

const steps: WizardStep[] = [
  { id: 'step1', title: 'Step 1', description: 'First step' },
  { id: 'step2', title: 'Step 2', description: 'Second step', optional: true },
  { id: 'step3', title: 'Step 3', description: 'Final step' },
]

function MyForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  return (
    <FormWizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      isSubmitting={isSubmitting}
      canGoNext={isStepValid}
      showDraftButton={true}
      submitLabel="Submit Application"
    >
      {/* Step content based on currentStep */}
      {currentStep === 0 && <Step1Content />}
      {currentStep === 1 && <Step2Content />}
      {currentStep === 2 && <Step3Content />}
    </FormWizard>
  )
}
```

### Features

- **Progress Bar**: Visual indicator of completion
- **Step Navigation**: Click previous steps to edit
- **Step Indicators**: Checkmarks for completed steps
- **Validation**: Disable next button until step is valid
- **Draft Saving**: Save button on each step
- **Responsive**: Mobile-friendly layout

---

## Draft Management

### How It Works

1. **Auto-save**: Drafts saved to localStorage with persist middleware
2. **Expiration**: Drafts expire after 30 days
3. **Resume**: Load draft to continue where you left off
4. **Cleanup**: Expired drafts automatically removed

### Store Methods

```typescript
import { useFormsStore } from '@/stores/formsStore'

// Save draft
const { saveDraft } = useFormsStore()
saveDraft(FormType.LICENSE_APPLICATION, formData, currentStep)

// Load draft
const { loadDraft } = useFormsStore()
const draft = loadDraft(draftId)
if (draft) {
  setFormData(draft.data)
  setCurrentStep(draft.currentStep)
}

// Delete draft
const { deleteDraft } = useFormsStore()
deleteDraft(draftId)

// List all drafts
const { drafts } = useFormsStore()
drafts.forEach(draft => {
  console.log(draft.formType, draft.lastSaved)
})
```

---

## Validation with Zod

### Schema Definition

```typescript
import { z } from 'zod'

export const licenseApplicationSchema = z.object({
  facilityName: z.string().min(3, 'Facility name must be at least 3 characters'),
  facilityEmail: z.string().email('Please enter a valid email address'),
  numberOfBeds: z.number().min(0).optional(),
  servicesOffered: z.array(z.string()).min(1, 'Please select at least one service'),
  // ... more fields
})
```

### Form Integration with react-hook-form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function LicenseApplicationForm() {
  const form = useForm({
    resolver: zodResolver(licenseApplicationSchema),
    defaultValues: initialData,
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await submitApplication(data)
  })

  return (
    <form onSubmit={onSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### Per-Step Validation

```typescript
// Define schema per step
const step1Schema = licenseApplicationSchema.pick({
  facilityName: true,
  facilityType: true,
  facilityAddress: true,
  // ... step 1 fields only
})

// Validate current step
const isStepValid = step1Schema.safeParse(formData).success
```

---

## File Upload Integration

### Using Document Upload Component

```typescript
import { DocumentUpload } from '@/components/documents'

function DocumentsStep() {
  const [documents, setDocuments] = useState<File[]>([])

  return (
    <DocumentUpload
      defaultCategory={DocumentCategory.APPLICATION}
      onUploadComplete={(uploadedDocs) => {
        setDocuments([...documents, ...uploadedDocs])
      }}
    />
  )
}
```

### Handling Multiple File Types

```typescript
const [formData, setFormData] = useState({
  documents: {
    facilityPlan: undefined as File | undefined,
    ownershipProof: undefined as File | undefined,
    staffCertificates: [] as File[],
    complianceDocuments: [] as File[],
  }
})

// Single file input
<Input
  type="file"
  accept=".pdf,.jpg,.png"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          facilityPlan: file
        }
      })
    }
  }}
/>

// Multiple files input
<Input
  type="file"
  accept=".pdf,.jpg,.png"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files || [])
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        staffCertificates: files
      }
    })
  }}
/>
```

---

## API Integration

### Backend Endpoints Required

#### Submit License Application
```
POST /api/method/compliance_360.api.forms.submit_license_application
Content-Type: multipart/form-data

Body:
- All form fields
- documents_facilityPlan: File
- documents_ownershipProof: File
- documents_staffCertificates[]: File[]
- etc.

Response: { message: FormSubmission }
```

#### Submit License Renewal
```
POST /api/method/compliance_360.api.forms.submit_license_renewal
Content-Type: multipart/form-data

Response: { message: FormSubmission }
```

#### Submit License Appeal
```
POST /api/method/compliance_360.api.forms.submit_license_appeal
Content-Type: multipart/form-data

Response: { message: FormSubmission }
```

#### Get Form Submission
```
GET /api/method/compliance_360.api.forms.get_form_submission
Params: submission_id

Response: { message: FormSubmission }
```

#### List Form Submissions
```
GET /api/method/compliance_360.api.forms.list_form_submissions
Params: form_type?, status?, page?, page_size?

Response: {
  message: {
    submissions: FormSubmission[]
    total: number
  }
}
```

---

## Form Routes

### Route Structure

```
/forms/license/new              → New license application
/forms/license/renewal/:id      → License renewal (pre-filled)
/forms/appeal/new               → New appeal
/forms/drafts                   → View saved drafts
/forms/submissions              → View submitted forms
/forms/submissions/:id          → View submission details
```

### Navigation Integration

Add to sidebar:
```tsx
{
  key: 'forms',
  icon: FileText,
  label: 'Forms',
  children: [
    {
      key: 'forms-new-application',
      label: 'New License Application',
    },
    {
      key: 'forms-renewals',
      label: 'License Renewals',
    },
    {
      key: 'forms-appeals',
      label: 'Submit Appeal',
    },
    {
      key: 'forms-drafts',
      label: 'Saved Drafts',
    },
  ]
}
```

---

## Form Implementation Pattern

### Step 1: Define Form Component

```typescript
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormWizard from '@/components/forms/FormWizard'
import { useFormsStore } from '@/stores/formsStore'
import { licenseApplicationSchema, type LicenseApplicationData } from '@/types/forms'

const steps = [
  { id: 'facility', title: 'Facility Information', description: 'Basic facility details' },
  { id: 'license', title: 'License Details', description: 'License type and services' },
  { id: 'owner', title: 'Owner Information', description: 'Owner/operator details' },
  { id: 'staff', title: 'Staff Information', description: 'Staffing levels' },
  { id: 'documents', title: 'Documents', description: 'Upload required documents' },
  { id: 'review', title: 'Review & Submit', description: 'Review your application' },
]

export default function LicenseApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const { submitApplication, saveDraft, isSubmitting } = useFormsStore()

  const form = useForm<LicenseApplicationData>({
    resolver: zodResolver(licenseApplicationSchema),
    defaultValues: {} // Load from draft if exists
  })

  const handleSaveDraft = () => {
    const data = form.getValues()
    saveDraft('license_application', data, currentStep)
    toast.success('Draft saved successfully')
  }

  const handleSubmit = async () => {
    const data = form.getValues()
    try {
      await submitApplication(data)
      toast.success('Application submitted successfully')
      // Navigate to confirmation page
    } catch (error) {
      toast.error('Failed to submit application')
    }
  }

  // Validate current step
  const currentStepFields = getFieldsForStep(currentStep)
  const isStepValid = currentStepFields.every(field =>
    !form.formState.errors[field]
  )

  return (
    <FormWizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      isSubmitting={isSubmitting}
      canGoNext={isStepValid}
    >
      {currentStep === 0 && <FacilityInfoStep form={form} />}
      {currentStep === 1 && <LicenseDetailsStep form={form} />}
      {currentStep === 2 && <OwnerInfoStep form={form} />}
      {currentStep === 3 && <StaffInfoStep form={form} />}
      {currentStep === 4 && <DocumentsStep form={form} />}
      {currentStep === 5 && <ReviewStep data={form.getValues()} />}
    </FormWizard>
  )
}
```

### Step 2: Create Step Components

```typescript
import { UseFormReturn } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface FacilityInfoStepProps {
  form: UseFormReturn<LicenseApplicationData>
}

function FacilityInfoStep({ form }: FacilityInfoStepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="facilityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facility Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter facility name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facilityType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facility Type *</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* More fields... */}
    </div>
  )
}
```

### Step 3: Create Review Step

```typescript
function ReviewStep({ data }: { data: LicenseApplicationData }) {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Review Your Application</AlertTitle>
        <AlertDescription>
          Please review all information before submitting. You can go back to edit any section.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Facility Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Facility Name</p>
              <p className="font-medium">{data.facilityName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Facility Type</p>
              <p className="font-medium">{data.facilityType}</p>
            </div>
            {/* More fields... */}
          </div>
        </CardContent>
      </Card>

      {/* More sections... */}
    </div>
  )
}
```

---

## Draft Management UI

### Drafts List Page

```typescript
import { useFormsStore } from '@/stores/formsStore'
import { format } from 'date-fns'

function DraftsPage() {
  const { drafts, deleteDraft } = useFormsStore()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Drafts</h2>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No saved drafts</p>
          </CardContent>
        </Card>
      ) : (
        drafts.map(draft => (
          <Card key={draft.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{getFormTypeLabel(draft.formType)}</CardTitle>
                  <CardDescription>
                    Last saved: {format(new Date(draft.lastSaved), 'PPp')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/forms/${draft.formType}?draft=${draft.id}`)}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteDraft(draft.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  )
}
```

---

## Testing

### Test Form Validation

```typescript
import { licenseApplicationSchema } from '@/types/forms'

const validData = {
  facilityName: 'Test Hospital',
  facilityType: 'hospital',
  facilityEmail: 'test@example.com',
  // ... complete data
}

const result = licenseApplicationSchema.safeParse(validData)
expect(result.success).toBe(true)
```

### Test Draft Saving

```typescript
import { useFormsStore } from '@/stores/formsStore'

const { saveDraft, loadDraft } = useFormsStore.getState()

// Save draft
saveDraft('license_application', formData, 2)

// Load draft
const draft = loadDraft(draftId)
expect(draft).toBeDefined()
expect(draft.currentStep).toBe(2)
```

### Test Form Submission

```typescript
const { submitApplication } = useFormsStore.getState()

const submission = await submitApplication(validData)
expect(submission.id).toBeDefined()
expect(submission.status).toBe('submitted')
```

---

## Summary

**Status**: ✅ Core infrastructure complete

**Completed**:
- Form types and Zod schemas
- FormWizard component
- Forms API client
- Forms store with draft management
- Documentation

**Pending**:
- Complete form implementations (application, renewal, appeal)
- Form routes and navigation
- Draft management UI
- Backend API endpoints

**Next Steps**:
1. Complete individual form implementations
2. Add form routes
3. Implement backend API endpoints
4. Test end-to-end workflow
5. Add form submission tracking

All foundational components are ready for form development!
