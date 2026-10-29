import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'eit-datepicker',
  imports: [FormsModule],
  template: `<input
    class="form-control"
    type="date"
    [attr.aria-label]="label()"
    [min]="min()"
    [max]="max()"
    [ngModel]="value()"
    (ngModelChange)="value.set($event)"
  />`,
})
export class DatepickerComponent {
  value = model('');
  label = input('Choose date');
  min = input('');
  max = input('');
}
