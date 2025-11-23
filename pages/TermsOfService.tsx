
import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, BookOpen, CreditCard, Scale, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const { t } = useApp();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">{t('terms.title')}</h1>
        <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-slate-900 pl-4">
            {t('terms.intro')}
        </p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                  <BookOpen className="h-6 w-6" />
                  <h2 className="text-xl font-bold">{t('terms.servicesTitle')}</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-8">
                  {t('terms.servicesDesc')}
              </p>
          </section>
          
          <div className="h-px bg-slate-100"></div>

          <section className="space-y-3 bg-red-50 p-6 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-6 w-6" />
                  <h2 className="text-xl font-bold">{t('terms.disclaimerTitle')}</h2>
              </div>
              <p className="text-red-900/80 leading-relaxed pl-8 font-medium">
                  {t('terms.disclaimerDesc')}
              </p>
          </section>

          <div className="h-px bg-slate-100"></div>

          <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                  <CreditCard className="h-6 w-6" />
                  <h2 className="text-xl font-bold">{t('terms.paymentTitle')}</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-8">
                  {t('terms.paymentDesc')}
              </p>
          </section>
      </div>
      
       <div className="mt-8 text-center text-sm text-slate-500">
          Effective Date: October 24, 2023
      </div>
    </div>
  );
};

export default TermsOfService;
