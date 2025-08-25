'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, User, Calendar, DollarSign, Users, Clock, FileText, Package, Smartphone } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  keyFeatures: string[];
  icon: React.ComponentType<{ className?: string }>;
  modalId: string;
}

export default function PayrollClient() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(imageInterval);
  }, []);

  const images = [
    '/payroll/Payroll1.jpg',
    '/payroll/Payroll2.jpg',
  ];

  const features: Feature[] = [
    {
      title: 'Biometric Attendance',
      description: 'Track biometric attendance, calculate leaves that need to be paid and deducted.',
      keyFeatures: [
        'Track biometric attendance',
        'Calculate paid and deducted leaves',
        'Real-time attendance reports',
      ],
      icon: User,
      modalId: 'biometric_attendance',
    },
    {
      title: 'Leave Management',
      description: 'Handle employee leave requests and calculate time on and away from work.',
      keyFeatures: [
        'Manage leave requests',
        'Calculate leave balances',
        'Automated leave approvals',
      ],
      icon: Calendar,
      modalId: 'leave_management',
    },
    {
      title: 'Loans & Advance Management',
      description: 'Manage loans or advances requested by employees during vulnerable times.',
      keyFeatures: [
        'Process loan requests',
        'Track advance repayments',
        'Automated deduction schedules',
      ],
      icon: DollarSign,
      modalId: 'loan_advance',
    },
    {
      title: 'Staff Tracking',
      description: 'Track staff records, joining/leaving dates, attendance, and salary.',
      keyFeatures: [
        'Monitor staff records',
        'Track joining/leaving dates',
        'Detailed attendance logs',
      ],
      icon: Users,
      modalId: 'staff_tracking',
    },
    {
      title: 'Streamline HR Processes',
      description: 'Achieve professionalism and consistency in HR functions.',
      keyFeatures: [
        'Automate HR workflows',
        'Ensure compliance',
        'Centralized HR data',
      ],
      icon: Clock,
      modalId: 'hr_processes',
    },
    {
      title: 'Attendance Report',
      description: 'Generate daily, weekly, monthly, yearly reports for all office locations.',
      keyFeatures: [
        'Daily attendance reports',
        'Customizable report formats',
        'Multi-location tracking',
      ],
      icon: FileText,
      modalId: 'attendance_report',
    },
    {
      title: 'Pay Slip Management',
      description: 'Generate and manage monthly pay slips with easy printing.',
      keyFeatures: [
        'Generate monthly pay slips',
        'Easy print functionality',
        'Digital access for employees',
      ],
      icon: Package,
      modalId: 'payslip_management',
    },
    {
      title: 'Asset Recovery',
      description: 'Manage asset recovery and appraise damages during exit processes.',
      keyFeatures: [
        'Track employee assets',
        'Appraise damages/monetary value',
        'Automate recovery process',
      ],
      icon: Package,
      modalId: 'asset_recovery',
    },
    {
      title: 'Android App for Employees',
      description: 'Provide an app for attendance, salary slips, and reports.',
      keyFeatures: [
        'Mobile attendance tracking',
        'Access salary slips',
        'View personalized reports',
      ],
      icon: Smartphone,
      modalId: 'android_app',
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
        <div className="absolute inset-0 bg-[url('/payroll/Payroll1.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 text-white text-shadow-lg"
          >
            Tej Payroll Software
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            Simplify HR, payroll, and compliance with our intuitive software designed for small and large businesses.
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
            Why Choose Tej Payroll Software?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <motion.div variants={itemVariants} className="space-y-4 flex flex-col justify-between">
              <div>
                <p className="text-lg text-gray-700">
                  Tej Payroll Software automates time tracking, attendance, and salary disbursement with a single-click workflow. Ideal for small and large businesses, it ensures accurate payroll calculations, compliance, and streamlined HR processes.
                </p>
                <p className="text-lg text-gray-700">
                  Our rich user interface integrates employee data effortlessly, reducing manual effort and enhancing efficiency. Stay compliant with automated leave, loan, and asset management features.
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
                src="/payroll/Payroll1.jpg"
                alt="Tej Payroll Dashboard"
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
            Powerful Features for Payroll
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
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
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
            Benefits of Tej Payroll Software
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            Tej Payroll Software automates payroll processing, ensuring accurate salary disbursement and compliance. It saves time, enhances employee satisfaction with mobile access, and streamlines HR operations.
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            Designed for various industries, it offers robust leave, loan, and asset management, making it a comprehensive solution for businesses.
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
          Ready to Simplify Your Payroll?
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