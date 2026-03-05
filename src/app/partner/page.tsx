"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { encryptSession, decryptSession } from "../../lib/crypto";
import { Users, Copy, ArrowRight, Wallet, TrendingUp, Link as LinkIcon, CheckCircle2, History, LogOut, MessageSquare, Clock } from "lucide-react";

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
        .from("orders")
        .select("*")
        .eq("partner_code", referralCode)
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
    } catch (error: any) {
      alert("Akses Ditolak: Email atau PIN yang kamu masukkan salah.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem("xander_secure_session"); 
    setIsAuthenticated(false); 
    setPartnerData(null); 
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const formatRupiah = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  if (isCheckingSession) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  // DASHBOARD VIEW
  if (isAuthenticated && partnerData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Mitra</h1>
              <p className="text-gray-600 mt-1">Hei, <span className="font-bold text-gray-900">{partnerData.name}</span> — yuk lihat perkembangan komisi kamu hari ini.</p>
            </div>
            <button onClick={handleLogout} className="px-4 py-2.5 text-red-500 border border-red-100 bg-red-50 rounded-lg text-sm font-bold w-full sm:w-auto hover:bg-red-100 transition-colors">
              Keluar
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <TrendingUp size={16}/>
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Penjualan</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSales} <span className="text-sm text-gray-400 font-medium">Transaksi</span></p>
              <p className="text-xs text-gray-400 mt-2">Seluruh transaksi yang berhasil kamu referensikan</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 border-l-4 border-l-yellow-400 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <Clock size={16}/>
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Komisi Tertunda</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatRupiah(stats.pendingCommission)}</p>
              <p className="text-xs text-gray-400 mt-2">Sedang diproses oleh tim AutoScale</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 border-l-4 border-l-green-500 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                  <Wallet size={16}/>
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Komisi Cair</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatRupiah(stats.paidCommission)}</p>
              <p className="text-xs text-gray-400 mt-2">Total komisi yang sudah masuk ke rekeningmu</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Referral Link Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                <h3 className="font-bold mb-1 flex items-center gap-2 text-base">
                  <LinkIcon size={18}/> Link Afiliasi Kamu
                </h3>
                <p className="text-xs text-gray-400 mb-4">Bagikan link ini ke calon pembeli dan dapatkan komisi otomatis setiap ada transaksi.</p>
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-4 break-all text-sm font-mono text-gray-300">
                  {referralLink}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  {copied
                    ? <><CheckCircle2 size={18} className="text-green-500" /> Berhasil Disalin</>
                    : <><Copy size={18} /> Salin Link</>
                  }
                </button>
              </div>

              {/* Butuh Bantuan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Butuh Bantuan?</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">Ada pertanyaan soal komisi atau status transaksi? Tim AutoScale siap membantu kamu.</p>
                <a
                  href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo Admin AutoScale, saya mitra dengan kode ${partnerData.referral_code}, saya ingin bertanya mengenai...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm"
                >
                  <MessageSquare size={16}/> Chat Admin via WhatsApp
                </a>
              </div>
            </div>

            {/* Riwayat Transaksi */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                    <History size={20}/> Riwayat Penjualan
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Semua transaksi yang berhasil melalui link afiliasi kamu.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 font-medium mb-2">Belum ada transaksi tercatat.</p>
                    <p className="text-sm text-gray-400">Mulai bagikan link afiliasimu dan pantau hasilnya di sini.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-sm text-gray-500">
                          <th className="py-3 px-4 font-medium">Tanggal</th>
                          <th className="py-3 px-4 font-medium">Produk Terjual</th>
                          <th className="py-3 px-4 font-medium">Komisi</th>
                          <th className="py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-xs text-gray-500">
                              {new Date(o.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-bold text-gray-900 text-sm">{o.product_name}</p>
                              <p className="text-xs text-gray-500">Pembeli: {o.customer_name}</p>
                            </td>
                            <td className="py-4 px-4 font-bold text-gray-900 text-sm">
                              {formatRupiah(o.commission_amount)}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1.5 rounded-md text-xs font-bold ${
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

  // LOGIN VIEW
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">

        {/* Card Login */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 mb-6 border border-gray-100">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Masuk ke Dashboard Mitra</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Gunakan email dan PIN yang kamu terima dari tim AutoScale untuk mengakses dashboard afiliasi kamu.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-colors text-sm"
              placeholder="Email Mitra"
            />
            <input
              required
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-colors text-sm"
              placeholder="PIN Rahasia"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 mt-2 flex justify-center items-center gap-2"
            >
              {isLoading ? "Memverifikasi..." : "Masuk Dashboard"} <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Belum jadi mitra AutoScale?{" "}
            <a href="/partner" className="text-gray-900 font-bold hover:underline">Daftar sekarang</a>
          </p>
        </div>

        {/* Info tambahan */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900">Komisi transparan & real-time</p>
            <p className="text-xs text-gray-500 mt-1">Pantau setiap transaksi dan status pencairan komisi kamu langsung dari dashboard ini.</p>
          </div>
        </div>

      </div>
    </div>
  );
}