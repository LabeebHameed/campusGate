export interface CarouselItem {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  rating: string;
  reviews: string;
}

export interface CollegeDetail extends CarouselItem {
  description: string;
  facilities: string[];
  programs: string[];
  admissionDetails: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
}

export interface CategoryItem {
  id: string;
  label: string;
  isActive: boolean;
}

// User-related types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  applicationsCount: number;
  favoritesCount: number;
  referralsCount: number;
}

// Application-related types
export interface Application {
  id: string;
  studentId: string;
  courseId: string;
  status: 'draft' | 'payment_pending' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submittedDocuments: string[];
  remarks?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  courseId: string;
  submittedDocuments?: string[];
  personalStatement?: string;
} 