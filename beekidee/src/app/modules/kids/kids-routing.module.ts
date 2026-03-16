import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/kids-context/kids-context.component').then(c => c.KidsContextComponent),
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'playground', pathMatch: 'full'},
      {
        path: 'playground',
        loadComponent: () => import('./components/kids-dashboard/kids-dashboard.component').then(c => c.KidsDashboardComponent)
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KidsRoutingModule {
}
