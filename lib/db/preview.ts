import { Q } from "@nozbe/watermelondb";

import { getOrderKeysBetween } from "@/lib/db/order-keys";
import { Day, ItineraryItem, Trip } from "@/lib/db/models";
import { mockPlanningSnapshot } from "@/lib/db/mock";
import type {
  ItineraryCategory,
  PlanningSnapshot,
  TripStatus,
} from "@/lib/db/types";

function now() {
  return Date.now();
}

export async function seedDatabase(database: any) {
  const trips = database.get("trips") as {
    query: () => { fetchCount: () => Promise<number> };
    create: (builder: (record: Trip) => void) => Promise<Trip>;
  };
  const existingTrips = await trips.query().fetchCount();

  if (existingTrips > 0) {
    return;
  }

  const timestamp = now();
  const [dayOneKey, dayTwoKey] = getOrderKeysBetween(null, null, 2);
  const [dayOneFirstItemKey, dayOneSecondItemKey] = getOrderKeysBetween(
    null,
    null,
    2,
  );
  const [dayTwoFirstItemKey] = getOrderKeysBetween(null, null, 1);

  await database.write(async () => {
    const trip = await trips.create((record: Trip) => {
      record._raw.id = mockPlanningSnapshot.trip.id;
      record.title = mockPlanningSnapshot.trip.title;
      record.startDate = mockPlanningSnapshot.trip.startDate;
      record.endDate = mockPlanningSnapshot.trip.endDate;
      record.timezone = mockPlanningSnapshot.trip.timezone;
      record.baseCurrency = mockPlanningSnapshot.trip.baseCurrency;
      record.notes = mockPlanningSnapshot.trip.notes;
      record.status = mockPlanningSnapshot.trip.status;
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });

    const days = database.get("days") as {
      create: (builder: (record: Day) => void) => Promise<Day>;
    };
    const items = database.get("itinerary_items") as {
      create: (builder: (record: ItineraryItem) => void) => Promise<ItineraryItem>;
    };

    const dayOne = await days.create((record: Day) => {
      record._raw.id = mockPlanningSnapshot.days[0].id;
      record.tripId = trip.id;
      record.date = mockPlanningSnapshot.days[0].date;
      record.orderKey = dayOneKey;
      record.notes = mockPlanningSnapshot.days[0].notes;
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });

    const dayTwo = await days.create((record: Day) => {
      record._raw.id = mockPlanningSnapshot.days[1].id;
      record.tripId = trip.id;
      record.date = mockPlanningSnapshot.days[1].date;
      record.orderKey = dayTwoKey;
      record.notes = mockPlanningSnapshot.days[1].notes;
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });

    await items.create((record: ItineraryItem) => {
      const source = mockPlanningSnapshot.days[0].items[0];
      record._raw.id = source.id;
      record.tripId = trip.id;
      record.dayId = dayOne.id;
      record.category = source.category;
      record.title = source.title;
      record.locationName = source.locationName;
      record.startMinuteOfDay = source.startMinuteOfDay;
      record.endMinuteOfDay = source.endMinuteOfDay;
      record.isAllDay = source.isAllDay;
      record.isFlexible = source.isFlexible;
      record.orderKey = dayOneFirstItemKey;
      record.estimatedCostMinor = source.estimatedCostMinor;
      record.currency = source.currency;
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });

    await items.create((record: ItineraryItem) => {
      const source = mockPlanningSnapshot.days[0].items[1];
      record._raw.id = source.id;
      record.tripId = trip.id;
      record.dayId = dayOne.id;
      record.category = source.category;
      record.title = source.title;
      record.locationName = source.locationName;
      record.startMinuteOfDay = source.startMinuteOfDay;
      record.endMinuteOfDay = source.endMinuteOfDay;
      record.isAllDay = source.isAllDay;
      record.isFlexible = source.isFlexible;
      record.orderKey = dayOneSecondItemKey;
      record.estimatedCostMinor = source.estimatedCostMinor;
      record.currency = source.currency;
      record.notes = source.notes;
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });

    await items.create((record: ItineraryItem) => {
      const source = mockPlanningSnapshot.days[1].items[0];
      record._raw.id = source.id;
      record.tripId = trip.id;
      record.dayId = dayTwo.id;
      record.category = source.category;
      record.title = source.title;
      record.locationName = source.locationName;
      record.startMinuteOfDay = source.startMinuteOfDay;
      record.endMinuteOfDay = source.endMinuteOfDay;
      record.isAllDay = source.isAllDay;
      record.isFlexible = source.isFlexible;
      record.orderKey = dayTwoFirstItemKey;
      record.estimatedCostMinor = source.estimatedCostMinor;
      record.currency = source.currency;
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });
  });
}

export async function loadPlanningSnapshotFromDatabase(
  database: any,
): Promise<PlanningSnapshot> {
  const trips = database.get("trips") as {
    query: () => { fetch: () => Promise<Trip[]> };
  };
  const trip = await trips.query().fetch().then((rows: Trip[]) => rows[0]);

  if (!trip) {
    return mockPlanningSnapshot;
  }

  const days = await (database.get("days") as {
    query: (...clauses: unknown[]) => { fetch: () => Promise<Day[]> };
  })
    .query(Q.where("trip_id", trip.id), Q.sortBy("order_key", Q.asc))
    .fetch();

  const dayIds = days.map((day: Day) => day.id);
  const items = dayIds.length
    ? await (database.get("itinerary_items") as {
        query: (...clauses: unknown[]) => { fetch: () => Promise<ItineraryItem[]> };
      })
        .query(Q.where("day_id", Q.oneOf(dayIds)), Q.sortBy("order_key", Q.asc))
        .fetch()
    : [];

  return {
    mode: "watermelon",
    trip: {
      id: trip.id,
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
      timezone: trip.timezone,
      baseCurrency: trip.baseCurrency,
      status: trip.status as TripStatus,
      notes: trip.notes,
    },
    days: days.map((day: Day) => ({
      id: day.id,
      tripId: day.tripId,
      date: day.date,
      orderKey: day.orderKey,
      notes: day.notes,
      items: items
        .filter((item: ItineraryItem) => item.dayId === day.id)
        .map((item: ItineraryItem) => ({
          id: item.id,
          tripId: item.tripId,
          dayId: item.dayId,
          category: item.category as ItineraryCategory,
          title: item.title,
          locationName: item.locationName,
          timezone: item.timezone,
          startMinuteOfDay: item.startMinuteOfDay,
          endMinuteOfDay: item.endMinuteOfDay,
          isAllDay: item.isAllDay,
          isFlexible: item.isFlexible,
          orderKey: item.orderKey,
          estimatedCostMinor: item.estimatedCostMinor,
          actualCostMinor: item.actualCostMinor,
          currency: item.currency,
          notes: item.notes,
        })),
    })),
  };
}
