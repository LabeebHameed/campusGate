import React, { useRef, useCallback } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { 
  interpolate, 
  useAnimatedStyle, 
  useSharedValue
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CarouselItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.8;
const ITEM_HEIGHT = ITEM_WIDTH * 1.37;

interface CustomCarouselProps {
  data: CarouselItem[];
  onItemPress?: (item: CarouselItem) => void;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ 
  data, 
  onItemPress 
}) => {
  const progressValue = useSharedValue<number>(0);
  const carouselRef = useRef<any>(null);
  const router = useRouter();

  const handleItemPress = useCallback((item: CarouselItem) => {
    try {
      if (onItemPress) {
        onItemPress(item);
      } else {
        // Navigate to details screen with the college ID
        router.push(`/details/${item.id}`);
      }
    } catch (error) {
      console.error('Error handling item press:', error);
    }
  }, [onItemPress, router]);

  const handleImageError = useCallback(() => {
    console.warn('Failed to load carousel image');
  }, []);

  const renderItem = useCallback(({ item, index, animationValue }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      if (!animationValue || typeof animationValue.value !== 'number') {
        return {
          transform: [{ scale: 1 }],
          opacity: 1,
        };
      }

      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.92, 1, 0.92]
      );

      const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.8, 1, 0.8]
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    const contentAnimatedStyle = useAnimatedStyle(() => {
      if (!animationValue || typeof animationValue.value !== 'number') {
        return { opacity: 1 };
      }

      const contentOpacity = interpolate(
        animationValue.value,
        [-0.5, 0, 0.5],
        [0, 1, 0]
      );
      
      return {
        opacity: contentOpacity,
      };
    });

    return (
      <Animated.View 
        className="w-[80vw] h-[100vw] rounded-[40px] overflow-hidden justify-end"
        style={animatedStyle}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} in ${item.location}`}
        accessibilityHint="Double tap to view details"
      >
        <Image 
          source={{ uri: item.imageUrl }} 
          className="absolute inset-0 rounded-[40px]" 
          resizeMode="cover"
          onError={handleImageError}
          accessibilityLabel={`${item.title} campus image`}
        />
        
        {/* Gradient overlay */}
        <View className="absolute inset-0 bg-black/25 rounded-[40px]" />
        
        {/* Content container */}
        <Animated.View 
          className="absolute bottom-0 left-0 right-0 p-5" 
          style={contentAnimatedStyle}
        >
          {/* College name */}
          <Text 
            className="text-white text-2xl font-semibold mb-1"
            numberOfLines={2}
            accessibilityRole="header"
          >
            {item.title}
          </Text>
          
          {/* Location */}
          <Text 
            className="text-white text-sm font-medium mb-2"
            numberOfLines={1}
          >
            {item.location}
          </Text>
          
          {/* Rating and reviews */}
          <View className="flex-row items-center mb-4">
            <Text className="text-white text-sm font-medium mr-2">
              {item.rating}
            </Text>
            <Text className="text-white text-sm font-medium">
              {item.reviews}
            </Text>
          </View>
          
          {/* Action button */}
          <TouchableOpacity 
            className="flex-row justify-between items-center bg-black/40 rounded-full p-4 mt-2"
            onPress={() => handleItemPress(item)}
            activeOpacity={0.8}
            accessibilityLabel="View more details"
            accessibilityRole="button"
          >
            <Text className="text-white text-base font-medium">
              See more
            </Text>
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center">
              <Feather name="chevron-right" size={15} color="#212529" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }, [handleItemPress, handleImageError]);

  const handleProgressChange = useCallback((progress: number) => {
    try {
      progressValue.value = progress;
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [progressValue]);

  if (!data || data.length === 0) {
    return (
      <View className="w-full h-32 justify-center items-center">
        <Text className="text-gray-500 text-base">No colleges available</Text>
      </View>
    );
  }

  return (
    <View className="w-full justify-start items-center">
      <Carousel
        ref={carouselRef}
        loop
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        data={data}
        renderItem={renderItem}
        onProgressChange={handleProgressChange}
        snapEnabled={true}
        overscrollEnabled={true}
        defaultIndex={0}
        scrollAnimationDuration={1000}
        windowSize={3}
        style={{
          width: SCREEN_WIDTH,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        enabled={true}
      />
    </View>
  );
};

export default CustomCarousel;