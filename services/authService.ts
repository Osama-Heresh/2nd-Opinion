import { supabase } from './supabase';
import { User, UserRole } from '../types';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

const mapDbUserToUser = (dbUser: any): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role as UserRole,
    walletBalance: Number(dbUser.wallet_balance) || 0,
    avatarUrl: dbUser.avatar_url,
    isApproved: dbUser.is_approved,
    specialty: dbUser.specialty,
    hospital: dbUser.hospital,
    country: dbUser.country,
    linkedin: dbUser.linkedin,
    bio: dbUser.bio,
    rating: Number(dbUser.rating) || 0,
    casesClosed: dbUser.cases_closed || 0,
    bonusPoints: dbUser.bonus_points || 0,
    createdAt: dbUser.created_at
  };
};

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
      return {
        user: null,
        error: { message: 'Database connection not available' }
      };
    }

    try {
      const normalizedEmail = email.toLowerCase().trim();

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password.trim()
      });

      if (authError) {
        return {
          user: null,
          error: { message: authError.message, code: authError.code }
        };
      }

      if (!authData.user) {
        return {
          user: null,
          error: { message: 'Authentication failed' }
        };
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        await supabase.auth.signOut();
        return {
          user: null,
          error: { message: 'Failed to load profile' }
        };
      }

      if (!profile) {
        await supabase.auth.signOut();
        return {
          user: null,
          error: { message: 'Profile not found' }
        };
      }

      if (!profile.is_approved) {
        await supabase.auth.signOut();
        return {
          user: null,
          error: { message: 'Your account is pending approval' }
        };
      }

      return {
        user: mapDbUserToUser(profile),
        error: null
      };
    } catch (error: any) {
      return {
        user: null,
        error: { message: error.message || 'Login failed' }
      };
    }
  },

  async signUp(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    specialty?: string;
    hospital?: string;
    country?: string;
    linkedin?: string;
    bio?: string;
  }): Promise<AuthResult> {
    if (!supabase) {
      return {
        user: null,
        error: { message: 'Database connection not available' }
      };
    }

    try {
      const normalizedEmail = userData.email.toLowerCase().trim();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: userData.password
      });

      if (authError) {
        return {
          user: null,
          error: { message: authError.message, code: authError.code }
        };
      }

      if (!authData.user) {
        return {
          user: null,
          error: { message: 'Failed to create account' }
        };
      }

      const isApproved = userData.role === UserRole.PATIENT;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: normalizedEmail,
          name: userData.name,
          role: userData.role,
          is_approved: isApproved,
          avatar_url: userData.avatarUrl,
          specialty: userData.specialty,
          hospital: userData.hospital,
          country: userData.country,
          linkedin: userData.linkedin,
          bio: userData.bio
        })
        .select()
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        return {
          user: null,
          error: { message: 'Failed to create profile' }
        };
      }

      if (!isApproved) {
        await supabase.auth.signOut();
      }

      return {
        user: mapDbUserToUser(profile),
        error: null
      };
    } catch (error: any) {
      return {
        user: null,
        error: { message: error.message || 'Registration failed' }
      };
    }
  },

  async signOut(): Promise<{ error: AuthError | null }> {
    if (!supabase) {
      return { error: { message: 'Database connection not available' } };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: { message: error.message } };
      }
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Failed to sign out' } };
    }
  },

  async getCurrentUser(): Promise<AuthResult> {
    if (!supabase) {
      return { user: null, error: null };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        return { user: null, error: null };
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        return { user: null, error: null };
      }

      return {
        user: mapDbUserToUser(profile),
        error: null
      };
    } catch (error: any) {
      return { user: null, error: null };
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    if (!supabase) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_OUT') {
          callback(null);
        } else if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            callback(mapDbUserToUser(profile));
          } else {
            callback(null);
          }
        }
      })();
    });

    return { unsubscribe: () => subscription.unsubscribe() };
  }
};
