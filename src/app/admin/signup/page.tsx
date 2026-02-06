'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // NEW: Error and Success states
  const [authError, setAuthError] = useState<string | null>(null);
  const [popup, setPopup] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setAuthError(null);
    setPopup(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      // Show specific formatting errors (like short passwords) below the input
      setAuthError(error.message);
    } else {
      // Show a professional success popup
      setPopup({ 
        msg: 'Account Created! Check your email or login.', 
        type: 'success' 
      });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
      
      {/* PROFESSIONAL POPUP (Replaces alerts) */}
      {popup && (
        <div className={`fixed top-10 right-10 p-4 rounded-2xl shadow-2xl border-l-4 ${popup.type === 'success' ? 'border-green-500' : 'border-red-500'} bg-white flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50`}>
          {popup.type === 'success' ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
          <p className="font-bold text-slate-800 uppercase italic text-sm">{popup.msg}</p>
          <button onClick={() => setPopup(null)} className="ml-4 text-slate-300 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 w-full max-w-md backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">Register Firm</h1>
        <p className="text-slate-500 text-sm mb-8 font-medium">Initialize your business presence</p>

        <div className="space-y-4">
          <input 
            className={`w-full p-4 bg-white/5 border ${authError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl outline-none focus:border-blue-500 transition-all font-bold italic`} 
            placeholder="Email Address" 
            onChange={e => setEmail(e.target.value)} 
          />

          <div className="relative">
            <input 
              className={`w-full p-4 bg-white/5 border ${authError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl outline-none focus:border-blue-500 transition-all font-bold italic`} 
              type={showPassword ? "text" : "password"} 
              placeholder="Create Password" 
              onChange={e => setPassword(e.target.value)} 
            />
            {/* EYE BUTTON */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* INLINE ERROR MESSAGE */}
          {authError && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black italic uppercase tracking-widest mt-2">
              <AlertCircle size={14} />
              {authError}
            </div>
          )}

          <button 
            onClick={handleSignup} 
            disabled={loading}
            className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase italic shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link href="/admin/login" className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors italic">
            Already have a portal? <span className="text-blue-500 underline">Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}