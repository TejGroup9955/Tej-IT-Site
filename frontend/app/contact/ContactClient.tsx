'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://10.10.50.93:5000/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus('Enquiry submitted successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('An error occurred. Please try again later.');
    }
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
          Get in Touch with the Tej IT Sales Team
        </motion.h1>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-12"
        id="enquiry"
      >
        <motion.h2 variants={itemVariants} className="text-center text-2xl md:text-3l font-bold mb-6 text-text">
          Interested in our IT services or need advice?
        </motion.h2>
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto space-y-4"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Phone"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full p-2 border border-gray-300 rounded h-24"
            required
          />
          <motion.button
              variants={itemVariants}
              type="submit"
              className="w-auto bg-primary text-primary-foreground px-10 py-2 text-sm rounded-md hover:bg-secondary transition mx-auto block"
            >
              Submit
            </motion.button>

          {submitStatus && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center ${submitStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
            >
              {submitStatus}
            </motion.p>
          )}
        </motion.form>
      </motion.section>
    </div>
  );
}