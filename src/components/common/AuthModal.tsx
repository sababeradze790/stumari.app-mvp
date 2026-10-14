import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StumariArchIcon } from './StumariLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    openAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    loginAsDemoHost,
    firebaseUser,
    signOutHost,
    theme,
    language,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(authModalMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Sync mode with prop when opened
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
    setError(null);
    setResetSent(false);
  }, [authModalMode, isAuthModalOpen]);

  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setError('Please provide both email and password.');
          setLoading(false);
          return;
        }
        await signInWithEmail(email.trim(), password);
        closeAuthModal();
      } else if (mode === 'signup') {
        if (!email.trim() || !password) {
          setError('Please provide email and password.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, displayName.trim() || 'Host');
        closeAuthModal();
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your email to receive a reset link.');
          setLoading(false);
          return;
        }
        await resetPassword(email.trim());
        setResetSent(true);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err: any) {
      console.warn('Google sign in warning:', err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or use email sign-in.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        // user cancelled, no error needed
      } else {
        setError(err.message || 'Google sign-in encountered an issue. Try email or Demo mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoHost();
    closeAuthModal();
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={closeAuthModal} 
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 440, damping: 30 }}
            className={`relative w-full max-w-md rounded-[28px] border p-6 sm:p-7 shadow-2xl transition-colors duration-300 z-10 overflow-hidden ${
              isDark 
                ? 'bg-[#0E1317] border-stone-800 text-stone-100' 
                : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/15 to-transparent rounded-bl-full pointer-events-none" />

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeAuthModal}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-stone-400 hover:text-white hover:bg-stone-800' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Brand Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 mb-3 shadow-xs border border-amber-500/25">
                <StumariArchIcon size={24} className={isDark ? 'text-amber-400' : 'text-amber-700'} />
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 dark:text-white">
                {mode === 'login' && (language === 'ka' ? 'ავტორიზაცია' : language === 'ru' ? 'Вход в аккаунт' : 'Host Sign In')}
                {mode === 'signup' && (language === 'ka' ? 'რეგისტრაცია' : language === 'ru' ? 'Регистрация' : 'Create Host Account')}
                {mode === 'forgot' && (language === 'ka' ? 'პაროლის აღდგენა' : language === 'ru' ? 'Сброс пароля' : 'Reset Password')}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                {mode === 'login' && 'Manage your properties, digital QR manuals, and guest review alerts.'}
                {mode === 'signup' && 'Generate digital stay guides for your Airbnb or vacation rental in 60s.'}
                {mode === 'forgot' && 'Enter your email address and we will send you a password reset link.'}
              </p>
            </div>

            {/* Currently Logged In Banner */}
            {firebaseUser && (
              <div className={`mb-5 p-3 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] uppercase font-mono font-bold block opacity-80">Currently Signed In</span>
                  <span className="text-xs font-bold truncate block">{firebaseUser.email || firebaseUser.displayName}</span>
                </div>
                <button
                  onClick={async () => {
                    await signOutHost();
                    closeAuthModal();
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-colors flex items-center gap-1 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            {/* Mode Tabs (Sign In / Sign Up) with Sliding layoutId Pill */}
            {mode !== 'forgot' && (
              <div className={`grid grid-cols-2 p-1 rounded-2xl border mb-5 ${
                isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-stone-100 border-stone-200'
              }`}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setMode('login'); setError(null); }}
                  className={`relative py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                    mode === 'login'
                      ? isDark ? 'text-white' : 'text-stone-950'
                      : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {mode === 'login' && (
                    <motion.div
                      layoutId="activeAuthModeTab"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className={`absolute inset-0 rounded-xl shadow-xs ${
                        isDark ? 'bg-stone-800' : 'bg-white'
                      }`}
                    />
                  )}
                  <span className="relative z-10">{language === 'ka' ? 'შესვლა' : language === 'ru' ? 'Войти' : 'Sign In'}</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setMode('signup'); setError(null); }}
                  className={`relative py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                    mode === 'signup'
                      ? isDark ? 'text-white' : 'text-stone-950'
                      : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {mode === 'signup' && (
                    <motion.div
                      layoutId="activeAuthModeTab"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className={`absolute inset-0 rounded-xl shadow-xs ${
                        isDark ? 'bg-stone-800' : 'bg-white'
                      }`}
                    />
                  )}
                  <span className="relative z-10">{language === 'ka' ? 'რეგისტრაცია' : language === 'ru' ? 'Создать' : 'New Account'}</span>
                </motion.button>
              </div>
            )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {/* Reset Password Success */}
        {resetSent && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">Password reset link sent to your email. Check your inbox!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Full Name / Host Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Saba Beradze"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-all ${
                    isDark 
                      ? 'bg-stone-900/90 border-stone-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                      : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="host@stumari.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-all ${
                  isDark 
                    ? 'bg-stone-900/90 border-stone-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                    : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                }`}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-amber-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border transition-all ${
                    isDark 
                      ? 'bg-stone-900/90 border-stone-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                      : 'bg-white border-stone-300 text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              isDark 
                ? 'bg-amber-600 text-white hover:bg-amber-500 active:scale-[0.98]' 
                : 'bg-stone-950 text-white hover:bg-stone-850 active:scale-[0.98]'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Dashboard'}
                  {mode === 'signup' && 'Create Free Host Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Divider */}
        {mode !== 'forgot' && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`} />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono font-bold tracking-wider">
                <span className={`px-2 ${isDark ? 'bg-[#0E1317] text-stone-500' : 'bg-white text-stone-400'}`}>
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Quick 1-Click Action Buttons */}
            <div className="space-y-2">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                  isDark 
                    ? 'border-stone-800 bg-stone-900/60 hover:bg-stone-850 text-stone-200 hover:text-white' 
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
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
                <span>Google One-Click Sign In</span>
              </button>

              {/* 1-Click Demo Host */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className={`w-full py-2 px-3 rounded-xl border border-dashed text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20' 
                    : 'border-amber-400 text-amber-900 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Demo Host (Saba · Tbilisi Superhost)</span>
              </button>
            </div>
          </>
        )}

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-stone-800/20 text-center">
          <p className="text-[10px] text-stone-500 dark:text-stone-400">
            Protected by Firebase Authentication & Google Cloud Security.
          </p>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
