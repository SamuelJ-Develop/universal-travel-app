# Project Documentation: Universal Travel Planner (Revised)

## 1. Executive Summary

**Vision**  
To build a personal-first, offline-capable universal travel system that seamlessly bridges high-level desktop planning with real-world mobile execution in remote environments.

**Core Value Proposition**  
A single system that enables:
- Structured itinerary planning
- Real-time and offline execution
- Cost tracking and resource awareness
- Reliable operation in low/no connectivity environments

**Target User (Primary)**  
Solo traveler / road-tripper operating in:
- Remote areas (for example, multi-week circuits with variable geographical barriers and ferry access)
- Multi-day itineraries requiring strict power and connectivity management
- Variable connectivity conditions

**Philosophy Shift (Important)**  
This is not just a planner. It is a travel operating system.

## 2. Core Product Principles

**Local-First Architecture**
- All critical functionality works offline.
- Cloud is for sync, not dependency.

**Eventual Consistency over Real-Time Fragility**
- Data sync is reliable, not instant.
- Expectation: "Background Sync" often means "Foreground sync the moment connectivity is restored."

**Structured Core, Flexible Edges**
- Minimal required fields.
- Extensive optional/freeform data.

**Fast Input > Perfect Data**
- Designed for use while tired, setting up camp, or offline.
- Massive tap targets, zero required fields during mobile execution.

**Planning ↔ Execution Continuity**
- Desktop = planning (dense UI)
- Mobile = execution (fast, frictionless)
- Same data model, different UX emphasis.

## 3. Technical Architecture

### 3.1 Stack Overview

- Framework: Expo (React Native + Web)
- Routing: Expo Router
- Styling: NativeWind (Tailwind)
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Local DB / Sync Engine: WatermelonDB

### 3.2 Architecture Model

Primary Pattern: Local-First with Sync Layer

```text
UI Layer
↓
WatermelonDB (Local SQLite - SOURCE OF TRUTH)
↓
Watermelon Sync Primitive (Pull/Push Deltas)
↓
Supabase (Cloud Replica)
```

### 3.3 Source of Truth Rules

- Local DB is always authoritative.
- Cloud is a replicated backup + multi-device sync layer.
- All writes go to the local DB immediately, unblocking the UI. Sync happens asynchronously when network conditions permit.

## 4. Data Lifecycle & Sync Model

### 4.1 Sync Behavior

- Write Flow: User updates data → WatermelonDB records change locally → Change is queued for the next sync cycle.
- Read Flow: Always read from the local WatermelonDB instance. UI is instantly responsive.

### 4.2 Conflict Resolution Strategy

- Rely on WatermelonDB's built-in synchronization primitives.
- When conflicts occur: compare `updated_at`; latest timestamp wins.

### 4.3 Offline & Network Handling

- All operations work offline.
- Sync Execution: Do not rely on aggressive OS-level background fetch for critical data. Assume sync triggers primarily when the app is foregrounded and an active connection is detected.

## 5. Data Model

### 5.1 Table: Trips

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `title` | String | Trip name |
| `start_date` | Date | Anchor date |
| `end_date` | Date | Optional |
| `timezone` | String | Trip home/origin timezone |
| `base_currency` | String | Default currency |
| `notes` | Text | Freeform |
| `status` | Enum | planning / active / completed |

### 5.2 Table: Days

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `trip_id` | FK | Links to trip |
| `date` | Date | Actual calendar date |
| `order_index` | Float | For drag-and-drop reordering |
| `notes` | Text | Freeform |

### 5.3 Table: ItineraryItems

`trip_id` is intentionally redundant for query performance. Any operation that reassigns an item to a different day must update both `day_id` and `trip_id` atomically in the same WatermelonDB write transaction.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `trip_id` | FK | Redundant for quick queries |
| `day_id` | FK | Links to day |
| `category` | Enum | accommodation / activity / transport / logistics |
| `title` | String | Item title |
| `location_name` | String | Human-readable |
| `latitude` | Decimal | GPS |
| `longitude` | Decimal | GPS |
| `timezone` | String | Local timezone at item location |
| `start_time` | Time | Optional |
| `end_time` | Time | Optional |
| `all_day` | Boolean | Flag |
| `is_flexible` | Boolean | Loose scheduling |
| `order_index` | Float | Manual sorting |
| `estimated_cost` | Decimal | Planned |
| `actual_cost` | Decimal | Real |
| `currency` | String | Override if needed |
| `notes` | Text | Freeform |

### 5.4 Table: Attachments

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `item_id` | FK | Linked item |
| `local_uri` | String | Device path in persistent storage |
| `remote_url` | String | Supabase storage |
| `file_type` | String | image/pdf |
| `file_size` | Integer | Bytes |
| `upload_status` | Enum | pending / uploaded / failed |

### 5.5 Table: Metrics

iOS native OS restrictions may block direct access to raw RSRP/RSRQ/SINR values. This must be resolved before Stage 4 begins.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary key |
| `item_id` | FK | Optional |
| `timestamp` | DateTime | When recorded |
| `latitude` | Decimal | Optional |
| `longitude` | Decimal | Optional |
| `network_type` | String | 4G / 5G / WiFi / Starlink |
| `rsrp` | Integer | Signal strength |
| `rsrq` | Integer | Signal quality |
| `sinr` | Integer | Signal clarity |
| `battery_soc` | Integer | % battery |
| `notes` | Text | Optional |

### 5.6 Data Model Implementation Notes

**Order keys**  
Repeated float insertions are fragile. Evaluate a fractional indexing library before Stage 1 so ordering keys remain sortable without re-indexing races during sync.

**Cross-timezone handling**  
Rendering logic must prefer item-level timezone when present, then fall back to trip-level timezone.

## 6. Attachments System

### 6.1 Storage Strategy

- Store locally first in the persistent document directory.
- Upload asynchronously to Supabase Storage.

### 6.2 Upload Flow & UI Dashboard

- User adds image/document → saved locally → marked `upload_status = pending`
- Provide a Sync Status dashboard so users can inspect and manually trigger uploads

## 7. Mapping Strategy

### 7.1 Architecture

```jsx
<MapView>
  <Marker />
  <Polyline />
</MapView>
```

### 7.2 Implementations & Performance Constraints

- Mobile: evaluate `react-native-maps` versus Mapbox GL
- Web: `@react-google-maps/api`
- Implement marker clustering and polyline simplification early

### 7.3 Mapbox Offline Tile Licensing & Cost

Review Mapbox offline tile pricing before committing to offline packs as a Stage 4 dependency.

## 8. Product Roadmap

### Stage 1: Core System

- Trips / Days / Items
- Manual itinerary creation and cost tracking
- Local DB only
- JSON export as a data escape valve

### Stage 2: Offline & Sync Engine

- Full WatermelonDB sync implementation with Supabase
- Conflict resolution and soft deletes

### Stage 3: Attachments & Execution Tools

- Document vault
- Sync dashboard
- Status tracking

### Stage 4: Nomad Intelligence

- Signal logging
- Battery and resource tracking
- Mapbox offline tile downloads

### Stage 5: Desktop Power & Collaboration

- Desktop-optimized UI
- Multi-user sync
- CSV/PDF export

### Stage 6: Advanced Features

- AI itinerary gap filling
- Weather overlays
- Public sharing links

### 8.1 AI Itinerary Features

An early product decision is required: whether AI itinerary completion is a core differentiator or a later commodity feature.

## 9. Safety System

### Constraints

- Opt-in only
- Best-effort delivery only
- Uses last synced location, not real-time tracking

### Open Questions

- Contact notification mechanism
- False positive handling and grace periods
- Sensitive location data handling and retention
- Legal disclaimers and delivery guarantees

## 10. Platform Strategy

95% shared code is a goal, not a constraint. Allow platform-specific implementations where they materially reduce risk or improve user experience.

## 11. UX Philosophy

### Planning Mode

- Desktop-first
- Dense UI
- Drag/drop editing
- Map + list side by side

### Execution Mode

- Mobile-first
- Fast access
- Large tap targets
- Minimal input friction

## 12. Future Outlook

- Predictive power/connectivity mapping
- AI-assisted itinerary completion
- Predictive cost estimation
