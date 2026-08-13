import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}