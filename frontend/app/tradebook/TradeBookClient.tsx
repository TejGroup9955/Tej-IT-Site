'use client';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { FileText, ShoppingCart, Users, Package, BarChart2, Shield, TrendingUp, Link as LinkIcon, ChevronRight, Truck, Lock } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  keyFeatures: string[];
  icon: React.ComponentType<{ className?: string }>;
  modalId: string;
}

interface Benefit {
  title: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AddOnModule {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function TradeBookClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const features: Feature[] = [
    {
      title: 'Sales Order & Invoice Management',
      description: 'Stay on top of every sale.',
      keyFeatures: [
        'Create & manage invoices digitally',
        'Auto-link invoices with customer accounts',
        'Track payments received & pending',
      ],
      icon: FileText,
      modalId: 'sales_invoice',
    },
    {
      title: 'Purchase Order & Vendor Management',
      description: 'Simplify procurement tracking.',
      keyFeatures: [
        'Generate & track purchase orders',
        'Vendor-wise invoice & payment tracking',
        'Manage supplier contact & history',
      ],
      icon: ShoppingCart,
      modalId: 'purchase_vendor',
    },
    {
      title: 'Customer & Supplier Ledger',
      description: '360° visibility into relationships.',
      keyFeatures: [
        'Client-wise sales records',
        'Vendor-wise purchase history',
        'Track dues, advances & settlements',
      ],
      icon: Users,
      modalId: 'ledger',
    },
    {
      title: 'Inventory & Stock Flow',
      description: 'Keep your stock in check.',
      keyFeatures: [
        'Track goods purchased & sold in real time',
        'Auto-update stock with every transaction',
        'Generate movement & shortage reports',
      ],
      icon: Package,
      modalId: 'inventory',
    },
    {
      title: 'Integrated Finance & GST Reports',
      description: 'Stay compliant effortlessly.',
      keyFeatures: [
        'Auto GST/TDS calculation in invoices',
        'Export-ready reports for filing & audits',
        'Forecast revenue & expenses',
      ],
      icon: Shield,
      modalId: 'finance_gst',
    },
    {
      title: 'Profitability & Analytics Dashboard',
      description: 'Turn data into decisions.',
      keyFeatures: [
        'Sales vs purchase trend analysis',
        'Vendor & customer performance insights',
        'Real-time profit & expense reports',
      ],
      icon: BarChart2,
      modalId: 'analytics',
    },
    {
      title: 'One-Click Data Access',
      description: 'Save time with smart workflows.',
      keyFeatures: [
        'One-click sales summary',
        'One-click vendor payment history',
        'Order-to-cash overview in seconds',
      ],
      icon: TrendingUp,
      modalId: 'one_click',
    },
    {
      title: 'Seamless BDM Integration',
      description: 'Part of the complete BDM ecosystem.',
      keyFeatures: [
        'Sync with BDM Smart CRM & Accounts',
        'Connect with Support & Ticketing modules',
        'Unified Lead → Sale → Purchase → Finance → Support flow',
      ],
      icon: LinkIcon,
      modalId: 'bdm_integration',
    },
  ];

  const benefits: Benefit[] = [
    {
      title: 'Unified Sales & Purchase Tracking',
      subtitle: 'No more scattered records—manage everything in one place.',
      description: 'Manage sales, purchases, and payments in one place for complete visibility across departments.',
      keyPoints: [
        'Easy access for managers & accountants',
        'End-to-end visibility across departments',
        'Save time & reduce errors',
      ],
      image: '/BDM/TradeBook2.jpg',
      icon: FileText,
    },
    {
      title: 'GST & Compliance Ready',
      subtitle: 'Stay audit-ready, always.',
      description: 'Automated GST/TDS calculations and export-ready reports for seamless compliance with Indian taxation.',
      keyPoints: [
        'Automated GST/TDS in invoices',
        'Export-ready compliance reports',
        '100% compliant with Indian taxation',
      ],
      image: '/BDM/TradeBook3.jpg',
      icon: Shield,
    },
    {
      title: 'Smarter Vendor & Customer Relations',
      subtitle: 'Build stronger, long-term partnerships.',
      description: 'Track supplier and customer history for better relationship management.',
      keyPoints: [
        'Supplier-wise purchase history',
        'Customer-wise sales & payments',
        'Clear dues & settlement tracking',
      ],
      image: '/BDM/TradeBook2.jpg',
      icon: Users,
    },
    {
      title: 'Real-Time Insights for Growth',
      subtitle: 'Make data-driven decisions.',
      description: 'Dashboards and reports for analyzing trends and profitability.',
      keyPoints: [
        'Dashboards with sales vs purchase trends',
        'Profitability analysis at a glance',
        'ROI tracking across vendors & customers',
      ],
      image: '/BDM/TradeBook3.jpg',
      icon: BarChart2,
    },
    {
      title: 'Seamless BDM Ecosystem',
      subtitle: 'One product, multiple possibilities.',
      description: 'Integrates with BDM Smart System for unified operations across CRM, Accounts, and Support modules.',
      keyPoints: [
        'Fully integrated with BDM Smart System',
        'Works with Accounts, Finance & CRM modules',
        'Single ecosystem for growth-focused businesses',
      ],
      image: '/BDM/TradeBook2.jpg',
      icon: LinkIcon,
    },
  ];

  const addOnModules: AddOnModule[] = [
    {
      title: 'E-Way Bill Integration',
      description: 'Generate E-Way bills directly from TradeBook.',
      icon: Truck,
    },
    {
      title: 'E-Invoice Integration with GST Portal',
      description: 'Auto-generate IRN & QR codes for invoices.',
      icon: FileText,
    },
    {
      title: 'Stock & Inventory Automation',
      description: 'Real-time stock sync with every transaction.',
      icon: Package,
    },
    {
      title: 'Secure Authentication',
      description: 'One user, one PC, key-based secure login.',
      icon: Lock,
    },
  ];

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

  const cardHover = {
    hover: { scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } },
  };

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeature(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-blue-900 to-emerald-800 text-white py-32 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/BDM/TradeBook1.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 text-white text-shadow-lg"
          >
            BDM TradeBook – Sales & Purchase Management
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-white"
          >
            End-to-End Sales & Purchase Record Management for Smarter Business Decisions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            BDM TradeBook is a next-generation sales & purchase management system that integrates seamlessly with the BDM Smart System, empowering businesses to simplify operations, track every transaction, and make smarter financial decisions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transform hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              Request a Free Demo
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 text-center mb-12">
            Why Choose BDM TradeBook?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <motion.div variants={itemVariants} className="space-y-4 flex flex-col justify-between">
              <div>
                <p className="text-lg text-gray-700">
                  Running a business means juggling sales invoices, purchase orders, vendor payments, stock tracking, and compliance requirements. TradeBook brings everything under one roof—so you never lose control of your data.
                </p>
                <p className="text-lg text-gray-700">
                  Whether you’re in manufacturing, trading, retail, distribution, or services, TradeBook is designed to keep your financial & operational records simple, secure, and accessible.
                </p>
                <ul className="list-none space-y-2 mt-4">
                  {[
                    'Manage sales & purchase records from one platform',
                    'Fully integrated with BDM Smart System for unified growth',
                    'Track customer & supplier history in seconds',
                    'Get real-time stock, orders, and payments visibility',
                    'Stay audit-ready with GST & compliance reports',
                    'Cloud-based & secure – access anywhere, anytime',
                  ].map((point, i) => (
                    <li key={i} className="relative pl-6 text-gray-700">
                      <span className="absolute left-0 text-emerald-500 font-bold">✔</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <Link
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transform hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  Get Started with BDM TradeBook
                </Link>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center"
            >
              <Image
                src="/BDM/BDM3.jpg"
                alt="BDM TradeBook Dashboard"
                width={450}
                height={300}
                className="w-full h-full max-h-[400px] object-cover rounded-lg shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Dashboard Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 text-center mb-12">
            BDM TradeBook Dashboard
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg text-gray-700">
                A powerful, intuitive dashboard that gives one-click access to sales, purchases, vendor history, and profitability reports—all in real time.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transform hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                Explore the Dashboard
              </Link>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center"
            >
              <Image
                src="/BDM/BDM3.jpg"
                alt="BDM TradeBook Dashboard"
                width={500}
                height={300}
                className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 text-center mb-12">
            Key Features of BDM TradeBook
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-white rounded-lg p-6 shadow-md flex flex-col h-full"
              >
                <feature.icon className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{feature.title}</h3>
                <p className="text-gray-700 mb-4">{feature.description}</p>
                <ul className="list-none space-y-2 mb-4 flex-grow">
                  {feature.keyFeatures.map((keyFeature, i) => (
                    <li key={i} className="relative pl-6 text-gray-700 text-sm">
                      <span className="absolute left-0 text-emerald-500 font-bold">✔</span>
                      {keyFeature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleFeatureClick(feature)}
                  className="text-blue-600 hover:underline mt-auto flex items-center"
                >
                  Learn More <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-blue-800 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Benefits of BDM TradeBook
          </motion.h2>
          {benefits.map((benefit, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { threshold: 0.5, once: false });

            return (
              <motion.div
                key={index}
                ref={ref}
                className="grid md:grid-cols-2 gap-8 items-center mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} space-y-4`}>
                  <div className="flex items-center">
                    <benefit.icon className="w-8 h-8 text-emerald-500 mr-2" />
                    <h3 className="text-3xl font-semibold text-blue-800">{benefit.title}</h3>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700">{benefit.subtitle}</h4>
                  <p className="text-gray-700">{benefit.description}</p>
                  <ul className="list-none space-y-2">
                    {benefit.keyPoints.map((point, i) => (
                      <li key={i} className="relative pl-6 text-gray-700">
                        <span className="absolute left-0 text-emerald-500 font-bold">✔</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={benefit.image}
                      alt={`${benefit.title} screenshot`}
                      width={500}
                      height={300}
                      className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md"
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Add-On Modules Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 text-center mb-12">
            Advanced Add-On Modules
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {addOnModules.map((module, index) => (
              <motion.div
                key={module.title}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4"
              >
                <module.icon className="w-12 h-12 text-emerald-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">{module.title}</h3>
                  <p className="text-gray-700">{module.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={itemVariants}
            className="mt-12 flex items-center justify-center"
          >
            <Image
              src="/BDM/mobile.png"
              alt="BDM TradeBook Mobile Add-Ons"
              width={400}
              height={300}
              className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Contact CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gradient-to-r from-blue-900 to-emerald-600 text-white text-center"
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 text-white">
          Ready to Simplify Your Sales & Purchases?
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg mb-6">
          Contact us at: Office No. 103, "Phoenix", Bund Garden Rd, Opp. Residency Club, Pune, Maharashtra 411001.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transform hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            Request a Free Demo
          </Link>
        </motion.div>
      </motion.section>

      {/* Feature Modal */}
      {isModalOpen && selectedFeature && (
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
            className="bg-white rounded-lg max-w-2xl w-full mx-4"
          >
            <div className="bg-blue-800 text-white rounded-t-lg p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Feature Details</h3>
              <button onClick={closeModal} className="text-white hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                {(() => {
                  const Icon = selectedFeature.icon;
                  return <Icon className="w-6 h-6 mr-2 text-emerald-500" />;
                })()}
                {selectedFeature.title}
              </h4>
              <p className="text-gray-700 mb-4">
                <strong>Intro:</strong> {selectedFeature.description}
              </p>
              <ul className="list-none space-y-2">
                {selectedFeature.keyFeatures.map((keyFeature: string, i: number) => (
                  <li key={i} className="relative pl-6 text-gray-700">
                    <span className="absolute left-0 text-emerald-500 font-bold">✔</span>
                    {keyFeature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}