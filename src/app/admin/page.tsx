"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Package, Trash2, LogOut, Users, Link as LinkIcon, TrendingUp, CheckCircle2, Clock, Image as ImageIcon, DollarSign } from "lucide-react";
import { destroyAdminSession } from "../../app/actions/auth";

type Product = { id: string; name: string; category: string; description: string; features: string; demo_url: string; price: number; image_urls: string[]; };
type Partner = { id: string; name: string; email: string; referral_code: string; access_pin: string; };
type Order = { id: string; partner_code: string; customer_name: string; product_name: string; sale_price: number; commission_amount: number; status: string; created_at: string; };

export default function AdminPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "partners" | "orders">("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "", category: "SaaS & Platform", description: "", features: "", demo_url: "", price: "",
    image_urls: ["", "", "", "", ""]
  });
  const [partnerForm, setPartnerForm] = useState({ name: "", email: "", pin: "", referralCode: "" });
  const [orderForm, setOrderForm] = useState({ customer_name: "", product_name: "", partner_code: "", sale_price: "", commission_amount: "" });

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      fetchAllData();
      setIsCheckingAuth(false);
    } else {
      handleLogout();
    }
  };

  const fetchAllData = () => { fetchProducts(); fetchPartners(); fetchOrders(); };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await destroyAdminSession();
    router.push("/login");
  };

  const fetchProducts = async () => { const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false }); if (data) setProducts(data); };
  const fetchPartners = async () => { const { data } = await supabase.from("partners").select("*").order("created_at", { ascending: false }); if (data) setPartners(data); };
  const fetchOrders = async () => { const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }); if (data) setOrders(data); };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...productForm.image_urls];
    newImages[index] = value;
    setProductForm({ ...productForm, image_urls: newImages });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = productForm.image_urls.filter(url => url.trim() !== "");
    if (validImages.length < 2) {
      alert("Minimal 2 gambar produk wajib diisi.");
      return;
    }
    setIsFormLoading(true);
    const { error } = await supabase.from("products").insert([{
      name: productForm.name, category: productForm.category, description: productForm.description,
      features: productForm.features, demo_url: productForm.demo_url, price: parseFloat(productForm.price),
      image_urls: validImages
    }]);
    setIsFormLoading(false);
    if (error) alert("Gagal menambahkan produk: " + error.message);
    else {
      setProductForm({ name: "", category: "SaaS & Platform", description: "", features: "", demo_url: "", price: "", image_urls: ["", "", "", "", ""] });
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => { if (confirm("Hapus produk ini secara permanen?")) { await supabase.from("products").delete().eq("id", id); fetchProducts(); } };

  const handlePartnerChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPartnerForm({ ...partnerForm, [e.target.name]: e.target.value }); };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault(); setIsFormLoading(true);
    const code = partnerForm.referralCode.toUpperCase().replace(/\s+/g, "");
    try {
      const { data: existingCode } = await supabase.from("partners").select("id").eq("referral_code", code).single();
      if (existingCode) throw new Error("Kode referral sudah dipakai.");
      const { data: existingEmail } = await supabase.from("partners").select("id").eq("email", partnerForm.email).single();
      if (existingEmail) throw new Error("Email ini sudah terdaftar sebagai mitra.");
      const { error } = await supabase.from("partners").insert([{ name: partnerForm.name, email: partnerForm.email, access_pin: partnerForm.pin, referral_code: code }]);
      if (error) throw error;
      alert("Mitra berhasil ditambahkan. Kirimkan email dan PIN ke yang bersangkutan.");
      setPartnerForm({ name: "", email: "", pin: "", referralCode: "" }); fetchPartners();
    } catch (error: any) { alert("Gagal: " + error.message); } finally { setIsFormLoading(false); }
  };

  const handleDeletePartner = async (id: string) => { if (confirm("Hapus mitra ini?")) { await supabase.from("partners").delete().eq("id", id); fetchPartners(); } };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault(); setIsFormLoading(true);
    const { error } = await supabase.from("orders").insert([{ customer_name: orderForm.customer_name, product_name: orderForm.product_name, partner_code: orderForm.partner_code, sale_price: parseFloat(orderForm.sale_price), commission_amount: parseFloat(orderForm.commission_amount), status: "pending" }]);
    setIsFormLoading(false);
    if (error) alert("Gagal merekam transaksi: " + error.message);
    else { alert("Transaksi berhasil dicatat."); setOrderForm({ customer_name: "", product_name: "", partner_code: "", sale_price: "", commission_amount: "" }); fetchOrders(); }
  };

  const toggleOrderStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "paid" : "pending";
    await supabase.from("orders").update({ status: newStatus }).eq("id", id); fetchOrders();
  };

  const handleDeleteOrder = async (id: string) => { if (confirm("Hapus data transaksi ini?")) { await supabase.from("orders").delete().eq("id", id); fetchOrders(); } };

  const formatRupiah = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  // Kalkulasi stats
  const totalOmzet = orders.reduce((sum, o) => sum + Number(o.sale_price), 0);
  const totalKomisi = orders.filter(o => o.status === "pending").reduce((sum, o) => sum + Number(o.commission_amount), 0);

  if (isCheckingAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola produk, mitra, dan transaksi AutoScale dari sini.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <Package size={15} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Produk</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            <p className="text-xs text-gray-400 mt-1">Produk aktif di katalog</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Users size={15} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Mitra</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{partners.length}</p>
            <p className="text-xs text-gray-400 mt-1">Mitra affiliate aktif</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <TrendingUp size={15} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Omzet</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalOmzet)}</p>
            <p className="text-xs text-gray-400 mt-1">Dari {orders.length} transaksi</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 border-l-4 border-l-yellow-400 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                <Clock size={15} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Komisi Tertunda</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalKomisi)}</p>
            <p className="text-xs text-gray-400 mt-1">Belum dicairkan ke mitra</p>
          </div>
        </div>

        {/* TAB MENU */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-8 bg-white p-1.5 rounded-xl border w-full max-w-3xl shadow-sm">
          <button onClick={() => setActiveTab("products")} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "products" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"}`}>
            <Package size={16} /> Katalog Produk
          </button>
          <button onClick={() => setActiveTab("partners")} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "partners" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"}`}>
            <Users size={16} /> Mitra Afiliasi
          </button>
          <button onClick={() => setActiveTab("orders")} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "orders" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-primary"}`}>
            <TrendingUp size={16} /> Penjualan & Komisi
          </button>
        </div>

        {/* TAB: PRODUK */}
        {activeTab === "products" && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in">
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm sticky top-28 h-fit">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Plus size={18} /> Tambah Produk Baru
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Informasi Produk</p>
                  <input required name="name" value={productForm.name} onChange={handleProductChange} placeholder="Nama Produk" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                  <select required name="category" value={productForm.category} onChange={handleProductChange} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white">
                    <option value="SaaS & Platform">SaaS & Platform</option>
                    <option value="Source Code">Source Code</option>
                    <option value="Template Web">Template Web</option>
                    <option value="Integrasi AI">Integrasi AI</option>
                  </select>
                  <textarea required name="description" value={productForm.description} onChange={handleProductChange} placeholder="Deskripsi singkat produk ini..." rows={2} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary resize-none bg-white"></textarea>
                  <textarea name="features" value={productForm.features} onChange={handleProductChange} placeholder="Fitur-fitur produk (pisahkan dengan koma)" rows={2} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary resize-none bg-white"></textarea>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon size={14} /> Gambar Produk (min. 2)
                  </p>
                  {productForm.image_urls.map((url, index) => (
                    <input
                      key={index}
                      type="text"
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`URL Gambar ${index + 1}${index < 2 ? ' (wajib)' : ' (opsional)'}`}
                      className="w-full p-2 border rounded-lg text-sm outline-none focus:border-primary bg-white"
                      required={index < 2}
                    />
                  ))}
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harga & Demo</p>
                  <input required type="number" name="price" value={productForm.price} onChange={handleProductChange} placeholder="Harga (Rp)" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                  <input name="demo_url" value={productForm.demo_url} onChange={handleProductChange} placeholder="URL Demo / Tutorial (opsional)" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                </div>

                <button type="submit" disabled={isFormLoading} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors">
                  {isFormLoading ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden h-fit">
              <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2"><Package size={18} /> Daftar Produk</h2>
                <span className="text-xs text-gray-400 font-medium">{products.length} produk</span>
              </div>
              <div className="overflow-x-auto p-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="py-3 px-4">Nama Produk</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">Belum ada produk ditambahkan.</td></tr>
                    ) : (
                      products.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-sm text-gray-900">{p.name}</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-md">{p.category}</span></td>
                          <td className="py-3 px-4 text-sm font-medium">{formatRupiah(p.price)}</td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MITRA */}
        {activeTab === "partners" && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in">
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm sticky top-28 h-fit">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Plus size={18} /> Tambah Mitra Baru
              </h2>
              <form onSubmit={handleAddPartner} className="space-y-3">
                <input required name="name" value={partnerForm.name} onChange={handlePartnerChange} placeholder="Nama Mitra" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 bg-white" />
                <input required type="email" name="email" value={partnerForm.email} onChange={handlePartnerChange} placeholder="Email Mitra" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 bg-white" />
                <input required name="pin" value={partnerForm.pin} onChange={handlePartnerChange} placeholder="PIN Akses" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 bg-white" />
                <input required name="referralCode" value={partnerForm.referralCode} onChange={handlePartnerChange} placeholder="KODE REFERRAL" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 uppercase bg-white" />
                <button type="submit" disabled={isFormLoading} className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 mt-2 transition-colors">
                  {isFormLoading ? "Menyimpan..." : "Tambah Mitra"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden h-fit">
              <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2"><Users size={18} /> Daftar Mitra Aktif</h2>
                <span className="text-xs text-gray-400 font-medium">{partners.length} mitra</span>
              </div>
              <div className="overflow-x-auto p-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="py-3 px-4">Mitra</th>
                      <th className="py-3 px-4">PIN Akses</th>
                      <th className="py-3 px-4">Kode Referral</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">Belum ada mitra terdaftar.</td></tr>
                    ) : (
                      partners.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-bold text-sm text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.email}</p>
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">{p.access_pin}</td>
                          <td className="py-3 px-4">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold tracking-widest">
                              <LinkIcon size={10} className="inline mr-1" />{p.referral_code}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => handleDeletePartner(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PENJUALAN & KOMISI */}
        {activeTab === "orders" && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in">
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm sticky top-28 h-fit">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-primary">
                <TrendingUp size={18} /> Catat Transaksi Baru
              </h2>
              <form onSubmit={handleAddOrder} className="space-y-3">
                <input required type="text" value={orderForm.customer_name} onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })} placeholder="Nama Pembeli" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                <select required value={orderForm.product_name} onChange={(e) => setOrderForm({ ...orderForm, product_name: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white">
                  <option value="" disabled>Produk Terjual...</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select required value={orderForm.partner_code} onChange={(e) => setOrderForm({ ...orderForm, partner_code: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white">
                  <option value="" disabled>Mitra Referral (jika ada)...</option>
                  <option value="TIDAK_ADA">-- Tanpa Mitra (Penjualan Langsung) --</option>
                  {partners.map(p => <option key={p.id} value={p.referral_code}>{p.name} ({p.referral_code})</option>)}
                </select>
                <input required type="number" value={orderForm.sale_price} onChange={(e) => setOrderForm({ ...orderForm, sale_price: e.target.value })} placeholder="Harga Jual (Rp)" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                <input required type="number" value={orderForm.commission_amount} onChange={(e) => setOrderForm({ ...orderForm, commission_amount: e.target.value })} placeholder="Komisi Mitra (Rp)" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                <button type="submit" disabled={isFormLoading} className="w-full py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 mt-2 transition-colors">
                  {isFormLoading ? "Menyimpan..." : "Catat Transaksi"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden h-fit">
              <div className="p-6 border-b bg-primary/5 flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2"><CheckCircle2 size={18} className="text-primary" /> Riwayat Transaksi</h2>
                <span className="text-xs text-gray-400 font-medium">{orders.length} transaksi</span>
              </div>
              <div className="overflow-x-auto p-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="py-3 px-4">Detail Transaksi</th>
                      <th className="py-3 px-4">Mitra</th>
                      <th className="py-3 px-4">Komisi</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-400">Belum ada transaksi tercatat.</td></tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-900 text-sm line-clamp-1">{o.product_name}</p>
                            <p className="text-xs text-gray-500">Pembeli: {o.customer_name}</p>
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-700">
                            {o.partner_code !== "TIDAK_ADA" ? o.partner_code : "-"}
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-primary">{formatRupiah(o.commission_amount)}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleOrderStatus(o.id, o.status)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 mx-auto transition-all shadow-sm w-28 ${o.status === "paid" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}
                            >
                              {o.status === "paid" ? <><CheckCircle2 size={14} /> Selesai</> : <><Clock size={14} /> Diproses</>}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => handleDeleteOrder(o.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}