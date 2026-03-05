"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { encryptSession, decryptSession } from "../../lib/crypto";
import { Users, Copy, ArrowRight, Wallet, TrendingUp, Link as LinkIcon, CheckCircle2, History, MessageSquare, Clock } from "lucide-react";

type Partner = { id: string; name: string; email: string; referral_code: string; };
type Order = { id: string; customer_name: string; product_name: string; sale_price: number; commission_amount: number; status: string; created_at: string; };

export default function PartnerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const [partnerData, setPartnerData] = useState<Partner | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalSales: 0, pendingCommission: 0, paidCommission: 0 });
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  const ADMIN_WA_NUMBER = "6281234567890";

  useEffect(() => {
    const savedEncryptedSession = localStorage.getItem("xander_secure_session");
    if (savedEncryptedSession) {
      const parsedData = decryptSession(savedEncryptedSession);
      if (parsedData) {
        setPartnerData(parsedData);
        setReferralLink(`${window.location.origin}/product?ref=${parsedData.referral_code}`);
        fetchPartnerData(parsedData.referral_code);
      } else {
        handleLogout();
        setIsCheckingSession(false);
      }
    } else {
      setIsCheckingSession(false);
    }
  }, []);

  const fetchPartnerData = async (referralCode: string) => {
    try {
      const { data, error } = await supabase
        .from("orders").select("*").eq("partner_code", referralCode)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) {
        setOrders(data);
        const totalSales = data.length;
        const pendingCommission = data.filter(o => o.status === "pending").reduce((sum, o) => sum + Number(o.commission_amount), 0);
        const paidCommission = data.filter(o => o.status === "paid").reduce((sum, o) => sum + Number(o.commission_amount), 0);
        setStats({ totalSales, pendingCommission, paidCommission });
      }
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("partners").select("*").eq("email", email).eq("access_pin", pin).single();
      if (error || !data) throw new Error("Invalid");
      const encryptedData = encryptSession(data);
      localStorage.setItem("xander_secure_session", encryptedData);
      setPartnerData(data);
      setReferralLink(`${window.location.origin}/product?ref=${data.referral_code}`);
      await fetchPartnerData(data.referral_code);
    } catch {
      alert("Email atau PIN yang kamu masukkan salah.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("xander_secure_session");
    setIsAuthenticated(false);
    setPartnerData(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  // LOADING
  if (isCheckingSession) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────
  if (isAuthenticated && partnerData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-20 sm:pt-28 pb-20">
        {/* Wrapper konsisten dengan halaman lain */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-row justify-between items-start mb-6 sm:mb-8 gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">Dashboard Partner</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Hei, <span className="font-bold text-gray-900">{partnerData.name}</span> — yuk lihat perkembangan komisi kamu.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 px-3 sm:px-4 py-2 text-red-500 border border-red-100 bg-red-50 rounded-lg text-xs sm:text-sm font-bold hover:bg-red-100 transition-colors"
            >
              Keluar
            </button>
          </div>

          {/* Stats Cards
              Mobile  : 1 kolom penuh, compact
              Desktop : 3 kolom
          */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 sm:block">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 sm:mb-3">
                <TrendingUp size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-2">Total Penjualan</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {stats.totalSales} <span className="text-xs sm:text-sm text-gray-400 font-medium">Transaksi</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 hidden sm:block">Seluruh transaksi yang berhasil kamu referensikan</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 border-l-4 border-l-yellow-400 shadow-sm flex items-center gap-4 sm:block">
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0 sm:mb-3">
                <Clock size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-2">Komisi Tertunda</p>
                <p className="text-lg sm:text-3xl font-bold text-gray-900 leading-tight truncate">{formatRupiah(stats.pendingCommission)}</p>
                <p className="text-xs text-gray-400 mt-1 hidden sm:block">Sedang diproses oleh tim AutoScale</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 border-l-4 border-l-green-500 shadow-sm flex items-center gap-4 sm:block">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 sm:mb-3">
                <Wallet size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-2">Komisi Cair</p>
                <p className="text-lg sm:text-3xl font-bold text-gray-900 leading-tight truncate">{formatRupiah(stats.paidCommission)}</p>
                <p className="text-xs text-gray-400 mt-1 hidden sm:block">Total komisi yang sudah masuk ke rekeningmu</p>
              </div>
            </div>

          </div>

          {/*
            Layout konten bawah:
            Mobile  : 1 kolom (referral card → bantuan → tabel)
            Desktop : sidebar kiri + tabel kanan
          */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

            {/* Kiri: Referral + Bantuan */}
            <div className="lg:col-span-1 flex flex-col gap-4">

              {/* Referral Card */}
              <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <h3 className="font-bold mb-1 flex items-center gap-2 text-sm">
                  <LinkIcon size={15} /> Link Afiliasi Kamu
                </h3>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  Bagikan link ini ke calon pembeli dan dapatkan komisi otomatis.
                </p>
                {/* Scroll horizontal kalau link panjang */}
                <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 mb-3 overflow-x-auto">
                  <p className="text-xs font-mono text-gray-300 whitespace-nowrap">{referralLink}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full py-2.5 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
                >
                  {copied
                    ? <><CheckCircle2 size={15} className="text-green-500" /> Berhasil Disalin</>
                    : <><Copy size={15} /> Salin Link</>
                  }
                </button>
              </div>

              {/* Bantuan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Butuh Bantuan?</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Ada pertanyaan soal komisi atau status transaksi? Tim AutoScale siap membantu.
                </p>
                <a
                  href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo Admin AutoScale, saya mitra dengan kode ${partnerData.referral_code}, saya ingin bertanya mengenai...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm"
                >
                  <MessageSquare size={15} /> Chat Admin via WhatsApp
                </a>
              </div>
            </div>

            {/* Kanan: Tabel Riwayat */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h3 className="text-sm sm:text-lg font-bold flex items-center gap-2 text-gray-900">
                    <History size={17} /> Riwayat Penjualan
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Semua transaksi yang berhasil melalui link afiliasi kamu.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-gray-500 font-medium text-sm mb-1">Belum ada transaksi tercatat.</p>
                    <p className="text-xs text-gray-400">Mulai bagikan link afiliasimu dan pantau hasilnya di sini.</p>
                  </div>
                ) : (
                  /* Tabel dengan scroll horizontal di mobile */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" style={{ minWidth: "480px" }}>
                      <thead>
                        <tr className="border-b border-gray-100 text-xs text-gray-500">
                          <th className="py-3 px-4 font-medium whitespace-nowrap">Tanggal</th>
                          <th className="py-3 px-4 font-medium">Produk Terjual</th>
                          <th className="py-3 px-4 font-medium whitespace-nowrap">Komisi</th>
                          <th className="py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">
                              {new Date(o.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-gray-900 text-xs sm:text-sm">{o.product_name}</p>
                              <p className="text-xs text-gray-400">Pembeli: {o.customer_name}</p>
                            </td>
                            <td className="py-3 px-4 font-bold text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                              {formatRupiah(o.commission_amount)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap ${
                                o.status === "paid"
                                  ? "bg-green-50 text-green-700 border border-green-100"
                                  : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                              }`}>
                                {o.status === "paid" ? "Sudah Cair" : "Diproses"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── LOGIN ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-md">

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 mb-5 border border-gray-100">
            <Users size={22} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Masuk ke Dashboard Mitra</h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
            Gunakan email dan PIN yang kamu terima dari tim AutoScale untuk mengakses dashboard afiliasi kamu.
          </p>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              required type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-colors text-sm"
              placeholder="Email Mitra"
            />
            <input
              required type="password" value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-colors text-sm"
              placeholder="PIN Rahasia"
            />
            <button
              type="submit" disabled={isLoading}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
            >
              {isLoading ? "Memverifikasi..." : "Masuk Dashboard"} <ArrowRight size={17} />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Belum jadi mitra AutoScale?{" "}
            <a href="/partner" className="text-gray-900 font-bold hover:underline">Daftar sekarang</a>
          </p>
        </div>

        <div className="mt-3 bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm">
          <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900">Komisi transparan & real-time</p>
            <p className="text-xs text-gray-500 mt-0.5">Pantau setiap transaksi dan status pencairan komisi langsung dari dashboard ini.</p>
          </div>
        </div>

      </div>
    </div>
  );
}