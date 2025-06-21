'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabaseclient';

type DBUser = {
  id: string;
  email_id: string;
  first_name: string;
  last_name: string;
  [key: string]: any;
};

type UserContextType = {
  dbUser: DBUser | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvide = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserWithDB = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const email = user.primaryEmailAddress.emailAddress;
    setLoading(true);

    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('User')
        .select('*')
        .eq('email_id', email)
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        return;
      }

      if (existingUser) {
        setDbUser(existingUser);
        return;
      }

      const { data: newUser, error: insertError } = await supabase
        .from('User')
        .insert([
          {
            email_id: email,
            first_name: user.firstName || '',
            last_name: user.lastName || '',
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting new user:', insertError);
      } else {
        setDbUser(newUser);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      syncUserWithDB();
    }
  }, [isLoaded, user, syncUserWithDB]);

  return (
    <UserContext.Provider value={{ dbUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
