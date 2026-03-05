import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // PERINTAH TEGAS KE GOOGLE: Jangan pernah indeks halaman sistem kita
      disallow: ["/admin/", "/login/", "/api/"], 
    },
    sitemap: "https://domain-autoscale-anda.com/sitemap.xml",
  };
}