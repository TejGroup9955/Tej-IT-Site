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

  const categories = ['All', 'General', 'ERP', 'BDM', 'Payroll', 'Cloud Services'];

  const topBlogs = blogs.filter(blog => blog.priority > 0)
                        .sort((a, b) => a.sequence - b.sequence)
                        .slice(0, 3);

  const additionalBlogs = blogs.filter(blog => !blog.priority)
                               .sort((a, b) => a.sequence - b.sequence);

  return (
    <div className={styles.container}>

      {/* Hero Section - Clean Professional */}
        <section className={styles.hero}>
          <div className={styles.heroImage}>
            <Image 
              src="/blogs/blog-hero.jpg" 
              alt="Professional Hero" 
              width={500} 
              height={400} 
              style={{borderRadius: '12px'}} 
            />
          </div>
          <div className={styles.heroContent}>
            <h1>Tej IT Insights</h1>
            <p>Welcome to Tej IT Insights, your trusted source for expert analysis and actionable strategies in technology and business management. Explore the latest on ERP systems, business development, payroll, and cloud computing solutions.

            Whether you’re a business leader, IT professional, or entrepreneur, our curated articles and case studies help you make informed decisions, optimize operations, and drive innovation. Stay updated with trends, best practices, and practical guides designed to empower your team, improve efficiency, and unlock growth opportunities in today’s dynamic digital landscape.</p>
            <div className={styles.heroCTA}>
            </div>
          </div>
        </section>

      {/* Category Pills */}
      <div className={styles.categoryPills}>
        {categories.map(cat => (
          <button
            key={cat}
            className={cat === category ? 'active' : ''}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div> */}

      {/* Featured Blogs */}
      <section className={styles.topBlogs}>
        <h2>Featured Insights</h2>
        <div className={styles.blogGrid}>
          {topBlogs.length > 0 ? topBlogs.map(blog => (
            <div key={blog.id} className={styles.blogCard}>
              <div className={styles.blogCardInner}>
                {/* Front */}
                <div className={styles.blogCardFront}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={blog.image || '/placeholder.jpg'}
                      alt={blog.title}
                      width={400}
                      height={250}
                      className={styles.blogImage}
                    />
                  </div>
                  <div className={styles.tag}>{blog.category}</div>
                  <h3><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
                  <p className={styles.meta}>Posted on: {new Date(blog.date).toLocaleDateString()}</p>
                </div>
                {/* Back */}
                <div className={styles.blogCardBack}>
                  <p>{blog.excerpt}</p>
                  <Link href={`/blog/${blog.slug}`} className={styles.readMore}>Read More</Link>
                </div>
              </div>
            </div>
          )) : <p>No featured blogs yet.</p>}
        </div>
      </section>

      {/* Additional Blogs */}
      {additionalBlogs.length > 0 && (
        <section className={styles.additionalBlogs}>
          <h2>More Insights</h2>
          <div className={styles.blogColumn}>
            {additionalBlogs.map(blog => (
              <div key={blog.id} className={styles.blogCard}>
                <div className={styles.blogCardInner}>
                  {/* Front */}
                  <div className={styles.blogCardFront}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={blog.image || '/placeholder.jpg'}
                        alt={blog.title}
                        width={400}
                        height={250}
                        className={styles.blogImage}
                      />
                    </div>
                    <div className={styles.tag}>{blog.category}</div>
                    <h3><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
                    <p className={styles.meta}>Posted on: {new Date(blog.date).toLocaleDateString()}</p>
                  </div>
                  {/* Back */}
                  <div className={styles.blogCardBack}>
                    <p>{blog.excerpt}</p>
                    <Link href={`/blog/${blog.slug}`} className={styles.readMore}>Read More</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
