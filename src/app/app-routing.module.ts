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
      { path: 'dashboard', loadComponent: () => import('./presentation/pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      
      // Redirect empty path to dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  
  // Catch all other routes and redirect to not found
  { path: '**', redirectTo: '/notfound' },
];
