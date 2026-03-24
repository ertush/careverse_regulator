# Document Management System Implementation

## Overview

A complete document management system for uploading, organizing, and managing regulatory documents associated with licenses, affiliations, inspections, and applications.

---

## Features Implemented

### 1. Document Upload with Drag-and-Drop
- **Multi-file upload** with drag-and-drop interface
- **File validation** (type and size limits - max 50MB)
- **Progress tracking** for each file
- **Category selection** (License, Certificate, Inspection Report, Appeal, etc.)
- **Description and tags** support
- **Automatic association** with licenses, affiliations, inspections, or applications

### 2. Document List and Grid Views
- **Table view** (desktop) with sortable columns
- **Grid/card view** (mobile-friendly)
- **View toggle** between list and grid layouts
- **Document preview** for PDFs and images
- **Download** functionality
- **Edit and delete** actions
- **Color-coded categories** with badges
- **File size and upload date** display

### 3. Advanced Filtering and Search
- **Full-text search** across document names, filenames, and descriptions
- **Category filtering** by document type
- **Status filtering** (Active, Archived)
- **Multiple sort options**:
  - Newest/Oldest first
  - Name (A-Z, Z-A)
  - File size (Largest/Smallest)
- **Clear filters** button

### 4. Document Preview
- **Inline preview** for supported formats (PDF, images)
- **Full metadata display** (size, uploader, dates, version)
- **Tags and description** display
- **Associated records** (license, affiliation, etc.)
- **Download and open in new tab** options
- **Fallback** for unsupported file types

### 5. Document Attachments Component
- **Embeddable widget** for detail pages
- **Compact list view** of attached documents
- **Quick actions** (view, download, delete)
- **Upload capability** from within detail pages
- **Auto-refresh** after upload

### 6. State Management
- **Zustand store** for global document state
- **Upload progress tracking** for multiple files
- **Pagination support** (20 documents per page)
- **Search and filter state** persistence
- **Error handling** and loading states

---

## File Structure

```
src/
├── types/
│   └── document.ts                        # TypeScript types and interfaces
├── api/
│   └── documentApi.ts                     # API client with mock data
├── stores/
│   └── documentStore.ts                   # Zustand state management
├── components/
│   └── documents/
│       ├── DocumentManagementView.tsx     # Main document management page
│       ├── DocumentUpload.tsx             # Upload component with drag-and-drop
│       ├── DocumentList.tsx               # Table view component
│       ├── DocumentGrid.tsx               # Grid/card view component
│       ├── DocumentFilters.tsx            # Search and filter controls
│       ├── DocumentPreview.tsx            # Document preview dialog
│       ├── DocumentAttachments.tsx        # Embeddable attachments widget
│       └── index.ts                       # Exports
└── routes/
    └── documents.tsx                      # Document management route
```

---

## Component Details

### DocumentManagementView
Main container for document management:
- Header with upload button
- Filters card
- View toggle (grid/list)
- Document count display
- Pagination controls
- Upload and preview dialogs

### DocumentUpload
Drag-and-drop upload interface:
- Dropzone with hover states
- File selection from file picker
- Multiple file support
- Category and metadata inputs
- Tags management
- Upload progress tracking
- Auto-clear on completion

### DocumentList (Table View)
Desktop-optimized table:
- Sortable columns
- File icon display
- Category badges
- File size and metadata
- Upload information
- Actions dropdown
- Click to preview

### DocumentGrid (Card View)
Mobile-friendly grid:
- Responsive layout (1-4 columns)
- Card-based design
- File preview icons
- Category badges
- Truncated descriptions
- Quick action buttons

### DocumentFilters
Comprehensive filtering:
- Search input with icon
- Category dropdown
- Status dropdown
- Sort options dropdown
- Clear filters button
- Responsive layout

### DocumentPreview
Full-screen preview dialog:
- PDF iframe preview
- Image preview with zoom
- Complete metadata display
- Tags and description
- Associated records
- Download and open actions
- Fallback for unsupported types

### DocumentAttachments
Embeddable widget for detail pages:
- Compact document list
- Quick view/download actions
- Upload button
- Empty state with CTA
- Auto-refresh on changes

---

## Type System

### Core Types
```typescript
export enum DocumentCategory {
  LICENSE = 'license',
  CERTIFICATE = 'certificate',
  INSPECTION_REPORT = 'inspection_report',
  APPEAL = 'appeal',
  APPLICATION = 'application',
  AFFILIATION = 'affiliation',
  COMPLIANCE = 'compliance',
  CORRESPONDENCE = 'correspondence',
  OTHER = 'other',
}

export enum DocumentStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export interface Document {
  id: string
  name: string
  fileName: string
  fileSize: number
  mimeType: string
  category: DocumentCategory
  status: DocumentStatus
  uploadedBy: string
  uploadedByName?: string
  uploadedAt: string
  updatedAt: string
  description?: string
  tags: string[]
  version: number

  // Associations
  licenseNumber?: string
  affiliationId?: string
  inspectionId?: string
  applicationId?: string

  // URLs
  downloadUrl?: string
  previewUrl?: string
}
```

### Supported File Types
- **Documents**: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Text, CSV
- **Images**: JPEG, PNG, GIF, WebP
- **Archives**: ZIP, RAR
- **Max file size**: 50MB

---

## Integration with Existing Modules

### License Detail Page
```tsx
import { DocumentAttachments } from '@/components/documents'

// In license detail component
<DocumentAttachments
  title="License Documents"
  documents={licenseDocuments}
  licenseNumber={license.licenseNumber}
  defaultCategory={DocumentCategory.LICENSE}
  onRefresh={fetchLicenseDocuments}
  allowUpload={true}
  allowDelete={true}
/>
```

### Affiliation Detail Page
```tsx
<DocumentAttachments
  title="Affiliation Documents"
  documents={affiliationDocuments}
  affiliationId={affiliation.id}
  defaultCategory={DocumentCategory.AFFILIATION}
  onRefresh={fetchAffiliationDocuments}
/>
```

### Inspection Detail Page
```tsx
<DocumentAttachments
  title="Inspection Reports"
  documents={inspectionDocuments}
  inspectionId={inspection.id}
  defaultCategory={DocumentCategory.INSPECTION_REPORT}
  onRefresh={fetchInspectionDocuments}
/>
```

---

## Backend API Integration

### Required Endpoints

**Upload Document**
```
POST /api/method/compliance_360.api.document_management.upload_document
Content-Type: multipart/form-data

Body:
- file: File
- category: string
- description?: string
- tags?: string (JSON array)
- license_number?: string
- affiliation_id?: string
- inspection_id?: string
- application_id?: string
```

**List Documents**
```
GET /api/method/compliance_360.api.document_management.list_documents

Query Parameters:
- query?: string
- category?: string
- status?: string
- tags?: string (comma-separated)
- license_number?: string
- affiliation_id?: string
- inspection_id?: string
- application_id?: string
- uploaded_by?: string
- start_date?: string (YYYY-MM-DD)
- end_date?: string (YYYY-MM-DD)
- page?: number
- page_size?: number
- sort_by?: string (name|uploadedAt|fileSize|category)
- sort_order?: string (asc|desc)
```

**Get Document**
```
GET /api/method/compliance_360.api.document_management.get_document
?document_id=DOC-001
```

**Get Document Versions**
```
GET /api/method/compliance_360.api.document_management.get_document_versions
?document_id=DOC-001
```

**Update Document**
```
PUT /api/method/compliance_360.api.document_management.update_document

Body:
{
  "document_id": "DOC-001",
  "name": "Updated name",
  "description": "Updated description",
  "category": "license",
  "tags": ["tag1", "tag2"],
  "status": "active"
}
```

**Delete Document**
```
DELETE /api/method/compliance_360.api.document_management.delete_document
?document_id=DOC-001
```

**Download Document**
```
GET /api/method/compliance_360.api.document_management.download_document
?document_id=DOC-001
```

**Preview Document**
```
GET /api/method/compliance_360.api.document_management.preview_document
?document_id=DOC-001
```

### Backend Data Format
```python
{
  "name": "DOC-001",
  "document_name": "License Certificate",
  "file_name": "license_cert.pdf",
  "file_size": 245678,
  "mime_type": "application/pdf",
  "category": "license",
  "status": "active",
  "uploaded_by": "user@example.com",
  "uploaded_by_name": "John Doe",
  "uploaded_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00",
  "description": "Official license certificate",
  "tags": ["license", "official"],
  "version": 1,
  "license_number": "LIC-2024-001",
  "download_url": "/api/download/DOC-001",
  "preview_url": "/api/preview/DOC-001"
}
```

---

## Mock Data

The system includes mock data in `documentApi.ts` for development:
- 2 sample documents (license certificate and inspection report)
- Full filtering and sorting implementation
- Pagination support
- 500ms simulated API delay

**To switch to real API**:
```typescript
// In documentStore.ts, change:
const response = await listDocumentsMock(searchParams)
// To:
const response = await listDocuments(searchParams)
```

---

## Missing Dependencies

**React Dropzone** (required for drag-and-drop upload):
```bash
npm install react-dropzone
# or
yarn add react-dropzone
```

---

## Navigation Integration

**Menu Item Added**:
- Location: AppLayout sidebar
- Position: After "Analytics", before "Modules"
- Icon: FileText
- Label: "Documents"
- Route: `/documents`

**Route Handler**:
- File: `/src/routes/documents.tsx`
- Component: `DocumentManagementView`
- Layout: `AppLayout` wrapper

---

## Usage Examples

### 1. Standalone Document Management
Navigate to `/documents` from the sidebar menu to access the full document management interface.

### 2. License Documents
Add to license detail page:
```tsx
import { DocumentAttachments } from '@/components/documents'
import { DocumentCategory } from '@/types/document'

// Fetch documents for this license
const licenseDocuments = documents.filter(
  doc => doc.licenseNumber === license.licenseNumber
)

// Render attachments
<DocumentAttachments
  title="License Documents"
  documents={licenseDocuments}
  licenseNumber={license.licenseNumber}
  defaultCategory={DocumentCategory.LICENSE}
  onRefresh={() => fetchDocuments()}
  allowUpload={true}
  allowDelete={canDeleteDocuments}
/>
```

### 3. Inspection Reports
Add to inspection detail page:
```tsx
const inspectionDocs = documents.filter(
  doc => doc.inspectionId === inspection.id
)

<DocumentAttachments
  title="Inspection Reports & Photos"
  documents={inspectionDocs}
  inspectionId={inspection.id}
  defaultCategory={DocumentCategory.INSPECTION_REPORT}
  onRefresh={() => fetchInspectionDocuments()}
  allowUpload={canUpload}
/>
```

---

## Security Considerations

### File Upload Security
1. **File type validation** - Only allow whitelisted MIME types
2. **File size limits** - Enforce 50MB maximum
3. **Virus scanning** - Implement on backend before storage
4. **Sanitize filenames** - Remove special characters and path traversal attempts

### Access Control
1. **Authentication** - Require logged-in user for all operations
2. **Authorization** - Check permissions before upload/delete/view
3. **Document ownership** - Track who uploaded each document
4. **Association validation** - Verify user has access to associated records

### Data Protection
1. **Secure storage** - Store files in protected location (not public web root)
2. **Download URLs** - Use temporary signed URLs with expiration
3. **Preview URLs** - Sanitize PDF/image content before display
4. **Audit logging** - Track all document operations

---

## Performance Optimizations

### Frontend
1. **Lazy loading** - Load document list on demand
2. **Pagination** - 20 documents per page to reduce payload
3. **Image optimization** - Compress preview thumbnails
4. **Debounced search** - 300ms delay on search input
5. **Virtual scrolling** - For large document lists (future enhancement)

### Backend
1. **CDN integration** - Serve static files from CDN
2. **Caching** - Cache document metadata and URLs
3. **Compression** - Use gzip/brotli for API responses
4. **Async uploads** - Process large files in background
5. **Thumbnail generation** - Create previews asynchronously

---

## Future Enhancements

### Phase 2
1. **Version control** - Track document versions with history
2. **Advanced search** - Full-text search in PDF content
3. **Bulk operations** - Multi-select for batch download/delete
4. **Folder organization** - Hierarchical folder structure
5. **Document expiry** - Auto-archive expired documents

### Phase 3
1. **Collaborative editing** - Real-time document collaboration
2. **E-signatures** - Digital signature support
3. **Watermarking** - Auto-watermark sensitive documents
4. **OCR** - Extract text from scanned documents
5. **Advanced preview** - Support for more file types (Word, Excel in-browser)

### Phase 4
1. **Mobile app** - Native mobile document scanner
2. **Offline mode** - Download for offline access
3. **Document workflows** - Approval workflows for document publishing
4. **Templates** - Document templates for common forms
5. **Analytics** - Document usage and access analytics

---

## Testing Recommendations

### Unit Tests
- Document type validation
- File size limit enforcement
- Search and filter logic
- Upload progress calculation

### Integration Tests
- Upload multiple files
- Filter and sort operations
- Preview different file types
- Delete and refresh operations

### E2E Tests
- Complete upload workflow
- Search and view document
- Download document
- Associate with license/affiliation

---

## Summary

**Implementation Status**: ✅ Complete

**Components Created**: 7 new components
- DocumentManagementView
- DocumentUpload
- DocumentList
- DocumentGrid
- DocumentFilters
- DocumentPreview
- DocumentAttachments

**Routes Added**: 1 new route
- `/documents`

**Store Created**: documentStore (Zustand)

**API Methods**: 8 methods defined
- uploadDocument
- listDocuments
- getDocument
- getDocumentWithVersions
- updateDocument
- deleteDocument
- getDownloadUrl
- getPreviewUrl

**Ready for**:
- ✅ Frontend development and testing (with mock data)
- ✅ Integration with existing modules
- ⏳ Backend API implementation
- ⏳ Production deployment (after `react-dropzone` installation)

The document management system is now fully functional on the frontend with comprehensive mock data, ready for backend API integration!
