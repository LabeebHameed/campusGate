import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style 
}: SkeletonLoaderProps) {
  const shimmerTranslateX = useSharedValue(-100);

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(100, { 
        duration: 1500, 
        easing: Easing.bezier(0.4, 0, 0.2, 1) 
      }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(
          shimmerTranslateX.value,
          [-100, 100],
          [-100, 100]
        )
      }
    ],
  }));

  return (
    <View 
      style={[
        { 
          width, 
          height, 
          borderRadius,
          backgroundColor: '#f3f4f6',
          overflow: 'hidden'
        },
        style
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#e5e7eb',
            transform: [{ translateX: -100 }]
          },
          shimmerStyle
        ]}
      />
    </View>
  );
}

// Predefined skeleton components for common use cases
export function SkeletonCard() {
  return (
    <View className="bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-100 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <SkeletonLoader height={20} width="80%" style={{ marginBottom: 8 }} />
          <SkeletonLoader height={16} width="60%" style={{ marginBottom: 16 }} />
          <View className="flex-row items-center">
            <SkeletonLoader height={14} width={14} borderRadius={7} />
            <SkeletonLoader height={14} width={40} style={{ marginLeft: 8 }} />
          </View>
        </View>
        <SkeletonLoader height={40} width={40} borderRadius={20} />
      </View>
    </View>
  );
}

export function SkeletonStatCard() {
  return (
    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <SkeletonLoader height={32} width="60%" style={{ alignSelf: 'center', marginBottom: 8 }} />
      <SkeletonLoader height={16} width="80%" style={{ alignSelf: 'center' }} />
    </View>
  );
}

export function SkeletonCarouselItem() {
  return (
    <View className="w-[80vw] h-[100vw] rounded-[40px] bg-gray-200 overflow-hidden justify-end">
      <View className="absolute bottom-0 left-0 right-0 p-5">
        <SkeletonLoader height={28} width="70%" style={{ marginBottom: 8 }} />
        <SkeletonLoader height={16} width="50%" style={{ marginBottom: 16 }} />
        <View className="flex-row items-center mb-4">
          <SkeletonLoader height={14} width={40} />
          <SkeletonLoader height={14} width={60} style={{ marginLeft: 16 }} />
        </View>
        <View className="flex-row justify-between items-center bg-gray-300 rounded-full p-4 mt-2">
          <SkeletonLoader height={20} width={80} />
          <SkeletonLoader height={48} width={48} borderRadius={24} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonCategoryItem() {
  return (
    <SkeletonLoader height={36} width={80} borderRadius={18} />
  );
}
