export type TripStatus = "planning" | "active" | "completed";

export type ItineraryCategory =
  | "accommodation"
  | "activity"
  | "transport"
  | "logistics";

export type TripSummary = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  timezone: string;
  baseCurrency: string;
  status: TripStatus;
  notes?: string;
};

export type DaySummary = {
  id: string;
  tripId: string;
  date: string;
  orderKey: string;
  notes?: string;
};

export type ItineraryItemSummary = {
  id: string;
  tripId: string;
  dayId: string;
  category: ItineraryCategory;
  title: string;
  locationName?: string;
  timezone?: string;
  startMinuteOfDay?: number;
  endMinuteOfDay?: number;
  isAllDay: boolean;
  isFlexible: boolean;
  orderKey: string;
  estimatedCostMinor?: number;
  actualCostMinor?: number;
  currency?: string;
  notes?: string;
};

export type PlanningSnapshot = {
  mode: "mock" | "watermelon";
  trip: TripSummary;
  days: Array<
    DaySummary & {
      items: ItineraryItemSummary[];
    }
  >;
};
