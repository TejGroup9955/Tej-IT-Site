'use client';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { User, Calendar, DollarSign, Users, FileText, Clipboard, Workflow, LayoutDashboard, Smartphone, Check, ChevronRight, Briefcase } from 'lucide-react';

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

export default function PayrollClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const features: Feature[] = [
    {
      title: 'Biometric & Location-Based Attendance',
      description: 'Accurate attendance with biometric + GPS check-in.',
      keyFeatures: [
        'Track biometric punches in real time',
        'Capture employee location while marking attendance',
        'Automated late-in/early-out deduction rules',
        'Real-time sync with payroll system',
      ],
      icon: User,
      modalId: 'biometric_attendance',
    },
    {
      title: 'Leave Management',
      description: 'Streamline employee leave approvals and balances.',
      keyFeatures: [
        'Employees request & track leave online',
        'Auto-calculate leave balances',
        'Automated approvals with manager notifications',
      ],
      icon: Calendar,
      modalId: 'leave_management',
    },
    {
      title: 'Loans & Advance Management',
      description: 'Support employees with structured repayment.',
      keyFeatures: [
        'Process loan & advance requests easily',
        'Auto-generate repayment schedules',
        'Automated salary deductions',
      ],
      icon: DollarSign,
      modalId: 'loan_advance',
    },
    {
      title: 'Staff Tracking',
      description: 'Centralize staff lifecycle records.',
      keyFeatures: [
        'Store joining & relieving dates',
        'Manage attendance logs & salary records',
        'One-click staff performance history',
      ],
      icon: Users,
      modalId: 'staff_tracking',
    },
    {
      title: 'Attendance Report',
      description: 'Get instant attendance insights.',
      keyFeatures: [
        'Generate daily, weekly, monthly, yearly reports',
        'One-click full attendance view for management',
        'Multi-location attendance comparison',
      ],
      icon: FileText,
      modalId: 'attendance_report',
    },
    {
      title: 'Pay Slip Management',
      description: 'Fast, accurate, and automated payroll.',
      keyFeatures: [
        'One-click payslip generation for all employees',
        'Digital access via employee portal/app',
        'Easy PDF print & email distribution',
      ],
      icon: Clipboard,
      modalId: 'payslip_management',
    },
    {
      title: 'Form 16 & Tax Compliance',
      description: 'Stay compliant and stress-free at tax season.',
      keyFeatures: [
        'Auto-generate Form 16 for employees',
        'Integrated TDS/GST compliance',
        'Export-ready reports for auditors',
      ],
      icon: FileText,
      modalId: 'tax_compliance',
    },
    {
      title: 'HR Workflow Automation',
      description: 'Bring professionalism to HR processes.',
      keyFeatures: [
        'Automated onboarding & document collection',
        'Centralized employee data management',
        'Smart approval workflows',
      ],
      icon: Workflow,
      modalId: 'hr_processes',
    },
    {
      title: 'Asset & Exit Processing',
      description: 'Smooth employee exits with complete compliance.',
      keyFeatures: [
        'Track company asset recovery',
        'Auto-generate Experience Letter & Relieving Letter',
        'Calculate full & final settlement instantly',
      ],
      icon: Briefcase,
      modalId: 'asset_recovery',
    },
    {
      title: 'All-in-One Dashboard',
      description: 'Manage everything from a single control panel.',
      keyFeatures: [
        'Payroll, attendance, and leave in one view',
        'Quick snapshots for senior management',
        'Drill-down reports available instantly',
      ],
      icon: LayoutDashboard,
      modalId: 'dashboard',
    },
    {
      title: 'Android App for Employees',
      description: 'Empower employees with self-service features.',
      keyFeatures: [
        'Mark attendance with GPS-enabled punch',
        'Access pay slips & Form 16 anytime',
        'View personalized reports on the go',
      ],
      icon: Smartphone,
      modalId: 'android_app',
    },
  ];

  const benefits: Benefit[] = [
    {
      title: 'One-Click Payroll Processing',
      subtitle: 'Disburse salaries in seconds, error-free',
      description: 'Automate salary calculations and payslip generation to save time and ensure accuracy.',
      keyPoints: [
        'Auto salary calculation with all deductions',
        'Instant payslip generation for every employee',
        'Seamless bank transfer integration',
      ],
      image: '/payroll/web_payroll_screenshot.png',
      icon: Clipboard,
    },
    {
      title: 'Compliance & Tax Management',
      subtitle: 'Stay audit-ready and 100% compliant',
      description: 'Simplify tax season with automated Form 16 generation and integrated GST/TDS compliance.',
      keyPoints: [
        'Auto-generate Form 16 for all staff',
        'Integrated GST & TDS deductions',
        'Export reports for auditors & tax filing',
      ],
      image: '/payroll/androidapp_payroll_screenshot.png',
      icon: FileText,
    },
    {
      title: 'HR Efficiency & Automation',
      subtitle: 'Save time and cut down manual HR work',
      description: 'Streamline onboarding, exits, and employee data management with automated workflows.',
      keyPoints: [
        'Automated onboarding & exit workflows',
        'Digital document storage & retrieval',
        'Centralized HR data hub',
      ],
      image: '/payroll/web_payroll_screenshot.png',
      icon: Workflow,
    },
    {
      title: 'Employee Empowerment',
      subtitle: 'Give employees control & transparency',
      description: 'Enhance employee satisfaction with self-service features via the mobile app and portal.',
      keyPoints: [
        'Mobile app for attendance & salary slips',
        'Self-service leave & loan requests',
        'Real-time payslip & tax document access',
      ],
      image: '/payroll/androidapp_payroll_screenshot.png',
      icon: Smartphone,
    },
    {
      title: 'Real-Time Management Insights',
      subtitle: 'Smart data for better decision-making',
      description: 'Access dashboards and reports for instant insights into payroll, attendance, and performance.',
      keyPoints: [
        'Dashboard with attendance, payroll & compliance',
        'One-click full attendance for managers',
        'Performance & workforce analytics',
      ],
      image: '/payroll/web_payroll_screenshot.png',
      icon: LayoutDashboard,
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
            Tej Payroll
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-white"
          >
            All-in-One Payroll & HR Management Software for Modern Businesses
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            Tej Payroll Software is an intuitive, scalable payroll & HR automation system designed to simplify everything from attendance tracking and salary processing to compliance, tax management, and employee exit formalities.
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
            Why Choose Tej Payroll Software?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <motion.div variants={itemVariants} className="space-y-4 flex flex-col justify-between">
              <div>
                <p className="text-lg text-gray-700">
                  Tej Payroll Software is an intuitive, scalable payroll & HR automation system designed to simplify everything from attendance tracking and salary processing to compliance, tax management, and employee exit formalities.
                </p>
                <p className="text-lg text-gray-700">
                  Whether you’re a startup, SME, or large enterprise, Tej Payroll ensures error-free salary disbursement, automated compliance, and complete transparency for employees and management. Our smart dashboard, mobile app, and automated workflows cut down manual work and keep your organization compliant, efficient, and employee-friendly.
                </p>
                <ul className="list-none space-y-2 mt-4">
                  {[
                    'Automated salary calculations with a single click',
                    'Seamless biometric & location-based attendance tracking',
                    'Smart leave, loan, and advance management',
                    'Automated Form 16, payslips, and compliance reports',
                    'End-to-end employee lifecycle management from joining to exit',
                    'Designed for small businesses to large enterprises',
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
            Powerful Features of Tej Payroll
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
            Benefits of Tej Payroll Software
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
          Ready to Simplify Your Payroll?
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