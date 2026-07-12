export const metadata = {
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
    "GKS Digital"
  ],

  authors: [{ name: "GKS Digital" }],

  creator: "GKS Digital",

  metadataBase: new URL("https://freelance-portfolio-three-gamma.vercel.app"),

  openGraph: {
    title: "GKS Digital",
    description:
      "Modern websites that help local businesses grow.",
    url: "https://freelance-portfolio-three-gamma.vercel.app",
    siteName: "GKS Digital",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GKS Digital",
    description:
      "Modern websites that help local businesses grow.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
