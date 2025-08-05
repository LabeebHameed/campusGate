import React from 'react';
import { View, Text } from 'react-native';
import { FeeStructureRow } from '../../data';

interface FeeTableRowProps {
  row: FeeStructureRow;
  isHeader?: boolean;
}

export function FeeTableRow({ row, isHeader = false }: FeeTableRowProps) {
  const cellClass = isHeader 
    ? "py-3 px-2 text-center text-sm font-bold text-gray-900 bg-gray-100" 
    : "py-3 px-2 text-center text-sm text-gray-700 border-b border-gray-100";

  return (
    <View className="flex-row">
      <View className={`flex-1 ${cellClass}`}>
        <Text className={isHeader ? "font-bold text-gray-900" : "text-gray-700"}>
          {row.year}
        </Text>
      </View>
      <View className={`flex-1 ${cellClass}`}>
        <Text className={isHeader ? "font-bold text-gray-900" : "text-gray-700"}>
          {row.fee}
        </Text>
      </View>
      <View className={`flex-1 ${cellClass}`}>
        <Text className={isHeader ? "font-bold text-gray-900" : "text-gray-700"}>
          {row.application}
        </Text>
      </View>
      <View className={`flex-1 ${cellClass}`}>
        <Text className={isHeader ? "font-bold text-gray-900" : "text-gray-700"}>
          {row.other}
        </Text>
      </View>
      <View className={`flex-1 ${cellClass}`}>
        <Text className={isHeader ? "font-bold text-gray-900" : "text-gray-700"}>
          {row.total}
        </Text>
      </View>
    </View>
  );
} 