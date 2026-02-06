import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 text-black">
      <Link href="/" className="text-xl font-black text-blue-600">
        QR<span className="text-gray-900">PORTAL</span>
      </Link>
      <div className="flex gap-6">
        <Link href="/" className="text-sm font-bold hover:text-blue-600 transition">Home</Link>
        <Link href="/admin" className="text-sm font-bold hover:text-blue-600 transition">Admin</Link>
      </div>
    </nav>
  );
}