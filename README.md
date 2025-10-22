# Sistema de Gestión de Incidencias - Frontend

Sistema web para la gestión de incidencias, proyectos y equipos de desarrollo.

## Descripción

Aplicación frontend desarrollada en Angular 18 que permite gestionar:
- **Usuarios**: Gestión de usuarios con diferentes roles (Admin, Product Owner, Developer, Tester)
- **Proyectos**: Organización de proyectos con sprints y equipos
- **Incidencias**: Creación, seguimiento y resolución de incidencias (bugs, tareas, mejoras)
- **Dashboard**: Métricas y visualización de datos del proyecto
- **Auditoría**: Registro y seguimiento de todas las acciones del sistema

## 🚀 Estado de Integración

✅ **Backend Integration Completada** - Todos los componentes principales están conectados al backend.

Ver [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) para detalles completos del progreso de integración.

### Características Implementadas
- ✅ Autenticación JWT con 2FA
- ✅ HTTP Interceptor para tokens automáticos
- ✅ Listado de usuarios con datos del backend
- ✅ Listado de proyectos con datos del backend
- ✅ Listado de incidencias con filtros
- ✅ Dashboard con métricas en tiempo real
- ✅ Registro de auditoría
- ✅ Manejo de errores con notificaciones toast
- ✅ Estados de carga en todas las vistas

## Tecnologías

- Angular 18
- PrimeNG (UI Components)
- TypeScript
- TailwindCSS & Bootstrap
- RxJS

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build:prod
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── data/              # Servicios y estados
│   │   ├── services/      # Servicios HTTP
│   │   └── states/        # Gestión de estado
│   ├── domain/            # Modelos de dominio
│   ├── guards/            # Guards de autenticación
│   └── presentation/      # Componentes y páginas
│       ├── components/    # Componentes reutilizables
│       │   ├── auth/      # Componentes de autenticación
│       │   └── sidenav/   # Navegación lateral
│       └── pages/         # Páginas principales
│           ├── dashboard/ # Dashboard con métricas
│           ├── users/     # Gestión de usuarios
│           ├── projects/  # Gestión de proyectos
│           ├── incidents/ # Gestión de incidencias
│           └── audit/     # Auditoría del sistema
```

## Desarrollo

El servidor de desarrollo se ejecuta en `http://localhost:4200/`

## Autenticación

El sistema incluye autenticación JWT con 2FA (doble factor de autenticación)

## Documentación Adicional

- [PROYECTO.md](./PROYECTO.md) - Documentación detallada del proyecto
- [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) - Estado de integración con backend
- [SERVICES.md](./SERVICES.md) - Documentación de servicios