import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '../types/roles';
import { DEMO_ACCOUNTS, DemoAccount, DEMO_PASSWORD } from '../mock/users';
import { ALL_STUDENTS_180 } from '../data/mockData';
import { AuthToken, createSimulatedJwt, PasswordResetResponse } from '../types/auth';

interface PendingMfa {
  account: DemoAccount;
  role: UserRole;
  expectedCode: string;
  backendToken?: AuthToken | null;
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
    const cleanPhoneDigits = id.replace(/\D/g, '');
    const customPasswords = getCustomPasswords();

    // Match demo accounts by exact ID, email, aliases, or role-specific identifiers
    const match = DEMO_ACCOUNTS.find(acc => {
      if (acc.role !== selectedRole) return false;

      // 1. Exact ID match
      if (acc.id.toUpperCase() === cleanId) return true;

      // 2. Email match
      if (acc.email.toUpperCase() === cleanId) return true;

      // 3. Aliases match
      if (acc.aliases?.some(a => a.toUpperCase() === cleanId)) return true;

      // 4. Role-specific match for PARENT
      if (selectedRole === 'PARENT') {
        return true;
      }

      // 5. Role-specific match for STUDENT
      if (selectedRole === 'STUDENT') {
        if (
          cleanId.startsWith('GVS') ||
          cleanId === 'STU0001' ||
          cleanId.startsWith('STU') ||
          cleanId === 'STUDENT' ||
          cleanId === 'AARAV' ||
          cleanId === '0001' ||
          cleanId === '2027-0001'
        ) {
          return true;
        }
      }

      // 6. Role-specific match for TEACHER
      if (selectedRole === 'TEACHER') {
        if (
          cleanId.startsWith('TCH') ||
          cleanId === 'TEACHER' ||
          cleanId.includes('JENKINS') ||
          cleanId.includes('SARAH')
        ) {
          return true;
        }
      }

      // 6. Generic role match if user types role name
      if (cleanId === selectedRole) {
        return true;
      }

      return false;
    });

    if (!match) {
      setLoginError(`Identifier "${id}" is not registered in the institutional directory for the ${selectedRole} portal. Please verify your ID or contact administration.`);
      return false;
    }

    // Check password
    const validPassword = customPasswords[cleanId] || match.password || DEMO_PASSWORD;
    const isAcceptedPass = 
      pass === validPassword || 
      pass === DEMO_PASSWORD || 
      pass === 'password' || 
      pass === 'demo' ||
      pass === 'admin123' ||
      pass === 'principal123' ||
      pass === 'teacher123' ||
      pass === 'parent123' ||
      pass === 'student123' || pass === '492018' || pass === '123456';

    if (!isAcceptedPass) {
      setLoginError('Invalid password provided. Please verify your credentials or click "Forgot password?" to reset.');
      return false;
    }

    // Attempt live Spring Boot backend authentication
    let realBackendToken: AuthToken | null = null;
    try {
      let backendLoginId = cleanId;
      if (selectedRole === 'PARENT') {
        backendLoginId = 'PAR0001';
      } else if (selectedRole === 'STUDENT') {
        backendLoginId = 'GVS-2027-0001';
      } else if (selectedRole === 'TEACHER') {
        backendLoginId = 'TCH0001';
      } else if (selectedRole === 'ADMIN') {
        backendLoginId = 'ADM0001';
      } else if (selectedRole === 'PRINCIPAL') {
        backendLoginId = 'PRN0001';
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: backendLoginId, password: 'password123' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          realBackendToken = {
            accessToken: data.token,
            refreshToken: 'ref_' + data.token.slice(-16),
            tokenType: 'Bearer',
            expiresIn: 3600,
            issuedAt: Date.now(),
            expiresAt: Date.now() + 3600 * 1000
          };
        }
      }
    } catch {
      // Backend request offline or fallback
    }

    // Construct specific user profile (e.g. for any of the 180 students)
    let userToSave: UserProfile = { ...match.user };

    if (selectedRole === 'PARENT') {
      const foundStudent = (ALL_STUDENTS_180 as any[])?.find((s: any) => {
        if (!cleanId) return false;
        const sAdm = (s.admissionNo || '').toUpperCase();
        const sPhone = (s.parentPhone || '').replace(/\D/g, '');
        const sName = (s.name || '').toUpperCase();
        const pName = (s.parentName || '').toUpperCase();
        
        return sAdm === cleanId ||
               cleanId.includes(sAdm) ||
               (cleanPhoneDigits.length >= 7 && (sPhone.includes(cleanPhoneDigits) || cleanPhoneDigits.includes(sPhone))) ||
               (cleanId.length >= 3 && (sName.includes(cleanId) || pName.includes(cleanId))) ||
               (cleanId === 'PAR-' + sAdm) ||
               (cleanId === 'PAR' + String(s.rollNo).padStart(4, '0') && s.classId === 'class-10-a');
      }) || (ALL_STUDENTS_180 as any[])?.find((s: any) => s.admissionNo === 'GVS-2027-0001');

      if (foundStudent) {
        userToSave = {
          id: 'PAR-' + foundStudent.admissionNo,
          name: foundStudent.parentName || 'Dr. Rajesh Sharma',
          email: foundStudent.parentEmail || (foundStudent.admissionNo.toLowerCase() + '.parent@futureschool.edu'),
          role: 'PARENT',
          avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=' + encodeURIComponent(foundStudent.parentName || 'Parent') + '&backgroundColor=b6e3f4',
          roleLabel: 'Parent · Ward: ' + foundStudent.name + ' (' + (foundStudent.className || 'Class 10') + '-' + (foundStudent.section || 'A') + ')',
          tenantId: 'GVS',
          studentId: foundStudent.admissionNo,
          studentName: foundStudent.name,
          grade: String(foundStudent.className || 'Class 10').replace(/\D/g, '') || '10',
          section: foundStudent.section || 'A',
          rollNumber: String(foundStudent.rollNo)
        } as any;
      }
    }


    if (selectedRole === 'STUDENT') {
      const foundStudent = (ALL_STUDENTS_180 as any[])?.find(
        (s: any) => s.admissionNo?.toUpperCase() === cleanId || 
             s.id?.toUpperCase() === cleanId ||
             cleanId.includes(s.admissionNo?.toUpperCase()) ||
             (`GVS-2027-${String(s.rollNo).padStart(4, '0')}` === cleanId && s.classId === 'class-10-a')
      );
      if (foundStudent) {
        userToSave = {
          id: foundStudent.admissionNo,
          name: foundStudent.name,
          email: `${foundStudent.admissionNo.toLowerCase()}@futureschool.edu`,
          role: 'STUDENT',
          avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(foundStudent.name)}&backgroundColor=c0aede`,
          roleLabel: `Student · ${foundStudent.className || 'Class 10'}-${foundStudent.section || 'A'} · Roll #${foundStudent.rollNo}`,
          tenantId: 'GVS',
          studentId: foundStudent.admissionNo,
          grade: String(foundStudent.className || 'Class 10').replace(/\D/g, '') || '10',
          section: foundStudent.section || 'A',
          rollNumber: String(foundStudent.rollNo)
        } as any;
      }
    }

    // MFA Verification Required for privileged roles
    if (match.user.requiresMfa) {
      setPendingMfa({
        account: match,
        role: selectedRole,
        expectedCode: match.mfaCode || '849201',
        backendToken: realBackendToken
      });
      return false; // Waiting for MFA step
    }

    saveAuthSession(userToSave, realBackendToken);
    return true;
  };

  const verifyMfa = (code: string): boolean => {
    if (!pendingMfa) return false;
    const cleanCode = code.trim();
    if (cleanCode === pendingMfa.expectedCode || cleanCode === '123456') {
      saveAuthSession(pendingMfa.account.user, pendingMfa.backendToken);
      setPendingMfa(null);
      setLoginError(null);
      return true;
    } else {
      setLoginError('Invalid verification code. Please enter the valid 6-digit authenticator security code.');
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

  const quickSwitchRole = async (role: UserRole) => {
    const target = DEMO_ACCOUNTS.find(a => a.role === role);
    if (target) {
      let switchedToken: AuthToken | null = null;
      try {
        let backendId = target.id;
        if (role === 'PARENT') backendId = 'PAR0001';
        else if (role === 'STUDENT') backendId = 'GVS-2027-0001';
        else if (role === 'TEACHER') backendId = 'TCH0001';
        else if (role === 'ADMIN') backendId = 'ADM0001';
        else if (role === 'PRINCIPAL') backendId = 'PRN0001';

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginId: backendId, password: 'password123' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            switchedToken = {
              accessToken: data.token,
              refreshToken: 'ref_' + data.token.slice(-16),
              tokenType: 'Bearer',
              expiresIn: 3600,
              issuedAt: Date.now(),
              expiresAt: Date.now() + 3600 * 1000
            };
          }
        }
      } catch {}

      saveAuthSession(target.user, switchedToken);
      setPendingMfa(null);
      setLoginError(null);
    }
  };

  // Password Reset Flow methods
  const requestPasswordReset = async (identifier: string): Promise<PasswordResetResponse> => {
    const cleanId = identifier.trim().toUpperCase();
    const account = DEMO_ACCOUNTS.find(
      a => a.id === cleanId || a.aliases?.some(al => al.toUpperCase() === cleanId)
    );

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
