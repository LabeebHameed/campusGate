import "../global.css"
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoritesProvider } from '../hooks/useFavorites';

const queryClient = new QueryClient();

// You need to get this from your Clerk dashboard
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_your_key_here";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider 
        tokenCache={tokenCache}
        publishableKey={CLERK_PUBLISHABLE_KEY}
      >
        <FavoritesProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </FavoritesProvider>
      </ClerkProvider>
    </QueryClientProvider>
  )
}