import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFavorites, type FavoriteItem } from '../../hooks/useFavorites';

export default function FavoritesScreen() {
  const { 
    favorites, 
    loading, 
    removeFromFavorites, 
    getFavoritesByType,
    favoritesCount,
    collegesCount,
    coursesCount,
    clearAllFavorites
  } = useFavorites();
  
  const [activeTab, setActiveTab] = useState<'all' | 'colleges' | 'courses'>('all');

  const handleRemoveFavorite = (id: string, type: 'college' | 'course') => {
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
    switch (activeTab) {
      case 'colleges':
        return getFavoritesByType('college');
      case 'courses':
        return getFavoritesByType('course');
      default:
        return favorites;
    }
  };

  const filteredFavorites = getFilteredFavorites();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-2">Loading favorites...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Favorites</Text>
          {favoritesCount > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text className="text-red-500 font-medium">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Stats */}
        <View className="flex-row space-x-4">
          <View className="bg-blue-50 px-3 py-2 rounded-lg">
            <Text className="text-blue-600 font-semibold text-sm">{favoritesCount} Total</Text>
          </View>
          <View className="bg-green-50 px-3 py-2 rounded-lg">
            <Text className="text-green-600 font-semibold text-sm">{collegesCount} Colleges</Text>
          </View>
          <View className="bg-purple-50 px-3 py-2 rounded-lg">
            <Text className="text-purple-600 font-semibold text-sm">{coursesCount} Courses</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      {favoritesCount > 0 && (
        <View className="bg-white px-6 py-3 border-b border-gray-100">
          <View className="flex-row space-x-1">
            {[
              { key: 'all', label: 'All', count: favoritesCount },
              { key: 'colleges', label: 'Colleges', count: collegesCount },
              { key: 'courses', label: 'Courses', count: coursesCount }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab.key 
                    ? 'bg-gray-900' 
                    : 'bg-gray-100'
                }`}
              >
                <Text className={`font-medium ${
                  activeTab === tab.key 
                    ? 'text-white' 
                    : 'text-gray-600'
                }`}>
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Favorites List */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredFavorites.length > 0 ? (
          <View className="p-4 space-y-3">
            {filteredFavorites.map((item) => (
              <TouchableOpacity
                key={`${item.type}-${item.id}`}
                className="bg-white p-4 rounded-xl border border-gray-100"
                onPress={() => handleCardPress(item)}
                activeOpacity={0.7}
              >
                <View className="flex-row">
                  {/* Image */}
                  <Image
                    source={{ uri: item.image }}
                    className="w-16 h-16 rounded-lg mr-3"
                    resizeMode="cover"
                  />
                  
                  {/* Content */}
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="text-lg font-semibold text-gray-900 flex-1 mr-2" numberOfLines={2}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveFavorite(item.id, item.type)}
                        className="p-1"
                      >
                        <Feather name="heart" size={20} color="#EF4444" fill="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                    
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className={`px-2 py-1 rounded-md mr-2 ${
                          item.type === 'college' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          <Text className={`text-xs font-medium ${
                            item.type === 'college' ? 'text-blue-700' : 'text-purple-700'
                          }`}>
                            {item.type === 'college' ? 'College' : 'Course'}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <Feather name="star" size={12} color="#F59E0B" />
                          <Text className="text-sm font-medium text-gray-700 ml-1">
                            {item.rating}
                          </Text>
                        </View>
                      </View>
                      
                      {item.type === 'college' && item.location && (
                        <Text className="text-xs text-gray-500" numberOfLines={1}>
                          {item.location}
                        </Text>
                      )}
                      
                      {item.type === 'course' && item.duration && (
                        <Text className="text-xs text-gray-500">
                          {item.duration}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
              <Feather name="heart" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold text-gray-500 mb-2">
              {favoritesCount === 0 ? 'No favorites yet' : `No ${activeTab} found`}
            </Text>
            <Text className="text-sm text-gray-400 text-center px-8 leading-6">
              {favoritesCount === 0 
                ? 'Start adding colleges and courses to your favorites to see them here'
                : `You haven't added any ${activeTab} to favorites yet`
              }
            </Text>
            {favoritesCount === 0 && (
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)')}
                className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
              >
                <Text className="text-white font-semibold">Explore Colleges</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 