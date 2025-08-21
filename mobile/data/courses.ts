import axios from 'axios';

// Course interface matching backend model + some extra fields for UI
export interface Course {
  id: string;
  title: string;
  description: string;
  collegeId: string;
  programType: string;
  duration: string;
  eligibilityCriteria: string;
  fee: number;
  syllabusOutline: string;
  isActive: boolean;
  applicationStart: string;
  applicationEnd: string;
  // Extra fields for UI (not in backend model)
  subtitle: string;
  type: string;
  category: string;
  feeStructure: FeeStructureRow[];
  image: string;
  rating: string;
}

export interface FeeStructureRow {
  year: string;
  fee: string;
  application: string;
  other: string;
  total: string;
}

// API configuration
const API_BASE_URL = "https://campus-gate-backend.vercel.app/api";

// Loading state
let isLoading = true;
let loadingPromise: Promise<void> | null = null;

// Transform backend course data to frontend format
const transformCourseData = (backendCourse: any): Course => {
  return {
    id: backendCourse.id,
    title: backendCourse.title,
    description: backendCourse.description || '',
    collegeId: backendCourse.collegeId,
    programType: backendCourse.programType || '',
    duration: backendCourse.duration || '',
    eligibilityCriteria: backendCourse.eligibilityCriteria || '',
    fee: backendCourse.fee || 0,
    syllabusOutline: backendCourse.syllabusOutline || '',
    isActive: backendCourse.isActive !== false,
    applicationStart: backendCourse.applicationStart || '',
    applicationEnd: backendCourse.applicationEnd || '',
    // UI fields
    subtitle: backendCourse.subtitle || backendCourse.title,
    type: backendCourse.type || 'UG',
    category: backendCourse.category || backendCourse.programType || '',
    feeStructure: backendCourse.feeStructure || [],
    image: backendCourse.image || 'https://via.placeholder.com/150',
    rating: backendCourse.rating || '4.0/5'
  };
};

// Cache for API data
let coursesCache: { [key: string]: Course } = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to fetch courses from API
const fetchCoursesFromAPI = async (): Promise<{ [key: string]: Course }> => {
  // Return cache if valid
  if (Object.keys(coursesCache).length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return coursesCache;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/course`);
    const coursesData = response.data.courses || [];
    
    const transformedCourses: { [key: string]: Course } = {};
    coursesData.forEach((course: any) => {
      transformedCourses[course.id] = transformCourseData(course);
    });
    
    coursesCache = transformedCourses;
    cacheTimestamp = Date.now();
    
    return transformedCourses;
  } catch (error) {
    console.error('Failed to fetch courses from API:', error);
    
    // Fallback to empty object if API fails
    return {};
  }
};

// Initialize courses - this will be populated by API call
export let courses: { [key: string]: Course } = {};

// Create loading promise
loadingPromise = fetchCoursesFromAPI().then(data => {
  Object.assign(courses, data);
  
  // After courses are loaded, populate college courses
  // Import here to avoid circular dependency
  import('./colleges').then(({ populateCollegeCourses }) => {
    populateCollegeCourses(courses);
  });
  
  isLoading = false;
});

// Export function to check if data is still loading
export const isCoursesLoading = (): boolean => isLoading;

// Export function to wait for data to load
export const waitForCourses = (): Promise<void> => {
  return loadingPromise || Promise.resolve();
};

// Export a function to manually refresh courses data
export const refreshCourses = async (): Promise<void> => {
  isLoading = true;
  const freshData = await fetchCoursesFromAPI();
  // Clear existing data
  Object.keys(courses).forEach(key => delete courses[key]);
  // Add fresh data
  Object.assign(courses, freshData);
  
  // Repopulate college courses after refresh
  const { populateCollegeCourses } = await import('./colleges');
  populateCollegeCourses(courses);
  
  isLoading = false;
};

// Legacy CourseDetails interface for backward compatibility
export interface CourseDetails {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  type: string;
  category: string;
  description: string;
  feeStructure: FeeStructureRow[];
  applicationDeadline: string;
}

// Transform courses to legacy format for backward compatibility
export const courseDetails: { [key: string]: CourseDetails } = new Proxy({}, {
  get: (target, prop) => {
    const course = courses[prop as string];
    if (!course) return undefined;
    
    return {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      duration: course.duration,
      type: course.type,
      category: course.category,
      description: course.description,
      feeStructure: course.feeStructure,
      applicationDeadline: course.applicationEnd 
        ? new Date(course.applicationEnd).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'No deadline specified'
    };
  },
  ownKeys: () => Object.keys(courses),
  has: (target, prop) => prop in courses,
  getOwnPropertyDescriptor: (target, prop) => {
    if (prop in courses) {
      return { enumerable: true, configurable: true };
    }
    return undefined;
  }
}); 