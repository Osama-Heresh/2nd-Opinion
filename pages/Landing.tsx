import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { ShieldCheck, Stethoscope, Clock, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const { login, currentUser, t, users, isLoading } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in (Handled by buttons now, but good to check state)

  const handleLogin = (email: string) => {
    login(email);
    // Navigation happens automatically via ProtectedRoute logic or manual button click in Hero
    // But for smoother UX, we can check role after a small delay or rely on the user to click "Go to Dashboard"
    // For this demo, let's auto-navigate based on the mock user role for immediate feedback
    const user = users.find(u => u.email === email);
    if (user) {
        if (user.role === UserRole.PATIENT) navigate('/patient');
        else if (user.role === UserRole.DOCTOR) navigate('/doctor');
        else navigate('/admin');
    }
  };

  const topDoctors = users
    .filter(u => u.role === UserRole.DOCTOR)
    .sort((a, b) => {
        const scoreA = ((a.casesClosed || 0) * 10) + (a.bonusPoints || 0);
        const scoreB = ((b.casesClosed || 0) * 10) + (b.bonusPoints || 0);
        return scoreB - scoreA;
    })
    .slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-20 lg:pb-28">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-pulse"></div>
            <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-secondary-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8 text-center lg:text-start">
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-secondary-500"></span>
                        {t('landing.trusted')}
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] tracking-tight">
                        {t('landing.heroTitle1')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                            {t('landing.heroTitle2')}
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {t('landing.heroDesc')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        {currentUser ? (
                             <button 
                                onClick={() => {
                                    if (currentUser.role === UserRole.PATIENT) navigate('/patient');
                                    else if (currentUser.role === UserRole.DOCTOR) navigate('/doctor');
                                    else navigate('/admin');
                                }}
                                className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition flex items-center gap-2 text-lg"
                             >
                                {t('landing.dashboardBtn')} <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                             </button>
                        ) : (
                            <>
                                <button 
                                    onClick={() => handleLogin('ahmed@example.com')}
                                    className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition flex items-center justify-center gap-2"
                                >
                                    {t('landing.demoPatient')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                                </button>
                                <button 
                                    onClick={() => handleLogin('sarah@clinic.com')}
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                >
                                    {t('landing.demoDoctor')}
                                </button>
                            </>
                        )}
                    </div>
                    
                    <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-secondary-500" />
                            {t('landing.hipaa')}
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-secondary-500" />
                            {t('landing.topDoctors')}
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative mx-auto lg:ml-auto w-full max-w-lg lg:max-w-none">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                        <img 
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop" 
                            alt="Doctor analyzing medical data on tablet" 
                            className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
                        />
                        {/* Floating Badge */}
                        {!isLoading && users.length >= 3 && (
                            <div className="absolute bottom-6 left-6 rtl:left-auto rtl:right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 max-w-[200px]">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex -space-x-2 rtl:space-x-reverse">
                                        <img className="w-8 h-8 rounded-full border-2 border-white" src={users[1].avatarUrl} alt="" />
                                        <img className="w-8 h-8 rounded-full border-2 border-white" src={users[2].avatarUrl} alt="" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{t('landing.imgBadgeDoctors')}</span>
                                </div>
                                <p className="text-xs text-slate-500">{t('landing.imgBadgeReady')}</p>
                            </div>
                        )}
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-secondary-400/20 rounded-full blur-2xl"></div>
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
      </section>

      {/* Stats/Social Proof Strip */}
      <section className="bg-slate-900 py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                      <div className="text-4xl font-display font-bold text-secondary-400 mb-1">24h</div>
                      <div className="text-slate-400 text-sm">{t('landing.stat.response')}</div>
                  </div>
                  <div>
                      <div className="text-4xl font-display font-bold text-white mb-1">50+</div>
                      <div className="text-slate-400 text-sm">{t('landing.stat.specialties')}</div>
                  </div>
                  <div>
                      <div className="text-4xl font-display font-bold text-white mb-1">10k+</div>
                      <div className="text-slate-400 text-sm">{t('landing.stat.cases')}</div>
                  </div>
                  <div>
                      <div className="text-4xl font-display font-bold text-white mb-1">4.9/5</div>
                      <div className="text-slate-400 text-sm">{t('landing.stat.satisfaction')}</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">{t('landing.why.title')}</h2>
                <p className="text-lg text-slate-600">{t('landing.why.desc')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="group bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition duration-300">
                    <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition">
                        <ShieldCheck className="text-primary-600 h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.feature1.title')}</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {t('landing.feature1.desc')}
                    </p>
                </div>

                <div className="group bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-secondary-200 hover:shadow-xl hover:shadow-secondary-900/5 transition duration-300">
                    <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition">
                        <Clock className="text-secondary-600 h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.feature2.title')}</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {t('landing.feature2.desc')}
                    </p>
                </div>

                <div className="group bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5 transition duration-300">
                    <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition">
                        <Stethoscope className="text-purple-600 h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.feature3.title')}</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {t('landing.feature3.desc')}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Top Doctors / Leaderboard Preview */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{t('landing.leaderboard.title')}</h2>
                    <p className="text-slate-600">{t('landing.leaderboard.subtitle')}</p>
                </div>
                <button 
                    onClick={() => handleLogin('p1')} // Quick entry for patient
                    className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-1 group"
                >
                    {t('landing.leaderboard.viewAll')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
                        Loading doctors...
                    </div>
                ) : topDoctors.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No doctors available yet
                    </div>
                ) : (
                    topDoctors.map((doc, idx) => (
                        <div key={doc.id} className="p-6 flex items-center gap-6 hover:bg-slate-50/80 transition group">
                            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-700'}`}>
                                #{idx + 1}
                            </div>
                            <img src={doc.avatarUrl} alt={doc.name} className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm" />
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition">{doc.name}</h4>
                                <p className="text-sm text-slate-500 font-medium">{doc.specialty} • {doc.hospital}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold mb-1">
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    {doc.rating}
                                </div>
                                <span className="text-xs text-slate-400">{doc.casesClosed} {t('landing.leaderboard.cases')}</span>
                                {(doc.bonusPoints || 0) > 0 && <span className="text-xs text-purple-600 font-medium">+{doc.bonusPoints} {t('landing.leaderboard.bonus')}</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>
            
             {/* Admin Demo Button (Subtle) */}
             <div className="mt-12 text-center">
                <button 
                    onClick={() => handleLogin('admin@2ndopinion.com')}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                    {t('landing.adminDemo')}
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;