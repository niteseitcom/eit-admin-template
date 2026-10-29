import { Component, input } from '@angular/core';
@Component({
  selector: 'eit-icon',
  template: '<i [class]="\'ti ti-\' + name()" aria-hidden="true"></i>',
  styles: ':host { display:inline-flex; align-items:center; font-size:21px; line-height:1; }',
})
export class IconComponent {
  name = input('circle');
}
