"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, ChevronRight, Star, ShieldCheck, Zap, Percent } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  category: string;
  price_min: number;
  price_max: number;
  image_urls: string[];
};

// Array gambar untuk slider hero. Silakan ganti dengan URL poster Anda.
const heroImages = [
  "https://i.imgur.com/PlKjsbk.png", 
  "xander.jpg", 
  "autoscale.jpg", 
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Efek Slider Otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // Berganti setiap 3 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price_min, price_max, image_urls")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      if (data) {
        setProducts(data);
        const cats = Array.from(
          new Set(data.map((p) => p.category).filter(Boolean))
        ) as string[];
        setCategories(cats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const formatHarga = (min: number, max: number) => {
    if (!min && !max) return "Nego";
    if (!max || min === max) return formatRupiah(min);
    return formatRupiah(min);
  };

  const hasRange = (min: number, max: number) => max > 0 && min !== max;

  const filtered = activeCategory
    ? products.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-24 pb-12 lg:pt-32 lg:pb-16 relative z-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Bagian Gambar - Urutan pertama di mobile, urutan kedua di desktop */}
            <div className="order-1 lg:order-2 relative w-full max-w-[260px] sm:max-w-[340px] lg:max-w-md mx-auto mt-4 lg:mt-0 aspect-video flex justify-center items-center">
              <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full z-0" />
              
              {heroImages.map((src, index) => {
                // Menentukan posisi gambar berdasarkan currentImageIndex
                let positionClass = "";
                if (index === currentImageIndex) {
                  // Posisi Depan Tengah
                  positionClass = "z-20 scale-100 opacity-100 translate-x-0 rotate-0 shadow-2xl border-white/20";
                } else if (index === (currentImageIndex + 1) % heroImages.length) {
                  // Posisi Belakang Kanan
                  positionClass = "z-10 scale-90 opacity-50 translate-x-12 sm:translate-x-16 rotate-6 shadow-lg border-white/10";
                } else {
                  // Posisi Belakang Kiri
                  positionClass = "z-10 scale-90 opacity-50 -translate-x-12 sm:-translate-x-16 -rotate-6 shadow-lg border-white/10";
                }

                return (
                  <img
                    key={index}
                    src={src}
                    alt={`AutoScale Background ${index}`}
                    className={`absolute w-full h-full rounded-xl border object-cover transition-all duration-700 ease-in-out cursor-pointer ${positionClass}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                );
              })}
            </div>

            {/* Bagian Teks - Urutan kedua di mobile, urutan pertama di desktop */}
            <div className="order-2 lg:order-1 text-center lg:text-left z-10">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 lg:mb-4 tracking-tight">
                Solusi Digital <br className="hidden lg:block" />
                <span className="text-primary">For You All</span>
              </h1>
              <p className="text-gray-400 text-xs sm:text-base mb-6 lg:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Platform penyedia software, technology, digital product, source code, dan tools premium yang siap pakai dengan harga terjangkau.
              </p>

              {/* Search Bar */}
              <div className="max-w-md mx-auto lg:mx-0 mb-6 lg:mb-8 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari software, tools, template..."
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
                  onClick={() => router.push("/product")}
                  readOnly
                />
              </div>

              {/* Tombol CTA */}
              <div className="flex flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
                <Link
                  href="/product"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 w-full sm:w-auto"
                >
                  Belanja <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
                <Link
                  href="/partner"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-xs sm:text-sm hover:bg-white/10 transition-colors flex items-center justify-center w-full sm:w-auto"
                >
                  Jadi Mitra
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── INFO STRIP ───────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 shadow-sm relative z-10 -mt-6 mx-4 sm:mx-6 lg:mx-auto max-w-5xl rounded-xl">
        <div className="grid grid-cols-3 divide-x divide-gray-100 py-3 sm:py-5">
          <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2">
            <ShieldCheck size={20} className="text-primary mb-1 sm:mb-2 sm:w-6 sm:h-6" />
            <p className="text-gray-900 font-bold text-[10px] sm:text-sm">Transaksi Aman</p>
            <p className="text-gray-500 text-[9px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">Dijamin & terverifikasi</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2">
            <Zap size={20} className="text-primary mb-1 sm:mb-2 sm:w-6 sm:h-6" />
            <p className="text-gray-900 font-bold text-[10px] sm:text-sm">Akses Instan</p>
            <p className="text-gray-500 text-[9px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">Live Project</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2">
            <Percent size={20} className="text-primary mb-1 sm:mb-2 sm:w-6 sm:h-6" />
            <p className="text-gray-900 font-bold text-[10px] sm:text-sm">Komisi 10%+</p>
            <p className="text-gray-500 text-[9px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">Program affiliate</p>
          </div>
        </div>
      </section>

      {/* ── FILTER KATEGORI ──────────────────────────────────── */}
      {!isLoading && categories.length > 0 && (
        <section className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 lg:top-[72px] z-30 mt-6 sm:mt-8 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-2 overflow-x-auto py-2.5 sm:py-3 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <button
                onClick={() => setActiveCategory("")}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border ${
                  activeCategory === ""
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border ${
                    activeCategory === cat
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GRID PRODUK ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-xl font-bold text-gray-900">
            {activeCategory ? `Kategori: ${activeCategory}` : "Rekomendasi Produk"}
          </h2>
          <Link href="/product" className="text-primary text-xs sm:text-sm font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 mt-2 sm:mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium text-sm mb-4">Produk tidak ditemukan di kategori ini.</p>
            <button onClick={() => setActiveCategory("")} className="px-4 py-2 bg-primary text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90">
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {filtered.map((product) => {
              const thumb = product.image_urls?.[0] ?? null;
              const range = hasRange(product.price_min, product.price_max);

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] sm:text-xs">
                        Tanpa Gambar
                      </div>
                    )}
                    {product.category && (
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-1.5 sm:p-2">
                        <span className="text-white text-[9px] sm:text-[10px] font-medium tracking-wide">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-gray-800 text-xs sm:text-sm font-medium leading-relaxed mb-1 line-clamp-2 min-h-[34px] sm:min-h-[40px]">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                      <Star size={10} className="fill-yellow-400 text-yellow-400 sm:w-3 sm:h-3" />
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium">5.0</span>
                      <span className="text-[10px] sm:text-xs text-gray-400 ml-1 border-l border-gray-300 pl-1.5 sm:pl-2">Terjual 0</span>
                    </div>

                    <div className="mt-auto">
                      <p className="text-primary font-bold text-sm sm:text-base tracking-tight">
                        {formatHarga(product.price_min, product.price_max)}
                      </p>
                      {range && (
                        <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1">
                          Hingga {formatRupiah(product.price_max)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}