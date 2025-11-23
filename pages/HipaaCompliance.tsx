import React from 'react';
import { ShieldCheck, Lock, Server, FileKey, Eye, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const HipaaCompliance = () => {
  const { t } = useApp();

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 rounded-3xl overflow-hidden p-8 md:p-16 text-center md:text-left">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary-900/50 border border-primary-700 text-primary-300 px-4 py-1.5 rounded-full text-sm font-bold">
                    <ShieldCheck className="h-4 w-4" />
                    {t('hipaa.badge')}
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                    {t('hipaa.title')}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                    {t('hipaa.heroDesc')}
                </p>
            </div>
            <div className="flex justify-center">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-sm w-full relative">
                     <div className="absolute -top-6 -right-6 bg-secondary-500 rounded-full p-4 shadow-lg shadow-secondary-900/50 animate-pulse">
                        <Lock className="h-8 w-8 text-white" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold">{t('hipaa.encryption')}</div>
                                <div className="text-white font-mono text-sm">{t('hipaa.atRest')}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold">{t('hipaa.transmission')}</div>
                                <div className="text-white font-mono text-sm">{t('hipaa.inTransit')}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold">{t('hipaa.access')}</div>
                                <div className="text-white font-mono text-sm">{t('hipaa.rbac')}</div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Core Security Pillars */}
      <section className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-slate-900">{t('hipaa.pillarsTitle')}</h2>
              <p className="text-slate-600 mt-2">{t('hipaa.pillarsDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <FileKey className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t('hipaa.e2eTitle')}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                      {t('hipaa.e2eDesc')}
                  </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <Eye className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t('hipaa.auditTitle')}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                      {t('hipaa.auditDesc')}
                  </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <Server className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t('hipaa.infraTitle')}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                      {t('hipaa.infraDesc')}
                  </p>
              </div>
          </div>
      </section>

      {/* Detailed Policy Text */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
              <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-slate-400" />
                      {t('hipaa.baaTitle')}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                      {t('hipaa.baaDesc')}
                  </p>
              </div>
              
              <div className="h-px bg-slate-200"></div>

              <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('hipaa.rightsTitle')}</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                      {t('hipaa.rightsDesc')}
                  </p>
                  <ul className="grid md:grid-cols-2 gap-4">
                      <li className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                          <CheckCircle2 className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{t('hipaa.right1')}</span>
                      </li>
                      <li className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                          <CheckCircle2 className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{t('hipaa.right2')}</span>
                      </li>
                      <li className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                          <CheckCircle2 className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{t('hipaa.right3')}</span>
                      </li>
                      <li className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                          <CheckCircle2 className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{t('hipaa.right4')}</span>
                      </li>
                  </ul>
              </div>
          </div>
      </section>

      <div className="text-center pt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition">
              <ArrowLeft className="h-4 w-4" /> {t('hipaa.back')}
          </Link>
      </div>
    </div>
  );
};

export default HipaaCompliance;