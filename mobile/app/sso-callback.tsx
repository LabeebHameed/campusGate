import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in, redirect to main app
        router.replace('/(tabs)');
      } else {
        // Authentication failed, redirect to auth screen
        router.replace('/(auth)');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className="mt-4 text-lg">Completing sign in...</Text>
    </View>
  );
}


