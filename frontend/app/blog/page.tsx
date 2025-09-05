'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blog.module.css';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  date: string;
  slug: string;
  priority: number;
  sequence: number;
  category: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch(`http://10.10.50.93:5000/api/blogs?category=${category}`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Error fetching blogs:', err));
  }, [category]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetch(`http://10.10.50.93:5000/api/blogs?category=${category}`)
      .then(res => res.json())
      .then(data => {
        const filteredBlogs = data.filter((blog: Blog) =>
          blog.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          blog.content.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setBlogs(filteredBlogs);
      })
      .catch(err => console.error('Error searching blogs:', err));
  };

  const topBlogs = blogs.filter(blog => blog.priority > 0).sort((a, b) => a.sequence - b.sequence).slice(0, 3);
  const additionalBlogs = blogs.filter(blog => !blog.priority).sort((a, b) => a.sequence - b.sequence);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Tej IT Insights</h1>
          <p>Discover the latest trends in technology and solutions for your business.</p>
        </div>
      </section>

      <div className={styles.searchContainer}>
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
      </div>

      <section className={styles.topBlogs}>
        <h2>Featured Insights</h2>
        <div className={styles.blogGrid}>
          {topBlogs.map(blog => (
            <div key={blog.id} className={styles.blogCard}>
              <div className={styles.imageContainer}>
                <Image
                  src={blog.image || '/placeholder.jpg'}
                  alt={blog.title}
                  width={400}
                  height={250}
                  className={styles.blogImage}
                />
              </div>
              <h3><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
              <p>{blog.excerpt}</p>
              <p className={styles.meta}>Posted on: {new Date(blog.date).toLocaleDateString()}</p>
              <Link href={`/blog/${blog.slug}`} className={styles.readMore}>Read More</Link>
            </div>
          ))}
        </div>
        {topBlogs.length === 0 && <p>No featured blogs yet.</p>}
      </section>

      {additionalBlogs.length > 0 && (
        <section className={styles.additionalBlogs}>
          <h2>More Insights</h2>
          <div className={styles.blogColumn}>
            {additionalBlogs.map(blog => (
              <div key={blog.id} className={styles.blogCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={blog.image || '/placeholder.jpg'}
                    alt={blog.title}
                    width={400}
                    height={250}
                    className={styles.blogImage}
                  />
                </div>
                <h3><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
                <p>{blog.excerpt}</p>
                <p className={styles.meta}>Posted on: {new Date(blog.date).toLocaleDateString()}</p>
                <Link href={`/blog/${blog.slug}`} className={styles.readMore}>Read More</Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}