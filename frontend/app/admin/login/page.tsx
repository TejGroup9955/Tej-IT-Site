'use client';
     import { useState, useEffect } from 'react';
     import { useRouter } from 'next/navigation';
     import axios from 'axios';

     export default function LoginPage() {
         const [credentials, setCredentials] = useState({ username: '', password: '' });
         const router = useRouter();

         const handleChange = (e) => {
             setCredentials({ ...credentials, [e.target.name]: e.target.value });
         };

         const handleLogin = async (e) => {
             e.preventDefault();
             try {
                 const response = await axios.post('http://10.10.50.93:5000/api/login', credentials, {
                     withCredentials: true  // Allow session cookies
                 });
                 if (response.data.message === 'Login successful') {
                     router.push('/admin');
                 }
             } catch (error) {
                 alert('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'));
             }
         };

         // Client-side session check
         useEffect(() => {
             const checkSession = async () => {
                 try {
                     const response = await axios.get('http://10.10.50.93:5000/api/blogs', { withCredentials: true });
                     if (response.status === 200) {
                         router.push('/admin');
                     }
                 } catch (error) {
                     if (error.response?.status !== 401) {
                         console.error('Session check failed:', error);
                     }
                 }
             };
             checkSession();
         }, [router]);

         return (
             <div className="min-h-screen flex items-center justify-center bg-gray-100">
                 <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                     <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
                     <form onSubmit={handleLogin} className="space-y-4">
                         <div>
                             <label className="block text-sm font-medium">Username</label>
                             <input
                                 type="text"
                                 name="username"
                                 value={credentials.username}
                                 onChange={handleChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium">Password</label>
                             <input
                                 type="password"
                                 name="password"
                                 value={credentials.password}
                                 onChange={handleChange}
                                 className="w-full p-2 border rounded"
                                 required
                             />
                         </div>
                         <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">
                             Login
                         </button>
                     </form>
                 </div>
             </div>
         );
     }