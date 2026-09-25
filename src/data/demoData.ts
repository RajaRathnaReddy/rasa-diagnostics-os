// ─── Demo Data Generator for RASA Diagnostics OS ───
// Realistic Indian names, phone numbers, and diagnostic center data

export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  gender: Gender;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  bloodGroup: BloodGroup;
  allergies: string[];
  emergencyContact: string;
  emergencyPhone: string;
  preferredLanguage: string;
  branchId: string;
  createdAt: string;
  photo?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  corporateId?: string;
}

export interface Doctor {
  id: string;
  doctorId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  specialization: string;
  qualification: string;
  phone: string;
  email: string;
  hospital: string;
  registrationNumber: string;
  isActive: boolean;
  totalReferrals: number;
  revenue: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  manager: string;
  isActive: boolean;
}

export interface TestCatalog {
  id: string;
  testCode: string;
  name: string;
  department: string;
  sampleType: string;
  container: string;
  fastingRequired: boolean;
  tatHours: number;
  price: number;
  tax: number;
  referenceRange?: string;
  criticalLow?: number;
  criticalHigh?: number;
  category: 'Individual' | 'Profile' | 'Package';
  includedTests?: string[];
}

export type OrderStatus = 'Draft' | 'Booked' | 'Confirmed' | 'Collected' | 'Received' | 'Processing' | 'Completed' | 'Verified' | 'Reported' | 'Cancelled';
export type SampleStatus = 'Pending' | 'Collected' | 'Received' | 'Processing' | 'Completed' | 'Rejected';
export type ReportStatus = 'Pending' | 'Generated' | 'Verified' | 'Sent' | 'Delivered' | 'Viewed';
export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

export interface DiagnosticOrder {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  branchId: string;
  tests: string[];
  testNames: string[];
  status: OrderStatus;
  priority: 'Routine' | 'Urgent' | 'STAT';
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  collectedAt?: string;
  reportedAt?: string;
  verifiedAt?: string;
}

export interface Sample {
  id: string;
  sampleId: string;
  barcode: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  sampleType: string;
  container: string;
  status: SampleStatus;
  collectedBy?: string;
  collectedAt?: string;
  receivedAt?: string;
  rejectionReason?: string;
  branchId: string;
}

export interface LabResult {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  department: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  isCritical: boolean;
  status: 'Pending' | 'Entered' | 'Validated' | 'Verified';
  enteredBy?: string;
  verifiedBy?: string;
  enteredAt?: string;
  verifiedAt?: string;
}

export interface Appointment {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  branchId: string;
  notes?: string;
  doctorName?: string;
  modality?: string;
}

export interface Report {
  id: string;
  reportId: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testNames: string[];
  status: ReportStatus;
  generatedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  sentAt?: string;
  deliveryMethod?: string;
}

export interface HomeCollection {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  address: string;
  date: string;
  timeSlot: string;
  collector: string;
  status: 'Booked' | 'Assigned' | 'En Route' | 'Arrived' | 'Collected' | 'In Transit' | 'Delivered' | 'Cancelled';
  tests: string[];
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceId: string;
  patientId: string;
  patientName: string;
  orderId: string;
  amount: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  paymentMethod: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Refunded';
  createdAt: string;
}

export interface ImagingStudy {
  id: string;
  studyId: string;
  patientId: string;
  patientName: string;
  modality: string;
  bodyPart: string;
  status: 'Scheduled' | 'Checked In' | 'In Progress' | 'Completed' | 'Reporting' | 'Verified' | 'Published';
  radiologist?: string;
  technician?: string;
  machine?: string;
  scheduledAt: string;
  completedAt?: string;
  findings?: string;
  impression?: string;
}

export interface Notification {
  id: string;
  type: 'critical' | 'important' | 'reminder' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  dueDate: string;
  relatedPatient?: string;
  relatedOrder?: string;
  category: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  lastPurchasePrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon';
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  department: string;
  status: 'Operational' | 'Maintenance' | 'Down' | 'Calibration Due';
  lastCalibration: string;
  nextCalibration: string;
  nextMaintenance: string;
  branchId: string;
}

// ─── Data Generation Helpers ───

const maleFirstNames = [
  'Rajesh', 'Suresh', 'Venkatesh', 'Ramesh', 'Arun', 'Vijay', 'Srinivas', 'Krishna',
  'Ravi', 'Prasad', 'Mahesh', 'Ganesh', 'Naveen', 'Sanjay', 'Deepak', 'Rahul',
  'Amit', 'Vikram', 'Ajay', 'Prakash', 'Sunil', 'Manoj', 'Harish', 'Kiran',
  'Mohan', 'Ashok', 'Srikanth', 'Naresh', 'Pavan', 'Chandra', 'Anand', 'Gopal',
  'Bhaskar', 'Dinesh', 'Jagadish', 'Satish', 'Raju', 'Lakshman', 'Murali', 'Venu',
  'Arjun', 'Siddharth', 'Rohit', 'Nikhil', 'Akhil', 'Sachin', 'Varun', 'Tarun'
];

const femaleFirstNames = [
  'Lakshmi', 'Padma', 'Priya', 'Swathi', 'Divya', 'Kavitha', 'Anitha', 'Sunitha',
  'Saritha', 'Jyothi', 'Rekha', 'Madhavi', 'Sravani', 'Bhavani', 'Rani', 'Devi',
  'Meena', 'Suma', 'Radha', 'Geeta', 'Sita', 'Aarti', 'Sneha', 'Pooja',
  'Nandini', 'Vasantha', 'Savitri', 'Kamala', 'Usha', 'Vijaya', 'Saraswati', 'Durga',
  'Anjali', 'Deepa', 'Rashmi', 'Shilpa', 'Neha', 'Ritu', 'Pallavi', 'Manisha'
];

const lastNames = [
  'Reddy', 'Sharma', 'Rao', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Naidu',
  'Verma', 'Iyer', 'Nair', 'Choudhary', 'Yadav', 'Joshi', 'Agarwal', 'Mishra',
  'Pandey', 'Saxena', 'Kapoor', 'Malhotra', 'Chatterjee', 'Banerjee', 'Desai', 'Mehta',
  'Shah', 'Patil', 'Kulkarni', 'Hegde', 'Shetty', 'Menon', 'Pillai', 'Varma',
  'Rajan', 'Bhat', 'Kamath', 'Prasad', 'Murthy', 'Sethi', 'Thakur', 'Das'
];

const specializations = [
  'General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Dermatology',
  'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Nephrology', 'Oncology',
  'Pediatrics', 'Gynecology', 'Urology', 'ENT', 'Ophthalmology',
  'Rheumatology', 'Psychiatry', 'General Surgery', 'Diabetology', 'Internal Medicine'
];

const hospitals = [
  'Apollo Hospitals', 'KIMS Hospital', 'Yashoda Hospitals', 'Care Hospitals',
  'Continental Hospitals', 'Aware Global Hospital', 'Sunshine Hospital', 'Star Hospitals',
  'Medicover Hospitals', 'AIG Hospitals', 'Maxcure Hospitals', 'Citizens Hospital',
  'Aster Prime Hospital', 'Global Hospitals', 'NIMS Hospital'
];

const cities = ['Hyderabad', 'Secunderabad', 'Kukatpally', 'Madhapur', 'Gachibowli', 'Ameerpet', 'Begumpet', 'Banjara Hills', 'Jubilee Hills', 'LB Nagar', 'Dilsukhnagar', 'Kompally'];

const allergies = ['Penicillin', 'Aspirin', 'Sulfa', 'Latex', 'Iodine', 'Peanuts', 'Shellfish', 'None'];

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone(): string {
  const prefixes = ['98', '97', '96', '95', '94', '93', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70'];
  return `+91 ${randomFrom(prefixes)}${String(randomInt(10000000, 99999999))}`;
}

function generateDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysBack));
  d.setHours(randomInt(6, 20), randomInt(0, 59));
  return d.toISOString();
}

function generateTodayTime(): string {
  const d = new Date();
  d.setHours(randomInt(7, 19), randomInt(0, 59), 0, 0);
  return d.toISOString();
}

function padId(num: number, prefix: string, width: number = 6): string {
  return `${prefix}${String(num).padStart(width, '0')}`;
}

// ─── Generate Branches ───
export function generateBranches(): Branch[] {
  return [
    { id: 'BR001', name: 'RASA Diagnostics — Banjara Hills', code: 'BH', address: 'Road No. 12, Banjara Hills', city: 'Hyderabad', phone: '+91 40 2335 4567', manager: 'Rajesh Kumar', isActive: true },
    { id: 'BR002', name: 'RASA Diagnostics — Madhapur', code: 'MP', address: 'Ayyappa Society, Madhapur', city: 'Hyderabad', phone: '+91 40 2355 6789', manager: 'Priya Sharma', isActive: true },
    { id: 'BR003', name: 'RASA Diagnostics — Kukatpally', code: 'KP', address: 'KPHB Colony, Kukatpally', city: 'Hyderabad', phone: '+91 40 2305 1234', manager: 'Suresh Reddy', isActive: true },
    { id: 'BR004', name: 'RASA Diagnostics — Dilsukhnagar', code: 'DN', address: 'Moosarambagh, Dilsukhnagar', city: 'Hyderabad', phone: '+91 40 2405 7890', manager: 'Anitha Rao', isActive: true },
    { id: 'BR005', name: 'RASA Diagnostics — Kompally', code: 'KM', address: 'Kompally Junction', city: 'Secunderabad', phone: '+91 40 2715 3456', manager: 'Venkatesh Naidu', isActive: true },
  ];
}

// ─── Generate Test Catalog ───
export function generateTestCatalog(): TestCatalog[] {
  return [
    // Individual Tests - Hematology
    { id: 'T001', testCode: 'CBC', name: 'Complete Blood Count', department: 'Hematology', sampleType: 'Blood', container: 'EDTA (Purple)', fastingRequired: false, tatHours: 2, price: 450, tax: 5, referenceRange: '', category: 'Individual' },
    { id: 'T002', testCode: 'ESR', name: 'Erythrocyte Sedimentation Rate', department: 'Hematology', sampleType: 'Blood', container: 'EDTA (Purple)', fastingRequired: false, tatHours: 2, price: 200, tax: 5, category: 'Individual' },
    { id: 'T003', testCode: 'PT-INR', name: 'Prothrombin Time with INR', department: 'Hematology', sampleType: 'Blood', container: 'Citrate (Blue)', fastingRequired: false, tatHours: 3, price: 500, tax: 5, category: 'Individual' },
    { id: 'T004', testCode: 'APTT', name: 'Activated Partial Thromboplastin Time', department: 'Hematology', sampleType: 'Blood', container: 'Citrate (Blue)', fastingRequired: false, tatHours: 3, price: 550, tax: 5, category: 'Individual' },
    // Biochemistry
    { id: 'T005', testCode: 'FBS', name: 'Fasting Blood Sugar', department: 'Biochemistry', sampleType: 'Blood', container: 'Fluoride (Grey)', fastingRequired: true, tatHours: 2, price: 150, tax: 5, referenceRange: '70-100 mg/dL', criticalLow: 40, criticalHigh: 400, category: 'Individual' },
    { id: 'T006', testCode: 'PPBS', name: 'Post Prandial Blood Sugar', department: 'Biochemistry', sampleType: 'Blood', container: 'Fluoride (Grey)', fastingRequired: false, tatHours: 2, price: 150, tax: 5, referenceRange: '<140 mg/dL', criticalHigh: 400, category: 'Individual' },
    { id: 'T007', testCode: 'HBA1C', name: 'Glycated Hemoglobin (HbA1c)', department: 'Biochemistry', sampleType: 'Blood', container: 'EDTA (Purple)', fastingRequired: false, tatHours: 4, price: 600, tax: 5, referenceRange: '4.0-5.6%', category: 'Individual' },
    { id: 'T008', testCode: 'RBS', name: 'Random Blood Sugar', department: 'Biochemistry', sampleType: 'Blood', container: 'Fluoride (Grey)', fastingRequired: false, tatHours: 1, price: 120, tax: 5, referenceRange: '70-140 mg/dL', criticalHigh: 500, category: 'Individual' },
    { id: 'T009', testCode: 'CREATININE', name: 'Serum Creatinine', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 2, price: 250, tax: 5, referenceRange: '0.7-1.3 mg/dL', criticalHigh: 10, category: 'Individual' },
    { id: 'T010', testCode: 'UREA', name: 'Blood Urea', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 2, price: 200, tax: 5, referenceRange: '15-40 mg/dL', category: 'Individual' },
    { id: 'T011', testCode: 'URIC-ACID', name: 'Serum Uric Acid', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 2, price: 250, tax: 5, referenceRange: '3.5-7.2 mg/dL', category: 'Individual' },
    { id: 'T012', testCode: 'SGOT', name: 'SGOT (AST)', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 250, tax: 5, referenceRange: '8-40 U/L', category: 'Individual' },
    { id: 'T013', testCode: 'SGPT', name: 'SGPT (ALT)', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 250, tax: 5, referenceRange: '7-56 U/L', category: 'Individual' },
    { id: 'T014', testCode: 'ALP', name: 'Alkaline Phosphatase', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 250, tax: 5, referenceRange: '44-147 U/L', category: 'Individual' },
    { id: 'T015', testCode: 'BILIRUBIN-T', name: 'Bilirubin Total', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 200, tax: 5, referenceRange: '0.1-1.2 mg/dL', category: 'Individual' },
    { id: 'T016', testCode: 'TOTAL-PROTEIN', name: 'Total Protein', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 200, tax: 5, referenceRange: '6.0-8.3 g/dL', category: 'Individual' },
    { id: 'T017', testCode: 'ALBUMIN', name: 'Serum Albumin', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 200, tax: 5, referenceRange: '3.5-5.5 g/dL', category: 'Individual' },
    { id: 'T018', testCode: 'CHOLESTEROL-T', name: 'Total Cholesterol', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: true, tatHours: 3, price: 250, tax: 5, referenceRange: '<200 mg/dL', category: 'Individual' },
    { id: 'T019', testCode: 'TRIGLYCERIDES', name: 'Triglycerides', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: true, tatHours: 3, price: 300, tax: 5, referenceRange: '<150 mg/dL', category: 'Individual' },
    { id: 'T020', testCode: 'HDL', name: 'HDL Cholesterol', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: true, tatHours: 3, price: 300, tax: 5, referenceRange: '>40 mg/dL', category: 'Individual' },
    { id: 'T021', testCode: 'LDL', name: 'LDL Cholesterol', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: true, tatHours: 3, price: 300, tax: 5, referenceRange: '<100 mg/dL', category: 'Individual' },
    // Immunology
    { id: 'T022', testCode: 'TSH', name: 'Thyroid Stimulating Hormone', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 4, price: 400, tax: 5, referenceRange: '0.4-4.0 mIU/L', category: 'Individual' },
    { id: 'T023', testCode: 'T3', name: 'Triiodothyronine (T3)', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 4, price: 350, tax: 5, referenceRange: '80-200 ng/dL', category: 'Individual' },
    { id: 'T024', testCode: 'T4', name: 'Thyroxine (T4)', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 4, price: 350, tax: 5, referenceRange: '5.1-14.1 µg/dL', category: 'Individual' },
    { id: 'T025', testCode: 'VITAMIN-D', name: 'Vitamin D (25-OH)', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 24, price: 1200, tax: 5, referenceRange: '30-100 ng/mL', category: 'Individual' },
    { id: 'T026', testCode: 'VITAMIN-B12', name: 'Vitamin B12', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 24, price: 900, tax: 5, referenceRange: '200-900 pg/mL', category: 'Individual' },
    { id: 'T027', testCode: 'FERRITIN', name: 'Serum Ferritin', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 6, price: 600, tax: 5, referenceRange: '12-150 ng/mL', category: 'Individual' },
    { id: 'T028', testCode: 'CRP', name: 'C-Reactive Protein', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 4, price: 500, tax: 5, referenceRange: '<6 mg/L', category: 'Individual' },
    { id: 'T029', testCode: 'PSA', name: 'Prostate Specific Antigen', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 6, price: 800, tax: 5, referenceRange: '0-4 ng/mL', category: 'Individual' },
    // Clinical Pathology
    { id: 'T030', testCode: 'URINE-RE', name: 'Urine Routine Examination', department: 'Clinical Pathology', sampleType: 'Urine', container: 'Sterile Container', fastingRequired: false, tatHours: 2, price: 200, tax: 5, category: 'Individual' },
    { id: 'T031', testCode: 'STOOL-RE', name: 'Stool Routine Examination', department: 'Clinical Pathology', sampleType: 'Stool', container: 'Sterile Container', fastingRequired: false, tatHours: 3, price: 250, tax: 5, category: 'Individual' },
    // Microbiology
    { id: 'T032', testCode: 'URINE-CS', name: 'Urine Culture & Sensitivity', department: 'Microbiology', sampleType: 'Urine', container: 'Sterile Container', fastingRequired: false, tatHours: 72, price: 800, tax: 5, category: 'Individual' },
    { id: 'T033', testCode: 'BLOOD-CS', name: 'Blood Culture & Sensitivity', department: 'Microbiology', sampleType: 'Blood', container: 'Blood Culture Bottle', fastingRequired: false, tatHours: 72, price: 1200, tax: 5, category: 'Individual' },
    // Profiles
    { id: 'T034', testCode: 'LIPID-PROFILE', name: 'Lipid Profile', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: true, tatHours: 3, price: 800, tax: 5, category: 'Profile', includedTests: ['CHOLESTEROL-T', 'TRIGLYCERIDES', 'HDL', 'LDL'] },
    { id: 'T035', testCode: 'LIVER-PROFILE', name: 'Liver Function Test', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 900, tax: 5, category: 'Profile', includedTests: ['SGOT', 'SGPT', 'ALP', 'BILIRUBIN-T', 'TOTAL-PROTEIN', 'ALBUMIN'] },
    { id: 'T036', testCode: 'KIDNEY-PROFILE', name: 'Kidney Function Test', department: 'Biochemistry', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 3, price: 700, tax: 5, category: 'Profile', includedTests: ['CREATININE', 'UREA', 'URIC-ACID'] },
    { id: 'T037', testCode: 'THYROID-PROFILE', name: 'Thyroid Profile', department: 'Immunology', sampleType: 'Blood', container: 'Plain (Red)', fastingRequired: false, tatHours: 4, price: 900, tax: 5, category: 'Profile', includedTests: ['TSH', 'T3', 'T4'] },
    // Packages
    { id: 'T038', testCode: 'BASIC-PKG', name: 'Basic Health Checkup', department: 'Multi', sampleType: 'Blood + Urine', container: 'Multiple', fastingRequired: true, tatHours: 6, price: 1999, tax: 5, category: 'Package', includedTests: ['CBC', 'FBS', 'LIPID-PROFILE', 'LIVER-PROFILE', 'KIDNEY-PROFILE', 'TSH', 'URINE-RE'] },
    { id: 'T039', testCode: 'COMP-PKG', name: 'Comprehensive Health Checkup', department: 'Multi', sampleType: 'Blood + Urine', container: 'Multiple', fastingRequired: true, tatHours: 24, price: 3999, tax: 5, category: 'Package', includedTests: ['CBC', 'ESR', 'FBS', 'PPBS', 'HBA1C', 'LIPID-PROFILE', 'LIVER-PROFILE', 'KIDNEY-PROFILE', 'THYROID-PROFILE', 'VITAMIN-D', 'VITAMIN-B12', 'FERRITIN', 'CRP', 'URINE-RE'] },
    { id: 'T040', testCode: 'DIABETES-PKG', name: 'Diabetes Screening Package', department: 'Multi', sampleType: 'Blood + Urine', container: 'Multiple', fastingRequired: true, tatHours: 6, price: 2499, tax: 5, category: 'Package', includedTests: ['FBS', 'PPBS', 'HBA1C', 'LIPID-PROFILE', 'KIDNEY-PROFILE', 'LIVER-PROFILE', 'URINE-RE'] },
  ];
}

// ─── Generate Patients ───
export function generatePatients(): Patient[] {
  const patients: Patient[] = [];
  for (let i = 1; i <= 100; i++) {
    const gender: Gender = Math.random() > 0.45 ? 'Male' : 'Female';
    const firstName = gender === 'Male' ? randomFrom(maleFirstNames) : randomFrom(femaleFirstNames);
    const lastName = randomFrom(lastNames);
    const age = randomInt(2, 85);
    const year = new Date().getFullYear() - age;
    const dob = `${year}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`;

    patients.push({
      id: `P${String(i).padStart(5, '0')}`,
      patientId: padId(1000 + i, 'RASA-'),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      age,
      gender,
      dateOfBirth: dob,
      phone: generatePhone(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 99)}@email.com`,
      address: `${randomInt(1, 500)}, ${randomFrom(['MG Road', 'Gandhi Nagar', 'Nehru Colony', 'Station Road', 'Lake View Colony', 'Hill Top Colony', 'Shanti Nagar', 'Indira Nagar', 'Vasanth Nagar', 'Saroornagar', 'Tarnaka', 'Malkajgiri'])}`,
      city: randomFrom(cities),
      bloodGroup: randomFrom(bloodGroups),
      allergies: Math.random() > 0.7 ? [randomFrom(allergies.filter(a => a !== 'None'))] : ['None'],
      emergencyContact: `${randomFrom([...maleFirstNames, ...femaleFirstNames])} ${randomFrom(lastNames)}`,
      emergencyPhone: generatePhone(),
      preferredLanguage: randomFrom(['English', 'Telugu', 'Hindi']),
      branchId: randomFrom(['BR001', 'BR002', 'BR003', 'BR004', 'BR005']),
      createdAt: generateDate(365),
      insuranceProvider: Math.random() > 0.7 ? randomFrom(['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Max Bupa', 'New India Assurance']) : undefined,
      insuranceId: Math.random() > 0.7 ? `INS${randomInt(100000, 999999)}` : undefined,
      corporateId: Math.random() > 0.85 ? randomFrom(['CORP001', 'CORP002', 'CORP003']) : undefined,
    });
  }
  return patients;
}

// ─── Generate Doctors ───
export function generateDoctors(): Doctor[] {
  const doctors: Doctor[] = [];
  const drFirstNames = [...maleFirstNames.slice(0, 15), ...femaleFirstNames.slice(0, 15)];
  for (let i = 0; i < 30; i++) {
    const firstName = drFirstNames[i];
    const lastName = lastNames[i];
    doctors.push({
      id: `D${String(i + 1).padStart(4, '0')}`,
      doctorId: padId(5000 + i, 'DR-'),
      firstName,
      lastName,
      fullName: `Dr. ${firstName} ${lastName}`,
      specialization: specializations[i % specializations.length],
      qualification: randomFrom(['MBBS, MD', 'MBBS, MS', 'MBBS, DM', 'MBBS, DNB', 'MBBS, MD, DM']),
      phone: generatePhone(),
      email: `dr.${firstName.toLowerCase()}@${randomFrom(['gmail.com', 'hospital.com', 'doctors.in'])}`,
      hospital: randomFrom(hospitals),
      registrationNumber: `AP/MC/${randomInt(10000, 99999)}`,
      isActive: Math.random() > 0.1,
      totalReferrals: randomInt(5, 300),
      revenue: randomInt(50000, 1500000),
    });
  }
  return doctors;
}

// ─── Generate Orders ───
export function generateOrders(patients: Patient[], doctors: Doctor[], tests: TestCatalog[]): DiagnosticOrder[] {
  const orders: DiagnosticOrder[] = [];
  const statusWeights: OrderStatus[] = ['Booked', 'Confirmed', 'Collected', 'Received', 'Processing', 'Completed', 'Verified', 'Reported', 'Reported', 'Reported'];

  for (let i = 1; i <= 300; i++) {
    const patient = randomFrom(patients);
    const doctor = randomFrom(doctors);
    const numTests = randomInt(1, 5);
    const selectedTests = Array.from({ length: numTests }, () => randomFrom(tests));
    const total = selectedTests.reduce((s, t) => s + t.price, 0);
    const status = randomFrom(statusWeights);
    const created = generateDate(30);

    orders.push({
      id: `O${String(i).padStart(5, '0')}`,
      orderId: padId(10000 + i, 'ORD-'),
      patientId: patient.id,
      patientName: patient.fullName,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      branchId: patient.branchId,
      tests: selectedTests.map(t => t.id),
      testNames: selectedTests.map(t => t.name),
      status,
      priority: Math.random() > 0.85 ? 'Urgent' : Math.random() > 0.95 ? 'STAT' : 'Routine',
      totalAmount: total,
      paidAmount: status === 'Reported' ? total : Math.random() > 0.3 ? total : total * 0.5,
      createdAt: created,
      collectedAt: ['Collected', 'Received', 'Processing', 'Completed', 'Verified', 'Reported'].includes(status) ? created : undefined,
      reportedAt: status === 'Reported' ? created : undefined,
      verifiedAt: ['Verified', 'Reported'].includes(status) ? created : undefined,
    });
  }
  return orders;
}

// ─── Generate Samples ───
export function generateSamples(orders: DiagnosticOrder[], tests: TestCatalog[]): Sample[] {
  const samples: Sample[] = [];
  let sampleNum = 1;
  const collectors = ['Ramesh K.', 'Sunitha P.', 'Arun M.', 'Kavitha R.', 'Deepak S.'];
  const rejectionReasons = ['Hemolysed', 'Insufficient Quantity', 'Incorrect Container', 'Clotted', 'Improper Labeling', 'Delayed Transport', 'Contaminated'];

  for (const order of orders.slice(0, 200)) {
    for (const testId of order.tests) {
      const test = tests.find(t => t.id === testId);
      if (!test || test.category !== 'Individual') continue;

      const isRejected = Math.random() > 0.95;
      const statusMap: Record<OrderStatus, SampleStatus> = {
        'Draft': 'Pending', 'Booked': 'Pending', 'Confirmed': 'Pending',
        'Collected': 'Collected', 'Received': 'Received', 'Processing': 'Processing',
        'Completed': 'Completed', 'Verified': 'Completed', 'Reported': 'Completed', 'Cancelled': 'Pending',
      };

      samples.push({
        id: `S${String(sampleNum).padStart(6, '0')}`,
        sampleId: padId(sampleNum, 'SMP-'),
        barcode: `${order.branchId}${String(sampleNum).padStart(8, '0')}`,
        orderId: order.id,
        patientId: order.patientId,
        patientName: order.patientName,
        testName: test.name,
        sampleType: test.sampleType,
        container: test.container,
        status: isRejected ? 'Rejected' : statusMap[order.status] || 'Pending',
        collectedBy: randomFrom(collectors),
        collectedAt: order.collectedAt,
        receivedAt: order.collectedAt ? new Date(new Date(order.collectedAt).getTime() + 30 * 60000).toISOString() : undefined,
        rejectionReason: isRejected ? randomFrom(rejectionReasons) : undefined,
        branchId: order.branchId,
      });
      sampleNum++;
      if (sampleNum > 500) break;
    }
    if (sampleNum > 500) break;
  }
  return samples;
}

// ─── Generate Lab Results ───
export function generateLabResults(orders: DiagnosticOrder[], tests: TestCatalog[]): LabResult[] {
  const results: LabResult[] = [];
  const technicians = ['Srinivas T.', 'Meena K.', 'Raju P.', 'Anand V.', 'Saritha G.'];
  const pathologists = ['Dr. Padma Rao', 'Dr. Krishna Murthy', 'Dr. Savitri Devi', 'Dr. Harish Reddy'];
  let idx = 0;

  for (const order of orders) {
    if (!['Completed', 'Verified', 'Reported', 'Processing'].includes(order.status)) continue;

    for (const testId of order.tests) {
      const test = tests.find(t => t.id === testId);
      if (!test || test.category !== 'Individual') continue;

      const isAbnormal = Math.random() > 0.75;
      const isCritical = isAbnormal && Math.random() > 0.85;

      let value = '';
      let unit = '';
      let refRange = test.referenceRange || 'N/A';

      if (test.testCode === 'CBC') {
        value = String(randomInt(isAbnormal ? 3 : 11, isAbnormal ? 10 : 17).toFixed(1));
        unit = 'g/dL';
        refRange = '12.0-17.5 g/dL';
      } else if (test.testCode === 'FBS') {
        value = String(isAbnormal ? randomInt(110, isCritical ? 450 : 180) : randomInt(72, 99));
        unit = 'mg/dL';
      } else if (test.testCode === 'HBA1C') {
        value = (isAbnormal ? randomInt(65, 110) / 10 : randomInt(40, 56) / 10).toFixed(1);
        unit = '%';
      } else if (test.testCode === 'TSH') {
        value = (isAbnormal ? randomInt(50, 150) / 10 : randomInt(5, 38) / 10).toFixed(2);
        unit = 'mIU/L';
      } else if (test.testCode === 'CREATININE') {
        value = (isAbnormal ? randomInt(15, isCritical ? 80 : 30) / 10 : randomInt(7, 12) / 10).toFixed(1);
        unit = 'mg/dL';
      } else {
        value = String(randomInt(10, 200));
        unit = 'U/L';
      }

      const statusMap: Record<string, LabResult['status']> = {
        'Processing': 'Entered', 'Completed': 'Validated', 'Verified': 'Verified', 'Reported': 'Verified',
      };

      results.push({
        id: `LR${String(++idx).padStart(5, '0')}`,
        orderId: order.id,
        patientId: order.patientId,
        patientName: order.patientName,
        testName: test.name,
        department: test.department,
        value,
        unit,
        referenceRange: refRange,
        isAbnormal,
        isCritical,
        status: statusMap[order.status] || 'Pending',
        enteredBy: randomFrom(technicians),
        verifiedBy: ['Verified', 'Reported'].includes(order.status) ? randomFrom(pathologists) : undefined,
        enteredAt: order.createdAt,
        verifiedAt: order.verifiedAt,
      });

      if (idx >= 300) break;
    }
    if (idx >= 300) break;
  }
  return results;
}

// ─── Generate Appointments ───
export function generateAppointments(patients: Patient[]): Appointment[] {
  const appointments: Appointment[] = [];
  const types = ['Blood Test', 'Health Package', 'MRI', 'CT Scan', 'Ultrasound', 'X-Ray', 'Mammography', 'ECG', 'Echo'];
  const times = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  const statuses: AppointmentStatus[] = ['Scheduled', 'Confirmed', 'Checked In', 'In Progress', 'Completed', 'Completed', 'Completed', 'Cancelled', 'No Show'];

  for (let i = 1; i <= 200; i++) {
    const patient = randomFrom(patients);
    const type = randomFrom(types);
    const isImaging = ['MRI', 'CT Scan', 'Ultrasound', 'X-Ray', 'Mammography', 'ECG', 'Echo'].includes(type);

    appointments.push({
      id: `APT${String(i).padStart(5, '0')}`,
      appointmentId: padId(20000 + i, 'APT-'),
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      type,
      date: i <= 50 ? new Date().toISOString().split('T')[0] : new Date(Date.now() + randomInt(-7, 14) * 86400000).toISOString().split('T')[0],
      time: randomFrom(times),
      duration: isImaging ? randomInt(30, 60) : randomInt(10, 20),
      status: i <= 50 ? randomFrom(['Scheduled', 'Confirmed', 'Checked In', 'In Progress']) : randomFrom(statuses),
      branchId: patient.branchId,
      modality: isImaging ? type : undefined,
      doctorName: isImaging ? `Dr. ${randomFrom(maleFirstNames)} ${randomFrom(lastNames)}` : undefined,
    });
  }
  return appointments;
}

// ─── Generate Reports ───
export function generateReports(orders: DiagnosticOrder[]): Report[] {
  const reports: Report[] = [];
  const pathologists = ['Dr. Padma Rao', 'Dr. Krishna Murthy', 'Dr. Savitri Devi', 'Dr. Harish Reddy'];
  let idx = 0;

  for (const order of orders) {
    if (!['Completed', 'Verified', 'Reported'].includes(order.status)) continue;

    const reportStatus: ReportStatus = order.status === 'Completed' ? 'Generated' : order.status === 'Verified' ? 'Verified' : randomFrom(['Sent', 'Delivered', 'Viewed']);

    reports.push({
      id: `RPT${String(++idx).padStart(5, '0')}`,
      reportId: padId(30000 + idx, 'RPT-'),
      orderId: order.id,
      patientId: order.patientId,
      patientName: order.patientName,
      testNames: order.testNames,
      status: reportStatus,
      generatedAt: order.createdAt,
      verifiedAt: order.verifiedAt,
      verifiedBy: randomFrom(pathologists),
      sentAt: ['Sent', 'Delivered', 'Viewed'].includes(reportStatus) ? order.createdAt : undefined,
      deliveryMethod: randomFrom(['WhatsApp', 'Email', 'Portal', 'SMS']),
    });

    if (idx >= 100) break;
  }
  return reports;
}

// ─── Generate Home Collections ───
export function generateHomeCollections(patients: Patient[]): HomeCollection[] {
  const collections: HomeCollection[] = [];
  const collectors = ['Pavan Kumar', 'Deepak Reddy', 'Arun Prasad', 'Manoj Singh', 'Kiran Yadav'];
  const testSets = [['CBC', 'FBS'], ['Lipid Profile', 'Thyroid Profile'], ['Complete Health Checkup'], ['HbA1c', 'FBS', 'PPBS'], ['Vitamin D', 'Vitamin B12']];
  const statuses: HomeCollection['status'][] = ['Booked', 'Assigned', 'En Route', 'Arrived', 'Collected', 'In Transit', 'Delivered', 'Delivered', 'Delivered'];
  const slots = ['07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'];

  for (let i = 1; i <= 50; i++) {
    const patient = randomFrom(patients);
    collections.push({
      id: `HC${String(i).padStart(4, '0')}`,
      bookingId: padId(40000 + i, 'HC-'),
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      address: `${patient.address}, ${patient.city}`,
      date: i <= 15 ? new Date().toISOString().split('T')[0] : new Date(Date.now() + randomInt(-3, 5) * 86400000).toISOString().split('T')[0],
      timeSlot: randomFrom(slots),
      collector: randomFrom(collectors),
      status: randomFrom(statuses),
      tests: randomFrom(testSets),
      amount: randomInt(500, 5000),
    });
  }
  return collections;
}

// ─── Generate Imaging Studies ───
export function generateImagingStudies(patients: Patient[]): ImagingStudy[] {
  const studies: ImagingStudy[] = [];
  const modalities = ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography', 'DEXA', 'ECG', 'Echo'];
  const bodyParts = ['Chest', 'Abdomen', 'Brain', 'Spine - Lumbar', 'Spine - Cervical', 'Knee', 'Shoulder', 'Pelvis', 'Whole Body', 'Head', 'Liver', 'Kidney'];
  const radiologists = ['Dr. Suresh Iyer', 'Dr. Meena Nair', 'Dr. Ravi Hegde', 'Dr. Anjali Desai'];
  const technicians = ['Naveen P.', 'Swathi R.', 'Kiran T.', 'Divya M.'];
  const machines = ['Siemens Magnetom', 'GE Revolution CT', 'Philips Ingenia MRI', 'Samsung HS60 Ultrasound', 'Fujifilm FDR Go', 'GE Optima XR240'];
  const statuses: ImagingStudy['status'][] = ['Scheduled', 'Checked In', 'In Progress', 'Completed', 'Reporting', 'Verified', 'Published', 'Published', 'Published'];

  for (let i = 1; i <= 100; i++) {
    const patient = randomFrom(patients);
    const modality = randomFrom(modalities);
    const status = randomFrom(statuses);

    studies.push({
      id: `IMG${String(i).padStart(5, '0')}`,
      studyId: padId(50000 + i, 'STD-'),
      patientId: patient.id,
      patientName: patient.fullName,
      modality,
      bodyPart: randomFrom(bodyParts),
      status,
      radiologist: ['Reporting', 'Verified', 'Published'].includes(status) ? randomFrom(radiologists) : undefined,
      technician: randomFrom(technicians),
      machine: randomFrom(machines),
      scheduledAt: i <= 25 ? generateTodayTime() : generateDate(14),
      completedAt: ['Completed', 'Reporting', 'Verified', 'Published'].includes(status) ? generateDate(7) : undefined,
      findings: ['Verified', 'Published'].includes(status) ? 'No significant abnormality detected. Normal study.' : undefined,
      impression: ['Verified', 'Published'].includes(status) ? 'Normal study. No acute findings.' : undefined,
    });
  }
  return studies;
}

// ─── Generate Invoices ───
export function generateInvoices(orders: DiagnosticOrder[]): Invoice[] {
  const invoices: Invoice[] = [];
  const methods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online'];

  for (let i = 0; i < Math.min(50, orders.length); i++) {
    const order = orders[i];
    const discount = Math.random() > 0.7 ? order.totalAmount * 0.1 : 0;
    const tax = (order.totalAmount - discount) * 0.05;
    const total = order.totalAmount - discount + tax;
    const paid = order.paidAmount;
    const balance = total - paid;

    invoices.push({
      id: `INV${String(i + 1).padStart(5, '0')}`,
      invoiceId: padId(60000 + i, 'INV-'),
      patientId: order.patientId,
      patientName: order.patientName,
      orderId: order.id,
      amount: order.totalAmount,
      discount,
      tax,
      total,
      paid,
      balance,
      paymentMethod: randomFrom(methods),
      status: balance <= 0 ? 'Paid' : balance < total ? 'Partial' : 'Pending',
      createdAt: order.createdAt,
    });
  }
  return invoices;
}

// ─── Generate Notifications ───
export function generateNotifications(): Notification[] {
  return [
    { id: 'N001', type: 'critical', title: 'Critical Result — Blood Sugar', message: 'Patient Lakshmi Reddy (RASA-001045) has FBS of 450 mg/dL. Immediate attention required.', timestamp: new Date().toISOString(), read: false, relatedId: 'O00012' },
    { id: 'N002', type: 'critical', title: 'Critical Result — Creatinine', message: 'Patient Rajesh Kumar (RASA-001023) has Creatinine of 8.5 mg/dL. Contact referring physician immediately.', timestamp: new Date(Date.now() - 300000).toISOString(), read: false, relatedId: 'O00034' },
    { id: 'N003', type: 'important', title: '12 Reports Exceeded TAT', message: '12 reports have breached their target turnaround time. Review pending verifications.', timestamp: new Date(Date.now() - 600000).toISOString(), read: false },
    { id: 'N004', type: 'important', title: 'Analyzer Maintenance Due', message: 'Siemens Advia 2400 at Banjara Hills branch requires scheduled maintenance tomorrow.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
    { id: 'N005', type: 'important', title: 'Low Stock Alert', message: 'EDTA tubes (Purple) stock is below minimum level at Madhapur branch. Current: 45, Min: 100.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
    { id: 'N006', type: 'reminder', title: 'Pending Verifications', message: '8 lab results are awaiting pathologist verification.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
    { id: 'N007', type: 'reminder', title: 'Home Collection Delayed', message: 'Phlebotomist Pavan Kumar has 2 delayed collections in LB Nagar area.', timestamp: new Date(Date.now() - 5400000).toISOString(), read: false },
    { id: 'N008', type: 'info', title: 'Daily QC Completed', message: 'Internal QC for Hematology department completed successfully. All controls within range.', timestamp: new Date(Date.now() - 10800000).toISOString(), read: true },
    { id: 'N009', type: 'info', title: 'New Corporate Client', message: 'TechCorp Solutions has been registered as a corporate client with 200 employee cap.', timestamp: new Date(Date.now() - 14400000).toISOString(), read: true },
    { id: 'N010', type: 'important', title: 'Sample Rejection Rate High', message: 'Sample rejection rate at Kukatpally branch is 8.2% this week, above the 5% threshold.', timestamp: new Date(Date.now() - 18000000).toISOString(), read: false },
  ];
}

// ─── Generate Tasks ───
export function generateTasks(): Task[] {
  return [
    { id: 'TK001', title: 'Verify pending CBC results', description: 'Review and verify 5 pending CBC results from morning batch', assignee: 'Dr. Padma Rao', priority: 'High', status: 'Pending', dueDate: new Date().toISOString(), relatedOrder: 'O00045', category: 'Verification' },
    { id: 'TK002', title: 'Calibrate Hematology Analyzer', description: 'Perform daily calibration for Sysmex XN-1000', assignee: 'Srinivas T.', priority: 'High', status: 'In Progress', dueDate: new Date().toISOString(), category: 'Quality' },
    { id: 'TK003', title: 'Contact Dr. Suresh for critical result', description: 'Inform Dr. Suresh about critical creatinine value for patient RASA-001023', assignee: 'Kavitha R.', priority: 'High', status: 'Pending', dueDate: new Date().toISOString(), relatedPatient: 'P00023', category: 'Critical Alert' },
    { id: 'TK004', title: 'Restock EDTA tubes', description: 'Place purchase order for EDTA tubes at Madhapur branch', assignee: 'Mohan K.', priority: 'Medium', status: 'Pending', dueDate: new Date(Date.now() + 86400000).toISOString(), category: 'Inventory' },
    { id: 'TK005', title: 'Monthly QC report', description: 'Compile and submit monthly quality control report for all departments', assignee: 'Dr. Krishna Murthy', priority: 'Medium', status: 'In Progress', dueDate: new Date(Date.now() + 172800000).toISOString(), category: 'Quality' },
    { id: 'TK006', title: 'Update reference ranges', description: 'Update reference ranges for pediatric patients in Thyroid Profile', assignee: 'Dr. Savitri Devi', priority: 'Low', status: 'Pending', dueDate: new Date(Date.now() + 604800000).toISOString(), category: 'Configuration' },
    { id: 'TK007', title: 'Home collection route optimization', description: 'Review and optimize tomorrow\'s home collection routes for LB Nagar area', assignee: 'Pavan Kumar', priority: 'Medium', status: 'Pending', dueDate: new Date(Date.now() + 86400000).toISOString(), category: 'Operations' },
    { id: 'TK008', title: 'Train new receptionist', description: 'Complete training for new receptionist on patient registration workflow', assignee: 'Priya Sharma', priority: 'Low', status: 'In Progress', dueDate: new Date(Date.now() + 432000000).toISOString(), category: 'Training' },
  ];
}

// ─── Generate Inventory ───
export function generateInventory(): InventoryItem[] {
  return [
    { id: 'INV001', name: 'EDTA Tubes (Purple Top)', category: 'Tubes', currentStock: 450, minStock: 200, unit: 'pieces', batchNumber: 'BT-2024-001', expiryDate: '2025-06-30', supplier: 'BD India', lastPurchasePrice: 12, status: 'In Stock' },
    { id: 'INV002', name: 'Plain Tubes (Red Top)', category: 'Tubes', currentStock: 380, minStock: 200, unit: 'pieces', batchNumber: 'BT-2024-002', expiryDate: '2025-08-15', supplier: 'BD India', lastPurchasePrice: 10, status: 'In Stock' },
    { id: 'INV003', name: 'Fluoride Tubes (Grey Top)', category: 'Tubes', currentStock: 45, minStock: 100, unit: 'pieces', batchNumber: 'BT-2024-003', expiryDate: '2025-04-30', supplier: 'BD India', lastPurchasePrice: 11, status: 'Low Stock' },
    { id: 'INV004', name: 'Citrate Tubes (Blue Top)', category: 'Tubes', currentStock: 210, minStock: 100, unit: 'pieces', batchNumber: 'BT-2024-004', expiryDate: '2025-07-20', supplier: 'BD India', lastPurchasePrice: 14, status: 'In Stock' },
    { id: 'INV005', name: 'CBC Reagent Pack', category: 'Reagents', currentStock: 8, minStock: 5, unit: 'packs', batchNumber: 'RG-2024-010', expiryDate: '2025-03-15', supplier: 'Sysmex India', lastPurchasePrice: 15000, status: 'Expiring Soon' },
    { id: 'INV006', name: 'Biochemistry Reagent Kit', category: 'Reagents', currentStock: 12, minStock: 3, unit: 'kits', batchNumber: 'RG-2024-020', expiryDate: '2025-09-30', supplier: 'Siemens Healthineers', lastPurchasePrice: 25000, status: 'In Stock' },
    { id: 'INV007', name: 'TSH ELISA Kit', category: 'Reagents', currentStock: 2, minStock: 3, unit: 'kits', batchNumber: 'RG-2024-030', expiryDate: '2025-05-30', supplier: 'Abbott India', lastPurchasePrice: 18000, status: 'Low Stock' },
    { id: 'INV008', name: 'Disposable Gloves (M)', category: 'PPE', currentStock: 2000, minStock: 500, unit: 'pieces', batchNumber: 'PP-2024-001', expiryDate: '2026-12-31', supplier: 'Medline India', lastPurchasePrice: 3, status: 'In Stock' },
    { id: 'INV009', name: 'Alcohol Swabs', category: 'Consumables', currentStock: 1500, minStock: 500, unit: 'pieces', batchNumber: 'CS-2024-001', expiryDate: '2026-06-30', supplier: 'Medline India', lastPurchasePrice: 2, status: 'In Stock' },
    { id: 'INV010', name: 'Syringes 5ml', category: 'Consumables', currentStock: 0, minStock: 200, unit: 'pieces', batchNumber: 'CS-2024-010', expiryDate: '2026-03-31', supplier: 'Hindustan Syringes', lastPurchasePrice: 5, status: 'Out of Stock' },
    { id: 'INV011', name: 'Report Printing Paper A4', category: 'Printing', currentStock: 15, minStock: 10, unit: 'reams', batchNumber: 'PR-2024-001', expiryDate: '2027-12-31', supplier: 'JK Paper', lastPurchasePrice: 350, status: 'In Stock' },
    { id: 'INV012', name: 'Barcode Labels Roll', category: 'Printing', currentStock: 22, minStock: 10, unit: 'rolls', batchNumber: 'PR-2024-002', expiryDate: '2027-06-30', supplier: 'Zebra India', lastPurchasePrice: 800, status: 'In Stock' },
  ];
}

// ─── Generate Equipment ───
export function generateEquipment(): Equipment[] {
  return [
    { id: 'EQ001', name: 'Sysmex XN-1000', type: 'Hematology Analyzer', manufacturer: 'Sysmex', model: 'XN-1000', serialNumber: 'SN-XN-2023-001', department: 'Hematology', status: 'Operational', lastCalibration: '2024-09-15', nextCalibration: '2024-10-15', nextMaintenance: '2024-12-15', branchId: 'BR001' },
    { id: 'EQ002', name: 'Siemens Advia 2400', type: 'Chemistry Analyzer', manufacturer: 'Siemens', model: 'Advia 2400', serialNumber: 'SN-SA-2023-001', department: 'Biochemistry', status: 'Maintenance', lastCalibration: '2024-09-10', nextCalibration: '2024-10-10', nextMaintenance: '2024-09-25', branchId: 'BR001' },
    { id: 'EQ003', name: 'Abbott Architect i2000', type: 'Immunoassay Analyzer', manufacturer: 'Abbott', model: 'Architect i2000', serialNumber: 'SN-AA-2023-001', department: 'Immunology', status: 'Operational', lastCalibration: '2024-09-12', nextCalibration: '2024-10-12', nextMaintenance: '2025-01-12', branchId: 'BR001' },
    { id: 'EQ004', name: 'GE Revolution CT', type: 'CT Scanner', manufacturer: 'GE Healthcare', model: 'Revolution CT', serialNumber: 'SN-GE-CT-2022', department: 'Radiology', status: 'Operational', lastCalibration: '2024-08-20', nextCalibration: '2024-11-20', nextMaintenance: '2025-02-20', branchId: 'BR001' },
    { id: 'EQ005', name: 'Philips Ingenia 3T MRI', type: 'MRI Scanner', manufacturer: 'Philips', model: 'Ingenia 3T', serialNumber: 'SN-PH-MRI-2022', department: 'Radiology', status: 'Operational', lastCalibration: '2024-09-01', nextCalibration: '2024-12-01', nextMaintenance: '2025-03-01', branchId: 'BR001' },
    { id: 'EQ006', name: 'Samsung HS60 Ultrasound', type: 'Ultrasound Machine', manufacturer: 'Samsung', model: 'HS60', serialNumber: 'SN-SS-US-2023', department: 'Radiology', status: 'Operational', lastCalibration: '2024-09-05', nextCalibration: '2024-12-05', nextMaintenance: '2025-03-05', branchId: 'BR002' },
    { id: 'EQ007', name: 'Fujifilm FDR Go Portable X-Ray', type: 'X-Ray Machine', manufacturer: 'Fujifilm', model: 'FDR Go', serialNumber: 'SN-FF-XR-2023', department: 'Radiology', status: 'Calibration Due', lastCalibration: '2024-06-01', nextCalibration: '2024-09-01', nextMaintenance: '2024-12-01', branchId: 'BR002' },
    { id: 'EQ008', name: 'Beckman Coulter DxC 700', type: 'Chemistry Analyzer', manufacturer: 'Beckman Coulter', model: 'DxC 700', serialNumber: 'SN-BC-2023-001', department: 'Biochemistry', status: 'Operational', lastCalibration: '2024-09-14', nextCalibration: '2024-10-14', nextMaintenance: '2025-01-14', branchId: 'BR003' },
  ];
}

// ─── Master Data Store ───
export interface DemoData {
  branches: Branch[];
  patients: Patient[];
  doctors: Doctor[];
  testCatalog: TestCatalog[];
  orders: DiagnosticOrder[];
  samples: Sample[];
  labResults: LabResult[];
  appointments: Appointment[];
  reports: Report[];
  homeCollections: HomeCollection[];
  imagingStudies: ImagingStudy[];
  invoices: Invoice[];
  notifications: Notification[];
  tasks: Task[];
  inventory: InventoryItem[];
  equipment: Equipment[];
}

let _demoData: DemoData | null = null;

export function getDemoData(): DemoData {
  if (_demoData) return _demoData;

  const branches = generateBranches();
  const patients = generatePatients();
  const doctors = generateDoctors();
  const testCatalog = generateTestCatalog();
  const orders = generateOrders(patients, doctors, testCatalog);
  const samples = generateSamples(orders, testCatalog);
  const labResults = generateLabResults(orders, testCatalog);
  const appointments = generateAppointments(patients);
  const reports = generateReports(orders);
  const homeCollections = generateHomeCollections(patients);
  const imagingStudies = generateImagingStudies(patients);
  const invoices = generateInvoices(orders);
  const notifications = generateNotifications();
  const tasks = generateTasks();
  const inventory = generateInventory();
  const equipment = generateEquipment();

  _demoData = {
    branches, patients, doctors, testCatalog, orders, samples,
    labResults, appointments, reports, homeCollections, imagingStudies,
    invoices, notifications, tasks, inventory, equipment,
  };

  return _demoData;
}
