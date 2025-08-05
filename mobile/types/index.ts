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