import { NgModule } from '@angular/core';
import { ButtonComponent } from './button.component';
import { DatepickerComponent } from './datepicker.component';
import { DatatableComponent } from './datatable.component';
import { TexteditorComponent } from './texteditor.component';
import { IconComponent } from './icon.component';
const components = [
  ButtonComponent,
  DatepickerComponent,
  DatatableComponent,
  TexteditorComponent,
  IconComponent,
];
@NgModule({ imports: components, exports: components })
export class SharedModule {}
