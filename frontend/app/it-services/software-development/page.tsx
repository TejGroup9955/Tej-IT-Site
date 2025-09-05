'use client';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Code, Globe, Monitor, CheckCircle } from 'lucide-react';

export default function SoftwareDevelopmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');

  const services = [
    {
      title: 'Custom Software Development',
      description: 'Tailored software solutions to meet your unique business needs.',
      icon: Code,
    },
    {
      title: 'Web Application Development',
      description: 'Scalable and secure web apps built with modern frameworks.',
      icon: Globe,
    },
    {
      title: 'Desktop Applications',
      description: 'Robust desktop applications for Windows and macOS.',
      icon: Monitor,
    },
    {
      title: 'Maintenance & Support',
      description: 'Ongoing support and updates to keep your software running smoothly.',
      icon: CheckCircle,
    },
  ];

  const whyChooseUs = [
    {
      title: 'Expert Developers',
      description: 'Skilled team with expertise in modern technologies.',
    },
    {
      title: 'Agile Development',
      description: 'Flexible and iterative approach for faster delivery.',
    },
    {
      title: 'Scalable Solutions',
      description: 'Software designed to grow with your business.',
    },
    {
      title: 'Client-Centric Approach',
      description: 'Focused on delivering value and exceeding expectations.',
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const heroVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
  };

  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05, 
      backgroundColor: '#9333ea', 
      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)', 
      color: '#ffffff',
      transition: { type: 'spring' as const, stiffness: 400, damping: 15 } 
    },
    tap: { scale: 0.98 },
  };

  const cardVariants: Variants = {
    rest: { y: 0, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' },
    hover: { y: -5, boxShadow: '0 8px 16px rgba(13, 148, 136, 0.3)', transition: { duration: 0.3 } },
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (name && email && message) {
      alert('Thank you! Our software experts will contact you shortly.');
      setFormData({ name: '', email: '', message: '' });
      setIsModalOpen(false);
      setFormError('');
    } else {
      setFormError('Please fill out all fields.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-purple-50 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative py-28 md:py-36 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 to-purple-900/40"></div>
        <div className="absolute inset-0">
          <Image
            src="/it-services/software-hero.jpg"
            alt="Software Development Hero"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg flex items-center justify-center gap-2"
          >
            <Code className="w-8 h-8" /> Custom Software Development Solutions
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 max-w-4xl mx-auto text-white/90 drop-shadow-lg"
          >
            Transform your business with custom software solutions designed to streamline operations, enhance productivity, and drive growth.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact" passHref>
              <motion.button
                className="inline-block bg-purple-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Schedule a Free Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12"
          >
            Our Software Development Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, _) => (
              <motion.div
                key={service.title}
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <service.icon className="w-12 h-12 text-teal-600 mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
          <motion.div variants={itemVariants} className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">Why Choose Tej IT for Software Development</h2>
            <ul className="space-y-4">
              {whyChooseUs.map((item, _) => (
                <motion.li
                  key={item.title}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="md:w-1/2">
            <Image
              src="/it-services/software-dev-illustration.png"
              alt="Software Development Illustration"
              width={500}
              height={500}
              className="mx-auto object-contain"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-gradient-to-br from-teal-600 to-purple-600 text-center"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md"
          >
            Ready to Build Your Software Solution?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md"
          >
            Let’s create software that drives your business forward. Contact us for expert development services tailored to your needs.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact" passHref>
              <motion.button
                className="inline-block bg-white text-purple-600 font-semibold py-3 px-10 rounded-full shadow-lg transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                👉 Schedule a Free Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Consultation Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg max-w-md w-full mx-4 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-teal-600">Request Free Consultation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  required
                ></textarea>
              </div>
              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              <button
                type="submit"
                className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}