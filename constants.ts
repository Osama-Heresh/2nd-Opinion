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
    linkedin: 'https://www.linkedin.com/',
    bonusPoints: 120
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
    linkedin: 'https://www.linkedin.com/',
    bonusPoints: 350
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
  // General App
  "app.title": { en: "2nd Opinion", ar: "الرأي الثاني" },
  "nav.login": { en: "Login", ar: "دخول" },
  "nav.logout": { en: "Logout", ar: "خروج" },
  "nav.howItWorks": { en: "How it Works", ar: "كيف يعمل" },
  "nav.specialists": { en: "Specialists", ar: "الأطباء" },
  "nav.reviews": { en: "Reviews", ar: "التقييمات" },
  "nav.getStarted": { en: "Get Started", ar: "ابدأ الآن" },
  
  // Footer
  "footer.desc": { en: "Connecting patients with world-class specialists for reliable second medical opinions, powered by AI and secure technology.", ar: "ربط المرضى بأطباء عالميين للحصول على رأي طبي ثانٍ موثوق، بدعم من الذكاء الاصطناعي وتقنيات آمنة." },
  "footer.platform": { en: "Platform", ar: "المنصة" },
  "footer.legal": { en: "Legal & Support", ar: "القانونية والدعم" },
  "footer.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  "footer.madeWith": { en: "Made with", ar: "صنع بـ" },
  "footer.forHealth": { en: "for better healthcare.", ar: "من أجل رعاية صحية أفضل." },
  "link.findDoctor": { en: "Find a Doctor", ar: "ابحث عن طبيب" },
  "link.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "link.terms": { en: "Terms of Service", ar: "شروط الخدمة" },
  "link.hipaa": { en: "HIPAA Compliance", ar: "الامتثال لقانون HIPAA" },
  "link.help": { en: "Help Center", ar: "مركز المساعدة" },

  // Hero & Landing
  "hero.title": { en: "Get a Second Opinion from Top Doctors", ar: "احصل على رأي طبي ثانٍ من أفضل الأطباء" },
  "hero.subtitle": { en: "Secure, fast, and reliable medical validation.", ar: "تحقق طبي آمن، سريع، وموثوق." },
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

  // HIPAA Page
  "hipaa.badge": { en: "Security First Platform", ar: "منصة الأمان أولاً" },
  "hipaa.title": { en: "HIPAA Compliance & Data Security", ar: "الامتثال لـ HIPAA وأمن البيانات" },
  "hipaa.heroDesc": { en: "We adhere to the strictest standards of the Health Insurance Portability and Accountability Act (HIPAA) to ensure your sensitive medical information remains private, secure, and accessible only to authorized specialists.", ar: "نلتزم بأشد معايير قانون نقل التأمين الصحي والمساءلة (HIPAA) لضمان بقاء معلوماتك الطبية الحساسة خاصة وآمنة ومتاحة فقط للمتخصصين المصرح لهم." },
  "hipaa.encryption": { en: "Encryption", ar: "التشفير" },
  "hipaa.atRest": { en: "AES-256 (At Rest)", ar: "AES-256 (عند التخزين)" },
  "hipaa.transmission": { en: "Transmission", ar: "النقل" },
  "hipaa.inTransit": { en: "TLS 1.3 (In Transit)", ar: "TLS 1.3 (أثناء النقل)" },
  "hipaa.access": { en: "Access Control", ar: "التحكم في الوصول" },
  "hipaa.rbac": { en: "Role-Based (RBAC)", ar: "بناءً على الأدوار" },
  "hipaa.pillarsTitle": { en: "How We Protect Your Health Data", ar: "كيف نحمي بياناتك الصحية" },
  "hipaa.pillarsDesc": { en: "Our multi-layered security approach ensures compliance at every step.", ar: "نهجنا الأمني متعدد الطبقات يضمن الامتثال في كل خطوة." },
  "hipaa.e2eTitle": { en: "End-to-End Encryption", ar: "تشفير شامل" },
  "hipaa.e2eDesc": { en: "All patient records, medical images (DICOM), and chat logs are encrypted using military-grade AES-256 standards when stored in our databases.", ar: "يتم تشفير جميع سجلات المرضى والصور الطبية (DICOM) وسجلات المحادثات باستخدام معايير AES-256 العسكرية عند تخزينها." },
  "hipaa.auditTitle": { en: "Audit Trails & Monitoring", ar: "مسارات التدقيق والمراقبة" },
  "hipaa.auditDesc": { en: "Every interaction with Personal Health Information (PHI) is logged. We maintain detailed audit trails tracking who accessed data and when.", ar: "يتم تسجيل كل تفاعل مع المعلومات الصحية الشخصية (PHI). نحتفظ بمسارات تدقيق مفصلة تتبع من وصل للبيانات ومتى." },
  "hipaa.infraTitle": { en: "Secure Infrastructure", ar: "بنية تحتية آمنة" },
  "hipaa.infraDesc": { en: "Our servers are hosted in SOC 2 Type II certified data centers with strict physical security measures.", ar: "تتم استضافة خوادمنا في مراكز بيانات معتمدة SOC 2 Type II مع تدابير أمنية مادية صارمة." },
  "hipaa.baaTitle": { en: "Business Associate Agreement (BAA)", ar: "اتفاقية شراكة الأعمال (BAA)" },
  "hipaa.baaDesc": { en: "2nd Opinion signs a Business Associate Agreement (BAA) with all partner hospitals and healthcare providers.", ar: "توقع منصة الرأي الثاني اتفاقية شراكة أعمال (BAA) مع جميع المستشفيات ومقدمي الرعاية الصحية الشركاء." },
  "hipaa.rightsTitle": { en: "Patient Rights", ar: "حقوق المريض" },
  "hipaa.rightsDesc": { en: "Under HIPAA, you have specific rights regarding your health information:", ar: "بموجب HIPAA، لديك حقوق محددة فيما يتعلق بمعلوماتك الصحية:" },
  "hipaa.right1": { en: "Right to access and obtain a copy of your health records.", ar: "الحق في الوصول والحصول على نسخة من سجلاتك الصحية." },
  "hipaa.right2": { en: "Right to request corrections to your medical information.", ar: "الحق في طلب تصحيح معلوماتك الطبية." },
  "hipaa.right3": { en: "Right to know how and where your information is shared.", ar: "الحق في معرفة كيف وأين تتم مشاركة معلوماتك." },
  "hipaa.right4": { en: "Right to data portability.", ar: "الحق في نقل البيانات." },
  "hipaa.back": { en: "Back to Home", ar: "العودة للرئيسية" },

  // How It Works Page
  "how.badge": { en: "From doubt to clarity in 48 hours", ar: "من الشك إلى اليقين في 48 ساعة" },
  "how.title": { en: "Your path to a Confident Diagnosis", ar: "طريقك إلى تشخيص واثق" },
  "how.desc": { en: "We've simplified the complex process of getting a second medical opinion into four easy, secure steps.", ar: "لقد بسطنا العملية المعقدة للحصول على رأي طبي ثانٍ في أربع خطوات سهلة وآمنة." },
  "how.step1.title": { en: "Create Account", ar: "إنشاء حساب" },
  "how.step1.desc": { en: "Sign up as a patient. Securely deposit funds into your wallet.", ar: "سجل كمريض. أودع الأموال بأمان في محفظتك." },
  "how.step2.title": { en: "Submit Case Data", ar: "أرسل بيانات الحالة" },
  "how.step2.desc": { en: "Describe symptoms and upload labs. Our AI organizes this for the doctor.", ar: "صف الأعراض وحمل التحاليل. ينظم ذكاؤنا الاصطناعي هذا للطبيب." },
  "how.step3.title": { en: "Specialist Review", ar: "مراجعة المتخصص" },
  "how.step3.desc": { en: "A top-rated specialist reviews your case and files to form an opinion.", ar: "يقوم متخصص ذو تقييم عالٍ بمراجعة حالتك وملفاتك لتكوين رأي." },
  "how.step4.title": { en: "Get Your Report", ar: "احصل على تقريرك" },
  "how.step4.desc": { en: "Receive a detailed second opinion to validate your treatment.", ar: "استلم رأياً ثانياً مفصلاً للتحقق من علاجك." },
  "how.aiTitle": { en: "Powered by AI, Verified by Humans", ar: "مدعوم بالذكاء الاصطناعي، ومحقق من البشر" },
  "how.aiDesc": { en: "We use advanced Gemini AI models to assist our doctors, not replace them.", ar: "نستخدم نماذج Gemini AI المتقدمة لمساعدة أطبائنا، وليس لاستبدالهم." },
  "how.feature1": { en: "Smart Symptom Refinement", ar: "تحسين الأعراض الذكي" },
  "how.feature2": { en: "Data Privacy & Security", ar: "خصوصية وأمن البيانات" },
  "how.faqTitle": { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  "how.faq1.q": { en: "How much does it cost?", ar: "كم التكلفة؟" },
  "how.faq1.a": { en: "Every standard second opinion case is a flat fee of $40.00.", ar: "كل حالة رأي ثانٍ قياسية لها رسوم ثابتة قدرها 40.00 دولارًا." },
  "how.faq2.q": { en: "Who are the doctors?", ar: "من هم الأطباء؟" },
  "how.faq2.a": { en: "Our specialists are board-certified professionals from top hospitals worldwide.", ar: "أطباؤنا متخصصون معتمدون من أفضل المستشفيات حول العالم." },
  "how.cta": { en: "Start Your Consultation", ar: "ابدأ استشارتك" },

  // Reviews Page
  "reviews.badge": { en: "Rated 4.9/5 by 10,000+ Patients", ar: "مقيم 4.9/5 من قبل 10,000+ مريض" },
  "reviews.title": { en: "Stories of Better Health", ar: "قصص صحة أفضل" },
  "reviews.desc": { en: "Real experiences from patients who found clarity and confidence through 2nd Opinion.", ar: "تجارب حقيقية من مرضى وجدوا الوضوح والثقة من خلال الرأي الثاني." },
  "reviews.stat.rating": { en: "Average Rating", ar: "متوسط التقييم" },
  "reviews.stat.recommend": { en: "Would Recommend", ar: "يوصون به" },
  "reviews.stat.time": { en: "Avg. Response Time", ar: "متوسط وقت الاستجابة" },
  "reviews.story.badge": { en: "Success Story", ar: "قصة نجاح" },
  "reviews.story.title": { en: "From Uncertainty to a Cure", ar: "من عدم اليقين إلى العلاج" },
  "reviews.story.text": { en: "\"I spent two years visiting different specialists with no clear answer. Within 48 hours of submitting my case to 2nd Opinion, Dr. Sarah Smith identified a rare condition that had been overlooked.\"", ar: "\"قضيت عامين أزور متخصصين مختلفين دون إجابة واضحة. في غضون 48 ساعة من تقديم حالتي إلى الرأي الثاني، حددت الدكتورة سارة سميث حالة نادرة تم إغفالها.\"" },
  "reviews.story.author": { en: "Verified Patient • California, USA", ar: "مريض موثق • كاليفورنيا، الولايات المتحدة" },
  "reviews.ctaTitle": { en: "Ready to find your answers?", ar: "هل أنت مستعد للعثور على إجاباتك؟" },
};
