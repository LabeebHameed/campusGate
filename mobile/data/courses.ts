export interface FeeStructureRow {
  year: string;
  fee: string;
  application: string;
  other: string;
  total: string;
}

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

export const courses: { [key: string]: CourseDetails } = {
  'bsc-chem': {
    id: 'bsc-chem',
    title: 'Bsc (Chem)',
    subtitle: 'Bachelor of Science in Chemistry',
    duration: '4 Years',
    type: 'UG',
    category: 'Science',
    description: 'Comprehensive undergraduate program in Chemistry covering theoretical and practical aspects of chemical sciences including organic, inorganic, and physical chemistry.',
    feeStructure: [
      { year: '1', fee: '₹20,000', application: '₹2,800', other: '₹5,545', total: '₹28,345' },
      { year: '2', fee: '₹20,000', application: '₹2,800', other: '₹5,545', total: '₹28,345' },
      { year: '3', fee: '₹22,000', application: '₹2,800', other: '₹5,545', total: '₹30,345' },
      { year: '4', fee: '₹22,000', application: '₹2,800', other: '₹5,545', total: '₹30,345' }
    ],
    applicationDeadline: 'June 30, 2024'
  },
  'bsc-phy': {
    id: 'bsc-phy',
    title: 'Bsc (Phy)',
    subtitle: 'Bachelor of Science in Physics',
    duration: '4 Years',
    type: 'UG',
    category: 'Science',
    description: 'Advanced undergraduate program in Physics with focus on theoretical and experimental physics, quantum mechanics, and modern physics applications.',
    feeStructure: [
      { year: '1', fee: '₹18,000', application: '₹2,500', other: '₹5,000', total: '₹25,500' },
      { year: '2', fee: '₹18,000', application: '₹2,500', other: '₹5,000', total: '₹25,500' },
      { year: '3', fee: '₹20,000', application: '₹2,500', other: '₹5,000', total: '₹27,500' },
      { year: '4', fee: '₹20,000', application: '₹2,500', other: '₹5,000', total: '₹27,500' }
    ],
    applicationDeadline: 'July 15, 2024'
  },
  'btech-cs': {
    id: 'btech-cs',
    title: 'B Tech (CS)',
    subtitle: 'Bachelor of Technology in Computer Science',
    duration: '4 Years',
    type: 'UG',
    category: 'Engineering',
    description: 'Premier engineering program in Computer Science and Engineering with cutting-edge curriculum covering programming, algorithms, AI, and software development.',
    feeStructure: [
      { year: '1', fee: '₹45,000', application: '₹3,500', other: '₹8,000', total: '₹56,500' },
      { year: '2', fee: '₹45,000', application: '₹3,500', other: '₹8,000', total: '₹56,500' },
      { year: '3', fee: '₹50,000', application: '₹3,500', other: '₹8,000', total: '₹61,500' },
      { year: '4', fee: '₹50,000', application: '₹3,500', other: '₹8,000', total: '₹61,500' }
    ],
    applicationDeadline: 'May 31, 2024'
  },
  'comp-sci': {
    id: 'comp-sci',
    title: 'Computer Science',
    subtitle: 'Bachelor of Computer Science',
    duration: '4 Years',
    type: 'UG',
    category: 'Technology',
    description: 'Comprehensive computer science program focusing on software engineering, data structures, machine learning, and modern computing technologies.',
    feeStructure: [
      { year: '1', fee: '₹55,000', application: '₹4,000', other: '₹10,000', total: '₹69,000' },
      { year: '2', fee: '₹55,000', application: '₹4,000', other: '₹10,000', total: '₹69,000' },
      { year: '3', fee: '₹60,000', application: '₹4,000', other: '₹10,000', total: '₹74,000' },
      { year: '4', fee: '₹60,000', application: '₹4,000', other: '₹10,000', total: '₹74,000' }
    ],
    applicationDeadline: 'June 15, 2024'
  },
  'business': {
    id: 'business',
    title: 'Business Administration',
    subtitle: 'Bachelor of Business Administration',
    duration: '3 Years',
    type: 'UG',
    category: 'Management',
    description: 'Strategic business program covering finance, marketing, operations, and leadership skills for modern business environment.',
    feeStructure: [
      { year: '1', fee: '₹40,000', application: '₹3,200', other: '₹7,500', total: '₹50,700' },
      { year: '2', fee: '₹42,000', application: '₹3,200', other: '₹7,500', total: '₹52,700' },
      { year: '3', fee: '₹45,000', application: '₹3,200', other: '₹7,500', total: '₹55,700' }
    ],
    applicationDeadline: 'July 10, 2024'
  },
  'mba': {
    id: 'mba',
    title: 'MBA',
    subtitle: 'Master of Business Administration',
    duration: '2 Years',
    type: 'PG',
    category: 'Management',
    description: 'Advanced management program designed for leadership roles in corporate world with specializations in various business domains.',
    feeStructure: [
      { year: '1', fee: '₹80,000', application: '₹5,000', other: '₹15,000', total: '₹1,00,000' },
      { year: '2', fee: '₹85,000', application: '₹5,000', other: '₹15,000', total: '₹1,05,000' }
    ],
    applicationDeadline: 'April 30, 2024'
  },
  'medicine': {
    id: 'medicine',
    title: 'MBBS',
    subtitle: 'Bachelor of Medicine and Bachelor of Surgery',
    duration: '5 Years',
    type: 'UG',
    category: 'Medical',
    description: 'Comprehensive medical education program covering anatomy, physiology, pathology, and clinical practice with hands-on training.',
    feeStructure: [
      { year: '1', fee: '₹1,20,000', application: '₹6,000', other: '₹20,000', total: '₹1,46,000' },
      { year: '2', fee: '₹1,20,000', application: '₹6,000', other: '₹20,000', total: '₹1,46,000' },
      { year: '3', fee: '₹1,30,000', application: '₹6,000', other: '₹20,000', total: '₹1,56,000' },
      { year: '4', fee: '₹1,30,000', application: '₹6,000', other: '₹20,000', total: '₹1,56,000' },
      { year: '5', fee: '₹1,40,000', application: '₹6,000', other: '₹20,000', total: '₹1,66,000' }
    ],
    applicationDeadline: 'March 31, 2024'
  }
}; 