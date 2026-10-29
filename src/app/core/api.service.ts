import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { TableQuery, TableRow } from '../shared/table-query';
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', { factory: () => '/api' });
export interface PageResponse<T> {
  rows: T[];
  totalRecords: number;
}
/** Optional real API adapter. Demo pages use mock data and do not call this service. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);
  page<T extends TableRow>(resource: string, query: TableQuery) {
    const params = new HttpParams({ fromObject: { ...query } });
    return this.http.get<PageResponse<T>>(`${this.base}/${resource}`, { params });
  }
}
