import "../global.css"
import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoritesProvider } from '../hooks/useFavorites';
import { DataWrapper } from '../components';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

// You need to get this from your Clerk dashboard
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_your_key_here";

// Authentication wrapper component
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        // Redirect to auth screen if not signed in
        router.replace('/(auth)');
      } else {
        // Redirect to main app if signed in
        router.replace('/(tabs)');
      }
    }
  }, [isSignedIn, isLoaded]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider 
          tokenCache={tokenCache}
          publishableKey={CLERK_PUBLISHABLE_KEY}
        >
          <FavoritesProvider>
            <DataWrapper>
              <AuthWrapper>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="profile" options={{ headerShown: false }} />
                  <Stack.Screen name="search" options={{ headerShown: false }} />
                  <Stack.Screen name="course" options={{ headerShown: false }} />
                  <Stack.Screen name="details" options={{ headerShown: false }} />
                </Stack>
              </AuthWrapper>
            </DataWrapper>
          </FavoritesProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}