export const metadata = {
  metadataBase: new URL("https://freelance-portfolio-three-gamma.vercel.app"),

  title: "GKS Digital | Modern Websites for Local Businesses",

  description:
    "Professional websites for restaurants, salons, gyms, real estate businesses and local brands. Fast, mobile-friendly and SEO optimized.",

  keywords: [
    "Website Developer",
    "Freelance Web Developer",
    "Restaurant Website",
    "Salon Website",
    "Gym Website",
    "Real Estate Website",
    "Next.js Developer",
    "Website Designer India",
    "GKS Digital",
  ],

  authors: [
    {
      name: "GKS Digital",
    },
  ],

  creator: "GKS Digital",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title: "GKS Digital | Modern Websites for Local Businesses",
    description:
      "Modern websites that help local businesses grow.",
    url: "https://freelance-portfolio-three-gamma.vercel.app",
    siteName: "GKS Digital",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GKS Digital",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GKS Digital | Modern Websites for Local Businesses",
    description:
      "Modern websites that help local businesses grow.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}