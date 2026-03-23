# Compliance-360 API Endpoints

## Affiliations APIs

### 1. Fetch Professional Affiliations
**Endpoint:** `GET /api/method/compliance_360.api.license_management.fetch_hw_affiliations.fetch_professional_affiliations`

**Query Parameters:**
- `page` (number, default: 1)
- `page_size` (number, default: 10)
- `registration_number` (string, optional)
- `license_number` (string, optional)
- `identification_number` (string, optional)
- `type_of_practice` (string, optional)
- `speciality` (string, optional)
- `health_facility` (string, optional)
- `debug_mode` (number, 0 or 1)

**Response:**
```json
{
  "affiliations": [
    {
      "id": "string",
      "role": "string",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "affiliation_status": "Active|Inactive|Pending",
      "employment_type": "string",
      "health_professional": {
        "id": "string",
        "registration_number": "string",
        "first_name": "string",
        "last_name": "string",
        "type_of_practice": "string",
        "specialty": "string",
        "professional_cadre": "string"
      },
      "health_facility": {
        "id": "string",
        "registration_number": "string",
        "facility_name": "string",
        "facility_code": "string",
        "keph_level": "string",
        "facility_type": "string"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "page_size": 10,
    "start": 0,
    "end": 10,
    "count": 100
  }
}
```

### 2. Create/Update Affiliations
**Endpoint:** `POST /api/method/compliance_360.api.license_management.create_affiliations.save_affiliations`

**Payload:**
```json
{
  "affiliation": {
    "role": "string",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "affiliation_status": "Active",
    "employment_type": "string",
    "professional": {
      "registration_number": "string",
      "first_name": "string",
      "last_name": "string"
    },
    "facility": {
      "registration_number": "string",
      "facility_name": "string"
    }
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "results": {
    "actions": [
      {
        "doctype": "Professional Record",
        "name": "PR-001",
        "action": "created|updated"
      },
      {
        "doctype": "Facility Record",
        "name": "FR-001",
        "action": "created|updated"
      },
      {
        "doctype": "Professional Affiliation",
        "name": "PA-001",
        "action": "created|updated"
      }
    ]
  }
}
```

---

## Licensing APIs

### 1. Get Health Facility Licenses
**Endpoint:** `GET /api/method/compliance_360.api.license_management.facility_license.get_health_facility_licenses`

**Query Parameters:**
- `page` (number, default: 1)
- `page_size` (number, default: 5)
- `facility_code` (string, optional)
- `facility_name` (string, optional)
- `id` (string, optional) - license ID
- `status` (string, optional) - license status
- `registration_number` (string, optional)
- `is_archived` (boolean, default: false)
- `debug_mode` (boolean, default: false)

**Response:**
```json
[
  {
    "license_number": "string",
    "registration_number": "string",
    "category": "string",
    "owner": "string",
    "facility_type": "string",
    "license_type": "string",
    "date_of_issuance": "YYYY-MM-DD",
    "date_of_expiry": "YYYY-MM-DD",
    "payment_status": "string",
    "status": "Active|Expired|Suspended|Denied|Pending",
    "is_archived": false
  }
]
```

**Pagination:** Returned in `pagination` object similar to affiliations.

### 2. Update Facility License
**Endpoint:** `PUT /api/method/compliance_360.api.license_management.facility_license.update_facility_license`

**Payload:**
```json
{
  "license_number": "string",
  "action": "APPROVE|DENY|SUSPEND|SET_EXPIRED|REVIEW|RENEWAL_REVIEW|REQUEST_INFO",
  "debug_mode": 0
}
```

**License Actions:**
- `SET_EXPIRED` → Status: EXPIRED
- `SUSPEND` → Status: SUSPENDED
- `DENY` → Status: DENIED
- `REVIEW` → Status: IN_REVIEW
- `RENEWAL_REVIEW` → Status: RENEWAL_REVIEWED
- `APPROVE` → Status: APPROVED
- `REQUEST_INFO` → Status: INFO_REQUESTED

**Response:**
```json
{
  "license_number": "string",
  "license_reference": "string",
  "license_status": "string",
  "payment_status": "string",
  "license_grouping": "Health Facility",
  "licensing_body": "string",
  "license_start_date": "YYYY-MM-DD",
  "license_end_date": "YYYY-MM-DD",
  "is_active": true,
  "is_archived": false,
  "license_fee": 0,
  "license_actioned": "string",
  "comments": [],
  "category_of_practice": "string",
  "professional_record_id": null,
  "license_type": "string",
  "facility_record_id": "string"
}
```

### 3. Fetch Facility License Applications
**Endpoint:** `GET /api/method/compliance_360.api.license_management.applications.fetch_facility_license_applications`

**Query Parameters:**
- `page` (number, default: 1)
- `page_size` (number, default: 5)
- `minimize` (number, 0 or 1, default: 1)
- `license_application_id` (string, optional)
- `application_type` (string, optional) - "New" or "Renewal"
- `health_facility` (string, optional)
- `regulatory_body` (string, optional)
- `application_status` (string, optional) - "Pending", "Issued", "Info Requested", "Denied"
- `is_paid` (boolean, optional)
- `debug_mode` (number, 0 or 1, default: 1)

**Response (minimized):**
```json
[
  {
    "facility_name": "string",
    "facility_category": "string",
    "owner": "string",
    "facility_type": "string",
    "status": "Pending|Issued|Info Requested|Denied",
    "license_application_id": "string",
    "application_type": "New|Renewal"
  }
]
```

**Response (full):**
Includes complete facility details, license information, and compliance documents.

### 4. Create License Appeal Request
**Endpoint:** `POST /api/method/compliance_360.api.license_management.facility_license_appeal_request.create_license_appeal_request`

**Payload:**
```json
{
  "appeal_info": {
    "reason_for_appeal": "string",
    "appeal_description": "string",
    "supporting_documents": []
  },
  "facility_code": "string",
  "license_number": "string"
}
```

---

## Authentication

All endpoints require:
- **Header:** `X-HIE-AGENT` (for encryption/decryption)
- **Cookie:** `sid` (Frappe session ID)

Use `debug_mode=1` to get unencrypted responses for development.

---

## Error Handling

Standard error responses:
```json
{
  "http_status_code": 400|401|500,
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (missing/invalid authentication)
- `417` - Validation Error
- `500` - Internal Server Error
