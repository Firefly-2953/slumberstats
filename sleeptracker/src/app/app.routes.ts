import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/sleep', pathMatch: 'full' },

  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'sleep',
        loadComponent: () => import('./pages/sleep/sleep.page').then(m => m.SleepPage),
      },
      {
        path: 'sleepiness',
        loadComponent: () => import('./pages/sleepiness/sleepiness.page').then(m => m.SleepinessPage),
      },
      {
        path: 'logs',
        loadComponent: () => import('./pages/logs/logs.page').then(m => m.LogsPage),
      },
      { path: '', redirectTo: 'sleep', pathMatch: 'full' },
    ],
  },

  // keep home temporarily if you want (optional)
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
];
