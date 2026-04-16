import { Model } from "@nozbe/watermelondb";
import {
  field,
  immutableRelation,
  readonly,
  text,
} from "@nozbe/watermelondb/decorators";

import { Day } from "@/lib/db/models/day";
import { Trip } from "@/lib/db/models/trip";

export class ItineraryItem extends Model {
  static table = "itinerary_items";

  static associations = {
    trips: { type: "belongs_to" as const, key: "trip_id" },
    days: { type: "belongs_to" as const, key: "day_id" },
  };

  @field("trip_id") tripId!: string;
  @field("day_id") dayId!: string;
  @field("category") category!: string;
  @text("title") title!: string;
  @text("location_name") locationName?: string;
  @field("latitude") latitude?: number;
  @field("longitude") longitude?: number;
  @field("timezone") timezone?: string;
  @field("start_minute_of_day") startMinuteOfDay?: number;
  @field("end_minute_of_day") endMinuteOfDay?: number;
  @field("is_all_day") isAllDay!: boolean;
  @field("is_flexible") isFlexible!: boolean;
  @field("order_key") orderKey!: string;
  @field("estimated_cost_minor") estimatedCostMinor?: number;
  @field("actual_cost_minor") actualCostMinor?: number;
  @field("currency") currency?: string;
  @text("notes") notes?: string;
  @readonly @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;

  @immutableRelation("trips", "trip_id") trip!: Trip;
  @immutableRelation("days", "day_id") day!: Day;
}
