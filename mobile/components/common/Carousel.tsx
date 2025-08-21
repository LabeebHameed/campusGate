import React, { useRef, useCallback, useEffect } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { 
  interpolate, 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CarouselItem } from '../../types';
import * as Haptics from 'expo-haptics';

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
  const isAnimating = useSharedValue(false);

  const handleItemPress = useCallback((item: CarouselItem) => {
    try {
      if (isAnimating.value) return; // Prevent multiple taps during animation
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (onItemPress) {
        onItemPress(item);
      } else {
        // Navigate to details screen with the college ID
        router.push(`/details/${item.id}`);
      }
    } catch (error) {
      console.error('Error handling item press:', error);
    }
  }, [onItemPress, router, isAnimating]);

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

      const rotateY = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [-15, 0, 15]
      );

      return {
        transform: [
          { scale },
          { rotateY: `${rotateY}deg` }
        ],
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
      
      const contentTranslateY = interpolate(
        animationValue.value,
        [-0.5, 0, 0.5],
        [20, 0, 20]
      );
      
      return {
        opacity: contentOpacity,
        transform: [{ translateY: contentTranslateY }]
      };
    });

    const buttonScale = useSharedValue(1);
    const buttonOpacity = useSharedValue(1);

    const handleButtonPress = () => {
      buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      buttonOpacity.value = withTiming(0.7, { duration: 100 });
      
      setTimeout(() => {
        buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
        buttonOpacity.value = withTiming(1, { duration: 200 });
      }, 100);
      
      handleItemPress(item);
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: buttonScale.value }],
      opacity: buttonOpacity.value,
    }));

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
        
        {/* Enhanced gradient overlay */}
        <View className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent rounded-[40px]" />
        
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
          <Text className="text-white text-sm font-medium mb-2" numberOfLines={1}>
            {item.location}
          </Text>
          
          {/* Rating and reviews */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-4">
              <Feather name="star" size={14} color="#F59E0B" />
              <Text className="text-white text-sm font-medium ml-1">
                {item.rating}
              </Text>
            </View>
            <Text className="text-white text-sm font-medium">
              {item.reviews}
            </Text>
          </View>
          
          {/* Enhanced action button */}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity 
              className="flex-row justify-between items-center bg-black/40 rounded-full p-4 mt-2"
              onPress={handleButtonPress}
              activeOpacity={0.9}
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

  const handleScrollBegin = useCallback(() => {
    isAnimating.value = true;
  }, [isAnimating]);

  const handleScrollEnd = useCallback(() => {
    setTimeout(() => {
      isAnimating.value = false;
    }, 300);
  }, [isAnimating]);

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
        onScrollBegin={handleScrollBegin}
        onScrollEnd={handleScrollEnd}
        snapEnabled={true}
        overscrollEnabled={true}
        defaultIndex={0}
        scrollAnimationDuration={800}
        windowSize={3}
        style={{
          width: SCREEN_WIDTH,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        enabled={true}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
          failOffsetY: [-20, 20],
        }}
      />
    </View>
  );
};

export default CustomCarousel;