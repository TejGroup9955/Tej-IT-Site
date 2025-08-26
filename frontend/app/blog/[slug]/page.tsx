'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blog-detail.module.css';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Fetch blog
    fetch(`http://10.10.50.93:5000/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => setBlog(data))
      .catch(err => console.error('Error fetching blog:', err));
  }, [slug]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!blog) return <div>Loading...</div>;

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

      <main className={styles.main}>
        <h1>{blog.title}</h1>
        <p className={styles.meta}>
          Posted on: {new Date(blog.date).toLocaleDateString()} | Category: {blog.category}
        </p>
        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title}
            width={800}
            height={400}
            className={styles.featuredImage}
          />
        )}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: blog.content }} />
        <div className={styles.socialShare}>
          <a href={`https://www.linkedin.com/shareArticle?url=http://10.10.50.93:3001/blog/${blog.slug}`} target="_blank">Share on LinkedIn</a>
          <a href={`https://twitter.com/intent/tweet?url=http://10.10.50.93:3001/blog/${blog.slug}`} target="_blank">Share on Twitter</a>
        </div>
      </main>

      <aside className={styles.sidebar}>
        <h3>Related Posts</h3>
        {/* Fetch related posts based on category */}
        <p><Link href="/blog">View All Blogs</Link></p>
        <h3>Categories</h3>
        <ul>
          <li><Link href="/blog?category=General">General</Link></li>
          <li><Link href="/blog?category=ERP">ERP</Link></li>
          <li><Link href="/blog?category=BDM">BDM</Link></li>
          <li><Link href="/blog?category=Payroll">Payroll</Link></li>
          <li><Link href="/blog?category=Cloud Services">Cloud Services</Link></li>
        </ul>
        <p><Link href="/contact">Request a Demo</Link></p>
      </aside>
    </div>
  );
}