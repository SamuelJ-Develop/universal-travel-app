# Stage 1 JSON Export

## Purpose

Stage 1 is local-first and does not have sync yet. JSON export exists as a data escape valve so a user can save or share a backup of the core local trip data before multi-device sync exists.

## Format

The export payload is a JSON object with:

- `format`: fixed identifier for the export type
- `version`: export schema version
- `exportedAt`: ISO timestamp for when the export was generated
- `sourceMode`: whether the snapshot came from the WatermelonDB path or the web-safe mock path
- `trip`: the current trip summary
- `days`: trip days with nested itinerary items
- `restoreSupport`: explicit note that import is not implemented in Stage 1

## Current Exported Entities

The payload includes the Stage 1 core entities only:

- trip
- days
- itinerary items

It does not include:

- attachments
- metrics
- full sync restore metadata beyond what is already present in the preview snapshot shape

## Delivery Behavior

- On native platforms, the app writes the JSON file into the document directory and opens the share sheet.
- On web, the app triggers a direct JSON download.

## Restore Expectations

Stage 1 supports **export only**.

Import and full restore are intentionally not implemented yet. The export format is documented now so later restore work can target a known payload shape rather than reverse-engineering ad hoc files.
