import { Day } from "@/lib/db/models/day";
import { ItineraryItem } from "@/lib/db/models/itinerary-item";
import { Trip } from "@/lib/db/models/trip";

export const databaseModelClasses = [Trip, Day, ItineraryItem];

export { Day, ItineraryItem, Trip };
