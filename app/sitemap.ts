import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://projecthighlvl.org", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://projecthighlvl.org/about", lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: "https://projecthighlvl.org/thank-you", lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];
}
