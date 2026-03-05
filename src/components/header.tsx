"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Hexagon } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Mendeteksi scroll untuk efek glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menutup menu mobile otomatis saat pindah halaman
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // MENCEGAH SCROLL BERANDA SAAT MENU HP TERBUKA (Fitur Pro)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Katalog", path: "/product" },
    { name: "Affiliate", path: "/partner" },
    { name: "Company Profile", path: "/company-profile" },
  ];

  return (
    <>
      {/* HEADER UTAMA (Selalu di atas) */}
      <header 
        className={`fixed top-0 w-full z-[60] transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            
            {/* Logo Branding */}
            <Link href="/" className="flex items-center gap-2 z-[60]">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isScrolled || isMobileMenuOpen ? "bg-gray-900 text-white" : "bg-primary text-white"}`}>
                <Hexagon size={18} />
              </div>
              <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled || isMobileMenuOpen ? "text-gray-900" : "text-gray-900"}`}>
                AutoScale
              </span>
            </Link>

            {/* Navigasi Desktop (Disembunyikan di Layar HP) */}
            <nav className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      href={link.path} 
                      className={`text-sm font-bold transition-colors hover:text-primary ${
                        pathname === link.path ? "text-primary" : "text-gray-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="w-px h-5 bg-gray-200"></div>
              <Link 
                href="/admin" 
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md"
              >
                Login
              </Link>
            </nav>

            {/* Tombol Hamburger Menu Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors z-[60]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </header>

      {/* OVERLAY MENU MOBILE (Dipisah dari Header agar tidak terkena efek CSS tumpang tindih) */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-[50] transition-transform duration-300 ease-in-out flex flex-col pt-28 px-6 h-screen w-screen ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-6 mt-4">
          {navLinks.map((link) => (
            <li key={link.path} className="border-b border-gray-100 pb-4">
              <Link 
                href={link.path} 
                className={`text-2xl font-black transition-colors ${
                  pathname === link.path ? "text-primary" : "text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto pb-12">
          <Link 
            href="/admin" 
            className="w-full py-4 bg-gray-900 text-white text-center font-bold rounded-xl shadow-xl shadow-gray-900/20 block"
          >
            Akses Portal Admin
          </Link>
        </div>
      </div>
    </>
  );
}