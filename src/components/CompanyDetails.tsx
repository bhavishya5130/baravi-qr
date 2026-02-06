export default function CompanyDetails({ company }: { company: any }) {
  return (
    <div className="relative py-16 px-8 mb-12 overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="relative z-10 text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
          Official Business Portal
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight uppercase">
          {company?.name || "Our Business"}
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {company?.description || "Select a product below to generate a secure payment QR code instantly."}
        </p>
      </div>
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
    </div>
  );
}