import { Text } from "react-native";

import { ScreenShell } from "@/components/screen-shell";

export default function ExecutionScreen() {
  return (
    <ScreenShell eyebrow="Execution Surface" title="Field-first baseline">
      <Text className="text-base leading-6 text-ink/80">
        This route reserves the mobile execution side of the product. It will
        grow into the fast, offline-first interaction layer for itinerary use in
        low-connectivity environments.
      </Text>
    </ScreenShell>
  );
}
