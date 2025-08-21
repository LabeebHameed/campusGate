import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  withDelay,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface StatCardProps {
  label: string;
  value: string;
  index?: number;
}

export function StatCard({ label, value, index = 0 }: StatCardProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const hoverScale = useSharedValue(1);
  const valueOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animation
    const delay = index * 100;
    
    scale.value = withDelay(delay, withSpring(1, { 
      damping: 20, 
      stiffness: 300 
    }));
    
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    
    translateY.value = withDelay(delay, withSpring(0, { 
      damping: 20, 
      stiffness: 300 
    }));

    // Animate value and label with slight delay
    valueOpacity.value = withDelay(delay + 200, withTiming(1, { duration: 400 }));
    labelOpacity.value = withDelay(delay + 300, withTiming(1, { duration: 400 }));
  }, [index]);

  const hoverGesture = Gesture.Pan()
    .onBegin(() => {
      hoverScale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    })
    .onFinalize(() => {
      hoverScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    })
    .onTouchesUp(() => {
      hoverScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * hoverScale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const valueAnimatedStyle = useAnimatedStyle(() => ({
    opacity: valueOpacity.value,
    transform: [
      { 
        scale: interpolate(
          valueOpacity.value,
          [0, 1],
          [0.8, 1]
        )
      }
    ]
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [
      { 
        translateY: interpolate(
          labelOpacity.value,
          [0, 1],
          [10, 0]
        )
      }
    ]
  }));

  return (
    <GestureDetector gesture={hoverGesture}>
      <Animated.View 
        className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
        style={cardAnimatedStyle}
      >
        <Animated.Text 
          className="text-2xl font-bold text-gray-900 text-center" 
          style={valueAnimatedStyle}
        >
          {value}
        </Animated.Text>
        <Animated.Text 
          className="text-sm text-gray-500 text-center mt-1" 
          style={labelAnimatedStyle}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
} 