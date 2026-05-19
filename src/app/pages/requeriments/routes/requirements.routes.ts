import { Routes } from '@angular/router';
import { RequerimentsComponent } from '../requeriments';

export const REQUIREMENTS_ROUTES: Routes = [
  {
    path: '',
    component: RequerimentsComponent,
    children: [
      {
        path: 'create',
        loadComponent: () => import('../pages/create/create').then(m => m.CreateRequerimentComponent)
      },
      {
        path: 'my-requeriments',
        loadComponent: () => import('../pages/my-requeriments/my-requeriments').then(m => m.MyRequerimentsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('../pages/reports/reports').then(m => m.ReportsComponent)
      },
      {
        path: 'agents',
        loadComponent: () => import('../pages/agents/agents').then(m => m.AgentsComponent)
      },
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full'
      }
    ]
  }
];