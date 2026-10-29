import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout.component';
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'landing',
    loadChildren: () => import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'usermanagement',
        loadChildren: () =>
          import('./features/usermanagement/usermanagement.module').then(
            (m) => m.UsermanagementModule,
          ),
      },
      {
        path: 'demo',
        loadChildren: () => import('./features/demo/demo.module').then((m) => m.DemoModule),
      },
      {
        path: 'empty',
        loadChildren: () => import('./features/empty/empty.module').then((m) => m.EmptyModule),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'auth/error' },
];
