
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
    BookOpen, ChevronRight, User, Stethoscope, ShieldCheck, 
    CreditCard, LayoutDashboard, Search, MessageCircle, Settings,
    FileText, Lightbulb
} from 'lucide-react';

// Screenshot Data Mapping
// NOTE: Replace these placeholder URLs with your actual screenshot paths (e.g., '/assets/screenshots/landing-en.png')
const SCREENSHOTS = {
    landing: {
        en: "https://placehold.co/1200x600/f1f5f9/0f172a?text=Landing+Page+(English+Version)&font=roboto",
        ar: "https://placehold.co/1200x600/f1f5f9/0f172a?text=الصفحة+الرئيسية+(النسخة+العربية)&font=roboto"
    },
    register: {
        en: "https://placehold.co/800x600/f8fafc/334155?text=Registration+Form+(English)&font=roboto",
        ar: "https://placehold.co/800x600/f8fafc/334155?text=نموذج+التسجيل+(عربي)&font=roboto"
    },
    patientDash: {
        en: "https://placehold.co/1200x800/f0f9ff/0369a1?text=Patient+Dashboard+(English)&font=roboto",
        ar: "https://placehold.co/1200x800/f0f9ff/0369a1?text=لوحة+تحكم+المريض+(عربي)&font=roboto"
    },
    newCase: {
        en: "https://placehold.co/1000x700/ffffff/0f172a?text=New+Case+Submission+(English)&font=roboto",
        ar: "https://placehold.co/1000x700/ffffff/0f172a?text=تقديم+حالة+جديدة+(عربي)&font=roboto"
    },
    findDoc: {
        en: "https://placehold.co/1000x600/f8fafc/475569?text=Doctor+Directory+(English)&font=roboto",
        ar: "https://placehold.co/1000x600/f8fafc/475569?text=دليل+الأطباء+(عربي)&font=roboto"
    },
    doctorDash: {
        en: "https://placehold.co/1200x800/fdf4ff/7e22ce?text=Doctor+Dashboard+(English)&font=roboto",
        ar: "https://placehold.co/1200x800/fdf4ff/7e22ce?text=لوحة+تحكم+الطبيب+(عربي)&font=roboto"
    },
    caseReview: {
        en: "https://placehold.co/1000x700/ffffff/0f172a?text=Case+Review+Console+(English)&font=roboto",
        ar: "https://placehold.co/1000x700/ffffff/0f172a?text=وحدة+مراجعة+الحالات+(عربي)&font=roboto"
    },
    settings: {
        en: "https://placehold.co/800x400/f1f5f9/475569?text=Profile+Settings+(English)&font=roboto",
        ar: "https://placehold.co/800x400/f1f5f9/475569?text=إعدادات+الملف+الشخصي+(عربي)&font=roboto"
    },
    adminDash: {
        en: "https://placehold.co/1200x800/f0fdf4/15803d?text=Admin+Dashboard+(English)&font=roboto",
        ar: "https://placehold.co/1200x800/f0fdf4/15803d?text=لوحة+تحكم+المسؤول+(عربي)&font=roboto"
    },
    userMgmt: {
        en: "https://placehold.co/1000x500/ffffff/0f172a?text=User+Management+Table+(English)&font=roboto",
        ar: "https://placehold.co/1000x500/ffffff/0f172a?text=جدول+إدارة+المستخدمين+(عربي)&font=roboto"
    }
};

// Helper Component for Screenshots
const ScreenshotPlaceholder = ({ label, src }: { label: string, src: string }) => (
    <div className="w-full rounded-xl border border-slate-200 shadow-md overflow-hidden bg-slate-100 my-8 group">
        <div className="bg-slate-200 border-b border-slate-300 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs font-medium text-slate-500 ml-2 font-mono">{label}</span>
        </div>
        <div className="relative">
            <img 
                src={src} 
                alt={label} 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]" 
            />
        </div>
    </div>
);

const UserGuide = () => {
    const { t, language } = useApp();
    const [activeSection, setActiveSection] = useState('intro');

    // Helper to get correct screenshot based on language
    const getImg = (key: keyof typeof SCREENSHOTS) => {
        return language === 'ar' ? SCREENSHOTS[key].ar : SCREENSHOTS[key].en;
    };

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="bg-slate-900 text-white rounded-3xl p-12 mb-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                 <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-primary-500/30 border border-primary-500/50 text-primary-200 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                        <BookOpen className="h-4 w-4" />
                        {t('guide.badge')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('guide.title')}</h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        {t('guide.desc')}
                    </p>
                 </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">{t('guide.toc')}</h3>
                        <nav className="space-y-1">
                            <button onClick={() => scrollTo('intro')} className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'intro' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                {t('guide.nav.intro')}
                            </button>
                            <button onClick={() => scrollTo('auth')} className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'auth' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                {t('guide.nav.auth')}
                            </button>
                            <button onClick={() => scrollTo('patient')} className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'patient' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                {t('guide.nav.patient')}
                            </button>
                            <button onClick={() => scrollTo('doctor')} className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'doctor' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                {t('guide.nav.doctor')}
                            </button>
                            <button onClick={() => scrollTo('admin')} className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'admin' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                {t('guide.nav.admin')}
                            </button>
                        </nav>
                        
                        <div className="mt-8 pt-6 border-t border-slate-100">
                             <h3 className="font-bold text-slate-900 mb-2 text-xs">{t('guide.support.title')}</h3>
                             <p className="text-xs text-slate-500 mb-3">{t('guide.support.text')}</p>
                             <a href="mailto:support@2ndopinion.com" className="text-xs font-bold text-primary-600 hover:underline">support@2ndopinion.com</a>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-16">
                    
                    {/* Intro */}
                    <section id="intro" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">{t('guide.intro.title')}</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            {t('guide.intro.text')}
                        </p>
                        <ScreenshotPlaceholder label={t('guide.screen.landing')} src={getImg('landing')} />
                    </section>

                    {/* Auth */}
                    <section id="auth" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">{t('guide.auth.title')}</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{t('guide.auth.createTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.auth.createText')}
                                </p>
                                <ul className="list-disc pl-5 rtl:pr-5 space-y-2 text-slate-600">
                                    <li>{t('guide.auth.rolePatient')}</li>
                                    <li>{t('guide.auth.roleDoctor')}</li>
                                </ul>
                                <ScreenshotPlaceholder label="Registration Form" src={getImg('register')} />
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3">
                                <Lightbulb className="h-5 w-5 text-yellow-600 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-yellow-800 text-sm">{t('guide.auth.noteTitle')}</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        {t('guide.auth.noteText')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Patient Guide */}
                    <section id="patient" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
                             <div className="bg-primary-100 p-2 rounded-lg text-primary-600"><User className="h-6 w-6" /></div>
                             <h2 className="text-2xl font-bold text-slate-900">{t('guide.patient.title')}</h2>
                        </div>
                        
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.patient.dashTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.patient.dashText')}
                                </p>
                                <ScreenshotPlaceholder label="Patient Dashboard" src={getImg('patientDash')} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.patient.submitTitle')}</h3>
                                <ol className="list-decimal pl-5 rtl:pr-5 space-y-4 text-slate-600">
                                    <li>
                                        {t('guide.patient.step1')}
                                    </li>
                                    <li>
                                        {t('guide.patient.step2')}
                                    </li>
                                    <li>
                                        {t('guide.patient.step3')}
                                        <span className="block mt-2 p-3 bg-purple-50 text-purple-700 text-sm rounded border border-purple-100">
                                            <strong>{t('guide.patient.proTip')}</strong>
                                        </span>
                                    </li>
                                    <li>
                                        {t('guide.patient.step4')}
                                    </li>
                                </ol>
                                <ScreenshotPlaceholder label="New Case Form" src={getImg('newCase')} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.patient.findDocTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.patient.findDocText')}
                                </p>
                                <ScreenshotPlaceholder label="Doctor Directory" src={getImg('findDoc')} />
                            </div>
                        </div>
                    </section>

                    {/* Doctor Guide */}
                    <section id="doctor" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
                             <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Stethoscope className="h-6 w-6" /></div>
                             <h2 className="text-2xl font-bold text-slate-900">{t('guide.doctor.title')}</h2>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.doctor.discoveryTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.doctor.discoveryText')}
                                    <br/>
                                    <strong>{t('guide.doctor.directReq')}</strong>
                                </p>
                                <ScreenshotPlaceholder label="Doctor Dashboard" src={getImg('doctorDash')} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.doctor.reviewTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.doctor.reviewText')}
                                </p>
                                <ul className="list-disc pl-5 rtl:pr-5 space-y-2 text-slate-600 mb-4">
                                    <li>{t('guide.doctor.reviewList1')}</li>
                                    <li>{t('guide.doctor.reviewList2')}</li>
                                    <li>{t('guide.doctor.reviewList3')}</li>
                                </ul>
                                <ScreenshotPlaceholder label="Case Review" src={getImg('caseReview')} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.doctor.profileTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.doctor.profileText')}
                                </p>
                                <ScreenshotPlaceholder label="Profile Settings" src={getImg('settings')} />
                            </div>
                        </div>
                    </section>

                    {/* Admin Guide */}
                    <section id="admin" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
                             <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><ShieldCheck className="h-6 w-6" /></div>
                             <h2 className="text-2xl font-bold text-slate-900">{t('guide.admin.title')}</h2>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.admin.platformTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.admin.platformText')}
                                </p>
                                <ScreenshotPlaceholder label="Admin Dashboard" src={getImg('adminDash')} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('guide.admin.usersTitle')}</h3>
                                <p className="text-slate-600 mb-4">
                                    {t('guide.admin.usersText')}
                                </p>
                                <ul className="list-disc pl-5 rtl:pr-5 space-y-2 text-slate-600">
                                    <li>{t('guide.admin.usersList1')}</li>
                                    <li>{t('guide.admin.usersList2')}</li>
                                </ul>
                                <ScreenshotPlaceholder label="User Management" src={getImg('userMgmt')} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;
