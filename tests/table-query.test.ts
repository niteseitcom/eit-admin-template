import { test } from 'node:test';
import assert from 'node:assert/strict';
import { queryPage, filterAndSort, type TableQuery } from '../src/app/shared/table-query.ts';
const rows = [
  { id: 1, name: 'Zoe', amount: 100 },
  { id: 2, name: 'Alice', amount: 2 },
  { id: 3, name: 'Bob', amount: 20 },
];
const query: TableQuery = {
  page: 1,
  pageSize: 2,
  search: '',
  sortField: 'amount',
  sortOrder: 'asc',
};
test('sort numbers numerically before paging and retain full filtered count', () => {
  const result = queryPage(rows, query);
  assert.deepEqual(
    result.rows.map((r) => r['id']),
    [2, 3],
  );
  assert.equal(result.totalRecords, 3);
  assert.deepEqual(
    rows.map((r) => r['id']),
    [1, 2, 3],
  );
});
test('search ignores case and surrounding whitespace; page is clamped after filtering', () => {
  const result = queryPage(rows, { ...query, page: 9, search: ' ALICE ' });
  assert.equal(result.page, 1);
  assert.equal(result.totalRecords, 1);
  assert.equal(result.rows[0]['name'], 'Alice');
});
test('empty results have a valid empty first page', () => {
  const result = queryPage(rows, { ...query, search: 'unknown' });
  assert.deepEqual(result, { rows: [], totalRecords: 0, page: 1 });
});
test('descending order and final partial page work together', () => {
  const result = queryPage(rows, { ...query, page: 2, sortOrder: 'desc' });
  assert.deepEqual(
    result.rows.map((r) => r['amount']),
    [2],
  );
});
test('null values and invalid pagination inputs do not break the adapter', () => {
  assert.equal(
    filterAndSort([{ id: 1, name: null }], { search: 'null', sortField: 'name', sortOrder: 'asc' })
      .length,
    0,
  );
  assert.equal(queryPage(rows, { ...query, pageSize: 0, page: -1 }).rows.length, 1);
});
