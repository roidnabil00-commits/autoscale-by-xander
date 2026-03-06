import Link from "next/link";
import { Hexagon, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 lg:pt-16 pb-6 lg:pb-8 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* STRUKTUR GRID RESPONSIF (1 Kolom HP -> 2 Kolom Tablet -> 12 Span Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-10 lg:mb-12">
          
          {/* KOLOM 1: BRANDING */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-900 rounded-lg lg:rounded-xl flex items-center justify-center text-white">
                <Hexagon size={20} className="lg:w-6 lg:h-6" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">AutoScale</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6 lg:mb-6">
              Platform ekosistem digital dan marketplace aset perangkat lunak premium. Mendukung transformasi bisnis melalui teknologi mutakhir dan otomatisasi skala enterprise.
            </p>
            
            {/* Badge Kreator - Dibuat berbentuk kotak rapi untuk Mobile */}
            <div className="bg-gray-50 p-3.5 lg:p-4 rounded-xl border border-gray-100 inline-block w-full sm:w-auto">
              <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dikembangkan Oleh</p>
              <p className="text-sm lg:text-base font-bold text-gray-900">Team <span className="text-gray-400 font-normal">| Xander Systems</span></p>
            </div>
          </div>

          {/* KOLOM 2: EKSPLORASI */}
          <div className="sm:col-span-1 lg:col-span-2 mt-2 sm:mt-0">
            <h3 className="font-bold text-gray-900 mb-4 lg:mb-6 uppercase tracking-wider text-xs lg:text-sm">Eksplorasi</h3>
            <ul className="space-y-3 lg:space-y-4">
              <li><Link href="/" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">Beranda</Link></li>
              <li><Link href="/product" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">Katalog Produk</Link></li>
              <li><Link href="/partner" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">Program Affiliate</Link></li>
              <li><Link href="/company-profile" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">Company Profile</Link></li>
            </ul>
          </div>

          {/* KOLOM 3: DUKUNGAN */}
          <div className="sm:col-span-1 lg:col-span-3 mt-2 sm:mt-0">
            <h3 className="font-bold text-gray-900 mb-4 lg:mb-6 uppercase tracking-wider text-xs lg:text-sm">Dukungan</h3>
            <ul className="space-y-3 lg:space-y-4">
              <li><Link href="/how-to-buy" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">Cara Pembelian</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/faq" className="text-gray-500 hover:text-primary text-sm font-medium transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* KOLOM 4: HUBUNGI KAMI */}
          <div className="sm:col-span-2 lg:col-span-3 mt-2 lg:mt-0 pt-6 sm:pt-0 border-t border-gray-100 sm:border-0">
            <h3 className="font-bold text-gray-900 mb-4 lg:mb-6 uppercase tracking-wider text-xs lg:text-sm">Hubungi Kami</h3>
            <ul className="space-y-3.5 lg:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm font-medium leading-relaxed">Jawa Barat, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                {/* break-all mencegah email mematahkan lebar layar HP */}
                <span className="text-gray-500 text-sm font-medium break-all">admin@xandersystems.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span className="text-gray-500 text-sm font-medium">+62 819-3165-6410</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BAGIAN BAWAH FOOTER (Copyright & Bahasa) */}
        <div className="border-t border-gray-100 pt-6 lg:pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-5 text-center md:text-left">
          <p className="text-gray-400 text-xs lg:text-sm font-medium">
            © {currentYear} Xander Systems. Hak Cipta Dilindungi Undang-Undang.
          </p>
          
          {/* Badge Bahasa yang lebih interaktif */}
          <div className="flex items-center gap-4 lg:gap-6 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <span className="text-xs lg:text-sm font-bold text-gray-900 cursor-pointer">ID</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            <span className="text-xs lg:text-sm font-bold text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}