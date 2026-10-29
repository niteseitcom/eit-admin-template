import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  dark = signal(localStorage.getItem('eit-dark') === 'true');
  accent = signal(localStorage.getItem('eit-accent') || '#206bc4');
  constructor() {
    this.apply();
  }
  toggle() {
    this.dark.update((v) => !v);
    this.apply();
  }
  color(value: string) {
    this.accent.set(value);
    this.apply();
  }
  private apply() {
    document.documentElement.setAttribute('data-bs-theme', this.dark() ? 'dark' : 'light');
    document.documentElement.style.setProperty('--accent', this.accent());
    document.documentElement.style.setProperty('--tblr-primary', this.accent());
    localStorage.setItem('eit-dark', String(this.dark()));
    localStorage.setItem('eit-accent', this.accent());
  }
}
