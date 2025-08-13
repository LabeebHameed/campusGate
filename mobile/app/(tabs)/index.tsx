import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Text, View, Image, TextInput, Pressable, ScrollView, Dimensions, Platform, TouchableOpacity } from "react-native";
import { useMemo, useState, useCallback } from "react";
import { router } from "expo-router";
import CustomCarousel from "../../components/Carousel";
import { CarouselItem, CategoryItem } from "../../types";
import { getCarouselData } from "../../utils/data-helpers";
import { useUserSync } from "@/hooks/useUserSync";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Calculate responsive values based on screen size
const getResponsiveSize = (size: number) => {
  // Base size is calibrated for iPhone 16
  const baseWidth = 390;
  const scaleFactor = Math.min(SCREEN_WIDTH / baseWidth, 1.3); // Limit maximum scaling
  return size * scaleFactor;
};

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("colleges");

  // Responsive spacing values
  const headerMarginTop = getResponsiveSize(20);
  const sectionSpacing = getResponsiveSize(32);
  const bottomPadding = getResponsiveSize(20);
  const horizontalPadding = getResponsiveSize(20);
  const carouselBottomMargin = Platform.OS === 'ios' ? getResponsiveSize(80) : getResponsiveSize(60);

  // Get carousel data from organized data structure
  const carouselData: CarouselItem[] = useMemo(() => getCarouselData(), []);

  const categories: CategoryItem[] = useMemo(() => [
    { id: 'colleges', label: 'Colleges', isActive: selectedCategory === 'colleges' },
    { id: 'courses', label: 'Courses', isActive: selectedCategory === 'courses' },
    { id: 'exams', label: 'Exams', isActive: selectedCategory === 'exams' },
    { id: 'scholarships', label: 'Scholarships', isActive: selectedCategory === 'scholarships' },
    { id: 'internships', label: 'Internships', isActive: selectedCategory === 'internships' },
  ], [selectedCategory]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleFilterPress = useCallback(() => {
    // Handle filter functionality
    console.log('Filter pressed');
  }, []);

  useUserSync();

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
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: headerMarginTop 
        }}>
          <View style={{ flex: 1 }}>
            <Text className="text-2xl font-bold text-gray-900" accessibilityRole="header">
              Hello, Summayya
            </Text>
            <Text className="text-lg font-medium text-gray-500">
              Welcome to Campus Gate
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <View className="w-12 h-12 rounded-full bg-gray-300 justify-center items-center">
              <Image 
                source={{ uri: 'https://via.placeholder.com/48' }}
                className="w-12 h-12 rounded-full"
                accessibilityLabel="User profile picture"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{ marginTop: sectionSpacing }}>
          <View 
            className="flex-row items-center bg-white rounded-full border border-gray-300 px-4 py-3 shadow-sm"
          >
            <Feather name="search" size={20} color="#6B7280" />
            <View className="flex-1 ml-3">
              <Text className="text-base text-gray-500">
                {searchQuery || "Search Courses / Colleges"}
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
          </View>
        </View>

        {/* Category Selection */}
        <View style={{ marginTop: sectionSpacing }}>
          <Text className="text-2xl font-bold text-gray-900 mb-4" accessibilityRole="header">
            Choose your Next Step
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                className={`px-4 py-2 rounded-full mr-2 ${
                  category.isActive 
                    ? 'bg-gray-900' 
                    : 'bg-white border border-gray-200'
                }`}
                onPress={() => handleCategoryPress(category.id)}
                accessibilityLabel={`${category.label} category`}
                accessibilityRole="button"
                accessibilityState={{ selected: category.isActive }}
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
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Card Carousel */}
        <View style={{ marginTop: sectionSpacing * 0.75 }}>
          <CustomCarousel data={carouselData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
