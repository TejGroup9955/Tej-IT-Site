'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Rocket, Briefcase, BookOpen, Users, Clock, Trophy, PartyPopper, Mail, User, Phone, MapPin, GraduationCap, Code, FileText, Send, X } from 'lucide-react';

// Component for individual job card
function JobCard({ job, onApply }: { job: { id: number; title: string; description: string; location: string; type: string }, onApply: (jobId: number) => void }) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const card3DVariants = {
    rest: { rotateX: 0, rotateY: 0, scale: 1, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / rect.height) * 20;
    const rotateY = (mouseX / rect.width) * 20;
    setTransform({ rotateX, rotateY });
  };

  return (
    <motion.div
      variants={card3DVariants}
      initial="rest"
      whileHover="hover"
      animate={{ ...card3DVariants.rest, rotateX: transform.rotateX, rotateY: transform.rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform({ rotateX: 0, rotateY: 0 })}
      className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col text-left h-full transition-all duration-300"
      style={{ perspective: 1000 }}
    >
      <Briefcase className="w-8 h-8 text-purple-600 mb-4" />
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h4>
      <p className="text-gray-600 text-sm mb-2">{job.description}</p>
      <p className="text-gray-500 text-sm mb-2">📍 {job.location}</p>
      <p className="text-gray-500 text-sm mb-4">💼 {job.type}</p>
      <motion.button
        className="inline-block bg-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-700 transition-all duration-300"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.1, backgroundColor: '#9333ea', transition: { type: 'spring', stiffness: 400, damping: 15 } },
          tap: { scale: 0.98 },
        }}
        whileHover="hover"
        whileTap="tap"
        onClick={() => onApply(job.id)}
      >
        Apply Now
      </motion.button>
    </motion.div>
  );
}

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    job_id: '',
    name: '',
    email: '',
    phone: '',
    permanent_address: '',
    current_location: '',
    highest_education: '',
    skills: '',
    resume: null as File | null,
  });
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setShowStickyCta(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);

    // Fetch job openings from backend
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://10.10.50.93:5000/api/job-openings');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApplyClick = (jobId: number) => {
    setSelectedJobId(jobId);
    setFormData((prev) => ({ ...prev, job_id: jobId.toString() }));
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage('');

    // Validate required fields
    if (!formData.job_id || !formData.name || !formData.email) {
      setFormMessage('Please fill in all required fields (Job, Name, Email).');
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'resume' && value) {
        form.append(key, value);
      } else if (value) {
        form.append(key, value.toString());
      }
    });

    try {
      const response = await fetch('http://10.10.50.93:5000/api/submit-application', {
        method: 'POST',
        body: form,
      });
      const data = await response.json();
      if (data.success) {
        setFormMessage('Application submitted successfully!');
        setFormData({
          job_id: selectedJobId?.toString() || '',
          name: '',
          email: '',
          phone: '',
          permanent_address: '',
          current_location: '',
          highest_education: '',
          skills: '',
          resume: null,
        });
        setTimeout(() => setShowModal(false), 2000);
      } else {
        setFormMessage('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setFormMessage('An error occurred. Please try again.');
    }
  };

  const whyWorkWithUs = [
    { title: 'Exciting Projects', description: 'Work on ERP, Web, Cloud, and Mobile apps for global clients', icon: Briefcase },
    { title: 'Continuous Learning', description: 'Training, certifications, and upskilling opportunities', icon: BookOpen },
    { title: 'Collaborative Culture', description: 'Open, supportive, and innovation-driven', icon: Users },
    { title: 'Work-Life Balance', description: 'Flexible hours and hybrid opportunities', icon: Clock },
    { title: 'Career Growth', description: 'Clear career paths, mentorship, and leadership opportunities', icon: Rocket },
  ];

  const lifeAtTej = [
    { title: 'Hackathons, Team Outings, Knowledge-Sharing', description: 'Engage in fun and innovative events', icon: PartyPopper },
    { title: 'Recognition & Rewards', description: 'Celebrating outstanding contributions', icon: Trophy },
    { title: 'Flat Hierarchy', description: 'Your voice matters in our open culture', icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', bounce: 0.4 } },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, backgroundColor: '#9333ea', transition: { type: 'spring', stiffness: 400, damping: 15 } },
    tap: { scale: 0.98 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen font-sans text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative py-28 md:py-36 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        <div className="absolute inset-0">
          <Image
            src="/it-services/web-hero.jpg"
            alt="Careers Hero"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-black mb-6 drop-shadow-lg"
          >
            🚀 Careers at Tej IT
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
          >
            Join a team where innovation, growth, and creativity meet. At Tej IT, we don’t just build technology — we build people, careers, and futures.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.button
              className="inline-block bg-purple-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleApplyClick(0)}
            >
              View Openings
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Work With Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12"
          >
            🌟 Why Work With Us?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyWorkWithUs.map((item) => {
              const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
              return (
                <motion.div
                  key={item.title}
                  variants={{
                    rest: { rotateX: 0, rotateY: 0, scale: 1, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
                    hover: {
                      scale: 1.05,
                      boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)',
                      transition: { type: 'spring', stiffness: 300, damping: 15 },
                    },
                  }}
                  initial="rest"
                  whileHover="hover"
                  animate={{ rotateX: transform.rotateX, rotateY: transform.rotateY }}
                  onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const mouseX = e.clientX - centerX;
                    const mouseY = e.clientY - centerY;
                    const rotateX = (mouseY / rect.height) * 20;
                    const rotateY = (mouseX / rect.width) * 20;
                    setTransform({ rotateX, rotateY });
                  }}
                  onMouseLeave={() => setTransform({ rotateX: 0, rotateY: 0 })}
                  className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300"
                  style={{ perspective: 1000 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <item.icon className="w-12 h-12 text-purple-600 mb-4" />
                  </motion.div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Life at Tej IT Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12"
          >
            👨‍💻 Life at Tej IT
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lifeAtTej.map((item) => {
              const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
              return (
                <motion.div
                  key={item.title}
                  variants={{
                    rest: { rotateX: 0, rotateY: 0, scale: 1, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
                    hover: {
                      scale: 1.05,
                      boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)',
                      transition: { type: 'spring', stiffness: 300, damping: 15 },
                    },
                  }}
                  initial="rest"
                  whileHover="hover"
                  animate={{ rotateX: transform.rotateX, rotateY: transform.rotateY }}
                  onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const mouseX = e.clientX - centerX;
                    const mouseY = e.clientY - centerY;
                    const rotateX = (mouseY / rect.height) * 20;
                    const rotateY = (mouseX / rect.width) * 20;
                    setTransform({ rotateX, rotateY });
                  }}
                  onMouseLeave={() => setTransform({ rotateX: 0, rotateY: 0 })}
                  className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300"
                  style={{ perspective: 1000 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <item.icon className="w-12 h-12 text-purple-600 mb-4" />
                  </motion.div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Job Openings Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12"
          >
            💼 Current Openings
          </motion.h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-600">No job openings available at the moment. Check back later!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job: any) => (
                <JobCard key={job.id} job={job} onApply={handleApplyClick} />
              ))}
            </div>
          )}
        </div>
      </motion.section>
      
      {/* Application Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Apply for a Position</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Briefcase className="w-5 h-5" /> Job Position
                </label>
                <select
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                >
                  <option value="" disabled>Select a job</option>
                  {jobs.map((job: any) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <User className="w-5 h-5" /> Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Mail className="w-5 h-5" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Phone className="w-5 h-5" /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MapPin className="w-5 h-5" /> Permanent Address
                </label>
                <textarea
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MapPin className="w-5 h-5" /> Current Location
                </label>
                <input
                  type="text"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <GraduationCap className="w-5 h-5" /> Highest Education
                </label>
                <input
                  type="text"
                  name="highest_education"
                  value={formData.highest_education}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., B.Tech, MBA"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Code className="w-5 h-5" /> Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., JavaScript, Python, React"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FileText className="w-5 h-5" /> Resume (PDF)
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  accept=".pdf"
                />
              </div>
              {formMessage && (
                <div className={`mb-4 text-center ${formMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {formMessage}
                </div>
              )}
              <motion.button
                type="submit"
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Send className="w-5 h-5" />
                Submit Application
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}