/* global use, db */
// MongoDB Playground Seed Script
// How to use:
// 1) Ensure you're connected to your MongoDB cluster in VS Code (MongoDB extension)
// 2) Change the database name below if needed
// 3) Run this file (Play ▶) to insert dummy data

// Select the database to use (CHANGE THIS if your DB name is different)
use('test');

// Optional: Clean existing docs by id to avoid duplicate key errors on re-run
// db.getCollection('colleges').deleteMany({ id: { $in: [
//   'col-kerala-univ', 'col-ktu', 'col-mg-univ'
// ]}});
// db.getCollection('courses').deleteMany({ id: { $in: [
//   'crs-kerala-cse-btech', 'crs-ktu-cse-btech', 'crs-mgu-bsc-it'
// ]}});

// Insert Colleges
db.getCollection('colleges').insertMany([
  {
    id: 'col-kerala-univ',
    name: 'Kerala University',
    description: 'A leading public university in Kerala offering diverse programs.',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    website: 'https://www.keralauniversity.ac.in/',
    establishYear: 1937,
    type: 'Public',
    manegement: 'Government',
    universityName: 'University of Kerala',
    universityType: 'Affiliated',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'col-ktu',
    name: 'APJ Abdul Kalam Technological University (KTU)',
    description: 'State technological university focusing on engineering programs.',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    website: 'https://ktu.edu.in/',
    establishYear: 2014,
    type: 'Public',
    manegement: 'Government',
    universityName: 'KTU',
    universityType: 'State Technological University',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'col-mg-univ',
    name: 'Mahatma Gandhi University',
    description: 'Well-known university with strong arts and science programs.',
    state: 'Kerala',
    district: 'Kottayam',
    website: 'https://www.mgu.ac.in/',
    establishYear: 1983,
    type: 'Public',
    manegement: 'Government',
    universityName: 'MG University',
    universityType: 'Affiliated',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Insert Courses (ensure dates are valid)
const now = new Date();
const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

db.getCollection('courses').insertMany([
  {
    id: 'crs-kerala-cse-btech',
    title: 'B.Tech Computer Science & Engineering',
    description: 'Undergraduate program focusing on core CS concepts and systems.',
    collegeId: 'col-kerala-univ',
    programType: 'Undergraduate',
    duration: '4 years',
    eligibilityCriteria: '12th with PCM, as per university norms',
    fee: 125000,
    syllabusOutline: 'Programming, DSA, OS, DBMS, Networks, AI',
    isActive: true,
    applicationStart: now,
    applicationEnd: in90Days,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'crs-ktu-cse-btech',
    title: 'B.Tech Computer Science',
    description: 'Industry-aligned CS program under KTU.',
    collegeId: 'col-ktu',
    programType: 'Undergraduate',
    duration: '4 years',
    eligibilityCriteria: '12th with PCM, KTU entrance as applicable',
    fee: 150000,
    syllabusOutline: 'Programming, Algorithms, Cloud, ML',
    isActive: true,
    applicationStart: now,
    applicationEnd: in30Days,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'crs-mgu-bsc-it',
    title: 'B.Sc Information Technology',
    description: 'Foundation in IT systems and software development.',
    collegeId: 'col-mg-univ',
    programType: 'Undergraduate',
    duration: '3 years',
    eligibilityCriteria: '12th any stream with Math preferred',
    fee: 80000,
    syllabusOutline: 'Programming, Web, Databases, Networks',
    isActive: true,
    applicationStart: now,
    applicationEnd: in90Days,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

console.log('✅ Seeded colleges and courses successfully (Playground).');