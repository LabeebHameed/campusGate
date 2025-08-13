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

export const colleges: { [key: string]: College } = {
  '1': {
    id: '1',
    name: 'Rio de Janeiro College',
    category: 'Arts and Science', // Backend category field
    state: 'Kerala',
    district: 'Kottayam',
    website: 'https://riocollegekottayam.edu.in',
    establishYear: 1985,
    type: 'Government College', // Different from category
    management: 'Government',
    universityName: 'Mahatma Gandhi University',
    universityType: 'State University',
    // Extra UI fields
    description: 'Best College in Kerala with excellent academic programs and state-of-the-art facilities. Known for its diverse course offerings and experienced faculty.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: '4.3',
    reviews: '143 Reviews',
    courses: ['bsc-chem', 'bsc-phy', 'btech-cs'],
    feeRange: '₹18,000 - ₹45,000 per semester'
  },
  '2': {
    id: '2',
    name: 'University of Toronto',
    category: 'Research University',
    state: 'Ontario',
    district: 'Toronto',
    website: 'https://www.utoronto.ca',
    establishYear: 1827,
    type: 'Public University',
    management: 'Public',
    universityName: 'University of Toronto',
    universityType: 'Research University',
    // Extra UI fields
    description: 'Leading research university in Canada with world-class programs and facilities. Internationally recognized for academic excellence and innovation.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: '4.8',
    reviews: '256 Reviews',
    courses: ['comp-sci', 'business'],
    feeRange: '₹40,000 - ₹55,000 per semester'
  },
  '3': {
    id: '3',
    name: 'Harvard University',
    category: 'Ivy League',
    state: 'Massachusetts',
    district: 'Cambridge',
    website: 'https://www.harvard.edu',
    establishYear: 1636,
    type: 'Private University',
    management: 'Private',
    universityName: 'Harvard University',
    universityType: 'Ivy League',
    // Extra UI fields
    description: 'Prestigious Ivy League institution renowned for academic excellence, research, and producing world leaders across various fields.',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: '4.9',
    reviews: '512 Reviews',
    courses: ['mba', 'medicine'],
    feeRange: '₹80,000 - ₹1,20,000 per semester'
  },
  '4': {
    id: '4',
    name: 'Stanford University',
    category: 'Technology and Innovation',
    state: 'California',
    district: 'Santa Clara',
    website: 'https://www.stanford.edu',
    establishYear: 1885,
    type: 'Private Research University',
    management: 'Private',
    universityName: 'Stanford University',
    universityType: 'Research University',
    // Extra UI fields
    description: 'World-renowned university at the heart of Silicon Valley, known for innovation, entrepreneurship, and cutting-edge technology programs.',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: '4.9',
    reviews: '398 Reviews',
    courses: ['comp-sci', 'btech-cs'],
    feeRange: '₹45,000 - ₹55,000 per semester'
  },
  '5': {
    id: '5',
    name: 'MIT Cambridge',
    category: 'Institute of Technology',
    state: 'Massachusetts',
    district: 'Cambridge',
    website: 'https://www.mit.edu',
    establishYear: 1861,
    type: 'Private Institute',
    management: 'Private',
    universityName: 'Massachusetts Institute of Technology',
    universityType: 'Research Institute',
    // Extra UI fields
    description: 'Massachusetts Institute of Technology - Premier institution for science, technology, engineering, and mathematics education and research.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: '5.0',
    reviews: '289 Reviews',
    courses: ['btech-cs', 'bsc-phy'],
    feeRange: '₹18,000 - ₹45,000 per semester'
  }
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
export const universities: { [key: string]: University } = Object.fromEntries(
  Object.entries(colleges).map(([key, college]) => [
    key,
    {
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
    }
  ])
); 