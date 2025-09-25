'use client';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Server, Wrench, Database, UploadCloud, Shield, Brain, DollarSign, Maximize2, Zap, Book, Settings, DownloadCloud } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keyServices: string[];
  benefits: string[];
}

interface CaseStudy {
  title: string;
  description: string;
}

interface Resource {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function CloudServicesClient() {
  const services: Service[] = [
    {
      title: 'Cloud Migration & Deployment',
      description: 'Move your applications, databases, and storage to AWS with minimal downtime.',
      icon: UploadCloud,
      keyServices: [
        'Lift-and-shift migration of applications',
        'Database migration (RDS, Aurora, DynamoDB)',
        'Storage setup (S3, EFS, Glacier)',
        'Application deployment & scaling (EC2, ECS, EKS)',
        'Cloud-native modernization',
      ],
      benefits: ['Faster cloud adoption', 'Scalable infrastructure', 'Minimal disruption'],
    },
    {
      title: 'DevOps & Automation',
      description: 'Accelerate software delivery with automated pipelines and reliable infrastructure.',
      icon: Zap,
      keyServices: [
        'CI/CD pipelines (Jenkins, GitHub Actions, GitLab CI)',
        'Infrastructure as Code (Terraform, CloudFormation)',
        'Containerization & orchestration (Docker, Kubernetes, ECS/EKS)',
        'Automated testing, monitoring, and deployments',
        'Secrets & configuration management',
      ],
      benefits: ['Faster releases', 'Fewer errors', 'Efficient developer workflows'],
    },
    {
      title: 'Cloud Cost Optimization',
      description: 'Reduce AWS costs without compromising performance.',
      icon: DollarSign,
      keyServices: [
        'Instance rightsizing and reserved instances',
        'Storage lifecycle management',
        'Monitoring idle/unused resources',
        'Cost analysis using AWS Trusted Advisor & Cost Explorer',
      ],
      benefits: ['Lower cloud spend', 'Predictable billing', 'Improved ROI'],
    },
    {
      title: 'Security & Compliance',
      description: 'Protect your data and applications with enterprise-grade security.',
      icon: Shield,
      keyServices: [
        'IAM, KMS, VPC, WAF configuration',
        'Data encryption (at rest & in transit)',
        'Logging & monitoring with CloudTrail, GuardDuty, AWS Config',
        'Compliance enablement (ISO, PCI DSS, HIPAA)',
      ],
      benefits: ['Secure workloads', 'Meet regulatory requirements', 'Reduce risks'],
    },
    {
      title: 'Managed Cloud Services',
      description: 'Focus on growth while we handle your cloud infrastructure.',
      icon: Wrench,
      keyServices: [
        'Continuous monitoring, backups, and scaling',
        'Security patching & compliance updates',
        'SLA-based support (business hours or 24/7)',
        'Ongoing DevOps automation improvements',
      ],
      benefits: ['Predictable costs', 'Guaranteed uptime', 'Peace of mind'],
    },
    {
      title: 'Cloud Consulting & Strategy',
      description: 'Tailored guidance to align cloud adoption with business objectives.',
      icon: Server,
      keyServices: [
        'Cloud readiness assessment',
        'Architecture design & review',
        'Cost-benefit analysis',
        'Governance & operational maturity roadmap',
      ],
      benefits: ['Smarter cloud adoption', 'Reduced risks', 'Long-term scalability'],
    },
    {
      title: 'Training & Knowledge Transfer',
      description: 'Empower your team to manage cloud systems efficiently.',
      icon: Book,
      keyServices: [
        'Hands-on AWS & DevOps training',
        'Documentation (architecture diagrams, runbooks, playbooks)',
        'Best practices workshops',
      ],
      benefits: ['Build internal capability', 'Reduce dependency on external resources'],
    },
    {
      title: 'AI/ML & Advanced Cloud Services',
      description: 'Integrate AI/ML for smarter, data-driven decisions.',
      icon: Brain,
      keyServices: [
        'AWS SageMaker for predictive analytics',
        'Real-time dashboards and insights',
      ],
      benefits: ['Transform data into actionable insights', 'Improve business outcomes'],
    },
  ];

  const caseStudies: CaseStudy[] = [
    {
      title: 'Manufacturing AWS Migration',
      description: '50% faster deployment, 30% cost reduction through EC2/S3 migration and CI/CD pipelines.',
    },
    {
      title: 'Educational Platform DevOps',
      description: '40% faster release cycles with Jenkins and Docker automation.',
    },
    {
      title: 'Database Optimization',
      description: '60% improved performance via DynamoDB migration and monitoring dashboards.',
    },
  ];

  const resources: Resource[] = [
    {
      title: 'Cloud Migration Guide',
      description: 'Step-by-step guide to seamless AWS migration.',
      href: '/blogs/cloud-migration-guide',
      icon: DownloadCloud,
    },
    {
      title: 'DevOps Best Practices',
      description: 'Learn CI/CD, IaC, and container orchestration.',
      href: '/blogs/devops-best-practices',
      icon: Settings,
    },
    {
      title: 'Choosing the Right Cloud Provider',
      description: 'Key factors for selecting the best cloud platform.',
      href: '/blogs/cloud-provider-guide',
      icon: Book,
    },
  ];

  const partners = ['aws', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'grafana', 'gitlab', 'git'];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardHover: Variants = {
    hover: {
      scale: 1.03,
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(200, 250, 255, 0.7))',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const iconHover: Variants = {
    hover: {
      x: [0, 2, -2, 2, -2, 0],
      y: [0, -2, 2, -2, 2, 0],
      scale: 1.2,
      transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' },
    },
  };

  const buttonHover: Variants = {
    hover: {
      scale: 1.1,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-900 relative overflow-hidden">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-100 opacity-50 animate-gradient shift" />
      <style jsx>{`
        @keyframes shift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10%, 10%); }
          100% { transform: translate(0, 0); }
        }
        .animate-gradient { animation: shift 20s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>

      {/* Hero Section with Parallax */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative bg-[url('/it-services/cloud-bg.jpg')] bg-cover bg-center text-white py-24 text-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-teal-900/80"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-white tracking-tight"
          >
            Transform, Automate, Scale with AWS & DevOps
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto font-light"
          >
            Unlock the full potential of AWS cloud infrastructure and DevOps practices. Seamless migration, automated workflows, optimized costs, and enterprise-grade security for your business.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/contact"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl transition-transform"
            >
              <motion.span variants={buttonHover} whileHover="hover">
                Request Free Consultation
              </motion.span>
            </Link>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 flex justify-center gap-4 flex-wrap"
          >
            {['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'GitLab'].map((tech, index) => (
              <motion.div
                key={tech}
                variants={itemVariants}
                className="bg-white/20 backdrop-blur-lg px-5 py-2 rounded-full text-sm font-medium text-white shadow-lg border border-white/30"
              >
                {tech}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-24 bg-transparent relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-900 tracking-tight"
          >
            Our Cloud & DevOps Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={cardHover}
                whileHover="hover"
                className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100/50"
              >
                <motion.div variants={iconHover} whileHover="hover" className="flex justify-center">
                  <service.icon className="w-12 h-12 text-teal-500 mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-center text-blue-900">{service.title}</h3>
                <p className="text-gray-700 mb-6 text-base text-center">{service.description}</p>
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-blue-800 mb-3">Key Services:</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                    {service.keyServices.map((keyService, i) => (
                      <li key={i}>{keyService}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-blue-800 mb-3">Benefits:</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                    {service.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-24 bg-gradient-to-b from-gray-100 to-teal-50 relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-900 tracking-tight"
          >
            Why Choose Tej IT Cloud Services?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Cost Efficiency', description: 'Pay-as-you-go, no upfront hardware costs.', icon: DollarSign },
              { title: 'Scalability & Flexibility', description: 'Auto-scale resources, reduce over-provisioning.', icon: Maximize2 },
              { title: 'Reliability & Uptime', description: '99.9% SLA with disaster recovery.', icon: Zap },
              { title: 'Faster Releases & Automation', description: 'DevOps pipelines, IaC, monitoring.', icon: Settings },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={cardHover}
                whileHover="hover"
                className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100/50"
              >
                <motion.div variants={iconHover} whileHover="hover" className="flex justify-center">
                  <benefit.icon className="w-10 h-10 text-teal-500 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-3 text-center text-blue-900">{benefit.title}</h3>
                <p className="text-gray-700 text-sm text-center">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Success Stories Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-24 bg-transparent relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-900 tracking-tight"
          >
            Success Stories
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.title}
                variants={cardHover}
                whileHover="hover"
                className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100/50"
              >
                <h3 className="text-lg font-semibold mb-3 text-center text-blue-900">{caseStudy.title}</h3>
                <p className="text-gray-700 text-sm text-center">{caseStudy.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-24 bg-gradient-to-b from-teal-50 to-gray-100 relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-900 tracking-tight"
          >
            Technology Partners & Tools
          </motion.h2>
          <div className="flex justify-center overflow-x-auto space-x-8 pb-4 scrollbar-thin">
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                variants={itemVariants}
                whileHover={{ scale: 1.15, y: -5 }}
                className="grayscale hover:grayscale-0 transition-all flex-shrink-0"
              >
                <Image
                  src={`/icons/${partner}.png`}
                  alt={`${partner.charAt(0).toUpperCase() + partner.slice(1)} Partner`}
                  width={100}
                  height={60}
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-24 bg-transparent relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-900 tracking-tight"
          >
            Resources & Guides
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.href}
                variants={cardHover}
                whileHover="hover"
                className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100/50"
              >
                <motion.div variants={iconHover} whileHover="hover" className="flex justify-center">
                  <resource.icon className="w-10 h-10 text-teal-500 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-3 text-center text-blue-900">{resource.title}</h3>
                <p className="text-gray-700 text-sm text-center">{resource.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-24 bg-gradient-to-r from-teal-600 to-blue-700 text-white text-center relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={itemVariants}>
            <Link
              href="/contact"
              className="bg-white text-teal-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg shadow-xl transition-transform"
            >
              <motion.span variants={buttonHover} whileHover="hover">
                Request Free Consultation
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}