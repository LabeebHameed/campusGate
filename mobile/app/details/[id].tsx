import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { getUniversityById } from '../../utils/data-helpers';
import { SimpleCard } from '../../components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function UniversityDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Get university data using helper function
  const university = getUniversityById(id as string);

  // Fallback if university not found
  if (!university) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4">University Not Found</Text>
        <Text className="text-gray-500 mt-2">The requested university could not be found.</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 bg-gray-900 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleFavoritePress = () => {
    setIsFavorited(!isFavorited);
  };

  const handleCoursePress = (courseId: string) => {
    router.push(`/course/${courseId}` as any);
  };

  const handleBookTour = () => {
    console.log('Book tour pressed');
  };

  const handleVirtualTour = () => {
    console.log('Virtual tour pressed');
  };

  const handleSeeAllCourses = () => {
    console.log('See all courses pressed');
  };

  const handleReadMore = () => {
    console.log('Read more pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Image with Navigation */}
        <View className="relative">
          <Image 
            source={{ uri: university.image }}
            style={{ width: SCREEN_WIDTH, height: 250 }}
            resizeMode="cover"
          />
          
          {/* Navigation Overlay */}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/90 rounded-full items-center justify-center"
            >
              <Feather name="chevron-left" size={20} color="#1F2937" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleFavoritePress}
              className="w-10 h-10 bg-white/90 rounded-full items-center justify-center"
            >
              <Feather 
                name="heart" 
                size={20} 
                color={isFavorited ? "#EF4444" : "#6B7280"}
                fill={isFavorited ? "#EF4444" : "none"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* University Information */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {university.name}
          </Text>
          
          <Text className="text-base text-gray-600 mb-3">
            {university.location}
          </Text>
          
          {/* Rating */}
          <View className="flex-row items-center mb-4">
            <Feather name="star" size={16} color="#F59E0B" />
            <Text className="text-base font-semibold text-gray-900 ml-1">
              {university.rating}
            </Text>
            <Text className="text-sm text-gray-500 ml-2">
              {university.reviews}
            </Text>
          </View>
          
          {/* Description */}
          <View className="mb-6">
            <Text className="text-base text-gray-700 leading-6">
              {university.description}
            </Text>
            <TouchableOpacity onPress={handleReadMore} className="mt-2">
              <Text className="text-blue-600 font-semibold">Read More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Courses Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-4">
            <Text className="text-xl font-bold text-gray-900">Courses</Text>
            <TouchableOpacity onPress={handleSeeAllCourses}>
              <Text className="text-blue-600 font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          
          {university.courses.map((course) => (
            <SimpleCard
              key={course.id}
              title={course.name}
              subtitle={`${course.duration} - ${course.cost}`}
              rating={course.rating}
              onPress={() => handleCoursePress(course.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row space-x-3">
          <TouchableOpacity 
            onPress={handleBookTour}
            className="flex-1 bg-gray-900 py-4 rounded-full items-center"
          >
            <Text className="text-white font-semibold text-base">Book Tour</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleVirtualTour}
            className="flex-1 bg-gray-100 py-4 rounded-full items-center border border-gray-300"
          >
            <Text className="text-gray-900 font-semibold text-base">Virtual Tour</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 