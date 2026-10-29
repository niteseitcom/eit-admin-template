# EIT Admin Template

Angular 21 admin starter สำหรับนำไปพัฒนาต่อ ใช้ Tabler CSS และ Tabler Icons จริง โดยอ้างอิงแนวทาง component และ demo จาก PrimeNG (ไม่ได้ติดตั้ง PrimeNG)

## เริ่มต้น

ใช้ Node.js 24+ และ npm

```sh
npm ci
npm start
```

เปิด http://localhost:4200

```sh
npm test
npm run build
```

Production output: `dist/eit-admin/browser` ตั้งค่าเว็บเซิร์ฟเวอร์ให้ fallback เส้นทาง Angular ไปยัง `index.html`

## โครงสร้าง

```text
src/app/
  core/                   Layout, ThemeService, optional ApiService, mock data
  shared/                 SharedModule และ standalone reusable components
    button.component.ts
    datepicker.component.ts
    datatable.component.ts
    texteditor.component.ts
    icon.component.ts
    table-query.ts        Pure filtering/sorting/paging adapter
  features/
    auth/                 9 authentication screens
    dashboard/            Admin dashboard, charts, CSV export
    demo/                 8 component example pages
    empty/                Feature starter page
    landing/              Public landing page
    usermanagement/       Local mock CRUD, roles/status, duplicate email validation
```

Feature แต่ละตัวใช้ lazy-loaded NgModule และใช้ standalone components ภายใน เพิ่ม feature ใหม่โดยคัดลอกรูปแบบ `empty.module.ts` แล้วลงทะเบียน `loadChildren` ใน `app.routes.ts` และเพิ่มเมนูใน `core/layout.component.ts`

## Routes

| Module          | Routes                                                                                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard       | `/dashboard`                                                                                                                                                                 |
| User management | `/usermanagement`                                                                                                                                                            |
| Auth            | `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/new-password`, `/auth/lock-screen`, `/auth/verification`, `/auth/mfa`, `/auth/access-denied`, `/auth/error` |
| Demo            | `/demo/form`, `/demo/button`, `/demo/data`, `/demo/panel`, `/demo/overlay`, `/demo/menu`, `/demo/message`, `/demo/media`                                                     |
| Empty           | `/empty`                                                                                                                                                                     |
| Landing         | `/landing`                                                                                                                                                                   |

## Shared components

นำเข้า `SharedModule` หรือ component แบบ standalone ที่ต้องการ

```html
<eit-button label="Save" icon="device-floppy" [loading]="saving" />
<eit-button icon="heart" variant="outline-danger" [rounded]="true" />
<eit-button label="Inbox" icon="bell" badge="8" />
<eit-button label="Open form" href="/demo/form" variant="link" />
<eit-datepicker [(value)]="startDate" min="2026-01-01" label="Start date" />
<eit-texteditor [(value)]="html" />
<eit-icon name="layout-dashboard" />
```

Button รองรับ `type`, `disabled`, `loading`, `icon`, `href`, `rounded`, `badge`, `variant` รวมถึง icon-only ใช้ `btn-group` ของ Tabler สำหรับกลุ่มปุ่ม ดูตัวอย่างใน `/demo/button`

Datepicker ใช้ date input ของ browser ค่าเป็น ISO `YYYY-MM-DD` ส่วน texteditor เป็น lightweight contenteditable พร้อม bold/italic/underline/lists และ output HTML มีการ sanitize เมื่อรับค่าเข้าตัว editor ใช้ `document.execCommand` ซึ่งเป็น API เก่าเพื่อให้ template ไม่ต้องติดตั้ง editor ขนาดใหญ่ หากต้องการเอกสารซับซ้อนหรือ collaboration สามารถเปลี่ยนภายใน wrapper เป็น editor เต็มรูปแบบได้ ต้อง validate/sanitize HTML ซ้ำที่ backend ก่อนนำไปเผยแพร่

## Datatable

```ts
columns: TableColumn[] = [
  { field: 'name', label: 'NAME', type: 'avatar' },
  { field: 'status', label: 'STATUS', type: 'status' },
  { field: 'progress', label: 'PROGRESS', type: 'progress' }
];
```

```html
<eit-datatable
  [rows]="rows"
  [columns]="columns"
  scrollHeight="460px"
  (rowAction)="openDetails($event)"
/>
```

ทุก row ต้องมี `id` ที่ไม่ซ้ำกัน รองรับค้นหาแบบไม่แยกตัวพิมพ์, sorting ตัวเลข/ข้อความ, sticky header, scroll แนวตั้ง/แนวนอน และ pagination

### ต่อ server-side API

```html
<eit-datatable
  [rows]="pageRows"
  [columns]="columns"
  [serverSide]="true"
  [totalRecords]="totalRecords"
  [loading]="loading"
  (queryChange)="requests.next($event)"
/>
```

Event contract (page เริ่มจาก 1):

```ts
interface TableQuery {
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  search: string;
}
```

มี `ApiService.page<T>('users', query)` สำหรับ `GET /api/users?page=1&pageSize=5&sortField=name&sortOrder=asc&search=` โดย API ต้องส่ง `{ rows: T[], totalRecords: number }` และแบ่งหน้า/เรียงลำดับ/ค้นหาที่ backend

กำหนด API base URL ผ่าน `{ provide: API_BASE_URL, useValue: 'https://your-api.example/api' }` ใน `app.config.ts` และใช้ `requests.pipe(debounceTime(200), switchMap(q => api.page('users', q)))` พร้อม error/loading handling ในหน้าที่ใช้งาน เพื่อยกเลิก request เก่าเมื่อมี query ใหม่ ตัวอย่าง `/demo/data` จำลอง server-side ด้วย async adapter 450 ms และยกเลิก timer เก่า ไม่ได้เรียก backend จริง

## Themes

เมนู palette มุมขวาบนเลือก accent ได้ 6 สี และสลับ dark/light จากไอคอน moon ธีมบันทึกใน localStorage (`eit-dark`, `eit-accent`) ปรับ tokens ใน `src/styles.scss` ได้แก่ `--accent`, `--surface`, `--canvas`, `--ink`, `--muted`, `--line`, `--soft` และให้ ThemeService จัดการ `data-bs-theme`

## ขอบเขตของ starter

- Auth/MFA/password reset/verification เป็นหน้าตัวอย่าง ไม่มีการตรวจ identity, ส่งอีเมล หรือจัดเก็บรหัสผ่าน
- Dashboard แสดงข้อมูลจำลองและ SVG charts; การเลือกช่วงวันคำนวณ metric ตัวอย่างตามสัดส่วน ไม่ใช่ข้อมูล analytics จริง
- User management บันทึกเฉพาะข้อมูล mock ใน localStorage (`eit-users`) ไม่มี backend หรือ RBAC enforcement
- หากใช้จริง ให้ต่อ authentication provider, route guards, server authorization และ API ตามระบบของคุณ
- Media demo ใช้ภาพภายนอกจาก Unsplash และต้องเชื่อมต่ออินเทอร์เน็ต
- รวม CSS Tabler และ icon font เต็มชุดเพื่อใช้พัฒนาต่อได้ทันที จึงตั้ง initial bundle budget ที่ warning 1.5 MB / error 2 MB; สามารถลดขนาดโดยเลือกเฉพาะ CSS และ SVG icons ที่ใช้งานก่อนนำขึ้น production

## การตรวจสอบ

`npm test` รัน Node test runner กับ table query contract 5 กรณี ได้แก่ numeric sorting ก่อน paging, search + page clamp, empty result, descending partial page และ invalid pagination/null values

ตรวจด้วย browser แล้ว: dashboard search/pagination, dark/light, mobile 390px navigation, async server-side filtering, add/view/delete mock user

## อ้างอิง

- [Angular version compatibility](https://angular.dev/reference/versions)
- [Tabler](https://tabler.io/) และ [Tabler source](https://github.com/tabler/tabler)
- [Tabler Icons](https://tabler.io/icons)
- [PrimeNG 21](https://v21.primeng.org/)
