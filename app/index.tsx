import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const priorities = [
  "Local-first trip, day, and itinerary foundations",
  "Offline-safe ordering with fractional index keys",
  "Planning and execution surfaces sharing one data model",
];

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-sand">
      <View className="min-h-screen flex-1 px-6 pb-12 pt-16">
        <View className="rounded-[32px] bg-moss px-6 py-8">
          <Text className="text-xs font-semibold uppercase tracking-[3px] text-clay">
            Stage 1 Scaffold
          </Text>
          <Text className="mt-4 text-4xl font-bold text-sand">
            Universal Travel App
          </Text>
          <Text className="mt-4 text-base leading-6 text-sand/85">
            An Expo foundation for a local-first travel operating system built
            around offline planning, field execution, and sync-ready data.
          </Text>
        </View>

        <View className="mt-6 rounded-[28px] border border-moss/10 bg-white px-5 py-6">
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-rust">
            Current Build Focus
          </Text>
          <View className="mt-4 gap-3">
            {priorities.map((priority) => (
              <View
                key={priority}
                className="rounded-2xl border border-clay/40 bg-sand px-4 py-3"
              >
                <Text className="text-base text-ink">{priority}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-6 rounded-[28px] bg-rust px-5 py-6">
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-sand/80">
            Shared Direction
          </Text>
          <Text className="mt-3 text-2xl font-semibold text-white">
            One app, two operating modes.
          </Text>
          <Text className="mt-3 text-base leading-6 text-white/90">
            Desktop-leaning planning flows and mobile execution flows will live
            on the same route tree and schema foundation.
          </Text>
          <Link href="/planning" asChild>
            <Pressable className="mt-5 rounded-full bg-white px-5 py-3">
              <Text className="text-center text-sm font-semibold uppercase tracking-[2px] text-rust">
                Open planning preview
              </Text>
            </Pressable>
          </Link>
          <Link href="/execution" asChild>
            <Pressable className="mt-3 rounded-full border border-white/35 px-5 py-3">
              <Text className="text-center text-sm font-semibold uppercase tracking-[2px] text-white">
                Open execution preview
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
