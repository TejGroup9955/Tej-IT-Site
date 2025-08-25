'use client';
     import { useState, useEffect } from 'react';
     import axios from 'axios';
     import { motion } from 'framer-motion';
     import { Book, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
     import Link from 'next/link';

     const categories = ['ERP', 'BDM', 'Payroll', 'Cloud Services'];

     export default function AdminBlogPage() {
         const [blogs, setBlogs] = useState([]);
         const [formData, setFormData] = useState({
             title: '', category: 'ERP', date: '', excerpt: '', image: '', slug: '', content: '', priority: 0, is_enabled: true
         });
         const [editingSlug, setEditingSlug] = useState(null);

         useEffect(() => {
             fetchBlogs();
         }, []);

         const fetchBlogs = async () => {
             try {
                 const response = await axios.get('http://localhost:5000/api/blogs');
                 setBlogs(response.data);
             } catch (error) {
                 console.error('Error fetching blogs:', error);
             }
         };

         const handleInputChange = (e) => {
             const { name, value, type, checked } = e.target;
             setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
         };

         const handleSubmit = async (e) => {
             e.preventDefault();
             try {
                 if (editingSlug) {
                     await axios.put(`http://localhost:5000/api/blogs/${editingSlug}`, formData);
                 } else {
                     await axios.post('http://localhost:5000/api/blogs', formData);
                 }
                 fetchBlogs();
                 resetForm();
             } catch (error) {
                 console.error('Error saving blog:', error);
             }
         };

         const handleEdit = (blog) => {
             setFormData(blog);
             setEditingSlug(blog.slug);
         };

         const handleDelete = async (slug) => {
             if (confirm('Are you sure you want to delete this blog?')) {
                 try {
                     await axios.delete(`http://localhost:5000/api/blogs/${slug}`);
                     fetchBlogs();
                 } catch (error) {
                     console.error('Error deleting blog:', error);
                 }
             }
         };

         const toggleEnable = async (slug, is_enabled) => {
             try {
                 await axios.put(`http://localhost:5000/api/blogs/${slug}`, { ...blogs.find(b => b.slug === slug), is_enabled: !is_enabled });
                 fetchBlogs();
             } catch (error) {
                 console.error('Error toggling blog status:', error);
             }
         };

         const resetForm = () => {
             setFormData({ title: '', category: 'ERP', date: '', excerpt: '', image: '', slug: '', content: '', priority: 0, is_enabled: true });
             setEditingSlug(null);
         };

         return (
             <div className="min-h-screen font-sans text-gray-800 bg-gray-100 p-6">
                 <motion.h1
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-4xl font-bold mb-8 text-center"
                 >
                     Blog Admin Panel
                 </motion.h1>

                 {/* Blog Form */}
                 <motion.section
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-12"
                 >
                     <h2 className="text-2xl font-semibold mb-4">{editingSlug ? 'Edit Blog' : 'Add New Blog'}</h2>
                     <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                             <label className="block text-sm font-medium">Title</label>
                             <input
                                 type="text"
                                 name="title"
                                 value={formData.title}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Category</label>
                             <select
                                 name="category"
                                 value={formData.category}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded"
                                 required
                             >
                                 {categories.map(cat => (
                                     <option key={cat} value={cat}>{cat}</option>
                                 ))}
                             </select>
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Date</label>
                             <input
                                 type="date"
                                 name="date"
                                 value={formData.date}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Excerpt</label>
                             <textarea
                                 name="excerpt"
                                 value={formData.excerpt}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Image URL</label>
                             <input
                                 type="text"
                                 name="image"
                                 value={formData.image}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Slug</label>
                             <input
                                 type="text"
                                 name="slug"
                                 value={formData.slug}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Content</label>
                             <textarea
                                 name="content"
                                 value={formData.content}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded h-32"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Priority</label>
                             <input
                                 type="number"
                                 name="priority"
                                 value={formData.priority}
                                 onChange={handleInputChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <div>
                             <label className="flex items-center space-x-2">
                                 <input
                                     type="checkbox"
                                     name="is_enabled"
                                     checked={formData.is_enabled}
                                     onChange={handleInputChange}
                                     className="h-4 w-4"
                                 />
                                 <span>Enabled</span>
                             </label>
                         </div>
                         <div className="flex space-x-4">
                             <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                                 {editingSlug ? 'Update Blog' : 'Add Blog'}
                             </button>
                             {editingSlug && (
                                 <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                                     Cancel
                                 </button>
                             )}
                         </div>
                     </form>
                 </motion.section>

                 {/* Blog List */}
                 <motion.section
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="max-w-4xl mx-auto"
                 >
                     <h2 className="text-2xl font-semibold mb-4">All Blogs</h2>
                     <div className="space-y-4">
                         {blogs.map(blog => (
                             <div key={blog.slug} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                 <div>
                                     <h3 className="text-lg font-semibold">{blog.title}</h3>
                                     <p className="text-sm text-gray-600">Category: {blog.category} | Priority: {blog.priority} | {blog.is_enabled ? 'Enabled' : 'Disabled'}</p>
                                 </div>
                                 <div className="flex space-x-2">
                                     <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-800">
                                         <Edit className="w-5 h-5" />
                                     </button>
                                     <button onClick={() => handleDelete(blog.slug)} className="text-red-600 hover:text-red-800">
                                         <Trash2 className="w-5 h-5" />
                                     </button>
                                     <button onClick={() => toggleEnable(blog.slug, blog.is_enabled)} className="text-gray-600 hover:text-gray-800">
                                         {blog.is_enabled ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </motion.section>
             </div>
         );
     }