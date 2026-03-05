"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Target, Cpu, Code, Lightbulb, ChevronRight, ChevronLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function CompanyProfilePage() {
  const banners = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">

      {/* BANNER SECTION */}
      <section className="px-4 lg:px-8 mb-16">
        <div className="container mx-auto max-w-7xl">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-900 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentBanner}
                src={banners[currentBanner]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                alt={`Banner AutoScale ${currentBanner + 1}`}
              />
            </AnimatePresence>

            <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentBanner === index ? "bg-primary w-8" : "bg-white/50"}`}
                />
              ))}
            </div>

            {/* Teks Overlay Banner */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
              <p className="text-sm font-semibold text-primary/80 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4 text-white/70 tracking-widest uppercase">
                Xander Systems
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                AutoScale
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-md">
                Platform distribusi software dan produk digital terpercaya untuk bisnis yang ingin tumbuh lebih cepat di era teknologi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY OVERVIEW */}
      <section className="px-4 lg:px-8 mb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Tentang AutoScale</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                AutoScale adalah platform marketplace software dan produk digital yang hadir untuk menjembatani antara developer berbakat dengan bisnis yang membutuhkan solusi teknologi siap pakai.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Kami percaya bahwa setiap bisnis dari UMKM hingga korporat berhak mendapatkan akses ke teknologi terbaik tanpa harus membangunnya dari nol. AutoScale hadir sebagai jembatan itu.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-3xl font-bold text-primary mb-1">2026</p>
                  <p className="text-sm text-gray-500 font-medium">Tahun Berdiri</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary mb-1">100%</p>
                  <p className="text-sm text-gray-500 font-medium">Fokus Pertumbuhan Bisnis</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              <div className="bg-[#FAFAFA] p-6 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visi Kami</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Menjadi distributor software dan produk digital nomor satu di Indonesia tempat bisnis menemukan solusi teknologi yang tepat, cepat, dan terpercaya.
                </p>
              </div>
              <div className="bg-[#FAFAFA] p-6 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Komitmen Kami</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Setiap produk yang ada di AutoScale sudah melalui proses kurasi. Kami tidak asal jual kami pastikan apa yang kamu beli benar-benar memberikan nilai untuk bisnis kamu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE COMPETENCIES */}
      <section className="px-4 lg:px-8 mb-20 bg-gray-50 py-20 border-y border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Apa yang Kami Tawarkan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Solusi digital yang dikurasi untuk berbagai kebutuhan bisnis kamu.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <Code className="text-primary mb-6" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Software Siap Pakai</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dari sistem kasir, aplikasi bisnis, hingga tools produktivitas semua tersedia di katalog AutoScale dan siap langsung digunakan tanpa proses development yang panjang.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <Cpu className="text-primary mb-6" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Produk Digital & Resources</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Template, ebook, source code, dan berbagai aset digital yang membantu kamu bergerak lebih cepat tanpa harus memulai dari nol.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <Building2 className="text-primary mb-6" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Program Affiliate & Mitra</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bergabunglah sebagai mitra AutoScale dan dapatkan komisi dari setiap penjualan. Sistem transparan, dashboard real-time, dan dukungan penuh dari tim kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section className="px-4 lg:px-8 mb-10">
        <div className="container mx-auto max-w-4xl bg-white border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          
          {/* Wadah Foto Profil */}
        <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
         <img 
           src="/abil.png" 
            alt="Bil Xander - CEO AutoScale" 
              className="w-full h-full object-cover object-center"
              />
        </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bil Xander</h2>
            <p className="text-primary font-medium text-sm mb-4">CEO & Sales Director, AutoScale</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Bil Xander mendirikan AutoScale dengan satu keyakinan sederhana di era AI, semua orang bisa membuat software, tapi tidak semua orang tahu cara menjualnya. AutoScale hadir untuk mengisi gap itu: menjadi jembatan antara produk teknologi terbaik dengan bisnis yang membutuhkannya.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}