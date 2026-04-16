import type { ReactNode } from "react";
import { Text, View } from "react-native";

type ScreenShellProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function ScreenShell({ eyebrow, title, children }: ScreenShellProps) {
  return (
    <View className="flex-1 bg-sand px-6 py-8">
      <Text className="text-sm font-semibold uppercase tracking-[2px] text-rust">
        {eyebrow}
      </Text>
      <Text className="mt-4 text-3xl font-bold text-ink">{title}</Text>
      <View className="mt-4">{children}</View>
    </View>
  );
}
