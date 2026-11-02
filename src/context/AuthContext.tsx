import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/roles';
import { DEMO_ACCOUNTS, DemoAccount, DEMO_PASSWORD } from '../mock/users';

interface PendingMfa {
  account: DemoAccount;
  role: UserRole;
  expectedCode: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  pendingMfa: PendingMfa | null;
  loginError: string | null;
  login: (id: string, pass: string, selectedRole: UserRole) => Promise<boolean>;
  verifyMfa: (code: string) => boolean;
  cancelMfa: () => void;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'futureschool_authenticated_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [pendingMfa, setPendingMfa] = useState<PendingMfa | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const saveUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const login = async (id: string, pass: string, selectedRole: UserRole): Promise<boolean> => {
    setLoginError(null);
    const cleanId = id.trim().toUpperCase();

    // Find account matching ID and selected role (or shared student ID)
    const match = DEMO_ACCOUNTS.find(acc => {
      if (selectedRole === 'STUDENT' || selectedRole === 'PARENT') {
        return (acc.id === cleanId || cleanId === 'GVS-2027-0001') && acc.role === selectedRole;
      }
      return acc.id === cleanId && acc.role === selectedRole;
    });

    if (!match) {
      setLoginError(`No account found matching ID "${id}" for the role ${selectedRole}. Please check credentials.`);
      return false;
    }

    if (pass !== DEMO_PASSWORD && pass !== match.password) {
      setLoginError('Invalid password. Demo password is: ' + DEMO_PASSWORD);
      return false;
    }

    // Check if role requires MFA step (Principal / Admin)
    if (match.user.requiresMfa) {
      setPendingMfa({
        account: match,
        role: selectedRole,
        expectedCode: match.mfaCode || '849201'
      });
      return false; // Waiting for MFA
    }

    saveUser(match.user);
    return true;
  };

  const verifyMfa = (code: string): boolean => {
    if (!pendingMfa) return false;
    if (code.trim() === pendingMfa.expectedCode || code.trim() === '123456') {
      saveUser(pendingMfa.account.user);
      setPendingMfa(null);
      setLoginError(null);
      return true;
    } else {
      setLoginError('Invalid verification code. Enter ' + pendingMfa.expectedCode);
      return false;
    }
  };

  const cancelMfa = () => {
    setPendingMfa(null);
    setLoginError(null);
  };

  const logout = () => {
    saveUser(null);
    setPendingMfa(null);
    setLoginError(null);
  };

  const quickSwitchRole = (role: UserRole) => {
    const target = DEMO_ACCOUNTS.find(a => a.role === role);
    if (target) {
      saveUser(target.user);
      setPendingMfa(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        pendingMfa,
        loginError,
        login,
        verifyMfa,
        cancelMfa,
        logout,
        quickSwitchRole,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
