import {
  Component,
  model,
  viewChild,
  ElementRef,
  effect,
  inject,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconComponent } from './icon.component';
@Component({
  selector: 'eit-texteditor',
  imports: [IconComponent],
  template: `<div class="editor">
    <div class="editor-toolbar">
      @for (item of tools; track item[0]) {
        <button
          type="button"
          class="btn btn-sm btn-ghost-secondary"
          [attr.aria-label]="item[0]"
          (mousedown)="$event.preventDefault()"
          (click)="format(item[0])"
        >
          <eit-icon [name]="item[1]" />
        </button>
      }
    </div>
    <div
      #editor
      class="editor-body"
      contenteditable="true"
      role="textbox"
      aria-label="Rich text editor"
      aria-multiline="true"
      data-placeholder="Start writing something great…"
      (input)="value.set(editor.innerHTML)"
    ></div>
  </div>`,
})
export class TexteditorComponent {
  value = model('');
  editor = viewChild<ElementRef<HTMLElement>>('editor');
  private sanitizer = inject(DomSanitizer);
  constructor() {
    effect(() => {
      const element = this.editor()?.nativeElement;
      const safe = this.sanitizer.sanitize(SecurityContext.HTML, this.value()) || '';
      if (element && element.innerHTML !== safe) element.innerHTML = safe;
    });
  }
  tools = [
    ['bold', 'bold'],
    ['italic', 'italic'],
    ['underline', 'underline'],
    ['insertUnorderedList', 'list'],
    ['insertOrderedList', 'list-numbers'],
    ['removeFormat', 'clear-formatting'],
  ];
  format(command: string) {
    this.editor()?.nativeElement.focus();
    document.execCommand(command);
    this.value.set(this.editor()?.nativeElement.innerHTML || '');
  }
}
