"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, Search } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Katalog AutoScale</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Semua Produk, <span className="text-primary">Siap Pakai</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Temukan software, template, dan produk digital yang sudah dikurasi khusus untuk bantu bisnis kamu tumbuh lebih cepat.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-lg mx-auto mb-12 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk, kategori, atau kata kunci..."
            className="w-full pl-11 pr-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm text-gray-900 shadow-sm"
          />
        </div>

        {/* GRID PRODUK */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium mb-2">Produk tidak ditemukan.</p>
            <p className="text-sm text-gray-400">Coba kata kunci lain atau lihat semua katalog kami.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              Menampilkan <span className="font-bold text-gray-700">{filteredProducts.length}</span> produk
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const thumbnailUrl = product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all flex flex-col cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="h-56 bg-gray-100 relative overflow-hidden border-b border-gray-100">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Tanpa Gambar</div>
                      )}
                      <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2 shadow-lg text-sm">
                          <Info size={15} /> Lihat Detail
                        </div>
                      </div>
                    </div>

                    {/* Info Produk */}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                        {product.category || "Produk Digital"}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <span className="text-xl font-extrabold text-primary">{formatRupiah(product.price)}</span>
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                          Lihat Selengkapnya
                        </span>
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