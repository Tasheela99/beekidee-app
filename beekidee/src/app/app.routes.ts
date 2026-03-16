import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'',redirectTo:'security',pathMatch:'full'},
    {path:'security',loadChildren:()=>import('./modules/security/security.module').then(m=>m.SecurityModule)},
    {path:'console',loadChildren:()=>import('./modules/console/console.module').then(m=>m.ConsoleModule)},
    {path:'kids',loadChildren:()=>import('./modules/kids/kids.module').then(m=>m.KidsModule)},
    {path:'**',loadComponent:()=>import('./components/not-found/not-found.component').then(c=>c.NotFoundComponent)}
];
