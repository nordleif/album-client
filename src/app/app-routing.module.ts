import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AuthGuard } from './auth-guard';
import { CoverComponent } from './cover/cover.component';
import { LoginComponent } from './login/login.component';

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
