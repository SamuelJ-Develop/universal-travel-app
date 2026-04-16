# Implementation Plan

## Goal

Translate the product documentation into an execution order that is safe for a local-first mobile app with offline sync.

## Phase 0: Pre-Build Decisions

Resolve these before generating the first production data model:

- Confirm the Stage 1 platform target and dependency matrix
- Choose fractional indexing for ordering keys
- Define sync metadata fields and soft-delete strategy
- Decide the offline mapping provider
- Decide the Stage 4 iOS metrics strategy

The recommended baseline for the first scaffold is documented in `docs/stage-1-foundation-dependency-matrix.md`.

## Phase 1: Repository and Architecture Foundation

- Set up GitHub repository standards and templates
- Lock the initial Expo and React Native dependency matrix
- Create the base app scaffold
- Define WatermelonDB schemas for trips, days, items, attachments, and metrics
- Add local JSON export

The Stage 1 schema baseline for trips, days, and itinerary items is documented in `docs/stage-1-watermelondb-schema.md`.

## Phase 2: Stage 1 Product Build

- Build trip creation and editing flows
- Build day-based itinerary management
- Build itinerary item creation and sorting
- Build planned versus actual cost tracking
- Build notes and flexible scheduling fields

## Phase 3: Sync Foundation

- Add Supabase project configuration
- Implement WatermelonDB pull/push sync
- Add `updated_at`, deletion markers, and sync bookkeeping
- Test conflict resolution under reconnect scenarios

## Phase 4: Attachments and Execution

- Persistent local attachment storage
- Upload queue and retry handling
- Sync dashboard
- Execution-mode mobile surfaces

## Phase 5: Intelligence Features

- Metrics capture model
- Connectivity and battery input flows
- Map overlays for recorded metrics

## Delivery Notes

- Stage 2 is the main engineering risk area.
- Avoid retrofitting sort-order logic after sync goes live.
- Avoid building safety notifications before the trust and legal model is defined.
