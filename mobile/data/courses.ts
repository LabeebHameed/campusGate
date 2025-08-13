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

export const courses: { [key: string]: Course } = {
  'bsc-chem': {
    id: 'bsc-chem',
    title: 'Bsc (Chem)',
    description: 'Comprehensive undergraduate program in Chemistry covering theoretical and practical aspects of chemical sciences including organic, inorganic, and physical chemistry.',
    collegeId: '1',
    programType: 'Science',
    duration: '4 Years',
    eligibilityCriteria: '12th Standard with Physics, Chemistry, Mathematics/Biology with minimum 60% marks',
    fee: 20000,
    syllabusOutline: 'Organic Chemistry, Inorganic Chemistry, Physical Chemistry, Analytical Chemistry, Environmental Chemistry, Industrial Chemistry',
    isActive: true,
    applicationStart: '2024-03-01T00:00:00.000Z',
    applicationEnd: '2024-06-30T23:59:59.000Z',
    // Extra UI fields
    subtitle: 'Bachelor of Science in Chemistry',
    type: 'UG',
    category: 'Science',
    feeStructure: [
      { year: '1', fee: '₹20,000', application: '₹2,800', other: '₹5,545', total: '₹28,345' },
      { year: '2', fee: '₹20,000', application: '₹2,800', other: '₹5,545', total: '₹28,345' },
      { year: '3', fee: '₹22,000', application: '₹2,800', other: '₹5,545', total: '₹30,345' },
      { year: '4', fee: '₹22,000', application: '₹2,800', other: '₹5,545', total: '₹30,345' }
    ],
    image: 'https://via.placeholder.com/150',
    rating: '4.5/5'
  },
  'bsc-phy': {
    id: 'bsc-phy',
    title: 'Bsc (Phy)',
    description: 'Advanced undergraduate program in Physics with focus on theoretical and experimental physics, quantum mechanics, and modern physics applications.',
    collegeId: '1',
    programType: 'Science',
    duration: '4 Years',
    eligibilityCriteria: '12th Standard with Physics, Chemistry, Mathematics with minimum 65% marks',
    fee: 18000,
    syllabusOutline: 'Classical Mechanics, Quantum Mechanics, Thermodynamics, Electromagnetism, Modern Physics, Computational Physics',
    isActive: true,
    applicationStart: '2024-03-01T00:00:00.000Z',
    applicationEnd: '2024-06-30T23:59:59.000Z',
    // Extra UI fields
    subtitle: 'Bachelor of Science in Physics',
    type: 'UG',
    category: 'Science',
    feeStructure: [
      { year: '1', fee: '₹18,000', application: '₹2,500', other: '₹5,000', total: '₹25,500' },
      { year: '2', fee: '₹18,000', application: '₹2,500', other: '₹5,000', total: '₹25,500' },
      { year: '3', fee: '₹20,000', application: '₹2,500', other: '₹5,000', total: '₹27,500' },
      { year: '4', fee: '₹20,000', application: '₹2,500', other: '₹5,000', total: '₹27,500' }
    ],
    image: 'https://via.placeholder.com/150',
    rating: '4.2/5'
  },
  'btech-cs': {
    id: 'btech-cs',
    title: 'B Tech (CS)',
    description: 'Comprehensive 4-year engineering program in Computer Science with focus on programming, algorithms, software development, and emerging technologies.',
    collegeId: '1',
    programType: 'Engineering',
    duration: '4 Years',
    eligibilityCriteria: '12th Standard with Physics, Chemistry, Mathematics with minimum 70% marks and valid entrance exam score',
    fee: 45000,
    syllabusOutline: 'Programming Languages, Data Structures, Algorithms, Computer Networks, Database Systems, Software Engineering, AI/ML, Cybersecurity',
    isActive: true,
    applicationStart: '2024-02-01T00:00:00.000Z',
    applicationEnd: '2024-05-31T23:59:59.000Z',
    // Extra UI fields
    subtitle: 'Bachelor of Technology in Computer Science',
    type: 'UG',
    category: 'Engineering',
    feeStructure: [
      { year: '1', fee: '₹45,000', application: '₹5,000', other: '₹8,000', total: '₹58,000' },
      { year: '2', fee: '₹45,000', application: '₹5,000', other: '₹8,000', total: '₹58,000' },
      { year: '3', fee: '₹50,000', application: '₹5,000', other: '₹8,000', total: '₹63,000' },
      { year: '4', fee: '₹50,000', application: '₹5,000', other: '₹8,000', total: '₹63,000' }
    ],
    image: 'https://via.placeholder.com/150',
    rating: '4.8/5'
  },
  'comp-sci': {
    id: 'comp-sci',
    title: 'Computer Science',
    description: 'Advanced Computer Science program focusing on theoretical foundations, practical applications, and cutting-edge research in computing.',
    collegeId: '2',
    programType: 'Science & Technology',
    duration: '4 Years',
    eligibilityCriteria: 'High school diploma with strong background in Mathematics and Science, SAT/ACT scores required',
    fee: 55000,
    syllabusOutline: 'Advanced Algorithms, Machine Learning, Computer Vision, Natural Language Processing, Distributed Systems, Human-Computer Interaction',
    isActive: true,
    applicationStart: '2024-01-15T00:00:00.000Z',
    applicationEnd: '2024-04-15T23:59:59.000Z',
    // Extra UI fields
    subtitle: 'Bachelor of Science in Computer Science',
    type: 'UG',
    category: 'Technology',
    feeStructure: [
      { year: '1', fee: '₹55,000', application: '₹3,000', other: '₹7,000', total: '₹65,000' },
      { year: '2', fee: '₹55,000', application: '₹3,000', other: '₹7,000', total: '₹65,000' },
      { year: '3', fee: '₹60,000', application: '₹3,000', other: '₹7,000', total: '₹70,000' },
      { year: '4', fee: '₹60,000', application: '₹3,000', other: '₹7,000', total: '₹70,000' }
    ],
    image: 'https://via.placeholder.com/150',
    rating: '4.6/5'
  },
  'business': {
    id: 'business',
    title: 'Business Administration',
    description: 'Comprehensive business program covering management, finance, marketing, operations, and strategic planning for modern business challenges.',
    collegeId: '2',
    programType: 'Business',
    duration: '3 Years',
    eligibilityCriteria: 'High school diploma with good academic standing, GMAT/GRE scores preferred',
    fee: 40000,
    syllabusOutline: 'Management Principles, Financial Accounting, Marketing Management, Operations Management, Business Strategy, Entrepreneurship',
    isActive: true,
    applicationStart: '2024-02-01T00:00:00.000Z',
    applicationEnd: '2024-05-15T23:59:59.000Z',
    // Extra UI fields
    subtitle: 'Bachelor of Business Administration',
    type: 'UG',
    category: 'Business',
    feeStructure: [
      { year: '1', fee: '₹40,000', application: '₹4,000', other: '₹6,000', total: '₹50,000' },
      { year: '2', fee: '₹40,000', application: '₹4,000', other: '₹6,000', total: '₹50,000' },
      { year: '3', fee: '₹45,000', application: '₹4,000', other: '₹6,000', total: '₹55,000' }
    ],
    image: 'https://via.placeholder.com/150',
    rating: '4.3/5'
  },
  'mba': {
    id: 'mba',
    title: 'MBA',
    description: 'Master of Business Administration - Elite graduate program for developing leadership and strategic management skills.',
    collegeId: '3',
    programType: 'Business',
    duration: '2 Years',
    eligibilityCriteria: 'Bachelor\'s degree with minimum 3.5 GPA, GMAT score 700+, work experience preferred',
    fee: 80000,
    syllabusOutline: 'Strategic Management, Leadership, Financial Analysis, Marketing Strategy, Operations Excellence, Global Business',
    isActive: true,
    applicationStart: '2024-01-01T00:00:00.000Z',
    applicationEnd: '2024-03-31T23:59:59.000Z',
    // Extra UI fields
    subtitle: 'Master of Business Administration',
    type: 'PG',
    category: 'Business',
    feeStructure: [
      { year: '1', fee: '₹80,000', application: '₹10,000', other: '₹15,000', total: '₹1,05,000' },
      { year: '2', fee: '₹80,000', application: '₹10,000', other: '₹15,000', total: '₹1,05,000' }
    ],
    image: 'https://via.placeholder.com/150',
    rating: '4.7/5'
  },
  'medicine': {
    id: 'medicine',
    title: 'MBBS',
    description: 'Bachelor of Medicine and Bachelor of Surgery - Comprehensive medical education program for aspiring doctors.',
    collegeId: '3',
    programType: 'Medical',
    duration: '5 Years',
    eligibilityCriteria: 'Pre-med coursework, MCAT scores, strong background in Biology, Chemistry, Physics',
    fee: 120000,
    syllabusOutline: 'Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, Internal Medicine, Surgery, Pediatrics, Clinical Rotations',
    isActive: true,
    applicationStart: '2024-01-01T00:00:00.000Z',
    applicationEnd: '2024-04-30T23:59:59.000Z',
    // Extra UI fields
    subtitle: 'Bachelor of Medicine and Bachelor of Surgery',
    type: 'UG',
    category: 'Medical',
    feeStructure: [
      { year: '1', fee: '₹1,20,000', application: '₹15,000', other: '₹20,000', total: '₹1,55,000' },
      { year: '2', fee: '₹1,20,000', application: '₹15,000', other: '₹20,000', total: '₹1,55,000' },
      { year: '3', fee: '₹1,25,000', application: '₹15,000', other: '₹20,000', total: '₹1,60,000' },
      { year: '4', fee: '₹1,25,000', application: '₹15,000', other: '₹20,000', total: '₹1,60,000' },
      { year: '5', fee: '₹1,30,000', application: '₹15,000', other: '₹20,000', total: '₹1,65,000' }
    ],
    image: 'https://via.placeholder.com/150',
    rating: '4.9/5'
  }
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
export const courseDetails: { [key: string]: CourseDetails } = Object.fromEntries(
  Object.entries(courses).map(([key, course]) => [
    key,
    {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      duration: course.duration,
      type: course.type,
      category: course.category,
      description: course.description,
      feeStructure: course.feeStructure,
      applicationDeadline: new Date(course.applicationEnd).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  ])
); 