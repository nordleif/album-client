import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallbackComponent } from './auth/auth-callback/auth-callback.component';
import { AuthGuard } from './auth/auth-guard';
import { LoginComponent } from './auth/login/login.component';
import { CoverComponent } from './cover/cover.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cover' },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'cover', component: CoverComponent },
    ],
  },
  {
    path: '',
    children: [
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/callback', component: AuthCallbackComponent },
    ],
  },
  { path: '**', redirectTo: 'cover' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
