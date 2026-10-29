import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { users } from '../../core/demo-data';
import { TableColumn, TableRow } from '../../shared/datatable.component';
@Component({
  imports: [SharedModule, FormsModule],
  template: `<div class="page-heading">
      <div>
        <div class="eyebrow">PEOPLE & PERMISSIONS</div>
        <h1>User management</h1>
        <p>Manage the people who make your workspace great.</p>
      </div>
      <eit-button label="Add user" icon="plus" (click)="open()" />
    </div>
    <div class="stats-grid mb-4">
      @for (s of stats(); track s.label) {
        <section class="card p-4">
          <span class="text-secondary">{{ s.label }}</span>
          <h1 class="mt-2 mb-0">{{ s.value }}</h1>
        </section>
      }
    </div>
    <section class="card">
      <div class="section-header">
        <div>
          <h2>Workspace members</h2>
          <p>Demo records are stored locally in this browser.</p>
        </div>
        <select
          class="form-select period-select"
          aria-label="Filter by role"
          [ngModel]="role()"
          (ngModelChange)="role.set($event)"
        >
          <option>All roles</option>
          <option>Administrator</option>
          <option>Editor</option>
          <option>Member</option>
        </select>
      </div>
      <eit-datatable [rows]="filtered()" [columns]="columns" (rowAction)="open($event)" />
    </section>
    @if (editing()) {
      <div class="modal-backdrop-custom" (click)="editing.set(false)">
        <form
          class="dialog-card"
          #form="ngForm"
          (ngSubmit)="form.valid && save()"
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
          aria-label="User details"
        >
          <button
            type="button"
            class="dialog-close btn btn-icon"
            aria-label="Close dialog"
            (click)="editing.set(false)"
          >
            <eit-icon name="x" />
          </button>
          <h2>{{ draft['id'] ? 'Edit user' : 'Add user' }}</h2>
          <label class="form-label"
            >Name<input
              class="form-control"
              name="name"
              [(ngModel)]="draft['name']"
              required /></label
          ><label class="form-label"
            >Email<input
              class="form-control"
              name="email"
              type="email"
              [(ngModel)]="draft['email']"
              required
              email /></label
          ><label class="form-label"
            >Role<select class="form-select" name="role" [(ngModel)]="draft['role']">
              <option>Member</option>
              <option>Editor</option>
              <option>Administrator</option>
            </select></label
          ><label class="form-label"
            >Status<select class="form-select" name="status" [(ngModel)]="draft['status']">
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select></label
          >
          @if (error()) {
            <p class="text-danger">{{ error() }}</p>
          }
          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
              Save user</button
            ><button class="btn" type="button" (click)="editing.set(false)">Cancel</button>
            @if (draft['id']) {
              <button class="btn btn-outline-danger ms-auto" type="button" (click)="remove()">
                {{ confirmDelete() ? 'Confirm delete' : 'Delete' }}
              </button>
            }
          </div>
        </form>
      </div>
    }`,
})
export class UsermanagementComponent {
  rows = signal<TableRow[]>(this.load());
  role = signal('All roles');
  editing = signal(false);
  confirmDelete = signal(false);
  error = signal('');
  draft: TableRow = {};
  columns: TableColumn[] = [
    { field: 'name', label: 'NAME', type: 'avatar' },
    { field: 'role', label: 'ROLE' },
    { field: 'status', label: 'STATUS', type: 'status' },
    { field: 'joined', label: 'JOINED' },
  ];
  filtered = computed(() =>
    this.rows().filter((r) => this.role() === 'All roles' || r['role'] === this.role()),
  );
  stats = computed(() => [
    { label: 'Total members', value: this.rows().length },
    { label: 'Active members', value: this.rows().filter((r) => r['status'] === 'Active').length },
    {
      label: 'Administrators',
      value: this.rows().filter((r) => r['role'] === 'Administrator').length,
    },
    {
      label: 'Pending invitations',
      value: this.rows().filter((r) => r['status'] === 'Pending').length,
    },
  ]);
  load(): TableRow[] {
    try {
      const data = JSON.parse(localStorage.getItem('eit-users') || 'null');
      return Array.isArray(data) ? data : users;
    } catch {
      return users;
    }
  }
  open(row?: TableRow) {
    this.draft = row
      ? { ...row }
      : { name: '', email: '', role: 'Member', status: 'Active', joined: 'Oct 29, 2026' };
    this.confirmDelete.set(false);
    this.error.set('');
    this.editing.set(true);
  }
  persist() {
    localStorage.setItem('eit-users', JSON.stringify(this.rows()));
    this.editing.set(false);
  }
  save() {
    if (
      this.rows().some(
        (r) =>
          r['email'].toLowerCase() === this.draft['email'].toLowerCase() &&
          r['id'] !== this.draft['id'],
      )
    ) {
      this.error.set('This email already exists.');
      return;
    }
    if (this.draft['id'])
      this.rows.update((rs) =>
        rs.map((r) => (r['id'] === this.draft['id'] ? { ...this.draft } : r)),
      );
    else
      this.rows.update((rs) => [
        ...rs,
        { ...this.draft, id: Math.max(0, ...rs.map((r) => r['id'])) + 1 },
      ]);
    this.persist();
  }
  remove() {
    if (!this.confirmDelete()) {
      this.confirmDelete.set(true);
      return;
    }
    this.rows.update((rs) => rs.filter((r) => r['id'] !== this.draft['id']));
    this.persist();
  }
}
