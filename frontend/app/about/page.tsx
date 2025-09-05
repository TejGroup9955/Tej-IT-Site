'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  const historyTimeline = [
    {
      period: '2008 - 2010',
      description: 'Started as Tej Infotech under Tej Group, digitizing the group’s presence with stand-alone applications replacing traditional paperwork.',
      image: '/about/about_2.jpg',
    },
    {
      period: '2011 - 2013',
      description: 'Automated sales force and inter-departmental coordination, began web and mobile app development, and implemented Bulk SMS services.',
      image: '/about/about_3.jpg',
    },
    {
      period: '2014 - 2015',
      description: 'Incorporated as Tej IT Solutions India Pvt. Ltd., launched E-Pulse Care (hospital software), Tej Smart Class (ERP for institutes), and BDM Smart System (CRM).',
      image: '/about/about_1.jpg',
    },
    {
      period: '2016 - 2018',
      description: 'Launched Tej Payroll System with Android app and biometric integration, and Tej ERP System for contractors. Added mobile apps for Tej Smart Class and GPS tracking for BDM Smart.',
      image: '/about/abt.jpg',
    },
    {
      period: '2019 - Present',
      description: 'Expanded ERP for Electrical, Construction, and MEP contractors, introduced hosting/cloud services, and focused on innovative software solutions for digital markets.',
      image: '/about/about_2.jpg',
    },
  ];

  const whyChooseUs = [
    { title: 'People', description: 'Our smart, dedicated team drives business success with expertise in modern technologies.', icon: '/icons/team.png' },
    { title: 'Customer Service', description: 'Superior service ensuring complete client satisfaction through tailored solutions.', icon: '/icons/headset.png' },
    { title: 'Support', description: 'Trustworthy engineers providing 24/7 support to resolve IT challenges.', icon: '/icons/lifebuoy.png' },
    { title: 'Quality', description: 'Cutting-edge solutions delivering exceptional value and performance.', icon: '/icons/star.png' },
  ];

  const values = [
    { title: 'Commitment', description: 'Transparent solutions with clear pricing and reliable delivery.', icon: '/icons/handshake.png' },
    { title: 'Innovation', description: 'Creative problem-solving with cutting-edge technologies.', icon: '/icons/lightbulb.png' },
    { title: 'Community', description: 'Fostering a positive workplace and ethical initiatives.', icon: '/icons/community.png' },
    { title: 'Excellence', description: 'Delivering exceptional quality in every project.', icon: '/icons/trophy.png' },
  ];

  const techExpertise = [
    { title: 'Frontend Development', description: 'Building responsive, user-friendly interfaces with React and Next.js.', icon: '/icons/react.png' },
    { title: 'Backend Development', description: 'Robust server-side solutions using Node.js and scalable APIs.', icon: '/icons/nodejs.png' },
    { title: 'Cloud Solutions', description: 'Deploying secure, scalable applications on AWS and Azure.', icon: '/icons/aws.png' },
    { title: 'Mobile & ERP', description: 'Developing iOS/Android apps and ERP systems like Tej Payroll and Tej Smart Class.', icon: '/icons/smartphone.png' },
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
    hover: { scale: 1.05, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', transition: { duration: 0.3 } },
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
            src="/about/abt.jpg"
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
                Pioneering IT solutions since 2006, we empower businesses with innovative software and services.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center text-text">
          Why Choose Us
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-text mb-6 text-center max-w-3xl mx-auto">
          We spark business efficiency with tailored solutions, securing your operations and driving growth.
        </motion.p>
        <div className="grid md:grid-cols-4 gap-8">
          {whyChooseUs.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover="hover"
              custom={cardHover}
              className="p-6 bg-card rounded-lg shadow-md text-center"
            >
              <Image
                src={item.icon}
                alt={`${item.title} Icon`}
                width={48}
                height={48}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-text">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      /* Mission, Vision, and Values */
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center text-text">
          Our Mission, Vision, and Values
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-text">
              We consult clients toward digitalized, automated systems to streamline operations using cutting-edge technologies like React, Next.js, and cloud platforms.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p className="text-text">
              Innovate constantly, adapt new technologies, and develop scalable products for superior customer experiences across mobile and enterprise platforms.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Our Values</h3>
            <p className="text-text">
              Commitment, innovation, community, and excellence drive our tailor-made solutions for your business needs.
            </p>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              whileHover="hover"
              custom={cardHover}
              className="p-6 bg-card rounded-lg shadow-md text-center"
            >
              <Image
                src={value.icon}
                alt={`${value.title} Icon`}
                width={48}
                height={48}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-text">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      /* Technical Expertise */
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center text-text">
          Our Technical Expertise
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div variants={itemVariants} className="p-6">
            <p className="text-text mb-4">
              Our team specializes in modern technologies to deliver robust, scalable solutions:
            </p>
            <ul className="list-disc list-inside text-text mb-4">
              <li>Frontend: React, Next.js for responsive, dynamic interfaces.</li>
              <li>Backend: Node.js, Express for secure, scalable APIs.</li>
              <li>Cloud: AWS, Azure for hosting, storage, and compute services.</li>
              <li>Mobile: Native and cross-platform iOS/Android apps.</li>
              <li>ERP & CRM: Custom solutions like Tej Payroll System, Tej Smart Class, and BDM Smart System.</li>
            </ul>
            <p className="text-text">
              Our products, such as E-Pulse Care (hospital management) and Tej ERP System (contractors), leverage these technologies to drive efficiency and innovation.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Image
              src="/about/about_1.jpg"
              alt="Technical Expertise"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </motion.div>
        </div>
        <div className="grid md:grid-cols-4 gap-8 mt-8">
          {techExpertise.map((tech) => (
            <motion.div
              key={tech.title}
              variants={itemVariants}
              whileHover="hover"
              custom={cardHover}
              className="p-6 bg-card rounded-lg shadow-md text-center"
            >
              <Image
                src={tech.icon}
                alt={`${tech.title} Icon`}
                width={48}
                height={48}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
              <p className="text-text">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      /* Culture and Commitment */
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center text-text">
          Our Culture and Commitment
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Our Culture</h3>
            <ul className="list-disc list-inside text-text">
              <li>Clear communication for simple, effective solutions.</li>
              <li>Creative professionals delivering practical innovation.</li>
              <li>Understanding your business story to drive success.</li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Our Commitment</h3>
            <ul className="list-disc list-inside text-text">
              <li>Proactive technology solutions tailored to your needs.</li>
              <li>Empathy as fellow business owners understanding your challenges.</li>
              <li>Reliable 24/7 IT support when you need it.</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      /* History Timeline */
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
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
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

      /* Contact CTA */
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4 text-text">
          Ready to Grow with Us?
        </motion.h2>
        <motion.div variants={itemVariants}>
          <Link href="/contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-secondary transition">
            Get in Touch
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}