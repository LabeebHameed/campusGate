import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { favoriteItems, type FavoriteItem } from '../../data';
import { SimpleCard } from '../../components/ui';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(favoriteItems);

  const handleRemoveFavorite = useCallback((id: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setFavorites(prev => prev.filter(item => item.id !== id))
        }
      ]
    );
  }, []);

  const handleCardPress = useCallback((id: string) => {
    router.push(`/details/${id}`);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">Favorites</Text>
        <Text className="text-sm text-gray-500">{favorites.length} saved</Text>
      </View>

      {/* Favorites List */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <SimpleCard
              key={item.id}
              title={item.title}
              subtitle={`${item.duration} - ${item.cost}`}
              rating={item.rating}
              onPress={() => handleCardPress(item.id)}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Feather name="heart" size={48} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-gray-500 mt-4">No favorites yet</Text>
            <Text className="text-sm text-gray-400 mt-2 text-center px-8">
              Start adding universities and courses to your favorites to see them here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 