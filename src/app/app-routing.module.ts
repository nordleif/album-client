import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './auth/auth-callback/auth-callback.component';
import { CoverComponent } from './cover/cover.component';
import { AuthGuard } from './auth/auth-guard';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'auth/callback', component: AuthCallbackComponent },
    ],
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'cover', component: CoverComponent },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'cover' },
  { path: '**', redirectTo: 'cover' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
