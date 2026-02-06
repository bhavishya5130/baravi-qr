'use client';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // Updated URL to include the firm (user_id) for multi-tenant support
  const checkoutUrl = `${baseUrl}/checkout/${product.id}?firm=${product.user_id}`;

  return (
    <Link href={checkoutUrl} className="block group">
      <div className="p-8 text-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-1 tracking-tight group-hover:text-blue-400 transition-colors uppercase italic">
              {product.name}
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              {product.description || "Limited Edition"}
            </p>
          </div>
          <span className="text-2xl font-black text-blue-400 tracking-tighter">${product.price}</span>
        </div>
        
        <div className="bg-white p-5 rounded-[2.5rem] flex flex-col items-center shadow-[0_0_40px_rgba(59,130,246,0.15)] group-hover:shadow-blue-500/30 transition-all duration-500">
          {baseUrl && (
            <div className="p-2 bg-white rounded-2xl">
              <QRCodeCanvas 
                value={checkoutUrl} 
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
          )}
          <div className="mt-5 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] group-hover:text-blue-600 transition-colors">
              Secure Checkout
            </p>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">
              Scan or Click
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}