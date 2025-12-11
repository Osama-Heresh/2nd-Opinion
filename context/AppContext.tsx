
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Case, Transaction, UserRole, Language, CaseStatus, Opinion } from '../types';
import { MOCK_USERS, MOCK_CASES, TRANSLATIONS, DOCTOR_PAYOUT, CASE_FEE } from '../constants';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';

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
  const [users, setUsers] = useState<User[]>(() => supabase ? [] : loadState('app_users', MOCK_USERS));
  const [cases, setCases] = useState<Case[]>(() => supabase ? [] : loadState('app_cases', MOCK_CASES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => supabase ? [] : loadState('app_transactions', []));
  const [language, setLanguage] = useState<Language>(() => loadState('app_language', 'en'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize App (Check for Supabase Session or LocalStorage)
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);

      if (supabase) {
        // --- REAL AUTH MODE ---
        const { user } = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }

        // Fetch all users from DB
        const { data: allUsersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (allUsersData) {
          const mappedUsers = allUsersData.map((profile: any) => ({
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
          }));
          setUsers(mappedUsers);
        }

        // Fetch all cases from DB
        const { data: allCasesData } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
        if (allCasesData) {
          const mappedCases = allCasesData.map((c: any) => ({
            id: c.id,
            patientId: c.patient_id,
            patientName: c.patient_name,
            specialty: c.specialty,
            status: c.status as CaseStatus,
            symptoms: c.symptoms,
            files: c.files || [],
            createdAt: c.created_at,
            assignedDoctorId: c.assigned_doctor_id,
            opinion: c.opinion,
            patientRating: c.patient_rating,
            patientFeedback: c.patient_feedback,
            isRare: c.is_rare
          }));
          setCases(mappedCases);
        }

        // Fetch all transactions from DB
        const { data: allTransactionsData } = await supabase.from('transactions').select('*').order('timestamp', { ascending: false });
        if (allTransactionsData) {
          const mappedTransactions = allTransactionsData.map((tx: any) => ({
            id: tx.id,
            userId: tx.user_id,
            amount: tx.amount,
            type: tx.type,
            timestamp: tx.timestamp,
            description: tx.description,
            caseId: tx.case_id
          }));
          setTransactions(mappedTransactions);
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
    if (supabase) {
      const { unsubscribe } = authService.onAuthStateChange((user) => {
        setCurrentUser(user);
      });

      return () => {
        unsubscribe();
      };
    }
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
        if (!password) return "Password required.";

        try {
          const { user, error } = await authService.signIn(email, password);

          if (error) {
            console.error('Login error:', error);
            return error.message;
          }

          if (user) {
            setCurrentUser(user);

            try {
              const { data: allUsersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
              if (allUsersData) {
                const mappedUsers = allUsersData.map((profile: any) => ({
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
                }));
                setUsers(mappedUsers);
              }
            } catch (err) {
              console.error('Error loading users:', err);
            }

            try {
              const { data: allCasesData } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
              if (allCasesData) {
                const mappedCases = allCasesData.map((c: any) => ({
                  id: c.id,
                  patientId: c.patient_id,
                  patientName: c.patient_name,
                  specialty: c.specialty,
                  status: c.status as CaseStatus,
                  symptoms: c.symptoms,
                  files: c.files || [],
                  createdAt: c.created_at,
                  assignedDoctorId: c.assigned_doctor_id,
                  opinion: c.opinion,
                  patientRating: c.patient_rating,
                  patientFeedback: c.patient_feedback,
                  isRare: c.is_rare
                }));
                setCases(mappedCases);
              }
            } catch (err) {
              console.error('Error loading cases:', err);
            }

            try {
              const { data: allTransactionsData } = await supabase.from('transactions').select('*').order('timestamp', { ascending: false });
              if (allTransactionsData) {
                const mappedTransactions = allTransactionsData.map((tx: any) => ({
                  id: tx.id,
                  userId: tx.user_id,
                  amount: tx.amount,
                  type: tx.type,
                  timestamp: tx.timestamp,
                  description: tx.description,
                  caseId: tx.case_id
                }));
                setTransactions(mappedTransactions);
              }
            } catch (err) {
              console.error('Error loading transactions:', err);
            }

            return null;
          }

          return "Authentication failed.";
        } catch (error: any) {
          console.error('Unexpected login error:', error);
          return error.message || "An unexpected error occurred.";
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
    if (supabase) {
      await authService.signOut();
    }
    setCurrentUser(null);
    if (!supabase) localStorage.removeItem('app_currentUser');
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
     // 1. Try Real Auth
     if (supabase && userData.email && userData.password) {
        const { user, error } = await authService.signUp({
          email: userData.email,
          password: userData.password,
          name: userData.name || 'New User',
          role: userData.role || UserRole.PATIENT,
          avatarUrl: userData.avatarUrl,
          specialty: userData.specialty,
          hospital: userData.hospital,
          country: userData.country,
          linkedin: userData.linkedin,
          bio: userData.bio
        });

        if (error) {
          console.error("Registration Error:", error.message);
          return false;
        }

        if (user) {
          setUsers(prev => [user, ...prev]);
          if (user.isApproved) {
            setCurrentUser(user);
          }
          return true;
        }

        return false;
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

  const updateUserStatus = async (userId: string, isApproved: boolean) => {
      if (supabase) {
        await supabase.from('users').update({ is_approved: isApproved }).eq('id', userId);

        // Refetch users to ensure consistency
        const { data: allUsersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (allUsersData) {
          const mappedUsers = allUsersData.map((profile: any) => ({
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
          }));
          setUsers(mappedUsers);
        }
      } else {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved } : u));
      }
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

  const deleteUser = async (userId: string) => {
      if (supabase) {
        await supabase.from('users').delete().eq('id', userId);
        await supabase.auth.admin.deleteUser(userId);

        // Refetch users to ensure consistency
        const { data: allUsersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (allUsersData) {
          const mappedUsers = allUsersData.map((profile: any) => ({
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
          }));
          setUsers(mappedUsers);
        }
      } else {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
      if (currentUser?.id === userId) logout();
  };

  const resetDemo = () => {
    localStorage.clear();
    window.location.reload();
  };

  const depositFunds = async (amount: number) => {
    if (!currentUser) return;

    if (supabase) {
      // Update wallet balance in DB
      await supabase.from('users').update({
        wallet_balance: currentUser.walletBalance + amount
      }).eq('id', currentUser.id);

      // Create transaction in DB
      await supabase.from('transactions').insert({
        user_id: currentUser.id,
        amount: amount,
        type: 'DEPOSIT',
        description: 'Wallet Deposit'
      });
    }

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

      const newBalance = currentUser.walletBalance - amount;

      if (supabase) {
        await supabase.from('users').update({
          wallet_balance: newBalance
        }).eq('id', currentUser.id);

        await supabase.from('transactions').insert({
          user_id: currentUser.id,
          amount: -amount,
          type: 'PAYOUT',
          description: 'Funds Withdrawal'
        });
      }

      const updatedUser = { ...currentUser, walletBalance: newBalance };
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

    if (supabase) {
      // Deduct funds from wallet
      const newBalance = currentUser.walletBalance - CASE_FEE;
      await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', currentUser.id);

      // Create case in DB
      const { data: newCaseData } = await supabase.from('cases').insert({
        patient_id: currentUser.id,
        patient_name: currentUser.name,
        specialty: caseData.specialty,
        status: CaseStatus.OPEN,
        symptoms: caseData.symptoms || '',
        files: caseData.files || []
      }).select().single();

      // Create transaction in DB
      await supabase.from('transactions').insert({
        user_id: currentUser.id,
        amount: -CASE_FEE,
        type: 'CASE_FEE',
        description: `Case consultation fee`,
        case_id: newCaseData?.id
      });

      if (newCaseData) {
        const mappedCase: Case = {
          id: newCaseData.id,
          patientId: newCaseData.patient_id,
          patientName: newCaseData.patient_name,
          specialty: newCaseData.specialty,
          status: newCaseData.status as CaseStatus,
          symptoms: newCaseData.symptoms,
          files: newCaseData.files || [],
          createdAt: newCaseData.created_at
        };
        setCases(prev => [mappedCase, ...prev]);
      }

      const updatedUser = { ...currentUser, walletBalance: newBalance };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      return true;
    }

    // Fallback for demo mode
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - CASE_FEE };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));

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

    const newStatus = opinion.decision === 'MoreTests' ? CaseStatus.PENDING_INFO : CaseStatus.CLOSED;

    if (supabase) {
      // Update case in DB
      await supabase.from('cases').update({
        status: newStatus,
        opinion: opinion,
        assigned_doctor_id: currentUser.id,
        is_rare: isRare
      }).eq('id', caseId);

      if (opinion.decision !== 'MoreTests') {
        // Update doctor's wallet and cases closed
        const newBalance = currentUser.walletBalance + DOCTOR_PAYOUT;
        const newCasesClosed = (currentUser.casesClosed || 0) + 1;

        await supabase.from('users').update({
          wallet_balance: newBalance,
          cases_closed: newCasesClosed
        }).eq('id', currentUser.id);

        // Create transaction
        await supabase.from('transactions').insert({
          user_id: currentUser.id,
          amount: DOCTOR_PAYOUT,
          type: 'PAYOUT',
          description: `Payment for case #${caseId.slice(-6)}`,
          case_id: caseId
        });

        const updatedDoctor = {
          ...currentUser,
          walletBalance: newBalance,
          casesClosed: newCasesClosed
        };
        setCurrentUser(updatedDoctor);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedDoctor : u));
      }
    }

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: newStatus,
          opinion: opinion,
          assignedDoctorId: currentUser.id,
          isRare: isRare
        };
      }
      return c;
    }));
  };

  const rateDoctor = async (caseId: string, rating: number, feedback?: string) => {
    let doctorId: string | undefined;
    const updatedCases = cases.map(c => {
        if (c.id === caseId) {
            doctorId = c.opinion?.doctorId;
            return { ...c, patientRating: rating, patientFeedback: feedback };
        }
        return c;
    });
    setCases(updatedCases);

    if (supabase) {
      await supabase.from('cases').update({
        patient_rating: rating,
        patient_feedback: feedback
      }).eq('id', caseId);
    }

    if (!doctorId) return;
    const doctorCases = updatedCases.filter(c => c.opinion?.doctorId === doctorId && c.patientRating);
    const totalRating = doctorCases.reduce((acc, c) => acc + (c.patientRating || 0), 0);
    const newAverage = doctorCases.length > 0 ? totalRating / doctorCases.length : rating;
    const bonusAward = rating === 5 ? 5 : 0;

    if (supabase) {
      const doctor = users.find(u => u.id === doctorId);
      if (doctor) {
        await supabase.from('users').update({
          rating: parseFloat(newAverage.toFixed(1)),
          bonus_points: (doctor.bonusPoints || 0) + bonusAward
        }).eq('id', doctorId);
      }
    }

    setUsers(prev => prev.map(u => {
        if (u.id === doctorId) {
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
