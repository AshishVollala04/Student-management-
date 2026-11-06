import React, { useState, useRef, useEffect } from 'react';
import { useAuth, DEMO_RESET_OTP } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/roles';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../mock/users';
import { Logo } from '../../components/common/Logo';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Building2,
  Globe2,
  GraduationCap,
  Users,
  Briefcase,
  ShieldAlert,
  RotateCw,
  Clock,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [identifier, setIdentifier] = useState('GVS-2027-0001');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MFA 6-digit state
  const [mfaDigits, setMfaDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaResendCountdown, setMfaResendCountdown] = useState(30);
  const mfaInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'ID' | 'CODE' | 'NEW_PASS' | 'SUCCESS'>('ID');
  const [forgotId, setForgotId] = useState('GVS-2027-0001');
  const [forgotMaskedEmail, setForgotMaskedEmail] = useState('');
  const [forgotOtpDigits, setForgotOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [forgotOtpError, setForgotOtpError] = useState<string | null>(null);
  const [forgotResendTimer, setForgotResendTimer] = useState(30);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Demo accounts drawer
  const [showDemoDrawer, setShowDemoDrawer] = useState(true);

  const {
    login,
    pendingMfa,
    verifyMfa,
    cancelMfa,
    loginError,
    isAuthenticated,
    currentRole,
    requestPasswordReset,
    verifyResetOtp,
    confirmPasswordReset
  } = useAuth();

  const { activeTenant } = useTenant();
  const navigate = useNavigate();

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (isAuthenticated && currentRole) {
      navigate(`/${currentRole.toLowerCase()}/dashboard`);
    }
  }, [isAuthenticated, currentRole, navigate]);

  // MFA Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pendingMfa && mfaResendCountdown > 0) {
      timer = setTimeout(() => setMfaResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [pendingMfa, mfaResendCountdown]);

  // Forgot OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showForgotModal && forgotStep === 'CODE' && forgotResendTimer > 0) {
      timer = setTimeout(() => setForgotResendTimer(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showForgotModal, forgotStep, forgotResendTimer]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'STUDENT' || role === 'PARENT') {
      setIdentifier('GVS-2027-0001');
    } else if (role === 'TEACHER') {
      setIdentifier('TCH0001');
    } else if (role === 'PRINCIPAL') {
      setIdentifier('PRN0001');
    } else if (role === 'ADMIN') {
      setIdentifier('ADM0001');
    } else if (role === 'PLATFORM_ADMIN') {
      setIdentifier('PLA0001');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMfaError(null);
    setMfaDigits(['', '', '', '', '', '']);

    try {
      const success = await login(identifier, password, selectedRole);
      if (success) {
        navigate(`/${selectedRole.toLowerCase()}/dashboard`);
      } else {
        // If pendingMfa is triggered, focus first digit box
        setTimeout(() => {
          mfaInputRefs.current[0]?.focus();
        }, 100);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // MFA 6-slot digit input handlers
  const handleMfaDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Pasted content handling
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...mfaDigits];
      digits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setMfaDigits(newDigits);
      const nextIndex = Math.min(digits.length, 5);
      mfaInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = val.replace(/\D/g, '');
    const newDigits = [...mfaDigits];
    newDigits[index] = digit;
    setMfaDigits(newDigits);

    if (digit && index < 5) {
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
    const fullCode = mfaDigits.join('');
    if (fullCode.length < 6) {
      setMfaError('Please enter all 6 digits of the verification code.');
      return;
    }

    const valid = verifyMfa(fullCode);
    if (valid) {
      navigate(`/${selectedRole.toLowerCase()}/dashboard`);
    } else {
      setMfaError(`Invalid MFA code. Use demo code: ${pendingMfa?.expectedCode || '123456'}`);
    }
  };

  const handleMfaQuickFill = () => {
    if (pendingMfa?.expectedCode) {
      const digits = pendingMfa.expectedCode.split('');
      setMfaDigits(digits);
      mfaInputRefs.current[5]?.focus();
    }
  };

  // Password Recovery Handlers
  const handleForgotIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const res = await requestPasswordReset(forgotId);
    if (res.success && res.maskedEmail) {
      setForgotMaskedEmail(res.maskedEmail);
      setForgotStep('CODE');
      setForgotResendTimer(30);
    } else {
      setForgotError(res.message);
    }
  };

  const handleForgotOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotOtpError(null);
    const code = forgotOtpDigits.join('');
    if (code.length < 6) {
      setForgotOtpError('Please enter the full 6-digit code.');
      return;
    }
    const isValid = verifyResetOtp(forgotId, code);
    if (isValid) {
      setForgotStep('NEW_PASS');
    } else {
      setForgotOtpError(`Invalid code. Enter demo OTP ${DEMO_RESET_OTP}`);
    }
  };

  const handleForgotNewPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setForgotError('Password must be at least 8 characters.');
      return;
    }

    const res = await confirmPasswordReset(forgotId, newPassword);
    if (res.success) {
      setForgotStep('SUCCESS');
    } else {
      setForgotError(res.message);
    }
  };

  // Password validation checklist
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-teal-900/20 via-slate-900/60 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />

      {/* Header & Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="flex justify-center mb-3">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>FutureSchool</span>
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
            SaaS v2.4
          </span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Commercial Multi-School Management & Campus Intelligence
        </p>

        {/* Tenant Indicator Banner */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 backdrop-blur-sm shadow-xs">
          {selectedRole === 'PLATFORM_ADMIN' ? (
            <>
              <Globe2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-semibold text-white">Global Platform Multi-Tenant Control Plane</span>
            </>
          ) : (
            <>
              <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="font-semibold text-white">{activeTenant.name}</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-[11px] text-teal-300">{activeTenant.code} ({activeTenant.board})</span>
            </>
          )}
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/90 backdrop-blur-md py-6 px-6 shadow-2xl border border-slate-700/80 rounded-2xl text-slate-100">
          
          {/* ========================================================================= */}
          {/* MFA STEP MODAL / VIEW                                                     */}
          {/* ========================================================================= */}
          {pendingMfa ? (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center pb-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-2 border border-teal-500/30 shadow-inner">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Privileged security policy enforced for <strong className="text-teal-300 font-semibold">{pendingMfa.role}</strong>
                </p>

                {/* Demo MFA helper badge */}
                <div className="mt-3 p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-xs flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] text-teal-400 font-medium block">Active Demo Code</span>
                    <span className="font-mono text-sm font-bold tracking-widest text-white">{pendingMfa.expectedCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMfaQuickFill}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-xs"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>

              {mfaError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{mfaError}</span>
                </div>
              )}

              {/* 6 Individual Digit Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 text-center mb-2">
                  Enter 6-Digit Authenticator Token
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
                      className="w-10 h-12 text-center text-lg font-mono font-bold border border-slate-600 rounded-xl bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner"
                    />
                  ))}
                </div>
              </div>

              {/* Resend and timer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Resend in {mfaResendCountdown}s</span>
                </span>
                <button
                  type="button"
                  disabled={mfaResendCountdown > 0}
                  onClick={() => setMfaResendCountdown(30)}
                  className={`text-xs font-semibold ${
                    mfaResendCountdown > 0 
                      ? 'text-slate-600 cursor-not-allowed' 
                      : 'text-teal-400 hover:text-teal-300'
                  }`}
                >
                  Resend Code
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelMfa}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-950/40 transition-colors"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* STANDARD ROLE-BASED LOGIN FORM                                            */
            /* ========================================================================= */
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Role Selector Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 border border-slate-700/60 rounded-xl">
                  {(
                    [
                      { role: 'STUDENT', label: 'Student', icon: GraduationCap },
                      { role: 'PARENT', label: 'Parent', icon: Users },
                      { role: 'TEACHER', label: 'Teacher', icon: Briefcase },
                      { role: 'PRINCIPAL', label: 'Principal', icon: ShieldCheck },
                      { role: 'ADMIN', label: 'Admin', icon: ShieldAlert },
                      { role: 'PLATFORM_ADMIN', label: 'Platform', icon: Globe2 }
                    ] as const
                  ).map(({ role: r, label, icon: Icon }) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all truncate ${
                        selectedRole === r
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Role Description Hint */}
                <div className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
                  <span>
                    {selectedRole === 'STUDENT' && 'Aarav Sharma · Class 10-A (Shared ID GVS-2027-0001)'}
                    {selectedRole === 'PARENT' && 'Dr. Rajesh Sharma · Guardian (Scoped to student Aarav Sharma)'}
                    {selectedRole === 'TEACHER' && 'Mrs. Sarah Jenkins · Head of Math & Class 10-A Mentor'}
                    {selectedRole === 'PRINCIPAL' && 'Dr. Robert Vance · Executive Director (MFA Required: 849201)'}
                    {selectedRole === 'ADMIN' && 'Arthur Pendelton · Chief Operations Officer (MFA Required: 392810)'}
                    {selectedRole === 'PLATFORM_ADMIN' && 'Dr. Elizabeth Warren · Global Multi-Tenant Admin (MFA: 552109)'}
                  </span>
                </div>
              </div>

              {/* Identifier Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {selectedRole === 'STUDENT' || selectedRole === 'PARENT' ? 'Student Registration ID' : 'Staff / Employee ID'}
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === 'STUDENT' || selectedRole === 'PARENT' ? 'GVS-2027-0001' : 'TCH0001'}
                    className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-700 rounded-xl bg-slate-900/60 text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotId(identifier);
                      setForgotStep('ID');
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-slate-700 rounded-xl bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-teal-600 bg-slate-900 border-slate-700 rounded focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-400">Remember this workstation</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">JWT Bearer Session</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 active:scale-[0.99] transition-all shadow-lg shadow-teal-950/50 cursor-pointer"
              >
                {isSubmitting ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to {selectedRole} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* INTERACTIVE DEMO CREDENTIALS QUICK-PICK DRAWER                            */}
          {/* ========================================================================= */}
          <div className="mt-5 pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowDemoDrawer(!showDemoDrawer)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                <span>Demo Accounts Quick-Fill (Click Any Card)</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDemoDrawer ? 'rotate-180' : ''}`} />
            </button>

            {showDemoDrawer && (
              <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = selectedRole === acc.role;
                  return (
                    <div
                      key={acc.role}
                      onClick={() => {
                        setSelectedRole(acc.role);
                        setIdentifier(acc.id);
                        setPassword(DEMO_PASSWORD);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-teal-500/60 bg-teal-950/40 text-teal-200 shadow-sm'
                          : 'border-slate-700/60 bg-slate-900/40 hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-bold flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-teal-400' : 'bg-slate-500'}`} />
                          {acc.role}: <span className="text-white">{acc.id}</span>
                        </span>
                        {acc.user.requiresMfa ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-sans">
                            MFA: {acc.mfaCode}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pass: {acc.password}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{acc.description}</span>
                        <span className="text-[10px] text-teal-400 font-semibold underline">Use</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MULTI-STEP PASSWORD RECOVERY MODAL                                        */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700 text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Self-Service Account Recovery</h3>
                <p className="text-xs text-slate-400">
                  {forgotStep === 'ID' && 'Step 1 of 3: Identify Account'}
                  {forgotStep === 'CODE' && 'Step 2 of 3: SMS/Email Verification'}
                  {forgotStep === 'NEW_PASS' && 'Step 3 of 3: Set New Password'}
                  {forgotStep === 'SUCCESS' && 'Recovery Complete'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Error banner */}
            {forgotError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* Step 1: Identifier Entry */}
            {forgotStep === 'ID' && (
              <form onSubmit={handleForgotIdSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student ID or Staff Employee ID
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotId}
                    onChange={(e) => setForgotId(e.target.value)}
                    placeholder="e.g. GVS-2027-0001, TCH0001, PRN0001"
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-xl bg-slate-800 text-white font-mono uppercase focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Demo suggestion: Use <strong>GVS-2027-0001</strong> for Aarav Sharma
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-500"
                  >
                    Send Verification Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {forgotStep === 'CODE' && (
              <form onSubmit={handleForgotOtpSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                  <p>A verification code was dispatched to registered security contact:</p>
                  <p className="font-mono text-teal-400 font-bold mt-1">{forgotMaskedEmail}</p>
                </div>

                {forgotOtpError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                    {forgotOtpError}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Enter 6-digit Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotOtpDigits(DEMO_RESET_OTP.split(''))}
                      className="text-[11px] text-teal-400 font-semibold hover:underline"
                    >
                      Use Demo Code ({DEMO_RESET_OTP})
                    </button>
                  </div>
                  <div className="flex justify-center gap-2">
                    {forgotOtpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newD = [...forgotOtpDigits];
                          newD[idx] = val;
                          setForgotOtpDigits(newD);
                        }}
                        className="w-9 h-11 text-center text-lg font-mono font-bold border border-slate-700 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-teal-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Resend in {forgotResendTimer}s</span>
                  <button
                    type="button"
                    disabled={forgotResendTimer > 0}
                    onClick={() => setForgotResendTimer(30)}
                    className="text-teal-400 font-semibold disabled:text-slate-600"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('ID')}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-500"
                  >
                    Verify Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Set New Password */}
            {forgotStep === 'NEW_PASS' && (
              <form onSubmit={handleForgotNewPassSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Password Strength Checklist */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Password Strength</span>
                    <span className={strengthScore >= 3 ? 'text-teal-400' : 'text-amber-400'}>
                      {strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore <= 1
                          ? 'w-1/4 bg-rose-500'
                          : strengthScore <= 3
                          ? 'w-3/4 bg-amber-500'
                          : 'w-full bg-teal-500'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1 text-slate-400">
                    <span className={hasMinLength ? 'text-teal-400 font-semibold' : ''}>
                      {hasMinLength ? '✓' : '•'} 8+ Characters
                    </span>
                    <span className={hasUppercase ? 'text-teal-400 font-semibold' : ''}>
                      {hasUppercase ? '✓' : '•'} 1 Uppercase (A-Z)
                    </span>
                    <span className={hasNumber ? 'text-teal-400 font-semibold' : ''}>
                      {hasNumber ? '✓' : '•'} 1 Number (0-9)
                    </span>
                    <span className={hasSpecial ? 'text-teal-400 font-semibold' : ''}>
                      {hasSpecial ? '✓' : '•'} 1 Special Character
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('CODE')}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-500"
                  >
                    Save & Update
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Success confirmation */}
            {forgotStep === 'SUCCESS' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Password Successfully Updated</h4>
                <p className="text-xs text-slate-400">
                  Your credentials for <strong className="text-white">{forgotId}</strong> have been saved. You can now log into your FutureSchool portal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPassword(newPassword);
                    setIdentifier(forgotId);
                    setShowForgotModal(false);
                    setForgotStep('ID');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md"
                >
                  Log In With New Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
