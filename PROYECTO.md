# Sistema de Gestión de Incidencias - Documentación del Proyecto

## Descripción General

Este proyecto es un sistema web de gestión de incidencias (bug tracker) desarrollado en Angular 18, diseñado para ayudar a equipos de desarrollo a gestionar proyectos, usuarios, sprints e incidencias de forma eficiente.

## Arquitectura del Sistema

### Frontend
- **Framework**: Angular 18 (Standalone Components)
- **UI Components**: PrimeNG
- **Estilos**: TailwindCSS + Bootstrap + PrimeNG Themes
- **Estado**: RxJS + Services
- **Autenticación**: JWT + 2FA

### Backend (Conexión)
- **API Base**: Configurado en `environment.ts` para conectar con backend C# (.NET)
- **Protocolo**: RESTful API con HttpClient
- **Base de Datos**: PostgreSQL (en backend)

## Estructura del Proyecto

```
src/app/
├── data/                           # Capa de datos
│   ├── services/                   # Servicios para comunicación con API
│   │   ├── user.service.ts         # Gestión de usuarios
│   │   ├── project.service.ts      # Gestión de proyectos
│   │   ├── sprint.service.ts       # Gestión de sprints
│   │   ├── incident.service.ts     # Gestión de incidencias
│   │   ├── comment.service.ts      # Comentarios en incidencias
│   │   ├── attachment.service.ts   # Archivos adjuntos
│   │   ├── audit.service.ts        # Registros de auditoría
│   │   └── toast.service.ts        # Notificaciones
│   └── states/                     # Gestión de estado
│       └── userState.service.ts    # Estado del usuario
│
├── domain/                         # Capa de dominio
│   └── models/                     # Modelos de datos
│       ├── user.model.ts           # Usuario con roles
│       ├── project.model.ts        # Proyecto
│       ├── sprint.model.ts         # Sprint
│       ├── incident.model.ts       # Incidencia
│       ├── comment.model.ts        # Comentario
│       ├── attachment.model.ts     # Archivo adjunto
│       └── audit-log.model.ts      # Registro de auditoría
│
├── guards/                         # Guards de autenticación
│   └── auth.guard.ts               # Protección de rutas
│
└── presentation/                   # Capa de presentación
    ├── components/                 # Componentes reutilizables
    │   ├── auth/                   # Componentes de autenticación
    │   │   ├── login2/             # Login principal
    │   │   ├── codigoVerificacion/ # 2FA
    │   │   ├── cambioPassword/     # Cambio de contraseña
    │   │   └── reestablecerPassword/ # Recuperación
    │   ├── sidenav/                # Menú lateral de navegación
    │   ├── notfound/               # Página 404
    │   └── shared/                 # Componentes compartidos
    │       ├── table/              # Tabla genérica
    │       └── container/          # Contenedor de página
    │
    └── pages/                      # Páginas principales
        ├── layout/                 # Layout principal con sidebar
        ├── dashboard/              # Dashboard con métricas
        ├── users/                  # Gestión de usuarios
        ├── projects/               # Gestión de proyectos
        ├── incidents/              # Gestión de incidencias
        └── audit/                  # Visualización de auditoría
```

## Modelos de Dominio

### User (Usuario)
- **Roles**: Admin, ProductOwner, Developer, Tester
- **Estados**: Active, Inactive, Suspended
- **Campos**: username, email, firstName, lastName, globalRole, status

### Project (Proyecto)
- **Estados**: Active, OnHold, Completed, Archived
- **Campos**: name, description, status, startDate, endDate, ownerId
- **Relaciones**: Miembros del proyecto con roles específicos

### Sprint
- **Estados**: Planned, Active, Completed, Cancelled
- **Campos**: name, description, startDate, endDate, status, projectId

### Incident (Incidencia)
- **Estados**: New, InProgress, InReview, Resolved, Closed, Reopened
- **Prioridades**: Low, Medium, High, Critical
- **Severidades**: Minor, Moderate, Major, Blocker
- **Campos**: title, description, status, priority, severity, projectId, sprintId, reportedById, assignedToId
- **Relaciones**: Tags, Comentarios, Archivos adjuntos

### Comment (Comentario)
- **Campos**: content, incidentId, userId, createdAt

### Attachment (Archivo Adjunto)
- **Tipos**: Image, Document, Log, Other
- **Campos**: fileName, filePath, fileSize, fileType, mimeType, incidentId, uploadedById

### AuditLog (Registro de Auditoría)
- **Acciones**: Login, Logout, Create, Update, Delete, Assign, StatusChange, FileUpload, FileDownload, Export
- **Entidades**: User, Project, Sprint, Incident, Comment, Attachment, System
- **Campos**: userId, action, entityType, entityId, description, metadata, ipAddress, createdAt

## Servicios Implementados

### ProjectService
- `getAll()`: Obtener todos los proyectos
- `getById(id)`: Obtener proyecto por ID
- `create(project)`: Crear nuevo proyecto
- `update(id, project)`: Actualizar proyecto
- `delete(id)`: Eliminar proyecto
- `getMembers(projectId)`: Obtener miembros del proyecto
- `addMember(projectId, userId, role)`: Añadir miembro
- `removeMember(projectId, userId)`: Eliminar miembro

### SprintService
- `getAll()`: Obtener todos los sprints
- `getById(id)`: Obtener sprint por ID
- `getByProject(projectId)`: Obtener sprints de un proyecto
- `create(sprint)`: Crear nuevo sprint
- `update(id, sprint)`: Actualizar sprint
- `delete(id)`: Eliminar sprint

### IncidentService
- `getAll(filter)`: Obtener incidencias con filtros opcionales
- `getById(id)`: Obtener incidencia por ID
- `create(incident)`: Crear nueva incidencia
- `update(id, incident)`: Actualizar incidencia
- `delete(id)`: Eliminar incidencia
- `updateStatus(id, status)`: Cambiar estado
- `assign(id, userId)`: Asignar a usuario
- `addTag(id, tag)`: Añadir etiqueta
- `removeTag(id, tag)`: Eliminar etiqueta
- `getMetrics()`: Obtener métricas del dashboard

### CommentService
- `getByIncident(incidentId)`: Obtener comentarios de una incidencia
- `create(comment)`: Crear comentario
- `update(id, content)`: Actualizar comentario
- `delete(id)`: Eliminar comentario

### AttachmentService
- `getByIncident(incidentId)`: Obtener archivos de una incidencia
- `upload(incidentId, file)`: Subir archivo
- `download(id)`: Descargar archivo
- `delete(id)`: Eliminar archivo

### AuditService
- `getAll(filter)`: Obtener logs con filtros opcionales
- `getById(id)`: Obtener log por ID
- `export(filter)`: Exportar logs a archivo

## Componentes Principales

### Dashboard
- Muestra métricas clave: incidencias abiertas/cerradas, proyectos activos, usuarios activos
- Cards informativos con iconos de PrimeNG
- Listo para integración con datos reales del backend

### Users List
- Tabla con usuarios del sistema
- Filtrado y paginación
- Tags de colores para roles y estados
- Acciones: Editar, Eliminar
- Botón para crear nuevo usuario

### Projects List
- Tabla con proyectos
- Filtrado y paginación
- Tags de colores para estados
- Acciones: Ver detalles, Editar, Eliminar
- Botón para crear nuevo proyecto

### Incidents List
- Tabla con incidencias
- Filtrado por estado con dropdown
- Tags de colores para estado y prioridad
- Muestra proyecto, asignado, fecha creación
- Acciones: Ver detalles, Editar, Eliminar
- Botón para crear nueva incidencia

### Audit List
- Tabla con registros de auditoría
- Muestra usuario, acción, entidad, descripción, fecha
- Tags de colores para tipo de acción
- Botón para exportar registros
- Paginación con más registros por página

## Rutas Configuradas

```typescript
/login                  -> Login principal
/login/codigo          -> Verificación 2FA
/login/reestablecer    -> Recuperación de contraseña
/login/cambio          -> Cambio de contraseña

/inicio                -> Layout principal (protegido)
  /inicio/dashboard    -> Dashboard
  /inicio/users        -> Gestión de usuarios
  /inicio/projects     -> Gestión de proyectos
  /inicio/incidents    -> Gestión de incidencias
  /inicio/audit        -> Auditoría del sistema

/notfound             -> Página 404
```

## Seguridad

- **Autenticación JWT**: Token almacenado en localStorage
- **2FA**: Doble factor de autenticación
- **Auth Guard**: Protección de rutas internas
- **Roles**: Control de acceso basado en roles (por implementar)

## Requerimientos Funcionales Cubiertos

### RF1 - Gestión de Usuarios ✅
- Modelo de usuario con roles globales
- Interfaz de listado de usuarios
- Preparado para crear, editar, eliminar usuarios

### RF2 - Gestión de Proyectos ✅
- Modelo de proyecto completo
- Interfaz de listado de proyectos
- Soporte para miembros con roles específicos
- Preparado para asociar sprints

### RF3 - Gestión de Incidencias ✅
- Modelo completo de incidencias con todos los campos requeridos
- Interfaz de listado con filtros
- Soporte para tags, comentarios, archivos adjuntos
- Estados, prioridades y severidades

### RF4 - Dashboards Dinámicos 🔄
- Dashboard básico implementado
- Listo para integrar métricas del backend

### RF5 - Auditoría ✅
- Modelo de auditoría completo
- Interfaz de visualización de logs
- Filtrado preparado
- Exportación preparada

### RF6 - Administración y Servicios ✅
- Servicio de archivos adjuntos implementado
- Preparado para gestión de backups en backend

## Requerimientos No Funcionales

### RNF1 - Seguridad ✅
- JWT implementado
- 2FA implementado
- Guards para autorización

### RNF2 - Disponibilidad y Rendimiento ✅
- Lazy loading de componentes
- Paginación en todas las tablas
- Optimización de bundle

### RNF3 - Usabilidad ✅
- Interfaz responsiva con PrimeNG
- Material Design principles
- Navegación clara con sidenav

### RNF4 - Mantenibilidad ✅
- Arquitectura en capas (data, domain, presentation)
- Componentes standalone
- Inyección de dependencias
- Servicios separados por responsabilidad

### RNF5 - Portabilidad ✅
- Compatible con navegadores modernos
- Preparado para contenedores Docker
- Configuración de entornos separada

## Estado Actual de Integración (Actualizado)

### ✅ Completado
1. **Integración con Backend**: Todos los servicios conectados con API REST del backend C#
2. **Manejo de errores y loading states**: Implementado en todos los componentes de lista
3. **Interceptores HTTP**: JWT interceptor agregado para autenticación automática
4. **Dashboard con métricas**: Mostrando datos reales del backend
5. **Toast notifications**: Sistema de notificaciones implementado
6. **Error handling**: Fallback a datos mock cuando el backend no está disponible

### 🔄 En Progreso
Las funcionalidades base están integradas con el backend. Ver `INTEGRATION_STATUS.md` para detalles completos.

## Próximos Pasos

### Funcionalidades Adicionales
1. Componentes de formularios para crear/editar entidades (Usuarios, Proyectos, Incidencias)
2. Vista detalle de incidencias con comentarios y adjuntos
3. Tablero Kanban para incidencias
4. Gráficos avanzados en dashboard
5. Filtros avanzados en todas las listas
6. Notificaciones en tiempo real

### Mejoras de UX
1. Confirmación de eliminaciones
2. Validación de formularios
3. Drag & drop para archivos
4. Búsqueda global
5. Exportación de datos

## Comandos Útiles

```bash
# Desarrollo
npm start                    # Servidor desarrollo en localhost:4200
npm run build               # Build de producción
npm run build:prod          # Build optimizado para producción
npm test                    # Ejecutar tests

# Análisis
npm run watch               # Build continuo con watch mode
```

## Dependencias Principales

- Angular 18
- PrimeNG 17.18.8
- RxJS 7.8.0
- JWT-Decode 4.0.0
- Bootstrap 5.3.3
- TailwindCSS 3.4.9

## Soporte

Para dudas o problemas, referirse a:
- Documentación de Angular: https://angular.io/docs
- Documentación de PrimeNG: https://primeng.org/
- Issues del repositorio en GitHub
