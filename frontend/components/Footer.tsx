'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterItem {
  title: string;
  items: { name: string; href: string }[];
  social?: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const footerItems: FooterItem[] = [
  {
    title: 'Contact Us',
    items: [
      { name: 'Pune Office: Office No. 103, "Phoenix", Bund Garden Rd, Opp. Residency Club, Pune, Maharashtra 411001', href: '#' },
      { name: 'Email: info@tejitsolutions.com', href: 'mailto:info@tejitsolutions.com' },
      { name: 'Support: support@tejitsolutions.com', href: 'mailto:support@tejitsolutions.com' },
    ],
  },
  {
    title: 'IT Services',
    items: [
      { name: 'Software Development', href: '/it-services/software-development' },
      { name: 'Mobile Application Development', href: '/it-services/mobile-app-development' },
      { name: 'Web Designing', href: '/it-services/web-designing' },
      { name: 'Cloud Consulting Services', href: '/it-services/cloud-services' },
    ],
  },
  {
    title: 'Products',
    items: [
      { name: 'Contractors ERP', href: '/erp' },
      { name: 'BDM', href: '/BDM' },
      { name: 'Payroll', href: '/payroll' },
      { name: 'Class Management', href: '/class-management' },
    ],
  },
  {
    title: 'Links',
    items: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Contact Us', href: '/contact' },
    ],
    social: [
      { name: 'Facebook', href: 'https://www.facebook.com/me/', icon: Facebook },
      { name: 'Instagram', href: 'https://www.instagram.com/tejit_solutions/?hl=en#', icon: Instagram },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/company/88017062/admin/', icon: Linkedin },
    ],
  },
];

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (index: number) => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setHoveredSection(index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredSection(null);
    }, 200);
    setDropdownTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [dropdownTimeout]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.footer
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-gray-800 text-white py-10 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            {footerItems.map((section, index) => (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="text-center md:text-left relative"
                onMouseEnter={() => index !== 0 && handleMouseEnter(index)} // Exclude Contact Us from hover effect
                onMouseLeave={() => index !== 0 && handleMouseLeave()}
              >
                <h3 className="text-lg font-semibold mb-3 text-teal-400">{section.title}</h3>
                <ul className="text-sm space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      variants={itemVariants}
                      className={`${hoveredSection === index ? 'translate-x-2' : ''} transition-transform duration-200`}
                    >
                      <Link
                        href={item.href}
                        className="hover:text-teal-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                {section.social && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-teal-400">Follow Us</h3>
                    <ul className="flex justify-center md:justify-start space-x-4 text-sm">
                      {section.social.map((social, socialIndex) => (
                        <motion.li
                          key={socialIndex}
                          variants={itemVariants}
                        >
                          <Link
                            href={social.href}
                            className="hover:text-teal-400 transition-colors flex items-center"
                          >
                            <social.icon className="w-5 h-5 mr-1" />
                            {social.name}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
                {index !== 0 && hoveredSection === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-0 w-full h-full bg-teal-400 bg-opacity-10 rounded-md -z-10"
                  />
                )}
              </motion.div>
            ))}
          </div>
          {/* Copyright */}
          <motion.p
            variants={itemVariants}
            className="text-sm text-center mt-6"
          >
            &copy; {new Date().getFullYear()} Tej IT Solutions. All rights reserved.
          </motion.p>
        </div>
      </motion.footer>

<<<<<<< HEAD
      {/* Tawk.to Chat Widget */}
      <Script
        id="tawk-to"
        strategy="lazyOnload"
        src="https://embed.tawk.to/68a30f5da43302192439edc6/1j2uf81tn"
        async
        crossOrigin="anonymous"
        charSet="UTF-8"
      />
=======
>>>>>>> d5691fe (updated it-services pages with careers page with backend)
    </>
  );
}