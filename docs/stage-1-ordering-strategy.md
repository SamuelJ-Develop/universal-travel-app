# Stage 1 Ordering Strategy

## Decision

Use **fractional indexing with lexicographically sortable string keys** for ordered records in Stage 1.

The recommended library is:

- `fractional-indexing`

The schema field name remains:

- `order_key`

This applies to:

- `days.order_key`
- `itinerary_items.order_key`

## Why This Decision

The project requires user-controlled ordering with drag/drop behavior, and the product doc already identifies float ordering as unsafe once repeated insertions and sync are involved.

Fractional indexing is the right fit because it:

- generates sortable string keys between two existing records
- avoids periodic global reindexing
- works cleanly with local-first writes
- keeps the stored value in a raw schema format Watermelon sync can move directly

The `fractional-indexing` package exposes `generateKeyBetween()` for single inserts and `generateNKeysBetween()` for bulk inserts. Its keys are intended to be sorted lexicographically using normal string comparison.

## Why Not Float Ordering

Float midpoint ordering looks simple early and becomes a liability later.

Problems:

- repeated midpoint insertion eventually loses precision
- reindexing requires coordinated rewrites across many rows
- reindexing while sync is active creates avoidable race conditions
- precision bugs are hard to detect and harder to repair once records exist on multiple devices

For this app, those costs are not theoretical. Manual itinerary editing is a core interaction, not a rare admin task.

## Why Not Integer Reindexing

Sequential integer positions only work cleanly if the app is willing to renumber large parts of the list often.

That is acceptable for small in-memory lists. It is a poor match for:

- a local database
- sync-ready records
- frequent drag/drop moves
- offline edits that may be pushed later

## Concrete Rules

### 1. Sort by `order_key` only

Ordered queries should sort by `order_key` ascending.

Do not sort by:

- creation time
- record ID
- array index in memory

### 2. Generate keys from neighboring records

When inserting or moving a single record:

- use the previous visible record's `order_key`
- use the next visible record's `order_key`
- generate a new key between them

### 3. Bulk inserts use spaced keys

When inserting several records into one gap, use `generateNKeysBetween()` instead of repeatedly calling the single-key generator.

That keeps keys shorter and reduces unnecessary key growth.

### 4. The key is opaque

`order_key` is an internal ordering token.

Do not:

- expose it in UI
- derive meaning from its characters
- transform casing
- sort it with locale-aware comparison

### 5. Use binary string comparison semantics

The fractional-indexing reference warns that locale-aware comparison can produce incorrect ordering because the keys are case-sensitive.

Use normal string comparison semantics, not locale-aware collation.

## Write Patterns

### Append to end

Generate a key between the last record's `order_key` and `null`.

### Prepend to start

Generate a key between `null` and the first record's `order_key`.

### Move between two records

Generate a key between the previous and next visible neighbors at the target position.

### Empty list

Generate a key between `null` and `null`.

## Relationship To Sync

This strategy is sync-friendly because `order_key` is just another raw string column in the schema.

Watermelon sync works on raw table and column values. That means:

- no special encoding layer is required for the sync protocol
- changed order keys behave like normal column updates
- the app avoids expensive list-wide rewrites just to preserve order

## Collision Note

For the current product scope, use the standard deterministic library behavior first.

Random-jitter variants exist for highly concurrent collaborative editing, but that is not the Stage 1 problem. Stage 1 is single-user and local-first. If multi-user reordering becomes a real conflict hotspot later, that can be revisited with actual evidence.

## Implementation Guidance

Stage 1 should standardize on a small helper layer such as:

- `getOrderKeyBetween(previousOrderKey, nextOrderKey)`
- `getOrderKeysBetween(previousOrderKey, nextOrderKey, count)`

This keeps the rest of the app insulated from the library API and makes later changes contained if needed.

## Consequences For Existing Docs

- The product-documentation warning about float precision is now resolved for implementation planning.
- The Stage 1 schema should use `order_key` as a required `string` field.
- Expo scaffold work can now proceed without leaving ordering unresolved.
