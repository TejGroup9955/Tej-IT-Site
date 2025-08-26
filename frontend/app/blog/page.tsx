'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blog.module.css';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Fetch blogs
    fetch(`http://10.10.50.93:5000/api/blogs?category=${category}`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Error fetching blogs:', err));
  }, [category]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetch(`http://10.10.50.93:5000/api/blogs?category=${category}`)
      .then(res => res.json())
      .then(data => {
        const filteredBlogs = data.filter(blog =>
          blog.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          blog.content.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setBlogs(filteredBlogs);
      })
      .catch(err => console.error('Error searching blogs:', err));
  };

  const topBlogs = blogs.filter(blog => blog.priority > 0).slice(0, 3);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </nav>
      </header>

      <section className={styles.hero}>
        <h1>Tej IT Solutions Blog</h1>
      </section>

      <section className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="ERP">ERP</option>
          <option value="BDM">BDM</option>
          <option value="Payroll">Payroll</option>
          <option value="Cloud Services">Cloud Services</option>
        </select>
      </section>

      <section className={styles.topBlogs}>
        <h2>Top Blogs</h2>
        <div className={styles.blogGrid}>
          {topBlogs.map(blog => (
            <div key={blog.id} className={styles.blogCard}>
              <Image
                src={blog.image || '/placeholder.jpg'}
                alt={blog.title}
                width={300}
                height={200}
                className={styles.blogImage}
              />
              <h3><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
              <p>{blog.excerpt}</p>
              <p className={styles.meta}>Posted on: {new Date(blog.date).toLocaleDateString()} | Category: {blog.category}</p>
              <Link href={`/blog/${blog.slug}`} className={styles.readMore}>Read More</Link>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.allBlogs}>
        <h2>All Blogs</h2>
        <div className={styles.blogGrid}>
          {blogs.map(blog => (
            <div key={blog.id} className={styles.blogCard}>
              <Image
                src={blog.image || '/placeholder.jpg'}
                alt={blog.title}
                width={300}
                height={200}
                className={styles.blogImage}
              />
              <h3><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
              <p>{blog.excerpt}</p>
              <p className={styles.meta}>Posted on: {new Date(blog.date).toLocaleDateString()} | Category: {blog.category}</p>
              <Link href={`/blog/${blog.slug}`} className={styles.readMore}>Read More</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}