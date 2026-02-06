'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { ShoppingBag, Truck, CreditCard, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  useEffect(() => {
    async function getProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
    }
    getProduct();
  }, [id]);

  if (!product) return <div className="min-h-screen bg-[#020617] text-white p-10 font-black">PREPARING CHECKOUT...</div>;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: CUSTOMER DETAILS */}
        <section className="space-y-8">
          <Link href="/catalog" className="flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition">
            <ChevronLeft size={20} /> Back to Collection
          </Link>
          <h1 className="text-4xl font-black tracking-tighter">SECURE CHECKOUT</h1>
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Truck size={16}/> Shipping Logistics</h2>
            <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} />
            <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl h-32 outline-none" placeholder="Delivery Address" onChange={e => setForm({...form, address: e.target.value})} />
            <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="Phone Number" onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
        </section>

        {/* RIGHT: ORDER SUMMARY */}
        <section className="bg-[#020617] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2"><ShoppingBag size={16}/> Your Selection</h2>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
              <span className="text-2xl font-bold">{product.name}</span>
              <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20">-</button>
                <span className="font-black w-4 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20">+</button>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${(product.price * qty).toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-400"><span>Shipping</span><span className="text-blue-400 font-bold uppercase text-xs">Calculated at next step</span></div>
              <div className="flex justify-between text-3xl font-black pt-4 border-t border-white/10"><span>TOTAL</span><span>${(product.price * qty).toFixed(2)}</span></div>
            </div>

            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20">
              <CreditCard size={20} /> COMPLETE PURCHASE
            </button>
          </div>
          
          {/* Background Glow */}
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
        </section>
      </div>
    </main>
  );
}