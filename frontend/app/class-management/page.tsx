"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ClassManagement() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Tej Smart Class System</h1>
        <p className="text-lg mb-6">A compelling solution to manage daily class activities, including attendance, test schedules, fee collections, and time-tables, enhancing coordination between classes, parents, and students.</p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-semibold mb-4">Why Tej Smart Class?</h2>
        <p className="mb-4">Our user-friendly, menu-driven system saves time, increases accuracy, and improves operational efficiency, making it accessible even for users with minimal computer knowledge.</p>
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