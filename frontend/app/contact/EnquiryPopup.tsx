'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function EnquiryPopup() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [delay, setDelay] = useState(5000); // Initial delay of 5 seconds

   useEffect(() => {
    const hasSubmitted = localStorage.getItem('hasSubmittedEnquiry');
    if (!hasSubmitted && !pathname?.toLowerCase().startsWith('/contact')) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setDelay(10000000000000); // subsequent delay
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, pathname]);

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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.7, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 50 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full h-[400px] mx-4 relative" 
            onClick={(e) => e.stopPropagation()}
            >
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
                <X size={20} /> {/* smaller close icon */}
            </button>

            <h2 className="text-xl font-bold mb-4 text-text text-center">
                Submit Your Enquiry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-2 border border-gray-300 rounded text-sm"
                required
                />
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-2 border border-gray-300 rounded text-sm"
                required
                />
                <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone"
                className="w-full p-2 border border-gray-300 rounded text-sm"
                pattern="[0-9]*"
                inputMode="numeric"
                required
                />
                <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full p-2 border border-gray-300 rounded h-24 text-sm"
                required
                />
                <motion.button
                variants={{ hover: { scale: 1.05 } }}
                whileHover="hover"
                type="submit"
                className="w-auto mx-auto block bg-primary text-primary-foreground px-3 py-2 text-sm rounded hover:bg-secondary transition"
                >
                Submit
                </motion.button>
                {submitStatus && (
                <p
                    className={`text-center text-sm ${
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