'use client';
     import { motion, AnimatePresence } from 'framer-motion';
     import { useState, useEffect } from 'react';
     import Link from 'next/link';
     import Image from 'next/image';
     import { Book, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
     import axios from 'axios';

     const categories = ['All', 'ERP', 'BDM', 'Payroll', 'Cloud Services'];

     export default function BlogPage() {
         const [selectedCategory, setSelectedCategory] = useState('All');
         const [currentPage, setCurrentPage] = useState(1);
         const [blogs, setBlogs] = useState([]);
         const postsPerPage = 9;

        useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`http://10.10.50.93:5000/api/blogs?category=${selectedCategory}`);
                setBlogs(response.data);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
    }, [selectedCategory]);

         const filteredPosts = blogs;
         const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
         const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

         const containerVariants = {
             hidden: { opacity: 0 },
             visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
         };

         const itemVariants = {
             hidden: { opacity: 0, y: 20 },
             visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
         };

         const heroVariants = {
             hidden: { opacity: 0, y: 50 },
             visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
         };

         return (
             <div className="min-h-screen font-sans text-gray-800">
                 {/* Hero Section */}
                 <motion.section
                     initial="hidden"
                     animate="visible"
                     variants={heroVariants}
                     className="relative bg-gradient-to-br from-gray-900 via-teal-900/50 to-gray-800 text-white py-24 overflow-hidden"
                 >
                     <div className="absolute inset-0 bg-[url('/blogs/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
                     <div className="container mx-auto px-4 text-center relative z-10">
                         <motion.h1
                             variants={itemVariants}
                             className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                         >
                             Insights & Innovations
                         </motion.h1>
                         <motion.p
                             variants={itemVariants}
                             className="text-lg md:text-xl max-w-3xl mx-auto mb-6"
                         >
                             Stay updated with the latest trends, strategies, and solutions from Tej IT Solutions.
                         </motion.p>
                         <motion.div variants={itemVariants}>
                             <Link
                                 href="/contact"
                                 className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
                             >
                                 Explore More
                             </Link>
                         </motion.div>
                     </div>
                 </motion.section>

                 {/* Category Filters */}
                 <motion.section
                     initial="hidden"
                     whileInView="visible"
                     viewport={{ once: true }}
                     variants={containerVariants}
                     className="py-12 bg-gray-100"
                 >
                     <div className="container mx-auto px-4">
                         <div className="flex flex-wrap justify-center gap-4 mb-8">
                             {categories.map((category) => (
                                 <motion.button
                                     key={category}
                                     variants={itemVariants}
                                     onClick={() => setSelectedCategory(category)}
                                     className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                         selectedCategory === category
                                             ? 'bg-teal-600 text-white shadow-md'
                                             : 'bg-white text-gray-700 hover:bg-gray-200'
                                     }`}
                                 >
                                     {category}
                                 </motion.button>
                             ))}
                         </div>
                     </div>
                 </motion.section>

                 {/* Blog Listings */}
                 <motion.section
                     initial="hidden"
                     whileInView="visible"
                     viewport={{ once: true }}
                     variants={containerVariants}
                     className="py-16 bg-gray-900 text-white"
                 >
                     <div className="container mx-auto px-4">
                         <motion.h2
                             variants={itemVariants}
                             className="text-4xl font-bold mb-12 text-center"
                         >
                             Latest Articles
                         </motion.h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <AnimatePresence>
                                 {paginatedPosts.map((post) => (
                                     <motion.div
                                         key={post.id}
                                         variants={itemVariants}
                                         initial="hidden"
                                         animate="visible"
                                         exit="hidden"
                                         className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                     >
                                         <div className="relative h-48">
                                             <Image
                                                 src={post.image}
                                                 alt={post.title}
                                                 width={300}
                                                 height={200}
                                                 className="object-cover w-full h-full transition-opacity duration-300 hover:opacity-90"
                                             />
                                         </div>
                                         <div className="p-6">
                                             <span className="text-teal-400 text-sm">{post.category}</span>
                                             <h3 className="text-xl font-semibold mt-2 mb-4">{post.title}</h3>
                                             <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                                             <Link href={`/blog/${post.slug}`} className="text-teal-500 hover:underline font-medium">
                                                 Read More
                                             </Link>
                                         </div>
                                     </motion.div>
                                 ))}
                             </AnimatePresence>
                         </div>
                     </div>
                 </motion.section>

                 {/* Pagination */}
                 <motion.section
                     initial="hidden"
                     whileInView="visible"
                     viewport={{ once: true }}
                     variants={containerVariants}
                     className="py-12 bg-gray-100"
                 >
                     <div className="container mx-auto px-4 text-center">
                         <div className="flex justify-center gap-4">
                             <motion.button
                                 variants={itemVariants}
                                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                 disabled={currentPage === 1}
                                 className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-all duration-300 flex items-center gap-2"
                             >
                                 <ChevronLeft className="w-5 h-5" /> Previous
                             </motion.button>
                             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                 <motion.button
                                     key={page}
                                     variants={itemVariants}
                                     onClick={() => setCurrentPage(page)}
                                     className={`px-4 py-2 rounded-full ${
                                         currentPage === page
                                             ? 'bg-teal-600 text-white'
                                             : 'bg-white text-gray-700 hover:bg-gray-200'
                                     } transition-all duration-300`}
                                 >
                                     {page}
                                 </motion.button>
                             ))}
                             <motion.button
                                 variants={itemVariants}
                                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                 disabled={currentPage === totalPages}
                                 className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-all duration-300 flex items-center gap-2"
                             >
                                 Next <ChevronRight className="w-5 h-5" />
                             </motion.button>
                         </div>
                     </div>
                 </motion.section>
             </div>
         );
     }