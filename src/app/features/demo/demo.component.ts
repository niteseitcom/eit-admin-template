import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { users } from '../../core/demo-data';
import { TableColumn, TableQuery, TableRow } from '../../shared/datatable.component';
import { queryPage } from '../../shared/table-query';
@Component({ imports: [SharedModule, FormsModule, RouterLink], templateUrl: './demo.html' })
export class DemoComponent {
  route = inject(ActivatedRoute);
  kind = this.route.snapshot.data['kind'];
  titles: Record<string, string> = {
    form: 'Forms & inputs',
    button: 'Buttons',
    data: 'Data tables',
    panel: 'Panels & cards',
    overlay: 'Overlays',
    menu: 'Menus',
    message: 'Messages',
    media: 'Media',
  };
  busy = signal(false);
  notice = signal('');
  modal = signal(false);
  drawer = signal(false);
  menu = signal(false);
  tab = signal('Overview');
  expanded = signal(true);
  server = signal(false);
  loading = signal(false);
  pageRows = signal<TableRow[]>([]);
  total = signal(0);
  lastQuery = signal<TableQuery | null>(null);
  detail = signal<TableRow | null>(null);
  date = '2026-10-29';
  body = '';
  name = '';
  email = '';
  department = 'Engineering';
  agreed = false;
  rows = users;
  imageIndex = signal(0);
  lightbox = signal(false);
  images = [
    'photo-1497366754035-f200968a6e72',
    'photo-1497366811353-6870744d04b2',
    'photo-1497215728101-856f4ea42174',
  ];
  columns: TableColumn[] = [
    { field: 'name', label: 'NAME', type: 'avatar' },
    { field: 'role', label: 'ROLE' },
    { field: 'status', label: 'STATUS', type: 'status' },
    { field: 'joined', label: 'JOINED' },
  ];
  private timer: ReturnType<typeof setTimeout> | undefined;
  load(q: TableQuery) {
    this.lastQuery.set(q);
    if (!this.server()) return;
    clearTimeout(this.timer);
    this.loading.set(true);
    this.timer = setTimeout(() => {
      const result = queryPage(users, q);
      this.total.set(result.totalRecords);
      this.pageRows.set(result.rows);
      this.loading.set(false);
    }, 450);
  }
  toggleServer(value: boolean) {
    this.server.set(value);
    if (this.lastQuery()) this.load(this.lastQuery()!);
  }
  simulate() {
    this.busy.set(true);
    setTimeout(() => {
      this.busy.set(false);
      this.notice.set('Your changes have been saved.');
    }, 900);
  }
  submit() {
    this.notice.set(
      `Form submitted for ${this.name}. Department: ${this.department}. Date: ${this.date}.`,
    );
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
