import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/assets/logo.png`;

export const metadata: Metadata = {
  title: "OrderFlow — рабочее место сборщика заказов",
  description:
    "OrderFlow ведёт сборщика от нового заказа до упаковки, штрихкода и QR: сканирование, замены, offline-first и быстрый старт с APK.",
  icons: {
    icon: logoPath,
    apple: logoPath
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://svdimonshop-gif.github.io/OrderFlow-Site"),
  openGraph: {
    title: "OrderFlow — рабочее место сборщика заказов",
    description:
      "Сканирование, замены, упаковка, корзина, штрихкод и QR в одном мобильном маршруте.",
    url: "/",
    siteName: "OrderFlow",
    images: [logoPath],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "OrderFlow — рабочее место сборщика заказов",
    description: "Мобильный маршрут сборщика заказов от первого скана до QR."
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8faf2" },
    { media: "(prefers-color-scheme: dark)", color: "#07100d" }
  ],
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
