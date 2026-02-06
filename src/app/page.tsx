'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };
    getUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8">
        Merchant Platform
      </h1>

      <div className="flex gap-4">
        {/* If logged in, go to YOUR specific catalog. If not, go to login. */}
        <Link 
          href={userId ? `/catalog?firm=${userId}` : '/admin/login'}
          className="px-8 py-4 bg-blue-600 font-bold italic uppercase rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
        >
          View My Catalog
        </Link>

        <Link 
          href="/admin/login"
          className="px-8 py-4 bg-white/10 border border-white/20 font-bold italic uppercase rounded-2xl hover:bg-white/20 transition-all"
        >
          Admin Portal
        </Link>
      </div>
    </main>
  );
}