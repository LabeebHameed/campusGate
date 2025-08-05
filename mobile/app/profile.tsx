import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatCard } from '../components/ui';

interface ProfileOptionProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
}

function ProfileOption({ icon, title, subtitle, onPress, showArrow = true }: ProfileOptionProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center bg-white mx-4 mb-2 p-4 rounded-xl border border-gray-100 shadow-sm"
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
        <Feather name={icon} size={20} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {showArrow && (
        <Feather name="chevron-right" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout pressed') }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200"
        >
          <Feather name="arrow-left" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Text className="text-blue-600 font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header */}
        <View className="items-center px-4 py-6">
          <View className="relative">
            <Image 
              source={{ uri: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=SU' }}
              className="w-30 h-30 rounded-full border-4 border-white shadow-lg"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full items-center justify-center border-2 border-white"
              onPress={() => Alert.alert('Change Photo', 'Photo update coming soon!')}
            >
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-bold text-gray-900 mt-4">Summayya</Text>
          <Text className="text-base text-gray-500 mt-1">summayya@email.com</Text>
          <Text className="text-sm text-gray-400 mt-1">Student ID: CSE2024001</Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-4 mb-6 space-x-3">
          <StatCard label="Applications" value="3" />
          <StatCard label="Favorites" value="12" />
          <StatCard label="Referrals" value="2" />
        </View>

        {/* Profile Options */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 px-4 mb-3">Account Settings</Text>
          
          <ProfileOption
            icon="user"
            title="Personal Information"
            subtitle="Update your details"
            onPress={handleEditProfile}
          />
          
          <ProfileOption
            icon="bell"
            title="Notifications"
            subtitle="Manage your preferences"
            onPress={handleNotifications}
          />
          
          <ProfileOption
            icon="shield"
            title="Security & Privacy"
            subtitle="Password and privacy settings"
            onPress={handleSecurity}
          />
          
          <ProfileOption
            icon="bookmark"
            title="Saved Applications"
            subtitle="View your saved applications"
            onPress={() => router.push('/(tabs)/applications')}
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
          />
          
          <ProfileOption
            icon="info"
            title="About Campus Gate"
            subtitle="App version and info"
            onPress={handleAbout}
          />
        </View>

        {/* Logout */}
        <View className="px-4">
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-red-50 p-4 rounded-xl border border-red-100"
          >
            <Feather name="log-out" size={20} color="#DC2626" />
            <Text className="text-red-600 font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 