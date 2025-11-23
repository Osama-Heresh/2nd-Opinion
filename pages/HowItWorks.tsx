import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FileText, UserPlus, BrainCircuit, Stethoscope, FileCheck, ArrowRight, UploadCloud, ShieldCheck, Clock } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useApp();

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-primary-100">
            <Clock className="h-4 w-4" />
            {t('how.badge')}
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
          {t('how.title')}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {t('how.desc')}
        </p>
      </section>

      {/* The 4 Steps */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center group hover:border-primary-300 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-4 border-white shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        1
                    </div>
                    <div className="mb-4 flex justify-center text-blue-600">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{t('how.step1.title')}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {t('how.step1.desc')}
                    </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center group hover:border-purple-300 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-4 border-white shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        2
                    </div>
                    <div className="mb-4 flex justify-center text-purple-600">
                        <UploadCloud className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{t('how.step2.title')}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {t('how.step2.desc')}
                    </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center group hover:border-secondary-300 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-secondary-50 text-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-4 border-white shadow-sm group-hover:bg-secondary-600 group-hover:text-white transition-colors">
                        3
                    </div>
                    <div className="mb-4 flex justify-center text-secondary-600">
                        <Stethoscope className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{t('how.step3.title')}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {t('how.step3.desc')}
                    </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center group hover:border-green-300 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-4 border-white shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                        4
                    </div>
                    <div className="mb-4 flex justify-center text-green-600">
                        <FileCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{t('how.step4.title')}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {t('how.step4.desc')}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="bg-slate-50 py-16 rounded-3xl my-12">
          <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl transform rotate-3 opacity-20 blur-lg"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2832&auto=format&fit=crop" 
                        alt="Doctor reviewing digital records" 
                        className="relative rounded-2xl shadow-xl w-full"
                      />
                  </div>
                  <div className="order-1 md:order-2 space-y-6">
                      <h2 className="text-3xl font-display font-bold text-slate-900">{t('how.aiTitle')}</h2>
                      <p className="text-lg text-slate-600 leading-relaxed">
                          {t('how.aiDesc')}
                      </p>
                      <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                              <BrainCircuit className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" />
                              <div>
                                  <h4 className="font-bold text-slate-900">{t('how.feature1')}</h4>
                              </div>
                          </li>
                          <li className="flex items-start gap-3">
                              <ShieldCheck className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                              <div>
                                  <h4 className="font-bold text-slate-900">{t('how.feature2')}</h4>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* FAQ / Info */}
      <section className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-12">{t('how.faqTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">{t('how.faq1.q')}</h4>
                  <p className="text-slate-600 text-sm">{t('how.faq1.a')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">{t('how.faq2.q')}</h4>
                  <p className="text-slate-600 text-sm">{t('how.faq2.a')}</p>
              </div>
          </div>

          <div className="mt-16">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition"
              >
                  {t('how.cta')} <ArrowRight className="h-5 w-5" />
              </Link>
          </div>
      </section>
    </div>
  );
};

export default HowItWorks;