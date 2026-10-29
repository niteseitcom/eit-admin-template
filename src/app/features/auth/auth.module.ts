import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
const pages = [
  'login',
  'error',
  'access-denied',
  'forgot-password',
  'lock-screen',
  'new-password',
  'register',
  'verification',
  'mfa',
];
@NgModule({
  imports: [
    RouterModule.forChild([
      ...pages.map((kind) => ({ path: kind, component: AuthComponent, data: { kind } })),
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ]),
  ],
})
export class AuthModule {}
