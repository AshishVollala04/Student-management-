import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/roles';
import {
  Lock,
  User,
  ShieldAlert,
  RotateCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  KeyRound,
  HelpCircle,
  School,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  // Navigation & Auth
  const {
    login,
    pendingMfa,
    verifyMfa,
    cancelMfa,
    currentUser,
    isAuthenticated,
    currentRole,
    logout,
    requestPasswordReset,
    verifyResetOtp,
    confirmPasswordReset
  } = useAuth();
  const navigate = useNavigate();

  // Tab State: 'FAMILY' (Parents & Students) or 'STAFF' (Faculty, Principal, Admin)
  const [activeTab, setActiveTab] = useState<'FAMILY' | 'STAFF'>('FAMILY');

  // Role selections
  const [selectedRole, setSelectedRole] = useState<'PARENT' | 'STUDENT'>('PARENT');
  const [staffRole, setStaffRole] = useState<'TEACHER' | 'PRINCIPAL' | 'ADMIN'>('TEACHER');

  // Form Inputs (Clean and blank by default for production)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Parent OTP Sign-in mode
  const [parentLoginMode, setParentLoginMode] = useState<'OTP' | 'PASSWORD'>('OTP');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Security Rate Limiting (Lockout after 3 failed attempts)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<'IDENTIFIER' | 'OTP' | 'NEW_PASS'>('IDENTIFIER');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // 6-Digit MFA State (Preserved for Administrative Roles)
  const [mfaDigits, setMfaDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaResendCountdown, setMfaResendCountdown] = useState(30);
  const mfaInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      timer = setTimeout(() => setLockoutTimer(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutTimer]);

  // MFA Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pendingMfa && mfaResendCountdown > 0) {
      timer = setTimeout(() => setMfaResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [pendingMfa, mfaResendCountdown]);

  // Handle OTP Dispatch for Parents
  const handleSendParentOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanPhone = identifier.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      setError('Please enter a valid 10-digit registered mobile number.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCountdown(30);
      setInfoMessage(`Security OTP dispatched via SMS to +91 ${cleanPhone.slice(0, 2)}••••••${cleanPhone.slice(-2)} (Demo code: 492018)`);
    }, 600);
  };

  // Handle Manual Form Submission
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setError(null);
    setMfaError(null);
    setInfoMessage(null);

    let idToUse = identifier.trim();
    let passToUse = password;

    // In OTP mode for Parents:
    if (activeTab === 'FAMILY' && selectedRole === 'PARENT' && parentLoginMode === 'OTP') {
      if (!otpSent) {
        handleSendParentOtp(e);
        return;
      }
      if (!otpCode || otpCode.trim().length < 4) {
        setError('Please enter the 6-digit verification code sent to your mobile.');
        return;
      }
      passToUse = otpCode.trim();
    }

    // Default zero-spec fallback if submitted completely empty
    if (!idToUse) {
      if (activeTab === 'FAMILY') {
        idToUse = selectedRole === 'PARENT' ? '9876543210' : 'GVS-2027-0001';
      } else {
        idToUse = staffRole === 'TEACHER' ? 'TCH0001' : staffRole === 'PRINCIPAL' ? 'PRN0001' : 'ADM0001';
      }
    }
    if (!passToUse) {
      if (activeTab === 'FAMILY') {
        passToUse = selectedRole === 'PARENT' ? 'parent123' : 'student123';
      } else {
        passToUse = staffRole === 'TEACHER' ? 'teacher123' : staffRole === 'PRINCIPAL' ? 'principal123' : 'admin123';
      }
    }

    // Determine target role
    let targetRole: UserRole = activeTab === 'FAMILY' ? selectedRole : staffRole;
    const clean = idToUse.toUpperCase();
    if (clean.startsWith('ADM') || clean.includes('ADMIN')) targetRole = 'ADMIN';
    else if (clean.startsWith('PRN') || clean.includes('PRINCIPAL')) targetRole = 'PRINCIPAL';
    else if (clean.startsWith('TCH') || clean.includes('TEACHER')) targetRole = 'TEACHER';

    setIsLoading(true);
    try {
      const success = await login(idToUse, passToUse, targetRole);
      if (success) {
        setFailedAttempts(0);
        navigate(`/${targetRole.toLowerCase()}/dashboard`);
      } else {
        handleFailedAttempt();
      }
    } catch {
      handleFailedAttempt();
      setError('Unable to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    if (nextAttempts >= 3) {
      setLockoutTimer(30);
      setError('Too many unsuccessful attempts. Security cooldown active for 30 seconds.');
    } else {
      setError(`Invalid credentials. ${3 - nextAttempts} attempt(s) remaining before security cooldown.`);
    }
  };

  // Google Workspace SSO Simulation
  const handleGoogleSso = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await login('GVS-2027-0001', 'student123', 'STUDENT');
      if (success) {
        navigate('/student/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quick-Fill Helper for Testing
  const applyQuickFill = (role: 'PARENT' | 'STUDENT' | 'TEACHER' | 'PRINCIPAL' | 'ADMIN') => {
    setError(null);
    setInfoMessage(null);
    if (role === 'PARENT') {
      setActiveTab('FAMILY');
      setSelectedRole('PARENT');
      setParentLoginMode('PASSWORD');
      setIdentifier('9876543210');
      setPassword('parent123');
    } else if (role === 'STUDENT') {
      setActiveTab('FAMILY');
      setSelectedRole('STUDENT');
      setIdentifier('GVS-2027-0001');
      setPassword('student123');
    } else if (role === 'TEACHER') {
      setActiveTab('STAFF');
      setStaffRole('TEACHER');
      setIdentifier('TCH0001');
      setPassword('teacher123');
    } else if (role === 'PRINCIPAL') {
      setActiveTab('STAFF');
      setStaffRole('PRINCIPAL');
      setIdentifier('PRN0001');
      setPassword('principal123');
    } else if (role === 'ADMIN') {
      setActiveTab('STAFF');
      setStaffRole('ADMIN');
      setIdentifier('ADM0001');
      setPassword('admin123');
    }
  };

  // MFA Handlers
  const handleMfaDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const updated = [...mfaDigits];
    updated[index] = cleaned;
    setMfaDigits(updated);
    setMfaError(null);
    if (cleaned && index < 5) {
      mfaInputRefs.current[index + 1]?.focus();
    }
  };

  const handleMfaKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !mfaDigits[index] && index > 0) {
      mfaInputRefs.current[index - 1]?.focus();
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError(null);
    const code = mfaDigits.join('');
    if (code.length < 6) {
      setMfaError('Please enter all 6 digits of your authenticator token.');
      return;
    }
    const success = verifyMfa(code);
    if (success && pendingMfa) {
      navigate(`/${pendingMfa.role.toLowerCase()}/dashboard`);
    } else {
      setMfaError('Invalid or expired security code.');
    }
  };

  // Forgot Password Handlers
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (forgotStep === 'IDENTIFIER') {
      if (!forgotIdentifier.trim()) {
        setForgotError('Please enter your Registered Mobile or Institutional ID.');
        return;
      }
      const res = await requestPasswordReset(forgotIdentifier);
      if (res.success) {
        setForgotStep('OTP');
        setForgotSuccess(`Verification OTP dispatched to registered channel (${res.maskedEmail || 'Mobile SMS'}). Demo OTP: 492018`);
      } else {
        setForgotError(res.message);
      }
    } else if (forgotStep === 'OTP') {
      if (!verifyResetOtp(forgotIdentifier, forgotOtp)) {
        setForgotError('Invalid or expired OTP. Please use code 492018.');
        return;
      }
      setForgotStep('NEW_PASS');
      setForgotSuccess('OTP verified. Set a new password of at least 8 characters.');
    } else if (forgotStep === 'NEW_PASS') {
      const res = await confirmPasswordReset(forgotIdentifier, newPassword);
      if (res.success) {
        setForgotSuccess('Password reset successfully! Please log in with your new password.');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep('IDENTIFIER');
          setForgotIdentifier('');
          setForgotOtp('');
          setNewPassword('');
          setForgotSuccess(null);
        }, 1800);
      } else {
        setForgotError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-[#e8f0eb] font-['DM_Sans',sans-serif] antialiased text-[#17232f]">
      
      {/* =========================================================================
          LEFT PANE: Forest Green Copy & Institutional Brand Identity
         ========================================================================= */}
      <div className="bg-[#075b54] text-white p-8 sm:p-14 lg:p-[10vw_10%] flex flex-col justify-center">
        <p className="text-[0.72rem] font-bold tracking-[0.16em] text-[#f28b45] uppercase mb-4">
          FUTURESCHOOL PLATFORM
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-bold leading-[1.05] tracking-tight max-w-[700px] mb-5 text-white font-['Space_Grotesk',sans-serif]">
          One calm place for your whole school.
        </h1>

        <p className="text-base sm:text-[1.15rem] text-[#c7dfd7] max-w-[480px] leading-relaxed">
          Attendance, learning, fees, and family communication in one connected institutional workspace.
        </p>

        <div className="flex flex-wrap items-center gap-[30px] text-[0.8rem] font-semibold text-[#9dc7ba] mt-12 lg:mt-16">
          <span>01 / Learn</span>
          <span>02 / Manage</span>
          <span>03 / Connect</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANE: Upgraded Institutional Login Card
         ========================================================================= */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-10">
        <div className="w-full max-w-[440px] bg-white rounded-[14px] border border-[#dbe5df] shadow-[0_20px_55px_rgba(14,57,45,0.12)] p-7 sm:p-9 my-auto">
          
          {/* Active Workstation Banner */}
          {isAuthenticated && currentUser && (
            <div className="mb-5 p-3 rounded-xl bg-[#e8f3ef] border border-[#dbe5df] text-xs text-[#075b54] flex items-center justify-between">
              <div>
                <span className="font-bold block">Active Session: {currentUser.name}</span>
                <span className="text-[11px] text-[#71808c] capitalize">{currentUser.roleLabel || currentRole?.toLowerCase()} Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/${currentRole?.toLowerCase()}/dashboard`)}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#087f73] hover:bg-[#075b54] text-white cursor-pointer shadow-xs transition-colors"
                >
                  Enter Portal →
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-2 py-1 text-[11px] font-semibold text-[#71808c] hover:text-[#17232f] cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Header Brand Mark */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#f28b45] text-white font-bold text-base flex items-center justify-center tracking-tight shadow-xs font-['Space_Grotesk',sans-serif]">
              FS
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f1f5f3] text-[#71808c] border border-[#e4e9e8]">
              Academic Year 2026-27
            </span>
          </div>

          <h2 className="text-[1.85rem] font-bold tracking-tight text-[#17232f] font-['Space_Grotesk',sans-serif]">
            Welcome back
          </h2>
          <p className="text-[0.9rem] text-[#71808c] mt-0.5 mb-5 font-normal">
            Sign in to access your institutional records
          </p>

          {/* Portal Switcher Tabs (Separates Family vs. Faculty cleanly) */}
          <div className="flex bg-[#f1f5f3] p-1 rounded-xl mb-5 border border-[#e4e9e8]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('FAMILY');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'FAMILY'
                  ? 'bg-white text-[#075b54] shadow-xs'
                  : 'text-[#71808c] hover:text-[#17232f]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#087f73]" />
              <span>Family Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('STAFF');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'STAFF'
                  ? 'bg-white text-[#075b54] shadow-xs'
                  : 'text-[#71808c] hover:text-[#17232f]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#f28b45]" />
              <span>Faculty & Staff</span>
            </button>
          </div>

          {/* MFA 6-Digit Challenge for Administrative Roles */}
          {pendingMfa ? (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#fff6e7] border-l-4 border-[#f28b45] text-xs text-[#81551f]">
                <span className="font-bold block">Two-Factor Security Verification</span>
                <span>Enter the 6-digit authenticator code to access staff administration.</span>
              </div>

              {mfaError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {mfaError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#17232f] text-center mb-2">
                  6-Digit Authenticator Token
                </label>
                <div className="flex justify-center gap-2">
                  {mfaDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { mfaInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleMfaDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleMfaKeyDown(idx, e)}
                      className="w-10 h-11 text-center text-lg font-mono font-bold border border-[#e4e9e8] rounded-lg bg-[#f7faf8] text-[#17232f] focus:outline-none focus:ring-2 focus:ring-[#087f73] transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#71808c] pt-1">
                <span>Resend in {mfaResendCountdown}s</span>
                <button
                  type="button"
                  disabled={mfaResendCountdown > 0}
                  onClick={() => setMfaResendCountdown(30)}
                  className={`font-semibold cursor-pointer ${mfaResendCountdown > 0 ? 'text-[#a0aec0]' : 'text-[#087f73] hover:underline'}`}
                >
                  Resend Code
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelMfa}
                  className="flex-1 py-2.5 rounded-lg border border-[#e4e9e8] bg-[#f7faf8] text-xs font-bold text-[#17232f] hover:bg-[#e8f0eb] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#087f73] hover:bg-[#075b54] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          ) : (
            /* =========================================================================
               STANDARD LOGIN FORM
               ========================================================================= */
            <form onSubmit={handleManualLogin} className="space-y-4">
              
              {/* Feedback Alerts */}
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {infoMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* 1. ROLE DROPDOWN */}
              {activeTab === 'FAMILY' ? (
                /* FAMILY PORTAL: Strictly only Parent and Student */
                <div>
                  <label htmlFor="login-role" className="block text-xs font-bold text-[#17232f] mb-1.5">
                    Sign in as
                  </label>
                  <select
                    id="login-role"
                    value={selectedRole}
                    onChange={(e) => {
                      const newRole = e.target.value as 'PARENT' | 'STUDENT';
                      setSelectedRole(newRole);
                      setError(null);
                      setInfoMessage(null);
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] font-semibold focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73] transition-all cursor-pointer"
                  >
                    <option value="PARENT">Parent</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>
              ) : (
                /* STAFF PORTAL: Faculty & Administration */
                <div>
                  <label htmlFor="staff-role" className="block text-xs font-bold text-[#17232f] mb-1.5">
                    Staff Designation
                  </label>
                  <select
                    id="staff-role"
                    value={staffRole}
                    onChange={(e) => {
                      setStaffRole(e.target.value as any);
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] font-semibold focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73] transition-all cursor-pointer"
                  >
                    <option value="TEACHER">Faculty / Class Mentor</option>
                    <option value="PRINCIPAL">Principal / Academic Director</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              )}

              {/* PARENT SPECIFIC: Toggle between Instant Mobile OTP vs. Password */}
              {activeTab === 'FAMILY' && selectedRole === 'PARENT' && (
                <div className="flex items-center justify-between text-xs pt-0.5 pb-1">
                  <span className="text-[#71808c] font-medium">Authentication Method:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setParentLoginMode('OTP');
                        setError(null);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        parentLoginMode === 'OTP'
                          ? 'bg-[#087f73] text-white shadow-2xs'
                          : 'bg-[#f1f5f3] text-[#71808c] hover:text-[#17232f]'
                      }`}
                    >
                      Instant Mobile OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setParentLoginMode('PASSWORD');
                        setError(null);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        parentLoginMode === 'PASSWORD'
                          ? 'bg-[#087f73] text-white shadow-2xs'
                          : 'bg-[#f1f5f3] text-[#71808c] hover:text-[#17232f]'
                      }`}
                    >
                      Password
                    </button>
                  </div>
                </div>
              )}

              {/* 2. IDENTIFIER INPUT (Clean, blank by default with smart placeholders) */}
              <div>
                <label className="block text-xs font-bold text-[#17232f] mb-1.5">
                  {activeTab === 'STAFF'
                    ? 'Employee / Staff ID'
                    : selectedRole === 'PARENT'
                    ? 'Registered Mobile Number'
                    : 'Admission Number'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  disabled={otpSent && activeTab === 'FAMILY' && selectedRole === 'PARENT' && parentLoginMode === 'OTP'}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    activeTab === 'STAFF'
                      ? 'e.g. TCH0001 or PRN0001'
                      : selectedRole === 'PARENT'
                      ? 'Enter 10-digit registered mobile number'
                      : 'Enter Admission No (e.g. GVS-2027-0001)'
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73] transition-all font-medium disabled:bg-[#f7faf8] disabled:text-[#71808c]"
                />
              </div>

              {/* 3A. PARENT OTP VERIFICATION STEP */}
              {activeTab === 'FAMILY' && selectedRole === 'PARENT' && parentLoginMode === 'OTP' && otpSent ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#17232f]">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="text-[11px] text-[#087f73] hover:underline font-semibold cursor-pointer"
                    >
                      Change Mobile
                    </button>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter code (Demo: 492018)"
                    className="w-full px-3.5 py-2.5 text-sm font-mono tracking-widest text-center border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#71808c] mt-1.5">
                    <span>Didn't receive code?</span>
                    <button
                      type="button"
                      disabled={otpCountdown > 0}
                      onClick={handleSendParentOtp}
                      className={`font-semibold cursor-pointer ${
                        otpCountdown > 0 ? 'text-[#a0aec0]' : 'text-[#087f73] hover:underline'
                      }`}
                    >
                      {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              ) : (
                /* 3B. PASSWORD INPUT (When not in OTP mode) */
                (activeTab === 'STAFF' || selectedRole === 'STUDENT' || (selectedRole === 'PARENT' && parentLoginMode === 'PASSWORD')) && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#17232f]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotModal(true);
                          setForgotIdentifier(identifier);
                          setForgotStep('IDENTIFIER');
                          setForgotError(null);
                          setForgotSuccess(null);
                        }}
                        className="text-[11px] text-[#087f73] hover:underline font-semibold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="flex-1 px-3.5 py-2.5 text-sm border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="shrink-0 bg-[#d9ebe5] hover:bg-[#c5e0d7] text-[#075b54] font-bold text-xs px-3.5 py-2.5 rounded-[7px] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* "Remember Me" Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#71808c] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#e4e9e8] text-[#087f73] focus:ring-[#087f73] cursor-pointer"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || lockoutTimer > 0}
                className="w-full bg-[#087f73] hover:bg-[#075b54] active:scale-[0.99] text-white font-bold text-sm py-3 px-4 rounded-[7px] transition-all shadow-sm cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : lockoutTimer > 0 ? (
                  <span>Locked ({lockoutTimer}s)</span>
                ) : activeTab === 'FAMILY' && selectedRole === 'PARENT' && parentLoginMode === 'OTP' && !otpSent ? (
                  <span>Send Verification Code</span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* SSO Option: Sign in with Google Workspace */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e4e9e8]"></div>
                </div>
                <span className="relative px-3 text-[11px] font-semibold text-[#a0aec0] bg-white uppercase tracking-wider">
                  Or
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSso}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#e4e9e8] hover:bg-[#f7faf8] rounded-[7px] text-xs font-bold text-[#17232f] transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google Workspace</span>
              </button>

              {/* Developer Quick-Fill Accordion / Pill (Subtle, for rapid testing without polluting production inputs) */}
              <div className="pt-3 border-t border-[#f0f4f2] text-center">
                <details className="text-[11px] text-[#71808c] cursor-pointer group">
                  <summary className="hover:text-[#087f73] font-medium select-none list-none flex items-center justify-center gap-1">
                    <span>⚡ Quick Demo Credentials</span>
                  </summary>
                  <div className="mt-2.5 p-2 rounded-lg bg-[#f7faf8] border border-[#e4e9e8] flex flex-wrap justify-center gap-1.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => applyQuickFill('PARENT')}
                      className="px-2 py-1 rounded bg-white hover:bg-[#e8f0eb] border border-[#e4e9e8] text-[#075b54] cursor-pointer"
                    >
                      Parent (Dr. Rajesh)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickFill('STUDENT')}
                      className="px-2 py-1 rounded bg-white hover:bg-[#e8f0eb] border border-[#e4e9e8] text-[#075b54] cursor-pointer"
                    >
                      Student (Aarav)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickFill('TEACHER')}
                      className="px-2 py-1 rounded bg-white hover:bg-[#e8f0eb] border border-[#e4e9e8] text-[#075b54] cursor-pointer"
                    >
                      Teacher (Mrs. Sarah)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickFill('PRINCIPAL')}
                      className="px-2 py-1 rounded bg-white hover:bg-[#e8f0eb] border border-[#e4e9e8] text-[#075b54] cursor-pointer"
                    >
                      Principal
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickFill('ADMIN')}
                      className="px-2 py-1 rounded bg-white hover:bg-[#e8f0eb] border border-[#e4e9e8] text-[#075b54] cursor-pointer"
                    >
                      Admin
                    </button>
                  </div>
                </details>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* =========================================================================
          FORGOT PASSWORD / ACCOUNT RECOVERY MODAL
         ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-[400px] w-full p-6 shadow-2xl border border-[#dbe5df]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#087f73]" />
                <h3 className="text-base font-bold text-[#17232f]">Reset Account Access</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              {forgotStep === 'IDENTIFIER' && (
                <div>
                  <label className="block text-xs font-bold text-[#17232f] mb-1">
                    Enter Registered Mobile or Student/Staff ID
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or GVS-2027-0001"
                    className="w-full px-3 py-2 text-sm border border-[#e4e9e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087f73]"
                  />
                  <p className="text-[11px] text-[#71808c] mt-1">
                    A secure 6-digit recovery OTP will be dispatched to your registered phone or email.
                  </p>
                </div>
              )}

              {forgotStep === 'OTP' && (
                <div>
                  <label className="block text-xs font-bold text-[#17232f] mb-1">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter code (Demo: 492018)"
                    className="w-full px-3 py-2 text-sm font-mono tracking-widest text-center border border-[#e4e9e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087f73]"
                  />
                </div>
              )}

              {forgotStep === 'NEW_PASS' && (
                <div>
                  <label className="block text-xs font-bold text-[#17232f] mb-1">
                    Enter New Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    className="w-full px-3 py-2 text-sm border border-[#e4e9e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087f73]"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-lg border border-[#e4e9e8] hover:bg-[#f7faf8] text-[#71808c] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#087f73] hover:bg-[#075b54] text-white cursor-pointer"
                >
                  {forgotStep === 'IDENTIFIER' ? 'Send OTP' : forgotStep === 'OTP' ? 'Verify OTP' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
