'use client';
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Interfaces for data from backend
interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  status?: string;
  posted_date: string;
  department?: string;
}

interface Testimonial {
  id: number;
  employee_name: string;
  job_role: string;
  feedback: string;
  rating?: number;
  status?: boolean | number;
  created_at?: string;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobPopup, setShowJobPopup] = useState<boolean>(false);
  const [showApplyPopup, setShowApplyPopup] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    permanent_address: '',
    current_location: '',
    highest_education: '',
    skills: '',
    cover_letter: '',
    resume: null as File | null,
  });
  const [formError, setFormError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 5;

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Fetch jobs
      const jobsResponse = await fetch('http://10.10.50.93:5000/api/job-openings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!jobsResponse.ok) {
        console.error('Jobs fetch failed:', jobsResponse.status, jobsResponse.statusText);
        throw new Error(`Failed to fetch jobs: ${jobsResponse.status}`);
      }
      const jobsData = await jobsResponse.json();
      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
      } else {
        console.error('Unexpected job data format:', jobsData);
        setErrorMessage('Unexpected job data format.');
      }

      // Fetch testimonials
      const testimonialsResponse = await fetch('http://10.10.50.93:5000/api/employee_testimonials', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!testimonialsResponse.ok) {
        console.error('Testimonials fetch failed:', testimonialsResponse.status, testimonialsResponse.statusText);
        throw new Error(`Failed to fetch testimonials: ${testimonialsResponse.status}`);
      }
      const testimonialsData = await testimonialsResponse.json();
      console.log('Testimonials raw data:', testimonialsData);
      if (Array.isArray(testimonialsData)) {
        const filteredTestimonials = testimonialsData.filter((t: Testimonial) => t.status === true || t.status === 1);
        console.log('Filtered testimonials:', filteredTestimonials);
        setTestimonials(filteredTestimonials);
      } else {
        console.error('Unexpected testimonial data format:', testimonialsData);
        setErrorMessage('Unexpected testimonial data format.');
      }
    } catch (error: any) {
      console.error('Fetch error:', error.message);
      setErrorMessage(`Failed to load data: ${error.message}.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReadMore = (job: Job) => {
    setSelectedJob(job);
    setShowJobPopup(true);
  };

  const handleApplyNow = (job: Job) => {
    setSelectedJob(job);
    setShowApplyPopup(true);
  };

  const handleClosePopup = () => {
    setShowJobPopup(false);
    setShowApplyPopup(false);
    setSelectedJob(null);
    setFormError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      permanent_address: '',
      current_location: '',
      highest_education: '',
      skills: '',
      cover_letter: '',
      resume: null,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type !== 'application/pdf') {
      setFormError('Please upload a PDF file.');
      return;
    }
    setFormData((prev) => ({ ...prev, resume: file || null }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!formData.name || !formData.email) {
      setFormError('Name and email are required.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('job_id', selectedJob.id.toString());
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('permanent_address', formData.permanent_address);
    formDataToSend.append('current_location', formData.current_location);
    formDataToSend.append('highest_education', formData.highest_education);
    formDataToSend.append('skills', formData.skills);
    formDataToSend.append('cover_letter', formData.cover_letter);
    if (formData.resume) {
      formDataToSend.append('resume', formData.resume);
    }

    try {
      const response = await fetch('http://10.10.50.93:5000/api/submit-application', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to submit application: ${response.status}`);
      }

      alert('Application submitted successfully!');
      handleClosePopup();
    } catch (error: any) {
      setFormError(`Failed to submit application: ${error.message}`);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const paginatedJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Sanitize feedback to prevent rendering issues
  const sanitizeFeedback = (feedback: string) => {
    return feedback.replace(/[^a-zA-Z0-9\s.,!?]/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative bg-gradient-to-r from-blue-900 to-emerald-600 text-white py-24 px-4 text-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/about/about_1.jpg"
            alt="Team Background"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold font-roboto text-white"
          >
            Careers at Tej IT – Join Our Growing Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-white"
          >
            We are always looking for passionate and skilled professionals who want to grow with us. Explore our open roles and apply today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <Link href="#jobs">
              <button className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-8 rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 text-lg font-semibold">
                View Current Openings
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-6 mx-auto max-w-3xl bg-white rounded-2xl shadow-md border border-red-100 my-8"
        >
          <p className="text-red-600 text-lg font-medium">{errorMessage}</p>
          <p className="text-gray-600 text-sm mt-2">Please try again or contact support.</p>
        </motion.div>
      )}

      {/* Job Openings Section */}
      <section id="jobs" className="py-16 px-4 bg-white">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-semibold text-center text-gray-800 font-roboto mb-12"
        >
          Open Positions
        </motion.h2>
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg animate-pulse">Loading job openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-12 bg-gray-50 rounded-2xl shadow-md max-w-2xl mx-auto"
          >
            <p className="text-gray-600 text-lg">No job openings available at the moment. Check back later!</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto space-y-6"
            >
              {paginatedJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 font-roboto">{job.title}</h3>
                    <p className="text-gray-600 mt-3 text-sm md:text-base line-clamp-2">{job.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-500 text-xs px-3 py-1 rounded-full font-medium">
                        {job.location || 'Remote'}
                      </span>
                      <span className="bg-green-100 text-green-500 text-xs px-3 py-1 rounded-full font-medium">
                        {job.type || 'Full-Time'}
                      </span>
                      <span className="bg-purple-100 text-purple-500 text-xs px-3 py-1 rounded-full font-medium">
                        {job.department || 'General'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-4">
                      Posted: {new Date(job.posted_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0 md:ml-6 flex flex-col md:flex-row gap-4">
                    <button
                      onClick={() => handleApplyNow(job)}
                      className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-6 rounded-lg shadow-md hover:from-gray-700 hover:to-gray-900 transition-all duration-300"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => handleReadMore(job)}
                      className="border border-blue-500 text-blue-500 py-2 px-6 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                      Read More
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-300"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    } transition-all duration-300`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Job Details Popup */}
      {showJobPopup && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full h-[90vh] overflow-hidden">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 font-roboto mb-4 text-center">{selectedJob.title}</h2>
            <div className="space-y-4">
              <p>
                <strong>Description:</strong>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      typeof selectedJob.description === 'string'
                        ? selectedJob.description
                        : JSON.stringify(selectedJob.description || ''),
                    ),
                  }}
                />
              </p>
              <p><strong>Location:</strong> {selectedJob.location || 'Remote'}</p>
              <p><strong>Type:</strong> {selectedJob.type || 'Full-Time'}</p>
              <p><strong>Department:</strong> {selectedJob.department || 'General'}</p>
              <p><strong>Posted Date:</strong> {new Date(selectedJob.posted_date).toLocaleDateString()}</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleApplyNow(selectedJob)}
                className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-6 rounded-lg shadow-md hover:from-gray-700 hover:to-gray-900 transition-all duration-300"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Now Popup */}
      {showApplyPopup && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full h-[90vh] overflow-y-auto">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 font-roboto mb-4 text-center">Apply for {selectedJob.title}</h2>
            {formError && (
              <p className="text-red-600 text-sm mb-4 text-center">{formError}</p>
            )}
            <form onSubmit={handleSubmitApplication} encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="current_location" className="block text-sm font-medium text-gray-700">Current Location</label>
                  <input
                    type="text"
                    id="current_location"
                    name="current_location"
                    value={formData.current_location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="permanent_address" className="block text-sm font-medium text-gray-700">Permanent Address</label>
                <textarea
                  id="permanent_address"
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="highest_education" className="block text-sm font-medium text-gray-700">Highest Education</label>
                <input
                  type="text"
                  id="highest_education"
                  name="highest_education"
                  value={formData.highest_education}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700">Cover Letter</label>
                <textarea
                  id="cover_letter"
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-6 rounded-lg shadow-md hover:from-gray-700 hover:to-gray-900 transition-all duration-300"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <style jsx global>{`
          .testimonial-slider .swiper-wrapper {
            align-items: center;
          }
          
          .testimonial-slider .swiper-slide {
            filter: blur(4px);
            opacity: 0.25;
            transform: scale(0.85);
            transition: all 0.5s ease;
            height: auto !important;
          }
          
          .testimonial-slider .swiper-slide-prev,
          .testimonial-slider .swiper-slide-next {
            filter: blur(2px);
            opacity: 0.6;
            transform: scale(0.92);
          }
          
          .testimonial-slider .swiper-slide-active {
            filter: none !important;
            opacity: 1 !important;
            transform: scale(1) !important;
            z-index: 10;
          }
          
          .swiper-button-prev,
          .swiper-button-next {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            width: 56px;
            height: 56px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .swiper-button-prev:hover,
          .swiper-button-next:hover {
            background: white;
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
          }
          
          .swiper-button-prev::after,
          .swiper-button-next::after {
            content: '';
          }
          
          .swiper-pagination-bullet {
            background: #cbd5e1;
            width: 12px;
            height: 12px;
            opacity: 0.5;
            transition: all 0.3s ease;
          }
          
          .swiper-pagination-bullet-active {
            background: linear-gradient(135deg, #4b5563, #6b7280);
            opacity: 1;
            transform: scale(1.3);
          }

          .testimonial-text {
            color: #1f2937 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
        `}</style>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Life at
              </span>{' '}
              <span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Tej IT
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hear from our team about what makes working at Tej IT special
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center">
              <div className="animate-pulse space-y-8">
                <div className="h-12 bg-gray-300 rounded w-96 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-80 bg-gray-200 rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-12 bg-white rounded-2xl shadow-md max-w-2xl mx-auto"
            >
              <p className="text-gray-600 text-lg">No testimonials available at the moment.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="testimonial-slider relative"
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                loop={true}
                centeredSlides={true}
                slidesPerView="auto"
                spaceBetween={40}
                effect="coverflow"
                coverflowEffect={{
                  rotate: 0,
                  stretch: 80,
                  depth: 200,
                  modifier: 1,
                  slideShadows: false,
                }}
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  nextEl: '.testimonial-next',
                  prevEl: '.testimonial-prev',
                }}
                pagination={{
                  el: '.testimonial-pagination',
                  clickable: true,
                }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 1.2, spaceBetween: 25 },
                  768: { slidesPerView: 1.5, spaceBetween: 30 },
                  1024: { slidesPerView: 2.2, spaceBetween: 35 },
                  1280: { slidesPerView: 2.5, spaceBetween: 40 },
                }}
                className="!pb-20"
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={testimonial.id || index} style={{ width: '420px', height: 'auto' }}>
                    <div className="bg-white p-6 rounded-3xl shadow-xl h-full flex flex-col justify-between relative min-h-[300px] border border-gray-100/50 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/40 rounded-3xl" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="text-center">
                          <p className="font-bold text-gray-800 text-lg testimonial-text">{testimonial.employee_name}</p>
                          <p className="text-sm text-gray-600 font-medium testimonial-text mt-2">{testimonial.job_role}</p>
                          {testimonial.rating !== undefined && (
                            <div className="flex justify-center mt-2 mb-4">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${i < testimonial.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.315 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed italic flex-grow font-medium testimonial-text mt-4 line-clamp-4">
                          "{sanitizeFeedback(testimonial.feedback)}"
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="testimonial-prev swiper-button-prev flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </div>
              <div className="testimonial-next swiper-button-next flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </div>
              {/* <div className="testimonial-pagination swiper-pagination" /> */}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CareersPage;