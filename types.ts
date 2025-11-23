
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum Specialty {
  CARDIOLOGY = 'Cardiology',
  DERMATOLOGY = 'Dermatology',
  NEUROLOGY = 'Neurology',
  ORTHOPEDICS = 'Orthopedics',
  PEDIATRICS = 'Pediatrics',
  GENERAL = 'General Practice'
}

export enum CaseStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  PENDING_INFO = 'Pending Info',
  CLOSED = 'Closed'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In real app, this is hashed. Plaintext for demo.
  role: UserRole;
  walletBalance: number;
  avatarUrl?: string;
  isApproved: boolean; // For Doctors needing admin approval
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
  url: string; // In a real app, this would be a blob URL or S3 link
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
  assignedDoctorId?: string; // If null, it's in the general pool
  opinion?: Opinion;
  patientRating?: number;
  patientFeedback?: string;
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