import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icon.component';
export interface TableColumn {
  field: string;
  label: string;
  type?: 'avatar' | 'status' | 'progress';
}
import { filterAndSort, type TableQuery, type TableRow } from './table-query';
export type { TableQuery, TableRow } from './table-query';
@Component({
  selector: 'eit-datatable',
  imports: [CommonModule, FormsModule, IconComponent],
  template: ` <div class="table-tools">
      <div class="search-field">
        <eit-icon name="search" /><input
          aria-label="Search table"
          placeholder="Search anything…"
          [ngModel]="search()"
          (ngModelChange)="search.set($event); page.set(1)"
        />
      </div>
      <div class="table-options">
        <span class="text-secondary">Show</span
        ><select
          class="form-select form-select-sm"
          aria-label="Rows per page"
          [ngModel]="size()"
          (ngModelChange)="size.set(+$event); page.set(1)"
        >
          <option [ngValue]="5">5 rows</option>
          <option [ngValue]="10">10 rows</option>
          <option [ngValue]="20">20 rows</option>
        </select>
      </div>
    </div>
    <div class="table-responsive" [style.max-height]="scrollHeight()" [attr.aria-busy]="loading()">
      <table class="table table-vcenter table-hover card-table">
        <thead>
          <tr>
            @for (c of columns(); track c.field) {
              <th
                [attr.aria-sort]="
                  sort() === c.field ? (direction() === 'asc' ? 'ascending' : 'descending') : 'none'
                "
              >
                <button class="sort-button" (click)="sortBy(c.field)">
                  {{ c.label }}
                  <eit-icon
                    [name]="
                      sort() === c.field
                        ? direction() === 'asc'
                          ? 'chevron-up'
                          : 'chevron-down'
                        : 'selector'
                    "
                  />
                </button>
              </th>
            }
            <th class="text-end">ACTION</th>
          </tr>
        </thead>
        <tbody>
          @if (loading()) {
            <tr>
              <td [attr.colspan]="columns().length + 1" class="text-center p-5">Loading data…</td>
            </tr>
          } @else {
            @for (row of visible(); track row['id']) {
              <tr>
                @for (c of columns(); track c.field) {
                  <td>
                    @switch (c.type) {
                      @case ('avatar') {
                        <div class="person-cell">
                          <span
                            class="person-avatar"
                            [style.background]="row['color'] || '#eaf2ff'"
                            [style.color]="row['ink'] || '#206bc4'"
                            >{{ initials(row[c.field]) }}</span
                          >
                          <div>
                            <span class="fw-medium">{{ row[c.field] }}</span
                            ><small>{{ row['email'] || row['category'] }}</small>
                          </div>
                        </div>
                      }
                      @case ('status') {
                        <span
                          class="status-pill"
                          [class.pending]="row[c.field] === 'Pending'"
                          [class.inactive]="row[c.field] === 'Inactive'"
                          ><span></span>{{ row[c.field] }}</span
                        >
                      }
                      @case ('progress') {
                        <div class="progress-cell">
                          <span>{{ row[c.field] }}%</span>
                          <div class="progress progress-sm">
                            <div
                              class="progress-bar"
                              [style.width.%]="row[c.field]"
                              style="background:var(--accent)"
                            ></div>
                          </div>
                        </div>
                      }
                      @default {
                        <span>{{ row[c.field] }}</span>
                      }
                    }
                  </td>
                }
                <td class="text-end">
                  <button
                    class="btn btn-sm btn-ghost-secondary"
                    aria-label="View details"
                    (click)="rowAction.emit(row)"
                  >
                    <eit-icon name="dots" />
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columns().length + 1" class="text-center p-5">
                  No results found. Try another search.
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
    <div class="table-footer">
      <span
        >Showing {{ count() ? (page() - 1) * size() + 1 : 0 }}–{{
          Math.min(page() * size(), count())
        }}
        of {{ count() }} entries</span
      >
      <div class="pagination-controls">
        <button
          class="btn btn-sm"
          aria-label="Previous page"
          [disabled]="page() <= 1"
          (click)="page.update(previous)"
        >
          <eit-icon name="chevron-left" />
        </button>
        @for (n of pages(); track n) {
          <button class="btn btn-sm" [class.current-page]="page() === n" (click)="page.set(n)">
            {{ n }}
          </button>
        }
        <button
          class="btn btn-sm"
          aria-label="Next page"
          [disabled]="page() >= pageCount()"
          (click)="page.update(next)"
        >
          <eit-icon name="chevron-right" />
        </button>
      </div>
    </div>`,
})
export class DatatableComponent {
  rows = input<TableRow[]>([]);
  columns = input<TableColumn[]>([]);
  serverSide = input(false);
  totalRecords = input(0);
  loading = input(false);
  scrollHeight = input('460px');
  queryChange = output<TableQuery>();
  rowAction = output<TableRow>();
  page = signal(1);
  size = signal(5);
  search = signal('');
  sort = signal('');
  direction = signal<'asc' | 'desc'>('asc');
  Math = Math;
  previous = (n: number) => n - 1;
  next = (n: number) => n + 1;
  filtered = computed(() =>
    this.serverSide()
      ? this.rows()
      : filterAndSort(this.rows(), {
          search: this.search(),
          sortField: this.sort(),
          sortOrder: this.direction(),
        }),
  );
  count = computed(() => (this.serverSide() ? this.totalRecords() : this.filtered().length));
  pageCount = computed(() => Math.max(1, Math.ceil(this.count() / this.size())));
  pages = computed(() => {
    const start = Math.max(1, Math.min(this.page() - 2, this.pageCount() - 4));
    return Array.from({ length: Math.min(5, this.pageCount()) }, (_, i) => start + i);
  });
  visible = computed(() =>
    this.serverSide()
      ? this.rows()
      : this.filtered().slice((this.page() - 1) * this.size(), this.page() * this.size()),
  );
  constructor() {
    effect(() => {
      this.queryChange.emit({
        page: this.page(),
        pageSize: this.size(),
        sortField: this.sort(),
        sortOrder: this.direction(),
        search: this.search(),
      });
    });
    effect(() => {
      if (this.page() > this.pageCount()) this.page.set(this.pageCount());
    });
  }
  sortBy(field: string) {
    if (this.sort() === field) this.direction.update((v) => (v === 'asc' ? 'desc' : 'asc'));
    else {
      this.sort.set(field);
      this.direction.set('asc');
    }
    this.page.set(1);
  }
  initials(value: unknown) {
    return String(value)
      .split(' ')
      .map((v) => v[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
