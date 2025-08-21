import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Text, View, Image, TextInput, Pressable, ScrollView, Dimensions, Platform, TouchableOpacity, Animated } from "react-native";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { College, Course } from "../data";
import { colleges, courses, waitForColleges, waitForCourses } from "../data";
import AnimatedReanimated, { 
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Calculate responsive values based on screen size
const getResponsiveSize = (size: number) => {
  const baseWidth = 390;
  const scaleFactor = Math.min(SCREEN_WIDTH / baseWidth, 1.3);
  return size * scaleFactor;
};

interface SearchResult {
  id: string;
  type: 'college' | 'course';
  title: string;
  subtitle: string;
  image: string;
  rating: string;
  location?: string;
  duration?: string;
  fee?: string;
}

// Skeleton Loading Component
const SkeletonCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600, // Faster animation - reduced from 1000ms
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600, // Faster animation - reduced from 1000ms
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View className="bg-white mx-4 mb-3 p-4 rounded-2xl border border-gray-100 shadow-sm">
      <View className="flex-row">
        {/* Image Skeleton */}
        <Animated.View 
          style={{ opacity }}
          className="w-16 h-16 rounded-xl mr-3 bg-gray-200"
        />
        
        {/* Content Skeleton */}
        <View className="flex-1">
          {/* Title Skeleton */}
          <View className="mb-2">
            <Animated.View 
              style={{ opacity }}
              className="h-5 bg-gray-200 rounded mb-1"
            />
            <Animated.View 
              style={{ opacity }}
              className="h-4 bg-gray-200 rounded w-3/4"
            />
          </View>
          
          {/* Subtitle Skeleton */}
          <Animated.View 
            style={{ opacity }}
            className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"
          />
          
          {/* Badges and Info Skeleton */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              {/* Type Badge Skeleton */}
              <Animated.View 
                style={{ opacity }}
                className="w-16 h-6 bg-gray-200 rounded-full"
              />
              
              {/* Rating Skeleton */}
              <Animated.View 
                style={{ opacity }}
                className="w-12 h-6 bg-gray-200 rounded-full"
              />
            </View>
            
            {/* Location/Duration Skeleton */}
            <Animated.View 
              style={{ opacity }}
              className="w-20 h-4 bg-gray-200 rounded"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

// Multiple Skeleton Cards
const SkeletonCards = ({ count = 3 }: { count?: number }) => {
  return (
    <View className="pt-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
};

// Animated Search Result Card
const AnimatedSearchResultCard: React.FC<{
  result: SearchResult;
  index: number;
  onPress: (result: SearchResult) => void;
}> = ({ result, index, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    const delay = 500 + (index * 100);
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 300 }));
  }, [index]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(result);
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      runOnJS(handlePress)();
    })
    .onTouchesUp(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <GestureDetector gesture={pressGesture}>
      <AnimatedReanimated.View
        className="bg-white mx-4 mb-3 p-4 rounded-2xl border border-gray-100 shadow-sm"
        style={animatedStyle}
      >
        <View className="flex-row">
          {/* Image */}
          <Image
            source={{ uri: result.image }}
            className="w-16 h-16 rounded-xl mr-3"
            resizeMode="cover"
          />
          
          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-base font-semibold text-gray-900 flex-1 mr-2" numberOfLines={2}>
                {result.title}
              </Text>
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            </View>
            
            <Text className="text-sm text-gray-600 mb-2.5" numberOfLines={1}>
              {result.subtitle}
            </Text>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                {/* Type Badge */}
                <View className={`px-2.5 py-1 rounded-full ${
                  result.type === 'college' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    result.type === 'college' ? 'text-blue-700' : 'text-purple-700'
                  }`}>
                    {result.type === 'college' ? 'College' : 'Course'}
                  </Text>
                </View>
                
                {/* Rating Display */}
                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-full">
                  <Feather name="star" size={12} color="#F59E0B" />
                  <Text className="text-xs font-medium text-gray-900 ml-1">
                    {result.rating}
                  </Text>
                </View>
              </View>
              
              {/* Location/Duration */}
              {result.type === 'college' && result.location ? (
                <Text className="text-xs text-gray-600 font-medium" numberOfLines={1}>
                  {result.location}
                </Text>
              ) : null}
              
              {result.type === 'course' && result.duration ? (
                <Text className="text-xs text-gray-600 font-medium">
                  {result.duration}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </AnimatedReanimated.View>
    </GestureDetector>
  );
};

// Animated Recent Search Item
const AnimatedRecentSearchItem: React.FC<{
  item: SearchResult;
  index: number;
  onPress: (result: SearchResult) => void;
}> = ({ item, index, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    const delay = 700 + (index * 100);
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 300 }));
  }, [index]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item);
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      runOnJS(handlePress)();
    })
    .onTouchesUp(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <GestureDetector gesture={pressGesture}>
      <AnimatedReanimated.View
        className="bg-white mb-3 p-4 rounded-2xl border border-gray-100 shadow-sm"
        style={animatedStyle}
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.image }}
            className="w-16 h-16 rounded-xl mr-3"
            resizeMode="cover"
          />
          
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-base font-semibold text-gray-900 flex-1 mr-2" numberOfLines={2}>
                {item.title}
              </Text>
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            </View>
            
            <Text className="text-sm text-gray-600 mb-2.5" numberOfLines={1}>
              {item.subtitle}
            </Text>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <View className={`px-2.5 py-1 rounded-full ${
                  item.type === 'college' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    item.type === 'college' ? 'text-blue-700' : 'text-purple-700'
                  }`}>
                    {item.type === 'college' ? 'College' : 'Course'}
                  </Text>
                </View>
                
                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-full">
                  <Feather name="star" size={12} color="#F59E0B" />
                  <Text className="text-xs font-medium text-gray-900 ml-1">
                    {item.rating}
                  </Text>
                </View>
              </View>
              
              {item.type === 'college' && item.location ? (
                <Text className="text-xs text-gray-600 font-medium" numberOfLines={1}>
                  {item.location}
                </Text>
              ) : null}
              
              {item.type === 'course' && item.duration ? (
                <Text className="text-xs text-gray-600 font-medium">
                  {item.duration}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </AnimatedReanimated.View>
    </GestureDetector>
  );
};

const SearchScreen = () => {
  const { query: initialQuery = "" } = useLocalSearchParams<{ query: string }>();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'colleges' | 'courses'>('all');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
  // Filter states
  const [selectedRanking, setSelectedRanking] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const searchBarOpacity = useSharedValue(0);
  const searchBarTranslateY = useSharedValue(40);
  const tabsOpacity = useSharedValue(0);
  const tabsTranslateY = useSharedValue(40);
  const filtersOpacity = useSharedValue(0);
  const filtersTranslateY = useSharedValue(40);
  
  // Recent searches (mock data - replace with actual storage later)
  const [recentSearches] = useState<SearchResult[]>([
    {
      id: 'recent-1',
      type: 'college',
      title: 'IIT Bombay',
      subtitle: 'Engineering • Government',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      rating: '4.8',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: 'recent-2',
      type: 'course',
      title: 'Computer Science Engineering',
      subtitle: 'B.Tech in Computer Science',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      rating: '4.6',
      duration: '4 Years'
    },
    {
      id: 'recent-3',
      type: 'college',
      title: 'Delhi University',
      subtitle: 'Arts & Science • Government',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      rating: '4.5',
      location: 'Delhi, Delhi'
    }
  ]);

  // Responsive spacing values
  const headerMarginTop = getResponsiveSize(20);
  const sectionSpacing = getResponsiveSize(24);
  const horizontalPadding = getResponsiveSize(20);

  useEffect(() => {
    // Staggered entrance animations
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 300 }));
    
    searchBarOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    searchBarTranslateY.value = withDelay(200, withSpring(0, { damping: 20, stiffness: 300 }));
    
    tabsOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    tabsTranslateY.value = withDelay(300, withSpring(0, { damping: 20, stiffness: 300 }));
    
    filtersOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    filtersTranslateY.value = withDelay(400, withSpring(0, { damping: 20, stiffness: 300 }));
  }, []);

  // Search function
  const performSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    
    try {
      // Wait for data to load
      await Promise.all([waitForColleges(), waitForCourses()]);
      
      let results: SearchResult[] = [];

      if (query.trim()) {
        // Search with query
        const queryLower = query.toLowerCase();
        
        // Search colleges
        Object.values(colleges).forEach(college => {
          // Add null checks and fallback values
          const collegeName = college.name || '';
          const collegeState = college.state || '';
          const collegeDistrict = college.district || '';
          const collegeType = college.type || '';
          const collegeManagement = college.management || '';
          
          if (
            collegeName.toLowerCase().includes(queryLower) ||
            collegeState.toLowerCase().includes(queryLower) ||
            collegeDistrict.toLowerCase().includes(queryLower) ||
            collegeType.toLowerCase().includes(queryLower)
          ) {
            results.push({
              id: college.id || '',
              type: 'college',
              title: collegeName,
              subtitle: `${collegeType} • ${collegeManagement}`,
              image: college.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              rating: college.rating || '4.0',
              location: `${collegeDistrict}, ${collegeState}`,
            });
          }
        });

        // Search courses
        Object.values(courses).forEach(course => {
          // Add null checks and fallback values
          const courseTitle = course.title || '';
          const courseDescription = course.description || '';
          const courseCategory = course.category || '';
          const courseProgramType = course.programType || '';
          const courseSubtitle = course.subtitle || courseTitle;
          const courseDuration = course.duration || '4 Years';
          const courseFee = course.fee || 0;
          
          if (
            courseTitle.toLowerCase().includes(queryLower) ||
            courseDescription.toLowerCase().includes(queryLower) ||
            courseCategory.toLowerCase().includes(queryLower) ||
            courseProgramType.toLowerCase().includes(queryLower)
          ) {
            results.push({
              id: course.id || '',
              type: 'course',
              title: courseTitle,
              subtitle: courseSubtitle,
              image: course.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              rating: course.rating || '4.0',
              duration: courseDuration,
              fee: `₹${courseFee.toLocaleString()}`,
            });
          }
        });

        // Sort results by relevance (exact matches first)
        results.sort((a, b) => {
          const aExact = a.title.toLowerCase() === queryLower;
          const bExact = b.title.toLowerCase() === queryLower;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          return 0;
        });
      } else {
        // No query - load all data for filtering
        Object.values(colleges).forEach(college => {
          const collegeName = college.name || '';
          const collegeState = college.state || '';
          const collegeDistrict = college.district || '';
          const collegeType = college.type || '';
          const collegeManagement = college.management || '';
          
          results.push({
            id: college.id || '',
            type: 'college',
            title: collegeName,
            subtitle: `${collegeType} • ${collegeManagement}`,
            image: college.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            rating: college.rating || '4.0',
            location: `${collegeDistrict}, ${collegeState}`,
          });
        });

        Object.values(courses).forEach(course => {
          const courseTitle = course.title || '';
          const courseSubtitle = course.subtitle || courseTitle;
          const courseDuration = course.duration || '4 Years';
          const courseFee = course.fee || 0;
          
          results.push({
            id: course.id || '',
            type: 'course',
            title: courseTitle,
            subtitle: courseSubtitle,
            image: course.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            rating: course.rating || '4.0',
            duration: courseDuration,
            fee: `₹${courseFee.toLocaleString()}`,
          });
        });
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      console.error('Error details:', {
        collegesCount: Object.keys(colleges).length,
        coursesCount: Object.keys(courses).length,
        query: query,
        errorMessage: error.message
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pre-calculate tab counts for smooth tab switching
  const tabCounts = useMemo(() => {
    const collegesCount = searchResults.filter(r => r.type === 'college').length;
    const coursesCount = searchResults.filter(r => r.type === 'course').length;
    return {
      all: searchResults.length,
      colleges: collegesCount,
      courses: coursesCount
    };
  }, [searchResults]);

  // Filter results based on active tab and selected filters
  const filteredResults = useMemo(() => {
    // Early return if no search results
    if (searchResults.length === 0) return [];
    
    let results = searchResults;
    
    // If no search query and no filters, show recent searches
    if (!searchQuery.trim() && !selectedRanking && !selectedLocation && !selectedCategory && !selectedType && activeTab === 'all') {
      return [];
    }
    
    // First filter by type (college/course) - most efficient filter
    if (activeTab === 'colleges') {
      results = results.filter(result => result.type === 'college');
    } else if (activeTab === 'courses') {
      results = results.filter(result => result.type === 'course');
    }
    
    // Only apply additional filters if they're selected
    if (selectedRanking) {
      results = results.filter(result => {
        const rating = parseFloat(result.rating);
        switch (selectedRanking) {
          case 'top-10': return rating >= 4.5;
          case 'top-25': return rating >= 4.0;
          case 'top-50': return rating >= 3.5;
          case 'top-100': return rating >= 3.0;
          default: return true;
        }
      });
    }
    
    if (selectedLocation) {
      results = results.filter(result => {
        if (result.type === 'college' && result.location) {
          return result.location.toLowerCase().includes(selectedLocation.toLowerCase());
        }
        return false;
      });
    }
    
    if (selectedCategory) {
      results = results.filter(result => {
        if (result.type === 'college') {
          return result.subtitle.toLowerCase().includes(selectedCategory.toLowerCase());
        } else if (result.type === 'course') {
          return result.subtitle.toLowerCase().includes(selectedCategory.toLowerCase());
        }
        return false;
      });
    }
    
    if (selectedType) {
      results = results.filter(result => {
        if (result.type === 'college') {
          return result.subtitle.toLowerCase().includes(selectedType.toLowerCase());
        }
        return false;
      });
    }
    
    return results;
  }, [searchResults, searchQuery, activeTab, selectedRanking, selectedLocation, selectedCategory, selectedType]);

  // Handle search input
  const handleSearchInput = useCallback((text: string) => {
    setSearchQuery(text);
    performSearch(text);
  }, [performSearch]);

  // Handle result press
  const handleResultPress = useCallback((result: SearchResult) => {
    if (result.type === 'college') {
      router.push(`/details/${result.id}`);
    } else {
      router.push(`/course/${result.id}`);
    }
  }, []);

  // Handle back navigation
  const handleBackPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);
  
  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedRanking('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedType('');
    if (searchResults.length === 0) {
      performSearch('');
    }
  }, [searchResults.length, performSearch]);

  // Handle tab change with smooth loading
  const handleTabChange = useCallback((newTab: 'all' | 'colleges' | 'courses') => {
    if (newTab !== activeTab) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setActiveTab(newTab);
      
      // No skeleton loading - instant tab switching
      // The filteredResults useMemo will handle filtering instantly
      // Early return optimization prevents unnecessary processing
    }
  }, [activeTab]);

  // Load data on component mount
  useEffect(() => {
    performSearch('');
  }, [performSearch]);
  
  // Perform initial search if query is provided
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);
  
  // Trigger search when filters change
  useEffect(() => {
    if (searchResults.length > 0) {
      // Re-filter existing results when filters change
      // This is handled by the filteredResults useMemo
    }
  }, [selectedRanking, selectedLocation, selectedCategory, selectedType]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchBarOpacity.value,
    transform: [{ translateY: searchBarTranslateY.value }]
  }));

  const tabsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabsOpacity.value,
    transform: [{ translateY: tabsTranslateY.value }]
  }));

  const filtersAnimatedStyle = useAnimatedStyle(() => ({
    opacity: filtersOpacity.value,
    transform: [{ translateY: filtersTranslateY.value }]
  }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <AnimatedReanimated.View style={[ 
        { 
          flexDirection: 'row', 
          alignItems: 'center',
          marginTop: headerMarginTop,
          paddingHorizontal: horizontalPadding,
          marginBottom: sectionSpacing
        },
        headerAnimatedStyle
      ]}>
        <TouchableOpacity onPress={handleBackPress} className="mr-3" activeOpacity={0.8}>
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        
        {/* Search Bar */}
        <AnimatedReanimated.View className="flex-1 flex-row items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-3" style={searchBarAnimatedStyle}>
          <Feather name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search Colleges & Courses..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearchInput}
            autoFocus={!initialQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => handleSearchInput('')} activeOpacity={0.8}>
              <Feather name="x" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </AnimatedReanimated.View>
      </AnimatedReanimated.View>

      {/* Filter Tabs */}
      <AnimatedReanimated.View style={[{ paddingHorizontal: horizontalPadding, marginBottom: sectionSpacing }, tabsAnimatedStyle]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {[
            { id: 'all', label: 'All Results', count: tabCounts.all },
            { id: 'colleges', label: 'Colleges', count: tabCounts.colleges },
            { id: 'courses', label: 'Courses', count: tabCounts.courses },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              className={`px-4 py-2 rounded-full mr-3 transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-gray-900 scale-105' 
                  : 'bg-gray-100 scale-100'
              }`}
              onPress={() => handleTabChange(tab.id as any)}
            >
              <Text 
                className={`text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-gray-600'
                }`}
              >
                {tab.label} ({tab.count})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </AnimatedReanimated.View>

      {/* Advanced Filters */}
      <AnimatedReanimated.View style={[{ paddingHorizontal: horizontalPadding, marginBottom: sectionSpacing }, filtersAnimatedStyle]}>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-gray-900">Filters</Text>
          <TouchableOpacity 
            onPress={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex-row items-center px-3 py-2 bg-gray-100 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-sm font-medium text-gray-700 mr-2">
              {isFiltersExpanded ? 'Hide' : 'Show'} Filters
            </Text>
            <Feather 
              name={isFiltersExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#6B7280" 
            />
          </TouchableOpacity>
        </View>
        
        {isFiltersExpanded ? (
          <>
            {/* Ranking Filter */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Ranking</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {[
                  { id: 'top-10', label: 'Top 10' },
                  { id: 'top-25', label: 'Top 25' },
                  { id: 'top-50', label: 'Top 50' },
                  { id: 'top-100', label: 'Top 100' },
                  { id: 'all-rankings', label: 'All Rankings' },
                ].map((filter) => (
                  <Pressable
                    key={filter.id}
                    className={`px-3 py-2 rounded-full mr-2 border ${
                      selectedRanking === filter.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-100 border-gray-200'
                    }`}
                    onPress={() => {
                      const newRanking = selectedRanking === filter.id ? '' : filter.id;
                      setSelectedRanking(newRanking);
                      if (searchResults.length === 0) {
                        performSearch('');
                      }
                    }}
                  >
                    <Text className={`text-sm ${
                      selectedRanking === filter.id ? 'text-blue-700 font-medium' : 'text-gray-600'
                    }`}>
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Location Filter */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {[
                  { id: 'maharashtra', label: 'Maharashtra' },
                  { id: 'tamil-nadu', label: 'Tamil Nadu' },
                  { id: 'karnataka', label: 'Karnataka' },
                  { id: 'gujarat', label: 'Gujarat' },
                  { id: 'west-bengal', label: 'West Bengal' },
                  { id: 'delhi', label: 'Delhi' },
                  { id: 'mumbai', label: 'Mumbai' },
                  { id: 'bangalore', label: 'Bangalore' },
                ].map((filter) => (
                  <Pressable
                    key={filter.id}
                    className={`px-3 py-2 rounded-full mr-2 border ${
                      selectedLocation === filter.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-100 border-gray-200'
                    }`}
                    onPress={() => {
                      const newLocation = selectedLocation === filter.id ? '' : filter.id;
                      setSelectedLocation(newLocation);
                      if (searchResults.length === 0) {
                        performSearch('');
                      }
                    }}
                  >
                    <Text className={`text-sm ${
                      selectedLocation === filter.id ? 'text-blue-700 font-medium' : 'text-gray-600'
                    }`}>
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Category Filter */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {[
                  { id: 'engineering', label: 'Engineering' },
                  { id: 'medical', label: 'Medical' },
                  { id: 'arts', label: 'Arts' },
                  { id: 'commerce', label: 'Commerce' },
                  { id: 'science', label: 'Science' },
                  { id: 'law', label: 'Law' },
                  { id: 'management', label: 'Management' },
                  { id: 'agriculture', label: 'Agriculture' },
                ].map((filter) => (
                  <Pressable
                    key={filter.id}
                    className={`px-3 py-2 rounded-full mr-2 border ${
                      selectedCategory === filter.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-100 border-gray-200'
                    }`}
                    onPress={() => {
                      const newCategory = selectedCategory === filter.id ? '' : filter.id;
                      setSelectedCategory(newCategory);
                      if (searchResults.length === 0) {
                        performSearch('');
                      }
                    }}
                  >
                    <Text className={`text-sm ${
                      selectedCategory === filter.id ? 'text-blue-700 font-medium' : 'text-gray-600'
                    }`}>
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Type Filter */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Type</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {[
                  { id: 'government', label: 'Government' },
                  { id: 'private', label: 'Private' },
                  { id: 'deemed', label: 'Deemed University' },
                  { id: 'central', label: 'Central University' },
                  { id: 'state', label: 'State University' },
                  { id: 'autonomous', label: 'Autonomous' },
                ].map((filter) => (
                  <Pressable
                    key={filter.id}
                    className={`px-3 py-2 rounded-full mr-2 border ${
                      selectedType === filter.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-100 border-gray-200'
                      }`}
                    onPress={() => {
                      const newType = selectedType === filter.id ? '' : filter.id;
                      setSelectedType(newType);
                      if (searchResults.length === 0) {
                        performSearch('');
                      }
                    }}
                  >
                    <Text className={`text-sm ${
                      selectedType === filter.id ? 'text-blue-700 font-medium' : 'text-gray-600'
                    }`}>
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Clear Filters Button */}
            <View className="flex-row justify-center">
              <Pressable 
                className="px-6 py-3 bg-gray-200 rounded-full"
                onPress={clearAllFilters}
              >
                <Text className="text-sm font-medium text-gray-700">Clear All Filters</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </AnimatedReanimated.View>

      {/* Search Results */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
      >
        {isLoading && searchResults.length === 0 ? (
          <SkeletonCards count={5} />
        ) : filteredResults.length > 0 ? (
          <View className="pt-3">
            {filteredResults.map((result, index) => (
              <AnimatedSearchResultCard
                key={`${result.type}-${result.id}`}
                result={result}
                index={index}
                onPress={handleResultPress}
              />
            ))}
          </View>
        ) : searchQuery.length === 0 ? (
          <View className="py-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Recent Searches
            </Text>
            
            {/* Recent Search Items */}
            <View className="px-4">
              {recentSearches.map((item, index) => (
                <AnimatedRecentSearchItem
                  key={item.id}
                  item={item}
                  index={index}
                  onPress={handleResultPress}
                />
              ))}
            </View>
          </View>
        ) : (
          <View className="py-8 items-center">
            <Feather name="inbox" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              No results found for{'\n'}"{searchQuery}"
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Try different keywords or check spelling
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
 