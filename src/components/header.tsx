"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Hexagon } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Katalog", path: "/product" },
    { name: "Affiliate", path: "/partner" },
    { name: "Company Profile", path: "/company-profile" },
  ];

  return (
    <>
      {/* HEADER UTAMA */}
      <header
        className={`fixed top-0 w-full z-[60] transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-2 sm:py-3"
            : "bg-transparent py-3 sm:py-5"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-[60]">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors ${
                isScrolled || isMobileMenuOpen ? "bg-gray-900 text-white" : "bg-primary text-white"
              }`}>
                <Hexagon size={16} />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                AutoScale
              </span>
            </Link>

            {/* Nav Desktop */}
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
              <div className="w-px h-5 bg-gray-200" />
              <Link
                href="/admin"
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md"
              >
                Login
              </Link>
            </nav>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 transition-colors z-[60]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>
      </header>

      {/*
        MOBILE MENU — compact, bukan full screen
        Muncul sebagai drawer kecil dari atas, bukan overlay penuh
      */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-[50] bg-white border-b border-gray-100 shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Spacer setinggi header */}
        <div className="h-12" />

        <div className="px-4 py-4">
          {/* Nav links — horizontal compact */}
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`flex items-center px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
                    pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                  {pathname === link.path && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Tombol admin */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link
              href="/admin"
              className="w-full py-3 bg-gray-900 text-white text-sm text-center font-bold rounded-xl block hover:bg-gray-800 transition-colors"
            >
              Akses Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop tipis saat menu terbuka */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-[40]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}