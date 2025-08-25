'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Palette, Layout, Monitor, Mail, CheckCircle } from 'lucide-react';

export default function WebAppDesignDevelopmentPage() {
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
      title: 'Web Design',
      description: 'We create responsive, SEO-friendly, and user-centric designs that strengthen your online presence and enhance brand identity.',
      icon: Palette,
    },
    {
      title: 'Web Development',
      description: 'From corporate websites to complex applications, we deliver scalable, secure, and high-performance web solutions using modern frameworks.',
      icon: Layout,
    },
    {
      title: 'UI/UX Optimization',
      description: 'Our UI/UX design experts focus on intuitive interfaces and smooth navigation to boost engagement and conversions.',
      icon: Monitor,
    },
  ];

  const testimonials = [
    { quote: 'Their web design elevated our brand to new heights!', author: 'Sneha Kapoor, Creative Director' },
    { quote: 'Top-notch development with a flawless user experience.', author: 'Arjun Mehta, CTO' },
  ];

  const processSteps = [
    { title: 'Creative Consultation', description: 'We understand your goals, target audience, and business needs.' },
    { title: 'Prototype Design', description: 'Interactive mockups for review and collaboration.' },
    { title: 'Development & Integration', description: 'Robust coding with the latest web development frameworks.' },
    { title: 'Testing & Refinement', description: 'Ensuring performance, security, and cross-device compatibility.' },
    { title: 'Launch & Ongoing Support', description: 'Hassle-free deployment with continuous monitoring and upgrades.' },
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
    hover: { scale: 1.1, backgroundColor: '#9333ea', transition: { type: 'spring', stiffness: 400, damping: 15 } },
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
            <Link
              href="/contact"
              className="inline-block bg-purple-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Start Your Project
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
                Looking for a trusted web design company that delivers stunning websites and high-performance applications? At Tej IT Solutions, we combine creative design, cutting-edge technology, and business strategy to build websites that captivate, convert, and scale. Our mission is simple: to help businesses unleash their digital potential with tailored IT solutions that make an impact. Discover how we transform ideas into visually stunning and functional web experiences.
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

      {/* Services Section */}
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
            Our Web Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300 hover:bg-purple-50 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <service.icon className="w-12 h-12 text-purple-600 mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
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
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12"
          >
            Our Creative Process
          </motion.h2>
          <div className="relative">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                initial={{ opacity: 0, x: 0 }}
                whileInView={{
                  opacity: 1,
                  x: index < processSteps.length - 1 ? (index % 2 === 0 ? -100 : 100) : 0,
                  transition: { duration: 0.8, ease: 'easeOut' }
                }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center justify-center gap-8 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white w-6 h-6" />
                </div>
                <div className={`text-center md:${index % 2 === 0 ? 'text-right' : 'text-left'} flex-grow md:pr-8 md:pl-8 max-w-prose`}>
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

      {/* Testimonials Section */}
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
            What Our Clients Say
          </motion.h2>
          <div className="relative max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                variants={itemVariants}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center bg-white p-6 rounded-xl shadow-lg"
              >
                <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600 italic mb-4 text-base">" {testimonials[currentTestimonial].quote} "</p>
                <p className="text-purple-600 font-medium text-sm">- {testimonials[currentTestimonial].author}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-6 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-purple-600' : 'bg-gray-300'}`}
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
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 z-50"
        >
          <Mail className="w-5 h-5" /> Get in Touch
        </motion.button>
      )}
    </div>
  );
}