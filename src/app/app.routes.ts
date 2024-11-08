import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'cheque-printing',
    loadComponent: () =>
      import('./master/master.component').then((m) => m.MasterComponent),
    pathMatch: 'full',
  },
  {
    path: 'cheque-print-settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
    pathMatch: 'full',
  },
];
