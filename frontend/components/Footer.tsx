'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
      { 
        name: 'Pune Office: Office No. 103, "Phoenix", Bund Garden Rd, Opp. Residency Club, Pune, Maharashtra 411001', 
        href: 'https://www.google.com/maps/place/Phoenix,+Bund+Garden+Rd,+Opp.+Residency+Club,+Pune,+Maharashtra+411001' 
      },
      { name: 'Email: info@tejitsolutions.com', href: 'mailto:info@tejitsolutions.com' },
      { name: 'Support: support@tejitsolutions.com', href: 'mailto:support@tejitsolutions.com' },
    ],
  },
  {
    title: 'IT Services',
    items: [
      { name: 'Software Development', href: '/it-services/software-development' },
      { name: 'Mobile Application Development', href: '/it-services/mobile-app-development' },
      { name: 'Web Designing', href: '/it-services/web-app-design-development' },
      { name: 'Cloud Consulting Services', href: '/it-services/cloud-services' },
    ],
  },
  {
    title: 'Products',
    items: [
      { name: 'Contractors ERP', href: '/erp' },
      { name: 'BDM', href: '/BDM' },
      { name: 'Payroll', href: '/payroll' },
      { name: 'BDM TradeBook Sales & Purchase', href: '/tradebook' },
    ],
  },
  {
    title: 'Links',
    items: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Careers', href: '/careers' },
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
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gray-800 text-white py-10 shadow-lg relative"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {footerItems.map((section, index) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="text-center md:text-left relative"
              onMouseEnter={() => index !== 0 && handleMouseEnter(index)}
              onMouseLeave={() => index !== 0 && handleMouseLeave()}
            >
              <h3
                className="text-lg font-semibold mb-3 bg-gradient-to-r from-green-400 via-blue-400 to-red-400 bg-clip-text text-transparent"
              >
                {section.title}
              </h3>
              <ul className="text-sm space-y-2">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    variants={itemVariants}
                    className={`${hoveredSection === index ? 'translate-x-2' : ''} transition-transform duration-200`}
                  >
                    <Link
                      href={item.href}
                      className="transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              {section.social && (
                <div className="mt-6">
                  <h3
                    className="text-lg font-semibold mb-3 bg-gradient-to-r from-green-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
                  >
                    Follow Us
                  </h3>
                  <ul className="flex justify-center md:justify-start space-x-4 text-sm">
                    {section.social.map((social, socialIndex) => (
                      <motion.li
                        key={socialIndex}
                        variants={itemVariants}
                        className="group"
                      >
                        <Link
                          href={social.href}
                          className="transition-colors flex items-center"
                        >
                          <motion.div
                            whileHover={{ rotate: [0, -5, 5, -5, 5, 0] }}
                            transition={{ duration: 0.6 }}
                          >
                            <social.icon
                              className="w-5 h-5 mr-1"
                            />
                          </motion.div>
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
                  className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-green-400 via-blue-400 to-red-400 bg-opacity-10 rounded-md -z-10"
                />
              )}
            </motion.div>
          ))}
        </div>
        <motion.p
          variants={itemVariants}
          className="text-sm text-center mt-6"
        >
          &copy; {new Date().getFullYear()} Tej IT Solutions. All rights reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
}
