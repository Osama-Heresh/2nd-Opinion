import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Case, Transaction, UserRole, Language, CaseStatus, Opinion } from '../types';
import { MOCK_USERS, MOCK_CASES, TRANSLATIONS, CASE_FEE, DOCTOR_PAYOUT, PLATFORM_FEE } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  cases: Case[];
  transactions: Transaction[];
  language: Language;
  t: (key: string) => string;
  login: (email: string) => void;
  logout: () => void;
  toggleLanguage: () => void;
  createCase: (newCase: Partial<Case>) => Promise<boolean>;
  submitOpinion: (caseId: string, opinion: Opinion) => Promise<void>;
  rateDoctor: (caseId: string, rating: number) => void;
  depositFunds: (amount: number) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to safe load from local storage
const loadState = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage`, error);
    return fallback;
  }
};

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize state from LocalStorage or Fallback Mock Data
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('app_currentUser', null));
  const [users, setUsers] = useState<User[]>(() => loadState('app_users', MOCK_USERS));
  const [cases, setCases] = useState<Case[]>(() => loadState('app_cases', MOCK_CASES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('app_transactions', []));
  const [language, setLanguage] = useState<Language>(() => loadState('app_language', 'en'));

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('app_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('app_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('app_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('app_language', JSON.stringify(language));
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const resetDemo = () => {
    localStorage.clear();
    window.location.reload();
  };

  const depositFunds = (amount: number) => {
    if (!currentUser) return;
    
    // Update local user state and master users list
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance + amount };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));

    // Log transaction
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount: amount,
      type: 'DEPOSIT',
      timestamp: new Date().toISOString(),
      description: 'Wallet Deposit'
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const createCase = async (caseData: Partial<Case>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== UserRole.PATIENT) return false;

    if (currentUser.walletBalance < CASE_FEE) {
      alert("Insufficient funds. Please deposit $40.");
      return false;
    }

    // Deduct Funds
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - CASE_FEE };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));

    // Create Transaction (Escrow hold logic implied by deduction)
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount: -CASE_FEE,
      type: 'CASE_FEE',
      timestamp: new Date().toISOString(),
      description: `Case Creation Fee: ${caseData.specialty}`
    };
    setTransactions(prev => [tx, ...prev]);

    // Create Case
    const newCase: Case = {
      id: `c${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      specialty: caseData.specialty!,
      status: CaseStatus.OPEN,
      symptoms: caseData.symptoms || '',
      files: caseData.files || [],
      createdAt: new Date().toISOString(),
      ...caseData
    } as Case;

    setCases(prev => [newCase, ...prev]);
    return true;
  };

  const submitOpinion = async (caseId: string, opinion: Opinion) => {
    if (!currentUser || currentUser.role !== UserRole.DOCTOR) return;

    // Update Case
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: opinion.decision === 'MoreTests' ? CaseStatus.PENDING_INFO : CaseStatus.CLOSED,
          opinion: opinion,
          assignedDoctorId: currentUser.id
        };
      }
      return c;
    }));

    if (opinion.decision !== 'MoreTests') {
        // Payout to Doctor and increment cases closed
        const updatedDoctor = { 
          ...currentUser, 
          walletBalance: currentUser.walletBalance + DOCTOR_PAYOUT, 
          casesClosed: (currentUser.casesClosed || 0) + 1 
        };
        
        setCurrentUser(updatedDoctor);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedDoctor : u));

        // Log Payout
        const tx: Transaction = {
            id: `tx-payout-${Date.now()}`,
            userId: currentUser.id,
            amount: DOCTOR_PAYOUT,
            type: 'PAYOUT',
            timestamp: new Date().toISOString(),
            description: `Payout for Case #${caseId}`
        };
        setTransactions(prev => [tx, ...prev]);
    }
  };

  const rateDoctor = (caseId: string, rating: number) => {
    // 1. Update the Case with the new rating
    let doctorId: string | undefined;

    const updatedCases = cases.map(c => {
        if (c.id === caseId) {
            doctorId = c.opinion?.doctorId;
            return { ...c, patientRating: rating };
        }
        return c;
    });
    setCases(updatedCases);

    if (!doctorId) return;

    // 2. Recalculate Doctor's Average Rating
    const doctorCases = updatedCases.filter(c => c.opinion?.doctorId === doctorId && c.patientRating);
    const totalRating = doctorCases.reduce((acc, c) => acc + (c.patientRating || 0), 0);
    const newAverage = doctorCases.length > 0 ? totalRating / doctorCases.length : rating;

    // 3. Update the Doctor User Object
    setUsers(prev => prev.map(u => {
        if (u.id === doctorId) {
            return { ...u, rating: parseFloat(newAverage.toFixed(1)) };
        }
        return u;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      cases,
      transactions,
      language,
      t,
      login,
      logout,
      toggleLanguage,
      createCase,
      submitOpinion,
      rateDoctor,
      depositFunds,
      resetDemo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};