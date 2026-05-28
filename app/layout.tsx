import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import FetchInterceptor from "@/components/FetchInterceptor";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShapesBytes | SaaS Property Management",
  description: "Premium property stay and quotation management system by ShapesBytes",
  icons: {
    icon: "/favicon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="min-h-full flex flex-col">
        <FetchInterceptor />
        {children}
      </body>
    </html>
  );
}
