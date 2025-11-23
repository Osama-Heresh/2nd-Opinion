import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HipaaCompliance from './pages/HipaaCompliance';
import HowItWorks from './pages/HowItWorks';
import Reviews from './pages/Reviews';
import { UserRole } from './types';
import { 
  Activity, Languages, LogOut, Wallet, 
  Facebook, Twitter, Instagram, Linkedin, 
  Mail, Phone, MapPin, ChevronRight, Heart,
  Menu, X
} from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children?: React.ReactNode, role?: UserRole }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" />;
  if (role && currentUser.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const Header = () => {
  const { currentUser, logout, language, toggleLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 border-b ${isLanding ? 'bg-white/95 backdrop-blur-md border-slate-200/50 supports-[backdrop-filter]:bg-white/80' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-10">
                {/* Always link to root/landing */}
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group">
                   <div className="bg-primary-600 rounded-lg p-1.5 shadow-sm group-hover:shadow-glow transition-all duration-300">
                     <Activity className="h-6 w-6 text-white" />
                   </div>
                   <span className="text-xl font-display font-bold text-slate-900 tracking-tight">{t('app.title')}</span>
                </Link>
                
                {/* Desktop Nav Links (Public) */}
                {!currentUser && (
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <Link to="/how-it-works" className="hover:text-primary-600 transition">{t('nav.howItWorks')}</Link>
                        <Link to="/" className="hover:text-primary-600 transition">{t('nav.specialists')}</Link>
                        <Link to="/reviews" className="hover:text-primary-600 transition">{t('nav.reviews')}</Link>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLanguage}
                className="p-2 text-slate-500 hover:text-secondary-600 transition-colors flex items-center gap-1 hover:bg-slate-50 rounded-md"
                aria-label="Toggle Language"
              >
                <Languages className="h-5 w-5" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>

              {currentUser ? (
                <>
                  <div className="hidden md:flex flex-col items-end mr-2 border-r border-slate-200 pr-4">
                    <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                    <span className="text-xs text-slate-500 capitalize">{t(`role.${currentUser.role.toLowerCase()}`) || currentUser.role}</span>
                  </div>
                   <div className="flex items-center gap-1 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-100 shadow-sm">
                    <Wallet className="h-4 w-4 text-secondary-600" />
                    <span className="text-sm font-bold text-secondary-700">${currentUser.walletBalance.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={logout} 
                    className="ml-2 p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                    title={t('nav.logout')}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                    <Link to="/" className="hidden md:block text-sm font-bold text-slate-600 hover:text-primary-600 px-3 py-2.5">{t('nav.login')}</Link>
                    <Link to="/" className="text-sm font-bold bg-primary-600 text-white px-5 py-2.5 rounded-full hover:bg-primary-700 transition shadow-lg shadow-primary-200">{t('nav.getStarted')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}

const Footer = () => {
    const { t } = useApp();
    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-primary-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                         <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition">
                            <div className="bg-primary-600 rounded p-1">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold tracking-tight">{t('app.title')}</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {t('footer.desc')}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white hover:bg-slate-800 transition p-2 rounded-full"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white hover:bg-slate-800 transition p-2 rounded-full"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white hover:bg-slate-800 transition p-2 rounded-full"><Linkedin className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white hover:bg-slate-800 transition p-2 rounded-full"><Instagram className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 font-display">{t('footer.platform')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/how-it-works" className="hover:text-secondary-400 transition flex items-center gap-2"><ChevronRight className="h-3 w-3 text-slate-600" /> {t('nav.howItWorks')}</Link></li>
                            <li><Link to="/" className="hover:text-secondary-400 transition flex items-center gap-2"><ChevronRight className="h-3 w-3 text-slate-600" /> {t('link.findDoctor')}</Link></li>
                            <li><Link to="/reviews" className="hover:text-secondary-400 transition flex items-center gap-2"><ChevronRight className="h-3 w-3 text-slate-600" /> {t('nav.reviews')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-6 font-display">{t('footer.legal')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-secondary-400 transition flex items-center gap-2"><ChevronRight className="h-3 w-3 text-slate-600" /> {t('link.privacy')}</a></li>
                            <li><a href="#" className="hover:text-secondary-400 transition flex items-center gap-2"><ChevronRight className="h-3 w-3 text-slate-600" /> {t('link.terms')}</a></li>
                            <li><Link to="/hipaa-compliance" className="hover:text-secondary-400 transition flex items-center gap-2"><ChevronRight className="h-3 w-3 text-slate-600" /> {t('link.hipaa')}</Link></li>
                            <li><a href="#" className="hover:text-secondary-400 transition flex items-center gap-2"><ChevronRight className="h-3 w-3 text-slate-600" /> {t('link.help')}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6 font-display">{t('footer.contact')}</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                                <span>123 Medical Center Dr.<br/>Dubai Healthcare City, UAE</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-secondary-500 shrink-0" />
                                <span>+971 4 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-secondary-500 shrink-0" />
                                <span>support@2ndopinion.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-800 bg-slate-950 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} {t('app.title')}. {t('footer.rights')}</p>
                    <div className="flex items-center gap-1">
                        <span>{t('footer.madeWith')}</span>
                        <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                        <span>{t('footer.forHealth')}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// Layout Shell
const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/hipaa-compliance" element={<HipaaCompliance />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route 
              path="/patient" 
              element={
                <ProtectedRoute role={UserRole.PATIENT}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor" 
              element={
                <ProtectedRoute role={UserRole.DOCTOR}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role={UserRole.ADMIN}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;