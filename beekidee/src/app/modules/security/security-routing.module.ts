import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KidsDetailsComponent} from "./kids-details/kids-details.component";
import {AuthGuard} from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../security/security-context/security-context.component').then(c => c.SecurityContextComponent),
    children: [
      {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
      {
        path: 'sign-in',
        loadComponent: () => import('../security/sign-in/sign-in.component').then(c => c.SignInComponent)
      },
      {
        path: 'sign-up',
        loadComponent: () => import('../security/sign-up/sign-up.component').then(c => c.SignUpComponent)
      },
      {
        path: 'kids-details',
        loadComponent: () => import('../security/kids-details/kids-details.component').then(c => c.KidsDetailsComponent)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule {
}
