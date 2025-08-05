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

export const universities: { [key: string]: University } = {
  '1': {
    id: '1',
    name: 'Rio de Janeiro College',
    location: 'Kerala',
    rating: '4.3',
    reviews: '143 Reviews',
    description: 'Best College in Kerala with excellent academic programs and state-of-the-art facilities. Known for its diverse course offerings and experienced faculty.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    courses: [
      {
        id: 'bsc-chem',
        name: 'Bsc (Chem)',
        duration: '4 Years',
        cost: '₹20,000 / Sem',
        rating: '4.5'
      },
      {
        id: 'bsc-phy',
        name: 'Bsc (Phy)',
        duration: '4 Years',
        cost: '₹18,000 / Sem',
        rating: '4.3'
      },
      {
        id: 'btech-cs',
        name: 'B Tech (CS)',
        duration: '4 Years',
        cost: '₹45,000 / Sem',
        rating: '4.8'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'University of Toronto',
    location: 'Toronto, Canada',
    rating: '4.8',
    reviews: '256 Reviews',
    description: 'Leading research university in Canada with world-class programs and facilities. Internationally recognized for academic excellence and innovation.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    courses: [
      {
        id: 'comp-sci',
        name: 'Computer Science',
        duration: '4 Years',
        cost: '₹55,000 / Sem',
        rating: '4.9'
      },
      {
        id: 'business',
        name: 'Business Administration',
        duration: '3 Years',
        cost: '₹40,000 / Sem',
        rating: '4.7'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Harvard University',
    location: 'Cambridge, USA',
    rating: '4.9',
    reviews: '512 Reviews',
    description: 'Prestigious Ivy League institution renowned for academic excellence, research, and producing world leaders across various fields.',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    courses: [
      {
        id: 'mba',
        name: 'MBA',
        duration: '2 Years',
        cost: '₹80,000 / Sem',
        rating: '5.0'
      },
      {
        id: 'medicine',
        name: 'MBBS',
        duration: '5 Years',
        cost: '₹1,20,000 / Sem',
        rating: '4.9'
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Stanford University',
    location: 'California, USA',
    rating: '4.9',
    reviews: '398 Reviews',
    description: 'World-renowned university at the heart of Silicon Valley, known for innovation, entrepreneurship, and cutting-edge technology programs.',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    courses: [
      {
        id: 'comp-sci',
        name: 'Computer Science',
        duration: '4 Years',
        cost: '₹55,000 / Sem',
        rating: '5.0'
      },
      {
        id: 'btech-cs',
        name: 'B Tech (CS)',
        duration: '4 Years',
        cost: '₹45,000 / Sem',
        rating: '4.8'
      }
    ]
  },
  '5': {
    id: '5',
    name: 'MIT Cambridge',
    location: 'Massachusetts, USA',
    rating: '5.0',
    reviews: '289 Reviews',
    description: 'Massachusetts Institute of Technology - Premier institution for science, technology, engineering, and mathematics education and research.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    courses: [
      {
        id: 'btech-cs',
        name: 'B Tech (CS)',
        duration: '4 Years',
        cost: '₹45,000 / Sem',
        rating: '5.0'
      },
      {
        id: 'bsc-phy',
        name: 'Bsc (Phy)',
        duration: '4 Years',
        cost: '₹18,000 / Sem',
        rating: '4.9'
      }
    ]
  }
}; 