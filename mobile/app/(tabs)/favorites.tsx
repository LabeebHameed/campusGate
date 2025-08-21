import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFavorites, type FavoriteItem } from '../../hooks/useFavorites';
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

// Refactored Header Component to match new Figma design
const FavoritesHeader: React.FC<{
  favoritesCount: number;
  onClearAll: () => void;
}> = ({ favoritesCount, onClearAll }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      opacity.value = withDelay(100, withTiming(1, { duration: 600 }));
      translateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 300 }));
      setHasAnimated(true);
    } else {
      // Skip animation on subsequent renders
      opacity.value = 1;
      translateY.value = 0;
    }
  }, [hasAnimated]);

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClearAll();
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      runOnJS(handleClearAll)();
    })
    .onTouchesUp(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value }
    ]
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View className="bg-white px-4 py-5" style={animatedStyle}>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">Favorites</Text>
        {favoritesCount > 0 ? (
          <GestureDetector gesture={pressGesture}>
            <Animated.View 
              className="px-3 py-2 rounded-full bg-red-50"
              style={buttonAnimatedStyle}
            >
              <Text className="text-red-600 font-medium text-sm">Clear All</Text>
            </Animated.View>
          </GestureDetector>
        ) : null}
      </View>
    </Animated.View>
  );
};

// Refactored Filter Tabs to match new design
const FilterTabs: React.FC<{
  activeTab: 'colleges' | 'courses';
  onTabChange: (tab: 'colleges' | 'courses') => void;
  collegesCount: number;
  coursesCount: number;
}> = ({ activeTab, onTabChange, collegesCount, coursesCount }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      opacity.value = withDelay(200, withTiming(1, { duration: 600 }));
      translateY.value = withDelay(200, withSpring(0, { damping: 20, stiffness: 300 }));
      setHasAnimated(true);
    } else {
      // Skip animation on subsequent renders
      opacity.value = 1;
      translateY.value = 0;
    }
  }, [hasAnimated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View className="bg-white px-4 py-3 border-b border-gray-100" style={animatedStyle}>
      <View className="flex-row space-x-2">
        {[
          { key: 'colleges', label: 'Colleges', count: collegesCount },
          { key: 'courses', label: 'Courses', count: coursesCount }
        ].map((tab) => (
          <AnimatedTabItem
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onPress={() => onTabChange(tab.key as any)}
          />
        ))}
      </View>
    </Animated.View>
  );
};

// Animated Tab Item
const AnimatedTabItem: React.FC<{
  tab: { key: string; label: string; count: number };
  isActive: boolean;
  onPress: () => void;
}> = ({ tab, isActive, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      const delay = tab.key === 'colleges' ? 300 : 400;
      opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 300 }));
      setHasAnimated(true);
    } else {
      // Skip animation on subsequent renders
      opacity.value = 1;
      translateY.value = 0;
    }
  }, [hasAnimated, tab.key]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
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
      <Animated.View
        className={`flex-1 px-3 py-2.5 rounded-xl ${
          isActive 
            ? 'bg-gray-900' 
            : 'bg-gray-50'
        }`}
        style={animatedStyle}
      >
        <Text className={`font-semibold text-center text-sm ${
          isActive 
            ? 'text-white' 
            : 'text-gray-900'
        }`}>
          {tab.label}
        </Text>
        <Text className={`text-center text-xs mt-1 ${
          isActive 
            ? 'text-gray-300' 
            : 'text-gray-600'
        }`}>
          {tab.count}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

// Refactored Favorite Item Card to match new design
const FavoriteItemCard: React.FC<{
  item: FavoriteItem;
  onCardPress: (item: FavoriteItem) => void;
  onRemoveFavorite: (id: string, type: 'college' | 'course') => void;
  index: number;
}> = ({ item, onCardPress, onRemoveFavorite, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const cardScale = useSharedValue(1);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      const delay = 500 + (index * 100);
      opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 300 }));
      setHasAnimated(true);
    } else {
      // Skip animation on subsequent renders
      opacity.value = 1;
      translateY.value = 0;
    }
  }, [hasAnimated, index]);

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCardPress(item);
  };

  const handleRemovePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRemoveFavorite(item.id, item.type);
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      cardScale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      runOnJS(handleCardPress)();
    })
    .onTouchesUp(() => {
      cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

  const removeGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      runOnJS(handleRemovePress)();
    })
    .onTouchesUp(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: cardScale.value },
      { translateY: translateY.value }
    ]
  }));

  const removeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <GestureDetector gesture={pressGesture}>
      <Animated.View
        className="bg-white mx-4 mb-3 p-4 rounded-2xl border border-gray-100 shadow-sm"
        style={cardAnimatedStyle}
      >
        <View className="flex-row">
          {/* Refactored Image */}
          <Image
            source={{ uri: item.image }}
            className="w-16 h-16 rounded-xl mr-3"
            resizeMode="cover"
          />
          
          {/* Refactored Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-base font-semibold text-gray-900 flex-1 mr-2" numberOfLines={2}>
                {item.name}
              </Text>
              <GestureDetector gesture={removeGesture}>
                <Animated.View
                  className="p-1.5 rounded-full bg-red-50"
                  style={removeAnimatedStyle}
                >
                  <Feather name="heart" size={16} color="#EF4444" fill="#EF4444" />
                </Animated.View>
              </GestureDetector>
            </View>
            
            <Text className="text-sm text-gray-600 mb-2.5" numberOfLines={1}>
              {item.subtitle}
            </Text>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                {/* Refactored Type Badge */}
                <View className={`px-2.5 py-1 rounded-full ${
                  item.type === 'college' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    item.type === 'college' ? 'text-blue-700' : 'text-purple-700'
                  }`}>
                    {item.type === 'college' ? 'College' : 'Course'}
                  </Text>
                </View>
                
                {/* Refactored Rating Display */}
                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-full">
                  <Feather name="star" size={12} color="#F59E0B" />
                  <Text className="text-xs font-medium text-gray-900 ml-1">
                    {item.rating}
                  </Text>
                </View>
              </View>
              
              {/* Refactored Location/Duration */}
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
      </Animated.View>
    </GestureDetector>
  );
};

// Refactored Empty State to match new design
const EmptyFavoritesState: React.FC<{
  favoritesCount: number;
  activeTab: 'colleges' | 'courses';
}> = ({ favoritesCount, activeTab }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      opacity.value = withDelay(600, withTiming(1, { duration: 800 }));
      scale.value = withDelay(600, withSpring(1, { damping: 20, stiffness: 300 }));
      translateY.value = withDelay(600, withSpring(0, { damping: 20, stiffness: 300 }));
      setHasAnimated(true);
    } else {
      // Skip animation on subsequent renders
      opacity.value = 1;
      scale.value = 1;
      translateY.value = 0;
    }
  }, [hasAnimated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <Animated.View className="flex-1 items-center justify-center py-16 px-6" style={animatedStyle}>
      <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-5">
        <Feather name="heart" size={32} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
        {favoritesCount === 0 ? 'No favorites yet' : `No ${activeTab} found`}
      </Text>
      <Text className="text-sm text-gray-600 text-center leading-5 mb-6">
        {favoritesCount === 0 
          ? 'Start adding colleges and courses to your favorites to see them here'
          : `You haven't added any ${activeTab} to favorites yet`
        }
      </Text>
      {favoritesCount === 0 ? (
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)')}
          className="bg-gray-900 px-6 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-sm">Explore Colleges</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

// Refactored Loading State to match new design
const LoadingState: React.FC = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
      <Animated.View style={animatedStyle}>
        <ActivityIndicator size="large" color="#111827" />
        <Text className="text-gray-600 mt-3 font-medium">Loading favorites...</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

// Main Component - All logic preserved
export default function FavoritesScreen() {
  const favoritesHook = useFavorites();
  const { 
    favorites, 
    loading, 
    removeFromFavorites, 
    getFavoritesByType,
    favoritesCount,
    collegesCount,
    coursesCount,
    clearAllFavorites
  } = favoritesHook || {};
  
  const [activeTab, setActiveTab] = useState<'colleges' | 'courses'>('colleges');

  const handleRemoveFavorite = (id: string, type: 'college' | 'course') => {
    if (!removeFromFavorites) return;
    
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromFavorites(id, type)
        }
      ]
    );
  };

  const handleCardPress = (item: FavoriteItem) => {
    if (item.type === 'college') {
      router.push(`/details/${item.id}`);
    } else {
      router.push(`/course/${item.id}`);
    }
  };

  const handleClearAll = () => {
    if (!clearAllFavorites) return;
    
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearAllFavorites
        }
      ]
    );
  };

  const getFilteredFavorites = () => {
    if (!getFavoritesByType) return [];
    
    switch (activeTab) {
      case 'colleges':
        return getFavoritesByType('college');
      case 'courses':
        return getFavoritesByType('course');
      default:
        return getFavoritesByType('college');
    }
  };

  const filteredFavorites = getFilteredFavorites();

  // Only show loading state if we have no data yet
  if (loading && !favorites && favoritesCount === 0) {
    return <LoadingState />;
  }

  // Add null checks for safety
  const safeFavoritesCount = favoritesCount || 0;
  const safeCollegesCount = collegesCount || 0;
  const safeCoursesCount = coursesCount || 0;
  const safeFavorites = favorites || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FavoritesHeader 
        favoritesCount={safeFavoritesCount}
        onClearAll={handleClearAll}
      />

      {/* Filter Tabs */}
      {safeFavoritesCount > 0 ? (
        <FilterTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collegesCount={safeCollegesCount}
          coursesCount={safeCoursesCount}
        />
      ) : null}

      {/* Favorites List */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredFavorites.length > 0 ? (
          <View className="pt-3">
            {filteredFavorites.map((item, index) => (
              <FavoriteItemCard
                key={`${item.type}-${item.id}`}
                item={item}
                onCardPress={handleCardPress}
                onRemoveFavorite={handleRemoveFavorite}
                index={index}
              />
            ))}
          </View>
        ) : (
          <EmptyFavoritesState 
            favoritesCount={safeFavoritesCount}
            activeTab={activeTab}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 