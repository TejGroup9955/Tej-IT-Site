'use client';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Shield, Smartphone, UserPlus, Phone, MapPin, Lock, FileText, BarChart2, FileCheck, DollarSign, Workflow, MessageSquare, ChevronRight } from 'lucide-react';

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

export default function BDMClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const features: Feature[] = [
    {
      title: 'Secure Login & User Authentication',
      description: 'Protect your organization’s data with enterprise-grade security.',
      keyFeatures: [
        'Multi-device authentication to prevent unauthorized logins',
        'Enable/disable users instantly from the admin dashboard',
        'Role-based access control for maximum data protection',
        'Strong encryption for stored and transferred data',
        'Auto-logout feature for idle sessions',
        'Detailed login history and activity tracking',
      ],
      icon: Shield,
      modalId: 'secure_login',
    },
    {
      title: 'Mobile Application for Field Teams',
      description: 'Give your on-ground executives the power to work anywhere, anytime.',
      keyFeatures: [
        'Auto call & GPS map integration for real-time location tracking',
        'Push notifications for meetings, follow-ups, and reminders',
        'Offline data capture with auto-sync once online',
        'Quick lead entry & status update from the mobile app',
        'Access to customer history & previous interactions',
        'Easy task management for day-to-day activities',
      ],
      icon: Smartphone,
      modalId: 'mobile_app',
    },
    {
      title: 'Social & Digital Lead Integration',
      description: 'Capture leads automatically from multiple online sources.',
      keyFeatures: [
        'Auto-lead capture from JustDial, IndiaMART, Sulekha, TradeIndia, and websites',
        'Real-time integration with digital marketing campaigns',
        'Lead assignment rules for fair distribution across sales teams',
        'Duplicate lead detection and merging',
        'Source-wise lead tracking for ROI measurement',
        'Automated notifications for newly captured leads',
      ],
      icon: UserPlus,
      modalId: 'social_lead',
    },
    {
      title: 'Direct Calling from PC',
      description: 'Simplify communication with click-to-call functionality.',
      keyFeatures: [
        'Make calls directly from your computer synced with mobile',
        'Automatic call logging with time, duration, and lead details',
        'Call recording for quality and training purposes',
        'Integrated caller ID with client history display',
        'Auto-reminder for missed or scheduled calls',
        'Centralized call reports for managers',
      ],
      icon: Phone,
      modalId: 'direct_call',
    },
    {
      title: 'GPS Tracking & Field Monitoring',
      description: 'Real-time visibility of your team’s on-ground activities.',
      keyFeatures: [
        'Capture current location automatically during login/logout',
        'Live tracking of field executives with map view',
        'Distance traveled and route monitoring',
        'Attendance marking through geo-location',
        'Daily activity reports with timestamps',
        'Improved accountability and productivity',
      ],
      icon: MapPin,
      modalId: 'gps_tracking',
    },
    {
      title: 'Role-Based Access Management',
      description: 'Control who sees what in the system.',
      keyFeatures: [
        'Define role-wise permissions for every user',
        'Restrict access to sensitive modules',
        'Assign approval rights for managers only',
        'Prevent data leaks with controlled export permissions',
        'User activity monitoring with audit trail',
        'Flexibility to modify roles as the team grows',
      ],
      icon: Lock,
      modalId: 'role_access',
    },
    {
      title: 'Lead Management & Follow-up Automation',
      description: 'Organize, track, and convert leads with ease.',
      keyFeatures: [
        'Auto-sorted lead categories with smart tags',
        'Daily, weekly, and scheduled follow-up reminders',
        'Lead scoring based on priority & engagement',
        'End-to-end tracking from enquiry to closure',
        'Real-time notifications for pending actions',
        'Complete lead lifecycle history',
      ],
      icon: FileText,
      modalId: 'lead_management',
    },
    {
      title: 'Quotation & Proposal Tracking',
      description: 'Stay on top of your sales quotations and client proposals.',
      keyFeatures: [
        'Generate and manage quotations within the system',
        'Maintain quotation history with version tracking',
        'Automated follow-up reminders for quotations',
        'Integration with lead and account modules',
        'Approval workflows for high-value proposals',
        'Printable and shareable formats for clients',
      ],
      icon: FileCheck,
      modalId: 'quotation_tracking',
    },
    {
      title: 'Graphical Dashboards & Reports',
      description: 'Data-driven decisions at your fingertips.',
      keyFeatures: [
        'Visual dashboards for sales, leads, and client activities',
        'Graphical representation of lead pipelines',
        'Performance analysis of teams and executives',
        'Real-time reports on conversions and closures',
        'Exportable reports in PDF/Excel formats',
        'Customizable widgets for quick access',
      ],
      icon: BarChart2,
      modalId: 'graphical_reports',
    },
    {
      title: 'Accounts & Finance Module Manager',
      description: 'Track financial transactions client-wise with precision.',
      keyFeatures: [
        'Client-wise Purchase Order (PO) details with status tracking',
        'Outstanding payment reports with due-date reminders',
        'Client payment history with date & mode of payment',
        'Automated GST/TDS calculation on invoices',
        'Revenue forecasting with deal-wise mapping',
        'Finance dashboards for quick overview',
      ],
      icon: DollarSign,
      modalId: 'accounts_finance',
    },
    {
      title: 'Post-Lead Closure Workflow',
      description: 'Ensure smooth delivery after winning a client.',
      keyFeatures: [
        'Lead entry → Kick-off meeting scheduling',
        'Deployment and implementation tracking',
        'Flow explanation & system demo for client onboarding',
        'Internal handover to delivery team',
        'Final handover & client sign-off',
        'Centralized documentation storage for reference',
      ],
      icon: Workflow,
      modalId: 'post_lead_closure',
    },
    {
      title: 'Support Ticket Module',
      description: 'After project deployment, ensure seamless after-sales service.',
      keyFeatures: [
        'Clients can raise tickets for issues directly in the system',
        'Automatic ticket assignment to concerned support staff',
        'SLA-based ticket resolution tracking',
        'Priority-based categorization (Critical/High/Normal)',
        'Client-side ticket tracking with updates',
        'Complete ticket history for transparency',
      ],
      icon: MessageSquare,
      modalId: 'support_ticket',
    },
  ];

  const benefits: Benefit[] = [
    {
      title: 'Lead-to-Closure Automation',
      subtitle: 'Close deals faster with intelligent automation',
      description: 'Streamline your sales pipeline with automated lead capture, scoring, and follow-ups to ensure no opportunity is missed.',
      keyPoints: [
        'Auto-capture leads from multiple sources',
        'Smart lead scoring & priority-based follow-ups',
        'Automated reminders to never miss an opportunity',
        'End-to-end sales pipeline visibility',
        'Increase closure rates with faster response times',
      ],
      image: '/BDM/web_bdm_screenshot.png',
      icon: FileText,
    },
    {
      title: 'Field Team Productivity',
      subtitle: 'Empower your on-ground executives',
      description: 'Boost field team efficiency with real-time tracking, mobile access, and streamlined task management.',
      keyPoints: [
        'GPS-based attendance & real-time tracking',
        'Mobile app for instant lead entry & updates',
        'Daily route planning & distance monitoring',
        'On-the-go access to client history & documents',
        'Boost accountability with live performance reports',
      ],
      image: '/BDM/androidapp_bdm_screenshot.png',
      icon: Smartphone,
    },
    {
      title: 'Customer Experience & Support',
      subtitle: 'Deliver world-class service at every step',
      description: 'Enhance client satisfaction with transparent communication, SLA-driven support, and personalized onboarding.',
      keyPoints: [
        'Transparent communication through client portal',
        'SLA-driven ticketing for faster resolutions',
        'Real-time updates on tickets & project status',
        'Personalized client onboarding with demo sessions',
        'Build stronger trust with 24/7 visibility',
      ],
      image: '/BDM/web_bdm_screenshot.png',
      icon: MessageSquare,
    },
    {
      title: 'Finance & Compliance Management',
      subtitle: 'Stay audit-ready and compliant always',
      description: 'Simplify financial tracking and compliance with automated GST/TDS calculations and client-wise payment reports.',
      keyPoints: [
        'Generate GST-compliant invoices automatically',
        'Client-wise payment & PO tracking',
        'Direct GST/TDS calculations in accounts',
        'Sync-ready data for ERP & Tally integration',
        'Revenue forecasting & financial dashboards',
      ],
      image: '/BDM/androidapp_bdm_screenshot.png',
      icon: DollarSign,
    },
    {
      title: 'Business Intelligence & Insights',
      subtitle: 'Make decisions backed by real-time data',
      description: 'Leverage graphical dashboards and reports to track performance, ROI, and growth opportunities.',
      keyPoints: [
        'Graphical dashboards for sales & conversions',
        'Track ROI by source and campaign',
        'Exportable PDF/Excel reports',
        'Monitor team & executive performance instantly',
        'Identify growth opportunities with data trends',
      ],
      image: '/BDM/web_bdm_screenshot.png',
      icon: BarChart2,
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
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-white text-shadow-lg"
          >
            All-in-One Business Development & CRM Software for Smarter Growth
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            BDM Smart System is a next-generation Business Development Management and CRM platform designed to help organizations capture, nurture, and convert leads into profitable customers.
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
                  BDM Smart System is a comprehensive Business Development Management (BDM) and CRM platform designed to help organizations capture, nurture, and convert leads into profitable customers. From automated lead sourcing to sales tracking, quotation management, accounts, and after-sales support, it ensures no opportunity is missed and every client is served with excellence.
                </p>
                <p className="text-lg text-gray-700">
                  Tailored for industries like Manufacturing, Real Estate, Advertising, Finance, Capital Markets, and Service Providers, BDM Smart System brings everything under one roof—helping you close deals faster, manage clients smarter, and scale your business effortlessly.
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
            Key Features of BDM Smart System
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
                  {feature.keyFeatures.slice(0, 4).map((keyFeature, i) => (
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
            Benefits of BDM Smart System
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
                {/* Text Column */}
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
                {/* Image Column */}
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