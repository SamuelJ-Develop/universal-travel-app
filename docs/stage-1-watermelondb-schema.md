# Stage 1 WatermelonDB Schema Design

## Purpose

This document turns the Stage 1 product model into a WatermelonDB-ready schema design for:

- `trips`
- `days`
- `itinerary_items`

It also defines the sync-ready metadata that should exist from the first implementation pass, even though Stage 1 is local-only.

## Design Decisions

### 1. Stage 1 tables

Stage 1 includes only:

- `trips`
- `days`
- `itinerary_items`

Attachments and metrics stay out of the first schema version because they belong to later roadmap stages.

### 2. Watermelon naming rules

All table and column names use WatermelonDB raw schema conventions:

- plural table names
- snake_case column names
- foreign keys ending in `_id`

This matters because Watermelon sync payloads use raw table and column names directly.

### 3. Date-only fields are stored as strings

Fields representing a calendar date rather than an absolute moment should use ISO date strings in `YYYY-MM-DD` format:

- `trips.start_date`
- `trips.end_date`
- `days.date`

Reason:

- a trip day is a calendar concept, not a UTC timestamp
- storing a date-only value as a Unix timestamp invites timezone drift bugs
- strings are stable across device locale and timezone changes

### 4. Timestamp fields are stored as numbers

Fields representing an actual timestamp use Unix epoch milliseconds as Watermelon `number` columns:

- `created_at`
- `updated_at`

This aligns with WatermelonDB's automatic create/update tracking guidance.

### 5. Time-of-day values are stored as integer minutes

Itinerary item time fields should not be stored as arbitrary strings.

Use:

- `start_minute_of_day`
- `end_minute_of_day`

These are integer minute offsets from local midnight in the item's effective timezone.

Reason:

- easier sorting and validation
- avoids locale-specific string parsing
- works cleanly with item-level timezone overrides

### 6. Local deletion strategy

Do **not** add custom `is_deleted` or `deleted_at` columns to the Stage 1 local schema.

Reason:

- Watermelon already tracks local sync lifecycle through internal `_status` and `_changed` fields
- a second deletion system in the client would create drift and reconciliation bugs
- if the backend later needs soft-delete retention, that should be a server concern first

### 7. Required sync-ready metadata

Every Stage 1 table should include:

- `created_at`
- `updated_at`

These are required from the start so Stage 2 conflict resolution has stable timestamps to build on.

## Table Design

## `trips`

### Responsibility

Top-level trip container and default context for timezone and currency.

### Columns

| Column | Watermelon type | Optional | Indexed | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `title` | `string` | no | no | Required display name |
| `start_date` | `string` | no | no | ISO date string |
| `end_date` | `string` | yes | no | ISO date string |
| `timezone` | `string` | no | no | IANA timezone like `Australia/Sydney` |
| `base_currency` | `string` | no | no | ISO currency code like `AUD` |
| `notes` | `string` | yes | no | Freeform notes |
| `status` | `string` | no | yes | `planning`, `active`, `completed` |
| `created_at` | `number` | no | no | Unix ms |
| `updated_at` | `number` | no | no | Unix ms |

### Notes

- `status` remains a string enum at the schema layer.
- `timezone` is required at the trip level even though itinerary items can override it.

## `days`

### Responsibility

Calendar-backed itinerary buckets that belong to a trip.

### Columns

| Column | Watermelon type | Optional | Indexed | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `trip_id` | `string` | no | yes | Parent trip |
| `date` | `string` | no | no | ISO date string |
| `order_key` | `string` | no | yes | Sort key for manual ordering |
| `notes` | `string` | yes | no | Freeform notes |
| `created_at` | `number` | no | no | Unix ms |
| `updated_at` | `number` | no | no | Unix ms |

### Notes

- The product doc currently says `order_index`, but this schema should not commit to floats.
- `order_key` is deliberately named to allow issue `#3` to choose the exact ordering strategy without forcing a later rename.

## `itinerary_items`

### Responsibility

Schedulable or referenceable trip entries such as accommodation, activities, transport, and logistics.

### Columns

| Column | Watermelon type | Optional | Indexed | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `trip_id` | `string` | no | yes | Redundant parent trip foreign key |
| `day_id` | `string` | no | yes | Parent day foreign key |
| `category` | `string` | no | yes | `accommodation`, `activity`, `transport`, `logistics` |
| `title` | `string` | no | no | Required display name |
| `location_name` | `string` | yes | no | Human-readable place |
| `latitude` | `number` | yes | no | Decimal latitude |
| `longitude` | `number` | yes | no | Decimal longitude |
| `timezone` | `string` | yes | no | Item-level IANA timezone override |
| `start_minute_of_day` | `number` | yes | no | 0-1439 |
| `end_minute_of_day` | `number` | yes | no | 0-1439 |
| `is_all_day` | `boolean` | no | no | Defaults to `false` |
| `is_flexible` | `boolean` | no | no | Defaults to `false` |
| `order_key` | `string` | no | yes | Sort key within a day |
| `estimated_cost_minor` | `number` | yes | no | Minor units like cents |
| `actual_cost_minor` | `number` | yes | no | Minor units like cents |
| `currency` | `string` | yes | no | Item-level override |
| `notes` | `string` | yes | no | Freeform notes |
| `created_at` | `number` | no | no | Unix ms |
| `updated_at` | `number` | no | no | Unix ms |

### Notes

- Costs should use minor currency units rather than floating-point decimals.
- `currency` is optional and falls back to the trip base currency.
- `timezone` is optional and falls back to the trip timezone.

## Reassignment Contract For Itinerary Items

`trip_id` on `itinerary_items` is intentionally redundant for query speed.

If an itinerary item moves to a different day:

1. update `day_id`
2. update `trip_id`
3. do both inside the same Watermelon write transaction

This is a hard contract, not a convenience rule. Violating it will create cross-table ghost records that are difficult to repair once sync is introduced.

## Query Expectations And Indexing

Indexes should exist for:

- `days.trip_id`
- `days.order_key`
- `itinerary_items.trip_id`
- `itinerary_items.day_id`
- `itinerary_items.category`
- `itinerary_items.order_key`
- `trips.status`

These indexes match the expected Stage 1 access patterns:

- list trips by status
- fetch days for a trip
- fetch itinerary items for a trip or day
- sort ordered records quickly

Do not index:

- `notes`
- `title`
- `location_name`
- timestamp fields

## Schema Skeleton

This is the intended WatermelonDB schema shape, not final implementation code:

```ts
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'trips',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'start_date', type: 'string' },
        { name: 'end_date', type: 'string', isOptional: true },
        { name: 'timezone', type: 'string' },
        { name: 'base_currency', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'days',
      columns: [
        { name: 'trip_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'string' },
        { name: 'order_key', type: 'string', isIndexed: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'itinerary_items',
      columns: [
        { name: 'trip_id', type: 'string', isIndexed: true },
        { name: 'day_id', type: 'string', isIndexed: true },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'location_name', type: 'string', isOptional: true },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'timezone', type: 'string', isOptional: true },
        { name: 'start_minute_of_day', type: 'number', isOptional: true },
        { name: 'end_minute_of_day', type: 'number', isOptional: true },
        { name: 'is_all_day', type: 'boolean' },
        { name: 'is_flexible', type: 'boolean' },
        { name: 'order_key', type: 'string', isIndexed: true },
        { name: 'estimated_cost_minor', type: 'number', isOptional: true },
        { name: 'actual_cost_minor', type: 'number', isOptional: true },
        { name: 'currency', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
})
```

## Follow-on Work

- Issue `#3` should decide the concrete ordering strategy behind `order_key`
- Issue `#10` can scaffold the app around this schema contract
- Stage 2 should map server conflict handling onto `updated_at` and Watermelon's internal sync state
