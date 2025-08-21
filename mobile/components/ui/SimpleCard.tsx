import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface SimpleCardProps {
  title: string;
  subtitle: string;
  rating: string;
  onPress: () => void;
  showArrow?: boolean;
}

export function SimpleCard({ title, subtitle, rating, onPress, showArrow = true }: SimpleCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const arrowRotation = useSharedValue(0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(2, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(0.8, { duration: 150 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
      runOnJS(handlePress)();
    })
    .onTouchesUp(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${arrowRotation.value}deg` }
    ],
  }));

  const handleArrowPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    arrowRotation.value = withSpring(90, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      arrowRotation.value = withSpring(0, { damping: 15, stiffness: 300 });
    }, 200);
    onPress();
  };

  return (
    <GestureDetector gesture={pressGesture}>
      <Animated.View 
        className="bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-100 shadow-sm"
        style={cardAnimatedStyle}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 mb-1">
              {title}
            </Text>
            <Text className="text-sm text-gray-500 mb-2">
              {subtitle}
            </Text>
            <View className="flex-row items-center">
              <Feather name="star" size={14} color="#F59E0B" />
              <Text className="text-sm font-medium text-gray-700 ml-1">
                {rating}
              </Text>
            </View>
          </View>
          
          {showArrow ? (
            <Animated.View 
              className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center ml-4"
              style={arrowAnimatedStyle}
            >
              <Feather 
                name="chevron-right" 
                size={18} 
                color="white" 
              />
            </Animated.View>
          ) : null}
        </View>
      </Animated.View>
    </GestureDetector>
  );
} 