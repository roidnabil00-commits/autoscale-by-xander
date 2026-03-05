export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">Tanya Jawab Umum (FAQ)</h1>
          
          <div className="space-y-6">
            <div className="border border-gray-100 rounded-xl p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-2">Apakah sistem lisensi dibayar sekali atau berlangganan?</h3>
              <p className="text-gray-600 text-sm">Sebagian besar produk di AutoScale adalah pembelian lisensi seumur hidup (One-Time Payment). Namun, kami juga menyediakan solusi SaaS (Software as a Service) berbasis langganan untuk skalabilitas server khusus.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-2">Apakah saya mendapatkan akses *source code* penuh?</h3>
              <p className="text-gray-600 text-sm">Akses *source code* bergantung pada jenis lisensi yang Anda beli. Kategori "Source Code" akan diberikan akses penuh, sedangkan kategori "SaaS & Platform" umumnya berfokus pada akses penggunaan produk jadi.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-2">Bagaimana cara kerja Program Affiliate?</h3>
              <p className="text-gray-600 text-sm">Program kemitraan ini bersifat eksklusif. Setelah pendaftaran disetujui, Anda akan mendapatkan kode dan tautan unik. Sistem kami akan secara otomatis merekam setiap transaksi dari tautan tersebut, dan komisi dapat dicairkan melalui Dasbor Mitra.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-2">Apakah Xander Systems menerima modifikasi khusus (Custom Development)?</h3>
              <p className="text-gray-600 text-sm">Ya, kami melayani penyesuaian fitur sistem sesuai dengan proses bisnis instansi Anda. Silakan hubungi dukungan teknis kami untuk konsultasi dan estimasi biaya pengembangan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}