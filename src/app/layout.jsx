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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" 
        content="WF2XUxGii2MkY2Ltao10yC2dsAichcRx64AU3siGsQc" />

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
