import { Routes } from '@angular/router';
import { NotfoundComponent } from './presentation/components/notfound/notfound.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default route - redirect to login2
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // New login2 route
  {
    path: 'login',
    loadComponent: () => import('./presentation/components/auth/login2/login2.component').then(m => m.Login2Component)
  },
  
  // Legacy login routes (keep for backward compatibility)
  { path: 'login2', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login/legacy', loadComponent: () => import('./presentation/components/auth/inicioSesion/inicioSesion.component').then(m => m.InicioSesionComponent) },
  
  // Other auth routes
  { path: 'login/codigo', loadComponent: () => import('./presentation/components/auth/codigoVerificacion/codigoVerificacion.component').then(m => m.CodigoVerificacionComponent) },
  { path: 'login/reestablecer/:id', loadComponent: () => import('./presentation/components/auth/reestablecerPassword/reestablecerPassword.component').then(m => m.ReestablecerPasswordComponent) },
  { path: 'login/cambio', loadComponent: () => import('./presentation/components/auth/cambioPassword/cambioPassword.component').then(m => m.CambioPasswordComponent) },
  
  // Not found route
  { path: 'notfound', component: NotfoundComponent },
  
  // Main application route (protected by auth guard)
  {
    path: 'inicio',
    loadComponent: () => import('../app/presentation/pages/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      { path: 'pdfCertification', loadComponent: () => import('./presentation/components/pdfCertification/pdfCertification.component').then(m => m.PdfCertificationComponent) },
      { path: 'contratista', loadComponent: () => import('./presentation/components/contratista/consultarContratista/consultarContratista.component').then(m => m.ConsultarContratistaComponent) },
      { path: 'crearPerfil', loadComponent: () => import('./presentation/components/crearPerfil/crearPerfil.component').then(m => m.CrearPerfilComponent) },
      { path: 'asociarPermisos', loadComponent: () => import('./presentation/components/asociarPermisos/asociarPermisos.component').then(m => m.AsociarPermisosComponent) },
      
      // Redirect empty path to a default dashboard or home component
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  
  // Catch all other routes and redirect to not found
  { path: '**', redirectTo: '/notfound' },
];
