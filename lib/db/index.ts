import { mockPlanningSnapshot } from "@/lib/db/mock";
import type { PlanningSnapshot } from "@/lib/db/types";

export type { DaySummary, ItineraryItemSummary, PlanningSnapshot, TripSummary } from "@/lib/db/types";

export async function getPlanningSnapshot(): Promise<PlanningSnapshot> {
  return mockPlanningSnapshot;
}
