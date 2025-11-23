import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Specialty, Case, CaseStatus, User, UserRole } from '../types';
import { PlusCircle, FileText, UploadCloud, BrainCircuit, Loader2, CheckCircle, Search, MapPin, Star, Linkedin, ArrowLeft, Building2, Users } from 'lucide-react';
import { refineSymptoms } from '../services/geminiService';

const PatientDashboard = () => {
  const { currentUser, cases, createCase, t, depositFunds, users, rateDoctor } = useApp();
  const [activeTab, setActiveTab] = useState<'new' | 'list' | 'doctors'>('new');
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>(Specialty.GENERAL);
  const [isRefining, setIsRefining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myCases = cases.filter(c => c.patientId === currentUser?.id);
  const doctors = users.filter(u => u.role === UserRole.DOCTOR);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.specialty && d.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.hospital && d.hospital.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRefine = async () => {
    if (!symptoms) return;
    setIsRefining(true);
    const improved = await refineSymptoms(symptoms);
    setSymptoms(improved);
    setIsRefining(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await createCase({ symptoms, specialty });
    setIsSubmitting(false);
    if (success) {
      setActiveTab('list');
      setSymptoms('');
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Sidebar / Stats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">{t('wallet.balance')}</h3>
           <div className="text-3xl font-bold text-slate-900 mb-4">${currentUser?.walletBalance.toFixed(2)}</div>
           <button 
             onClick={() => depositFunds(50)}
             className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition"
           >
             + Deposit $50
           </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <button 
                onClick={() => { setActiveTab('new'); setSelectedDoctor(null); }}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 border-l-4 transition ${activeTab === 'new' && !selectedDoctor ? 'bg-blue-50 border-primary-500 text-primary-700' : 'border-transparent hover:bg-slate-50'}`}
            >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">{t('btn.newCase')}</span>
            </button>
            <button 
                onClick={() => { setActiveTab('list'); setSelectedDoctor(null); }}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 border-l-4 transition ${activeTab === 'list' && !selectedDoctor ? 'bg-blue-50 border-primary-500 text-primary-700' : 'border-transparent hover:bg-slate-50'}`}
            >
                <FileText className="h-5 w-5" />
                <span className="font-medium">My Cases ({myCases.length})</span>
            </button>
             <button 
                onClick={() => { setActiveTab('doctors'); setSelectedDoctor(null); }}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 border-l-4 transition ${activeTab === 'doctors' && !selectedDoctor ? 'bg-blue-50 border-primary-500 text-primary-700' : 'border-transparent hover:bg-slate-50'}`}
            >
                <Users className="h-5 w-5" />
                <span className="font-medium">Find Doctors</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {selectedDoctor ? (
            // Doctor Profile View
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => setSelectedDoctor(null)} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
                    Back to {activeTab === 'list' ? 'My Cases' : 'Directory'}
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-500"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <img 
                                src={selectedDoctor.avatarUrl} 
                                alt={selectedDoctor.name} 
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                            />
                            {selectedDoctor.linkedin && (
                                <a 
                                    href={selectedDoctor.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#006097] transition shadow-sm"
                                >
                                    <Linkedin className="h-4 w-4" />
                                    LinkedIn Profile
                                </a>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedDoctor.name}</h1>
                                <div className="flex items-center gap-3 text-slate-600 flex-wrap">
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                                        {selectedDoctor.specialty}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                        <span>{selectedDoctor.hospital}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        <span>{selectedDoctor.country}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                    <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                                        <Star className="h-6 w-6 fill-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Patient Rating</p>
                                        <p className="text-xl font-bold text-slate-900">{selectedDoctor.rating} / 5.0</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                                        <CheckCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Cases Closed</p>
                                        <p className="text-xl font-bold text-slate-900">{selectedDoctor.casesClosed}+</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">About</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {selectedDoctor.name} is a highly experienced {selectedDoctor.specialty} specialist practicing at {selectedDoctor.hospital}. 
                                    With a focus on patient-centered care and evidence-based medicine, they have successfully provided second opinions for over {selectedDoctor.casesClosed} complex medical cases.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : activeTab === 'doctors' ? (
            // Doctors Directory
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Find a Specialist</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search name, specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {filteredDoctors.map(doc => (
                        <div 
                            key={doc.id}
                            onClick={() => setSelectedDoctor(doc)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-primary-400 hover:shadow-md transition cursor-pointer flex items-start gap-4 group"
                        >
                            <img src={doc.avatarUrl} alt={doc.name} className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{doc.name}</h3>
                                <p className="text-sm font-medium text-slate-500 mb-1">{doc.specialty}</p>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                                    <Building2 className="h-3 w-3" /> {doc.hospital}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 inline-flex px-2 py-0.5 rounded">
                                    <Star className="h-3 w-3 fill-yellow-600" /> {doc.rating}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredDoctors.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-slate-500">
                            No doctors found matching "{searchTerm}".
                        </div>
                    )}
                </div>
            </div>
        ) : activeTab === 'new' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PlusCircle className="text-primary-600" /> 
                Start New Consultation
             </h2>
             
             <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('label.specialty')}</label>
                    <select 
                        className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value as Specialty)}
                    >
                        {Object.values(Specialty).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t('label.symptoms')}
                        <span className="text-slate-400 font-normal ml-2">(Be detailed)</span>
                    </label>
                    <textarea 
                        className="w-full h-32 rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        placeholder="I have been feeling palpitations..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                        <button 
                            type="button"
                            onClick={handleRefine}
                            disabled={isRefining || !symptoms}
                            className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                        >
                            {isRefining ? <Loader2 className="h-3 w-3 animate-spin" /> : <BrainCircuit className="h-3 w-3" />}
                            {t('ai.refine')} (Gemini)
                        </button>
                    </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                    <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Click to upload Medical Reports (PDF, JPG, DICOM)</p>
                    <p className="text-xs text-slate-400 mt-1">Simulated - No file will be uploaded</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="block text-xs text-slate-500">Total Cost</span>
                        <span className="text-xl font-bold text-slate-900">$40.00</span>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !symptoms}
                        className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-bold transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
                        Submit Case
                    </button>
                </div>
             </form>
          </div>
        ) : (
          <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-4">My Medical Cases</h2>
              {myCases.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
                      You have no cases history.
                  </div>
              )}
              {myCases.map(c => {
                  const reviewer = users.find(u => u.id === c.opinion?.doctorId);
                  return (
                    <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg text-slate-900">{c.specialty}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                        c.status === CaseStatus.OPEN ? 'bg-blue-100 text-blue-700' :
                                        c.status === CaseStatus.CLOSED ? 'bg-green-100 text-green-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {c.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                            </div>
                            {c.opinion && (
                                <div className="text-right">
                                    <div className="text-sm text-slate-500">Reviewed By</div>
                                    <button 
                                        onClick={() => reviewer && setSelectedDoctor(reviewer)}
                                        className="font-bold text-slate-900 hover:text-primary-600 hover:underline flex items-center justify-end gap-2"
                                    >
                                        {reviewer?.avatarUrl && (
                                            <img src={reviewer.avatarUrl} alt="doc" className="w-6 h-6 rounded-full" />
                                        )}
                                        {c.opinion.doctorName}
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-lg mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Your Symptoms</h4>
                            <p className="text-slate-800 text-sm">{c.symptoms}</p>
                        </div>

                        {c.opinion && (
                            <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <h4 className="font-bold text-green-800">Doctor's Opinion</h4>
                                </div>
                                <div className="text-sm font-bold mb-1 text-slate-700">Decision: {c.opinion.decision}</div>
                                <p className="text-slate-800 text-sm italic">"{c.opinion.notes}"</p>
                            </div>
                        )}

                        {/* Rating UI for Closed Cases */}
                        {c.status === CaseStatus.CLOSED && c.opinion && !c.patientRating && (
                             <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <p className="text-sm font-bold text-slate-700 mb-2">How was your experience?</p>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(star => (
                                        <button 
                                            key={star} 
                                            onClick={() => rateDoctor(c.id, star)}
                                            className="p-1 hover:scale-110 transition group"
                                            title={`Rate ${star} Stars`}
                                        >
                                            <Star className="h-6 w-6 text-yellow-300 hover:text-yellow-500 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {c.patientRating && (
                            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-yellow-600">
                                <Star className="h-4 w-4 fill-current" />
                                <span>You rated this consultation {c.patientRating}/5</span>
                            </div>
                        )}
                    </div>
                  );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;