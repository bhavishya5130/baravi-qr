import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: { firm: string } 
}) {
  const firmId = searchParams.firm;

  // Security check: if no firm ID is provided, show an error
  if (!firmId) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <p className="font-bold tracking-widest uppercase">Invalid Merchant Link</p>
      </div>
    );
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', firmId);

  const { data: company } = await supabase
    .from('company_profile')
    .select('*')
    .eq('user_id', firmId)
    .single();

  return (
    <main className="min-h-screen bg-[#020617] p-8 md:p-20 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
          <div>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase">
              {company?.name || "Collection"}
            </h2>
            <p className="text-slate-500 mt-2 font-medium max-w-md">
              {company?.description}
            </p>
          </div>
          <Link href="/" className="px-6 py-2 border border-slate-700 text-slate-400 rounded-full hover:bg-white hover:text-black transition-all font-bold text-sm">
            RETURN HOME
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products?.map((product) => (
            <div key={product.id} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-slate-900/40 border border-white/10 backdrop-blur-xl p-2 rounded-[2.5rem]">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}