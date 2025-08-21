import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApplications } from '../../hooks/useApplications';
import { Application } from '../../types';
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'text-green-600 bg-green-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    case 'under_review':
      return 'text-blue-600 bg-blue-100';
    case 'payment_pending':
      return 'text-orange-600 bg-orange-100';
    case 'submitted':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-yellow-600 bg-yellow-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'check-circle';
    case 'rejected':
      return 'x-circle';
    case 'under_review':
      return 'search';
    case 'payment_pending':
      return 'credit-card';
    case 'submitted':
      return 'send';
    default:
      return 'clock';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'payment_pending':
      return 'Payment Pending';
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
};

// Animated Application Card
const AnimatedApplicationCard: React.FC<{
  application: Application;
  index: number;
  onDelete: (applicationId: string) => void;
}> = ({ application, index, onDelete }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    const delay = 300 + (index * 100);
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 300 }));
  }, [index]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Handle application press
    console.log('View application:', application.id);
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
        className="bg-white p-4 rounded-xl border border-gray-100"
        style={animatedStyle}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              Course ID: {application.courseId}
            </Text>
            <Text className="text-sm text-gray-500">
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Application ID: {application.id}
            </Text>
          </View>
          
          <View className={`flex-row items-center px-3 py-1 rounded-full ${getStatusColor(application.status)}`}>
            <Feather name={getStatusIcon(application.status) as any} size={14} />
            <Text className="ml-1 text-xs font-medium capitalize">
              {getStatusLabel(application.status)}
            </Text>
          </View>
        </View>

        {application.remarks ? (
          <View className="mb-3 p-2 bg-gray-50 rounded-lg">
            <Text className="text-xs text-gray-600">
              <Text className="font-medium">Remarks:</Text> {application.remarks}
            </Text>
          </View>
        ) : null}

        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <TouchableOpacity className="flex-row items-center" activeOpacity={0.8}>
            <Feather name="eye" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2 text-sm">View Details</Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center space-x-4">
            {application.submittedDocuments && application.submittedDocuments.length > 0 ? (
              <View className="flex-row items-center">
                <Feather name="paperclip" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2 text-sm">
                  {application.submittedDocuments.length} document{application.submittedDocuments.length !== 1 ? 's' : ''}
                </Text>
              </View>
            ) : null}
            
                         <TouchableOpacity 
               className={`flex-row items-center ${(application.status === 'accepted' || application.status === 'under_review') ? 'opacity-50' : ''}`}
               activeOpacity={0.8}
               onPress={() => onDelete(application.id)}
               disabled={application.status === 'accepted' || application.status === 'under_review'}
             >
               <Feather 
                 name="trash-2" 
                 size={16} 
                 color={(application.status === 'accepted' || application.status === 'under_review') ? '#9CA3AF' : '#EF4444'} 
               />
               <Text className={`ml-2 text-sm ${(application.status === 'accepted' || application.status === 'under_review') ? 'text-gray-400' : 'text-red-500'}`}>
                 Delete
               </Text>
             </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default function ApplicationsScreen() {
  const { isSignedIn } = useAuth();
  const applicationsHook = useApplications();
  const { getUserApplications, deleteApplication, loading, error } = applicationsHook || {};
  const [applications, setApplications] = useState<Application[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const emptyStateOpacity = useSharedValue(0);
  const emptyStateScale = useSharedValue(0.8);

  useEffect(() => {
    // Entrance animations
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 300 }));
  }, []);

  const loadApplications = async () => {
    if (!getUserApplications) return;
    
    try {
      const userApplications = await getUserApplications();
      setApplications(userApplications);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleDeleteApplication = async (applicationId: string) => {
    // Find the application to check its status
    const application = applications.find(app => app.id === applicationId);
    
    // Prevent deletion of accepted or under review applications
    if (application && (application.status === 'accepted' || application.status === 'under_review')) {
      Alert.alert(
        "Cannot Delete",
        `Cannot delete ${application.status} applications. Please contact support if you need assistance.`,
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    Alert.alert(
      "Delete Application",
      "Are you sure you want to delete this application? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              if (deleteApplication) {
                await deleteApplication(applicationId);
                // Remove from local state
                setApplications(prev => prev.filter(app => app.id !== applicationId));
              }
            } catch (error) {
              console.error('Failed to delete application:', error);
              Alert.alert("Error", "Failed to delete application. Please try again.");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (isSignedIn) {
      loadApplications();
    }
  }, [isSignedIn]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const emptyStateAnimatedStyle = useAnimatedStyle(() => ({
    opacity: emptyStateOpacity.value,
    transform: [{ scale: emptyStateScale.value }]
  }));

  // Show empty state animation when no applications
  useEffect(() => {
    if (applications.length === 0 && !loading) {
      emptyStateOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
      emptyStateScale.value = withDelay(500, withSpring(1, { damping: 20, stiffness: 300 }));
    }
  }, [applications.length, loading]);

  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Feather name="lock" size={48} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">Sign In Required</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Please sign in to view your applications
        </Text>
      </SafeAreaView>
    );
  }

  if (loading && applications.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#111827" />
        <Text className="text-gray-600 mt-3 font-medium">Loading applications...</Text>
      </SafeAreaView>
    );
  }

  if (error && applications.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">Failed to Load</Text>
        <Text className="text-gray-500 mt-2 text-center">
          {error}
        </Text>
        <TouchableOpacity 
          onPress={loadApplications}
          className="mt-4 bg-gray-900 px-6 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Animated.View className="px-6 py-4 bg-white border-b border-gray-100" style={headerAnimatedStyle}>
        <Text className="text-2xl font-bold text-gray-900">My Applications</Text>
        <Text className="text-gray-500 mt-1">
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
        </Text>
      </Animated.View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 space-y-3">
          {applications.map((application, index) => (
            <AnimatedApplicationCard
              key={application.id}
              application={application}
              index={index}
              onDelete={handleDeleteApplication}
            />
          ))}
        </View>

        {applications.length === 0 && !loading ? (
          <Animated.View className="flex-1 justify-center items-center py-20" style={emptyStateAnimatedStyle}>
            <Feather name="file-text" size={48} color="#D1D5DB" />
            <Text className="text-lg font-medium text-gray-500 mt-4">No Applications Yet</Text>
            <Text className="text-sm text-gray-400 mt-2 text-center px-8">
              Start by exploring colleges and applying to your preferred courses
            </Text>
          </Animated.View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
