import { Model } from "@nozbe/watermelondb";
import {
  children,
  field,
  immutableRelation,
  readonly,
  text,
} from "@nozbe/watermelondb/decorators";

import { Trip } from "@/lib/db/models/trip";

export class Day extends Model {
  static table = "days";

  static associations = {
    trips: { type: "belongs_to" as const, key: "trip_id" },
    itinerary_items: { type: "has_many" as const, foreignKey: "day_id" },
  };

  @field("trip_id") tripId!: string;
  @field("date") date!: string;
  @field("order_key") orderKey!: string;
  @text("notes") notes?: string;
  @readonly @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;

  @immutableRelation("trips", "trip_id") trip!: Trip;
  @children("itinerary_items") itineraryItems: any;
}
