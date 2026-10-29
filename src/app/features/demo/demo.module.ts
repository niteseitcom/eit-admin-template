import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoComponent } from './demo.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      ...['form', 'button', 'data', 'panel', 'overlay', 'menu', 'message', 'media'].map((kind) => ({
        path: kind,
        component: DemoComponent,
        data: { kind },
      })),
      { path: '', pathMatch: 'full', redirectTo: 'form' },
    ]),
  ],
})
export class DemoModule {}
