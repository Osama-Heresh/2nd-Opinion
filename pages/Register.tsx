
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, Specialty } from '../types';
import { Activity, Loader2, AlertCircle, User, Stethoscope, Camera, Upload } from 'lucide-react';

const Register = () => {
  const { register, t } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      specialty: Specialty.GENERAL,
      hospital: '',
      country: '',
      linkedin: '',
      bio: '',
      avatarUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSimulateUpload = () => {
      // Pick a random doctor avatar for demo purposes
      const randomId = Math.floor(Math.random() * 70) + 1;
      const fakeUrl = `https://i.pravatar.cc/300?img=${randomId}`;
      setFormData({ ...formData, avatarUrl: fakeUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(async () => {
        const success = await register({
            ...formData,
            role,
            specialty: role === UserRole.DOCTOR ? formData.specialty : undefined,
            hospital: role === UserRole.DOCTOR ? formData.hospital : undefined,
            country: role === UserRole.DOCTOR ? formData.country : undefined,
            linkedin: role === UserRole.DOCTOR ? formData.linkedin : undefined,
            bio: role === UserRole.DOCTOR ? formData.bio : undefined,
            avatarUrl: role === UserRole.DOCTOR && formData.avatarUrl ? formData.avatarUrl : 'https://via.placeholder.com/200'
        });
        
        setLoading(false);
        if (success) {
            if (role === UserRole.PATIENT) {
                navigate('/patient');
            } else {
                // Doctors need approval
                alert("Account created! Please wait for admin approval before logging in.");
                navigate('/login');
            }
        } else {
            setError("Email already in use.");
        }
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-slate-900">
                {t('auth.registerTitle')}
            </h2>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
                onClick={() => setRole(UserRole.PATIENT)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition ${role === UserRole.PATIENT ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <User className="h-4 w-4" />
                {t('auth.registerPatient')}
            </button>
            <button
                onClick={() => setRole(UserRole.DOCTOR)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition ${role === UserRole.DOCTOR ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Stethoscope className="h-4 w-4" />
                {t('auth.registerDoctor')}
            </button>
        </div>
        
        <form className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.fullName')}</label>
                    <input name="name" type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email')}</label>
                    <input name="email" type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.password')}</label>
                    <input name="password" type="password" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" onChange={handleChange} />
                </div>

                {role === UserRole.DOCTOR && (
                    <>
                        <div className="pt-4 border-t border-slate-100 mt-2">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-4">Professional Details</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.photo')}</label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                            {formData.avatarUrl ? (
                                                <img src={formData.avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-8 w-8 text-slate-300" />
                                            )}
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={handleSimulateUpload}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                        >
                                            <Upload className="h-4 w-4" /> Upload Picture
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.specialty')}</label>
                                    <select name="specialty" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" onChange={handleChange}>
                                        {Object.values(Specialty).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.hospital')}</label>
                                        <input name="hospital" type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.country')}</label>
                                        <input name="country" type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" onChange={handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.linkedin')}</label>
                                    <input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.bio')}</label>
                                    <textarea name="bio" rows={3} placeholder="Briefly describe your experience..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none resize-none" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-70 mt-6"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t('auth.submitRegister')}
            </button>
            
            <div className="text-center text-sm">
                <span className="text-slate-500">{t('auth.alreadyAccount')} </span>
                <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500">
                    {t('auth.loginLink')}
                </Link>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Register;