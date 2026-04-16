import { Text } from "react-native";

import { ScreenShell } from "@/components/screen-shell";

export default function PlanningScreen() {
  return (
    <ScreenShell eyebrow="Planning Surface" title="Stage 1 route baseline">
      <Text className="mt-4 text-base leading-6 text-ink/80">
        This route exists to establish the initial shared app structure for
        future planning and execution mode work. Real trip flows will build on
        the Stage 1 schema and ordering decisions already documented in the
        repo.
      </Text>
    </ScreenShell>
  );
}
