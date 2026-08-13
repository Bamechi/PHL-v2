import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://projecthighlvl.org"),
  title: "Project High-Lvl — AI Literacy Is the New Financial Literacy",
  description: "Project High-Lvl expands access to wellness, financial literacy, and practical AI education.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  openGraph: {
    title: "Project High-Lvl",
    description: "Rise above the gap. Put the tools, teaching, and room within reach.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Project High-Lvl — AI literacy is the new financial literacy" }],
  },
  twitter: { card: "summary_large_image", title: "Project High-Lvl", description: "AI literacy is the new financial literacy.", images: ["/og.png"] },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NonprofitOrganization",
  name: "Project High-Lvl",
  url: "https://projecthighlvl.org",
  logo: "https://projecthighlvl.org/logo.png",
  taxID: "33-2614564",
  founder: [
    { "@type": "Person", name: "19Keys" },
    { "@type": "Person", name: "B. Amechi" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "1360 S Figueroa St, Ste D119",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    postalCode: "90015",
    addressCountry: "US",
  },
  email: "phlnonprofit@gmail.com",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>;
}
