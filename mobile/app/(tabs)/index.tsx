import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Text, View, Image, TextInput, Pressable, ScrollView, Dimensions, Platform, TouchableOpacity } from "react-native";
import { useMemo, useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
import { Carousel } from "../../components";
import { CarouselItem, CategoryItem } from "../../types";
import { getFilteredCarouselData } from "../../utils/data-helpers";
import { useUserSync } from "@/hooks/useUserSync";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Calculate responsive values based on screen size
const getResponsiveSize = (size: number) => {
  // Base size is calibrated for iPhone 16
  const baseWidth = 390;
  const scaleFactor = Math.min(SCREEN_WIDTH / baseWidth, 1.3); // Limit maximum scaling
  return size * scaleFactor;
};

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("maharashtra");

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const searchOpacity = useSharedValue(0);
  const searchTranslateY = useSharedValue(40);
  const categoryOpacity = useSharedValue(0);
  const categoryTranslateY = useSharedValue(50);
  const carouselOpacity = useSharedValue(0);
  const carouselTranslateY = useSharedValue(60);

  // Responsive spacing values
  const headerMarginTop = getResponsiveSize(20);
  const sectionSpacing = getResponsiveSize(32);
  const bottomPadding = getResponsiveSize(20);
  const horizontalPadding = getResponsiveSize(20);
  const carouselBottomMargin = Platform.OS === 'ios' ? getResponsiveSize(80) : getResponsiveSize(60);

  // Get filtered carousel data based on selected category (limited to first 5 items)
  const carouselData: CarouselItem[] = useMemo(() => 
    getFilteredCarouselData(selectedCategory), 
    [selectedCategory]
  );

  const categories: CategoryItem[] = useMemo(() => [
    { id: 'maharashtra', label: 'Maharashtra', isActive: selectedCategory === 'maharashtra' },
    { id: 'tamil-nadu', label: 'Tamil Nadu', isActive: selectedCategory === 'tamil-nadu' },
    { id: 'karnataka', label: 'Karnataka', isActive: selectedCategory === 'karnataka' },
    { id: 'gujarat', label: 'Gujarat', isActive: selectedCategory === 'gujarat' },
    { id: 'west-bengal', label: 'West Bengal', isActive: selectedCategory === 'west-bengal' },
  ], [selectedCategory]);

  // Entrance animations
  useEffect(() => {
    // Staggered entrance animation
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 300 }));

    searchOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    searchTranslateY.value = withDelay(300, withSpring(0, { damping: 20, stiffness: 300 }));

    categoryOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    categoryTranslateY.value = withDelay(500, withSpring(0, { damping: 20, stiffness: 300 }));

    carouselOpacity.value = withDelay(700, withTiming(1, { duration: 800 }));
    carouselTranslateY.value = withDelay(700, withSpring(0, { damping: 20, stiffness: 300 }));
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
  }, []);

  const handleFilterPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle filter functionality
    console.log('Filter pressed');
  }, []);

  const handleProfilePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  }, []);

  const handleSearchPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/search');
  }, []);

  useUserSync();

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ translateY: searchTranslateY.value }]
  }));

  const categoryAnimatedStyle = useAnimatedStyle(() => ({
    opacity: categoryOpacity.value,
    transform: [{ translateY: categoryTranslateY.value }]
  }));

  const carouselAnimatedStyle = useAnimatedStyle(() => ({
    opacity: carouselOpacity.value,
    transform: [{ translateY: carouselTranslateY.value }]
  }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: horizontalPadding,
          paddingBottom: carouselBottomMargin
        }}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            { 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: headerMarginTop 
            },
            headerAnimatedStyle
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text className="text-2xl font-bold text-gray-900" accessibilityRole="header">
              Hello, Summayya
            </Text>
            <Text className="text-lg font-medium text-gray-500">
              Welcome to Campus Gate
            </Text>
          </View>
          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.8}>
            <View className="w-12 h-12 rounded-full bg-gray-300 justify-center items-center">
              <Image 
                source={{ uri: 'https://via.placeholder.com/48' }}
                className="w-12 h-12 rounded-full"
                accessibilityLabel="User profile picture"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View style={[searchAnimatedStyle, { marginTop: sectionSpacing }]}>
          <Pressable
            className="flex-row items-center bg-white rounded-full border border-gray-300 px-4 py-3 shadow-sm"
            onPress={handleSearchPress}
            accessibilityLabel="Search for colleges and courses"
            accessibilityRole="button"
          >
            <Feather name="search" size={20} color="#6B7280" />
            <View className="flex-1 ml-3">
              <Text className="text-base text-gray-500">
                "Search Courses / Colleges"
              </Text>
            </View>
            <Pressable
              className="w-12 h-12 bg-gray-900 rounded-full justify-center items-center"
              onPress={handleFilterPress}
              accessibilityLabel="Filter options"
              accessibilityRole="button"
            >
              <Feather name="filter" size={18} color="#F9FAFB" />
            </Pressable>
          </Pressable>
        </Animated.View>

        {/* Category Selection */}
        <Animated.View style={[categoryAnimatedStyle, { marginTop: sectionSpacing }]}>
          <Text className="text-2xl font-bold text-gray-900 mb-4" accessibilityRole="header">
            Choose your Next Step
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {categories.map((category, index) => (
              <AnimatedCategoryItem
                key={category.id}
                category={category}
                index={index}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Card Carousel */}
        <Animated.View style={[carouselAnimatedStyle, { marginTop: sectionSpacing * 0.75 }]}>
          <Carousel data={carouselData} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Animated Category Item Component
interface AnimatedCategoryItemProps {
  category: CategoryItem;
  index: number;
  onPress: () => void;
}

const AnimatedCategoryItem: React.FC<AnimatedCategoryItemProps> = ({ 
  category, 
  index, 
  onPress 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = index * 100;
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 300 }));
  }, [index]);

  const handlePress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate press
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, 100);
    
    // Call the onPress function
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
                className={`px-4 py-2 rounded-full mr-2 ${
                  category.isActive 
                    ? 'bg-gray-900' 
                    : 'bg-white border border-gray-200'
                }`}
        style={animatedStyle}
              >
                <Text 
                  className={`text-sm font-semibold ${
                    category.isActive 
                      ? 'text-white' 
                      : 'text-gray-500'
                  }`}
                >
                  {category.label}
                </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default HomeScreen;
