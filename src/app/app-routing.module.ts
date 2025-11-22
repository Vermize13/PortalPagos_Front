import { Routes } from '@angular/router';
import { NotfoundComponent } from './presentation/components/notfound/notfound.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default route - redirect to login2
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Login route (new login component)
  {
    path: 'login',
    loadComponent: () => import('./presentation/components/auth/login2/login2.component').then(m => m.LoginComponent)
  },
  
  // Legacy login routes removed: `login2` redirect and `login/legacy` were deprecated.
  
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
      { path: 'users', loadComponent: () => import('./presentation/pages/users/users-list.component').then(m => m.UsersListComponent) },
      { path: 'projects', loadComponent: () => import('./presentation/pages/projects/projects-list.component').then(m => m.ProjectsListComponent) },
      { path: 'projects/:id', loadComponent: () => import('./presentation/pages/projects/project-view.component').then(m => m.ProjectViewComponent) },
      { path: 'incidents', loadComponent: () => import('./presentation/pages/incidents/incidents-list.component').then(m => m.IncidentsListComponent) },
      { path: 'audit', loadComponent: () => import('./presentation/pages/audit/audit-list.component').then(m => m.AuditListComponent) },
      { path: 'admin', loadComponent: () => import('./presentation/pages/admin/admin.component').then(m => m.AdminComponent) },
      
      // Redirect empty path to dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  
  // Catch all other routes and redirect to not found
  { path: '**', redirectTo: '/notfound' },
];
