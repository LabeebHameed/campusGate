import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CarouselItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FavoritePageProps {
  favorites: CarouselItem[];
  onRemoveFavorite?: (id: string) => void;
}

const FavoritePage: React.FC<FavoritePageProps> = ({ 
  favorites,
  onRemoveFavorite
}) => {
  const router = useRouter();

  const handleItemPress = (item: CarouselItem) => {
    router.push(`/details/${item.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-2 pb-4 border-b border-[#F2F4F7]">
        <Text className="text-[28px] font-bold text-[#101828]">Favorites</Text>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {favorites.length === 0 ? (
          <View className="flex-1 items-center justify-center h-[400px]">
            {/* // Icon: empty-favorites.svg */}
            <View className="w-16 h-16 items-center justify-center bg-[#F9FAFB] rounded-full mb-4">
              <Ionicons name="heart-outline" size={32} color="#D0D5DD" />
            </View>
            <Text className="text-[18px] font-semibold text-[#101828] mb-2">No favorites yet</Text>
            <Text className="text-[14px] text-[#667085] text-center max-w-[270px]">
              Explore colleges and add them to your favorites to see them here
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            {favorites.map((item, index) => (
              <View 
                key={item.id}
                className={`flex-row bg-white rounded-[20px] overflow-hidden mb-4 border border-[#F2F4F7]`}
                style={{ 
                  width: SCREEN_WIDTH - 48, // Accounting for left and right padding of 24px each
                  height: 114
                }}
              >
                {/* College Image */}
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-[114px] h-[114px]"
                  resizeMode="cover"
                />
                
                {/* College Information */}
                <View className="flex-1 p-4 justify-between">
                  <View>
                    <Text 
                      className="text-[16px] font-semibold text-[#101828] mb-1"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text 
                      className="text-[14px] text-[#667085] mb-2"
                      numberOfLines={1}
                    >
                      {item.location}
                    </Text>
                    
                    {/* Rating and Reviews */}
                    <View className="flex-row items-center">
                      <View className="flex-row items-center mr-2">
                        {/* // Icon: star.svg */}
                        <Ionicons name="star" size={16} color="#FACC15" />
                        <Text className="text-[14px] font-medium text-[#344054] ml-1">
                          {item.rating}
                        </Text>
                      </View>
                      <Text className="text-[14px] text-[#667085]">
                        {item.reviews}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Actions */}
                  <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                      onPress={() => handleItemPress(item)}
                      className="flex-row items-center"
                    >
                      <Text className="text-[14px] font-semibold text-[#4B48DF] mr-1">
                        See details
                      </Text>
                      <Feather name="chevron-right" size={16} color="#4B48DF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => onRemoveFavorite && onRemoveFavorite(item.id)}
                      className="w-[32px] h-[32px] rounded-full bg-[#FEF3F2] items-center justify-center"
                    >
                      {/* // Icon: heart-filled.svg */}
                      <Ionicons name="heart" size={16} color="#F04438" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritePage; 