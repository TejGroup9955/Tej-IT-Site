'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function EnquiryPopup() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const maxAttempts = 3;
  const delays = [5000, 15000, 30000]; // 5s, 15s, 30s
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('hasSubmittedEnquiry');
    const sessionAttempt = sessionStorage.getItem('enquiryAttempts');
    const initialAttempt = sessionAttempt ? parseInt(sessionAttempt, 10) : 0;
    setAttempt(initialAttempt);

    if (!hasSubmitted && !pathname?.toLowerCase().startsWith('/contact') && initialAttempt < maxAttempts) {
      scheduleShow();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname]); // Re-run on pathname change

  const scheduleShow = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
      setAttempt((prev) => {
        const newAttempt = prev + 1;
        sessionStorage.setItem('enquiryAttempts', newAttempt.toString());
        return newAttempt;
      });
    }, delays[attempt]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://10.10.50.93:5000/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus('Enquiry submitted successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
        localStorage.setItem('hasSubmittedEnquiry', 'true');
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus(`Failed to submit enquiry. Status: ${response.status}`);
      }
    } catch (error) {
      setSubmitStatus('An error occurred. Please try again later.');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSubmitStatus(null);
    const hasSubmitted = localStorage.getItem('hasSubmittedEnquiry');
    if (!hasSubmitted && attempt < maxAttempts) {
      scheduleShow();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden border border-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-extrabold mb-6 text-blue-800 text-center tracking-wide">
              Let's Connect – Share Your Thoughts!
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full p-3 pl-10 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full p-3 pl-10 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone"
                  className="w-full p-3 pl-10 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 text-blue-400" size={18} />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className="w-full p-3 pl-10 border border-blue-300 rounded-lg h-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-md"
              >
                Send Your Enquiry
              </motion.button>
              {submitStatus && (
                <p
                  className={`text-center text-sm mt-2 ${
                    submitStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {submitStatus}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}