'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Code, Server, Wrench, Shield, Check, ChevronRight, PhoneCall, BarChart, Users, Settings, Plug, Monitor, Search, Pencil, Rocket, Database } from 'lucide-react';

export default function SoftwareDevelopmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStickyCta(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const services = [
    {
      title: 'ERP & Business Management Solutions',
      description: 'Centralized systems for finance, HR, inventory, and operations, tailored to your business needs.',
      icon: BarChart,
    },
    {
      title: 'CRM Systems & Customer Portals',
      description: 'Manage customer journeys, track sales, and enhance engagement with custom CRM solutions.',
      icon: Users,
    },
    {
      title: 'Automation & Workflow Software',
      description: 'Save time and reduce errors with intelligent business automation software solutions.',
      icon: Settings,
    },
    {
      title: 'API Development & Integrations',
      description: 'Connect apps and third-party services seamlessly with secure API development and system integration.',
      icon: Plug,
    },
    {
      title: 'Desktop & Web-Based Applications',
      description: 'Lightweight, secure, and scalable web and desktop applications for modern enterprises.',
      icon: Monitor,
    },
    {
      title: 'Database Management Solutions',
      description: 'Optimized database systems for efficient data storage, retrieval, and management.',
      icon: Database,
    },
  ];

  const processSteps = [
    {
      title: 'Discovery & Requirement Analysis',
      description: 'We dive deep into your business model, challenges, and goals to define project requirements.',
      icon: Search,
    },
    {
      title: 'UI/UX Prototyping',
      description: 'Interactive wireframes and mockups to visualize user journeys and ensure intuitive design.',
      icon: Pencil,
    },
    {
      title: 'Agile Development & Testing',
      description: 'Incremental builds with regular demos and rigorous QA for enterprise application development.',
      icon: Code,
    },
    {
      title: 'Deployment & Support',
      description: 'Smooth rollout, staff training, and ongoing support for secure and scalable applications.',
      icon: Rocket,
    },
  ];

  const whyChooseUs = [
    {
      title: 'Industry Expertise',
      description: 'Proven track record in ERP, Pharma, Manufacturing, Retail, and Finance industries.',
    },
    {
      title: 'Scalable & Secure Code',
      description: 'Built with best practices, performance tuning, and enterprise-grade security for robust solutions.',
    },
    {
      title: 'Agile + DevOps Approach',
      description: 'Faster releases, CI/CD pipelines, and automation-ready delivery for efficient development.',
    },
    {
      title: 'Post-Launch Support',
      description: '24/7 monitoring, SLA-driven response, and feature upgrades to ensure long-term success.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 15 } },
    tap: { scale: 0.98 },
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (name && email && message) {
      alert('Thank you! Our custom software development experts will contact you shortly.');
      setFormData({ name: '', email: '', message: '' });
      setIsModalOpen(false);
      setFormError('');
    } else {
      setFormError('All fields are required.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative py-24 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/it-services/software-development.avif"
            alt="Software Development Background"
            layout="fill"
            objectFit="cover"
            className="opacity-50 blur-md"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 flex items-center justify-center gap-2"
          >
            <Code className="w-8 h-8" /> Custom Software Development – Tailored to Your Business Needs
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-800"
          >
            At Tej IT, we craft secure, scalable, and intelligent software that solves real business challenges. From ERP systems to customer portals and automation tools, we turn ideas into reality as a leading software development company in India.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact" passHref>
              <motion.button
                className="inline-block bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
               Start Your Project
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* What We Build Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12"
          >
            Our Software Development Expertise
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto text-center"
          >
            We build software that adapts to your industry, scales with your growth, and integrates seamlessly with your existing ecosystem, delivering enterprise application development expertise.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300"
                whileHover={{ boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <service.icon className="w-12 h-12 text-teal-600 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Process Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12"
          >
            How We Build Software That Works
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto text-center"
          >
            Our development approach ensures transparency, agility, and continuous collaboration at every stage for effective ERP and CRM development services.
          </motion.p>
          <div className="relative">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="flex items-center justify-center gap-6 mb-12 flex-col md:flex-row"
              >
                <motion.div
                  className="flex-shrink-0 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <step.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-center md:text-left flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="w-0.5 h-12 bg-gray-300 md:h-0 md:w-full border-t border-dashed border-gray-300"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Tej IT Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
          <motion.div variants={itemVariants} className="md:w-1/2">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
            >
              Why Businesses Choose Tej IT
            </motion.h2>
            <ul className="space-y-4">
              {whyChooseUs.map((item, index) => (
                <motion.li
                  key={item.title}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                >
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
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
              src="/it-services/team-dashboard.png"
              alt="Team and Dashboard Illustration with Tej IT Logo"
              width={500}
              height={400}
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
        className="py-20 bg-gradient-to-br from-teal-600 to-indigo-600 text-center"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-md"
          >
            Ready to Transform Your Business with Custom Software?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md"
          >
            Partner with Tej IT, a leading custom software development company in India, to build secure and scalable web and desktop applications that drive growth.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact" passHref>
              <motion.button
                className="inline-block bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Book Free Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Sticky CTA */}
      {showStickyCta && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-5 right-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4" /> Contact Us
        </motion.button>
      )}

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
