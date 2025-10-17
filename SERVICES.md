# Services Documentation

This document describes all the Angular services generated and updated based on the OpenAPI specification (`openapi.json`).

## Generated Services

### 1. Auth Service (`auth.service.ts`)
**Location:** `src/app/data/services/auth.service.ts`

Handles authentication operations:
- `login(request: LoginRequest): Observable<AuthResponse>` - User login
- `register(request: RegisterRequest): Observable<any>` - User registration
- `me(): Observable<any>` - Get current user information

**Endpoints:**
- `POST /api/Auth/login`
- `POST /api/Auth/register`
- `GET /api/Auth/me`

### 2. Backup Service (`backup.service.ts`)
**Location:** `src/app/data/services/backup.service.ts`

Manages backup and restore operations:
- `createBackup(request: BackupRequest): Observable<BackupResponse>` - Create a new backup
- `getAllBackups(): Observable<BackupResponse[]>` - List all backups
- `getBackupById(id: string): Observable<BackupResponse>` - Get specific backup details
- `restoreBackup(request: RestoreRequest): Observable<RestoreResponse>` - Restore from backup
- `getRestoreById(id: string): Observable<RestoreResponse>` - Get restore operation status

**Endpoints:**
- `POST /api/Backup`
- `GET /api/Backup`
- `GET /api/Backup/{id}`
- `POST /api/Backup/restore`
- `GET /api/Backup/restore/{id}`

### 3. Test Service (`test.service.ts`)
**Location:** `src/app/data/services/test.service.ts`

Provides test endpoints for different authorization levels:
- `getPublic(): Observable<any>` - Public endpoint accessible without authentication
- `getProtected(): Observable<any>` - Protected endpoint requiring authentication
- `getAdminOnly(): Observable<any>` - Admin-only endpoint
- `getManagement(): Observable<any>` - Management level endpoint
- `getDevelopers(): Observable<any>` - Developers level endpoint

**Endpoints:**
- `GET /api/Test/public`
- `GET /api/Test/protected`
- `GET /api/Test/admin-only`
- `GET /api/Test/management`
- `GET /api/Test/developers`

### 4. Weather Forecast Service (`weather-forecast.service.ts`)
**Location:** `src/app/data/services/weather-forecast.service.ts`

Retrieves weather forecast data:
- `getWeatherForecast(): Observable<WeatherForecast[]>` - Get weather forecast list

**Endpoints:**
- `GET /WeatherForecast`

## Updated Services

### 5. Incident Service (`incident.service.ts`)
**Location:** `src/app/data/services/incident.service.ts`

Updated to align with OpenAPI spec using UUIDs and new endpoints:
- `getAll(filter?: IncidentFilter): Observable<IncidentWithDetails[]>` - List incidents with filters
- `getById(id: string): Observable<IncidentWithDetails>` - Get incident by ID
- `create(request: CreateIncidentRequest): Observable<Incident>` - Create incident
- `update(id: string, request: UpdateIncidentRequest): Observable<Incident>` - Update incident
- `assign(id: string, assigneeId: string): Observable<Incident>` - Assign incident to user
- `close(id: string): Observable<Incident>` - Close incident
- `getHistory(id: string): Observable<any[]>` - Get incident history
- `getComments(id: string): Observable<any[]>` - Get incident comments
- `addComment(id: string, request: AddCommentRequest): Observable<any>` - Add comment
- `addLabel(id: string, labelId: string): Observable<void>` - Add label to incident
- `removeLabel(id: string, labelId: string): Observable<void>` - Remove label from incident

**Endpoints:**
- `GET /api/Incidents`
- `POST /api/Incidents`
- `GET /api/Incidents/{id}`
- `PUT /api/Incidents/{id}`
- `POST /api/Incidents/{id}/assign/{assigneeId}`
- `POST /api/Incidents/{id}/close`
- `GET /api/Incidents/{id}/history`
- `GET /api/Incidents/{id}/comments`
- `POST /api/Incidents/{id}/comments`
- `POST /api/Incidents/{id}/labels/{labelId}`
- `DELETE /api/Incidents/{id}/labels/{labelId}`

### 6. Project Service (`project.service.ts`)
**Location:** `src/app/data/services/project.service.ts`

Updated to use UUIDs and added new endpoints:
- `getAll(): Observable<Project[]>` - List all projects
- `getById(id: string): Observable<ProjectWithMembers>` - Get project by ID
- `getByCode(code: string): Observable<Project>` - Get project by code
- `create(request: CreateProjectRequest): Observable<Project>` - Create project
- `update(id: string, request: UpdateProjectRequest): Observable<Project>` - Update project
- `delete(id: string): Observable<void>` - Delete project
- `getMembers(projectId: string): Observable<ProjectMemberDetail[]>` - Get project members
- `addMember(projectId: string, request: AddProjectMemberRequest): Observable<ProjectMemberDetail>` - Add member
- `removeMember(projectId: string, userId: string): Observable<void>` - Remove member
- `getProgress(id: string): Observable<ProjectProgressResponse>` - Get project progress metrics

**Endpoints:**
- `GET /api/Projects`
- `POST /api/Projects`
- `GET /api/Projects/{id}`
- `PUT /api/Projects/{id}`
- `DELETE /api/Projects/{id}`
- `GET /api/Projects/by-code/{code}`
- `GET /api/Projects/{id}/members`
- `POST /api/Projects/{id}/members`
- `DELETE /api/Projects/{id}/members/{userId}`
- `GET /api/Projects/{id}/progress`

### 7. Sprint Service (`sprint.service.ts`)
**Location:** `src/app/data/services/sprint.service.ts`

Updated to align with OpenAPI spec:
- `getById(id: string): Observable<Sprint>` - Get sprint by ID
- `getByProject(projectId: string): Observable<Sprint[]>` - Get sprints by project
- `create(projectId: string, request: CreateSprintRequest): Observable<Sprint>` - Create sprint
- `delete(id: string): Observable<void>` - Delete sprint
- `close(id: string): Observable<Sprint>` - Close sprint

**Endpoints:**
- `GET /api/Sprints/{id}`
- `GET /api/Sprints/by-project/{projectId}`
- `POST /api/Sprints/by-project/{projectId}`
- `DELETE /api/Sprints/{id}`
- `PATCH /api/Sprints/{id}/close`

### 8. Attachment Service (`attachment.service.ts`)
**Location:** `src/app/data/services/attachment.service.ts`

Updated to nest under incidents endpoint:
- `getByIncident(incidentId: string): Observable<AttachmentWithUser[]>` - List incident attachments
- `getById(incidentId: string, id: string): Observable<Attachment>` - Get specific attachment
- `upload(incidentId: string, file: File): Observable<Attachment>` - Upload attachment
- `download(incidentId: string, id: string): Observable<Blob>` - Download attachment
- `delete(incidentId: string, id: string): Observable<void>` - Delete attachment

**Endpoints:**
- `GET /api/incidents/{incidentId}/attachments`
- `GET /api/incidents/{incidentId}/attachments/{id}`
- `POST /api/incidents/{incidentId}/attachments`
- `GET /api/incidents/{incidentId}/attachments/{id}/download`
- `DELETE /api/incidents/{incidentId}/attachments/{id}`

### 9. User Service (`user.service.ts`)
**Location:** `src/app/data/services/user.service.ts`

Added OpenAPI endpoints while preserving existing authentication logic:
- `getAllUsers(): Observable<User[]>` - List all users
- `getUserById(id: string): Observable<User>` - Get user by ID
- `getUserByEmail(email: string): Observable<User>` - Get user by email
- Plus existing methods: login, 2FA, password recovery, etc.

**New Endpoints:**
- `GET /api/Users`
- `GET /api/Users/{id}`
- `GET /api/Users/by-email/{email}`

## Type Definitions Added

### Request/Response Types
- `LoginRequest`, `RegisterRequest`, `AuthResponse` (Auth)
- `BackupRequest`, `BackupResponse`, `RestoreRequest`, `RestoreResponse` (Backup)
- `CreateIncidentRequest`, `UpdateIncidentRequest`, `AddCommentRequest` (Incident)
- `CreateProjectRequest`, `UpdateProjectRequest`, `AddProjectMemberRequest`, `ProjectProgressResponse` (Project)
- `CreateSprintRequest` (Sprint)

### Model Extensions
- `IncidentWithDetails` - Extended incident with display information
- `ProjectWithMembers` - Project with member details
- `ProjectMemberDetail` - Member with user and role names
- `SprintWithProject` - Sprint with project information
- `AuditEntityType` - Enum for audit entity types

## Configuration

All services use the base URL from environment configuration:
```typescript
environment.url // e.g., 'http://48.217.72.0/'
```

## Usage Example

```typescript
import { AuthService, BackupService, IncidentService } from '@app/data/services';

// Login
this.authService.login({ username: 'user', password: 'pass' })
  .subscribe(response => console.log(response));

// Create backup
this.backupService.createBackup({ notes: 'Daily backup' })
  .subscribe(backup => console.log(backup));

// Get incidents
this.incidentService.getAll({ projectId: 'uuid', status: IncidentStatus.Open })
  .subscribe(incidents => console.log(incidents));
```

## Notes

- All ID parameters now use strings (UUIDs) instead of numbers to match the backend API
- All services follow Angular best practices with `providedIn: 'root'`
- All services use HttpClient for API communication
- Proper TypeScript typing for all requests and responses
- Filter interfaces for query parameters where applicable
