# Implementation Notes - New Incident Fields

## Summary
Added new fields to the incident creation and editing modal as per backend requirements.

## New Fields Added

### 1. Datos de Pruebas (Test Data)
- **Field Name:** `testData`
- **Type:** Text area (3 rows)
- **Required:** No
- **Placeholder:** "Datos utilizados para las pruebas"
- **Description:** Used to document the test data that was used when the bug was discovered

### 2. Evidencias (Evidence)
- **Field Name:** `evidence`
- **Type:** Text area (3 rows)
- **Required:** No
- **Placeholder:** "Evidencias del problema (enlaces, capturas, etc.)"
- **Description:** Used to provide links, screenshots, or other evidence of the issue

### 3. Comportamiento Esperado (Expected Behavior)
- **Field Name:** `expectedBehavior`
- **Type:** Text area (3 rows)
- **Required:** No
- **Placeholder:** "Comportamiento esperado del sistema"
- **Description:** Describes what the system should do (vs what it's actually doing)

### 4. Tipo de Bug (Bug Type)
- **Field Name:** `bugType`
- **Type:** Dropdown
- **Required:** No
- **Default Value:** Funcional (0)
- **Options:**
  - Funcional (0)
  - Visual (1)
  - Performance (2)
  - Seguridad (3)
  - Otro (4)

## Modal Layout

The incident creation/edit modal now has the following field order:

1. Proyecto* (Project - Required)
2. Sprint (Optional)
3. Título* (Title - Required)
4. Descripción (Description)
5. **Datos de Pruebas** (NEW)
6. **Evidencias** (NEW)
7. **Comportamiento Esperado** (NEW)
8. **Tipo de Bug** (NEW)
9. Severidad* (Severity - Required)
10. Prioridad* (Priority - Required)
11. Estado (Status - Edit mode only)
12. Etiquetas (Labels - Create mode only)
13. Asignado a (Assignee)
14. Fecha Límite (Due Date)

## Technical Implementation

### Models Updated
- `src/app/domain/models/incident.model.ts`
  - Added `BugType` enum
  - Added new fields to `Incident` interface
  - Added new fields to `IncidentWithDetails` interface

### Services Updated
- `src/app/data/services/incident.service.ts`
  - Updated `CreateIncidentRequest` interface
  - Updated `UpdateIncidentRequest` interface

### Components Updated
- `src/app/presentation/pages/incidents/incidents-list.component.ts`
  - Added `BugType` import
  - Added `bugTypes` dropdown options
  - Updated `IncidentFormData` interface
  - Updated form initialization in `onCreate()` and `onEdit()`
  - Updated API request creation in `onSaveIncident()`

- `src/app/presentation/pages/incidents/incidents-list.component.html`
  - Added four new form fields in the modal

### Enum Mappings
- `src/app/domain/models/enum-mappings.ts`
  - Added `BugTypeMapping` for Spanish labels

## Permission Handling

The new fields follow the existing permission model:
- In create mode: All fields are editable
- In edit mode: 
  - Test Data, Evidence, and Expected Behavior follow the description permission (`canUpdateDescription()`)
  - Bug Type follows the data permission (`canUpdateData()`)

## API Alignment

All changes are aligned with the backend API as defined in `openapi.json`:
- `CreateIncidentRequest` schema includes all new fields
- `UpdateIncidentRequest` schema includes all new fields
- `IncidentResponse` schema includes all new fields
- `BugType` enum is defined with values 0-4

## Build Status

✅ Application builds successfully with no errors
⚠️ Some existing warnings about bundle size and CommonJS modules (unrelated to these changes)

## Testing Recommendations

1. Create a new incident with the new fields populated
2. Edit an existing incident and update the new fields
3. Verify that the fields are saved correctly to the backend
4. Test with different BugType values
5. Verify permission-based field disabling in edit mode
6. Test field validation (all new fields are optional)
