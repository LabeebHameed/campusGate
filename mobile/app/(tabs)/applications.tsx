import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface Application {
  id: string;
  university: string;
  course: string;
  appliedDate: string;
  status: 'succeeded' | 'pending';
  image: string;
}

const applicationData: Application[] = [
  {
    id: '1',
    university: 'Kerala University',
    course: 'B.tech (CSE)',
    appliedDate: 'Feb 3, 2024',
    status: 'succeeded',
    image: 'https://via.placeholder.com/60x60/8B5A2B/FFFFFF?text=KU'
  },
  {
    id: '2',
    university: 'KTU University',
    course: 'B.tech (CSE)',
    appliedDate: 'March 24, 2024',
    status: 'pending',
    image: 'https://via.placeholder.com/60x60/4A90E2/FFFFFF?text=KTU'
  },
  {
    id: '3',
    university: 'MG University',
    course: 'B.tech (CSE)',
    appliedDate: 'July 31, 2025',
    status: 'pending',
    image: 'https://via.placeholder.com/60x60/F5A623/FFFFFF?text=MG'
  }
];

interface StatusBadgeProps {
  status: 'succeeded' | 'pending';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isSucceeded = status === 'succeeded';
  
  return (
    <View className={`flex-row items-center px-2 py-1 rounded-full ${isSucceeded ? 'bg-green-100' : 'bg-yellow-100'}`}>
      <Feather 
        name={isSucceeded ? 'check' : 'clock'} 
        size={12} 
        color={isSucceeded ? '#166534' : '#92400e'} 
      />
      <Text className={`ml-1 text-xs font-medium ${isSucceeded ? 'text-green-800' : 'text-yellow-800'}`}>
        {isSucceeded ? 'Succeeded' : 'Pending'}
      </Text>
    </View>
  );
}

interface ApplicationCardProps {
  application: Application;
}

function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <View className="bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-100 shadow-sm">
      <View className="flex-row items-center">
        <Image 
          source={{ uri: application.image }}
          className="w-15 h-15 rounded-xl mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900 mb-1">
            {application.university} - {application.course}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">
            Applied : {application.appliedDate}
          </Text>
          <StatusBadge status={application.status} />
        </View>
      </View>
    </View>
  );
}

export default function ApplicationsScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'cancelled'>('active');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">Applications</Text>
        <View className="w-10 h-10 bg-gray-300 rounded-full" />
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 mb-6">
        <TouchableOpacity 
          onPress={() => setActiveTab('active')}
          className="mr-8"
        >
          <Text className={`text-base font-medium pb-2 ${activeTab === 'active' ? 'text-gray-900' : 'text-gray-400'}`}>
            Active
          </Text>
          {activeTab === 'active' && (
            <View className="h-0.5 bg-gray-900 rounded-full" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setActiveTab('cancelled')}>
          <Text className={`text-base font-medium pb-2 ${activeTab === 'cancelled' ? 'text-gray-900' : 'text-gray-400'}`}>
            Cancelled
          </Text>
          {activeTab === 'cancelled' && (
            <View className="h-0.5 bg-gray-900 rounded-full" />
          )}
        </TouchableOpacity>
      </View>

      {/* Applications List */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {applicationData.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
