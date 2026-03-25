# PR: UI/UX Improvements — Tables, Dashboard, and Dark Mode

## Summary

Comprehensive UI/UX improvements to the Careverse Regulator frontend, covering table consistency, dark mode theming, affiliations management, and an enhanced interactive dashboard.

## Changes

### Table Improvements
- **Sticky columns**: First two columns in Facilities and Professionals tables remain pinned when scrolling horizontally, with a subtle right border on the second column for visual separation.
- **Standardized pagination**: All 7 table components (Facilities, Professionals, Inspections, Findings, Audit Log, Facility Licenses, Professional Licenses) now share a consistent pagination pattern — page size selector, "Page X of Y" label, and first/prev/next/last icon buttons.

### Dark Mode Theming
- **Link colors**: `EntityLink` now renders in bright green (`dark:text-green-400`) in dark mode for better contrast.
- **Sidebar active item**: Selected sidebar item uses green text in dark mode.
- **StatusDistribution donut**: Center circle uses `fill-card` instead of hardcoded white — works in both themes.

### Affiliations List Page (`/affiliations/list`)
- New full-featured list page built with TanStack Table — columns for professional (with EntityLink), registration number, facility, role, employment type, start date, status, and actions.
- Filter dropdowns for Role, Employment Type, and Status; global search across all columns.
- Row selection with checkboxes and CSV/PDF export of selected or filtered rows.
- Consistent sticky columns and pagination matching the Facilities page.

### Affiliations Dashboard (`/affiliations`)
- **8 metric cards** in 2 rows: Total, Active (with % trend), Pending, Rejected, Unique Professionals, Facilities with Affiliations, Confirmed, Inactive.
- **Interactive trend chart** (new): Full-width SVG line chart with two series — solid emerald line for active affiliations, dashed blue line for new affiliations. ResizeObserver-based sizing fills the card width. Mouse hover shows a vertical guide line with a floating tooltip displaying full month name, active count, and new count. Data points enlarge on hover. Gradient area fill under the active line. 12-month window.
- **Employment type donut chart**: Breakdown of Full-time, Part-time, Consultant, Volunteer, Intern, Locum with percentages.
- **Top roles bar chart**: Horizontal bars showing the 10 most common roles.
- **Facility staffing chart**: Stacked bars per facility showing active vs total affiliations, with legend.
- **Multi-affiliated professionals**: Table listing professionals with more than one affiliation, with badge count.
- Retained: status distribution donut, pending review section, quick actions.

### Backend (`compliance_360`)
- `get_affiliation_dashboard_stats` expanded to return: `confirmed`, `inactive`, `unique_professionals`, `unique_facilities`, `employment_type_distribution`, `role_distribution`, `facility_staffing`, `multi_affiliated_professionals`.
- Trend data extended to 12 months and now returns both `new` (affiliations started that month) and `active` (affiliations active at month end), plus `full_label` (e.g. "March 2026").

### API Integration Fixes
- `listAffiliations` — fixed response parsing to handle `api_response_formatter` (no `message` wrapper) and empty data (`[]` vs `{affiliations, pagination}`).
- `TrendChart` SVG — fixed viewBox/coordinate system mismatch that caused the chart to render incorrectly.

## Files Changed

### Frontend (`apps/careverse_regulator/frontend/src/`)
| File | Change |
|------|--------|
| `api/affiliationApi.ts` | Extended `AffiliationDashboardStats` type, fixed response parsing |
| `components/AppLayout.tsx` | Dark mode green for active sidebar item |
| `components/affiliations/AffiliationsDashboard.tsx` | Rewritten — 8 metrics, interactive trend chart, 4 new chart sections |
| `components/affiliations/AffiliationsListTable.tsx` | **New** — TanStack Table list with filters, selection, export |
| `components/affiliations/FacilitiesTable.tsx` | Sticky columns, standardized pagination |
| `components/affiliations/ProfessionalsTable.tsx` | Sticky columns, standardized pagination |
| `components/audit/AuditLogViewer.tsx` | Standardized pagination |
| `components/dashboard/StatusDistribution.tsx` | Theme-aware donut center (`fill-card`) |
| `components/dashboard/TrendChart.tsx` | Fixed SVG coordinate system |
| `components/entities/EntityLink.tsx` | Dark mode green link color |
| `components/inspection/FindingsTable.tsx` | Standardized pagination |
| `components/inspection/InspectionTable.tsx` | Standardized pagination |
| `components/inspection/PaginationControls.tsx` | Rewritten — icon buttons, page size |
| `components/licensing/LicensesListView.tsx` | Always show pagination |
| `components/licensing/PaginationControls.tsx` | Rewritten — icon buttons, page size |
| `routes/affiliations/list.tsx` | Loader-based route for AffiliationsListTable |

### Backend (`apps/compliance_360/`)
| File | Change |
|------|--------|
| `compliance_360/api/license_management/fetch_hw_affiliations.py` | Expanded dashboard stats endpoint with 6 new data sections, 12-month trend with active/new series |

## Testing

- [ ] Visit `/affiliations` — verify 8 metric cards, interactive trend chart with hover tooltips, all chart sections render
- [ ] Visit `/affiliations/list` — verify table loads, filters work, pagination works, export works
- [ ] Visit `/affiliations/facilities` and `/affiliations/professionals` — verify sticky columns and pagination
- [ ] Visit `/license-management/licenses` — verify pagination on both tabs
- [ ] Toggle dark mode — verify green links, sidebar color, donut centers, chart readability
- [ ] Scroll tables horizontally — verify first 2 columns remain sticky
