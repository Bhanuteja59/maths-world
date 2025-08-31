import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; // Use valid Google Fonts
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// Define font variables
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maths World",
  description: "Created by R.BhanuTeja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Auto Ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4924339114528326"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
