import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSignOut } from '../hooks/useSignOut';
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

interface ProfileOptionProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  index: number;
}

function ProfileOption({ icon, title, subtitle, onPress, showArrow = true, index }: ProfileOptionProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    const delay = 400 + (index * 100);
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 300 }));
  }, [index]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
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
        className="flex-row items-center bg-white mx-4 mb-2 p-4 rounded-xl border border-gray-100 shadow-sm"
        style={animatedStyle}
      >
        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
          <Feather name={icon} size={20} color="#6B7280" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">{title}</Text>
          {subtitle ? (
            <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
          ) : null}
        </View>
        {showArrow ? (
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}

export default function ProfileScreen() {
  const userHook = useCurrentUser();
  const { currentUser, isLoading: isLoadingUser, error: userError } = userHook || {};
  const { handleSignOut } = useSignOut();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const profileOpacity = useSharedValue(0);
  const profileScale = useSharedValue(0.8);
  const profileTranslateY = useSharedValue(50);
  const logoutOpacity = useSharedValue(0);
  const logoutTranslateY = useSharedValue(50);

  useEffect(() => {
    // Staggered entrance animations
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 300 }));

    profileOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    profileScale.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 300 }));
    profileTranslateY.value = withDelay(200, withSpring(0, { damping: 20, stiffness: 300 }));

    logoutOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    logoutTranslateY.value = withDelay(800, withSpring(0, { damping: 20, stiffness: 300 }));
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings coming soon!');
  };

  const handleSecurity = () => {
    Alert.alert('Security', 'Security settings coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help & Support coming soon!');
  };

  const handleAbout = () => {
    Alert.alert('About', 'Campus Gate v1.0.0\nYour gateway to academic opportunities');
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleEditPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleEditProfile();
  };

  const handlePhotoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Change Photo', 'Photo update coming soon!');
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    handleSignOut();
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const profileAnimatedStyle = useAnimatedStyle(() => ({
    opacity: profileOpacity.value,
    transform: [
      { scale: profileScale.value },
      { translateY: profileTranslateY.value }
    ]
  }));

  const logoutAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoutOpacity.value,
    transform: [{ translateY: logoutTranslateY.value }]
  }));

  // Show error state if user data failed to load
  if (userError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-4">
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-lg font-semibold text-gray-900 mt-4 text-center">
            Failed to load profile
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Please check your connection and try again
          </Text>
          <TouchableOpacity 
            onPress={() => {
              // Retry by refetching the data
              // This will trigger a re-render and attempt to fetch data again
              router.replace('/profile');
            }}
            className="mt-4 bg-blue-600 px-6 py-3 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If no user data, show empty state
  if (!currentUser) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-4">
          <Feather name="user-x" size={48} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-gray-900 mt-4 text-center">
            No user data available
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get user's full name
  const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'User';
  
  // Get profile image or use placeholder
  const profileImage = currentUser.profileImage || 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=' + (currentUser.firstName?.[0] || 'U');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View className="flex-row items-center justify-between px-4 py-4" style={headerAnimatedStyle}>
        <TouchableOpacity 
          onPress={handleBackPress}
          className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200"
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Profile</Text>
        <TouchableOpacity onPress={handleEditPress} activeOpacity={0.8}>
          <Text className="text-blue-600 font-semibold">Edit</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header */}
        <Animated.View className="items-center px-4 py-6" style={profileAnimatedStyle}>
          <View className="relative">
            <Image 
              source={{ uri: profileImage }}
              className="w-30 h-30 rounded-full border-4 border-white shadow-lg"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full items-center justify-center border-2 border-white"
              onPress={handlePhotoPress}
              activeOpacity={0.8}
            >
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-bold text-gray-900 mt-4">{fullName}</Text>
          <Text className="text-base text-gray-500 mt-1">{currentUser.email}</Text>
          {currentUser.studentId ? (
            <Text className="text-sm text-gray-400 mt-1">Student ID: {currentUser.studentId}</Text>
          ) : null}
        </Animated.View>

        {/* Profile Options */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 px-4 mb-3">Account Settings</Text>
          
          <ProfileOption
            icon="user"
            title="Personal Information"
            subtitle="Update your details"
            onPress={handleEditProfile}
            index={0}
          />
          
          <ProfileOption
            icon="bell"
            title="Notifications"
            subtitle="Manage your preferences"
            onPress={handleNotifications}
            index={1}
          />
          
          <ProfileOption
            icon="shield"
            title="Security & Privacy"
            subtitle="Password and privacy settings"
            onPress={handleSecurity}
            index={2}
          />
          
          <ProfileOption
            icon="bookmark"
            title="Saved Applications"
            subtitle="View your saved applications"
            onPress={() => router.push('/(tabs)/applications')}
            index={3}
          />
        </View>

        {/* Support Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 px-4 mb-3">Support</Text>
          
          <ProfileOption
            icon="help-circle"
            title="Help & Support"
            subtitle="Get help with your account"
            onPress={handleHelp}
            index={4}
          />
          
          <ProfileOption
            icon="info"
            title="About Campus Gate"
            subtitle="App version and info"
            onPress={handleAbout}
            index={5}
          />
        </View>

        {/* Logout */}
        <Animated.View className="px-4" style={logoutAnimatedStyle}>
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-red-50 p-4 rounded-xl border border-red-100"
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={20} color="#DC2626" />
            <Text className="text-red-600 font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
} 