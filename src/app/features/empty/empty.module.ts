import { Component, NgModule } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
@Component({
  imports: [RouterLink, SharedModule],
  template: `<div class="page-heading">
      <div>
        <div class="eyebrow">YOUR NEXT CHAPTER</div>
        <h1>Empty page</h1>
        <p>A clean canvas for your next module.</p>
      </div>
    </div>
    <section class="card empty-state">
      <span class="auth-symbol"><eit-icon name="files" /></span>
      <h2>Make room for something great.</h2>
      <p>Start with this page and build your own feature.</p>
      <a class="btn btn-primary" routerLink="/demo/form">Explore components</a>
    </section>`,
})
class EmptyComponent {}
@NgModule({ imports: [RouterModule.forChild([{ path: '', component: EmptyComponent }])] })
export class EmptyModule {}
