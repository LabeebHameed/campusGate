import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={{ pathname: "/(tabs)", params: { id: 1 } }} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
