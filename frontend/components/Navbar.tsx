'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  {
    name: 'Our Products',
    href: '#',
    dropdown: [
      { name: 'Tej Payroll', href: '/payroll' },
      { name: 'Smart ERP', href: '/erp' },
      { name: 'Smart BDM', href: '/BDM' },
      { name: 'Smart BDM TradeBook', href: '/tradebook' },
    ],
  },
  {
    name: 'IT Services',
    href: '#',
    dropdown: [
      { name: 'Cloud Services', href: '/it-services/cloud-services' },
      { name: 'Software Development', href: '/it-services/software-development' },
      { name: 'Android iOS Development', href: '/it-services/mobile-app-development' },
      { name: 'Web Application Designing & Development', href: '/it-services/web-app-design-development' },
    ],
  },
  { name: 'Blogs', href: '/blog' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact Us', href: '/contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (index: number) => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setDropdownOpen(index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownOpen(null);
    }, 200);
    setDropdownTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [dropdownTimeout]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 p-2 shadow-lg bg-white text-gray-800"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/icons/Tej-IT-logo.png"
            alt="Tej IT Solutions Logo"
            width={100}
            height={32}
            className="object-contain"
          />
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          {navItems.map((item, index) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => item.dropdown && handleMouseEnter(index)}
              onMouseLeave={() => item.dropdown && handleMouseLeave()}
            >
              {item.dropdown ? (
                <div className="cursor-pointer hover:text-secondary transition-colors text-sm">
                  {item.name}
                  {dropdownOpen === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-1 text-sm text-gray-700 hover:bg-secondary hover:text-white"
                          onClick={() => setDropdownOpen(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link href={item.href} className="hover:text-secondary transition-colors text-sm">
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
          </svg>
        </button>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="md:hidden mt-2"
        >
          {navItems.map((item, index) => (
            <div key={item.name}>
              {item.dropdown ? (
                <div>
                  <div
                    className="block py-1 px-4 hover:bg-secondary text-sm"
                    onClick={() => setDropdownOpen(dropdownOpen === index ? null : index)}
                  >
                    {item.name}
                  </div>
                  {dropdownOpen === index && item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block py-1 px-8 hover:bg-secondary text-sm"
                      onClick={() => {
                        setIsOpen(false);
                        setDropdownOpen(null);
                      }}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block py-1 px-4 hover:bg-secondary text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
