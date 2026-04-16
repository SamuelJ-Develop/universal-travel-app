import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f4efe4" },
          headerTintColor: "#102418",
          contentStyle: { backgroundColor: "#f4efe4" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Universal Travel App" }} />
      </Stack>
    </>
  );
}
