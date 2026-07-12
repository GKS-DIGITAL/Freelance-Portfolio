export const metadata = {
  title: "GKS Digital | Modern Websites for Local Businesses",
  description:
    "GKS Digital builds modern, mobile-friendly websites for restaurants, salons, gyms, real estate businesses, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
