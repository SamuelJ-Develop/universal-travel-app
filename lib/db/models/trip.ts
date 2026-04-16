import { Model } from "@nozbe/watermelondb";
import { children, field, readonly, text } from "@nozbe/watermelondb/decorators";

export class Trip extends Model {
  static table = "trips";

  static associations = {
    days: { type: "has_many" as const, foreignKey: "trip_id" },
    itinerary_items: { type: "has_many" as const, foreignKey: "trip_id" },
  };

  @text("title") title!: string;
  @field("start_date") startDate!: string;
  @field("end_date") endDate?: string;
  @field("timezone") timezone!: string;
  @field("base_currency") baseCurrency!: string;
  @text("notes") notes?: string;
  @field("status") status!: string;
  @readonly @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;

  @children("days") days: any;
  @children("itinerary_items") itineraryItems: any;
}
