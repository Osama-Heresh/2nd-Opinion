
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Case, CaseStatus, User } from '../types';
import { Check, FileSearch, Loader2, DollarSign, Trophy, Clock, CheckCircle, AlertCircle, ChevronRight, Star, Award, Settings, Upload, Save, User as UserIcon } from 'lucide-react';
import { analyzeCaseForDoctor } from '../services/geminiService';

const DoctorDashboard = () => {
  const { currentUser, cases, users, submitOpinion, updateUserProfile, t } = useApp();
  const [activeTab, setActiveTab] = useState<'available' | 'closed' | 'settings'>('available');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  
  // Review Form State
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState<'Agree'|'Disagree'|'MoreTests'>('Agree');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
      avatarUrl: '',
      bio: '',
      hospital: '',
      country: '',
      linkedin: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Derived Data
  const availableCases = cases.filter(c => 
    c.status === CaseStatus.OPEN && 
    (c.assignedDoctorId === currentUser?.id || (!c.assignedDoctorId && c.specialty === currentUser?.specialty))
  );

  const myClosedCases = cases.filter(c => c.opinion?.doctorId === currentUser?.id);

  // Rank Calculation Strategy: Score = (Cases * 10) + Bonus Points
  const calculateScore = (u: User) => ((u.casesClosed || 0) * 10) + (u.bonusPoints || 0);
  
  const doctors = users.filter(u => u.role === 'DOCTOR').sort((a,b) => calculateScore(b) - calculateScore(a));
  const myRank = doctors.findIndex(u => u.id === currentUser?.id) + 1;
  const myScore = currentUser ? calculateScore(currentUser) : 0;
  
  // Calculate points needed for next rank
  let nextRankMessage = "";
  if (myRank > 1) {
      const prevDoc = doctors[myRank - 2];
      const pointsDiff = calculateScore(prevDoc) - myScore + 1;
      nextRankMessage = `${pointsDiff} pts to #${myRank - 1}`;
  } else {
      nextRankMessage = "You are #1!";
  }

  useEffect(() => {
    setSelectedCase(null);
  }, [activeTab]);

  // Load current user data into settings form when settings tab is active
  useEffect(() => {
    if (activeTab === 'settings' && currentUser) {
        setSettingsForm({
            avatarUrl: currentUser.avatarUrl || '',
            bio: currentUser.bio || '',
            hospital: currentUser.hospital || '',
            country: currentUser.country || '',
            linkedin: currentUser.linkedin || ''
        });
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    let isMounted = true;
    if (selectedCase && selectedCase.status === CaseStatus.OPEN) {
        setLoadingAi(true);
        setAiAnalysis('');
        analyzeCaseForDoctor(selectedCase).then(res => {
            if(isMounted) {
                setAiAnalysis(res);
                setLoadingAi(false);
            }
        });
    } else {
        setAiAnalysis('');
        setLoadingAi(false);
    }
    return () => { isMounted = false; };
  }, [selectedCase]);

  const handleSelectCase = (c: Case) => {
    setSelectedCase(c);
    if (c.status === CaseStatus.OPEN) {
        setNotes('');
        setDecision('Agree');
    }
  };

  const handleSubmitOpinion = async () => {
    if (!selectedCase || !currentUser) return;
    await submitOpinion(selectedCase.id, {
        doctorId: currentUser.id,
        doctorName: currentUser.name,
        decision,
        notes,
        createdAt: new Date().toISOString()
    });
    setSelectedCase(null);
    setActiveTab('closed'); // Switch to history to see the result
  };

  const handleSimulateAvatarUpload = () => {
    // Pick a random doctor avatar for demo purposes
    const randomId = Math.floor(Math.random() * 70) + 1;
    const fakeUrl = `https://i.pravatar.cc/300?img=${randomId}`;
    setSettingsForm({ ...settingsForm, avatarUrl: fakeUrl });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      setIsSaving(true);
      setSaveSuccess(false);

      // Simulate API delay
      setTimeout(async () => {
          await updateUserProfile(currentUser.id, settingsForm);
          setIsSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
      }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-sm text-slate-500 font-medium">Wallet Balance</p>
              <p className="text-3xl font-bold text-slate-900">${currentUser?.walletBalance.toFixed(2)}</p>
           </div>
           <div className="bg-green-100 p-3 rounded-full">
               <DollarSign className="h-6 w-6 text-green-600" />
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-sm text-slate-500 font-medium">Cases Closed</p>
              <p className="text-3xl font-bold text-slate-900">{currentUser?.casesClosed || 0}</p>
           </div>
           <div className="bg-blue-100 p-3 rounded-full">
               <CheckCircle className="h-6 w-6 text-blue-600" />
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-sm text-slate-500 font-medium">Global Rank</p>
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-slate-900">#{myRank}</p>
                <p className="text-xs text-slate-400">{nextRankMessage}</p>
              </div>
           </div>
           <div className="bg-yellow-100 p-3 rounded-full">
               <Trophy className="h-6 w-6 text-yellow-600" />
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-sm text-slate-500 font-medium">Avg. Rating</p>
              <p className="text-3xl font-bold text-slate-900">{currentUser?.rating?.toFixed(1) || 'N/A'}</p>
           </div>
           <div className="bg-orange-100 p-3 rounded-full">
               <Star className="h-6 w-6 text-orange-600" />
           </div>
        </div>
        {/* Settings Button */}
        <button 
           onClick={() => setActiveTab('settings')}
           className={`p-6 rounded-xl shadow-sm border flex flex-col items-center justify-center gap-2 transition ${activeTab === 'settings' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
        >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-bold uppercase">{t('settings.title')}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[650px] flex flex-col">
           {activeTab !== 'settings' ? (
             <>
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('available')}
                        className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition hover:bg-slate-50 ${activeTab === 'available' ? 'border-primary-500 text-primary-700' : 'border-transparent text-slate-500'}`}
                    >
                        Available ({availableCases.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('closed')}
                        className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition hover:bg-slate-50 ${activeTab === 'closed' ? 'border-primary-500 text-primary-700' : 'border-transparent text-slate-500'}`}
                    >
                        My History ({myClosedCases.length})
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 p-2 space-y-2 bg-slate-50/50">
                    {activeTab === 'available' ? (
                        availableCases.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="bg-slate-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <Check className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-medium">No new cases.</p>
                                <p className="text-xs text-slate-400 mt-1">Great job! You're all caught up.</p>
                            </div>
                        ) : (
                            availableCases.map(c => {
                                const isDirect = c.assignedDoctorId === currentUser?.id;
                                return (
                                <div 
                                    key={c.id} 
                                    onClick={() => handleSelectCase(c)}
                                    className={`p-4 rounded-lg border cursor-pointer transition group relative ${
                                        selectedCase?.id === c.id 
                                            ? 'border-primary-500 bg-white shadow-md ring-1 ring-primary-100' 
                                            : isDirect 
                                                ? 'border-purple-200 bg-purple-50/50 hover:border-purple-300' 
                                                : 'border-slate-200 bg-white hover:border-primary-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{c.patientName}</span>
                                            {isDirect && (
                                                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                                    <Star className="h-3 w-3 fill-purple-700" /> Direct Request
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">{c.symptoms}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" /> $28.00
                                        </span>
                                        <ChevronRight className={`h-4 w-4 text-slate-300 transition ${selectedCase?.id === c.id ? 'text-primary-500' : 'group-hover:text-primary-400'}`} />
                                    </div>
                                </div>
                            )})
                        )
                    ) : (
                        myClosedCases.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <p className="text-slate-400">No history yet.</p>
                            </div>
                        ) : (
                                myClosedCases.map(c => (
                                <div 
                                    key={c.id} 
                                    onClick={() => handleSelectCase(c)}
                                    className={`p-4 rounded-lg border cursor-pointer transition ${selectedCase?.id === c.id ? 'border-primary-500 bg-white shadow-md' : 'border-slate-200 bg-white opacity-75 hover:opacity-100'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-slate-700">{c.patientName}</span>
                                        {c.opinion?.decision === 'Agree' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Agreed</span>}
                                        {c.opinion?.decision === 'Disagree' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">Disagreed</span>}
                                        {c.opinion?.decision === 'MoreTests' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">Info Req.</span>}
                                    </div>
                                    <div className="text-xs text-slate-400">Closed on {c.opinion?.createdAt ? new Date(c.opinion.createdAt).toLocaleDateString() : '-'}</div>
                                </div>
                            ))
                        )
                    )}
                </div>
             </>
           ) : (
             <div className="p-4 bg-slate-50 h-full flex flex-col">
                 <div className="font-bold text-slate-900 mb-4 px-2">Profile Management</div>
                 <button className="text-left px-4 py-3 bg-white rounded-lg border border-primary-500 text-primary-700 font-bold text-sm mb-2 shadow-sm">
                     Edit Profile
                 </button>
                 <button className="text-left px-4 py-3 bg-white rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-100 transition" disabled>
                     Change Password (N/A)
                 </button>
                 <button className="text-left px-4 py-3 bg-white rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-100 transition mt-2" disabled>
                     Notification Preferences (N/A)
                 </button>
             </div>
           )}
        </div>

        {/* Right Column (Detail or Settings Form) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[650px] overflow-y-auto flex flex-col relative">
            {activeTab === 'settings' ? (
                <div className="max-w-xl mx-auto w-full">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Settings className="h-6 w-6 text-slate-400" />
                        {t('settings.title')}
                    </h2>

                    {saveSuccess && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {t('settings.success')}
                        </div>
                    )}

                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img 
                                    src={settingsForm.avatarUrl || "https://via.placeholder.com/150"} 
                                    alt="Profile" 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm"
                                />
                                <button 
                                    type="button"
                                    onClick={handleSimulateAvatarUpload}
                                    className="absolute bottom-0 right-0 bg-white border border-slate-200 p-1.5 rounded-full shadow-sm hover:bg-slate-50"
                                    title={t('settings.changePhoto')}
                                >
                                    <Upload className="h-4 w-4 text-slate-600" />
                                </button>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{currentUser?.name}</h3>
                                <p className="text-slate-500 text-sm">{currentUser?.email}</p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.bio')}</label>
                            <textarea 
                                value={settingsForm.bio}
                                onChange={(e) => setSettingsForm({...settingsForm, bio: e.target.value})}
                                rows={4}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                                placeholder="Describe your expertise..."
                            />
                        </div>

                        {/* Hospital & Country */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.hospital')}</label>
                                <input 
                                    type="text"
                                    value={settingsForm.hospital}
                                    onChange={(e) => setSettingsForm({...settingsForm, hospital: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.country')}</label>
                                <input 
                                    type="text"
                                    value={settingsForm.country}
                                    onChange={(e) => setSettingsForm({...settingsForm, country: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.linkedin')}</label>
                            <input 
                                type="url"
                                value={settingsForm.linkedin}
                                onChange={(e) => setSettingsForm({...settingsForm, linkedin: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-70"
                            >
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                                {t('settings.updateBtn')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : selectedCase ? (
                <>
                    <div className="flex-1">
                        {/* Header */}
                        <div className="mb-6 flex justify-between items-start border-b border-slate-100 pb-4">
                             <div>
                                 <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedCase.patientName}</h2>
                                 <div className="flex items-center gap-2 text-sm text-slate-500">
                                     <span>Case ID: #{selectedCase.id.slice(-6)}</span>
                                     <span>•</span>
                                     <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-bold text-slate-700 uppercase">{selectedCase.specialty}</span>
                                 </div>
                             </div>
                             <div className="text-right">
                                 {selectedCase.status === CaseStatus.OPEN ? (
                                     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                                         <Clock className="h-4 w-4" /> Open for Review
                                     </span>
                                 ) : (
                                     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                                         <CheckCircle className="h-4 w-4" /> 
                                         {selectedCase.status === CaseStatus.PENDING_INFO ? 'Pending Info' : 'Closed'}
                                     </span>
                                 )}
                             </div>
                        </div>

                        {/* Clinical Data */}
                        <div className="space-y-4 mb-8">
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Patient Symptoms & History
                                </h4>
                                <p className="text-slate-900 leading-relaxed text-base">{selectedCase.symptoms}</p>
                            </div>
                            
                            {selectedCase.status === CaseStatus.OPEN && (
                                <div className="bg-purple-50 border border-purple-100 p-5 rounded-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        {/* Use a simple sparkle icon or relevant SVG */}
                                        <CheckCircle className="h-24 w-24 text-purple-600" /> 
                                    </div>
                                    <div className="flex items-center gap-2 mb-3 relative z-10">
                                        <Loader2 className="h-4 w-4 text-purple-600" />
                                        <h4 className="text-sm font-bold text-purple-800">AI Clinical Insights (Gemini)</h4>
                                    </div>
                                    {loadingAi ? (
                                        <div className="flex items-center gap-3 text-sm text-purple-600 py-2">
                                            <Loader2 className="animate-spin h-5 w-5" /> 
                                            <span>Analyzing symptoms and generating differential diagnosis...</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed relative z-10 bg-white/50 p-3 rounded border border-purple-100/50">{aiAnalysis}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Result View (If Closed) */}
                        {selectedCase.status !== CaseStatus.OPEN && selectedCase.opinion && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Your Submitted Opinion
                                </h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white p-3 rounded border border-green-100">
                                        <span className="text-xs text-slate-500 uppercase font-bold block">Decision</span>
                                        <span className="font-bold text-slate-900">{selectedCase.opinion.decision === 'MoreTests' ? 'Requested Info' : selectedCase.opinion.decision}</span>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-green-100">
                                        <span className="text-xs text-slate-500 uppercase font-bold block">Submitted On</span>
                                        <span className="font-bold text-slate-900">{new Date(selectedCase.opinion.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded border border-green-100">
                                    <span className="text-xs text-slate-500 uppercase font-bold block mb-2">
                                        {selectedCase.opinion.decision === 'MoreTests' ? 'Requested Information' : 'Clinical Notes'}
                                    </span>
                                    <p className="text-slate-800">{selectedCase.opinion.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Console (If Open) */}
                    {selectedCase.status === CaseStatus.OPEN && (
                        <div className="mt-6 bg-slate-900 p-6 rounded-xl text-white shadow-xl">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <FileSearch className="h-5 w-5 text-primary-400" />
                                Formulation
                            </h3>
                            
                            <div className="flex gap-3 mb-4">
                                <button 
                                    onClick={() => setDecision('Agree')}
                                    className={`flex-1 py-3 rounded-lg font-medium border transition-all ${decision === 'Agree' ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/20' : 'border-slate-700 hover:bg-slate-800 text-slate-300'}`}
                                >
                                    Agree
                                </button>
                                <button 
                                    onClick={() => setDecision('Disagree')}
                                    className={`flex-1 py-3 rounded-lg font-medium border transition-all ${decision === 'Disagree' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20' : 'border-slate-700 hover:bg-slate-800 text-slate-300'}`}
                                >
                                    Disagree
                                </button>
                                <button 
                                    onClick={() => setDecision('MoreTests')}
                                    className={`flex-1 py-3 rounded-lg font-medium border transition-all ${decision === 'MoreTests' ? 'bg-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-900/20' : 'border-slate-700 hover:bg-slate-800 text-slate-300'}`}
                                >
                                    Request More Tests
                                </button>
                            </div>

                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={decision === 'MoreTests' ? "Please list the specific tests, labs, or history records required to complete the diagnosis..." : "Provide your detailed medical opinion, reasoning, and next steps..."}
                                className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-4 h-32 mb-4 focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-slate-500 resize-none text-sm"
                            />

                            <button 
                                onClick={handleSubmitOpinion}
                                disabled={!notes}
                                className="w-full bg-white text-slate-900 py-4 rounded-lg font-bold hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="text-primary-600 bg-primary-50 p-1 rounded-full">
                                    {decision === 'MoreTests' ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                </span>
                                {decision === 'MoreTests' ? "Submit Request (Status: Pending Info)" : "Submit Opinion & Earn $28.00"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="bg-slate-50 p-6 rounded-full mb-6">
                        <FileSearch className="h-16 w-16 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No Case Selected</h3>
                    <p className="text-sm max-w-xs text-center">Select a case from the list to view details, AI analysis, and submit your opinion.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
