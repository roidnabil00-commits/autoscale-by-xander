"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import {
  Plus, Package, Trash2, LogOut, Users, Link as LinkIcon,
  TrendingUp, CheckCircle2, Clock, Image as ImageIcon,
  DollarSign, Eye, EyeOff, Filter, Pencil, X, Save
} from "lucide-react";
import { destroyAdminSession } from "../../app/actions/auth";

type Product = {
  id: string; name: string; category: string; description: string;
  features: string; demo_url: string; price_min: number; price_max: number; image_urls: string[];
};
type Partner = {
  id: string; name: string; email: string; referral_code: string;
  access_pin: string; commission_rate: number;
};
type Order = {
  id: string; partner_code: string; customer_name: string; product_name: string;
  sale_price: number; commission_amount: number; status: string; created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "partners" | "orders">("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // PIN visibility per baris
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  // Edit produk inline
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "", category: "", description: "", features: "",
    demo_url: "", price_min: "", price_max: "", image_urls: ["", "", "", "", ""]
  });
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Filter transaksi
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "paid">("all");

  const [productForm, setProductForm] = useState({
    name: "", category: "", description: "", features: "", demo_url: "",
    price_min: "", price_max: "", image_urls: ["", "", "", "", ""]
  });
  const [partnerForm, setPartnerForm] = useState({
    name: "", email: "", pin: "", referralCode: "", commission_rate: "10"
  });
  const [orderForm, setOrderForm] = useState({
    customer_name: "", product_id: "", partner_code: "", sale_price: ""
  });

  // Auto-hitung komisi
  const selectedPartner = partners.find(p => p.referral_code === orderForm.partner_code);
  const autoCommission = selectedPartner && orderForm.sale_price
    ? Math.round((selectedPartner.commission_rate / 100) * parseFloat(orderForm.sale_price))
    : 0;
  const selectedProduct = products.find(p => p.id === orderForm.product_id);

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { fetchAllData(); setIsCheckingAuth(false); }
    else { handleLogout(); }
  };

  const fetchAllData = () => { fetchProducts(); fetchPartners(); fetchOrders(); };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await destroyAdminSession();
    router.push("/login");
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };
  const fetchPartners = async () => {
    const { data } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
    if (data) setPartners(data);
  };
  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (validImages.length < 2) { alert("Minimal 2 gambar produk wajib diisi."); return; }
    const priceMin = parseFloat(productForm.price_min);
    const priceMax = parseFloat(productForm.price_max);
    if (priceMax < priceMin) { alert("Harga maksimal tidak boleh lebih kecil dari harga minimal."); return; }
    setIsFormLoading(true);
    const { error } = await supabase.from("products").insert([{
      name: productForm.name,
      category: productForm.category.trim() || "Produk Digital",
      description: productForm.description, features: productForm.features,
      demo_url: productForm.demo_url, price_min: priceMin, price_max: priceMax,
      image_urls: validImages
    }]);
    setIsFormLoading(false);
    if (error) alert("Gagal menambahkan produk: " + error.message);
    else {
      setProductForm({ name: "", category: "", description: "", features: "", demo_url: "", price_min: "", price_max: "", image_urls: ["", "", "", "", ""] });
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Hapus produk ini secara permanen?")) { await supabase.from("products").delete().eq("id", id); fetchProducts(); }
  };

  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    const imgs = [...(p.image_urls || []), "", "", "", "", ""].slice(0, 5);
    setEditForm({
      name: p.name, category: p.category || "", description: p.description || "",
      features: p.features || "", demo_url: p.demo_url || "",
      price_min: String(p.price_min || ""), price_max: String(p.price_max || ""),
      image_urls: imgs
    });
  };

  const handleCancelEdit = () => { setEditingProductId(null); };

  const handleSaveEdit = async (id: string) => {
    const priceMin = parseFloat(editForm.price_min);
    const priceMax = parseFloat(editForm.price_max);
    if (priceMax < priceMin) { alert("Harga maksimal tidak boleh lebih kecil dari harga minimal."); return; }
    const validImages = editForm.image_urls.filter(u => u.trim() !== "");
    if (validImages.length < 2) { alert("Minimal 2 gambar wajib diisi."); return; }
    setIsEditLoading(true);
    const { error } = await supabase.from("products").update({
      name: editForm.name,
      category: editForm.category.trim() || "Produk Digital",
      description: editForm.description, features: editForm.features,
      demo_url: editForm.demo_url, price_min: priceMin, price_max: priceMax,
      image_urls: validImages
    }).eq("id", id);
    setIsEditLoading(false);
    if (error) alert("Gagal menyimpan: " + error.message);
    else { setEditingProductId(null); fetchProducts(); }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault(); setIsFormLoading(true);
    const code = partnerForm.referralCode.toUpperCase().replace(/\s+/g, "");
    try {
      const { data: existingCode } = await supabase.from("partners").select("id").eq("referral_code", code).single();
      if (existingCode) throw new Error("Kode referral sudah dipakai.");
      const { data: existingEmail } = await supabase.from("partners").select("id").eq("email", partnerForm.email).single();
      if (existingEmail) throw new Error("Email ini sudah terdaftar sebagai mitra.");
      const { error } = await supabase.from("partners").insert([{
        name: partnerForm.name, email: partnerForm.email, access_pin: partnerForm.pin,
        referral_code: code, commission_rate: parseFloat(partnerForm.commission_rate)
      }]);
      if (error) throw error;
      alert("Mitra berhasil ditambahkan.");
      setPartnerForm({ name: "", email: "", pin: "", referralCode: "", commission_rate: "10" });
      fetchPartners();
    } catch (error: any) { alert("Gagal: " + error.message); }
    finally { setIsFormLoading(false); }
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm("Hapus mitra ini?")) { await supabase.from("partners").delete().eq("id", id); fetchPartners(); }
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault(); setIsFormLoading(true);
    const { error } = await supabase.from("orders").insert([{
      customer_name: orderForm.customer_name,
      product_name: selectedProduct?.name || "",
      partner_code: orderForm.partner_code || "TIDAK_ADA",
      sale_price: parseFloat(orderForm.sale_price),
      commission_amount: autoCommission,
      status: "pending"
    }]);
    setIsFormLoading(false);
    if (error) alert("Gagal merekam transaksi: " + error.message);
    else {
      alert("Transaksi berhasil dicatat.");
      setOrderForm({ customer_name: "", product_id: "", partner_code: "", sale_price: "" });
      fetchOrders();
    }
  };

  const toggleOrderStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "paid" : "pending";
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    fetchOrders();
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm("Hapus data transaksi ini?")) { await supabase.from("orders").delete().eq("id", id); fetchOrders(); }
  };

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  const formatHargaRange = (min: number, max: number) => {
    if (!min && !max) return "-";
    if (min === max || !max) return formatRupiah(min);
    return `${formatRupiah(min)} – ${formatRupiah(max)}`;
  };

  // Performa per mitra
  const getMitraStats = (referral_code: string) => {
    const mitraOrders = orders.filter(o => o.partner_code === referral_code);
    const totalTrx = mitraOrders.length;
    const pendingKomisi = mitraOrders.filter(o => o.status === "pending").reduce((s, o) => s + Number(o.commission_amount), 0);
    const paidKomisi = mitraOrders.filter(o => o.status === "paid").reduce((s, o) => s + Number(o.commission_amount), 0);
    return { totalTrx, pendingKomisi, paidKomisi };
  };

  // Filter orders
  const filteredOrders = orders.filter(o => orderFilter === "all" ? true : o.status === orderFilter);
  const totalOmzet = filteredOrders.reduce((sum, o) => sum + Number(o.sale_price), 0);
  const totalOmzetAll = orders.reduce((sum, o) => sum + Number(o.sale_price), 0);
  const totalKomisiPending = orders.filter(o => o.status === "pending").reduce((sum, o) => sum + Number(o.commission_amount), 0);

  if (isCheckingAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 sm:pt-28 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-row justify-between items-start mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Kelola produk, mitra, dan transaksi AutoScale dari sini.</p>
          </div>
          <button onClick={handleLogout}
            className="flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors">
            <LogOut size={15} /> Keluar
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Package size={14} /></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produk</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{products.length}</p>
            <p className="text-xs text-gray-400 mt-1">Aktif di katalog</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Users size={14} /></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mitra</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{partners.length}</p>
            <p className="text-xs text-gray-400 mt-1">Affiliate aktif</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-500"><TrendingUp size={14} /></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Omzet</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{formatRupiah(totalOmzetAll)}</p>
            <p className="text-xs text-gray-400 mt-1">{orders.length} transaksi</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 border-l-4 border-l-yellow-400 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500"><Clock size={14} /></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Komisi</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{formatRupiah(totalKomisiPending)}</p>
            <p className="text-xs text-gray-400 mt-1">Belum dicairkan</p>
          </div>
        </div>

        {/* TAB MENU */}
        <div className="flex gap-1.5 mb-6 sm:mb-8 bg-white p-1.5 rounded-xl border w-full shadow-sm">
          {(["products", "partners", "orders"] as const).map((tab) => {
            const labels = { products: "Katalog Produk", partners: "Mitra Afiliasi", orders: "Penjualan" };
            const icons = { products: <Package size={15} />, partners: <Users size={15} />, orders: <TrendingUp size={15} /> };
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap px-2 sm:px-3
                  ${active
                    ? tab === "orders" ? "bg-primary text-white" : "bg-gray-900 text-white"
                    : tab === "orders" ? "text-gray-500 hover:text-primary" : "text-gray-500 hover:text-gray-900"
                  }`}>
                {icons[tab]} {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* ── TAB: PRODUK ───────────────────────────────────── */}
        {activeTab === "products" && (
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border shadow-sm lg:sticky lg:top-28 h-fit">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-gray-900 text-sm sm:text-base">
                <Plus size={17} /> Tambah Produk Baru
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informasi Produk</p>
                  <input required name="name" value={productForm.name} onChange={handleProductChange} placeholder="Nama Produk" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                  <input name="category" value={productForm.category} onChange={handleProductChange} placeholder="Kategori (contoh: Source Code, SaaS...)" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                  <textarea required name="description" value={productForm.description} onChange={handleProductChange} placeholder="Deskripsi singkat produk..." rows={2} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary resize-none bg-white" />
                  <textarea name="features" value={productForm.features} onChange={handleProductChange} placeholder="Fitur produk (pisahkan dengan koma)" rows={2} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary resize-none bg-white" />
                </div>
                <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><ImageIcon size={13} /> Gambar (min. 2)</p>
                  {productForm.image_urls.map((url, index) => (
                    <input key={index} type="text" value={url} onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`URL Gambar ${index + 1}${index < 2 ? " (wajib)" : " (opsional)"}`}
                      className="w-full p-2 border rounded-lg text-sm outline-none focus:border-primary bg-white" required={index < 2} />
                  ))}
                </div>
                <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><DollarSign size={13} /> Harga & Demo</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Harga Mulai</label>
                      <input required type="number" name="price_min" value={productForm.price_min} onChange={handleProductChange} placeholder="Rp min" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Harga Sampai</label>
                      <input required type="number" name="price_max" value={productForm.price_max} onChange={handleProductChange} placeholder="Rp max" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Harga fix? Isi sama di keduanya.</p>
                  <input name="demo_url" value={productForm.demo_url} onChange={handleProductChange} placeholder="URL Demo / Tutorial (opsional)" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                </div>
                <button type="submit" disabled={isFormLoading} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                  {isFormLoading ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </form>
            </div>
            <div className="lg:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden h-fit">
              <div className="p-4 sm:p-6 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2 text-sm sm:text-base"><Package size={17} /> Daftar Produk</h2>
                <span className="text-xs text-gray-400 font-medium">{products.length} produk</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: "480px" }}>
                  <thead>
                    <tr className="border-b text-gray-500 text-xs sm:text-sm">
                      <th className="py-3 px-4">Nama Produk</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">Belum ada produk.</td></tr>
                    ) : products.map(p => (
                      <>
                        {/* ROW UTAMA */}
                        <tr key={p.id} className={`border-b transition-colors ${editingProductId === p.id ? "bg-blue-50/50" : "hover:bg-gray-50"}`}>
                          <td className="py-3 px-4 font-bold text-xs sm:text-sm text-gray-900">{p.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-md whitespace-nowrap">{p.category || "Produk Digital"}</span>
                          </td>
                          <td className="py-3 px-4 text-xs sm:text-sm font-medium text-primary whitespace-nowrap">
                            {formatHargaRange(p.price_min, p.price_max)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {editingProductId === p.id ? (
                                <button onClick={handleCancelEdit} className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                  <X size={15} />
                                </button>
                              ) : (
                                <button onClick={() => handleStartEdit(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                  <Pencil size={15} />
                                </button>
                              )}
                              <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* ROW EDIT INLINE — expand saat diklik */}
                        {editingProductId === p.id && (
                          <tr key={`edit-${p.id}`} className="border-b bg-blue-50/30">
                            <td colSpan={4} className="px-4 py-5">
                              <div className="space-y-4">
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                                  <Pencil size={12} /> Mode Edit — {p.name}
                                </p>

                                {/* Info Produk */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Nama Produk</label>
                                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                      className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Kategori</label>
                                    <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                      placeholder="Source Code, SaaS, Template..." className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs text-gray-500 font-bold mb-1 block">Deskripsi</label>
                                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={2} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-400 resize-none bg-white" />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-500 font-bold mb-1 block">Fitur (pisahkan dengan koma)</label>
                                  <textarea value={editForm.features} onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                                    rows={2} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-400 resize-none bg-white" />
                                </div>

                                {/* Harga */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Harga Mulai</label>
                                    <input type="number" value={editForm.price_min} onChange={(e) => setEditForm({ ...editForm, price_min: e.target.value })}
                                      className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Harga Sampai</label>
                                    <input type="number" value={editForm.price_max} onChange={(e) => setEditForm({ ...editForm, price_max: e.target.value })}
                                      className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
                                  </div>
                                </div>

                                {/* URL Demo */}
                                <div>
                                  <label className="text-xs text-gray-500 font-bold mb-1 block">URL Demo / Tutorial</label>
                                  <input value={editForm.demo_url} onChange={(e) => setEditForm({ ...editForm, demo_url: e.target.value })}
                                    placeholder="https://..." className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
                                </div>

                                {/* URL Gambar */}
                                <div>
                                  <label className="text-xs text-gray-500 font-bold mb-1.5 block flex items-center gap-1">
                                    <ImageIcon size={12} /> URL Gambar (min. 2)
                                  </label>
                                  <div className="space-y-2">
                                    {editForm.image_urls.map((url, idx) => (
                                      <input key={idx} type="text" value={url}
                                        onChange={(e) => {
                                          const imgs = [...editForm.image_urls];
                                          imgs[idx] = e.target.value;
                                          setEditForm({ ...editForm, image_urls: imgs });
                                        }}
                                        placeholder={`URL Gambar ${idx + 1}${idx < 2 ? " (wajib)" : " (opsional)"}`}
                                        className="w-full p-2 border rounded-lg text-sm outline-none focus:border-blue-400 bg-white" />
                                    ))}
                                  </div>
                                </div>

                                {/* Tombol aksi */}
                                <div className="flex gap-2 pt-1">
                                  <button onClick={() => handleSaveEdit(p.id)} disabled={isEditLoading}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2">
                                    <Save size={15} /> {isEditLoading ? "Menyimpan..." : "Simpan Perubahan"}
                                  </button>
                                  <button onClick={handleCancelEdit}
                                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm flex items-center gap-1.5">
                                    <X size={14} /> Batal
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: MITRA ────────────────────────────────────── */}
        {activeTab === "partners" && (
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border shadow-sm lg:sticky lg:top-28 h-fit">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-gray-900 text-sm sm:text-base">
                <Plus size={17} /> Tambah Mitra Baru
              </h2>
              <form onSubmit={handleAddPartner} className="space-y-2.5">
                <input required name="name" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} placeholder="Nama Mitra" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 bg-white" />
                <input required type="email" name="email" value={partnerForm.email} onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })} placeholder="Email Mitra" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 bg-white" />
                <input required name="pin" value={partnerForm.pin} onChange={(e) => setPartnerForm({ ...partnerForm, pin: e.target.value })} placeholder="PIN Akses" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 bg-white" />
                <input required name="referralCode" value={partnerForm.referralCode} onChange={(e) => setPartnerForm({ ...partnerForm, referralCode: e.target.value })} placeholder="KODE REFERRAL" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 uppercase bg-white" />
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">% Komisi Mitra</label>
                  <div className="flex items-center gap-2">
                    <input required type="number" min="1" max="100" value={partnerForm.commission_rate}
                      onChange={(e) => setPartnerForm({ ...partnerForm, commission_rate: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-gray-900 bg-white" />
                    <span className="text-sm font-bold text-gray-500 flex-shrink-0">%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Isi <b>10</b> → mitra dapat 10% dari harga deal.</p>
                </div>
                <button type="submit" disabled={isFormLoading} className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                  {isFormLoading ? "Menyimpan..." : "Tambah Mitra"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden h-fit">
              <div className="p-4 sm:p-6 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2 text-sm sm:text-base"><Users size={17} /> Daftar Mitra Aktif</h2>
                <span className="text-xs text-gray-400 font-medium">{partners.length} mitra</span>
              </div>
              {partners.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">Belum ada mitra terdaftar.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {partners.map(p => {
                    const stats = getMitraStats(p.referral_code);
                    const pinRevealed = revealedPins[p.id] || false;
                    return (
                      <div key={p.id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Nama + badges */}
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                                {p.commission_rate ?? 0}% komisi
                              </span>
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold tracking-widest">
                                <LinkIcon size={9} className="inline mr-1" />{p.referral_code}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3">{p.email}</p>

                            {/* PIN row */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs text-gray-400 font-medium">PIN:</span>
                              <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded tracking-widest">
                                {pinRevealed ? p.access_pin : "●".repeat(p.access_pin?.length || 4)}
                              </span>
                              <button onClick={() => setRevealedPins(prev => ({ ...prev, [p.id]: !pinRevealed }))}
                                className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                                {pinRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                            </div>

                            {/* Mini stats */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                                <p className="text-base font-black text-gray-900">{stats.totalTrx}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Transaksi</p>
                              </div>
                              <div className="bg-yellow-50 rounded-xl p-2.5 text-center border border-yellow-100">
                                <p className="text-xs font-black text-yellow-700 truncate">{formatRupiah(stats.pendingKomisi)}</p>
                                <p className="text-[10px] text-yellow-500 font-medium">Pending</p>
                              </div>
                              <div className="bg-green-50 rounded-xl p-2.5 text-center border border-green-100">
                                <p className="text-xs font-black text-green-700 truncate">{formatRupiah(stats.paidKomisi)}</p>
                                <p className="text-[10px] text-green-500 font-medium">Cair</p>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => handleDeletePartner(p.id)} className="flex-shrink-0 text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors mt-1">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: PENJUALAN ────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border shadow-sm lg:sticky lg:top-28 h-fit">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-primary text-sm sm:text-base">
                <TrendingUp size={17} /> Catat Transaksi Baru
              </h2>
              <form onSubmit={handleAddOrder} className="space-y-3">
                <input required type="text" value={orderForm.customer_name}
                  onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                  placeholder="Nama Pembeli" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />

                <select required value={orderForm.product_id}
                  onChange={(e) => setOrderForm({ ...orderForm, product_id: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white">
                  <option value="" disabled>Pilih Produk Terjual...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>

                <select value={orderForm.partner_code}
                  onChange={(e) => setOrderForm({ ...orderForm, partner_code: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white">
                  <option value="">-- Tanpa Mitra (Penjualan Langsung) --</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.referral_code}>
                      {p.name} ({p.referral_code}) — {p.commission_rate}%
                    </option>
                  ))}
                </select>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Harga Deal Final (Rp)</label>
                  <input required type="number" value={orderForm.sale_price}
                    onChange={(e) => setOrderForm({ ...orderForm, sale_price: e.target.value })}
                    placeholder="Harga yang disepakati via WA"
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-white" />
                </div>

                {/* Preview komisi auto */}
                <div className={`rounded-xl p-3.5 border transition-all ${autoCommission > 0 ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"}`}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Komisi Mitra (Auto)</p>
                  {autoCommission > 0 ? (
                    <div>
                      <p className="text-xl font-black text-blue-700">{formatRupiah(autoCommission)}</p>
                      <p className="text-xs text-blue-500 mt-0.5">
                        {selectedPartner?.commission_rate}% × {formatRupiah(parseFloat(orderForm.sale_price) || 0)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {orderForm.partner_code ? "Isi harga deal untuk lihat kalkulasi" : "Pilih mitra untuk kalkulasi otomatis"}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={isFormLoading}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm">
                  {isFormLoading ? "Menyimpan..." : "Catat Transaksi"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white rounded-2xl border shadow-sm overflow-hidden h-fit">
              {/* Header + Filter */}
              <div className="p-4 sm:p-5 border-b bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle2 size={17} className="text-primary" /> Riwayat Transaksi
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">{filteredOrders.length} transaksi</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "pending", "paid"] as const).map(f => (
                    <button key={f} onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        orderFilter === f
                          ? f === "paid" ? "bg-green-500 text-white"
                            : f === "pending" ? "bg-yellow-400 text-white"
                            : "bg-gray-900 text-white"
                          : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
                      }`}>
                      <Filter size={10} />
                      {f === "all" ? `Semua (${orders.length})`
                        : f === "pending" ? `Diproses (${orders.filter(o => o.status === "pending").length})`
                        : `Selesai (${orders.filter(o => o.status === "paid").length})`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: "560px" }}>
                  <thead>
                    <tr className="border-b text-gray-500 text-xs">
                      <th className="py-3 px-4">Transaksi</th>
                      <th className="py-3 px-4">Harga Deal</th>
                      <th className="py-3 px-4">Mitra & Komisi</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-400">Belum ada transaksi.</td></tr>
                    ) : filteredOrders.map((o) => (
                      <tr key={o.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-gray-900 text-xs sm:text-sm">{o.product_name}</p>
                          <p className="text-xs text-gray-400">Pembeli: {o.customer_name}</p>
                          <p className="text-[10px] text-gray-300 mt-0.5">
                            {new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                          {formatRupiah(o.sale_price)}
                        </td>
                        <td className="py-3.5 px-4">
                          {o.partner_code !== "TIDAK_ADA" && o.partner_code ? (
                            <div>
                              <p className="text-xs font-bold text-gray-700">{o.partner_code}</p>
                              <p className="text-xs text-primary font-bold">{formatRupiah(o.commission_amount)}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button onClick={() => toggleOrderStatus(o.id, o.status)}
                            className={`px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1 mx-auto transition-all whitespace-nowrap ${
                              o.status === "paid"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            }`}>
                            {o.status === "paid" ? <><CheckCircle2 size={12} /> Selesai</> : <><Clock size={12} /> Diproses</>}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button onClick={() => handleDeleteOrder(o.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary footer */}
              {filteredOrders.length > 0 && (
                <div className="p-4 sm:p-5 border-t bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-4 sm:gap-6 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Total Omzet</p>
                      <p className="text-sm sm:text-base font-black text-gray-900">{formatRupiah(totalOmzet)}</p>
                    </div>
                    {orderFilter !== "paid" && (
                      <div>
                        <p className="text-xs text-yellow-500 font-medium">Komisi Pending</p>
                        <p className="text-sm sm:text-base font-black text-yellow-600">
                          {formatRupiah(filteredOrders.filter(o => o.status === "pending").reduce((s, o) => s + Number(o.commission_amount), 0))}
                        </p>
                      </div>
                    )}
                    {orderFilter !== "pending" && (
                      <div>
                        <p className="text-xs text-green-500 font-medium">Komisi Cair</p>
                        <p className="text-sm sm:text-base font-black text-green-600">
                          {formatRupiah(filteredOrders.filter(o => o.status === "paid").reduce((s, o) => s + Number(o.commission_amount), 0))}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-300">{filteredOrders.length} transaksi ditampilkan</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}