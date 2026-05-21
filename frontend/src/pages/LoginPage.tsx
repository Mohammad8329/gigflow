import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ThemeToggle } from '../components/ThemeToggle';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isLoading, clearError } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null); // Clear previous errors on new submit
    
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      // Safely extract the message your backend sent
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setFormError(message);
    }
};

  return (
    <div className="auth-page-container relative flex items-center justify-center min-h-screen w-full bg-gradient-to-tr from-sky-200 via-blue-100 to-purple-200 dark:from-blue-950 dark:via-slate-950 dark:to-purple-950 px-4 overflow-hidden">
      {/* Premium Ambient Light Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-sky-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/30 dark:bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-75"></div>

      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg bg-white/20 dark:bg-slate-950/20 backdrop-blur-xl border border-white/30 dark:border-slate-800/30 rounded-[2.5rem] shadow-2xl p-8 relative z-10 transition-all duration-300">
        <div className="pt-2 pb-2">
          {/* Header Icon */}
          <div className="bg-slate-900/10 dark:bg-white/10 shadow-md w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-white/30 dark:border-slate-800/30 rounded-2xl">
            <LogIn className="h-6 w-6 text-black dark:text-white" />
          </div>
          {/* Header Texts */}
          <h2 className="text-3xl font-extrabold tracking-tight text-center text-black dark:text-white mb-2">
            Sign in with email
          </h2>
          <p className="text-sm text-center text-black/85 dark:text-slate-300 mb-6 leading-relaxed">
            Access your leads, analytics, and sales pipeline. For free
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-sky-500/10 dark:bg-sky-500/5 border border-sky-200/50 dark:border-sky-500/20 rounded-2xl text-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0 dark:from-sky-500/0 dark:via-sky-500/10 dark:to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <p className="font-bold text-black dark:text-white mb-3 text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            Demo Credentials
          </p>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-800/80 transition-colors">
              <div className="flex flex-col">
                <span className="font-bold text-black dark:text-white text-xs">Admin User</span>
                <span className="text-[10px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">Has CSV Export</span>
              </div>
              <span className="font-mono text-xs bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm mt-1 sm:mt-0 select-all cursor-pointer">admin@crm.com / password123</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-800/80 transition-colors">
              <div className="flex flex-col">
                <span className="font-bold text-black dark:text-white text-xs">Sales User</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Standard Access</span>
              </div>
              <span className="font-mono text-xs bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm mt-1 sm:mt-0 select-all cursor-pointer">rahul@crm.com / password123</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Icon */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 dark:text-slate-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                required
                placeholder="Email"
                className="pl-12 h-12 bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl focus-visible:ring-2 focus-visible:ring-sky-500 text-base text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field with Icon and Toggle */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 dark:text-slate-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                className="pl-12 pr-12 h-12 bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl focus-visible:ring-2 focus-visible:ring-sky-500 text-base text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 hover:text-black dark:text-slate-400 dark:hover:text-white focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="text-sm text-red-500 font-medium text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                {formError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 text-white rounded-2xl text-base font-extrabold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Get Started'}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-black dark:text-slate-300 mt-6 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-black dark:text-white hover:underline font-extrabold transition-colors">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};  