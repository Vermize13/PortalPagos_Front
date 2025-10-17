# Sistema de Gestión de Incidencias - Frontend

Sistema web para la gestión de incidencias, proyectos y equipos de desarrollo.

## Descripción

Aplicación frontend desarrollada en Angular 18 que permite gestionar:
- **Usuarios**: Gestión de usuarios con diferentes roles (Admin, Product Owner, Developer, Tester)
- **Proyectos**: Organización de proyectos con sprints y equipos
- **Incidencias**: Creación, seguimiento y resolución de incidencias (bugs, tareas, mejoras)
- **Dashboard**: Métricas y visualización de datos del proyecto
- **Auditoría**: Registro y seguimiento de todas las acciones del sistema

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
│   ├── domain/            # Modelos de dominio
│   ├── guards/            # Guards de autenticación
│   └── presentation/      # Componentes y páginas
│       ├── components/    # Componentes reutilizables
│       └── pages/         # Páginas principales
```

## Desarrollo

El servidor de desarrollo se ejecuta en `http://localhost:4200/`

## Autenticación

El sistema incluye autenticación JWT con 2FA (doble factor de autenticación)