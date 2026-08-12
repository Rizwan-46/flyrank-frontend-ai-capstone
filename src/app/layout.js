import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Pet Care Management',
  description: 'Manage your pets, appointments, and medical records.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Navigation Bar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
              PetCare App
            </Link>
            
            <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-600">
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
              <Link href="/dashboard/pets" className="hover:text-blue-600 transition-colors">Pets</Link>
              <Link href="/health" className="hover:text-blue-600 transition-colors">Health Check</Link>
              <Link href="/login" className="px-3 py-1 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Login</Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 p-8 text-center text-sm flex flex-col gap-4 mt-auto">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
          <p>© {new Date().getFullYear()} Pet Care Management Capstone.</p>
        </footer>
      </body>
    </html>
  );
}