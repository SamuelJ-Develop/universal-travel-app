import { getOrderKeyBetween } from "@/lib/db/order-keys";
import type { PlanningSnapshot } from "@/lib/db/types";

const dayOneKey = getOrderKeyBetween(null, null);
const dayTwoKey = getOrderKeyBetween(dayOneKey, null);

const dayOneFirstItemKey = getOrderKeyBetween(null, null);
const dayOneSecondItemKey = getOrderKeyBetween(dayOneFirstItemKey, null);
const dayTwoFirstItemKey = getOrderKeyBetween(null, null);

export const mockPlanningSnapshot: PlanningSnapshot = {
  mode: "mock",
  trip: {
    id: "trip-great-ocean-road",
    title: "Great Ocean Road remote work loop",
    startDate: "2026-05-12",
    endDate: "2026-05-19",
    timezone: "Australia/Melbourne",
    baseCurrency: "AUD",
    status: "planning",
    notes: "Seed trip for Stage 1 local-first preview data.",
  },
  days: [
    {
      id: "day-apollo-bay",
      tripId: "trip-great-ocean-road",
      date: "2026-05-12",
      orderKey: dayOneKey,
      notes: "Front-load groceries and signal checks before camp.",
      items: [
        {
          id: "item-drive-geelong",
          tripId: "trip-great-ocean-road",
          dayId: "day-apollo-bay",
          category: "transport",
          title: "Drive Melbourne to Apollo Bay",
          locationName: "Great Ocean Road",
          startMinuteOfDay: 480,
          endMinuteOfDay: 780,
          isAllDay: false,
          isFlexible: false,
          orderKey: dayOneFirstItemKey,
          estimatedCostMinor: 6800,
          currency: "AUD",
        },
        {
          id: "item-camp-apollo",
          tripId: "trip-great-ocean-road",
          dayId: "day-apollo-bay",
          category: "accommodation",
          title: "Camp setup and power check",
          locationName: "Apollo Bay",
          startMinuteOfDay: 1020,
          endMinuteOfDay: 1140,
          isAllDay: false,
          isFlexible: true,
          orderKey: dayOneSecondItemKey,
          estimatedCostMinor: 4500,
          currency: "AUD",
          notes: "Confirm battery recovery before evening work block.",
        },
      ],
    },
    {
      id: "day-port-campbell",
      tripId: "trip-great-ocean-road",
      date: "2026-05-13",
      orderKey: dayTwoKey,
      notes: "Keep the day light in case weather shifts the route.",
      items: [
        {
          id: "item-twelve-apostles",
          tripId: "trip-great-ocean-road",
          dayId: "day-port-campbell",
          category: "activity",
          title: "Twelve Apostles sunrise stop",
          locationName: "Port Campbell National Park",
          startMinuteOfDay: 390,
          endMinuteOfDay: 510,
          isAllDay: false,
          isFlexible: true,
          orderKey: dayTwoFirstItemKey,
          estimatedCostMinor: 0,
          currency: "AUD",
        },
      ],
    },
  ],
};
