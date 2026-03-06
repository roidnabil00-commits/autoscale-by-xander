"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import {
  ShoppingCart, CheckCircle2, ArrowLeft, CreditCard, Tag,
  ExternalLink, ShieldCheck, Lock, Image as ImageIcon,
  AlertCircle, MessageSquare
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string;
  demo_url: string;
  price_min: number;
  price_max: number;
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

  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ name: "", phone: "" });

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", payment: "Transfer Bank", referral: "",
  });
  const [isReferralLocked, setIsReferralLocked] = useState(false);

  const ADMIN_WA_NUMBER = "6281234567890";

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

  const fetchProductDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("products").select("*").eq("id", productId).single();
      if (error) throw error;
      if (data) setProduct(data);
    } catch (error: any) {
      setFetchError("Produk tidak ditemukan atau sudah tidak tersedia. Kamu akan diarahkan kembali ke katalog dalam 3 detik.");
      setTimeout(() => router.push("/product"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  // Format harga — range atau tunggal
  const formatHarga = (min: number, max: number) => {
    if (!min && !max) return null;
    if (!max || min === max) return { type: "fixed", label: formatRupiah(min) };
    return { type: "range", min: formatRupiah(min), max: formatRupiah(max) };
  };

  const validateForm = (): boolean => {
    const errors = { name: "", phone: "" };
    let isValid = true;
    if (formData.name.trim().length < 2) { errors.name = "Nama minimal 2 karakter."; isValid = false; }
    const phoneRegex = /^(\+62|62|0)[0-9]{8,12}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) { errors.phone = "Format tidak valid. Contoh: 0812xxxxxxxx"; isValid = false; }
    setFieldErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name" || name === "phone") setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setCheckoutError("");
    setCheckoutSuccess(false);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setCheckoutError("");
    setCheckoutSuccess(false);
    if (!validateForm()) return;
    setIsSubmitting(true);

    const hargaInfo = formatHarga(product.price_min, product.price_max);
    const hargaText = hargaInfo
      ? hargaInfo.type === "range"
        ? `${hargaInfo.min} – ${hargaInfo.max} (nego)`
        : hargaInfo.label
      : "Harga belum ditentukan";

    const message =
      `Halo Admin AutoScale!\n` +
      `Saya tertarik dan ingin melanjutkan pembelian produk berikut:\n\n` +
      `*Produk:* ${product.name}\n` +
      `*Harga:* ${hargaText}\n\n` +
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
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        setCheckoutError(`Browser kamu memblokir popup. Izinkan popup lalu klik tombol lagi, atau langsung hubungi admin di wa.me/${ADMIN_WA_NUMBER}`);
      } else {
        setCheckoutSuccess(true);
      }
    } catch {
      setCheckoutError("Terjadi kesalahan. Silakan coba lagi atau hubungi admin langsung.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOADING
  if (isLoading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );

  // FETCH ERROR
  if (fetchError) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">{fetchError}</p>
        <button onClick={() => router.push("/product")} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
          Kembali ke Katalog
        </button>
      </div>
    </div>
  );

  if (!product) return null;

  const images = Array.isArray(product.image_urls) ? product.image_urls : [];
  const hargaInfo = formatHarga(product.price_min, product.price_max);
  const isRange = hargaInfo?.type === "range";

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 sm:pt-28 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <button
          onClick={() => router.push("/product")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Katalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* ── KOLOM KIRI ──────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7">

            {/* Judul */}
            <div>
              <span className="px-3 py-1 bg-gray-900 text-white rounded-md text-xs font-bold tracking-widest uppercase mb-3 inline-block">
                {product.category || "Produk Digital"}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Produk ini sudah dikurasi oleh tim AutoScale dan siap langsung kamu gunakan.
              </p>
            </div>

            {/* Galeri */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                {images.length > 0 && images[activeImageIndex] ? (
                  <img src={images[activeImageIndex]} alt={product.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <ImageIcon size={36} /> <span className="text-xs">Tanpa Gambar</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => img && (
                    <button key={idx} onClick={() => setActiveImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? "border-primary shadow-sm" : "border-transparent opacity-50 hover:opacity-80"}`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Deskripsi & Fitur */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-3">Tentang Produk Ini</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-3">Yang Kamu Dapatkan</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features ? (
                  product.features.split(',').map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-xs sm:text-sm font-medium leading-snug">{feature.trim()}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Detail fitur belum dicantumkan.</p>
                )}
              </ul>
            </div>
          </div>

          {/* ── KOLOM KANAN: CHECKOUT ───────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 lg:sticky lg:top-28">

              {/* Harga */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Harga Produk</p>

                {hargaInfo ? (
                  isRange ? (
                    /* Tampilan harga RANGE */
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-black text-primary">{hargaInfo.min}</span>
                        <span className="text-gray-400 font-bold text-sm">–</span>
                        <span className="text-2xl sm:text-3xl font-black text-primary">{hargaInfo.max}</span>
                      </div>
                      {/* Badge nego */}
                      <div className="inline-flex items-center gap-1.5 mt-2 bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">
                        💬 Harga dapat dinegosiasikan via WhatsApp
                      </div>
                    </div>
                  ) : (
                    /* Tampilan harga FIXED */
                    <div className="text-3xl sm:text-4xl font-black text-primary mb-3">
                      {hargaInfo.label}
                    </div>
                  )
                ) : (
                  <div className="text-lg font-bold text-gray-500 mb-3">Hubungi Admin untuk Harga</div>
                )}

                {product.demo_url && (
                  <a href={product.demo_url} target="_blank" rel="noreferrer"
                    className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all text-sm"
                  >
                    <ExternalLink size={15} /> Lihat Demo / Tutorial
                  </a>
                )}
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-green-600 font-bold bg-green-50 p-3 rounded-xl border border-green-100">
                <ShieldCheck size={16} /> Pembelian diproses langsung via WhatsApp Admin
              </div>

              {/* Success */}
              {checkoutSuccess && (
                <div className="mb-4 p-3.5 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-700">WhatsApp berhasil dibuka!</p>
                    <p className="text-xs text-green-600 mt-0.5">Silakan kirim pesan ke admin dan tunggu balasan.</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {checkoutError && (
                <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700">Gagal membuka WhatsApp</p>
                    <p className="text-xs text-red-600 mt-1 leading-relaxed">{checkoutError}</p>
                    <a href={`https://wa.me/${ADMIN_WA_NUMBER}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-700 underline mt-1.5">
                      <MessageSquare size={11} /> Hubungi admin langsung
                    </a>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleCheckout} className="space-y-3.5">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 block">Nama Lengkap</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange}
                    placeholder="Nama kamu..."
                    className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-colors text-sm ${fieldErrors.name ? "border-red-400" : "border-gray-200 focus:border-gray-900"}`}
                  />
                  {fieldErrors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} /> {fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 block">No. WhatsApp Aktif</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    placeholder="0812..."
                    className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-colors text-sm ${fieldErrors.phone ? "border-red-400" : "border-gray-200 focus:border-gray-900"}`}
                  />
                  {fieldErrors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} /> {fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 block">
                    Nama Bisnis / Instansi <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2}
                    placeholder="Kosongkan jika pembelian personal..."
                    className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 focus:bg-white outline-none resize-none transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <CreditCard size={13} /> Pembayaran
                    </label>
                    <select name="payment" value={formData.payment} onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none text-sm"
                    >
                      <option value="Transfer Bank BCA/Mandiri">Transfer Bank</option>
                      <option value="E-Wallet">E-Wallet</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Tag size={13} /> Kode Mitra
                    </label>
                    <div className="relative">
                      <input type="text" name="referral" value={formData.referral} onChange={handleInputChange}
                        readOnly={isReferralLocked} placeholder="KODE"
                        className={`w-full px-3 py-3 border border-gray-200 rounded-xl outline-none uppercase transition-colors text-sm ${isReferralLocked ? "bg-gray-100 text-gray-500 font-bold cursor-not-allowed" : "bg-gray-50 focus:border-gray-900 focus:bg-white"}`}
                      />
                      {isReferralLocked && <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-4 mt-1 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Memproses..." : <><ShoppingCart size={17} /> Lanjut ke WhatsApp</>}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Admin akan memandu proses pembayaran kamu.
                </p>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}