import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ThemeService } from './theme.service';
@Component({
  selector: 'eit-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, SharedModule],
  template: ` <div class="admin-shell" [class.mobile-open]="mobile()">
    <aside class="sidebar">
      <a class="brand" routerLink="/dashboard"
        ><span class="brand-mark"><eit-icon name="layout-dashboard" /></span>eit<span
          class="brand-light"
          >admin</span
        ><span class="version">v1.0</span></a
      >
      <div class="workspace-switch">
        <span class="workspace-logo">E</span>
        <div><strong>EIT Workspace</strong><small>Pro workspace</small></div>
        <eit-icon name="selector" />
      </div>
      <div class="nav-label">WORKSPACE</div>
      <nav>
        @for (item of main; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="active" (click)="mobile.set(false)"
            ><eit-icon [name]="item.icon" /><span>{{ item.label }}</span>
            @if (item.badge) {
              <span class="nav-badge">{{ item.badge }}</span>
            }
          </a>
        }
        <div class="nav-label">BUILD & EXPLORE</div>
        <button class="nav-toggle" (click)="demoOpen.set(!demoOpen())">
          <eit-icon name="components" /><span>UI components</span
          ><eit-icon [name]="demoOpen() ? 'chevron-down' : 'chevron-right'" />
        </button>
        @if (demoOpen()) {
          <div class="subnav">
            @for (item of demos; track item.path) {
              <a
                [routerLink]="'/demo/' + item.path"
                routerLinkActive="active"
                (click)="mobile.set(false)"
                >{{ item.label }}</a
              >
            }
          </div>
        }
        <button class="nav-toggle" (click)="authOpen.set(!authOpen())">
          <eit-icon name="shield-lock" /><span>Authentication</span
          ><eit-icon [name]="authOpen() ? 'chevron-down' : 'chevron-right'" />
        </button>
        @if (authOpen()) {
          <div class="subnav">
            @for (path of authPages; track path) {
              <a [routerLink]="'/auth/' + path">{{ path.replaceAll('-', ' ') }}</a>
            }
          </div>
        }
        <a routerLink="/empty" routerLinkActive="active"
          ><eit-icon name="file" /><span>Empty page</span></a
        ><a routerLink="/landing"
          ><eit-icon name="rocket" /><span>Landing page</span><eit-icon name="arrow-up-right"
        /></a>
      </nav>
      <div class="sidebar-bottom">
        <div class="starter-card">
          <span class="starter-icon"><eit-icon name="sparkles" /></span
          ><strong>Your next big idea starts here.</strong>
          <p>A modular foundation. Endless possibilities.</p>
          <a routerLink="/demo/form">Explore components <eit-icon name="arrow-right" /></a>
        </div>
        <a class="sidebar-help" href="https://tabler.io/docs" target="_blank" rel="noopener"
          ><eit-icon name="book-2" />Documentation<eit-icon name="external-link"
        /></a>
        <div class="sidebar-status"><span></span>All systems operational</div>
      </div>
    </aside>
    <div class="main-shell">
      <header class="topbar">
        <div class="header-left">
          <button
            class="btn btn-icon btn-ghost-secondary mobile-toggle"
            aria-label="Toggle navigation"
            (click)="mobile.set(!mobile())"
          >
            <eit-icon name="menu-2" /></button
          ><span class="breadcrumb-home"><eit-icon name="home" /></span
          ><span class="text-secondary">/</span><span>Workspace</span
          ><span class="text-secondary">/</span><strong>{{ pageTitle }}</strong>
        </div>
        <div class="header-actions">
          <span class="environment"><span></span>Development</span
          ><button
            class="header-icon"
            aria-label="Customize theme"
            (click)="customize.set(!customize())"
          >
            <eit-icon name="palette" /></button
          ><button class="header-icon" aria-label="Toggle dark mode" (click)="theme.toggle()">
            <eit-icon [name]="theme.dark() ? 'sun' : 'moon'" /></button
          ><button
            class="header-icon notification-button"
            aria-label="Notifications"
            (click)="notifications.set(!notifications())"
          >
            <eit-icon name="bell" /><b></b></button
          ><span class="header-divider"></span
          ><a routerLink="/auth/lock-screen" class="profile"
            ><span class="profile-avatar">NT</span>
            <div><strong>Nites T.</strong><small>Administrator</small></div>
            <eit-icon name="chevron-down"
          /></a>
        </div>
      </header>
      @if (customize()) {
        <section class="floating-panel theme-panel">
          <h3>Make it yours</h3>
          <p>Choose your workspace accent.</p>
          <div class="swatches">
            @for (color of colors; track color) {
              <button
                [style.background]="color"
                [attr.aria-label]="'Use ' + color + ' theme'"
                [class.selected]="theme.accent() === color"
                (click)="theme.color(color)"
              ></button>
            }
          </div>
          <button class="btn w-100 mt-3" (click)="theme.toggle()">
            Switch to {{ theme.dark() ? 'light' : 'dark' }} mode
          </button>
        </section>
      }
      @if (notifications()) {
        <section class="floating-panel">
          <h3>You're all caught up</h3>
          <p>Your workspace is ready. Start building something great.</p>
          <button class="btn btn-sm" (click)="notifications.set(false)">Dismiss</button>
        </section>
      }
      <main class="content"><router-outlet /></main>
      <footer class="app-footer">
        <span>© 2026 EIT Admin. Built for what's next.</span>
        <div>
          <a routerLink="/demo/form">Components</a
          ><a href="https://github.com/tabler/tabler" target="_blank" rel="noopener">Tabler</a
          ><span>Made with <span class="heart">♡</span> & Angular</span
          ><span class="angular-tag">Angular 21</span>
        </div>
      </footer>
    </div>
  </div>`,
})
export class LayoutComponent {
  router = inject(Router);
  get pageTitle() {
    const key = this.router.url.split('/').filter(Boolean).pop() || 'dashboard';
    return (
      (
        {
          dashboard: 'Overview',
          usermanagement: 'User management',
          form: 'Forms & inputs',
          button: 'Buttons',
          data: 'Data tables',
          panel: 'Panels & cards',
          overlay: 'Overlays',
          menu: 'Menus',
          message: 'Messages',
          media: 'Media',
          empty: 'Empty page',
        } as Record<string, string>
      )[key] || key
    );
  }
  theme = inject(ThemeService);
  mobile = signal(false);
  demoOpen = signal(false);
  authOpen = signal(false);
  customize = signal(false);
  notifications = signal(false);
  colors = ['#206bc4', '#7c3aed', '#0d9488', '#e8590c', '#db2777', '#334155'];
  main = [
    { path: '/dashboard', icon: 'layout-dashboard', label: 'Overview', badge: '' },
    { path: '/usermanagement', icon: 'users', label: 'User management', badge: '32' },
  ];
  demos = [
    { path: 'form', label: 'Forms & inputs' },
    { path: 'button', label: 'Buttons' },
    { path: 'data', label: 'Data tables' },
    { path: 'panel', label: 'Panels & cards' },
    { path: 'overlay', label: 'Overlays' },
    { path: 'menu', label: 'Menus' },
    { path: 'message', label: 'Messages' },
    { path: 'media', label: 'Media' },
  ];
  authPages = [
    'login',
    'register',
    'forgot-password',
    'new-password',
    'verification',
    'mfa',
    'lock-screen',
    'access-denied',
    'error',
  ];
}
