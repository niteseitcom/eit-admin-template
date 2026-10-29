import { Component, input } from '@angular/core';
import { IconComponent } from './icon.component';
@Component({
  selector: 'eit-button',
  imports: [IconComponent],
  template: `@if (href()) {
      <a [href]="href()" [class]="classes" [attr.aria-label]="label() || icon()">
        @if (icon()) {
          <eit-icon [name]="icon()" />
        }
        {{ label() }}</a
      >
    } @else {
      <button
        [type]="type()"
        [class]="classes"
        [disabled]="loading() || disabled()"
        [attr.aria-label]="label() || icon()"
        [attr.aria-busy]="loading()"
      >
        @if (loading()) {
          <span class="spinner-border spinner-border-sm"></span>
        } @else if (icon()) {
          <eit-icon [name]="icon()" />
        }
        {{ label() }}
        @if (badge()) {
          <span class="badge bg-white text-primary">{{ badge() }}</span>
        }
      </button>
    }`,
})
export class ButtonComponent {
  label = input('');
  icon = input('');
  loading = input(false);
  disabled = input(false);
  href = input('');
  rounded = input(false);
  badge = input('');
  variant = input('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  get classes() {
    return `btn btn-${this.variant()} ${this.rounded() ? 'rounded-pill' : ''} ${!this.label() ? 'btn-icon' : ''}`;
  }
}
