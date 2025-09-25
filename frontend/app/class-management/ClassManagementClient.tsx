'use client';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { UserPlus, Building, Users, FileText, Clipboard, Lock, ArrowRightCircle, CreditCard, Smartphone, BarChart2, ChevronRight } from 'lucide-react';

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

export default function ClassManagementClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const features: Feature[] = [
    {
      title: 'Simplified Student Registration',
      description: 'Quick and hassle-free student onboarding.',
      keyFeatures: [
        'Digital admission & registration forms',
        'Auto ID card & roll number generation',
        'Centralized student database',
      ],
      icon: UserPlus,
      modalId: 'student_registration',
    },
    {
      title: 'Branch-Wise Login',
      description: 'Organize classes by branches for smooth management.',
      keyFeatures: [
        'Branch-level dashboards for institutes with multiple locations',
        'Separate login for each branch admin',
        'Consolidated reporting for head office',
      ],
      icon: Building,
      modalId: 'branch_login',
    },
    {
      title: 'Batch Formation & Management',
      description: 'Create and manage batches easily.',
      keyFeatures: [
        'Group students into batches by subject or schedule',
        'Auto allocation of students to teachers',
        'Track batch strength & progress',
      ],
      icon: Users,
      modalId: 'batch_management',
    },
    {
      title: 'Assignment & Test Reports',
      description: 'Track academic progress effortlessly.',
      keyFeatures: [
        'Upload assignments & tests digitally',
        'Students submit answers via mobile app',
        'Automated result & performance tracking',
      ],
      icon: FileText,
      modalId: 'assignment_reports',
    },
    {
      title: 'Class Attendance Report',
      description: 'Ensure attendance accuracy at all levels.',
      keyFeatures: [
        'Daily, weekly & monthly reports',
        'Mobile-based attendance marking',
        'One-click full attendance summary for management',
      ],
      icon: Clipboard,
      modalId: 'attendance_report',
    },
    {
      title: 'Secure Question Papers & Answer Sheets',
      description: 'Protect exam confidentiality.',
      keyFeatures: [
        'Upload question papers securely',
        'Accessible only within the Android app (no download option)',
        'Auto-expiry after exam completion',
      ],
      icon: Lock,
      modalId: 'secure_papers',
    },
    {
      title: 'Student Transfer to New Class',
      description: 'Seamless progression year after year.',
      keyFeatures: [
        'Move old students to higher classes with one click',
        'Preserve academic history & reports',
        'Auto-update in attendance & fee records',
      ],
      icon: ArrowRightCircle,
      modalId: 'student_transfer',
    },
    {
      title: 'Staff & Subject Allocation',
      description: 'Smart workload distribution for teachers.',
      keyFeatures: [
        'Assign subjects staff-wise',
        'Monitor subject progress across batches',
        'Real-time reporting for staff activities',
      ],
      icon: Users,
      modalId: 'staff_allocation',
    },
    {
      title: 'Fee & Payment Management',
      description: 'Automated fee collection & tracking.',
      keyFeatures: [
        'Generate fee invoices per student or batch',
        'Track paid & pending fees with reminders',
        'Integrated payment gateway support',
      ],
      icon: CreditCard,
      modalId: 'fee_management',
    },
    {
      title: 'Parent & Student App',
      description: 'Transparency and easy access for students & parents.',
      keyFeatures: [
        'Students check attendance, assignments & results',
        'Parents monitor performance & fee dues',
        'Push notifications for updates & announcements',
      ],
      icon: Smartphone,
      modalId: 'parent_student_app',
    },
    {
      title: 'Performance Dashboards & Analytics',
      description: 'Data-driven insights for institutes.',
      keyFeatures: [
        'Batch-wise performance charts',
        'Student ranking & progress trends',
        'Exportable reports for admin review',
      ],
      icon: BarChart2,
      modalId: 'performance_analytics',
    },
  ];

  const benefits: Benefit[] = [
    {
      title: 'Smart Student Lifecycle Management',
      subtitle: 'Manage admissions, batches & progress smoothly',
      description: 'Streamline student onboarding, batch management, and class transitions with automated workflows.',
      keyPoints: [
        'One-click student registration',
        'Auto migration to higher classes',
        'Centralized student records',
      ],
      image: '/class-management/web_classmanagement_screenshot.png',
      icon: UserPlus,
    },
    {
      title: 'Academic Performance & Transparency',
      subtitle: 'Boost learning outcomes with digital reports',
      description: 'Track assignments, tests, and results in real-time, with instant access for students and parents.',
      keyPoints: [
        'Assignments & tests tracked in real-time',
        'Parents & students view results instantly',
        'Staff performance linked with student outcomes',
      ],
      image: '/class-management/androidapp_classmanagement_screenshot.png',
      icon: FileText,
    },
    {
      title: 'Secure Learning Material',
      subtitle: 'Protect critical content with in-app access',
      description: 'Ensure exam confidentiality with secure, app-only access to question papers and answer sheets.',
      keyPoints: [
        'Question papers secure in app (no downloads)',
        'Auto-expiry after exam',
        'Controlled content sharing',
      ],
      image: '/class-management/web_classmanagement_screenshot.png',
      icon: Lock,
    },
    {
      title: 'Efficiency for Teachers & Staff',
      subtitle: 'Reduce manual workload with automation',
      description: 'Automate subject allocation, attendance, and reporting to save time for teachers and staff.',
      keyPoints: [
        'Auto staff-wise subject allocation',
        'Mobile-based attendance marking',
        'Centralized dashboard for teachers',
      ],
      image: '/class-management/androidapp_classmanagement_screenshot.png',
      icon: Users,
    },
    {
      title: 'Data-Driven Institute Growth',
      subtitle: 'Leverage insights for better planning',
      description: 'Use performance analytics and fee reports to drive strategic decisions and growth.',
      keyPoints: [
        'Batch performance analytics',
        'Fee collection reports',
        'Multi-branch comparison dashboards',
      ],
      image: '/class-management/web_classmanagement_screenshot.png',
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
        <div className="absolute inset-0 bg-[url('/class-management/ClassManagement1.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 text-white text-shadow-lg"
          >
            Class Management
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-white text-shadow-lg"
          >
            All-in-One Class, Student, and Exam Management Software with Mobile App
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            Tej Class Management System is a modern, scalable platform designed for schools, coaching institutes, and training centers to manage students, staff, batches, attendance, exams, and learning material with ease.
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
            Why Choose Tej Class Management System?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <motion.div variants={itemVariants} className="space-y-4 flex flex-col justify-between">
              <div>
                <p className="text-lg text-gray-700">
                  Tej Class Management System is a modern, scalable platform designed for schools, coaching institutes, and training centers to manage students, staff, batches, attendance, exams, and learning material with ease.
                </p>
                <p className="text-lg text-gray-700">
                  With an integrated Android application, both students and staff get real-time access to classes, assignments, and attendance. It ensures data security, operational efficiency, and transparency between management, teachers, students, and parents.
                </p>
                <ul className="list-none space-y-2 mt-4">
                  {[
                    'Simplified student & batch registration process',
                    'Centralized class & branch-wise login',
                    'Secure assignment, test & question paper management',
                    'Real-time attendance & performance tracking',
                    'Mobile-first learning experience with Android app',
                    'Easy migration for old students to new classes',
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
                  Get Started Today
                </Link>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center"
            >
              <Image
                src="/class-management/ClassManagement1.jpg"
                alt="Tej Class Management Dashboard"
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
            Powerful Features of Tej Class Management
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
            Benefits of Tej Class Management System
          </motion.h2>
          {benefits.map((benefit, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { amount: 0.5, once: false });

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
          Ready to Transform Your Institute?
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