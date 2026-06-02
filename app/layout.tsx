import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import FetchInterceptor from "@/components/FetchInterceptor";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShapesBytes | SaaS Hotel Management",
  description: "Premium property stay and quotation management system by ShapesBytes",
  icons: {
    icon: "/favicon/favicon.ico",
  },
  // Next.js natively handles site verification here:
  verification: {
    google: "GygRjFn3AQEfXr3Qx-ST2tbdXNBWAjV6_TyTN9Wq598",
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
        
        {/* Load the Google Analytics script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XRR8J6JC3V"
          strategy="afterInteractive"
        />
        {/* Initialize the dataLayer */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XRR8J6JC3V');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
