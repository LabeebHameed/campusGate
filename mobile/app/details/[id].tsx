import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCollegeById, getCourseById } from '../../utils/data-helpers';
import { useFavorites } from '../../hooks/useFavorites';
import { useEffect, useState } from 'react';
import { waitForAllData, isDataLoading, type College } from '../../data';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CollegeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const favoritesHook = useFavorites();
  const { isFavorite, toggleFavorite } = favoritesHook || {};
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const heroOpacity = useSharedValue(0);
  const heroScale = useSharedValue(1.1);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Wait for all data to load (including course-college relationships)
        await waitForAllData();
        
        // Get college data using helper function
        const collegeData = getCollegeById(id as string);
        setCollege(collegeData);
      } catch (error) {
        console.error('Error loading college data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!loading && college) {
      // Staggered entrance animations
      headerOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
      headerTranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 300 }));
      
      heroOpacity.value = withDelay(200, withTiming(1, { duration: 1000 }));
      heroScale.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 300 }));
      
      contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
      contentTranslateY.value = withDelay(400, withSpring(0, { damping: 20, stiffness: 300 }));
      
      buttonOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
      buttonScale.value = withDelay(600, withSpring(1, { damping: 20, stiffness: 300 }));
    }
  }, [loading, college]);

  const isCollegeFavorite = college && isFavorite ? isFavorite(college.id, 'college') : false;

  const handleFavoriteToggle = async () => {
    if (!toggleFavorite || !college) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await toggleFavorite(college.id, 'college');
    if (result) {
      // Optional: Show feedback to user
      console.log(isFavorite && isFavorite(college.id, 'college') ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

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

  // Show loading state while data is being fetched
  if (loading || isDataLoading()) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={{ color: '#6B7280', marginTop: 16 }}>Loading college details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Fallback if college not found
  if (!college) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Feather name="alert-circle" size={64} color="#EF4444" />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginTop: 16 }}>College Not Found</Text>
          <Text style={{ color: '#6B7280', marginTop: 8 }}>The requested college could not be found.</Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 24 }}
            onPress={handleBackPress}
            activeOpacity={0.8}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#efefef' }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[{ position: 'relative', zIndex: 20 }, headerAnimatedStyle]}>
          <TouchableOpacity 
            style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
            onPress={handleBackPress}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
            onPress={handleFavoriteToggle}
            activeOpacity={0.8}
          >
            <Feather 
              name="heart" 
              size={20} 
              color={isCollegeFavorite ? "#EF4444" : "white"}
              fill={isCollegeFavorite ? "#EF4444" : "transparent"} 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Image */}
        <Animated.View style={[{ position: 'relative', marginTop: -64 }]}>
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
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}
          />
        </Animated.View>

        {/* Content */}
        <Animated.View style={[{ 
          backgroundColor: '#efefef', 
          borderTopLeftRadius: 28, 
          borderTopRightRadius: 28, 
          marginTop: -28, 
          paddingHorizontal: 20, 
          paddingTop: 32, 
          paddingBottom: 24 
        }, contentAnimatedStyle]}>
          {/* College Information */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2626', marginBottom: 8 }}>
              {college.name}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 20, height: 20, backgroundColor: '#898b8d', borderRadius: 10, marginRight: 8 }} />
              <Text style={{ color: '#1f2626', fontSize: 16, fontWeight: 'bold' }}>{college.district}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f6f7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                <Feather name="star" size={13} color="#000000" />
                <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: 4, fontSize: 8 }}>{college.rating}</Text>
              </View>
              <Text style={{ color: '#1f2626', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }}>{college.reviews} Review</Text>
            </View>

            <Text style={{ color: '#898b8d', lineHeight: 24, fontSize: 15, marginBottom: 8 }}>
              {college.description}
            </Text>
            
            <TouchableOpacity>
              <Text style={{ color: '#1f2626', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                Read More
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Courses Section */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2626' }}>Courses</Text>
              <TouchableOpacity>
                <Text style={{ color: '#1f2626', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            
            {college.courses && college.courses.length > 0 ? (
              college.courses.map((courseId: string) => {
                const courseData = getCourseById(courseId);
                
                return (
                  <TouchableOpacity 
                    key={courseId}
                    style={{ backgroundColor: '#ffffff', borderRadius: 16, height: 80, marginBottom: 12, paddingHorizontal: 20, paddingVertical: 16 }}
                    onPress={() => router.push(`/course/${courseId}`)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: '#1f2626', fontSize: 16, marginBottom: 4 }}>
                          {courseData ? courseData.title : courseId.replace('-', ' ').toUpperCase()}
                        </Text>
                        <Text style={{ color: '#898b8d', fontSize: 15, fontWeight: 'bold' }}>
                          {courseData ? courseData.duration : '4 Years'} - {courseData && courseData.feeStructure && courseData.feeStructure.length > 0 
                            ? `₹${courseData.feeStructure[0].fee}` 
                            : '₹20,000'} / Sem
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={50} color="#898b8d" />
                    </View>
                    
                    {/* Star Rating */}
                    <View style={{ position: 'absolute', left: 20, bottom: 16 }}>
                      <View style={{ backgroundColor: '#f5f6f7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 146 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Feather name="star" size={13} color="#000000" />
                          <Text style={{ color: '#000000', fontSize: 8, fontWeight: 'bold', marginLeft: 4 }}>
                            {college.rating}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16 }}>
                <Text style={{ color: '#898b8d', textAlign: 'center' }}>No courses available</Text>
              </View>
            )}
          </View>
          
          {/* Action Buttons */}
          <Animated.View style={buttonAnimatedStyle}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={{ flex: 1, backgroundColor: '#1f2626', height: 54, borderRadius: 1000, justifyContent: 'center' }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  console.log('Book Tour for:', college!.name);
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                  Book Tour
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ flex: 1, backgroundColor: '#1f2626', height: 54, borderRadius: 1000, justifyContent: 'center' }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  console.log('Virtual Tour for:', college!.name);
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                  Virtual Tour
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}