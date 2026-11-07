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
  CheckCircle2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'PARENT' | 'STUDENT'>('PARENT');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('parent123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 6-Digit MFA state (Preserved for Administrative Roles)
  const [mfaDigits, setMfaDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaResendCountdown, setMfaResendCountdown] = useState(30);
  const mfaInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    login,
    pendingMfa,
    verifyMfa,
    cancelMfa,
    currentUser,
    isAuthenticated,
    currentRole,
    logout
  } = useAuth();

  const navigate = useNavigate();

  // MFA Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pendingMfa && mfaResendCountdown > 0) {
      timer = setTimeout(() => setMfaResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [pendingMfa, mfaResendCountdown]);

  const resolveTargetRole = (id: string): UserRole => {
    const clean = id.trim().toUpperCase();
    if (clean.startsWith('ADM') || clean.includes('ADMIN')) return 'ADMIN';
    if (clean.startsWith('PRN') || clean.includes('PRINCIPAL')) return 'PRINCIPAL';
    if (clean.startsWith('TCH') || clean.includes('TEACHER')) return 'TEACHER';
    if (clean.startsWith('STU') || clean.startsWith('GVS')) return 'STUDENT';
    return 'PARENT'; // default for mobile number or parent account
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMfaError(null);

    let idToUse = identifier.trim();
    if (idToUse.includes(' · ')) {
      idToUse = idToUse.split(' · ')[0].trim();
    }
    if (idToUse.includes(' - ')) {
      idToUse = idToUse.split(' - ')[0].trim();
    }
    let passToUse = password;

    // Automatic zero-specification defaults
    if (!idToUse) {
      idToUse = selectedRole === 'PARENT' ? '9876543210' : 'GVS-2027-0001';
      setIdentifier(idToUse);
    }
    if (!passToUse) {
      passToUse = selectedRole === 'PARENT' ? 'parent123' : 'student123';
      setPassword(passToUse);
    }

    let targetRole: UserRole = selectedRole;
    const clean = idToUse.toUpperCase();
    if (clean.startsWith('ADM') || clean.includes('ADMIN')) targetRole = 'ADMIN';
    else if (clean.startsWith('PRN') || clean.includes('PRINCIPAL')) targetRole = 'PRINCIPAL';
    else if (clean.startsWith('TCH') || clean.includes('TEACHER')) targetRole = 'TEACHER';
    else if (selectedRole === 'PARENT') targetRole = 'PARENT';
    else if (selectedRole === 'STUDENT') targetRole = 'STUDENT';

    setIsLoading(true);
    try {
      const success = await login(idToUse, passToUse, targetRole);
      if (success) {
        navigate(`/${targetRole.toLowerCase()}/dashboard`);
      }
    } catch {
      setError('Unable to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-[#e8f0eb] font-['DM_Sans',sans-serif] antialiased text-[#17232f]">
      
      {/* =========================================================================
          LEFT PANE: Forest Green Copy & Typography (Exact Original App Theme)
         ========================================================================= */}
      <div className="bg-[#075b54] text-white p-8 sm:p-14 lg:p-[10vw_10%] flex flex-col justify-center">
        <p className="text-[0.72rem] font-bold tracking-[0.16em] text-[#f28b45] uppercase mb-4">
          FUTURESCHOOL PLATFORM
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-[4.4rem] font-bold leading-[1.05] tracking-tight max-w-[700px] mb-5 text-white font-['Space_Grotesk',sans-serif]">
          One calm place for your whole school.
        </h1>

        <p className="text-base sm:text-[1.15rem] text-[#c7dfd7] max-w-[480px] leading-relaxed">
          Attendance, learning, fees and family communication in one connected workspace.
        </p>

        <div className="flex flex-wrap items-center gap-[30px] text-[0.8rem] font-semibold text-[#9dc7ba] mt-12 lg:mt-16">
          <span>01 / Learn</span>
          <span>02 / Manage</span>
          <span>03 / Connect</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANE: Clean Card with Orange "FS" Emblem & Exact Inputs
         ========================================================================= */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px] bg-white rounded-[14px] border border-[#dbe5df] shadow-[0_20px_55px_rgba(14,57,45,0.12)] p-7 sm:p-10 my-auto">
          
          {/* Active Session Notification */}
          {isAuthenticated && currentUser && (
            <div className="mb-5 p-3 rounded-xl bg-[#e8f3ef] border border-[#dbe5df] text-xs text-[#075b54] flex items-center justify-between">
              <div>
                <span className="font-bold block">Workstation Active: {currentUser.name}</span>
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

          {/* Orange "FS" Brand Mark */}
          <div className="w-10 h-10 rounded-[10px] bg-[#f28b45] text-white font-bold text-base flex items-center justify-center tracking-tight mb-6 shadow-xs font-['Space_Grotesk',sans-serif]">
            FS
          </div>

          <h2 className="text-[2rem] font-bold tracking-tight text-[#17232f] font-['Space_Grotesk',sans-serif]">
            Welcome back
          </h2>
          <p className="text-[0.95rem] text-[#71808c] mt-1 mb-5 font-normal">
            Sign in to your school workspace
          </p>

          {/* MFA 6-Digit Challenge for Administrative Roles */}
          {pendingMfa ? (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#fff6e7] border-l-4 border-[#f28b45] text-xs text-[#81551f]">
                <span className="font-bold block">Two-Factor Authentication Required</span>
                <span>Please enter the 6-digit security token from your authenticator app.</span>
              </div>

              {mfaError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {mfaError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#17232f] text-center mb-2">
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
            /* Standard Login Form */
            <form onSubmit={handleManualLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              {/* Sign in as Dropdown (Only Student and Parent) */}
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
                    if (newRole === 'PARENT') {
                      setIdentifier('9876543210');
                      setPassword('parent123');
                    } else {
                      setIdentifier('GVS-2027-0001');
                      setPassword('student123');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] font-semibold focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73] transition-all cursor-pointer"
                >
                  <option value="PARENT">Parent</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>

              {/* Login Identifier Input */}
              <div>
                <label className="block text-xs font-bold text-[#17232f] mb-1.5">
                  {selectedRole === 'PARENT' ? 'Registered Mobile Number or Parent ID' : 'Admission Number or Student ID'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={selectedRole === 'PARENT' ? 'Enter registered mobile (e.g. 9876543210)' : 'Enter Admission No (e.g. GVS-2027-0001)'}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73] transition-all font-medium"
                />
                {selectedRole === 'PARENT' && (
                  <p className="text-[11px] text-[#71808c] mt-1">
                    No ID needed — simply click Login to enter parent portal.
                  </p>
                )}
              </div>

              {/* Password Input with "Show password" Button */}
              <div>
                <label className="block text-xs font-bold text-[#17232f] mb-1.5">
                  Password
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="flex-1 px-3.5 py-2.5 text-sm border border-[#e4e9e8] rounded-[7px] bg-white text-[#17232f] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#087f73] focus:border-[#087f73] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 bg-[#d9ebe5] hover:bg-[#c5e0d7] text-[#075b54] font-bold text-xs px-3.5 py-2.5 rounded-[7px] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {showPassword ? 'Hide password' : 'Show password'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#087f73] hover:bg-[#075b54] active:scale-[0.99] text-white font-bold text-sm py-3 px-4 rounded-[7px] transition-all shadow-sm cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>

              <div className="pt-3 text-center space-y-2">
                <p className="text-xs text-[#71808c]">
                  School faculty or staff?{' '}
                  <span 
                    onClick={() => {
                      setIdentifier('TCH0001');
                      setPassword('teacher123');
                    }}
                    className="font-semibold text-[#087f73] hover:underline cursor-pointer"
                  >
                    Teacher
                  </span>
                  {' · '}
                  <span 
                    onClick={() => {
                      setIdentifier('PRN0001');
                      setPassword('principal123');
                    }}
                    className="font-semibold text-[#087f73] hover:underline cursor-pointer"
                  >
                    Principal
                  </span>
                  {' · '}
                  <span 
                    onClick={() => {
                      setIdentifier('ADM0001');
                      setPassword('admin123');
                    }}
                    className="font-semibold text-[#087f73] hover:underline cursor-pointer"
                  >
                    Admin
                  </span>
                </p>
                <p className="text-[11px] text-[#a0aec0]">
                  Need support? <span className="text-[#087f73] hover:underline cursor-pointer">Contact School Helpdesk</span>
                </p>
              </div>

            </form>
          )}

        </div>
      </div>

    </div>
  );
};
