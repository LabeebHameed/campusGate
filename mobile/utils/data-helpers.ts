import { universities, courses, favoriteItems, type University, type CourseDetails, type FavoriteItem } from '../data';
import { CarouselItem } from '../types';

/**
 * Transform university data to carousel format for home page
 */
export function getCarouselData(): CarouselItem[] {
  return Object.values(universities).map(university => ({
    id: university.id,
    imageUrl: university.image,
    title: university.name,
    location: university.location,
    rating: university.rating,
    reviews: university.reviews.replace('Reviews', 'reviews')
  }));
}

/**
 * Get university by ID
 */
export function getUniversityById(id: string): University | null {
  return universities[id] || null;
}

/**
 * Get course details by course ID
 */
export function getCourseById(courseId: string): CourseDetails | null {
  return courses[courseId] || null;
}

/**
 * Get all favorite items
 */
export function getFavoriteItems(): FavoriteItem[] {
  return favoriteItems;
}

/**
 * Find university that offers a specific course
 */
export function getUniversityByCourseId(courseId: string): University | null {
  for (const university of Object.values(universities)) {
    if (university.courses.some(course => course.id === courseId)) {
      return university;
    }
  }
  return null;
}

/**
 * Get all courses across all universities
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
 * Search universities by name or location
 */
export function searchUniversities(query: string): University[] {
  const searchTerm = query.toLowerCase();
  return Object.values(universities).filter(university =>
    university.name.toLowerCase().includes(searchTerm) ||
    university.location.toLowerCase().includes(searchTerm)
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