
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum Specialty {
  // Core / Existing
  GENERAL = 'General Practice',
  CARDIOLOGY = 'Cardiology',
  DERMATOLOGY = 'Dermatology',
  NEUROLOGY = 'Neurology',
  ORTHOPEDICS = 'Orthopedics',
  PEDIATRICS = 'Pediatrics',
  
  // New Additions
  RHEUMATOLOGY = 'Rheumatology',
  GASTROENTEROLOGY = 'Gastroenterology',
  ALLERGY_IMMUNOLOGY = 'Allergy & Immunology',
  PLASTIC_SURGERY = 'Plastic & Reconstructive Surgery',
  SPORTS_MEDICINE = 'Sports Medicine',
  GERIATRICS = 'Geriatrics',
  OCCUPATIONAL = 'Occupational Medicine',
  RADIOLOGY = 'Radiology',
  PATHOLOGY = 'Pathology',
  PALLIATIVE = 'Palliative Care',
  GENETIC = 'Genetic Medicine',
  SEXUAL_HEALTH = 'Sexual Health',
  SLEEP = 'Sleep Medicine',
  PAIN_MGMT = 'Pain Management',
  DERMATO_COSMETOLOGY = 'Dermato-Cosmetology'
}

export enum CaseStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  PENDING_INFO = 'Pending Info',
  CLOSED = 'Closed'
}

export interface User {
  id: string; // Can be UUID (Supabase) or simple string (Mock)
  name: string;
  email: string;
  password?: string; // Optional: Only used for Mock mode or during initial registration object
  role: UserRole;
  walletBalance: number;
  avatarUrl?: string;
  isApproved: boolean;
  createdAt: string;
  // Doctor specific
  specialty?: Specialty;
  hospital?: string;
  country?: string;
  rating?: number;
  casesClosed?: number;
  linkedin?: string;
  bio?: string;
  bonusPoints?: number;
}

export interface CaseFile {
  name: string;
  type: string;
  url: string;
}

export interface Opinion {
  doctorId: string;
  doctorName: string;
  decision: 'Agree' | 'Disagree' | 'MoreTests';
  notes: string;
  createdAt: string;
}

export interface Case {
  id: string;
  patientId: string;
  patientName: string;
  specialty: Specialty;
  status: CaseStatus;
  symptoms: string;
  files: CaseFile[];
  createdAt: string;
  assignedDoctorId?: string;
  opinion?: Opinion;
  patientRating?: number;
  patientFeedback?: string;
  isRare?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DEPOSIT' | 'CASE_FEE' | 'PAYOUT' | 'COMMISSION';
  timestamp: string;
  description: string;
}

export type Language = 'en' | 'ar';

export interface Translation {
  [key: string]: {
    en: string;
    ar: string;
  }
}
