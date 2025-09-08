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
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardHover: Variants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
      rotate: [0, 2, -2, 2, -2, 0],
      transition: { duration: 0.4, ease: 'easeInOut', repeat: 0 },
    },
  };

  const iconHover: Variants = {
    hover: {
      rotate: [0, 10, -10, 10, -10, 0],
      scale: 1.1,
      transition: { duration: 0.4, ease: 'easeInOut', repeat: 0 },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-[url('/it-services/cloud-bg.jpg')] bg-cover bg-center text-white py-20 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-teal-900/70" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          >
            Transform, Automate, and Scale with AWS & DevOps
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            Unlock the full potential of AWS cloud infrastructure and DevOps practices. We help businesses migrate seamlessly, automate workflows, and optimize costs while ensuring security, scalability, and reliability.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/contact"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition-transform transform hover:scale-105"
            >
              Request Free Consultation
            </Link>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 flex justify-center gap-4 flex-wrap"
          >
            {['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'GitLab'].map((tech, index) => (
              <motion.div
                key={tech}
                variants={itemVariants}
                className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-white shadow-md"
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
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900"
          >
            Our Cloud & DevOps Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover="hover"
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <motion.div variants={iconHover} whileHover="hover" className="flex justify-center">
                  <service.icon className="w-10 h-10 text-teal-500 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-3 text-center text-blue-900">{service.title}</h3>
                <p className="text-gray-700 mb-4 text-sm text-center">{service.description}</p>
                <div className="mb-4">
                  <h4 className="text-base font-medium text-blue-800 mb-2">Key Services:</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    {service.keyServices.map((keyService, i) => (
                      <li key={i}>{keyService}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-base font-medium text-blue-800 mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
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
        className="py-20 bg-gray-100"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900"
          >
            Why Choose Tej IT Cloud Services?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Cost Efficiency', description: 'Pay-as-you-go, no upfront hardware costs.', icon: DollarSign },
              { title: 'Scalability & Flexibility', description: 'Auto-scale resources, reduce over-provisioning.', icon: Maximize2 },
              { title: 'Reliability & Uptime', description: '99.9% SLA with disaster recovery.', icon: Zap },
              { title: 'Faster Releases & Automation', description: 'DevOps pipelines, IaC, monitoring.', icon: Settings },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <motion.div variants={iconHover} whileHover="hover" className="flex justify-center">
                  <benefit.icon className="w-8 h-8 text-teal-500 mb-3" />
                </motion.div>
                <h3 className="text-base font-semibold mb-2 text-center text-blue-900">{benefit.title}</h3>
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
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900"
          >
            Success Stories
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.title}
                variants={itemVariants}
                whileHover="hover"
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <h3 className="text-base font-semibold mb-3 text-center text-blue-900">{caseStudy.title}</h3>
                <p className="text-gray-700 text-sm">{caseStudy.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technology Partners Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gray-100"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900"
          >
            Technology Partners & Tools
          </motion.h2>
          <div className="flex justify-center overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200">
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="grayscale hover:grayscale-0 transition-all flex-shrink-0"
              >
                <Image
                  src={`/icons/${partner}.png`}
                  alt={`${partner.charAt(0).toUpperCase() + partner.slice(1)} Partner`}
                  width={80}
                  height={50}
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Resources Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900"
          >
            Resources & Guides
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.href}
                variants={itemVariants}
                whileHover="hover"
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <motion.div variants={iconHover} whileHover="hover" className="flex justify-center">
                  <resource.icon className="w-8 h-8 text-teal-500 mb-3" />
                </motion.div>
                <h3 className="text-base font-semibold mb-2 text-center text-blue-900">{resource.title}</h3>
                <p className="text-gray-700 text-sm text-center">{resource.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-center"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Start Your Cloud & DevOps Journey Today
          </motion.h2>
          <motion.div variants={itemVariants}>
            <Link
              href="/contact"
              className="bg-white text-teal-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-base shadow-lg transition-transform transform hover:scale-105"
            >
              Request Free Consultation
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}