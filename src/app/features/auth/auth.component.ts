import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
@Component({
  selector: 'eit-auth',
  imports: [RouterLink, FormsModule, SharedModule],
  template: `<div class="auth-page">
    <a routerLink="/dashboard" class="brand"
      ><span class="brand-mark"><eit-icon name="layout-dashboard" /></span>eit<span
        class="brand-light"
        >admin</span
      ></a
    >
    <section class="auth-card card">
      <span class="auth-symbol"
        ><eit-icon
          [name]="
            kind === 'error'
              ? 'alert-triangle'
              : kind === 'access-denied'
                ? 'lock'
                : kind === 'mfa'
                  ? 'shield-check'
                  : 'fingerprint'
          "
      /></span>
      <div class="eyebrow">
        {{
          kind === 'error'
            ? 'ERROR 404'
            : kind === 'access-denied'
              ? 'ERROR 403'
              : 'YOUR WORKSPACE AWAITS'
        }}
      </div>
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <div class="alert alert-info">
        Template preview — no real authentication or email delivery.
      </div>
      @if (kind === 'error' || kind === 'access-denied') {
        <a routerLink="/dashboard" class="btn btn-primary w-100">Back to dashboard</a>
      } @else {
        <form #form="ngForm" (ngSubmit)="form.valid && submit()">
          @if (kind === 'register') {
            <label class="form-label" for="fullName">Full name</label
            ><input
              id="fullName"
              class="form-control mb-3"
              name="name"
              [(ngModel)]="name"
              required
              placeholder="Your name"
            />
          }
          @if (kind === 'login' || kind === 'register' || kind === 'forgot-password') {
            <label class="form-label" for="email">Email address</label
            ><input
              id="email"
              class="form-control mb-3"
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="you@company.com"
            />
          }
          @if (
            kind === 'login' ||
            kind === 'register' ||
            kind === 'new-password' ||
            kind === 'lock-screen'
          ) {
            <label class="form-label" for="password">{{
              kind === 'new-password' ? 'New password' : 'Password'
            }}</label
            ><input
              id="password"
              class="form-control mb-3"
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="8"
              placeholder="At least 8 characters"
            />
          }
          @if (kind === 'new-password') {
            <label class="form-label" for="confirm">Confirm password</label
            ><input
              id="confirm"
              class="form-control mb-3"
              type="password"
              name="confirm"
              [(ngModel)]="confirm"
              required
            />
          }
          @if (kind === 'verification' || kind === 'mfa') {
            <label class="form-label" for="code">6-digit verification code</label
            ><input
              id="code"
              class="form-control mb-3 code-input"
              name="code"
              [(ngModel)]="code"
              required
              pattern="[0-9]{6}"
              maxlength="6"
              inputmode="numeric"
              placeholder="000000"
            />
          }
          @if (kind === 'login') {
            <div class="d-flex justify-content-between mb-4">
              <label><input type="checkbox" /> Remember me</label
              ><a routerLink="/auth/forgot-password">Forgot password?</a>
            </div>
          }
          @if (error()) {
            <p class="text-danger" role="alert">{{ error() }}</p>
          }
          <eit-button
            [label]="action"
            type="submit"
            [loading]="busy()"
            [disabled]="form.invalid || false"
          />
          <div class="mt-3">
            @if (message()) {
              <div class="alert alert-success" role="status">{{ message() }}</div>
            }
          </div>
        </form>
        <div class="auth-links">
          @if (kind === 'login') {
            Don't have an account? <a routerLink="/auth/register">Create account</a>
          } @else {
            <a routerLink="/auth/login">Back to sign in</a>
          }
        </div>
      }
    </section>
    <a routerLink="/dashboard" class="text-secondary mt-4">← Return to workspace</a>
  </div>`,
})
export class AuthComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  kind = this.route.snapshot.data['kind'] as string;
  email = '';
  password = '';
  confirm = '';
  code = '';
  name = '';
  message = signal('');
  error = signal('');
  busy = signal(false);
  get title() {
    return (
      {
        login: 'Welcome back',
        register: 'Create your account',
        'forgot-password': 'Forgot your password?',
        'new-password': 'Set a new password',
        verification: 'Check your email',
        mfa: 'Two-step verification',
        'lock-screen': 'Your workspace is locked',
        'access-denied': 'Access denied',
        error: 'Page not found',
      } as Record<string, string>
    )[this.kind];
  }
  get description() {
    return (
      {
        login: 'Sign in to continue to your EIT workspace.',
        register: 'Start building your next great project.',
        'forgot-password': 'Enter your email to request a password reset.',
        'new-password': 'Choose a strong password for your account.',
        verification: 'Enter the six-digit code sent to your inbox.',
        mfa: 'Enter the code from your authenticator app.',
        'lock-screen': 'Enter your password to resume your session.',
        'access-denied': 'You do not have permission to view this resource.',
        error: 'The page you are looking for could not be found.',
      } as Record<string, string>
    )[this.kind];
  }
  get action() {
    return (
      {
        login: 'Sign in',
        register: 'Create account',
        'forgot-password': 'Send reset link',
        'new-password': 'Update password',
        verification: 'Verify email',
        mfa: 'Verify code',
        'lock-screen': 'Unlock workspace',
      } as Record<string, string>
    )[this.kind];
  }
  submit() {
    this.error.set('');
    if (this.kind === 'new-password' && this.password !== this.confirm) {
      this.error.set('Passwords do not match.');
      return;
    }
    this.busy.set(true);
    setTimeout(() => {
      this.busy.set(false);
      if (['login', 'lock-screen', 'mfa', 'verification'].includes(this.kind)) {
        this.router.navigateByUrl('/dashboard');
      } else if (this.kind === 'register') {
        this.router.navigateByUrl('/auth/verification');
      } else
        this.message.set(
          this.kind === 'forgot-password'
            ? 'Demo: reset request received. Open New password from the authentication menu to preview the next step.'
            : 'Demo: password updated. You can return to sign in.',
        );
    }, 600);
  }
}
