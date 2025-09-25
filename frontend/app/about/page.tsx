'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  const historyTimeline = [
    {
      period: '2015 - 2016',
      description: 'Started as Tej Infotech under Tej Group, digitizing the group’s presence with stand-alone applications replacing traditional paperwork.',
      image: '/about/',
    },
    {
      period: '2016 - 2018',
      description: 'Automated sales force and inter-departmental coordination, began web and mobile app development, and implemented Bulk SMS services.',
      image: '/about/',
    },
    {
      period: '2018 - 2020',
      description: 'Incorporated as Tej IT Solutions India Pvt. Ltd., launched E-Pulse Care (hospital software), Tej Smart Class (ERP for institutes), and BDM Smart System (CRM).',
      image: '/about/',
    },
    {
      period: '2020 - 2022',
      description: 'Launched Tej Payroll System with Android app and biometric integration, and Tej ERP System for contractors. Added mobile apps for Tej Smart Class and GPS tracking for BDM Smart.',
      image: '/about/',
    },
    {
      period: '2022 - Present',
      description: 'Expanded ERP for Electrical, Construction, and MEP contractors, introduced hosting/cloud services, and focused on innovative software solutions for digital markets.',
      image: '/about/',
    },
  ];

  const whyChooseUs = [
    { title: 'Expert Team', description: 'Our dedicated professionals leverage cutting-edge technologies to fuel your business success.', icon: '/about/expert-team.png' },
    { title: 'Client-Centric Service', description: 'Tailored solutions designed to ensure your complete satisfaction and business growth.', icon: '/about/client-service.png' },
    { title: 'Reliable Support', description: '24/7 expert support to resolve your IT challenges swiftly and effectively.', icon: '/about/reliable-support.png' },
    { title: 'Premium Quality', description: 'Delivering innovative solutions with unmatched performance and value.', icon: '/about/premium-quality.png' },
  ];

  const values = [
    { title: 'Commitment', description: 'Transparent solutions with clear pricing and dependable delivery.', icon: '/about/commitment.png' },
    { title: 'Community', description: 'Building a positive workplace and supporting ethical initiatives.', icon: '/about/community.png' },
    { title: 'Innovation', description: 'Pioneering creative solutions with the latest technologies.', icon: '/about/innovation.png' },
    { title: 'Excellence', description: 'Striving for outstanding quality in every project we undertake.', icon: '/about/excellence.png' },
  ];

  const techExpertise = [
    { title: 'Frontend Development', description: 'Crafting responsive, intuitive interfaces using React and Next.js.', icon: '/about/frontend-development.png' },
    { title: 'Backend Development', description: 'Building secure, scalable server-side solutions with Node.js.', icon: '/about/backend-development.png' },
    { title: 'Cloud Solutions', description: 'Deploying robust applications on AWS and Azure for scalability.', icon: '/about/cloud-solutions.png' },
    { title: 'ERP, BDM, Mobile Apps', description: 'Created mobile apps and ERP systems like Payroll & Smart BDM.', icon: '/about/systems.png' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardHover = {
    hover: { 
      scale: 1.03, 
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 } 
    },
  };

  const iconShake = {
    hover: {
      x: [0, -4, 4, -4, 4, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-center relative"
      >
        <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
          <Image
            src="/about/about-hero.jpg"
            alt="Tej IT Solutions"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">About Tej IT Solutions</h1>
              <p className="text-lg text-white max-w-3xl mx-auto">
                Pioneering IT solutions since 2015, we empower businesses with innovative software and services.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16"
      >
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6 text-center text-gray-800">
          Why Choose Us
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
          Discover how we transform businesses with innovative, tailored solutions that drive efficiency and growth.
        </motion.p>
        <div className="grid md:grid-cols-4 gap-6">
          {whyChooseUs.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover="hover"
              custom={cardHover}
              className="relative p-6 bg-white rounded-xl border-2 border-transparent bg-clip-padding hover:border-gradient-to-r from-green-500 via-blue-500 to-green-500"
            >
              <motion.div whileHover="hover" variants={iconShake}>
                <Image
                  src={item.icon}
                  alt={`${item.title} Icon`}
                  width={48}
                  height={48}
                  className="mx-auto mb-4"
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission, Vision, and Values */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16"
      >
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6 text-center text-gray-800">
          Our Mission, Vision, and Values
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {['Mission', 'Vision'].map((section) => (
            <motion.div
              key={section}
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
              className="p-6 bg-white rounded-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{section}</h3>
              <p className="text-gray-600">
                {section === 'Mission' ? (
                  'To empower businesses with transformative digital solutions that streamline operations, boost efficiency, and unlock new growth opportunities. We leverage cutting-edge technologies like React, Next.js, and cloud platforms to create automated, future-proof systems that propel your business forward.'
                ) : (
                  'To be the catalyst for digital innovation—constantly pushing boundaries, embracing emerging technologies, and developing scalable products that deliver superior experiences across mobile and enterprise platforms. We envision a world where technology elevates human potential and business success.'
                )}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.h3 variants={fadeInUp} className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Our Core Values
        </motion.h3>
        <div className="grid md:grid-cols-4 gap-6">
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              whileHover="hover"
              custom={cardHover}
              className="p-6 bg-white rounded-xl text-center relative"
            >
              <motion.div whileHover="hover" variants={iconShake}>
                <Image
                  src={value.icon}
                  alt={`${value.title} Icon`}
                  width={48}
                  height={48}
                  className="mx-auto mb-4"
                />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technical Expertise */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16"
      >
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6 text-center text-gray-800">
          Our Technical Expertise
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
          <motion.div variants={itemVariants} className="p-6">
            <p className="text-gray-600 mb-4">
              We specialize in modern technologies to deliver scalable, high-performance solutions:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2 text-green-600">•</span> Frontend: React, Next.js, TypeScript, Angular for dynamic, responsive interfaces.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">•</span> Backend: Node.js, Express, Laravel, Python for secure, scalable APIs.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-orange-500">•</span> Cloud: AWS, Azure for robust hosting and compute services.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">•</span> Mobile: Native and cross-platform iOS/Android apps.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-600">•</span> ERP & CRM: Custom solutions like Tej Payroll and Smart Class.
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              Our products, like Tej Smart BDM and Tej Smart ERP, drive efficiency and innovation across industries.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="relative rounded-xl overflow-hidden"
            style={{ height: '350px' }}
          >
            <Image
              src="/about/tech-expertise2.jpg"
              alt="Technical Expertise"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/30 to-transparent"></div>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {techExpertise.map((tech) => (
            <motion.div
              key={tech.title}
              variants={itemVariants}
              whileHover="hover"
              custom={cardHover}
              className="p-6 bg-white rounded-xl text-center"
            >
              <motion.div whileHover="hover" variants={iconShake}>
                <Image
                  src={tech.icon}
                  alt={`${tech.title} Icon`}
                  width={48}
                  height={48}
                  className="mx-auto mb-4"
                />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{tech.title}</h3>
              <p className="text-gray-600 text-sm">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Culture and Commitment */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16"
      >
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6 text-center text-gray-800">
          Our Culture and Commitment
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
            <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <motion.div whileHover="hover" variants={iconShake}>
                <Image src="/about/chat.png" alt="Culture Icon" width={32} height={32} className="mr-3" />
              </motion.div>
              Our Culture
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2 text-green-600">✓</span> Clear communication for effective solutions.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">✓</span> Creative professionals driving innovation.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-orange-500">✓</span> Creative professionals driving innovation.
              </li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>
            <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <motion.div whileHover="hover" variants={iconShake}>
                <Image src="/about/culture.png" alt="Commitment Icon" width={32} height={32} className="mr-3" />
              </motion.div>
              Our Commitment
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2 text-orange-500">✓</span> Tailored technology solutions for your needs.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✓</span> Empathy in understanding your business challenges.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-600">✓</span> Reliable 24/7 IT support when you need it.
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Our History */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center text-text">
          Our History
        </motion.h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-600 to-blue-600"></div>
          {historyTimeline.map((item, index) => (
            <motion.div
              key={item.period}
              variants={itemVariants}
              className={`mb-8 flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
            >
              <div className="w-1/2 px-4">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  <h3 className="text-xl font-semibold mb-2">{item.period}</h3>
                  <p className="text-text">{item.description}</p>
                </motion.div>
              </div>
              <div className="w-1/2 px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  <Image
                    src={item.image}
                    alt={`History ${item.period}`}
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center py-12 bg-white rounded-xl"
      >
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4 text-gray-800">
          Ready to Transform Your Business?
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-green-500 via-blue-500 to-green-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Now
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}