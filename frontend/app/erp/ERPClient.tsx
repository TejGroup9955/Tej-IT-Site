'use client';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { BarChart, CheckSquare, Users, DollarSign, Calculator, Warehouse, FileText, Book, BarChart2, FileCheck, ChevronRight } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  keyFeatures: string[];
  icon: React.ComponentType<{ className?: string }>;
  modalId: string;
}

export default function ERPClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const features: Feature[] = [
    {
      title: 'Project Planning & Management',
      description: 'Streamline site-level budgets, BOQs, schedules, and performance tracking for efficient project management.',
      keyFeatures: [
        'Create & track site-wise budgets and work schedules',
        'Upload master project data in bulk',
        'Monitor project-wise profit and loss',
        'Generate and manage BOQs with revisions',
        'Upload client work orders site-wise',
        'Plan project materials and manage requisitions',
        'View consolidated project-wise reports',
        'Custom development available as per site needs',
      ],
      icon: BarChart,
      modalId: 'Planning_mgnt',
    },
    {
      title: 'Purchase & Procurement Management',
      description: 'Automate PO generation, rate comparisons, and supplier management tailored for project sites.',
      keyFeatures: [
        'Generate POs against material requisitions (PRN), site-wise or for godown',
        'Compare supplier quotations with BOQ rates',
        'Manage single/multiple PRNs and POs',
        'GRN entries and bill matching',
        'Supplier bill entry, delivery challans, and return tracking',
        'LOI issuance and purchase rate history tracking',
        'Custom PO print formats',
        'Full/partial PO cancellation provisions',
        'Auto-signatures and approval workflows',
      ],
      icon: CheckSquare,
      modalId: 'purchase_procure',
    },
    {
      title: 'Site Activity Management',
      description: 'Track site data in real-time with a user-friendly web and mobile interface.',
      keyFeatures: [
        'Submit and track material requisitions from site',
        'Record GRNs, material returns, and daily consumption',
        'Enter site-wise labour updates and daily work reports with images',
        'Track site-wise expense and advance requests',
        'Enable site-level approval workflows',
        'Mobile-friendly operations for on-site teams',
      ],
      icon: Users,
      modalId: 'site_activity',
    },
    {
      title: 'Subcontractor Management',
      description: 'Manage subcontractor work orders, billing, and payments with robust checks.',
      keyFeatures: [
        'BOQ-based subcontractor work order generation',
        'Bill submission, verification, and approval workflows',
        'Manage TDS, retention, holds, and debit notes',
        'Record and approve payments with audit trails',
      ],
      icon: DollarSign,
      modalId: 'sub_contractor',
    },
    {
      title: 'Expense Management',
      description: 'Simplify expense tracking across users and sites with centralized control.',
      keyFeatures: [
        'Create expense and advance requests',
        'Attach supporting bills site-wise',
        'View user-wise expense ledger',
        'Approval-based disbursement process',
        'Track paid/unpaid advances',
      ],
      icon: Calculator,
      modalId: 'expense',
    },
    {
      title: 'Inventory Management',
      description: 'Manage multi-store inventory with inward-outward tracking and adjustments.',
      keyFeatures: [
        'Opening stock updates and GRNs',
        'Site-wise delivery challans and stock summaries',
        'Material returns, adjustments, and transfers',
        'Track stock movement and supplier/product summaries',
        'Customizable reporting and print formats',
      ],
      icon: Warehouse,
      modalId: 'store',
    },
    {
      title: 'Sales Management',
      description: 'Handle client invoicing and billing summaries with accuracy.',
      keyFeatures: [
        'Generate proforma and sales invoices',
        'Track billed/unbilled items and work order summaries',
        'Manage client advance payments',
        'Invoice approvals and annexure reports',
        'Customizable invoice formats',
      ],
      icon: FileText,
      modalId: 'sales',
    },
    {
      title: 'Account Management',
      description: 'Control financial workflows with ledger management and audit support.',
      keyFeatures: [
        'Approval-based supplier and subcontractor payments',
        'Sales billing and annexure reporting',
        'Site-wise and user-wise ledger generation',
        'Credit/Debit note updates',
        'PDC cheque tracking and bank ledger reports',
      ],
      icon: Book,
      modalId: 'account',
    },
    {
      title: 'MIS Reports & Dashboards',
      description: 'Gain insights with 30+ reports on costs, stock, and profitability.',
      keyFeatures: [
        'Site-wise Profit & Loss',
        'Purchase/Sales GST reports',
        'BOQ & PRN tracking reports',
        'Ledger, TDS, and outstanding reports',
        'Site-wise daily work and expense summaries',
        'User-wise expense and activity reports',
        'Rate comparison, planning, and subcontractor summaries',
      ],
      icon: BarChart2,
      modalId: 'mis_report',
    },
  ];

  // Benefits data
  const benefits = [
    {
      title: 'Project Planning & Management',
      subtitle: 'Plan, track, and control projects with ease',
      description:
        'Tej Smart ERP helps Civil, Electrical, and MEP contractors monitor site budgets, BOQs, and profitability in real time.',
      keyPoints: [
        'Create and manage site-wise budgets & schedules',
        'Monitor project-wise Profit & Loss (P&L) instantly',
        'Upload and manage master project data & BOQs',
        'Track project progress and cost overruns efficiently',
      ],
      image: '/erp/web_erp_screenshot.png',
      icon: BarChart,
    },
    {
      title: 'Purchase & Procurement Management',
      subtitle: 'Simplify contractor procurement',
      description:
        'Automate POs, vendor comparisons, and bill matching. Ensure the right material reaches every site on time.',
      keyPoints: [
        'Generate Purchase Orders (POs) against PRNs',
        'Compare supplier quotations vs. BOQ rates',
        'Manage single/multiple POs and PRNs with ease',
        'Match GRNs with invoices for 100% accuracy',
      ],
      image: '/erp/androidapp_erp_screenshot.png',
      icon: CheckSquare,
    },
    {
      title: 'Site Activity Management',
      subtitle: 'Track and record site activities from anywhere',
      description:
        'Contractors get real-time visibility into labour, materials, and daily progress via mobile or web.',
      keyPoints: [
        'Submit and track material requisitions site-wise',
        'Record GRNs, returns, and daily consumption',
        'Capture labour attendance and daily work logs',
        'Track site expenses and advance requests instantly',
      ],
      image: '/erp/web_erp_screenshot.png',
      icon: Users,
    },
    {
      title: 'Subcontractor Management',
      subtitle: 'Manage subcontractors with confidence',
      description:
        'Tej Smart ERP ensures transparent billing, BOQ-linked work orders, and payment tracking.',
      keyPoints: [
        'Create BOQ-based subcontractor work orders',
        'Automate bill submissions, verification, and approvals',
        'Manage TDS, retention, debit notes & payment holds',
        'Record and approve subcontractor payments with audit trail',
      ],
      image: '/erp/androidapp_erp_screenshot.png',
      icon: DollarSign,
    },
    {
      title: 'Expense Management',
      subtitle: 'Gain full control over site expenses',
      description:
        'Contractors can track requests, bills, and approvals centrally, avoiding hidden costs and overspending.',
      keyPoints: [
        'Submit and approve site expense & advance requests',
        'Attach supporting bills for expense entries',
        'View user-wise expense ledgers',
        'Ensure approval-based disbursements for control',
      ],
      image: '/erp/web_erp_screenshot.png',
      icon: Calculator,
    },
    {
      title: 'Inventory Management',
      subtitle: 'Stay in control of materials',
      description:
        'Multi-site inventory tracking, stock transfers, and supplier summaries.',
      keyPoints: [
        'Record opening stock & GRN entries',
        'Generate delivery challans & stock summaries site-wise',
        'Manage material returns, adjustments & transfers',
        'Track supplier/product stock movement reports',
      ],
      image: '/erp/androidapp_erp_screenshot.png',
      icon: Warehouse,
    },
    {
      title: 'Sales Management',
      subtitle: 'Handle contractor billing',
      description:
        'Proforma & sales invoicing, client advances, and annexure reports—all in one ERP system.',
      keyPoints: [
        'Generate proforma & sales invoices instantly',
        'Track billed vs. unbilled items clearly',
        'Manage client advance payments with accuracy',
        'Invoice approvals & annexure reports made easy',
      ],
      image: '/erp/web_erp_screenshot.png',
      icon: FileText,
    },
    {
      title: 'Account Management',
      subtitle: 'Bring all financials under one roof',
      description:
        'Tej Smart ERP simplifies payments, ledgers, and GST accounting for contractors.',
      keyPoints: [
        'Process approval-based supplier & subcontractor payments',
        'Manage site-wise & user-wise ledgers',
        'Record credit/debit notes without errors',
        'Ensure GST-compliant billing & annexures',
      ],
      image: '/erp/androidapp_erp_screenshot.png',
      icon: Book,
    },
    {
      title: 'MIS Reports & Dashboards',
      subtitle: 'Make data-driven decisions',
      description:
        '30+ ready-to-use ERP reports on cost, stock, GST, and profitability.',
      keyPoints: [
        'View site-wise Profit & Loss reports',
        'Generate GST reports for purchase & sales',
        'Track BOQ & PRN status instantly',
        'Access ledger, TDS, and outstanding reports',
      ],
      image: '/erp/web_erp_screenshot.png',
      icon: BarChart2,
    },
    {
      title: 'E-Invoicing & Tally Integration',
      subtitle: 'Stay compliant with ease',
      description:
        'Direct GST e-invoicing and Tally integration for seamless contractor accounting.',
      keyPoints: [
        'Generate e-invoices directly from ERP',
        'Download, view, or cancel invoices anytime',
        'Sync Tally for smooth accounting',
        'Stay audit-ready and compliant always',
      ],
      image: '/erp/androidapp_erp_screenshot.png',
      icon: FileCheck,
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
        <div className="absolute inset-0 bg-[url('/erp/civil.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 text-white text-shadow-lg"
          >
            Tej Smart ERP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            Empower your contracting business with a cloud-based ERP solution designed for seamless project management, procurement, and more.
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
            Why Choose Tej Smart ERP?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <motion.div variants={itemVariants} className="space-y-4 flex flex-col justify-between">
              <div>
                <p className="text-lg text-gray-700">
                  Tej Smart ERP is a cloud-based enterprise solution crafted for contractors. With industry-specific modules, it automates processes like project planning, billing, procurement, labor management, and inventory tracking. Tailored for civil, MEP, and electrical contractors, Tej ERP simplifies operations, boosts visibility, and enhances profitability by integrating all functions into one platform.
                </p>
                <p className="text-lg text-gray-700">
                  Manage multiple sites or complex BOQs with centralized visibility, workflow automation, and real-time reporting to stay competitive and compliant.
                </p>
                <p className="text-lg text-gray-700">
                  Our modular ERP centralizes core operations—financial accounting, inventory, and compliance—into a unified dashboard. Real-time data flow enables data-driven decisions, fosters collaboration, and ensures seamless operations for businesses of all sizes.
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
                src="/erp/civil.jpg"
                alt="Tej Smart ERP Dashboard"
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
            Powerful Features for Contractors
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
            Module-Wise Benefits of Tej Smart ERP
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
          Ready to Transform Your Operations?
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