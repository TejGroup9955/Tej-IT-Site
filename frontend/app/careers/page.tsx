'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Rocket, Briefcase, BookOpen, Users, Clock, Trophy, PartyPopper, Mail, User, Phone, MapPin, GraduationCap, Code, FileText, Send, X, Filter, Search, Star } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  department: string;
  posted_date: string;
}

interface Testimonial {
  id: number;
  employee_name: string;
  job_role: string;
  feedback: string;
  rating?: number;
}

interface Department {
  id: number;
  name: string;
}

// Component for individual job card
function JobCard({ job, onApply, onViewDetails }: { job: Job; onApply: (jobId: number) => void; onViewDetails: (job: Job) => void }) {
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
      <div className="flex items-center justify-between mb-4">
        <Briefcase className="w-8 h-8 text-purple-600" />
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
          {job.department || 'General'}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h4>
      <div className="text-sm text-gray-600 mb-4 flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Clock className="w-4 h-4" />
          {job.type}
        </div>
        <p className="text-gray-500 text-xs">
          Posted: {new Date(job.posted_date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2 mt-auto">
        <motion.button
          className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails(job)}
        >
          Read More
        </motion.button>
        <motion.button
          className="flex-1 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300"
          whileHover={{ scale: 1.02, backgroundColor: '#9333ea' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onApply(job.id)}
        >
          Apply Now
        </motion.button>
      </div>
    </motion.div>
  );
}

// Component for testimonial card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / rect.height) * 10;
    const rotateY = (mouseX / rect.width) * 10;
    setTransform({ rotateX, rotateY });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(147, 51, 234, 0.2)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform({ rotateX: 0, rotateY: 0 })}
      style={{ 
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        perspective: 1000 
      }}
      className="bg-white p-6 rounded-xl border border-gray-200 transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
          <User className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{testimonial.employee_name}</h4>
          <p className="text-sm text-gray-600">{testimonial.job_role}</p>
        </div>
      </div>
      {testimonial.rating && (
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < testimonial.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      )}
      <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
    </motion.div>
  );
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    department: 'All',
    location: 'All',
    search: ''
  });
  
  const [formData, setFormData] = useState({
    job_id: '',
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
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const jobsResponse = await fetch('http://10.10.50.93:5000/api/job-openings');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
        }

        // Fetch testimonials
        const testimonialsResponse = await fetch('http://10.10.50.93:5000/api/testimonials');
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData.filter((t: any) => t.is_enabled));
        }

        // Fetch departments
        const deptResponse = await fetch('http://10.10.50.93:5000/api/departments');
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          setDepartments(deptData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleApplyClick = (jobId: number) => {
    setSelectedJobId(jobId);
    setFormData((prev) => ({ ...prev, job_id: jobId.toString() }));
    setShowJobDetails(false);
    setShowApplicationModal(true);
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
          cover_letter: '',
          resume: null,
        });
        setTimeout(() => {
          setShowApplicationModal(false);
          setFormMessage('');
        }, 2000);
      } else {
        setFormMessage('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setFormMessage('An error occurred. Please try again.');
    }
  };

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = filters.department === 'All' || job.department === filters.department;
    const matchesLocation = filters.location === 'All' || job.location === filters.location;
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesDepartment && matchesLocation && matchesSearch;
  });

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueDepartments = [...new Set(jobs.map(job => job.department))];

  const whyWorkWithUs = [
    { title: 'Exciting Projects', description: 'Work on ERP, Web, Cloud, and Mobile apps for global clients', icon: Briefcase },
    { title: 'Continuous Learning', description: 'Training, certifications, and upskilling opportunities', icon: BookOpen },
    { title: 'Collaborative Culture', description: 'Open, supportive, and innovation-driven environment', icon: Users },
    { title: 'Work-Life Balance', description: 'Flexible hours and hybrid work opportunities', icon: Clock },
    { title: 'Career Growth', description: 'Clear career paths, mentorship, and leadership opportunities', icon: Rocket },
  ];

  const lifeAtTej = [
    { title: 'Hackathons & Innovation', description: 'Regular hackathons and innovation challenges', icon: PartyPopper },
    { title: 'Recognition & Rewards', description: 'Celebrating outstanding contributions and achievements', icon: Trophy },
    { title: 'Flat Hierarchy', description: 'Your voice matters in our open and collaborative culture', icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', bounce: 0.4 } },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
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
          <img
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
            alt="Professional Team"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-black mb-6 drop-shadow-lg"
          >
            Join Our Team
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            Be part of a dynamic IT company shaping the future of Cloud, DevOps, AI, Full-stack Development, 
            Data Analytics, Cybersecurity, Mobile App Development, and more.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.button
              className="inline-block bg-purple-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
              whileHover={{ scale: 1.05, backgroundColor: '#9333ea' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('job-openings')?.scrollIntoView({ behavior: 'smooth' })}
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
            Why Work With Us?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyWorkWithUs.map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 8, delay: index * 0.5 }}
                >
                  <item.icon className="w-12 h-12 text-purple-600 mb-4" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Employee Testimonials Section */}
      {testimonials.length > 0 && (
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
              Life at Tej IT
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((testimonial) => (
                <motion.div key={testimonial.id} variants={itemVariants}>
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Company Culture Section */}
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
            Our Culture
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lifeAtTej.map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 10, delay: index * 0.7 }}
                >
                  <item.icon className="w-12 h-12 text-purple-600 mb-4" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Job Openings Section */}
      <motion.section
        id="job-openings"
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
            Open Positions
          </motion.h2>
          
          {/* Filters */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow-md mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Filter className="w-4 h-4" /> Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="All">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="All">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Search className="w-4 h-4" /> Search Jobs
                </label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-600 text-lg">
                {jobs.length === 0 
                  ? "No job openings available at the moment. Check back later!" 
                  : "No jobs match your current filters. Try adjusting your search criteria."
                }
              </p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredJobs.map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <JobCard job={job} onApply={handleApplyClick} onViewDetails={handleViewDetails} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowJobDetails(false)}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowJobDetails(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedJob.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {selectedJob.department}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {selectedJob.location}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {selectedJob.type}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Posted: {new Date(selectedJob.posted_date).toLocaleDateString()}
              </p>
            </div>
            <div 
              className="prose max-w-none mb-8 text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedJob.description }}
            />
            <div className="flex gap-4">
              <motion.button
                className="flex-1 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApplyClick(selectedJob.id)}
              >
                <Send className="w-5 h-5" />
                Apply for This Position
              </motion.button>
              <motion.button
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowJobDetails(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Application Modal */}
      {showApplicationModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowApplicationModal(false)}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowApplicationModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Apply for a Position</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Briefcase className="w-5 h-5" /> Job Position *
                  </label>
                  <select
                    name="job_id"
                    value={formData.job_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  >
                    <option value="" disabled>Select a job</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <User className="w-5 h-5" /> Full Name *
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Mail className="w-5 h-5" /> Email *
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
                <div>
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
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MapPin className="w-5 h-5" /> Permanent Address
                </label>
                <textarea
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <GraduationCap className="w-5 h-5" /> Highest Education
                  </label>
                  <select
                    name="highest_education"
                    value={formData.highest_education}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select Education</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Code className="w-5 h-5" /> Skills (comma-separated)
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={3}
                  placeholder="e.g., JavaScript, Python, React, Node.js, AWS, Docker"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FileText className="w-5 h-5" /> Cover Letter (Optional)
                </label>
                <textarea
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FileText className="w-5 h-5" /> Resume (PDF/DOC)
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              {formMessage && (
                <div className={`text-center p-3 rounded-lg ${
                  formMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formMessage}
                </div>
              )}

              <motion.button
                type="submit"
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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