"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, ShoppingCart, Zap, CheckCircle2, Package } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
};

export default function Home() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_urls")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setLatestProducts(data);
    } catch (error) {
      console.error("Error fetching latest products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Bagian Kiri: Copywriting */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.2] lg:leading-[1.1] mb-4 sm:mb-6 tracking-tight">
                Bisnis Lebih Maju, Teknologi Lebih Mudah Semua Ada di <span className="text-primary">AutoScale</span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Temukan software, tools, dan solusi digital siap pakai yang bantu bisnis kamu tumbuh lebih cepat. Tanpa ribet, tanpa pusing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
                <Link href="/product" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-3 bg-primary text-white rounded-xl sm:rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2">
                  Lihat Produk Kami <ArrowRight size={18} />
                </Link>
                <Link href="/partner" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-3 bg-white text-gray-900 border border-gray-200 rounded-xl sm:rounded-lg font-bold hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center">
                  Jadi Mitra Affiliate
                </Link>
                <Link href="https://wa.me/6281931656410" target="_blank" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-3 bg-green-500 text-white rounded-xl sm:rounded-lg font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                  Konsultasi Gratis <ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Transaksi Aman</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Akses Instan</div>
              </div>
            </motion.div>

            {/* Bagian Kanan: Animasi Gambar Melayang */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full h-[280px] sm:h-[400px] lg:h-[480px] bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center overflow-hidden mt-6 lg:mt-0"
            >
              <motion.div 
                animate={{ y: [-15, 15, -15] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-[85%] sm:max-w-[75%] rounded-xl overflow-hidden shadow-2xl border border-gray-100"
              >
                <img 
                  src="https://awsimages.detik.net.id/community/media/visual/2025/06/12/timothyronaldd-1749703592196.png?w=600&q=90" 
                  alt="AutoScale Interface" 
                  className="w-full h-auto object-cover"
                />
              </motion.div>
              
              <motion.div 
                animate={{ y: [10, -10, 10], rotate: [0, 3, -3, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-4 sm:right-8 top-10 sm:top-16 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-100 shadow-lg flex items-center gap-2 z-20"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-700">Sistem Aktif</span>
              </motion.div>

              <div className="absolute bottom-6 sm:bottom-8 text-center text-[10px] sm:text-xs text-gray-400 font-medium z-0 px-4">
                [ AutoScale Xander ]
              </div>
              
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 z-0"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* PRODUK TERBARU */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Package className="text-primary" size={24} /> Produk Terbaru — <span className="text-primary">Langsung Siap Pakai</span>
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">Dipilih dan dikurasi khusus buat kamu yang mau gerak cepat tanpa mulai dari nol.</p>
            </div>
            <Link href="/product" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-purple-700 transition-colors text-sm">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-primary"></div>
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="text-center py-10 sm:py-12 bg-[#FAFAFA] rounded-2xl border border-gray-100">
              <p className="text-gray-500 text-sm sm:text-base font-medium">Belum ada produk yang dipublikasikan di server.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
              {latestProducts.map((product) => {
                const thumbnailUrl = product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null;

                return (
                  <div 
                    key={product.id}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="group bg-[#FAFAFA] rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col cursor-pointer"
                  >
                    <div className="h-44 sm:h-40 bg-gray-200 relative overflow-hidden">
                      {thumbnailUrl ? (
                        <img src={thumbnailUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">Tanpa Gambar</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="mt-auto pt-4 border-t border-gray-100/50 flex justify-between items-center">
                        <p className="text-primary font-bold text-sm sm:text-base">{formatRupiah(product.price)}</p>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 sm:hidden">
            <Link href="/product" className="w-full py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold flex items-center justify-center gap-2 text-sm">
              Lihat Semua Katalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* BENTO GRID FITUR */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAFAFA] border-t border-gray-100 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 sm:mb-10 lg:mb-12 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Belanja Mudah, Prosesnya Beres Sendiri</h2>
            <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg">Dari pilih produk sampai deal semuanya simpel. Kamu tinggal fokus jalanin bisnisnya.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors group shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FAFAFA] rounded-lg border border-gray-200 flex items-center justify-center text-gray-900 group-hover:text-primary mb-4">
                <Code size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-gray-900">Produk Lengkap, Tinggal Pilih</h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">Browse ratusan solusi digital yang sudah dikurasi dan siap langsung kamu pakai untuk bisnis.</p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors group shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FAFAFA] rounded-lg border border-gray-200 flex items-center justify-center text-gray-900 group-hover:text-primary mb-4">
                <Zap size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-gray-900">Langsung Ngobrol, Langsung Deal</h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">Tidak perlu form yang ribet. Pilih produk, langsung chat admin via WhatsApp, dan selesai.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors group shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FAFAFA] rounded-lg border border-gray-200 flex items-center justify-center text-gray-900 group-hover:text-primary mb-4">
                <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-gray-900">Pantau Komisi Kamu Real-Time</h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">Dashboard affiliate yang simpel dan transparan. Pantau setiap konversi dan komisi kamu kapan saja.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}