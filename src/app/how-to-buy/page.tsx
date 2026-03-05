export default function HowToBuyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">Panduan Pembelian</h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Pemilihan Produk</h2>
              <p>Jelajahi Katalog Produk AutoScale dan pilih lisensi perangkat lunak atau aset digital yang sesuai dengan kebutuhan instansi atau bisnis Anda. Anda dapat melihat detail spesifikasi dan fitur pada halaman masing-masing produk.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Pengisian Formulir Pemesanan</h2>
              <p>Klik tombol "Checkout Sekarang" dan lengkapi data diri atau instansi Anda. Pastikan nomor WhatsApp yang Anda masukkan aktif, karena seluruh instruksi dan pengiriman akses akan dilakukan melalui saluran tersebut.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Verifikasi WhatsApp</h2>
              <p>Setelah formulir dikirim, sistem akan mengarahkan Anda ke WhatsApp resmi Admin Xander Systems. Kami akan melakukan verifikasi pesanan dan memberikan detail instruksi pembayaran sesuai metode yang Anda pilih.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Pembayaran dan Aktivasi</h2>
              <p>Lakukan pembayaran sesuai instruksi. Setelah dana terverifikasi, tim kami akan segera mengirimkan tautan unduhan, kode lisensi, atau akses kredensial (tergantung jenis produk) langsung ke WhatsApp Anda beserta panduan instalasi.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}