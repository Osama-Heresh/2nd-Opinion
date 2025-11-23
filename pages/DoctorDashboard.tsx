import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Case, CaseStatus } from '../types';
import { Check, FileSearch, Loader2, DollarSign, Trophy, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { analyzeCaseForDoctor } from '../services/geminiService';

const DoctorDashboard = () => {
  const { currentUser, cases, users, submitOpinion } = useApp();
  const [activeTab, setActiveTab] = useState<'available' | 'closed'>('available');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  
  // Review Form State
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState<'Agree'|'Disagree'|'MoreTests'>('Agree');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Derived Data
  const availableCases = cases.filter(c => 
    c.status === CaseStatus.OPEN && 
    (c.assignedDoctorId === currentUser?.id || (!c.assignedDoctorId && c.specialty === currentUser?.specialty))
  );

  const myClosedCases = cases.filter(c => c.opinion?.doctorId === currentUser?.id);

  // Rank Calculation
  const doctors = users.filter(u => u.role === 'DOCTOR').sort((a,b) => (b.casesClosed || 0) - (a.casesClosed || 0));
  const myRank = doctors.findIndex(u => u.id === currentUser?.id) + 1;
  const nextRankCases = myRank > 1 ? (doctors[myRank - 2].casesClosed || 0) - (currentUser?.casesClosed || 0) + 1 : 0;

  useEffect(() => {
    setSelectedCase(null);
  }, [activeTab]);

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

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid md:grid-cols-3 gap-6">
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
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900">#{myRank}</p>
                {myRank > 1 && <p className="text-xs text-slate-400">({nextRankCases} to #{myRank - 1})</p>}
              </div>
           </div>
           <div className="bg-yellow-100 p-3 rounded-full">
               <Trophy className="h-6 w-6 text-yellow-600" />
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List Column */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[650px] flex flex-col">
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
                       availableCases.map(c => (
                           <div 
                            key={c.id} 
                            onClick={() => handleSelectCase(c)}
                            className={`p-4 rounded-lg border cursor-pointer transition group ${selectedCase?.id === c.id ? 'border-primary-500 bg-white shadow-md ring-1 ring-primary-100' : 'border-slate-200 bg-white hover:border-primary-300'}`}
                           >
                               <div className="flex justify-between items-start mb-2">
                                   <span className="font-bold text-slate-800">{c.patientName}</span>
                                   <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{new Date(c.createdAt).toLocaleDateString()}</span>
                               </div>
                               <p className="text-xs text-slate-600 line-clamp-2 mb-3">{c.symptoms}</p>
                               <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> $28.00
                                  </span>
                                  <ChevronRight className={`h-4 w-4 text-slate-300 transition ${selectedCase?.id === c.id ? 'text-primary-500' : 'group-hover:text-primary-400'}`} />
                               </div>
                           </div>
                       ))
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
        </div>

        {/* Detail Column */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[650px] overflow-y-auto flex flex-col relative">
            {selectedCase ? (
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
                                         <CheckCircle className="h-4 w-4" /> Closed
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
                                        <span className="font-bold text-slate-900">{selectedCase.opinion.decision}</span>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-green-100">
                                        <span className="text-xs text-slate-500 uppercase font-bold block">Submitted On</span>
                                        <span className="font-bold text-slate-900">{new Date(selectedCase.opinion.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded border border-green-100">
                                    <span className="text-xs text-slate-500 uppercase font-bold block mb-2">Clinical Notes</span>
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
                                    Request Info
                                </button>
                            </div>

                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Provide your detailed medical opinion, reasoning, and next steps..."
                                className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-4 h-32 mb-4 focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-slate-500 resize-none text-sm"
                            />

                            <button 
                                onClick={handleSubmitOpinion}
                                disabled={!notes}
                                className="w-full bg-white text-slate-900 py-4 rounded-lg font-bold hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="text-primary-600 bg-primary-50 p-1 rounded-full"><Check className="h-4 w-4" /></span>
                                Submit Opinion & Earn $28.00
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