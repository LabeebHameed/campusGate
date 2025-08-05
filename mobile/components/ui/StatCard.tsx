import React from 'react';
import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <Text className="text-2xl font-bold text-gray-900 text-center">{value}</Text>
      <Text className="text-sm text-gray-500 text-center mt-1">{label}</Text>
    </View>
  );
} 