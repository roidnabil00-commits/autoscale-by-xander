export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">Kebijakan Privasi</h1>
          
          <div className="space-y-6 text-gray-600 leading-relaxed text-justify">
            <p>Xander Systems menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan ekosistem AutoScale.</p>

            <h2 className="text-lg font-bold text-gray-900 mt-6">1. Pengumpulan Data</h2>
            <p>Kami mengumpulkan informasi yang Anda berikan secara sukarela saat melakukan pemesanan atau mendaftar sebagai mitra afiliasi. Ini meliputi nama, alamat email, nomor WhatsApp, dan nama instansi.</p>

            <h2 className="text-lg font-bold text-gray-900 mt-6">2. Penggunaan Data</h2>
            <p>Informasi yang kami kumpulkan digunakan secara eksklusif untuk memproses transaksi, mengirimkan lisensi produk, memberikan dukungan teknis, serta mengelola pencairan komisi bagi mitra afiliasi. Kami juga dapat menggunakannya untuk mengirimkan pembaruan keamanan produk.</p>

            <h2 className="text-lg font-bold text-gray-900 mt-6">3. Keamanan Informasi</h2>
            <p>Kami menerapkan standar keamanan operasional untuk melindungi data Anda dari akses, perubahan, atau pengungkapan yang tidak sah. Data kredensial mitra dienkripsi dengan standar industri.</p>

            <h2 className="text-lg font-bold text-gray-900 mt-6">4. Pembagian Pihak Ketiga</h2>
            <p>Xander Systems tidak pernah menjual, memperdagangkan, atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan data kepada layanan infrastruktur tepercaya yang membantu operasional sistem kami, dengan syarat mereka menjaga kerahasiaan data tersebut.</p>
          </div>
        </div>
      </div>
    </div>
  );
}