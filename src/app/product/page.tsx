"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_urls: string[];
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 sm:pt-28 pb-20">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">

        {/* HEADER */}
        <div className="text-center mb-5 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Katalog AutoScale</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Semua Produk, <span className="text-primary">Siap Pakai</span>
          </h1>
          <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            Dikurasi khusus untuk bantu bisnis kamu tumbuh lebih cepat.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-lg mx-auto mb-5 sm:mb-8 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau kategori..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm text-gray-900 shadow-sm"
          />
        </div>

        {/* GRID PRODUK */}
        {isLoading ? (
          <div className="flex justify-center items-center h-52">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium mb-1">Produk tidak ditemukan.</p>
            <p className="text-xs text-gray-400">Coba kata kunci lain.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3 sm:mb-5">
              Menampilkan <span className="font-bold text-gray-600">{filteredProducts.length}</span> produk
            </p>

            {/* 
              GRID:
              - Mobile  : 2 kolom (marketplace style)
              - Tablet  : 3 kolom
              - Desktop : 4 kolom
            */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
              {filteredProducts.map((product, index) => {
                const thumbnailUrl = product.image_urls?.[0] ?? null;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all flex flex-col cursor-pointer group active:scale-[0.98]"
                  >
                    {/* Thumbnail — rasio kotak supaya seragam */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          Tanpa Gambar
                        </div>
                      )}
                      {/* Kategori badge di atas gambar */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                          {product.category || "Digital"}
                        </span>
                      </div>
                    </div>

                    {/* Info Produk — compact untuk mobile */}
                    <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-1.5">
                        {product.name}
                      </h3>
                      {/* Deskripsi — sembunyikan di mobile, tampil di sm+ */}
                      <p className="hidden sm:block text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3 flex-grow">
                        {product.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-1">
                        <span className="text-primary font-extrabold text-xs sm:text-sm">
                          {formatRupiah(product.price)}
                        </span>
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                          <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}