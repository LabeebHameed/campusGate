import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { getCourseById } from '../../utils/data-helpers';
import { FeeTableRow } from '../../components/ui';
import { useFavorites } from '../../hooks/useFavorites';
import { useApplications } from '../../hooks/useApplications';
import { useAuth } from '@clerk/clerk-expo';
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

export default function CourseDetailsScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const favoritesHook = useFavorites();
  const { isFavorite, toggleFavorite } = favoritesHook || {};
  const { applyToCourse, loading: applicationLoading, error: applicationError } = useApplications();
  const { isSignedIn } = useAuth();
  
  // State for application status
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  
  // Get course data using helper function
  const course = getCourseById(courseId as string);
  const isCourseFavorite = course && isFavorite ? isFavorite(course.id, 'course') : false;

  useEffect(() => {
    // Staggered entrance animations
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 300 }));
    
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(200, withSpring(0, { damping: 20, stiffness: 300 }));
    
    buttonOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    buttonScale.value = withDelay(400, withSpring(1, { damping: 20, stiffness: 300 }));
  }, []);

  // Check if user has already applied to this course
  useEffect(() => {
    // TODO: In a real app, you'd check the backend to see if user has already applied
    // For now, we'll use local state
    setHasApplied(false);
  }, [courseId]);

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
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleFavoritePress = async () => {
    if (!toggleFavorite) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await toggleFavorite(course.id, 'course');
    if (result) {
      // Optional: Show toast message
      console.log(isFavorite && isFavorite(course.id, 'course') ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleApplyNow = async () => {
    if (!isSignedIn) {
      Alert.alert(
        'Sign In Required',
        'You must be signed in to apply for courses. Please sign in and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)') }
        ]
      );
      return;
    }

    if (hasApplied) {
      Alert.alert(
        'Already Applied',
        'You have already applied to this course. You can view your application status in your profile.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
      return;
    }

    Alert.alert(
      'Apply Now',
      `You are about to apply for ${course.title}. This will create a draft application that you can complete later. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: async () => {
            setIsApplying(true);
            try {
              const application = await applyToCourse({
                courseId: course.id,
                submittedDocuments: [], // Empty for now, can be updated later
              });
              
              if (application) {
                setHasApplied(true);
                Alert.alert(
                  'Application Submitted!',
                  'Your application has been created successfully. You can now complete it by adding required documents and information.',
                  [
                    { 
                      text: 'View Application', 
                      onPress: () => router.push(`/applications/${application.id}`)
                    },
                    { text: 'Continue Browsing', style: 'default' }
                  ]
                );
              }
            } catch (error) {
              Alert.alert(
                'Application Failed',
                error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
                [{ text: 'OK', style: 'default' }]
              );
            } finally {
              setIsApplying(false);
            }
          }
        }
      ]
    );
  };

  // Determine button state and text
  const getApplyButtonState = () => {
    if (hasApplied) {
      return {
        text: 'Applied',
        backgroundColor: 'bg-green-600',
        disabled: true,
        icon: 'check-circle'
      };
    }
    
    if (isApplying || applicationLoading) {
      return {
        text: 'Applying...',
        backgroundColor: 'bg-gray-500',
        disabled: true,
        icon: 'loader'
      };
    }
    
    return {
      text: 'Apply Now',
      backgroundColor: 'bg-gray-900',
      disabled: false,
      icon: 'send'
    };
  };

  const buttonState = getApplyButtonState();

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }]
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }]
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View className="bg-white border-b border-gray-200" style={headerAnimatedStyle}>
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity 
            onPress={handleBackPress}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={20} color="#1F2937" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleFavoritePress}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            activeOpacity={0.8}
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
      </Animated.View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Basic Info */}
        <Animated.View className="bg-white mb-4" style={contentAnimatedStyle}>
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
        </Animated.View>

        {/* Course Details Section */}
        <Animated.View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm" style={contentAnimatedStyle}>
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
        </Animated.View>

        {/* Fee Structure Section */}
        <Animated.View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm" style={contentAnimatedStyle}>
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
        </Animated.View>

        {/* Application Deadline */}
        <Animated.View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm" style={contentAnimatedStyle}>
          <Text className="text-lg font-bold text-gray-900 mb-2">Application Deadline</Text>
          <Text className="text-base text-gray-700">{course.applicationDeadline}</Text>
        </Animated.View>

        {/* Course Description */}
        <Animated.View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100 shadow-sm" style={contentAnimatedStyle}>
          <Text className="text-lg font-bold text-gray-900 mb-2">About This Course</Text>
          <Text className="text-base text-gray-700 leading-6">{course.description}</Text>
        </Animated.View>
      </ScrollView>

      {/* Bottom Apply Button */}
      <Animated.View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4" style={buttonAnimatedStyle}>
        <TouchableOpacity 
          onPress={handleApplyNow}
          disabled={buttonState.disabled}
          className={`${buttonState.backgroundColor} py-4 rounded-full items-center flex-row justify-center space-x-2`}
          activeOpacity={0.8}
        >
          <Feather 
            name={buttonState.icon as any} 
            size={20} 
            color="white" 
          />
          <Text className="text-white font-semibold text-base">{buttonState.text}</Text>
        </TouchableOpacity>
        
        {/* Error Display */}
        {applicationError ? (
          <View className="mt-2 p-2 bg-red-50 rounded-lg">
            <Text className="text-xs text-red-600 text-center">{applicationError}</Text>
          </View>
        ) : null}
      </Animated.View>
    </SafeAreaView>
  );
} 