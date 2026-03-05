"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { ShoppingCart, CheckCircle2, ArrowLeft, CreditCard, Tag, ExternalLink, ShieldCheck, Lock, Image as ImageIcon, AlertCircle, MessageSquare } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string;
  demo_url: string;
  price: number;
  image_urls: string[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Checkout states
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ name: "", phone: "" });

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", payment: "Transfer Bank", referral: "",
  });
  const [isReferralLocked, setIsReferralLocked] = useState(false);

  const ADMIN_WA_NUMBER = "6281931656410";

  useEffect(() => {
    if (productId) fetchProductDetail();
    checkSavedReferral();
  }, [productId]);

  const checkSavedReferral = () => {
    const savedRef = localStorage.getItem("autoscale_ref");
    if (savedRef) {
      setFormData((prev) => ({ ...prev, referral: savedRef }));
      setIsReferralLocked(true);
    }
  };

  // FETCH PRODUCT
  const fetchProductDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      if (data) setProduct(data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      setFetchError("Produk tidak ditemukan atau sudah tidak tersedia. Kamu akan diarahkan kembali ke katalog dalam 3 detik.");
      setTimeout(() => router.push("/product"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  // FORM VALIDATION
  const validateForm = (): boolean => {
    const errors = { name: "", phone: "" };
    let isValid = true;

    if (formData.name.trim().length < 2) {
      errors.name = "Nama minimal 2 karakter.";
      isValid = false;
    }

    const phoneRegex = /^(\+62|62|0)[0-9]{8,12}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Format tidak valid. Contoh: 0812xxxxxxxx";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name" || name === "phone") {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setCheckoutError("");
    setCheckoutSuccess(false);
  };

  // CHECKOUT HANDLER
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setCheckoutError("");
    setCheckoutSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    const message =
      `Halo Admin AutoScale!\n` +
      `Saya tertarik dan ingin melanjutkan pembelian produk berikut:\n\n` +
      `*Produk:* ${product.name}\n` +
      `*Harga:* ${formatRupiah(product.price)}\n\n` +
      `*Data Pembeli:*\n` +
      `*Nama:* ${formData.name}\n` +
      `*No. WA:* ${formData.phone}\n` +
      `*Instansi/Perusahaan:* ${formData.address || "-"}\n` +
      `*Metode Pembayaran:* ${formData.payment}\n` +
      (formData.referral ? `*Kode Mitra:* ${formData.referral}\n\n` : `\n`) +
      `Mohon info langkah pembayaran dan pengiriman produknya. Terima kasih!`;

    try {
      const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
      const newWindow = window.open(waUrl, "_blank", "noopener,noreferrer");

      // Deteksi popup blocker
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        setCheckoutError(
          `Browser kamu memblokir popup. Izinkan popup untuk situs ini lalu klik tombol lagi, atau langsung hubungi admin di wa.me/${ADMIN_WA_NUMBER}`
        );
      } else {
        setCheckoutSuccess(true);
      }
    } catch (err) {
      setCheckoutError("Terjadi kesalahan. Silakan coba lagi atau hubungi admin langsung via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-28 pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // FETCH ERROR STATE
  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-28 pb-20 px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{fetchError}</p>
          <button
            onClick={() => router.push("/product")}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = Array.isArray(product.image_urls) ? product.image_urls : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">

        <button
          onClick={() => router.push("/product")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Katalog
        </button>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* KOLOM KIRI */}
          <div className="lg:col-span-7 space-y-8">

            <div>
              <span className="px-3 py-1 bg-gray-900 text-white rounded-md text-xs font-bold tracking-widest uppercase mb-4 inline-block">
                {product.category || "Produk Digital"}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500">
                Produk ini sudah dikurasi oleh tim AutoScale dan siap langsung kamu gunakan.
              </p>
            </div>

            {/* Galeri */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden mb-4 relative border border-gray-100 flex items-center justify-center">
                {images.length > 0 && images[activeImageIndex] ? (
                  <img src={images[activeImageIndex]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-2" /> Tanpa Gambar
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => img && (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Deskripsi & Fitur */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Tentang Produk Ini</h3>
              <p className="text-gray-600 leading-relaxed mb-8 text-justify">{product.description}</p>

              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Yang Kamu Dapatkan</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {product.features ? (
                  product.features.split(',').map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm font-medium leading-snug">{feature.trim()}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Detail fitur belum dicantumkan.</p>
                )}
              </ul>
            </div>
          </div>

          {/* KOLOM KANAN: FORM CHECKOUT */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-28">

              <div className="mb-6">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Harga Produk</p>
                <div className="text-4xl font-black text-primary mb-4">{formatRupiah(product.price)}</div>
                {product.demo_url && (
                  <a
                    href={product.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:border-gray-300 hover:bg-gray-100 transition-all text-sm"
                  >
                    <ExternalLink size={16} /> Lihat Demo / Tutorial
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 mb-5 text-sm text-green-600 font-bold bg-green-50 p-3 rounded-lg border border-green-100">
                <ShieldCheck size={18} /> Pembelian diproses langsung via WhatsApp Admin
              </div>

              {/* SUCCESS NOTIFICATION */}
              {checkoutSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-700">WhatsApp berhasil dibuka!</p>
                    <p className="text-xs text-green-600 mt-0.5">Silakan kirim pesan ke admin dan tunggu balasan untuk langkah selanjutnya.</p>
                  </div>
                </div>
              )}

              {/* ERROR NOTIFICATION */}
              {checkoutError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700">Gagal membuka WhatsApp</p>
                    <p className="text-xs text-red-600 mt-1 leading-relaxed">{checkoutError}</p>
                    <a
                      href={`https://wa.me/${ADMIN_WA_NUMBER}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-700 underline mt-2"
                    >
                      <MessageSquare size={12} /> Hubungi admin langsung
                    </a>
                  </div>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Nama Lengkap</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-colors text-sm ${fieldErrors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-900"}`}
                    placeholder="Nama kamu..."
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">No. WhatsApp Aktif</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-colors text-sm ${fieldErrors.phone ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-900"}`}
                    placeholder="0812..."
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">
                    Nama Bisnis / Instansi <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 focus:bg-white outline-none resize-none transition-colors text-sm"
                    placeholder="Kosongkan jika pembelian personal..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                      <CreditCard size={14} /> Pembayaran
                    </label>
                    <select
                      name="payment"
                      value={formData.payment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none text-sm"
                    >
                      <option value="Transfer Bank BCA/Mandiri">Transfer Bank</option>
                      <option value="E-Wallet">E-Wallet</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                      <Tag size={14} /> Kode Mitra
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="referral"
                        value={formData.referral}
                        onChange={handleInputChange}
                        readOnly={isReferralLocked}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none uppercase transition-colors text-sm ${isReferralLocked ? "bg-gray-100 text-gray-500 font-bold cursor-not-allowed" : "bg-gray-50 focus:border-gray-900 focus:bg-white"}`}
                        placeholder="KODE"
                      />
                      {isReferralLocked && <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Memproses..." : <><ShoppingCart size={18} /> Lanjut ke WhatsApp</>}
                </button>

                <p className="text-center text-xs text-gray-400 mt-2">
                  Admin akan membalas dan memandu proses pembayaran kamu.
                </p>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}