'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Shield, Smartphone, UserPlus, MapPin, Lock, FileText, BarChart2, FileCheck, ChevronRight } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  keyFeatures: string[];
  icon: React.ComponentType<{ className?: string }>;
  modalId: string;
}

export default function BDMPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const features: Feature[] = [
    {
      title: 'Secure Login',
      description: 'Protect your data from unauthorized access with robust device authentication.',
      keyFeatures: [
        'Device authentication for secure access',
        'Activate or deactivate users with a single click',
        'Enhanced data security measures',
      ],
      icon: Shield,
      modalId: 'secure_login',
    },
    {
      title: 'Mobile Application',
      description: 'Empower field executives with a mobile app for seamless daily operations.',
      keyFeatures: [
        'Auto call and map connectivity',
        'Follow-up and meeting notifications',
        'User-friendly interface for on-the-go management',
      ],
      icon: Smartphone,
      modalId: 'mobile_app',
    },
    {
      title: 'Social Lead Source Integration',
      description: 'Capture leads automatically from multiple digital platforms.',
      keyFeatures: [
        'Auto lead capture from Just Dial, India Mart, Sulekha, Trade India, Websites, and Digital Marketing',
        'Streamlined lead integration',
        'Real-time lead tracking',
      ],
      icon: UserPlus,
      modalId: 'social_lead',
    },
    {
      title: 'Direct Call From PC',
      description: 'Simplify calling with PC synchronization.',
      keyFeatures: [
        'Click-to-call functionality synced with mobile devices',
        'Automated call connectivity',
        'Efficient call management',
      ],
      icon: MapPin,
      modalId: 'direct_call',
    },
    {
      title: 'GPS Tracking',
      description: 'Monitor field executive locations in real-time.',
      keyFeatures: [
        'Capture current location via mobile devices',
        'Device login reports with timestamps',
        'Enhanced field operation oversight',
      ],
      icon: Lock,
      modalId: 'gps_tracking',
    },
    {
      title: 'Role-Based User Access',
      description: 'Customize access levels based on user roles.',
      keyFeatures: [
        'Module access tailored to user roles',
        'Limited data interaction per user',
        'Role-specific functionalities',
      ],
      icon: FileText,
      modalId: 'role_access',
    },
    {
      title: 'Lead Management',
      description: 'Organize and track leads efficiently.',
      keyFeatures: [
        'Sorted lead categories with notifications',
        'Daily and scheduled follow-up reminders',
        'Comprehensive lead tracking',
      ],
      icon: BarChart2,
      modalId: 'lead_management',
    },
    {
      title: 'Quotation Tracking',
      description: 'Manage quotations with ease and precision.',
      keyFeatures: [
        'Generate and track quotation requests',
        'Maintain quotation history and previews',
        'Automated follow-up reminders',
      ],
      icon: FileCheck,
      modalId: 'quotation_tracking',
    },
    {
      title: 'Graphical Reports',
      description: 'Analyze performance with visually appealing reports.',
      keyFeatures: [
        'Graphical views of leads and team performance',
        'Easy analysis of current operations',
        'Customizable report generation',
      ],
      icon: BarChart2,
      modalId: 'graphical_reports',
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
        className="relative bg-gradient-to-r from-blue-800 to-emerald-500 text-white py-32 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/BDM/BDM1.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 text-white text-shadow-lg"
          >
            BDM Smart System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            Boost your business growth up to 70% with our advanced Business Development Management solution. Streamline lead generation, customer relations, and decision-making with ease.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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

      {/* Overview Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 text-center mb-12">
            Why Choose BDM Smart System?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <motion.div variants={itemVariants} className="space-y-4 flex flex-col justify-between">
              <div>
                <p className="text-lg text-gray-700">
                  BDM Smart System is a comprehensive solution designed to enhance business development by improving customer relationships, automating lead management, and supporting strategic decision-making. It bridges communication gaps, tracks customer history, and integrates data from websites, telephones, and social media for a unified marketing approach.
                </p>
                <p className="text-lg text-gray-700">
                  Tailored for manufacturers, real estate, advertising, capital markets, and other industries, it converts leads into opportunities and ensures no business potential is missed.
                </p>
              </div>
              <div className="text-center">
                <Link
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transform hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  Get Started Today
                </Link>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center"
            >
              <Image
                src="/BDM/BDM3.jpg"
                alt="BDM Smart System Dashboard"
                width={450}
                height={300}
                className="w-full h-full max-h-[400px] object-cover rounded-lg shadow-md"
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
            Key Features of BDM Smart Plus
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
                  {feature.keyFeatures.slice(0, 3).map((keyFeature, i) => (
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 text-center mb-12">
            Benefits of BDM Smart System
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            Enhance customer relations, convert leads into clients, and boost decision-making with BDM Smart System. Its real-time analytics and automated processes drive up to 70% business growth across industries.
          </motion.p>
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
          Ready to Grow Your Business?
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