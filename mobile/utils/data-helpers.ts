import { colleges, courseDetails as courses, type College, type CourseDetails } from '../data';
import { CarouselItem } from '../types';

/**
 * Transform college data to carousel format for home page
 */
export function getCarouselData(): CarouselItem[] {
  return Object.values(colleges).map(college => ({
    id: college.id,
    imageUrl: college.image,
    title: college.name,
    location: `${college.district}, ${college.state}`,
    rating: college.rating,
    reviews: college.reviews.replace('Reviews', 'reviews')
  }));
}

/**
 * Get college by ID
 */
export function getCollegeById(id: string): College | null {
  return colleges[id] || null;
}

/**
 * Get course details by course ID
 */
export function getCourseById(courseId: string): CourseDetails | null {
  return courses[courseId] || null;
}

/**
 * Get all favorite items - now handled by useFavorites hook
 */
export function getFavoriteItems(): any[] {
  return [];
}

/**
 * Find college that offers a specific course
 */
export function getCollegeByCourseId(courseId: string): College | null {
  for (const college of Object.values(colleges)) {
    if (college.courses.some(course => course === courseId)) {
      return college;
    }
  }
  return null;
}

/**
 * Get all courses across all colleges
 */
export function getAllCourses(): CourseDetails[] {
  return Object.values(courses);
}

/**
 * Get courses by category
 */
export function getCoursesByCategory(category: string): CourseDetails[] {
  return Object.values(courses).filter(course => 
    course.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search colleges by name or location
 */
export function searchColleges(query: string): College[] {
  const searchTerm = query.toLowerCase();
  return Object.values(colleges).filter(college =>
    college.name.toLowerCase().includes(searchTerm) ||
    `${college.district}, ${college.state}`.toLowerCase().includes(searchTerm)
  );
}

/**
 * Search courses by name or category
 */
export function searchCourses(query: string): CourseDetails[] {
  const searchTerm = query.toLowerCase();
  return Object.values(courses).filter(course =>
    course.title.toLowerCase().includes(searchTerm) ||
    course.category.toLowerCase().includes(searchTerm) ||
    course.description.toLowerCase().includes(searchTerm)
  );
}

// Legacy function names for backward compatibility
export const getUniversityById = getCollegeById;
export const searchUniversities = searchColleges;
export const getUniversityByCourseId = getCollegeByCourseId; 