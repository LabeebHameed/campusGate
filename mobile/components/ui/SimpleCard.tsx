import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SimpleCardProps {
  title: string;
  subtitle: string;
  rating: string;
  onPress: () => void;
  showArrow?: boolean;
}

export function SimpleCard({ title, subtitle, rating, onPress, showArrow = true }: SimpleCardProps) {
  return (
    <View className="bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-100 shadow-sm">
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
        
        {showArrow && (
          <TouchableOpacity 
            onPress={onPress}
            className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center ml-4"
          >
            <Feather name="chevron-right" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
} 