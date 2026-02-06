import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="fixed top-6 right-6 z-50">
          <Link href="/admin" className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-xs font-bold rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">
            Admin Panel
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}