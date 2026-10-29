export interface TableQuery {
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  search: string;
}
export type TableRow = Record<string, any>;

/** Pure local adapter. A real API should implement the same query contract. */
export function filterAndSort(
  rows: readonly TableRow[],
  query: Pick<TableQuery, 'search' | 'sortField' | 'sortOrder'>,
): TableRow[] {
  const search = query.search.trim().toLowerCase();
  const result = rows.filter(
    (row) =>
      !search ||
      Object.values(row).some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(search),
      ),
  );
  if (query.sortField)
    result.sort((a, b) => {
      const first = a[query.sortField],
        second = b[query.sortField];
      const difference =
        typeof first === 'number' && typeof second === 'number'
          ? first - second
          : String(first ?? '').localeCompare(String(second ?? ''));
      return difference * (query.sortOrder === 'asc' ? 1 : -1);
    });
  return result;
}
export function queryPage(rows: readonly TableRow[], query: TableQuery) {
  const result = filterAndSort(rows, query);
  const pageSize = Math.max(1, Math.floor(query.pageSize) || 1);
  const page = Math.min(
    Math.max(1, Math.floor(query.page) || 1),
    Math.max(1, Math.ceil(result.length / pageSize)),
  );
  return {
    rows: result.slice((page - 1) * pageSize, page * pageSize),
    totalRecords: result.length,
    page,
  };
}
