'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Server, Wrench, Database, UploadCloud, Shield, Brain, DollarSign, Maximize2, Zap, Book, Settings, DownloadCloud } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CaseStudy {
  title: string;
  problem: string;
  solution: string;
  result: string;
}

interface Resource {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function CloudServicesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

<<<<<<< HEAD
  const services: Service[] = [
    {
      title: 'AWS Solutions',
      description: 'Expert deployment and management of AWS infrastructure, including EC2 for virtual servers, S3 for storage, and Lambda for serverless computing, ensuring seamless scalability.',
      icon: Server,
    },
    {
      title: 'DevOps',
      description: 'Automate workflows with CI/CD pipelines, Jenkins, Docker, and infrastructure as code (Terraform, Ansible) for faster, reliable software delivery.',
      icon: Wrench,
    },
    {
      title: 'Database Services',
      description: 'Secure, high-performance cloud databases (Amazon RDS, DynamoDB, Azure SQL) with migration, optimization, and scaling for relational and NoSQL environments.',
      icon: Database,
    },
    {
      title: 'Cloud Migration Consulting',
      description: 'Plan and execute seamless transitions to cloud platforms with customized strategies for minimal disruption.',
      icon: UploadCloud,
    },
    {
      title: 'Security & Compliance',
      description: 'Robust solutions like IAM, encryption, and compliance with GDPR, HIPAA to protect data and meet regulatory standards.',
      icon: Shield,
    },
    {
      title: 'AI/ML Integration',
      description: 'Leverage AWS SageMaker or Azure Machine Learning for advanced analytics and data-driven decision-making.',
=======
  const cloudServices: Service[] = [
    {
      title: 'AWS Solutions',
      description: 'EC2, S3, Lambda, RDS, CloudFront setup and management with auto-scaling and serverless solutions.',
      icon: Server,
    },
    {
      title: 'Cloud Migration',
      description: 'On-premises to AWS migration, hybrid/multi-cloud strategies, and minimal downtime execution.',
      icon: UploadCloud,
    },
    {
      title: 'Database Services',
      description: 'RDS, Aurora, DynamoDB, NoSQL & relational DB setup, optimization, and scaling.',
      icon: Database,
    },
    {
      title: 'Security & Compliance',
      description: 'IAM, KMS, VPC, WAF, encryption, GDPR/HIPAA compliance.',
      icon: Shield,
    },
    {
      title: 'Managed Cloud Services',
      description: 'Monitoring, backups, scaling, and 24/7 support.',
      icon: Wrench,
    },
    {
      title: 'AI/ML Integration',
      description: 'AWS SageMaker, predictive analytics, data-driven insights for smarter business decisions.',
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
      icon: Brain,
    },
  ];

<<<<<<< HEAD
  const benefits: Benefit[] = [
    {
      title: 'Cost Savings',
      description: 'Reduce costs by up to 60% with pay-as-you-go models, eliminating upfront hardware investments.',
=======
  const devOpsServices: Service[] = [
    {
      title: 'CI/CD Pipelines',
      description: 'Jenkins, GitHub Actions, GitLab CI for fast, repeatable releases.',
      icon: Zap,
    },
    {
      title: 'Containerization',
      description: 'Docker & ECS/EKS for scalable container-based applications.',
      icon: Maximize2,
    },
    {
      title: 'Infrastructure as Code',
      description: 'Terraform, Ansible to automate provisioning and deployments.',
      icon: Wrench,
    },
    {
      title: 'Monitoring & Alerting',
      description: 'CloudWatch, Grafana, and custom dashboards for proactive incident management.',
      icon: Server,
    },
    {
      title: 'Version Control & Automation',
      description: 'Git-based workflows for team collaboration and faster release cycles.',
      icon: Book,
    },
  ];

  const cloudBenefits: Benefit[] = [
    {
      title: 'Cost Efficiency',
      description: 'Pay-as-you-go, no upfront hardware costs.',
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
      icon: DollarSign,
    },
    {
      title: 'Scalability & Flexibility',
<<<<<<< HEAD
      description: 'Instantly scale resources to meet demand, ensuring no over-provisioning or downtime.',
      icon: Maximize2,
    },
    {
      title: 'Speed & Agility',
      description: 'Accelerate time-to-market with rapid deployment and prototyping capabilities.',
=======
      description: 'Auto-scale resources, reduce over-provisioning.',
      icon: Maximize2,
    },
    {
      title: 'Reliability & Uptime',
      description: '99.9% uptime SLA with disaster recovery.',
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
      icon: Zap,
    },
  ];

<<<<<<< HEAD
=======
  const devOpsBenefits: Benefit[] = [
    {
      title: 'Faster Releases',
      description: 'Reduce manual deployment errors, speed up time-to-market.',
      icon: Zap,
    },
    {
      title: 'Consistency & Reliability',
      description: 'Repeatable infrastructure with IaC and automated testing.',
      icon: Settings,
    },
    {
      title: 'Data-Driven Decisions',
      description: 'Real-time monitoring dashboards and analytics.',
      icon: Database,
    },
  ];

>>>>>>> d5691fe (updated it-services pages with careers page with backend)
  const caseStudies: CaseStudy[] = [
    {
      title: 'Manufacturing AWS Migration',
      problem: 'Legacy systems slowed production.',
<<<<<<< HEAD
      solution: 'Migrated to AWS EC2 and S3.',
      result: '50% faster deployment, 30% cost reduction.',
    },
    {
      title: 'DevOps for Education',
      problem: 'Slow software updates.',
      solution: 'Implemented CI/CD with Jenkins and Docker.',
=======
      solution: 'EC2/S3 migration, auto-scaling, CI/CD pipelines.',
      result: '50% faster deployment, 30% cost reduction.',
    },
    {
      title: 'Educational Platform',
      problem: 'Slow software updates.',
      solution: 'DevOps automation with Jenkins & Docker.',
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
      result: '40% faster release cycles.',
    },
    {
      title: 'Database Optimization',
<<<<<<< HEAD
      problem: 'High-latency data access.',
      solution: 'Migrated to DynamoDB.',
      result: '60% improved query performance.',
=======
      problem: 'High-latency queries.',
      solution: 'DynamoDB migration, monitoring dashboards.',
      result: '60% improved performance.',
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
    },
  ];

  const resources: Resource[] = [
    {
<<<<<<< HEAD
      title: 'How to Choose the Right Cloud Provider',
      description: 'Learn key factors to consider when selecting a cloud platform for your business.',
      href: '/blogs/cloud-provider-guide',
      icon: Book,
    },
    {
      title: 'DevOps Best Practices',
      description: 'Discover how to streamline development with our proven DevOps strategies.',
      href: '/blogs/devops-practices',
      icon: Settings,
    },
    {
      title: 'Cloud Migration Guide',
      description: 'A step-by-step guide to seamless cloud transitions.',
      href: '/blogs/cloud-migration-guide',
      icon: DownloadCloud,
    },
  ];

=======
      title: 'Cloud Migration Guide',
      description: 'Step-by-step migration to AWS.',
      href: '/blogs/cloud-migration-guide',
      icon: DownloadCloud,
    },
    {
      title: 'DevOps Best Practices',
      description: 'CI/CD, IaC, container orchestration.',
      href: '/blogs/devops-best-practices',
      icon: Settings,
    },
    {
      title: 'Choosing the Right Cloud Provider',
      description: 'Key decision factors.',
      href: '/blogs/cloud-provider-guide',
      icon: Book,
    },
  ];

  const partners = ['aws', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'grafana', 'gitlab', 'git'];

>>>>>>> d5691fe (updated it-services pages with careers page with backend)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardHover = {
    hover: { scale: 1.05, boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)', transition: { duration: 0.3 } },
  };

  const iconHover = {
    hover: {
      rotate: [0, 10, -10, 10, -10, 0],
      transition: { duration: 0.5, ease: 'easeInOut', repeat: 0 },
    },
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (name && email && message) {
<<<<<<< HEAD
      alert('Thank you for your submission! We will get back to you soon.');
=======
      alert('Thank you! Our cloud & DevOps experts will contact you shortly.');
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
      setFormData({ name: '', email: '', message: '' });
      setIsModalOpen(false);
      setFormError('');
    } else {
      setFormError('Please fill out all fields.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
<<<<<<< HEAD
        className="relative bg-[url('/it-services/cloud-bg.jpg')] bg-cover bg-center text-white py-24 text-center"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'white' }}
          >
            Transform Your Future with Cloud & DevOps Excellence
=======
        className="relative bg-[url('/it-services/cloud-bg.jpg')] bg-cover bg-center text-white py-24 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-teal-900/50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Transform, Automate, and Scale Your Business
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
<<<<<<< HEAD
            Unlock unparalleled efficiency and innovation with Tej IT Solutions’ cloud and DevOps expertise, delivering scalable, secure, and agile solutions for your digital transformation.
=======
            Unlock the full potential of AWS cloud infrastructure and DevOps practices. Tej IT Solutions delivers seamless cloud migration, secure infrastructure, CI/CD automation, container orchestration, and managed services to accelerate digital transformation.
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
          </motion.p>
          <motion.button
            variants={itemVariants}
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full text-lg"
          >
<<<<<<< HEAD
            Get a Free Consultation
          </motion.button>
=======
            Request Free Consultation
          </motion.button>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {['EC2', 'S3', 'Lambda', 'Jenkins', 'Docker', 'Terraform', 'Kubernetes'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
              >
                {tech}
              </motion.div>
            ))}
          </div>
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
        </div>
      </motion.section>

      {/* Cloud Services Offerings */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#1e40af' }}
          >
<<<<<<< HEAD
            Our Cloud Services Offerings
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
=======
            Cloud Services
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-lg text-center mb-8 max-w-2xl mx-auto"
          >
            Leverage the power of AWS cloud for scalability, security, and cost optimization. From cloud migration to managed services, we make your cloud journey smooth and efficient.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cloudServices.map((service, index) => (
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-gray-50 p-6 rounded-lg shadow-lg"
<<<<<<< HEAD
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
=======
                style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : '#e0f2fe' }}
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              >
                <motion.div variants={iconHover} whileHover="hover">
                  <service.icon className="w-8 h-8 text-teal-500 mb-4 mx-auto" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: '#1e40af' }}>
                  {service.title}
                </h4>
                <p className="text-gray-700">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

<<<<<<< HEAD
      {/* Benefits Section */}
=======
      {/* Cloud Benefits Section */}
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#1e40af' }}
          >
            Benefits of Our Cloud Services
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<<<<<<< HEAD
            {benefits.map((benefit, index) => (
=======
            {cloudBenefits.map((benefit, index) => (
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-white p-6 rounded-lg shadow-lg"
<<<<<<< HEAD
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
=======
                style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f9ff' }}
              >
                <motion.div variants={iconHover} whileHover="hover">
                  <benefit.icon className="w-8 h-8 text-teal-500 mb-4 mx-auto" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: '#1e40af' }}>
                  {benefit.title}
                </h4>
                <p className="text-gray-700">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* DevOps Services Offerings */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#1e40af' }}
          >
            DevOps Services
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-lg text-center mb-8 max-w-2xl mx-auto"
          >
            Automate workflows, accelerate software delivery, and ensure infrastructure reliability with Tej IT’s DevOps solutions.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devOpsServices.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-gray-50 p-6 rounded-lg shadow-lg"
                style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : '#e0f2fe' }}
              >
                <motion.div variants={iconHover} whileHover="hover">
                  <service.icon className="w-8 h-8 text-teal-500 mb-4 mx-auto" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: '#1e40af' }}>
                  {service.title}
                </h4>
                <p className="text-gray-700">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* DevOps Benefits Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#1e40af' }}
          >
            Benefits of Our DevOps Services
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devOpsBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-white p-6 rounded-lg shadow-lg"
                style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f9ff' }}
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              >
                <motion.div variants={iconHover} whileHover="hover">
                  <benefit.icon className="w-8 h-8 text-teal-500 mb-4 mx-auto" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: '#1e40af' }}>
                  {benefit.title}
                </h4>
                <p className="text-gray-700">{benefit.description}</p>
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
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#1e40af' }}
          >
            Success Stories
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.title}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-gray-50 p-6 rounded-lg shadow-lg"
<<<<<<< HEAD
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
=======
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              >
                <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: '#1e40af' }}>
                  {caseStudy.title}
                </h4>
                <p className="text-gray-700">
                  <strong>Problem:</strong> {caseStudy.problem}<br />
                  <strong>Solution:</strong> {caseStudy.solution}<br />
                  <strong>Result:</strong> {caseStudy.result}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Partners Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#1e40af' }}
          >
<<<<<<< HEAD
            Our Technology Partners
          </motion.h3>
          <div className="flex justify-center space-x-12 flex-wrap">
            {['aws.png', 'azure.png', 'gcp.png', 'jenkins.png', 'ansible.png', 'terraform.png', 'docker.png', 'kubernetes.png'].map((logo, index) => (
              <motion.div
                key={logo}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={`/icons/${logo}`}
                  alt={`${logo.split('.')[0].toUpperCase()} Partner`}
                  width={100}
                  height={64}
                  className="object-contain mb-4"
=======
            Technology Partners
          </motion.h3>
          <div className="flex overflow-x-auto space-x-8 pb-4">
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
                  width={100}
                  height={64}
                  className="object-contain"
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
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
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: '#1e40af' }}
          >
<<<<<<< HEAD
            Insights & Resources
=======
            Resources & Guides
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.href}
                variants={itemVariants}
                whileHover="hover"
                custom={cardHover}
                className="bg-gray-50 p-6 rounded-lg shadow-lg"
<<<<<<< HEAD
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
=======
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              >
                <motion.div variants={iconHover} whileHover="hover">
                  <resource.icon className="w-8 h-8 text-teal-500 mb-4 mx-auto" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: '#1e40af' }}>
                  {resource.title}
                </h4>
                <p className="text-gray-700">{resource.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

<<<<<<< HEAD
=======
      {/* CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 bg-teal-500 text-white text-center"
      >
        <div className="container mx-auto px-4">
          <motion.h3
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Accelerate Your Cloud & DevOps Transformation Today
          </motion.h3>
          <motion.button
            variants={itemVariants}
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-teal-500 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-lg"
          >
            Request Free Consultation
          </motion.button>
        </div>
      </motion.section>

>>>>>>> d5691fe (updated it-services pages with careers page with backend)
      {/* Sticky CTA */}
      {showStickyCta && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-5 right-5 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg z-[1000]"
        >
<<<<<<< HEAD
          Contact Us
=======
          Get Free Consultation
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
        </motion.button>
      )}

      {/* Consultation Modal */}
      {isModalOpen && (
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
            className="bg-white rounded-lg max-w-md w-full mx-4 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1e40af' }}>
<<<<<<< HEAD
                Get a Free Consultation
=======
                Request Free Consultation
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  required
                ></textarea>
              </div>
              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              <button
                type="submit"
<<<<<<< HEAD
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 rounded-md hover:from-orange-600 hover:to-red-600"
=======
                className="w-full bg-teal-500 text-white font-semibold py-2 rounded-md hover:bg-teal-600"
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
              >
                Submit
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}