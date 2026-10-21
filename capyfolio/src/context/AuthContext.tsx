import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    institution: string;
    course: string;
    period: string;
    focus: string;
    tags: string[];
    bio: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const sessionUser = await authService.getCurrentUser();
      setCurrentUser(sessionUser);
      setIsReady(true);
    };

    hydrate();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    return user;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    institution: string;
    course: string;
    period: string;
    focus: string;
    tags: string[];
    bio: string;
  }) => {
    const user = await authService.register(data);
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      logout,
    }),
    [currentUser],
  );

  if (!isReady) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
