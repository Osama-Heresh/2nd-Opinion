
import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { t } = useApp();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">{t('privacy.title')}</h1>
        <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-primary-500 pl-4">
            {t('privacy.intro')}
        </p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <section className="space-y-3">
              <div className="flex items-center gap-2 text-primary-600">
                  <FileText className="h-6 w-6" />
                  <h2 className="text-xl font-bold">{t('privacy.collectionTitle')}</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-8">
                  {t('privacy.collectionDesc')}
              </p>
          </section>
          
          <div className="h-px bg-slate-100"></div>

          <section className="space-y-3">
              <div className="flex items-center gap-2 text-primary-600">
                  <Shield className="h-6 w-6" />
                  <h2 className="text-xl font-bold">{t('privacy.usageTitle')}</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-8">
                  {t('privacy.usageDesc')}
              </p>
          </section>

          <div className="h-px bg-slate-100"></div>

          <section className="space-y-3">
              <div className="flex items-center gap-2 text-primary-600">
                  <Lock className="h-6 w-6" />
                  <h2 className="text-xl font-bold">{t('privacy.securityTitle')}</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-8">
                  {t('privacy.securityDesc')}
              </p>
          </section>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
          Last updated: October 24, 2023
      </div>
    </div>
  );
};

export default PrivacyPolicy;
