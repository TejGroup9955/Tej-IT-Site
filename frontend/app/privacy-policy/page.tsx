"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg mb-6">Tej IT Solutions is committed to respecting your privacy and choices. This statement highlights our practices regarding Personal Information collected through our website and events.</p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-semibold mb-4">Personal Information We Process</h2>
        <p className="mb-4">You may browse our website without providing Personal Information. However, we collect certain data for service provision, contract performance, or legitimate interests, as outlined below.</p>
        <p className="mb-4">We process your Personal Information for contract performance or legitimate interests, ensuring we can deliver our services effectively. If mandatory information is not provided, we may be unable to provide certain services.</p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-semibold mb-4">Data Sharing and Security</h2>
        <p className="mb-4">We do not share your Personal Information with third parties for marketing without your consent. Data may be shared within Tej IT Solutions group companies or with service providers in the US, Singapore, India, and UK, using standard contractual clauses or Privacy Shield certification for transfers outside the EEA.</p>
        <p className="mb-4">We adopt reasonable security practices to safeguard your Personal Information and retain it only as long as necessary for the outlined purposes or legal requirements.</p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">You have the right to access, correct, delete, or transfer your Personal Information. Contact us at <a href="mailto:info@tejitsolutions.com" className="hover:text-primary">info@tejitsolutions.com</a> to assert these rights.</p>
        <p className="mb-4">Stop worrying about technology problems. Focus on your business. Let us provide the support you deserve.</p>
        <Link href="/contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-opacity-80 transition">
          Contact us Now
        </Link>
      </motion.section>
    </div>
  );
}