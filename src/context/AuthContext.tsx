import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '../types/roles';
import { DEMO_ACCOUNTS, DemoAccount, DEMO_PASSWORD } from '../mock/users';
import { AuthToken, createSimulatedJwt, PasswordResetResponse } from '../types/auth';

interface PendingMfa {
  account: DemoAccount;
  role: UserRole;
  expectedCode: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  token: AuthToken | null;
  pendingMfa: PendingMfa | null;
  loginError: string | null;
  login: (id: string, pass: string, selectedRole: UserRole) => Promise<boolean>;
  verifyMfa: (code: string) => boolean;
  cancelMfa: () => void;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  getAuthHeader: () => Record<string, string>;
  requestPasswordReset: (identifier: string) => Promise<PasswordResetResponse>;
  verifyResetOtp: (identifier: string, otp: string) => boolean;
  confirmPasswordReset: (identifier: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AUTH_USER_KEY = 'futureschool_authenticated_user_v1';
const AUTH_TOKEN_KEY = 'futureschool_auth_token_v1';
const CUSTOM_PASSWORDS_KEY = 'futureschool_custom_passwords_v1';

export const DEMO_RESET_OTP = '492018';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<AuthToken | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [pendingMfa, setPendingMfa] = useState<PendingMfa | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Helper to retrieve custom user passwords (if changed via reset flow)
  const getCustomPasswords = (): Record<string, string> => {
    try {
      const data = localStorage.getItem(CUSTOM_PASSWORDS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveAuthSession = (user: UserProfile | null, authToken?: AuthToken | null) => {
    setCurrentUser(user);
    if (user) {
      const jwtToken = authToken || createSimulatedJwt(user);
      setToken(jwtToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(jwtToken));
    } else {
      setToken(null);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const isTokenExpired = Boolean(token && Date.now() > token.expiresAt);

  const getAuthHeader = (): Record<string, string> => {
    if (token && !isTokenExpired) {
      return { Authorization: `${token.tokenType} ${token.accessToken}` };
    }
    return {};
  };

  const login = async (id: string, pass: string, selectedRole: UserRole): Promise<boolean> => {
    setLoginError(null);
    const cleanId = id.trim().toUpperCase();
    const customPasswords = getCustomPasswords();

    // Match demo accounts
    const match = DEMO_ACCOUNTS.find(acc => {
      if (selectedRole === 'STUDENT' || selectedRole === 'PARENT') {
        return (acc.id === cleanId || cleanId === 'GVS-2027-0001') && acc.role === selectedRole;
      }
      return acc.id === cleanId && acc.role === selectedRole;
    });

    if (!match) {
      setLoginError(`No account registered with identifier "${id}" for the ${selectedRole} portal.`);
      return false;
    }

    // Check custom password if user has reset it, otherwise check default demo password
    const validPassword = customPasswords[cleanId] || match.password || DEMO_PASSWORD;
    if (pass !== validPassword && pass !== DEMO_PASSWORD) {
      setLoginError('Invalid password. For demo testing, default password is: ' + DEMO_PASSWORD);
      return false;
    }

    // MFA Verification Required for privileged roles
    if (match.user.requiresMfa) {
      setPendingMfa({
        account: match,
        role: selectedRole,
        expectedCode: match.mfaCode || '849201'
      });
      return false; // Waiting for MFA step
    }

    saveAuthSession(match.user);
    return true;
  };

  const verifyMfa = (code: string): boolean => {
    if (!pendingMfa) return false;
    const cleanCode = code.trim();
    if (cleanCode === pendingMfa.expectedCode || cleanCode === '123456') {
      saveAuthSession(pendingMfa.account.user);
      setPendingMfa(null);
      setLoginError(null);
      return true;
    } else {
      setLoginError(`Invalid verification code. Use demo code ${pendingMfa.expectedCode}`);
      return false;
    }
  };

  const cancelMfa = () => {
    setPendingMfa(null);
    setLoginError(null);
  };

  const logout = () => {
    saveAuthSession(null);
    setPendingMfa(null);
    setLoginError(null);
  };

  const quickSwitchRole = (role: UserRole) => {
    const target = DEMO_ACCOUNTS.find(a => a.role === role);
    if (target) {
      saveAuthSession(target.user);
      setPendingMfa(null);
    }
  };

  // Password Reset Flow methods
  const requestPasswordReset = async (identifier: string): Promise<PasswordResetResponse> => {
    const cleanId = identifier.trim().toUpperCase();
    const account = DEMO_ACCOUNTS.find(a => a.id === cleanId);

    if (!account) {
      return {
        success: false,
        message: `Identifier "${identifier}" was not found in school directory.`
      };
    }

    // Mask email for display: e.g. sharma.family@gvs.edu -> sh***y@gvs.edu
    const [namePart, domain] = account.email.split('@');
    const maskedName = namePart.length <= 3 
      ? namePart[0] + '***' 
      : namePart.slice(0, 2) + '***' + namePart.slice(-1);
    const maskedEmail = `${maskedName}@${domain}`;

    return {
      success: true,
      message: 'Verification code dispatched via secure channel.',
      maskedEmail,
      demoOtp: DEMO_RESET_OTP,
      user: account.user
    };
  };

  const verifyResetOtp = (identifier: string, otp: string): boolean => {
    const clean = otp.trim();
    return clean === DEMO_RESET_OTP || clean === '123456';
  };

  const confirmPasswordReset = async (
    identifier: string, 
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    if (newPass.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters.' };
    }
    const cleanId = identifier.trim().toUpperCase();
    const customPasswords = getCustomPasswords();
    customPasswords[cleanId] = newPass;
    try {
      localStorage.setItem(CUSTOM_PASSWORDS_KEY, JSON.stringify(customPasswords));
    } catch {
      // Ignore storage errors in test sandbox
    }

    return { success: true, message: 'Password reset successfully. You may now log in.' };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        token,
        pendingMfa,
        loginError,
        login,
        verifyMfa,
        cancelMfa,
        logout,
        quickSwitchRole,
        isAuthenticated: !!currentUser,
        isTokenExpired,
        getAuthHeader,
        requestPasswordReset,
        verifyResetOtp,
        confirmPasswordReset
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
