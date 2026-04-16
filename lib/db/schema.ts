import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const databaseSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "trips",
      columns: [
        { name: "title", type: "string" },
        { name: "start_date", type: "string" },
        { name: "end_date", type: "string", isOptional: true },
        { name: "timezone", type: "string" },
        { name: "base_currency", type: "string" },
        { name: "notes", type: "string", isOptional: true },
        { name: "status", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "days",
      columns: [
        { name: "trip_id", type: "string", isIndexed: true },
        { name: "date", type: "string" },
        { name: "order_key", type: "string", isIndexed: true },
        { name: "notes", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "itinerary_items",
      columns: [
        { name: "trip_id", type: "string", isIndexed: true },
        { name: "day_id", type: "string", isIndexed: true },
        { name: "category", type: "string", isIndexed: true },
        { name: "title", type: "string" },
        { name: "location_name", type: "string", isOptional: true },
        { name: "latitude", type: "number", isOptional: true },
        { name: "longitude", type: "number", isOptional: true },
        { name: "timezone", type: "string", isOptional: true },
        { name: "start_minute_of_day", type: "number", isOptional: true },
        { name: "end_minute_of_day", type: "number", isOptional: true },
        { name: "is_all_day", type: "boolean" },
        { name: "is_flexible", type: "boolean" },
        { name: "order_key", type: "string", isIndexed: true },
        { name: "estimated_cost_minor", type: "number", isOptional: true },
        { name: "actual_cost_minor", type: "number", isOptional: true },
        { name: "currency", type: "string", isOptional: true },
        { name: "notes", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
