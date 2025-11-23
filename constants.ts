
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
    password: 'password123',
    role: UserRole.PATIENT,
    walletBalance: 100.00,
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'd1',
    name: 'Dr. Sarah Smith',
    email: 'sarah@clinic.com',
    password: 'password123',
    role: UserRole.DOCTOR,
    walletBalance: 560.00,
    specialty: Specialty.CARDIOLOGY,
    hospital: 'Mayo Clinic',
    country: 'USA',
    rating: 4.8,
    casesClosed: 42,
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    linkedin: 'https://www.linkedin.com/',
    bio: 'Experienced Cardiologist with over 15 years in interventional cardiology. Dedicated to patient education and preventive care.',
    bonusPoints: 120,
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'd2',
    name: 'Dr. Karim Nader',
    email: 'karim@hospital.ae',
    password: 'password123',
    role: UserRole.DOCTOR,
    walletBalance: 1200.00,
    specialty: Specialty.DERMATOLOGY,
    hospital: 'Cleveland Clinic Abu Dhabi',
    country: 'UAE',
    rating: 4.9,
    casesClosed: 89,
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    linkedin: 'https://www.linkedin.com/',
    bio: 'Specializing in complex dermatological conditions and immunotherapy. Board certified in both UAE and UK.',
    bonusPoints: 350,
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@2ndopinion.com',
    password: 'admin',
    role: UserRole.ADMIN,
    walletBalance: 5000.00, // Platform revenue wallet
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];

// Arabic Data Overrides for Doctors
export const DOCTOR_DETAILS_AR: Record<string, { name: string, specialty: string, hospital: string, country: string }> = {
  'd1': {
    name: 'د. سارة سميث',
    specialty: 'أمراض القلب',
    hospital: 'مايو كلينك',
    country: 'الولايات المتحدة'
  },
  'd2': {
    name: 'د. كريم نادر',
    specialty: 'الجلدية',
    hospital: 'كليفلاند كلينك أبوظبي',
    country: 'الإمارات'
  }
};

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
    patientRating: 5,
    patientFeedback: "Dr. Karim was thorough and reassuring. Highly recommended for dermatology issues."
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

  // Auth
  "auth.loginTitle": { en: "Welcome Back", ar: "مرحباً بعودتك" },
  "auth.loginDesc": { en: "Enter your credentials to access your account.", ar: "أدخل بيانات اعتمادك للوصول إلى حسابك." },
  "auth.email": { en: "Email Address", ar: "البريد الإلكتروني" },
  "auth.password": { en: "Password", ar: "كلمة المرور" },
  "auth.submitLogin": { en: "Sign In", ar: "تسجيل الدخول" },
  "auth.noAccount": { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
  "auth.registerLink": { en: "Register Now", ar: "سجل الآن" },
  "auth.registerTitle": { en: "Create Account", ar: "إنشاء حساب" },
  "auth.registerPatient": { en: "I am a Patient", ar: "أنا مريض" },
  "auth.registerDoctor": { en: "I am a Doctor", ar: "أنا طبيب" },
  "auth.fullName": { en: "Full Name", ar: "الاسم الكامل" },
  "auth.specialty": { en: "Specialty", ar: "التخصص" },
  "auth.hospital": { en: "Current Hospital", ar: "المستشفى الحالي" },
  "auth.country": { en: "Country", ar: "الدولة" },
  "auth.linkedin": { en: "LinkedIn Profile URL", ar: "رابط ملف LinkedIn" },
  "auth.bio": { en: "Short Bio", ar: "نبذة مختصرة" },
  "auth.photo": { en: "Profile Photo", ar: "صورة الملف الشخصي" },
  "auth.submitRegister": { en: "Create Account", ar: "إنشاء حساب" },
  "auth.alreadyAccount": { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  "auth.loginLink": { en: "Login here", ar: "سجل الدخول هنا" },

  // Settings
  "settings.title": { en: "Profile Settings", ar: "إعدادات الملف الشخصي" },
  "settings.updateBtn": { en: "Update Profile", ar: "تحديث الملف الشخصي" },
  "settings.success": { en: "Profile updated successfully.", ar: "تم تحديث الملف الشخصي بنجاح." },
  "settings.changePhoto": { en: "Change Photo", ar: "تغيير الصورة" },

  // Landing Page
  "landing.trusted": { en: "Trusted by 10,000+ Patients", ar: "موثوق من قبل أكثر من 10,000 مريض" },
  "landing.heroTitle1": { en: "Expert Medical", ar: "استشارات طبية" },
  "landing.heroTitle2": { en: "Second Opinions", ar: "رأي ثانٍ خبير" },
  "landing.heroDesc": { en: "Connect with world-class specialists to validate your diagnosis and treatment plan. Secure, fast, and powered by advanced AI assistance.", ar: "تواصل مع أطباء عالميين للتحقق من تشخيصك وخطة علاجك. آمن، سريع، ومدعوم بالذكاء الاصطناعي المتقدم." },
  "landing.dashboardBtn": { en: "Go to Dashboard", ar: "الذهاب للوحة التحكم" },
  "landing.demoPatient": { en: "Demo Patient", ar: "تجربة كمريض" },
  "landing.demoDoctor": { en: "Demo Doctor", ar: "تجربة كطبيب" },
  "landing.hipaa": { en: "HIPAA Compliant", ar: "متوافق مع HIPAA" },
  "landing.topDoctors": { en: "Top 1% Doctors", ar: "أفضل 1% من الأطباء" },
  "landing.imgBadgeDoctors": { en: "500+ Doctors", ar: "500+ طبيب" },
  "landing.imgBadgeReady": { en: "Ready to review your case today.", ar: "جاهزون لمراجعة حالتك اليوم." },
  
  "landing.stat.response": { en: "Avg. Response Time", ar: "متوسط وقت الرد" },
  "landing.stat.specialties": { en: "Specialties Covered", ar: "تخصص طبي" },
  "landing.stat.cases": { en: "Cases Resolved", ar: "حالة تم حلها" },
  "landing.stat.satisfaction": { en: "Patient Satisfaction", ar: "رضا المرضى" },

  "landing.why.title": { en: "Why Choose 2nd Opinion?", ar: "لماذا تختار الرأي الثاني؟" },
  "landing.why.desc": { en: "We combine top-tier medical expertise with advanced technology to give you the clarity you deserve.", ar: "نجمع بين الخبرة الطبية رفيعة المستوى والتكنولوجيا المتقدمة لمنحك الوضوح الذي تستحقه." },
  
  "landing.feature1.title": { en: "Verified Specialists", ar: "أطباء معتمدون" },
  "landing.feature1.desc": { en: "Access a global network of board-certified doctors. Every specialist is vetted, licensed, and reviewed by patients like you.", ar: "الوصول إلى شبكة عالمية من الأطباء المعتمدين. يتم فحص كل متخصص وترخيصه وتقييمه من قبل مرضى مثلك." },
  
  "landing.feature2.title": { en: "Fast Turnaround", ar: "سرعة في الإنجاز" },
  "landing.feature2.desc": { en: "Anxiety shouldn't wait. Receive a comprehensive second opinion report within 24-48 hours of submission.", ar: "القلق لا يجب أن ينتظر. احصل على تقرير رأي ثانٍ شامل في غضون 24-48 ساعة من التقديم." },
  
  "landing.feature3.title": { en: "AI-Enhanced Analysis", ar: "تحليل معزز بالذكاء الاصطناعي" },
  "landing.feature3.desc": { en: "Our Gemini AI pre-analyzes your history and labs to highlight key data points, ensuring your doctor misses nothing.", ar: "يقوم نموذج Gemini AI الخاص بنا بتحليل تاريخك وتحاليلك مسبقًا لتسليط الضوء على البيانات الرئيسية، مما يضمن عدم تفويت طبيبك لأي شيء." },

  "landing.leaderboard.title": { en: "Top Rated Specialists", ar: "الأطباء الأعلى تقييماً" },
  "landing.leaderboard.subtitle": { en: "Doctors recognized for their accuracy and patient care this month.", ar: "أطباء تم تكريمهم لدقتهم ورعايتهم للمرضى هذا الشهر." },
  "landing.leaderboard.viewAll": { en: "View All Doctors", ar: "عرض جميع الأطباء" },
  "landing.leaderboard.cases": { en: "cases closed", ar: "حالة مغلقة" },
  "landing.leaderboard.bonus": { en: "bonus pts", ar: "نقاط مكافأة" },
  "landing.adminDemo": { en: "Access Admin Portal (Demo)", ar: "دخول بوابة المسؤول (تجريبي)" },

  "role.patient": { en: "Patient", ar: "مريض" },
  "role.doctor": { en: "Doctor", ar: "طبيب" },
  "role.admin": { en: "Admin", ar: "مسؤول" },
  "wallet.balance": { en: "Wallet Balance", ar: "رصيد المحفظة" },
  "btn.newCase": { en: "New Case", ar: "حالة جديدة" },
  "status.open": { en: "Open", ar: "مفتوحة" },
  "status.closed": { en: "Closed", ar: "مغلقة" },
  "status.pendingInfo": { en: "Pending Info", ar: "بانتظار معلومات" },
  "label.symptoms": { en: "Describe Symptoms", ar: "وصف الأعراض" },
  "label.specialty": { en: "Specialty", ar: "التخصص" },
  "ai.analyze": { en: "AI Analyze", ar: "تحليل الذكاء الاصطناعي" },
  "ai.refine": { en: "AI Refine", ar: "تحسين النص" },

  // Admin Dashboard
  "admin.title": { en: "Admin Dashboard", ar: "لوحة تحكم المسؤول" },
  "admin.tab.overview": { en: "Overview", ar: "نظرة عامة" },
  "admin.tab.users": { en: "User Management", ar: "إدارة المستخدمين" },
  "admin.reset": { en: "Reset Demo Data", ar: "إعادة تعيين البيانات التجريبية" },
  "admin.kpi.totalCases": { en: "Total Cases", ar: "إجمالي الحالات" },
  "admin.kpi.activeDoctors": { en: "Active Doctors", ar: "الأطباء النشطون" },
  "admin.kpi.volume": { en: "Total Volume", ar: "إجمالي التداول" },
  "admin.kpi.profit": { en: "Net Profit (30%)", ar: "صافي الربح (30%)" },
  "admin.chart.specialty": { en: "Cases by Specialty", ar: "الحالات حسب التخصص" },
  "admin.chart.topDocs": { en: "Top Doctors (Cases Closed)", ar: "أفضل الأطباء (حالات مغلقة)" },
  "admin.table.title": { en: "Recent Case Submissions", ar: "أحدث الحالات المقدمة" },
  "admin.filter.all": { en: "All Statuses", ar: "جميع الحالات" },
  "admin.searchPlaceholder": { en: "Search patient or ID...", ar: "ابحث عن مريض أو رقم تعريفي..." },
  "admin.th.caseId": { en: "Case ID", ar: "رقم الحالة" },
  "admin.th.patient": { en: "Patient", ar: "المريض" },
  "admin.th.specialty": { en: "Specialty", ar: "التخصص" },
  "admin.th.status": { en: "Status", ar: "الحالة" },
  "admin.th.doctor": { en: "Doctor", ar: "الطبيب" },
  "admin.th.date": { en: "Date", ar: "التاريخ" },
  "admin.unassigned": { en: "Unassigned", ar: "غير معين" },
  "admin.noCases": { en: "No cases found matching filters.", ar: "لا توجد حالات تطابق الفلاتر." },
  
  // Admin User Management
  "admin.users.search": { en: "Search users...", ar: "بحث عن مستخدمين..." },
  "admin.users.approve": { en: "Approve", ar: "موافقة" },
  "admin.users.reject": { en: "Reject", ar: "رفض" },
  "admin.users.delete": { en: "Delete", ar: "حذف" },
  "admin.users.pending": { en: "Pending Approval", ar: "بانتظار الموافقة" },
  "admin.users.active": { en: "Active", ar: "نشط" },

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
  
  // Find Doctors Page
  "findDoc.title": { en: "Find a Specialist", ar: "ابحث عن أخصائي" },
  "findDoc.searchPlaceholder": { en: "Search name, specialty...", ar: "ابحث بالاسم، التخصص..." },
  "findDoc.book": { en: "Book Consultation", ar: "حجز استشارة" },
  "findDoc.noResults": { en: "No specialists found matching your search.", ar: "لم يتم العثور على أطباء يطابقون بحثك." },
  "findDoc.location": { en: "Location", ar: "الموقع" },
  "findDoc.allLocations": { en: "All Locations", ar: "جميع المواقع" },
};
