'use client';
     import { useState, useEffect } from 'react';
     import { useParams } from 'next/navigation';
     import axios from 'axios';
     import { motion } from 'framer-motion';
     import Image from 'next/image';

     export default function BlogDetailPage() {
         const { slug } = useParams();
         const [blog, setBlog] = useState(null);
         const [loading, setLoading] = useState(true);

         useEffect(() => {
             const fetchBlog = async () => {
                 try {
                     const response = await axios.get(`http://localhost:5000/api/blogs/${slug}`);
                     setBlog(response.data);
                     setLoading(false);
                 } catch (error) {
                     console.error('Error fetching blog:', error);
                     setLoading(false);
                 }
             };
             fetchBlog();
         }, [slug]);

         if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
         if (!blog) return <div className="min-h-screen flex items-center justify-center">Blog not found</div>;

         return (
             <div className="min-h-screen font-sans text-gray-800 bg-gray-100">
                 <motion.section
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="container mx-auto px-4 py-12"
                 >
                     <div className="bg-white rounded-lg shadow-lg p-6">
                         <div className="relative h-96 mb-6">
                             <Image
                                 src={blog.image}
                                 alt={blog.title}
                                 width={1200}
                                 height={400}
                                 className="object-cover w-full h-full rounded-lg"
                             />
                         </div>
                         <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                         <p className="text-sm text-gray-600 mb-4">Category: {blog.category} | Date: {blog.date}</p>
                         <p className="text-lg text-gray-700 mb-6">{blog.excerpt}</p>
                         <div className="prose max-w-none">{blog.content}</div>
                     </div>
                 </motion.section>
             </div>
         );
     }