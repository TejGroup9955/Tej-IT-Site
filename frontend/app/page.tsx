'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronRight, PhoneCall, Code, Smartphone, Globe, Cloud, ArrowRight, Star, Quote, Briefcase, DollarSign, Users, BookOpen, ShoppingCart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowStickyCta(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    // Fetch testimonials
    setIsLoading(true);
    fetch('http://10.10.50.93:5000/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(err => console.error('Error fetching testimonials:', err))
      .finally(() => setIsLoading(false));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(imageInterval);
    };
  }, []);

  const images = [
    '/images/tej_1.jpg',
    '/images/tej_2.jpg',
  ];

  const services = [
    {
      icon: Code,
      title: 'Software Development',
      description: 'Custom software solutions tailored to your business needs with cutting-edge technologies.',
      features: [
        { text: 'Custom Applications', bullet: true },
        { text: 'Enterprise Software', bullet: true },
        { text: 'API Development', bullet: true },
        { text: 'System Integration', bullet: true },
      ],
      href: '/it-services/software-development',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications that engage users and drive business growth.',
      features: [
        { text: 'iOS Development', bullet: true },
        { text: 'Android Development', bullet: true },
        { text: 'React Native', bullet: true },
        { text: 'Flutter Apps', bullet: true },
      ],
      href: '/it-services/mobile-app-development',
      gradient: 'from-teal-500 to-green-600',
    },
    {
      icon: Globe,
      title: 'Web Design & Development',
      description: 'Modern, responsive websites that deliver exceptional user experiences across all devices.',
      features: [
        { text: 'Responsive Design', bullet: true },
        { text: 'E-commerce Solutions', bullet: true },
        { text: 'CMS Development', bullet: true },
        { text: 'Progressive Web Apps', bullet: true },
      ],
      href: '/it-services/web-designing',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Cloud,
      title: 'Cloud Services',
      description: 'Scalable cloud infrastructure and hosting solutions for optimal performance and security.',
      features: [
        { text: 'Cloud Migration', bullet: true },
        { text: 'AWS/Azure Services', bullet: true },
        { text: 'DevOps Solutions', bullet: true },
        { text: '24/7 Monitoring', bullet: true },
      ],
      href: '/it-services/cloud-services',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  const products = [
    {
      icon: Briefcase,
      title: 'Tej Smart ERP',
      description: 'A cloud-based ERP for contractors, streamlining project management, procurement, and financials.',
      features: [
        { text: 'Project Planning & Tracking', bullet: true },
        { text: 'Procurement Automation', bullet: true },
        { text: 'Inventory Management', bullet: true },
        { text: 'Financial Reporting', bullet: true },
        { text: 'Subcontractor Coordination', bullet: true },
        { text: 'Real-Time Analytics', bullet: true },
      ],
      href: '/erp',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: DollarSign,
      title: 'Tej Payroll Software',
      description: 'All-in-one payroll & HR management with automated salary, compliance, and employee lifecycle tools.',
      features: [
        { text: 'Automated Payroll Processing', bullet: true },
        { text: 'Biometric Attendance', bullet: true },
        { text: 'Tax Compliance', bullet: true },
        { text: 'Employee Self-Service', bullet: true },
        { text: 'Leave Management', bullet: true },
        { text: 'Loan Tracking', bullet: true },
      ],
      href: '/payroll',
      gradient: 'from-teal-500 to-green-600',
    },
    {
      icon: Users,
      title: 'Smart BDM',
      description: 'Business development & CRM platform for lead capture, sales tracking, and after-sales support.',
      features: [
        { text: 'Lead Capture Automation', bullet: true },
        { text: 'Sales Pipeline Tracking', bullet: true },
        { text: 'GPS Field Team Monitoring', bullet: true },
        { text: 'Quotation Management', bullet: true },
        { text: 'After-Sales Support', bullet: true },
        { text: 'Customer Analytics', bullet: true },
      ],
      href: '/bdm',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: BookOpen,
      title: 'Class Management System',
      description: 'Manage students, batches, exams, and fees for schools and coaching institutes with a mobile app.',
      features: [
        { text: 'Student Registration', bullet: true },
        { text: 'Batch Scheduling', bullet: true },
        { text: 'Exam Management', bullet: true },
        { text: 'Fee Tracking', bullet: true },
        { text: 'Parent Portal', bullet: true },
        { text: 'Mobile App Access', bullet: true },
      ],
      href: '/class-management',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: ShoppingCart,
      title: 'BDM TradeBook Sales & Purchase',
      description: 'Streamline sales and purchase processes with integrated invoicing, inventory, and financial tracking.',
      features: [
        { text: 'Sales Invoicing', bullet: true },
        { text: 'Purchase Orders', bullet: true },
        { text: 'Inventory Tracking', bullet: true },
        { text: 'GST Compliance', bullet: true },
        { text: 'Financial Reports', bullet: true },
        { text: 'Stock Alerts', bullet: true },
      ],
      href: '/tradebook',
      gradient: 'from-blue-500 to-purple-600',
    },
  ];

  const stats = [
    { number: '10+', label: 'Years Experience' },
    { number: '500+', label: 'Projects Delivered' },
    { number: '', label: '', icon: true },
    { number: '100+', label: 'Happy Clients' },
    { number: '24/7', label: 'Support' },
  ];

  const clientLogos = [
    '/client-logo/resized/abk.jpg',
    '/client-logo/resized/accuon.jpg',
    '/client-logo/resized/ajpower.jpg',
    '/client-logo/resized/gsky-logo.jpg',
    '/client-logo/resized/lamika.jpg',
    '/client-logo/resized/malghe.jpg',
    '/client-logo/resized/logo.png',
    '/client-logo/resized/megha.jpg',
    '/client-logo/resized/oraipl.jpg',
    '/client-logo/resized/rachnafire.jpg',
    '/client-logo/resized/rajelectrical.png',
    '/client-logo/resized/saikrishna.jpg',
    '/client-logo/resized/sai-shyam.jpg',
    '/client-logo/resized/shravan.jpg',
    '/client-logo/resized/sapscon.png',
    '/client-logo/resized/shreebalaji.png',
  ];

  const scrollWheelVariants = {
    animate: {
      y: [0, 5, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 1.5,
          ease: 'easeInOut',
        },
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.1 },
    }),
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-white via-gray-100 to-gray-200 min-h-screen font-sans text-gray-800">
        <style jsx global>{`
          .testimonial-slider .swiper-slide {
            transition: all 0.3s ease;
            filter: blur(4px);
            opacity: 0.15;
            transform: scale(0.9);
          }
          .testimonial-slider .swiper-slide-prev,
          .testimonial-slider .swiper-slide-next {
            filter: blur(1px);
            opacity: 0.95;
            transform: scale(0.95);
          }
          .testimonial-slider .swiper-slide-active {
            filter: none;
            opacity: 1;
            transform: scale(1);
          }
          .client-logo-slider .swiper-slide {
            width: 120px !important;
          }
          .client-logo {
            width: 120px;
            height: 80px;
            object-fit: contain;
            object-position: center;
            transition: filter 0.3s ease;
            filter: grayscale(100%);
          }
          .client-logo:hover {
            filter: grayscale(0%);
          }
          .swiper-button-prev,
          .swiper-button-next {
            color: #3b82f6;
            transition: color 0.3s;
          }
          .swiper-button-prev:hover,
          .swiper-button-next:hover {
            color: #2563eb;
          }
          .swiper-pagination-bullet {
            background: #9ca3af;
          }
          .swiper-pagination-bullet-active {
            background: #3b82f6;
          }
        `}</style>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 relative w-full h-64 md:h-96 overflow-hidden"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full"
            >
              <Image
                src={images[currentImage]}
                alt={`Tej IT Solutions Slide ${currentImage + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 flex items-center justify-center text-center bg-black bg-opacity-50">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Managed IT Services Customized for Your Industry</h1>
              <p className="text-lg mb-6 text-white">Our vertical solutions expertise allows your business to streamline workflow and increase productivity.</p>
              <Link href="/contact" className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full transition">
                Get Started
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Statistics Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="py-6 bg-gray-50 flex items-center justify-center ml-[-84px]"
        >
          <div className="flex justify-center gap-8 flex-wrap max-w-6xl px-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statVariants}
                className="flex flex-col items-center min-w-[120px]"
              >
                {stat.icon ? (
                  <motion.svg
                    width="40"
                    height="60"
                    viewBox="0 0 40 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-2"
                  >
                    <path
                      d="M10 10C10 5.58172 13.5817 2 18 2H22C26.4183 2 30 5.58172 30 10V50C30 54.4183 26.4183 58 22 58H18C13.5817 58 10 54.4183 10 50V10Z"
                      fill="url(#mouseGradient)"
                    />
                    <motion.rect
                      x="15"
                      y="20"
                      width="10"
                      height="5"
                      rx="2"
                      fill="#E5E7EB"
                      variants={scrollWheelVariants}
                      animate="animate"
                    />
                    <defs>
                      <linearGradient id="mouseGradient" x1="10" y1="2" x2="30" y2="58" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6" />
                        <stop offset="1" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                ) : (
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                )}
                <div className="text-sm uppercase tracking-wider text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services Section */}
        <section id="services" className="py-24 relative overflow-hidden bg-white">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
                  Comprehensive IT
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                  Solutions
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From concept to deployment, we deliver world-class technology solutions that drive innovation and accelerate your business growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="relative min-h-[400px] bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-8 flex flex-col h-full transition-all duration-500 hover:bg-slate-800/60 hover:border-slate-600/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`relative w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-teal-400 transition-all duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-200 mb-6 leading-relaxed flex-grow">
                        {service.description}
                      </p>

                      {service.features[0].bullet ? (
                        <ul className="list-none space-y-2 mb-6 flex-grow">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="relative pl-6 text-gray-200 text-sm">
                              <Check className="absolute left-0 top-0.5 text-emerald-500" size={16} />
                              {feature.text}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                          {service.features.map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className={`px-3 py-1 text-xs rounded-full bg-slate-700/50 text-gray-100 border border-slate-600 transition-all duration-300 ${
                                hoveredService === index ? 'scale-105 opacity-100' : 'opacity-80'
                              }`}
                              style={{ transitionDelay: `${featureIndex * 50}ms` }}
                            >
                              {feature.text}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={service.href}
                        className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 mt-auto"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Products Section */}
        <section id="products" className="py-24 relative overflow-hidden bg-gray-50">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
                  Our Core
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Explore our suite of innovative IT solutions designed to streamline operations and drive business growth.
              </p>
            </div>

            {/* Row 1: 2 Product Cards (Centered) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {products.slice(0, 2).map((product, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="relative min-h-[300px] bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center h-full transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                    <div className={`relative w-16 h-16 bg-gradient-to-r ${product.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{product.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{product.description}</p>
                    <ul className="list-none space-y-2 mb-6 flex-grow">
                      {product.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="relative pl-6 text-gray-600 text-sm">
                          <Check className="absolute left-0 top-0.5 text-emerald-500" size={16} />
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={product.href}
                      className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors duration-300 mt-auto"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: 3 Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(2).map((product, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="relative min-h-[300px] bg-white border border-gray-200 rounded-2xl p-6 flex flex-col h-full transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                    <div className={`relative w-16 h-16 bg-gradient-to-r ${product.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{product.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{product.description}</p>
                    <ul className="list-none space-y-2 mb-6 flex-grow">
                      {product.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="relative pl-6 text-gray-600 text-sm">
                          <Check className="absolute left-0 top-0.5 text-emerald-500" size={16} />
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={product.href}
                      className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors duration-300 mt-auto"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 bg-gray-100 text-center flex items-center justify-center min-h-[50vh]">
          <div className="max-w-6xl mx-auto px-4 testimonial-slider">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
              What Our Clients Say
            </h2>
            {isLoading ? (
              <p className="text-gray-600" aria-live="polite">Loading testimonials...</p>
            ) : testimonials.length === 0 ? (
              <p className="text-gray-600" aria-live="polite">No testimonials available at the moment.</p>
            ) : (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
                centeredSlides={true}
                slidesPerView={3}
                spaceBetween={30}
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                pagination={{
                  el: '.swiper-pagination',
                  clickable: true,
                }}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                className="relative"
                role="region"
                aria-label="Testimonials slider"
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center h-full flex flex-col justify-between relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-20 rounded-xl"></div>
                      <Quote className="mx-auto mb-4 text-blue-200" size={40} aria-hidden="true" />
                      <p className="text-gray-600 mb-6 flex-grow text-lg leading-relaxed">"{testimonial.content || 'No content available'}"</p>
                      <div className="flex justify-center mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={i < (testimonial.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            aria-label={i < (testimonial.rating || 0) ? 'Filled star' : 'Empty star'}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mr-4 overflow-hidden">
                          {testimonial.profilePicture ? (
                            <Image
                              src={testimonial.profilePicture}
                              alt={`Profile picture of ${testimonial.name || 'Anonymous'}`}
                              width={48}
                              height={48}
                              className="object-cover"
                              loading="lazy"
                            />
                          ) : (
                            testimonial.name ? testimonial.name.charAt(0).toUpperCase() : 'A'
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">{testimonial.name || 'Anonymous'}</p>
                          <p className="text-sm text-gray-500">
                            {testimonial.designation || 'Client'}
                            {testimonial.company ? `, ${testimonial.company}` : ''}
                          </p>
                        </div>
                      </div>
                      {testimonial.companyLogo && (
                        <Image
                          src={testimonial.companyLogo}
                          alt={`${testimonial.company} logo`}
                          width={80}
                          height={32}
                          className="mt-4 mx-auto object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
                <div className="swiper-button-prev text-blue-500 hover:text-blue-600" aria-label="Previous testimonial"></div>
                <div className="swiper-button-next text-blue-500 hover:text-blue-600" aria-label="Next testimonial"></div>
                <div className="swiper-pagination mt-4"></div>
              </Swiper>
            )}
          </div>
        </section>

        {/* Client Logos Section */}
        <section className="py-8 bg-gray-50 flex items-center justify-center min-h-[50vh]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
              Our Trusted Clients
            </h2>
            <Swiper
              modules={[Autoplay]}
              slidesPerView="auto"
              spaceBetween={20}
              loop={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={5000}
              freeMode={true}
              className="client-logo-slider"
            >
              {clientLogos.map((logo, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={logo}
                    alt={`Client Logo ${index + 1}`}
                    width={120}
                    height={80}
                    className="client-logo"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* CTA Section with Google Maps */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="relative py-8 bg-white text-center rounded-lg overflow-hidden flex items-center justify-center min-h-[50vh]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6972463507894!2d77.58367297505847!3d12.926309487398848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15b277d8d8d7%3A0x6f3733db73d3469f!2sTej%20IT%20Solutions!5e0!3m2!1sen!2sin!4v1726661234567!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0, position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Tej IT Solutions Location"
          ></iframe>
          <div className="relative z-10 bg-black bg-opacity-50 py-8">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold mb-4 text-white"
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-lg mb-6 text-white"
            >
              Contact us today to explore our industry-compliant IT solutions.
            </motion.p>
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/contact'}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-md"
            >
              Get in Touch
            </motion.button>
          </div>
        </motion.section>

        {/* Sticky CTA */}
        {showStickyCta && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => window.location.href = '/contact'}
            className="fixed bottom-5 right-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg z-[1000] flex items-center gap-2"
            aria-label="Contact Us"
          >
            <PhoneCall className="w-4 h-4" /> Contact Us
          </motion.button>
        )}
      </div>
    </div>
  );
}