import React from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AppLoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center">
          {/* App Logo or Icon */}
          <View className="w-24 h-24 bg-gray-900 rounded-2xl mb-8 justify-center items-center">
            <Text className="text-white text-2xl font-bold">CG</Text>
          </View>
          
          {/* Loading Spinner */}
          <ActivityIndicator size="large" color="#1F2937" />
          
          {/* Loading Text */}
          <Text className="text-xl font-semibold text-gray-900 mt-6">
            Campus Gate
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Loading colleges and courses...
          </Text>
          
          {/* Optional: Progress or tip */}
          <Text className="text-gray-400 text-sm mt-8 text-center">
            Connecting to database
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 