'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, AlertCircle, X, Eye, EyeOff } from 'lucide-react'; 
import Link from 'next/link'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // NEW: Toggle state
  const [loading, setLoading] = useState(false);
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [systemPopup, setSystemPopup] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    setSystemPopup(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('invalid')) {
        setAuthError("Access Denied: Invalid Credentials");
      } else {
        setSystemPopup(error.message);
      }
    } else {
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
      
      {/* FLOATING SYSTEM POPUP */}
      {systemPopup && (
        <div className="fixed top-6 right-6 bg-white p-4 rounded-2xl shadow-2xl border-l-4 border-red-500 flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50">
          <AlertCircle className="text-red-500" size={20} />
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Error</p>
            <p className="font-bold text-slate-800 uppercase italic text-sm">{systemPopup}</p>
          </div>
          <button onClick={() => setSystemPopup(null)} className="ml-4 text-slate-300 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>
      )}

      <Link 
        href="/" 
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all font-bold text-sm uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Site
      </Link>

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Merchant Portal</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Secure access for verified firms</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Business Email" 
              className={`w-full p-4 bg-white/5 border ${authError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 font-bold italic`}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            {/* PASSWORD FIELD WITH EYE BUTTON */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Security Password" 
                className={`w-full p-4 bg-white/5 border ${authError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 font-bold italic`}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* INLINE ERROR MESSAGE */}
          {authError && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black italic uppercase tracking-widest mt-2 animate-pulse">
              <AlertCircle size={14} />
              {authError}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-[0.98] uppercase italic"
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">New Firm?</p>
          <Link 
            href="/admin/signup" 
            className="inline-flex items-center gap-2 text-white font-black hover:text-blue-400 transition-colors uppercase italic"
          >
            <UserPlus size={18} /> Register Business Portal
          </Link>
        </div>
      </div>
      
      <p className="mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
        Encrypted Endpoint • 2026
      </p>
    </main>
  );
}