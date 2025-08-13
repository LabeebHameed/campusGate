// Re-export all data and types

// Primary exports (backend-matching)
export * from './colleges';
export * from './courses';

// Create empty favoriteItems array for data-helpers compatibility
export const favoriteItems: any[] = [];

// Legacy exports for backward compatibility
export { universities, type University } from './colleges';
export { courseDetails as courses, type CourseDetails } from './courses'; 