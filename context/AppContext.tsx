
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Case, Transaction, UserRole, Language, CaseStatus, Opinion } from '../types';
import { MOCK_USERS, MOCK_CASES, TRANSLATIONS, DOCTOR_PAYOUT, CASE_FEE } from '../constants';
import { supabase } from '../services/supabase';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  cases: Case[];
  transactions: Transaction[];
  language: Language;
  isLoading: boolean;
  t: (key: string) => string;
  login: (email: string, password?: string) => Promise<string | null>;
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
  refreshUserBalance: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => loadState('app_users', MOCK_USERS));
  const [cases, setCases] = useState<Case[]>(() => loadState('app_cases', MOCK_CASES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('app_transactions', []));
  const [language, setLanguage] = useState<Language>(() => loadState('app_language', 'en'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize App (Check for Supabase Session or LocalStorage)
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      
      if (supabase) {
        // --- REAL AUTH MODE ---
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch full profile from DB
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profile) {
            // Map DB snake_case to TS camelCase
            const mappedUser: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role as UserRole,
                walletBalance: profile.wallet_balance || 0,
                avatarUrl: profile.avatar_url,
                isApproved: profile.is_approved,
                specialty: profile.specialty,
                hospital: profile.hospital,
                country: profile.country,
                linkedin: profile.linkedin,
                bio: profile.bio,
                rating: profile.rating,
                casesClosed: profile.cases_closed,
                bonusPoints: profile.bonus_points,
                createdAt: profile.created_at
            };
            setCurrentUser(mappedUser);
          }
        }
      } else {
        // --- DEMO MODE ---
        const localUser = loadState<User | null>('app_currentUser', null);
        if (localUser) setCurrentUser(localUser);
      }
      setIsLoading(false);
    };

    initApp();

    // Listen for Auth Changes (Supabase)
    const { data: authListener } = supabase?.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
        } else if (event === 'SIGNED_IN' && session?.user) {
             // Logic handled in initApp usually, but could force refetch here
        }
    }) || { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  // Persistence Effects (Only for Demo Mode mostly)
  useEffect(() => {
    if (!supabase) localStorage.setItem('app_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!supabase) localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!supabase) localStorage.setItem('app_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    if (!supabase) localStorage.setItem('app_transactions', JSON.stringify(transactions));
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
    // 1. Try Real Auth
    if (supabase) {
        if (!password) return "Password required for real auth.";
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        
        // Profile fetch handled by onAuthStateChange or reload, but let's manual fetch for speed
        if (data.user) {
             const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).maybeSingle();
             if (profile && !profile.is_approved) return "Account pending approval.";
             window.location.reload(); // Simple way to sync all states
             return null;
        }
    }

    // 2. Fallback to Mock Auth
    const user = users.find(u => u.email === email);
    
    if (!user) return "User not found.";
    if (password && user.password && user.password !== password) return "Invalid password.";
    if (!user.isApproved) return "Your account is pending admin approval.";

    setCurrentUser(user);
    return null; 
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
    if (!supabase) localStorage.removeItem('app_currentUser');
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
     // 1. Try Real Auth
     if (supabase && userData.email && userData.password) {
        // A. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
        });

        if (authError || !authData.user) {
            console.error("Supabase Auth Error:", authError);
            return false;
        }

        // B. Create User Record
        const { error: profileError } = await supabase.from('users').insert([{
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            is_approved: userData.role === UserRole.PATIENT, // Auto-approve patients
            avatar_url: userData.avatarUrl,
            specialty: userData.specialty,
            hospital: userData.hospital,
            country: userData.country,
            linkedin: userData.linkedin,
            bio: userData.bio
        }]);

        if (profileError) {
            console.error("Profile Creation Error:", profileError);
            return false;
        }
        return true;
     }

     // 2. Fallback Mock Auth
     if (users.find(u => u.email === userData.email)) return false;

     const newUser: User = {
         id: `u-${Date.now()}`,
         name: userData.name || 'New User',
         email: userData.email || '',
         password: userData.password || 'password123',
         role: userData.role || UserRole.PATIENT,
         walletBalance: 0,
         avatarUrl: userData.avatarUrl || 'https://via.placeholder.com/200',
         isApproved: userData.role === UserRole.PATIENT,
         createdAt: new Date().toISOString(),
         ...userData
     };

     setUsers(prev => [...prev, newUser]);
     if (newUser.isApproved) setCurrentUser(newUser);
     return true;
  };

  const updateUserStatus = (userId: string, isApproved: boolean) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved } : u));
      // In real app, would call supabase.from('users').update({ is_approved: isApproved }).eq('id', userId)
  };

  const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    if (supabase) {
        // Map back to snake_case for DB
        const dbUpdates: any = {};
        if (updates.bio) dbUpdates.bio = updates.bio;
        if (updates.hospital) dbUpdates.hospital = updates.hospital;
        if (updates.country) dbUpdates.country = updates.country;
        if (updates.linkedin) dbUpdates.linkedin = updates.linkedin;
        if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;

        await supabase.from('users').update(dbUpdates).eq('id', userId);
    }
    
    // Update local state for UI responsiveness
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    });
    setUsers(updatedUsers);
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const deleteUser = (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (currentUser?.id === userId) logout();
  };

  const resetDemo = () => {
    localStorage.clear();
    window.location.reload();
  };

  const depositFunds = (amount: number) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance + amount };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));

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

  const refreshUserBalance = async () => {
    if (!currentUser || !supabase) return;

    const { data: profile } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (profile) {
      const updatedUser = { ...currentUser, walletBalance: profile.wallet_balance || 0 };
      setCurrentUser(updatedUser);
    }
  };

  const withdrawFunds = async (amount: number): Promise<boolean> => {
      if (!currentUser || currentUser.walletBalance < amount) return false;
      const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - amount };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      
      const tx: Transaction = {
        id: `tx-wd-${Date.now()}`,
        userId: currentUser.id,
        amount: -amount,
        type: 'PAYOUT',
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
        const updatedDoctor = { 
          ...currentUser, 
          walletBalance: currentUser.walletBalance + DOCTOR_PAYOUT, 
          casesClosed: (currentUser.casesClosed || 0) + 1 
        };
        setCurrentUser(updatedDoctor);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedDoctor : u));
    }
  };

  const rateDoctor = (caseId: string, rating: number, feedback?: string) => {
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
    const doctorCases = updatedCases.filter(c => c.opinion?.doctorId === doctorId && c.patientRating);
    const totalRating = doctorCases.reduce((acc, c) => acc + (c.patientRating || 0), 0);
    const newAverage = doctorCases.length > 0 ? totalRating / doctorCases.length : rating;

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
      isLoading,
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
      refreshUserBalance,
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
