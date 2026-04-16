# Universal Travel App

Universal Travel App is a local-first travel operating system for planning complex trips on desktop and executing them reliably on mobile in low-connectivity environments.

## Product Direction

- Offline-capable planning and execution
- WatermelonDB as the local source of truth
- Supabase as the sync and storage replica
- Expo-based cross-platform delivery for mobile and web
- Dense desktop planning workflows and fast mobile execution workflows

## Core Capabilities

- Trip, day, and itinerary management
- Cost planning and actual spend tracking
- Attachment vault with async upload management
- Offline sync with conflict resolution
- Resource and connectivity metrics for remote travel

## Proposed Stack

- Expo
- Expo Router
- NativeWind
- WatermelonDB
- Supabase

## Repository Structure

- `.github/` GitHub templates and contribution defaults
- `docs/` product, architecture, and implementation planning

## Current Status

This repository is set up as the GitHub foundation for the project. The core app scaffold has not been generated yet because the dependency matrix for Expo, WatermelonDB, and NativeWind should be pinned intentionally before implementation begins.

## Recommended Next Build Step

1. Use the Stage 1 foundation decision in `docs/stage-1-foundation-dependency-matrix.md`.
2. Scaffold Stage 1 around local data models, itinerary flows, and JSON export.
3. Start implementation with the schema and ordering decisions that remain open.

## Key Decisions To Resolve Early

- Fractional indexing strategy for sortable records
- Item-level timezone handling and rendering rules
- WatermelonDB plus Supabase sync contract and soft-delete strategy
- Offline map provider and Mapbox cost model
- iOS strategy for signal metrics in Stage 4

See [Project Documentation](./docs/project-documentation.md), [Implementation Plan](./docs/implementation-plan.md), and [Stage 1 Foundation Decision And Dependency Matrix](./docs/stage-1-foundation-dependency-matrix.md).
