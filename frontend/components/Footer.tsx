'use client';
import Link from 'next/link';
import Script from 'next/script';

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Tej IT Solutions. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy-policy" className="text-sm hover:text-secondary">Privacy Policy</Link>
            <Link href="/contact" className="text-sm hover:text-secondary">Contact Us</Link>
          </div>
        </div>
      </footer>
      <Script
        id="tawk-to"
        strategy="lazyOnload"
        src="https://embed.tawk.to/68a30f5da43302192439edc6/1j2uf81tn"
        async
        crossOrigin="anonymous"
        charSet="UTF-8"
      />
    </>
  );
}