import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from '../components/ThemeProvider';
import Script from 'next/script';
import ChatWidget from '../components/ChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tej IT Solutions',
  description: 'Innovative IT solutions tailored for your business needs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ChatWidget />
        </ThemeProvider>
        <Script src="/tracking.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}