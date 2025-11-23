import { User, UserRole, Specialty, Case, CaseStatus, Translation } from './types';

export const APP_NAME = "2nd Opinion";
export const CASE_FEE = 40.00;
export const DOCTOR_PAYOUT = 28.00;
export const PLATFORM_FEE = 12.00;

// Mock Data Seeding
export const MOCK_USERS: User[] = [
  {
    id: 'p1',
    name: 'Ahmed Al-Sayed',
    email: 'ahmed@example.com',
    role: UserRole.PATIENT,
    walletBalance: 100.00,
    avatarUrl: 'https://picsum.photos/id/1005/200/200'
  },
  {
    id: 'd1',
    name: 'Dr. Sarah Smith',
    email: 'sarah@clinic.com',
    role: UserRole.DOCTOR,
    walletBalance: 560.00,
    specialty: Specialty.CARDIOLOGY,
    hospital: 'Mayo Clinic',
    country: 'USA',
    rating: 4.8,
    casesClosed: 42,
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    linkedin: 'https://www.linkedin.com/'
  },
  {
    id: 'd2',
    name: 'Dr. Karim Nader',
    email: 'karim@hospital.ae',
    role: UserRole.DOCTOR,
    walletBalance: 1200.00,
    specialty: Specialty.DERMATOLOGY,
    hospital: 'Cleveland Clinic Abu Dhabi',
    country: 'UAE',
    rating: 4.9,
    casesClosed: 89,
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    linkedin: 'https://www.linkedin.com/'
  },
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@2ndopinion.com',
    role: UserRole.ADMIN,
    walletBalance: 5000.00, // Platform revenue wallet
    avatarUrl: 'https://picsum.photos/id/1025/200/200'
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: 'c101',
    patientId: 'p1',
    patientName: 'Ahmed Al-Sayed',
    specialty: Specialty.DERMATOLOGY,
    status: CaseStatus.CLOSED,
    symptoms: 'Recurring rash on left arm, itchy during night.',
    files: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    assignedDoctorId: 'd2',
    opinion: {
      doctorId: 'd2',
      doctorName: 'Dr. Karim Nader',
      decision: 'Agree',
      notes: 'Standard eczema. Prescribed hydrocortisone.',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    patientRating: 5
  }
];

export const TRANSLATIONS: Translation = {
  "app.title": { en: "2nd Opinion", ar: "الرأي الثاني" },
  "nav.login": { en: "Login", ar: "تسجيل الدخول" },
  "nav.logout": { en: "Logout", ar: "تسجيل الخروج" },
  "hero.title": { en: "Get a Second Opinion from Top Doctors", ar: "احصل على رأي طبي ثانٍ من أفضل الأطباء" },
  "hero.subtitle": { en: "Secure, fast, and reliable medical validation.", ar: "آمن، سريع، وموثوق للتحقق الطبي." },
  "role.patient": { en: "Patient", ar: "مريض" },
  "role.doctor": { en: "Doctor", ar: "طبيب" },
  "role.admin": { en: "Admin", ar: "مسؤول" },
  "wallet.balance": { en: "Wallet Balance", ar: "رصيد المحفظة" },
  "btn.newCase": { en: "New Case", ar: "حالة جديدة" },
  "status.open": { en: "Open", ar: "مفتوحة" },
  "status.closed": { en: "Closed", ar: "مغلقة" },
  "label.symptoms": { en: "Describe Symptoms", ar: "وصف الأعراض" },
  "label.specialty": { en: "Specialty", ar: "التخصص" },
  "ai.analyze": { en: "AI Analyze", ar: "تحليل الذكاء الاصطناعي" },
  "ai.refine": { en: "AI Refine", ar: "تحسين النص" },
};