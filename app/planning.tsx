import { Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { usePlanningPreview } from "@/features/planning/use-planning-preview";

export default function PlanningScreen() {
  const { isLoading, snapshot } = usePlanningPreview();

  return (
    <ScreenShell eyebrow="Planning Surface" title="Stage 1 route baseline">
      <Text className="mt-4 text-base leading-6 text-ink/80">
        This route now reads from the Stage 1 local data boundary. On native it
        seeds and reads through WatermelonDB; on web it falls back to the same
        snapshot shape with mock data.
      </Text>
      {isLoading ? (
        <Text className="mt-6 text-base text-ink/70">Loading local trip data...</Text>
      ) : snapshot ? (
        <View className="mt-6 gap-4">
          <View className="rounded-3xl border border-moss/10 bg-white px-5 py-5">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-rust">
              Active Preview Trip
            </Text>
            <Text className="mt-3 text-2xl font-bold text-ink">
              {snapshot.trip.title}
            </Text>
            <Text className="mt-2 text-base text-ink/80">
              {snapshot.trip.startDate} to {snapshot.trip.endDate ?? "Open-ended"} ·{" "}
              {snapshot.trip.baseCurrency} · {snapshot.mode}
            </Text>
            <Text className="mt-3 text-base leading-6 text-ink/80">
              {snapshot.trip.notes}
            </Text>
          </View>

          {snapshot.days.map((day) => (
            <View
              key={day.id}
              className="rounded-3xl border border-clay/40 bg-white px-5 py-5"
            >
              <Text className="text-sm font-semibold uppercase tracking-[2px] text-rust">
                {day.date}
              </Text>
              <Text className="mt-2 text-base text-ink/80">{day.notes}</Text>
              <View className="mt-4 gap-3">
                {day.items.map((item) => (
                  <View
                    key={item.id}
                    className="rounded-2xl bg-sand px-4 py-3"
                  >
                    <Text className="text-base font-semibold text-ink">
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-sm uppercase tracking-[1px] text-rust">
                      {item.category}
                    </Text>
                    <Text className="mt-2 text-sm text-ink/75">
                      {item.locationName ?? "Location pending"} · order key{" "}
                      {item.orderKey}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </ScreenShell>
  );
}
