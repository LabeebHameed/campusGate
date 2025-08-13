import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCollegeById } from '../../utils/data-helpers';
import { useFavorites } from '../../hooks/useFavorites';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CollegeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Get college data using helper function
  const college = getCollegeById(id as string);
  const isCollegeFavorite = college ? isFavorite(college.id, 'college') : false;

  // Fallback if college not found
  if (!college) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4">College Not Found</Text>
          <Text className="text-gray-500 mt-2">The requested college could not be found.</Text>
        <TouchableOpacity 
            className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleFavoriteToggle = async () => {
    const result = await toggleFavorite(college.id, 'college');
    if (result) {
      // Optional: Show feedback to user
      console.log(isFavorite(college.id, 'college') ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="relative">
          <TouchableOpacity 
            className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/20 rounded-full justify-center items-center"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 rounded-full justify-center items-center"
            onPress={handleFavoriteToggle}
          >
            <Feather 
              name="heart" 
              size={20} 
              color={isCollegeFavorite ? "#EF4444" : "#6B7280"}
              fill={isCollegeFavorite ? "#EF4444" : "#6B7280"} 
            />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View className="relative">
          <Image 
            source={{ uri: college.image }}
            style={{ 
              width: SCREEN_WIDTH, 
              height: 250,
              resizeMode: 'cover'
            }}
          />
          
          {/* Gradient Overlay */}
          <View 
            className="absolute inset-0 bg-black/20"
          />
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* College Information */}
          <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
              {college.name}
          </Text>
          
            <View className="flex-row items-center mb-3">
              <Feather name="map-pin" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">{college.district}, {college.state}</Text>
            </View>
            
          <View className="flex-row items-center mb-4">
              <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full mr-3">
                <Feather name="star" size={14} color="#059669" />
                <Text className="text-green-700 font-semibold ml-1">{college.rating}</Text>
              </View>
              <Text className="text-gray-500">{college.reviews}</Text>
            </View>

            <Text className="text-gray-700 leading-6">
              {college.description}
            </Text>
          </View>
          
          {/* Quick Stats */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Quick Info</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Category</Text>
                <Text className="font-medium text-gray-900">{college.category}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Type</Text>
                <Text className="font-medium text-gray-900">{college.type}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Management</Text>
                <Text className="font-medium text-gray-900">{college.management}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Established</Text>
                <Text className="font-medium text-gray-900">{college.establishYear}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Affiliated to</Text>
                <Text className="font-medium text-gray-900">{college.universityName}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Fee Range</Text>
                <Text className="font-medium text-gray-900">{college.feeRange}</Text>
              </View>
            </View>
          </View>

          {/* Courses Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Available Courses</Text>
            {college.courses.map((courseId) => (
              <TouchableOpacity 
                key={courseId}
                className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
                onPress={() => router.push(`/course/${courseId}`)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">
                      {courseId.replace('-', ' ').toUpperCase()}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      4 Years • ₹20,000 / Sem
            </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#6B7280" />
                </View>
            </TouchableOpacity>
            ))}
        </View>

          {/* Contact Information */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Contact Information</Text>
            <TouchableOpacity className="flex-row items-center mb-2">
              <Feather name="globe" size={16} color="#3B82F6" />
              <Text className="text-blue-600 ml-2">{college.website}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Apply Button */}
          <TouchableOpacity 
            className="bg-blue-600 py-4 rounded-xl"
            onPress={() => {
              // Handle apply logic
              console.log('Apply to college:', college.name);
            }}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Apply Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 