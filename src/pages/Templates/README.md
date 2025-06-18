# Template Management System

Hệ thống quản lý template game với đầy đủ chức năng CRUD, filter, search và pagination.

## Tính năng chính

### 1. Template List & Table

- Hiển thị danh sách templates với Ant Design Table
- Các cột: Name, Type, Version, Status, Actions
- Pagination và sorting từ server
- Row actions: Edit, Delete, Toggle Active, Preview

### 2. Search & Filter

- **TemplateSearch**: Debounce search theo name/description
- **TemplateFilter**: Filter theo type, version, status
- Đồng bộ filter với URL parameters
- Active filters display

### 3. CRUD Operations

- **Create**: Modal form với validation
- **Update**: Reuse form component với prefill data
- **Delete**: Confirm dialog với loading state
- **Toggle Active**: Optimistic update

### 4. State Management

- Zustand store cho filter params và modal states
- React Query cho data fetching và mutations
- URL sync với filter state

## Components

### TemplateForm

- Dùng chung cho create và update
- Validation với yup schema
- Dynamic form fields cho items và koi types
- JSON preview

### TemplateTable

- Server-side pagination và sorting
- Row actions với tooltips
- Preview drawer
- Optimistic updates

### TemplateFilter

- Multi-select cho template types
- Switch cho active status
- Version input
- Apply/Reset buttons

### TemplateSearch

- Debounce search (500ms)
- Clear button
- Tích hợp với store

## API Integration

### Endpoints

- `GET /api/templates` - Fetch templates với filter
- `POST /api/templates/add` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Query Parameters

```typescript
interface TemplateFilterParams {
  keyword?: string;
  type?: string[];
  isActive?: boolean;
  version?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

## Usage

```tsx
import { TemplateTable, TemplateFilter } from './components';

// Trong component
<TemplateFilter onFilterChange={handleFilterChange} />
<TemplateTable />
```

## Features

### Performance

- Debounce search để tránh quá nhiều API calls
- Optimistic updates cho toggle active
- Memoized options cho selects
- Stale time 5 phút cho queries

### UX/UI

- Loading states cho tất cả actions
- Error handling với notifications
- Confirm dialogs cho delete
- Preview drawer cho quick view
- Responsive design với TailwindCSS

### Type Safety

- Full TypeScript support
- Type-safe API calls
- Proper error handling

## File Structure

```
src/pages/Templates/
├── components/
│   ├── AddTemplateForm.tsx (TemplateForm)
│   ├── TemplateSearch.tsx
│   ├── TemplateFilter.tsx
│   ├── TemplateTable.tsx
│   └── index.ts
├── stores/
│   └── templateStore.ts
├── index.tsx
└── README.md
```

## Dependencies

- Ant Design (UI components)
- TailwindCSS (styling)
- Zustand (state management)
- React Query (data fetching)
- React Hook Form + Yup (form handling)
- React Router (navigation)
