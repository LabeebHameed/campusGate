import { Stack } from "expo-router";

export default function DetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // This ensures the tab bar doesn't show on details screens
        presentation: "modal",
        // This animation style matches modern apps
        animation: "slide_from_right",
      }}
    />
  );
} 