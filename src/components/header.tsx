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
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Katalog", path: "/product" },
    { name: "Affiliate", path: "/partner" },
    { name: "Company Profile", path: "/company-profile" },
  ];

  // Logika penentu tampilan navbar
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  return (
    <>
      {/* HEADER UTAMA */}
      <header
        className={`fixed top-0 w-full z-[60] transition-all duration-300 ${
          isTransparent
            ? "bg-transparent py-4 sm:py-5"
            : "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-[60]">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isTransparent
                    ? "bg-primary text-white"
                    : "bg-gray-900 text-white"
                }`}
              >
                <Hexagon size={16} />
              </div>
              <span
                className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  isTransparent ? "text-white" : "text-gray-900"
                }`}
              >
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
                      className={`text-sm font-bold transition-colors ${
                        pathname === link.path
                          ? "text-primary"
                          : isTransparent
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div
                className={`w-px h-5 transition-colors ${
                  isTransparent ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
              <Link
                href="/admin"
                className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all shadow-md ${
                  isTransparent
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Login
              </Link>
            </nav>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-1.5 transition-colors z-[60] ${
                isTransparent
                  ? "text-white hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-[50] bg-white border-b border-gray-100 shadow-xl transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="h-16 sm:h-20" />

        <div className="px-4 py-4 pb-6">
          <ul className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${
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

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/admin"
              className="w-full py-3.5 bg-gray-900 text-white text-sm text-center font-bold rounded-xl block hover:bg-gray-800 transition-colors shadow-md"
            >
              Akses Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}