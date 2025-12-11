
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { Activity, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, t } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const err = await login(email.trim(), password);

      if (err) {
        setError(err);
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <div className="inline-block bg-primary-600 rounded-xl p-3 shadow-lg shadow-primary-500/30 mb-4">
                <Activity className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-2 text-3xl font-display font-bold text-slate-900 tracking-tight">
                {t('auth.loginTitle')}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
                {t('auth.loginDesc')}
            </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        {t('auth.email')}
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                        {t('auth.password')}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t('auth.submitLogin')}
                </button>
            </div>
            
            <div className="text-center text-sm">
                <span className="text-slate-500">{t('auth.noAccount')} </span>
                <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500">
                    {t('auth.registerLink')}
                </Link>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
