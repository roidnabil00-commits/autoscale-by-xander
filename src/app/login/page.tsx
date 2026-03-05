"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Hexagon, ArrowRight, ShieldCheck } from "lucide-react";
import { setAdminSession } from "../../app/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      await setAdminSession();
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError("Email atau password yang kamu masukkan salah. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">

      {/* LOGO & JUDUL */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Hexagon size={24} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          AutoScale Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Masuk untuk mengelola produk, mitra, dan transaksi.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khusus admin"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-colors text-sm"
              />
            </div>

            {/* TRUST BADGE */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <ShieldCheck size={15} className="text-green-500 flex-shrink-0" />
              Akses halaman ini hanya untuk admin AutoScale yang terotorisasi.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-md"
            >
              {isLoading ? "Memverifikasi..." : "Masuk ke Admin Panel"} <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Bukan admin? <a href="/" className="text-gray-600 font-bold hover:underline">Kembali ke AutoScale</a>
        </p>
      </div>

    </div>
  );
}