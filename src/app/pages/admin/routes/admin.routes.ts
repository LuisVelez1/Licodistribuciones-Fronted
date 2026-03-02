import { Routes } from '@angular/router';
import { AdminComponent } from '../admin';

export const ADMIN_ROUTES: Routes = [
 {
    path: '',
    component: AdminComponent,
    children: [

      { path: 'users', loadComponent: () => import('../users-list/users').then(m => m.UsersComponent)},
      { path: 'users/create', loadComponent: () => import('../create-users/create-user').then(m => m.CreateUsersComponent)},
      { path: 'users/change-email', loadComponent: () => import('../change-email/change-email').then(m => m.ChangeEmailComponent)},
      { path: 'users/change-password', loadComponent: () => import('../change-password/change-password').then(m => m.ChangePasswordComponent)},
      { path: 'users/deactivate', loadComponent: () => import('../desactivate-user/desactivate-user').then(m => m.DesactivateUserComponent)},

      { path: 'areas', loadComponent: () => import('../areas/area-list/area-list').then(m => m.AreaListComponent)},
      { path: 'areas/create', loadComponent: () => import('../areas/area-form/area-form').then(m => m.AreaFormComponent)},
      { path: 'areas/edit/:id', loadComponent: () => import('../areas/area-form/area-form').then(m => m.AreaFormComponent)},

      { path: 'areas/:areaId/agents', loadComponent: () => import('../areas/area-agent-list/area-agent-list').then(m => m.AreaAgentsComponent)},
      { path: 'areas/:areaId/agents/create', loadComponent: () => import('../areas/area-agent-form/area-agent-form').then(m => m.AreaAgentFormComponent)},
      { path: 'areas/:areaId/agents/edit/:id', loadComponent: () => import('../areas/area-agent-form/area-agent-form').then(m => m.AreaAgentFormComponent)},

      { path: 'requirements', loadComponent: () => import('../requirements/requirements-list/requirements-list').then(m => m.RequirementListComponent)},

      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  }
];
