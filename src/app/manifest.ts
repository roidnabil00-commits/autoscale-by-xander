import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AutoScale by Xander Systems',
    short_name: 'AutoScale',
    description: 'Command Center & Marketplace Aset Teknologi',
    start_url: '/',
    display: 'standalone', // Ini yang membuat web tampil full-screen seperti APK
    background_color: '#FAFAFA',
    theme_color: '#111827', // Warna status bar HP (contoh: abu-abu gelap/hitam)
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}