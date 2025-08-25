'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Code, Server, Cloud, Wrench, Shield, Check, ChevronRight, Star, PhoneCall } from 'lucide-react';

export default function SoftwareDevelopmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setShowStickyCta(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const services = [
    {
      title: 'Custom Application Development',
      description: 'Tailor-made applications designed to meet your specific business needs with scalability and performance.',
      icon: Code,
      href: '/it-services/custom-app-dev',
    },
    {
      title: 'Enterprise Software Solutions',
      description: 'Robust solutions for large organizations to enhance efficiency and decision-making.',
      icon: Server,
      href: '/it-services/enterprise-solutions',
    },
    {
      title: 'API Development & Integration',
      description: 'Secure and high-performance APIs to connect your systems seamlessly.',
      icon: Cloud,
      href: '/it-services/api-integration',
    },
    {
      title: 'Legacy System Modernization',
      description: 'Upgrade outdated systems into agile, cloud-ready solutions with modern UI.',
      icon: Wrench,
      href: '/it-services/legacy-modernization',
    },
    {
      title: 'Cloud-Based Applications',
      description: 'Scalable, secure cloud apps built on AWS, Azure, or Google Cloud.',
      icon: Cloud,
      href: '/it-services/cloud-apps',
    },
    {
      title: 'Software Maintenance & Support',
      description: 'Ongoing support with updates, bug fixes, and performance optimization.',
      icon: Shield,
      href: '/it-services/support',
    },
  ];

  const testimonials = [
    { quote: 'Their software solutions revolutionized our operations!', author: 'Vikram Singh, CIO, Innovate Corp' },
    { quote: 'Expertise and support that exceeded our expectations.', author: 'Anjali Desai, Operations Manager' },
  ];

  const processSteps = [
    { title: 'Requirement Analysis & Consulting', description: 'Define your vision and business goals.' },
    { title: 'Planning & Architecture', description: 'Design scalable and secure software architecture.' },
    { title: 'Agile Development', description: 'Iterative development with continuous feedback.' },
    { title: 'Quality Assurance & Testing', description: 'Ensure reliability and high performance.' },
    { title: 'Deployment & Integration', description: 'Seamless rollout with minimal disruption.' },
    { title: 'Ongoing Support', description: 'Continuous monitoring and enhancements.' },
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

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen font-sans text-gray-900">
      {/* Navbar Gap */}
      {/* <div className="h-16 bg-gradient-to-b from-gray-50 via-white to-gray-100"></div> */}

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
        <div className="container mx-auto px-4 text-black text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900" // Changed to dark gray
          >
            Software Development Services
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-black" // Changed to black
          >
            Building reliable, scalable, and future-ready software to empower your business growth.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/contact"
              className="inline-block bg-white text-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              Request a Quote
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Overview Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
          >
            {/* Software Development Services */}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto"
          >
            {/* Building Reliable, Scalable & Future-Ready Software */}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-center items-center gap-8"
          >
            <div className="max-w-prose text-center">
              <p className="text-gray-700 mb-4">
                At Tej IT Solutions, we understand that every business is unique — and so are its challenges. That’s why our software development services are focused on delivering custom-built, secure, and scalable applications that align perfectly with your business goals. From concept to deployment, and ongoing support, we provide end-to-end software development solutions that empower businesses to innovate and grow.
              </p>
            </div>
            <div className="hidden md:block">
              <Image
                src="/it-services/software-overview.jpg"
                alt="Software Development Overview"
                width={400}
                height={300}
                className="rounded-lg shadow-md object-cover"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300"
                whileHover={{
                  filter: 'blur(2px)',
                  transition: { duration: 0.2 }
                }}
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
                <p className="text-gray-600 mb-4 flex-grow text-sm">{service.description}</p>
                {/* Removed Learn More link */}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Process Section */}
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
            Our Development Approach
          </motion.h2>
          <div className="relative">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                initial={{ opacity: 0, x: 0 }} // Start centered
                whileInView={{
                  opacity: 1,
                  x: index % 2 === 0 ? -100 : 100, // Move to zigzag position
                  transition: { duration: 0.8, ease: 'easeOut' }
                }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center justify-center gap-6 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className={`text-center md:${index % 2 === 0 ? 'text-right' : 'text-left'} flex-grow md:pr-6 md:pl-6`}>
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hidden md:block flex-grow border-t border-dashed border-gray-300"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
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
            Why Choose Us?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Client-Centric Approach – We focus on your business objectives, not just coding.',
              'Technology Expertise – Skilled in Java, .NET, PHP, Python, Node.js, Laravel, React, Angular, Flutter, and more.',
              'Agile & Transparent Process – Regular updates, flexible adjustments, and faster time-to-market.',
              'End-to-End Services – From ideation to long-term support, we cover the full lifecycle.',
              'Scalable & Secure Solutions – Built to grow with your business while keeping your data safe.',
              'Proven Track Record – Trusted by startups, SMEs, and enterprises for delivering reliable and impactful solutions.',
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
              >
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-gray-600 text-sm">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
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
            Client Testimonials
          </motion.h2>
          <div className="relative max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                variants={itemVariants}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Star className="w-10 h-10 text-teal-600 mx-auto mb-4" />
                <p className="text-gray-600 italic mb-4 text-base">" {testimonials[currentTestimonial].quote} "</p>
                <p className="text-teal-600 font-medium text-sm">- {testimonials[currentTestimonial].author}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-4 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full ${currentTestimonial === index ? 'bg-teal-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
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
    </div>
  );
} 