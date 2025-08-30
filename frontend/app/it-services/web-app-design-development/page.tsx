'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Palette, Layout, Monitor, Mail, Code, Database, ShoppingCart, FileText, Cloud, LayoutDashboard, PlugZap, Shield, Rocket, Server, Radio } from 'lucide-react';

export default function WebAppDesignDevelopmentPage() {
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
      category: 'Frontend & Design',
      items: [
        { title: 'Responsive Website Design', description: 'Crafted with HTML5, CSS3, Tailwind, and Bootstrap for seamless experiences across devices.', icon: Palette },
        { title: 'Progressive Web Apps (PWA)', description: 'Offline-first, app-like experiences with fast load times and high engagement.', icon: Monitor },
        { title: 'Pixel-perfect UI/UX', description: 'Designed using Figma, Adobe XD, and custom design systems for intuitive interfaces.', icon: Layout },
        { title: 'SEO-Optimized layouts', description: 'Built to boost search rankings and drive organic traffic.', icon: Globe },
      ],
    },
    {
      category: 'Backend & Development',
      items: [
        { title: 'Robust Web Applications', description: 'Built with Laravel, Node.js, and Django for performance and scalability.', icon: Code },
        { title: 'API-Driven Development', description: 'REST and GraphQL APIs for seamless data exchange and integrations.', icon: PlugZap },
        { title: 'Secure Authentication', description: 'Implement OAuth, JWT, and SSO for robust user security.', icon: Shield },
        { title: 'Payment Gateway & Third-Party Integrations', description: 'Seamless connections with payment gateways and external services.', icon: Database },
        { title: 'Scalable Databases', description: 'Optimized MySQL, PostgreSQL, and MongoDB for efficient data management.', icon: Database },
        { title: 'Cloud-Native Deployments', description: 'Deploy on AWS, Azure, GCP with Docker and Kubernetes for scalability.', icon: Cloud },
        { title: 'Serverless Architecture', description: 'Leverage AWS Lambda, Azure Functions, and Google Cloud Functions for cost-efficient, scalable solutions.', icon: Server },
        { title: 'Real-Time Applications', description: 'Build real-time features with WebSockets and Node.js for dynamic user experiences.', icon: Radio },
      ],
    },
    {
      category: 'Specialized Solutions',
      items: [
        { title: 'E-Commerce Development', description: 'Custom builds or platforms like Shopify, WooCommerce, and Magento.', icon: ShoppingCart },
        { title: 'CMS Development', description: 'Flexible WordPress, Strapi, or headless CMS solutions for content management.', icon: FileText },
        { title: 'Enterprise Web Apps', description: 'Custom ERP, CRM, and HRM modules tailored for business efficiency.', icon: LayoutDashboard },
        { title: 'Microservices & API Integrations', description: 'Flexible and scalable solutions for complex systems.', icon: PlugZap },
      ],
    },
  ];

  const whyChooseUs = [
    { title: 'End-to-End Expertise', description: 'From UI/UX to cloud deployment', icon: Globe },
    { title: 'Creative & Engaging UI', description: 'Designed to convert visitors into customers', icon: Palette },
    { title: 'Secure by Design', description: 'Data encryption, SSL, WAF, authentication systems', icon: Shield },
    { title: 'Performance-Driven', description: 'Optimized code, caching, and fast load times', icon: Rocket },
    { title: 'Cloud-Ready', description: 'Deployable on AWS, Azure, or Google Cloud', icon: Cloud },
    { title: 'Future-Proof & Scalable', description: 'Built to handle business growth', icon: Database },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', bounce: 0.4 } },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, backgroundColor: '#9333ea', transition: { type: 'spring', stiffness: 400, damping: 15 } },
    tap: { scale: 0.98 },
  };

  const card3DVariants = {
    rest: { rotateX: 0, rotateY: 0, scale: 1, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  };

  const flipVariants = {
    front: { rotateY: 0, opacity: 1, transition: { duration: 0.4 } },
    back: { rotateY: 180, opacity: 1, transition: { duration: 0.4 } },
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (name && email && message) {
      alert('Thank you! We will contact you shortly.');
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, setTransform: (transform: { rotateX: number; rotateY: number }) => void) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / rect.height) * 20;
    const rotateY = (mouseX / rect.width) * 20;
    setTransform({ rotateX, rotateY });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative py-28 md:py-36 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        <div className="absolute inset-0">
          <Image
            src="/it-services/web-hero.jpg"
            alt="Web Design Hero"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-black mb-6 drop-shadow-lg"
          >
            Web Design & Development
          </motion.h1>
          <motion.div variants={itemVariants}>
            <Link href="/contact" passHref>
              <motion.button
                className="inline-block bg-purple-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
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

      {/* Showcase Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-12"
          >
            Our Web Design Showcase
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-center items-center gap-12"
          >
            <div className="max-w-prose text-center">
              <p className="text-gray-700 mb-6">
                Explore our portfolio of modern websites, enterprise applications, and digital solutions designed to help brands stand out in today’s competitive market. Each project reflects our commitment to quality, innovation, and client success.
                Looking for a trusted web design company that delivers stunning websites and high-performance applications? At Tej IT Solutions, we combine creative design, cutting-edge technology, and business strategy to build websites that captivate, convert, and scale.
              </p>
            </div>
            <div className="relative w-full md:w-1/2">
              <Image
                src="/it-services/web-showcase.jpg"
                alt="Web Design Showcase"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl object-cover"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Web App Services Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12"
          >
            💡 Our Web App Services
          </motion.h2>
          {services.map((category) => (
            <div key={category.category} className="mb-12">
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-semibold text-gray-800 text-center mb-6"
              >
                {category.category}
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((service) => {
                  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
                  return (
                    <motion.div
                      key={service.title}
                      variants={card3DVariants}
                      initial="rest"
                      whileHover="hover"
                      animate={{ ...card3DVariants.rest, rotateX: transform.rotateX, rotateY: transform.rotateY }}
                      onMouseMove={(e) => handleMouseMove(e, setTransform)}
                      onMouseLeave={() => setTransform({ rotateX: 0, rotateY: 0 })}
                      className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300"
                      style={{ perspective: 1000 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                      >
                        <service.icon className="w-12 h-12 text-purple-600 mb-4" />
                      </motion.div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h4>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Why Work With Tej IT Section */}
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
            🎨 Why Work With Tej IT?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="relative bg-white p-6 rounded-xl border border-gray-200 h-32"
                style={{ perspective: 1000 }}
                whileHover="hover"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key="front"
                    variants={flipVariants}
                    initial="front"
                    animate="front"
                    exit="back"
                    className="absolute inset-0 flex flex-col items-center justify-center text-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <item.icon className="w-8 h-8 text-purple-600 mb-2" />
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  </motion.div>
                  <motion.div
                    key="back"
                    variants={flipVariants}
                    initial="back"
                    animate="back"
                    exit="front"
                    className="absolute inset-0 flex flex-col items-center justify-center text-center bg-purple-50 p-4 backface-hidden"
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                  >
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Got a Web App Idea? Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-center"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md"
          >
            Got a web app idea? Let’s make it real, scalable, and stunning.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md"
          >
            Ready to transform your vision into reality? Book a free consultation with our experts today.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact" passHref>
              <motion.button
                className="inline-block bg-white text-purple-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'loop' }}
              >
                👉 Book Free Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Consultation Modal */}
      <AnimatePresence>
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
                <h3 className="text-xl font-semibold text-purple-600">Request Free Consultation</h3>
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
                  className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}