
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
  login: (email: string, password?: string) => Promise<string | null>; // Returns error string or null
  logout: () => void;
  register: (user: Partial<User>) => Promise<boolean>;
  updateUserStatus: (userId: string, isApproved: boolean) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => void;
  toggleLanguage: () => void;
  createCase: (newCase: Partial<Case>) => Promise<boolean>;
  submitOpinion: (caseId: string, opinion: Opinion, isRare?: boolean) => Promise<void>;
  rateDoctor: (caseId: string, rating: number, feedback?: string) => void;
  depositFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => Promise<boolean>;
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

  const login = async (email: string, password?: string): Promise<string | null> => {
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return "User not found.";
    }

    if (password && user.password && user.password !== password) {
        return "Invalid password.";
    }

    if (!user.isApproved) {
        return "Your account is pending admin approval.";
    }

    setCurrentUser(user);
    return null; // No error
  };

  const logout = () => setCurrentUser(null);

  const register = async (userData: Partial<User>): Promise<boolean> => {
     if (users.find(u => u.email === userData.email)) {
         return false; // User exists
     }

     const newUser: User = {
         id: `u-${Date.now()}`,
         name: userData.name || 'New User',
         email: userData.email || '',
         password: userData.password || 'password123',
         role: userData.role || UserRole.PATIENT,
         walletBalance: 0,
         avatarUrl: 'https://via.placeholder.com/200',
         isApproved: userData.role === UserRole.PATIENT, // Patients auto-approve, doctors need approval
         createdAt: new Date().toISOString(),
         ...userData // Spread ensures fields like linkedin, bio, etc are included
     };

     setUsers(prev => [...prev, newUser]);
     // Log them in immediately if patient, else wait for approval
     if (newUser.isApproved) {
         setCurrentUser(newUser);
     }
     return true;
  };

  const updateUserStatus = (userId: string, isApproved: boolean) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved } : u));
  };

  const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    
    // If updating self, update currentUser state too
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const deleteUser = (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
      // Also cleanup auth if deleting self (rare)
      if (currentUser?.id === userId) logout();
  };

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

  const withdrawFunds = async (amount: number): Promise<boolean> => {
      if (!currentUser) return false;
      if (currentUser.walletBalance < amount) return false;

      // Deduct funds
      const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - amount };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));

      // Log transaction
      const tx: Transaction = {
        id: `tx-wd-${Date.now()}`,
        userId: currentUser.id,
        amount: -amount,
        type: 'PAYOUT', // Reusing PAYOUT type, or could add WITHDRAWAL
        timestamp: new Date().toISOString(),
        description: 'Funds Withdrawal'
      };
      setTransactions(prev => [tx, ...prev]);
      return true;
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

  const submitOpinion = async (caseId: string, opinion: Opinion, isRare: boolean = false) => {
    if (!currentUser || currentUser.role !== UserRole.DOCTOR) return;

    // Update Case
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: opinion.decision === 'MoreTests' ? CaseStatus.PENDING_INFO : CaseStatus.CLOSED,
          opinion: opinion,
          assignedDoctorId: currentUser.id,
          isRare: isRare
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

  const rateDoctor = (caseId: string, rating: number, feedback?: string) => {
    // 1. Update the Case with the new rating
    let doctorId: string | undefined;

    const updatedCases = cases.map(c => {
        if (c.id === caseId) {
            doctorId = c.opinion?.doctorId;
            return { ...c, patientRating: rating, patientFeedback: feedback };
        }
        return c;
    });
    setCases(updatedCases);

    if (!doctorId) return;

    // 2. Recalculate Doctor's Average Rating
    const doctorCases = updatedCases.filter(c => c.opinion?.doctorId === doctorId && c.patientRating);
    const totalRating = doctorCases.reduce((acc, c) => acc + (c.patientRating || 0), 0);
    const newAverage = doctorCases.length > 0 ? totalRating / doctorCases.length : rating;

    // 3. Update the Doctor User Object & Award Bonus Points for 5-Star Ratings
    setUsers(prev => prev.map(u => {
        if (u.id === doctorId) {
            const bonusAward = rating === 5 ? 5 : 0;
            return { 
              ...u, 
              rating: parseFloat(newAverage.toFixed(1)),
              bonusPoints: (u.bonusPoints || 0) + bonusAward
            };
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
      register,
      updateUserStatus,
      updateUserProfile,
      deleteUser,
      toggleLanguage,
      createCase,
      submitOpinion,
      rateDoctor,
      depositFunds,
      withdrawFunds,
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
