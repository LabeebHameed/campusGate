import axios from 'axios';

// College interface matching backend model + some extra fields for UI
export interface College {
  id: string;
  name: string;
  category: string; // Changed from description to category (backend naming)
  state: string;
  district: string;
  website: string;
  establishYear: number;
  type: string; // College type (Arts and Science, University, etc.)
  management: string; // Fixed typo from 'manegement'
  universityName: string;
  universityType: string;
  // Extra fields for UI (not in backend model)
  description: string; // Actual description text for UI
  image: string;
  rating: string;
  reviews: string;
  courses: string[]; // Array of course IDs
  feeRange: string; // Fee range display for UI
}

// API configuration
const API_BASE_URL = "https://campus-gate-backend.vercel.app/api";

// Loading state
let isLoading = true;
let loadingPromise: Promise<void> | null = null;

// Transform backend college data to frontend format
const transformCollegeData = (backendCollege: any): College => {
  return {
    id: backendCollege.id,
    name: backendCollege.name,
    category: backendCollege.category || '',
    state: backendCollege.state || '',
    district: backendCollege.district || '',
    website: backendCollege.website || '',
    establishYear: backendCollege.establishYear || 0,
    type: backendCollege.type || '',
    management: backendCollege.manegement || backendCollege.management || '', // Handle typo in backend
    universityName: backendCollege.universityName || '',
    universityType: backendCollege.universityType || '',
    description: backendCollege.description || '',
    image: backendCollege.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: backendCollege.rating || '4.0',
    reviews: backendCollege.reviews || '0 Reviews',
    courses: backendCollege.courses || [], // Will be populated later after courses are loaded
    feeRange: backendCollege.feeRange || 'Fee information not available'
  };
};

// Function to populate college courses from the courses data
export const populateCollegeCourses = (coursesData: { [key: string]: any }) => {
  // Clear existing courses for all colleges
  Object.values(colleges).forEach(college => {
    college.courses = [];
  });
  
  // Find courses for each college
  Object.values(coursesData).forEach((course: any) => {
    if (course.collegeId && colleges[course.collegeId]) {
      colleges[course.collegeId].courses.push(course.id);
    }
  });
};

// Cache for API data
let collegesCache: { [key: string]: College } = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to fetch colleges from API
const fetchCollegesFromAPI = async (): Promise<{ [key: string]: College }> => {
  // Return cache if valid
  if (Object.keys(collegesCache).length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return collegesCache;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/college`);
    const collegesData = response.data.college || [];
    
    const transformedColleges: { [key: string]: College } = {};
    collegesData.forEach((college: any) => {
      transformedColleges[college.id] = transformCollegeData(college);
    });
    
    collegesCache = transformedColleges;
    cacheTimestamp = Date.now();
    
    return transformedColleges;
  } catch (error) {
    console.error('Failed to fetch colleges from API:', error);
    
    // Fallback to empty object if API fails
    return {};
  }
};

// Initialize colleges - this will be populated by API call
export let colleges: { [key: string]: College } = {};

// Create loading promise
loadingPromise = fetchCollegesFromAPI().then(data => {
  Object.assign(colleges, data);
  isLoading = false;
});

// Export function to check if data is still loading
export const isCollegesLoading = (): boolean => isLoading;

// Export function to wait for data to load
export const waitForColleges = (): Promise<void> => {
  return loadingPromise || Promise.resolve();
};

// Export a function to manually refresh colleges data
export const refreshColleges = async (): Promise<void> => {
  isLoading = true;
  const freshData = await fetchCollegesFromAPI();
  // Clear existing data
  Object.keys(colleges).forEach(key => delete colleges[key]);
  // Add fresh data
  Object.assign(colleges, freshData);
  isLoading = false;
};

// Legacy export for backward compatibility (keep University name for existing code)
export interface University {
  id: string;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  description: string;
  image: string;
  courses: {
    id: string;
    name: string;
    duration: string;
    cost: string;
    rating: string;
  }[];
}

// Transform colleges to universities for backward compatibility
export const universities: { [key: string]: University } = new Proxy({}, {
  get: (target, prop) => {
    const college = colleges[prop as string];
    if (!college) return undefined;
    
    return {
      id: college.id,
      name: college.name,
      location: `${college.district}, ${college.state}`,
      rating: college.rating,
      reviews: college.reviews,
      description: college.description,
      image: college.image,
      courses: college.courses.map(courseId => ({
        id: courseId,
        name: courseId.replace('-', ' ').toUpperCase(),
        duration: '4 Years',
        cost: '₹20,000 / Sem',
        rating: '4.5'
      }))
    };
  },
  ownKeys: () => Object.keys(colleges),
  has: (target, prop) => prop in colleges,
  getOwnPropertyDescriptor: (target, prop) => {
    if (prop in colleges) {
      return { enumerable: true, configurable: true };
    }
    return undefined;
  }
}); 