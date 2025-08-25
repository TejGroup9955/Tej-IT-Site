'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Palette, Code, Monitor, Mail, CheckCircle } from 'lucide-react';

export default function MobileAppDevelopmentPage() {
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
      title: 'Android App Development',
      description: 'Robust, scalable apps built for the world’s largest mobile platform. Java/Kotlin-based development with strong backend integration. Optimized for performance, security, and device compatibility.',
      icon: Code,
    },
    {
      title: 'iOS App Development',
      description: 'Elegant and high-performing iPhone/iPad applications. Built using Swift and Objective-C. Ensuring smooth navigation, speed, and App Store compliance.',
      icon: Palette,
    },
    {
      title: 'Cross-Platform App Development',
      description: 'Single codebase for iOS & Android using frameworks like Flutter and React Native. Faster development cycle and cost-effective solution. Native-like performance with beautiful, consistent UI.',
      icon: Monitor,
    },
    {
      title: 'Enterprise App Solutions',
      description: 'Tailored apps for businesses to streamline workflows, enhance productivity, and empower teams. Integration with ERP, CRM, and cloud solutions. Advanced features like offline mode, push notifications, and analytics.',
      icon: Smartphone,
    },
  ];

  const testimonials = [
    { quote: 'Their mobile app transformed our business operations!', author: 'Priya Sharma, Operations Manager' },
    { quote: 'Exceptional development and support for our app launch.', author: 'Rahul Desai, CEO' },
  ];

  const processSteps = [
    { title: 'Requirement Analysis', description: 'Deep dive into your business goals, target users, and feature requirements.' },
    { title: 'UI/UX Design', description: 'Crafting visually appealing and user-friendly interfaces.' },
    { title: 'App Development', description: 'Agile-driven development using latest frameworks and technologies.' },
    { title: 'Testing & Quality Assurance', description: 'Rigorous testing for performance, security, and usability.' },
    { title: 'Deployment & Support', description: 'Publishing on App Store / Google Play and providing ongoing updates & enhancements.' },
  ];

  const technologies = {
    frontend: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
    backend: ['Node.js', 'Laravel', 'PHP', 'Java', '.NET'],
    databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'],
    cloud: ['AWS', 'Azure', 'Google Cloud'],
    devops: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions'],
  };

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
    <div className="bg-gradient-to-br from-teal-50 via-white to-purple-50 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative py-28 md:py-36 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0">
          <Image
            src="/it-services/mobile-hero.jpg"
            alt="Mobile App Hero"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
          >
            Mobile App Development Services
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 max-w-4xl mx-auto text-white/90"
          >
            At Tej IT Solutions, we specialize in creating custom mobile applications that deliver seamless user experiences, high performance, and measurable business results. Whether you need an Android app, iOS app, or cross-platform solution, our expert team ensures your mobile presence is future-ready.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/contact"
              className="inline-block bg-purple-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Start Your App
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why It Matters Section */}
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
            Why Mobile App Development Matters
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto"
          >
            With billions of smartphone users worldwide, mobile apps have become the primary touchpoint between businesses and customers. A well-designed mobile app not only boosts engagement but also drives brand loyalty, sales, and digital growth.
          </motion.p>
          <motion.ul
            variants={itemVariants}
            className="text-left max-w-2xl mx-auto text-gray-700 space-y-4 mt-6"
          >
            <li className="flex items-center gap-2"><CheckCircle className="text-teal-600 w-6 h-6" /> Enhance user engagement with intuitive UI/UX</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-teal-600 w-6 h-6" /> Improve efficiency with scalable architectures</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-teal-600 w-6 h-6" /> Integrate seamlessly with your existing systems</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-teal-600 w-6 h-6" /> Deliver secure, high-performance solutions</li>
          </motion.ul>
        </div>
      </motion.section>

      {/* Expertise Section */}
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
            Our Mobile App Development Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300 hover:bg-teal-50 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
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
            Our Mobile App Development Process
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
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{step.title.charAt(0)}</span>
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

      {/* Technologies Section
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-12"
          >
            Technologies We Use
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="text-left">
              <h3 className="text-xl font-semibold text-teal-600 mb-4">Frontend</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {technologies.frontend.map((tech, idx) => (
                  <li key={idx}>{tech}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} className="text-left">
              <h3 className="text-xl font-semibold text-teal-600 mb-4">Backend</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {technologies.backend.map((tech, idx) => (
                  <li key={idx}>{tech}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} className="text-left">
              <h3 className="text-xl font-semibold text-teal-600 mb-4">Databases</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {technologies.databases.map((tech, idx) => (
                  <li key={idx}>{tech}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} className="text-left">
              <h3 className="text-xl font-semibold text-teal-600 mb-4">Cloud & DevOps</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {[...technologies.cloud, ...technologies.devops].map((tech, idx) => (
                  <li key={idx}>{tech}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section> */}

      {/* Testimonials Section */}
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
                <Smartphone className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <p className="text-gray-600 italic mb-4 text-base">" {testimonials[currentTestimonial].quote} "</p>
                <p className="text-teal-600 font-medium text-sm">- {testimonials[currentTestimonial].author}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-6 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-teal-600' : 'bg-gray-300'}`}
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
          className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 z-50"
        >
          <Mail className="w-5 h-5" /> Get in Touch
        </motion.button>
      )}
    </div>
  );
}