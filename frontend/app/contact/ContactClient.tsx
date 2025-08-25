'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 text-text">
          Get in Touch with the Tej ERP Team
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg text-text mb-6 max-w-3xl mx-auto">
          Have questions about our product? Need help choosing the right ERP modules for your business? Our expert team is here to guide you. Contact us to discuss your business challenges and learn how Tej ERP can provide solutions that fit your unique requirements.
        </motion.p>
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-lg text-text">Office No. 103, "Phoenix", Bund Garden Rd, Opp. Residency Club, Pune, Maharashtra 411001</p>
          <p className="text-lg text-text">
            Email: <a href="mailto:info@tejitsolutions.com" className="text-primary hover:underline">info@tejitsolutions.com</a> |{' '}
            <a href="mailto:support@tejitsolutions.com" className="text-primary hover:underline">support@tejitsolutions.com</a>
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link href="/contact#enquiry" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-secondary transition">
            Schedule a Demo
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}