'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, LogOut, Package, Store, Save, Trash2, 
  Edit3, X, Copy, Plus, Home, AlertCircle, CheckCircle2, 
  QrCode, Download, Grid, Menu 
} from 'lucide-react';
import Link from 'next/link';
import QRCode from 'react-qr-code'; 

// Helper for currency symbols
const getSymbol = (code: string) => {
  const symbols: { [key: string]: string } = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };
  return symbols[code] || '$';
};

export default function AdminDashboard() {
  const [company, setCompany] = useState({ name: '', description: '' });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  // Sidebar & Form States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pCurrency, setPCurrency] = useState('USD');
  const [pUrl, setPUrl] = useState('');

  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // Shop URL for QR and Copy Link
  const shopUrl = user ? `${window.location.origin}/catalog?firm=${user.id}` : '';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setUser(session.user);
        fetchData(session.user.id);
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async (userId: string) => {
    setLoading(true);
    const { data: profile } = await supabase.from('company_profile').select('*').eq('user_id', userId).single();
    const { data: items } = await supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (profile) setCompany({ name: profile.name, description: profile.description });
    if (items) setProducts(items);
    setLoading(false);
  };

  const copyShopLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setNotification({ msg: "Shop link copied!", type: 'success' });
  };

  const downloadQR = () => {
    const svg = document.getElementById("MerchantQR") as HTMLElement | null;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${company.name || 'Merchant'}-QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const updateCompany = async () => {
    const { error } = await supabase.from('company_profile').upsert({ 
      name: company.name, 
      description: company.description, 
      user_id: user.id 
    }, { onConflict: 'user_id' });
    
    if (error) {
      setNotification({ msg: `Update Failed: ${error.message}`, type: 'error' });
    } else {
      setNotification({ msg: "Brand Identity Synced!", type: 'success' });
    }
  };

  const addProduct = async () => {
    if (!pName || !pPrice) return setNotification({ msg: "Enter Name and Price", type: 'error' });
    const { error } = await supabase.from('products').insert([{ 
      name: pName, price: parseFloat(pPrice), currency: pCurrency, payment_url: pUrl, user_id: user.id, description: 'Premium Product' 
    }]);
    if (!error) {
      setPName(''); setPPrice(''); setPUrl(''); fetchData(user.id);
      setNotification({ msg: "Product Added!", type: 'success' });
    }
  };

  const deleteProduct = async (id: number) => {
    if (confirm('Delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) { fetchData(user.id); setNotification({ msg: "Product Deleted.", type: 'success' }); }
    }
  };

  const handleUpdateProduct = async () => {
    const { error } = await supabase.from('products').update({
      name: editingProduct.name, price: editingProduct.price, currency: editingProduct.currency, payment_url: editingProduct.payment_url
    }).eq('id', editingProduct.id);
    if (!error) { setEditingProduct(null); fetchData(user.id); setNotification({ msg: "Listing Updated!", type: 'success' }); }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white text-3xl font-black italic uppercase">Loading Terminal...</div>;

  return (
    <main className="min-h-screen bg-[#f8fafc] flex font-sans overflow-hidden relative">
      
      {/* 1. MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. RESPONSIVE SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70]
        w-80 bg-white border-r border-slate-100 h-screen overflow-y-auto p-6 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col flex-shrink-0
      `}>
        <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                    <Store size={20} />
                </div>
                <h1 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase">Brand Profile</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={24} /></button>
        </div>

        {/* QR Section */}
        <div className="flex flex-col items-center mb-8">
            <div className="bg-slate-50 p-5 rounded-[2.5rem] border border-slate-100 shadow-inner mb-4">
                {user && <QRCode id="MerchantQR" value={shopUrl} size={140} viewBox={`0 0 256 256`} />}
            </div>
            <button onClick={downloadQR} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-3 py-1 rounded-full transition-all">
                <Download size={12} /> Get QR Assets
            </button>
        </div>

        {/* Identity Inputs */}
        <div className="space-y-4 mb-auto">
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Firm Identity</label>
                <input 
                    className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-black italic uppercase outline-none focus:border-blue-100 focus:bg-white transition-all" 
                    placeholder="Firm Name" 
                    value={company.name} 
                    onChange={e => setCompany({...company, name: e.target.value})} 
                />
            </div>
            <textarea 
                className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl h-32 outline-none focus:border-blue-100 focus:bg-white transition-all text-sm leading-relaxed" 
                placeholder="Brand Bio" 
                value={company.description} 
                onChange={e => setCompany({...company, description: e.target.value})} 
            />
            <button onClick={updateCompany} className="w-full py-4 bg-slate-900 text-white font-black italic uppercase rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
                <Save size={18} /> Sync Brand
            </button>
        </div>

        <div className="pt-6 border-t border-slate-100">
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/admin/login'))} className="w-full p-4 text-red-500 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 rounded-2xl transition-all">
                <LogOut size={16} /> Logout Terminal
            </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <section className="flex-1 h-screen overflow-y-auto bg-[#f8fafc] relative">
        
        {/* MOBILE TOP BAR (Hidden on PC) */}
        <div className="lg:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-50">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-50 rounded-xl text-slate-600 shadow-sm"><Menu size={24} /></button>
            <h2 className="font-black italic uppercase tracking-tighter text-slate-900">Merchant Hub</h2>
            <div className="w-10"></div>
        </div>

        {/* NOTIFICATION POPUP */}
        {notification && (
            <div className={`fixed top-10 right-10 p-4 rounded-2xl shadow-2xl border-l-4 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'} bg-white flex items-center gap-3 animate-in slide-in-from-right duration-300 z-[100]`}>
                {notification.type === 'success' ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
                <p className="font-bold text-slate-800 uppercase italic text-sm">{notification.msg}</p>
                <button onClick={() => setNotification(null)} className="ml-4 text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
            </div>
        )}

        <div className="max-w-5xl mx-auto p-6 md:p-12">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Management</h2>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Inventory System v2.0</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/" className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Home size={20} /></Link>
                    <button onClick={copyShopLink} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Copy size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                
                {/* NEW LISTING FORM BAR */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Plus size={14} /> Create New Deployment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input className="p-4 bg-slate-50 border border-transparent rounded-2xl font-black italic uppercase outline-none focus:bg-white transition-all" placeholder="Product Name" value={pName} onChange={e => setPName(e.target.value)} />
                        <div className="flex gap-2">
                            <select className="p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-500 outline-none" value={pCurrency} onChange={e => setPCurrency(e.target.value)}>
                                <option value="USD">$</option><option value="INR">₹</option><option value="EUR">€</option><option value="GBP">£</option>
                            </select>
                            <input className="flex-1 p-4 bg-slate-50 border border-transparent rounded-2xl font-mono outline-none" placeholder="0.00" value={pPrice} onChange={e => setPPrice(e.target.value)} />
                        </div>
                        <input className="p-4 bg-slate-50 border border-transparent rounded-2xl outline-none" placeholder="Payment Link" value={pUrl} onChange={e => setPUrl(e.target.value)} />
                        <button onClick={addProduct} className="py-4 bg-blue-600 text-white font-black italic uppercase rounded-2xl shadow-xl hover:bg-blue-500 transition-all">Deploy Item</button>
                    </div>
                </div>

                {/* ACTIVE CATALOG GRID */}
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 px-2 flex items-center gap-2"><Grid size={14} /> Live Inventory ({products.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.map((p) => (
                            <div key={p.id} className="p-8 bg-white border border-slate-50 rounded-[2.5rem] flex justify-between items-center group hover:shadow-2xl transition-all border-b-4 border-b-transparent hover:border-b-blue-600">
                                <div>
                                    <p className="font-black italic text-slate-900 uppercase text-2xl tracking-tighter">{p.name}</p>
                                    <p className="text-blue-600 font-black mt-1 text-lg">{getSymbol(p.currency)}{p.price}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingProduct(p)} className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-colors"><Edit3 size={20} /></button>
                                    <button onClick={() => deleteProduct(p.id)} className="p-4 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl transition-colors"><Trash2 size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setEditingProduct(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-slate-900">Edit Listing</h3>
            <div className="space-y-4">
              <input className="w-full p-4 bg-slate-50 border rounded-2xl font-black italic uppercase outline-none text-slate-900" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
              <div className="flex gap-2">
                <select className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none text-slate-600" value={editingProduct.currency} onChange={(e) => setEditingProduct({...editingProduct, currency: e.target.value})}>
                  <option value="USD">$</option><option value="INR">₹</option><option value="EUR">€</option><option value="GBP">£</option>
                </select>
                <input className="flex-1 p-4 bg-slate-50 border rounded-2xl font-mono outline-none text-slate-900" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
              </div>
              <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none text-slate-900" value={editingProduct.payment_url} onChange={(e) => setEditingProduct({...editingProduct, payment_url: e.target.value})} />
              <button onClick={handleUpdateProduct} className="w-full py-5 bg-blue-600 text-white font-black italic uppercase rounded-2xl hover:bg-blue-500 transition-all">Update Listing</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}