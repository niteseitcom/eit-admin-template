import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsermanagementComponent } from './usermanagement.component';
@NgModule({ imports: [RouterModule.forChild([{ path: '', component: UsermanagementComponent }])] })
export class UsermanagementModule {}
