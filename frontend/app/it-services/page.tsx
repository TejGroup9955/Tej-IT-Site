"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ITServices() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">IT Services</h1>
        <p className="text-lg mb-6">Custom IT services and solutions built specifically for your business. We create software for portability, reliability, and efficiency.</p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8 mb-12"
      >
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Mobile Applications</h2>
          <p>We design and develop robust and scalable mobile applications that attract clients and strengthen brands.</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Web Designing</h2>
          <p>Our skilled designers and engineers provide a corporate look and feel to your ideas, enhancing user-interface quality.</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Hosting & Cloud Services</h2>
          <p>Instant setup, data mirroring, and scalable hosting solutions for your business needs.</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Bulk Messaging</h2>
          <p>Spread vast quantities of SMS for effective communication with your customers.</p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-semibold mb-4">Let’s Get Started</h2>
        <p className="mb-4">Stop worrying about technology problems. Focus on your business. Let us provide the support you deserve.</p>
        <Link href="/contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-opacity-80 transition">
          Contact us Now
        </Link>
      </motion.section>
    </div>
  );
}