import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { DOCTOR_DETAILS_AR } from '../constants';
import { Search, MapPin, Star, Building2, ArrowRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FindDoctors = () => {
  const { users, t, currentUser, language } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // 1. Get Base Doctors
  const baseDoctors = users.filter(u => u.role === UserRole.DOCTOR);

  // 2. Localize Data if Arabic
  const doctors = baseDoctors.map(doc => {
    if (language === 'ar' && DOCTOR_DETAILS_AR[doc.id]) {
      return {
        ...doc,
        name: DOCTOR_DETAILS_AR[doc.id].name,
        specialty: DOCTOR_DETAILS_AR[doc.id].specialty,
        hospital: DOCTOR_DETAILS_AR[doc.id].hospital,
        country: DOCTOR_DETAILS_AR[doc.id].country
      };
    }
    return doc;
  });

  // 3. Get Unique Locations from the *localized* list
  const uniqueLocations = Array.from(new Set(doctors.map(d => d.country).filter(Boolean))) as string[];
  
  // 4. Filter on Localized Data
  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.specialty && d.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.hospital && d.hospital.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation = !locationFilter || d.country === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  const handleBook = () => {
    if (currentUser) {
        navigate('/patient');
    } else {
        // In a real app, this would open login modal or go to login page
        // For this demo, we'll redirect to landing where login buttons are
        navigate('/');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <section className="text-center max-w-4xl mx-auto pt-8">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">
          {t('findDoc.title')}
        </h1>
        
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 px-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                    type="text"
                    placeholder={t('findDoc.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-4 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary-500 outline-none text-base"
                />
            </div>
            <div className="relative md:w-64">
                <MapPin className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-8 py-4 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary-500 outline-none text-base appearance-none bg-white cursor-pointer"
                >
                    <option value="">{t('findDoc.allLocations')}</option>
                    {uniqueLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
                {/* Custom arrow for select */}
                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="h-4 w-4 text-slate-400" />
                </div>
            </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => (
                <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200"></div>
                    <div className="px-6 pb-6 flex-1 flex flex-col">
                        <div className="relative -mt-12 mb-4">
                            <img 
                                src={doc.avatarUrl} 
                                alt={doc.name} 
                                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                            <div className="text-primary-600 font-medium text-sm mb-3">{doc.specialty}</div>
                            
                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 shrink-0" />
                                    <span>{doc.hospital}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span>{doc.country}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded font-bold text-sm">
                                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                {doc.rating}
                            </div>
                            <button 
                                onClick={handleBook}
                                className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
                            >
                                {t('findDoc.book')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {filteredDoctors.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-400">
                    {t('findDoc.noResults')}
                </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default FindDoctors;