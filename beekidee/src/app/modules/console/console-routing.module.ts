import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "@angular/fire/auth-guard";
import * as path from "node:path";
// import {authGuard} from "../../guards/auth.guard";

const routes: Routes = [
  {path: '', redirectTo: 'admin', pathMatch: 'full'},
  {
    path: 'admin',
    loadComponent: () => import('./components/console-context/console-context.component').then(c => c.ConsoleContextComponent),
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadComponent: () => import('./components/console-dashboard/console-dashboard.component').then(c => c.ConsoleDashboardComponent),
        children: [
          {path: '', redirectTo: 'overview', pathMatch: 'full'},
          {
            path: 'overview',
            loadComponent: () => import('./components/console-dashboard/components/dashboard/dashboard.component').then(c => c.DashboardComponent)
          },
          {
            path: 'constructivism',
            loadComponent: () => import('./components/console-dashboard/components/constructivism/constructivism.component').then(c => c.ConstructivismComponent),
            children: [
              {
                path: '',
                loadComponent: () => import('./components/console-dashboard/components/constructivism/levels/constructivism-level-context/constructivism-level-context.component').then(c => c.ConstructivismLevelContextComponent),
                children: [
                  {path: '', redirectTo: 'pre-intermediate', pathMatch: 'full'},
                  {
                    path: 'pre-intermediate',
                    loadComponent: () => import('./components/console-dashboard/components/constructivism/levels/pre-intermediate-level/pre-intermediate-level.component').then(c => c.PreIntermediateLevelComponent)
                  },
                  {
                    path: 'intermediate',
                    loadComponent: () => import('./components/console-dashboard/components/constructivism/levels/intermediate-level/intermediate-level.component').then(c => c.IntermediateLevelComponent)
                  },
                ]
              },
            ]
          },
          {
            path: 'constructivism-plus-attention',
            loadComponent: () => import('./components/console-dashboard/components/constructivism-plus-attention/constructivism-plus-attention.component').then(c => c.ConstructivismPlusAttentionComponent),
            children: [
              {
                path: '',
                loadComponent: () => import('./components/console-dashboard/components/constructivism-plus-attention/levels/constructivism-plus-attention-level-context/constructivism-plus-attention-level-context.component').then(c => c.ConstructivismPlusAttentionLevelContextComponent),
                children: [
                  {path: '', redirectTo: 'pre-intermediate', pathMatch: 'full'},
                  {
                    path: 'pre-intermediate',
                    loadComponent: () => import('./components/console-dashboard/components/constructivism-plus-attention/levels/pre-intermediate-level/pre-intermediate-level.component').then(c => c.PreIntermediateLevelComponent)
                  },
                  {
                    path: 'intermediate',
                    loadComponent: () => import('./components/console-dashboard/components/constructivism-plus-attention/levels/intermediate-level/intermediate-level.component').then(c => c.IntermediateLevelComponent)
                  },
                ]
              },
            ]
          },
          {
            path: 'lecture-material',
            loadComponent: () => import('./components/lecture-material-list/lecture-material-list.component').then(c => c.LectureMaterialListComponent)
          },
        ]
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleRoutingModule {
}
