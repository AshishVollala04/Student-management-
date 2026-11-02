import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Info
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [identifier, setIdentifier] = useState('GVS-2027-0001');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // MFA state
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'ID' | 'CODE' | 'NEW_PASS' | 'SUCCESS'>('ID');
  const [forgotId, setForgotId] = useState('GVS-2027-0001');
  const [forgotEnteredCode, setForgotEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Demo accounts drawer
  const [showDemoDrawer, setShowDemoDrawer] = useState(true);

  const { login, pendingMfa, verifyMfa, cancelMfa, loginError, isAuthenticated, currentRole } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to role dashboard
  React.useEffect(() => {
    if (isAuthenticated && currentRole) {
      navigate(`/${currentRole.toLowerCase()}/dashboard`);
    }
  }, [isAuthenticated, currentRole, navigate]);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(identifier, password, selectedRole);
    if (success) {
      navigate(`/${selectedRole.toLowerCase()}/dashboard`);
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError(null);
    const valid = verifyMfa(mfaCode);
    if (valid) {
      navigate(`/${selectedRole.toLowerCase()}/dashboard`);
    } else {
      setMfaError('Invalid 6-digit MFA code. Please use: ' + (pendingMfa?.expectedCode || '123456'));
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 'ID') {
      setForgotStep('CODE');
    } else if (forgotStep === 'CODE') {
      setForgotStep('NEW_PASS');
    } else if (forgotStep === 'NEW_PASS') {
      setForgotStep('SUCCESS');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('ID');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign In to FutureSchool
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Integrated Campus Intelligence Platform · 600 Students Scale
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-7 px-6 shadow-xl border border-slate-200 dark:border-slate-800 rounded-2xl">
          {/* MFA STEP MODAL */}
          {pendingMfa ? (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-2 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Multi-Factor Authentication (MFA)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Required for privileged role: <strong className="text-teal-700 dark:text-teal-400 font-semibold">{pendingMfa.role}</strong>
                </p>
                <div className="mt-2 p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 text-[11px] text-teal-800 dark:text-teal-300">
                  Demo Prototype Code: <strong className="font-mono text-sm tracking-wider">{pendingMfa.expectedCode}</strong>
                </div>
              </div>

              {mfaError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                  {mfaError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter 6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="849201"
                  className="w-full text-center text-lg font-mono font-bold tracking-widest py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelMfa}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          ) : (
            /* STANDARD LOGIN FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Role Selector Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portal Role
                </label>
                <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {(['STUDENT', 'PARENT', 'TEACHER', 'PRINCIPAL', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all ${
                        selectedRole === r
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {r.slice(0, 4)}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {selectedRole === 'STUDENT' && 'Student access with published marks & assignments.'}
                  {selectedRole === 'PARENT' && 'Parent portal (same ID GVS-2027-0001 as student).'}
                  {selectedRole === 'TEACHER' && 'Class Mentor & Subject Teacher tools.'}
                  {selectedRole === 'PRINCIPAL' && 'Leadership approvals & MFA verification.'}
                  {selectedRole === 'ADMIN' && 'Operations control center & MFA verification.'}
                </p>
              </div>

              {/* Identifier Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {selectedRole === 'STUDENT' || selectedRole === 'PARENT' ? 'Student ID' : 'Staff / Employee ID'}
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === 'STUDENT' || selectedRole === 'PARENT' ? 'GVS-2027-0001' : 'TCH0001'}
                    className="block w-full pl-10 pr-3 py-2.5 sm:text-sm text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotId(identifier);
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-900/20 active:scale-[0.99] transition-all"
              >
                <span>Sign In to {selectedRole} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Collapsible Demo Credentials Panel */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowDemoDrawer(!showDemoDrawer)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"
            >
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-orange-500" />
                <span>Demo Credentials Reference</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDemoDrawer ? 'rotate-180' : ''}`} />
            </button>

            {showDemoDrawer && (
              <div className="space-y-1.5 text-[11px]">
                {DEMO_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.role}
                    onClick={() => {
                      setSelectedRole(acc.role);
                      setIdentifier(acc.id);
                      setPassword(DEMO_PASSWORD);
                    }}
                    className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                      selectedRole === acc.role
                        ? 'border-teal-400 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold">{acc.role}: {acc.id}</span>
                      <span className="text-slate-400">Pass: {acc.password}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {acc.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Multi-Step Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            {forgotStep === 'SUCCESS' ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Password Updated</h3>
                <p className="text-xs text-slate-500">
                  Your credentials have been securely updated. You can now log in with your new password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Self-Service Password Recovery
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step {forgotStep === 'ID' ? '1 of 3: Verification' : forgotStep === 'CODE' ? '2 of 3: OTP Code' : '3 of 3: New Password'}
                  </p>
                </div>

                {forgotStep === 'ID' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student or Staff ID
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotId}
                      onChange={(e) => setForgotId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 uppercase font-mono"
                    />
                    <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Masked email: <strong>sh*****y@gvs.edu</strong></span>
                    </div>
                  </div>
                )}

                {forgotStep === 'CODE' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Enter 6-digit SMS / Email Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotEnteredCode}
                      onChange={(e) => setForgotEnteredCode(e.target.value)}
                      placeholder="492018"
                      className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl text-center font-mono font-bold tracking-widest"
                    />
                    <p className="text-[10px] text-teal-600 mt-1">Prototype verification code: <strong>492018</strong></p>
                  </div>
                )}

                {forgotStep === 'NEW_PASS' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Set New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800"
                  >
                    {forgotStep === 'NEW_PASS' ? 'Update Password' : 'Next Step'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
