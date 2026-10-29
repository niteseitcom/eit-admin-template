import { Component, NgModule } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
@Component({
  imports: [RouterLink, SharedModule],
  template: `<div class="landing-page">
    <nav>
      <a class="brand" routerLink="/landing"
        ><span class="brand-mark"><eit-icon name="layout-dashboard" /></span>eit<span
          class="brand-light"
          >admin</span
        ></a
      >
      <div>
        <a href="#features">Features</a><a routerLink="/demo/form">Components</a
        ><a routerLink="/auth/login" class="btn">Sign in</a>
      </div>
    </nav>
    <section class="landing-hero">
      <span class="landing-pill"><eit-icon name="sparkles" /> BUILT WITH ANGULAR 21 + TABLER</span>
      <h1>Less setup.<br /><span>More possibilities.</span></h1>
      <p>
        The modular admin foundation for your next big idea.<br />Thoughtful components. Flexible
        themes. Ready to make your own.
      </p>
      <div class="d-flex gap-3 justify-content-center">
        <a routerLink="/dashboard" class="btn btn-primary btn-lg"
          >Explore dashboard <eit-icon name="arrow-right" /></a
        ><a routerLink="/demo/form" class="btn btn-lg">Browse components</a>
      </div>
      <div class="landing-preview">
        <div class="preview-top"><span></span><span></span><span></span></div>
        <div class="preview-content">
          <aside>
            <eit-icon name="layout-dashboard" />
            <hr />
            Overview
            <hr />
            Users
            <hr />
            Components
            <hr />
            Authentication
          </aside>
          <div>
            <h2>Your workspace, beautifully organized.</h2>
            <div class="preview-metrics">
              <div>$48,290<small>Total revenue ↗ 12.8%</small></div>
              <div>2,847<small>Happy users ↗ 8.2%</small></div>
              <div>48<small>Active projects</small></div>
            </div>
            <svg viewBox="0 0 600 120">
              <path
                d="M0 110 Q50 90 90 95 T180 65 T270 75 T360 40 T450 50 T600 10"
                fill="none"
                stroke="var(--accent)"
                stroke-width="3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
    <section id="features" class="landing-features">
      @for (f of features; track f.title) {
        <div class="card p-4">
          <eit-icon [name]="f.icon" />
          <h2>{{ f.title }}</h2>
          <p>{{ f.text }}</p>
        </div>
      }
    </section>
    <footer>© 2026 EIT Admin · Your next project starts here.</footer>
  </div>`,
})
class LandingComponent {
  features = [
    {
      icon: 'blocks',
      title: 'Modular by design',
      text: 'Lazy-loaded features and reusable shared components, organized for real development.',
    },
    {
      icon: 'palette',
      title: 'Make it yours',
      text: 'Light and dark modes, custom accent colors, and a responsive Tabler foundation.',
    },
    {
      icon: 'code',
      title: 'Ready to build',
      text: 'Auth screens, user management, data tables, and practical component examples.',
    },
  ];
}
@NgModule({ imports: [RouterModule.forChild([{ path: '', component: LandingComponent }])] })
export class LandingModule {}
