import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { getCourseById } from '../../utils/data-helpers';
import { FeeTableRow } from '../../components/ui';
import { useFavorites } from '../../hooks/useFavorites';

export default function CourseDetailsScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Get course data using helper function
  const course = getCourseById(courseId as string);
  const isCourseFavorite = course ? isFavorite(course.id, 'course') : false;

  // Fallback if course not found
  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4">Course Not Found</Text>
        <Text className="text-gray-500 mt-2">The requested course could not be found.</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 bg-gray-900 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleFavoritePress = async () => {
    const result = await toggleFavorite(course.id, 'course');
    if (result) {
      // Optional: Show toast message
      console.log(isFavorite(course.id, 'course') ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  const handleApplyNow = () => {
    Alert.alert(
      'Apply Now',
      `You are about to apply for ${course.title}. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Application started') }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Feather name="chevron-left" size={20} color="#1F2937" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleFavoritePress}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Feather 
              name="heart" 
              size={20} 
              color={isCourseFavorite ? "#EF4444" : "#6B7280"}
              fill={isCourseFavorite ? "#EF4444" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Course Title */}
        <View className="px-4 pb-4">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {course.title}
          </Text>
          <Text className="text-base text-gray-600">
            {course.subtitle}
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Basic Info */}
        <View className="bg-white mb-4">
          <View className="p-4">
            <View className="flex-row items-center mb-3">
              <Feather name="clock" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">Duration: {course.duration}</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Feather name="tag" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">Type: {course.type}</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">Application Deadline: {course.applicationDeadline}</Text>
            </View>
          </View>
        </View>

        {/* Course Details Section */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Course Details</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600">Duration:</Text>
              <Text className="text-sm font-semibold text-gray-900">{course.duration}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600">Type:</Text>
              <Text className="text-sm font-semibold text-gray-900">{course.type}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600">Category:</Text>
              <Text className="text-sm font-semibold text-gray-900">{course.category}</Text>
            </View>
          </View>
        </View>

        {/* Fee Structure Section */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Fee Structure</Text>
          
          <View className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <FeeTableRow 
              row={{ year: 'Year', fee: 'Fee', application: 'Application', other: 'Other', total: 'Total' }}
              isHeader={true}
            />
            
            {/* Table Rows */}
            {course.feeStructure.map((row, index) => (
              <FeeTableRow key={index} row={row} />
            ))}
          </View>
          
          <View className="mt-4 p-3 bg-blue-50 rounded-lg">
            <Text className="text-xs text-blue-800">
              * Fee includes tuition, library, laboratory, sports facility, hostel maintenance, 
              security deposits, registration etc.{'\n'}
              The fee mentioned above does not include hostel accommodation.
            </Text>
          </View>
        </View>

        {/* Application Deadline */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-2">Application Deadline</Text>
          <Text className="text-base text-gray-700">{course.applicationDeadline}</Text>
        </View>

        {/* Course Description */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-2">About This Course</Text>
          <Text className="text-base text-gray-700 leading-6">{course.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom Apply Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <TouchableOpacity 
          onPress={handleApplyNow}
          className="bg-gray-900 py-4 rounded-full items-center"
        >
          <Text className="text-white font-semibold text-base">Apply Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 